import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../../components/Spinner';
import ValidatedTextbox from '../../../components/ValidatedTextbox';
import Project from '../../../entities/Project';
import { createProject } from '../../../services/projectService';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const {
    authState: { userid, loggedIn, name, isAnonymous },
  } = useAuth();

  const [loading, setLoading] = React.useState(false);

  const [projectName, setProjectName] = React.useState('');
  const [projectDesc, setDesc] = React.useState('');
  const [projectOwner, setOwner] = React.useState(name as string);

  // Check if user can create projects (either logged in or in anonymous/offline mode)
  const canCreateProject = loggedIn || isAnonymous;

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const isValid = !validateName() && !validateOwner() && !validateDesc();

    if (!isValid) {
      toast.error('Validation error. Please check all fields are filled in.', {
        toastId: 'ValidationError',
      });

      return;
    }

    const payload: Project = {
      id: isAnonymous ? `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : '',
      name: projectName,
      description: projectDesc,
      owner: projectOwner,
      ownerid: userid!,
      profit: {
        costs: [],
        revenues: [],
      },
      daysWorked: [],
    };

    setLoading(true);

    createProject(payload).then((resp) => {
      setLoading(false);

      if (!resp.success) {
        toast.error(resp.message ?? 'Error creating project.', {
          toastId: 'createProjectError',
        });
        return;
      }
      const response = resp.content;

      const newUrl = `/projects/${response?.id}`;
      navigate(newUrl);
      toast.success('Successfully created project!', {
        toastId: 'createProjectSuccess',
      });
    });
  };

  const handleNameChange = (newVal: string) => {
    setProjectName(newVal);
  };

  const validateName = () => {
    if (projectName.length < 1) return 'Project name must not be empty';
    if (projectName.length > 50)
      return 'Project name must be less than 50 characters';
    return '';
  };

  const handleDescChange = (newVal: string) => {
    setDesc(newVal);
  };

  const handleOwnerChange = (newVal: string) => {
    setOwner(newVal);
  };

  const validateOwner = () => {
    if (projectOwner.length < 1) return 'Project owner must not be empty';
    return '';
  };

  const validateDesc = () => {
    if (projectDesc.length > 250)
      return 'Project description may not be longer than 250 characters';
    return '';
  };

  return (
    <article className='create-project-page'>
      <div className='page-heading'>
        <div className='heading-copy'>
          <h1>Create a project</h1>
          <p className='page-intro'>
            Start a new space to track project income, costs, and time.
          </p>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : canCreateProject ? (
        <section className='card form-card'>
          <ValidatedTextbox
            label='Project Name'
            value={projectName}
            onChange={handleNameChange}
            validate={validateName}
          />

          <ValidatedTextbox
            label='Project Desc'
            value={projectDesc}
            onChange={handleDescChange}
            validate={validateDesc}
          />

          <ValidatedTextbox
            label='Project Owner'
            value={name as string}
            onChange={handleOwnerChange}
            validate={validateOwner}
            disabled={true}
          />
          <div className='form-actions'>
            <button disabled={loading} onClick={handleSubmit}>
              Create project
            </button>
          </div>
        </section>
      ) : (
        <div className='notice'>To create a project, please log in.</div>
      )}
    </article>
  );
};

export default CreateProject;
