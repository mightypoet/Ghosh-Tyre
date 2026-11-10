import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BlogsPage: React.FC = () => {
  const { blogs } = useStore();

  return (
    <div className="min-h-screen bg-[#14151B] pb-16">
      <section className="bg-[#1C1D24] border-b border-white/10 py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
            AUTOMOTIVE KNOWLEDGE HUB · KOLKATA
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white uppercase mt-2">
            TYRE, BATTERY & VEHICLE CARE GUIDES
          </h1>
          <p className="text-sm sm:text-base text-[#B8BBC4] max-w-2xl mt-2">
            Practical maintenance advice from the technical team at Ghosh Tyre Zone to help you get
            longer tyre life, safer wet braking, and trouble-free drives.
          </p>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((article) => (
            <article
              key={article.id}
              className="bg-[#22232B] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/25 transition-all"
            >
              <div>
                <Link to={`/blogs/${article.slug}`} className="block h-52 overflow-hidden bg-[#14151B]">
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#B8BBC4]">
                    <span className="text-[#F10D17] font-semibold">{article.category}</span>
                    <span>·</span>
                    <span>{article.publishedAt}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <Link
                    to={`/blogs/${article.slug}`}
                    className="block font-display text-xl font-bold text-white hover:text-[#F10D17] uppercase transition-colors"
                  >
                    {article.title}
                  </Link>
                  <p className="text-xs text-[#B8BBC4] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/blogs/${article.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#14151B] hover:bg-[#F10D17] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
