import bodyParser from 'body-parser';
import cors from 'cors';
import Express, { Request, Response, NextFunction } from 'express';
import basicAuth from 'express-basic-auth';
import moment from 'moment';

import customPropertiesRouter from './customProperties/router';
import contactRouter from './contact/router';
import emailRouter from './email/router';
import envTyped from './shared/envVariablesTyped';

const { SERVER_PORT, EXPRESS_USERNAME, EXPRESS_PASSWORD } = envTyped;

// --------------- Auth route setup

const validUsers = { [EXPRESS_USERNAME]: EXPRESS_PASSWORD };

function handleAuthenticationResponse(req: Request, res: Response, next: NextFunction) {
  if (req.auth) { res.status(204).send(); }
}

// -------------- Middleware and router attachment

const server = Express();
server
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cors())
  .post('/login', basicAuth({
    users: validUsers,
  }), handleAuthenticationResponse)
  .use(customPropertiesRouter)
  .use('/contact', contactRouter)
  .use('/email', emailRouter);

// to be deleted after dev phase
server.get('/', (req: Express.Request, res: Express.Response) => {
  res.json({ message: 'this endpoint is just for basic server testing' });
});

server.listen(SERVER_PORT, () => {
  console.log(`Express server running on port ${SERVER_PORT}`);

  const now: string = moment().format('h:mm:ssa [on] MMM Do[,] YYYY');
  console.log(`Last restarted: ${now}`);
});
