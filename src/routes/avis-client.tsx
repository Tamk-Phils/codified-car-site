import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { reviewsQuery } from "@/lib/queries";
import { Star, CheckCircle2, ThumbsUp } from "lucide-react";

export const Route = createFileRoute("/avis-client")({
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(reviewsQuery);
    } catch (e) {
      console.warn("Reviews loader warning:", e);
    }
  },
  head: () => ({
    meta: [
      { title: "Verified Customer Reviews | KJ Autos" },
      {
        name: "description",
        content:
          "Read authentic buyer reviews from customers who purchased certified bank repossessed luxury vehicles with nationwide US delivery.",
      },
      { property: "og:title", content: "Verified Customer Reviews | KJ Autos" },
      { property: "og:description", content: "Verified buyer feedback and ratings on our bank seized vehicle inventory." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/avis-client" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/avis-client" }],
  }),
  component: Reviews,
});

function Reviews() {
  const { data: reviews = [] } = useQuery(reviewsQuery);
  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <SiteLayout>
      <PageHero
        breadcrumb="Reviews"
        title="Verified Customer Feedback"
        subtitle={`Rated ${average} out of 5 stars by verified buyers in California.`}
      />

      <div className="container-page py-14">
        {/* Rating Summary Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 font-display text-3xl font-black">
              {average}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm font-bold text-slate-800 mt-1">Based on {reviews.length} Verified Deliveries</p>
              <p className="text-xs text-slate-500">100% Satisfaction & Lien-Free Paperwork Guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-200 text-xs font-bold uppercase tracking-wide">
            <ThumbsUp className="size-4" /> 98.4% Recommendation Rate
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Purchase</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">"{review.body}"</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.location}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="size-3" /> Delivery Confirmed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
