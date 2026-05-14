import bcrypt from "bcrypt";

export class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async login(email, password) {
        const user = await this.userRepository.findUserByEmail(email);

        if (!user || await bcrypt.compare(password, user.password)) {
            throw new Error("Invalid email or password");
        }

        await this.userRepository.updateLastAccess(user.id);
        return user;
    }

    async register(data) {
        const encryptedPassword = await bcrypt.hash(data.password, 10);

        return await this.userRepository.createUser({
            ...data, password: encryptedPassword, last_access: new Date(), sing_up_date: new Date(),

        });
    }
}