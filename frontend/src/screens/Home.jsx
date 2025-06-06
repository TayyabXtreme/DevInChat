import React, { useContext, useState } from 'react'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'
import { toast } from 'react-toastify'

const Home = () => {
  const {user}=useContext(UserContext)
  const [isModelOpen,setIsModelOpen]=useState(false)
  const [projectName,setProjectName]=useState('')

  const createProject=(e)=>{
    e.preventDefault();
    if (projectName.trim() === '') {
      toast.error('Project name cannot be empty');
      return;
    }

    axios.post('/projects/create',{
      name:projectName
    }).then((res)=>{
      toast.success(`Project "${res.data.name}" created successfully!`);
        setProjectName('');
        setIsModelOpen(false);

    }).catch((err)=>{
      if (err.response?.status === 400) {
        toast.error('Project already exists or invalid input');
      } else {
        toast.error('Something went wrong');
      }
    })

    console.log(projectName)
  }

  return (
    <main
      className='p-4'
    >
    <div className='projects'>
      <button className='project p-4 border border-slate-300 rounded-md font-bold'
      onClick={()=>setIsModelOpen(true)}
      >
      New Project
      <i className="ri-link ml-2"></i>
      
      </button>
{isModelOpen && (
  <div className="fixed inset-0 bg-black/35 bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
    <div className="bg-white rounded-lg p-6 w-96 transform transition-transform duration-300 scale-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Create New Project</h3>
        <button 
          onClick={() => setIsModelOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
       
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
      
      <form onSubmit={createProject}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input 
            value={projectName}
            onChange={(e)=>setProjectName(e.target.value)}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project name"
            required
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsModelOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            disabled={projectName.trim()===''}
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
    
    
    </main>
  )
}

export default Home
