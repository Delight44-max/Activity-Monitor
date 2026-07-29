import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  message: string;
}