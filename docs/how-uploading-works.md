# How the file uploading works

From the user's perspective:

1. They annotate a file to completion (or open an annotated one)
2. They click on the "Upload to RES-Q" button
3. They fill out the upload dialog
4. They submit the dialog

All of the uploading happens through the ÚFAL uploading server, because this server acts as a confidential client to the RES-Q registry. Therefore, DocMarker talks to the uploading server, the uploading server talks to RES-Q. The only exception when DocMarker sort of talks to RES-Q is only during authentication when the "Upload to RES-Q" button is clicked.


## Authentication flow

The initial authentication uses the OAuth 2.0 Authoriztaion Code Grant flow:
https://datatracker.ietf.org/doc/html/rfc6749#section-4.1

1. The user clicks the "Upload to RES-Q" button
2. DocMarker redirects the user to the Keycloak auth server of the RES-Q registry, stating that we want to:
    - perform a login as a `doc-marker` client
    - we want to use the `code` flow
    - we want to be redirected back to DocMarker
    - we want the current file UUID to be sent back in the state field
    - check out the `redirectToResq.ts` file for details
3. User logs-in at the Keycloak server (or is already logged in)
4. Keycloak server redirects the user back to DocMarker with the *authorization code* and other metadata present in the URL
    - check out the `pageLoadingIntercept.js` file for details on the incomming data
    - now the *authorization code* needs to be exchanged for the access token to RES-Q registry according to [OAuth 2.0, section 4.1.3](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3) by requesting the [token endpoint of the Keycloak server](https://www.keycloak.org/docs/24.0.2/securing_apps/#endpoints), but during this exchange, the client needs to authenticate itself (using the client password), which means it needs to be done by the uploading server (only the uploading server talks to the RES-Q API)
5. DocMarker sends the *authorization code* to the ÚFAL uploading server
6. The ÚFAL uploading server finalizes the OAuth authentication flow by accessing the token endpoint and remembering the RES-Q access token. This token is kept in the server and DocMarker is issued another new access token (called DocMarker token), that DocMarker later uses to finalize the upload. The ÚFAL uploading fetches all the necessary metadata about the user and hospitals and sends them back to DocMarker.
7. The user fills out the upload dialog. The user submits it.
8. DocMarker finalizes the upload by sending the dialog metadata and the file to the uploading server and the uploading server stores the file locally and communicates with RES-Q to optionally upload or update the file in RES-Q.
9. The uploading dialog displays any errors or closes if everything is ok.
