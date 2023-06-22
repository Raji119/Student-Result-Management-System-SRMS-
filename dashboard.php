<?php
   
   include 'config.php';

function retrieveCount(){
    global $conn;
    $sql = $conn->query("SELECT count(*) AS cls FROM class");  
    $cls = $sql->fetch(PDO::FETCH_ASSOC);
    $sql = $conn->query("SELECT count(*) AS sub FROM subjects"); 
    $sub =  $sql->fetch(PDO::FETCH_ASSOC);
    $sql = $conn->query("SELECT count(*) AS stu FROM students");  
    $stu =  $sql->fetch(PDO::FETCH_ASSOC);
    $sql = $conn->query("SELECT count(*) AS exm FROM exam_info");  
    $exm =  $sql->fetch(PDO::FETCH_ASSOC);
    $result[0] = $cls;
    $result[1] = $sub;
    $result[2] = $stu;
    $result[3] = $exm;
     return $result;
  }

   if(isset($_POST['hiddenValue'])){

    switch($_POST['hiddenValue']){
        
    case 2:    $result = retrieveCount();       
               echo json_encode($result);
               break;
    }
   }