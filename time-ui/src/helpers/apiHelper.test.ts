import { doRequest } from './apiHelper';

const storageKey = 'anonymous_projects';

describe('anonymous project requests', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('authState', JSON.stringify({ isAnonymous: true }));
  });

  it('creates, reads, updates, and deletes projects in local storage', async () => {
    const project = {
      id: 'project-1',
      name: 'Garden',
      description: null,
      owner: 'Alex',
    };

    const created = await doRequest<typeof project>('/api/projects', {
      method: 'POST',
      body: project,
    });
    expect(created).toEqual({ content: project, success: true });
    expect(JSON.parse(localStorage.getItem(storageKey) || '[]')).toEqual([
      project,
    ]);

    const listed = await doRequest<typeof project[]>('/api/projects', {});
    expect(listed.content).toEqual([project]);

    const fetched = await doRequest<typeof project>('/api/projects/project-1', {});
    expect(fetched.content).toEqual(project);

    const updatedProject = { ...project, name: 'Kitchen garden' };
    const updated = await doRequest<typeof project>(
      '/api/projects/project-1',
      { method: 'PUT', body: updatedProject }
    );
    expect(updated.content).toEqual(updatedProject);
    expect(JSON.parse(localStorage.getItem(storageKey) || '[]')).toEqual([
      updatedProject,
    ]);

    const deleted = await doRequest<{}>('/api/projects/project-1', {
      method: 'DELETE',
    });
    expect(deleted).toEqual({ content: {}, success: true });
    expect(JSON.parse(localStorage.getItem(storageKey) || '[]')).toEqual([]);
  });

  it('rejects reads, updates, and deletes for missing projects', async () => {
    await expect(
      doRequest('/api/projects/missing-project', {})
    ).rejects.toThrow('Project not found: missing-project');

    await expect(
      doRequest('/api/projects/missing-project', {
        method: 'PUT',
        body: { id: 'missing-project' },
      })
    ).rejects.toThrow('Project not found: missing-project');

    await expect(
      doRequest('/api/projects/missing-project', { method: 'DELETE' })
    ).rejects.toThrow('Project not found: missing-project');
  });

  it('rejects unsupported methods', async () => {
    await expect(
      doRequest('/api/projects', { method: 'PATCH' })
    ).rejects.toThrow('Unsupported method: PATCH');
  });
});
