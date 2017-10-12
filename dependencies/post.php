<?php

error_reporting(0); // disable error reporting for production

// some sort of security token (embedded inside the app)
if (!isset($_POST["sec"]) || $_POST["sec"] !== "INSERT_A_SECURITY_TOKEN_HERE") {
	header("HTTP/1.0 404 Not Found"); // request for post.php did not come from the app
	exit; 
}
/* you might need this if doing some localhost testing 
else {
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
}
*/

$data = "";

// process POST data
foreach($_POST as $key => $value){
	if($key !== "sec"){
		$value = strip_tags($value);
		if($key === "sp"){
			$data .= intval($value).","; // sp = speed - convert null into 0 or round a float
		}
		else {
			$data .= "$value,";
		}
	}	
}

$data = rtrim($data, ','); // remove last comma

file_put_contents("data.txt", $data); 

echo time(); // php timestamp - this goes back to the phone to tell the user that things are being updated.

