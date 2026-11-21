const output = document.getElementById("output");
const historyDisplay = document.getElementById("history");
const keys = document.getElementById("keys");

let current = "0";
let previous = null;
let operator = null;
let waitingForNumber = false;
let historyText = "";
// Display update
function updateDisplay() {
    output.textContent = current;
    historyDisplay.textContent = historyText;
}
// Number input
function inputNumber(num) {
    if (waitingForNumber) {
        current = num === "." ? "0." : num;
        waitingForNumber = false;
        return;
    }

    if (num === "." && current.includes(".")) return;

    if (current === "0" && num !== ".") {
        current = num;
    } else {
        current += num;
    }
}

// Choose operator
function chooseOperator(op) {
    const value = parseFloat(current);

    if (operator && !waitingForNumber) {
        calculate();
    } else {
        previous = value;
    }

    operator = op;
    waitingForNumber = true;
    historyText = `${previous} ${operator}`;
}

// Calculate result
function calculate() {
    if (operator === null || previous === null) return;

    const second = parseFloat(current);
    let result;

    switch (operator) {
        case "+":
            result = previous + second;
            break;

        case "-":
            result = previous - second;
            break;

        case "*":
            result = previous * second;
            break;

        case "/":
            if (second === 0) {
                current = "Error";
                historyText = "Cannot divide by zero";
                previous = null;
                operator = null;
                waitingForNumber = true;
                updateDisplay();
                return;
            }
            result = previous / second;
            break;

        default:
            return;
    }

    historyText = `${previous} ${operator} ${second} =`;

    current = String(Number(result.toPrecision(12)));
    previous = null;
    operator = null;
    waitingForNumber = true;
}

// Clear everything
function clearCalculator() {
    current = "0";
    previous = null;
    operator = null;
    waitingForNumber = false;
    historyText = "";
}

// Delete last digit
function deleteNumber() {
    if (waitingForNumber || current === "Error") {
        current = "0";
        waitingForNumber = false;
        return;
    }

    if (current.length > 1) {
        current = current.slice(0, -1);
    } else {
        current = "0";
    }
}

// Percentage
function percentage() {
    current = String(parseFloat(current) / 100);
}

// Change sign
function changeSign() {
    if (current === "0" || current === "Error") return;

    current = current.startsWith("-")
        ? current.slice(1)
        : "-" + current;
}

// Button clicks
keys.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const num = button.dataset.num;
    const op = button.dataset.op;
    const act = button.dataset.act;

    if (num !== undefined) {
        inputNumber(num);
    } else if (op !== undefined) {
        // Handles the multiplication button whose data-op is empty
        chooseOperator(op || button.textContent.trim());
    } else if (act === "clear") {
        clearCalculator();
    } else if (act === "eq") {
        calculate();
    } else if (act === "pct") {
        percentage();
    } else if (act === "sign") {
        changeSign();
    } else if (button.textContent.trim() === "DEL") {
        deleteNumber();
    }

    updateDisplay();
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        inputNumber(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }

    updateDisplay();
});

// Initial display
updateDisplay();
