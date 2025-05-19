import { IsString } from 'class-validator';
export class CreateTicketDto {
  @IsString() readonly institution: string;
  @IsString() readonly category: string;
  @IsString() readonly description: string;
}