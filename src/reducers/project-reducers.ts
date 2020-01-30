/* eslint-disable no-param-reassign */
import moment from 'moment';
import {ACTION_TYPES} from '../actions';
import {ProjectModel} from '../components/project/models/ProjectModel';


function mapProject(prj: ProjectModel) {
  // prj.startDate = moment(prj.startDate);
  // if (prj.endDate) {
  //   prj.endDate = moment(prj.endDate);
  // }
  return prj;
}

export const projects = (state: ProjectModel[] = [], action): ProjectModel[] => {
  switch (action.type) {
    case ACTION_TYPES.PROJECTS_FETCHED:
      return action.projects.map(mapProject);
    case ACTION_TYPES.PROJECT_UPDATE: {
      const newState: ProjectModel[] = [...state, mapProject(action.project)];
      return newState;
    }
    default:
      return state;
  }
};
