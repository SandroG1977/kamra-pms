// UnitHOS PMS: The SPA is served at root / in both development and production.
export const ROUTER_BASENAME = "/"

// Prefix an in-app path with the basename for a full-page navigation
// (window.location), which the router's own navigate() would otherwise add.
export function toFullPath(path: string): string {
  const base = ROUTER_BASENAME === "/" ? "" : ROUTER_BASENAME
  return base + (path.startsWith("/") ? path : "/" + path)
}
