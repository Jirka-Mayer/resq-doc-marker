import React, { useContext } from "react";
import {
  Button,
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { DocMarkerContext } from "doc-marker";
import { redirectToResq } from "./uploading/redirectToResq";

export function ToolsMenuExtension() {
  const { t } = useTranslation("menus");

  const { fileMetadataStore, fileStateManager } = useContext(DocMarkerContext);

  // === used state ===

  const [isFileOpen] = useAtom(fileMetadataStore.isFileOpenAtom);
  const [fileUuid] = useAtom(fileMetadataStore.fileUuidAtom);

  // === click handlers ===

  function onUploadFileClick() {
    fileStateManager.saveCurrentFile();
    redirectToResq(fileUuid as string);
  }

  return (
    <>
      <MenuItem disabled={!isFileOpen} onClick={onUploadFileClick}>
        <ListItemIcon>
          <LocalShippingIcon />
        </ListItemIcon>
        <Typography variant="inherit">{t("tools.uploadFile")}</Typography>
      </MenuItem>
    </>
  );
}
