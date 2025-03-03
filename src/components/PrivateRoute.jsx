import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children })=>{
    const token = localStorage.getItem("token");

    //If no token is found, redirect to login

    if(!token){
        return <Navigate to="/" replace />
    }

    return children;
}

export default PrivateRoute;