import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { intializeSocket } from '../config/socket'
const Project = () => {
    const location = useLocation()
    const [modelIsOpen, setModelIsOpen] = useState(false)
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState([])
    const [project, setProject] = useState(location.state.project)

    const [users, setUsers] = useState([])
    console.log(location.state)
    const handleUserClick = (id) => {
        setSelectedUser((prevSelectedUser) => {
          if (prevSelectedUser.includes(id)) {
            return prevSelectedUser.filter((userId) => userId !== id);
          } else {
            return [...prevSelectedUser, id];
          }
        });
    }

    const addColobrators=()=>{
        axios.put('/projects/add-user',{
          projectId:location.state.project._id,
          users:selectedUser
        }).then(res=>{
          console.log(res.data)
          setModelIsOpen(false)
          setSelectedUser([])
          
        }).catch(err=>{
          console.log(err)
        })
    }



    useEffect(() => {

      intializeSocket()

      axios.get(`/projects/get-project/${location.state.project._id}`).then(res=>{
        console.log("s",res.data.project)
        setProject(res.data.project)
      }).catch(err=>{
        console.log(err)
      })

      axios.get('/users/all').then(res=>{
        setUsers(res.data.allUsers)
      }).catch(err=>{
        console.log(err)
      })

    }, [])

    console.log("prjeca",project)
   


  return (
   <main
   className='h-screen w-screen flex'
   >

   <section
    className='left relative flex flex-col h-full min-w-96 bg-slate-300 '
   >

        <header 
        className='flex justify-between flex-row-reverse p-4 w-full
        bg-slate-100
        '
        >
          <button
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          className='bg-white rounded-full p-2 px-3 cursor-pointer'
          >
          <i className='ri-group-fill'></i>
          
          </button>   
          <button className='bg-white rounded-full p-2 px-3 cursor-pointer' onClick={() => setModelIsOpen(true)}>
           
           
           

          <i className='ri-add-fill'></i>
          <small>
          
          Add Coloborators
        </small>
          </button>
        
        </header>
        <div className='conversation-area flex-grow flex flex-col '>

          <div className="message-box p-1 flex-grow flex flex-col gap-1">
              <div className="incomming max-w-56 message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
                <small
                className='opacity-65 text-xs'
                >example@gmail.com</small>
                  <p
                  className='text-sm'
                  >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam, nulla.</p>
              </div>

              <div className="ml-auto max-w-56 message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
                <small
                className='opacity-65 text-xs'
                >example@gmail.com</small>
                  <p
                  className='text-sm'
                  >Lorem ipsum dolor sit.</p>
              </div>
          </div>

          <div className="inputField  w-full flex ">
            <input
            type='text'
            placeholder='Type your message...'
            className='p-2 outline-none border-none bg-white flex-grow'
            />
            <button
            className='flex-grow  bg-slate-950 text-white flex items-center justify-center'
            >
              <i className='ri-send-plane-fill'></i>
            </button>
          </div>

        </div>

        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
          <header
          className='flex justify-end p-4 w-full bg-slate-200'
          >
          <button 
          className='bg-white rounded-full p-2 px-3 cursor-pointer'
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
          <i className='ri-close-fill'></i>
          </button>
          </header>
    <div className='users flex flex-col gap-2'>
{project!=null && project.users.length >  0 &&  project.users.map((user) => (
    <div
      key={user._id}
      className='user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center'
    >
      <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
        <i className="ri-user-fill absolute"></i>
      </div>
      <h1 className='font-semibold text-lg'>
        {user.email && user.email.split('@')[0]}
      </h1>
    </div>
  ))
}
</div>
          
        
          </div>
   </section>

{modelIsOpen && (
    <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg w-full max-w-md'>
        <div className='p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10  rounded-md'>
          <h2 className='text-xl font-semibold'>Select User</h2>
          <button 
            onClick={() => setModelIsOpen(false)}
            className='text-gray-500 hover:text-gray-700'
          >
            <i className='ri-close-line text-2xl'></i>
          </button>
        </div>
        
        <div className='p-4 space-y-2 max-h-[60vh] overflow-y-auto '>
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className={`flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer ${
                selectedUser.includes(user._id)? 'bg-slate-200' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedUser.includes(user._id) ? 'bg-slate-950 text-white' : 'bg-gray-200'}`}>
                <i className='ri-user-fill'></i>
              </div>
              <div>
                <h3 className='font-medium'>
                 
                  { user&& user?.email.split('@')[0]}
                </h3>

                <p className='text-sm text-gray-500'>{user.email}</p>
              </div>
            </div>
          ))}
        </div>
        <div className='p-4 border-t sticky bottom-0 bg-white'>
          <button 
            className='w-full bg-slate-950 text-white px-4 py-2 rounded-lg'
            onClick={() => addColobrators()}
          >
            Add Collaborators
          </button>
        </div>
      </div>
    </div>
  )}
       
  
 

   
   </main>
  )
}

export default Project
