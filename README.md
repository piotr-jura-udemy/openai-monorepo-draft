# OpenAI SDK Course Monorepo

A 5-hour Udemy course teaching developers to build ChatGPT clones, voice apps, and AI tools using OpenAI APIs.

## 🚀 Quick Start

1. **Set up your API key:**

   ```bash
   # Create .env file in the root directory
   echo "OPENAI_API_KEY=sk-your-api-key-here" > .env
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run your first AI app:**
   ```bash
   cd apps/cli
   pnpm lesson-1
   ```

## 📁 Project Structure

```
apps/
  cli/         # Terminal demos (90% of course)
packages/
  core/        # Shared OpenAI client & utilities
```

## 🎯 Course Goal

Get from zero to "I can build ChatGPT+Clone+Voice+Tools" with immediate, practical results.

## 📚 Lessons

1. ✅ **First AI app in 5 minutes** - Streaming GPT-4o responses
2. 🔄 ChatGPT clone with memory (coming next)
3. 🔄 Smart JSON replies with Zod schemas
4. 🔄 RAG: Search your documents
5. 🔄 AI with no backend (built-in tools)
6. 🔄 Voice-enabled AI (Realtime API)
7. 🔄 Generate images + speech
8. 🔄 Agents that plan + execute
9. 🔄 Batch generate content at scale
10. 🔄 Final projects showcase

## 🛠️ Requirements

- Node.js 18+
- OpenAI API key
- pnpm package manager
