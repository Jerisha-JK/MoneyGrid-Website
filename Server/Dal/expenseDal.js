// const expenseDal = new Object()
// const expenseModel = require('../Model/expenseModel')
// const excelExport = require('../Helper/excelConverter')
// const userModel = require('../Model/userModel')
// const {Types} = require('mongoose')


// expenseDal.generateExcel = async (req,res)=>{
//     try{
//         let query =[{ deleted : false }]
//         if(req.userId){
//             query.push({userId: new Types.ObjectId(req.userId)})
//         }
//         if(req.accountId){
//             query.push({accountId : new Types.ObjectId(req.accountId)})
//         }

//         if (req?.fromDate && req?.toDate) {
//             query.push({
//                 createdAt: {
//                     $gte: new Date(new Date(req.fromDate).setHours(0, 0, 0, 0)),
//                     $lte: new Date(new Date(req.toDate).setHours(23, 59, 59, 59))
//                 }
//             });
//         }
//         console.log(query,"dfghjk")

//         let results  = await expenseModel.aggregate()
//         .match({$and : query})
//         .lookup({ from: 'usermodels', localField: 'userId', foreignField: '_id', as : 'user'})
//         .unwind({ path: '$user', preserveNullAndEmptyArrays:true})
//         .lookup({ from: "accounts", localField: 'accountId', foreignField: '_id', as : 'accountDetails'})
//         .unwind({ path: '$accountDetails', preserveNullAndEmptyArrays:true})
//         .project({
//             Name:"$user.userName",
//             email:"$user.email",
//             accountName:"$accountDetails.accountName",
//             accountType: "$accountDetails.accountType",
//             initialBalance:"$accountDetails.initialBalance",
//             budgetAmount: "$accountDetails.budgetAmount",
//             category:1,
//             expenseAmount:1,
//             description :1,
//              GST: 1,
//              createdAt:1,
//              id:1

//         })
//         .exec()

//        let excel = await excelExport.excelExport(results)
//         console.log( results,'cfcfcfcgg')
//         if(excel){
//             return {status :true , data: excel}
//         }
//          return{ status: false ,data:{}}

//     }catch(err){

//     }
// }

// module.exports = expenseDal