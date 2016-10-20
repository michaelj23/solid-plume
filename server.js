var express = require('express');
var indexApp = express();
var bundleApp = express();

indexApp.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
indexApp.get("/", function(req, res, next) {
  res.sendFile(__dirname + "/index.html");
});
indexApp.use(express.static(__dirname));
indexApp.listen(8080, function() {
  console.log("Starting index server...");
});

var bundlePath = "dist";
bundleApp.listen(3000, function() {
  console.log("Starting bundle server...");
});
bundleApp.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
bundleApp.get("/" + bundlePath + "/:asset", function(req, res, next) {
  res.sendFile(__dirname + "/" + bundlePath + "/" + req.params.asset);
});
