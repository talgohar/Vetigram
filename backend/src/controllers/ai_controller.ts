import OpenAI from 'openai';
import { Request, Response } from 'express';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});



export async function suggestPostContent(req: Request, res: Response) {
  try {
    const imageBase64 = req.body.imageBase64;
    const imageMediaType = req.body.imageMediaType || 'image/jpeg';

    if (!imageBase64) {
      res.status(400).json({ error: 'Image base64 is required' });
      return;
    }

    const prompt = `You are an expert veterinarian helping colleagues share clinical knowledge. Analyze this veterinary image and suggest a professional yet engaging title and content for sharing on a veterinary social network. The post can be about: clinical cases, injuries, treatments, diagnostic findings, pet health insights, or interesting animal photography.
    
    Return ONLY a valid JSON object (no comments, no code blocks, no explanations) with exactly these fields:
    {
      "title": "Professional title for the post (2-5 words)",
      "content": "Engaging clinical insight or educational content (1-2~ sentences)"
    }
    
    Make it informative for veterinary professionals while remaining accessible to the community.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${imageMediaType};base64,${imageBase64}`,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('AI response content is null');
    }

    const suggestions = JSON.parse(content);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error in AI suggestion controller:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
}

export default { suggestPostContent };
