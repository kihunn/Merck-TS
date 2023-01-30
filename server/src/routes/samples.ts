import express from "express";
import { 
    createSample, 
    deleteSample, 
    getSamples,
    getSample
} from "../controllers/samples";

/**
 * * Base route: /:team/samples
 */
const router = express.Router({
    // Allows us to acces the team parameter from the controllers below
    mergeParams: true
});

router.post("/", createSample);

router.get("/", getSamples);
router.get("/:id", getSample)

router.delete("/:id", deleteSample);

export default router;