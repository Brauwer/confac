import React from 'react';
import {useDispatch} from 'react-redux';
import InvoiceModel from '../models/InvoiceModel';
import {EditIcon} from '../../controls/Icon';
import {InvoiceVerifyIconToggle} from '../invoice-list/InvoiceVerifyIconToggle';
import {InvoiceDownloadIcon, InvoicePreviewIcon} from '../../controls/attachments/AttachmentDownloadIcon';
import {t} from '../../utils';
import {deleteInvoice} from '../../../actions';
import {ConfirmedDeleteIcon} from '../../controls/icons/DeleteIcon';


type InvoiceListRowActionsProps = {
  invoice: InvoiceModel;
  /** When from the ProjectMonth listing, also update the state of the form there */
  toggleValid?: (valid: boolean) => void;
  /** Hides some buttons when true */
  small?: boolean;
}

export const InvoiceListRowActions = ({invoice, toggleValid, small = false}: InvoiceListRowActionsProps) => {
  const dispatch = useDispatch();
  const invoiceType = invoice.isQuotation ? 'quotation' : 'invoice';
  return (
    <>
      {!small && (
        <EditIcon
          onClick={`/${invoiceType}s/${invoice.number}`}
          style={{marginRight: invoice.isQuotation ? undefined : -15}}
        />
      )}
      <InvoiceVerifyIconToggle invoice={invoice} toggleValid={toggleValid} />
      {!small && <InvoiceDownloadIcon invoice={invoice} />}
      <InvoicePreviewIcon invoice={invoice} />
      {!small && (
        <ConfirmedDeleteIcon
          title={t(`${invoiceType}.deleteTitle`)}
          onClick={() => dispatch(deleteInvoice(invoice))}
        >
          {t(`${invoiceType}.deletePopup`, {number: invoice.number, client: invoice.client.name})}
        </ConfirmedDeleteIcon>
      )}
    </>
  );
};
