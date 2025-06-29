const goalController = new Object()
const goalDal = require ("../Dal/goalDal");
const goalModel = require("../Model/GoalModel");


goalController.createGoal = async ( req,res)=>{
    try{
          let body = req?.body ? req.body : {};
        const goal = await goalDal.createGoal(body)
        if(goal){
            return{ status : true , message :" the goal added successfully",data:goal.data}
        }
           return { status : false , message :" the goal is not added"}
    }catch(err){
        console.log(err)
        return{ status : false , message :" internal server error ", data: err}
    }
      
}


goalController.getGoal = async ( req,res)=>{
    try{
        const goal = await goalDal.getcalculation(req.query)
        if(goal){
             return{ status : true , message :" the data fetched successfully",data:goal.data}
        }
          return { status : false , message :" the data not fetched" , data :{}}

    }catch(err){
        console.log(err)
         return{ status : false , message :" internal server error ", data: err}
    }
}


goalController.updateGoal = async ( req ,res)=>{
    try{
    let id = req?.params?.id ? req.params.id : undefined;
    let body = req?.body
    console.log(id, body)
    let goal = await goalDal.updateGoal(id ,body)
    if (goal){
         return { status : false , message :' the data updated successfully', data: goal.data}
    }
       return { status : false , message :' the data updated successfully', data: {}}
    }catch(err){
        console.log(err)
        return { status : false , message :" internal server error ", data: err}
    }
}

goalController.deleteGoal=async(req,res)=>{
  try{
    const goalId=req.params.id
    const goal=await goalModel.findByIdAndDelete(goalId,{new:true})
    return {status:true,message:"deleted successfully",data:goal}

  }catch(err){
    console.log(err)
  }
}














module.exports = goalController