# Kwyzo

Kwyzo is a collaborative quiz maker created with Angular 8.3.20 and Node 12.13.1.

## Getting Started :

### Prerequisites

Make sure Angular, Node.js and MongoDB are install on your machine to run this application.

### Installing

* #### Get the repository

First, clone this repository. You can do it directly with git and the command below :

```
git clone https://github.com/fmo-dev/kwyzo.git
```

* #### API

Once the repository cloned, go inside the api folder with a terminal and run 

```
npm install
```
It will install all the dependencies needed.


To run the api, write in the terminal 

```
npm run start
```
The server runs on port **8080**


The host for mongodb is *mongodb://127.0.0.1:27017* by default but can be change in the file *src/config.json*


* #### Front-End

Go inside the front-end folder with the terminal and run 

```
npm install
```

Then 

```
ng serve
```


### Features

This application only run in local so you'll need to create at least two account to see all the features. Here are some example of what you can do :

* Create a quiz : A quiz can have as many questions and answers as needed. You can later edit and delete it. A quiz can be public (everyone can see it) or private (only friends can see it)

* Make friends : You can ask any user to be friend with them. Juste write their name and click on it. It will immediatly send them an invite they can accept or refuse. 

* Play quizzes : You can play the quizzes that are public or created by a friend. Your score will be saved and visible by the author of the quiz.


## Authors

**Florent Mouton** - [fmo-dev](https://github.com/fmo-dev)
