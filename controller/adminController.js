const adminCollection = require('../model/adminModel')
const userCollection= require('../model/userModel')
const jwt = require('jsonwebtoken');


const Login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await adminCollection.findOne({ username });

        if (admin) {
            if (admin.password === password) {
                console.log("Logged in successfully");
                const token = jwt.sign({ sub: admin._id }, 'Key', { expiresIn: '3d' })
                res.json({ admin: true, token })
            } else {
                console.log("Invalid password");
                const errors = { username: 'Invalid password' }
                res.json({ errors, admin: false })
            }
        } else {
            console.log("Username not found");
            const errors = { username: 'Username not found' }
            res.json({ errors, admin: false })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during login" });
    }
};
  

///here call adminhome page and user list will come 
const UsersList = async(req,res)=>{
    console.log("hello");
    let data= await userCollection.find({})
    console.log(data)   
    if(data){
        res.json({data})
    }else{
        return res.status(404).json({message:"Users are  not found"}) 
    }
}


const AddUser1 = async (req, res) => {
    let data = req.body
    try {
        let user = await userCollection.findOne({ username: data.username })
        if (user) {
            return res.status(400).json({ error: "user already exit" })
        }
        let createUser = await userCollection.create(data)
        return res.json({ user: createUser })

    } catch (error) {
        console.log(error.message);
    }
}

const AddUser =async(req,res,next)=>{
    try{
        const namereg = /^[^\s][\w\W]+$/gm;
        const passreg = /^[^\s][\w\W]+$/gm;
        const errors={}
        let {username,password}=req.body

        if(!username){
            errors.password="Username required"
            res.json({errors})
        }
        else if(!password){
            errors.password="Password required"
            res.json({errors})
        }
        
        else if(namereg.test(username)==false){
            errors.password="enter a valid username"
            res.json({errors})
        }
        else if(passreg.test(password)==false){
            errors.password="enter a valid password"
            res.json({errors})
        }else{ 
            userCollection.insertMany([{username,password}]).then(()=>{
                res.json({status:true})
            }).catch(err=>{
                console.log(err.code);
                if(err.code==11000){
                    errors.username='username already taken'
                    res.json({errors})
                }
            })          
        }
    }catch(err){
      console.log(err.message)
    }
}


const EditUser=(req,res,next)=>{
    try{
        const namereg = /^[^\s][\w\W]+$/gm;
         const {username,id} = req.body
         const errors = {}
        if(username==''){
            errors.username='Enter a username'
            res.json({errors})
        }else if(namereg.test(username)==false){
            errors.username='Enter a valid username'
            res.json({errors})
        }
        else{
            userCollection.updateOne({_id:id},{$set:{
            username:username
         }}).then(resu=>{
            console.log(resu);
            res.json({update:true})
         }).catch(err=>{
            if(err.code==11000){
                errors.username='Username already taken'
                res.json({errors})
            }
         })
        }
      
    }catch(err){
        console.log(err);
    }
}



const deleteuser = (req, res, next) => {
    const { userId } = req.body
    console.log(userId);
    userCollection.deleteOne({ _id: userId }).then(() => {
        userCollection.find().then(users => {
            res.json({ delete: true, users })
        })
    })
}



module.exports = {Login , UsersList ,deleteuser ,EditUser, AddUser}