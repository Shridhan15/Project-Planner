import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Footer from './components/Footer'
import PostProject from './pages/PostProject'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/postproject' element={<PostProject/>}/> 
      </Routes>
      
    </div>
  )
}

export default App