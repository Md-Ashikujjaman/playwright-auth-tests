// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://practice.qabrains.com/');
});

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/QA Practice Site/);
});

test('Blank email and password field', async ({ page }) => {
  await page.click("//button[normalize-space()='Login']");
  const emailErrorMessage = page.locator("//p[normalize-space()='Email is a required field']");
  await expect(emailErrorMessage).toHaveText('Email is a required field');
  const passwordErrorMessage = page.locator("//p[normalize-space()='Password is a required field']");
  await expect(passwordErrorMessage).toHaveText('Password is a required field');
});

test('Invalid email format and wrong password', async ({ page }) => {
  await page.fill("//input[@id='email']", "ers@qabrai");
  await page.fill("//input[@id='password']", "Password145");
  await page.click("//button[normalize-space()='Login']");
  const errorMessage = page.locator("//span[@class='title text-black text-md']");
  await expect(errorMessage).toHaveText('Your email and password both are invalid!');
});

test('Invalid email format with valid password', async ({ page }) => {
  await page.fill("//input[@id='email']", "ers@qabrai");
  await page.fill("//input[@id='password']", "Password123");
  await page.click("//button[normalize-space()='Login']");
  const errorMessage = page.locator("//span[@class='title text-black text-md']");
  await expect(errorMessage).toHaveText('Your email is invalid!');
});

test('Valid email and valid password', async ({ page }) => {
  await page.fill("//input[@id='email']", "qa_testers@qabrains.com");
  await page.fill("//input[@id='password']", "Password123");
  await page.click("//button[normalize-space()='Login']");
  const errorMessage = page.locator("//span[@class='title text-black text-md']");
  await expect(errorMessage).toHaveText('Login Successful');
});

test('Valid email and wrong password', async ({ page }) => {
  await page.fill("//input[@id='email']", "qa_testers@qabrains.com");
  await page.fill("//input[@id='password']", "Password145");
  await page.click("//button[normalize-space()='Login']");
  const errorMessage = page.locator("//span[@class='title text-black text-md']");
  await expect(errorMessage).toHaveText('Your password is invalid!');
});

test('Valid email and password under 6 characters', async ({ page }) => {
  await page.fill("//input[@id='email']", "qa_testers@qabrains.com");
  await page.fill("//input[@id='password']", "Pas5");
  await page.click("//button[normalize-space()='Login']");
  const errorMessage = page.locator("//p[@class='text-red-500 text-sm mt-1']");
  await expect(errorMessage).toHaveText('Password must be at least 6 characters');
});

test('Invalid email format only', async ({ page }) => {
  await page.fill("//input[@id='email']", "qa_testers");
  await page.fill("//input[@id='password']", "Pas5");
  await page.click("//button[normalize-space()='Login']");

  const validationMsg = page.locator("//input[@id='email']").evaluate(el => el.validationMessage);
  await expect(validationMsg).toContain("Please include an '@' in the email address");
});
