function formGen(element) {
  var formContent = `
      <form id="edit-todo-form-${element.id}" class="form-control p-5 h-100" method="post" enctype=multipart/form-data>
          <label for="title">Title:</label><br />
          <input
            class="form-control"
            type="text"
            id="title"
            value="${element.title}"
            name="title"
          /><br />
          <label for="content">Content:</label><br />
          <input
            class="form-control"
            type="text"
            id="content"
            value="${element.content}"
            name="content"
          /><br />
          <img class="rounded mx-auto" src="${element.image}" style="width:100%; height:40%; object-fit:cover;">
          <label for="image">Image:</label>
          <input
            class="form-control"
            type="file"
            id="image"
            value="${element.image}"
            name="image"
          /><br />

          <div class="row">
            <div class="col">
              <button class="btn btn-primary w-100 edit-todo" data-todo-id="${element.id}">Edit</button>
            </div>

            <div class="col">
              <button class="btn btn-danger w-100 delete-todo" data-todo-id="${element.id}">Delete</button>
            </div>

          <div>
        </form>`;
  return formContent;
}

function getTodos() {
  $.ajax({
    url: "/api/todo/list/",
    type: "GET",
    dataType: "json",
    success: function (data) {
      var dataContainer = $("#data-container");
      dataContainer.empty();
      // console.log(data);

      data.forEach((element) => {
        htmlContent = `
          <div class="col-md-4 my-2">
            ${formGen(element)}
          </div>
        `;
        dataContainer.append(htmlContent);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
}

$(document).ready(function () {
  // calling the function to get todo items
  getTodos();

  // Edit
  $("#data-container").on("click", ".edit-todo", function (e) {
    e.preventDefault(); // Prevent the default link behavior if it's an anchor tag
    var todoId = $(this).data("todo-id");
    var form = $(`#edit-todo-form-${todoId}`);
    console.log(todoId);

    // Create a FormData object to handle file uploads
    var formData = new FormData(form[0]);

    // Check if the image input has a selected file
    var imageInput = form.find('input[type="file"]');
    var selectedImageFile = imageInput[0].files[0];
    if (!selectedImageFile) {
      // If no image file selected, remove the "image" field from formData
      formData.delete("image");
    }
    console.log(formData);

    $.ajax({
      url: `/api/todo/${todoId}/`,
      type: "PUT",
      data: formData,
      dataType: "json",
      contentType: false, // Set to false to prevent jQuery from processing the data
      processData: false, // Set to false to prevent jQuery from automatically converting data to string
      success: function (data) {
        console.log("Todo item updated:", data);

        getTodos();
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  });

  // Delete
  $("#data-container").on("click", ".delete-todo", function (e) {
    e.preventDefault();

    var todoId = $(this).data("todo-id");
    console.log(todoId);

    if (confirm("Are you sure you want to delete this todo item?")) {
      $.ajax({
        url: `/api/todo/${todoId}/`,
        type: "DELETE",
        dataType: "json",
        success: function (data) {
          console.log(`Todo item deleted with ID: ${todoId}`);
          getTodos();
        },

        error: function (xhr, status, error) {
          console.error("Error:", error);
        },
      });
    }
  });

  // Create new Todo
  $("#new-todo-form").submit(function (e) {
    e.preventDefault(); // Prevent the default form submission
    var formData = new FormData(this);
    console.log(formData);

    $.ajax({
      url: "/api/todo/create/",
      type: "POST",
      data: formData,
      dataType: "json",
      contentType: false,
      processData: false,
      success: function (data) {
        // Clear the form
        $("#title").val("");
        $("#content").val("");
        $("#image").val("");

        getTodos();
      },
      error: function (xhr, status, error) {
        console.log("Error:", error);
      },
    });
  });
});
