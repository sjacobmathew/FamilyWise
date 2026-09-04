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
          background: "#7C9473",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 32 32">
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
    ),
    size
  );
}
