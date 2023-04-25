import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.intialiseControllers(controllers);
        this.intialiseErrorHandling();

    }

    private initialiseMiddleware():void {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(helmet());
    }

    private intialiseControllers(controllers: Controller[]):void {
        controllers.forEach((controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private intialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initialiseDatabaseConnection(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, NODE_ENV } = process.env;
        if (NODE_ENV === 'development') {
            mongoose.connect(`mongodb://127.0.0.1:27017/tsc`,);
            console.log('Connected to local database');
            return;
        }
        mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;