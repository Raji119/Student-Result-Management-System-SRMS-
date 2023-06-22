<!DOCTYPE html>
<html lang="en">
  
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
      <title>RMS-Login</title>
      <link rel="shortcut icon" href="assets/img/favicon.png">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,500;0,600;0,700;1,400&amp;display=swap">
      <link rel="stylesheet" href="assets/plugins/bootstrap/css/bootstrap.min.css">
      <link rel="stylesheet" href="assets/plugins/fontawesome/css/fontawesome.min.css">
      <link rel="stylesheet" href="assets/plugins/fontawesome/css/all.min.css">
      <link rel="stylesheet" href="assets/css/newStyle.css">
   </head>
   <body>

      <div class="main-wrapper login-body">
         <div class="login-wrapper">
            <div class="container">
               <div class="loginbox">
                  <div class="login-left">
                     <img class="img-fluid" src="assets/img/logo-small.png" alt="Logo">
                        <h1 class="text-light">Result Management System</h1>
                  </div>
                  <div class="login-right">
                     <div class="login-right-wrap">
                        <h1>Login</h1>
                        <p class="account-subtitle">Access to our dashboard</p>
                        <form action="index.php" method="post">
                           <div class="form-group">
                              <input class="form-control" name="adminName" type="text" placeholder="Admin">
                           </div>
                           <div class="form-group">
                              <input class="form-control" name="passWord" type="password" placeholder="Password">
                           </div>
                           <div class="form-group">
                              <button class="btn btn-primary btn-block" name="login" type="submit">Login</button>
                           </div>
                           <div>
                           <?php
include 'config.php';

  if(isset($_POST["login"])){
    $adminName = $_POST['adminName'];
    $passWord = $_POST['passWord'];
    $sql = $conn->query("SELECT * FROM `admin` WHERE adminName='$adminName' AND `passWord`='$passWord'"); 
    $result = $sql->fetch(PDO::FETCH_ASSOC);
    echo $result;
    if(empty($result)){
         
      echo ("Invalid Credentials");
    }else{
      header("location:./home.html");
    }
  }
?>
</div>
                        </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <script src="assets/js/jquery-3.6.0.min.js"></script>
      <!-- <script src="assets/js/popper.min.js"></script> -->
      <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
      <script src="assets/js/script.js"></script>
   </body>
</html>