$(document).on("click", "button.delete", handlePostDelete);
$(document).on("click", "button.edit", handlePostEdit);

function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id);
  }

  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/cms?post_id=" + currentPost.id;
  }