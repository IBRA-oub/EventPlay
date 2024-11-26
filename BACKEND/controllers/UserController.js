const UserService = require("../services/User.service");

class UserController {
    constructor() {
        this.userService = new UserService()
    }

    registerUser = async (req, res) => {
        try {
            const { nom, email, password, city } = req.body;
            const response = await this.userService.create(nom, email, password, city);
            if (response) {
                res.status(201).json(response)
            } else {
                res.status(400).json({ message: err.message });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            const response = await this.userService.loginUser(email, password);
            if (response) {
                res.status(201).json(response)
            } else {
                res.status(400).json({ message: 'User not found' });
            }

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    getAllUser = async (req, res) => {
        try {
            const users = await this.userService.getAllUser()
            if (users) {
                return res.status(200).json(users)
            }

        } catch (error) {
            return res.status(500).json({ message: 'users Not Found' })
        }

    }

    findUser = async (req, res) => {
        const userId = req.params.id;
        try {

            const user = await this.userService.findUser(userId)
            if (user) {
                res.status(200).json(user);
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }
}

module.exports = new UserController()