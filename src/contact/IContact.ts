import { ELeadStatuses } from './ELeadStatuses';
import { ELifecycleStages } from './ELifecycleStages';
import { EProspectCategories } from './EProspectCategories';

export default interface IContact {
  firstname: string;
  lastname: string;
  company: string;
  email: string;
  hs_lead_status: ELeadStatuses;
  lifecyclestage: ELifecycleStages;
  prospect_category: EProspectCategories;
  initial_message?: string;
};
