import express, { Application } from 'express';
import cors from 'cors';
import commonRoute from './routes/common';
import productsRoute from './routes/products';
import config from './config/config';
import connectDB from './db/connect';

const app: Application = express()


app.use(express.json());
app.use(cors());


app.use(commonRoute)
app.use('/products', productsRoute)

const start = async () => {
    try {
        await connectDB(config.MONGO_URI)
        app.listen(config.PORT, () => console.log(`Server is lisening on port ${config.PORT}...🏃`))
    } catch (err) {
        console.log(err)
    }
}

start()
