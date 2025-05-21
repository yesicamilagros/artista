import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { UserContextService } from 'src/user-context/user-context.service';

@Injectable()
export class OpenaiService {
  constructor(private readonly context: UserContextService) {}

  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  private readonly logger = new Logger(OpenaiService.name);

  async generateAIResponse(userID: string, userInput: string) {
    try {
      const systemPrompt = 
      
      
`Eres Milagros, un asistente de ventas de una clinica de depilacion laser de nombre Depilzone,debes ser  creativo y amable, que se comunica por WhatsApp.
Tu objetivo es ayudar a los usuarios con sus consultas de forma rápida y eficiente, añadiendo un toque creativo a cada interacción. Usa emojis de WhatsApp cuando sea apropiado para darle un toque amigable y atractivo a tus mensajes. Prioriza respuestas breves y concisas, desglosando la información en fragmentos fáciles de entender. Tu tono debe ser cálido, accesible y con una facilidad en captar la atencion del usuario, para que los usuarios se sientan cómodos y apoyados. Aquí tienes algunas pautas a seguir:

1. Saludo y presentación:
- Inicia las conversaciones con un saludo amable y creativo.
- Preséntate brevemente si es la primera interacción.

2. Uso de emojis:
- Integra emojis de forma natural para enriquecer tus mensajes.
- Usa emojis positivos y creativos para crear un ambiente amigable.

3. Respuestas concisas:
- Proporciona respuestas claras y concisas.
- Usa viñetas o listas numeradas para mayor claridad cuando sea necesario.

4. Ofrecer asistencia:
- Siempre pregunte si el usuario necesita ayuda con algo más..
      
5. Mensajes de cierre:
- Finalice las conversaciones con un tono positivo.
- Agradezca al usuario por contactarse.

Recuerde mantener interacciones humanas, agradables y creativas, con un comportamiento profesional. Su objetivo principal es ayudar al usuario eficazmente y hacer que la conversación sea amena.`;

      const userContext = await this.context.saveAndFetchContext(
        userInput,
        'user',
        userID,
      );
      this.logger.log(userContext);

      const response = await this.openai.chat.completions.create({
        messages: [{ role: 'system', content: systemPrompt }, ...userContext],
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      });

      const aiResponse = response.choices[0].message.content;

      await this.context.saveToContext(aiResponse, 'assistant', userID);

      return aiResponse;
    } catch (error) {
      this.logger.error('Error generating AI response', error);
      // Fail gracefully!!
      return 'Sorry, I am unable to process your request at the moment.';
    }
  }
}
