<?php // You need to add server side validation and better error handling here
	$serverSetting = json_decode(file_get_contents("../dist/setting/server.json"), true);

	$json = array(
		"code" => "200",
	);
	$count = 0;
	if(isset($_FILES['file']) and !$_FILES['file']['error']) {
		$prefix = $_POST['prefix'];
		$extension = str_replace('image/', '', $_FILES['file']['type']);

		// File name
		$uploaddir = $serverSetting["uRelativeImageUpload"];
		$destName = $prefix.'_'.$count."_dest.".$extension;
		while ( file_exists($uploaddir.$destName) ) {
			$count++;
			$destName = $prefix.'_'.$count."_dest.".$extension;
		}
		$thumbName = $prefix.'_'.$count."_thumb.".$extension;

		// Image Size
		list($origWidth, $origHeight) = getimagesize($_FILES['file']['tmp_name']);
		$newWidth = 1920;
		$newHeight = intval($newWidth * $origHeight / $origWidth);
		$thumbWidth = 320;
		$thumbHeight = intval($thumbWidth * $origHeight / $origWidth);

		$source = imagecreatefromjpeg($_FILES['file']['tmp_name']);

		// Orientation
		try {
			$exif = @exif_read_data($_FILES['file']['tmp_name']);
		}
		catch (Exception $exp) {
			$exif = false;
		}
		if (!empty($exif['Orientation'])) {
			switch ($exif['Orientation']) {
				case 3:
					$source = imagerotate($source, 180, 0);
					break;
				case 6:
					$source = imagerotate($source, -90, 0);
					$temp = $thumbHeight;
					$thumbHeight = $thumbWidth;
					$thumbWidth = $temp;
					$temp = $origHeight;
					$origHeight = $origWidth;
					$origWidth = $temp;
					break;
				case 8:
					$source = imagerotate($source, 90, 0);
					$temp = $thumbHeight;
					$thumbHeight = $thumbWidth;
					$thumbWidth = $temp;
					$temp = $origHeight;
					$origHeight = $origWidth;
					$origWidth = $temp;
					break;
				}
		}

		// Load
		$thumb = imagecreatetruecolor($thumbWidth, $thumbHeight);
		$dest = imagecreatetruecolor($newWidth, $newHeight);

		// Resize
		// imagecopyresized($dest, $source, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
		imagecopyresized($thumb, $source, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $origWidth, $origHeight);
		// Save
		$error = false;
		// if (imagejpeg($dest, $uploaddir.$destName, 75) && imagejpeg($thumb, $uploaddir.$thumbName, 75)) {
		if (move_uploaded_file($_FILES['file']['tmp_name'], $uploaddir.$destName) && imagejpeg($thumb, $uploaddir.$thumbName, 75)) {
			$files[] = $uploaddir.$thumbName;
		} else {
			$error = true;
		}

		if ($error) {
			$json = array(
				"code" => "500",
				"message" => "Internal Server Error: Error occured while uploading images.",
			);
		} else {
			$json = array(
				"code" => "200",
				"files" => $files,
			);
		}
	} else {
		$json = array(
			"code" => "400",
			"message" => "Bad Request",
		);
	}
	echo json_encode($json);
?>
