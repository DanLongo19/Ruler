$(document).ready(function() {
    var bodyInput = $("#comment");
    var studentInput = $("#student_name");
    var studentForm = $("#student-form");
    var parentSelect = $("#parent");
    // Adding an event listener for when the form is submitted
    $(studentForm).on("submit", handleFormSubmit);
    // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
    var url = window.location.search;
    var postId;
    var parentId;
    // Sets a flag for whether or not we're updating a post to be false initially
    var updating = false;

    // If we have this section in our url, we pull out the post id from the url
    // In '?post_id=1', postId is 1
    if (url.indexOf("?post_id=") !== -1) {
        postId = url.split("=")[1];
        getPostData(postId, "post");
    }
    // Otherwise if we have an author_id in our url, preset the author select box to be our Author
    else if (url.indexOf("?parent_id=") !== -1) {
        parentId = url.split("=")[1];
    }

    // Getting the authors, and their posts
    getParents();

    // A function for handling what happens when the form to create a new post is submitted
    function handleFormSubmit(event) {
        event.preventDefault();
        // Wont submit the post if we are missing a body, title, or author
        if (!bodyInput.val().trim() || !studentInput.val().trim() || !parentSelect.val()) {
            return;
        }
        // Constructing a newPost object to hand to the database
        var newPost = {
            student_name: studentInput
                .val()
                .trim(),
            comment: bodyInput
                .val()
                .trim(),
            ParentId: parentSelect.val()
        };

        // If we're updating a post run updatePost to update a post
        // Otherwise run submitPost to create a whole new post
        if (updating) {
            newPost.id = postId;
            updatePost(newPost);
        } else {
            submitPost(newPost);
        }
    }

    // Submits a new post and brings user to blog page upon completion
    function submitPost(post) {
        $.post("/api/posts", post, function() {
            window.location.href = "/blog";
        });
    }

    // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
    function getPostData(id, type) {
        var queryUrl;
        switch (type) {
            case "post":
                queryUrl = "/api/posts/" + id;
                break;
            case "parents":
                queryUrl = "/api/parents/" + id;
                break;
            default:
                return;
        }
        $.get(queryUrl, function(data) {
            if (data) {
                console.log(data.ParentId || data.id);
                // If this post exists, prefill our cms forms with its data
                titleInput.val(data.student_name);
                bodyInput.val(data.comment);
                parentId = data.ParentId || data.id;
                // If we have a post with this id, set a flag for us to know to update the post
                // when we hit submit
                updating = true;
            }
        });
    }

    // A function to get Authors and then render our list of Authors
    function getParents() {
        $.get("/api/parents", renderParentList);
    }
    // Function to either render a list of authors, or if there are none, direct the user to the page
    // to create an author first
    function renderParentList(data) {
        if (!data.length) {
            window.location.href = "/parents";
        }
        $(".hidden").removeClass("hidden");
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createParentRow(data[i]));
        }
        parentSelect.empty();
        console.log(rowsToAdd);
        console.log(parentSelect);
        parentSelect.append(rowsToAdd);
        parentSelect.val(parentId);
    }

    // Creates the author options in the dropdown
    function createParentRow(parent) {
        var listOption = $("<option>");
        listOption.attr("value", parent.id);
        listOption.text(parent.parent_name);
        return listOption;
    }

    // Update a given post, bring user to the blog page when done
    function updatePost(post) {
        $.ajax({
                method: "PUT",
                url: "/api/posts",
                data: post
            })
            .done(function() {
                window.location.href = "/cms";
            });
    }
});