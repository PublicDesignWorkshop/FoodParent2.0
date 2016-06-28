import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');

export function uploadImage(file: any, prefix: string, success?: any, error?: any) {
  loadImage.parseMetaData(
    file,
    function (data) {
      if (!data.imageHead) {
        loadImage(
          file,
          function (canvas) {
            if (canvas.toBlob) {
              canvas.toBlob(
                function (blob) {
                  let data = new FormData();
                  data.append('file', blob);
                  data.append('prefix', prefix);
                  $.ajax({
                    url: Settings.uBaseName + Settings.uServer + "imageupload3.php",
                    type: "POST",
                    data: data,
                    cache: false,
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    dataType: "json",
                    success: function (response, textStatus, jqXHR) {
                      if (typeof response.error === "undefined") {
                        if (success) {
                          success(response.files[0].replace(Settings.uRelativeImageUpload, ""), null);
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
                'image/jpeg'
              );
            }
          },
          {
            maxWidth: 1600,
            maxHeight: 900,
            canvas: true
          }
        );
      } else {
        let orientation = data.exif[0x0112];
        let datetime = data.exif.getText('DateTimeOriginal');
        loadImage(
          file,
          function (canvas) {
            if (canvas.toBlob) {
              canvas.toBlob(
                function (blob) {
                  // let url = window.URL.createObjectURL(blob);
                  let data = new FormData();
                  data.append('file', blob);
                  data.append('prefix', prefix);
                  $.ajax({
                    url: Settings.uBaseName + Settings.uServer + "imageupload3.php",
                    type: "POST",
                    data: data,
                    cache: false,
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    dataType: "json",
                    success: function (response, textStatus, jqXHR) {
                      if (typeof response.error === "undefined") {
                        if (success) {
                          success(response.files[0].replace(Settings.uRelativeImageUpload, ""), datetime);
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
                'image/jpeg'
              );
            }
          },
          {
            maxWidth: 1600,
            maxHeight: 900,
            canvas: true,
            orientation: orientation
          }
        );
      }
    },
    {
      maxMetaDataSize: 262144,
      disableImageHead: false
    }
  );
}

export function uploadImage2(file: any, prefix: string, success?: any, error?: any) {
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
