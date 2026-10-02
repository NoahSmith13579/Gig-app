import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './loginButton';
import LogoutButton from './LogoutButton';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const NavbarHeader: React.FC = () => {
  const { authState: auth } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const loggedIn = auth.loggedIn;

  return (
    <header>
      <Link className='brand' to='/about' aria-label='Gig app home'>
        <span className='brand-mark' aria-hidden='true'>
          G
        </span>
        <span>Gig app</span>
      </Link>

      <nav className='grow' aria-label='Main navigation'>
        <ul>
          <li>
            <NavLink to='/dash'>Dashboard</NavLink>
          </li>
          <li>
            <NavLink to='/projects'>Projects</NavLink>
          </li>
          <li>
            <NavLink to='/about'>About</NavLink>
          </li>
        </ul>
      </nav>

      <div className='nav-account'>
        <button
          className='theme-toggle'
          type='button'
          role='switch'
          aria-checked={theme === 'dark'}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          onClick={toggleTheme}
        >
          <span className='theme-toggle-icon' aria-hidden='true'>
            {theme === 'light' ? '☾' : '☀'}
          </span>
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
        {loggedIn ? (
          <>
            <span className='nav-greeting'>Hello, {auth.name}</span>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
};

export default NavbarHeader;
