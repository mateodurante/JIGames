<?php

session_start();


if(isset($_POST['user'])){
	if($_POST['user'] == "eba"){
		$_SESSION['user_key'] = "eba";
		$_SESSION["token"] = md5(uniqid(rand(), true));
	}
}

if (!isset($_SESSION["user_key"]) || !isset($_SESSION["token"])) {

	?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>JII | AUGM</title>
</head>
<body>
	<form action="index.php" method="post">
		User: <input type="text" name="user"><br>
		<input type="submit">
	</form>
</body>
</html>

<?php 

} else {

?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>JII | AUGM</title>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script type="text/javascript" src="src/game/config.js"></script>
    <script type="text/javascript" src="src/engine/core.js"></script>
    <script type="text/javascript" src="src/game/main.js"></script>
</head>
<body>
	<input type="hidden" id="token" name="token" value="<?php echo $_SESSION['token']; ?>">
</body>
</html>

<?php

} 

?>