// 👇 All imports stay the same
import React, { createRef, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { intializeSocket, receiveMessage, sendMessage } from '../config/socket'
import { UserContext } from '../context/user.context'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js'
import { getWebContainer } from '../config/webContainer'

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
  const [fileTree, setFileTree] = useState({})
  const [currentFile, setCurrentFile] = useState('')
  const [openFiles, setOpenFiles] = useState([])
  const [webContainer, setWebContainer] = useState(null)
  const [ runProcess, setRunProcess ] = useState(null)

  


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

  // Function to save file tree and send it to other collaborators
  const saveFileTree = (fileTree) => {
    // Update the WebContainer with the new file tree
    webContainer?.mount(fileTree).then(() => {
      console.log('File tree updated in WebContainer');
      
      // Send the file tree to other collaborators
      const messageData = {
        message: JSON.stringify({
          fileTree: fileTree,
          text: "File tree updated"
        }),
        sender: user,
      };
      
      sendMessage('project-message', messageData);
    }).catch(error => {
      console.error('Error updating file tree in WebContainer:', error);
    });
  }

  // 👉 Handle incoming messages
  const handleIncomingMessage = (data) => {
    console.log('Received message:', data);
    try {
      const message = JSON.parse(data.message);
      
      if(message.fileTree){
        console.log('Received file tree:', message.fileTree);
        setFileTree(message.fileTree);
        
        // Mount the file tree to the WebContainer
        if (webContainer) {
          webContainer.mount(message.fileTree)
            .then(() => console.log('File tree mounted successfully'))
            .catch(err => console.error('Error mounting file tree:', err));
        } else {
          console.warn('WebContainer not initialized yet, file tree will be mounted when available');
        }
      }

      if (data.sender.email === 'ai') {
        data.isMarkdown = true;
      }

      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error processing incoming message:', error);
      setMessages((prev) => [...prev, data]);
    }
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
  function safeJsonParse(str) {
    try {
      return JSON.parse(str)
    } catch {
      return null
    }
  }

  function WriteAiMessage(message) {

    const messageObject = JSON.parse(message)

    return (
        <div
            className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
        >
            <Markdown
                children={messageObject.text}
                options={{
                    overrides: {
                        code: SyntaxHighlightedCode,
                    },
                }}
            />
        </div>)
}
  

  useEffect(() => {
    intializeSocket(project._id)

    if(!webContainer){
      getWebContainer().then(container=>{
        setWebContainer(container)
        console.log("container",container)
        
        // Create a basic file structure with package.json
        const files = {
          'package.json': {
            file: {
              contents: JSON.stringify({
                name: 'devinchat-project',
                version: '1.0.0',
                description: 'A project created in DevInChat',
                main: 'index.js',
                scripts: {
                  start: 'node index.js'
                },
                dependencies: {}
              }, null, 2)
            }
          },
          'index.js': {
            file: {
              contents: 'console.log("Hello from DevInChat!");'
            }
          }
        };
        
        // Mount the files to the WebContainer
        container.mount(files).then(() => {
          console.log('Files mounted successfully');
          // Update the file tree state
          setFileTree(files);
        });
      })
    }

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
              className='message-box p-4 h-full overflow-y-auto scroll-smooth space-y-2 scroll-container'
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
  {msg.isMarkdown ?

                    WriteAiMessage(msg.message)
                    
                    : msg.message}
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

      <section className="right  bg-red-50 flex-grow h-full flex">
            <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
                    <div className="file-tree w-full">
                    {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                    }}
                                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full">
                                    <p
                                        className='font-semibold text-lg'
                                    >{file}</p>
                                </button>))

                        }
                    
                    </div>
            </div>

             <div className="code-editor flex flex-col flex-grow h-full shrink">

                 {
                 
                 
                  <div className='code-editor flex flex-col flex-grow h-full'>
                   <div className="top flex justify-between w-full">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                        <p
                                            className='font-semibold text-lg'
                                        >{file}</p>
                                    </button>
                                ))
                            }
                        </div>
                        <div className="actions flex gap-2">
                            <button
                                onClick={async () => {
                                    try {
                                        if (!webContainer) {
                                            console.error('WebContainer not initialized');
                                            return;
                                        }
                                        
                                        // Check if files are mounted
                                        try {
                                            const packageJson = await webContainer.fs.readFile('package.json', 'utf-8');
                                            console.log('Package.json exists:', packageJson);
                                            
                                            // Parse package.json to check dependencies
                                            const pkgJson = JSON.parse(packageJson);
                                            console.log('Dependencies:', pkgJson.dependencies);
                                            
                                            // Run npm install
                                            console.log('Starting npm install...');
                                            const installProcess = await webContainer.spawn('npm', ['install']);
                                            
                                            installProcess.output.pipeTo(new WritableStream({
                                                write(chunk) {
                                                    console.log('Install output:', chunk);
                                                }
                                            }));
                                            
                                            // Wait for install to complete
                                            const installExit = await installProcess.exit;
                                            console.log('Install process exited with code:', installExit);
                                            
                                            if (installExit === 0) {
                                                // Run npm start
                                                console.log('Starting npm start...');
                                                const startProcess = await webContainer.spawn('npm', ['start']);
                                                setRunProcess(startProcess);
                                                
                                                startProcess.output.pipeTo(new WritableStream({
                                                    write(chunk) {
                                                        console.log('Run output:', chunk);
                                                    }
                                                }));
                                            } else {
                                                console.error('npm install failed with exit code:', installExit);
                                            }
                                        } catch (error) {
                                            console.error('Error reading package.json or running commands:', error);
                                            
                                            // If package.json doesn't exist, create it and try again
                                            if (error.message && error.message.includes('No such file')) {
                                                console.log('Creating package.json and trying again...');
                                                
                                                // Create basic package.json
                                                const basicPackageJson = {
                                                    name: 'devinchat-project',
                                                    version: '1.0.0',
                                                    description: 'A project created in DevInChat',
                                                    main: 'index.js',
                                                    scripts: {
                                                        start: 'node index.js'
                                                    },
                                                    dependencies: {}
                                                };
                                                
                                                // Write package.json
                                                await webContainer.fs.writeFile('package.json', JSON.stringify(basicPackageJson, null, 2));
                                                
                                                // Create index.js if it doesn't exist
                                                try {
                                                    await webContainer.fs.readFile('index.js', 'utf-8');
                                                } catch (e) {
                                                    await webContainer.fs.writeFile('index.js', 'console.log("Hello from DevInChat!");');
                                                }
                                                
                                                // Try running npm install again
                                                const installProcess = await webContainer.spawn('npm', ['install']);
                                                installProcess.output.pipeTo(new WritableStream({
                                                    write(chunk) {
                                                        console.log('Install output:', chunk);
                                                    }
                                                }));
                                                
                                                const installExit = await installProcess.exit;
                                                if (installExit === 0) {
                                                    const startProcess = await webContainer.spawn('npm', ['start']);
                                                    setRunProcess(startProcess);
                                                    
                                                    startProcess.output.pipeTo(new WritableStream({
                                                        write(chunk) {
                                                            console.log('Run output:', chunk);
                                                        }
                                                    }));
                                                }
                                            }
                                        }
                                    } catch (error) {
                                        console.error('Error running commands:', error);
                                    }
                                }}
                                className='p-2 px-4 bg-slate-300 text-white'
                            >
                                run
                            </button>
                        </div>

                    </div>
                   
                  <div className="bottom h-full flex-grow">
                  
                  {
                    fileTree[currentFile] && (
                      <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                    <pre
                                        className="hljs h-full">
                                        <code
                                            className="hljs h-full outline-none"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = {
                                                    ...fileTree,
                                                    [ currentFile ]: {
                                                        file: {
                                                            contents: updatedContent
                                                        }
                                                    }
                                                }
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[ currentFile ].file.contents).value }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                            }}
                                        />
                                     </pre>
                                </div>
                    )
                  
                  }
                    
                    </div>
                  </div>
                 
                 }

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
