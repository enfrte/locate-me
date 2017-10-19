
function init() { 
    //document.addEventListener("DOMContentLoaded", watchPosition, false); // to test on web browser
    document.addEventListener("deviceready", watchPosition, false); // deviceready is a cordova event
    checkPeriodically = setInterval(checkTime, 10000);
}

/* ---------------------------------- Local Variables ---------------------------------- */
var checkPeriodically; // period to check the time and send the data to the server 
var watchPositionOutput = document.getElementById('watchPositionOutput'); 
var ajaxVars; // HTTP POST data string
//var today;

/* ---------------------------------- Local Functions ---------------------------------- */
function watchPosition() {

    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options); // Returns: String. Returns a watch id that references the watch position interval. The watch id should be used with navigator.geolocation.clearWatch to stop watching for changes in position.

    var options = {
        maximumAge: 5000, 
        timeout: 9000,
        enableHighAccuracy: true,
    }
    
    function onSuccess(position) {
        // there may not be an connection to the server. Output an error and run the final code regardless
        try {
            ajaxVars = 
                "lt=" +     position.coords.latitude + 
                "&lg=" +    position.coords.longitude +
                "&ac=" +    position.coords.accuracy +
                "&sp=" +    position.coords.speed +
                "&ts=" +    position.timestamp +
                "&sec=SECURITY_TOKEN_HERE"; // position.timestamp is not a typo ;)
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

function ajax_post(ajaxVars){
    if (typeof(ajaxVars) === 'undefined') {
        return false; 
    }

    var req = new XMLHttpRequest(); // Create XMLHttpRequest object

    var url = "http://example.com/locate-me/post.php";
    //var url = "http://localhost/locate-me/post.php";

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
    req.send(ajaxVars); // execute the request
    document.getElementById("status").innerHTML = "processing...";
    //console.log('Ajax!');
}

/* 
    GUI AND DATASTORAGE ---
*/

// use localstorage if localstorage value exists, else create from scratch
var timeDb;
// if not set, localStorage.getItem('timeDb')) will return 'object', if it is set it will return 'string'
if( typeof(localStorage.getItem('timeDb')) === 'object' ) {
    timeDb = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
}
else {
    timeDb = JSON.parse( localStorage.getItem('timeDb') );
}

var timeDbClone = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };

// schedule to post the position data to a php script during certain times on certain days
function checkTime() {
    var numberToDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    // create a time
    var d = new Date();
    var today = d.getDay();
    var hms = d.getHours()+":"+d.getMinutes(); // +":"+d.getSeconds();
    // iterate through the array for today and return true if current time is in range of condition test
    if( timeDb[numberToDay[today]].some(function(t){ return hms >= t.start && hms <= t.end; }) ) {
        ajax_post(ajaxVars); // returned true
        //console.log(true);
    } 
    else {
        document.getElementById("status").innerHTML = "Data not scheduled to be posted to the server yet"; // returned false
        //console.log(false);
    }
}

// dynamically add time input elements to the GUI
var addTime = function(start, end, parentId){
    //console.log(start);
    var startTime = document.createElement('input');
    startTime.placeholder = "Start Time";
    startTime.type = "time";
    startTime.required = true;
    startTime.value = typeof(start) === 'string' ? start : '';

    var endTime = document.createElement('input');
    endTime.placeholder = "End Time";
    endTime.type = "time";
    endTime.required = true;
    endTime.value = typeof(start) === 'string' ? end : '';

    var removeTime = document.createElement('button');
    removeTime.textContent = "-";
    removeTime.className = "roundButton redButton";
    removeTime.addEventListener('click', function(){ 
        parentTag.removeChild(timeContainer);
    });

    var timeContainer = document.createElement('div');
    timeContainer.className = "timeContainer";

    // define parentTag based on whether or not addTime was called from the event click or called from localStorage
    var parentTag;
    if(typeof(parentId) === 'string') {
        //console.log(parentId);
        parentTag = document.getElementById(parentId);
    }
    else {
        parentTag = this.parentElement;
    }
    parentTag.appendChild(timeContainer);
    timeContainer.appendChild(startTime);
    timeContainer.appendChild(endTime);
    timeContainer.appendChild(removeTime);
}

// populate days with existing times using localStorage
for(var day in timeDb) {
    if(timeDb[day].length > 0) {
        for(var i in timeDb[day]){
            var time = timeDb[day][i];
            //console.log(time.start + " - " + time.end + " on " + day);
            addTime(time.start, time.end, day);
        }    
    }
}
    
// Create event listeners for buttons
var dayButton = document.getElementsByClassName("roundButton");
for(var i = 0; i < dayButton.length; i++) {
    dayButton[i].addEventListener( 'click', addTime );
}

var popUp = function() {
	var p = document.getElementById('popup');
  p.style.visibility = 'visible';
	p.style.opacity = 1;
  p.style.transition = "opacity 0.25s linear";
	setTimeout(function(){
  	  p.style.visibility = 'hidden';
      p.style.opacity = 0;
  		p.style.transition = "visibility 0s 2s, opacity 1s linear";
  }, 1500);
}

// Save times to dataset
var setTimes = function(e){
    e.preventDefault();
    timeDb = JSON.parse(JSON.stringify(timeDbClone)); // reset timeDb to its original dataset (empty days)
    var inputs = document.getElementsByClassName('timeContainer'); 

    // push inputs to dataset (but also check required property has been fullfilled)
    for(var i = 0; i < inputs.length; i++) {
        var day = inputs[i].parentNode.id;
        //console.log(inputs[i].childNodes[0].value.length);
        var times = {
            start: inputs[i].childNodes[0].value,
            end: inputs[i].childNodes[1].value
        };
        // check inputs have all been filled in
        if( times.start.length === 0 || times.end.length === 0 ){
            alert('Not saved.\nComplete the visible time field(s), or remove them.');
            //console.log(">>> " + times.start.length + " - " + times.end.length);
            return false; // abort 
        }
        // fields look good, push to the dataset
        timeDb[day].push(times);
    }
    // store dataset in localStorage
    localStorage.setItem( 'timeDb', JSON.stringify(timeDb) ); // update the local storage
    //console.log("Local storage: " + localStorage.getItem('timeDb'));
    //console.log("In app value: " + timeDb.wed);
    popUp();
};

var saveButton = document.getElementById("saveTimes").addEventListener( 'click', setTimes );

// Clear local storage (For development purposes).
var clearLocalStorage = function() {
    localStorage.clear();
    console.log('Cleared storage');
}
var clearLocalStorageButton = document.getElementById("clearLocalStorage").addEventListener( 'click', clearLocalStorage );

init();
