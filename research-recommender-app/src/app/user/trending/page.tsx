"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { findArticlesByPopularity } from "@/services/article.service";
import { Article } from "@/models/articles/articles";
import { ArrowLeftToLine, ArrowRightToLine, Calendar, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { ApiResponse } from "@/types/api.types";

export default function TrendingPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      setIsLoading(true);
      try {
        const response = await findArticlesByPopularity(currentPage, articlesPerPage, true) as ApiResponse<Article[]>;
        setArticles(response.data || []);
        setTotalCount(response.totalCount || 50);
      } catch (error) {
        console.error("Error fetching trending articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingArticles();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      const middlePage = Math.floor(maxVisiblePages / 2);
      if (currentPage <= middlePage) {
        endPage = maxVisiblePages;
      } else if (currentPage > totalPages - middlePage) {
        startPage = totalPages - maxVisiblePages + 1;
      } else {
        startPage = currentPage - middlePage;
        endPage = currentPage + middlePage;
      }
    }

    const renderPageButton = (pageNum: number, isCurrentPage = false) => (
      <button
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 
          ${isCurrentPage 
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25" 
            : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"}`}
      >
        {pageNum}
      </button>
    );

    if (startPage > 1) {
      pageNumbers.push(renderPageButton(1));
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="px-2 text-gray-400">•••</span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(renderPageButton(i, currentPage === i));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="px-2 text-gray-400">•••</span>
        );
      }
      pageNumbers.push(renderPageButton(totalPages));
    }

    return (
      <div className="mt-16 flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ArrowLeftToLine className="h-5 w-5 text-emerald-600" />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="h-5 w-5 text-emerald-600" />
        </button>
        {pageNumbers}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronRight className="h-5 w-5 text-emerald-600" />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ArrowRightToLine className="h-5 w-5 text-emerald-600" />
        </button>
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Trending Articles
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the most popular and engaging content from our community
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block p-4 rounded-full bg-emerald-50">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-500 text-lg mt-4">Loading articles...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article
                key={article.article_id}
                className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 border border-gray-100"
              >
                <div className="p-8">
                  {currentPage === 1 && index < 6 && (
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 shadow-lg shadow-rose-500/25">
                      <Flame className="h-3.5 w-3.5" />
                      Trending
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {article.raw_title}
                  </h3>
                  <p className="text-gray-600 text-base mb-6 line-clamp-2">
                    {article.raw_abstract}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      <span>{article.citeulike_id}</span>
                    </div>
                    <Link
                      href={`/user/${article.article_id}`}
                      className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                    >
                      Read More
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="inline-block p-4 rounded-full bg-emerald-50 mb-4">
              <Calendar className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-gray-500 text-lg">
              No trending articles available.
            </p>
          </div>
        )}

        {totalPages > 1 && <Pagination />}
      </div>
    </section>
  );
}