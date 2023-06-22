<?php 
    include 'config.php';

    //Insert Subjects
    function insertSubjects($subCode,$subName){
            global $conn;
            $result = retrieveSubjects("*","subCode='$subCode'");
            if(empty($result)){ 
              $insSubjects  = "INSERT INTO subjects(subCode,SubName) VALUES(:subCode,:subName)";
              $stmt        = $conn->prepare($insSubjects);
              $stmt->execute(['subCode'=>$subCode,'subName'=>$subName]);
              return true;
            }else{
                return false;
            }
    }

     //Retrieve Subjects Details
     function retrieveSubjects($row,$where=null){

          global $conn;
          if($where!=null)
              $sql = $conn->query("SELECT $row FROM subjects WHERE $where");
          else      
              $sql = $conn->query("SELECT $row FROM subjects");      
          $result = $sql->fetchAll(PDO::FETCH_ASSOC);
          return $result;
          
      }

      function updateSubject($id,$subCode,$subName){

        global $conn;
        $result =retrieveSubjects("*","subCode='$subCode'");
        if(empty($result)){
           $upd  = "UPDATE subjects SET subCode=:subCode ,subName=:subName WHERE subID=:subid";
           $stmt = $conn->prepare($upd);
           $stmt->execute(['subCode'=>$subCode,'subName'=>$subName,'subid'=>$id]);
           return true;
        }
        else{
            return false;
        }
    }

      function deleteSubjectRow($id){
       
          global $conn;
          $del  = "DELETE FROM subjects WHERE subID = :subID";
          $stmt  = $conn->prepare($del);
          $stmt->bindParam(':subID',$id,PDO::PARAM_INT);
          if($stmt->execute()){
            return true;
          }
          return false;
       }

if(isset($_POST['hiddenValue'])){
    switch($_POST['hiddenValue']){ 
            
        //INSERT Subjects
      case 1:    
            $subCode = $_POST['subCode'];
            $subName = $_POST['subName'];        
            $result  = insertSubjects($subCode,$subName);
            echo json_encode($result);
            break;
            
            //RETRIEVE CLASS  
            case 2:
                $result = retrieveSubjects("*");       
                echo json_encode($result);
                break;
                
                case 3:
                    $subCode = $_POST['subCode'];
                    $subName = $_POST['subName'];        
                    $id      = $_POST['subID'];        
                    $result  = updateSubject($id,$subCode,$subName);
                    echo json_encode($result);
                    break;

         //DELETE CLASS
      case 4:
           $result=deleteSubjectRow($_POST['id']);
           echo json_encode($result);
          break;

    }//close switch
}
  ?>