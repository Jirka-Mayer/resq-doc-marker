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
import {
  openUploadDialog,
  authorizationCode,
  fileUuid,
  useDummyConnection,
} from "./pageLoadingIntercept";
import { ResqApiConnection } from "./ResqApiConnection";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { stateApi } from "doc-marker";
import { ResqUser } from "../resq-model/ResqUser";
import { DummyConnection } from "./DummyConnection";

export const isOpenAtom = atom(openUploadDialog);

export function UploadDialog() {
  const { t } = useTranslation("uploadDialog");

  const [isOpen, setIsOpen] = useAtom<boolean>(isOpenAtom);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [file, setFile] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [authError, setAuthError] = useState<string | null>(null);
  const [connection, setConnection] = useState<ResqApiConnection | null>(null);
  const [user, setUser] = useState<ResqUser | null>(null);

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

    setIsLoading(true);

    // reset state
    setAuthError(null);
    setConnection(null);
    setUser(null);
    setUploadDone(false);
    setIsUploading(false);

    // load the file
    const file = stateApi.FileStorage.loadFile(fileUuid);
    if (file === null) {
      setIsOpen(false);
      return;
    }
    setFile(file);
    setFileName(file.constructFileName());

    try {
      // setup API connection
      const _connection = useDummyConnection
        ? new DummyConnection() // add &dummy=true to the URL to use this
        : await ResqApiConnection.connect(authorizationCode);

      // fetch user info
      const _user = await _connection.getAuthenticatedUser();
      
      setConnection(_connection);
      setUser(_user);
    } catch (e) {
      const err = e as Error;
      setAuthError(err.stack || (err.name + ": " + err.message));
    }
    
    setIsLoading(false);
  }

  useEffect(() => {
    if (isOpen) {
      handleDialogOpenning();
    }
  }, [isOpen]);

  async function performUploading() {
    setIsUploading(true);
    
    // reset state
    setUploadDone(false);
    setUploadError(null);

    try {
      // resq upload first to get the case ID
      console.log(file);
      // then ufal upload
    } catch (e) {
      const err = e as Error;
      setUploadError(err.stack || (err.name + ": " + err.message));
    }

    setIsUploading(false);
    setUploadDone(true);
  }

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
          
          {/* AUTH FAILED ERROR */}
          {(authError !== null) && (
            <Alert severity="error" sx={{mb: 2}}>
              Authentication has failed. Try uploading the file again.<br/>
              <pre style={{whiteSpace: "pre-wrap"}}>{ authError }</pre>
            </Alert>
          )}

          {/* UPLOADING CONTROLS */}
          {(user !== null) && (<>

            {/* TODO: get the metadata from the file */}
            <Alert severity="warning" sx={{mb: 2}}>
              This file has already been uploaded,
              are you sure you want to upload it again? You can upload
              it again if you made changes to the file and you want to
              propagate these changes to the RES-Q registry and Charles University.
            </Alert>

            <Alert severity="info" sx={{mb: 2}}>
              You are logged in as:<br/>
              <strong>
                {user.title} {user.firstName} {user.lastName}
              </strong><br />
              {user?.settings.currentProvider.name}
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

          </>)}
          
          {/* UPLOADING SPINNER */}
          {isUploading && (
            <Alert
              severity="info"
              variant="outlined"
              icon={<CircularProgress size={24} />}
              sx={{mb: 2}}
            >
              Uploading...
            </Alert>
          )}

          {/* UPLOADING FAILED */}
          {(uploadError !== null) && (
            <Alert severity="error" sx={{mb: 2}}>
              Uploading has failed. Try uploading the file again.<br/>
              <pre style={{whiteSpace: "pre-wrap"}}>{ uploadError }</pre>
            </Alert>
          )}

          {/* UPLOADING SUCCEEDED */}
          {uploadDone && (
            <Alert severity="success" sx={{mb: 2}}>
              Thank you for uploading the file. If you make any
              changes to the file, you can upload it again and it will be
              updated.<br />
              <br />
              Case ID in the RES-Q registry:<br />
              <strong>To be added...</strong>
            </Alert>
          )}

        </DialogContent>
      )}
      <DialogActions>
        <Button
          variant="text"
          onClick={() => setIsOpen(false)}
        >
          { (!user || uploadError || uploadDone) ? "Close" : t("cancel") /* TODO: translate */}
        </Button>
        {(user && !uploadError && !uploadDone) && (
          <Button
            autoFocus
            disabled={isLoading || isUploading || uploadDone}
            variant="contained"
            onClick={() => performUploading()}
            endIcon={<LocalShippingIcon/>}
          >
            Upload {/* TODO: translate */}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}