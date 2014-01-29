# Moba

An HTML5 MOBA.

## Table Of Contents

* [About](#about)
* [Getting Started](#getting-started)
* [Grunt Tasks](#grunt-tasks)
  - [Run the Server](#run-the-server)
  - [Update the Dependancies](#update-the-dependancies)
  - [Build the Project](#build-the-project)
  - [Generate Documentation](#generate-documentation)
* About
  - [Engine](#engine)
  - [Release History](#release-history)
  - [License](#license)


<sup>[↑ Back to TOC](#table-of-contents)</sup>

## About

This project's goal is to build an HTML5 Massive Online Battle Arena. For this project, this team decided This team has researched many existing HTML5 game engines, and found them all lacking in some area or another. The specific goals of this game and game engine are listed below.

1. Use a Component, Entity, System Game Engine Design Pattern. For more info, see [here][ecs-article].
2. Utilize Web Workers to do the game simulation, allowing for greater frame rate and a better user experience.
3. Use Peer-to-Peer networking for syncronization. 

See documentation [here][doc].


NOTE: Below we refer to sim and main when running the development tools. sim means that the operation will be run on the Simulation code (inside a webworker), and main means that the operation will be run on the code that runs in the normal window environment.


## Getting Started

Install from the package.json
```shell
npm install
```

Get Grunt
```shell
npm install -g yo grunt-cli
```

Get Google Closure Library
```shell
git clone https://code.google.com/p/closure-library/ app/closure-library
```

Get local dependancies
```shell
bower install
```

<sup>[↑ Back to TOC](#table-of-contents)</sup>

## Grunt Tasks

Note: I have only run this on my Mac. I think it should work no problem on linux, but I haven't tested it on Windows.

### Run the server

```
grunt server
```

The server will start and open up the page in your web browser. The page that is loaded is the un-compiled developer version. To use the compiled version, see the "Build the Project" section. The server is a live reload, so any changes you make to a file will be reflected in the page on a reload. 

### Update the Dependancies

```
grunt deps
```

Calculates the dependancies for the project. This will run "grunt deps:main" and "grunt deps:sim" for you.

#### Update the Simulation Dependacies

```
grunt deps:sim
```

Calculates all of the dependancies for the Simulation and puts them in app/js/deps-sim.js.

#### Update the Main Dependancies

```
grunt deps:main
```

Calculates all of the dependancies for the main window and puts them in app/js/deps.js.

### Build the Project

```
grunt build
```

Runs "grunt build:sim" and "grunt build:main" (this also generates the documentation). To run the compiled code:

1. Run the build command
2. Run the server 
3. Go to the /compile.html page to run the compiled code.

#### Build Simulation

```
grunt build:sim
```

Compiles all of the source files for the simultation into an optimized, minimized, single script located at app/jsc/sim.js

#### Build Main

```
grunt build:main
```

Compiles all of the source files for the main window into an optimized, minimized, single script located at app/jsc/game.js

### Generate Documentation

```
grunt jsdoc
```

Generates the documentation for the project. The documentation is taken from annotations in the source code. The generated documentation is in the /doc folder.

For more info on the commands or the dev environment, see [Closure Generator][closure-gen].

## Engine
The engine is a Entity Component System. For more information, see the article by Adam Martin [here][ecs-article].
## Release History
- **v0.0.1**, *Mid Dec 2013*
  - Big Bang

## License
Copyright (c) 2013 ME PRETTY
Licensed under the [MIT](LICENSE-MIT).

<sup>[↑ Back to TOC](#table-of-contents)</sup>

[closure-library]: https://developers.google.com/closure/library/ "Google Closure Library"
[closure-tools]: https://developers.google.com/closure/ "Google Closure Tools"
[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/wiki/Getting-started
[package.json]: https://npmjs.org/doc/json.html
[Gruntfile]: https://github.com/gruntjs/grunt/wiki/Sample-Gruntfile "Grunt's Gruntfile.js"
[yeoman]: http://yeoman.io/ "yeoman Modern Workflows for Modern Webapps"
[bower]:http://twitter.github.com/bower/ "THE BROWSER PACKAGE MANAGER html, css, and javascript"
[closure-gen]:https://github.com/closureplease/generator-closure
[ecs-article]:http://t-machine.org/index.php/2007/09/03/entity-systems-are-the-future-of-mmog-development-part-1/
[doc]:http://jadmz.github.io/CrunchJS
