<?php // process the location data from the mobile app

error_reporting(0); // disable error reporting for production
//ini_set('display_errors', 1); // display errors

// some sort of security token (embedded inside the app)
if (!isset($_POST["sec"]) || $_POST["sec"] !== "SECURITY_TOKEN_HERE") {
	header("HTTP/1.0 404 Not Found"); // request for post.php did not come from the app
	file_put_contents("404-access.log", $_SERVER['REMOTE_ADDR']."\n", FILE_APPEND | LOCK_EX); // log attempt 
	exit; 
}
/*
else {
	//header('Access-Control-Allow-Origin: *');
	//header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
}
*/


$data = "";

// process POST data
foreach($_POST as $key => $value){
	if($key !== "sec"){
		if($key === "sp"){
			$data .= (int) $value . ","; // sp = speed - convert null into 0 or round a float
		}
		elseif( is_numeric($value) ){ // is_numeric will fail if injection is attempted
			$data .= "$value,";
		}
		else { die('Not correct type.'); }
	}	
}

$data = rtrim($data, ','); // remove last comma

file_put_contents("data.txt", $data); // this data is used by google maps

echo time(); // php timestamp - this goes back to the phone to tell the user that things are being updated.
