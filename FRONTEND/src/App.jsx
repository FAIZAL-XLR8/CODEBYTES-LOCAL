 import {  Routes, Route , Navigate} from "react-router";
 import Homepage from "../PAGES/Homepage.jsx";
  import Login from "../PAGES/Login.jsx";
  import Signup from "../PAGES/Signup.jsx";
  import ProblemPage from "../PAGES/ProblemPage.jsx"
  import { useDispatch, useSelector } from "react-redux"; 
  import { useEffect } from "react";
import { checkAuth } from "./authSlice.js";
import AdminPanel from "../PAGES/adminPanel.jsx";
 export const App = () => {
  // code of is Authenticated
  const {isAuthenticated, loading, user } = useSelector((globalState) => globalState?.auth);
  const dispatch = useDispatch();
  
  useEffect (()=>{
    
    dispatch (checkAuth());
    
  },[dispatch])
  if(loading) 
  {
return  <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
  }
      
        
        
       
  return(
    
      <>
     
      <Routes>
        <Route path = "/" element = {isAuthenticated? <Homepage></Homepage>:<Navigate to = "/signup"/>}></Route>
        <Route path = "/login" element = {isAuthenticated ?  <Navigate to= "/" /> :<Login></Login>}></Route>
        <Route path = "/signup" element = {isAuthenticated?<Navigate to ="/" />:<Signup></Signup>}></Route>
         <Route
  path="/adminPanel"
  element={
    user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />
  }
/>

        <Route path="/problem/:problemId" element= {<ProblemPage></ProblemPage>}></Route>
      </Routes>
    
     
      </>
  )
}
export default App;