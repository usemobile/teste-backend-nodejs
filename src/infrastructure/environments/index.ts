import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue: '',
    type: String,
  },
]);

const result = dotenv.config({
  path: `.env${options.env === '' || options.env === 'production' ? '' : `.${options.env}`}`,
});

if (result.error) throw result.error;
