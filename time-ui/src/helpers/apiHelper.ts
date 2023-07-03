const API_URL = process.env.REACT_APP_API_URL_PROD;

interface ApiResponse<T> {
  content: T;
  success: boolean;
  message?: string;
}

interface RequestParams {
  method?: string;
  body?: string | any;
  headers?: Headers;
}
/**
 * Fetches from provided url and returns as JSON.
 * A fetch wrapper with error handling.
 *
 */
const doRequest = async <T>(
  url: string,
  params: RequestParams
): Promise<ApiResponse<T>> => {
  if (typeof params.body !== 'undefined' && typeof params.body !== 'string') {
    params.body = JSON.stringify(params.body);
  }

  const response = await fetch(API_URL + url, params);

  if (response.status !== 200) {
    throw new Error(
      `Request failed with status ${response.status}: ${response.statusText}`
    );
  }

  return (await response.json()) as ApiResponse<T>;
};

export { doRequest };
export type { ApiResponse, RequestParams };
