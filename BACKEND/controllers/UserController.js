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
}

module.exports = new UserController()