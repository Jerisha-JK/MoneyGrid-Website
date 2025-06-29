const express=require('express')
const goalRouter=express.Router()
const goalController = require ("../Controller/goalController")





goalRouter.get('/:accountId',async(req,res)=>{
    try{
         const results=await goalController.getGoal (req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})
goalRouter.post('/',async(req,res)=>{
    try{
         const results=await goalController.createGoal(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})

goalRouter.put('/:id',async(req,res)=>{
    try{
         const results=await goalController.updateGoal(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})

goalRouter.delete('/:id',async(req,res)=>{
    try{
         const results=await  goalController.deleteGoal(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})


module.exports = goalRouter












module.exports = goalRouter