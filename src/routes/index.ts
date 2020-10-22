import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { UserController } from '~/controllers/UserController';
import { MovieController } from '~/controllers/MovieController';
import { verifyToken } from '~/helpers/authorization';

const routes = Router();

// User
const userController = new UserController();
routes.get('/users', verifyToken, userController.get);
routes.get('/users/:id([0-9]+)', verifyToken, userController.getById);
routes.post('/users', userController.create);
routes.post('/users/login', userController.login);
routes.patch('/users/:id([0-9]+)', verifyToken, userController.edit);
routes.delete('/users/:id([0-9]+)', verifyToken, userController.delete);

// Movie
const movieController = new MovieController();
routes.get('/movies', movieController.get);
routes.get('/movies/:id([0-9]+)', movieController.getById);
routes.post('/movies', movieController.create);
routes.delete('/movies/:id([0-9]+)', movieController.delete);

// Swagger
const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || '3000';
routes.use(
  '/api',
  swaggerUi.serve,
  swaggerUi.setup(undefined, { swaggerOptions: { url: `${host}:${port}/api-docs/swagger.json` } }),
);

export default routes;
