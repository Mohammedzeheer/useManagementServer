const express = require('express');
const AdminRouter = express.Router();

const adminController = require('../controller/adminController')

/* GET home page. */
// AdminRouter.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

AdminRouter.post('/',adminController.Login)
AdminRouter.get('/adminhome',adminController.UsersList)
AdminRouter.post('/deleteuser',adminController.deleteuser)
AdminRouter.post('/edituser',adminController.EditUser)
AdminRouter.post('/addUser',adminController.AddUser)

module.exports = AdminRouter;
