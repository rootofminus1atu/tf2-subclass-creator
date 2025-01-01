import { Response } from "express"

export class AppError extends Error {
    statusCode: number
    details?: any

    constructor(statusCode: number, message: string, details: any = undefined) {
        super(message)
        this.statusCode = statusCode
        this.details = details
        Object.setPrototypeOf(this, AppError.prototype)
    }
}

export const handleErrors = (err: Error, res: Response) => {
    console.error(err)
    
    if (err.name === 'UnauthorizedError') {
        err = new AppError(401, "Unauthorized")
    } 

    if ('statusCode' in err) {
        const error = err as AppError
        const details = error.details
        console.error(err.statusCode, ' - ', err.message, '\n', details)
        res.status(error.statusCode).json({ error: error.message, details })
    } else {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}