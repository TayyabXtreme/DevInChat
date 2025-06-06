import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const Project = () => {
    const location = useLocation()
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    console.log(location.state)
  return (
   <main
   className='h-screen w-screen flex'
   >

   <section
    className='left relative flex flex-col h-full min-w-96 bg-slate-300 '
   >

        <header 
        className='flex justify-end p-4 w-full
        bg-slate-100
        '
        >
          <button
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          className='bg-white rounded-full p-2 px-3 cursor-pointer'
          >
          <i className='ri-group-fill'></i>
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

          <div className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
                                    <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                 <h1 className='font-semibold text-lg'>
                                  Username
                                 </h1>
                                </div>
        
          </div>
   </section>
   
   </main>
  )
}

export default Project
