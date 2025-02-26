const allPages = document.querySelectorAll(".page");
const allBtns = document.querySelectorAll(".page__btn");
let translateY = 100;

const nextPage = (params) => {
   allPages.forEach((page) => {
      page.style.transform = `translateY(-${translateY}%)`;
   });
   translateY += 100;
};

allBtns.forEach((btn) => {
   btn.addEventListener("click", () => {
       if (btn.classList.contains("restart-btn")) {
          window.location.reload();
       }
      nextPage();
      console.log(btn.dataset.value);
   });
});
