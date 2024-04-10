import React from "react"
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  FormControlLabel,
  MenuItem
} from "@mui/material";
import { useAtom } from "jotai";
import { atom } from "jotai/vanilla";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { openUploadDialog, authorizationCode } from "./pageLoadingIntercept";
import { ResqApiConnection } from "./ResqApiConnection";

export const isOpenAtom = atom(openUploadDialog)

export function UploadDialog() {
  const { t } = useTranslation("uploadDialog")

  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const [isLoading, setIsLoading] = useState(true)
  const [resqUserId, setResqUserId] = useState(null)

  async function handleDialogOpenning() {
    setIsLoading(true);

    const connection = await ResqApiConnection.connect(authorizationCode);

    setIsLoading(false);
  }

  useEffect(() => {
    if (isOpen) {
      handleDialogOpenning()
    }
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}} // clicking the background does not close the dialog
    >
      <DialogTitle>{ t("title") }</DialogTitle>
      <DialogContent dividers>

        TODO: loader/spinner if isLoading

        TODO: authentication has failed, see error: ...

        TODO: NOTE: This report has already been uploaded,
        are you sure you want to upload it again? You can upload
        it again if you made changes to the report and you want to
        propagate these changes to the RES-Q registry and Charles University.

        TODO: you are logged-in as John Doe, Hospital XYZ
        By clicking the upload button you can upload the completed
        report to the RES-Q registry and the annotations to the
        Charles University.
          Record: XYZ.XYZ
          [cancel] / [upload]
        
        [x] Upload report to the RES-Q registry.
        [x] Upload annotations to Charles University.

        TODO: uploading (the upload button itself is spinning)

        TODO: uploading failed ... log the exception
          Try uploading the report again.
          [cancel (labeled as "close")] [upload (unvisible)]

        TODO: Thank you for uploading the report. If you make any
        changes to the report, you can upload it again and it will be
        updated.
          [cancel (labeled as "close")] [upload (unvisible)]

        ---

        Lorem ipsum...<br/>
        Authorization code: { authorizationCode }

      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => setIsOpen(false)}
        >
          {t("cancel")}
        </Button>
        <Button
          autoFocus
          variant="contained"
          onClick={() => {
            // Do something!
            setIsOpen(false)
          }}
        >
          Do something!
        </Button>
      </DialogActions>
    </Dialog>
  )
}