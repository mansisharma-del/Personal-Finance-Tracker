// =======================================
// FinanceFlow - storage.js
// Local Storage Utilities
// =======================================


// =======================================
// STORAGE KEYS
// =======================================

const STORAGE_KEYS = {

    TRANSACTIONS:
        "transactions",

    BUDGET:
        "budget",

    THEME:
        "theme"

};


// =======================================
// GET TRANSACTIONS
// =======================================

function getStoredTransactions() {

    try {

        const data =
            localStorage.getItem(
                STORAGE_KEYS.TRANSACTIONS
            );


        if (!data) {

            return [];

        }


        const transactions =
            JSON.parse(data);


        return Array.isArray(
            transactions
        )
            ? transactions
            : [];

    }

    catch (error) {

        console.error(
            "Error reading transactions:",
            error
        );


        return [];

    }

}


// =======================================
// SAVE TRANSACTIONS
// =======================================

function saveTransactions(
    transactions
) {

    try {

        localStorage.setItem(

            STORAGE_KEYS.TRANSACTIONS,

            JSON.stringify(
                transactions
            )

        );


        return true;

    }

    catch (error) {

        console.error(
            "Error saving transactions:",
            error
        );


        return false;

    }

}


// =======================================
// GET BUDGET
// =======================================

function getStoredBudget() {

    try {

        const budget =
            Number(
                localStorage.getItem(
                    STORAGE_KEYS.BUDGET
                )
            );


        if (
            Number.isFinite(budget) &&
            budget > 0
        ) {

            return budget;

        }


        return 30000;

    }

    catch (error) {

        console.error(
            "Error reading budget:",
            error
        );


        return 30000;

    }

}


// =======================================
// SAVE BUDGET
// =======================================

function saveBudget(
    budget
) {

    try {

        const value =
            Number(budget);


        if (
            !Number.isFinite(value) ||
            value <= 0
        ) {

            return false;

        }


        localStorage.setItem(

            STORAGE_KEYS.BUDGET,

            value.toString()

        );


        return true;

    }

    catch (error) {

        console.error(
            "Error saving budget:",
            error
        );


        return false;

    }

}


// =======================================
// GET THEME
// =======================================

function getStoredTheme() {

    return (
        localStorage.getItem(
            STORAGE_KEYS.THEME
        ) || "light"
    );

}


// =======================================
// SAVE THEME
// =======================================

function saveTheme(
    theme
) {

    if (
        theme !== "light" &&
        theme !== "dark"
    ) {

        return false;

    }


    localStorage.setItem(

        STORAGE_KEYS.THEME,

        theme

    );


    return true;

}


// =======================================
// CLEAR ALL FINANCE DATA
// =======================================

function clearFinanceData() {

    localStorage.removeItem(
        STORAGE_KEYS.TRANSACTIONS
    );

    localStorage.removeItem(
        STORAGE_KEYS.BUDGET
    );

}


// =======================================
// EXPORT STORAGE DATA
// =======================================

function getAllStorageData() {

    return {

        transactions:
            getStoredTransactions(),

        budget:
            getStoredBudget(),

        theme:
            getStoredTheme()

    };

}