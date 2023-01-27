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
exports.printQRCodeLabel = exports.getPrinters = exports.createQRCodeLabel = exports.createQRCodeKey = void 0;
const qr_1 = require("../brother/qr");
const print_1 = require("../brother/print");
const db_1 = __importDefault(require("../db"));
const labelCache = {};
function createQRCodeKey(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sample = req.body;
        try {
            const hashKey = (0, qr_1.generateHashKey)(sample);
            res.status(201).json({ qr_code_key: hashKey });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
exports.createQRCodeKey = createQRCodeKey;
function createQRCodeLabel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sample = req.body;
        const { team } = req.params;
        try {
            if (labelCache[sample.qr_code_key]) {
                res.status(201).json({ qr_code_image: labelCache[sample.qr_code_key] });
            }
            else {
                // This generates the hard coded label that looks good right now
                // const labelImage = await generateLabel(sample)
                const labelImage = yield (0, qr_1.generateLayoutLabel)(sample, team);
                const buffer = yield labelImage.getBufferAsync('image/png');
                const base64 = buffer.toString('base64');
                labelCache[sample.qr_code_key] = base64;
                res.status(201).json({ qr_code_image: base64 });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
exports.createQRCodeLabel = createQRCodeLabel;
function printQRCodeLabel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        const base64labels = data.base64labels;
        const printer = data.printer;
        try {
            const success = yield (0, print_1.printLabels)(base64labels, printer);
            res.status(200).json({ success });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
exports.printQRCodeLabel = printQRCodeLabel;
function getPrinters(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const printers = yield db_1.default.printers.findMany();
        res.status(200).json(printers);
    });
}
exports.getPrinters = getPrinters;
