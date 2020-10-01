import Express from 'express';
import cors from 'cors';
import envTyped from './shared/envVariablesTyped';
import moment from 'moment';

import customPropertiesRouter from './customProperties/router';

const { SERVER_PORT } = envTyped;

const server = Express();

server
  .use(cors())
  .use(customPropertiesRouter);

server.listen(SERVER_PORT, () => {
  console.log(`Express server running on port ${SERVER_PORT}`);

  const now: string = moment().format('h:mm:ss a [on] MMM Do[,] YYYY');
  console.log(`Last restarted: ${now}`);
});
