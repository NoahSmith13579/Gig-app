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
  const ProfitPerHour =
    calcProfit(costs, revenues) / calcTTimeWorked(daysWorked);

  return ProfitPerHour;
};

const calcReturnOnInvestment = (costs: Cost[], revenues: Revenue[]): number => {
  const Profit = Math.max(calcProfit(costs, revenues), 1);
  const Cost = Math.max(calcTCost(costs), 1);

  const ReturnOnInvestment = (Profit / Cost) * 100;

  return ReturnOnInvestment;
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
