// 👇 All imports stay the same
import React, { createRef, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { intializeSocket, receiveMessage, sendMessage } from '../config/socket'
import { UserContext } from '../context/user.context'
import Markdown from 'markdown-to-jsx'

const Project = () => {
  const { user } = useContext(UserContext)
  const location = useLocation()
  const [modelIsOpen, setModelIsOpen] = useState(false)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState([])
  const [project, setProject] = useState(location.state.project)
  const messageBox = createRef()
  const messageEndRef = useRef(null)

  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])


  function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

  // 👉 Handle incoming messages
  const handleIncomingMessage = (data) => {
    if (data.sender.email === 'ai') {
      data.isMarkdown = true
    }

    setMessages((prev) => [...prev, data])
  }

  // 👉 Handle outgoing messages
  const handleOutgoingMessage = () => {
    if (!message.trim()) return

    const messageData = {
      message,
      sender: user,
    }

    sendMessage('project-message', messageData)
    setMessages((prev) => [...prev, messageData])
    setMessage('')
  }

  const handleUserClick = (id) => {
    setSelectedUser((prevSelectedUser) =>
      prevSelectedUser.includes(id)
        ? prevSelectedUser.filter((userId) => userId !== id)
        : [...prevSelectedUser, id]
    )
  }

  const addColobrators = () => {
    axios.put('/projects/add-user', {
      projectId: location.state.project._id,
      users: selectedUser,
    })
      .then(() => {
        setModelIsOpen(false)
        setSelectedUser([])
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    intializeSocket(project._id)

    // ✅ Using clean handler
    receiveMessage('project-message', handleIncomingMessage)

    axios.get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setProject(res.data.project)
      })
      .catch((err) => console.log(err))

    axios.get('/users/all')
      .then((res) => setUsers(res.data.allUsers))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <main className='h-screen w-screen flex bg-[#0f172a] text-white'>
      <section className='left relative flex flex-col h-screen w-full md:w-[450px] bg-[#1e293b] shadow-lg'>
        <header className='flex justify-between items-center p-4 w-full bg-[#1e293b] border-b border-gray-700 sticky top-0 z-10'>
          <button
            className='hover:bg-blue-700 rounded-full p-2 transition-colors duration-200 flex items-center gap-2'
            onClick={() => setModelIsOpen(true)}
          >
            <i className='ri-add-fill text-xl'></i>
            <span className='text-sm'>Add Collaborators</span>
          </button>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className='hover:bg-blue-700 rounded-full p-2 transition-colors duration-200'
          >
            <i className='ri-group-fill text-xl'></i>
          </button>
        </header>

        <div className='flex-1 flex flex-col h-[calc(100vh-140px)] mt-16'>
          <div className='flex-1 overflow-hidden'>
            <div
              className='message-box p-4 h-full overflow-y-auto scroll-smooth space-y-2'
              ref={messageBox}
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${msg.sender.email=='ai' ? 'max-w-96': 'max-w-56' } message flex flex-col p-2 w-fit rounded-md text-white ${
                    msg.sender.email === user.email ? 'ml-auto bg-blue-700' : 'bg-slate-700'
                  }`}
                >
                  <small className='opacity-65 text-xs '>{msg.sender.email}</small>
                  <div className='text-sm'>
  {msg.isMarkdown ?<div className='overflow-auto bg-slate-900 p-2 rounded-md  sc'> <Markdown
    children={msg.message}
    
    
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                            
                        },
                        
                        
                    }} /> </div>: msg.message}
</div>
                </div>
              ))}
              <div ref={messageEndRef}></div>
            </div>
          </div>

          <div className='input-area p-4 border-t border-gray-700 bg-[#1e293b]'>
            <div className='flex gap-2 items-center'>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type='text'
                placeholder='Type your message...'
                className='flex-1 p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                onClick={handleOutgoingMessage}
                className='p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
              >
                <i className='ri-send-plane-fill text-xl'></i>
              </button>
            </div>
          </div>
        </div>

        {/* Collaborators Panel */}
        <div className={`sidePanel fixed md:absolute w-full md:w-[450px] h-full flex flex-col bg-[#1e293b] shadow-xl transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 z-20`}>
          <header className='flex justify-between items-center p-4 border-b border-gray-700'>
            <h2 className='text-xl font-semibold'>Project Members</h2>
            <button
              className='hover:bg-blue-700 rounded-full p-2 transition-colors duration-200'
              onClick={() => setIsSidePanelOpen(false)}
            >
              <i className='ri-close-fill text-xl'></i>
            </button>
          </header>

          <div className='users flex-1 overflow-y-auto p-4 space-y-2'>
            {project?.users?.length > 0 && project.users.map((user) => (
              <div
                key={user._id}
                className='user mb-2 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3'
              >
                <div className='w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center'>
                  <i className="ri-user-fill text-xl"></i>
                </div>
                <div>
                  <h3 className='font-medium text-white'>
                    {user.email && user.email.split('@')[0]}
                  </h3>
                  <p className='text-sm text-gray-400'>{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborator Modal */}
      {modelIsOpen && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-[#1e293b] text-white rounded-xl w-full max-w-md shadow-2xl'>
            <div className='p-4 border-b border-gray-700 flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Add Collaborators</h2>
              <button
                onClick={() => setModelIsOpen(false)}
                className='hover:bg-blue-700 rounded-full p-2 transition-colors duration-200'
              >
                <i className='ri-close-line text-xl'></i>
              </button>
            </div>

            <div className='p-4 max-h-[60vh] overflow-y-auto space-y-2'>
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${selectedUser.includes(user._id) ? 'bg-blue-700' : 'hover:bg-gray-700'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${selectedUser.includes(user._id) ? 'bg-blue-600 text-white' : 'bg-gray-600'}`}>
                    <i className='ri-user-fill text-xl'></i>
                  </div>
                  <div>
                    <h3 className='font-medium'>{user?.email.split('@')[0]}</h3>
                    <p className='text-sm text-gray-400'>{user.email}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className='p-4 border-t border-gray-700'>
              <button
                className='w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200'
                onClick={addColobrators}
              >
                Add Selected Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Project
