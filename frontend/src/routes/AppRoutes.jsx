import React from 'react'
import {Route, BrowserRouter, Routes} from 'react-router-dom'
import Login from '../screens/Login.jsx'
import Register from '../screens/Register.jsx'
import Home from '../screens/Home.jsx'
import Project from '../screens/Project.jsx'

const AppRoutes = () => {
  return (
   <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/project" element={<Project />}></Route>
    </Routes>
   </BrowserRouter>
  )
}

export default AppRoutes
