import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
const Home = () => {
  const {user}=useContext(UserContext)
  const [isModelOpen,setIsModelOpen]=useState(false)
  const [projectName,setProjectName]=useState('')
  const [projects,setProjects]=useState([])
  const navigate=useNavigate()
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

  useEffect(()=>{
    axios.get('/projects/all').then((res)=>{
      console.log(res.data)
      setProjects(res.data.projects)
    }).catch((err)=>{
      console.log(err)
      toast.error('Something went wrong')

    })
  },[])

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
        <section className="mb-10">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Welcome to DevInChat
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Collaborate on projects in real-time with developers around the world
            </p>
          </div>
          
       
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <button 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => setIsModelOpen(true)}
            >
              <i className="ri-add-line"></i>
              New Project
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-5xl text-gray-600 mb-4">
                  <i className="ri-folder-add-line animate-pulse-slow"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-400 mb-4">No projects yet</h3>
                <button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-md transition-all duration-300"
                  onClick={() => setIsModelOpen(true)}
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              projects.map((project) => (
                <div 
                  key={project._id} 
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-700 group"
                  onClick={() => {
                    navigate(`/project`, {
                      state: { project }
                    })
                  }}
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-purple-600 group-hover:to-blue-500 transition-all duration-500"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors duration-300">
                      {project.name}
                    </h3>
                    <div className="flex items-center text-gray-400 mb-4">
                      <i className="ri-calendar-line mr-2"></i>
                      <span className="text-sm">Created {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400">
                        <i className="ri-user-3-line mr-2"></i>
                        <span>{project?.users.length} Collaborators</span>
                      </div>
                      <div className="text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
                        <i className="ri-arrow-right-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
                  <hr 
                  className="my-10 border-t border-gray-700"
                  />
        <div className="mt-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 border-l-4 border-blue-500">
              <div className="text-blue-400 mb-4 text-3xl">
                <i className="ri-team-line"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-400">Work together seamlessly with your team members on projects.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 border-l-4 border-purple-500">
              <div className="text-purple-400 mb-4 text-3xl">
                <i className="ri-chat-4-line"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
              <p className="text-gray-400">Communicate instantly with team members while working on projects.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 border-l-4 border-green-500">
              <div className="text-green-400 mb-4 text-3xl">
                <i className="ri-code-box-line"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Code Sharing</h3>
              <p className="text-gray-400">Share and review code snippets with syntax highlighting.</p>
            </div>
          </div>
        
        </div>
        
      </main>
{isModelOpen && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-gray-800 rounded-lg p-6 w-96 transform transition-all duration-300 scale-100 shadow-2xl border border-gray-700 animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Create New Project</h3>
        <button 
          onClick={() => setIsModelOpen(false)}
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
      
      <form onSubmit={createProject}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Name
          </label>
          <input 
            value={projectName}
            onChange={(e)=>setProjectName(e.target.value)}
            type="text"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300"
            placeholder="Enter project name"
            required
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsModelOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            disabled={projectName.trim()===''}
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  </div>
)}



      <Footer />
    </div>
  )
}

export default Home
