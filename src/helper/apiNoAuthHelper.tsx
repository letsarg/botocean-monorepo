/* eslint-disable no-console */
import axios from "axios";
import { baseApi } from "./apiHelper";
import { useToast } from "@/components/ui/use-toast";

const fetchNoAuth = axios.create({
  baseURL: baseApi,
  timeout: 8000,
});

// Config
// const { toast } = useToast();

const AUTHORIZATION = "authorization";

// API Request interceptor
fetchNoAuth.interceptors.request.use(
  (config) => {
    const authToken = "";
    const jwtToken = `Bearer ${authToken}`;

    if (config.headers) {
      // config.headers = config.headers as { [key: string]: any };

      if (authToken) {
        config.headers[AUTHORIZATION] = jwtToken;
      }

      // if (!jwtToken && !config.headers[PUBLIC_REQUEST]) {
      //   history.push(ENTRY_ROUTE);
      //   window.location.reload();
      // }
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// API response interceptor
fetchNoAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    // Remove token and redirect
    if (
      error.response.status === 400 ||
      error.response.status === 403 ||
      error.response.status === 401
    ) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error.response.data.err_msg,
      // });
    }

    if (error.response.status === 404) {
      console.log("Not Found");
    }

    if (error.response.status === 500) {
      console.log("Internal Server Error");
    }

    if (error.response.status === 508) {
      console.log("Time Out");
    }
    if (error.response.status === 502) {
      console.log("Bad Gateway");
    }
    return Promise.reject(error);
  }
);

export default fetchNoAuth;
