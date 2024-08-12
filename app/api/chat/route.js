import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages array is required' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama3-8b-8192',
    });

    const content = chatCompletion.choices[0]?.message?.content || '';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({
      error: 'Failed to generate a response. Please try again later.',
      details: error.message,
    }, { status: 500 });
  }
}

