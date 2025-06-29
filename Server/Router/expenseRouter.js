const express=require('express')
const expenseRouter=express.Router()
const expenseController=require('../Controller/expenseController')

expenseRouter.post('/',async(req,res)=>{
    try{
         const results=await expenseController.createAccount(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})

expenseRouter.get('/excel',async(req,res)=>{
    try{
        console.log("hsggtdftefdf")
         const results=await expenseController.excelConverter(req)
         
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})

expenseRouter.get('/:accountId',async(req,res)=>{
    try{
         const results=await  expenseController.getByAccountId(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})

expenseRouter.delete('/:id',async(req,res)=>{
    try{
         const results=await  expenseController.deleteExpense(req)
         res.status(201).send(results)
    }catch(err){
        console.log(err)
    }
})




module.exports = expenseRouter