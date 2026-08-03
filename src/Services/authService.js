import bcrypt from "bcrypt";

export class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async login(email, password) {
        const user = await this.userRepository.findUserByEmail(email);
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!user || !isValidPassword) {
            throw new Error("Invalid email or password");
        }

        await this.userRepository.updateLastAccess(email);
        return user;
    }

    async register(data) {
        const encryptedPassword = await bcrypt.hash(data.password, 10);

        return await this.userRepository.createUser({
            ...data, password: encryptedPassword, last_access: new Date(), sing_up_date: new Date(),

        });
    }

    async editUser(data, id) {
        const encryptedPassword = data.password? await bcrypt.hash(data.password, 10) : null

        return await this.userRepository.updateUser({
            ...data, password: encryptedPassword
        }, id)
    }
}