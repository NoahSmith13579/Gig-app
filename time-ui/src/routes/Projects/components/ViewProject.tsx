import React from 'react';
import { useParams } from 'react-router-dom';
import { useService } from '../../../helpers/useData';
import Spinner from '../../../components/Spinner';
import {
    getProject,
    updateProject,
    deleteProject,
} from '../../../services/projectService';
import {
    dateFormatter,
    secondsToHours,
    addSeconds,
} from '../../../helpers/dateHelper';
import Trash from '../../../components/icons/Trash';
import Project from '../../../entities/Project';
import Revenue from '../../../entities/Revenue';
import Cost from '../../../entities/Cost';
import { v4 as uuid } from 'uuid';
import AddCostBox from './AddCostBox';
import AddRevenueBox from './AddRevenueBox';
import { toast } from 'react-toastify';
import AddDayWorkedBox from './AddDateWorkedBox';
import DayWorked from '../../../entities/DayWorked';
import InfoBox from '../../../components/InfoBox';
import usePagination from '../../../components/usePagination';
import PopOut from '../../../components/PopoutBox';
import Pagination from '../../../components/PaginationNav';
import { useAuth } from '../../../contexts/AuthContext';

interface ProjectParams {
    projectId: string;
}

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

const ViewProject: React.FC = () => {
    const { projectId } = useParams<keyof ProjectParams>() as ProjectParams;

    const [dataError, loading, data] = useService(() => getProject(projectId));
    const [project, setProject] = React.useState(data);

    const authState = useAuth();
    const loggedin = authState.authState.loggedIn;

    const getDefaultDay = (): DayWorked => ({
        id: uuid(),
        projectId: uuid(),
        notes: '',
        startDate: new Date(),
        timeWorked: 28800,
    });

    const [cost, setCost] = React.useState<Cost>(getDefaultCost());
    const [revenue, setRevenue] = React.useState<Revenue>(getDefaultRevenue());
    const [dayWorked, setDayWorked] = React.useState<DayWorked>(
        getDefaultDay()
    );

    const [showCost, setShowCost] = React.useState(false);
    const [showRevenue, setShowRevenue] = React.useState(false);
    const [showDayWorked, setShowDayWorked] = React.useState(false);
    const [showPopout, setShowPopout] = React.useState(false);
    const [showDeletePopout, setShowDeletePopout] = React.useState(false);

    const [hasBeenModified, setHasBeenModified] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        setProject(data);
    }, [data]);

    React.useEffect(() => {
        setHasBeenModified(!loading && project !== data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]);

    const hasData = !loading && !!project;

    const isSameUser =
        project !== null && project.ownerid === authState.authState.userid;

    const handleRemoveCost = (id: string) => {
        const costs = project!.profit.costs.filter((cost) => cost.id !== id);

        const newProject: Project = {
            ...project!,
            profit: {
                ...project!.profit,
                costs,
            },
        };

        setProject(newProject);
    };

    const handleRemoveRevenue = (id: string) => {
        const revenues = project!.profit.revenues.filter(
            (revenue) => revenue.id !== id
        );

        const newProject: Project = {
            ...project!,
            profit: {
                ...project!.profit,
                revenues,
            },
        };

        setProject(newProject);
    };

    const handleRemoveDayWorked = (id: string) => {
        const daysWorked = project!.daysWorked.filter(
            (dayWorked) => dayWorked.id !== id
        );

        const newProject: Project = {
            ...project!,
            daysWorked: daysWorked,
        };

        setProject(newProject);
    };

    const handleAppendCost = () => {
        const newProject: Project = {
            ...project!,
            profit: {
                ...project!.profit,
                costs: [...project!.profit.costs, cost],
            },
        };

        setProject(newProject);

        setShowCost(false);

        setCost(getDefaultCost());
    };

    const handleAppendRevenue = () => {
        const newProject: Project = {
            ...project!,
            profit: {
                ...project!.profit,
                revenues: [...project!.profit.revenues, revenue],
            },
        };

        setProject(newProject);

        setShowRevenue(false);

        setRevenue(getDefaultRevenue());
    };

    const handleAppendDaysWorked = () => {
        const newProject: Project = {
            ...project!,
            daysWorked: [...project!.daysWorked, dayWorked],
        };

        setProject(newProject);

        setShowDayWorked(false);

        setDayWorked(getDefaultDay());
    };

    const handleCloseCost = () => {
        setShowCost(false);
        setCost(getDefaultCost());
    };

    const handleCloseRevenue = () => {
        setShowRevenue(false);
        setRevenue(getDefaultRevenue());
    };

    const handleCloseDayWorked = () => {
        setShowDayWorked(false);
        setDayWorked(getDefaultDay());
    };

    const PopOutClickOutside = () => {
        setShowPopout(false);
    };

    const PopOutClickOutsideDelete = () => {
        setShowDeletePopout(false);
    };

    const handleConfirmDelete = () => {
        setShowDeletePopout(false);
        deleteProject(project!)
            .then(() => {
                toast.success('Deleted Project');
            })
            .catch((err) => toast.error('Cannot delete project - ' + err));
        window.location.href = '/projects';
    };

    const handleSubmit = () => {
        setSubmitting(true);

        updateProject(project!)
            .then((resp) => {
                setProject(resp);
                toast.success('Updated project!');
            })
            .catch((err) => toast.error('Cannot update project - ' + err))
            .finally(() => {
                setSubmitting(false);
                setHasBeenModified(false);
            });
    };

    const [currentPageCosts, currentDataCosts, pageCountCosts, goToPageCosts] =
        usePagination(!!project ? project.profit.costs : [], 10);

    const [
        currentPageRevenues,
        currentDataRevenues,
        pageCountRevenues,
        goToPageRevenues,
    ] = usePagination(!!project ? project.profit.revenues : [], 10);

    const [
        currentPageDaysWorked,
        currentDataDaysWorked,
        pageCountDaysWorked,
        goToPageDaysWorked,
    ] = usePagination(!!project ? project.daysWorked : [], 10);

    return (
        <div>
            {hasData && (
                <>
                    <h2 className='mb-0'>{project.name}</h2>
                    <p className='subtitle p-0'>Owned by {project.owner}.</p>
                </>
            )}
            {loading ? (
                <>
                    <h4>Getting Project Data</h4>
                    <Spinner />
                </>
            ) : project === null ? (
                <h4>Data no here.</h4>
            ) : (
                <></>
            )}
            {loggedin ? (
                <>
                    {isSameUser ? (
                        <></>
                    ) : (
                        <>
                            {' '}
                            <div>
                                {' '}
                                You are currently viewing a project that you do
                                not own. To edit this project, log in as the
                                project creator.
                            </div>
                        </>
                    )}{' '}
                    {hasData && (
                        <div className='flex row grow'>
                            <div className='card col'>
                                <p className='m-1'>Costs:</p>
                                <div className='card'>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td>Id</td>
                                                <td>Name</td>
                                                <td>Amount ($)</td>
                                                <td>Date</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentDataCosts.map((cost) => (
                                                <tr key={cost.id}>
                                                    <td>
                                                        {cost.id.substring(
                                                            0,
                                                            6
                                                        )}
                                                    </td>
                                                    <td>{cost.name}</td>
                                                    <td>{cost.amount}</td>
                                                    <td>
                                                        {dateFormatter(
                                                            cost.date
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Trash
                                                            classNames={
                                                                'button-danger'
                                                            }
                                                            onClick={() =>
                                                                handleRemoveCost(
                                                                    cost.id
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <hr />
                                    <Pagination
                                        currentData={currentDataCosts}
                                        currentPage={currentPageCosts}
                                        pageCount={pageCountCosts}
                                        goToPage={(x) => goToPageCosts(x)}
                                        pageSize={10}
                                    />
                                    {showCost && isSameUser ? (
                                        <AddCostBox
                                            cost={cost}
                                            onSubmit={handleAppendCost}
                                            onCancel={handleCloseCost}
                                            onChange={setCost}
                                        />
                                    ) : (
                                        <button
                                            disabled={!isSameUser}
                                            onClick={() => {
                                                handleCloseCost();
                                                setShowCost(true);
                                            }}
                                        >
                                            Add New Cost
                                        </button>
                                    )}
                                </div>
                                <p className='m-1'>Revenues:</p>
                                <div className='card'>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td>Id</td>
                                                <td>Name</td>
                                                <td>Amount ($)</td>
                                                <td>Date</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {project.profit.revenues.map(
                                                (revenue) => (
                                                    <tr key={revenue.id}>
                                                        <td>
                                                            {revenue.id.substring(
                                                                0,
                                                                6
                                                            )}
                                                        </td>
                                                        <td>{revenue.name}</td>
                                                        <td>
                                                            {revenue.amount}
                                                        </td>
                                                        <td>
                                                            {dateFormatter(
                                                                revenue.date
                                                            )}
                                                        </td>
                                                        <td>
                                                            <Trash
                                                                classNames={
                                                                    'button-danger'
                                                                }
                                                                onClick={() =>
                                                                    handleRemoveRevenue(
                                                                        revenue.id
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                    <hr />
                                    <Pagination
                                        currentData={currentDataRevenues}
                                        currentPage={currentPageRevenues}
                                        pageCount={pageCountRevenues}
                                        goToPage={(x) => goToPageRevenues(x)}
                                        pageSize={10}
                                    />
                                    {showRevenue && isSameUser ? (
                                        <AddRevenueBox
                                            revenue={revenue}
                                            onSubmit={handleAppendRevenue}
                                            onCancel={handleCloseRevenue}
                                            onChange={setRevenue}
                                        />
                                    ) : (
                                        <button
                                            disabled={!isSameUser}
                                            onClick={() => {
                                                handleCloseCost();
                                                setShowRevenue(true);
                                            }}
                                        >
                                            Add New Revenue
                                        </button>
                                    )}
                                </div>

                                {hasBeenModified && isSameUser && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                    >
                                        Submit Changes
                                    </button>
                                )}
                            </div>

                            <div className='card'>
                                <p className='m-1'>Days Worked:</p>
                                <div className='card'>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td>Notes</td>
                                                <td>StartTime</td>
                                                <td>EndTime</td>
                                                <td>Time Worked</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {project.daysWorked.map(
                                                (dayWorked) => (
                                                    <>
                                                        {showPopout && (
                                                            <PopOut
                                                                title={'Note'}
                                                                body={
                                                                    dayWorked.notes
                                                                }
                                                                onClick={() =>
                                                                    setShowPopout(
                                                                        false
                                                                    )
                                                                }
                                                                PopOutClickOutside={
                                                                    PopOutClickOutside
                                                                }
                                                            />
                                                        )}
                                                        <tr key={dayWorked.id}>
                                                            <td>
                                                                <button
                                                                    onClick={() =>
                                                                        setShowPopout(
                                                                            true
                                                                        )
                                                                    }
                                                                >
                                                                    {dayWorked.notes.substring(
                                                                        0,
                                                                        6
                                                                    )}
                                                                    ...
                                                                </button>
                                                            </td>
                                                            <td>
                                                                {dateFormatter(
                                                                    dayWorked.startDate
                                                                )}
                                                            </td>
                                                            <td>
                                                                {dateFormatter(
                                                                    addSeconds(
                                                                        dayWorked.startDate,
                                                                        dayWorked.timeWorked
                                                                    )
                                                                )}
                                                            </td>
                                                            <td>
                                                                {secondsToHours(
                                                                    dayWorked.timeWorked
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Trash
                                                                    classNames={
                                                                        'button-danger'
                                                                    }
                                                                    onClick={() =>
                                                                        handleRemoveDayWorked(
                                                                            dayWorked.id
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            )}
                                        </tbody>
                                    </table>

                                    <hr />
                                    <Pagination
                                        currentData={currentDataDaysWorked}
                                        currentPage={currentPageDaysWorked}
                                        pageCount={pageCountDaysWorked}
                                        goToPage={(x) => goToPageDaysWorked(x)}
                                        pageSize={10}
                                    />
                                    {showDayWorked && isSameUser ? (
                                        <AddDayWorkedBox
                                            dayWorked={dayWorked}
                                            onSubmit={handleAppendDaysWorked}
                                            onCancel={handleCloseDayWorked}
                                            onChange={setDayWorked}
                                        />
                                    ) : (
                                        <button
                                            disabled={!isSameUser}
                                            onClick={() => {
                                                handleCloseDayWorked();
                                                setShowDayWorked(true);
                                            }}
                                        >
                                            Add New Day Worked
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className='card ml-auto'>
                                <InfoBox project={project} />
                            </div>
                        </div>
                    )}
                    {showDeletePopout && (
                        <PopOut
                            title={'Delete this project?'}
                            body={
                                'If you confirm to delete, this project will be gone forever.'
                            }
                            onClick={() => setShowDeletePopout(false)}
                            PopOutClickOutside={PopOutClickOutsideDelete}
                            onConfirmDelete={handleConfirmDelete}
                        />
                    )}
                    {isSameUser && (
                        <button
                            onClick={() => setShowDeletePopout(true)}
                            style={{ background: 'red' }}
                        >
                            Delete Project
                        </button>
                    )}
                </>
            ) : (
                <div>To view or modify a project, please log in.</div>
            )}

            <a href='/projects'>Back to Projects</a>
        </div>
    );
};

export default ViewProject;
