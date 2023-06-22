<?php

$dbName ="mysql:host=localhost;dbname=studentdb";
$user ="root";
$password ="Raji@123";

try{
    $conn = new PDO($dbName,$user,$password);
   }catch(Exception $e){
  echo $e.getMessage();
   }
?>