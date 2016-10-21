# Cartoservice installation guide
## 1. Installation of necessary tools
Install **git** version control system
> <https://git-scm.com/downloads>

## 1. Pull the project
In order to pull the project from Git, you must have access to the repo on <https://git.epfl.ch> first.
Once it's the case, you can simply clone the project locally by using the command:
```bash
git clone https://USERNAME@git.epfl.ch/repo/carto.git
cd carto
```

Where `USERNAME` has to be replaced with your GASPAR username. The clone command will ask for authentification, use your usual GASPAR credentials again.

## 2. Run the installation script
The installation script will take care of installing [NodeJS](https://nodejs.org) and [MySQL Server](http://mysql.com/), as well as setting everything up: 

```bash
./scripts/install_server.sh
```

Specifically, it'll install NodeJS dependencies required to run the app in a folder named `node_modules`.

Once finished, the script will set up MySQL root password to `no_pass`, create the database and SQL tables to finally load the data into the database,
all of this through an SQL file named `db_carto.sql`.

When the installation process ends, the app will be run in the NodeJS server and available at:
> <http://localhost:3000>

## 3. Additional NPM commands

Most common command, run the app in production mode (calls `start:prod` under the hood):
```bash
npm start
```

Build the client and the server, then run the app in production mode:
```bash
npm run start:prod
```

Build only the client side of the code:
```bash
npm run build:client
```

Build only the server side of the code:
```bash
npm run build:server
```

Build both the client & server side of the code:
```bash
npm run build
```
