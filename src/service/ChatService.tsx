import fetchNoAuth from "@/helper/apiNoAuthHelper";
import fetchWithAuth from "@/helper/apiHelper"

export const chatService = {
  postNewChat: (data: any) => {
    return fetchWithAuth.post("/prompt/newChat", data);
  },
  postAsk: (data: any) => {
    return fetchWithAuth.post("/prompt/ask", data);
  },
  userAuth: (user_id: string) => {
    return fetchWithAuth.post("/users/auth", { user_id })
  },
  getActiveModel: () => {
    return fetchNoAuth.get("/provider/models")
  },
  getUserChathHistory: (userId: string) => {
    return fetchWithAuth.get("/prompt/chat-history")
  },
  getUserChatDetail: (chatId: string) => {
    return fetchWithAuth.get("/prompt/chat/${chatId}",)

  },
  getUserBalance: (userId: string) => {
    return fetchWithAuth.get("");
  }

};
