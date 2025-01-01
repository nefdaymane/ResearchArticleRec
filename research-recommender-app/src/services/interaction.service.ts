import { nestApi } from "@/config/axios.config";

export const logInteraction = async (
  userId: string,
  articleId: string,
  interactionType: string
) => {
  try {
    const response = await nestApi.post("interactions/log", {
      user_id: userId,
      item_id: articleId,
      interaction_type: interactionType,
    });

    console.log("Interaction logged successfully");

    return response.data;
  } catch (error) {
      console.error("Error logging interaction:", error);
    throw error;
  }
};
