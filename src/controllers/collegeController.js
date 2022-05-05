const { get } = require("express/lib/response")
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const isValid = function(value){
    if(typeof value ==='undefined' || value === null)
    return false
    if(typeof value === 'string' && value.trim().length === 0)
    return false
    return true
}

const colleges = async function(req,res){
    try
    {
        let details = req.body
        if(!isValidRequestBody(details))
        return res.status(400).send({status:false, msg:"Please fill college details"})

        //Ectract Params
        const {name, fullName, logoLink} = details

        //validation start
        if(!isValid(name))
        return res.status(400).send({status:false, msg:"College Name is Required"})
        //Check for unique name
        let uniqueName = await collegeModel.findOne({name})
        if(uniqueName)
        return res.status(400).send({status:false, msg:`${name} college name is already registered`})

        if(!isValid(fullName))
        return res.status(400).send({status:false, msg:"FullName is required"})

        if(!isValid(logoLink))
        return res.status(400).send({status:false, msg:"LogoLink is Required"})
        if(!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&//=]*)/.test(logoLink)))        
        return res.status(400).send({ status: false, msg: "logoLink is invalid" })       
        //Validation ends

        const collegeData = {name, fullName, logoLink}

        let createdCollege = await collegeModel.create(collegeData)
        res.status(201).send({status:true,message:"College created successfully",data:createdCollege})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status:false, msg:err.message})
    }
}


const collegeDetails = async (req, res) => {
    try {
        const collegeName = req.query.collegeName
        if(!collegeName){
            res.status(400).send({ status: false, message: 'Enter college name for filteration' })
            return
        }

        let colleges = await collegeModel.findOne({isDeleted: false, name: collegeName})
        const {name, fullName, logoLink} = colleges

        if (!colleges) {
            res.status(404).send({ status: false, message: 'No colleges found' })
            return
        }

        const interns = await internModel.find({isDeleted: false, collegeId: colleges._id}, {name: 1, email: 1, mobile: 1})

        if(!isValidRequestBody(interns)){
            res.status(404).send({ status: false, message: 'No interns found' })
            return
        }
        
        colleges = await collegeModel.findOne({name: collegeName}, {name: 1, fullName: 1, logoLink: 1, interests: 1, _id: 0})

        collegeDetails = {name, fullName, logoLink, interests: interns}

        res.status(200).send({ status: true, message: 'Colleges List', data: collegeDetails })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = {colleges,collegeDetails}