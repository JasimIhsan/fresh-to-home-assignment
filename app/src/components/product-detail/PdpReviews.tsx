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
      <section id="reviews" aria-label={t("productDetail.reviewsTitle")} className="space-y-5">
         <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">
            {t("productDetail.reviewsTitle")}
         </h3>

         {/* Rating Summary */}
         <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col items-center justify-center shrink-0 sm:pr-5 sm:border-r sm:border-gray-100">
               <span className="text-5xl font-black text-gray-900 tabular-nums">{MOCK_RATING}</span>
               <div
                  className="flex items-center gap-0.5 mt-1.5"
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
               <span className="text-xs text-gray-400 mt-1 font-medium">
                  {t("productDetail.ratingsCount").replace("{count}", String(MOCK_REVIEW_COUNT))}
               </span>
            </div>

            {/* Distribution Bars */}
            <div className="flex-1 space-y-2">
               {RATING_DISTRIBUTION.map(({ stars, pct }) => (
                  <div key={stars} className="flex items-center gap-2.5">
                     <span className="text-[11px] text-gray-500 font-semibold w-4 text-right shrink-0">
                        {stars}
                     </span>
                     <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                     <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                           className="h-full bg-amber-400 rounded-full transition-all duration-700"
                           style={{ width: `${pct}%` }}
                        />
                     </div>
                     <span className="text-[11px] text-gray-400 w-7 text-right shrink-0">{pct}%</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Individual Reviews */}
         <div className="space-y-3">
            {MOCK_REVIEWS.map((review, idx) => (
               <article
                  key={review.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
               >
                  <div className="flex items-start gap-3">
                     <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
                     >
                        {review.avatar}
                     </div>

                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                           <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-gray-800">{review.author}</span>
                              {review.verified && (
                                 <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                                    {t("productDetail.verifiedBadge")}
                                 </span>
                              )}
                           </div>
                           <span className="text-[11px] text-gray-400">{review.date}</span>
                        </div>

                        <div className="flex items-center gap-0.5 mt-1 mb-2">
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

                        <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>

                        <button className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
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
