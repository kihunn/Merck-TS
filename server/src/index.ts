import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import prisma from './db'

import sampleRoutes from './routes/samples'
import psampleRoutes from './routes/psamples'
import qrRoutes from './routes/qr'
import deletedRoutes from './routes/deleted'

(async function () {
    const app: express.Express = express()
    const port = process.env.LOCAL_DEV_PORT ?? 5000

    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(cors());

    app.use('/samples', sampleRoutes)
    app.use('/psamples', psampleRoutes)
    app.use('/qr', qrRoutes);
    app.use('/deleted', deletedRoutes);

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    // createTableAlways("test_db", ["qr_code_key", "name", "age"], ["TEXT PRIMARY KEY", "TEXT", "TEXT"])
    // try {
    //     const res: any = await prisma.$queryRawUnsafe('SELECT * FROM "random_table"');
    //     console.log(res)
    // } catch (error: any) {
    //     if (error.message.includes(`"random_table" does not exist`)) {
    //         console.log("Table does not exist");
    //     }
    // }

    prisma.$disconnect()
})();
