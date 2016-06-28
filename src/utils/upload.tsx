import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');

export function uploadImage(file: any, prefix: string, success?: any, error?: any) {
  loadImage(
    file,
    function (canvas) {
      let dataUrl = canvas.toDataURL(file.type);
      // Create a formdata object and add the files
      var data = new FormData();
      data.append('image', dataUrl);
      data.append('prefix', prefix);
      data.append('type', file.type);
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "imageupload2.php",
        type: "POST",
        data: data,
        cache: false,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        dataType: "json",
        success: function (response, textStatus, jqXHR) {
          if (typeof response.error === "undefined") {
            if (success) {
              success(response.files[0].replace(Settings.uRelativeImageUpload, ""));
            }
          } else {
            if (error) {
              error(response);
            }
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          if (error) {
            error(jqXHR);
          }
        }
      });
    },
    {
      maxWidth: 1920,
      maxHeight: 1920,
      canvas: true
    }
  );
  //
  //
  // var reader = new FileReader();
	// reader.onloadend = function () {
  //   var maxWidth = 1920;
  // 	var maxHeight = 1920;
  //
  // 	var image = new Image();
  // 	image.src = reader.result;
  //   image.onload = function () {
  // 		var width = image.width;
  // 		var height = image.height;
  // 		var newWidth;
  // 		var newHeight;
  //
  // 		if (width > height) {
  // 			newHeight = height * (maxWidth / width);
  // 			newWidth = maxWidth;
  // 		} else {
  // 			newWidth = width * (maxHeight / height);
  // 			newHeight = maxHeight;
  // 		}
  // 		var canvas = document.createElement('canvas');
  //
  // 		canvas.width = newWidth;
  // 		canvas.height = newHeight;
  //
  // 		var context = canvas.getContext('2d');
  //
  //     context.drawImage(this, 0, 0, newWidth, newHeight);
  //
  //
  //
  //
  // 	};
  //
  // 	image.onerror = function () {
  // 		console.log('There was an error processing your file!');
  // 	};
	// }
	// reader.onerror = function () {
	// 	console.log('There was an error reading the file!');
	// }
	// reader.readAsDataURL(file);
  //
  //
  //

}
