import bodyParser from 'body-parser';
import cors from 'cors';
import Express from 'express';
import moment from 'moment';

import customPropertiesRouter from './customProperties/router';
import contactRouter from './contact/router';
import gmailRouter from './gmail/router';
import envTyped from './shared/envVariablesTyped';

const { SERVER_PORT } = envTyped;

const server = Express();

server
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cors())
  .use(customPropertiesRouter)
  .use('/contact', contactRouter)
  .use('/gmail', gmailRouter);

// to be deleted after dev phase
server.get('/', (req: Express.Request, res: Express.Response) => {
  res.json({ message: 'this endpoint is just for basic server testing' });
});

server.listen(SERVER_PORT, () => {
  console.log(`Express server running on port ${SERVER_PORT}`);

  const now: string = moment().format('h:mm:ssa [on] MMM Do[,] YYYY');
  console.log(`Last restarted: ${now}`);
});
