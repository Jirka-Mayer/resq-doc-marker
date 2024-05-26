import { UploadServerConnection } from "./UploadServerConnection";
import { ResqUser } from "./ResqUser";

export class DummyConnection extends UploadServerConnection {
  constructor() {
    const user: ResqUser = {
      id: "dummy-resq-user-id-john-doe",

      first_name: "John",
      last_name: "Doe",
      title: "",

      current_provider_id: 420
    };

    super(
      42,
      "dummy-doc-marker-token",
      user,
      {
        420: "Johns Hospital",
        123: "Another Dummy Hospital"
      }
    );
  }

  public async finalizeUploadTransaction(
    fileJson: object,
    uploadToUfal: boolean,
    uploadToResq: boolean,
    resqProviderId: number | null,
    resqFormLocalizationId: number | null
  ): Promise<object | null> {
    // just log the data
    console.log("finalizeUploadTransaction:", arguments);
    
    const modifiedJson = JSON.parse(JSON.stringify(fileJson));
    modifiedJson["uploadedAt"] = new Date().toISOString();
    modifiedJson["uploadedByUser"] = {
      "//": "dummy-user-metadata"
    };
    modifiedJson["resqCaseId"] = "dummyCaseId";
    modifiedJson["resqRecordId"] = "dummyRecordId";

    return modifiedJson;
  }
}