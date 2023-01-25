import express from "express";
import {
    createDeleted,
    getDeletedSamples,
    getDeletedSamplesByTeam
} from "../controllers/deleted";

const router = express.Router()

router.get('/', getDeletedSamples);

router.get('/:team', getDeletedSamplesByTeam);

router.post('/', createDeleted);

export default router;