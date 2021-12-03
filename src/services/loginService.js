const connection = require('../configs/connectDB');
const bcryptjs = require('bcryptjs');

let findUserByEmail = (email) => {
    return new Promise((resolve,rejects)=>{
        try{
            connection.query("SELECT * FROM new_table WHERE email = ?",[email],(err,rows)=>{
                if(err){
                    rejects(err);
                }
                else{
                    let user = rows[0];
                    resolve(user)
                }
            })
        }
        catch(err){
            rejects(err)
        }
    })
}

let comparePasswordUser = (user,password) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            let isMatch = await bcryptjs.compare(password,user.password);
            if(isMatch) resolve(true);
            resolve(`The password is incorrect`)
        }
        catch(err){
            reject(err)
        }
    })
}

let findUserById =(id)=>{
    return new Promise((resolve,reject)=>{
        try{
            connection.query("SELECT * from new_table where id = ?",[id],(err,rows)=>{
                if(err) reject(err);
                let user = rows[0]
                resolve(user);
            })
        }
        catch(error){
            reject(error)
        }
    })
}

module.exports = {
    findUserByEmail : findUserByEmail,
    comparePasswordUser : comparePasswordUser,
    findUserById : findUserById
}