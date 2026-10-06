import { CHARISM_REFERRAL } from "@/lib/charism";
import { BookmarkIcon } from "@/components/HomeIcons";

/** "Learn more" referral to an outside resource on the charisms. */
export default function CharismReferral() {
  return (
    <section className="flex items-start gap-3 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
        <BookmarkIcon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="font-display text-xl font-semibold text-walnut">
          Learn more about the charisms
        </h2>
        <p className="mt-2 text-base leading-relaxed text-walnut-soft">
          {CHARISM_REFERRAL.blurb}
        </p>
        <a
          href={CHARISM_REFERRAL.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-base font-semibold text-forest underline-offset-4 hover:text-forest-dark hover:underline"
        >
          {CHARISM_REFERRAL.title}{" "}
          <span aria-hidden="true">↗</span>
          <span className="sr-only">
            (opens {CHARISM_REFERRAL.source} in a new tab)
          </span>
        </a>
        <p className="mt-1 text-xs text-walnut-soft">
          An external resource from {CHARISM_REFERRAL.source}. FamilyWise is not
          affiliated with it.
        </p>
      </div>
    </section>
  );
}
