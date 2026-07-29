import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}