"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/chatbot", function(req, res) {
  var speech =req.body.queryResult.queryText;
    // req.body.queryResult &&
    // req.body.queryResult.parameters &&
    // req.body.queryResult.parameters.echoText
    //   ? req.body.queryResult.queryText
    //   : "Existe un problema: ."+req.body;
  return res.json({

  "fulfillmentText": speech,
  "fulfillmentMessages": [
    {
      "text": {
        "text": [speech]
      }
    }
  ],
  "source": "<webhookinra>"
  // "request": req


  });
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});