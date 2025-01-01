"use client";

import { Article } from "@/models/articles/articles";
import { findArticlesByPopularity, getRecommendations } from "@/services/article.service";
import { logInteraction } from "@/services/interaction.service";
import { ApiResponse } from "@/types/api.types";
import { JwtPayload } from "@/types/jwt.types";
import { jwtDecode } from "jwt-decode";
import {
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState("grid");
  const articlesPerPage = 6;
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await getRecommendations(
          userId || "guest",
          currentPage,
          articlesPerPage
        ) as ApiResponse<Article[]>;

        if (response.articles && response.articles.length > 0) {
          setArticles(response.articles);
          setTotalCount(response.totalCount || 50);
        } else {
          const popularResponse = await findArticlesByPopularity(
            currentPage,
            articlesPerPage,
            true
          ) as ApiResponse<Article[]>;
          setArticles(popularResponse.data || []);
          setTotalCount(popularResponse.totalCount || 50);
        }
      } catch (error) {
        console.error("Error fetching articles for user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [userId, currentPage, articlesPerPage]);

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.raw_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.raw_abstract.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchQuery, articles]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (!isTokenExpired) {
          setUserId(decodedToken.sub);
        } else {
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  const totalPages = Math.ceil(totalCount / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Pagination = () => {
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

    const paginationButtons = [];

    if (startPage > 1) {
      paginationButtons.push(renderPageButton(1));
      if (startPage > 2) {
        paginationButtons.push(
          <span key="start-ellipsis" className="px-2 text-gray-400">•••</span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationButtons.push(renderPageButton(i, currentPage === i));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationButtons.push(
          <span key="end-ellipsis" className="px-2 text-gray-400">•••</span>
        );
      }
      paginationButtons.push(renderPageButton(totalPages));
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
        {paginationButtons}
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
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Research Articles
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover groundbreaking research and innovations across various fields
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400 h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Sort Button */}
            <button
              onClick={() => setSortBy(sortBy === "newest" ? "popular" : "newest")}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-3 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <Filter className="h-5 w-5 text-gray-500 group-hover:text-emerald-600" />
              <span className="text-gray-700 group-hover:text-emerald-600">Sort by {sortBy}</span>
              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-emerald-600" />
            </button>

            {/* View Toggle */}
            <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white p-1">
              <button
                onClick={() => setViewType("grid")}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                  viewType === "grid"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Grid
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                  viewType === "list"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Articles Display */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block p-4 rounded-full bg-emerald-50">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-500 text-lg mt-4">Loading articles...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div
            className={`${
              viewType === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "flex flex-col gap-6"
            }`}
          >
            {filteredArticles.map((article, index) => (
              <article
                key={article.article_id}
                className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 border border-gray-100
                  ${viewType === "list" ? "flex flex-col md:flex-row md:items-center" : ""}`}
              >
                <div className="p-8 flex-1">
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
                      onClick={() => userId && logInteraction(userId, article.article_id, 'read_more')}
                      className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-all group"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="inline-block p-4 rounded-full bg-emerald-50 mb-4">
              <Search className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-gray-500 text-lg">
              No articles found matching your criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && <Pagination />}
      </div>
    </section>
  );
}
