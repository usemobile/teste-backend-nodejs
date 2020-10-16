import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant
} from "swagger-express-ts";

import { Movie } from '~/entities/Movie';
import { validate } from 'class-validator';
import { Logger } from '~/shared-kernel/Logger';


@ApiPath({
  path: '/movies',
  name: 'Movies',
  security: { tokenHeader: [] },
})
export class MovieController {
  @ApiOperationGet({
    path: '/',
    description: 'Get all movies',
    responses: {
      200: {
        description: 'Success',
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: 'Movie',
      },
    },
  })
  async get(req: Request, res: Response) {
    Logger.log(`Finding all movies`, 'MovieController');
    const movieRepository = getRepository(Movie);

    const { director, title, genre } = req.query;

    const movies = await movieRepository.find({
      where: { director, genre, title },
      select: ['id', 'title', 'description', 'director', 'genre'],
    });

    res.send(movies);
  }

  @ApiOperationGet({
    path: '/{id}',
    parameters: {
      path: {
        id: {
          name: 'id',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'The movie id',
        },
      },
    },
    description: 'Gets an movie by its id',
    responses: {
      200: {
        description: 'Success',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'Movie',
      },
      404: { description: 'Movie not found' },
    },
  })
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      Logger.log(`Finding movie ${id}`, 'MovieController');
      const movieRepository = getRepository(Movie);

      const movie = await movieRepository.findOne(id, {
        select: ['id', 'title', 'description', 'director', 'genre'],
      });
      if (!movie) {
        res.status(StatusCodes.NOT_FOUND).send(`Movie not found`);
        return;
      }

      res.send(movie);
    } catch (err) {
      Logger.error(`Error in finding the movie. ${err.message}`, err.trace, 'MovieController');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  @ApiOperationPost({
    path: '/',
    description: 'Creates an movie',
    parameters: {
      body: { description: 'New Movie', required: true, model: 'Movie' },
    },
    responses: {
      201: { description: 'Movie created' },
      400: { description: 'Parameters fail' },
    },
  })
  async create(req: Request, res: Response) {
    try {
      Logger.log(`Creating movie`, 'MovieController');
      const movieRepository = getRepository(Movie);

      const { title, description, director, genre } = req.body;
      if (!(title && description)) {
        res.status(StatusCodes.BAD_REQUEST).send();
      }

      const movie = new Movie(title, description, director, genre);

      const errors = await validate(movie);

      if (errors.length > 0) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(errors);
        return;
      }

      const createdMovie = await movieRepository.save(movie);

      res.status(StatusCodes.CREATED).send(createdMovie);
    } catch (err) {
      Logger.error(`Error in creating the movie. ${err.message}`, err.trace, 'MovieController');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  @ApiOperationDelete({
    path: '/{id}',
    description: 'Deletes an movie. The deletion is logical',
    parameters: {
      path: {
        id: {
          name: 'id',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'The movie id',
        },
      },
    },
    responses: {
      204: { description: 'No content' },
      400: { description: 'Parameters fail' },
      404: { description: 'Movie not found' },
    },
  })
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      Logger.log(`Deleting movie ${id}`, 'MovieController');
      const movieRepository = getRepository(Movie);

      const movie = await movieRepository.findOne(id);
      if (!movie) {
        res.status(StatusCodes.NOT_FOUND).send(`Movie not found`);
        return;
      }

      await movieRepository.softDelete(id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      Logger.error(`Error in deleting the movie. ${err.message}`, err.trace, 'MovieController');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}
