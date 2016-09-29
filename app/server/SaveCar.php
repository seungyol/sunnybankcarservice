<?php
	include 'CustomerModel.php';
	include 'CarMakers.php';
	include 'CarModels.php';
	$action= $_POST["caraction"];
	$customerCars = new CustomerCars();
    if($action == "SAVE") {
	  $customerCars->ID = $_POST["CustomerCarsID"];
	  $customerCars->CustomersID = $_POST["CustomersID"];
	  $customerCars->CarModelsID = $_POST["CarModelsID"];
	  $customerCars->RegNo = $_POST["RegNo"];
	  $customerCars->Model = $_POST["model"];
	  $customerCars->Year = $_POST["Year"];
	  $customerCars->VIN = $_POST["VIN"];
	  $customerCars->EngineNo = $_POST["EngineNo"];
	  $customerCars->ManualTransmissionYN = $_POST["ManualTransmissionYN"];
	  $CompaniesID = $_POST["CompaniesID"];
    }
//    echo "CustomerCarsID:" . $_POST["CustomerCarsID"];
//    echo "CarModelsID" . $customerCars->CarModelsID;
	if($action == "SAVE" && $customerCars->CarModelsID == null){
		$customerCars->CarMakersID = $_POST["make"];
		$modelID = CarModels::selectIDByName($CompaniesID,$customerCars->CarMakersID,$customerCars->Model);
		if($modelID == 0){
			$modelID = CarModels::insert($customerCars->Model, $customerCars->CarMakersID, $CompaniesID);
		}
		$customerCars->CarModelsID = $modelID;
	}

	if($action == 'SAVE'){
		$affectedRow = $customerCars->save();
	}else {
		$affectedRow = $customerCars->delete($_POST["CustomerCarsID"]);
	}
	
  $array = array(
    "affectedRow" => $affectedRow
  );
  echo  json_encode($array);	
?> 