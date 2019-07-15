var db = require("../models")

module.exports = function(app){

 
    app.get("/api/teachers", function(req, res){
        db.Teacher.findAll({
            include: [db.Post],
        }).then(function(dbTeacher){
            console.log(dbTeacher)
            res.json(dbTeacher);
        });
    });

    app.get("/api/teachers/:id", function(req, res){
        db.Teacher.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Post]
        }).then(function(dbTeacher){
            res.json(dbTeacher);
        });
    });

    app.post("/api/teachers", function(req, res){
        console.log("display message if worked")
        db.Teacher.create(req.body).then(function(dbTeacher){
            res.json(dbTeacher);
        });
    });

    app.delete("/api/teachers/:id", function(req, res){
        db.Teacher.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbTeacher){
            res.json(dbTeacher);
        });
    });



};