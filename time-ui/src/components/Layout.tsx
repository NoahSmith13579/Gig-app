import React from 'react';
import NavbarHeader from './NavbarHeader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
    child: React.ReactElement;
}
const Layout: React.FC<LayoutProps> = ({ child }) => {
    const { theme } = useTheme();
    return (
        <>
            <NavbarHeader />
            <main className='flex grow'>{child}</main>
            <ToastContainer theme={theme} />
        </>
    );
};

export default Layout;
