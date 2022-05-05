
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({

    name : {
        type : String,
        required: "Intern-Name is Required",
        trim : true 
    },
    email : {
        type : String,
        required : "Email-Address is Required",
        unique : true,
        trim : true,
        lowercase : true,
        validate : {
            validator : function(email){
                return  /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
            },
            message : "Please fill a valid Email-Address",
            isAsync : false
        }
    },
    mobile : {
        type : String,
        required :"Mobile-Number is Required",
        unique : true,
        trim : true,
        validate : {
            validator : function(mobile){
                return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)
            },
            message : "Please fill a valid Mobile-Number"
        }
    },
    collegeId :{
        type : ObjectId,
        ref : "college",
        Required : "College-Id is Required"
    },
    isDeleted : {
        type : Boolean,
        default : false
    }

},{timestamps:true})

module.exports = mongoose.model("Intern", internSchema)