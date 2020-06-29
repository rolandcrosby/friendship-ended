const app = new Vue({
  el: "#app",
  data: {
    personA: "person A",
    personB: "person b",
    capitalize: true,
    bgImage: "",
    leftImage: "",
    rightImage: "",
    imageHandles: {
      bg: null,
      left: null,
      right: null
    }
  },
  computed: {
    textA: function() {
      return this.capitalize ? this.personA.toUpperCase() : this.personA;
    },
    textB: function() {
      return this.capitalize ? this.personB.toUpperCase() : this.personB;
    },
    defaultImage: function() {
      return "linear-gradient(0deg, #111, #999)";
    },
    bgImageProp: function() {
      if (this.bgImage) {
        return `url(${this.bgImage})`;
      }
      return this.defaultImage;
    },
    leftImageProp: function() {
      if (this.leftImage) {
        return `url(${this.leftImage})`;
      }
      return this.defaultImage;
    },
    rightImageProp: function() {
      if (this.rightImage) {
        return `url(${this.rightImage})`;
      }
      return this.defaultImage;
    }
  },
});

// this is basically all from MDN examples
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
// https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications

document.body.addEventListener("dragover", e => {
  e.preventDefault();
});
document.body.addEventListener("drop", e => {
  e.preventDefault();
  console.log(e.target);
  if (e.dataTransfer.items) {
    for (var i = 0; i < e.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (e.dataTransfer.items[i].kind === "file") {
        var file = e.dataTransfer.items[i].getAsFile();
        handleFile(file, 'bg');
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      handleFile(e.dataTransfer.files[i]);
    }
  }

  // Pass event to removeDragData for cleanup
  if (e.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    e.dataTransfer.items.clear();
  } else {
    // Use DataTransfer interface to remove the drag data
    e.dataTransfer.clearData();
  }
});

function handleFile(file, slotName) {
  if (!file.type.startsWith("image/")) {
    return;
  }
  app.imageHandles[slotName] = file;

  const reader = new FileReader();
  reader.onload = function(e) {
    app[slotName + "Image"] = e.target.result;
  }
  reader.readAsDataURL(file);
}

function updateHandle(el) {
  document.getElementById("handle").innerHTML = el.value;
}

document.addEventListener('dragenter', function(e) {console.log(e);});

var inputs = document.querySelectorAll(".fileField input");
inputs.forEach(function(input) {
  input.addEventListener("change", function(e) {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0], e.target.name);
    }
  })
});