const express=require('express')
const userRouter=express.Router()
const userController=require('../Controller/userController')


userRouter.post('/reg',async(req,res)=>{
    try{
         const results=await userController.userRegister(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})
userRouter.post('/log',async(req,res)=>{
    try{
        const login=await userController.userLogin(req)
        res.status(201).send(login)
    }catch(err){
       console.log(err)
    }
})
userRouter.get('/:id',async(req,res)=>{
    try{
        const user=await userController.getUser(req)
        res.send(user)
    }catch(err){
        console.log(err)
    }
})

userRouter.put('/update/:id',async(req,res)=>{
    try{
        const update=await userController.updateUser(req)
        res.send(update)
    }catch(err){
        console.log(err)
    }
})

module.exports = userRouter