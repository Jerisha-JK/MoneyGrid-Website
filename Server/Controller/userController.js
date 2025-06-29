const userModels = require('../Model/userModel')
const userController = new Object()
const validator = require('validator')


userController.userRegister=async(req,res)=>{
    const{userName,password,email,confirmPassword}=req.body
    try{
       const exitemail=await userModels.findOne({email:email})
       if(exitemail){
        //console.log(exitemail,"bgxsfc")
        return{status:false ,message:"The email is already exist..."}
       }
       if(!validator.isEmail(email)){
            return{status:false,message:"The User given email not in format"}
        }
        
       if(password.length< 5){
           return{status:false,message:"the password length is less than 8 character"}
       }
     const newUser=await userModels({
        
        userName:userName,
        password:password,
        email:email,
         confirmPassword:confirmPassword})
     
      const user=await newUser.save()
      
      if(user){
        return{status:true,message:"the user register has been done succesfully",data:user}
      }
      return{status:false,message:"The user does not register the page"}
    }catch(err){
        console.log(err)
    }
}

userController.userLogin=async(req,res)=>{
  const{email,password}=req.body
  try{
    const user=await userModels.findOne({email:email})
    if(!user){
      return{status:false,message:"the given email does not match"}
    }
    if (password != user.password){
        return{ status:false ,message :'password is mismatched' }
    }
        return { status: true, message:"login successfull",data:user}
  }catch(err){
    console.log(err)
  }
}

userController.getUser=async(req,res)=>{
  try{
    const userId=req.params.id
    const user=await userModels.findById(userId)
    return {status:true,message:"the data successfully",data:user}

  }catch(err){
    console.log(err)
  }
}

userController.updateUser=async(req,res)=>{
  try{
    const userId=req.params.id
    const user=await userModels.findByIdAndUpdate(userId, req.body,{new:true})
    return {status:true,message:"Updated successfully",data:user}

  }catch(err){
    console.log(err)
  }
}

module.exports = userController