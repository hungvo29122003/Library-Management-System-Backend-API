const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// // [GET] localhost:3000/auth/users
// router.get('/users', authController.getAllUsers);

// // [POST] localhost:3000/auth/create
// router.post('/create', authController.createUser);

// // [POST] localhost:3000/auth/login
// router.post('/login', authController.login);

// // [PUT] localhost:3000/auth/update
// router.put('/update', authController.updateUser);

// // [GET] localhost:3000/auth/login
// router.get('/login', (req, res) => {
//     res.render('login');
// });
// // [GET] localhost:3000/auth/logout
// router.get('/logout', authController.logout);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/accounts', authController.getAccountsByRole);
router.get('/account/:id', authController.getAccountById);

router.get('/account', authController.getAccountByUsername);
router.put('/account/:id', authController.updateAccount);
router.delete('/account/delete/:tenDangNhap', authController.deleteAccount);
router.post('/logout', authController.logout);
router.get('/accountInfo/:id', authController.getAccountInfo);
router.put('/accountInfo/:id', authController.updateAccountInfo);
router.post('/accountInfoManager/:id', authController.addManagerInfo);
router.post('/accountInfoLibrarian/:id', authController.addLibrarianInfo);
router.post('/accountInfoReader/:id', authController.addReaderInfo);
module.exports = router;