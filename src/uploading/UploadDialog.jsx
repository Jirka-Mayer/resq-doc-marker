import React from "react"
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, FormControlLabel, MenuItem } from "@mui/material";
import { useAtom } from "jotai";
import { atom } from "jotai/vanilla";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { openUploadDialog, authorizationCode } from "./pageLoadingIntercept";

export const isOpenAtom = atom(openUploadDialog)

export function UploadDialog() {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)

  const { t } = useTranslation("uploadDialog")

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}} // clicking the background does not close the dialog
    >
      <DialogTitle>{ t("title") }</DialogTitle>
      <DialogContent dividers>

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