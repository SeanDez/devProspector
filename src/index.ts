import * as hubspot from '@hubspot/api-client';
import envTyped from './shared/envVariablesTyped';

const { HUBSPOT_API_KEY } = envTyped;

const hubspotClient = new hubspot.Client({ apiKey: HUBSPOT_API_KEY });

hubspotClient.crm.timeline.eventsApi.create