import { EditClientModel } from '../components/client/ClientModels';
import { ACTION_TYPES } from "../actions";

export const clients = (state: EditClientModel[] = [], action): EditClientModel[] => {
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