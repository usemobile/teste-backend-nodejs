import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Genre } from './Genre';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@Entity()
@ApiModel({
  description: 'The movie entity.',
  name: 'Movie',
})
export class Movie {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 50 })
  @ApiModelProperty({
    description: 'The title of the movie',
  })
  title: string;

  @Column({ length: 250 })
  @ApiModelProperty({
    description: 'The description of the movie',
  })
  description: string;

  @Column({ length: 50 })
  @ApiModelProperty({
    description: 'The director of the movie',
  })
  director: string;

  @Column({ enum: Genre, type: 'enum' })
  @ApiModelProperty({
    description: 'The genre of the movie',
  })
  genre: Genre;

  constructor(title: string, description: string, director: string, genre: Genre) {
    this.title = title;
    this.description = description;
    this.director = director;
    this.genre = genre;
  }
}
