const {check} = require('express-validator');

let validationRegister = [
    check('email','Invalid Email').isEmail().trim(),

    check('password',"Please enter a valid password").isLength({min : 4}),

    check('cpassword',"Passwords do not match").custom((value,{req})=>{
        return value === req.body.password
    })
]

module.exports = {
    validationRegister : validationRegister
}