const allPages = document.querySelectorAll(".page");
const allBtns = document.querySelectorAll(".page__btn");
const allInputs = document.querySelectorAll(".page__input");
const allCircles = document.querySelectorAll(".progress-bar__circle");
const activeCircles = document.getElementsByClassName("active-circle");
const line = document.querySelector(".progress-bar__line");
let translateY = 100;

let diet;
let zero;
let bulk;

let gender;
let activity;
let goal;

let lineWidth;

let calories;
let protein;
let fat;
let carbohydrates;

// przejscie do nastepnej strony
const nextPage = (params) => {
   lineWidth = line.getBoundingClientRect().width;
   lineWidth += 112.5;
   line.style.width = lineWidth + "px";

   allPages.forEach((page) => {
      page.style.transform = `translateY(-${translateY}%)`;
   });

   translateY += 100;

   if (activeCircles.length < allCircles.length) {
      for (let i = activeCircles.length; i < allCircles.length; i++) {
         if (!allCircles[i].classList.contains("active-circle")) {
            allCircles[i].classList.add("active-circle");
            break;
         }
      }
   }
};

// obsluga przyciskow
allBtns.forEach((btn) => {
   btn.addEventListener("click", () => {
      {
         const dataValue = btn.dataset.value;
         switch (dataValue) {
            case "male":
               gender = dataValue;
               nextPage();
               break;
            case "female":
               gender = dataValue;
               nextPage();
               break;
            case "not":
               activity = dataValue;
               nextPage();
               break;
            case "lightly":
               activity = dataValue;
               nextPage();
               break;
            case "moderately":
               activity = dataValue;
               nextPage();
               break;
            case "very":
               activity = dataValue;
               nextPage();
               break;
            case "diet":
               goal = dataValue;
               nextPage();
               break;
            case "zero":
               goal = dataValue;
               nextPage();
               break;
            case "bulk":
               goal = dataValue;
               nextPage();
               break;
            case "input-value":
               checkInput(btn);
               break;
            case "calculate":
               calculateCalories();
               nextPage();
               break;
            case "restart":
               window.location.reload();
               break;
            default:
               nextPage();
               break;
         }
      }
   });
});

const checkInput = (btn) => {
   const input = btn.closest(".page").querySelector(".page__input");
   const errorText = btn.closest(".page").querySelector(".page__error");

   // Sprawdzamy, czy wartość jest nieprawidłowa
   if (input.value.trim() === "" || input.value <= 0) {
      errorText.style.display = "block";

      // Dodajemy animację
      errorText.classList.add("shake");

      errorText.addEventListener("animationend", () => {
         errorText.classList.remove("shake");
      });
   } else {
      errorText.style.display = "none";
      nextPage();
   }
};

// pobieramy wiek, wzrost i wage
allInputs.forEach((input) => {
   input.addEventListener("change", () => {
      switch (input.id) {
         case "age":
            age = input.value;
            break;
         case "weight":
            weight = input.value;
            break;
         case "height":
            height = input.value;
            break;
      }
   });
});
const calculateCalories = () => {
   if (!gender || !age || !height || !weight || !activity || !goal) {
      console.log("Brak wszystkich danych do obliczeń.");
      return;
   }

   age = parseFloat(age);
   height = parseFloat(height);
   weight = parseFloat(weight);

   let BMR;
   if (gender === "male") {
      BMR = 10 * weight + 6.25 * height - 5 * age + 5;
   } else if (gender === "female") {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161;
   }

   let activityLevel;

   switch (activity) {
      case "not":
         activityLevel = 1.2;
         break;
      case "lightly":
         activityLevel = 1.375;
         break;
      case "moderately":
         activityLevel = 1.55;
         break;
      case "very":
         activityLevel = 1.725;
         break;
   }

   const TDEE = BMR * activityLevel;

   // Calculate calories based on goal
   switch (goal) {
      case "diet":
         calories = TDEE - 400;
         break;
      case "zero":
         calories = TDEE;
         break;
      case "bulk":
         calories = TDEE + 400;
         break;
   }

   calories = Math.round(calories);

   // Calculate macronutrients
   protein = Math.round(weight * (goal === "diet" ? 2.0 : goal === "bulk" ? 1.8 : 1.6)); // g
   fat = Math.round(weight * (goal === "diet" ? 0.8 : goal === "bulk" ? 1.2 : 1.0)); // g
   carbohydrates = Math.round((calories - (protein * 4 + fat * 9)) / 4); // g

   // Update the UI with new values
   const caloriesText = document.querySelector("#calories");
   const proteinText = document.querySelector("#protein");
   const fatText = document.querySelector("#fat");
   const carbohydratesText = document.querySelector("#carbohydrates");

   caloriesText.textContent = ` ${calories}`;
   proteinText.textContent = `${protein}`;
   fatText.textContent = `${fat}`;
   carbohydratesText.textContent = `${carbohydrates}`;

   // Now that values are updated, update the chart
   updateChart();
};

// Update the chart with new calorie data
const updateChart = () => {
   // Calculate calories for each macronutrient
   const proteinCalories = protein * 4;  // 1g of protein = 4 kcal
   const fatCalories = fat * 9;          // 1g of fat = 9 kcal
   const carbsCalories = carbohydrates * 4;  // 1g of carbs = 4 kcal

   // Update the chart with calorie values for each macronutrient
   myChart.data.datasets[0].data = [proteinCalories, fatCalories, carbsCalories];
   myChart.update();  // This will update the chart with new calorie values
};


// ////////////////// nutritionChart
const ctx = document.getElementById("nutritionChart").getContext("2d");

// Example values
const caloriesChart = `${calories}`; // Total caloriesChart
const proteinChart = `${protein}`; // Protein in grams
const fatChart = `${fat}`; // Fat in grams
const carbohydratesChart = `${carbohydrates}`; // Carbohydrates in grams

// Calculate percentage of each macronutrient
const proteinPercent = ((proteinChart * 4) / caloriesChart) * 100; // 1g of proteinChart = 4 kcal
const fatPercent = ((fatChart * 9) / caloriesChart) * 100; // 1g of fatChart = 9 kcal
const carbsPercent = ((carbohydratesChart * 4) / caloriesChart) * 100; // 1g of carbs = 4 kcal

// Create a pie chart using Chart.js
const myChart = new Chart(ctx, {
   type: "pie",
   data: {
      labels: ["Protein", "Fat", "Carbs"], // Etykiety dla segmentów
      datasets: [
         {
            data: [proteinPercent, fatPercent, carbsPercent], // Procenty dla każdego makroskładnika
            backgroundColor: [
               "#3498db", // Niebieski dla białka
               "#f39c12", // Złoty dla tłuszczu
               "#2ecc71", // Zielony dla węglowodanów
            ],
         },
      ],
   },
});

window.addEventListener("load", () => {
   const allInputs = document.querySelectorAll(".page__input");
   allInputs.forEach((input) => {
      input.value = "";
   });
});
