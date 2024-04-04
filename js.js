import {
  createRecipe,
  getRecipes,
  deleteRecipe,
  updateRecipe,
} from "./modules/data.js";

async function showRecipes() {
  const response = await getRecipes();
  console.table(response);
  const el = document.querySelector("template").content;
  const parent = document.querySelector(".recipes");
  parent.innerHTML = "";
  response.forEach((rec) => {
    const clone = el.cloneNode(true);
    clone.querySelector("[data-name]").textContent = rec.name;
    clone.querySelector("[data-origin]").textContent = rec.origin;
    clone.querySelector("[data-servings]").textContent = rec.servings;
    clone.querySelector("[data-ingredients]").textContent = rec.ingredients;
    clone.querySelector("[data-allergens]").textContent = rec.allergens;
    // clone.querySelector("[data-diet]").textContent = rec.diet;
    if (rec.studentFriendly) {
      clone.querySelector(".status").hidden = false;
    } else {
      clone.querySelector(".status").hidden = true;
    }

    clone.querySelectorAll("[data-id]").forEach((e) => (e.dataset.id = rec.id));
    clone
      .querySelector("button[data-action='delete']")
      .addEventListener("click", async () => {
        await deleteRecipe(rec.id);
        await showRecipes();
      });
    clone
      .querySelector("button[data-action='update']")
      .addEventListener("click", async () => {
        await updateRecipe(rec.id, !rec.studentFriendly);
        await showRecipes();
      });
    parent.appendChild(clone);
  });
}
showRecipes();

function handleSubmit() {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    console.log(e);
    e.preventDefault();
    const formData = new FormData(form);

    await createRecipe({
      name: formData.get("name"),
      description: formData.get("description"),
      ingredients: formData.get("ingredients").split("\n"),
      servings: formData.get("servings"),
      allergens: formData.get("allergens").split("\n"),
      diet: formData.get("diet"),
      studentFriendly: formData.get("studentFriendly"),
      origin: formData.get("origin"),
    });
    showRecipes();
  });
}
handleSubmit();
