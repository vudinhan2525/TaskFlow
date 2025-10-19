import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const elacicSearchApi = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default elacicSearchApi;

interface SearchRequest {
  q?: string;
  project_ids?: string[];
  assignee_ids?: string[];
  reporter_ids?: string[];
  status?: string[];
  labels?: string[];
  last_updated: string;
  created_at?:
    | "any_time"
    | "today"
    | "yesterday"
    | "past_7_days"
    | "past_30_days"
    | "past_year";
  updated_at?:
    | "any_time"
    | "today"
    | "yesterday"
    | "past_7_days"
    | "past_30_days"
    | "past_year";
  due_date?:
    | "any_time"
    | "today"
    | "yesterday"
    | "past_7_days"
    | "past_30_days"
    | "past_year";
  priority?: "low" | "medium" | "high";
  type?: "bug" | "feature" | "task";
  severity?: "low" | "medium" | "high";
  category?: "bug" | "feature" | "task";
  limit?: number;
}

export const elasticSearch = {
  search: (request: SearchRequest) => {
    return elacicSearchApi.post("/search_issues", request);
  },
};

export const useElasticSearch = (request: SearchRequest) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["elasticSearch", request],
    queryFn: async () => {
      const response = await elasticSearch.search(request);
      console.log(response);
      return response.data;
    },
  });
  return {
    issues: data,
    isLoading: isLoading,
    error: error,
  };
};
