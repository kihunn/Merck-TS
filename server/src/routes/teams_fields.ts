import express from "express";
import {
    createTeamsField,
    deleteTeamsField,
    getTeamsField,
    getTeamsFields, 
    updateTeamsField
} from "../controllers/teams_fields";

/**
 * * Base route: /:team/fields
 */
const router = express.Router({
    mergeParams: true
});

router.get('/', getTeamsFields);

router.get('/:id', getTeamsField);

router.post('/', createTeamsField);

router.delete('/:id', deleteTeamsField);

router.patch('/:id', updateTeamsField);

export default router;