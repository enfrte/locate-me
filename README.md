# locate-me

Locate an Android device with Google maps.

**WARNING** There are probably a lot of security holes in this app. I need to read up on the Content-Security-Policy and figure out how to allow just what is needed to get data from the various external sources. Use this code at your own risk. 

## About

This is a Cordova app with a maps client. You'll need some place to host the maps client and its required files. 

The cordova app polls the device's GPS, or other geo-location services and uploads the data to your webserver. This data is rendered to google maps. The app has been hard coded to run on different days and at different times. This has been set to my specific needs, but can change it to suit yours. In the future, I may provide a form to take care of this. 

## Requirements 

As always, you will have to pay for mobile data transfer. This app will continue to run in the background so data transfer costs will continue to occur. 

The app has been tested on Android 4.4.4, but should run on anything above Android 4.4.0. It has also been tested on Firefox-OS 1.1, but for that platform, you will need to create a `manifest.webapp` and add geolocation under the manifest's permissions. 
