var path = require("path");
var db = require("../models")

var isAuthenticated = require("../config/middleware/isAuthenticated");

function getPageTitle(page) {
    return 'RulEr | ' + page;
}

function redirectOnError(res, previousPage, message) {
    res.render("error", {
        previous_page: previousPage,
        error_message: message
    })
}

module.exports = function(app) {
    app.get("/", function(req, res) {
        // If the user already has an account send them to the dashboard page
        if (req.user) {
            res.redirect("/dashboard");
        } else {
            res.redirect('/login');
        }
    });

    app.get("/signup", function(req, res) {
        // Check the query string
        // In order for parent to be recognized, they must already be in the system 
        // When teacher adds student, the parent will be entered in the db because they are associated with the student
        // Therefore, teacher must have added their student before parent can sign up
        if (req.query.occupation === "TEACHER") {
            res.render('signup', {
                layout: 'login',
                title: getPageTitle('Sign Up'),
                isTeacher: true,
            });
        } else {
            db.Parent.findAll().then(parents => {
                // console.log(parents);
                res.render('signup', {
                    layout: 'login',
                    title: getPageTitle('Sign Up'),
                    isTeacher: false,
                    parents: parents
                });
            });
        }
    });

    app.get("/login", function(req, res) {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/dashboard");
        }
        res.render('login', {
            layout: 'login',
            title: getPageTitle('Login')
        });
    });

    app.get("/calendar", isAuthenticated, function(req, res) {
        res.render('calendar', {
            title: getPageTitle('Calendar')
        })
    });

    app.get("/addStudent", isAuthenticated, function(req, res) {
        // get all parents
        const teacherId = req.query.teacher_id;
        db.Parent.findAll().then(parents => {
            res.render('addStudent', {
                title: getPageTitle('Add New Student'),
                teacher_id: teacherId,
                parents: parents
            });
        }).catch(err => {
            redirectOnError(res, "/dashboard", err.message);
        });
    })

    app.post("/addStudent", isAuthenticated, function(req, res) {
        console.log(req.body)
        const teacherId = parseInt(req.body.teacher_id);
        const studentName = req.body.student_name;
        // find Parent by parent_name
        db.Parent.findOrCreate({
            where: {
                parent_name: req.body.parent
            }
        }).then(([parent, created]) => {
            return db.Student.create({
                student_name: studentName,
                ParentId: parent.id,
                TeacherId: teacherId
            });
        }).then(() => {
            res.redirect('/dashboard')
        }).catch(err => {
            redirectOnError(res, "/dashboard", err.message);
        })
    })

    app.get("/dashboard", isAuthenticated, function(req, res) {
        console.log(req.user);
        if (req.user.occupation === "TEACHER") {
            // get all students from teacher_id
            db.Teacher.findOne({
                where: {
                    UserId: req.user.id
                }
            }).then(function(teacher) {
                db.Student.findAll({
                    where: {
                        TeacherId: teacher.id
                    }
                }).then(function(students) {
                    return Promise.all(students.map(student => student.getPosts()))
                        // posts is an array of arrays of Posts
                        .then(posts => {
                            const studentsWithComments = students.map((student, i) => {
                                return {
                                    student_name: student.student_name,
                                    id: student.id,
                                    comments: posts[i].map(post => {
                                        return {
                                            date: post.createdAt.toDateString(),
                                            comment: post.comment
                                        }
                                    })
                                };
                            })
                            res.render('dashboard', {
                                title: getPageTitle('Dashboard'),
                                isTeacher: true,
                                name: teacher.teacher_name,
                                teacher_id: teacher.id,
                                students: studentsWithComments
                            });
                        }).catch(err => {
                            console.log(err.message)
                            redirectOnError(res, "/dashboard", err.message)
                        })

                });
            }).catch(function(err) {
                redirectOnError(res, "/dashboard", err.message);
            });
        } else if (req.user.occupation === "PARENT") {
            // get all students from parent_id
            db.Parent.findOne({
                where: {
                    UserId: req.user.id
                }
            }).then(function(parent) {
                db.Student.findAll({
                    where: {
                        ParentId: parent.id
                    }
                }).then(function(students) {
                    return Promise.all(students.map(student => student.getPosts()))
                        // posts is an array of arrays of Posts
                        .then(posts => {
                            const studentsWithComments = students.map((student, i) => {
                                return {
                                    student_name: student.student_name,
                                    id: student.id,
                                    comments: posts[i].map(post => {
                                        return {
                                            date: post.createdAt.toDateString(),
                                            comment: post.comment
                                        }
                                    })
                                };
                            });
                            res.render('dashboard', {
                                title: getPageTitle('Dashboard'),
                                isTeacher: false,
                                name: parent.parent_name,
                                parent_id: parent.id,
                                students: studentsWithComments
                            });
                        })
                });
            }).catch(function(err) {
                redirectOnError(res, "/dashboard", err.message);
            })

        } else {
            redirectOnError(res, "/dashboard", `Occupation ${req.body.occupation} is not a valid occupation!`)
        }
    })

    //page to add a student comment
    app.get("/addComment", isAuthenticated, function(req, res) {
        const teacherId = req.query.teacher_id;
        db.Student.findAll().then(students => {
            res.render('addComment', {
                title: getPageTitle('Add Comment'),
                students: students,
                teacher_id: teacherId
            });
        }).catch(err => {
            redirectOnError(res, "/dashboard", err.message);
        });
    })
}