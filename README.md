# How to run this JWT-Node Server in local

1. Make sure you have git and node(>14) installed in you system
2. Clone this repo [JWT-Register-Login-Node-Server](https://github.com/javedinfinite/JWT-Register-Login-Node-Server).

3. Run this command using terminal in the root directory of this project.
 < `npm i` > . This will install all node modules required to run the project.

4. ***Create DB in postgres***
* The free postgres sql server you can create from [https://www.elephantsql.com/](https://www.elephantsql.com/)
 * Register and login to https://www.elephantsql.com/ and create a new instance.
 * CLick on newly created instance and you see db info under details section.
 * From this details section Keep a note of the db details like host password etc
 * Create two tables by using the create commands given in the sql.txt file
 * Now your DB is ready to be used... :)

5. Create a .env file inn the root folder of the project and paste content from .env.example file present in the root directory. Add values of the DB variables from the note you collected postgres DB details. 
 * After that, add two secrets for access and refresh token to generate. Give any string value for moment say "test1", "test2". example:
 ```TOKEN_SECRET=test1 REFRESH_TOKEN_SECRET=test2```

4. Make sure the port 4000 is free and node other app is running on it. If other app is running on it, change the port from 4000 to other free port say 5000 from index.js file inside root folder of this project. 

4. Run this command using terminal in the root directory of this project.
 < `npm start` > . This will start your node server.

5. **Optional step**: Although nodemon will automatically install with all packages and it should run without any extra effort by you. But if you change any code and app is not restarting by itself then you can check if nodemon (dev-dependency) is running properly or not, check the error, google it, you will get the answer to fix that. This is to make sure you don't need to restart the server everytime you change any code, nodemon will auto restart your server.

