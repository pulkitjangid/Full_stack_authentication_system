let getAccountDetails = (req,res) => {
    return res.render('account.ejs',{
        user : req.user
    });
};

module.exports = {
    getAccountDetails : getAccountDetails
}