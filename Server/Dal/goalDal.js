const goalDal = new Object()
const goalModel = require("../Model/GoalModel")
const { Types} = require ("mongoose")

goalDal.createGoal = async (data) => {
    try {
        let payload = goalModel(data);
        let result = await payload.save();
        
        if (result) {
            return { status: true, data: result };
        }
        return { status: false, data: result }
    } catch (error) {
        return { status: false, data: error.message ? error.message : error }
    }

}

goalDal.getcalculation = async (req,res)=>{
     try{
        let query=[{deleted : false }] 
         if (req.userId) {
            query.push({ userId: new Types.ObjectId(req.userId) });
          }
         if (req.accountId) {
            query.push({ accountId: new Types.ObjectId(req.accountId) });
          }
          console.log(query)

        let goal = await goalModel.find({ $and : query}).countDocuments().exec()
        let results = await goalModel.aggregate()
        .match({ $and : query})
        .project({
          userId: 1,
          accountId: 1,
          goal: 1,
          percentage: 1,
          amount: 1,
          totalAmount: 1,
          savedPercentage: {
            $multiply: [
              { $divide: ["$amount", "$totalAmount"] }, // Amount divided by totalAmount
              100 // Multiply by 100 to get the percentage
            ]
          }
        })
     if (results) {
      return {  status: true, data: results }
    }
       return  { status : false , data :{}}
     }catch(error){
         return { status: false, data: error.message ? error.message : error }
     }
}


goalDal.updateGoal = async (id , data )=>{
    try {

         let updateQuery = {};

    // If amount is provided, increment it
    if (data.amount !== undefined) {
      updateQuery.$inc = { amount: data.amount };
    }

    // If there are other fields, update them using $set
    Object.keys(data).forEach((key) => {
      if (key !== 'amount') {
        if (!updateQuery.$set) updateQuery.$set = {};
        updateQuery.$set[key] = data[key];
      }
    });
        let result = await goalModel.findOneAndUpdate({ _id: id }, updateQuery , { new: true }).exec();
        console.log( result)
        if (result) {
            return { status: true, data: result };
        }
        return { status: false, data: result };
    } catch (error) {
        return { status: false, data: error.message ? error.message : error };
    }
}


module.exports = goalDal
