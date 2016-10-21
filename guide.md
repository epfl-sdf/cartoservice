# CartoService project installation guide & description
## 1. Installation of necessary tools
Install **git** version control system
> <https://git-scm.com/downloads>

## 2. Pull the project
In order to pull the project from Git, you must have access to the repo on <https://git.epfl.ch> first.
Once it's the case, you can simply clone the project locally by using the command:
```bash
git clone https://USERNAME@git.epfl.ch/repo/carto.git
cd carto
```

Where `USERNAME` has to be replaced with your GASPAR username. The clone command will ask for authentification, use your usual GASPAR credentials again.

## 3. Run the installation script
The installation script will take care of installing [NodeJS](https://nodejs.org) and [MySQL Server](http://mysql.com/), as well as setting everything up: 

```bash
./scripts/install_server.sh
```

Specifically, it'll install NodeJS dependencies required to run the app in a folder named `node_modules`.

Once finished, the script will set up MySQL root password to `no_pass`, create the database and SQL tables to finally load the data into the database,
all of this through an SQL file named `db_carto.sql`.

When the installation process ends, the app will be run in the NodeJS server and available at:
> <http://localhost:3000>

## 4. Additional NPM commands

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
## 5. Project structure
### Tree representation

```
carto
|   .gitignore
|   .eslintrc.json
│   guide.md
|   index.js
|   package.json
|   server.js
|   server.bundle.js
|   webpack.config.js
|   webpack.server.config.js
│
└───api
│   │   api.js
│   │   routes.js
│   
└───modules
│   │   App.jsx
│   │   Carto.jsx
│   │   ...  
|
└───public
│   │   bundle.js
│   │   index.css
|
└───scripts
│   │   db_carto.sql
│   │   install_server.sh
|
└───node_modules // NodeJS project dependencies
│   │   ...
│

```
### Details:

Name | Type | Description
--- | --- | ---
**.gitignore** | File | Ignored files during git pushes
**.eslintrc.json**| File | configuration file for [ESLint](http://eslint.org/) (javascript linter)
**guide.md** | File | This same guide you're actually reading
**index.js** | File | Entry point for the app
**package.json** | File | Contains all the meta informations about the app (packages used, commands...)
**server.js** | File | The web server listening to the port 3000 to serve API and app requests, doing SSR
**server.bundle.js** | File | Contains all the server JS from the app, bundled together. This file will only appear after the first run.
**webpack.config.js** | File | Webpack configuration file to build the client-side
**webpack.server.config.js** | File | Webpack configuration file to build the server-side
**api** | Folder | Everything regarding server API to MySQL
*api*/**api.js** | File | Contains the API requests to the database
*api*/**routes.js** | File | Contains GET/POST routes for the API requests
**modules** | Folder | Contains React components for the frontend part
*modules*/**\*.jsx** | File | Each of these files will be a React componenent which can be imported within each other
**public** | Folder | Public files accessible from `http://domain.com/file` for stylesheets and SSR (server-side rendering)
*public*/**bundle.js** | File | Contains all the client JS from the app, bundled together. This file will only appear after the first run.
*public*/**index.js** | File | Somes CSS rules to style D3.js elements
**scripts** | Folder | Scripts for the project installation
*scripts*/**db_carto.sql** | File | Database SQL dump, used in the installation script to create the database, create tables and load data accordingly
*scripts*/**install_server.sh** | File | Installation script, see section [#3. Run the installation script](#3-run-the-installation-script)
**node_modules** | Folder | Contains all the project packages/dependencies used
*node_modules*/**\***  | Folder | Each folder is a NodeJS package/dependency

## 6. Quick intro to React 

[React](https://facebook.github.io/react/) is a javascript library created by Facebook to build user interfaces. 
This library is all about building reusable components. In fact, with React the only thing you do is build components. Since they're so encapsulated, components make code reuse, testing, and separation of concerns easy.


Its main features are the following:
* **One-way data flow**

  Properties, a set of immutable values, are passed to a component's renderer as properties in its HTML tag. A component cannot directly modify any properties passed to it, but can be passed callback functions that do modify values. This mechanism's promise is expressed as "properties flow down; actions flow up".
* **JSX**

  React components are typically written in JSX, a JavaScript extension syntax allowing quoting of HTML and using HTML tag syntax to render subcomponents.
* **Virtual DOM**

  React creates an in-memory data structure cache, computes the resulting differences, and then updates the browser's displayed DOM efficiently.[10] This allows the programmer to write code as if the entire page is rendered on each change while the React libraries only render subcomponents that actually change.

## 7. Components structure

As seen in section [#5. Project structure](#5-project-structure), React components are locatd in the `./modules/` folder.
Even if on the surface it seems like all the components are at the same level, internally they are organized as a tree (like in the DOM).

Indeed as detailed in the previous section, React being component-based, they are encapsulated within each other as it would be on an usual HTML document. i.e. The `<p></p>` component being encapsulated into a `<div></div>` componenent.

It ensues from this structure that a tree view is an adequate representation of components:

```
routes
|
App
└───TopPanel
|   |   Typeahead
|
└───LeftPanel
|   |   Customs
|   |   ProcessServices
|
└───RightPanel
|   └───Carto
|       |   CartoMenu

```

### Details:

Name | Description
--- | ---
**routes** | Contains the routes of the client-side app components (i.e. which component to render for each URL)
**App** | Main component of the app, it's the page layout
*App*/**TopPanel**| Panel on the top where we display the processes search bar
*App/TopPanel*/**Typeahead**| Search bar with autocompletion, comes from a NodeJS package, where data are pulled from the API
*App*/**LeftPanel**| Panel on the left of the app, where we display the custom maps and details for the current process
*App/LeftPanel*/**Customs**| List of custom maps, retrieved from the database through API query
*App/LeftPanel*/**ProcessServices**| Detailed services used for the implementation of the current process reviewed
*App*/**RightPanel**| Panel on the right of the app, where we display the interactive map (svg) made with [D3.js](https://d3js.org/).
*App/RightPanel*/**Carto**| Component where we render the interactive map, this is where the logic is implemented. For more details about the how this library works, check the next section [#7. D3.js library](#7-d3js-library).
*App/RightPanel/Carto*/**CartoMenu**| Small componenent to have a toolbar on the top, currently only have one action which is to save to custom map but should be easily expanded to more functions.

## 7. D3.js library

*Coming soon*