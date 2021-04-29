const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

// var packageInfo = require('./package.json');

// app.get('/', function (req, res) {
//     res.json({
//         version: packageInfo.version
//     });
// });

var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`Web server started at http://${host}:${port}`);
});