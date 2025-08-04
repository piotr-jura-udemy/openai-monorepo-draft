import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI client with API key from environment
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
        schema: zodToJsonSchema(schema),
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

// Convert Zod schema to JSON schema (simplified version)
function zodToJsonSchema(schema: z.ZodSchema): any {
  // This is a simplified converter - in production, use zod-to-json-schema
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties: any = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      const typeName = (value as any)._def?.typeName;

      if (typeName === "ZodOptional") {
        // Handle optional fields by recursing into the inner type
        const innerType = (value as any)._def.innerType;
        const innerTypeName = innerType._def?.typeName;

        if (innerTypeName === "ZodString") {
          properties[key] = { type: "string" };
        } else if (innerTypeName === "ZodEnum") {
          properties[key] = {
            type: "string",
            enum: innerType._def.values,
          };
        } else if (innerTypeName === "ZodNumber") {
          properties[key] = { type: "number" };
        } else if (innerTypeName === "ZodBoolean") {
          properties[key] = { type: "boolean" };
        } else if (innerTypeName === "ZodArray") {
          properties[key] = { type: "array", items: { type: "string" } };
        }
        // Don't add optional fields to required array
      } else {
        // Handle required fields
        if (typeName === "ZodString") {
          properties[key] = { type: "string" };
          required.push(key);
        } else if (typeName === "ZodNumber") {
          properties[key] = { type: "number" };
          required.push(key);
        } else if (typeName === "ZodBoolean") {
          properties[key] = { type: "boolean" };
          required.push(key);
        } else if (typeName === "ZodEnum") {
          properties[key] = {
            type: "string",
            enum: (value as any)._def.values,
          };
          required.push(key);
        } else if (typeName === "ZodArray") {
          properties[key] = { type: "array", items: { type: "string" } };
          required.push(key);
        }
      }
    }

    return {
      type: "object",
      properties,
      required,
      additionalProperties: false,
    };
  }

  return { type: "object" };
}
