import moment from 'moment';
import {ACTION_TYPES} from './actions/ActionTypes.js';

const defaultConfig = {
  defaultClient: undefined,
};

const defaultAppState = {
  isLoaded: false,
  isBusy: false,
  busyCount: 0,
  invoiceFilters: {
    search: [],
    unverifiedOnly: false,
  },
};

// Config is stored on the backend
export const config = (state = defaultConfig, action) => {
  switch (action.type) {
  case ACTION_TYPES.CONFIG_FETCHED:
    console.log('CONFIG_FETCHED', action.config); // eslint-disable-line
    return action.config;

  case ACTION_TYPES.CONFIG_UPDATE:
    return action.config;

  case ACTION_TYPES.INITIAL_LOAD:
    return {...state, isLoaded: true};

  default:
    return state;
  }
};

// App is also config but only relevant for the session
export const app = (state = defaultAppState, action) => {
  switch (action.type) {
  case ACTION_TYPES.INITIAL_LOAD:
    return {...state, isLoaded: true};

  case ACTION_TYPES.APP_BUSYTOGGLE: {
    const busyCount = state.busyCount + (action.why === 'moreBusy' ? 1 : -1);
    return {...state, busyCount, isBusy: busyCount > 0};
  }

  case ACTION_TYPES.APP_INVOICE_FILTERSUPDATED:
    return Object.assign({}, state, {invoiceFilters: action.filters});

  default:
    return state;
  }
};

export const clients = (state = [], action) => {
  switch (action.type) {
  case ACTION_TYPES.CLIENTS_FETCHED:
    console.log('CLIENTS_FETCHED', action.clients); // eslint-disable-line
    return action.clients;

  case ACTION_TYPES.CLIENT_UPDATE:
    console.log('CLIENT_UPDATE', action); // eslint-disable-line
    let newState;
    if (action.isNewClient) {
      newState = state.concat([action.client]);
    } else {
      newState = state.filter(client => client._id !== action.client._id);
      newState.push(action.client);
    }
    return newState;

  default:
    return state;
  }
};

function mapInvoice(invoice) {
  invoice.date = moment(invoice.date);
  return invoice;
}

export const invoices = (state = [], action) => {
  switch (action.type) {
  case ACTION_TYPES.INVOICES_FETCHED:
    console.log('INVOICES_FETCHED', action.invoices); // eslint-disable-line
    return action.invoices.map(mapInvoice);

  case ACTION_TYPES.INVOICE_DELETED:
    return state.filter(invoice => invoice._id !== action.id);

  case ACTION_TYPES.INVOICE_ADDED:
    return state.concat([mapInvoice(action.invoice)]);

  case ACTION_TYPES.INVOICE_UPDATED: {
    let newState = state.filter(invoice => invoice._id !== action.invoice._id);
    newState.push(mapInvoice(action.invoice));
    return newState;
  }

  default:
    return state;
  }
};