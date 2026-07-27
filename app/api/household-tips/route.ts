import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { describeChild, type ChildInput } from "@/lib/describeChild";

const SYSTEM_PROMPT =
  "You are generating short, practical parenting guidance for the FamilyWise app, combining a parent's own parenting " +
  "style with their children's individual temperaments.\n\n" +
  "Parenting styles: Authoritative (warm, sets clear limits, explains reasoning), Authoritarian (structured, expects " +
  "obedience, lower warmth in the moment), Permissive (warm, avoids conflict, limits don't always stick), Uninvolved " +
  "(lower warmth and structure, often due to a stretched season rather than choice).\n\n" +
  "Temperaments: Sanguine (spontaneous, social, distractible, forgives quickly, needs engaging tasks and attention), " +
  "Choleric (driven, decisive, blunt, struggles to yield control, needs logic and real choices), Melancholic " +
  "(thoughtful, detail-oriented, needs alone time, feels criticism deeply, needs advance notice and validation), " +
  "Phlegmatic (calm, easygoing, avoids conflict, slow to state preferences, needs to be asked directly what they want).\n\n" +
  "Given the parent's own dominant (and secondary, if close) parenting style, and a list of children (name, age if " +
  "provided, dominant temperament, secondary if close), write one short, specific parenting tip per child (2-3 " +
  "sentences each) that considers how THIS parent's natural style specifically interacts with THIS child's " +
  "temperament — where the fit is naturally easy, and where the parent may need to consciously adapt their default " +
  "style for this particular child. Write with awareness that the parent is managing multiple different temperaments " +
  "at once through the lens of their own single parenting style, so tips should help the parent notice where their " +
  "default approach may need to flex from child to child, without directly comparing children to each other in a way " +
  "that could feel like favoritism. End with one brief overall note on how this parent can flex their natural style " +
  "to serve the whole household fairly, given the mix of temperaments present. Keep the tone warm and practical, not " +
  "clinical. Do not diagnose or pathologize any child, and do not criticize the parent's style — frame everything as " +
  "natural tendencies with room to grow. Never rank children or suggest one is 'easier' than another.";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    childTips: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          tip: { type: Type.STRING },
        },
        required: ["name", "tip"],
      },
    },
    householdNote: { type: Type.STRING },
  },
  required: ["childTips", "householdNote"],
};

type ParentInput = {
  dominant?: unknown;
  secondary?: unknown;
};

type HouseholdTipsResult = {
  childTips: { name: string; tip: string }[];
  householdNote: string;
};

function describeParent(parent: ParentInput): string {
  const secondary =
    typeof parent.secondary === "string" && parent.secondary
      ? `, secondary style: ${parent.secondary}`
      : "";
  return `Parent's dominant parenting style: ${String(parent.dominant)}${secondary}`;
}

export async function POST(req: NextRequest) {
  let body: { parent?: ParentInput; children?: ChildInput[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { parent } = body ?? {};
  const children = Array.isArray(body?.children) ? body.children : [];
  const validChildren = children.filter((c) => c?.name && c?.dominant);

  if (!parent?.dominant || validChildren.length === 0) {
    return NextResponse.json(
      { error: "Missing parent style or child temperament data." },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.error(
      "GEMINI_API_KEY is not set — household tip generation is disabled."
    );
    return NextResponse.json(
      { error: "Couldn't generate tips right now — try again." },
      { status: 500 }
    );
  }

  try {
    const ai = new GoogleGenAI({});
    const contents =
      `${describeParent(parent)}\n\n` +
      validChildren.map(describeChild).join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const raw = response.text?.trim();
    if (!raw) {
      return NextResponse.json(
        { error: "Couldn't generate tips right now — try again." },
        { status: 502 }
      );
    }

    let parsed: Partial<HouseholdTipsResult>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Couldn't generate tips right now — try again." },
        { status: 502 }
      );
    }

    if (
      !Array.isArray(parsed.childTips) ||
      parsed.childTips.length === 0 ||
      !parsed.householdNote
    ) {
      return NextResponse.json(
        { error: "Couldn't generate tips right now — try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      childTips: parsed.childTips,
      householdNote: parsed.householdNote,
    });
  } catch (err) {
    console.error("household-tip generation failed", err);
    return NextResponse.json(
      { error: "Couldn't generate tips right now — try again." },
      { status: 502 }
    );
  }
}
