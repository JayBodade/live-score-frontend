import './App.css'
import AdminView from './routes/AdminView/AdminView'
import LoginForm from './routes/Login/Login';
import UserView from './routes/UserView/UserView'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/admin' element={<AdminView/>}/>
        <Route path='/' element={<UserView/>}/>
        <Route path='/adminlogin' element = {<LoginForm/>}/>
      </Routes>
    </Router>
  
    </>
  )
}

export default App
