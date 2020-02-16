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
    var speech ='No se puede buscar el titulo solicitado.';
    var aQueryText=req.body.queryResult.queryText.split(':');
    var aValidarHr=req.body.queryResult.queryText.split('/');

    var respuesta = function (res, speech) {
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
    };

    if(aQueryText.length==2){
        var parametro=req.body.queryResult.parameters.comodin;
        parametro= parametro.trim().toLowerCase().replace(':','');
        switch (parametro){
            case 'titulo':
                var nroTitulo = aQueryText[1];
                nroTitulo= nroTitulo.trim().toUpperCase().replace('-','');
                // var ruta = "http://172.17.0.226:8097/api/v1/extranet/movil/reporte/predio?nroTitulo="+nroTitulo;
                var ruta = "http://sinra.inra.gob.bo:8097/api/v1/extranet/movil/reporte/predio?nroTitulo="+nroTitulo;

                request({url:ruta,json:true},function (error, response, body) {
                    if(body.mensajes && body.mensajes.length==0){
                        var nombre = body['parcela']?body['parcela']:'';
                        var superficie = body['supCodCat']?body['supCodCat']:'S/N';
                        var clasificacion = body['clasificacion']?body['clasificacion']:'S/N';
                        speech = 'NOMBRE: '+nombre+". SUPERFICIE: "+superficie+". CLASIFICACION: "+clasificacion;
                    }else{
                        speech = body.mensajes[0].mensaje;
                    }
                    /*return res.json({
                        "fulfillmentText": speech,
                        "fulfillmentMessages": [
                            {
                                "text": {
                                    "text": [speech]
                                }
                            }
                        ],
                        "source": "<webhookinra>"
                    });*/
                    respuesta(res, speech);
                });
                break;
            case 'ci':
                var ci = aQueryText[1];
                ci= ci.trim().toUpperCase().replace('-','');
                // var ruta = "http://172.17.0.226:8097/api/v1/extranet/movil/reporte/beneficiario?documentoIdentidad="+ci;
                var ruta = "http://sinra.inra.gob.bo:8097/api/v1/extranet/movil/reporte/beneficiario?documentoIdentidad="+ci;
                console.log(ruta);

                request({url:ruta,json:true},function (error, response, body) {
                    // console.log(body);
                    // console.log(body['parcela']);
                    if(body.mensajes && body.mensajes.length==0){
                        var nombre = body['nombre1']?body['nombre1']:'S/N';
                        var apellidoPaterno = body['apellidoPaterno']?body['apellidoPaterno']:'S/N';
                        var apellidoMaterno = body['apellidoMaterno']?body['apellidoMaterno']:'S/N';
                        var tipoBeneficiario = body['tipoBeneficiario']?body['tipoBeneficiario']:'S/N';
                        speech = 'NOMBRE: '+nombre+" "+apellidoPaterno+" "+apellidoMaterno+". TIPO DE BENEFICIARIO: "+tipoBeneficiario;
                    }else{
                        speech = body.mensajes[0].mensaje;
                    }
                    respuesta(res, speech);
                });
                break;
            case 'hr':
                var hr = aQueryText[1];
                hr= hr.trim().toUpperCase().replace('-','');
                var aHr = hr.split('/');

                if(aHr.length==2){
                    var numero = aHr[0];
                    var gestion= aHr[1];
                    // var ruta = "http://172.17.0.226:8097/api/v1/extranet/movil/reporte/beneficiario?documentoIdentidad="+ci;
                    var ruta = "http://sinra.inra.gob.bo:8104/api/sinadi/v1/hojaRuta/navegar?tipoDatoBusqueda=BNHG&pagina=0&cantidad=1&datoBusqueda=" +numero+"&datoBusqueda2="+gestion;

                    request({url:ruta,json:true},function (error, response, body) {
                        // console.log(body);
                        // console.log(body['parcela']);
                        if(body.listHojaRuta && body.listHojaRuta.length>0){
                            var referencia = body['listHojaRuta'][0]['referencia']?body['listHojaRuta'][0]['referencia']:'S/N';
                            speech = 'REFERENCIA: '+referencia;
                        }else{
                            speech = "No se encontró hojas de rutas con la información solicitada";
                        }
                        respuesta(res, speech);
                    });
                }else{
                    speech ='El formato de la solicitud no es la correcta';
                    respuesta(res, speech);
                }
                break;
            default:
                speech ='No podemos procesar su solicitud';
                respuesta(res, speech);
                break;
        }
    }else{
        speech ='El formato de la solicitud no es la correcta';
        respuesta(res, speech);
    }

});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
