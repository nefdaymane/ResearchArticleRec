"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { findArticleById } from "@/services/article.service";
import { Calendar, Book, Share2, Bookmark, ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { ApiResponse } from "@/types/api.types";
import { Article } from "@/models/articles/articles";
import { useEffect, useState } from "react";
import { logInteraction } from "@/services/interaction.service";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ArticleDetailsProps {
  params: Promise<{ article_id: string }>;
}

// Types for our reactions component
interface ReactionButtonProps {
  type: 'like' | 'dislike';
  // count: number;
  isActive: boolean;
  onClick: () => void;
}

interface MainColumnProps {
  article: Article;
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
  handleReaction: (type: 'like' | 'dislike') => void;
}

interface SidebarColumnProps {
  article: Article;
}

function ArticleDetails({ params }: ArticleDetailsProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchParamsAndArticle = async () => {
      try {
        const resolvedParams = await params;
        const articleId = resolvedParams.article_id;
        setArticleId(articleId);

        const response = (await findArticleById(articleId)) as ApiResponse<Article>;
        if (response && response.success) {
          if (response.data) {
            setArticle(response.data);
          } else {
            setError("Article data is undefined");
          }
          setLikes(Math.floor(Math.random() * 100));
          setDislikes(Math.floor(Math.random() * 20));
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Error fetching article details:", err);
        setError("Failed to fetch article details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParamsAndArticle();
  }, [params]); // Only depends on params

  // Effect for user authentication
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const user = decodedToken.sub ?? null;
        setUserId(user);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  // Effect for logging interactions
  // useEffect(() => {
  //   if (articleId && userId) {
  //     logInteraction(userId, articleId, "view_details");
  //   }
  // }, [articleId, userId]);

  const handleReaction = (type: 'like' | 'dislike') => {
    if (!userId) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
  
    // Directly assign interaction type and update state
    if (userReaction === type) {
      // User removes the current reaction
      setUserReaction(null);
  
      if (type === 'like') {
        setLikes((prev) => prev - 1);
      } else {
        setDislikes((prev) => prev - 1);
      }
  
      // Log the removal
      if (articleId) {
        logInteraction(userId!, articleId, type); // Log 'like' or 'dislike' directly
      }
    } else {
      // User adds or changes reaction
      if (userReaction === 'like') {
        setLikes((prev) => prev - 1);
      } else if (userReaction === 'dislike') {
        setDislikes((prev) => prev - 1);
      }
  
      setUserReaction(type); // Set the new reaction
  
      if (type === 'like') {
        setLikes((prev) => prev + 1);
      } else {
        setDislikes((prev) => prev + 1);
      }
  
      // Log the addition
      if (articleId) {
        logInteraction(userId!, articleId, type); // Log 'like' or 'dislike' directly
      }
    }
  };
  

  // Reaction Button Component
  const ReactionButton: React.FC<ReactionButtonProps> = ({ type, isActive, onClick }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              isActive
                ? type === 'like'
                  ? 'bg-[#2EC27E] text-white'
                  : 'bg-red-500 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {type === 'like' ? <ThumbsUp className="w-5 h-5" /> : <ThumbsDown className="w-5 h-5" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{type === 'like' ? 'Like' : 'Dislike'} this article</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  

  // Main Column Component
const MainColumn: React.FC<MainColumnProps> = ({ article, userReaction, handleReaction }) => (
  <div className="lg:col-span-2">
    <div className="bg-white rounded-xl shadow-lg p-8 transition-transform hover:scale-[1.01]">
      <header className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-[#0D1B2A] leading-tight">
            {article.raw_title}
          </h1>
          <Badge variant="outline" className="bg-[#2EC27E] text-white">
            Featured
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mt-4">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4 text-[#2EC27E]" />
              <span>ID: {article.citeulike_id}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <Book className="h-4 w-4 text-[#2EC27E]" />
              <span>Article ID: {article.article_id}</span>
            </div>
          </div>
          
          {/* Moved reactions here */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <ReactionButton
              type="like"
              isActive={userReaction === 'like'}
              onClick={() => handleReaction('like')}
            />
            <ReactionButton
              type="dislike"
              isActive={userReaction === 'dislike'}
              onClick={() => handleReaction('dislike')}
            />
          </div>
        </div>
      </header>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold text-[#2EC27E] mb-4">Abstract</h2>
        <p className="text-gray-700 leading-relaxed mb-8">{article.raw_abstract}</p>
      </div>
    </div>
  </div>
);

  // Sidebar Column Component
  const SidebarColumn: React.FC<SidebarColumnProps> = ({ article }) => (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.01]">
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-4">Quick Actions</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-2 bg-[#2EC27E] text-white px-4 py-2 rounded-lg hover:bg-[#25A36C] transition-all hover:shadow-lg">
            <Share2 className="w-4 h-4" />
            Share Article
          </button>
          <button className="w-full flex items-center justify-center gap-2 border border-[#2EC27E] text-[#2EC27E] px-4 py-2 rounded-lg hover:bg-[#2EC27E] hover:text-white transition-all hover:shadow-lg">
            <Bookmark className="w-4 h-4" />
            Save for Later
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.01]">
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-4">Additional Information</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <p className="text-sm font-medium text-gray-600">Title</p>
            <p className="text-gray-800">{article.title}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <p className="text-sm font-medium text-gray-600">Article ID</p>
            <p className="text-gray-800">{article.article_id}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#2EC27E] border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading article details...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    notFound();
    return null;
  }

  return (
    <div className="min-h-screen">
      {showAlert && (
        <Alert className="fixed top-4 right-4 w-auto bg-red-50 border-red-200 z-50">
          <AlertDescription className="text-red-800">
            Please sign in to react to articles
          </AlertDescription>
        </Alert>
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
  href="/user"
  className="inline-flex items-center px-4 py-2 rounded-xl bg-white shadow-sm hover:shadow-md text-gray-600 hover:text-[#2EC27E] transition-all duration-300 group mb-8 hover:-translate-y-0.5"
>
  <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
  <span className="font-medium">Back to Articles</span>
</Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MainColumn 
            article={article} 
            likes={likes}
            dislikes={dislikes}
            userReaction={userReaction}
            handleReaction={handleReaction}
          />
          <SidebarColumn article={article} />
        </div>
      </div>
    </div>
  );
}

export default ArticleDetails;