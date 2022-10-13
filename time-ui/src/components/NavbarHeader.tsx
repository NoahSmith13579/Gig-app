import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './loginButton';
import LogoutButton from './LogoutButton';

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
                        <a href='/dash'>Dashboard</a>
                    </li>
                    <li>
                        <a href='/projects'>Projects</a>
                    </li>
                    <li>
                        <a href='/about'>About</a>
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
