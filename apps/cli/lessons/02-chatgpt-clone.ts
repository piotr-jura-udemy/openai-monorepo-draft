#!/usr/bin/env tsx
import "dotenv/config";
import { streamChatResponse, type ChatMessage } from "@repo/core";
import * as readline from "readline";

/**
 * LESSON 2: ChatGPT Clone with Memory
 *
 * Goal: Build a terminal chat app that remembers conversation
 * Learning: Conversation history, streaming chat, user input loop
 */

// Create readline interface for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Conversation history - this is the "memory"
const conversation: ChatMessage[] = [
  {
    role: "system",
    content:
      "You are a helpful AI assistant. Be conversational, friendly, and remember what the user tells you throughout our chat.",
  },
];

async function chatLoop() {
  console.log("🤖 ChatGPT Clone v2.0");
  console.log("💭 Now with memory! I'll remember our conversation.");
  console.log("💡 Type 'exit' or 'quit' to end the chat\n");

  while (true) {
    // Get user input
    const userMessage = await new Promise<string>((resolve) => {
      rl.question("You: ", resolve);
    });

    // Check for exit commands
    if (
      userMessage.toLowerCase() === "exit" ||
      userMessage.toLowerCase() === "quit"
    ) {
      console.log("\n🤖 Thanks for chatting! Goodbye! 👋");
      break;
    }

    // Add user message to conversation history
    conversation.push({
      role: "user",
      content: userMessage,
    });

    // Stream AI response
    console.log("\n🤖 AI: ");
    const aiResponse = await streamChatResponse(conversation);

    // Add AI response to conversation history
    conversation.push({
      role: "assistant",
      content: aiResponse,
    });

    console.log(`\n💾 Memory: ${conversation.length - 1} messages stored\n`);
  }

  rl.close();
}

// Run the chat
chatLoop().catch((error) => {
  console.error("❌ Error:", error.message);
  console.log("\n🔧 Make sure you have OPENAI_API_KEY in your .env file");
  rl.close();
  process.exit(1);
});
