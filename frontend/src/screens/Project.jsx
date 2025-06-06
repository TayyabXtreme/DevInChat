import React from 'react'
import { useLocation } from 'react-router-dom'

const Project = () => {
    const location = useLocation()
    console.log(location.state)
  return (
   <main
   className='h-screen w-screen flex'
   >

   <section
    className='left h-full min-w-60 bg-red-300'
   >

        <header 
        className='flex justify-end p-4 w-full
        bg-slate-200
        '
        >
        <button
        className='bg-white rounded-full p-2 px-3 cursor-pointer'
        >
        <i className='ri-group-fill'></i>
        </button>
        
        </header>
   
   </section>
   
   </main>
  )
}

export default Project
