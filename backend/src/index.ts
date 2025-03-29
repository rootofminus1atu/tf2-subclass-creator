import express, {Application, NextFunction, Request, Response, Router} from "express" 
import morgan from "morgan"
import weaponsRouter from './routes/weapons'
import loadoutsRouter from './routes/loadouts'
import usersRouter from './routes/users'
import { connectToDb } from "./database"
import cors from 'cors'
import dotenv from "dotenv"
import { jwtCheck } from "./accessControl"
import { handleErrors } from "./errors"

dotenv.config()

const PORT = process.env.PORT || 3000

const app: Application = express()

app.use(morgan("tiny"))
app.use(express.json())
app.use(cors())

app.get("/ping", async (req : Request, res: Response) => {
    res.send({ message: "hi" })
})

const apiRouter = Router()
    .use('/weapons', weaponsRouter)
    .use('/loadouts', loadoutsRouter)
    .use('/users', usersRouter)

app.use('/api/v1', apiRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    next(handleErrors(err, res))
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ message: "401 unauthorized" });
    } else {
      next(err);
    }
})

app.listen(PORT, async () => {
    console.log("Server is running on port  --", PORT)
    await connectToDb()
    console.log('connected to db')
})
