const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const UserInterface = require("../Interface/User.interface");

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
}

module.exports = UserRepository;