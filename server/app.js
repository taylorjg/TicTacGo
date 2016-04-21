var express = require("express");
var bodyParser = require("body-parser");
var engine = require("./engine");

var app = express();
var port = process.env.PORT || 3000;

var apiRouter = express.Router();
apiRouter.post("/computerMove", handleComputerMove);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static("server/public"));
app.use('/api', apiRouter);

app.listen(port, function () {
    console.log("Listening on port %d", port);
});

function handleComputerMove(req, res, _) {
    
    var state = req.body;
    console.log("state", state);
    
    var responseData = engine.computerMove(state);
    console.log("responseData", responseData);
    
    return res.json(responseData);
}
