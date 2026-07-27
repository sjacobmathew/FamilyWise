import { getQuizzesByCategory } from "@/lib/quizzes";
import QuizCard from "@/components/QuizCard";
import PhotoCircle from "@/components/PhotoCircle";
import WatercolorBlob from "@/components/WatercolorBlob";
import TornBanner from "@/components/TornBanner";
import { CATEGORY_PHOTOS, PHOTOS } from "@/lib/photos";

const COLLAGE = [
  { photo: PHOTOS.parentChild, size: "22%", shape: "jagged" as const, rotate: -8, style: { position: "absolute" as const, top: "0%", left: "1%" } },
  { photo: PHOTOS.boysRunning, size: "18%", shape: "jagged2" as const, rotate: 10, style: { position: "absolute" as const, top: "-4%", left: "56%" } },
  { photo: PHOTOS.couple, size: "30%", shape: "jagged2" as const, rotate: 4, style: { position: "absolute" as const, top: "-2%", left: "30%" } },
  { photo: PHOTOS.friends, size: "21%", shape: "jagged" as const, rotate: 9, style: { position: "absolute" as const, top: "6%", left: "76%" } },
  { photo: PHOTOS.fatherBaby, size: "19%", shape: "circle" as const, rotate: -5, style: { position: "absolute" as const, top: "42%", left: "6%" } },
  { photo: PHOTOS.sisters, size: "23%", shape: "jagged2" as const, rotate: 6, style: { position: "absolute" as const, top: "46%", left: "54%" } },
  { photo: PHOTOS.coupleWindow, size: "19%", shape: "blob" as const, rotate: -7, style: { position: "absolute" as const, top: "48%", left: "80%" } },
];

export default function Home() {
  const groups = getQuizzesByCategory();
  const credited = Object.values(PHOTOS);

  return (
    <div className="flex-1 bg-cream">
      <header className="overflow-hidden border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 pt-6 pb-10 sm:pt-8 sm:pb-14">
          <div className="relative mx-auto aspect-[3/2] w-full max-w-xl">
            <WatercolorBlob className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0">
              {COLLAGE.map(({ photo, size, shape, rotate, style }) => (
                <PhotoCircle
                  key={photo.id}
                  photo={photo}
                  size={size}
                  shape={shape}
                  rotate={rotate}
                  style={style}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <TornBanner className="px-6 py-5 sm:px-16 sm:py-10">
              <h1 className="font-script whitespace-nowrap text-[clamp(2.75rem,11vw,6.5rem)] font-normal text-cream">
                FamilyWise
              </h1>
            </TornBanner>
            <p className="font-display mx-auto mt-6 max-w-xl text-xl italic text-ink-soft">
              Helping families understand, connect, and thrive.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {groups.map(({ category, quizzes }) => (
          <section key={category} className="mb-14 last:mb-0">
            <div className="mb-5 flex items-center gap-3">
              {CATEGORY_PHOTOS[category] && (
                <PhotoCircle photo={CATEGORY_PHOTOS[category]} size="44px" />
              )}
              <h2 className="text-2xl font-semibold text-ink">{category}</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.quizId} quiz={quiz} />
              ))}
            </div>
          </section>
        ))}

        <p className="mt-4 text-xs text-ink-soft">
          Photos via Unsplash:{" "}
          {credited.map((p, i) => (
            <span key={p.id}>
              <a
                href={p.creditUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="underline hover:text-terracotta"
              >
                {p.credit}
              </a>
              {i < credited.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </main>
    </div>
  );
}
