import React, { useContext } from 'react'
import { UserContext } from '../context/user.context'

const Home = () => {
  const {user}=useContext(UserContext)

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome {user?.email}</p>    
    </div>
  )
}

export default Home
