# artist-similarity-calculator 
https://artistsimilaritycalc.netlify.app/

## Project Details
Simple app for calculating similarity between 2 music artists using genres and similar artists from the Spotify API. Simply enter 2 artists in the 2 text boxes and hit calculate and it will give you a similarity score back!

## How to run locally
1. 'npm install' - You will need npm's node_modules to run this
2. You will need to follow [Spotify's instructions](https://developer.spotify.com/documentation/web-api) for setting up a new app to use the Spotify API
3. Create a .env file in the root directory and create 2 variables - one called 'REACT_APP_CLIENT_ID' and one called 'REACT_APP_CLIENT_SECRET', they should correspond to the client ID and client secret you got from your newly created app in the Spotify API respectively
4. Run 'npm run start' in the terminal/cmd
5. Use as normal!
