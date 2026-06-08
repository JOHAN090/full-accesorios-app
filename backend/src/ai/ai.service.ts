import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private productosService: ProductosService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'mock-key');
  }

  async generateChatResponse(message: string): Promise<string> {
    try {
      // 1. Fetch current catalog context
      const productosResult = await this.productosService.findAll({ limit: 100 });
      const catalogInfo = productosResult.data.map(p => 
        `- ${p.nombre} (Categoría: ${p.categoria?.nombre || 'General'}): ${p.precio} Bs. [Stock: ${p.stock > 0 ? p.stock : 'Agotado'}]. ${p.en_oferta ? '¡EN OFERTA!' : ''}`
      ).join('\n');

      // 2. Build system prompt
      const systemPrompt = `
Eres el vendedor virtual estrella de "FULL Accesorios", una tienda de tecnología en Bolivia.
Tu tono debe ser amable, entusiasta y servicial. Usa emojis.
Tu objetivo es ayudar al cliente a encontrar productos, responder sus dudas de stock y precios, y animarlos a comprar.

A continuación te presento el catálogo en tiempo real de nuestra tienda:
${catalogInfo || 'Actualmente no hay productos en el catálogo.'}

REGLAS ESTRICTAS:
1. NUNCA inventes productos, precios o stock que no estén en la lista de arriba.
2. Si el cliente pregunta por algo que no tenemos, dile amablemente que no hay stock por el momento y sugiérele un producto similar de la lista.
3. Los precios están en Bolivianos (Bs).
4. Sé conciso. No des listas larguísimas a menos que te lo pidan.
      `;

      // 3. Call Gemini API
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
          {
            role: 'model',
            parts: [{ text: 'Entendido. Soy el vendedor de FULL Accesorios y usaré estrictamente el catálogo proporcionado. ¡Estoy listo para ayudar al cliente!' }],
          },
        ],
      });

      const result = await chat.sendMessage(message);
      const responseText = result.response.text();
      
      return responseText;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new InternalServerErrorException('Error al contactar con el asistente de IA: ' + error.message);
    }
  }
}
