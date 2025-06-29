const mongoose=require('mongoose')
const userSchema=new mongoose.Schema(
    {
        userName:{
            type:String
        },
        email:{
            type:String,
        
        },
        password:{
            type:String,
        },
        confirmPassword:{
            type:String,
            },
        deleted:{
            type:Boolean,
            default:false
        }
     },
    {
        timestamps:true
    }
)

const userModels=mongoose.model("userModels",userSchema)

module.exports=userModels