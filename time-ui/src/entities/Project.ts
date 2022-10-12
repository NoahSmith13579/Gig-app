import DayWorked from './DayWorked';
import Profit from './Profit';

interface Project {
    id: string;
    name: string;
    description: string | null;
    owner: string;
    ownerid: string;
    profit: Profit;
    daysWorked: DayWorked[];
}
export default Project;
