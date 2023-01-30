import { RequestHandler } from "express";
import prisma, { STATUS } from "../db";

export const getTeams: RequestHandler = async (req, res) => {
    const teams = await prisma.team.groupBy({
        by: ["name"],
        _sum: {
            status: true
        },
        _max: {
            id: true
        }
    });

    const activeTeamsIDs: number[] = teams.filter((team) => team._sum.status! > 0)
                                          .map((team) => team._max.id) as number[];

    const activeTeams = await prisma.team.findMany({
        where: {
            id: {
                in: activeTeamsIDs
            }
        }
    });

    res.status(200).json(activeTeams);
}

export const createTeam: RequestHandler = async (req, res) => {
    const { name } = req.body;

    const team = await prisma.team.create({
        data: {
            name,
            status: STATUS.CREATE
        }
    });

    res.status(200).json(team);
}

export const deleteTeam: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const team = await prisma.team.update({
        where: {
            id: parseInt(id)
        },
        data: {
            status: STATUS.DELETE
        }
    });

    res.status(200).json(team);
}

export const updateTeam: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const originalTeam = await prisma.team.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!originalTeam) return res.status(404).json({ message: `No team with id "${id}" was found` });

    const deletedTeam = await prisma.team.create({
        data: {
            name: originalTeam.name,
            status: STATUS.DELETE
        }
    });

    const { name } = req.body;

    const updatedTeam = await prisma.team.create({
        data: {
            name,
            status: STATUS.CREATE
        }
    });

    res.status(200).json({
        original: originalTeam,
        deleted: deletedTeam,
        updated: updatedTeam
    });
}