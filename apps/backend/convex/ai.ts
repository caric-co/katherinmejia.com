import { v } from "convex/values";

import { action } from "./_generated/server";

async function callMistral(systemPrompt: string, userPrompt: string, maxTokens = 2000) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY not configured");

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mistral API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0]?.message?.content ?? "",
    tokensUsed: data.usage?.total_tokens ?? 0,
  };
}

export const translateToEnglish = action({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
  },
  handler: async (_ctx, args) => {
    const { text, tokensUsed } = await callMistral(
      "You are a professional translator specializing in beauty and makeup content. Translate from Spanish to English. Preserve all HTML tags exactly as-is, only translate the text content within them. Return only valid JSON.",
      `Translate the following Spanish content to English. Return ONLY valid JSON with exactly these keys: title, excerpt, content. Preserve all HTML markup in the content field. No markdown, no explanation.\n\nTitle: ${args.title}\n\nExcerpt: ${args.excerpt}\n\nContent: ${args.content}`,
      4000,
    );

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse translation response");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      title: parsed.title ?? args.title,
      excerpt: parsed.excerpt ?? args.excerpt,
      content: parsed.content ?? args.content,
      tokensUsed,
    };
  },
});

export const generateExcerpt = action({
  args: { content: v.string() },
  handler: async (_ctx, args) => {
    const { text, tokensUsed } = await callMistral(
      "You are a content editor for a beauty and makeup blog. Generate concise, engaging excerpts in the same language as the input.",
      `Generate a 1-2 sentence excerpt/summary for the following blog post content. Return ONLY the excerpt text, no quotes, no explanation:\n\n${args.content}`,
      200,
    );
    return { excerpt: text.trim().replace(/^["']|["']$/g, ""), tokensUsed };
  },
});

export const improveText = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    const { text, tokensUsed } = await callMistral(
      "You are a professional editor for a beauty and makeup blog written in Spanish. Improve the text for clarity, tone, coherence, and correct any spelling or grammar issues. Keep the same voice and intent. Return ONLY the improved text, no explanation.",
      `Improve the following text:\n\n${args.text}`,
      4000,
    );
    return { improved: text.trim(), tokensUsed };
  },
});

export const reviewText = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    const { text, tokensUsed } = await callMistral(
      "You are a professional Spanish copy editor specializing in beauty content. Review text and provide specific, actionable suggestions. Respond in Spanish.",
      `Review the following text and provide suggestions for improvement in these categories. Return valid JSON with these keys: spelling (array of issues), tone (string suggestion), coherence (string suggestion), overall (string overall assessment). If no issues, use empty arrays or "Sin observaciones".\n\nText:\n${args.text}`,
      1000,
    );

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        suggestions: { spelling: [], tone: "Sin observaciones", coherence: "Sin observaciones", overall: text.trim() },
        tokensUsed,
      };
    }

    return { suggestions: JSON.parse(jsonMatch[0]), tokensUsed };
  },
});

export const translateText = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    if (!args.text.trim()) return { translated: "", tokensUsed: 0 };
    const { text, tokensUsed } = await callMistral(
      "You are a professional translator specializing in beauty and makeup content. Translate from Spanish to English. Return ONLY the translated text, no quotes, no explanation.",
      `Translate the following Spanish text to English:\n\n${args.text}`,
      1000,
    );
    return { translated: text.trim().replace(/^["']|["']$/g, ""), tokensUsed };
  },
});

export const generateLessonMetadata = action({
  args: { transcript: v.string() },
  handler: async (_ctx, args) => {
    if (!args.transcript.trim()) return { title: "", description: "", tokensUsed: 0 };
    const { text, tokensUsed } = await callMistral(
      `You are a Spanish content editor for an online makeup and beauty course platform. Given a video lesson transcript, generate:

1. A concise, descriptive title in Spanish (max 60 chars). Use proper Spanish title capitalization.
2. A brief description in Spanish (1-2 sentences, max 200 chars) summarizing what the student will learn.

Respond in JSON format only: {"title": "...", "description": "..."}`,
      `Transcript:\n\n${args.transcript.slice(0, 4000)}`,
      300,
    );
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return { title: "", description: "", tokensUsed };
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: (parsed.title ?? "").replace(/^["']|["']$/g, ""),
        description: (parsed.description ?? "").replace(/^["']|["']$/g, ""),
        tokensUsed,
      };
    } catch {
      return { title: "", description: "", tokensUsed };
    }
  },
});

export const capitalizeTitle = action({
  args: { title: v.string() },
  handler: async (_ctx, args) => {
    if (args.title.trim().length < 3) return { title: args.title, tokensUsed: 0 };
    const { text, tokensUsed } = await callMistral(
      "You are a Spanish copy editor. Capitalize the given title following proper Spanish title capitalization rules. Return ONLY the capitalized title, nothing else. Do not add quotes.",
      args.title,
      100,
    );
    return { title: text.trim().replace(/^["']|["']$/g, ""), tokensUsed };
  },
});
