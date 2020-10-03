import 'es6-promise';
import 'isomorphic-fetch';
import buildUrl from 'build-url';

import envTyped from '../shared/envVariablesTyped';
import { hubspotApiBaseUrl } from '../shared/globals';

const { HUBSPOT_API_KEY } = envTyped;

const getAllPropertiesPath = '/properties/v1/contacts/properties';
const getAllEndpoint = encodeURI(buildUrl(hubspotApiBaseUrl, {
  path: getAllPropertiesPath,
  queryParams: {
    hapikey: HUBSPOT_API_KEY,
  },
}));

export default async function getAllProperties() {
  try {
    const response = await fetch(getAllEndpoint, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
