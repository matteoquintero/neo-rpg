export const getParam = (
  key: string,
  body: Record<string, any>,
  queryParams?: Record<string, string>
): string | undefined => queryParams?.[key] || body?.[key];
