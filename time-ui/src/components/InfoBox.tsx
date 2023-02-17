import Project from '../entities/Project';
import {
  calcTRev,
  calcTCost,
  calcProfit,
  calcTTimeWorked,
  calcProfitPerHour,
  calcReturnOnInvestment,
  conditionalFormattingIB,
} from '../helpers/InfoBoxHelpers';

interface InfoBoxProps {
  project: Project;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  project: { profit, daysWorked, description },
}) => {
  const costs = profit.costs;
  const revenues = profit.revenues;

  return (
    <div>
      <div>
        Total Revenue: ${' '}
        <span className={conditionalFormattingIB(calcTRev(revenues))}>
          {calcTRev(revenues)}
        </span>
      </div>
      <div>
        Total Cost: ${' '}
        <span className={conditionalFormattingIB(calcTCost(costs))}>
          {calcTCost(costs)}
        </span>
      </div>
      <div>
        Profit: ${' '}
        <span className={conditionalFormattingIB(calcProfit(costs, revenues))}>
          {calcProfit(costs, revenues)}
        </span>
      </div>
      <div>
        Total Time Worked: {calcTTimeWorked(daysWorked)}{' '}
        {calcProfitPerHour(costs, revenues, daysWorked) === 1
          ? 'hour'
          : 'hours'}
      </div>
      <div>
        {' '}
        Profit per Hour: ${' '}
        <span
          className={conditionalFormattingIB(
            calcProfitPerHour(costs, revenues, daysWorked)
          )}
        >
          {calcProfitPerHour(costs, revenues, daysWorked)}
        </span>
      </div>
      <div>
        ROI:{' '}
        <span
          className={conditionalFormattingIB(
            calcReturnOnInvestment(costs, revenues)
          )}
        >
          {calcReturnOnInvestment(costs, revenues)}
        </span>{' '}
        %
      </div>
      <div>
        Description:
        {description?.length != null && (
          <div className='card'>
            <h4>{description}</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoBox;
