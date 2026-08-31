import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { describeChild, type ChildInput } from "@/lib/describeChild";

const SYSTEM_PROMPT =
  "You are generating a short, warm, practical parenting tip for siblings with specific temperaments, for the FamilyWise app. " +
  "Base your tip on these temperament traits: Sanguine (spontaneous, social, distractible, forgives quickly), " +
  "Choleric (driven, decisive, blunt, struggles to yield control), " +
  "Melancholic (thoughtful, detail-oriented, needs alone time, feels criticism deeply), " +
  "Phlegmatic (calm, easygoing, avoids conflict, slow to state preferences). " +
  "Given two children's names, ages (if provided), and their dominant temperaments, write 2-3 sentences of specific, " +
  "actionable guidance for how their parents can help them relate well to each other — grounded in the natural tension " +
  "points and complementary strengths between those two temperaments. Keep the tone warm and practical, not clinical. " +
  "Do not diagnose or pathologize either child. If ages are provided, tailor the suggestion to be age-appropriate.";

export async function POST(req: NextRequest) {
  let body: { childA?: ChildInput; childB?: ChildInput };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { childA, childB } = body ?? {};
  if (!childA?.name || !childA?.dominant || !childB?.name || !childB?.dominant) {
    return NextResponse.json(
      { error: "Missing child temperament data." },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.error(
      "GEMINI_API_KEY is not set — sibling tip generation is disabled."
    );
    return NextResponse.json(
      { error: "Couldn't generate a tip right now — try again." },
      { status: 500 }
    );
  }

  try {
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Child A: ${describeChild(childA)}\nChild B: ${describeChild(childB)}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 1024,
        httpOptions: { timeout: 20_000 },
      },
    });

    const tip = response.text?.trim();

    if (!tip) {
      return NextResponse.json(
        { error: "Couldn't generate a tip right now — try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ tip });
  } catch (err) {
    console.error("sibling-tip generation failed", err);
    return NextResponse.json(
      { error: "Couldn't generate a tip right now — try again." },
      { status: 502 }
    );
  }
}
