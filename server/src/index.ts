import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import prisma, { Sample } from './db'

import sampleRoutes from './routes/samples'
import qrRoutes from './routes/qr'

(async function() {
    // testQRGeneration()
    const app: express.Express = express()
    const port = process.env.LOCAL_DEV_PORT ?? 5000

    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(cors());

    app.use('/samples', sampleRoutes)
    app.use('/qr', qrRoutes);

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    prisma.$disconnect()
})();

import { generateHashKey, generateLabel } from './brother/qr';
import Jimp from 'jimp'
import path from 'path'

async function testQRGeneration() {
    const sample: Sample = {
        qr_code_key: 'b10ee1b4',
        sample_id: '2',
        experiment_id: '1',
        contents: 'NaCl',
        analyst: 'Thomas Hughes',
        storage_condition: 'Freezer',
        date_entered: '2022-10-08',
        date_modified: '2022-10-08',
        expiration_date: '2022-10-08'
    }

    const img = await generateLabel(sample)
}