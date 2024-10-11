import fetchNoAuth from "@/helper/apiNoAuthHelper";

export const chatService = {
  postNewChat: (data: any) => {
    return fetchNoAuth.post("/prompt/newChat", data);
  },
  postAsk: (data: any) => {
    return fetchNoAuth.post("/prompt/ask", data);
  },
};
