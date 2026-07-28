import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2f4b3c",
        }}
      >
        <span
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            color: "#ede6d6",
            letterSpacing: -2,
          }}
        >
          F<span style={{ color: "#d98a4e" }}>W</span>
        </span>
      </div>
    ),
    size
  );
}
