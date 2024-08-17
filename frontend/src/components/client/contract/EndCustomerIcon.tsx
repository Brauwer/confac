import React, { CSSProperties } from 'react';
import { Icon } from '../../controls/Icon';
import { t } from '../../utils';
import { ClientModel } from '../models/ClientModels';

type SingleContractBadgeProps = {
  client?: ClientModel;
  style?: CSSProperties;
  tooltip?: string;
};

export const EndCustomerIcon = ({ client, style, tooltip, ...props }: SingleContractBadgeProps) => {
  if (!client?.endCustomer.active) {
    return null;
  }

  let globalTooltip: string;
  globalTooltip = client.endCustomer.contact + '\n' + client.endCustomer.notes;

  return (
    <Icon
      //className={ok ? "tst-contract-ok" : "tst-contract-nok"}
      fa={'fa fa-shopping-bag'}
      style={{ marginRight: 8, ...style }}
      title={tooltip || t(globalTooltip)}
      {...props} />
  );
};
