import 'reflect-metadata';
import { createConnection } from 'typeorm';

import '~/infrastructure/environments';
import { server } from '~/infrastructure/server';
import { Logger } from '~/shared-kernel/Logger';

const start = async () => {
  Logger.log(`Starting App Server`, 'Bootstrap');
  const port = Number(process.env.PORT || 3000);

  await createConnection();
  Logger.log(`Database connected!`, 'Bootstrap');
  server.start(port);

  Logger.log(`Server is listening on port ${port}`, 'Bootstrap');
  Logger.log(`Environment: ${process.env.NODE_ENV?.toUpperCase()}`, 'Bootstrap');
};

start().catch((err) => {
  Logger.error(`Error starting server, ${err}`, err.trace, 'Bootstrap');
  process.exit();
});
