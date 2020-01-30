/* eslint-disable react/jsx-one-expression-per-line */
import moment from 'moment';
import React from 'react';
import {Link} from 'react-router-dom';
import {IList, IListCell, ProjectListFilters} from '../../controls/table/table-models';
import {IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {FullProjectModel, ProjectClientModel} from './ProjectModel';
import {t, formatDate, tariffFormat, searchinize} from '../../utils';
import {EditIcon, DeleteIcon} from '../../controls/Icon';
import {InvoiceClientCell} from '../../invoice/invoice-table/InvoiceClientCell';


export type ProjectFeatureBuilderConfig = IFeatureBuilderConfig<FullProjectModel, ProjectListFilters>;



const fullProjectSearch = (filters: ProjectListFilters, prj: FullProjectModel) => {
  const {consultant, partner, client, details} = prj;

  if (!filters.showInactive && !details.active) {
    return false;
  }

  if (!filters.freeText) {
    return true;
  }

  const startDate = formatDate(details.startDate);
  const endDate = formatDate(details.endDate);

  return searchinize(
    `${consultant.name} ${consultant.firstName} ${consultant.type} ${startDate} ${endDate} ${partner && partner.name} ${client && client.name}`,
  ).includes(filters.freeText.toLowerCase());
};



const getRowBackgroundColor = (prj: FullProjectModel): undefined | string => {
  const projectDetails = prj.details;
  if (!prj.details.active) {
    return 'table-danger';
  }

  if (projectDetails.endDate) {
    const monthsLeft = moment(projectDetails.endDate).diff(moment(), 'months', true);

    if (monthsLeft < 1) {
      return 'table-warning';
    }
    if (monthsLeft < 3) {
      return 'table-info';
    }
  }
  return undefined;
};


const ProjectClientTariff = ({projectClient}: {projectClient: ProjectClientModel | undefined}) => {
  if (!projectClient) {
    return null;
  }

  return (
    <>
      {tariffFormat(projectClient.tariff)} / {projectClient.rateType}
    </>
  );
}


const projectListConfig = (config: ProjectFeatureBuilderConfig): IList<FullProjectModel, ProjectListFilters> => {
  const list: IListCell<FullProjectModel>[] = [{
    key: 'consultant',
    header: 'project.consultant',
    value: p => (
      <Link to={`consultants/${p.consultant.slug}`}>
        {p.consultant.firstName} {p.consultant.name}
      </Link>
    ),
  }, {
    key: 'type',
    header: 'project.consultantType',
    value: p => t(`consultant.types.${p.consultant.type}`),
  }, {
    key: 'startDate',
    header: 'project.startDate',
    value: p => formatDate(p.details.startDate),
  }, {
    key: 'endDate',
    header: 'project.endDate',
    value: p => p.details.endDate && formatDate(p.details.endDate),
  }, {
    key: 'partner',
    header: 'project.partner.clientId',
    value: p => <InvoiceClientCell client={p.partner} />,
  }, {
    key: 'partnerTariff',
    header: 'project.partner.tariff',
    value: p => <ProjectClientTariff projectClient={p.details.partner} />,
  }, {
    key: 'client',
    header: 'project.client.clientId',
    value: p => <InvoiceClientCell client={p.client} />,
  }, {
    key: 'clientTariff',
    header: 'project.client.tariff',
    value: p => <ProjectClientTariff projectClient={p.details.client} />,
  }, {
    key: 'buttons',
    header: {title: '', width: 110},
    value: m => (
      <>
        <EditIcon onClick={`/projects/${m._id}`} style={{marginRight: 15}} />
        <DeleteIcon
          onClick={() => config.save({...m, details: {...m.details, active: !m.details.active}})}
          title={m.details.active ? t('feature.deactivateTitle') : t('feature.activateTitle')}
        />
      </>
    ),
  }];

  return {
    rows: {
      className: getRowBackgroundColor,
      cells: list,
    },
    data: config.data,
    sorter: (a, b) => {
      if (!a.details.endDate) {
        return 1;
      }
      if (!b.details.endDate) {
        return -1;
      }
      return a.details.endDate.valueOf() - b.details.endDate.valueOf();
    },
  };
};


export const projectFeature = (config: ProjectFeatureBuilderConfig): IFeature<FullProjectModel, ProjectListFilters> => {
  const feature: IFeature<FullProjectModel, ProjectListFilters> = {
    key: 'projects',
    nav: m => `/projects/${m === 'create' ? m : m.details._id}`,
    trans: features.project as any,
    list: projectListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: fullProjectSearch,
    softDelete: true,
  };

  return feature;
};