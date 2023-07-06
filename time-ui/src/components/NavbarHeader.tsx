import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './loginButton';
import LogoutButton from './LogoutButton';
import { Link } from 'react-router-dom';

const NavbarHeader: React.FC = () => {
  const { authState: auth } = useAuth();

  const loggedIn = auth.loggedIn;

  return (
    <nav>
      <div className='flex'>
        <span className='brand'>Gig app v2</span>
      </div>
      <div className='flex grow'>
        <ul className='flex grow align-center'>
          <li>
            <Link to={'/dash'}>Dashboard</Link>
          </li>
          <li>
            <Link to='/projects'>Projects</Link>
          </li>
          <li>
            <Link to='/Gig-app/about'>About</Link>
          </li>

          {loggedIn ? (
            <>
              <li className='ml-auto'>
                <span>Hello {auth.name}</span>
              </li>
              <li>{<LogoutButton />}</li>
            </>
          ) : (
            <li className='ml-auto'>{<LoginButton />}</li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavbarHeader;
