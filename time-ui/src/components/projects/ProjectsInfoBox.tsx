import DayWorked from '../../entities/DayWorked';
import Profit from '../../entities/Profit';

//TODO is this used anywhere?

interface ProjectsInfoBoxProps {
    profit: Profit;
    daysWorked: DayWorked[];
}

const ProjectsInfoBox: React.FC<ProjectsInfoBoxProps> = ({
    profit,
    daysWorked,
}) => {
    return <div className='card'></div>;
};

export default ProjectsInfoBox;
