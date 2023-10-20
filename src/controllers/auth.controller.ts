import CreateUserDto from "../dtos/userDtos/createUserDto";
import { hashPassword } from "../handlers/password.handles";
import { UserRepository } from "../repositories/user.repository";
import { encodeSession } from "../utils/jwtUtils/jwt.crafter.util";
import { Session } from "../models/jwt/session";


export class AuthController {
    private userRepository = new UserRepository();


    // signUp = async (req: Request, res: Response) => {
    //     const userdto = req.body as CreateUserDto;

    //     userdto.password = await hashPassword(userdto.password);
    //     await this.userRepository.addUser(userdto);
        
    //     const user = await this.userRepository.getUserByEmail(userdto.email);
        
    //     const partialSession: Session = {
    //         id: user.id,
    //         email: user.email,
    //         dateCreated: Number(new Date()),
    //         issued: 0,
    //         expires: 0
    //     };
    
    //     const { token, issued, expires } = encodeSession(process.env.TOKEN_SECRET!, partialSession);
    
    //     return {
    //         type: "success",
    //         sessionToken: token,
    //         issued,
    //         expires,
    //     };
    // }

}