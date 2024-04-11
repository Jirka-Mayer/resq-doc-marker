import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  FormControlLabel,
  MenuItem,
  CircularProgress,
  Alert,
  FormGroup,
  Checkbox,
  Box,
  LinearProgress,
} from "@mui/material";
import { useAtom } from "jotai";
import { atom } from "jotai/vanilla";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { openUploadDialog, authorizationCode, fileUuid } from "./pageLoadingIntercept";
import { ResqApiConnection } from "./ResqApiConnection";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { stateApi } from "doc-marker";
import { redirectToResq } from "./redirectToResq";

export const isOpenAtom = atom(openUploadDialog);

export function UploadDialog() {
  const { t } = useTranslation("uploadDialog");

  const [isOpen, setIsOpen] = useAtom<boolean>(isOpenAtom);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [file, setFile] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [resqUserId, setResqUserId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [uploadToResq, setUploadToResq] = useState<boolean>(false);
  const [uploadToUfal, setUploadToUfal] = useState<boolean>(true);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadDone, setUploadDone] = useState<boolean>(false);

  async function handleDialogOpenning() {
    if (authorizationCode === null) {
      setIsOpen(false);
      return;
    }

    setUploadDone(false);
    setIsLoading(true);

    // load the file
    const file = stateApi.FileStorage.loadFile(fileUuid);
    if (file === null) {
      setIsOpen(false);
      return;
    }
    setFile(file);
    setFileName(file.constructFileName())

    // setup API connection
    const connection = await ResqApiConnection.connect(authorizationCode);

    setAuthError("Lorem ipsum\nDolor sit\nAmet")

    setTimeout(() => {
      setIsLoading(false);
    }, 1_000);
  }

  useEffect(() => {
    if (isOpen) {
      handleDialogOpenning();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}} // clicking the background does not close the dialog
      fullWidth
    >
      <DialogTitle>{ t("title") }</DialogTitle>
      {isLoading ? (
        <DialogContent dividers>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              my: 8
            }}
          >
            <CircularProgress size={48} />
          </Box>
        </DialogContent>
      ) : (
        <DialogContent dividers>
          <Alert severity="error" sx={{mb: 2}}>
            Authentication has failed. Try uploading the file again.<br/>
            <pre>{ authError }</pre>
          </Alert>

          <Alert severity="warning" sx={{mb: 2}}>
            This file has already been uploaded,
            are you sure you want to upload it again? You can upload
            it again if you made changes to the file and you want to
            propagate these changes to the RES-Q registry and Charles University.
          </Alert>

          <Alert severity="info" sx={{mb: 2}}>
            You are logged in as:<br/>
            <strong>John Doe</strong><br />
            Hospital XYZ
          </Alert>

          <Typography variant="body1" color="text.primary" gutterBottom>
            By clicking the upload button you will upload the completed
            file to the RES-Q registry and Charles University.
          </Typography>

          <Typography variant="subtitle2" color="text.primary">
            File:
          </Typography>
          <Typography variant="body1" color="text.primary">
            { fileName }
          </Typography>
          <Typography variant="body2" color="text.primary" gutterBottom>
            ({ fileUuid })
          </Typography>

          <FormGroup>
            <FormControlLabel
              sx={{ alignItems: "flex-start" }}
              disabled={true} // RES-Q upload is not implemented yet!
              control={
                <Checkbox
                  // size="small"
                  sx={{ marginTop: -1 }}
                  checked={uploadToResq}
                  onChange={() => setUploadToResq(!uploadToResq)}
                />
              }
              slotProps={{
                typography: {
                  variant: "body1",
                  color: "text.primary",
                  gutterBottom: true,
                },
              }}
              label="Upload file to the RES-Q registry (to be added...)"
            />
            <FormControlLabel
              sx={{ alignItems: "flex-start" }}
              control={
                <Checkbox
                  // size="small"
                  sx={{ marginTop: -1 }}
                  checked={uploadToUfal}
                  onChange={() => setUploadToUfal(!uploadToUfal)}
                />
              }
              slotProps={{
                typography: {
                  variant: "body1",
                  color: "text.primary",
                  gutterBottom: true,
                },
              }}
              label="Upload file to Charles University"
            />
          </FormGroup>
          
          <Alert
            severity="info"
            variant="outlined"
            icon={<CircularProgress size={24} />}
            sx={{mb: 2}}
          >
            Uploading...
          </Alert>

          <Alert severity="error" sx={{mb: 2}}>
            Uploading has failed. Try uploading the file again.<br/>
            <pre>{ uploadError }</pre>
          </Alert>

          <Alert severity="success" sx={{mb: 2}}>
            Thank you for uploading the file. If you make any
            changes to the file, you can upload it again and it will be
            updated.
          </Alert>

        </DialogContent>
      )}
      <DialogActions>
        <Button
          variant="text"
          onClick={() => setIsOpen(false)}
        >
          { (authError || uploadError || uploadDone) ? "Close" : t("cancel") /* TODO: translate */}
        </Button>
        {(authError || uploadError || uploadDone) && (
          <Button
            autoFocus
            disabled={isLoading || isUploading || uploadDone}
            variant="contained"
            onClick={() => {
              // Do something!
              setIsOpen(false);
            }}
            endIcon={<LocalShippingIcon/>}
          >
            Upload {/* TODO: translate */}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}