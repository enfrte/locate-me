
function init() { 
    //document.addEventListener("DOMContentLoaded", watchPosition, false); // to test on web browser
    document.addEventListener("deviceready", watchPosition, false); // deviceready is a cordova event
    //console.log("Started");
}

/* ---------------------------------- Local Variables ---------------------------------- */
var watchPositionOutput = document.getElementById('watchPositionOutput'); 

/* ---------------------------------- Local Functions ---------------------------------- */
function watchPosition() {

    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options); // Returns: String. Returns a watch id that references the watch position interval. The watch id should be used with navigator.geolocation.clearWatch to stop watching for changes in position.

    var options = {
        maximumAge: 10000, 
        timeout: 20000,
        enableHighAccuracy: true,
    }
    
    function onSuccess(position) {
        // there may not be an connection to the server. Output an error and run the final code regardless
        try {
            // schedule to post the details to a php script during certain times on certain days
            var today;
            // create time 
            function getTime(){
                var d = new Date();
                today = d.getDay();
                var hms = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                checkTime(hms);
            };
            // post to server during certain times
            function checkTime(hms){
                // for example a day (day 0 == Sun) between 06:00 abd 23:45
                if( (today === 1 || today === 2 || today === 3 || today === 4) && hms > "09:00:00" && hms < "15:40:00") {
                    ajax_post(position.coords.latitude, position.coords.longitude, position.coords.accuracy, position.coords.speed, position.timestamp);
                }
                else if( today === 5 && hms > "13:00:00" && hms < "13:40:00") {
                    ajax_post(position.coords.latitude, position.coords.longitude, position.coords.accuracy, position.coords.speed, position.timestamp);
                }
                else {
                    document.getElementById("status").innerHTML = "Data not scheduled to be posted to the server yet";
                }
            }
            getTime(); // setInterval not required as onSuccess runs every few seconds
            //var start = setInterval(getTime, 1000); 
        }
        catch(err) {
            document.getElementById("status").innerHTML = err.message;
        }
        finally {
            var dt = new Date(position.timestamp);
            date_time = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
            watchPositionOutput.innerHTML = 
                'Latitude: '  + position.coords.latitude  + '<br>' +
                'Longitude: ' + position.coords.longitude + '<br>' +
                'Accuracy: '  + position.coords.accuracy  + '<br>' +
                'Speed: '     + position.coords.speed     + '<br>' +
                'Timestamp: ' + date_time                 + '<br>';
        }
    }
        function onError(error) {
        watchPositionOutput.innerHTML = 'code: ' + error.code + '<br>' +'message: ' + error.message + '<br>';
    }

}

function ajax_post(latitude, longitude, accuracy, speed, timestamp){
    var req = new XMLHttpRequest(); // Create XMLHttpRequest object

    var url = "http://example.com/locate-me/post.php";

    var lt = latitude; var lg = longitude; var ac = accuracy; var sp = speed; var ts = timestamp;
    var vars = "lt="+latitude+"&lg="+longitude+"&ac="+accuracy+"&sp="+speed+"&ts="+timestamp+"&sec=INSERT_A_SECURITY_TOKEN_HERE";
    req.open("POST", url, true);

    // Set content type header info for sending url encoded variables in the request
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Access the onreadystatechange event for the XMLHttpRequest object
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 200) {
            var return_data = req.responseText; // return whatever php echos
            var date_time = new Date(return_data * 1000); // php is currently returning the time (timestamp)
            document.getElementById("status").innerHTML = "Server time: " + date_time;
            //document.getElementById("status").innerHTML = "Ok";
        }
    }

    // Send data to PHP, and wait for response to update the status div
    req.send(vars); // execute the request
    document.getElementById("status").innerHTML = "processing...";
}

init();
