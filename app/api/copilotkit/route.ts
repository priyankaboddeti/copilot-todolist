import {
    CopilotRuntime,
    GoogleGenerativeAIAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
  } from '@copilotkit/runtime';
  import { NextRequest } from 'next/server';
  import { GoogleGenerativeAI } from '@google/generative-ai';
  
  const genAI = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
  const serviceAdapter = new GoogleGenerativeAIAdapter({ genAI, model: 'gemini-1.5-pro' });
  const runtime = new CopilotRuntime();
  
  export const POST = async (req: NextRequest) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: '/api/copilotkit', // Adjust this if your endpoint needs a different path
    });
  
    return handleRequest(req);
  };
  