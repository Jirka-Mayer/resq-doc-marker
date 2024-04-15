import { ResqApiConnection } from "./ResqApiConnection";
import { ResqUser } from "../resq-model/ResqUser";

export class DummyConnection extends ResqApiConnection {
  constructor() {
    super("dummy-token");
  }

  public async getAuthenticatedUser(): Promise<ResqUser> {
    return {
      id: "dummy-resq-user-id-john-doe",

      firstName: "John",
      lastName: "Doe",
      title: "",

      settings: {
        currentProvider: {
          id: 420,
          name: "Johns Hospital"
        }
      },
    };
  }
}