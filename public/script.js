var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};



let buttonCalc = document.getElementById("calcPrice");

buttonCalc.addEventListener("click", () => {
let insurance = document.getElementById("insure").value;
let totalDays = document.getElementById("totalDays").value;
let totalPriceInput = document.getElementById("totalPrice");
let totalPrice = document.getElementById("day").value;
let totalPriceNumber = parseInt(totalPrice);
let totalPriceForDays = parseInt(totalDays)*totalPriceNumber;
	totalPriceInput.value = totalPriceForDays + parseInt(insurance);
});

















