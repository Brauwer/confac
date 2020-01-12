import React, {useState} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Container, Table, Row, Col} from 'react-bootstrap';
import {t, searchinize, formatDate} from '../utils';
import {ConfacState} from '../../reducers/app-state';
import ProjectsListRow, {ProjectsListHeader} from './ProjectsListRow';
import {ClientModel} from '../client/models/ClientModels';
import {SearchStringInput} from '../controls/form-controls/inputs/SearchStringInput';
import {ProjectFilters} from '../../models';
import {updateProjectFilters} from '../../actions';
import {ProjectReferenceResolver} from './utils/ProjectReferenceResolver';
import {ProjectMonthModal} from './controls/ProjectMonthModal';
import {ConsultantModel} from '../consultant/models/ConsultantModel';
import {Switch} from '../controls/form-controls/Switch';
import {Button} from '../controls/form-controls/Button';
import {FullProjectModel} from './models/types';

type ProjectsListProps = {
  projects: FullProjectModel[];
  consultants: ConsultantModel[];
  clients: ClientModel[];
  updateProjectFilters: (filters: ProjectFilters) => void;
  filters: ProjectFilters;
};

const ProjectsList = (props: ProjectsListProps) => {
  const history = useHistory();
  const [modalProjectMonthId, setModalProjectMonthId] = useState<string | undefined>(undefined);

  const {searchFilterText, isShowingInActiveProjects} = props.filters;

  const filteredProjects = props.projects.filter(project => {
    const {consultant, partner, client, details} = project;

    if (!isShowingInActiveProjects && !details.isActive) return false;

    if (!searchFilterText) return true;

    const startDate = formatDate(details.startDate);
    const endDate = formatDate(details.endDate);

    return searchinize(
      `${consultant.name} ${consultant.type} ${startDate} ${endDate} ${partner && partner.name} ${client.name}`,
    ).includes(searchFilterText.toLowerCase());
  });

  return (
    <Container className="client-list">
      <Row className="page-title-container">
        <h1>{t('nav.projects')}</h1>
      </Row>
      <Row style={{marginBottom: '20px'}}>
        <Col lg={3} md={12}>
          <SearchStringInput
            value={searchFilterText}
            onChange={value => props.updateProjectFilters({...props.filters, searchFilterText: value})}
          />
        </Col>
        <Col lg={3} md={6}>
          <Switch
            value={isShowingInActiveProjects}
            onChange={isChecked => props.updateProjectFilters({...props.filters, isShowingInActiveProjects: isChecked})}
            label={t('project.showInactiveProjects')}
            onColor="#F2DEDE"
          />
        </Col>
        <Col lg={6} md={12} style={{textAlign: 'right'}}>
          <Button
            style={{marginRight: '10px'}}
            onClick={() => history.push('/projects/create')}
            size="sm"
            variant="outline-primary"
            data-tst="new-project"
            icon="fa fa-plus"
          >
            {t('project.createNew')}
          </Button>
          {modalProjectMonthId && (
            <ProjectMonthModal show={!!modalProjectMonthId} onClose={() => setModalProjectMonthId(undefined)} />
          )}
          <Button
            onClick={() => setModalProjectMonthId('new_project_month')}
            size="sm"
            variant="primary"
            data-tst="new-project"
            icon="fa fa-plus"
          >
            {t('project.newMonth')}
          </Button>
        </Col>
      </Row>

      <Table size="sm" style={{marginTop: 10}}>
        <ProjectsListHeader />
        <tbody>
          {filteredProjects.map(project => (
            <ProjectsListRow project={project} key={project.details._id} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default connect(
  (state: ConfacState) => {
    const projects = new ProjectReferenceResolver(state.projects, state.consultants, state.clients).getProjects();

    return {
      projects,
      consultants: state.consultants,
      clients: state.clients,
      filters: state.app.projectFilters,
    };
  },
  {updateProjectFilters},
)(ProjectsList);