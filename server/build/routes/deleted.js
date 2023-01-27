"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deleted_1 = require("../controllers/deleted");
const router = express_1.default.Router();
router.get('/', deleted_1.getDeletedSamples);
router.get('/:team', deleted_1.getDeletedSamplesByTeam);
router.post('/', deleted_1.createDeleted);
exports.default = router;
