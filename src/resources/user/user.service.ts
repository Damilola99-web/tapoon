import UserModel from "@/resources/user/user.model";
import token from "@/utils/token";

class UserService{
    private user = UserModel;
    
    /*
    *   @param {string} email
    *   @param {string} password
    *  @returns {Promise<User>}
    * 
    */
    public async register(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<String | Error> {
        try {
            const user = await this.user.create({
                name,
                email,
                password,
                role
            });
            const accessToken = await token.createToken(user);
            return accessToken;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    /*
    *   @param {string} email
    *   @param {string} password
    * @returns {Promise<User>}
    * 
    * */
    public async login(email: string, password: string): Promise<String | Error> {
        try {
            const user = await this.user.findOne({ email });
            if (!user) {
                throw new Error('Unable to find user with that email');
            }
            const isValidPassword = await user.isValidPassword(password);
            if (!isValidPassword) {
                throw new Error('Wrong credentials given');
            }
            const accessToken = await token.createToken(user);
            return accessToken;
        } catch (error: any) {
            throw new Error(error);
        }
    }
    
}

export default UserService;