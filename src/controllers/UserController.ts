import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '~/entities/User';
import { StatusCodes } from 'http-status-codes';
import { validate } from 'class-validator';
import { Logger } from '~/shared-kernel/Logger';
import * as jwt from 'jsonwebtoken';
import { verify } from "~/helpers/roles";
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPatch,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';

@ApiPath({
  path: '/users',
  name: 'Users',
  security: { tokenHeader: [] },
})
export class UserController {
  @ApiOperationGet({
    path: '/',
    description: 'Get all users',
    responses: {
      200: {
        description: 'Success',
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: 'User',
      },
    },
  })
  async get(req: Request, res: Response) {
    Logger.log(`Finding all users`, 'UserController');
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'username'],
    });

    res.send(users);
  }

  @ApiOperationGet({
    path: '/{id}',
    parameters: {
      path: {
        id: {
          name: 'id',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'The user id',
        },
      },
    },
    description: 'Gets an user by its id',
    responses: {
      200: {
        description: 'Success',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'User',
      },
      404: { description: 'User not found' },
    },
  })
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      Logger.log(`Finding user ${id}`, 'UserController');
      const userRepository = getRepository(User);

      const user = await userRepository.findOne(id, {
        select: ['id', 'username'],
      });
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send(`User not found`);
        return;
      }

      res.send(user);
    } catch (err) {
      Logger.error(`Error in finding the user. ${err.message}`, err.trace, 'UserController');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  @ApiOperationPost({
    path: '/',
    description: 'Creates an user',
    parameters: {
      body: { description: 'New User', required: true, model: 'User' },
    },
    responses: {
      201: { description: 'User created!' },
      400: { description: 'Parameters failed.' },
      500: { description: 'Internal server error.' }
    },
  })
  async create(req: Request, res: Response) {
    try {
      Logger.log(`Creating user`, 'UserController');
      const userRepository = getRepository(User);

      const { username, password, role } = req.body;
      if (!(username && password && role)) {
        res.status(StatusCodes.BAD_REQUEST).send('Invalid parameters passed to request.');
      }

      if(!verify(role)) {
        res.status(StatusCodes.BAD_REQUEST).send('Invalid role.');
      }

      const user = new User(username, password, role);
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(errors);
        return;
      }

      const createdUser = await userRepository.save(user);
      const { password: psw, ...formattedUser } = createdUser;
      res.status(StatusCodes.CREATED).send(formattedUser);
    } catch (err) {
      Logger.error(`Error in creating the user. ${err.message}`, err.trace, 'UserController');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  @ApiOperationPatch({
    path: '/{id}',
    description: 'Updates an user',
    parameters: {
      path: {
        id: {
          name: 'id',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'The user id',
        },
      },
      body: { description: 'Edit User', required: true, model: 'User' },
    },
    responses: {
      204: { description: 'No content' },
      400: { description: 'Parameters fail' },
      404: { description: 'User not found' },
    },
  })
  async edit(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      Logger.log(`Updating user ${id}`, 'UserController');
      const userRepository = getRepository(User);

      const { username } = req.body;

      const user = await userRepository.findOne(id);
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send(`User not found`);
        return;
      }

      user.username = username;

      const errors = await validate(user);

      if (errors.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).send(errors);
        return;
      }

      await userRepository.save(user);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      Logger.error(`Error in updating the user. ${err.message}`, err.trace, 'UserController');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  @ApiOperationDelete({
    path: '/{id}',
    description: 'Deletes an user. The deletion is logical',
    parameters: {
      path: {
        id: {
          name: 'id',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'The user id',
        },
      },
    },
    responses: {
      204: { description: 'No content' },
      400: { description: 'Parameters fail' },
      404: { description: 'User not found' },
    },
  })
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      Logger.log(`Deleting user ${id}`, 'UserController');
      const userRepository = getRepository(User);

      const user = await userRepository.findOne(id);
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send(`User not found`);
        return;
      }

      await userRepository.softDelete(id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      Logger.error(`Error in deleting the user. ${err.message}`, err.trace, 'UserController');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  @ApiOperationPost({
    path: '/login',
    description: 'Authenticates an user',
    parameters: {
      body: { description: 'Authenticated user', required: true, model: 'User' },
    },
    responses: {
      200: { description: 'User authenticated!' },
      400: { description: 'Parameters failed.' },
      404: { description: 'Invalid username or password.' },
      500: { description: 'Internal server error.' }
    },
  })
  async login(req: Request, res: Response) {
    try {
      Logger.log(`Authenticating user`, 'UserController');
      const userRepository = getRepository(User);

      const { username, password } = req.body;
      if (!(username && password)) {
        res.status(StatusCodes.NOT_FOUND).send();
      }

      const user = await userRepository.findOne({
        where: { username: username, password: password },
        select: ["id", "username", "password"]
      });

      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send(`Invalid username or password.`);
        return;
      }

      const token = jwt.sign(
          {sub: user.id, role: user.username},
          <string>process.env.JWT_SECRET,
          {expiresIn: 300}
      );

      res.send({auth: true, token: token});
    } catch (err) {
      Logger.error(`Error while authenticating user. ${err.message}`, err.trace, 'UserController');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }


  @ApiOperationPost({
    path: '/logout',
    description: 'Logs an user out',
    parameters: {
      body: { description: 'Logged out user', required: true, model: 'User' },
    },
    responses: {
      200: { description: 'User logged out!' },
      400: { description: 'Parameters failed.' },
      404: { description: 'Invalid token.' },
      500: { description: 'Internal server error.' }
    },
  })
  async logout(req: Request, res: Response) {
    try {
      res.send({auth: false, token: null});
    } catch (err) {
      Logger.error(`Error while logging out user. ${err.message}`, err.trace, 'UserController');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}
