<?php
  include 'config.php';

  $sql = $conn->query("SELECT * FROM classes");
       
 $result = $sql->fetchAll(PDO::FETCH_ASSOC) or die("Failed");
 
 echo json_encode($result);
