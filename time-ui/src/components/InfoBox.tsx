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

  const totalRevenue = calcTRev(revenues);
  const totalCost = calcTCost(costs);
  const totalProfit = calcProfit(costs, revenues);
  const totalTimeWorked = calcTTimeWorked(daysWorked);
  const ProfitPerHour = calcProfitPerHour(costs, revenues, daysWorked);
  const ROI = calcReturnOnInvestment(costs, revenues);

  return (
    <section className='card ml-auto'>
      <ul className='no-list-style'>
        <li>
          Total Revenue: ${' '}
          <span className={conditionalFormattingIB(totalRevenue)}>
            {totalRevenue}
          </span>
        </li>
        <li>
          Total Cost: ${' '}
          <span className={conditionalFormattingIB(-totalCost)}>
            {totalCost}
          </span>
        </li>
        <li>
          Profit: ${' '}
          <span className={conditionalFormattingIB(totalProfit)}>
            {totalProfit}
          </span>
        </li>
        <li>
          Total Time Worked: {totalTimeWorked}{' '}
          {ProfitPerHour === 1 ? 'hour' : 'hours'}
        </li>
        <li>
          {' '}
          Profit per Hour: ${' '}
          <span className={conditionalFormattingIB(ProfitPerHour)}>
            {Math.abs(ProfitPerHour) === Infinity ? 'N/A' : ProfitPerHour}
          </span>
        </li>
        <li>
          ROI: <span className={conditionalFormattingIB(ROI)}>{ROI}</span> %
        </li>
        {description?.length !== 0 && (
          <li>
            Description:
            <div className='card' id='infobox-desc'>
              <h5>{description}</h5>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
};

export default InfoBox;
