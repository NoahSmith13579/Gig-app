import {
  getDefaultCost,
  getDefaultDay,
  getDefaultRevenue,
} from '../helpers/getDefault';

export const initialState = {
  projectId: '',
  project: null,
  cost: getDefaultCost(),
  revenue: getDefaultRevenue(),
  dayWorked: getDefaultDay(),
  showCost: false,
  showRevenue: false,
  showDayWorked: false,
  showPopout: false,
  showDeletePopout: false,
  hasBeenModified: false,
  submitting: false,
  dataError: false,
  loading: false,
  data: null,
};
