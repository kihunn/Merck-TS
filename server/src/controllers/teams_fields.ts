import { RequestHandler } from "express";
import prisma, { STATUS } from "../db";
import { TeamField } from "@prisma/client";

// TODO: 
// - Possibly add a route that returns all fields grouped by team.

/**
 * Given a team name (through the route params), returns (responds with) all the fields that are in use by that team.
 * @param req 
 * @param res 
 * @returns 
 */
export const getTeamsFields: RequestHandler = async (req, res) => {
    const { team } = req.params;

    const fields = await prisma.teamField.groupBy({
        by: ["name"],
        where: {
            team_name: team
        },
        _sum: {
            status: true
        },
        _max: {
            id: true
        }
    });

    if (!fields || fields.length === 0) 
        return res.status(404).json({ message: "No fields found" });

    const inUseFieldsIDs = fields.filter((group) => group._sum.status! > 0)
                                  .map((group) => group._max.id!);

    const inUseFields: TeamField[] = await prisma.teamField.findMany({
        where: {
            id: {
                in: inUseFieldsIDs
            }
        }
    });

    res.status(200).json(inUseFields);
}

/**
 * Gets a specific field from a specific team.
 * @param req 
 * @param res 
 * @returns 
 */
export const getTeamsField: RequestHandler = async (req, res) => {
    const { team, id } = req.params;

    const field = await prisma.teamField.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!field) return res.status(404).json({ message: `No field with id "${id}" was found on team "${team}"` });

    res.status(200).json(field);
}

export const createTeamsField: RequestHandler = async (req, res) => {
    const { team } = req.params;
    const { name, displayName } = req.body;

    const field = await prisma.teamField.create({
        data: {
            name,
            displayName,
            team_name: team,
            status: STATUS.CREATE
        }
    });

    res.status(201).json(field);
}

export const deleteTeamsField: RequestHandler = async (req, res) => {
    const { team, id } = req.params;

    const field = await prisma.teamField.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!field) return res.status(404).json({ message: `Unable to delete the field! No field with id "${id}" was found on team "${team}"` });

    // Deleting is essentially copying the sample we wish to delete with a status of DELETE.
    // When we go to sum the status of each sample, those with a sum of 0 will be ignored as they are inactive.
    const deletedField = await prisma.teamField.create({
        data: {
            team_name: team,
            name: field.name,
            displayName: field.displayName,
            status: STATUS.DELETE
        }
    });

    res.status(200).json(deletedField);
}

export const updateTeamsField: RequestHandler = async (req, res) => {
    const { team, id } = req.params;
    const { name, displayName } = req.body;

    const originalField = await prisma.teamField.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!originalField) return res.status(404).json({ message: `Unable to update the field! No field with id "${id}" was found on team "${team}"` });

    // When we update a field, we also have to "delete" the old one
    const deletedField = await prisma.teamField.create({
        data: {
            team_name: team,
            name: originalField.name,
            displayName: originalField.displayName,
            status: STATUS.DELETE
        }
    });

    const updatedField = await prisma.teamField.create({
        data: {
            team_name: team,
            name,
            displayName,
            status: STATUS.CREATE
        }
    });

    res.status(200).json({
        original: originalField,
        deleted: deletedField,
        updated: updatedField
    });
}