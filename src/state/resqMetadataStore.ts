/*
 * Jotai atoms that store DocMarker file metadata related to
 * RES-Q exporting, when the file is deserialized. This data can be displayed
 * by the application, but is not really modified. It is just preserved so
 * that it can be serialized again when the file is being saved.
 * 
 * Analogous to DocMarker's formStore or reportStore.
 */

import { atom, getDefaultStore } from "jotai";
import { ResqUser } from "../resq-model/ResqUser";

// lets us manipulate atoms from the non-jotai/react code
const jotaiStore = getDefaultStore();

/**
 * When was the file uploaded for the last time
 */
export const uploadedAtAtom = atom<Date | null>(null);

/**
 * Holds the RES-Q user that has uploaded this file
 */
export const uploadedByUserAtom = atom<ResqUser | null>(null);

/**
 * Holds the RES-Q case ID that was created when the file
 * was uploaded to RES-Q for the first time. Use this case
 * ID for any subsequent uploads.
 * (this can be null even if uploadedAt is not, since the user
 * may have only uploaded to the Charles University and not RES-Q)
 */
export const resqCaseIdAtom = atom<string | null>(null);

/**
 * Called during the creation of an empty AppFile
 */
export function createEmptyFileJson(json: object) {
  json["uploadedAt"] = null;
  json["uploadedByUser"] = null;
  json["resqCaseId"] = null;
}

/**
 * Populates the store, given a DocMarker AppFile JSON data
 */
export function deserializeFromFileJson(json: object) {
  let uploadedAt = json["uploadedAt"] || null;
  if (uploadedAt) {
    uploadedAt = new Date(uploadedAt);
  }
  jotaiStore.set(uploadedAtAtom, uploadedAt);
  jotaiStore.set(uploadedByUserAtom, json["uploadedByUser"] || null);
  jotaiStore.set(resqCaseIdAtom, json["resqCaseId"] || null);
}

/**
 * Writes the store state into a given DocMarker AppFile JSON data object
 */
export function serializeToFileJson(json: object) {
  json["uploadedAt"] = jotaiStore.get(uploadedAtAtom)?.toISOString();
  json["uploadedByUser"] = jotaiStore.get(uploadedByUserAtom);
  json["resqCaseId"] = jotaiStore.get(resqCaseIdAtom);
}
