<?php
  include 'config.php';

  //InsertClassDetails
  function insertClassSub($classID,$subID){
         
    global $conn;
    $result = retrieveClassSub("*","cs.classID='$classID' AND cs.subID='$subID'");
     if(empty($result)){
        $insClasses  = "INSERT INTO class_sub(classID,subID) VALUES(:class,:sub)";
        $stmt        = $conn->prepare($insClasses);
        $stmt->execute(['class'=>$classID,'sub'=>$subID]);
        return true;
     }else{
        return false;
     }
    
}

  function retrieveClassSub($row,$where=null){

    global $conn;
    if($where!=null){
    $retreive = "SELECT $row 
                  FROM class c,subjects s,class_sub cs
                  WHERE $where";
    }else{
    $retrieve = "SELECT $row FROM class c,subjects s,class_sub cs";
    }
    $sql = $conn->query($retreive);      
    $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $result;
    
}

//Update Class
function updateClassSub($id,$classID,$subID){

  global $conn;
  $result =retrieveClassSub("*","cs.classID='$classID' AND cs.subID='$subID'");
  if(empty($result)){
     $upd  = "UPDATE class_sub SET classID=:classID ,subID=:subID WHERE classSubID=:csid";
     $stmt = $conn->prepare($upd);
     $stmt->execute(['classID'=>$classID,'subID'=>$subID,'csid'=>$id]);
     return true;
  }
  else{
      return false;
  }
}

//Delete ClassSubInfo
function deleteClassSub($id){
       
  global $conn;
  $del  = "DELETE FROM class_sub WHERE classSubID =:id";
  $stmt  = $conn->prepare($del);

 if($stmt->execute(['id'=>$id])){
   return true;
 }
   return false;
 }
  
//RETRIEVE SUBJECTS BY CLASSID
  function retrieveClassSubByClassID($classID){

    global $conn;
    $retreive = "SELECT s.subID,s.subCode, s.subName 
                  FROM class c,subjects s,class_sub cs
                  WHERE cs.classID=c.classID AND cs.subID=s.subID AND c.classID=$classID";
    $sql = $conn->query($retreive);      
    $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $result;
    
}

if(isset($_POST['hiddenValue'])){
   switch($_POST['hiddenValue']){

     //INSERT CLASS-SUBINFO
     case 1:    
        $classID  = $_POST['classID'];
        $subID    = $_POST['subID'];        
        $result   = insertClassSub($classID,$subID);
        echo json_encode($result);
        break;

    //RETRIEVE CLASS-SUBINFO
      case 2:
             $result = retrieveClassSub("s.subID,c.classID,s.subCode, s.subName,c.className,c.section,cs.classSubID",
                                         "cs.classID=c.classID AND cs.subID=s.subID");       
             echo json_encode($result);
             break;
        //Update ClassSubInfo
      case 3:
             $classID    = $_POST['classID'];
             $subID      = $_POST['subID'];        
             $classSubID = $_POST['classSubID'];        
             $result     = updateClassSub($classSubID,$classID,$subID);
             echo json_encode($result);
             break;
       //Delete ClassSubInfo     
      case 4:
              $result = deleteClassSub($_POST['id']);
              echo json_encode($result);
              break;

      case 5:
           $classID= $_POST['id'];
           $result = retrieveClassSubByClassID($classID);       
           echo json_encode($result);
           break;
    }
  }
?>