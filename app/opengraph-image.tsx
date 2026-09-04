import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Satori (next/og's renderer) has no system fonts of its own, so any
 * fontFamily that isn't explicitly loaded here silently falls back to a
 * generic sans face. Fetches the real Fraunces TTF from Google Fonts —
 * the "Mozilla/5.0" UA is what gets Google to serve .ttf instead of
 * .woff2, since Satori can only read ttf/otf. */
async function loadFraunces(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Fraunces:wght@${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } }
  ).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\) format\('truetype'\)/);
  if (!match) throw new Error("Could not find Fraunces font URL");
  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}

export default async function Image() {
  const fraunces = await loadFraunces(700);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBFAF7",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 96,
            width: 96,
            borderRadius: 9999,
            background: "#7C9473",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 32 32">
            <circle cx="9" cy="10" r="4" fill="#FBFAF7" />
            <circle cx="23" cy="9" r="3" fill="#FBFAF7" />
            <circle cx="16" cy="23" r="3.5" fill="#FBFAF7" />
            <path
              d="M9,14 C9,18 12,21 16,21 M23,12 C22,16 19,19 16,20.5"
              stroke="#FBFAF7"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "Fraunces",
            color: "#1C1C1C",
          }}
        >
          FamilyWise
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            fontFamily: "Fraunces",
            color: "#6B6B6B",
          }}
        >
          Understand your family. Build stronger relationships.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: fraunces, weight: 700, style: "normal" }],
    }
  );
}
