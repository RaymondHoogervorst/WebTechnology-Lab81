$(main);

const months = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December'
];

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
      a = $(a).children().get(sortCol).innerHTML;
      b = $(b).children().get(sortCol).innerHTML;
      
      //special sort for date
      if(sortCol === 2) {
         var isFirstBigger;
         a = a.split(' ');
         b = b.split(' ');
         if (a[1] > b[1]) {
            isFirstBigger = true;
         }
         else if (a[1] < b[1]) {
            isFirstBigger = false;
         }
         else {
            isFirstBigger = months.indexOf(a[0]) > months.indexOf(b[0]);
         }

      }

      //sort for text
      else {
         isFirstBigger = a > b;
      }

      return (isFirstBigger ^ sortAscending) ? 1 : -1
   });

   //Assigning odd/even classes and placing rows back
   $datarows.each(function(index, value) {
      value.className = (index % 2 === 0) ? "odd" : "even";
      $(".tableheader").after(value);
   });
}

function downloadDatabase() {

   console.log("downloading");

   $.ajax({
      url: "https://wt.ops.labs.vu.nl/api21/0a262ecd",
      success: function(data) {
         $(".odd, .even").remove();

         for (let item of data) {
            let newRow = $('<tr class="odd"></tr>');
            newRow.append('<td class="col1">' + item.product + '</td>');
            newRow.append('<td class="col2">' + item.origin + '</td>');
            newRow.append('<td class="col3">' + item.best_before_date + '</td>');
            newRow.append('<td class="col4">' + item.amount + '</td>');
            let image = '<img src="' + item.image + '", alt="' + item.product + '">';
            newRow.append('<td class="col5">' + image + '</td>');
            $(".tableheader").after(newRow);
         }

         sortTable();
      },
      dataType: "json"
   });
}

function uploadToDatabase(event) {
   product = $(".col1 input").val();
   origin = $(".col2 input").val();
   date = $(".col3 input").val();
   amount = $(".col4 input").val();
   image = $(".col5 input").val();

   let itemObject = { "product":product, "origin":origin, "best_before_date":date, "amount":amount, "image":image };
   let itemJson = JSON.stringify(itemObject);

   console.log(itemJson);

   //TODO: not yet working
   $.ajax({
      type: "POST",
      url: "https://wt.ops.labs.vu.nl/api21/0a262ecd",
      data: itemJson,
      dataType: "json",
      success: downloadDatabase()
   });

   event.preventDefault();
}

function main() {

   //loading initial database
   downloadDatabase();

   //Reset button detection
   $("#resetButton").click(resetDatabase);

   //Changing sort preferences detection
   $(".tableheader span").parent().click(changeSortPreference);

   //Form submission detection
   $("form").submit(uploadToDatabase);
}
