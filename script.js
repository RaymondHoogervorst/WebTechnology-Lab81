$(main);

function resetDatabase() {
   $.get("https://wt.ops.labs.vu.nl/api21/0a262ecd/reset");
}

function main() {
   //Reset button detection
   $("#resetButton").click(resetDatabase);
}
