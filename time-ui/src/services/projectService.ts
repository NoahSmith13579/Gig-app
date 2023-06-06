import Project from '../entities/Project';
import { ApiResponse, doRequest } from '../helpers/apiHelper';
import makeLog from '../helpers/makeLog';

const { log, debug } = makeLog('projectService');

/**
 * Replace string formatted dates with Date objects because the deserializer
 * treats them as strings.
 */
const formatProjectDates = (project: Project): Project => {
  return {
    ...project,
    profit: {
      ...project.profit,
      costs: project.profit.costs.map((cost) => ({
        ...cost,
        date: new Date(cost.date as unknown as string),
      })),
      revenues: project.profit.revenues.map((revenue) => ({
        ...revenue,
        date: new Date(revenue.date as unknown as string),
      })),
    },
    daysWorked: project.daysWorked.map((Daysworked) => ({
      ...Daysworked,
      startDate: new Date(Daysworked.startDate as unknown as string),
    })),
  };
};

/**
 * Posts the input data to the server
 *
 */
const createProject = async (
  payload: Project
): Promise<ApiResponse<Project>> => {
  debug('createProject() ' + JSON.stringify(payload));

  return await doRequest('/projects', {
    body: payload,
    method: 'POST',
  });
};

/**
 * Returns all projects from database
 */
const getProjects = async (): Promise<Project[]> => {
  debug('getProjects()');

  const resp = await doRequest<Project[]>('/projects', {});

  return resp.content;
};

/**
 * Returns project with specified id from the database
 */
const getProject = async (projectId: string): Promise<Project> => {
  debug(`getProject(${projectId})`);

  const { content: proj } = await doRequest<Project>(
    `/projects/${projectId}`,
    {}
  );
  debugger;
  return formatProjectDates(proj);
};

/**
 * Replaces project at id with the data supplied and formats data
 * with formatProjectDates
 */
const updateProject = async (project: Project): Promise<Project> => {
  debug(`updateProject(${project.id})`);

  const { content: proj } = await doRequest<Project>(
    `/projects/${project.id}`,
    {
      body: project,
      method: 'PUT',
    }
  );

  return formatProjectDates(proj);
};

const deleteProject = async (project: Project): Promise<Project> => {
  debug(`DeleteProject(${project.id})`);
  await doRequest<Project>(`/projects/${project.id}`, {
    body: project,
    method: 'Delete',
  });
  return formatProjectDates(project);
};

export { createProject, getProject, getProjects, updateProject, deleteProject };
