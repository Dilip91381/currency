const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

const convertButton = document.getElementById("convert");
const swapButton = document.getElementById("swap");

const result = document.getElementById("result");
const rateText = document.getElementById("rate");
const loading = document.getElementById("loading");


// ===============================
// CONVERT CURRENCY
// ===============================

async function convertCurrency() {

    const value = Number(amount.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Check amount
    if (!value || value <= 0) {
        result.textContent = "Please enter a valid amount";
        rateText.textContent = "";
        return;
    }

    // Same currency
    if (from === to) {

        result.textContent = `${value} ${from} = ${value} ${to}`;
        rateText.textContent = `1 ${from} = 1 ${to}`;

        return;
    }

    loading.textContent = "Loading exchange rate...";
    result.textContent = "";
    rateText.textContent = "";

    try {

        // Current Frankfurter API
        const url =
            `https://api.frankfurter.dev/v2/rates?base=${from}&quotes=${to}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        console.log("API Response:", data);

        // v2 API returns an array
        const rateData = data[0];

        if (!rateData || !rateData.rate) {
            throw new Error("Exchange rate not found");
        }

        const rate = rateData.rate;

        const convertedAmount = value * rate;

        // Show result
        result.textContent =
            `${value} ${from} = ${convertedAmount.toFixed(2)} ${to}`;

        // Show exchange rate
        rateText.textContent =
            `1 ${from} = ${rate.toFixed(4)} ${to}`;

        loading.textContent = "";

    } catch (error) {

        console.error("Currency API Error:", error);

        loading.textContent = "";

        result.textContent =
            "Unable to get exchange rate.";

        rateText.textContent =
            "Please check your internet connection and try again.";
    }
}


// ===============================
// CONVERT BUTTON
// ===============================

convertButton.addEventListener("click", convertCurrency);


// ===============================
// SWAP BUTTON
// ===============================

swapButton.addEventListener("click", () => {

    const temp = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    convertCurrency();
});