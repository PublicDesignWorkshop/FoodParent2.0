import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');

export function uploadImage(file: any, prefix: string, success?: any, error?: any) {
  // Create a formdata object and add the files
  var data = new FormData();
  data.append("filename", file);
  $.ajax({
    url: Settings.uBaseName + Settings.uServer + "imageupload.php" + "?prefix=" + prefix + "&files",
    type: "POST",
    data: data,
    cache: false,
    dataType: "json",
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
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
}
