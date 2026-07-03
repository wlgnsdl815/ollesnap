export interface FetchJsonOptions {
  init?: RequestInit;
  errorMessage?: string;
  validateResponseText?: (responseText: string) => void;
}

export async function fetchJson<TResponse>(
  input: string | URL,
  options: FetchJsonOptions = {},
): Promise<TResponse> {
  const response = await fetch(input, options.init);

  if (!response.ok) {
    throw new Error(
      `${options.errorMessage ?? "HTTP request failed"}: ${response.status}`,
    );
  }

  const responseText = await response.text();

  options.validateResponseText?.(responseText);

  try {
    return JSON.parse(responseText) as TResponse;
  } catch {
    throw new Error("HTTP response is not valid JSON.");
  }
}
