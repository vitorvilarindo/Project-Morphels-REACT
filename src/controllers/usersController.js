export class UserController {
    constructor(authService, userRepository, getUserInfos) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.getUserInfos = getUserInfos;
    }

    create = async (request, reply) => {
        try {
            const createdUser = await this.authService.register(request.body);
            if (!createdUser) {
                return reply.status(400).send({message: "User can't be created"});
            }

            return reply.status(201).send({message: "User ready to use"});
        } catch (err) {
            console.log(err)
            return reply.status(500).send({message: "Error trying to create a user"})
        }

    }

    list = async (request, reply) => {
        const user = await this.userRepository().listAllWithRoles();
        if (!user) {
            return reply.status(401).send({message: 'No one user found.'});
        }
        return reply.status(200).send(user);
    }

    getInfos = async (request, reply) => {
        try{
            const userData = await this.getUserInfos.getData(request.userID);
            if (!userData) {
                return reply.status(401).send({message: 'No user found.'});
            }
            return reply.status(200).send(userData);
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: "Error trying to get user info"})
        }
    }

    login = async (request, reply) => {
        try {
            const {loginEmail, loginPassword} = request.body;
            const user = await this.authService.login(loginEmail, loginPassword);

            if (!user) {
                return reply.status(401).send({message: 'Invalid login credentials'});
            }

            const token = reply.server.jwt.sign({sub: user.id, user: user.email}, {expiresIn: "1h"});

            reply.setCookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"
            });

            return reply.send({
                success: true,
                route: "/main"
            })

        } catch (err) {
            console.log(err);
            reply.status(503).send({message: "Error logging in"});
        }

    }

    edit = async (request, reply) => {
        try{
            const updatedUser = await this.authService.editUser(request.body, request.params.id)

            if (!updatedUser) {
                return reply.status(401).send({message: 'Invalid login credentials'});
            }

            return reply.status(201).send({message: "User edited"});
        }catch(err){
            console.log(err);
        }


    }

    delete = async (request, reply) => {
        try {
            const { id } = request.params;
            const deletedUser = this.UserRepository.delete({id});
            if (!deletedUser) {
                return reply.status(401).send({message: 'No user found.'});
            }

            return reply.status(201).send({message: "User deleted"});
        }catch(err){
            console.log(err);
            return reply.status(500).send({message: "Error deleting user"});
        }
    }
}