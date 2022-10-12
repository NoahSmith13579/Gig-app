import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ProtectedRouteProps {
    user: string | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user }) => {
    if (!user) {
        const toastId = 'illegal page access';
        return (
            <>
                <Navigate to='/about' replace />
                {toast.error('Must be logged in to access that page', {
                    position: 'top-left',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    toastId: toastId,
                })}
            </>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
