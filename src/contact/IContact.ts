enum EProspectCategories {
  R = 'Recruiter',
  S = 'Salesperson',
  T = 'Technician'
}

enum ELifecycleStages {
  subscriber = 'subscriber',
  lead = 'lead',
  marketingQualified = 'marketingqualifiedlead',
  salesQualified = 'salesqualifiedlead',
  opportunity = 'opportunity',
  customer = 'customer',
  evangelist = 'evangelist',
  other = 'other'
}

enum ELeadStatuses {
  new = 'NEW',
  open = 'OPEN',
  inProgress = 'IN_PROGRESS',
  openDeal = 'OPEN_DEAL',
  unqualified = 'UNQUALIFIED',
  attemptedContact = 'ATTEMPTED_TO_CONTACT',
  connected = 'CONNECTED',
  badTiming = 'BAD_TIMING'
}

export default interface IContact {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  lead_status: ELeadStatuses;
  lifecyclestage: ELifecycleStages;
  prospect_category: EProspectCategories;
  initial_message: string;
};
