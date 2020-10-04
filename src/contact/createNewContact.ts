import 'es6-promise';
import { Request, Response } from 'express';
import 'isomorphic-fetch';
import buildUrl from 'build-url';
import { hubspotApiBaseUrl } from '../shared/globals';

import envTyped from '../shared/envVariablesTyped';
import IContact from './IContact';

const { HUBSPOT_API_KEY } = envTyped;

const createContactPath = '/contacts/v1/contact';
const createContactEndpointWithApiKey = buildUrl(hubspotApiBaseUrl, {
  path: createContactPath,
  queryParams: {
    hapikey: HUBSPOT_API_KEY,
  },
});

interface PropertyAndValue { property: string, value: string }

interface NewContactBody { properties: PropertyAndValue[] }

/*
  Takes all body properties and creates a new contact with them
*/
export default async (req: Request, res: Response) => {
  const keys: string[] = Object.keys(req.body as IContact);
  const propertyValueObjects: PropertyAndValue[] = keys.map((key: string) => ({
    property: key,
    value: req.body[key],
  }));

  const postBody: NewContactBody = {
    properties: propertyValueObjects,
  };

  try {
    const response = await fetch(createContactEndpointWithApiKey, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(postBody),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
