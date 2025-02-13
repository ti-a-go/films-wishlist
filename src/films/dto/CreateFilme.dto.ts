import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFilmeDTO {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  year: string;

  @IsOptional()
  language: string;
}
