import { Router, type IRouter } from "express";
import Groq from "groq-sdk";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { menu, menuSystemContext } from "../lib/menu";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again in a moment." },
  skip: () => !process.env.GROQ_API_KEY,
});

const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const ChatInputSchema = z.object({
  message: z.string().min(1).max(1000).trim(),
  history: z.array(ChatMessageSchema).max(50).optional().default([]),
});

router.post("/chat", chatRateLimiter, async (req, res): Promise<void> => {
  const parsed = ChatInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { message, history } = parsed.data;

  if (!process.env.GROQ_API_KEY) {
    req.log.error("GROQ_API_KEY is not configured");
    res.status(500).json({ error: "AI service is not configured." });
    return;
  }

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: menuSystemContext },
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: message },
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;
    if (!reply) {
      req.log.error("Empty response from Groq API");
      res.status(500).json({ error: "The AI assistant did not respond. Please try again." });
      return;
    }

    res.json({ reply });
  } catch (err: unknown) {
    req.log.error({ err }, "Groq API error");

    if (err && typeof err === "object" && "status" in err) {
      const status = (err as { status: number }).status;
      if (status === 429) {
        res.status(429).json({ error: "AI service is temporarily busy. Please try again shortly." });
        return;
      }
      if (status === 401) {
        res.status(500).json({ error: "AI service authentication failed. Please contact support." });
        return;
      }
    }

    res.status(500).json({ error: "Something went wrong with the AI assistant. Please try again." });
  }
});

router.get("/menu", async (_req, res): Promise<void> => {
  res.json(menu);
});

export default router;
