<?php
    
   include_once 'config.php';
   
   //InsertClassDetails
   function insertClass($class,$section){
         
            global $conn;
            $result =retrieveClass("*","className='$class' AND section='$section'");

            if(empty($result)){
              $insClasses  = "INSERT INTO class(className,section) VALUES(:class,:section)";
              $stmt        = $conn->prepare($insClasses);
              $stmt->execute(['class'=>$class,'section'=>$section]);
               return true;
            }else{
            return false;
            }
        }
        
    //    $res= insertClass("7th","A");
    //    print_r($res);

    //Retrieve Class Details
    function retrieveClass($row,$where=null){

        global $conn;
        $sql="";
        if($where!=null){
            $sql = $conn->query("SELECT $row FROM class WHERE $where");  
        }else{
            $sql = $conn->query("SELECT $row FROM class");
        }    
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
        
    }

    //DeleteClassDetails
    function deleteClassRow($id){
       
       global $conn;
       $del  = "DELETE FROM class WHERE classID =:cid";
       $stmt  = $conn->prepare($del);
    
      if($stmt->execute(['cid'=>$id])){
        return true;
      }else{
        return false;
      }
        // echo json_encode(array("data"=>"RECORD DELETED"));
       
    }

    function updateClassRow($id,$class,$section){

        global $conn;
        $result =retrieveClass("*","className='$class' AND section='$section'");
        if(empty($result)){
           $upd  = "UPDATE class SET className=:class ,section=:section WHERE classID=:cid";
           $stmt = $conn->prepare($upd);
           $stmt->execute(['class'=>$class,'section'=>$section,'cid'=>$id]);
           return true;
        }
        else{
            return false;
        }
    }

     if(isset($_POST['hiddenValue'])){
        switch($_POST['hiddenValue']){ 
            
            //INSERT CLASS
        case 1:    
             $class   = $_POST['className'];
             $section = $_POST['section'];        
             $result  = insertClass($class,$section);
             echo json_encode($result);
             break;

            //RETRIEVE CLASS  
        case 2:
             $result = retrieveClass("*");       
             echo json_encode($result);
             break;
            
             //UPDATE CLASS
        case 3:
             $id      = $_POST['classID'];
             $class   = $_POST['className'];
             $section = $_POST['section'];
             $result  = updateClassRow($id,$class,$section);
             echo json_encode($result);
             break;

            //DELETE CLASS
        case 4:
               $result = deleteClassRow($_POST['id']);
               echo json_encode($result);
              break;
        
            //RETRIEVE CLASSFROMID
        case 5:
              $id     = $_POST['classID'];
              $result = retrieveClass("*","classID='$id'");
              echo json_encode($result);
              break;

        }//close switch

    }

        // $decode=json_decode(file_get_contents('php://input'), true);
        
        // $class =$decode[$_POST['class']];
        // $output = [];
        // $output['empty']='empty';
        // exit(json_encode($output));   
        


        // $aRequest = json_decode($_POST,true);
      
        // echo json_encode($aRequest[0]->stream);
        //Retrieve ClassFrom ID
    // function retrieveClassFromID($id){

    //     global $conn;
    //     $sql = $conn->query("SELECT classID,className,section FROM class where classID=$id");
    //     $result = $sql->fetchAll(PDO::FETCH_ASSOC) or die("Failed");
    //     return $result;

    // }
    
  ?>