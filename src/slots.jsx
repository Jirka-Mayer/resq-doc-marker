import React from "react"
import { ToolsMenuExtension } from "./ToolsMenuExtension"
import { UploadDialog } from "./uploading/UploadDialog"

/*
  React slots to override in the Doc Marker app
 */

export const dialogs = (<>
  <UploadDialog/>
</>)

export const toolsMenu = (
  <ToolsMenuExtension/>
)
