import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 14,
        }}
      >
        <span
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            color: "#ede6d6",
            letterSpacing: -1,
          }}
        >
          F<span style={{ color: "#d98a4e" }}>W</span>
        </span>
      </div>
    ),
    size
  );
}
