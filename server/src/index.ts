import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { config } from 'dotenv'; config()
import prisma from './db'

import sampleRoutes from './routes/samples'

(async function() {
    const app: express.Express = express()
    const port = process.env.PORT ?? 5000

    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(cors());

    app.use('/samples', sampleRoutes)

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    prisma.$disconnect()
})();