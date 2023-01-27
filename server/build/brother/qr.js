"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLayoutLabel = exports.generateQRImage = exports.generateHashKey = void 0;
const db_1 = __importDefault(require("../db"));
const qrcode_1 = __importDefault(require("qrcode"));
const jimp_1 = __importDefault(require("jimp"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
function generateHashKey(sample) {
    return (((0, crypto_1.createHash)('sha256').update(JSON.stringify(sample)).digest('hex')).substring(0, 8));
}
exports.generateHashKey = generateHashKey;
/**
 * Generates a hash key from the given sample, then generates a QR code from that hash key and feeds that to Jimp to generate the QR Image
 * @param sample
 * @returns
 */
function generateQRImage(sample) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashKey = sample.qr_code_key ? sample.qr_code_key : generateHashKey(sample);
        const qrcode = yield qrcode_1.default.toBuffer(hashKey, { type: 'png', margin: 0, errorCorrectionLevel: 'H' });
        return yield jimp_1.default.read(qrcode);
    });
}
exports.generateQRImage = generateQRImage;
function generateLayoutLabel(sample, team) {
    return __awaiter(this, void 0, void 0, function* () {
        const layouts = yield db_1.default.labels.findMany({
            where: {
                team,
            },
            orderBy: [{
                    id: 'desc'
                }],
            take: 1
        });
        if (layouts.length === 0)
            throw new Error('No layout found for team ' + team);
        const { entities, labelSize } = layouts[0].data;
        const dpiFactor = 96 / 25.4;
        const width = labelSize.length * dpiFactor;
        const height = labelSize.width * dpiFactor;
        var qrImage = yield generateQRImage(sample);
        var whiteLabel = (yield jimp_1.default.read(path_1.default.join(__dirname, './assets/white_image.jpeg'))).resize(width, height);
        for (const entity of entities) {
            var text = entity.text;
            const matched = text.match(/{(\w+)}/);
            if (matched !== null && matched.length > 0) {
                const key = matched[1];
                // @ts-ignore
                text = text.replace(matched[0], sample[key]);
            }
            // This is a for the qr code
            if (entity.size !== undefined) {
                qrImage = qrImage.resize(entity.size, entity.size);
                whiteLabel.composite(qrImage, entity.position.x, entity.position.y);
            }
            else {
                var fontURL = '';
                switch (entity.fontSizePX) {
                    case 32:
                        fontURL = jimp_1.default.FONT_SANS_32_BLACK;
                        break;
                    case 24:
                        fontURL = path_1.default.join(__dirname, './assets/fonts/basic_24_black/basic_24_black.fnt');
                        break;
                    case 16:
                        fontURL = jimp_1.default.FONT_SANS_16_BLACK;
                        break;
                }
                const font = yield jimp_1.default.loadFont(fontURL);
                whiteLabel.print(font, entity.position.x, entity.position.y, text);
            }
        }
        // Can be used to save the generate image for testing purposes
        // await whiteLabel.writeAsync(path.join(__dirname, `./assets/${team}_label.png`));
        return whiteLabel;
    });
}
exports.generateLayoutLabel = generateLayoutLabel;
/**
 * *------------------------------------------------------------------*
 * * Below here is the old code for generating the labels             *
 * * Reasons why it is no longer used:                                *
 * *   - It is not modular/scalable                                   *
 * *   - It only worked for the ARND teams                            *
 * *------------------------------------------------------------------*
 */
