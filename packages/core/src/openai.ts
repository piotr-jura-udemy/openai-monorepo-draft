import OpenAI from "openai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Initialize OpenAI client with API key from environment
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-testing",
});

// Streaming helper for CLI demos
export async function streamResponse(prompt: string) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });

  let fullResponse = "";

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      process.stdout.write(content);
      fullResponse += content;
    }
  }

  console.log("\n"); // New line after streaming
  return fullResponse;
}

// Quick response helper (non-streaming)
export async function quickResponse(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0]?.message?.content || "";
}

// Message type for conversation history
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Stream response with conversation history
export async function streamChatResponse(
  messages: ChatMessage[]
): Promise<string> {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    stream: true,
  });

  let fullResponse = "";

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      process.stdout.write(content);
      fullResponse += content;
    }
  }

  console.log("\n"); // New line after streaming
  return fullResponse;
}

// Structured JSON response with Zod validation
export async function structuredResponse<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  name: string = "structured_output"
): Promise<T> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name,
        schema: zodToJsonSchema(schema, { target: "openApi3" }),
        strict: true,
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response content received");
  }

  try {
    const parsed = JSON.parse(content);
    return schema.parse(parsed); // Validates with Zod
  } catch (error) {
    throw new Error(`Failed to parse structured response: ${error}`);
  }
}

// Now using the proper zod-to-json-schema library! ✨

// Document chunk for RAG
export interface DocumentChunk {
  content: string;
  embedding?: number[];
  metadata?: Record<string, any>;
}

// Create embeddings for text chunks
export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });

  return response.data.map((item) => item.embedding);
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitudeA * magnitudeB);
}

// Search documents using semantic similarity
export function searchDocuments(
  query: number[],
  documents: DocumentChunk[],
  limit: number = 3
): Array<DocumentChunk & { similarity: number }> {
  return documents
    .filter((doc) => doc.embedding)
    .map((doc) => ({
      ...doc,
      similarity: cosineSimilarity(query, doc.embedding!),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
