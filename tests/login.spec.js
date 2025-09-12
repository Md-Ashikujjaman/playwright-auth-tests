// @ts-nocheck
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://practice.qabrains.com/');

  // Common locators
  page.loginButton = page.locator("//button[normalize-space()='Login']");
  page.emailField = page.locator("//input[@id='email']");
  page.passwordField = page.locator("//input[@id='password']");
  page.emailError = page.locator("//p[normalize-space()='Email is a required field']");
  page.passwordError = page.locator("//p[normalize-space()='Password is a required field']");
  page.errorMessage = page.locator("//span[@class='title text-black text-md']");
});

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/QA Practice Site/);
});

test('Blank email and password field', async ({ page }) => {
  await page.loginButton.click();
  await expect(page.emailError).toHaveText('Email is a required field');
  await expect(page.passwordError).toHaveText('Password is a required field');
});

test('Invalid email format and wrong password', async ({ page }) => {
  await page.emailField.fill("ers@qabrai");
  await page.passwordField.fill("Password145");
  await page.loginButton.click();
  await expect(page.errorMessage).toHaveText('Your email and password both are invalid!');
});

test('Invalid email format with valid password', async ({ page }) => {
  await page.emailField.fill("ers@qabrai");
  await page.passwordField.fill("Password123");
  await page.loginButton.click();
  await expect(page.errorMessage).toHaveText('Your email is invalid!');
});

test('Valid email and valid password', async ({ page }) => {
  await page.emailField.fill("qa_testers@qabrains.com");
  await page.passwordField.fill("Password123");
  await page.loginButton.click();
  await expect(page.errorMessage).toHaveText('Login Successful');
});

test('Valid email and wrong password', async ({ page }) => {
  await page.emailField.fill("qa_testers@qabrains.com");
  await page.passwordField.fill("Password145");
  await page.loginButton.click();
  await expect(page.errorMessage).toHaveText('Your password is invalid!');
});

test('Valid email and password under 6 characters', async ({ page }) => {
  await page.emailField.fill("qa_testers@qabrains.com");
  await page.passwordField.fill("Pas5");
  await page.loginButton.click();
  const errorMessage = page.locator("//p[@class='text-red-500 text-sm mt-1']");
  await expect(errorMessage).toHaveText('Password must be at least 6 characters');
});

test('Invalid email format only', async ({ page }) => {
  await page.emailField.fill("qa_testers");
  await page.passwordField.fill("Pas5");
  await page.loginButton.click();
  const validationMsg = await page.locator("//input[@id='email']")
  .evaluate(el => el.validationMessage);
  await expect(validationMsg).toContain("Please include an '@' in the email address");
});
