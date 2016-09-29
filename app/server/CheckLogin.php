<?php
	include 'CustomerModel.php';
	
	$Email= $_POST["Email"];
	$Password= $_POST["Password"];
	$users = new Users();

	$users =  Users::selectOne($Email);

	if(count($users) == 0){
        $result = array(
              "Result" => "FAIL",
              "Message" => 'No user with the email address. Please enter another email');
        echo json_encode($result);        
	}else if(count($users) == 1){
		$user = $users[0];
		if($Password != $user["Password"]){
          $result = array(
              "Result" => "FAIL",
              "Message" => "Password is wrong");
			echo json_encode($result);
		}else {
            $_SESSION["ID"] = $user["ID"];
            $_SESSION["Email"] = $user["Email"];
            $_SESSION["FirstName"] = $user["FirstName"];
            $_SESSION["LastName"] = $user["LastName"];
            $_SESSION["CompaniesID"] = $user["CompaniesID"];
            $_SESSION["RolesID"] = $user["RolesID"];
            $_SESSION["RoleName"] = $user["RoleName"];
            
            $result = array(
              "FirstName" => $user["FirstName"],
              "LastName" => $user["LastName"],
              "CompaniesID" => $user["CompaniesID"],
              "ID" => $user["ID"],
              "Email" => $user["Email"],
              "RolesID" => $user["RolesID"],
              "RoleName" => $user["RoleName"],
              "Result" => "SUCCESS"
            );
			echo json_encode($result);
		}
	}else {
        $result = array(
          "Result" => "FAIL",
          "Message" => "There are many users with the email.Contact Administrator"
        );
		echo json_encode($result);
	}
	
?> 