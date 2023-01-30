import express from "express";
import { setLabel } from "../../controllers/old/labels";

const router = express.Router()

router.post('/', setLabel);

export default router;