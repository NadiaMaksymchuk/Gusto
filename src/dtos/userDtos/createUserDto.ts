export interface CreateUserDto {
    city: number;
    language: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    numberPhone: string;
    sex: number;
    password: string;
    salt: string;
}