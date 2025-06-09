import React from 'react'
import AppRoutes from './routes/AppRoutes.jsx'
import { UserProvider } from './context/user.context.jsx'
import './index.css'
const App = () => {
  return (
   <UserProvider>
   <AppRoutes/>
   </UserProvider>
  )
}

export default App
