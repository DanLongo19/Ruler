var db = require("../models")

module.exports = function(app) {

    app.get("/api/parents", function(req, res) {
        db.Parent.findAll({
            include: [db.Post],
        }).then(function(dbParent) {
            // console.log(dbParent)
            res.json(dbParent);
        });
    });

    app.get("/api/parents/:id", function(req, res) {
        db.Parent.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Post]
        }).then(function(dbParent) {
            res.json(dbParent);
        });
    });

    app.post("/api/parents", function(req, res) {
        db.Parent.create(req.body).then(function(dbParent) {
            res.json(dbParent);
        });
    });

    app.delete("/api/parents/:id", function(req, res) {
        db.Parent.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbParent) {
            res.json(dbParent);
        });
    });

}