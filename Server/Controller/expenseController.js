const expenseModel = require('../Model/expenseModel')
const expenseController = new Object()
const mongoose = require("mongoose")
const expenseDal = require("../Dal/expenseDal")



const GST_RATES = {
  Food: 5,
  Electronics: 18,
  Clothing: 12,
  Furniture: 18,
  Beauty: 18,
  Services: 18,
  Health: 5,
  Books: 0,
  Transportation: 28,
  Others: 18
};


expenseController.createAccount = async (req, res) => {
    try {
        const { userId, accountId, budgetAmount, category,expenseAmount,description ,initialBalance} = req.body;

        const gstRate = GST_RATES[category] || 0; // fallback to 0 if unknown category
        const gstAmount = (expenseAmount * gstRate) / 100;
         const baseAmount = expenseAmount - gstAmount;

        const newAccount = new expenseModel({
            userId,
            accountId,
            budgetAmount,
            category,
            expenseAmount,
            description,
            initialBalance,
            GST: gstAmount.toFixed(2), // save as string to match schema
            baseAmount: baseAmount.toFixed(2) // Optional: store base if neededGST: gstAmount.toFixed(2),
        });

        const savedAccount = await newAccount.save();

        return{
            status:true,
            message: 'Expense created successfully!',
            data: savedAccount
        };

    } catch (error) {
        console.error('Error creating account:', error);
           return  { status:false, error: 'Failed to create account.' };
    }
};


// expenseController.getByAccountId = async (req,res)=>{
//     try{
//         const accountId = req.params.accountId
//         console.log(accountId)
//          if (!accountId) {
//                 return{ // Corrected return
//                     status: false,
//                     message: "User ID is required in the request parameters."
//                 };
//             }
//           const accountList = await expenseModel.find({
//             accountId: new mongoose.Types.ObjectId(accountId),
//             deleted: false // Assuming you want to exclude deleted accounts
//         });
//         if(accountList && accountList.length > 0){
//             const totalExpenseAmount = accountList.reduce((sum, expense) => sum + expense.expenseAmount, 0);

//             // Add the totalExpenseAmount as a property to the data array
//             const responseData = [...accountList, { totalExpenseAmount: totalExpenseAmount }];
            

//               return { status: true ,message:" the data fetched user id ",data:responseData}
//         }
//               return {status : false ,message :' the not fetched '}

//     }catch(err){
//         console.log('error')
//          return  { status:false, error: 'Failed to fetch the  account.' };
//     }
// }

expenseController.getByAccountId = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        console.log(accountId);

        if (!accountId) {
            return{ // Send 400 Bad Request for missing parameter
                status: false,
                message: "Account ID is required in the request parameters."
            };
        }

        const accountList = await expenseModel.find({
            accountId: new mongoose.Types.ObjectId(accountId),
            deleted: false // Assuming you want to exclude deleted accounts
        });

        if (accountList && accountList.length > 0) {
            const totalExpenseAmount = accountList.reduce((sum, expense) => sum + expense.expenseAmount, 0);

            // Fetch the initialBalance from one of the expenses.
            // ASSUMPTION: All expenses for the same accountId will have the same initialBalance.
            // If this is not the case, you'll need to fetch the initialBalance from the Account model.
            const initialBalance = accountList[0].initialBalance;
            const savings = initialBalance - totalExpenseAmount;

            const responseData = [...accountList, // Changed key name to be more descriptive
               { totalExpenseAmount: totalExpenseAmount,
                savings: savings
            }];

            console.log(totalExpenseAmount);
            console.log(savings);

            return{ status: true, message: "Data fetched successfully", data: responseData }; // Send 200 OK with data
        } else {
            return  {status: false, message: "No expenses found for this account." }; // Send 404 Not Found
        }

    } catch (err) {
        console.error('Error fetching account expenses:', err); // Added more specific error logging
        return { status: false, error: 'Failed to fetch account expenses.' }; // Send 500 Internal Server Error
    }
};


expenseController.deleteExpense=async(req,res)=>{
  try{
    const expenseId=req.params.id
    const expense=await expenseModel.findByIdAndDelete(expenseId,{new:true})
    return {status:true,message:"deleted successfully",data:expense}

  }catch(err){
    console.log(err)
  }
}

expenseController.excelConverter = async(req,res)=>{
    try{
        let excelConverter = await expenseDal.generateExcel(req.query)

        if(excelConverter){
            return { status: true ,message:" the data fetched user id ",data:excelConverter}
        }
            return { status : false, message :" the could not fetch", data:{}}
    }catch(err){
         return  { status:false, error: 'Failed to fetch the  data.',data:err };
    }
}


module.exports = expenseController