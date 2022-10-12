import React from 'react';
import NavbarHeader from './NavbarHeader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
    child: React.ReactElement;
}
const Layout: React.FC<LayoutProps> = ({ child }) => {
    return (
        <>
            <NavbarHeader />
            <main className='flex grow'>{child}</main>
            <ToastContainer />
        </>
    );
};

export default Layout;
