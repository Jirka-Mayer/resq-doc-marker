# Backend server deployment

> This documentation file assumes you are located in the `backend` folder of the repository.

> To see how you can deploy an update, see the [*Deploying an update*](#deploying-an-update) section below.

The backend server for file uploading is running at `https://quest.ms.mff.cuni.cz/resq-doc-marker/backend`, which is the machine `resq-plus` behind the `quest` proxy. Everything is installed and run as the user `mayer`.

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

The configuration is customized by a `.env` file inside the working directory `/home/mayer/backend-server/backend`. To reload this file the service must be restarted.

The server is launched via the `service.sh` script, make sure it is executable and try running it to test everything starts up. The service runs on port `8000`; make sure the port is not occupied while testing.

```bash
chmod +x service.sh  # this is tracked by git in fact, clone should suffice
./service.sh
```


## Systemctl service

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


## Deploying an update

Commit all changes to git so that when we pull, we get the latest version to deploy. Follow these commands:

```bash
# connect to the resq-plus machine
ssh mayer@quest.ms.mff.cuni.cz
ssh resq-plus

# enter the backend folder
cd /home/mayer/backend-server

# stop the service
sudo systemctl stop resq-plus-backend.service
# check that https://quest.ms.mff.cuni.cz/resq-doc-marker/backend/ is down

# clone the latest code
git pull

# update any configuration
nano backend/.env

# check the service by starting is manually
cd backend
./service.sh
cd ..

# start the service back up again
sudo systemctl start resq-plus-backend.service
# check that https://quest.ms.mff.cuni.cz/resq-doc-marker/backend/ is up
```
