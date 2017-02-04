import moment from 'moment';
import {getNumeric} from '../util.js';

function transformFilters(search) {
  const transformFn = type => search.filter(f => f.type === type).map(f => f.value);
  return {
    directInvoiceNrs: transformFn('invoice-nr'),
    years: transformFn('year'),
    clients: transformFn('client'),
    invoiceLineDescs: transformFn('invoice_line'),
    other: transformFn('manual_input'),
  };
}



export default class InvoiceListViewModel {
  constructor(invoices, clients, filters) {
    this.invoices = invoices;
    this.clients = clients;
    this.hasFilters = filters.search.length;
    this.fs = transformFilters(filters.search);
    this.unverifiedOnly = filters.unverifiedOnly;
  }

  getFilterOptions() {
    var options = [];

    // Add options: clients
    const manualFilteredInvoices = this.filterByDescription(this.invoices);
    const clientIds = manualFilteredInvoices.map(i => i.client._id);
    const relevantClients = this.clients.filter(c => clientIds.includes(c._id));
    options = options.concat(relevantClients.map(client => ({value: client._id, label: client.name, type: 'client'})));

    // Add options: years
    const invoiceYears = getInvoiceYears(manualFilteredInvoices);
    options = options.concat(invoiceYears.map(year => ({value: year, label: year, type: 'year'})));

    // Add options: unique invoice-line descriptions
    const fullyFilteredInvoices = this.getFilteredInvoices();
    const lines = fullyFilteredInvoices.map(i => i.lines);
    const lineDescs = [].concat.apply([], lines).map(l => l.desc);
    const uniqueLines = lineDescs.filter((desc, index, arr) => arr.indexOf(desc) === index);
    options = options.concat(uniqueLines.map(lineDesc => ({value: lineDesc, label: lineDesc, type: 'invoice_line'})));

    return options;
  }

  getFilteredInvoices() {
    const fs = this.fs;
    if (fs.directInvoiceNrs.length) {
      return this.invoices.filter(i => fs.directInvoiceNrs.includes(i.number));
    }

    var invoices = this.invoices;
    if (this.unverifiedOnly) {
      invoices = invoices.filter(i => !i.verified);
    }

    if (this.hasFilters) {
      if (fs.years.length) {
        invoices = invoices.filter(i => fs.years.includes(i.date.year()));
      }

      if (fs.clients.length) {
        invoices = invoices.filter(i => fs.clients.includes(i.client._id));
      }

      invoices = this.filterByDescription(invoices);
    }

    return invoices;
  }

  filterByDescription(invoices) {
    if (this.fs.invoiceLineDescs.length) {
      invoices = invoices.filter(i => this.fs.invoiceLineDescs.some(descFilter => i.lines.map(l => l.desc).includes(descFilter)));
    }

    this.fs.other.forEach(otherFilter => {
      invoices = invoices.filter(i => searchInvoiceFor(i, otherFilter));
    });

    return invoices;
  }
}


function searchInvoiceFor(invoice, text) {
  text = text.toLowerCase();

  if (invoice.orderNr.toLowerCase().includes(text)) {
    return true;
  }

  const client = invoice.client;
  if (client.city.toLowerCase().includes(text) || client.address.toLowerCase().includes(text)) {
    return true;
  }

  const numericText = getNumeric(text);
  if (numericText) {
    const numericBtw = getNumeric(client.btw);
    const numericTelephone = getNumeric(client.telephone);
    if (numericText === numericBtw || numericText === numericTelephone) {
      return true;
    }
  }

  return false;
}


function getInvoiceYears(invoices) {
  const dates = invoices.map(i => i.date.toDate());
  const firstInvoiceYear = moment(Math.min.apply(null, dates)).year();
  const lastInvoiceYear = moment(Math.max.apply(null, dates)).year();

  var years = [];
  for (let i = firstInvoiceYear; i <= lastInvoiceYear; i++) {
    years.push(i);
  }
  return years;
}