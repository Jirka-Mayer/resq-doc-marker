# Frontend deployment

The frontend is a static website, so there is no need to build it on the server. It can be built locally and then just copied to that server.

> This process can be run from inside `joint-development` folder to deploy an in-development version with both the customization and the doc marker partially modified.


## SSH setup

The `resq-plus` machine is behind the `quest` proxy, which means we need to set up a config that lets us use `scp` with one direct hostname, which is in fact two distinct SSH jumps.

To the file `~/.ssh/config` add these lines:

```
Host resq-plus.quest.ms.mff.cuni.cz
  HostName resq-plus
  User mayer
  ProxyJump mayer@quest.ms.mff.cuni.cz
```


## Build locally

Make sure you have `git pull` up to date, `npm ci` installed and versions correctly set up.

Build static assets:

```bash
npm run build
```


## Deploy to production

SSH to the production server and clean up the deployment folder:

```bash
ssh resq-plus.quest.ms.mff.cuni.cz
cd /home/mayer/frontend-doc-marker
rm -rf *
```

Copy the dist folder into the webserver folder:

```bash
rsync -av ./dist/ resq-plus.quest.ms.mff.cuni.cz:/home/mayer/frontend-doc-marker/
```


## Deploy to ufallab

SSH to ufallab and clean up the deployment folder:

```bash
ssh mayer@geri.ms.mff.cuni.cz
cd /home/mayer/public_html/development-resq-doc-marker
rm -rf *
```

Copy the dist folder into the webserver folder:

```bash
rsync -av ./dist/ mayer@geri.ms.mff.cuni.cz:/home/mayer/public_html/development-resq-doc-marker
```
