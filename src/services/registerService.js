const connection = require("../configs/connectDB");
const bcryptjs = require('bcryptjs')

let createNewUser = (user)=>{
    return new Promise(async(resolve,reject)=>{

        try{
            let check = await checkEmailUser(user.email)
            
            if(check){
                reject(`The email : ${user.email} already exist, please try using other email.`);
            }
            else{
                let salt = bcryptjs.genSaltSync(10);
                let data = {
                    fullname : user.fullname,
                    email : user.email,
                    password : bcryptjs.hashSync(user.password, salt)
                }
                console.log(data);
                connection.query("INSERT INTO new_table SET ?",[data],(err,rows)=>{
                    if(err){
                        reject(err)
                    }
                    resolve(`Registration successful`);
                })
            }
        }
        catch(err){
         reject(err)
        }
    })
}

let checkEmailUser = (email) =>{
    return new Promise((resolve,reject)=>{
        try{
            connection.query("SELECT * FROM new_table WHERE email = ?",[email],(err,rows)=>{
                console.log("Cheking");
                if(err){
                    reject(err)
                }
                else{
                    if(rows.length > 0){
                        // console.log("I am in true")
                        resolve(true)
                    }
                    else{
                        resolve(false)
                    }
                }
            })
        }
        catch(err){
            reject(err);
        }
    })
}

module.exports = {
    createNewUser : createNewUser,
    checkEmailUser : checkEmailUser
}