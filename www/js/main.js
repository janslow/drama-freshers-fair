var checkForm;
(function () {
  if (!window.localStorage || !window.applicationCache) {
    alert("This page only works on modern browsers. Try in Chrome, Firefox or Safari");
  }
  var fields = {
    "name": {
      "input": $("#name"),
      "required": true
    },
    "email": {
      "input": $("#email"),
      "required": true
    },
    "college": {
      "input": $("#college"),
      "required": true,
      "validation": function (field, value) {
        if (value === "null") {
          return "Please select your college.";
        } else {
          return true;
        }
      }
    }
  };
  $.each(["watching", "acting", "directing", "producing", "marketing", "sm-pm", "lx-sound", "design", "musician"], function (i, interest) {
    fields["interest-" + interest] = {
      "input": $("#interest-" + interest),
      "process": function (field, value) {
        return field.input[0].checked;
      }
    };
  });

  $.each(fields, function (name, field) {
    field.name = name;

    field.value = function () {
      var value = field.input.val();
      if (field.process) {
        value = field.process(field, value);
      }
      return value;
    };

    field.validateValue = function (value) {
      var errors = [];
      if (field.required && (value === "" || !value)) {
        errors.push({
          "field": field,
          "message": "Please enter your " + name + "." 
        });
      }
      if (field.validation) {
        var customValidation = field.validation(field, value);
        if (customValidation !== true) {
          errors.push({
            "field": field,
            "message": customValidation
          });
        }
      }
      return errors;
    };
  });

  var entries;
  if (window.localStorage.getItem("entries")) {
    entries = JSON.parse(window.localStorage.getItem("entries"));
  } else {
    entries = [];
  }
  function storeEntry(entry) {
    entries.push(entry);
    window.localStorage.setItem("entries", JSON.stringify(entries));
  }

  checkForm = function () {
    var errors = [];
    var result = {};
    
    $.each(fields, function (name, field) {
      var value = field.value();

      errors.push.apply(errors, field.validateValue(value));

      result[name] = value;
    });

    var messagesElement = $("#messages").empty();
    if (errors.length > 0) {
      $.each(errors, function (i, error) {
        $("<div>").addClass("error").text(error.message).data("error", error).appendTo(messagesElement);
      });
      return false;
    } else {
      return result;
    }
  };

  $(function () {
    $("form").submit(function (e) {
      e.preventDefault();

      var result = checkForm();
      if (result) {
        var completeMessage = $("<div>").addClass("complete").text("Added '" + result.name + "'.").appendTo("#messages");
        setTimeout(function () {
          completeMessage.hide();
        }, 3000);
        $("#resetButton").click();
        console.log(result);
        storeEntry(result);
      } else {
        return;
      }
    });
  });
}());
