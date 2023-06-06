import Cost from './Cost';
import DayWorked from './DayWorked';
import Project from './Project';
import Revenue from './Revenue';

type ProjectState = {
  projectId: String;
  project: Project | null;
  cost: Cost;
  revenue: Revenue;
  dayWorked: DayWorked;
  showCost: boolean;
  showRevenue: boolean;
  showDayWorked: boolean;
  showPopout: boolean;
  showDeletePopout: boolean;
  hasBeenModified: boolean;
  submitting: boolean;
  dataError: boolean;
  loading: boolean;
  data: Project | null;
};

export default ProjectState;
