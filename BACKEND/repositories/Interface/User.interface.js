class UserInterface{

    constructor(){
        if(new.target === UserInterface){
            throw new Error('It is an abstract class can not be instancited');
        }

    }

    async create(nom, email, password,city){
        throw new Error('Must be Implemented!!');
    }
    async loginUser(email, password){
        throw new Error('Must be Implemented!!');
    }
    async currentUser(userId){
        throw new Error('Must be Implemented!!');
    }
    async getAllUser(){
        throw new Error('Must be Implemented!!');
    }
    async updateUser(userId, userData, file){
        throw new Error('Must be Implemented!!');
    }
    async deleteUser(userId){
        throw new Error('Must be Implemented!!');
    }
    async findUser(userId){
        throw new Error('Must be Implemented!!');
    }

}
module.exports = UserInterface