// app/hooks/useApiMutation.jsx
import { useMutation } from "@tanstack/react-query";
import api from "../service/api";
import { getCsrfToken } from "../utils/getCsrfToken";

export function useApiMutation({
                                 url,
                                 method = "post",
                                 onSuccessExtra = () => {},
                                 onErrorExtra = () => {},
                                 axiosOptions = {},
                                 ...reactQueryOptions
                               }) {
  return useMutation({
    mutationFn: async (data) => {
      let endpoint;
      let bodyOrParams;

      // Handle dynamic URL with function
      if (typeof url === "function") {
        // If data has an 'id' property, use it for the URL
        if (data && typeof data === "object" && "id" in data) {
          const { id, ...rest } = data;
          endpoint = url(id);
          // For GET requests, use params; for others, use body
          if (method.toLowerCase() === "get") {
            bodyOrParams = rest;
          } else {
            bodyOrParams = rest;
          }
        } else {
          endpoint = url(data);
          bodyOrParams = data;
        }
      } else {
        endpoint = url;
        bodyOrParams = data;
      }

      const methodLower = method.toLowerCase();

      // GET request
      if (methodLower === "get") {
        const res = await api.get(endpoint, {
          params: bodyOrParams || {},
          ...axiosOptions,
        });
        return res.data;
      }

      // POST, PUT, PATCH, DELETE
      const csrfToken = await getCsrfToken();

      const config = {
        ...axiosOptions,
        headers: {
          ...axiosOptions.headers,
          "x-csrf-token": csrfToken,
        },
      };

      // DELETE
      if (methodLower === "delete") {
        const res = await api.delete(endpoint, {
          ...config,
          data: bodyOrParams || {},
        });
        return res.data;
      }

      // PUT / PATCH
      if (methodLower === "put" || methodLower === "patch") {
        config.headers["Content-Type"] = "application/json";
        const res = await api[methodLower](
            endpoint,
            bodyOrParams || {},
            config,
        );
        return res.data;
      }

      // POST - handle FormData or JSON
      if (bodyOrParams instanceof FormData) {
        delete config.headers["Content-Type"];
        const res = await api.post(endpoint, bodyOrParams, config);
        return res.data;
      } else {
        config.headers["Content-Type"] = "application/json";
        const res = await api.post(endpoint, bodyOrParams || {}, config);
        return res.data;
      }
    },

    onSuccess: (data, variables) => {
      onSuccessExtra(data, variables);
    },

    onError: (error) => {
      onErrorExtra(error);
    },

    ...reactQueryOptions,
  });
}
