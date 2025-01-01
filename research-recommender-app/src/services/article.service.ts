import { nestApi } from "@/config/axios.config";

export const findAllArticles = async (page = 1, limit = 10) => {
  try {
    const response = await nestApi.post(`/articles/find-all`, { page, limit });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findArticlesByPopularity = async (
  page = 1,
  limit = 10,
  prioritizePopular = true
) => {
  try {
    const response = await nestApi.post(`/articles/all`, {
      page,
      limit,
      prioritizePopular,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching articles by popularity:", error);
    throw error;
  }
};

export const findArticleById = async (article_id: string) => {
  try {
    const response = await nestApi.get(`/articles/article/${article_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching article details:", error);
    throw error;
  }
};


export const getArticlesForUser = async (
    userId: string,
    page: number = 1,
    limit: number = 10,
    prioritizePopular: boolean = false
  ) => {
    try {
      const response = await nestApi.post(`/articles/articles-for-user`, {
        userId,
        page,
        limit,
        prioritizePopular,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching articles for user:", error);
      throw error;
    }
};
  
export const getRecommendations = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const response = await nestApi.post("/articles/recommendations", {
      user_id: userId,
      page,
      limit,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

