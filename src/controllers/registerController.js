const { validationResult } = require('express-validator')
const registerService = require('../services/registerService')
let getRegisterPage = (req, res) => {
    return res.render("register.ejs", {
        errors: req.flash("errors")
    });
}

let createNewUser = async (req, res) => {

    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        console.log("errors: ", errors);
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/register");
    }

    try {
        let newUser = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password
        }
        console.log(newUser.fullname, newUser.password);
        await registerService.createNewUser(newUser);
        return res.redirect('/login');
    }
    catch (err) {
        req.flash("errors", err);
        return res.redirect("/register");
    }
}

module.exports = {
    getRegisterPage: getRegisterPage,
    createNewUser: createNewUser
}