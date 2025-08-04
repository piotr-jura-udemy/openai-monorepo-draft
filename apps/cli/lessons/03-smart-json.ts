#!/usr/bin/env tsx
import "dotenv/config";
import { structuredResponse, z } from "@repo/core";

/**
 * LESSON 3: Smart JSON Replies with Zod Schemas
 *
 * Goal: Extract structured data from unstructured text for automation
 * Learning: JSON Schema responses, Zod validation, type safety
 */

// Define the structure we want from the AI
const CustomerFeedbackSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.enum([
    "bug",
    "feature_request",
    "complaint",
    "praise",
    "question",
  ]),
  summary: z.string(),
  action_items: z.array(z.string()),
  customer_name: z.string(),
});

type CustomerFeedback = z.infer<typeof CustomerFeedbackSchema>;

async function main() {
  console.log("🎯 Lesson 3: Smart JSON with Zod Schemas");
  console.log("📧 Analyzing customer feedback for structured insights...\n");

  const customerEmail = `
    The course is ok, though the instructor is not very good.
  `;

  console.log("📬 Customer Email:");
  console.log("─".repeat(60));
  console.log(customerEmail.trim());
  console.log("─".repeat(60));

  console.log("\n🤖 AI Analysis (Structured JSON):");
  console.log("⚡ Processing with GPT-4o + JSON Schema...\n");

  const prompt = `
    Analyze this customer feedback and extract structured information:
    
    ${customerEmail}
    
    Extract the sentiment, priority level, category, summary, action items, and customer name. 
    If customer name is not explicitly mentioned, extract it from email signatures or infer from context.
  `;

  try {
    // This is the magic - structured JSON with validation!
    const analysis: CustomerFeedback = await structuredResponse(
      prompt,
      CustomerFeedbackSchema,
      "customer_feedback_analysis"
    );

    console.log("📊 Structured Analysis Results:");
    console.log("═".repeat(50));
    console.log(`🎭 Sentiment: ${analysis.sentiment.toUpperCase()}`);
    console.log(`⚠️  Priority: ${analysis.priority.toUpperCase()}`);
    console.log(`📂 Category: ${analysis.category}`);
    console.log(`👤 Customer: ${analysis.customer_name}`);
    console.log(`📝 Summary: ${analysis.summary}`);
    console.log(`🔧 Action Items:`);
    analysis.action_items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item}`);
    });
    console.log("═".repeat(50));

    console.log("\n✅ Perfect! No parsing errors - Zod validated everything!");
    console.log("💡 This structured data can now trigger:");
    console.log("   • Automatic priority routing");
    console.log("   • Category-based assignment");
    console.log("   • Sentiment tracking dashboards");
    console.log("   • Action item workflows");
  } catch (error) {
    console.error("❌ Error:", error);
  }

  console.log("\n🎯 Next: Search your own documents with RAG!");
}

// Run the lesson
main().catch((error) => {
  console.error("❌ Error:", error.message);
  console.log("\n🔧 Make sure you have OPENAI_API_KEY in your .env file");
  process.exit(1);
});
