import Jimp from "jimp";

export type BrotherQLMediaType = "DieCut" | "Continuous";

export interface BrotherQLMediaInfo {
    width: number;
    length: number;
    type: BrotherQLMediaType;
}

export interface BrotherQLRasterOptions {
    media: BrotherQLMediaInfo;
    image: Jimp;
    prioritizeQuality?: boolean;
    dpi600?: boolean;
    twoColorPrinting?: boolean;
    autocut?: boolean;
    cutAtEnd?: boolean;
    cutEvery?: number;
    compression?: boolean;
}

const DefaultOptionals: Required<Omit<BrotherQLRasterOptions, "media" | "image">> = {
    prioritizeQuality: false,
    dpi600: false,
    twoColorPrinting: false,
    autocut: true,
    cutAtEnd: true,
    cutEvery: 1,
    compression: false
};

const join = (obj: BrotherQLRasterOptions, defaults: Required<Omit<BrotherQLRasterOptions, "media" | "image">>): Required<BrotherQLRasterOptions> => {
    return Object.assign({}, defaults, obj);
}

const int = (bool: boolean): number => {
    return bool ? 1 : 0;
}

export class BrotherQLRaster {

    private chunks: Buffer[];
    private options: Required<BrotherQLRasterOptions>;

    constructor(options: BrotherQLRasterOptions) {
        this.options = join(options, DefaultOptionals);
        console.log(this.options);
        this.chunks = [];
    }

    public addInvalidate(): BrotherQLRaster {
        this.chunks.push(Buffer.alloc(400));
        return this;
    }

    public addInitialize(): BrotherQLRaster {
        this.chunks.push(Buffer.from([0x1b, 0x40]));
        return this;
    }

    public switchToRasterMode(): BrotherQLRaster {
        this.chunks.push(Buffer.from([0x1b, 0x69, 0x61, 0x01]));
        return this;
    }

    public sendAutomaticStatusNotification(notify: boolean = false): BrotherQLRaster {
        // normally false = notify, true = don't notify so we invert it
        // this.chunks.push(Buffer.from([0x1b, 0x69, 0x21, int(!notify)]));
        this.chunks.push(Buffer.from([0x1b, 0x69, 0x21, 0x01]));
        return this;
    }

    public addMediaTypeAndQuality(media?: BrotherQLMediaInfo, prioritizeQuality?: boolean): BrotherQLRaster {
        var validFlags = 0x80;

        const _media = media ?? this.options.media;
        const _prioritizeQuality = prioritizeQuality || this.options.prioritizeQuality;
        
        validFlags |= int(_media.type !== undefined) << 1;
        validFlags |= int(_media.width !== undefined) << 2;
        validFlags |= int(_media.length !== undefined) << 3;
        validFlags |= int(_prioritizeQuality && !this.options.twoColorPrinting) << 6;

        this.chunks.push(Buffer.from([
            0x1, 0x69, 0x7a,
            validFlags,
            _media.type === "DieCut" ? 0x0b : 0x0a,
            _media.width ?? 0, _media.length ?? 0,
            0x00, 0xdf, 0x03, 0x00,
            0x00, 0x00, 0x00
        ]));
        return this;
    }

    public addAutoCut(autocut?: boolean, cutEvery?: number): BrotherQLRaster {
        const _autocut = autocut ?? this.options.autocut;
        const _cutEvery: number = cutEvery ?? this.options.cutEvery;
        // specify autocut
        this.chunks.push(Buffer.from([0x1b, 0x69, 0x4d, int(_autocut) << 6]));
        // specify cut each n labels
        this.chunks.push(Buffer.from([0x1b, 0x69, 0x41, cutEvery!]));
        return this;
    }

    public addTwoColorPrintingCutAtEndHighResolution(twoColor?: boolean, cutAtEnd?: boolean, highRes?: boolean): BrotherQLRaster {
        const _twoColor = twoColor ?? this.options.twoColorPrinting;
        const _cutAtEnd = cutAtEnd ?? this.options.cutAtEnd;
        const _highRes = highRes ?? this.options.dpi600;
        this.chunks.push(Buffer.from([
            0x1b, 0x69, 0x4b, 
            int(_twoColor && !this.options.prioritizeQuality) << 0 | int(_cutAtEnd) << 3 | int(_highRes) << 6
        ]));
        return this;
    }

    public addMargins(n1?: number, n2?: number): BrotherQLRaster {
        this.chunks.push(Buffer.from([0x1b, 0x69, 0x64, n1 ?? 0, n2 ?? 0]));
        return this;
    }

    public addCompression(compression?: boolean): BrotherQLRaster {
        const _compression = compression ?? this.options.compression;
        this.chunks.push(Buffer.from([0x4d, _compression ? 0x02 : 0x00]));
        return this;
    }

    public addRasterData(image?: Jimp): BrotherQLRaster {
        const _image = image ?? this.options.image;

        const labelLength = this.options.media.length;
        const labelWidth = this.options.media.width;

        _image.resize(labelLength * 11, labelLength * 11 / 3.125);
        _image.greyscale().contrast(1)  
        _image.rotate(90);

        const bufferSize = labelLength + 3;

        for (let y = 0; y < _image.bitmap.height; y++) {
            let row = Buffer.alloc(bufferSize);
            row[0] = 0x67;
            row[1] = 0x00;
            row[2] = labelLength;
            for (let x = 0; x < _image.bitmap.width; x++) {
                if (_image.getPixelColor(x, y) == 255) {
                    let byteNum = labelLength - Math.floor((x / 8) + 3);
                    let bitOffset = x % 8;
                    row[byteNum - Math.floor((labelWidth / 2) * (labelWidth / labelLength))] |= 1 << bitOffset;
                }
            }
            if (this.options.compression) {
                // use TIFF (pack bits) compression on the row
            }
            this.chunks.push(row);
        }

        return this;
    }

