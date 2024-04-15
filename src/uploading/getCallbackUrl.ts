/**
 * Constructs the URL the keycloak server should redirect the user back to
 * (anotherwords, it's the URL we are on right now)
 */
export function getCallbackUrl(): string {
  const url = new URL(
    window.location.href.replace(window.location.search, "")
  );
  url.searchParams.append("keycloakCallback", "true");
  return url.href;
}