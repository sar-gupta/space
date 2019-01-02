# S P A C E

![cover](resources/space-readme.jpg)

Chat application for developers
---

If you want to chat up, join the room `test` on the app.

There is a known bug in firebase; it doesn't have permission to read certain users' display name. I've stored their email ID instead of the name.


## Website
spacedev.herokuapp.com
---
Although this is a desktop application made with electron, it runs on the web as well.


## About
A real-time chat application made using `React`, `Redux`, `Electron` and `Firebase`.
---
Right now, it's just a barebones chat app, but developer-friendly features will be arriving soon.


## Running locally for direct usage
You can download the executables from the following links:

[Linux](https://drive.google.com/open?id=18_2hv8h_9CdxnqeN-TTjSUTct_3QQCmy)

[Windows](https://drive.google.com/open?id=1B_2jTv1Ih6HKrBmihSNORK_JqrVKyhyH)

[Mac](https://drive.google.com/open?id=18_2hv8h_9CdxnqeN-TTjSUTct_3QQCmy)


(I haven't been able to test the app on mac yet, so if there's any problem,feel free to open an issue).


## Contributing
**This is a good first project to contribute to if you've recently learned react and redux, or want to learn the same.**
---
If you're well-versed with these frameworks, you can help by improving the current app, or adding new features!
---

If you want to get into the code and start contributing, you need to do a little bit of setup for your machine:

### Setting up firebase

First, download/clone this repository and `cd` into it:
```
git clone git@github.com:sar-gupta/space.git
cd space
```

Create a new project in firebase by heading over to console.firebase.google.com 

Head over to the authentication tab, click on `Sign in method` and select Github. Click on `enable`. Copy the authorization calback URL that's provided to you right there.

After this, you need to register the app with github. Head over to https://github.com/settings/applications/new and fill in details. App homepage can be literally any valid URL, it doesn't matter as long as the URL is valid. Here, in the authorization callback URL, paste the URL that you copied from firebase to your clipboard. Click on `Register Application`.

You'll be redirected to a page that has a client ID and a client secret. Copy those and paste them where they are required in firebase, and click on `Save`. Github authentication should now be enabled.


Now, localhost should be an authorized domain by default, but if it isn't there, just click on `Add domain`and enter `localhost`.

Then, go to the `database` tab, click on `real-time database` and select `Start in test mode`. Go to `Rules`, they should look like this: 
```
{
  "rules": {
    ".read": "auth!=null",
    ".write": "auth!=null"
  }
}
```
Now go the `Project Overview` and click on `Add firebase to web app`.
You'll be promted with a screen that has a `config` object like this:

![config oject](/resources/config-object.jpg)

Now, back in your code editor, create a new file `.env.development` in the root of the project, and enter the following contents in this file: 
```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
```
Enter the values from the firebase config object here (**without the double quotes**), and save the file.

### Running locally for development
To run the electron app, first build locally to create the `public/dist/` folder. If you just want to run it on the web, then this isn't required since webpack dev server can serve from memory without physically creating the `public/dist/` folder.
```
yarn run build:dev
```
or
```
yarn run build:prod
```

To start the desktop application, run the following commands from the root directory of the project:
```
yarn
yarn run electron
```
To create various executables or packaged files for the desktop application, run any of the following depending on your target platform:
```
yarn run package-linux
yarn run package-win
yarn run package-mac
```
It will put the output in the `release-builds/` directory inside the root of the project.

NOTE: If you're building for windows in a non-windows environment, you need to have `wine` installed.


If you want to run just the web version, run the following commands: 
```
yarn
yarn run dev-server
```
The app will be live on localhost:4172

And you're good to go!
---

You can view the database contents in your firebase project's database tab.


If you want to contribute to this project (solve a bug or implement a new feature), feel free to create an issue and/or submit a pull request.
---

### NOTE
I recently learned React, Redux, Electron and Firebase, and this is my first project using these technologies/frameworks. So, you'll find some instances where performance of the application can be improved. Feel free to open an issue/submit pull requests if you find any such instance :)

## Usage
After logging in with github, you can create new rooms or join existing ones. I've only allowed unique room names for a better user experience.

NOTE: Number of unread messages don't go to 0 when you click on the chat name (that's intentional). It goes to 0 if you send a message to that room, **or** if you click on the **number** of unread messages.

## Author
[Sarthak Gupta](https://www.github.com/sar-gupta)

## Article
I also wrote an article about this project. Feel free to read it to get a general idea. It'll also be helpful if you want to start contributing to this app!

It has been published on [Hackernoon](https://hackernoon.com/).

You can read it here:

https://hackernoon.com/https-medium-com-sargupta-how-i-built-a-real-time-chat-app-using-react-and-firebase-dc8690bf41f7

