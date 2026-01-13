import { Routes, Route} from 'react-router-dom'
import Landingpage from '../pages/Landingpage' 
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import SignUp from '../pages/SignUp'
import EditGoals from '../pages/EditGoals'
import ViewGoal from '../pages/ViewGoal'
import TrackProgress from '../pages/TrackProgress'

function App() {


  return (
   <Routes>       
          {/* public routes */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile"element={<Profile /> } />
          <Route path="/editgoals"element={<EditGoals /> } />
          <Route path="/goal/:goalname" element={<ViewGoal />} />
          <Route path="/trackprogress/:goalname" element={<TrackProgress />} />

          {/* <PrivateRoute> */}
          {/* <Route path="/dashboard" element={<Dashboard />} />    */}
          {/* </PrivateRoute> */}
    </Routes>
  )
}

export default App
