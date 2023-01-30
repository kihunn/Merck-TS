import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import prisma from './db'

import sampleRoutes from './routes/old/arnd_samples'
import psampleRoutes from './routes/old/pscs_samples'
import qrRoutes from './routes/old/qr'
import deletedRoutes from './routes/old/deleted'
import labelsRoutes from './routes/old/labels'

import sampleRouter from './routes/samples'
import teamsRouter from './routes/teams';
import teamsFieldsRouter from './routes/teams_fields';

(async function () {
    const app: express.Express = express()
    const port = 5000;

    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(cors());

    // OLD ROUTES

    app.use('/arnd_samples', sampleRoutes)
    app.use('/pscs_samples', psampleRoutes)
    app.use('/qr', qrRoutes);

    app.use('/deleted', deletedRoutes);
    app.use('/labels', labelsRoutes);
    
    // ----------------------------------------------
    // NEW ROUTES :>)

    app.use('/:team/samples', sampleRouter);

    app.use('/:team/fields', teamsFieldsRouter);

    app.use('/teams', teamsRouter);

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    prisma.$disconnect()
})();
