/* eslint-disable no-console */
import axios from "axios";
import { storageKey } from "@/contants/DefaultValue";
import { useToast } from "@/components/ui/use-toast";
import { getStorageData } from "./utils";
export const baseApi = "http://45.77.242.139:3000";
const fetch = axios.create({
  baseURL: baseApi,
  timeout: 8000,
});
const { toast } = useToast();
// Config

// const ENTRY_ROUTE = `login`;
const AUTHORIZATION = "authorization";
// const PUBLIC_REQUEST = "public-request";

// API Request interceptor
fetch.interceptors.request.use(
  (config) => {
    const authToken: string = getStorageData(storageKey.authToken) || "";
    const jwtToken = `Bearer ${authToken}`;

    if (config.headers) {
      if (jwtToken && authToken) {
        config.headers[AUTHORIZATION] = jwtToken;
      }
    }

    // if (!jwtToken && !config.headers[PUBLIC_REQUEST]) {
    //   history.push(ENTRY_ROUTE);
    //   window.location.reload();
    // }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// API response interceptor
fetch.interceptors.response.use(
  (response) => response,
  (error) => {
    // Remove token and redirect
    if (
      error.response.status === 400 ||
      error.response.status === 403 ||
      error.response.status === 401
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "Auth",
      });
      //   // Check Refresh Token
      //   if (getStorageData(storageKey.authRefreshToken)) {
      //     setStorageData(storageKey.checkAuthRefreshToken, "YES");
      //   } else if (window.location.pathname !== ENTRY_ROUTE) {
      //     removeDefaultStorageData();
      //     history.push(ENTRY_ROUTE);
      //     window.location.reload();
      //   }
      console.log("Authentication Fail");
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

    return Promise.reject(error);
  }
);

export default fetch;
