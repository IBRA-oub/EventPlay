const bcrypt = require('bcryptjs');
const userController = require('../controllers/UserController')
const UserRepository = require('../repositories/Implementation/User.implementation');

jest.mock('../repositories/Implementation/User.implementation');


describe('userController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should return 201 and the response if user registration is successful', async () => {
            req.body = { nom: 'John Doe', email: 'john@example.com', password: 'password123', city: 'Paris' };

            const mockResponse = { id: '123', nom: 'John Doe', email: 'john@example.com', city: 'Paris' };
            UserRepository.prototype.create.mockResolvedValue(mockResponse);

            await userController.registerUser(req, res);

            expect(UserRepository.prototype.create).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123', 'Paris');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it('should return 400 and an error message if user registration fails', async () => {
            req.body = { nom: 'John Doe', email: 'john@example.com', password: 'password123', city: 'Paris' };

            
            UserRepository.prototype.create.mockRejectedValue(new Error('User already exists'));

            await userController.registerUser(req, res);

            expect(UserRepository.prototype.create).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123', 'Paris');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
        });

        it('should handle unexpected errors gracefully', async () => {
            req.body = { nom: 'John Doe', email: 'john@example.com', password: 'password123', city: 'Paris' };

           
            UserRepository.prototype.create.mockRejectedValue(new Error('Unexpected error'));

            await userController.registerUser(req, res);

            expect(UserRepository.prototype.create).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123', 'Paris');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
        });
    });
});
