import { Routes, Route} from 'react-router-dom'
import Landingpage from '../pages/Landingpage' 
// import Features from './pages/Features'
import SignUp from '../pages/SignUp'
import Login from '../pages/Login'

function App() {


  return (
   <Routes>       
          {/* public routes */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/"element={<Login /> } /> */}
          {/* <PrivateRoute> */}
          {/* <Route path="/dashboard" element={<Dashboard />} />    */}
          {/* </PrivateRoute> */}
    </Routes>
  )
}

export default App
