import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  InputLabel,
  FormControl,
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
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  openUploadDialog,
  authorizationCode,
  fileUuid,
  useDummyConnection,
} from "./pageLoadingIntercept";
import { UploadServerConnection } from "./UploadServerConnection";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { stateApi } from "doc-marker";
import { ResqUser } from "./ResqUser";
import config from "../config";
import { DummyConnection } from "./DummyConnection";
import { getResqFormLocalizationId } from "./getResqFormLocalizationId";

export const isOpenAtom = atom(openUploadDialog);

export function UploadDialog() {
  const { t, i18n } = useTranslation("uploadDialog");

  const [isOpen, setIsOpen] = useAtom<boolean>(isOpenAtom);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fileRef = useRef<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileAlreadyUploaded, setFileAlreadyUploaded] =
    useState<boolean>(false);

  const [authError, setAuthError] = useState<string | null>(null);
  const connectionRef = useRef<UploadServerConnection | null>(null);
  const [user, setUser] = useState<ResqUser | null>(null);
  const [providers, setProviders] = useState<{[id: number]: string}>({});
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);

  const [uploadToResq, setUploadToResq] = useState<boolean>(true);
  const [uploadToUfal, setUploadToUfal] = useState<boolean>(true);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadDone, setUploadDone] = useState<boolean>(false);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);

  async function handleDialogOpenning() {
    if (authorizationCode === null) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    // reset state
    setAuthError(null);
    connectionRef.current = null;
    setUser(null);
    setProviders({});
    setSelectedProvider(null);
    setUploadDone(false);
    setIsUploading(false);
    setUploadError(null);
    setFileAlreadyUploaded(false);
    setCaseId(null);
    setRecordId(null);

    // load the file
    const file = stateApi.FileStorage.loadFile(fileUuid);
    if (file === null) {
      setIsOpen(false);
      return;
    }
    fileRef.current = file;
    setFileName(file.constructFileName());
    setFileAlreadyUploaded(typeof(file.body["uploadedAt"]) === "string");
    setCaseId(file.body["resqCaseId"] || null);
    setRecordId(file.body["resqRecordId"] || null);

    try {
      // setup API connection
      const _connection = useDummyConnection
        ? new DummyConnection() // add &dummy=true to the URL to use this
        : await UploadServerConnection.connect(authorizationCode);

      connectionRef.current = _connection;
      setUser(_connection.resqUser);
      setProviders(_connection.resqProviders);
      setSelectedProvider(_connection.resqUser.current_provider_id)
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
    // must upload to at least one destination
    if (!uploadToResq && !uploadToUfal) {
      alert(t("alertNoCheckbox"));
      return;
    }

    // when uploading to RES-Q, a provider must be selected
    if (uploadToResq && selectedProvider === null) {
      alert(t("alertNoProvider"));
      return;
    }

    setIsUploading(true);
    
    // reset state
    setUploadDone(false);
    setUploadError(null);

    const _connection = connectionRef.current;
    if (!_connection) {
      throw new Error("Connection ref does not hold any connection.");
    }

    try {
      const modifiedFileJson = await _connection.finalizeUploadTransaction(
        fileRef.current.toJson(),
        uploadToUfal,
        uploadToResq,
        selectedProvider,
        getResqFormLocalizationId(
          fileRef.current.body["_formId"],
          i18n.language
        ),
      );

      // store the modified file JSON
      fileRef.current = new stateApi.AppFile(modifiedFileJson);
      stateApi.FileStorage.storeFile(fileRef.current);

      // update UI
      setCaseId(fileRef.current.body["resqCaseId"] || null);
      setRecordId(fileRef.current.body["resqRecordId"] || null);
      setUploadDone(true);
    } catch (e) {
      const err = e as Error;
      setUploadError(err.stack || (err.name + ": " + err.message));
    }
    setIsUploading(false);
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
              { t("authFailedMessage") }<br/>
              <pre style={{whiteSpace: "pre-wrap"}}>{ authError }</pre>
            </Alert>
          )}

          {/* UPLOADING CONTROLS */}
          {(user !== null) && (<>
            {fileAlreadyUploaded && (
              <Alert severity="warning" sx={{mb: 2}}>
                { t("alreadyUploadedWarning") }<br />
                {caseId && (<>
                  <br />
                  { t("caseIdInRegistry") }<br />
                  <strong>{caseId}</strong><br/>
                  <br/>
                  <a
                    style={{ color: "inherit" }}
                    href={config.resqRecordUrl(recordId)}
                    target="_blank"
                  >{ config.resqRecordUrl(recordId) }</a>
                </>)}
              </Alert>
            )}

            <Alert severity="info" sx={{mb: 2}}>
              { t("loggedInAs") }<br/>
              <strong>
                {user.title} {user.first_name} {user.last_name}
              </strong><br />
              { t("uploadingTheFile") }<br/>
              <strong>{ fileName }</strong>
            </Alert>

            <Typography variant="body1" color="text.primary" gutterBottom>
              { t("instructions") }
            </Typography>

            <FormGroup>
              <FormControlLabel
                sx={{ alignItems: "flex-start" }}
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
                label={t("resqCheckbox")}
              />
              <FormControl
                size="small"
                sx={{
                  ml: 4,
                  mb: 2,
                  display: uploadToResq ? undefined : "none"
                }}
              >
                <InputLabel id="resq-provider-select-label">
                  { t("providerLabel") }
                </InputLabel>
                <Select
                  labelId="resq-provider-select-label"
                  id="resq-provider-select"
                  value={String(selectedProvider)}
                  label={t("providerLabel")}
                  onChange={e => setSelectedProvider(
                    e.target.value === "null" ? null : Number(e.target.value)
                  )}
                  disabled={!uploadToResq}
                >
                  <MenuItem value="null">
                    <em>{ t("providerEmpty") }</em>
                  </MenuItem>
                  {Object.keys(providers).map(pi => (
                    <MenuItem key={pi} value={String(pi)}>{providers[pi]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                label={ t("ufalCheckbox") }
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
              { t("uploadingSpinner") }
            </Alert>
          )}

          {/* UPLOADING FAILED */}
          {(uploadError !== null) && (
            <Alert severity="error" sx={{mb: 2}}>
              { t("uploadingFailedMessage") }<br/>
              <pre style={{whiteSpace: "pre-wrap"}}>{ uploadError }</pre>
            </Alert>
          )}

          {/* UPLOADING SUCCEEDED */}
          {uploadDone && (
            <Alert severity="success" sx={{mb: 2}}>
              { t("uploadingDoneMessage") }<br />
              <br />
              { t("caseIdInRegistry") }<br />
              {caseId ? (
                <>
                  <strong>{caseId}</strong><br/>
                  <br/>
                  <a
                    style={{ color: "inherit" }}
                    href={config.resqRecordUrl(recordId)}
                    target="_blank"
                  >{ config.resqRecordUrl(recordId) }</a>
                </>
              ) : (
                <em>{ t("uploadingDoneNoCaseId") }</em>
              )}
            </Alert>
          )}

        </DialogContent>
      )}
      <DialogActions>
        <Button
          variant="text"
          onClick={() => setIsOpen(false)}
        >
          { (!user || uploadError || uploadDone) ? t("close") : t("cancel") }
        </Button>
        {(user && !uploadError && !uploadDone) && (
          <Button
            autoFocus
            disabled={isLoading || isUploading || uploadDone}
            variant="contained"
            onClick={() => performUploading()}
            endIcon={<LocalShippingIcon/>}
          >
            { t("upload") }
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}