<?php

session_start();

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "jjiaugm";

/*
$_POST["dni"] = "123";
$_POST["puntos"] = 123;
$_POST["token"] = 123;
$_SESSION["token"] = 123;
*/

if (isset($_SESSION["user_key"]) && isset($_SESSION["token"])) {
	if (isset($_POST["dni"]) && isset($_POST["token"]) && isset($_POST["puntos"])){
		if ($_POST["token"] == $_SESSION["token"]) {


			// Create connection
			$conn = new mysqli($host, $user, $pass, $dbname);
			// Check connection
			if ($conn->connect_error) {
				echo '{result: false}';
			    die("Connection failed: " . $conn->connect_error);
			} 

			$sql = "INSERT INTO caebasura (dni, puntos)
			VALUES ('".$_POST['dni']."', ".$_POST['puntos'].")";

			if ($conn->query($sql) === TRUE) {
				echo '{result: true}';
			} else {
			    echo '{result: false}';
			}

			$conn->close();

		} else {
			echo '{result: false}';
		}
	} else {
		echo '{result: false}';
	}

} else {
	echo '{result: false}';
}



?>