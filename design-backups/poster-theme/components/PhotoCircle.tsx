import Image from "next/image";
import { photoSrc, type Photo } from "@/lib/photos";

const BLOB_RADII = "62% 38% 35% 65% / 58% 42% 58% 42%";

const JAGGED_A =
  "polygon(93.1% 58.7%, 84.8% 69.7%, 81.1% 83.9%, 67.4% 88.2%, 55.5% 97.7%, 41.5% 92.1%, 26.9% 90.9%, 20.5% 77.0%, 9.1% 68.7%, 9.3% 54.7%, 3.0% 40.5%, 13.4% 29.3%, 18.9% 16.1%, 33.4% 13.6%, 44.6% 3.3%, 58.5% 7.9%, 73.6% 8.2%, 80.9% 21.6%, 90.9% 31.3%, 90.7% 45.3%)";
const JAGGED_B =
  "polygon(78.6% 86.0%, 64.3% 88.4%, 52.0% 98.0%, 38.5% 91.4%, 24.0% 89.2%, 18.7% 74.9%, 7.8% 65.7%, 8.0% 51.8%, 3.8% 37.1%, 15.8% 27.3%, 21.4% 14.0%, 36.0% 12.5%, 48.1% 5.0%, 61.3% 9.5%, 76.5% 10.0%, 83.7% 23.3%, 94.0% 33.6%, 90.0% 48.3%, 94.3% 62.3%, 85.0% 73.2%)";

type Shape = "circle" | "blob" | "jagged" | "jagged2";

/** `size` is a CSS length (e.g. "22%" or "120px") so collages scale fluidly with their container instead of clipping on narrow screens. */
export default function PhotoCircle({
  photo,
  size,
  className = "",
  shape = "circle",
  rotate = 0,
  style,
}: {
  photo: Photo;
  size: string;
  className?: string;
  shape?: Shape;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  const isJagged = shape === "jagged" || shape === "jagged2";
  const qualitySrc = photoSrc(photo, 320);
  const sizesAttr = "(min-width: 640px) 220px, 140px";

  if (isJagged) {
    const clip = shape === "jagged" ? JAGGED_A : JAGGED_B;
    return (
      <div
        className={`relative shrink-0 bg-cream shadow-md ${className}`}
        style={{
          width: size,
          aspectRatio: "1 / 1",
          clipPath: clip,
          transform: rotate ? `rotate(${rotate}deg)` : undefined,
          ...style,
        }}
      >
        <div className="absolute overflow-hidden" style={{ inset: 4, clipPath: clip }}>
          <Image
            src={qualitySrc}
            alt={photo.alt}
            fill
            sizes={sizesAttr}
            className="object-cover grayscale"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden border-4 border-cream shadow-md ${className}`}
      style={{
        width: size,
        aspectRatio: "1 / 1",
        borderRadius: shape === "blob" ? BLOB_RADII : "9999px",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
    >
      <Image
        src={qualitySrc}
        alt={photo.alt}
        fill
        sizes={sizesAttr}
        className="object-cover grayscale"
      />
    </div>
  );
}
