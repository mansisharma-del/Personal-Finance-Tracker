// =======================================
// FinanceFlow - app.js
// =======================================


// =======================================
// DOM ELEMENTS
// =======================================

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const saving = document.getElementById("saving");

const table = document.getElementById("transactionTable");

const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const form = document.getElementById("transactionForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categoryInput = document.getElementById("category");
const typeInput = document.getElementById("type");


// =======================================
// LOCAL STORAGE
// =======================================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// =======================================
// MONTHLY BUDGET
// FIXED
// =======================================

let monthlyBudget =
    Number(localStorage.getItem("budget"));


// If no valid budget exists
if (
    !Number.isFinite(monthlyBudget) ||
    monthlyBudget <= 0
) {
    monthlyBudget = 30000;

    localStorage.setItem(
        "budget",
        monthlyBudget
    );
}


// =======================================
// MODAL
// =======================================

addBtn.onclick = () => {

    modal.style.display = "flex";

};


closeBtn.onclick = () => {

    modal.style.display = "none";

};


window.onclick = (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

};


// =======================================
// ADD TRANSACTION
// =======================================

form.addEventListener("submit", function (e) {

    e.preventDefault();


    const transaction = {

        id: Date.now(),

        title: titleInput.value.trim(),

        amount: Number(amountInput.value),

        date: dateInput.value,

        category: categoryInput.value,

        type: typeInput.value

    };


    // Add transaction

    transactions.push(transaction);


    // Save transaction

    saveData();


    // Update dashboard

    displayTransactions();

    updateSummary();

    updateBudget();

    updateCharts();

    updateCategoryInsights();


    // Reset form

    form.reset();


    // Close modal

    modal.style.display = "none";

});


// =======================================
// SAVE TRANSACTIONS
// =======================================

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// =======================================
// ANIMATION FUNCTION
// =======================================

function animateValue(
    element,
    start,
    end,
    duration = 1200
) {

    if (!element) {

        return;

    }


    let startTime = null;


    function animation(currentTime) {

        if (!startTime) {

            startTime = currentTime;

        }


        const progress =
            Math.min(
                (currentTime - startTime) / duration,
                1
            );


        const value =
            Math.floor(
                progress * (end - start) + start
            );


        element.innerHTML =
            "₹" +
            value.toLocaleString("en-IN");


        if (progress < 1) {

            requestAnimationFrame(animation);

        }

    }


    requestAnimationFrame(animation);

}


// =======================================
// UPDATE SUMMARY
// =======================================

function updateSummary() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(item => {

        const amount =
            Number(item.amount) || 0;


        if (item.type === "income") {

            totalIncome += amount;

        }

        else {

            totalExpense += amount;

        }

    });


    const totalBalance =
        totalIncome - totalExpense;


    // Animated cards

    animateValue(
        balance,
        0,
        totalBalance
    );


    animateValue(
        income,
        0,
        totalIncome
    );


    animateValue(
        expense,
        0,
        totalExpense
    );


    animateValue(
        saving,
        0,
        totalBalance
    );

}


// =======================================
// DISPLAY TRANSACTIONS
// =======================================

