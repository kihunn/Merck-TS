import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import prisma from './db'

import sampleRoutes from './routes/arnd_samples'
import psampleRoutes from './routes/pscs_samples'
import qrRoutes from './routes/qr'
import deletedRoutes from './routes/deleted'
import labelsRoutes from './routes/labels'

(async function () {
    const app: express.Express = express()
    const port = 5000;

    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(cors());


    app.get("/", (req, res) => {
        res.send("Hello World!")
    });

    app.use('/arnd_samples', sampleRoutes)
    app.use('/pscs_samples', psampleRoutes)
    app.use('/qr', qrRoutes);
    app.use('/deleted', deletedRoutes);
    app.use('/labels', labelsRoutes);

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    prisma.$disconnect()
})();
