# locate-me

Locate an Android device with Google maps.

**WARNING** There are probably a lot of security holes in this app. I need to read up on the Content-Security-Policy and figure out how to allow just what is needed to get data from the various external sources. Use this code at your own risk. 

## About

This is a Cordova app with a maps client. You'll need some place to host the maps client and its required files. 

The cordova app polls the device's GPS, or other geo-location services and uploads the data to your webserver. This data is rendered to google maps. 

As always, you may have to pay for mobile data transfer. This app will continue to run in the background so data transfer costs will continue to occur. 
