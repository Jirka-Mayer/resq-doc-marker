# Installing nginx

This file describes how I set up the nginx server on the `resq-plus` machine behind the `quest` proxy.

Install the nginx service (the firewall was not an issue in my case):
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04

This URL should display "Welcome to Nginx!":
https://quest.ms.mff.cuni.cz/resq-doc-marker/

The configuration file is at `/etc/nginx/sites-available/default`.

To check configuration syntax errors, run `sudo nginx -t`.

To restart nginx, run `sudo systemctl restart nginx`.


## Modifications to the default configuration file

We want the `resq-doc-marker` URL path prefix to stay in the path, so that any services running behind the nginx know about it and can generate correct relative URLs for redirects and links. So we add this section to the configuration file:

```bash
# the quest proxy strips away the /resq-doc-marker/ prefix, but we want it
# if it's missing, return it back in
rewrite ^/(?!resq-doc-marker)(.*)$ /resq-doc-marker/$1 last;
```

Which means we will move the webserver root folder to `/var/www` and all static files will then be served from a folder `resq-doc-marker` inside the `www` folder. But in fact, we will make this folder a symlink to the compiled frontend folder `/home/mayer/frontend-doc-marker`. We change this in the configuration file:

```bash
# this means we have to root one folder up, so that the mashcima prefix
# matches our true root folder
root /var/www;
```

To make the symlink, execute:

```bash
sudo ln -s /home/mayer/frontend-doc-marker /var/www/resq-doc-marker
```

We need to forward the backend server traffic accordingly, so we add this rule before the static files-serving rule:

```bash
# forward OmniOMR API traffic to the API service
location /resq-doc-marker/backend/ {
        proxy_pass http://127.0.0.1:8000/;
}
```
