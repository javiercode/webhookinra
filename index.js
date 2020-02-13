"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const restService = express();


restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/chatbot", function(req, res) {
  var speech =req.body.queryResult.queryText;
  // var ruta = "http://172.17.0.226:8097/api/v1/extranet/movil/reporte/predio?nroTitulo="+req.body.queryResult.queryText;
  var ruta = "http://sinra.inra.gob.bo:8097/api/v1/extranet/movil/reporte/predio?nroTitulo="+req.body.queryResult.queryText;

  request({url:ruta,json:true},function (error, response, body) {
      // console.log(body);
      console.log(body['parcela']);
      speech = body['parcela']?body['parcela']:'no tenemos informacion relacionada';
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
      });
  });


  // request({
  //     uri: RUTA,
  //     json: true,
  // }).then(res=>{
  //     speech = res.estado;
  // });

    speech=ruta;
    // req.body.queryResult &&
    // req.body.queryResult.parameters &&
    // req.body.queryResult.parameters.echoText
    //   ? req.body.queryResult.queryText
    //   : "Existe un problema: ."+req.body;


});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
