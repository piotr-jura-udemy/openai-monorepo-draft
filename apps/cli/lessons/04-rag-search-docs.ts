#!/usr/bin/env tsx

/**
 * Module 4: RAG v1 - Search your docs
 *
 * Learn to build document search using OpenAI embeddings:
 * - Create embeddings for text chunks
 * - Find semantically similar content
 * - Answer questions using relevant context
 */

import {
  openai,
  streamResponse,
  createEmbeddings,
  searchDocuments,
  type DocumentChunk,
} from "@repo/core";

// Sample company knowledge base
const documents = [
  {
    content:
      "Our company offers flexible remote work policies. Employees can work from home up to 3 days per week. We provide a $500 home office stipend and require at least 2 days in the office for collaboration.",
    metadata: { category: "HR", topic: "remote-work" },
  },
  {
    content:
      "The annual performance review process starts in January. Employees set goals with their managers, receive 360-degree feedback, and are evaluated on both technical skills and cultural values.",
    metadata: { category: "HR", topic: "performance" },
  },
  {
    content:
      "Our product roadmap for Q2 includes launching the mobile app, implementing real-time notifications, and adding multi-language support. The engineering team is prioritizing performance optimizations.",
    metadata: { category: "Product", topic: "roadmap" },
  },
  {
    content:
      "For customer support, we use a tiered system. Level 1 handles basic inquiries, Level 2 manages technical issues, and Level 3 escalates to engineering. Average response time is 4 hours.",
    metadata: { category: "Support", topic: "process" },
  },
  {
    content:
      "The marketing budget for Q2 is allocated as follows: 40% digital advertising, 30% content marketing, 20% events and webinars, 10% influencer partnerships.",
    metadata: { category: "Marketing", topic: "budget" },
  },
  {
    content:
      "Security protocols require all employees to use 2FA, update passwords quarterly, and complete security training annually. VPN access is mandatory for remote work.",
    metadata: { category: "IT", topic: "security" },
  },
];

async function buildKnowledgeBase(): Promise<DocumentChunk[]> {
  console.log("🔄 Building knowledge base with embeddings...\n");

  // Create embeddings for all documents
  const texts = documents.map((doc) => doc.content);
  console.log(`📄 Processing ${texts.length} documents...`);

  const embeddings = await createEmbeddings(texts);
  console.log("✅ Embeddings created successfully!\n");

  // Combine documents with their embeddings
  return documents.map((doc, index) => ({
    ...doc,
    embedding: embeddings[index],
  }));
}

async function searchAndAnswer(
  query: string,
  knowledgeBase: DocumentChunk[]
): Promise<void> {
  console.log(`🔍 Searching for: "${query}"\n`);

  // Create embedding for the search query
  const [queryEmbedding] = await createEmbeddings([query]);

  // Find most relevant documents
  const results = searchDocuments(queryEmbedding, knowledgeBase, 3);

  // Show search results with similarity scores
  console.log("📊 Search Results:");
  results.forEach((result, index) => {
    console.log(
      `\n${index + 1}. Similarity: ${(result.similarity * 100).toFixed(1)}%`
    );
    console.log(`   Category: ${result.metadata?.category}`);
    console.log(`   Content: ${result.content.substring(0, 100)}...`);
  });

  // Use top results as context for AI response
  const context = results.map((r) => r.content).join("\n\n");

  const prompt = `Based on the following company information, answer this question: "${query}"

Company Information:
${context}

Please provide a helpful answer based only on the information provided above.`;

  console.log("\n🤖 AI Answer based on search results:\n");
  await streamResponse(prompt);
  console.log("\n" + "=".repeat(60) + "\n");
}

async function main() {
  console.log("🚀 Module 4: RAG v1 - Search your documents\n");

  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.log("❌ Missing OPENAI_API_KEY environment variable");
    console.log("   Set your API key: export OPENAI_API_KEY=your_key_here");
    console.log("\n💡 This lesson demonstrates:");
    console.log("   - Document embeddings for semantic search");
    console.log("   - Cosine similarity calculations");
    console.log("   - RAG (Retrieval Augmented Generation)");
    console.log("   - Context-aware AI responses");
    return;
  }

  // Build the knowledge base
  const knowledgeBase = await buildKnowledgeBase();

  // Demo queries
  const queries = [
    "What is our remote work policy?",
    "How does performance review work?",
    "What's planned for Q2?",
    "Tell me about our security requirements",
  ];

  // Search and answer each query
  for (const query of queries) {
    await searchAndAnswer(query, knowledgeBase);
  }

  console.log("🎉 RAG v1 Demo Complete!");
  console.log("\n💡 What you learned:");
  console.log("- Created embeddings for document search");
  console.log("- Calculated semantic similarity scores");
  console.log("- Retrieved relevant context for AI responses");
  console.log("- Built a basic document Q&A system");
}

// Run the demo
main().catch(console.error);
