# S P A C E

![cover](resources/space-readme.jpg)

If something isn't working properly, just logout and login again. Since this is in active development as of now, I keep on clearing the database to incorporate changes to the schema.
---

Some users' names are not shown, instead Anonymous is shown. This is a known bug in firebase; it doesn't have permission to read certain users' display name.
UPDATE: Seems like a lot of people are getting their name as Anonymous. I'll change it to show mail ID in cases when firebase doesn't have permission to read the display name.

Chat application for developers. ( Not yet fit for production use )

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

Create a new project in firebase by heading over to console.firebase.google.com 

Head over to the authentication tab, click on `Sign in method` and select Github. Click on `enable`. Copy the authorization calback URL that's provided to you right there.

After this, you need to register the app with github. Head over to https://github.com/settings/applications/new and fill in details. App homepage can be literally any valid URL, it doesn't matter as long as the URL is valid. Here, in the authorization callback URL, paste the URL that you copied from firebase to your clipboard. Click on `Register Application`.

You'll be redirected to a page that has a client ID and a client secret. Copy those and paste them where they are required in firebase, and click on `Save`. Github authentication should now be enabled.


Now, localhost should be an authorized domain by default, but if it isn't there, just click on `Add domain`and enter `localhost`.

Then, go to the `database` tab, click on `real-time database` and select `Start in test mode`. Go to `Rules`, they should look like this: 
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
Enter the values from the firebase config object here (**without the double quotes**), and save the file.

### Running the app locally

Just run the following commands from the root directory of the project: 
```
yarn
yarn run dev-server
```

And you're good to go!
---

You can view the database contents in your firebase project's database tab.


If you want to contribute to this project, feel free to create an issue and/or submit a pull request.
---

### NOTE
I recently learned React and Firebase, so this is my first project using these technologies/frameworks. So, you'll find a lot of instances where performance of the application can be improved. Feel free to submit pull requests if you find any such issue :)

## Usage
After logging in with github, you can create new rooms or join existing ones. I've only allowed unique room names for a better user experience.

Number of unread messages don't go to 0 when you click on the chat name (that's intentional). It goes to 0 if you send a message to that room, **or** if you click on the **number** of unread messages.



