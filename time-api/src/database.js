module.exports = (db) => {
    const projectsCol = db.collection("projects");

    /**
     * Get all projects from the database.
     */
    const getProjects = async () => projectsCol.find({}).toArray();

    /**
     * Get a project by id from the database.
     */
    const getProject = async (id) => projectsCol.findOne({ id });

    /**
     * Create a new project.
     */
    const createProject = async (project) => projectsCol.insert(project);

    /**
     * Update a single project.
     */
    const updateProject = async (project) =>
        projectsCol.updateOne(
            { id: project.id },
            {
                $set: {
                    id: project.id,
                    profit: project.profit,
                    daysWorked: project.daysWorked,
                },
            }
        );

    /**
     * Delete a project.
     */
    const deleteProject = async (projectId) =>
        projectsCol.deleteOne({ id: projectId });

    return {
        getProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
    };
};
