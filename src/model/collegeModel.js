const mongoose = require('mongoose')

const collegeSchema = new mongoose.Schema({

    name : {
        type : String,
        unique : true,
        lowercase: true,
        required : "College-Name is Required",
        trim : true
    },
    fullName : {
        type : String,
        required: "Full-Name is Required",
        trim : true
    },
    logoLink : {
        required : "Logo-Link is Required",
        type: String,
        trim : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},{timestamps:true})

module.exports = mongoose.model("college",collegeSchema)