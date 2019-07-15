var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {

    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        console.log("LOGGIN IN")
        res.redirect("/dashboard");
    });

    app.post("/api/signup", function(req, res) {
        console.log(req.body);
        if (req.body.occupation == "TEACHER") {
            const teacherName = req.body.user_name;
            const email = req.body.email;
            const password = req.body.password;
            // make user
            db.User.create({
                email: email,
                password: password,
                occupation: "TEACHER"
            }).then(function(user) {
                // make teacher and associate with user
                db.Teacher.create({
                    teacher_name: teacherName
                }).then(function(teacher) {
                    teacher.setUser(user);
                    res.redirect(307, "/api/login");
                }).catch(function(err) {
                    console.log(err);
                    // res.json(err);
                    // handle this error
                });

            }).catch(function(err) {
                console.log(err);
                // res.json(err);
                // handle this error
            });

        } else if (req.body.occupation == "PARENT") {
            const parentId = parseInt(req.body.parent_id);
            const email = req.body.email;
            const password = req.body.password;
            // make user
            db.User.create({
                email: email,
                password: password,
                occupation: "PARENT"
            }).then(function(user) {
                // find parent and associate with user
                db.Parent.findByPk(parentId).then(function(parent) {
                    parent.setUser(user);
                    res.redirect(307, "/api/login");
                }).catch(function(err) {
                    console.log(err);
                    // res.json(err);
                    // handle this error
                });
            }).catch(function(err) {
                console.log(err);
                // res.json(err);
                // handle this error
            });

        } else {
            // something is VERY wrong ERROR and let user know
            console.log(`Occupation ${req.body.occupation} is not a valid occupation!`)
            res.redirect("/login");
        }
    });

    app.get("/api/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

    app.post("/api/addComment", function(req, res) {
        const teacherId = parseInt(req.body.teacher_id);
        const studentId = parseInt(req.body.student_id);
        const comment = req.body.comment;

        db.Post.create({
            comment: comment,
            TeacherId: teacherId,
            StudentId: studentId
        }).then(() => {
            res.redirect("/dashboard");
        }).catch(err => {
            // let user know something went wrong
        })
    });
};