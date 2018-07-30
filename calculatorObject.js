(function(){
 
	var buttons 		= document.getElementsByTagName("button");
	var input 			= document.getElementById("expression");
	var userInput 		= '';
	var operands 		= ["+","-","*","/","="];
	var userArrayInput 	= [];
	var subtotals 		= [];
	var buttonValue		= '';
	var multipleOperations = false;
	
	function inputToArray (inputValue){
		var data = [];
		var expression = [];

		for(var i=0; i<inputValue.length;i++){
				
			if(operands.indexOf(inputValue[i]) == -1) {
				
				expression.push( inputValue[i] );

			}else{

				data.push( expression );
				expression = [];

				expression.push(inputValue[i]);
				data.push( expression );

				expression = [];
			}
		}

		return data;
	};

	function setUserArrayInput(data)
	{
		for(var i=0; i < data.length; i++ ){
			//convert string data to array
			var arrayData = data[i].join("");
			userArrayInput.push(arrayData);
		}
	};

		function calculate()
	{
		console.log(userArrayInput);
		var operation ='';
		var nextOperationIndex = getNextOperationIndex();
		var isNegativeNumber = isNegative( nextOperationIndex );
		console.log(nextOperationIndex);
		var leftIndex  = nextOperationIndex - 1;
		var rightIndex = nextOperationIndex + 1;

		var lastElement = checkLastElement(leftIndex, rightIndex);
			
		var operation 	= userArrayInput[ nextOperationIndex ];
		var leftValue   = getLeft(leftIndex, operation); 
		
		console.log( "leftIndexis "+ leftIndex + "leftValue" + leftValue )
		

		var rightValue  = getRight(rightIndex, operation); 
		console.log( "rightIndexIs" + rightIndex +"rightValue" + rightValue)

		var valid 	   = validOperands( userArrayInput[leftIndex], userArrayInput[rightIndex] );  

	  switch(operation){
		  	case "*":
  				var result = multiply(leftValue, rightValue);
		 		setSubtotals(valid, result, operation);
		
		  	break;

		  	case "/":
		  		var result = divide(leftValue, rightValue);
		 		setSubtotals(valid, result, operation);

			break;

		 	case "+":
			
				var result = sum(leftValue, rightValue);
				setSubtotals(valid, result, operation);
	
		 	break;

		 	case "-":
				
				var result = sum(leftValue, rightValue);
				setSubtotals(valid, result, operation);
				
		 	break;

		 	default:
		 		alert("UNPROPER REQUEST");
		  }
		
		 //remove elements
		 userArrayInput[nextOperationIndex] = [];
		 userArrayInput[nextOperationIndex - 1] = [] ;
		 userArrayInput[nextOperationIndex + 1] = [] ;

		 //recursive call	
		if(countNonEmptyCells() > 1){
			calculate();
		}	
	}
	
	function isNegative(nextOperationIndex)
	{
		//console.log("next" + nextOperationIndex);
		if(nextOperationIndex > 1){
			var previous = nextOperationIndex - 2;
			var previousOperand = userArrayInput[previous];
			if(previousOperand == "-"){
				return true
			}
		//	console.log( previousOperand)
		}
		return false
	}
	
	
	function getLeft(value,operation)
	{
		/*
			This is shetty.
			If you check number as string value strict  
				 0 === ""//false 
				 0 == "" //true
				 [] === "" //false
				 [] == "" //true
				 
			 
		*/
		console.log(typeof(value) + value);
		console.log(userArrayInput[value]);
		
		// if this strict error
		if( ( (operation === "-") ||(operation == "+") ) && 	(userArrayInput[value] == "") ){
			return 0;
		}			
		
		//if no left value for +
		if( (operation === "+") && ( userArrayInput[value-1] === "") ){
			return subtotals[subtotals.length-1];
		}
		
		if( (operation === "+") && ( userArrayInput[value-1] === "-") ){
			return parseInt(-userArrayInput[value]);
		}
			
		if( (operation === "/") && (userArrayInput[value] == "") )	 {
		
			var leftVal = subtotals[subtotals.length-1]
				//remove last subtotal
				subtotals[subtotals.length-1] = 0;
				return leftVal;
		}
		
		if(  (operation === "*") && (userArrayInput[value] == "") ) {
			
				var leftVal = subtotals[subtotals.length-1]
				//remove last subtotal
				subtotals[subtotals.length-1] = 0;
				return leftVal;
		}
				
		if( ( (operation === "/") || (operation === "*") )	&& ( userArrayInput[value-1] === "-") ){
					
			return parseInt(-userArrayInput[value]);
		}
		
		return parseInt(userArrayInput[value]);
	}
	

	
	function getRight(value,operation)
	{
		
			if(operation === "-"){
				return parseInt(-userArrayInput[value]);
			}
			
			if( (operation === "+") && (userArrayInput[value] == "")){
				console.log("am ajuns");
				return 0;
			}
			
			return parseInt(userArrayInput[value]);
	}

	function setSubtotals( validOperands, result, operation){
		
	
		
		if ( (operation == "*") || (operation == "/") ){
			console.log("este gradul I " + result + " " + operation)
			subtotals.push(result);	
			//check if previous sign is negative
		}
		
		if ( (operation == "-") || (operation == "+") ){
			subtotals.push(result);	
		}
		
		//subtotals.push(result);
		console.log('subotals ' + subtotals)
	}


	
	function checkLastElement(left, right)
	{
		if( (userArrayInput[left]== "") && (userArrayInput[right])=="" ){
			console.log('sunt');
			multipleOperations = true;
		}
	}

	function validOperands(leftValue, rightValue){

		if(  ( leftValue == "")  || (rightValue =="" ) ){
			return  false;
		}else{
			return true;
		}

	}



	function countNonEmptyCells()
	{	
		var counter = 0;
		for(var i= 0; i<userArrayInput.length; i++){
			if (userArrayInput[i] != "")
			{
				counter++;
			}
		}
		return counter;
	}


	function getNextOperationIndex()
	{
		var multiplierExist = 	userArrayInput.indexOf("*") == -1 ? false : true ;  
		var divisionExist	= 	userArrayInput.indexOf("/") == -1 ? false : true ;     
		 	
		 //check if single first grade operator exist	
		var isSingleFirstGradeOperator = getSingleFirstGradeOperator(multiplierExist, divisionExist) ;
		
		//if single frista grade operator exist return single first grade operator
		if(  isSingleFirstGradeOperator != false){
			
			return isSingleFirstGradeOperator ;
		}

		//if multiple first grade operator  exist
		//compare the indexes and return the smallest one
		if( (multiplierExist === divisionExist) && (divisionExist === true) ){
		
			return getFirstGradeOperator();

		}else if( existSecondGradeOperator() ) {

			return getSecondGradeOperator();
		
		}else{
			 alert("no operation found");	
		}
	}


	function existSecondGradeOperator(){
	
		var additionExist	= 	userArrayInput.indexOf("+") == -1 ? false : true ;  	
		var differenceExist = 	userArrayInput.indexOf("-") == -1 ? false : true ;
		
		if( (additionExist) || (differenceExist)) {

			return true;

		}else{

			return false;
		}

	}

	function getSecondGradeOperator()
	{
		var additionExist	= 	userArrayInput.indexOf("+") == -1 ? false : true ; 
 		var differenceExist = 	userArrayInput.indexOf("-") == -1 ? false : true ;

		if( additionExist ){

			return userArrayInput.indexOf("+");

		}else if( differenceExist ){

			return userArrayInput.indexOf("-");
		}

	}


	function getSingleFirstGradeOperator(multiplierExist, divisionExist)
	{
		
		if( (multiplierExist === true) && (divisionExist === false ) ){
			//if only multiplyer exist return multiplier position

			return userArrayInput.indexOf("*");
		
		}else if( (multiplierExist === false) && (divisionExist === true ) ){
			//if only division exist return division position
			return userArrayInput.indexOf("/");
		}

		return false;

	}
 	
 	function getFirstGradeOperator()
 	{
 		var multiplierIndex =  userArrayInput.indexOf("*");
		var divisionIndex   =  userArrayInput.indexOf("/");

 		if( multiplierIndex  < divisionIndex ){

			return multiplierIndex; 

		}else{

			return divisionIndex;
		}

 	}

	function clear()
	{
		userInput = '';
		input.value = '';
		userArrayInput = [];
		subtotals = [];
	
	}
	
	function multiply(left, right)
	{
		return   left * right;
	}

	function divide(left, right)
	{
		
		return   left / right;
	}
	
	function difference(left, right)
	{
		return parseInt(left) -  parseInt(right) ;
	}

	function sum(left, right)
	{
		return left+right ;
	}


	return {

		
		init : function(){
			for(var i=0; i<buttons.length; i++){

				buttons[i].addEventListener("click", function(button){
					
					buttonValue = button.target.innerHTML;
					userInput 	+= buttonValue;
					input.value = userInput;
				
					if( buttonValue === "=" ){
						var data = inputToArray( userInput );
					
						//convert string to number and set userArrayInput
					    setUserArrayInput(data);
						//console.log(userArrayInput);
						calculate();
						//output total 
						var total  = 0;
						
						for(var j = 0; j < subtotals.length ; j++ ){
							total += subtotals[j]
							input.value = total;
						}

						userInput = '';
						userArrayInput = [];
						//clear();				
					}

					if( buttonValue === "C"){
						clear();
					}
				});
			}
		}(),
	}

}());


