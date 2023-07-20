const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

// Authentication & Authorization
// Signup and Login user route
// special endpoint - does not follow rest philosophy
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Forgot and reset password route
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Update Password
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

// Update and Delete User data
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// Follows rest philosophy
// The name of the route does not specify the action to be performed
// These routes are for system administrator to get/create/update/delete users
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
