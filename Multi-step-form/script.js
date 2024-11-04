const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.querySelector(".progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;
let formData = {};

nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (validateForm()) {
            saveFormData();
            formStepsNum++;
            updateFormSteps();
            updateProgressbar();
        }
    });
});

prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        formStepsNum--;
        updateFormSteps();
        updateProgressbar();
    });
});

function updateFormSteps() {
    formSteps.forEach((formStep) => {
        formStep.classList.contains("form-step-active") &&
        formStep.classList.remove("form-step-active")
    })
    formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
    progressSteps.forEach((progressStep, index) => {
        if ( index < formStepsNum + 1 ) {
            progressStep.classList.add('progress-step-active')
        } else {
            progressStep.classList.remove('progress-step-active')
        }
    })
    progress.style.width = ((formStepsNum) / (progressSteps.length - 1)) * 100 + "%";
}

function saveFormData() {
    const currentStep = formSteps[formStepsNum];
    const inputs = currentStep.querySelectorAll("input, select");
    inputs.forEach(input => {
        formData[input.name] = input.value;
    });
}

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    saveFormData();
    console.log(formData);
});

document.getElementById('dob').addEventListener('change', function() {
    const dob = this.value;
    const gender = document.getElementById('gender').value;
    if (dob && gender) {
        const year = dob.slice(0, 4);
        const month = dob.slice(5, 7);
        const day = dob.slice(8, 10);
        let centuryGenderCode;
        if (year >= 1800 && year < 1900) {
            centuryGenderCode = gender === 'vyras' ? '1' : '2';
        } else if (year >= 1900 && year < 2000) {
            centuryGenderCode = gender === 'vyras' ? '3' : '4';
        } else if (year >= 2000 && year < 2100) {
            centuryGenderCode = gender === 'vyras' ? '5' : '6';
        }
        const personalCodePrefix = `${centuryGenderCode}${year.slice(2)}${month}${day}`;
        document.getElementById('personalCode').value = personalCodePrefix;
        document.getElementById('personalCode').setAttribute('data-prefix', personalCodePrefix);
    }
});

document.getElementById('personalCode').addEventListener('input', function() {
    const prefix = this.getAttribute('data-prefix');
    if (this.value.length < 7) {
        this.value = prefix;
    } else {
        this.value = prefix + this.value.slice(7).replace(/[^0-9]/g, '');
    }
});

document.getElementById('maritalStatus').addEventListener('change', function() {
    const spouseNameGroup = document.getElementById('spouseNameGroup');
    const spouseLastNameGroup = document.getElementById('spouseLastNameGroup');
    if (this.value === 'vedęs/ištekėjusi') {
        spouseNameGroup.querySelector('input').required = false;
        spouseLastNameGroup.querySelector('input').required = false;
    } else {
        spouseNameGroup.querySelector('input').required = false;
        spouseLastNameGroup.querySelector('input').required = false;
    }
});

function validateForm() {
    const currentStep = formSteps[formStepsNum];
    const inputs = currentStep.querySelectorAll("input, select");
    let valid = true;

    // Clear existing error messages
    currentStep.querySelectorAll('.error-message').forEach(error => error.remove());

    inputs.forEach(input => {
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = '0.8em';
        errorMessage.style.display = 'block';
        errorMessage.style.marginTop = '0.5em';

        // Custom validation messages in Lithuanian
        if (input.validity.valueMissing) {
            input.setCustomValidity("Prašome užpildyti šį lauką.");
        } else if (input.validity.typeMismatch) {
            input.setCustomValidity("Prašome įvesti tinkamą reikšmę.");
        } else if (input.name === 'personalCode' && input.value.length !== 11) {
            input.setCustomValidity("Asmens kodas turi būti 11 skaitmenų.");
        } else {
            input.setCustomValidity("");
        }

        if (!input.checkValidity()) {
            input.reportValidity();
            valid = false;

            // Add custom error message
            errorMessage.textContent = input.validationMessage;
            input.insertAdjacentElement('afterend', errorMessage);
        }

        // Additional validation for spouse name or last name
        if (input.name === 'maritalStatus' && input.value === 'vedęs/ištekėjusi') {
            const spouseName = document.getElementById('spouseName').value;
            const spouseLastName = document.getElementById('spouseLastName').value;
            if (!spouseName && !spouseLastName) {
                valid = false;
                const spouseErrorMessage = document.createElement('span');
                spouseErrorMessage.className = 'error-message';
                spouseErrorMessage.style.color = 'red';
                spouseErrorMessage.style.fontSize = '0.8em';
                spouseErrorMessage.style.display = 'block';
                spouseErrorMessage.style.marginTop = '0.5em';
                spouseErrorMessage.textContent = "Prašome užpildyti bent vieną iš sutuoktinio laukų.";
                if (!document.getElementById('spouseName').nextElementSibling) {
                    document.getElementById('spouseName').insertAdjacentElement('afterend', spouseErrorMessage);
                }
                if (!document.getElementById('spouseLastName').nextElementSibling) {
                    document.getElementById('spouseLastName').insertAdjacentElement('afterend', spouseErrorMessage);
                }
            }
        }
    });
    return valid;
}

document.getElementById('employmentStatus').addEventListener('change', function() {
    const workplaceGroup = document.getElementById('workplaceGroup');
    const positionGroup = document.getElementById('positionGroup');
    const unemploymentReasonGroup = document.getElementById('unemploymentReasonGroup');
    const leaveEndGroup = document.getElementById('leaveEndGroup');
    if (this.value === 'dirba') {
        workplaceGroup.querySelector('input').required = true;
        positionGroup.querySelector('input').required = true;
        unemploymentReasonGroup.querySelector('input').required = false;
        leaveEndGroup.querySelector('input').required = false;
    } else if (this.value === 'nedirba') {
        workplaceGroup.querySelector('input').required = false;
        positionGroup.querySelector('input').required = false;
        unemploymentReasonGroup.querySelector('input').required = true;
        leaveEndGroup.querySelector('input').required = false;
    } else if (this.value === 'motinystės/tėvystės atostogose') {
        workplaceGroup.querySelector('input').required = false;
        positionGroup.querySelector('input').required = false;
        unemploymentReasonGroup.querySelector('input').required = false;
        leaveEndGroup.querySelector('input').required = true;
    } else {
        workplaceGroup.querySelector('input').required = false;
        positionGroup.querySelector('input').required = false;
        unemploymentReasonGroup.querySelector('input').required = false;
        leaveEndGroup.querySelector('input').required = false;
    }
});

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', function() {
        if (/[^a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]/g.test(this.value)) {
            this.setCustomValidity("Tik raidės leidžiamos.");
            this.reportValidity();
        } else {
            this.setCustomValidity("");
        }
    });
});

document.getElementById('phone').addEventListener('input', function() {
    if (/[^0-9]/g.test(this.value)) {
        this.setCustomValidity("Tik skaičiai leidžiami.");
        this.reportValidity();
    } else {
        this.setCustomValidity("");
    }
});

document.getElementById('personalCode').addEventListener('input', function() {
    if (/[^0-9]/g.test(this.value.slice(7))) {
        this.setCustomValidity("Tik skaičiai leidžiami.");
        this.reportValidity();
    } else {
        this.setCustomValidity("");
    }
});