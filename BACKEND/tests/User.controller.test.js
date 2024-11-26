const bcrypt = require('bcryptjs');
const userController = require('../controllers/UserController')
const UserRepository = require('../repositories/Implementation/User.implementation');

jest.mock('../repositories/Implementation/User.implementation');
jest.mock('bcryptjs');

describe('userController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '1' },
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

            const mockResponse = { _id: '1', nom: 'John Doe', email: 'john@example.com', city: 'Paris' };
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



    describe('loginUser', () => {
        it('should return 404 if user is not found', async () => {
            req.body = { email: 'john@example.com', password: 'password123' };
            UserRepository.prototype.loginUser.mockResolvedValue(null);

            await userController.loginUser(req, res);
            expect(UserRepository.prototype.loginUser).toHaveBeenCalledWith('john@example.com', 'password123');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });


        it('should return 400 if password is incorrect', async () => {
            req.body = { email: 'john@example.com', password: 'password123' };

            const mockUser = { _id: '1', email: 'john@example.com', password: 'hashedpassword' };

            jest.spyOn(UserRepository.prototype, 'loginUser').mockImplementation(async (email, password) => {
                const mockFindUser = mockUser;
                if (mockFindUser) {
                    const isPasswordValid = await bcrypt.compare(password, mockFindUser.password);
                    if (isPasswordValid) {
                        return { accessToken: "mockToken" };
                    }
                }
                throw new Error('Invalid credentials');
            });

            bcrypt.compare.mockResolvedValue(false);

            await userController.loginUser(req, res);

            expect(UserRepository.prototype.loginUser).toHaveBeenCalledWith('john@example.com', 'password123');
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });



        it('should return 200 with user details if credentials are correct', async () => {
            req.body = { email: 'john@example.com', password: 'password123' };

            const mockUser = { _id: '1', email: 'john@example.com', password: 'hashedpassword', nom: 'John Doe' };

            jest.spyOn(UserRepository.prototype, 'loginUser').mockImplementation(async (email, password) => {

                const mockFindUser = mockUser;
                if (mockFindUser) {
                    const isPasswordValid = await bcrypt.compare(password, mockFindUser.password);
                    if (isPasswordValid) {
                        return {
                            id: mockFindUser._id,
                            email: mockFindUser.email,
                            nom: mockFindUser.nom,
                        };
                    }
                }
                throw new Error('Invalid credentials');
            });

            bcrypt.compare.mockResolvedValue(true);

            await userController.loginUser(req, res);

            expect(UserRepository.prototype.loginUser).toHaveBeenCalledWith('john@example.com', 'password123');
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword'); // Vérifiez que bcrypt est appelé avec les bons arguments
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: mockUser._id, email: mockUser.email, nom: mockUser.nom });
        });



    });

    describe('getAllUser', () => {
        it('should return 200 and a list of users if successful', async () => {
            const mockUsers = [
                { _id: '1', name: 'John Doe', email: 'john@example.com' },
                { _id: '2', name: 'Jane Doe', email: 'jane@example.com' },
            ];
            UserRepository.prototype.getAllUser.mockResolvedValue(mockUsers);

            await userController.getAllUser(req, res);

            expect(UserRepository.prototype.getAllUser).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should return 500 and an error message if an error occurs', async () => {
            UserRepository.prototype.getAllUser.mockRejectedValue(new Error('Database error'));

            await userController.getAllUser(req, res);

            expect(UserRepository.prototype.getAllUser).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'users Not Found' });
        });
    });
    
    describe('findUser', () => {
        it('should return 200 and a user if successful', async () => {
            const mockUser = { _id: '1', name: 'John Doe', email: 'john@example.com' };
            UserRepository.prototype.findUser.mockResolvedValue(mockUser);

            await userController.findUser(req, res);

            expect(UserRepository.prototype.findUser).toHaveBeenCalledWith('1'); // Vérifie que l'ID est passé au service
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 500 and an error message if an error occurs', async () => {
            UserRepository.prototype.findUser.mockRejectedValue(new Error('Database error'));

            await userController.findUser(req, res);

            expect(UserRepository.prototype.findUser).toHaveBeenCalledWith('1'); // Vérifie que l'ID est passé au service
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });

    });




});
