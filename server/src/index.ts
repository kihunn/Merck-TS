import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import prisma, { Sample } from './db'

import sampleRoutes from './routes/samples'
import psampleRoutes from './routes/psamples'
import qrRoutes from './routes/qr'

(async function() {
    const app: express.Express = express()
    const port = process.env.LOCAL_DEV_PORT ?? 5000

    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(cors());

    app.use('/samples', sampleRoutes)
    app.use('/psamples', psampleRoutes)
    app.use('/qr', qrRoutes);

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    prisma.$disconnect()
})();
