let display = document.getElementById('display');
let currentOperand = '';
let previousOperand = '';
let operation = undefined;

document.addEventListener('keydown', handleKeyPress);

function clearDisplay() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    currentOperand = currentOperand.toString() + number.toString();
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        calculate();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
}

function calculate() {
    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current === 0 ? 'Error' : prev / current;
            break;
        default:
            return;
    }
    currentOperand = result;
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

function updateDisplay() {
    display.innerText = currentOperand;
}

function square() {
    if (currentOperand === '') return;
    currentOperand = Math.pow(parseFloat(currentOperand), 2);
    updateDisplay();
}

function power() {
    if (currentOperand === '') return;
    let exponent = prompt('Įveskite n:');
    currentOperand = Math.pow(parseFloat(currentOperand), parseFloat(exponent));
    updateDisplay();
}

function sqrt() {
    if (currentOperand === '') return;
    currentOperand = Math.sqrt(parseFloat(currentOperand));
    updateDisplay();
}

function cuberoot() {
    if (currentOperand === '') return;
    currentOperand = Math.cbrt(parseFloat(currentOperand));
    updateDisplay();
}

function factorial() {
    if (currentOperand === '') return;
    let num = parseInt(currentOperand);
    let result = 1;
    for (let i = 1; i <= num; i++) {
        result *= i;
    }
    currentOperand = result;
    updateDisplay();
}

function handleKeyPress(event) {
    const key = event.key;
    const button = document.querySelector(`button[data-key="${key}"]`);
    if (button) {
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 200);
    }
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        chooseOperation(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        currentOperand = currentOperand.toString().slice(0, -1);
        updateDisplay();
    }
}