import express from 'express'
import bodyParses from 'body-parser'
import cors from 'cors'

import { config } from 'dotenv'; config()
import prisma from './db'

import sampleRoutes from './routes/samples'

(async function() {
    const app: express.Express = express()
    const port = process.env.PORT ?? 5000

    app.use('/samples', sampleRoutes)

    app.use(bodyParses.json({ limit: '50mb' }))
    app.use(bodyParses.urlencoded({ limit: '50mb', extended: true }))
    app.use(cors());

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    prisma.$disconnect()
})();