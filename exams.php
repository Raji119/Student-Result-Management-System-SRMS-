<?php
  
  include 'config.php';
  
  //Insert Exams
  function insertExam($examName){         
    global $conn;
    $result = retrieveExams("*","examName='$examName'");
    if(empty($result)){ 
    $insExam  = "INSERT INTO exam(examName) VALUES(:examName)";
    $stmt        = $conn->prepare($insExam);
    $stmt->execute(['examName'=>$examName]); 
    return true;  
    }else{
      return false;
    }
  }

  //Retrieve Exams
  function retrieveExams($row,$where=null){
    global $conn;
    if($where!=null){
       $retrieve="SELECT $row FROM exam WHERE $where";
      }else{
      $retrieve="SELECT $row FROM exam";
    }
    $sql = $conn->query($retrieve);      
    $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $result;
    
  } 
  //DeleteExamName
  function deleteExam($id){
       
    global $conn;
    $del  = "DELETE FROM exam WHERE examID =:id";
    $stmt  = $conn->prepare($del);
 
   if($stmt->execute(['id'=>$id])){
     return true;
   }else{
     return false;
   }
 }

 function updateExam($id,$examName){

     global $conn;
     $result =retrieveExams("*","examName='$examName'");
     if(empty($result)){
        $upd  = "UPDATE exam SET examName=:examName WHERE examID=:id";
        $stmt = $conn->prepare($upd);
        $stmt->execute(['examName'=>$examName,'id'=>$id]);
        return true;
     }
     else{
         return false;
     }
 }


  switch($_POST['hiddenValue']){

    case 1:    
      $examName = $_POST['examName']; 
      $result   = insertExam($examName);
      echo json_encode($result);
      break;

    case 2:
           $result = retrieveExams("*");       
           echo json_encode($result);
           break;

      case 3:
           $id      = $_POST['examID'];
           $examName   = $_POST['examName'];
           $result  = updateExam($id,$examName);
           echo json_encode($result);
           break;

          //DELETE CLASS
      case 4:
             $result = deleteExam($_POST['id']);
             echo json_encode($result);
            break;
  }
?>