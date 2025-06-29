const mongoose=require('mongoose')
const {Schema} = mongoose
const goalSchema=new mongoose.Schema(
    {
        userId:{
            type:Schema.Types.ObjectId
        },
        accountId:{
            type:Schema.Types.ObjectId
        },
        goal:{
            type : String ,
        },
        percentage:{
             type :String ,

        },
        targetAmount:{
            type : Number
        },
        requiredAmount:{
            type:Number
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

const goalModel = mongoose.model("goal", goalSchema); // Changed model name to 'Account' for clarity

module.exports = goalModel;