// import prisma from "../db";
// import QRCode from 'qrcode';
// import path from 'path'
// import Jimp from 'jimp'
// import { Font } from "@jimp/plugin-print";
// import { createHash } from "crypto";
// interface Vec2 {
//     x: number;
//     y: number;
// }
// interface Dim {
//     width: number;
//     height: number;
// }
// type Fonts = {
//     BLACK_32: Font,
//     BLACK_24: Font,
//     BLACK_16: Font,
//     BLACK_32_BOLD: Font,
//     BLACK_24_BOLD: Font,
//     BLACK_16_BOLD: Font,
//     JIMP_BLACK_32: Font,
//     JIMP_BLACK_16: Font
// }
// type FontName = keyof Fonts;
// type LabelOptions = {
//     margin: number;
//     horizontalTextPadding: number;
//     verticalTextPadding: number;
//     fonts: {
//         largeFont: FontName,
//         boldLargeFont?: FontName,
//         mediumFont: FontName,
//         boldMediumFont?: FontName,
//         smallFont: FontName,
//         boldSmallFont?: FontName
//     };
// } & Dim
// Current size is same as it is on merck github
// const LargeLabelOptions: LabelOptions = {
//     width: 696,
//     height: 223,
//     margin: 40,
//     verticalTextPadding: 5,
//     horizontalTextPadding: 20,
//     fonts: {
//         largeFont: 'BLACK_32',
//         boldLargeFont: 'BLACK_32_BOLD',
//         mediumFont: 'BLACK_24',
//         boldMediumFont: 'BLACK_24_BOLD',
//         smallFont: 'BLACK_16',
//         boldSmallFont: 'BLACK_16_BOLD'
//     }
// }
// async function loadFonts(): Promise<Fonts> {
//     return {
//         BLACK_32: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_32_black/basic_32_black.fnt'))),
//         BLACK_24: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_24_black/basic_24_black.fnt'))),
//         BLACK_16: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_16_black/basic_16_black.fnt'))),
//         BLACK_32_BOLD: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_32_black_bold/basic_32_black_bold.fnt'))),
//         BLACK_24_BOLD: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_24_black_bold/basic_24_black_bold.fnt'))),
//         BLACK_16_BOLD: (await Jimp.loadFont(path.join(__dirname, './assets/fonts/basic_16_black_bold/basic_16_black_bold.fnt'))),
//         JIMP_BLACK_32: (await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)),
//         JIMP_BLACK_16: (await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK))
//     }
// }
// /**
//  * Generates a label for the ARND team
//  */
// var FONTS: Fonts;
// export async function generateLabel(sample: Sample, options: LabelOptions = LargeLabelOptions): Promise<Jimp> {
//     if (!FONTS) FONTS = await loadFonts();
//     var qrImage = await generateQRImage(sample);
//     var whiteLabel = (await Jimp.read(path.join(__dirname, './assets/white_image.jpeg'))).resize(options.width, options.height);
//     var merckSquare = (await Jimp.read(path.join(__dirname, './assets/merck_color_square.png'))).resize(options.width, options.margin / 2);
//     const smallestDim = options.width >= options.height ? options.height : options.width;
//     // Ensures QR will fit within label with given margin
//     qrImage.resize(smallestDim - (2 * options.margin), smallestDim - (2 * options.margin))
//     // qrImage is a square so width=height
//     const side = qrImage.getWidth()
//     const qrPos: Vec2 = {
//         x: (options.width - side - options.margin),
//         y: (options.height - side - options.margin)
//     }
//     whiteLabel.composite(qrImage, qrPos.x, qrPos.y)
//     whiteLabel.composite(merckSquare, 0, options.height - options.margin / 2)
//     var curTextPos: Vec2 = {
//         x: options.margin,
//         y: options.margin
//     }
//     const maxTextDim: Dim = {
//         width: qrPos.x - (2 * options.margin),
//         height: options.height - (2 * options.margin)
//     }
//     const textYIncrement = FONTS[options.fonts.largeFont].common.lineHeight + options.verticalTextPadding;
//     whiteLabel.print(FONTS[options.fonts.largeFont], curTextPos.x, curTextPos.y, `Experiment ID: ${sample.experiment_id}`, maxTextDim.width)
//     curTextPos.y += textYIncrement
//     const contentsText = `Contents: ${sample.contents}`
//     whiteLabel.print(FONTS[options.fonts.largeFont], curTextPos.x, curTextPos.y, contentsText, maxTextDim.width)
//     Jimp.measureText(FONTS[options.fonts.largeFont], contentsText) > maxTextDim.width ? curTextPos.y += textYIncrement : null;
//     curTextPos.y += textYIncrement
//     const prepDateText = `Prep: ${sample.date_entered}`
//     whiteLabel.print(FONTS[options.fonts.mediumFont], curTextPos.x, curTextPos.y, prepDateText, maxTextDim.width)
//     curTextPos.x += Jimp.measureText(FONTS[options.fonts.mediumFont], prepDateText) + options.horizontalTextPadding
//     const expiryDateText = `Expiry: ${sample.expiration_date}`
//     whiteLabel.print(FONTS[options.fonts.mediumFont], curTextPos.x, curTextPos.y, expiryDateText, maxTextDim.width)
//     curTextPos.x = options.margin
//     curTextPos.y += textYIncrement
//     const analystText = `Analyst: ${sample.analyst}`
//     whiteLabel.print(FONTS[options.fonts.smallFont], curTextPos.x, curTextPos.y, analystText, maxTextDim.width)
//     curTextPos.x += Jimp.measureText(FONTS[options.fonts.smallFont], analystText) + options.horizontalTextPadding
//     const storageText = `Storage: ${sample.storage_condition}`
//     whiteLabel.print(FONTS[options.fonts.smallFont], curTextPos.x, curTextPos.y, storageText, maxTextDim.width)
//     // await whiteLabel.writeAsync(path.join(__dirname, './assets/label.png'))
//     return whiteLabel
// }
