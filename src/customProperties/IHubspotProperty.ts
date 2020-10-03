import PropertyTypes from './EPropertyTypes';

export default interface HubspotProperty {
  name: string,
  label: string,
  groupName: string,
  type: PropertyTypes,
  fieldType: 'text' | 'textarea' | 'select'
};
