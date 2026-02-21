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
  const prompt = `Return a valid JSON array (no comments, no code blocks, no explanations) with exactly 1 sample post about health question from patient or an answer veterinarian. Use only one of these image names: xray.jpg, doctor.jpg, backmri.jpg, brokenleg.jpg. Example format:
[
  {
    "title": "Example title",
    "content": "Example content",
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

export default { getAIProcessedContent };
