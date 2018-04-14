# S P A C E

![cover](resources/space-readme.jpg)

Chat application for developers. [ Not yet fit for production use ]

## Website
spacedev.herokuapp.com
---


## About
A real-time chat application made using `React`, `Redux`,  and `Firebase`.
---
Right now, it's just a barebones chat app, but developer-friendly features will be arriving soon. Final version of this app will be a desktop app using electron.js (with status tray notifications), but right now, it's a web app.


## Contributing
**This is a good first project to contribute to if you've recently learned react and redux, or want to learn the same.**
---
If you're well-versed with these frameworks, you can help by improving the current app, or adding new features!

The following steps need to be followed to run this app locally:


### Setting up firebase


First, download/clone this repository and `cd` into it:
```
git clone git@github.com:sar-gupta/space.git
cd space
```

Create a new project in firebase. 

Head over to the authentication tab, click on `Sign in method` and select Github. Click on `enable`. Now, localhost should be an authorized domain by default, but if it isn't there, just click on `Add domain`and enter `localhost`.

Then, go to the `database` tab, click on `real-time database` and go to `Rules`.

Set its value to this: 
```
{
  "rules": {
    ".read": true,
    ".write": true
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
Enter the values from the firebase config object here, and save the file.

### Running the app locally

Just run the following commands from the root directory of the project: 
```
yarn
yarn run dev-server
```

And you're good to go!
---


If you want to contribute to this project, feel free to create an issue and/or submit a pull request.
---

### NOTE
I recently learned React and Firebase, so this is my first project using these technologies/frameworks. So, you'll find a lot of instances where performance of the application can be improved. One such example is saving the database paths of all `rooms` and `people` in the application state instead of fetching them again and again.  Feel free to submit pull requests if you find any such issue (including the one mentioned above) :)

## Usage
After logging in with github, you can create new rooms or join existing ones. I've only allowed unique room names for a better user experience.

Number of unread messages don't go to 0 when you click on the chat name (that's intentional). It goes to 0 if you send a message to that room, **or** if you click on the **number** of unread messages.



