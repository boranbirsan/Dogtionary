# Dogtionary

## About

Dogtionary is a portmanteau of the words Dog and Dictionary. This is a system that allows the upload
of an image of a dog. Using this image the integrated AI will classify the breed and sub-breed of the dog,
which will then be used to provide you with user-submitted images of the same breed.

## Documentation

### NodeJS:

First of all, NodeJS will need to be downloaded on the local machine to be able to start this project locally. 
NodeJS will also come with `npm` which is also required in this context.

### Clone:

In order to work system first clone the repository into a local directory.

in the command prompt:
`git clone <repo-url> <directory-name>`

### Install Dependencies:

Once the git repo is cloned, change the directory into the new local directory and use npm install to download all the required dependencies.  
`//In Windows:`  
`cd <directory-name>`  
`npm install`

### Start in localhost:

Once the dependencies have been installed you should be able to run it.  
while in the command prompt in the project directory:

`npm start`

The project should open a tab or window with the project, but if it does not you can access it at

`http://localhost:3000`

## Tools and Frameworks

### React:
built using ReactJS. React is a NodeJS framework that is significantly helpful for one-page
applications. React dynamically renders the contents of the page, rather than changing or reloading
the page url itself, react can simply edit the contents on every state change. This allows for one page
to react quickly to any action that the user takes with minimal wait and no reloading.

#### Material-Ui

Material-UI is a User Interface framework specifically designed to work with React to compound the
simplicity that React already provides. Material-UI comes with prebuilt and very aesthetic elements ready to be used,
as well as more responsive and dynamic elements that simplify the construction of the UI. Finally
Material-Ui also allows for css to be written within the javascript files, allowing for easier development.

### Dog CEO / Dog.API

The publicly available API of a glossary of Dog images categorized by dog breeds and sub-breeds.

### @tensorflow-models/mobilenet

A Tensorflow pre-trained machine learning agent used to classify an uploaded image of a dog.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
