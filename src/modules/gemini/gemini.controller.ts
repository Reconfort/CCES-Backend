import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GetAIMessageDTO } from './dto/get-ai-response.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('')
    @UsePipes(new ValidationPipe({ transform: true }))
    getResponse(@Body() data: GetAIMessageDTO) {
        return this.geminiService.generateText(data);
    }
}
