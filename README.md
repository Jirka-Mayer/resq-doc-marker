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


## Joint development with Doc Marker

Normally, you can develop this DocMarker customization like any other node project, treating the `doc-marker` package as an external dependency (as a library). But very often you may need to develop the two together jointly - making changes in both and immediately observing the results.

For this setup, check out the [`joint-development` folder](./joint-development).
