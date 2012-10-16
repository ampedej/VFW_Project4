/*
Project 4
Edward M Murray Jr
VFW 1210
main js File
*/

//Wait until DOM is ready.
window.addEventListener("DOMContentLoaded", function(){
	
	//getElementsById Function
	function $(x){
		var theElement = document.getElementById(x);
		return theElement;
	}
	
	//Recipe Type Select element
	function makeTypes(){
		var formTag = document.getElementsByTagName("form"),
			selectLi = $('select'),
			selectType = document.createElement('select');
			selectType.setAttribute("id", "rtype");
		for (var i=0, j=recipeTypes.length; i<j; i++){
			var makeOption = document.createElement('option');
			var optText = recipeTypes[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			selectType.appendChild(makeOption);
		}
		selectLi.appendChild(selectType);
	}
	
	//Find value of Category Radio
	function getSelectedRadio(){
		var radios = document.forms[0].category;
		for(var i=0; i<radios.length; i++){
			if(radios[i].checked){
				categoryValue = radios[i].value;
			}
		}
	}
		
	//Toggle Controls Function
	function toggleControls(n){
		switch(n){
			case "on":
				$('recipeForm').style.display = "none";
				$('clear').style.display = "inline";
				$('displayLink').style.display  = "none";
				$('addNew').style.display = "inline";
				break;
			case "off":
				$('recipeForm').style.display = "block";
				$('clear').style.display = "inline";
				$('displayLink').style.display  = "inline";
				$('addNew').style.display = "none";
				$('items').style.display = "none";
				break;
			default:
				return false;
		}
	}
	
	//Store Data Function
	function storeData(key){
		if(!key){
		var id					= Math.floor(Math.random()*100000001);
		}else{
			id = key;
		}
		getSelectedRadio()
		var item				= {};
			item.rname 			= ["Recipe Name:", $('rname').value];
			item.dateadded 		= ["Date Added:", $('dateadded').value];
			item.rating 		= ["Rating:", $('rating').value];
			item.category 		= ["Category:", categoryValue];
			item.rtype 			= ["Recipe Type:", $('rtype').value];
			item.ringredients 	= ["Recipe Ingredients:", $('ringredients').value];
			item.rdirections 	= ["Recipe Directions:", $('rdirections').value];
			
		//Save into local storage
		localStorage.setItem(id, JSON.stringify(item));
		alert("Recipe Saved!");
	}
	
	//Get Data Function
	function getData(){
		toggleControls("on")
		if(localStorage.length === 0){
			alert("There are no recipes stored. Default recipes were added.");
			autoFillData();
		}
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$('items').style.display = "block";
		for(var i=0, length=localStorage.length; i<length; i++){
			var makeLi = document.createElement('li');
			var linksLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var obj = JSON.parse(value);
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			for (var n in obj){
				var makeSubLi = document.createElement('li');
				makeSubList.appendChild(makeSubLi);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubLi.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi); //Create Edit/Delete Links for each item.
		}
	}
	
	//Auto populate local storage
	function autoFillData(){
		for(var n in json){
			var id = Math.floor(Math.random()*100000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}
	
	//Make item Links
	function makeItemLinks(key, linksLi){
	//Edit single item link.
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Recipe";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);
		
		//Line break.
		var breakTag = document.createElement('br');
		linksLi.appendChild(breakTag);
		
		//Delete single item link.
		var deleteLink = document.createElement('a');
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete This recipe";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink)
	}
	
	//Edit item
	function editItem(){
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		
		//Show form
		toggleControls("off");
		//Could click on display while editing and it would show item twice even though it wasn't saved twice,
		//Turned display link off when editing an item to prevent issue.
		displayLink.style.display  = "none";
		
		//Populate form with existing data
		$('rname').value = item.rname[1];
		$('dateadded').value = item.dateadded[1];
		$('rating').value = item.rating[1];
		var radios = document.forms[0].category;
		for(var i=0; i<radios.length; i++){
			if(radios[i].value == "Meat" && item.category[1] == "Meat"){
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Pasta" && item.category[1] == "Pasta"){
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Soup" && item.category[1] == "Soup"){
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Dessert" && item.category[1] == "Dessert"){
				radios[i].setAttribute("checked", "checked");
			}
		}	
		$('rtype').value = item.rtype[1];
		$('ringredients').value = item.ringredients[1];
		$('rdirections').value = item.rdirections[1];
		
		//Remove initial listener.
		save.removeEventListener("click", storeData);
		$('submit').value = "Edit Recipe";	
		var editSubmit = $('submit');
		//Save key value established in this function.
		//Use that value when we save the data.
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
	}
	
	function deleteItem(){
		var ask = confirm("Are your sure you want to delete this recipe?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Recipe was deleted!");
			window.location.reload();
		}else{
			alert("Recipe was NOT deleted.");
		}
	}
	
	//Clear Local Function
	function clearLocal(){
		if(localStorage.length === 0){
			alert("No recipes to clear.");
		}else{
			localStorage.clear();
			alert("All recipes have been deleted!");
			window.location.reload();
			return false;
		}
	}
	
	//Validate form function
	function validate(e){
		var getRname = $('rname');
		var getRtype = $('rtype');
		var getRingredients = $('ringredients');
		var getRdirections = $('rdirections');
		
		//Reset error messages
		errMsg.innerHTML = "";
		getRname.style.border = "1px solid black";
		getRtype.style.border = "1px solid black";
		getRingredients.style.border = "1px solid black";
		getRdirections.style.border = "1px solid black";
		
		//Error messages
		var messageAry = [];
		//Recipe name validation
		if (getRname.value === ""){
			var rNameError = "Please give this recipe a name!";
			getRname.style.border = "1px solid red";
			messageAry.push(rNameError);
		}
		//Recipe type validation
		if (getRtype.value === "--Meats--" || getRtype.value === "--Pasta--" || getRtype.value === "--Soup--" || getRtype.value === "--Dessert--"){
			var rTypeError = "Please choose recipe type.";
			getRtype.style.border = "1px solid red";
			messageAry.push(rTypeError);
		}
		//Recipe Ingredients validation
		if (getRingredients.value === ""){
			var rIngredientsError = "Please provide recipe ingredients!";
			getRingredients.style.border = "1px solid red";
			messageAry.push(rIngredientsError);
		}
		//Recipe directions validation
		if (getRdirections.value === ""){
			var rDirectionsError = "Please provide recipe directions!";
			getRdirections.style.border = "1px solid red";
			messageAry.push(rDirectionsError);
		}
		//If error messages, display on screen
		if(messageAry.length >= 1){
			for (var i = 0, j = messageAry.length; i < j; i++){
				var txt = document.createElement('li');
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			e.preventDefault();
			return false;
		}else{
			storeData(this.key);
		}
	}
	
	//Variable Defaults
	var recipeTypes = ["--Meats--", "Chicken", "Beef", "Pork", "Fish", "--Pasta--", "Spaghetti", "Lasagna", "Pasta Salad", "Ravioli", "--Soups--", "Chili", "Chowder", "Stew", "Seafood", "--Dessert--", "Cake", "Cookies", "Pie", "Mousse"],
		categoryValue,
		errMsg = $('errors');
	makeTypes();
	
	//Link & click submit events.
	var displayLink = $('displayLink');
	displayLink.addEventListener("click", getData);
	var clearLink = $('clear');
	clearLink.addEventListener("click", clearLocal);
	var save = $('submit');
	save.addEventListener("click", validate);
	
});
