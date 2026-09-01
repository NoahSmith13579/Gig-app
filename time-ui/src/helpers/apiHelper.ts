const API_URL = process.env.REACT_APP_API_URL_PROD;

interface ApiResponse<T> {
  content: T;
  success: boolean;
  message?: string;
}

interface RequestParams {
  method?: string;
  body?: string | any;
  headers?: Headers;
}

// Local storage utilities for anonymous mode
const PROJECTS_STORAGE_KEY = 'anonymous_projects';

const getStoredProjects = (path: string): any => {
  const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
  const projects = stored ? JSON.parse(stored) : [];

  // Handle /api/projects (get all)
  if (path === '/api/projects') {
    return projects;
  }

  // Handle /api/projects/:id (get single)
  const match = path.match(/\/api\/projects\/(.+)$/);
  if (match) {
    const id = match[1];
    const project = projects.find((p: any) => p.id === id);
    if (!project) {
      throw new Error(`Project not found: ${id}`);
    }
    return project;
  }

  throw new Error(`Unknown path: ${path}`);
};

const saveProjects = (projects: any): void => {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
};

const handleLocalStorageRequest = async <T>(
  url: string,
  params: RequestParams
): Promise<ApiResponse<T>> => {
  const method = params.method?.toUpperCase() || 'GET';

  try {
    if (method === 'GET') {
      const data = getStoredProjects(url);
      return {
        content: data as T,
        success: true,
      };
    }

    // Helper to ensure body is an object
    const getBodyAsObject = (body: any): any => {
      if (typeof body === 'string') {
        return JSON.parse(body);
      }
      return body;
    };

    if (method === 'POST') {
      const projects = localStorage.getItem(PROJECTS_STORAGE_KEY)
        ? JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY)!)
        : [];
      const newProject = getBodyAsObject(params.body);
      projects.push(newProject);
      saveProjects(projects);
      return {
        content: newProject as T,
        success: true,
      };
    }

    if (method === 'PUT') {
      const match = url.match(/\/api\/projects\/(.+)$/);
      if (!match) throw new Error('Invalid URL for update');

      const id = match[1];
      const projects = localStorage.getItem(PROJECTS_STORAGE_KEY)
        ? JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY)!)
        : [];
      const index = projects.findIndex((p: any) => p.id === id);
      if (index === -1) throw new Error(`Project not found: ${id}`);

      const updatedProject = getBodyAsObject(params.body);
      projects[index] = updatedProject;
      saveProjects(projects);
      return {
        content: updatedProject as T,
        success: true,
      };
    }

    if (method === 'DELETE') {
      const match = url.match(/\/api\/projects\/(.+)$/);
      if (!match) throw new Error('Invalid URL for delete');

      const id = match[1];
      const projects = localStorage.getItem(PROJECTS_STORAGE_KEY)
        ? JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY)!)
        : [];
      
      // Find the project to verify it exists before filtering
      const projectExists = projects.some((p: any) => p.id === id);
      if (!projectExists) {
        throw new Error(`Project not found: ${id}`);
      }

      const filteredProjects = projects.filter((p: any) => p.id !== id);
      saveProjects(filteredProjects);
      
      return {
        content: {} as T,
        success: true,
      };
    }

    throw new Error(`Unsupported method: ${method}`);
  } catch (err) {
    throw new Error(
      `Local storage operation failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
};

/**
 * Fetches from provided url and returns as JSON.
 * A fetch wrapper with error handling.
 * If user is anonymous, uses local storage instead of making HTTP requests.
 *
 */
const doRequest = async <T>(
  url: string,
  params: RequestParams
): Promise<ApiResponse<T>> => {
  // Check if user is anonymous by looking at localStorage auth state
  let isAnonymous = false;
  try {
    const authStateStr = localStorage.getItem('authState');
    if (authStateStr) {
      const authState = JSON.parse(authStateStr);
      isAnonymous = authState.isAnonymous === true;
    }
  } catch (e) {
    // If there's any error parsing authState, assume not anonymous
    isAnonymous = false;
  }

  // Use local storage for anonymous users on project endpoints
  if (isAnonymous && url.startsWith('/api/projects')) {
    return handleLocalStorageRequest<T>(url, params);
  }

  // Regular API request for authenticated users or non-project endpoints
  if (typeof params.body !== 'undefined' && typeof params.body !== 'string') {
    params.body = JSON.stringify(params.body);
  }

  const response = await fetch(API_URL + url, params);

  if (response.status !== 200) {
    throw new Error(
      `Request failed with status ${response.status}: ${response.statusText}`
    );
  }

  return (await response.json()) as ApiResponse<T>;
};

export { doRequest };
export type { ApiResponse, RequestParams };
