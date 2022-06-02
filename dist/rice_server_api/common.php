<?php 
//crossorigin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

//session
session_start();

//DB connection variables
define('DB_HOST','localhost');
define('DB_NAME','rice_db');
define('DB_USER','root');
define('DB_PASSWORD','');

//create connection Global
$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.'', DB_USER, DB_PASSWORD);


//logout
if(isset($_GET['logout'])){
	session_destroy();
	header('Location:index.php');
}

//get user
function getLoginUser(){
	if(isset($_SESSION['user'])){
		return $_SESSION['user'];
	}else{
		return false;
	}

}




