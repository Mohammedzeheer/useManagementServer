const express = require('express');
const AdminRouter = express.Router();

const adminController = require('../controller/adminController');
const  auth  = require('../middleware/jwt');


AdminRouter.post('/',adminController.Login)
AdminRouter.post('/adminhome',auth,adminController.UsersList)
AdminRouter.post('/deleteuser',adminController.deleteuser)
AdminRouter.post('/edituser',adminController.EditUser)
AdminRouter.post('/addUser',adminController.AddUser)

module.exports = AdminRouter;
