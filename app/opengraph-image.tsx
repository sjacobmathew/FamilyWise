import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "#2f4b3c",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 130,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            color: "#ede6d6",
          }}
        >
          Family<span style={{ color: "#d98a4e" }}>Wise</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            fontFamily: "Georgia, serif",
            color: "#dde5de",
          }}
        >
          Helping families understand, connect, and thrive.
        </div>
      </div>
    ),
    size
  );
}
