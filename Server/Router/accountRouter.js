const express=require('express')
const accountRouter=express.Router()
const accountController=require('../Controller/accountController')

accountRouter.post('/',async(req,res)=>{
    try{
         const results=await accountController.createAccount(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})

accountRouter.get('/:userId',async(req,res)=>{
    try{
         const results=await  accountController.getByUserId (req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})
accountRouter.put('/:id',async(req,res)=>{
    try{
         const results=await  accountController.updateAccount(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})

accountRouter.delete('/:id',async(req,res)=>{
    try{
         const results=await  accountController.deleteAccount(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})


module.exports = accountRouter