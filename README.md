# Moba

An HTML5 MOBA

## Table Of Contents

* [Getting Started](#getting-started)
* [Usage](#usage)
  - [Run the Server](#run-the-server)
  - [Update the Dependancies](#update-the-dependancies)
  - [Build the Project](#build-the-project)
  - [Generate Documentation](#generate-documentation)
* About
  - [Release History](#release-history)
  - [License](#license)


<sup>[↑ Back to TOC](#table-of-contents)</sup>


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

## Usage

### Run the server

```
grunt server
```

The server will start and open up the page in your web browser. The page that is loaded is the un-compiled developer version. To use the compiled version, see the "Build the Project" section. The server is a live reload, so any changes you make to a file will be reflected in the page on a reload. 

### Update the Dependancies

```
grunt deps
```

Calculates the dependancies for the project. This allows the scripts to load in the correct order. Whenever you add a new file to the file system, you need to calculate the dependancies again using this command.

### Build the Project

```
grunt build
```

Compiles all of the source files into an optimized, minimized, single script (this also generates the documentation). To run the compiled code:
    1. Run the build command
    2. Run the server 
    3. Go to the /compile.html page to run the compiled code.

### Generate Documentation

```
grunt jsdoc
```

Generates the documentation for the project.


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
