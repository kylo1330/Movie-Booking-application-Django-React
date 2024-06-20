import {  Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';

const ProtectedRoutes = () => {
   
    const isSuperuser = useSelector(state => state.auth.isSuperuser);

    const isAuthenticated = isSuperuser;

    return isAuthenticated!= true ? <Navigate to="/home" /> : <Outlet />;
}

export default ProtectedRoutes;