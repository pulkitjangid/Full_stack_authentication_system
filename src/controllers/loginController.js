let getLoginPage = (req, res) => {
    return res.render("login.ejs", {
        errors: req.flash("errors")
    });
};
let checkLoggedIn = (req, res, next) => {
    console.log("Request url : ",req.url)
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    console.log('Check Logout: ',req.url)
    if (req.isAuthenticated()) {
        if(req.url == '/'){
            console.log('In / url')
            return res.redirect("/");
        }
        else if(req.url == '/account'){
            console.log("In account redirect if")
            return res.redirect("/account"); 
        }
    }
    next();
};


let postLogOut = (req, res) => {
    req.session.destroy(function (err) {
        return res.redirect("/login");
    });
};

module.exports = {
    getLoginPage: getLoginPage,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut
};