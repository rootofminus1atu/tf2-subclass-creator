import { Request, Response } from 'express'
import { getLoadoutsCollection } from '../database'
import { ObjectId } from 'mongodb'
import { Loadout, validateLoadout, validateLoadoutForUpdate } from '../models/loadout'
import { AppError, handleErrors } from '../errors'

import { hasPermission } from '../accessControl'


// TODO: add searching/sorting in the future
export const getLoadouts = async (req: Request, res: Response) => {
    try {
        const loadoutsCollection = getLoadoutsCollection()

        const defaultSortOrder = -1
        const defaultSortField = 'createdAt'

        const sortOrderStr = req.query.sort
        const sortOrder = sortOrderStr === 'asc' ? 1 : sortOrderStr === 'desc' ? -1 : defaultSortOrder

        const sortByStr = req.query.sortBy
        const sortBy = sortByStr === 'updated' ? 'updatedAt' : sortByStr === 'created' ? 'createdAt' : defaultSortField

        const loadouts = await loadoutsCollection.aggregate([
            { $sort: { [sortBy]: sortOrder }},
            ...loadoutPipeline,
        ]).toArray()

        res.json(loadouts)
    } catch (error) {
        handleErrors(error as Error, res)
        // res.status(500).json({ error: `Failed to get loadouts: ${error}` })
    }
}

export const getLoadoutById = async (req: Request, res: Response) => {
    try {
        const loadoutIdStr = req.params.id
        if (!ObjectId.isValid(loadoutIdStr)) {
            throw new AppError(400, 'Invalid ObjectId')
        }
        
        const loadoutsCollection = getLoadoutsCollection()
        const loadoutId = new ObjectId(loadoutIdStr)

        const pipeline = [
            { $match: { _id: loadoutId } },
            ...loadoutPipeline
        ]

        const loadout = await loadoutsCollection.aggregate(pipeline).next()

        if (!loadout) {
            throw new AppError(404, 'Loadout not found')
        }

        res.json(loadout)
    } catch (error) {
        handleErrors(error as Error, res)
    }
}

export const createLoadout = async (req: Request, res: Response) => {
    try {
        const loadoutsCollection = getLoadoutsCollection()
        const loadout: Loadout = req.body

        const userId = req.auth?.payload.sub
        if (!userId) {
            throw new AppError(401, 'Unauthorized')
        }

        const result = await validateLoadout(loadout)
        console.log(result)
        if (!result.value) {
            throw new AppError(400, 'Invalid Loadout', result.error)
        }

        const okLoadout = result.value
        loadout.userId = userId
        okLoadout.createdAt = new Date()
        okLoadout.updatedAt = new Date()

        const insertionResult = await loadoutsCollection.insertOne(okLoadout)

        res.status(201).json({ _id: insertionResult.insertedId, ...loadout })
    } catch (error) {
        handleErrors(error as Error, res)
    }
}

export const updateLoadout = async (req: Request, res: Response) => {
    try {
        const loadoutIdStr = req.params.id;
        if (!ObjectId.isValid(loadoutIdStr)) {
            throw new AppError(400, 'Invalid ObjectId')
        }

        const loadoutsCollection = getLoadoutsCollection()
        const loadoutId = new ObjectId(req.params.id)

        const loadoutToUpdate = await loadoutsCollection.findOne({ _id: loadoutId })
        if (!loadoutToUpdate) {
            throw new AppError(404, 'Loadout not found');
        }

        const userId = req.auth?.payload.sub
        if (!userId) {
            throw new AppError(401, 'Unauthorized');
        }

        if (!hasPermission({ id: userId }, 'loadouts', 'update', loadoutToUpdate)) {
            throw new AppError(403, 'Forbidden');
        }

        const partialLoadout: Partial<Loadout> = req.body

        const result = await validateLoadoutForUpdate(partialLoadout)
        if (!result.value) {
            throw new AppError(400, 'Invalid Loadout', result.error)
        }
        const okLoadout = result.value
        partialLoadout.updatedAt = new Date()

        const updateResult = await loadoutsCollection.updateOne({ _id: loadoutId }, { $set: okLoadout })

        if (updateResult.matchedCount === 0) {
            throw new AppError(404, 'Loadout not found')
        }

        if (updateResult.modifiedCount === 0) {
            // idk if this is a good idea as a 304 is not really an error
            throw new AppError(304, 'Loadout not modified')
            // res.status(304).json({ message: 'Loadout not modified' })
            // return
        }

        res.json({ message: 'Loadout updated successfully' })
    } catch (error) {
        handleErrors(error as Error, res)
    }
}

export const deleteLoadout = async (req: Request, res: Response) => {
    try {
        const loadoutIdStr = req.params.id;
        if (!ObjectId.isValid(loadoutIdStr)) {
            throw new AppError(400, 'Invalid ObjectId')
        }

        const loadoutsCollection = getLoadoutsCollection()
        const loadoutId = new ObjectId(req.params.id)

        const loadoutToDelete = await loadoutsCollection.findOne({ _id: loadoutId })
        if (!loadoutToDelete) {
            throw new AppError(404, 'Loadout not found');
        }

        
        const userId = req.auth?.payload.sub
        console.log('THE USERID', userId, 'H')
        if (!userId) {
            throw new AppError(401, 'Unauthorized');
        }

        if (!hasPermission({ id: userId }, 'loadouts', 'update', loadoutToDelete)) {
            throw new AppError(403, 'Forbidden');
        }

        const result = await loadoutsCollection.deleteOne({ _id: loadoutId })

        if (result.deletedCount === 0) {
            throw new AppError(404, 'Loadout not found')
        }

        res.json({ message: 'Loadout deleted successfully' })
    } catch (error) {
        handleErrors(error as Error, res)
    }
}

const loadoutPipeline = [
    {
        $lookup: {
            from: 'weapons',
            localField: 'primary',
            foreignField: '_id',
            as: 'primaryWeapon'
        }
    },
    {
        $lookup: {
            from: 'weapons',
            localField: 'secondary',
            foreignField: '_id',
            as: 'secondaryWeapon'
        }
    },
    {
        $lookup: {
            from: 'weapons',
            localField: 'melee',
            foreignField: '_id',
            as: 'meleeWeapon'
        }
    },
    {
        $unwind: {
            path: '$primaryWeapon',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$secondaryWeapon',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$meleeWeapon',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            _id: 1,
            merc: 1,
            name: 1,
            playstyle: 1,
            userId: 1,
            primary: '$primaryWeapon',
            secondary: '$secondaryWeapon',
            melee: '$meleeWeapon'
        }
    }
]