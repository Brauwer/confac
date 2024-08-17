import {ObjectID} from 'mongodb';
import {IAudit} from './common';
import {InvoiceLine} from './invoices';

export interface IProject {
  _id: ObjectID;
  consultantId: string;
  startDate: string;
  endDate?: string;
  partner?: ProjectClientModel;
  client: ProjectClientModel;
  endCustomer: ProjectEndCustomerModel;
  projectMonthConfig: {
    timesheetCheck: boolean;
    inboundInvoice: boolean;
  };
  audit: IAudit;
}

export type EditClientRateType = 'hourly' | 'daily' | 'km' | 'items' | 'section' | 'other';

export type EditProjectRateType = 'hourly' | 'daily';

export type ProjectClientInvoiceLine = InvoiceLine & {
  type: EditProjectRateType;
}


export interface ProjectClientModel {
  clientId: string;
  defaultInvoiceLines: ProjectClientInvoiceLine[];
  ref?: string;
}

export interface ProjectEndCustomerModel {
  endCustomer: boolean
  clientId?: string;
  contact?: string;
  notes?  : string;
}
