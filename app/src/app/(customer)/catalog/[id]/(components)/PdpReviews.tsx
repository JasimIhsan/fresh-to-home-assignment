"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Star, ThumbsUp } from "lucide-react";

const MOCK_REVIEWS = [
  {
    id: "r1",
    author: "Maria K.",
    date: "Oktober 2026",
    rating: 5,
    text: "Absolut erstklassige Qualität! Das Rinderfilet war butterweich und hat fantastisch geschmeckt. Lieferung kam pünktlich und perfekt gekühlt.",
    helpful: 24,
    verified: true,
    avatar: "M",
  },
  {
    id: "r2",
    author: "Thomas B.",
    date: "September 2026",
    rating: 5,
    text: "Habe schon mehrfach bestellt und bin jedes Mal begeistert. Frischeres Fleisch bekommt man nirgendwo sonst. Sehr empfehlenswert!",
    helpful: 18,
    verified: true,
    avatar: "T",
  },
  {
    id: "r3",
    author: "Sophie W.",
    date: "September 2026",
    rating: 4,
    text: "Sehr gute Qualität, Verpackung ist hervorragend. Nur die Lieferzeit hätte etwas kürzer sein können. Werde dennoch wieder bestellen.",
    helpful: 9,
    verified: true,
    avatar: "S",
  },
];

const MOCK_RATING = 4.8;
const MOCK_REVIEW_COUNT = 127;

const RATING_DISTRIBUTION = [
  { stars: 5, pct: 82 },
  { stars: 4, pct: 11 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
];

const AVATAR_COLORS = [
  "bg-purple-100 text-primary",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
];

export function PdpReviews() {
  const { t } = useLanguage();

  return (
    <section
      id="reviews"
      aria-label={t("productDetail.reviewsTitle")}
      className="space-y-5"
    >
      <h3 className="text-lg font-extrabold tracking-tight text-gray-900">
        {t("productDetail.reviewsTitle")}
      </h3>

      {/* Rating Summary */}
      <div className="flex flex-col gap-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:p-6">
        <div className="flex shrink-0 flex-col items-center justify-center sm:border-r sm:border-gray-100 sm:pr-5">
          <span className="text-5xl font-black text-gray-900 tabular-nums">
            {MOCK_RATING}
          </span>
          <div
            className="mt-1.5 flex items-center gap-0.5"
            aria-label={`Rating: ${MOCK_RATING} out of 5`}
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={
                  s <= Math.round(MOCK_RATING)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="mt-1 text-xs font-medium text-gray-400">
            {t("productDetail.ratingsCount").replace(
              "{count}",
              String(MOCK_REVIEW_COUNT)
            )}
          </span>
        </div>

        {/* Distribution Bars */}
        <div className="flex-1 space-y-2">
          {RATING_DISTRIBUTION.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-2.5">
              <span className="w-4 shrink-0 text-right text-[11px] font-semibold text-gray-500">
                {stars}
              </span>
              <Star
                size={11}
                className="shrink-0 fill-amber-400 text-amber-400"
              />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-7 shrink-0 text-right text-[11px] text-gray-400">
                {pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-3">
        {MOCK_REVIEWS.map((review, idx) => (
          <article
            key={review.id}
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
              >
                {review.avatar}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-800">
                      {review.author}
                    </span>
                    {review.verified && (
                      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                        {t("productDetail.verifiedBadge")}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {review.date}
                  </span>
                </div>

                <div className="mt-1 mb-2 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={
                        s <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-gray-600">
                  {review.text}
                </p>

                <button className="mt-3 flex cursor-pointer items-center gap-1.5 text-[11px] text-gray-400 transition-colors hover:text-gray-600">
                  <ThumbsUp size={12} />
                  <span>
                    {t("productDetail.helpfulBtn").replace(
                      "{count}",
                      String(review.helpful)
                    )}
                  </span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
