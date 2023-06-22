<?php
  
  include 'config.php';

  //Insert ExamsInfo
  function insertExamInfo($examID,$classID,$examStartDate,$examEndDate){         
    global $conn;
    $result   = retrieveExams("*","ei.examID='$examID' AND ei.classID='$classID' AND ei.examStartDate='$examStartDate' AND ei.examEndDate ='$examEndDate'");
    if(empty($result)){
     $insExam  = "INSERT INTO exam_info(examID,classID,examStartDate,examEndDate) VALUES(:examID,:classID,:examStartDate,:examEndDate)";
     $stmt     = $conn->prepare($insExam);
     $stmt->execute(['examID'=>$examID,'classID'=>$classID,'examStartDate'=>$examStartDate,'examEndDate'=>$examEndDate]);  
     return true; 
   }else{
    return false;
   }
} 

//Insert ExamsSubINFO
function insertExamSubInfo($examInfoID,$subID,$minMarks,$maxMarks){
  global $conn;
  $insSubExam  = "INSERT INTO exam_sub_info(examInfoID,subID,minMarks,maxMarks) VALUES(:examInfoID,:subID,:minMarks,:maxMarks)";
  $stmt     = $conn->prepare($insSubExam);
  $stmt->execute(['examInfoID'=>$examInfoID,'subID'=>$subID,'minMarks'=>$minMarks,'maxMarks'=>$maxMarks]);

}

