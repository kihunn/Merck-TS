"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qr_1 = require("../controllers/qr");
const router = express_1.default.Router();
router.post('/key', qr_1.createQRCodeKey);
router.post('/label/:team', qr_1.createQRCodeLabel);
router.post('/print', qr_1.printQRCodeLabel);
router.get('/printers', qr_1.getPrinters);
exports.default = router;
