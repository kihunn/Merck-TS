"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const labels_1 = require("../controllers/labels");
const router = express_1.default.Router();
router.post('/', labels_1.setLabel);
exports.default = router;
