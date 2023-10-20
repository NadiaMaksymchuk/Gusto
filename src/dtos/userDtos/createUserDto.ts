class CreateUserDto {
    city: number;
    language: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    numberPhone: string;
    imagePath: string;
    sex: number;
    password: string;
  
    constructor(
      city: number,
      language: number,
      firstName: string,
      lastName: string,
      dateOfBirth: Date,
      email: string,
      numberPhone: string,
      imagePath: string,
      sex: number,
      password: string
    ) {
      this.city = city;
      this.language = language;
      this.firstName = firstName;
      this.lastName = lastName; 
      this.dateOfBirth = dateOfBirth;
      this.email = email;
      this.numberPhone = numberPhone;
      this.imagePath = imagePath;
      this.sex = sex;
      this.password = password;
    }
  }
  
  export default CreateUserDto;