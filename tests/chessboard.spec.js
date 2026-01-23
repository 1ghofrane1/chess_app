import { test, expect } from "@playwright/test";

test("Le plateau s'affiche avec les pièces à la position initiale", async ({ page }) => {
  await page.goto("/");

  // Le board existe
  await expect(page.getByTestId("chessboard")).toBeVisible();

  // Exemples de vérification de positions initiales
  await expect(page.getByTestId("piece-0-0")).toHaveText("♜"); // tour noire
  await expect(page.getByTestId("piece-0-4")).toHaveText("♚"); // roi noir
  await expect(page.getByTestId("piece-7-4")).toHaveText("♔"); // roi blanc
  await expect(page.getByTestId("piece-7-3")).toHaveText("♕"); // dame blanche

  // Pions
  await expect(page.getByTestId("piece-1-0")).toHaveText("♟");
  await expect(page.getByTestId("piece-6-0")).toHaveText("♙");

  // Une case vide au centre
  await expect(page.getByTestId("piece-4-4")).toHaveText("");
});

test("Interaction utilisateur: click pour sélectionner puis click pour déplacer", async ({ page }) => {
  await page.goto("/");

  // Sélection pion blanc (6,0) -> déplacement vers (5,0)
  await page.getByTestId("square-6-0").click();
  await page.getByTestId("square-5-0").click();

  // Vérifier résultat sur l'IHM
  await expect(page.getByTestId("piece-6-0")).toHaveText("");
  await expect(page.getByTestId("piece-5-0")).toHaveText("♙");
});
