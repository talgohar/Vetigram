import axios from 'axios';
import NodeCache from 'node-cache';
import OpenAI from 'openai';
import { Request, Response } from 'express';
import userModel, { IUser } from '../models/users_model';

interface PostAiDTO {
    title: string;
    content: string;
    imageName: string;
    owner?: IUser;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const processWithAI = async (): Promise<PostAiDTO[]> => {
  const prompt = `Return a valid JSON array (no comments, no code blocks, no explanations) with exactly 1 sample post from a veterinarian sharing clinical knowledge. The post can be about: a case study of an injury or treatment, pet health tips, diagnostic findings, or interesting animal photography with medical insights. Use only one of these image names: xray.jpg, doctor.jpg, backmri.jpg, brokenleg.jpg. Example format:
[
  {
    "title": "Clinical Case: Feline Fracture Recovery",
    "content": "Today we successfully treated a complex tibia fracture in a 3-year-old cat using modern orthopedic techniques. The patient showed excellent recovery. Always important to monitor post-operative healing closely.",
    "imageName": "xray.jpg"
  }
]`;
  try {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('AI response content is null');
    }

    const posts: PostAiDTO[] = JSON.parse(content) as PostAiDTO[];
    const ownerId = process.env.OPENAI_OWNER_ID;
    if (!ownerId) {
      throw new Error('Owner ID is not defined');
    }

    const owner = await userModel.findById(ownerId);
    if (!owner) {
      throw new Error('Owner not found');
    }

    posts.forEach(post => {
      post.owner = owner;
    });

    return posts;
  } catch (error) {
    console.error('Error processing with AI API:', error);
    throw error;
  }
}

export async function getAIProcessedContent(req: Request, res: Response) {
  try {
    const processedContent = await processWithAI();
    res.status(200).json(processedContent);
  } catch (error) {
    console.error('Error in AI processing controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

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
      "title": "Professional title for the post (4-10 words)",
      "content": "Engaging clinical insight or educational content (2-4 sentences)"
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

export default { getAIProcessedContent, suggestPostContent };
