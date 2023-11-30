import './App.css'
import {NavLink, Route, Routes} from 'react-router-dom'
import Home from './Home'
import Post from './Post'
import NotFound from './NotFound'

function App() {

  return (
    <>
      <div>
        <header className='App-header'>
          <h1 className='title'>
            Bird Sightings
          </h1>
          <nav>
            <NavLink className='navlink' to='/'>Home</NavLink>
            <br/>
            <NavLink className='navlink' to='/post'>Post a Sighting!</NavLink>
          </nav>
        </header>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/post' element={<Post/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
