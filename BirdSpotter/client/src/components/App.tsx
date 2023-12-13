import './App.css'
import {NavLink, Route, Routes} from 'react-router-dom'
import Home from './Home'
import Post from './Post'
import NotFound from './NotFound'
import Login from "./Login"
import Logout from "./Logout"
import Profile from "./Profile"

function App() {

  return (
    <>
      <div>
        <header className='App-header'>
          <h1 className='title'>
            Bird Sightings
          </h1>
          <Login />
          <Logout />
          <nav>
            <NavLink className='navlink' to='/'>Home</NavLink>
            <br/>
            <NavLink className='navlink' to='/post'>Post a Sighting!</NavLink>
            <br/>
            <NavLink className='navlink' to='/profile'>View Profile Info</NavLink>
          </nav>
        </header>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/post' element={<Post/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