function displayTransactions() {

    if (!table) {

        return;

    }


    table.innerHTML = "";


    transactions.forEach(item => {

        const row =
            document.createElement("tr");


        const amount =
            Number(item.amount) || 0;


        row.innerHTML = `

            <td>
                ${item.date}
            </td>

            <td>
                ${item.title}
            </td>

            <td>
                ${item.category}
            </td>

            <td>
                ${item.type}
            </td>

            <td class="${
                item.type === "income"
                    ? "income-text"
                    : "expense-text"
            }">

                ${item.type === "income" ? "+" : "-"}₹${amount.toLocaleString("en-IN")}

            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editTransaction(${item.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${item.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// =======================================
// DELETE TRANSACTION
// =======================================

function deleteTransaction(id) {

    if (
        !confirm(
            "Delete this transaction?"
        )
    ) {

        return;

    }


    transactions =
        transactions.filter(
            item => item.id !== id
        );


    // Save

    saveData();


    // Update everything

    displayTransactions();

    updateSummary();

    updateBudget();

    updateCharts();

    updateCategoryInsights();

}


// =======================================
// EDIT TRANSACTION
// =======================================

function editTransaction(id) {

    const item =
        transactions.find(
            t => t.id === id
        );


    if (!item) {

        return;

    }


    // Fill form with existing data

    titleInput.value =
        item.title;

    amountInput.value =
        item.amount;

    dateInput.value =
        item.date;

    categoryInput.value =
        item.category;

    typeInput.value =
        item.type;


    // Remove old transaction

    transactions =
        transactions.filter(
            t => t.id !== id
        );


    // Save temporary state

    saveData();


    // Update dashboard

    displayTransactions();

    updateSummary();

    updateBudget();

    updateCharts();

    updateCategoryInsights();


    // Open modal

    modal.style.display = "flex";

}


// =======================================
// SEARCH TRANSACTIONS
// =======================================

const searchInput =
    document.getElementById("search");


if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        function () {

            const value =
                this.value.toLowerCase();


            const rows =
                table.querySelectorAll("tr");


            rows.forEach(row => {

                const text =
                    row.innerText.toLowerCase();


                if (
                    text.includes(value)
                ) {

                    row.style.display = "";

                }

                else {

                    row.style.display = "none";

                }

            });

        }
    );

}


// =======================================
// FILTER TRANSACTIONS
// =======================================

const filter =
    document.getElementById("filter");


if (filter) {

    filter.addEventListener(
        "change",
        function () {

            const value =
                this.value;


            table.innerHTML = "";


            let filtered =
                transactions;


            if (
                value !== "all"
            ) {

                filtered =
                    transactions.filter(
                        item =>
                            item.type === value
                    );

            }


            filtered.forEach(item => {

                const row =
                    document.createElement("tr");


                const amount =
                    Number(item.amount) || 0;


                row.innerHTML = `

                    <td>
                        ${item.date}
                    </td>

                    <td>
                        ${item.title}
                    </td>

                    <td>
                        ${item.category}
                    </td>

                    <td>
                        ${item.type}
                    </td>

                    <td class="${
                        item.type === "income"
                            ? "income-text"
                            : "expense-text"
                    }">

                        ${item.type === "income" ? "+" : "-"}₹${amount.toLocaleString("en-IN")}

                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editTransaction(${item.id})">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteTransaction(${item.id})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                `;


                table.appendChild(row);

            });

        }
    );

}


// =======================================
// DARK MODE
// =======================================

const themeBtn =
    document.getElementById("themeBtn");


const savedTheme =
    localStorage.getItem("theme");


if (
    savedTheme === "dark"
) {

    document.body.classList.add("dark");


    if (themeBtn) {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

}


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            if (
                document.body.classList.contains(
                    "dark"
                )
            ) {

                localStorage.setItem(
                    "theme",
                    "dark"
                );


                themeBtn.innerHTML =
                    '<i class="fa-solid fa-sun"></i>';

            }

            else {

                localStorage.setItem(
                    "theme",
                    "light"
                );


                themeBtn.innerHTML =
                    '<i class="fa-solid fa-moon"></i>';

            }

        }
    );

}


// =======================================
// EXPORT CSV
// =======================================

const csvBtn =
    document.getElementById("csvBtn");


if (csvBtn) {

    csvBtn.addEventListener(
        "click",
        exportCSV
    );

}


function exportCSV() {

    if (
        transactions.length === 0
    ) {

        alert(
            "No transactions available!"
        );

        return;

    }


    let csv =
        "Date,Title,Category,Type,Amount\n";


    transactions.forEach(item => {

        csv +=
            `"${item.date}","${item.title}","${item.category}","${item.type}","${item.amount}"\n`;

    });


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );


    const url =
        window.URL.createObjectURL(
            blob
        );


    const a =
        document.createElement("a");


    a.href = url;

    a.download =
        "FinanceFlow_Transactions.csv";


    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);


    window.URL.revokeObjectURL(
        url
    );

}


