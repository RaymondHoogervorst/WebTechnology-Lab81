$(main);

let sortCol = -1;
let sortAscending = true;

function resetDatabase() {
   $.get("https://wt.ops.labs.vu.nl/api21/0a262ecd/reset");
}

function changeSortPreference(event) {
   //Detecting column to sort
   let prevCol = sortCol;
   sortCol = this.className.charAt(3) - 1;

   //Checking if column is already being sorted
   if (prevCol === sortCol) {
      //If the column is already being sorted, flip the direction
      sortAscending = !sortAscending;
   }
   else {
      //otherwise, initially sort ascending
      sortAscending = true;
      if (prevCol >= 0) {
         this.parentElement.children[prevCol].children[0].innerHTML = "&#9644";
      }
   };
   this.children[0].innerHTML = sortAscending ? "&#9650" : "&#9660";

   sortTable();
}

function sortTable() {
   //Extracting table rows
   $datarows = $(".odd, .even").detach();

   //Sorting according to preferences
   $datarows = $datarows.sort(function(a, b) {
      if ($(a).children().get(sortCol).innerHTML > $(b).children().get(sortCol).innerHTML ^ sortAscending) {
         return 1;
      }
      else {
         return -1;
      }
   });

   //Assigning odd/even classes and placing rows back
   $datarows.each(function(index, value) {
      value.className = (index % 2 === 0) ? "odd" : "even";
      $(".tableheader").after(value);
   });
}

function main() {
   //Reset button detection
   $("#resetButton").click(resetDatabase);

   //Changing sort preferences detection
   $(".tableheader span").parent().click(changeSortPreference);
}
