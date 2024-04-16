import config from "../config";

/**
 * Uploads a finished DocMarker file with annotations to the Charles University
 * 
 * The access token is the same bearer token used to access the RES-Q API,
 * it is send just so that the request can be validated against the RES-Q
 * registry to reject unauthenticated users.
 */
export async function uploadFileToUfal(fileJson: object, accessToken: string) {
  const response = await fetch(config.ufalUploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + accessToken
    },
    body: JSON.stringify({
      "is_development": config.ufalUploadIsDevelopment,
      "file_json": fileJson
    })
  });

  if (response.status !== 201) {
    let msg = `Non-201 status (${response.status} ${response.statusText})\n`;
    msg += "Response body: " + await response.text();
    throw new Error(msg);
  }
}