//Update ClassExams
function updateClassExam($id,$examID,$classID,$examStartDate,$examEndDate){

  global $conn;
  $result =retrieveExams("*","ei.examID='$examID' AND ei.classID='$classID' AND ei.examStartDate='$examStartDate' AND ei.examEndDate ='$examEndDate'");
  if(empty($result)){
      $upd  = "UPDATE exam_info SET examStartDate =:examStartDate, examEndDate =:examEndDate WHERE examInfoID=:id";
    
     $stmt = $conn->prepare($upd);
     $stmt->execute(['examStartDate'=>$examStartDate,'examEndDate'=>$examEndDate,'id'=>$id]);
     return true;
  }
  else{
      return false;
  }
}
//Delete ClassExams
function deleteClassExams($id){
       
  global $conn;
  $del  = "DELETE FROM exam_info WHERE examInfoID =:id";
  $stmt  = $conn->prepare($del);

 if($stmt->execute(['id'=>$id])){
   return true;
 }
   return false;
 }

 //Retrieve exams Details
  function retrieveExams($row,$where=null,$from="exam e,class c,exam_info ei,subjects s"){

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
  // $examInfoID = retrieveExams("DISTINCT ei.examInfoID","ei.examID='4' AND ei.classID='21' AND ei.examDate='2022-09-10'");
  // print_r($examInfoID);

if(isset($_POST['hiddenValue'])){
  switch($_POST['hiddenValue']){

        case 1:
            
             $examID   = $_POST['examID'];
             $classID  = $_POST['classID'];
             $examStartDate = $_POST['examStartDate'];
             $examEndDate = $_POST['examEndDate'];
             $result   = insertExamInfo($examID,$classID,$examStartDate,$examEndDate);
             if($result){
               $examInfoID = retrieveExams("DISTINCT ei.examInfoID","ei.examID='$examID' AND ei.classID='$classID' AND ei.examStartDate='$examStartDate' AND ei.examEndDate='$examEndDate'");
             for($i=0;$i<count($_POST['subID']);$i++){
               $subID      = $_POST['subID'][$i];
               $maxMarks   = $_POST['totMarks'][$i];
               $minMarks   = $_POST['minMarks'][$i];
               insertExamSubInfo($examInfoID[0]['examInfoID'],$subID,$minMarks,$maxMarks);          
             }
            }
               echo json_encode($result);
             break;
        //RETRIEVE Exams 
        case 2:
            $result = retrieveExams("DISTINCT ei.examInfoID,e.examName,c.className,c.section,ei.examStartDate,ei.examEndDate,ei.classID,ei.examID"," c.classID=ei.classID AND e.examID=ei.examID");       
            echo json_encode($result);
            break; 

        //Update Exams
        case 3:
          $classID       = $_POST['classID'];
          $examID        = $_POST['examID'];        
          $examInfoID    = $_POST['examInfoID'];        
          $examStartDate = date('y-m-d',strtotime($_POST['examStartDate']));
          $examEndDate   = date('y-m-d',strtotime($_POST['examEndDate']));
          $result        = updateClassExam($examInfoID,$examID,$classID,$examStartDate,$examEndDate);
          echo json_encode($result);
          break;
    //Delete Exams   
   case 4:
           $result = deleteClassExams($_POST['id']);
           echo json_encode($result);
           break;
            
            
        //Retrieve Exams with Status 1
        case 5:
           $retrieve    = "SELECT DISTINCT ei.examInfoID,e.examName,c.className,c.section,ei.examStartDate,ei.examEndDate
                            FROM exam_info ei,class c,exam e
                            WHERE ei.examInfoID NOT IN (SELECT esi.examInfoID
                            FROM exam_info ei,exam_sub_info esi
                            WHERE esi.examInfoID =ei.examInfoID AND esi.stat=0) 
                            AND ei.examID=e.examID AND c.classID=ei.classID";  

          $sql = $conn->query($retrieve);    
          $result = $sql->fetchAll(PDO::FETCH_ASSOC);

          echo json_encode($result);
          }
    }
    
    
    
    
    
    
    
    
    
    //Retrieve Students
    // case 9:
//   $result = retrieveExams("DISTINCT stu.stuID,stu.stuName,stu.regNo","c.classID=stu.classID")


//       case 5:
//         //RETRIEVE ClassName
//         $examDate  = $_POST['id'];
//         $result   = retrieveExams("DISTINCT c.classID,c.className,c.section","ei.examID=e.examID AND cs.classSubID=ei.classSubID AND cs.classID=c.classID AND ei.examDate='$examDate'");
//         echo json_encode($result);
// break;

// //retrieve Subjects
//  case 6:
//   $classID = $_POST['id'];
//   $result  = retrieveExams("DISTINCT cs.subID,s.subCode, s.subName","cs.classSubID=ei.classSubID AND cs.subID=s.subID AND cs.classID='$classID'"); 
//   echo json_encode($result);
// break;
// //Retrieve Date
// case 7:
//   $examID  = $_POST['id'];
//   $result = retrieveExams("DISTINCT ei.examDate","e.examID=ei.examID AND e.examID=$examID");
//   echo json_encode($result);
//   break;

//   //Retrieve ExamName
// case 8:
//   $result = retrieveExams("DISTINCT e.examName,ei.examID","e.examID=ei.examID ");
//   echo json_encode($result);
//   break;

// function getClassSubID($classID,$subID){
  //   global $conn;
  //   $retrieve="SELECT classSubID FROM class_sub 
//              WHERE classID=$classID AND subID=$subID";
//   $sql=$conn->query($retrieve);
//   $result = $sql->fetchAll();
//   if(count($result)>0)
//       return $result[0]['classSubID'];
//   return false;
// }

// function getExamInfoID($classSubID){
//   global $conn;
//   $retrieve="SELECT examInfoID FROM examinfo
//              WHERE classSubID=$classSubID";
//   $sql=$conn->query($retrieve);
//   $result = $sql->fetchAll();
//   if(count($result)>0)
//       return $result[0]['examInfoID'];
//   return false;
// }

// include 'classSubInfo.php';

  
  // //Insert Exams
  // function insertExam($examName){         
  //   global $conn;
  //   $insExam  = "INSERT INTO exam(examName) VALUES(:examName)";
  //   $stmt        = $conn->prepare($insExam);
  //   $stmt->execute(['examName'=>$examName]);   
  // }
   //Retrieve GetExamID Details
//   function getExamID($examName){

//     global $conn;
//     $retrieve="SELECT examID FROM exam WHERE examName=$examName";
//     $sql = $conn->query($retrieve);      
//     $result = $sql->fetchAll(PDO::FETCH_ASSOC);
//     if(count($result)!=0){
//       return $result[0]['examID'];
//       }    
//       return false;
    
//   } 
// $result  = retrieveExams("DISTINCT ei.examDate","cs.classSubID=ei.classSubID AND cs.classID=21");
//         echo json_encode($result);
//   $classSubID = retrieveExams("cs.classSubID","cs.classID=21 AND cs.subID=3 AND cs.classID =c.classID AND cs.subID=s.subID");
//  print_r($classSubID);
  
?>










