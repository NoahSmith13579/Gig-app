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
    <section className='card ml-auto'>
      <ul className='no-list-style'>
        <li>
          Total Revenue: ${' '}
          <span className={conditionalFormattingIB(calcTRev(revenues))}>
            {calcTRev(revenues)}
          </span>
        </li>
        <li>
          Total Cost: ${' '}
          <span className={conditionalFormattingIB(calcTCost(costs))}>
            {calcTCost(costs)}
          </span>
        </li>
        <li>
          Profit: ${' '}
          <span
            className={conditionalFormattingIB(calcProfit(costs, revenues))}
          >
            {calcProfit(costs, revenues)}
          </span>
        </li>
        <li>
          Total Time Worked: {calcTTimeWorked(daysWorked)}{' '}
          {calcProfitPerHour(costs, revenues, daysWorked) === 1
            ? 'hour'
            : 'hours'}
        </li>
        <li>
          {' '}
          Profit per Hour: ${' '}
          <span
            className={conditionalFormattingIB(
              calcProfitPerHour(costs, revenues, daysWorked)
            )}
          >
            {calcProfitPerHour(costs, revenues, daysWorked)}
          </span>
        </li>
        <li>
          ROI:{' '}
          <span
            className={conditionalFormattingIB(
              calcReturnOnInvestment(costs, revenues)
            )}
          >
            {calcReturnOnInvestment(costs, revenues)}
          </span>{' '}
          %
        </li>
        {description?.length !== 0 && (
          <li>
            Description:
            <div className='card'>
              <h5>{description}</h5>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
};

export default InfoBox;
