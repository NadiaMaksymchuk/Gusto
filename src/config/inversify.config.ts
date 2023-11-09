import { Container } from "inversify";
import "reflect-metadata";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { UserRepository } from "../repositories/user.repository";
import { IUserService } from "../services/interfaces/user.service.interface";
import { UserService } from "../services/user.service";

const container = new Container();

container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<IUserService>("IUserService").to(UserService);

export default container;
