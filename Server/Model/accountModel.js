const mongoose=require('mongoose')
const {Schema} = mongoose
const accountSchema=new mongoose.Schema(
    {
        userId:{
            type:Schema.Types.ObjectId
        },
        accountName:{
            type:String,
        
        },
        accountType:{
           type:String,
           enum:['Savings','Business','Current','Others'],default:'Savings'
        },
        initialBalance:{
            type:Number
            },
        budgetAmount:{
            type:Number
        }  ,  
        deleted:{
            type:Boolean,
            default:false
        }
     },
    {
        timestamps:true
    }
)

const accountModel = mongoose.model("Account", accountSchema); // Changed model name to 'Account' for clarity

module.exports = accountModel;