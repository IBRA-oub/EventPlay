const UserRepository = require("../repositories/Implementation/User.implementation")

class UserService {
    constructor() {
        this.UserRepository = new UserRepository()
    }
    async create(nom, email, password,city) {
        return this.UserRepository.create(nom, email, password,city)
    }
    async loginUser(email, password){
        return this.UserRepository.loginUser(email, password)
    }
    async currentUser(userId){
        return this.UserRepository.currentUser(userId)
    }
    async getAllUser(){
        return this.UserRepository.getAllUser()
    }
    async updateUser(userId, userData, file){
        return this.UserRepository.updateUser(userId, userData, file)
    }
    async deleteUser(userId){
        return this.UserRepository.deleteUser(userId)
    }
    async findUser(userId){
        return this.UserRepository.findUser(userId)
    }

}
module.exports = UserService;
