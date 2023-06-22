const userCollection = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');


const handleErrors = (err) => {
    let errors = { email: "", password: "" }

    if (err.message === "incorrect email") errors.username = "That username is not registered"
    if (err.message === "incorrect password") errors.password = "Password is incorrect"

    if (err.code === 11000) {
        errors.username = "Username is already registered"
        return errors
    }

    if (err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

////--------------- User signup ----------------------------------------

const Register = async (req, res, next) => {
    try {
        let { username, password } = req.body
        const namereg = /^[^\s][\w\W]+$/gm;
        const passreg = /^[^\s][\w\W]+$/gm;
        if(namereg.test(username)==false){
            const errors={}
            errors.username='enter a valid username'
            res.json({ errors, created: false })
        }else if(passreg.test(password)==false){
            const errors={}
            errors.username='enter a valid password'
            res.json({ errors, created: false })
        }
        else{
        password =  password ?  await bcrypt.hash(password, 10) :null;  
        userCollection.insertMany([{ username, password }]).then((data) => {
            res.status(201).json({ user: data.insertedId, created: true })

        }).catch((err)=>{
            const errors=handleErrors(err)
            res.json({ errors, created: false })
        })
        }
    
    }
    catch (error) {
       console.log(error.message);
    }
}



//--------User Login Function here --------------------------
const Login = async (req,res)=>{
    try{
        const {username,password} = req.body
        const user=await userCollection.findOne({username:username})
        console.log(username);

        if(username===undefined) {
            const errors={username:'username required'}
            res.json({ errors, created: false })
        }

        else if(password===undefined) {
            const errors={username:'Password required'}
            res.json({ errors, created: false })
        }

        else if(user){
            let auth= password ? await bcrypt.compare(password,user.password) : null;
            if(auth){
                const token=jwt.sign({sub:user._id},'Key',{expiresIn:'3d'}) //adding topken here
                console.log(token);
                res.json({login:true,token,user})
            }else{
                const errors=handleErrors({message:"incorrect password"})
                res.json({ errors, created: false })
            }
        }else{
            const errors=handleErrors({message:"incorrect email"})
            res.json({ errors, created: false })
        }
    }catch(error){
        console.log(error);
    }
}


const imageUpload= (req,res,next)=>{
    try{
        const {userId}=req.body
        const imgUrl=req.file.filename
        userCollection.updateOne({_id:userId},{$set:{image:imgUrl}}).then(()=>{
            res.json({status:true,imageurl:imgUrl})
        })
    }catch(err){
        console.log(err);
    }
}

module.exports = { Login, Register, imageUpload };
