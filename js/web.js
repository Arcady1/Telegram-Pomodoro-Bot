const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

// Port
app.set('port', PORT);

app.get('/', function (req, res) {
    res.json({
        version: '1.0.0'
    });
});

app.listen(PORT, () => {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});