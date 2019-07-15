$(document).ready(function(){

  var nameInput = $("#teacher_name");
  var teacherList = $("#divbody");
  var teacherContainer = $(".teacher-container");


$(document).on("submit", "#teacher-form", handleTeacherFormSubmit);
$(document).on("click", ".delete-teacher", handleDeleteButton);

getTeachers();

function handleTeacherFormSubmit(event){
  event.preventDefault();

  if(!nameInput.val().trim().trim()){
      return;
  }

  upsertTeacher ({
      teacher_name: nameInput.val().trim()
  });
}

function upsertTeacher(teacherData){
  $.post("/api/teachers", teacherData)
  .then(getTeachers);
}

//create a new list of teachers

function createTeacherRow(teacherData){
  var newTeacherDiv = $("<tr>");   
    newTeacherDiv.data("teacher", teacherData);
    newTeacherDiv.append("<td>" + teacherData.teacher_name + "</td>");
    newTeacherDiv.append("<td><a class='delete-teacher waves-effect waves-light btn deep-orange lighten-2'> Delete </a></td>");
    return newTeacherDiv;
}

//retrieve teacher, get them ready to render on page
function getTeachers(){
  $.get("/api/teachers", function(data){
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++){
          rowsToAdd.push(createTeacherRow(data[i]));
      }
      renderTeacherList(rowsToAdd);
      nameInput.val("");
  });
}

function renderTeacherList(rows){
  teacherList.children().not(":last").remove();
  teacherContainer.children(".alert").remove();
  if(rows.length){
      console.log(rows);
      teacherList.prepend(rows);
  }
  else {
      renderEmpty();
  }
}

//display when there are no teachers
function renderEmpty() {
  var pleaseCreate = $("<div>");
  pleaseCreate.text("Please create a Teacher.");
  teacherContainer.append(pleaseCreate);
}

function handleDeleteButton() {
  var listItemData = $(this).parent().parent().data("teacher");
  var id = listItemData.id;
  $.ajax({
      method: "DELETE",
      url: "/api/teachers/" + id
  }).then(getTeachers);
}

});