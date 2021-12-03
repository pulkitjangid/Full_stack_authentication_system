const express = require('express');
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const homePageController = require('../controllers/homePageController');
const accountPageController = require('../controllers/accountPageController');
const resetController = require('../controllers/resetController');
const auth = require('../validation/authValidation');
const initPassportLocal = require('../controllers/passportLocalController');
const passport = require("passport");
const crypto = require('crypto');
const { reset } = require('nodemon');

let router = express.Router();

initPassportLocal();

let initWebRoutes = (app) => {

    router.get("/",loginController.checkLoggedIn,homePageController.getHomePage);
    router.get('/account',loginController.checkLoggedIn,accountPageController.getAccountDetails);
    router.get('/login',loginController.checkLoggedOut, loginController.getLoginPage);
    router.post('/login', passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));

    router.get('/register',registerController.getRegisterPage);
    router.post('/register',auth.validationRegister,registerController.createNewUser);
    router.post('/logout',loginController.postLogOut);
    router.get('/reset-password',resetController.getResetPasswordPage);
    router.post('/reset-password',resetController.resetUserPassword);
    router.get('/reset/:token',resetController.showResetPage);
    router.post('/reset/:token',resetController.setNewPassword);
    return app.use("/", router);
};
module.exports = initWebRoutes;
