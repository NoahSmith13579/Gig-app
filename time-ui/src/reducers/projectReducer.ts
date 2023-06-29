import { Reducer } from 'react';
import Project from '../entities/Project';
import ProjectState from '../entities/ProjectState';
import {
  getDefaultCost,
  getDefaultDay,
  getDefaultRevenue,
} from '../helpers/getDefault';
import { deleteProject, updateProject } from '../services/projectService';
import { toast } from 'react-toastify';
import Cost from '../entities/Cost';
import Revenue from '../entities/Revenue';
import DayWorked from '../entities/DayWorked';

export type Action =
  | { type: 'pageLoadState'; payload: { onLoadState: ProjectState } }
  | { type: 'remove_cost'; payload: { projectId: string } }
  | { type: 'remove_revenue'; payload: { projectId: string } }
  | { type: 'remove_day'; payload: { projectId: string } }
  | { type: 'append_cost'; payload: {} }
  | { type: 'append_revenue'; payload: {} }
  | { type: 'append_day'; payload: {} }
  | { type: 'close_cost'; payload: {} }
  | { type: 'close_revenue'; payload: {} }
  | { type: 'close_day'; payload: {} }
  | { type: 'pop_outside'; payload: {} }
  | { type: 'pop_outside_delete'; payload: {} }
  | { type: 'confirm_delete'; payload: {} }
  | { type: 'submit'; payload: {} }
  | { type: 'set_project'; payload: { data: Project | null } }
  | { type: 'set_modified'; payload: { bool: boolean } }
  | { type: 'set_cost'; payload: { cost: Cost } }
  | { type: 'set_revenue'; payload: { revenue: Revenue } }
  | { type: 'set_day'; payload: { dayWorked: DayWorked } }
  | { type: 'set_show_cost'; payload: { bool: boolean } }
  | { type: 'set_show_revenue'; payload: { bool: boolean } }
  | { type: 'set_show_day'; payload: { bool: boolean } }
  | { type: 'set_show_popout'; payload: { bool: boolean } }
  | { type: 'set_show_popout_delete'; payload: { bool: boolean } };

const projectReducer: Reducer<ProjectState, Action> = (
  state,
  action
): ProjectState => {
  let { project, cost, revenue, dayWorked } = state;
  switch (action.type) {
    case 'pageLoadState': {
      const newState = action.payload.onLoadState;

      return { ...newState };
    }
    case 'remove_cost': {
      const costs = project!.profit.costs.filter(
        (cost) => cost.id !== action.payload.projectId
      );

      const newProject: Project = {
        ...project!,
        profit: {
          ...project!.profit,
          costs,
        },
      };
      return { ...state, project: newProject };
    }
    case 'remove_revenue': {
      const revenues = project!.profit.revenues.filter(
        (revenue) => revenue.id !== action.payload.projectId
      );

      const newProject: Project = {
        ...project!,
        profit: {
          ...project!.profit,
          revenues,
        },
      };
      return { ...state, project: newProject };
    }
    case 'remove_day': {
      const daysWorked = project!.daysWorked.filter(
        (dayWorked) => dayWorked.id !== action.payload.projectId
      );

      const newProject: Project = {
        ...project!,
        daysWorked: daysWorked,
      };

      return { ...state, project: newProject };
    }
    case 'append_cost': {
      const newProject: Project = {
        ...project!,
        profit: {
          ...project!.profit,
          costs: [...project!.profit.costs, cost],
        },
      };
      return {
        ...state,
        project: newProject,
        showCost: false,
        cost: getDefaultCost(),
      };
    }
    case 'append_revenue': {
      const newProject: Project = {
        ...project!,
        profit: {
          ...project!.profit,
          revenues: [...project!.profit.revenues, revenue],
        },
      };
      return {
        ...state,
        project: newProject,
        showRevenue: false,
        revenue: getDefaultRevenue(),
      };
    }
    case 'append_day': {
      const newProject: Project = {
        ...project!,
        daysWorked: [...project!.daysWorked, dayWorked],
      };
      return {
        ...state,
        project: newProject,
        showDayWorked: false,
        dayWorked: getDefaultDay(),
      };
    }
    case 'close_cost': {
      if (state.showCost) {
        return { ...state, cost: getDefaultCost(), showCost: !state.showCost };
      }
      return { ...state, showCost: !state.showCost };
    }
    case 'close_revenue': {
      if (state.showRevenue) {
        return {
          ...state,
          revenue: getDefaultRevenue(),
          showRevenue: !state.showRevenue,
        };
      }
      return { ...state, showRevenue: !state.showRevenue };
    }
    case 'close_day': {
      if (state.showRevenue) {
        return {
          ...state,
          dayWorked: getDefaultDay(),
          showDayWorked: !state.showDayWorked,
        };
      }
      return { ...state, showDayWorked: !state.showDayWorked };
    }
    case 'pop_outside': {
      return { ...state, showPopout: !state.showPopout };
    }
    case 'pop_outside_delete': {
      return { ...state, showDeletePopout: !state.showDeletePopout };
    }
    case 'confirm_delete': {
      deleteProject(state.project!)
        .then(() => {
          toast.success('Deleted Project', { toastId: 'deleteProjectSuccess' });
        })
        .catch((err) =>
          toast.error('Cannot delete project - ' + err, {
            toastId: 'deleteProjectError',
          })
        );
      window.location.href = '/projects';
      return { ...state, showDeletePopout: false };
    }
    case 'submit': {
      //state.submitting = true;
      let newProject: Project;
      updateProject(state.project!)
        .then((resp) => {
          newProject = resp;
          toast.success('Updated project!', { toastId: 'updateProject' });
        })
        .catch((err) =>
          toast.error('Cannot update project - ' + err, {
            toastId: 'updateProjectError',
          })
        )
        .finally(() => {
          state.submitting = false;
          state.hasBeenModified = false;
          return {
            ...state,
            project: newProject,
            submitting: false,
            hasBeenModified: false,
          };
        });
      return { ...state, submitting: false, hasBeenModified: false };
    }
    case 'set_project': {
      return { ...state, project: action.payload.data };
    }
    case 'set_modified': {
      return { ...state, hasBeenModified: action.payload.bool };
    }
    case 'set_cost': {
      return { ...state, cost: action.payload.cost };
    }
    case 'set_show_cost': {
      return { ...state, showCost: action.payload.bool };
    }
    case 'set_revenue': {
      return { ...state, revenue: action.payload.revenue };
    }
    case 'set_show_revenue': {
      return { ...state, showRevenue: action.payload.bool };
    }
    case 'set_day': {
      return { ...state, dayWorked: action.payload.dayWorked };
    }
    case 'set_show_day': {
      return { ...state, showDayWorked: action.payload.bool };
    }
    case 'set_show_popout': {
      return { ...state, showPopout: action.payload.bool };
    }
    case 'set_show_popout_delete': {
      return { ...state, showDeletePopout: action.payload.bool };
    }
    default:
      return state;
  }
};

export default projectReducer;
