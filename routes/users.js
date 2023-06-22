const express = require('express');
const userRouter = express.Router();
const userController=require('../controller/userController')
const upload = require('../middleware/photo')

// /* GET users listing. */
// userRouter.get('/', function(req, res, next) {
//   res.send('hello iam working');
// });

userRouter.post('/login',userController.Login)
userRouter.post('/register',userController.Register)
userRouter.post('/profile',upload.single("image"),userController.imageUpload)

module.exports = userRouter;
