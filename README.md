DocMarker for RES-Q+
====================

Try it out at: https://ufallab.ms.mff.cuni.cz/~mayer/resq-doc-marker/

This a RES-Q+ customization of the annotation tool [DocMarker](https://github.com/Jirka-Mayer/doc-marker).


## Building

After cloning, install from `package-lock.json`:

```
npm ci
```

You can develop by running:

```
npm run start
```

And build the single-page web app into the `dist` folder by:

```
npm run build
```


## Developing together with DocMarker

Clone the [DocMarker repository](https://github.com/Jirka-Mayer/doc-marker) and then tell NPM to symlink the `doc-marker` dependency in your `package.json` with the DocMarker clone:

```
npm link ../../path-to-clone-of/doc-marker
```

Also, `npm install` must be run inside the DocMarker clone to resolve its dependencies. They will not be installed in this project's `node_modules`, unfortunately.

This way you can work on both projects simultaneously and immediately test changes made to the DocMarker library. The only problem is that Parcel does not detect file changes in the DocMarker, because it's behind a symlink. You need to restart parcel to see the changes.
