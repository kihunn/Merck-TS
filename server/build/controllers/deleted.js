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
exports.createDeleted = exports.getDeletedSamplesByTeam = exports.getDeletedSamples = void 0;
const db_1 = __importDefault(require("../db"));
/**
 * TODO:
 * [ ] getDeletedSamples() - get all deleted samples for a team (ARND or PSCS specified in req.params)
 * [ ] getDeletedSample() - based on query params, get a deleted sample
 */
/**
 *
 * @param req
 * @param res
 */
function getDeletedSamples(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const samples = yield db_1.default.deleted.findMany();
            return res.status(200).json(samples);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
exports.getDeletedSamples = getDeletedSamples;
function getDeletedSamplesByTeam(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { team } = req.params;
            const deletedQRCodeKeys = (yield db_1.default.deleted.findMany({
                where: {
                    team: team
                },
                select: {
                    qr_code_key: true
                }
            }))
                .map((_) => _.qr_code_key);
            var deletedSamples = [];
            switch (team) {
                case 'ARND':
                    deletedSamples = yield db_1.default.samples.findMany({
                        where: {
                            qr_code_key: {
                                in: deletedQRCodeKeys
                            }
                        }
                    });
                    break;
                case 'PSCS':
                    deletedSamples = yield db_1.default.psamples.findMany({
                        where: {
                            qr_code_key: {
                                in: deletedQRCodeKeys
                            }
                        }
                    });
                    break;
            }
            res.status(200).json(deletedSamples);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
exports.getDeletedSamplesByTeam = getDeletedSamplesByTeam;
function createDeleted(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleted = req.body;
        try {
            const newDeleted = yield db_1.default.deleted.create({
                data: Object.assign({}, deleted)
            });
            res.status(201).json(newDeleted);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    });
}
exports.createDeleted = createDeleted;
