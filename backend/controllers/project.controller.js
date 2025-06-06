import projectModel from '../models/project.model.js'
import { addUsersToProject, createProject, getAllProjectByUserId, getProjectById } from '../services/project.service.js'
import {validationResult} from 'express-validator'
import userModel from '../models/user.model.js'
export const createProjectController = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { name } = req.body
        const loggedInUser = await userModel.findOne({ email: req.user.email })
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        const userId = loggedInUser._id

        const isexist = await projectModel.findOne({ name })


        if (isexist) {
            return res.status(400).json({ message: 'Project already exists' })
        }
        const project = await createProject({ name, userId })
        res.status(201).json(project)
        
    } catch (error) {
        res.status(500).json({ message: error.message })
        
    }
   
}


export const getAllProjectsController = async (req, res) => {
    try {
        const loggedInUser=await userModel.findOne({email:req.user.email})
        if(!loggedInUser){
            return res.status(404).json({message:'User not found'})
        }
        const allUserProjects=await getAllProjectByUserId({userId:loggedInUser._id})
        
        return res.status(200).json({
            projects:allUserProjects
        })

    }catch (error) {
       res.status(500).json({ message: error.message })
    }
}

export const addUserToProjectController = async (req, res) => {
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const {projectId,users}=req.body
        const loggedInUser=await userModel.findOne({email:req.user.email})
        if(!loggedInUser){
            return res.status(404).json({message:'User not found'})
        }
        const userId=loggedInUser._id
        const project=await addUsersToProject({projectId,users,userId})

        return res.status(200).json({
            message:'Users added successfully',
            project
        })
        
        

    }catch(error){
        res.status(500).json({ message: error.message })
    }
}

export const getProjectByIdController = async (req, res) => {
    try {
        const {projectId}=req.params
        
       
        const project=await getProjectById({projectId})
        
        return res.status(200).json({
            project
        })
        
    }catch (error) {
       res.status(500).json({ message: error.message })
    }
}