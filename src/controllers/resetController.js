const { rejects } = require('assert');
const connection = require('../configs/connectDB');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const registerService = require('../services/registerService')
const bcryptjs = require('bcryptjs')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'pulkitjangid420@gmail.com',
        pass: 'qazwsx@123',
    },
});

transporter.verify().then(console.log('SMTP server connected')).catch(console.error);
//getting the page
let getResetPasswordPage = (req, res) => {
    return res.render("reset-password.ejs", {
        errors: req.flash("errors")
    });
}

//post on the page
let resetUserPassword = (req, res) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) return console.log(err);
        const token = buffer.toString('hex');
        try {
            console.log("Going to check")
            const check = await registerService.checkEmailUser(req.body.email);
            if (!check) {
                let err = `${req.body.email} does not exist, please try using other email.`;
                req.flash("errors", err);
                return res.redirect('/reset-password');
            }
            else {
                // let event = new Date() + 3600000;
                var now = new Date();
                now.setMinutes(now.getMinutes() + 5)
                let dait = new Date(now).toISOString().replace(/T/, ' ').replace(/\..+/, '')
                console.log(dait);
                let sql = `UPDATE new_table SET resetToken = ?,expireToken=? WHERE email = ?`;
                connection.query(sql, [token, dait, req.body.email], (err, rows) => {
                    if (err) return console.log(err);
                    else {
                        console.log(rows)
                        transporter.sendMail({
                            to: req.body.email,
                            from: 'pulkitjangid420@gmail.com',
                            subject: 'Reset Password',
                            html: `
                            <p>Your link for resetting password</p>
                            <h5>Please, click on this<a href="http://localhost:3000/reset/${token}"> link </a> to set new password</h5>
                            `
                        })
                        let msg = `Check your email`;
                        req.flash("errors", msg);
                        return res.redirect('/reset-password');
                    }
                })
            }

        }
        catch (errors) {
            console.log("Errors: ", errors);
            req.flash("errors", errors);
            return res.redirect("/reset-password");
        }
    });
};
let setNewPassword = (req, res) => {
    if (req.body.password === req.body.cpassword) {
        console.log("hello")
        let url = req.url
        const arr = url.split("/")
        console.log(arr[2])
        let salt = bcryptjs.genSaltSync(10);
        let password = bcryptjs.hashSync(req.body.password, salt)
        let date1 = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        console.log(date1);
        let sqll = `UPDATE new_table SET password = ? WHERE resetToken = ? AND expireToken > ?`
        connection.query(sqll, [password, arr[2],date1], (err, rows) => {
            if (err) return console.log(err);
            else {
                console.log(rows.affectedRows);
                if(rows.affectedRows > 0){
                    let msgg = `Password reset successfully 🤗`;
                    req.flash("errors", msgg);
                    res.redirect('/login');
                }
                else{
                    req.flash("errors",`Sorry , 🙁 the token is expired, please try again`);
                    res.redirect("/login")
                }
            }
        })
    }
    else {
        let err = `Passwords do not match`
        req.flash("errors", err);
        return res.redirect(req.url);
    }
}

let showResetPage = (req, res) => {
    return res.render('set-password.ejs', {
        req: req
    });
}

module.exports = {
    resetUserPassword: resetUserPassword,
    getResetPasswordPage: getResetPasswordPage,
    setNewPassword: setNewPassword,
    showResetPage: showResetPage

}