import { v } from "convex/values"
import { action } from "./_generated/server"

export const translateToEnglish = action({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) throw new Error("MISTRAL_API_KEY not configured")

    const prompt = `Translate the following Spanish makeup/beauty course content to English. Return ONLY valid JSON with exactly these keys: title, excerpt, content. No markdown, no explanation.

Title: ${args.title}

Excerpt: ${args.excerpt}

Content: ${args.content}`

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "system",
            content: "You are a professional translator specializing in beauty and makeup content. Translate from Spanish to English. Return only valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Mistral API error: ${response.status} ${error}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content ?? ""

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Could not parse translation response")

    const parsed = JSON.parse(jsonMatch[0])
    return {
      title: parsed.title ?? args.title,
      excerpt: parsed.excerpt ?? args.excerpt,
      content: parsed.content ?? args.content,
      tokensUsed: data.usage?.total_tokens ?? 0,
    }
  },
})
