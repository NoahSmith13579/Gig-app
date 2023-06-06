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
  // TODO this could be a break point
  let {
    project,
    projectId,
    cost,
    revenue,
    dayWorked,
    showCost,
    showRevenue,
    showDayWorked,
    showPopout,
    showDeletePopout,
    hasBeenModified,
    submitting,
    dataError,
    loading,
    data,
  } = state;

  switch (action.type) {
    case 'pageLoadState': {
      state = action.payload.onLoadState;
      return state;
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
      state.project = newProject;
      return state;
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
      state.project = newProject;
      return state;
    }
    case 'remove_day': {
      const daysWorked = project!.daysWorked.filter(
        (dayWorked) => dayWorked.id !== action.payload.projectId
      );

      const newProject: Project = {
        ...project!,
        daysWorked: daysWorked,
      };

      state.project = newProject;

      return state;
    }
    case 'append_cost': {
      const newProject: Project = {
        ...project!,
        profit: {
          ...project!.profit,
          costs: [...project!.profit.costs, cost],
        },
      };
      state.project = newProject;
      state.showCost = false;
      state.cost = getDefaultCost();
      return state;
    }
    case 'append_revenue': {
      const newProject: Project = {
        ...project!,
        profit: {
          ...project!.profit,
          revenues: [...project!.profit.revenues, revenue],
        },
      };
      state.project = newProject;
      state.showRevenue = false;
      state.revenue = getDefaultRevenue();
      return state;
    }
    case 'append_day': {
      const newProject: Project = {
        ...project!,
        daysWorked: [...project!.daysWorked, dayWorked],
      };
      state.project = newProject;
      state.showDayWorked = false;
      state.dayWorked = getDefaultDay();
      return state;
    }
    case 'close_cost': {
      if (state.showCost) {
        state.cost = getDefaultCost();
      }
      state.showCost = !state.showCost;
      return state;
    }
    case 'close_revenue': {
      if (state.showRevenue) {
        state.revenue = getDefaultRevenue();
      }
      state.showRevenue = !state.showRevenue;
      return state;
    }
    case 'close_day': {
      if (state.showDayWorked) {
        state.dayWorked = getDefaultDay();
      }
      state.showDayWorked = !state.showRevenue;
      return state;
    }
    case 'pop_outside': {
      state.showPopout = !state.showPopout;
      return state;
    }
    case 'pop_outside_delete': {
      state.showDeletePopout = !state.showDeletePopout;
      return state;
    }
    case 'confirm_delete': {
      state.showDeletePopout = false;
      deleteProject(state.project!)
        .then(() => {
          toast.success('Deleted Project');
        })
        .catch((err) => toast.error('Cannot delete project - ' + err));
      window.location.href = '/projects';
      return state;
    }
    case 'submit': {
      state.submitting = true;
      updateProject(state.project!)
        .then((resp) => {
          state.project = resp;
          toast.success('Updated project!');
        })
        .catch((err) => toast.error('Cannot update project - ' + err))
        .finally(() => {
          state.submitting = false;
          state.hasBeenModified = false;
        });
      return state;
    }
    case 'set_project': {
      state.project = action.payload.data;
      return state;
    }
    case 'set_modified': {
      state.hasBeenModified = action.payload.bool;
      return state;
    }
    case 'set_cost': {
      state.cost = action.payload.cost;
      return state;
    }
    case 'set_show_cost': {
      state.showCost = action.payload.bool;
      return state;
    }
    case 'set_revenue': {
      state.revenue = action.payload.revenue;
      return state;
    }
    case 'set_show_revenue': {
      state.showRevenue = action.payload.bool;
      return state;
    }
    case 'set_day': {
      state.dayWorked = action.payload.dayWorked;
      return state;
    }
    case 'set_show_day': {
      state.showDayWorked = action.payload.bool;
      return state;
    }
    case 'set_show_popout': {
      state.showPopout = action.payload.bool;
      return state;
    }
    case 'set_show_popout_delete': {
      state.showDeletePopout = action.payload.bool;
      return state;
    }
    default:
      return state;
  }
};

export default projectReducer;
