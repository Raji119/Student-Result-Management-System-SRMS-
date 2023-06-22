<?php
  
  include 'config.php';

  //InsertStudents
  function insertStudents($classID,$stuName,$regNo,$gender,$fName,$mName){
    $result = retrieveStudents("*","s.classID='$classID' AND s.regNo='$regNo'");
    if(empty($result)){     
    global $conn;
    $insStudents = "INSERT INTO students(classID,stuName,regNo,gender,fName,mName)
                     VALUES(:class,:stuName,:regNo,:gender,:fName,:mName)";
    $stmt        = $conn->prepare($insStudents);
    $stmt->execute(['class'=>$classID,'stuName'=>$stuName,'regNo'=>$regNo,'gender'=>$gender,
                     'fName'=>$fName,'mName'=>$mName]);
    return true;
    }else{
      return false;
    }
    
}


 //Retrieve Students Details
  function retrieveStudents($row,$where=null,$from="students s,class c"){

    global $conn;
   
   if($where!=null){
      $retrieve="SELECT $row
         FROM $from
         WHERE  $where";
  }else{
        $retrieve="SELECT $row
         FROM $from";
  }
    $sql = $conn->query($retrieve);      
    $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $result;
    
  } 


  //Delete Student
  function deleteStudent($id){
       
    global $conn;
    $del  = "DELETE FROM students WHERE stuID =:id";
    $stmt  = $conn->prepare($del);
  
   if($stmt->execute(['id'=>$id])){
     return true;
   }
     return false;
   }
  

 //Update Student
 function updateStudent($classID,$stuName,$regNo,$gender,$fName,$mName,$stuID){

  global $conn;
  $result = retrieveStudents("*","s.classID='$classID' AND s.regNo='$regNo' AND stuID!=$stuID");
  if(empty($result)){
     $upd  = "UPDATE students SET classID=:class ,stuName=:stuName,regNo=:regNo,
                 gender=:gender,fName=:fName,mName=:mName WHERE stuID=:stuID";
     $stmt = $conn->prepare($upd);
     $stmt->execute(['class'=>$classID,'stuName'=>$stuName,'regNo'=>$regNo,'gender'=>$gender,
     'fName'=>$fName,'mName'=>$mName,'stuID'=>$stuID]);
     return true;
  }
  else{
      return false;
  }
}



  switch($_POST['hiddenValue']){
        
    //INSERT Students
    case 1:    
      $classID  = $_POST['classID'];
      $stuName  = $_POST['stuName'];
      $regNo    = $_POST['regNo'];
      $gender   = $_POST['gender'];
      $fName    = $_POST['fName'];
      $mName    = $_POST['mName'];
      // $dob      = date('y-m-d',strtotime($_POST['dob']));
      $result   = insertStudents($classID,$stuName,$regNo,$gender,$fName,$mName);
      echo json_encode($result);
      break;
      
      //RETRIEVE Students  
      case 2:
        $result = retrieveStudents("*","c.classID=s.classID");       
        echo json_encode($result);
        break;
        
        //Update Students
        case 3 :
          $classID  = $_POST['classID'];
          $stuName  = $_POST['stuName'];
          $regNo    = $_POST['regNo'];
          $stuID    = $_POST['stuID'];
          $gender   = $_POST['gender'];
          $fName    = $_POST['fName'];
          $mName    = $_POST['mName'];
          // $dob      = date('y-m-d',strtotime($_POST['dob']));
          $result   = updateStudent($classID,$stuName,$regNo,$gender,$fName,$mName,$stuID);
          echo json_encode($result);
          break;
        
          //Delete Students
        case 4:
          $result = deleteStudent($_POST['id']);
          echo json_encode($result);
          break;
          //Retrieve Students For Marks
        case 5 :
          $classID = $_POST['id'];
          $result = retrieveStudents("s.stuID,s.stuName,s.regNo","c.classID=s.classID AND  c.classID=$classID");       
          echo json_encode($result);
          break;
          break;
          
  }
?>