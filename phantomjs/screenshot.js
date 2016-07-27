"use strict";
var page = require('webpage').create(),
  system = require('system'),
  Settings = require('./../src/constraints/settings.json')

var renderTime = Settings.iScreenshotRenderTime;

page.viewportSize = { width: 400, height: 300 };
console.log("Connecting to " + Settings.ssltype + Settings.host + Settings.uBaseName + Settings.uServer + "screenshot.php");
page.open(Settings.ssltype + Settings.host + Settings.uBaseName + Settings.uServer + "screenshot.php", 'get', {}, function (status) {
  if (status !== 'success') {
    console.log('Unable to post!');
  } else {

    var content = page.content.replace("<html><head></head><body>", "");
    var content = content.replace("</body></html>", "");
    var json = JSON.parse(content);
    if (json.code != 200) {
      console.log(json.message);
      phantom.exit();
    } else {
      console.log(json.trees.length + " trees have/has been found.");
    }

    window.setTimeout(function () {
      phantom.exit();
    }, renderTime * json.trees.length);
    for (var i = 0; i < json.trees.length; i++) {
      var index = i + 1;
      var id = json.trees[i].id;
      var address = Settings.ssltype + Settings.host + Settings.uBaseName + "/screenshot/" + json.trees[i].id;
      window.setTimeout(function (id, address, index, total) {
        page.open(address, function (status) {
          console.log("Connecting to " + address);
          if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit(1);
          } else {
            window.setTimeout(function () {
              console.log("Rendering " + id + "_map.png (" + index + " out of " + total + ")");
              page.render("../dist/map/" + id + "_map.png");
            },Math.floor(renderTime * 0.75));
          }
        });
      }, renderTime * i, id, address, index, json.trees.length);
    }
  }
});
