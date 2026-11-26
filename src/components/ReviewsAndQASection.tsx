import React, { useMemo, useState } from 'react';
import { Search, ThumbsUp } from 'lucide-react';
import { INITIAL_QA, INITIAL_REVIEWS, QAItem, ReviewItem } from '../data/razerProductData';
import { StarRatingRow } from './ProductInfoCenter';

const RATING_BREAKDOWN = [
  { stars: 5, pct: 84 },
  { stars: 4, pct: 11 },
  { stars: 3, pct: 3 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

export const ReviewsAndQASection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [helpfulIds, setHelpfulIds] = useState<string[]>([]);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newBody, setNewBody] = useState('');

  const [qaList, setQaList] = useState<QAItem[]>(INITIAL_QA);
  const [qaQuery, setQaQuery] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  const visibleReviews = useMemo(() => {
    if (starFilter === null) return reviews;
    return reviews.filter((r) => r.rating === starFilter);
  }, [reviews, starFilter]);

  const visibleQA = useMemo(() => {
    const q = qaQuery.trim().toLowerCase();
    if (!q) return qaList;
    return qaList.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [qaList, qaQuery]);

  const toggleHelpful = (id: string) => {
    setHelpfulIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    const item: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim() || 'Amazon Customer',
      rating: newRating,
      title: newTitle.trim(),
      date: 'Reviewed in Singapore on Today',
      variant: 'Colour: Black | Style: Mouse + 8K HyperPolling Dongle',
      verified: true,
      body: newBody.trim(),
      helpfulCount: 0,
    };
    setReviews((prev) => [item, ...prev]);
    setNewTitle('');
    setNewAuthor('');
    setNewBody('');
    setShowWriteReview(false);
    setStarFilter(null);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    const qa: QAItem = {
      id: `qa-${Date.now()}`,
      question: newQuestion.trim(),
      answer:
        'Thank you for asking! Razer Viper V4 Pro supports plug-and-play 8,000Hz wireless via the included HyperPolling Dongle on Windows 10/11 and macOS.',
      author: 'AmazonSG Seller Support',
      date: 'Just now',
      votes: 1,
    };
    setQaList((prev) => [qa, ...prev]);
    setNewQuestion('');
  };

  return (
    <div className="space-y-10 mt-10 pt-8 border-t border-[#E7E7E7]">
      {/* Customer Q&A */}
      <section aria-labelledby="qa-heading">
        <h2 id="qa-heading" className="text-lg font-bold text-[#0F1111] mb-3">
          Customer questions &amp; answers
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#565959] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={qaQuery}
              onChange={(e) => setQaQuery(e.target.value)}
              placeholder="Have a question? Search answers..."
              aria-label="Search customer questions and answers"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-[#D5D9D9] bg-white text-[#0F1111] focus:outline-none focus:border-[#007185]"
            />
          </div>

          <form onSubmit={handleAskQuestion} className="flex gap-2 flex-1 max-w-md">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a question about this mouse..."
              className="flex-1 px-3 py-2 text-xs rounded-md border border-[#D5D9D9] bg-white text-[#0F1111] focus:outline-none focus:border-[#007185]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-medium rounded-md border border-[#D5D9D9] bg-[#F7F8F8] hover:bg-[#EAEDED] text-[#0F1111] whitespace-nowrap cursor-pointer"
            >
              Ask
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {visibleQA.length === 0 ? (
            <p className="text-xs text-[#565959]">
              No matching questions found for "{qaQuery}".
            </p>
          ) : (
            visibleQA.map((qa) => (
              <div key={qa.id} className="border-b border-[#E7E7E7] pb-3.5 text-[13px]">
                <div className="grid grid-cols-[80px_1fr] gap-2">
                  <span className="font-bold text-[#0F1111]">Question:</span>
                  <span className="font-semibold text-[#007185]">{qa.question}</span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 mt-1.5">
                  <span className="font-bold text-[#0F1111]">Answer:</span>
                  <div>
                    <p className="text-[#0F1111] leading-relaxed">{qa.answer}</p>
                    <p className="text-[11px] text-[#565959] mt-1">
                      By {qa.author} · {qa.date}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Customer Reviews */}
      <section
        id="reviews-section"
        aria-labelledby="reviews-heading"
        className="pt-6 border-t border-[#E7E7E7]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Histogram */}
          <div className="lg:col-span-4 space-y-4">
            <h2 id="reviews-heading" className="text-lg font-bold text-[#0F1111]">
              Customer reviews
            </h2>

            <div className="flex items-center gap-2">
              <StarRatingRow rating={4.8} />
              <span className="text-base font-semibold text-[#0F1111] tabular-nums">
                4.8 out of 5
              </span>
            </div>
            <p className="text-xs text-[#565959] tabular-nums">1,428 global ratings</p>

            {/* Interactive Histogram Bars */}
            <div className="space-y-2">
              {RATING_BREAKDOWN.map((row) => {
                const active = starFilter === row.stars;
                return (
                  <button
                    key={row.stars}
                    type="button"
                    onClick={() =>
                      setStarFilter((prev) => (prev === row.stars ? null : row.stars))
                    }
                    className={`w-full flex items-center gap-3 text-xs group cursor-pointer ${
                      active ? 'font-bold text-[#C7511F]' : 'text-[#007185] hover:underline'
                    }`}
                  >
                    <span className="w-11 text-left shrink-0">{row.stars} star</span>
                    <div className="flex-1 h-4 rounded bg-[#F0F2F2] border border-[#D5D9D9] overflow-hidden">
                      <div
                        className="h-full bg-[#DE7921]"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-9 text-right tabular-nums shrink-0">{row.pct}%</span>
                  </button>
                );
              })}
            </div>

            {starFilter !== null && (
              <button
                type="button"
                onClick={() => setStarFilter(null)}
                className="text-xs text-[#007185] hover:underline cursor-pointer"
              >
                Clear {starFilter}-star filter
              </button>
            )}

            <div className="pt-3 border-t border-[#E7E7E7] space-y-2">
              <h3 className="text-sm font-bold text-[#0F1111]">Review this product</h3>
              <p className="text-xs text-[#565959]">Share your thoughts with other customers</p>
              <button
                type="button"
                onClick={() => setShowWriteReview((prev) => !prev)}
                className="w-full py-2 px-4 rounded-lg border border-[#D5D9D9] bg-white hover:bg-[#F7F8F8] text-xs font-medium text-[#0F1111] cursor-pointer"
              >
                {showWriteReview ? 'Cancel review' : 'Write a customer review'}
              </button>
            </div>
          </div>

          {/* Right: Review List & Form */}
          <div className="lg:col-span-8 space-y-5">
            {showWriteReview && (
              <form
                onSubmit={handleSubmitReview}
                className="rounded-lg border border-[#D5D9D9] bg-[#F9FAFA] p-4 space-y-3"
              >
                <h3 className="text-sm font-bold text-[#0F1111]">Create your review</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#0F1111] mb-1">
                      Your name
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Wei Jie"
                      className="w-full px-3 py-1.5 text-xs rounded border border-[#D5D9D9] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#0F1111] mb-1">
                      Overall rating
                    </label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded border border-[#D5D9D9] bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} stars
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0F1111] mb-1">
                    Add a headline
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What's most important to know?"
                    className="w-full px-3 py-1.5 text-xs rounded border border-[#D5D9D9] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0F1111] mb-1">
                    Written review
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="Share your experience with weight, sensor tracking, or battery life..."
                    className="w-full px-3 py-1.5 text-xs rounded border border-[#D5D9D9] bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-medium text-[#0F1111] cursor-pointer"
                >
                  Submit review
                </button>
              </form>
            )}

            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0F1111]">
                {starFilter !== null
                  ? `${starFilter}-star reviews from Singapore`
                  : 'Top reviews from Singapore'}
              </h3>
            </div>

            {visibleReviews.length === 0 ? (
              <div className="rounded-lg border border-[#E7E7E7] p-6 text-center text-xs text-[#565959]">
                No written reviews match the {starFilter}-star filter yet.
              </div>
            ) : (
              <div className="space-y-5 divide-y divide-[#E7E7E7]">
                {visibleReviews.map((rev) => {
                  const isHelpful = helpfulIds.includes(rev.id);
                  const totalHelpful = rev.helpfulCount + (isHelpful ? 1 : 0);
                  return (
                    <article key={rev.id} className="pt-5 first:pt-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#E7E7E7] text-[#0F1111] text-[11px] font-bold inline-flex items-center justify-center">
                          {rev.author.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-[13px] font-medium text-[#0F1111]">
                          {rev.author}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StarRatingRow rating={rev.rating} size="sm" />
                        <h4 className="text-[13px] font-bold text-[#0F1111]">{rev.title}</h4>
                      </div>

                      <div className="text-xs text-[#565959]">
                        {rev.date}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#565959]">
                        <span>{rev.variant}</span>
                        {rev.verified && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-bold text-[#C7511F]">Verified Purchase</span>
                          </>
                        )}
                      </div>

                      <p className="text-[13.5px] leading-relaxed text-[#0F1111] pt-1">
                        {rev.body}
                      </p>

                      <div className="pt-2 flex items-center gap-3 text-xs text-[#565959]">
                        <button
                          type="button"
                          onClick={() => toggleHelpful(rev.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs transition-colors cursor-pointer ${
                            isHelpful
                              ? 'border-[#007185] bg-[#F0F8FA] text-[#007185] font-semibold'
                              : 'border-[#D5D9D9] bg-white hover:bg-[#F7F8F8] text-[#0F1111]'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful</span>
                        </button>
                        {totalHelpful > 0 && (
                          <span className="tabular-nums">
                            {totalHelpful} {totalHelpful === 1 ? 'person' : 'people'} found this
                            helpful
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
