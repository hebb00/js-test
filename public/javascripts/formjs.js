console.log("yo")
var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab
function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.querySelectorAll(".tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.querySelector("#prevBtn").style.display = "none";
  } else {
    document.querySelector("#prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.querySelector("#nextBtn").innerHTML = "Submit";
  } else {
    document.querySelector("#nextBtn").innerHTML = "Next";
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
  console.log("showtabend");
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.querySelectorAll(".tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.querySelector("#product-form").submit();
    return false;
  }
  console.log("nextprev");
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.querySelectorAll(".tab");
  y = x[currentTab].querySelectorAll("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.querySelectorAll(".step")[currentTab].className += " finish";
  }
  console.log("valid");
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.querySelectorAll(".step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
  console.log("fixstep");
}
