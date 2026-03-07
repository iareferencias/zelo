export function withAuth(headers: Record<string, string> = {}) {
  return {
    ...headers
  }
}
