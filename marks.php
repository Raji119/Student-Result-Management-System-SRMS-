<?php
    
   include_once 'config.php';
   
   //InsertClassMarks
   function insertMarks($examSubInfoID,$stuID,$obtMarks,$res){       
            global $conn;
            $insMarks  = "INSERT INTO marks(examSubInfoID,stuID,obtMarks,result) VALUES(:examSubInfoID,:stuID,:obtMarks,:res)";
            $stmt        = $conn->prepare($insMarks);
            $stmt->execute(['examSubInfoID'=>$examSubInfoID,'stuID'=>$stuID,'obtMarks'=>$obtMarks,'res'=>$res]);           
        }

    //RetrieveClassMarks
    function retrieveMarks($row,$where=null,$from="marks m,students st,class_sub cs,class c,subjects s,exam_sub_info esi"){
        
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

    //UpdateStatus
    function updateStatus($examSubInfoID){
        global $conn;
        $updStatus  = "UPDATE exam_sub_info SET stat='1' WHERE examSubInfoID='$examSubInfoID'";
        $sql = $conn->query($updStatus);
    }

    //Update Class
function updateMarks($id,$obtMarks){
       
       global $conn;
       $upd  = "UPDATE marks SET obtMarks=:obtMarks WHERE marksID=:id";
       $stmt = $conn->prepare($upd);
       $stmt->execute(['obtMarks'=>$obtMarks,'id'=>$id]);
       return true;

  }
  


    switch($_POST['hiddenValue']){ 
            
            //INSERT CLASS
            case 1:    
                // $status       = $_POST['status'];
                $result       = false;
                if($_POST['stat']=='0'){
                    $examSubInfoID   = $_POST['examSubInfoID'];
                    $resC        = retrieveMarks("*","stat = 1 AND examSubInfoID=$examSubInfoID","exam_sub_info");
                    if(empty($resC)){
                    updateStatus($examSubInfoID);
                    $minMarks     = $_POST['minMarks'];
                 for($i=0;$i<count($_POST['stuID']);$i++){
                   $res          = "Pass";
                   $stuID        = $_POST['stuID'][$i]; 
                   $obtMarks     = $_POST['obtMarks'][$i];  
                   if($obtMarks<$minMarks)
                      $res      = "Fail";
                  insertMarks($examSubInfoID,$stuID,$obtMarks,$res);
                }
                $result = true;
            }
        }
                echo json_encode($result);
             break;

            //RETRIEVE MarksForEntry  
        case 2:
             $examSubInfoID = $_POST['id'];
             $result = retrieveMarks("DISTINCT m.marksID,st.stuID,st.stuName,st.regNo,m.obtMarks,m.result,m.examSubInfoID","esi.examSubInfoID=m.examSubinfoID AND st.stuID=m.stuID 
                                      AND  st.classID=c.classID AND esi.examSubInfoID='$examSubInfoID'");       
             echo json_encode($result);
             break;
            
             //UPDATE Marks
        case 3:
             $id         = $_POST['marksID'];
             $obtMarks   = $_POST['obtMarks'];
            
             $result     = updateMarks($id,$obtMarks);
             echo  json_encode($result);
             break;
        
            //RETRIEVE Entered MarksList
        case 5:
              $result = retrieveMarks(" DISTINCT st.classID, e.examName,c.className,c.section,ei.examDate","ei.examInfoID=m.examInfoID AND st.stuID=m.stuID AND cs.classSubID=ei.classSubID
              AND cs.classID=c.classID AND st.classID=c.classID AND cs.subID=s.subID AND e.examID=ei.examID AND s.subID=cs.subID","marks m,examinfo ei,students st,class_sub cs,class c,subjects s,exam e");
              echo json_encode($result);
              break;

              //RETRIEVE List of Marks for Class
        
        case 7:
              
              $examInfoID = $_POST['id'];
              $retrieve   = "SELECT s.subName,s.subID,esi.maxMarks
                       FROM subjects s,exam_info ei,exam_sub_info esi
                       WHERE ei.examInfoID=esi.examInfoID AND s.subID = esi.subID
                       AND esi.examInfoID=$examInfoID ORDER BY s.subID";
        $sql = $conn->query($retrieve);    
        $subNames = $sql->fetchAll(PDO::FETCH_ASSOC);
        
        $res     =  retrieveMarks("c.classID","c.classID=ei.classID AND examInfoID = '$examInfoID'","class c,exam_info ei");
        $classID = $res[0]["classID"];
        
        $retrieve    = "SELECT Distinct st.stuName,st.regNo,m.stuID,st.fName,st.mName
                            FROM exam_info ei,class c,exam e,marks m,subjects s,students st,exam_sub_info esi
                            WHERE m.examSubInfoID IN (SELECT esi.examSubInfoID
                            FROM exam_info ei,exam_sub_info esi
                            WHERE esi.examInfoID = '$examInfoID' AND esi.examInfoID=ei.examInfoID) 
                            AND ei.examID=e.examID AND c.classID=ei.classID AND s.subID=esi.subID AND
                            st.stuID=m.stuID AND esi.examInfoID =ei.examInfoId AND st.classID = '$classID' ORDER BY st.regNo ASC"; 
                            
                            $sql = $conn->query($retrieve);    
                            $stuNames = $sql->fetchAll(PDO::FETCH_ASSOC);
                            
                            
                            $retrieve    = "SELECT m.marksID,m.obtMarks,st.stuID,m.result,s.subID
                            FROM exam_info ei,class c,exam e,marks m,subjects s,students st,exam_sub_info esi
                            WHERE m.examSubInfoID IN (SELECT esi.examSubInfoID
                            FROM exam_info ei,exam_sub_info esi
                            WHERE esi.examInfoID = $examInfoID AND esi.examInfoID=ei.examInfoID) 
                            AND ei.examID=e.examID AND c.classID=ei.classID AND s.subID=esi.subID AND
                            st.stuID=m.stuID AND esi.examInfoID =ei.examInfoId AND esi.examSubInfoID=m.examSubInfoID ORDER BY s.subID"; 
                            
                            $sql = $conn->query($retrieve);    
                            $marks = $sql->fetchAll(PDO::FETCH_ASSOC);
                            
                            $finalResult  = array();
                            array_push($finalResult,$subNames);
                            array_push($finalResult,$stuNames);
                            array_push($finalResult,$marks);
                            
                            echo json_encode($finalResult);
                            
                        }//close switch
                            
                            ?>