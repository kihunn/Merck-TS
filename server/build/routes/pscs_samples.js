"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pscs_samples_1 = require("../controllers/pscs_samples");
const router = express_1.default.Router();
/**
 * Returns all psamples in the database
 * @method GET
 */
router.get('/', pscs_samples_1.getPSCSSamples);
/**
 * Create a new psample that is added to the database
 *
 */
router.post('/', pscs_samples_1.createPSCSSample);
/**
 * Updates a given psample
 */
router.put('/', pscs_samples_1.updatePSCSSample);
// get /psamples/:qr_code_key
router.get('/:qr_code_key', pscs_samples_1.getPSCSSample);
exports.default = router;
