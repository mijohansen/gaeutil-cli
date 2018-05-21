# node-gae-util
Collection of commandline helpers for development on Google App Engine 
written in Node.

Some of the tools are general useful.


#### Init functions

```bash
gaeutil init-php beste-adm keymaker
gaeutil init-slim beste-adm keymaker
gaeutil init-python beste-adm keymaker
```

Will create app.yaml if doesnt exist
Will copy defaults from package json.


#### Secrets commands
These commands will encrypt and upload a dot secret file to the
projects so that it can be manually edited.

* `gaeutil init-secret gs://target-bucket/test.json` checks if file
can be created and uploaded and creates the initial file.
* `gaeutil download-secret 	gs://target-bucket/test.json` downloads a
particular file.
* `gaeutil upload-secret 	gs://target-bucket/test.json`
* `gaeutil download-secrets ` get all secrets from gaeutil.json
* `gaeutil upload-secrets   ` upload all changed secrets from gaeutil.json



This command will download secrets defined in gaeutil.json and store
them to /secrets/{bucket}/{filename}
```bash
$ gaeutil download-secrets
```

This command will upload secrets stored in /secrets/{bucket}/{filename}
```bash
$ gaeutil upload-secrets
```


#### Cloud SQL Commands

#### Git Commands
```bash
gaeutil git-sync-ignore
gaeutil git-sync-authors
gaeutil git-
```


#### Jetbrains Commands
```bash
gaeutil jetbrains-sync-runmanager
gaeutil jetbrains
```


### gaedev.json and gaeutil.json
```json
{
  "project": "beste-adm",
  "dot_configs": [
    "gs://beste-no-configs/global.json"
  ]
}
```


### Alternative


