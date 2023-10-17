class UserDto {
    id: bigint; // PK
    city: number;
    language: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    numberPhone: string;
    imagePath: string;
    sex: number;
  
    constructor(
      id: bigint,
      city: number,
      language: number,
      firstName: string,
      lastName: string,
      dateOfBirth: Date,
      email: string,
      numberPhone: string,
      imagePath: string,
      sex: number,
    ) {
      this.id = id;
      this.city = city;
      this.language = language;
      this.firstName = firstName;
      this.lastName = lastName;
      this.dateOfBirth = dateOfBirth;
      this.email = email;
      this.numberPhone = numberPhone;
      this.imagePath = imagePath;
      this.sex = sex;
    }
  }
  
  export default UserDto;