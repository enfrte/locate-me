# locate-me

Locate an Android device in real time with Google maps.

**WARNING** There are probably a lot of security holes in this app. I need to read up on the Content-Security-Policy and figure out how to allow just what is needed to get data from the various external sources. Use this code at your own risk. 

## About

This is a Cordova app with a maps client. You'll need some place to host the maps client and its required files. The Cordova app polls the device's GPS or other geo-location services, and uploads the data to your webserver. This data (the device's location) is viewable and updated on the google maps web client (just a regular web page) hosted on your server. If you want this data to be private, secure the maps client. 

There is a GUI to add when you want the app to send data to the server. The settings are saved to the apps local storage. 

**Screenshots**

Phone UI

![Screenshot of GUI](https://i.imgur.com/QnHPeft.png)

Client UI

![Client Map UI](https://i.imgur.com/eoCEpUo.png)

## Requirements 

As always, you will have to pay for mobile data transfer. This app will continue to run in the background so data transfer costs will continue to occur. 

The app has been tested on Android 4.4.4, but should run on anything above Android 4.4.0. 
