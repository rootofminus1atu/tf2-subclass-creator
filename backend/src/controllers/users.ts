import { Request, Response } from 'express'
import axios from 'axios'
import { AppError, handleErrors } from '../errors'

async function getManagementToken(): Promise<string> {
    const response = await axios.post(
        'https://dev-fg28cspzvpoubaeb.us.auth0.com/oauth/token',
        {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: 'https://dev-fg28cspzvpoubaeb.us.auth0.com/api/v2/',
            grant_type: 'client_credentials'
        }
    )
    return response.data.access_token
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        // Check if user has admin role
        console.log(req.auth?.payload)
        const roles = req.auth?.payload['https://tf2scapi/roles'] as string[] || []
        console.log('roles:', roles)
        if (!roles.includes('admin')) {
            throw new AppError(403, 'Admin access required')
        }

        const token = await getManagementToken()
        const response = await axios.get(
            'https://dev-fg28cspzvpoubaeb.us.auth0.com/api/v2/users',
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )

        res.json(response.data)
    } catch (error) {
        handleErrors(error as Error, res)
    }
}