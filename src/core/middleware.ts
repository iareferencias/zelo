/**
 * Middleware utilitário.
 * Adicione aqui interceptações, guards ou helpers reutilizáveis.
 */
export function withAuth(headers = {}) {
  return { ...headers };
}
