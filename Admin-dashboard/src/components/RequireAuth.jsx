import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";



const RequireAuth = ({children}) => {
    const context = useContext(AuthContext)
    
    if(!context.isUserAuthenticated()) 
    {
       return( <Navigate to="/login" />)
    }
    else{
        return ( <>{children}</> );
    }
    
}
 
export default RequireAuth;