// =======================================
// MONTHLY BUDGET
// FIXED VERSION
// =======================================

const budgetBtn =
    document.getElementById(
        "setBudgetBtn"
    );


if (budgetBtn) {

    budgetBtn.addEventListener(
        "click",
        () => {

            const value =
                prompt(
                    "Enter Monthly Budget",
                    monthlyBudget
                );


            if (
                value === null ||
                value.trim() === ""
            ) {

                return;

            }


            const newBudget =
                Number(value);


            if (
                !Number.isFinite(newBudget) ||
                newBudget <= 0
            ) {

                alert(
                    "Please enter a valid budget."
                );

                return;

            }


            monthlyBudget =
                newBudget;


            localStorage.setItem(
                "budget",
                String(monthlyBudget)
            );


            // Immediately update budget

            updateBudget();

        }
    );

}


// =======================================
// UPDATE BUDGET
// FIXED
// =======================================

function updateBudget() {

    // -----------------------------------
    // Get total expenses
    // -----------------------------------

    let expenseAmount = 0;


    transactions.forEach(item => {

        if (
            item.type === "expense"
        ) {

            expenseAmount +=
                Number(item.amount) || 0;

        }

    });


    // -----------------------------------
    // Safety check for budget
    // -----------------------------------

    if (
        !Number.isFinite(monthlyBudget) ||
        monthlyBudget <= 0
    ) {

        monthlyBudget = 30000;

        localStorage.setItem(
            "budget",
            String(monthlyBudget)
        );

    }


    // -----------------------------------
    // Calculate percentage
    // -----------------------------------

    let percent =
        (expenseAmount / monthlyBudget) * 100;


    // Prevent invalid values

    if (!Number.isFinite(percent)) {

        percent = 0;

    }


    // Keep progress bar between 0 and 100

    percent =
        Math.max(
            0,
            Math.min(
                percent,
                100
            )
        );


    // -----------------------------------
    // Get elements
    // -----------------------------------

    const budgetAmount =
        document.getElementById(
            "budgetAmount"
        );


    const progressBar =
        document.getElementById(
            "progressBar"
        );


    const budgetPercent =
        document.getElementById(
            "budgetPercent"
        );


    // -----------------------------------
    // Update amount
    // -----------------------------------

    if (budgetAmount) {

        budgetAmount.textContent =
            `₹${expenseAmount.toLocaleString("en-IN")} / ₹${monthlyBudget.toLocaleString("en-IN")}`;

    }


    // -----------------------------------
    // UPDATE PROGRESS BAR
    // IMPORTANT FIX
    // -----------------------------------

    if (progressBar) {

        // Remove old classes

        progressBar.classList.remove(
            "warning",
            "danger"
        );


        // Force the actual width

        progressBar.style.setProperty(
            "width",
            `${percent}%`,
            "important"
        );


        // Change color depending on usage

        if (percent >= 90) {

            progressBar.classList.add(
                "danger"
            );

        }

        else if (percent >= 70) {

            progressBar.classList.add(
                "warning"
            );

        }

    }


    // -----------------------------------
    // Update percentage text
    // -----------------------------------

    if (budgetPercent) {

        budgetPercent.textContent =
            `${percent.toFixed(0)}% Used`;

    }

}


// =======================================
// CATEGORY-WISE SPENDING INSIGHTS
// =======================================

