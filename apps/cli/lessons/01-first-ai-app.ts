#!/usr/bin/env tsx
import "dotenv/config";
import { streamResponse } from "@repo/core";

/**
 * LESSON 1: First AI App in 5 Minutes
 *
 * Goal: Get immediate payoff with streaming GPT-4o response
 * Learning: Basic OpenAI API usage with real-time output
 */

async function main() {
  console.log("🚀 Welcome to your first AI app!");
  console.log("⚡ Streaming response from GPT-4o...\n");

  const prompt = `You are a helpful AI assistant. Introduce yourself and explain what you can do in a friendly, engaging way. Keep it under 100 words.`;

  console.log("🤖 AI Response:");
  console.log("─".repeat(50));

  // This is the magic moment - streaming AI response!
  const response = await streamResponse(prompt);

  console.log("─".repeat(50));
  console.log(`✅ Complete! Generated ${response.length} characters`);
  console.log("\n💡 What just happened?");
  console.log("- Connected to OpenAI GPT-4o");
  console.log("- Streamed response in real-time");
  console.log("- Used modern ES modules & TypeScript");
  console.log("\n🎯 Next: Build a ChatGPT clone with memory!");
}

// Run the lesson
main().catch((error) => {
  console.error("❌ Error:", error.message);
  console.log("\n🔧 Make sure you have OPENAI_API_KEY in your .env file");
  process.exit(1);
});
