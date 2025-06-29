const mongoose=require('mongoose')
const {Schema} = mongoose
const expenseSchema=new mongoose.Schema(
    {
        userId:{
            type:Schema.Types.ObjectId
        },
        accountId:{
            type:Schema.Types.ObjectId
        },
        budgetAmount:{
            type:Number,
        
        },
        category:{
           type:String,
           enum:['Food','Electronics','Clothing','Furniture','Beauty','Services','Health','Books','Transportation','Others'],default:'Food'
        },
        expenseAmount:{
            type:Number
            },
        description:{
            type:String
        }  ,  
        GST :{
            type:String
    },
    baseAmount: {
          type: String
       },
       totalExpenseAmount:{
          type:String
       },
       initialBalance:{
        type:String
       },
       savings:{
        type:String
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

const expenseModel = mongoose.model("Expense", expenseSchema); // Changed model name to 'Account' for clarity

module.exports = expenseModel;