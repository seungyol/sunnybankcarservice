<?php
	include 'CarModels.php';
	$term = trim(strip_tags($_GET['term']));
	$ID = $_GET["CarMakersID"];
    $CompaniesID = $_GET["CompaniesID"];
	$carModels = CarModels::selectAll($ID,$term, $CompaniesID);
	echo json_encode($carModels);
	flush();
?> 