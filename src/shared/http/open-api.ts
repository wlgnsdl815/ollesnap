export function normalizeServiceKey(serviceKey: string): string {
  try {
    return decodeURIComponent(serviceKey) === serviceKey
      ? encodeURIComponent(serviceKey)
      : serviceKey;
  } catch {
    return encodeURIComponent(serviceKey);
  }
}

export function extractOpenApiXmlErrorMessage(
  responseText: string,
): string | null {
  if (!responseText.trimStart().startsWith("<")) {
    return null;
  }

  const authMessage = responseText.match(
    /<returnAuthMsg>(.*?)<\/returnAuthMsg>/,
  );
  const reasonCode = responseText.match(
    /<returnReasonCode>(.*?)<\/returnReasonCode>/,
  );

  if (authMessage?.[1]) {
    return reasonCode?.[1]
      ? `${authMessage[1]} (${reasonCode[1]})`
      : authMessage[1];
  }

  return "OpenAPI returned an XML error response.";
}
