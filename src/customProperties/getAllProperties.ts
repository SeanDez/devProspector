import 'es6-promise';
import 'isomorphic-fetch';
import buildUrl from 'build-url';

import { hubspotApiBaseUrl } from '../shared/globals';

const { REACT_APP_HUBSPOT_API_KEY } = process.env as { [key: string]: string };

const getAllPropertiesPath = '/properties/v1/contacts/properties';
const getAllEndpoint = buildUrl(hubspotApiBaseUrl, {
  path: getAllPropertiesPath,
  queryParams: {
    hapiKey: REACT_APP_HUBSPOT_API_KEY,
  },
});

export default async function getAllProperties() {
  try {
    const response = await fetch(getAllEndpoint, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    });

    const data = response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
