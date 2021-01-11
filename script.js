$(main);

let sortCol = -1;
let sortAscending = true;

function resetDatabase() {
   $.get("https://wt.ops.labs.vu.nl/api21/0a262ecd/reset");
}

function changeSortPreference(event) {

   //Detecting column to sort
   let prevCol = sortCol;
   sortCol = event.target.className.charAt(3) - 1;

   //Checking if column is already being sorted
   if (prevCol === sortCol) {
      sortAscending = !sortAscending;
   }
   else {
      sortAscending = true;
      if (prevCol >= 0) {
         console.log(prevCol);
         event.target.parentElement.children[prevCol].children[0].innerHTML = "&#9644";
      }
   };
   event.target.children[0].innerHTML = sortAscending ? "&#9650" : "&#9660";
}

function main() {
   //Reset button detection
   $("#resetButton").click(resetDatabase);

   //Changing sort preferences detection
   $(".tableheader span").parent().click(changeSortPreference);
}
