const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


// PAGE LOADING DEFAULT VALUE 
let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
// SET PASS STRENGTH INDICATOR COLOUR 
setIndicator("#ccc");




// PASS LENGTH SET ACCORDING TO THE MOVEMENT OF THE SLIDER
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // ADDING TO MANAGE THE COLOR OF THE SLIDER 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}


// TO SET COLOR OF INDICATOR
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // SET SHADOW 
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// TO GET RANDOM INTEGER
function getRndInteger(min , max){
    return Math.floor(Math.random() * (max - min)) + min;
}

// TO GET RANDOM NUMBER
function generateRandomNumber(){
    return getRndInteger(0 , 9);
}

// TO GET RANDOM LOWERCASE CHARACTER
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

// TO GET RANDOM UPPERCASE CHARACTER
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

// TO GET RANDOM SYMBOLS 
function generateSymbol(){
    const randNum = getRndInteger(0 , symbols.length);
    return symbols.charAt(randNum);
}   

// CALC THE STRANGTH OF THE PASSWORD 
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

// COPY CONTENT FUNCTION 
async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000)
}


inputSlider.addEventListener('input' , (e) => { 
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // HANDLING SPECIAL CASE 
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange);
})


function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


generateBtn.addEventListener('click' , () => {
    if(checkCount == 0) 
        return ;

    console.log("generate button function called")

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //START TO FIND NEW PASS
    password = "";

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // COMPULSORY ADDITION OF THE FUNCTION 
    for(let i = 0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    // RANDOM ADDITION FROM THE SELECTED CHECKBOXES
    for(let i =0;i<passwordLength - funcArr.length;i++){
        let randindex = getRndInteger(0,funcArr.length);
        password += funcArr[randindex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    // CALCULATE THE STRENGTH OF THE PASSWORD
    calcStrength();

})