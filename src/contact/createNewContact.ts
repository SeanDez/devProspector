import 'es6-promise';
import { Request, Response } from 'express';
import 'isomorphic-fetch';
import buildUrl from 'build-url';
import { hubspotApiBaseUrl } from '../shared/globals';

import envTyped from '../shared/envVariablesTyped';
import IContact from './IContact';
import { ELeadStatuses } from './ELeadStatuses';
import { ELifecycleStages } from './ELifecycleStages';
import { EProspectCategories } from './EProspectCategories';

const { HUBSPOT_API_KEY } = envTyped;

const createContactPath = '/contacts/v1/contact';
const createContactEndpointWithApiKey = buildUrl(hubspotApiBaseUrl, {
  path: createContactPath,
  queryParams: {
    hapikey: HUBSPOT_API_KEY,
  },
});

interface PropertyAndValue { property: keyof IContact, value: string }

interface NewContactBody { properties: PropertyAndValue[] }

/*
  Takes all body properties and creates a new contact with them
*/
export default async (req: Request, res: Response) => {
  const {
    firstName: firstname, lastName: lastname, companyName: company,
    employeeRoleCode, email, completeIntroSentence, customContactChannel,
  } = req.body;

  const prospect_category = EProspectCategories[employeeRoleCode
    .toUpperCase() as keyof typeof EProspectCategories];

  const newContact: IContact = {
    firstname,
    lastname,
    company,
    email,
    hs_lead_status: ELeadStatuses.open,
    lifecyclestage: ELifecycleStages.lead,
    prospect_category,
  };

  const keys: string[] = Object.keys(newContact);
  const propertyValueObjects: PropertyAndValue[] = keys.map((key: string) => ({
    property: key as keyof IContact,
    value: newContact[key as keyof IContact]!,
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

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    res.status(500).json(error);
  }
};
