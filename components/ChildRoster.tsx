"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Quiz } from "@/lib/types";
import PrivacyNote from "@/components/PrivacyNote";
import { childAnswersKey, readRoster, writeRoster } from "@/lib/childRoster";
import { parseResultsPdf } from "@/lib/pdfResults";

function noopSubscribe() {
  return () => {};
}

// Quizzes with a compare view, where merging in someone else's
// already-downloaded PDF (instead of them retaking it live) is useful.
const PDF_UPLOAD_QUIZZES = new Set(["marriage-compatibility", "temperament"]);

export default function ChildRoster({ quiz }: { quiz: Quiz }) {
  const subjectLabel = quiz.multiSubject?.subjectLabel ?? "person";
  const subjectLabelPlural = quiz.multiSubject?.subjectLabelPlural ?? "people";
  const subjectLabelCap =
    subjectLabel.charAt(0).toUpperCase() + subjectLabel.slice(1);

  const rosterJson = useSyncExternalStore(
    noopSubscribe,
    () => JSON.stringify(readRoster(quiz.quizId)),
    () => "[]"
  );
  const children: string[] = JSON.parse(rosterJson);

  const [name, setName] = useState("");
  const [, setTick] = useState(0);
  const rerender = () => setTick((n) => n + 1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const allowPdfUpload = PDF_UPLOAD_QUIZZES.has(quiz.quizId);

  function addChild() {
    const trimmed = name.trim();
    if (!trimmed || children.includes(trimmed)) {
      setName("");
      return;
    }
    writeRoster(quiz.quizId, [...children, trimmed]);
    setName("");
    rerender();
  }

  function openPdfPicker() {
    const trimmed = name.trim();
    setUploadError(null);
    if (!trimmed) {
      setUploadError(`Enter ${subjectLabel}'s name first, then upload their PDF.`);
      return;
    }
    if (children.includes(trimmed)) {
      setUploadError(`${trimmed} is already on the list.`);
      return;
    }
    fileInputRef.current?.click();
  }

  async function handlePdfSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const trimmed = name.trim();
    setUploading(true);
    setUploadError(null);
    try {
      const answers = await parseResultsPdf(quiz, file);
      if (!answers) {
        setUploadError(
          `Couldn't read that PDF — make sure it's a ${quiz.title} results PDF downloaded from FamilyWise.`
        );
        return;
      }
      sessionStorage.setItem(
        childAnswersKey(quiz.quizId, trimmed),
        JSON.stringify(answers)
      );
      writeRoster(quiz.quizId, [...children, trimmed]);
      setName("");
      rerender();
    } catch {
      setUploadError("Something went wrong reading that PDF — please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeChild(childName: string) {
    writeRoster(
      quiz.quizId,
      children.filter((c) => c !== childName)
    );
    sessionStorage.removeItem(childAnswersKey(quiz.quizId, childName));
    rerender();
  }

  const completedCount = children.filter(
    (c) =>
      typeof window !== "undefined" &&
      sessionStorage.getItem(childAnswersKey(quiz.quizId, c)) !== null
  ).length;

  return (
    <div className="flex-1 bg-paper pb-24">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <Link
            href="/"
            className="text-sm font-medium text-walnut-soft hover:text-sienna"
          >
            ← All quizzes
          </Link>
          <h1 className="font-display mt-2 text-3xl font-semibold text-walnut sm:text-4xl">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="mt-2 text-xl text-walnut-soft">{quiz.description}</p>
          )}
          <PrivacyNote className="mt-4">
            Nothing here is saved or sent anywhere — this list and every
            result disappear when you close this tab.
          </PrivacyNote>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="flex flex-col gap-3">
          {children.length === 0 && (
            <p className="text-lg text-walnut-soft">
              No {subjectLabelPlural} added yet — add one below to get
              started.
            </p>
          )}
          {children.map((childName) => {
            const completed =
              typeof window !== "undefined" &&
              sessionStorage.getItem(
                childAnswersKey(quiz.quizId, childName)
              ) !== null;
            return (
              <div
                key={childName}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4"
              >
                <div>
                  <p className="text-xl font-semibold text-walnut">
                    {childName}
                  </p>
                  <p className="text-base text-walnut-soft">
                    {completed ? "Quiz completed" : "Not started"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/quiz/${quiz.quizId}?child=${encodeURIComponent(
                      childName
                    )}`}
                    className="rounded-full bg-forest px-4 py-2 text-lg text-paper hover:bg-forest-dark"
                  >
                    {completed ? "Retake" : "Start quiz"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeChild(childName)}
                    className="text-base text-walnut-soft hover:text-sienna"
                    aria-label={`Remove ${childName}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addChild();
            }}
            placeholder={`${subjectLabelCap}'s name`}
            className="flex-1 rounded border border-border bg-card px-4 py-3 text-lg text-walnut placeholder:text-walnut-soft/60 focus:border-sienna focus:outline-none"
          />
          <button
            type="button"
            onClick={addChild}
            className="rounded-full border border-forest px-5 py-3 text-lg text-forest hover:bg-forest-soft"
          >
            Add another {subjectLabel}
          </button>
        </div>

        {allowPdfUpload && (
          <div className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handlePdfSelected}
              className="hidden"
            />
            <button
              type="button"
              onClick={openPdfPicker}
              disabled={uploading}
              className="text-base font-medium text-walnut-soft underline decoration-dotted hover:text-sienna disabled:opacity-50"
            >
              {uploading
                ? "Reading PDF…"
                : `Already have their results? Upload ${subjectLabel}'s PDF instead`}
            </button>
            {uploadError && (
              <p className="mt-1 text-sm text-sienna">{uploadError}</p>
            )}
          </div>
        )}

        {completedCount >= 1 && (
          <div className="mt-8 flex justify-center">
            <Link
              href={`/quiz/${quiz.quizId}/results`}
              className="rounded-full bg-sienna px-7 py-3 text-2xl text-paper shadow-sm hover:opacity-90"
            >
              {completedCount === 1 ? "See result" : "See results"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
