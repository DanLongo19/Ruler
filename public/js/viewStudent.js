$(document).ready(function() {

var viewContainer = $(".view-container");
var postCategorySelect = $("#comments"); 

//holds posts/reviews of student
var reviews;

var url = window.location.search;
var parentId;

//reviews assigned to a specific parent id

if(url.indexOf("?parent_id=") !== -1) {
    parentId = url.split("=")[1];
    getReviews(parentId);
}
else {
    getReviews();
}

//grabs posts/comments from database to updatew view on viewStudent page
function getReviews(parent) {
    parentId = parent || "";
    if (parentId){
        parentId = "?/parent_id=" + parentId;
    }
    $.get("/api/students" + parentId, function(data){
        console.log("Reviews", data);
        reviews = data;
        if(!reviews || !reviews.length){
            displayEmpty(parent); //this is a message to display that there are no reviews
        }
        else {
            initializeRows();
        }
});
}

//should the parent be able to delete post or should that be just the teacher?

//appends reviews/posts to the inside of the view-container using the var viewContainer
function initializeRows(){
viewContainer.empty();
reviewsToAdd = [];
for (var i=0; i < reviews.length; i++){
reviewsToAdd.push(createNewRow(reviews[i]));
}
viewContainer.append(reviewsToAdd);
}

function createNewRow(review) {
var formattedDate = new Date(review.createdAt);
formattedDate = moment(formattedDate).format ("MMMM Do YYYY, h:mm:ss a");
var newPost = $("<div>");
var newStudent = $("<p>");
var newStudentName = $("<h5>");
newStudentName.text("Student Name: " + review.Admin.student_name)
var newComment = $("<p>");

var addNewComment = $("<h5>");
addNewComment.text("Comment: " + review.Admin.comments)
var newPostTitle = $("<h5>");
var newPostDate = $("<small>");
var newReviewCard = $("<div>");
newPostDate.text(formattedDate);
newPostTitle.append(newPostDate);


newComment.append(addNewComment);
newStudent.append(addStudentName);
newPost.append(newPostTitle);
newPost.append(newComment);
newPost.append(newStudent);

newReviewCard.append(newPost)
newReviewCard.data("review", review)

return newReviewCard;

}




})