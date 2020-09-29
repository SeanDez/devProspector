import * as hubspot from '@hubspot/api-client';
import envTyped from './shared/envVariablesTyped';

const { HUBSPOT_API_KEY } = envTyped;

/*
  Get all contacts that have not been contacted and have emails

  For each selection
  Send each one an email
  Kick out contacts where all contact attempts failed
  if email was a success
    create an email event in hubspot
    change status to contacted (or similar)
*/

const hubspotClient = new hubspot.Client({ apiKey: HUBSPOT_API_KEY });

hubspotClient.crm.timeline.eventsApi.create