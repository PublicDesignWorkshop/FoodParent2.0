import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');
let loadImage = require('blueimp-load-image');

export function uploadImage(file, prefix, resolve, reject) {
  loadImage.parseMetaData(file,
    function (data) {
      let orientation;
      let datetime;
      // Extract image header data.
      if (data.imageHead && data.exif) {
        orientation = data.exif[0x0112];
        datetime = data.exif.getText('DateTimeOriginal');
      }
      var formdata = new FormData();
      formdata.append('file', file);
      formdata.append('prefix', prefix);
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "imageupload.php",
        type: "POST",
        data: formdata,
        cache: false,
        dataType: "json",
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function(response) {
          console.log(response);
          if (response.code == 200) {
            if (resolve)
              resolve(response.files[0].replace(ServerSetting.uRelativeImageUpload, ""), datetime);
          } else {
            if (__DEV__) {
              console.error(response.message);
            }
            if (reject)
              reject(response.code);
          }
        },
        error: function(response) {
          console.log(response);
          if (__DEV__) {
            console.error(response.statusText);
          }
          if (reject)
            reject(response.status);
        }
      });
    },
    {
      maxMetaDataSize: 262144,
      disableImageHead: false
    }
  )
}


// import $ from 'jquery';
// let ServerSetting = require('./../../setting/server.json');
// let loadImage = require('blueimp-load-image');
//
// export function uploadImage(file, prefix, resolve, reject) {
//   loadImage.parseMetaData(file,
//     function (data) {
//       let orientation;
//       let datetime;
//       // Extract image header data.
//       if (data.imageHead) {
//         orientation = data.exif[0x0112];
//         datetime = data.exif.getText('DateTimeOriginal');
//       }
//       loadImage(file,
//         function (canvas) {
//           if (canvas.toBlob) {
//             canvas.toBlob(
//               function (blob) {
//                 // let url = window.URL.createObjectURL(blob);
//                 let data = new FormData();
//                 data.append('file', blob);
//                 data.append('prefix', prefix);
//                 // Upload an image to the server.
//                 $.ajax({
//                   url: ServerSetting.uBase + ServerSetting.uServer + "imageupload.php",
//                   type: "POST",
//                   data: data,
//                   cache: false,
//                   processData: false, // Don't process the files
//                   contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//                   dataType: "json",
//                   success: function(response) {
//                     if (response.code == 200) {
//                       if (resolve)
//                         resolve(response.files[0].replace(ServerSetting.uRelativeImageUpload, ""), datetime);
//                     } else {
//                       if (__DEV__) {
//                         console.error(response.message);
//                       }
//                       if (reject)
//                         reject(response.code);
//                     }
//                   },
//                   error: function(response) {
//                     console.log(response);
//                     if (__DEV__) {
//                       console.error(response.statusText);
//                     }
//                     if (reject)
//                       reject(response.status);
//                   }
//                 });
//               },
//               'image/jpeg'
//             );
//           } else if (canvas.type != "error") {  // For browsers doesn't support Canvas.toBlob().
//             // Upload the original file instead of a reduced file.
//             var data = new FormData();
//             let data = new FormData();
//             data.append('file', file);
//             data.append('prefix', prefix);
//             $.ajax({
//               url: ServerSetting.uBase + ServerSetting.uServer + "imageupload.php",
//               type: "POST",
//               data: data,
//               cache: false,
//               dataType: "json",
//               processData: false, // Don't process the files
//               contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//               success: function(response) {
//                 console.log(response);
//                 if (response.code == 200) {
//                   if (resolve)
//                     resolve(response.files[0].replace(ServerSetting.uRelativeImageUpload, ""), datetime);
//                 } else {
//                   if (__DEV__) {
//                     console.error(response.message);
//                   }
//                   if (reject)
//                     reject(response.code);
//                 }
//               },
//               error: function(response) {
//                 console.log(response);
//                 if (__DEV__) {
//                   console.error(response.statusText);
//                 }
//                 if (reject)
//                   reject(response.status);
//               }
//             });
//           } else {  // Image import error handler.
//             if (reject)
//               reject(506);  //506: File type is not an image.
//           }
//         },
//         {
//           maxWidth: 1600,
//           maxHeight: 900,
//           canvas: true,
//           orientation: orientation,
//         }
//       );
//     },
//     {
//       maxMetaDataSize: 262144,
//       disableImageHead: false
//     }
//   )
// }
