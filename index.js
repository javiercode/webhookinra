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
    var aNroTitulo=req.body.queryResult.queryText.split(':');
    if(aNroTitulo.length==2){
        var nroTitulo = aNroTitulo[1];
        nroTitulo= nroTitulo.trim();

        console.log("*"+nroTitulo+"*");
        var speech =req.body.queryResult.queryText;
        // var ruta = "http://172.17.0.226:8097/api/v1/extranet/movil/reporte/predio?nroTitulo="+nroTitulo;
        var ruta = "http://sinra.inra.gob.bo:8097/api/v1/extranet/movil/reporte/predio?nroTitulo="+nroTitulo;


        request({url:ruta,json:true},function (error, response, body) {
            console.log(body);
            // console.log(body['parcela']);

            if(body!=null){
                var nombre = body['parcela']?body['parcela']:'S/N';
                var superficie = body['supCodCat']?body['supCodCat']:'S/N';
                var clasificacion = body['clasificacion']?body['clasificacion']:'S/N';
                speech = 'NOMBRE: '+nombre+". SUPERFICIE: "+superficie+". CLASIFICACION: "+clasificacion;
            }else{
                speech = 'no tenemos informacion relacionada';
            }

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

    }else{
        speech = 'No se puede buscar el titulo solicitado.';
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
    }


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
