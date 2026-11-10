import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogs, openServiceEnquiryModal } = useStore();

  const article = blogs.find((b) => b.slug === slug || b.id === slug);

  if (!article) {
    return (
      <div className="min-h-[60vh] bg-[#14151B] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-white uppercase">Article Not Found</h1>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F10D17] text-white text-xs font-bold uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Blogs</span>
        </Link>
      </div>
    );
  }

  const otherBlogs = blogs.filter((b) => b.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#14151B] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-xs text-[#B8BBC4] hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Automotive Blogs</span>
        </Link>

        <article className="bg-[#1C1D24] border border-white/10 rounded-2xl overflow-hidden">
          <div className="h-64 sm:h-80 w-full overflow-hidden bg-[#14151B]">
            <img
              src={article.image}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#B8BBC4]">
              <span className="text-[#F10D17] font-semibold uppercase">{article.category}</span>
              <span>·</span>
              <span>{article.publishedAt}</span>
              <span>·</span>
              <span>{article.readTime}</span>
              <span>·</span>
              <span>By {article.author}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase leading-tight">
              {article.title}
            </h1>

            {/* Key Takeaways Box */}
            <div className="p-5 rounded-xl bg-[#14151B] border border-white/10 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FACC15]">
                Key Technical Takeaways
              </h3>
              {article.keyTakeaways.map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-xs text-[#D1D5DB]">
                  <CheckCircle2 className="w-4 h-4 text-[#F10D17] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Article Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-[#D1D5DB] leading-relaxed">
              {article.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Consultation CTA inside Blog */}
            <div className="mt-8 p-6 rounded-xl bg-[#14151B] border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-lg font-bold text-white uppercase">
                  Need a Tyre, Battery or Alignment Check in Kolkata?
                </h4>
                <p className="text-xs text-[#B8BBC4] mt-1">
                  Visit Ghosh Tyre Zone at 38C Raja Dinendra Street or book an inspection online.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openServiceEnquiryModal(article.title)}
                  className="px-4 py-2.5 rounded-lg bg-[#F10D17] text-white text-xs font-bold uppercase inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enquire Now</span>
                </button>
                <a
                  href={getWhatsAppUrl(
                    `Hello Ghosh Tyre Zone, I read your article "${article.title}" and would like to enquire about my vehicle.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-[#16A34A] text-white text-xs font-bold uppercase inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* More Articles */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-white uppercase mb-6">
            More Automotive Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherBlogs.map((b) => (
              <Link
                key={b.id}
                to={`/blogs/${b.slug}`}
                className="p-5 rounded-xl bg-[#1C1D24] border border-white/10 hover:border-[#F10D17]/60 transition-colors"
              >
                <span className="text-[11px] text-[#F10D17] font-semibold uppercase">
                  {b.category}
                </span>
                <h3 className="font-display text-base font-bold text-white uppercase mt-1">
                  {b.title}
                </h3>
                <p className="text-xs text-[#B8BBC4] mt-2 line-clamp-2">{b.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
