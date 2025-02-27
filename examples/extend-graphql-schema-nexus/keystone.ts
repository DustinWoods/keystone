import { config } from '@keystone-6/core';
import { fixPrismaPath } from '../example-utils';
import { lists, extendGraphqlSchema } from './schema';

export default config({
  db: {
    provider: 'sqlite',
    url: process.env.DATABASE_URL || 'file:./keystone-example.db',

    // WARNING: this is only needed for our monorepo examples, dont do this
    ...fixPrismaPath,
  },
  lists,
  extendGraphqlSchema,

  // we use a custom types path for easy integration with nexus
  types: {
    path: 'keystone-types.ts',
  },
});
