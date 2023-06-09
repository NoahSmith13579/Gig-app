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
    authState: { userid, loggedIn, name },
  } = useAuth();

  const [loading, setLoading] = React.useState(false);

  const [projectName, setProjectName] = React.useState('');
  const [projectDesc, setDesc] = React.useState('');
  const [projectOwner, setOwner] = React.useState(name as string);

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
      id: '',
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
    <div className='flex col'>
      <h2>Create a new project</h2>

      {loading ? (
        <Spinner />
      ) : loggedIn ? (
        <>
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
            style={{ 'background-color': '#434853' }}
            disabled={true}
          />
        </>
      ) : (
        <div> To create a new project, please log in. </div>
      )}
      <button disabled={loading} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CreateProject;
