const db = require("../db")

class UserService{
    getUser = async (email) => {
        const user = await db.query(`select * from users where email = '${email}';`)
        return user
    }

    createUser = async (user) => {
        const {email, name, password} = user
        const response = await db.query(`insert into users (email, name, password) values ('${email}', '${name}', '${password}');`)
        return response
    }

    isExistUser = async (email) => {
        const user = await this.getUser()
        if(user.email == email){
            return true
        }
    }
}

module.exports = new UserService()