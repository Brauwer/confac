import numeral from 'numeral';

export function moneyFormat(input) {
  return '€ ' + numeral(input).format('0,0.00');
}

export const getNumeric = text => text.replace(/[^0-9]+/g, '');

export {default as t} from '../trans.js';

export {default as EditInvoiceViewModel} from './invoice/EditInvoiceViewModel.js';
