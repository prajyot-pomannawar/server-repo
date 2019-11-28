var express =  require("express");
var router =  express();
var mysql = require("mysql");
var Joi = require("joi");
var config = require("config");

var connection =  mysql.createConnection({
    host: config.get("host"),
    database:config.get("database"),
    user : config.get("user"),
    password:config.get("password")
});
connection.connect();
router.use(express.json());

router.get("/",(request, response)=>{
    var queryText = "select * from student";
    
    connection.query(queryText,(err, result)=>{
        if(err==null)
            {
                response.send(JSON.stringify(result));
            }
            else{
                response.send(JSON.stringify(err));
            }
    });
});

router.get("/:No",(request, response)=>{
    var queryText = `select * from student where No = ${request.params.No}`;
    connection.query(queryText,(err, result)=>{
        if(err==null)
            {
                response.send(JSON.stringify(result));
            }
            else{
                response.send(JSON.stringify(err));
            }
    });
});


router.post("/",(request, response)=>{
    var validationResult = Validate(request);

    //console.log(validationResult.error);
    if(validationResult.error==null)
    {
            var No = request.body.No;
            var Name = request.body.Name;
            var Marks = request.body.Marks;

            var queryText = `insert into student values(${No}, '${Name}', ${Marks})`;
            connection.query(queryText,(err, result)=>{
            if(err==null)
                {
                    response.send(JSON.stringify(result));
                }
                else{
                    response.send(JSON.stringify(err));
                }
        });
    }
    else{
        response.send(JSON.stringify(validationResult.error));
    }
});


function Validate(request)
{
    var validationschema = 
    {
        No: Joi.number().required(),
        Name:Joi.string().required(),
        Marks: Joi.number().required()
    };
   return Joi.validate(request.body, validationschema)
}

router.put("/:No",(request, response)=>{
    var No = request.params.No;
    var Name = request.body.Name;
    var Marks = request.body.Marks;

    var queryText = `update student set Name='${Name}', Marks= ${Marks} where No=${No}`;
    connection.query(queryText,(err, result)=>{
        if(err==null)
            {
                response.send(JSON.stringify(result));
            }
            else{
                response.send(JSON.stringify(err));
            }
    });
});


router.delete("/:No",(request, response)=>{
    var No = request.params.No;
    var queryText = `delete from student where No = ${No}`;
    connection.query(queryText,(err, result)=>{
        if(err==null)
            {
                response.send(JSON.stringify(result));
            }
            else{
                response.send(JSON.stringify(err));
            }
    });
});

module.exports = router;



