$(document).ready(function(){

  var nameInput = $("#parent_name");
  var parentList = $("#parentdivbody");
  var parentContainer = $(".parent-container");


$(document).on("submit", "#parent-form", handleParentFormSubmit);
$(document).on("click", ".delete-parent", handleDeleteButton);

getParent();

function handleParentFormSubmit(event){
  event.preventDefault();

  if(!nameInput.val().trim().trim()){
      return;
  }

  upsertParent ({
      parent_name: nameInput.val().trim()
  });
}

function upsertParent(parentData){
  $.post("/api/parents", parentData)
  .then(getParent);
}

//create a new list of teachers

function createParentRow(parentData){
  var newParentDiv = $("<tr>");
  newParentDiv.data("parent", parentData);
  newParentDiv.append("<td>" + parentData.parent_name + "</td>");
  newParentDiv.append("<td><a class='delete-parent waves-effect waves-light btn deep-orange lighten-2'> Delete </a></td> <br><br>");
  return newParentDiv;
}

//retrieve teacher, get them ready to render on page
function getParent(){
  $.get("/api/parents", function(data){
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++){
          rowsToAdd.push(createParentRow(data[i]));
      }
      renderParentList(rowsToAdd);
      nameInput.val("");
  });
}

//render list of authors
function renderParentList(rows){
  parentList.children().not(":last").remove();
  parentContainer.children(".alert").remove();
  if(rows.length){
      console.log(rows);
      parentList.prepend(rows);
  }
  else {
      renderEmpty();
  }
}

//display when there are no teachers
function renderEmpty() {
  var pleaseCreate = $("<div>");
  pleaseCreate.text("Please create a Parent");
  teacherContainer.append(pleaseCreate);
}

function handleDeleteButton() {
  var listItemData = $(this).parent().parent().data("parent");
  var id = listItemData.id;
  $.ajax({
      method: "DELETE",
      url: "/api/parents/" + id
  }).then(getParent);
}

});