function updateCategoryInsights() {

    const totalExpenseElement =
        document.getElementById(
            "categoryTotalExpense"
        );


    const topCategoryElement =
        document.getElementById(
            "topCategory"
        );


    const topPercentageElement =
        document.getElementById(
            "topCategoryPercentage"
        );


    const categoryList =
        document.getElementById(
            "categoryList"
        );


    const spendingMessage =
        document.getElementById(
            "spendingMessage"
        );


    // Safety check

    if (
        !totalExpenseElement ||
        !topCategoryElement ||
        !topPercentageElement ||
        !categoryList
    ) {

        return;

    }


    // ===================================
    // CATEGORY DATA
    // ===================================

    const categoryData = {};


    transactions.forEach(transaction => {

        if (
            transaction.type !== "expense"
        ) {

            return;

        }


        const category =
            transaction.category ||
            "Others";


        const amount =
            Number(transaction.amount) || 0;


        if (!categoryData[category]) {

            categoryData[category] = 0;

        }


        categoryData[category] += amount;

    });


    // ===================================
    // NO EXPENSES
    // ===================================

    if (
        Object.keys(categoryData).length === 0
    ) {

        totalExpenseElement.textContent =
            "₹0";


        topCategoryElement.textContent =
            "—";


        topPercentageElement.textContent =
            "0%";


        categoryList.innerHTML = `

            <div class="category-empty">

                <i class="fa-solid fa-chart-pie"></i>

                <div>
                    Add expenses to see
                    category-wise insights.
                </div>

            </div>

        `;


        if (spendingMessage) {

            spendingMessage.innerHTML = `

                <i class="fa-solid fa-lightbulb"></i>

                <span>
                    Add some expenses to discover
                    your spending patterns.
                </span>

            `;

        }


        return;

    }


    // ===================================
    // TOTAL EXPENSE
    // ===================================

    const totalExpense =
        Object.values(categoryData)
            .reduce(
                (sum, value) =>
                    sum + value,
                0
            );


    totalExpenseElement.textContent =
        "₹" +
        totalExpense.toLocaleString(
            "en-IN"
        );


    // ===================================
    // SORT CATEGORIES
    // ===================================

    const sortedCategories =
        Object.entries(categoryData)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    // ===================================
    // TOP CATEGORY
    // ===================================

    const topCategory =
        sortedCategories[0][0];


    const topAmount =
        sortedCategories[0][1];


    const topPercentage =
        (
            topAmount /
            totalExpense
        ) * 100;


    topCategoryElement.textContent =
        topCategory;


    topPercentageElement.textContent =
        topPercentage.toFixed(1) + "%";


    // ===================================
    // INSIGHT MESSAGE
    // ===================================

    if (spendingMessage) {

        spendingMessage.innerHTML = `

            <i class="fa-solid fa-lightbulb"></i>

            <span>
                You spend the most on
                <strong>
                    ${topCategory}
                </strong>
                —
                ₹${topAmount.toLocaleString("en-IN")}
                (${topPercentage.toFixed(1)}% of total spending).
            </span>

        `;

    }


    // ===================================
    // CATEGORY COLORS
    // ===================================

    const colors = [

        "#3b82f6",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#ec4899",
        "#14b8a6"

    ];


    // ===================================
    // CREATE CATEGORY LIST
    // ===================================

    categoryList.innerHTML = "";


    sortedCategories.forEach(
        ([category, amount], index) => {

            const percentage =
                (
                    amount /
                    totalExpense
                ) * 100;


            const color =
                colors[
                    index % colors.length
                ];


            const item =
                document.createElement("div");


            item.className =
                "category-item";


            item.innerHTML = `

                <div class="category-info">

                    <div class="category-name">

                        <span
                            class="category-dot"
                            style="background:${color}">
                        </span>

                        ${category}

                    </div>


                    <div>

                        <span
                            class="category-amount">

                            ₹${amount.toLocaleString(
                                "en-IN"
                            )}

                        </span>

                        <span
                            class="category-percentage">

                            ${percentage.toFixed(1)}%

                        </span>

                    </div>

                </div>


                <div class="category-progress">

                    <div
                        class="category-progress-bar"
                        style="
                            width:${percentage}%;
                            background:${color};
                        ">
                    </div>

                </div>

            `;


            categoryList.appendChild(item);

        }
    );

}


// =======================================
// INITIAL LOAD
// =======================================

displayTransactions();

updateSummary();

updateCharts();

updateBudget();

updateCategoryInsights();

modal.style.display = "flex";