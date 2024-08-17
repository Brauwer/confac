import React, { useState } from 'react';
import {Switch} from '../../controls/form-controls/Switch';
import { EnhanceInputWithLabel } from '../../enhancers/EnhanceInputWithLabel';

function ProjectEndCustomerSwitchComponent() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    console.log('Switch is now', event.target.checked ? 'ON' : 'OFF');
    // Add any additional logic you want to execute when the switch changes state
  };

  return (
    <Switch
      value={checked}
      onChange={handleChange}
      label="client.endCustomer"
    />
  );
}

export const ProjectEndCustomerSwitch = EnhanceInputWithLabel(ProjectEndCustomerSwitchComponent);