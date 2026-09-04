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
          background: "#7C9473",
          borderRadius: 14,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 32 32">
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
