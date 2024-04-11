import React from "react";
import {
  Button,
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider
} from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useAtom } from "jotai"
import { useTranslation } from "react-i18next";
import { stateApi } from "doc-marker";
import { redirectToResq } from "./uploading/redirectToResq";

export function ToolsMenuExtension() {
  const { t } = useTranslation("menus");
  
  // === used state ===

  const [isFileOpen] = useAtom(stateApi.fileStore.isFileOpenAtom);
  const [fileUuid] = useAtom(stateApi.fileStore.fileUuidAtom);

  // === click handlers ===

  function onUploadFileClick() {
    stateApi.fileStore.saveCurrentFile();
    redirectToResq(fileUuid as string);
  }

  return (<>
    <MenuItem disabled={!isFileOpen} onClick={onUploadFileClick}>
      <ListItemIcon>
        <LocalShippingIcon />
      </ListItemIcon>
      <Typography variant="inherit">
        { t("tools.uploadFile") }
      </Typography>
    </MenuItem>
  </>)
}