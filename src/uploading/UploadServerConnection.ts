import config from "../config";
import { ResqProviders } from "./ResqProviders";
import { ResqUser } from "./ResqUser";
import { getCallbackUrl } from "./getCallbackUrl";

/**
 * Encapsulates an authenticated connection to ÚFAL upload server
 * and proxy-connection to the RES-Q registry
 */
export class UploadServerConnection {
  /**
   * ID of the initiated upload transaction
   */
  public readonly uploadTransactionId: number;

  /**
   * Bearer token needed to finalize the upload transaction
   */
  public readonly docMarkerToken: string;

  /**
   * The logged-in RES-Q user
   */
  public readonly resqUser: ResqUser;

  public readonly resqProviders: ResqProviders = {};
  
  constructor(
    uploadTransactionId: number,
    docMarkerToken: string,
    resqUser: ResqUser,
    resqProviders: ResqProviders,
  ) {
    this.uploadTransactionId = uploadTransactionId;
    this.docMarkerToken = docMarkerToken;
    this.resqUser = resqUser;
    this.resqProviders = resqProviders;
  }

  /**
   * Initiates an upload server connection by sending the
   * RES-Q Keycloak server authorization code to the
   * ÚFAL upload server. This also initiates an upload trasaction.
   */
  static async connect(authorizationCode: string): Promise<UploadServerConnection> {
    const response = await fetch(
      new URL("upload-transaction", config.uploadServerBaseUrl),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "authorization_code": authorizationCode,
          "keycloak_redirect_uri": getCallbackUrl(),
          "is_development": config.uploadServerActInDevelopment
        })
      }
    );

    if (response.status !== 201) {
      let msg = `Non-201 status (${response.status} ${response.statusText})\n`;
      msg += "Response body: " + await response.text();
      throw new Error(msg);
    }

    const data = await response.json();

    return new UploadServerConnection(
      Number(data["id"]),
      String(data["doc_marker_token"]),
      data["resq_user"] as ResqUser,
      data["resq_providers"] as ResqProviders,
    );
  }

  /**
   * Finalizes the upload and returns the (updated) serialized file JSON
   * @param fileJson Serialized JSON for the file
   * @param uploadToUfal Should the file be stored at ÚFAL
   * @param uploadToResq Should the file be stored in RES-Q
   * @param resqProviderId What hospital is the file uploaded on behalf
   * @param resqFormLocalizationId The current RES-Q case ID of the file or null
   */
  public async finalizeUploadTransaction(
    fileJson: object,
    uploadToUfal: boolean,
    uploadToResq: boolean,
    resqProviderId: number | null,
    resqFormLocalizationId: number | null
  ): Promise<object | null> {
    const response = await fetch(
      new URL(
        `upload-transaction/${this.uploadTransactionId}`,
        config.uploadServerBaseUrl
      ),
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + this.docMarkerToken
        },
        body: JSON.stringify({
          "doc_marker_token": this.docMarkerToken,
          "file_json": fileJson,
          "upload_to_resq": uploadToResq,
          "upload_to_ufal": uploadToUfal,
          "resq_provider_id": resqProviderId,
          "resq_form_localization_id": resqFormLocalizationId,
        })
      }
    );
  
    if (response.status !== 200) {
      let msg = `Non-200 status (${response.status} ${response.statusText})\n`;
      msg += "Response body: " + await response.text();
      throw new Error(msg);
    }

    const data = await response.json();

    return data["file_json"];
  }
}
