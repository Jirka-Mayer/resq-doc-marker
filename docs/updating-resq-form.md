# Updating RES-Q form version

First, you need to get the name and the data and form schema files. This can be done via the RES-Q API. The `GET /forms` endpoint lists all form types, of which we care only about the `RES-Q Stroke Form`, but we want a specific version of this form, which can be queried via `GET /form-versions`. This returns all forms in all version, but we can filter down only to the stroke form.

> I queried this information via https://editor.swagger.io/ with API specification yaml file from RES-Q developers and with the development bearer access token copied form development DocMarker when doing a file upload (via browser developer tools).

In my case the `form-version` I care about is this one:

```json
{
    "id": 9,
    "form": 1,
    "version": "RES-Q 3.1.7 standard form",
    "dataSchema": { ... },
    "uiSchema": { ... },
    "createdAt": "2024-05-02T11:18:11.111982Z",
    "createdByUser": "ba3c4160-abfc-467b-811f-848add852299"
}
```

From this I can see that on the development server, the abstract form ID is 1 (which I don't really care about), but the specific `form-version` ID is 9, which is what I should use when I want to upload this form data to RES-Q.

I copy the `dataSchema` and `uiSchema` from here and use the name from here as well. The name should be consistent between the RES-Q dev and prod servers, but it is not strictly necessary as the ID is more important and that is stored as well.

So in this repository in `/forms` folder I create a `RES-Q 3.1.7 standard form` folder and then create a `schema.json` and `uischema.json` there and copy the schema contents.


## Adding translations

Form localizations can be obtained via RES-Q API at `GET /form-localizations`. I can specify `version` parameter (meaning `form-version` ID, that is `9`) to get the form I'm interested in.

This is one of the results:

```json
{
    "dictionary": { ... },
    "name": "RES-Q 3.1.7 EN",
    "language": 2,
    "formVersion": 9,
    "id": 20,
    "createdAt": "2024-05-02T11:21:13.080852Z",
    "createdByUser": "ba3c4160-abfc-467b-811f-848add852299",
    "isLatest": true
}
```

The `dictionary` field contains the translations. Copy that to a `dictionary_en.json` file in the form directory.


## Registering the form

In `/forms/index.js` I need to add a record for the form, similar to the other records there.


## Setting the form as default

In `/src/index.js` there are DocMarker options specified and the field `defaultFormId` defines that.


## Modifying the form schema loading

The form UI schema can be postprocessed using the `UiSchemaMapperBase` in case its rendering has issues in DocMarker. See the form version `1.3.7` to learn more about its usage. It may be necessary even if just to collapse the layout from 4 columns down to only 2 and to correct some multiselect rendering issues.

When checking that the form renders correctly, make sure to check out all possible stroke types, since those condition large sections of the form. Enabling the debug mode of DocMarker (Ctrl + F12) will show some of the hidden controls as semi-transparent so that you can verify the rendering more easily. Note that the controls that are hidden transitively (by having a hidden layout or group) or some custom controls that ignore the debug mode may still be invisible.
