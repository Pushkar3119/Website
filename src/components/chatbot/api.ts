import axios from "axios";
import { API_CONFIG } from "@/api/config";
import type { AllCounselor } from "@/types/academic";

export interface CounsellorFromAPI {
  counsellorId: string;
  photo?: string;
  fullName?: string;
  languagesKnown?: string;
  city?: string;
  state?: string;
  rating?: number;
  reviewCount?: number;
  plusAmount?: number;
  experience?: number;
  verified?: boolean;
}

export interface AskResponse {
  answer: string;
  counsellors: CounsellorFromAPI[];
}

interface FrontendMessage {
  text: string;
  isUser: boolean;
}
// ... (rest of your existing api.ts code) ...



// UPDATED: The function now accepts `history` and uses the POST method
export const askQuestion = async (question: string, history: FrontendMessage[]): Promise<AskResponse> => {
  // Format the history to match what the Python backend expects ({ role, content })
  const formattedHistory = history.map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.text,
  }));

  const response = await axios.post<AskResponse>(
    `${API_CONFIG.chatbotUrl}/ask?question=${encodeURIComponent(question)}`,
    formattedHistory // Send the history in the request body
  );
  return response.data;
};

// The translator function remains the same
export const transformCounselorData = (apiCounselor: CounsellorFromAPI): AllCounselor => {
  const [firstName, ...lastName] = (apiCounselor.fullName || "N/A").split(" ");
  return {
    counsellorId: apiCounselor.counsellorId,
    firstName: firstName,
    lastName: lastName.join(" "),
    photoUrlSmall: apiCounselor.photo || "/default-avatar.jpg",
    rating: apiCounselor.rating || 0,
    ratePerYear: apiCounselor.plusAmount || 5000,
    experience: `${apiCounselor.experience || 0}`,
    languagesKnow: (apiCounselor.languagesKnown || "English").split(", "),
    city: apiCounselor.city || apiCounselor.state || "N/A",
    numberOfRatings: `${apiCounselor.reviewCount || 0}`,
  };
};