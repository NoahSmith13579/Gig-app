import Cost from '../entities/Cost';
import DayWorked from '../entities/DayWorked';
import Revenue from '../entities/Revenue';

const calcTRev = (revenues: Revenue[]): number => {
  const reducer = (acc: number, curr: Revenue) => acc + curr.amount;

  const TotalRev = revenues.reduce(reducer, 0);

  return TotalRev;
};

const calcTCost = (costs: Cost[]): number => {
  const reducer = (acc: number, curr: Cost) => acc + curr.amount;

  const TotalCost = costs.reduce(reducer, 0);

  return TotalCost;
};

const calcProfit = (costs: Cost[], revenues: Revenue[]): number => {
  const Profit = calcTRev(revenues) - calcTCost(costs);

  return Profit;
};

const calcTTimeWorked = (daysWorked: DayWorked[]): number => {
  const reducer = (acc: number, curr: DayWorked) => acc + curr.timeWorked;

  const TotalTimeWorked = daysWorked.reduce(reducer, 0) / 3600;

  return TotalTimeWorked;
};

const calcProfitPerHour = (
  costs: Cost[],
  revenues: Revenue[],
  daysWorked: DayWorked[]
): number => {
  let ProfitPerHour = calcProfit(costs, revenues) / calcTTimeWorked(daysWorked);
  ProfitPerHour = Math.round((ProfitPerHour + Number.EPSILON) * 100) / 100;
  if (isNaN(ProfitPerHour)) {
    ProfitPerHour = 0;
  }

  return ProfitPerHour;
};

const calcReturnOnInvestment = (costs: Cost[], revenues: Revenue[]): number => {
  const Profit = calcProfit(costs, revenues);
  const Cost = calcTCost(costs);

  let ROI = (Profit / Cost) * 100;
  if (isNaN(ROI)) {
    ROI = 0;
  }

  return ROI;
};

const conditionalFormattingIB = (func: number): string => {
  const conditon = func >= 1 ? 'green' : 'red';

  return conditon;
};

export {
  calcTRev,
  calcTCost,
  calcProfit,
  calcTTimeWorked,
  calcProfitPerHour,
  calcReturnOnInvestment,
  conditionalFormattingIB,
};
