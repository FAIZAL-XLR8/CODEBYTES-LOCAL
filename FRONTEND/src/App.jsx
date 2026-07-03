import {  Routes, Route , Navigate} from "react-router";
 import LandingPage from "../PAGES/LandingPage.jsx";
 import ProblemsPage from "../PAGES/ProblemsPage.jsx";
  import Login from "../PAGES/Login.jsx";
  import Signup from "../PAGES/Signup.jsx";
  import ProblemPage from "../PAGES/PerProblemPage.jsx"
  import { useDispatch, useSelector } from "react-redux"; 
  import { useEffect } from "react";
import { checkAuth } from "./authSlice.js";
import AdminPanel from "../PAGES/adminPanel.jsx";
import ProfilePage from "../PAGES/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";

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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#18181b",
            color: "#fafafa",
            border: "1px solid #27272a",
            borderRadius: "8px",
            fontFamily: "var(--font-sans)",
          },
        }}
      />
     
      <Routes>
        <Route path = "/" element = {<LandingPage />}></Route>
        <Route path = "/problems" element = {isAuthenticated? <ProblemsPage></ProblemsPage>:<Navigate to = "/signup"/>}></Route>
        <Route path = "/login" element = {isAuthenticated ?  <Navigate to= "/" /> :<Login></Login>}></Route>
        <Route path = "/signup" element = {isAuthenticated?<Navigate to ="/" />:<Signup></Signup>}></Route>
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}></Route>
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