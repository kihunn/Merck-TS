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
exports.setLabel = void 0;
const ksuid_1 = __importDefault(require("ksuid"));
const db_1 = __importDefault(require("../db"));
function setLabel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { information, team } = req.body;
        const ksuid = yield ksuid_1.default.random();
        var result = null;
        try {
            result = yield db_1.default.labels.create({
                data: {
                    id: ksuid.timestamp,
                    team,
                    data: information,
                }
            });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
exports.setLabel = setLabel;
