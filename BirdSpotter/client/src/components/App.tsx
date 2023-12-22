import './App.css'
import {NavLink, Route, Routes, useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import Home from './Home'
import Post from './Post'
import NotFound from './NotFound'
import Login from "./Login"
import Logout from "./Logout"
import Profile from "./Profile"
import MainMap from "./Map"
import Sighting from './Sighting'
import Register from './Register'
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Display from './Display';
import BirdInfo from './birdInfo';

function App() {
    const [cookies, setCookie] = useCookies(['userId'])
    let { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/register');
    };

    const checkIfRegistered = async () => {
        if (isAuthenticated && user) {
            const data = { authId: user.sub };
            const userIsRegistered = (await axios.post(`http://localhost:3000/users/checkIfRegistered`, data)).data.isRegistered;
            if (!userIsRegistered) {
                handleRedirect();
                console.log('User is authenticated but not registered');
            } else {
              console.log('User is authenticated and registered');
              const data = (await axios.get(`http://localhost:3000/users/authid/${user.sub}`)).data.data
              setCookie('userId', data._id)
              console.log('User is authenticated and registered');
            }
        } else {
          setCookie('userId', null)
          console.log('User is not authenticated');
        }
    };
    useEffect(() => {
        checkIfRegistered();
    }, [isAuthenticated, user, location.pathname]);

    
  
  return (
    <>
      <div>
        <header className='App-header'>
          <h1 className='title'>
            BirdSpotter
          </h1>
          {isAuthenticated ? (
            <Logout />
          ) : (
            <Login />
          )}
          
          
          <nav>
            <NavLink className='navlink' to='/'>Home</NavLink>
            <br/>
            <NavLink className='navlink' to='/posts/page/1'>Go and look at some birds</NavLink>
            <br/>
            <NavLink className='navlink' to='/post'>Post a Sighting!</NavLink>
            <br/>
            <NavLink className='navlink' to='/profile'>View Profile Info</NavLink>
            <br/>
            <NavLink className='navlink' to='/map'>View Map</NavLink>
          </nav>
          <br/> <br/>
        </header>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/posts/page/:page' element={<Display/>}/>
          <Route path='/post' element={<Post/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/map' element={<MainMap/>}/>
          <Route path='/post/:id' element={<Sighting/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/bird/:id' element={<BirdInfo/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
