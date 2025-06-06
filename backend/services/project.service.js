import mongoose from "mongoose";
import ProjectModel from "../models/project.model.js";


export const createProject=async({
    name,
    userId
})=>{
    if(!name) throw new Error('Name is required')
    
    const project=new ProjectModel({
        name,
        users:[userId]

    })

    return await project.save()
}


export const getAllProjectByUserId=async({userId})=>{
    if(!userId) throw new Error('User Id is required')
    
    const allUserProjects= await ProjectModel.find({users:userId})
    if(!allUserProjects) throw new Error('No projects found')
    
    return allUserProjects
    
}

export const addUsersToProject=async({projectId,users,userId})=>{
    if(!projectId) throw new Error('Project Id is required')
    if(!mongoose.Types.ObjectId.isValid(projectId)) throw new Error('Invalid Project Id')
    if(!users) throw new Error('Users is required')

    if(!userId) throw new Error('User Id is required')
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error('Invalid User Id')
    
    if(!Array.isArray(users) || users.some(userId=> !mongoose.Types.ObjectId.isValid(userId))) throw new Error('Invalid User Id')

    const project=await ProjectModel.findOne({_id:projectId,users:userId})

    if(!project) throw new Error('Project not found or you are not authorized')

    const updatedProject=await ProjectModel.findByIdAndUpdate(projectId,{$addToSet:{users:{$each:users}}},{new:true})

    if(!updatedProject) throw new Error('Project not updated')

    return updatedProject
    
    
}

export const getProjectById=async({projectId})=>{
    if(!projectId) throw new Error('Project Id is required')
    if(!mongoose.Types.ObjectId.isValid(projectId)) throw new Error('Invalid Project Id')

        const project = await ProjectModel.findOne({
            _id: projectId
        }).populate('users')

    if(!project) throw new Error('Project not found')

    return project
}