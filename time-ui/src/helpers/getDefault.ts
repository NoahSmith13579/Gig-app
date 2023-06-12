import Cost from '../entities/Cost';
import DayWorked from '../entities/DayWorked';
import Revenue from '../entities/Revenue';
import { v4 as uuid } from 'uuid';

const getDefaultCost = (): Cost => ({
  id: uuid(),
  name: 'Default Cost Name',
  amount: 0,
  date: new Date(),
});

const getDefaultRevenue = (): Revenue => ({
  id: uuid(),
  name: 'Default Revenue Name',
  amount: 0,
  date: new Date(),
});

const getDefaultDay = (): DayWorked => ({
  id: uuid(),
  projectId: uuid(),
  notes: '',
  startDate: new Date(),
  timeWorked: 28800,
});

export { getDefaultCost, getDefaultRevenue, getDefaultDay };
