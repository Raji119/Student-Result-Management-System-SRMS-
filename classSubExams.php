<?php
  
   include 'config.php';

   //retrieveClassSubExams
   function retrieveClassSubExams($row,$where=null,$from="exam_info ei,subjects s,exam_sub_info esi"){

    global $conn;
    if($where!=null){
        $retrieve="SELECT $row
                   FROM $from
                   WHERE $where";
    }else{
      $retrieve="SELECT $row FROM $from";
    }
    $sql = $conn->query($retrieve);    
    $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $result;   
  } 

  //Update ClassSubExams
function updateClassSubExam($id,$minMarks,$maxMarks){

  global $conn;
  
     $upd  = "UPDATE exam_sub_info SET minMarks=:minMarks ,maxMarks=:maxMarks WHERE examSubInfoID=:id";
     $stmt = $conn->prepare($upd);
     $stmt->execute(['minMarks'=>$minMarks,'maxMarks'=>$maxMarks,'id'=>$id]);
      return true;
}

//Delete ClassSubInfo
function deleteClassSubExams($id){
       
  global $conn;
  $del  = "DELETE FROM exam_sub_info WHERE examSubInfoID =:id";
  $stmt  = $conn->prepare($del);

 if($stmt->execute(['id'=>$id])){
   return true;
 }
   return false;
 }


  if(isset($_POST['hiddenValue'])){

    switch($_POST['hiddenValue']){
        
        //Retrieve Exams
        case 2:
            $examInfoID = $_POST['id'];
            $result     = retrieveClassSubExams("esi.examSubInfoID,s.subCode,s.subName,esi.minMarks,esi.maxMarks,ei.classID,esi.stat,ei.examInfoID","esi.examInfoID=ei.examInfoID AND esi.subID=s.subId AND esi.examInfoID='$examInfoID'");
            echo json_encode($result); 
            break;

      //Update SubMarks
      case 3:

           $examSubInfoID = $_POST['examSubInfoID'];
           $minMarks      = $_POST['minMarks'];
           $maxMarks      = $_POST['maxMarks'];

           $result        = updateClassSubExam($examSubInfoID,$minMarks,$maxMarks);
           echo json_encode($result);
           break;

      //Delete SubExams
      case 4 :
            $id     = $_POST['id'];
            $result = deleteClassSubExams($id);
            echo json_encode($result);
           
    }
  }
//   $retrieve    = "SELECT DISTINCT ei.examInfoID,e.examName,c.className,c.section,ei.examDate
//                             FROM exam_info ei,class c,exam e
//                             WHERE ei.examInfoID NOT IN (SELECT esi.examInfoID
//                             FROM exam_info ei,exam_sub_info esi
//                             WHERE esi.examInfoID =ei.examInfoID AND esi.stat=0) 
//                             AND ei.examID=e.examID AND c.classID=ei.classID";  

// $sql = $conn->query($retrieve);    
// $result = $sql->fetchAll(PDO::FETCH_ASSOC);

//   print_r($result);