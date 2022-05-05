const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")
const mongoose = require('mongoose')

const isValid = function(value){
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' &&  value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}

const interns = async function(req,res){
    try
    {
        const details = req.body
        if(!isValidRequestBody(details))
        return res.status(400).send({status:false, msg:"Please fill Intern details"})

        //Ectract params
        const {name, email, mobile, collegeId} = details 

        //Validation start
        if(!isValid(name))
        res.status(400).send({staus:false, msg:"Name is Required"})

        if(!isValid(email))
        return res.status(400).send({status:false, msg:"Email ie Required"})
        // check for valid email
        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
        return res.status(400).send({status:false, msg:"Please enter valid Email"})
        // check for unique mail
        let mail = await internModel.findOne({email})
        if(mail)
        return res.status(400).send({status:false, msg:"This mail is already exist"})

        if(!isValid(mobile))
        return res.status(400).send({status:false, msg:"Mobile no is Required"})
        //check for valid mobile no
        if(!(/^[6-9]\d{9}$/.test(mobile)))
        return res.status(400).send({status:false, msg:"Please enter valid mobile number"})
        //check for unique mob no
        let mob = await internModel.findOne({mobile})
        if(mob)
        return res.status(400).send({status:false, msg:"This mobile number is already exist"})

        if(!isValid(collegeId))
        return res.status(400).send({status:false, msg :"CollegeId is Required"})
        //check for valid collegeId
        if(!isValidObjectId(collegeId))
        return res.status(400).send({status:false, msg:"Please enter valid collegeId"})
        // Check for existing collegeId in DB
        let collegeData = details.collegeId
        let collegenum = await collegeModel.findById(collegeData)
        if(!collegenum)
        return res.status(400).send({status:false, msg:"college id is not exists"})
        // Validation ends

        const internData = {name, email, mobile, collegeId}

        const createdIntern = await internModel.create(internData)
        res.status(201).send({status:true, message:"Intern created successfully",data:createdIntern})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(500).send({status:false,error:err.message})
    }   
}

module.exports = {interns}