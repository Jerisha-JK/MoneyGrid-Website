const accountModel = require('../Model/accountModel')
const accountController = new Object()
const mongoose = require("mongoose")




// Function to calculate budget based on initial balance
const calculateBudget = (initialBalance) => {
  return Math.round(initialBalance / 0.6);
};






accountController.createAccount = async (req, res) => {
    try {
        const { userId, accountName, accountType, initialBalance } = req.body;

      console.log("Incoming account data:", req.body);
  


        if (!userId || !accountName || !accountType || !initialBalance === undefined) {
            return{ status:false,message: 'Please provide all required account details.' };
        }

        const budgetAmount = calculateBudget(parseFloat(initialBalance));

        const newAccount = new accountModel({
            userId,
            accountName,
            accountType,
            initialBalance: parseFloat(initialBalance),
            budgetAmount // Automatically set budget amount
        });

        const savedAccount = await newAccount.save();

        return{
            status:true,
            message: 'Account created successfully!',
            data: savedAccount
        };

    } catch (error) {
        console.error('Error creating account:', error);
           return  { status:false, error: 'Failed to create account.' };
    }
};


accountController.getByUserId = async (req,res)=>{
    try{
        const userId = req.params.userId
        console.log(userId)
         if (!userId) {
                return{ // Corrected return
                    status: false,
                    message: "User ID is required in the request parameters."
                };
            }
          const accountList = await accountModel.find({
            userId: new mongoose.Types.ObjectId(userId),
            deleted: false // Assuming you want to exclude deleted accounts
        });
        if(accountList && accountList.length > 0){
              return { status: true ,message:" the data fetched user id ",data:accountList}
        }
              return {status : false ,message :' the data not fetched '}

    }catch(err){
        console.log('error')
         return  { status:false, error: 'Failed to fetch the  account.' };
    }
}


accountController.updateAccount=async(req,res)=>{
  try{
    const accountId=req.params.id
    const account=await accountModel.findByIdAndUpdate(accountId, req.body,{new:true})
    return {status:true,message:"Updated successfully",data:account}

  }catch(err){
    console.log(err)
  }
}
accountController.deleteAccount=async(req,res)=>{
  try{
    const accountId=req.params.id
    const account=await accountModel.findByIdAndDelete(accountId,{new:true})
    return {status:true,message:"deleted successfully",data:account}

  }catch(err){
    console.log(err)
  }
}


module.exports = accountController