import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';
import Swal from 'sweetalert2';

const PrivateRoute = ({children, role}) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    if(!user){
        Swal.fire("Please login to access this page");
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
    if(role && user.role !== role) {
        Swal.fire("You are not authorized to access this page");
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
    return children;
  
}

export default PrivateRoute