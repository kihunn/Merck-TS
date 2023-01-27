"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const arnd_samples_1 = require("../controllers/arnd_samples");
const router = express_1.default.Router();
/**
 * Returns all samples in the database
 * @method GET
 * @query
 * * ?deleted=true - returns all samples, including those that have been deleted
 * * ?deleted=false - returns all samples, excluding those that have been deleted
 * * ?newest=true - returns the newest sample for each audit_id
 * * ?newest=false - returns all samples
 */
router.get('/', arnd_samples_1.getARNDSamples);
/**
 * Create a new sample that is added to the database
 *
 */
router.post('/', arnd_samples_1.createARNDSample);
/**
 * Updates a given sample
 */
router.put('/', arnd_samples_1.updateARNDSample);
// get /samples/:qr_code_key
router.get('/:qr_code_key', arnd_samples_1.getARNDSample);
exports.default = router;
