import {
    JSXElementConstructor,
    ReactElement,
    ReactFragment,
    useEffect,
} from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useService } from '../helpers/useData';
import { getProjects } from '../services/projectService';

const Adminpage = () => {
    const { authState } = useAuth();

    const [err, loading, projects] = useService(getProjects);

    let uniqueUsers: number = -1;
    let projNum: number = -1;
    if (!loading && projects !== null) {
        uniqueUsers = projects
            .map((project) => project.ownerid)
            .filter(
                (ownerid, index, self) => self.indexOf(ownerid) === index
            ).length;
        projNum = projects.length;
    }

    return (
        <>
            <div>Admin Page</div>
            <div className='card'>
                <table>
                    <thead>
                        <tr>
                            <td>Number of Users</td>
                            <td>Number of projects</td>
                            <td>value 3</td>
                            <td>value 4</td>
                            <td>value 5</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{uniqueUsers}</td>
                            <td>{projNum}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Adminpage;
