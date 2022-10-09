import { Sample } from "../db";
import { createHash } from "crypto";
import QRCode from 'qrcode';
import Jimp from 'jimp'
import { Font } from "@jimp/plugin-print";

import path from 'path'

export function generateHashKey(sample: Omit<Sample, 'qr_code_key'>) {
    return ((createHash('sha256').update(JSON.stringify(sample)).digest('hex')).substring(0, 8));
}

interface Vec2 {
    x: number;
    y: number;
}

interface Dim {
    width: number;
    height: number;
}

type Fonts = {
    BLACK_32: Font,
    BLACK_24: Font,
    BLACK_16: Font,
    BLACK_32_BOLD: Font,
    BLACK_24_BOLD: Font,
    BLACK_16_BOLD: Font,
    JIMP_BLACK_32: Font,
    JIMP_BLACK_16: Font
}

type FontName = keyof Fonts;

type LabelOptions = {
    margin: number;
    horizontalTextPadding: number;
    verticalTextPadding: number;
    fonts: {
        largeFont: FontName,
        boldLargeFont?: FontName,
        mediumFont: FontName,
        boldMediumFont?: FontName,
        smallFont: FontName,
        boldSmallFont?: FontName
    };
} & Dim

// Current size is same as it is on merck github
const LargeLabelOptions: LabelOptions = {
    width: 696,
    height: 223,
    margin: 40,
    verticalTextPadding: 5,
    horizontalTextPadding: 20,
    fonts: {
        largeFont: 'BLACK_32',
        boldLargeFont: 'BLACK_32_BOLD',
        mediumFont: 'BLACK_24',
        boldMediumFont: 'BLACK_24_BOLD',
        smallFont: 'BLACK_16',
        boldSmallFont: 'BLACK_16_BOLD'
    }
}

async function loadFonts(): Promise<Fonts> {
    return {
        BLACK_32: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_32_black/basic_32_black.fnt'))),
        BLACK_24: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_24_black/basic_24_black.fnt'))),
        BLACK_16: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_16_black/basic_16_black.fnt'))),
        BLACK_32_BOLD: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_32_black_bold/basic_32_black_bold.fnt'))),
        BLACK_24_BOLD:(await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_24_black_bold/basic_24_black_bold.fnt'))),
        BLACK_16_BOLD: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_16_black_bold/basic_16_black_bold.fnt'))),
        JIMP_BLACK_32: (await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)),
        JIMP_BLACK_16: (await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK))
    }
}

/**
 * Generates a hash key from the given sample, then generates a QR code from that hash key and feeds that to Jimp to generate the QR Image
 * @param sample 
 * @returns 
 */
export async function generateQRImage(sample: Omit<Sample, 'qr_code_key'>): Promise<Jimp> {
    const hashKey = generateHashKey(sample);
    const qrcode = await QRCode.toBuffer(hashKey, { type: 'png', margin: 0, errorCorrectionLevel: 'H' })
    return await Jimp.read(qrcode)
}

var FONTS: Fonts;
export async function generateLabel(sample: Omit<Sample, 'qr_code_key'>, options: LabelOptions = LargeLabelOptions): Promise<Jimp> {
    if (!FONTS) FONTS = await loadFonts();
    var qrImage = await generateQRImage(sample);
    var whiteLabel = (await Jimp.read(path.join(__dirname, './assets/white_image.jpeg'))).resize(options.width, options.height);
    var merckSquare = (await Jimp.read(path.join(__dirname, './assets/merck_color_square.png'))).resize(options.width, options.margin/2);

    const smallestDim = options.width >= options.height ? options.height : options.width;
    
    // Ensures QR will fit within label with given margin
    qrImage.resize(smallestDim - (2 * options.margin), smallestDim - (2 * options.margin))
    
    // qrImage is a square so width=height
    const side = qrImage.getWidth()
    const qrPos: Vec2 = {
        x: (options.width - side - options.margin),
        y: (options.height - side - options.margin)
    }
    whiteLabel.composite(qrImage, qrPos.x, qrPos.y)

    whiteLabel.composite(merckSquare, 0, options.height - options.margin/2)

    var curTextPos: Vec2 = {
        x: options.margin,
        y: options.margin
    }

    const maxTextDim: Dim = {
        width: qrPos.x - (2 * options.margin),
        height: options.height - (2 * options.margin)
    }

    const textYIncrement = FONTS[options.fonts.largeFont].common.lineHeight + options.verticalTextPadding;

    whiteLabel.print(FONTS[options.fonts.largeFont], curTextPos.x, curTextPos.y, `Experiment ID: ${sample.expirement_id}`, maxTextDim.width)
    curTextPos.y += textYIncrement

    whiteLabel.print(FONTS[options.fonts.largeFont], curTextPos.x, curTextPos.y, `Contents: ${sample.contents}`, maxTextDim.width)
    curTextPos.y += textYIncrement

    const prepDateText = `Prep: ${sample.date_entered}`
    whiteLabel.print(FONTS[options.fonts.mediumFont], curTextPos.x, curTextPos.y, prepDateText, maxTextDim.width)
    curTextPos.x += Jimp.measureText(FONTS[options.fonts.mediumFont], prepDateText) + options.horizontalTextPadding

    const expiryDateText = `Expiry: ${sample.expiration_date}`
    whiteLabel.print(FONTS[options.fonts.mediumFont], curTextPos.x, curTextPos.y, expiryDateText, maxTextDim.width)
    curTextPos.x = options.margin
    curTextPos.y += textYIncrement

    const analystText = `Analyst: ${sample.analyst}`
    whiteLabel.print(FONTS[options.fonts.smallFont], curTextPos.x, curTextPos.y, analystText, maxTextDim.width)
    curTextPos.x += Jimp.measureText(FONTS[options.fonts.smallFont], analystText) + options.horizontalTextPadding

    const storageText = `Storage: ${sample.storage_condition}`
    whiteLabel.print(FONTS[options.fonts.smallFont], curTextPos.x, curTextPos.y, storageText, maxTextDim.width)

    return whiteLabel
}


