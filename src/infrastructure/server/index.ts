import express, { Application } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as swagger from 'swagger-express-ts';

import routes from '~/routes';
import { SwaggerDefinitionConstant } from 'swagger-express-ts';

class Server {
  private readonly app: Application = express();

  applyMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
      }),
    );
    this.app.use(
      rateLimit({
        windowMs: 1000 * 360,
        max: 1000,
        message: 'Too many request created from this IP, please try again after an hour',
      }),
    );
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(
      swagger.express({
        definition: {
          info: {
            title: process.env.APP_NAME || 'My App',
            version: process.env.VERSION || 'v1',
          },
          securityDefinitions: {
            tokenHeader: {
              type: SwaggerDefinitionConstant.Security.Type.API_KEY,
              in: SwaggerDefinitionConstant.Security.In.HEADER,
              name: 'auth',
            },
          },
        },
      }),
    );
    this.app.use('/', routes);
  }

  start(port: number) {
    this.applyMiddlewares();
    this.app.listen(port);

    return this.app;
  }
}

export const server = new Server();
