export interface UploaderUserMetadata {
  /**
   * ID of the user in the RES-Q registry
   */
  id: string,
  
  firstName: string,
  lastName: string,
  title: string,

  /**
   * RES-Q ID of the hospital on which behalf the file was uploaded
   */
  providerId: number,

  /**
   * Name of the hospital on which behalf the file was uploaded
   */
  providerName: string,
}