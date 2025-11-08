import { Routes, Route} from 'react-router-dom'
import Landingpage from '../pages/Landingpage' 
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import SignUp from '../pages/SignUp'



function App() {


  return (
   <Routes>       
          {/* public routes */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
         ` <Route path="/profile"element={<Profile /> } />`
          {/* <PrivateRoute> */}
          {/* <Route path="/dashboard" element={<Dashboard />} />    */}
          {/* </PrivateRoute> */}
    </Routes>
  )
}

export default App
