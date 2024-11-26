const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const UserInterface = require("../Interface/User.interface");
const jwt = require('jsonwebtoken');

class UserRepository extends UserInterface {
    create = async (nom, email, password, city) => {
        try {

            const response = await User.findOne({ email })
            if (response) {
                throw new Error("User already Exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            if (hashedPassword) {
                const res = await User.create({
                    nom,
                    email,
                    city,
                    password: hashedPassword
                })

                if (res) {
                    return { _id: res.id, email: res.email, role: res.role };
                }
            }

        } catch (error) {
            throw error;
        }

    }

    loginUser = async (email, password) => {
        try {
            const findUser = await User.findOne({ email });
            if (findUser && bcrypt.compare(password, findUser.password)) {
                const accessToken = jwt.sign({
                    user: {
                        nom: findUser.nom,
                        email: findUser.email,
                        role: findUser.role,
                        city: findUser.city,
                        id: findUser.id,
                    },
                }, process.env.ACCESSS_TOKEN_SECRET, { expiresIn: '3h' });
                return { accessToken }

            } else {
                throw new Error("Email or password is not valid");
            }

        } catch (error) {
            throw error;

        }
    }

    getAllUser = async() => {
        try {
            const response = await User.find()
            console.log(response)
            if (response) {
                return response;
            } else {
                throw err;
            }
        } catch (error) {
            throw error
        }
    }

    findUser = async(userId)=>{
        try {
            return User.findOne({"_id":userId})
            
        } catch (error) {
            throw new error
        }
    }

    updateUser = async (userId, userData) => {
        try {
            console.log(userData,userId);
            if (userData.password) {

                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
            }
            const res = await User.findById(userId)
            if (res) {
                return User.findByIdAndUpdate(
                    userId,
                    userData,
                    { new: true }
                );
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            throw error
        }

           
    };
}

module.exports = UserRepository;