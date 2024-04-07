# Joint customization and library development

This folder contains the setup to develop the RES-Q+ customization jointly together with the DocMarker library, being both compiled and watched by a single parcel process.

All the following commands assume you are inside this folder, NOT the repository root one level up.


## Setting up

1. Enter this folder in terminal
2. Run `make all`
3. Run `npm serve` to run Parcel
4. Treat the `doc-marker` and `resq-customization` as the usual development repositories - open one code editor in each, commit changes in each. The running Parcel instance will compile these changes automatically.

> **Note:** Never use this setup for package updates and other specific changes.

> **Note:** Re-run this setup procedure if either of the package.json files change.


## How it works?

The process sets up a new `package.json` in this folder, where the `doc-marker` clone is treated as a workspace (thus Parcel watches it for changes) and the `resq-customization` is treated as the main source code (because it didn't work when it's treated as another workspace).

I think the setup misuses the Parcel plugin development setup in order to function: https://parceljs.org/features/plugins/#yarn-and-npm-workspaces

> **Note:** Using `npm link` did not work as Parcel does not watch symlinked dependencies. Other approaches failed for various reasons related to dependency resolution and Parcel code watching issues.

What happens when you run `make all`:

1. `make clean` removes all the temporary files, **including the cloned repositories**, and resets this folder into the state it would be in if it was freshly cloned.
2. `make clone` Clones the `doc-marker` and `resq-customization` repositories.
3. `make package-json` sets up the modified `package.json` file via the `setupPackage.js` script.
    1. Takes the `resq-customization/package.json` file as a starting point.
    2. Corrects the `source` path that Parcel uses to start.
    3. Removes the `doc-marker` dependency.
    4. Adds the `doc-marker` folder as a workspace.
4. `make install` installs dependencies.
    1. `npm install`
    2. Removes compiled Doc Marker code (i.e. `doc-marker/dist`). This code is created automatically during the package installation (as part of its `npm run prepare`), but we need to remove it, otherwise Parcel uses these compiled files instead of the source files (thus watching for changes fails).
