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

let lineWidth

// przejscie do nastepnej strony
const nextPage = (params) => {
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
               break;
            case "female":
               gender = dataValue;
               break;
            case "not":
               activity = dataValue;
               break;
            case "lightly":
               activity = dataValue;
               break;
            case "moderately":
               activity = dataValue;
               break;
            case "very":
               activity = dataValue;
               break;
            case "diet":
               goal = dataValue;
               break;
            case "zero":
               goal = dataValue;
               break;
            case "bulk":
               goal = dataValue;
               break;
            case "calculate":
               calculateCalories();
               break;
            case "restart":
               window.location.reload();
               break;
         }
         nextPage();
      }
   });
});

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

   let calories;

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

   const protein = Math.round(weight * (goal === "lose" ? 2.0 : goal === "gain" ? 1.8 : 1.6)); // g
   const fat = Math.round(weight * (goal === "lose" ? 0.8 : goal === "gain" ? 1.2 : 1.0)); // g
   const carbohydrates = Math.round((calories - (protein * 4 + fat * 9)) / 4); // g

   const caloriesText = document.querySelector("#calories");
   const proteinText = document.querySelector("#protein");
   const fatText = document.querySelector("#fat");
   const carbohydratesText = document.querySelector("#carbohydrates");

   caloriesText.textContent = ` ${calories}`;
   proteinText.textContent = `${protein}`;
   fatText.textContent = `${fat}`;
   carbohydratesText.textContent = `${carbohydrates}`;
};

window.addEventListener("load", () => {
   const allInputs = document.querySelectorAll(".page__input");
   allInputs.forEach((input) => {
      input.value = "";
   });
});
