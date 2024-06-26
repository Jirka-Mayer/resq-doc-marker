// parse the URL query string
const urlParams = new URLSearchParams(window.location.search)

// make sense of the query string
const beingRedirectedFromKeycloak = urlParams.get("keycloakCallback") === "true"

/**
 * Is set to true when the upload dialog should be openned
 */
export const openUploadDialog = beingRedirectedFromKeycloak

/**
 * Holds the OAuth 2.0 authorization code
 * see:
 * https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
 */
export const authorizationCode = beingRedirectedFromKeycloak
  ? (urlParams.get("code") || null)
  : null

/**
 * Holds the file UUID to upload
 * (taken from the "state" URL query parameter)
 * see:
 * https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
 */
export const fileUuid = beingRedirectedFromKeycloak
  ? (urlParams.get("state") || null)
  : null

/**
 * Can be used to debug the uploading logic,
 * constructs a dummy RES-Q API connection which returns dummy data
 */
export const useDummyConnection = urlParams.get("dummy") === "true";

// remove sensitive data from the URL address
// (that is, remove the whole query part)
// https://stackoverflow.com/questions/22753052/remove-url-parameters-without-refreshing-page
// (but not when developing on localhost)
if (window.location.hostname !== "localhost") {
  window.history.replaceState(
    null, // state object, we don't use any
    "", // unused parameter
    window.location.href.replace(window.location.search, "") // URL with query string removed
  )
}
