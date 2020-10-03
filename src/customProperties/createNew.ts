import buildUrl from 'build-url';
import 'es6-promise';
import 'isomorphic-fetch';

import envTyped from '../shared/envVariablesTyped';
import IHubspotProperty from './IHubspotProperty';
import { hubspotApiBaseUrl } from '../shared/globals';

const { HUBSPOT_API_KEY } = envTyped;

const propertiesPath = '/properties/v1/contacts/properties';

export default async (fields: IHubspotProperty): Promise<boolean> => {
  const {
    name, label, groupName, type, fieldType,
  } = fields;

  const createNewEndpoint = buildUrl(hubspotApiBaseUrl, {
    path: propertiesPath,
    queryParams: {
      hapikey: HUBSPOT_API_KEY, name, label, groupName, type, fieldType,
    },
  });

  const body = JSON.stringify(fields);

  const response = await fetch(createNewEndpoint, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body,
  });

  if (response.ok) {
    return response.json();
  }

  return false;
};
