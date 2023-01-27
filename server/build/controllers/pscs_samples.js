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
exports.updatePSCSSample = exports.createPSCSSample = exports.getPSCSSample = exports.getPSCSSamples = void 0;
const db_1 = __importDefault(require("../db"));
const ksuid_1 = __importDefault(require("ksuid"));
const qr_1 = require("../brother/qr");
/**
 * Returns an array of all PSCS samples in the database
 * @param req
 * @param res
 */
function getPSCSSamples(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { deleted: queryDeleted, newest: queryNewest } = req.query;
        const deleted = queryDeleted === undefined ? false : queryDeleted === 'true';
        const newest = queryNewest === undefined ? true : queryNewest === 'true';
        // Gets every samples stored in the database
        // This will return every version of every sample, including those that have been deleted
        if (deleted && !newest) {
            const samples = yield db_1.default.psamples.findMany();
            return res.status(200).json(samples);
        }
        // This is required by the three queries below
        const deletedAuditIDs = (yield db_1.default.deleted.findMany({
            select: {
                audit_id: true
            }
        })).map((_) => _.audit_id);
        // Gets the newest smaples, including those that have been deleted
        if (deleted && newest) {
            const deletedQRCodeKeys = (yield db_1.default.deleted.findMany({
                select: {
                    qr_code_key: true
                }
            })).map((_) => _.qr_code_key);
            // Deleted samples are already the newest/most recent versions of their audit_id/audit trail.
            const deletedSamples = yield db_1.default.psamples.findMany({
                where: {
                    qr_code_key: {
                        in: deletedQRCodeKeys
                    }
                }
            });
            const groupedSamples = yield db_1.default.psamples.groupBy({
                by: ['audit_id'],
                where: {
                    audit_id: {
                        notIn: deletedAuditIDs
                    }
                },
                _max: {
                    audit_number: true
                }
            });
            const newestSamples = yield db_1.default.psamples.findMany({
                where: {
                    audit_id: {
                        in: groupedSamples.map((_) => _.audit_id)
                    },
                    audit_number: {
                        in: groupedSamples.map((_) => _._max.audit_number)
                    }
                }
            });
            return res.status(200).json([...deletedSamples, ...newestSamples]);
        }
        // Gets the newest samples that have not been deleted
        // This will be the most common type of request
        if (!deleted && newest) {
            const groupedSamples = yield db_1.default.psamples.groupBy({
                by: ['audit_id'],
                where: {
                    audit_id: {
                        notIn: deletedAuditIDs
                    }
                },
                _max: {
                    audit_number: true
                }
            });
            const samples = yield db_1.default.psamples.findMany({
                where: {
                    audit_id: {
                        in: groupedSamples.map((_) => _.audit_id)
                    },
                    audit_number: {
                        in: groupedSamples.map((_) => _._max.audit_number)
                    }
                }
            });
            return res.status(200).json(samples);
        }
        // Gets all samples that havent been deleted
        if (!deleted && !newest) {
            const samples = yield db_1.default.psamples.findMany({
                where: {
                    audit_id: {
                        notIn: deletedAuditIDs
                    }
                }
            });
            return res.status(200).json(samples);
        }
    });
}
exports.getPSCSSamples = getPSCSSamples;
/**
 * Retrieves a specific PSCS sample from the database
 * @param req params: qr_code_key - the qr_code_key of the sample to be returned
 * @param res Contains the sample with the specified qr_code_key
 * @returns
 * * 200 - The sample with the specified qr_code_key
 * * 204 - The sample with the specified qr_code_key was not found
 * * 500 - An error occurred while retrieving the sample
 */
function getPSCSSample(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { qr_code_key } = req.params;
        try {
            const sample = yield db_1.default.psamples.findUnique({
                where: {
                    qr_code_key
                }
            });
            res.status(200).json(sample);
        }
        catch (error) {
            res.status(204).json({ message: `Sample with qr_code_key ${qr_code_key} not found` });
        }
    });
}
exports.getPSCSSample = getPSCSSample;
/**
 * Creates a new PSCS sample in the database
 * @param req body: the unhashed sample information to generate a qr_code_key for and add to the database
 * @param res The newly created sample
 * @returns
 * * 201 - The sample was successfully created
 * * 500 - An error occurred while creating the sample
 */
function createPSCSSample(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sample = req.body;
        try {
            const ksuid = yield ksuid_1.default.random();
            const newSample = yield db_1.default.psamples.create({
                data: Object.assign(Object.assign({}, sample), { audit_number: ksuid.timestamp })
            });
            res.status(201).json(newSample);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
exports.createPSCSSample = createPSCSSample;
/**
 * Takes in sample information, generates the new qr_code_key, and adds it to the database.
 * * Note: This function does not actually use the update operation. It creates a new sample in the databse with the new information and returns it.
 * * This is required by merck for compliance reasons.
 * * The audit_id of updated samples is retained, but the audit_number is changed to the current KSUID timestamp.
 * * This means that the audit_id is unique, but the audit_number is not and all samples with the same audit_id are different versions of the same sample.
 * @param req The body should contain the new sample information
 * @param res The newly created sample
 */
function updatePSCSSample(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newSample = req.body;
        try {
            const unhashedNewSample = {};
            for (const key in newSample) {
                if (key != 'qr_code_key') {
                    // @ts-ignore
                    unhashedNewSample[key] = newSample[key];
                }
            }
            const ksuid = yield ksuid_1.default.random();
            // Generate a new qr_code_key based off of the contents of the new sample
            // We have to do this because the payload in req.body contains the old qr_code_key
            const newQR = (0, qr_1.generateHashKey)(unhashedNewSample);
            newSample.qr_code_key = newQR;
            const sample = yield db_1.default.psamples.create({
                data: Object.assign(Object.assign({}, newSample), { audit_id: newSample.audit_id, audit_number: ksuid.timestamp })
            });
            res.status(200).json(sample);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
exports.updatePSCSSample = updatePSCSSample;