    public addEndRaster(): BrotherQLRaster {
        this.chunks.push(Buffer.from([0x1a]));
        return this;
    }

    public addAll() {
        this.addInvalidate()
            .addInitialize()
            .switchToRasterMode()
            .sendAutomaticStatusNotification()
            .addMediaTypeAndQuality()
            .addAutoCut()
            .addTwoColorPrintingCutAtEndHighResolution()
            .addMargins()
            .addCompression()
            .addRasterData()
            .addEndRaster();
        return this;
    }

    public buildBuffer(): Buffer {
        return Buffer.concat(this.chunks);
    }
    
}

export class Raster {

    public readonly data: Buffer[] = [];

    constructor() { }

    private rotateMatrixImage(bwMatrixImage: number[][], width: number, height: number) {
        let rows = [];
        for (let x = 0; x < width; x++) {
            let cols = [];
            for (let y = height - 1; y >= 0; y--) {
                cols.push(bwMatrixImage[y][x]);
            }
            rows.push(cols);
        }
    
        // noinspection JSSuspiciousNameCombination
        return {
            'height': width,
            'width': height,
            data: rows
        };
    }

    public addInvalidate() { this.data.push(Buffer.alloc(400)) }
    public addInitialize() { this.data.push(Buffer.from([0x1b, 0x40])) }
    public addSwitchMode() { this.data.push(Buffer.from([0x1b, 0x69, 0x61, 0x01])) }
    public addStatusNotification() { this.data.push(Buffer.from([0x1b, 0x69, 0x21, 0x00])) }
    public addMediaType(width: number = /*29*/62, length: number = /*90*/100, dieCut: boolean = true) { 
        this.data.push(
            Buffer.from([0x1b, 0x69, 0x7a, 0x8e, dieCut ? 0x0b : 0x0a, width, dieCut ? length : 0x00, 0xdf, 0x03, 0x00, 0x00, 0x00, 0x00])
        ) 
    }
    public addAutoCut() { this.data.push(Buffer.from([0x1b, 0x69, 0x4d, 1 << 6])); }
    public cutEach(n: number = 1) { this.data.push(Buffer.from([0x1b, 0x69, 0x41, n])) }
    public addExpandedMode() { this.data.push(Buffer.from([0x1b, 0x69, 0x4b, 1 << 3])); }
    public addCutAtEnd() { this.data.push(Buffer.from([0x1b, 0x69, 0x4b, 0x08])); }
    public addMargins() { this.data.push(Buffer.from([0x1b, 0x69, 0x64, 0x00, 0x00])); }
    public addCompression() { this.data.push(Buffer.from([0x4d, 0x00])) }
    public async addPrintData(img: Jimp): Promise<void> {
        const labelLength = 100;
        const labelWidth = 62;

        img.resize(labelLength * 11, labelLength * 11 / 3.125);
        img.greyscale().contrast(1)  
        img.rotate(90);

        // const labelWidth = 29;
        const bufferSize = labelLength + 3;

        for (let y = 0; y < img.bitmap.height; y++) {
            let row = Buffer.alloc(bufferSize);
            row[0] = 0x67;
            row[1] = 0x00;
            row[2] = labelLength;
            for (let x = 0; x < img.bitmap.width; x++) {
                if (img.getPixelColor(x, y) == 255) {
                    let byteNum = labelLength - Math.floor((x / 8) + 3);
                    let bitOffset = x % 8;
                    row[byteNum - Math.floor((labelWidth / 2) * (labelWidth / labelLength))] |= 1 << bitOffset;
                }
            }
            this.data.push(row);
        }
            // for (let y = 0; y < img.bitmap.height; y++) {
            //     // Raster line
            //     let row = Buffer.alloc(bufferSize);
            //     // Raster command?
            //     row[0] = 0x67;
            //     row[1] = 0x00;
            //     row[2] = labelWidth;
            //     for (let x = 0; x < img.bitmap.width; x++) {
            //         if (img.getPixelColor(x, y) == 255) {
            //             let byteNum = bufferSize - Math.floor((x / 8) + 3);
            //             let bitOffset = x % 8;
            //             row[byteNum] |= 1 << bitOffset;
            //         }
            //     }
            //     console.log(row)
            //     this.data.push(row);
            // }

    }
    public addEndLabel() { this.data.push(Buffer.from([0x1A])) }

    public addAll(): void {
        this.addInvalidate();
        this.addInitialize();
        this.addSwitchMode();
        this.addStatusNotification();
        this.addMediaType(/*29*/62, /*90*/100, true);
        this.addAutoCut();
        this.cutEach(1);
        this.addExpandedMode();
        this.addCutAtEnd();
        this.addMargins();
        this.addCompression();
    }

    public get() { 
        this.addEndLabel();
        return Buffer.concat(this.data); 
    }

}