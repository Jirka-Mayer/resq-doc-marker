Backend server
==============

This folder contains the implementation of the backend server used for uploading
annotations to the Charles University. This server is not used to serve the
Doc Marker application, that is a frontend-only app; it only handles annotated
file uploading, validation, and storage.

> **Note:** All code in this folder expects *current working directory* to be this folder.


## After cloning

Create virtual environment:

```
python3 -m venv .venv
.venv/bin/python3 -m pip install -r requirements.txt
```

Start the service locally for development:

```
.venv/bin/python3 -m uvicorn app.main:app --reload
```

And open http://localhost:8000/docs for the OpenAPI docs.


## Deployment

The backend server for file uploading is running at `https://quest.ms.mff.cuni.cz/resq-plus/backend`, which is the machine `resq-plus` behind the `quest` proxy. Everything is installed and run as the user `mayer`.

This repository is cloned into `/home/mayer/backend-server` and the working directory for the server process must be `/home/mayer/backend-server/backend`.

The server stores uploaded files in the `storage` folder. This should be made a symlink to upload the files into the lnet filesystem, to the proper project folder.

```bash
ln -s /home/mayer/data/raw-uploads storage

# mayer@resq-plus:~/backend-server/backend$ ls -l
# total 18
# drwxr-xr-x 3 mayer resq-plus  10 Apr 22 10:34 app
# -rw-r--r-- 1 mayer resq-plus 695 Apr 22 10:34 README.md
# -rw-r--r-- 1 mayer resq-plus 142 Apr 22 10:34 requirements.txt
# lrwxrwxrwx 1 mayer resq-plus  28 Apr 22 10:35 storage -> /home/mayer/data/raw-uploads
```

The virtual environment and packages need to be installed.

```
python3 -m venv .venv
.venv/bin/pip3 install -r requirements.txt
```

The server is launched via the `service.sh` script, make sure it is executable and try running it to test everything starts up. The service runs on port `8000`; make sure the port is not occupied while testing.

```bash
chmod +x service.sh  # this is tracked by git in fact, clone should suffice
./service.sh
```


### Systemctl service

The backend server runs as a systemctl service `resq-plus-backend.service`:

```
systemctl status resq-plus-backend.service
```

You can restart it:

```
sudo systemctl restart resq-plus-backend.service
```

The service is defined in the file `resq-plus-backend.service`, but it needs to be copied to `/etc/systemd/system/resq-plus-backend.service` to take effect:

```bash
# create the file
sudo touch /etc/systemd/system/resq-plus-backend.service
sudo chmod 777 /etc/systemd/system/resq-plus-backend.service

# update the file contents
sudo cat resq-plus-backend.service > /etc/systemd/system/resq-plus-backend.service
```

When you apply changes to this file, you need to reload the service manager:

```
sudo systemctl daemon-reload
```
