// =======================================
// FinanceFlow - app.js (Part 1)
// =======================================

// DOM Elements
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

// ===============================
// Local Storage
// ===============================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

// ===============================
// Modal
// ===============================

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

// ===============================
// Add Transaction
// ===============================

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const transaction = {

        id: Date.now(),

        title: titleInput.value,

        amount: Number(amountInput.value),

        date: dateInput.value,

        category: categoryInput.value,

        type: typeInput.value

    };

    transactions.push(transaction);

    saveData();

    displayTransactions();

    updateSummary();

    form.reset();

    modal.style.display = "none";

});

// ===============================
// Save
// ===============================

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// ===============================
// Summary
// ===============================

// function updateSummary() {

//     let totalIncome = 0;

//     let totalExpense = 0;

//     transactions.forEach(item => {

//         if (item.type === "income") {

//             totalIncome += item.amount;

//         } else {

//             totalExpense += item.amount;

//         }

//     });

    const totalBalance = totalIncome - totalExpense;

    balance.innerHTML = "₹" + totalBalance.toLocaleString();

    income.innerHTML = "₹" + totalIncome.toLocaleString();

    expense.innerHTML = "₹" + totalExpense.toLocaleString();

    saving.innerHTML = "₹" + totalBalance.toLocaleString();

}

// ===============================
// Display Transactions
// ===============================

function displayTransactions() {

    table.innerHTML = "";

    transactions.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${item.date}</td>

        <td>${item.title}</td>

        <td>${item.category}</td>

        <td>${item.type}</td>

        <td class="${item.type === "income"
                ? "income-text"
                : "expense-text"}">

            ${item.type === "income" ? "+" : "-"}₹${item.amount}

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

// ===============================
// Delete
// ===============================

function deleteTransaction(id) {

    if (!confirm("Delete this transaction?"))
        return;

    transactions =
        transactions.filter(item => item.id !== id);

    saveData();

    displayTransactions();

    updateSummary();

}

// ===============================
// Edit
// ===============================

function editTransaction(id) {

    const item =
        transactions.find(t => t.id === id);

    if (!item) return;

    titleInput.value = item.title;

    amountInput.value = item.amount;

    dateInput.value = item.date;

    categoryInput.value = item.category;

    typeInput.value = item.type;

    transactions =
        transactions.filter(t => t.id !== id);

    saveData();

    displayTransactions();

    updateSummary();

    modal.style.display = "flex";

}

// ===============================
// Initial Load
// ===============================

displayTransactions();

updateSummary();


// =======================================
// SEARCH TRANSACTIONS
// =======================================

const searchInput = document.getElementById("search");

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        if (text.includes(value)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});

// =======================================
// FILTER TRANSACTIONS
// =======================================

const filter = document.getElementById("filter");

filter.addEventListener("change", function () {

    const value = this.value;

    table.innerHTML = "";

    let filtered = transactions;

    if (value !== "all") {

        filtered = transactions.filter(item => item.type === value);

    }

    filtered.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${item.date}</td>

        <td>${item.title}</td>

        <td>${item.category}</td>

        <td>${item.type}</td>

        <td class="${item.type === "income" ? "income-text" : "expense-text"}">

        ${item.type === "income" ? "+" : "-"}₹${item.amount}

        </td>

        <td>

        <button class="edit-btn"
        onclick="editTransaction(${item.id})">

        <i class="fa-solid fa-pen"></i>

        </button>

        <button class="delete-btn"
        onclick="deleteTransaction(${item.id})">

        <i class="fa-solid fa-trash"></i>

        </button>

        </td>

        `;

        table.appendChild(row);

    });

});

// =======================================
// DARK MODE
// =======================================

const themeBtn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

    else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});

// =======================================
// EXPORT CSV
// =======================================

const csvBtn = document.getElementById("csvBtn");

csvBtn.addEventListener("click", exportCSV);

function exportCSV(){

    if(transactions.length===0){

        alert("No transactions available!");

        return;

    }

    let csv="Date,Title,Category,Type,Amount\n";

    transactions.forEach(item=>{

        csv+=`${item.date},${item.title},${item.category},${item.type},${item.amount}\n`;

    });

    const blob=new Blob([csv],{type:"text/csv"});

    const url=window.URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="transactions.csv";

    a.click();

    window.URL.revokeObjectURL(url);

}

// =======================================
// BAR CHART
// =======================================

let barChart;
let pieChart;

function updateCharts(){

    let totalIncome=0;

    let totalExpense=0;

    transactions.forEach(item=>{

        if(item.type==="income"){

            totalIncome+=item.amount;

        }

        else{

            totalExpense+=item.amount;

        }

    });

    if(barChart){

        barChart.destroy();

    }

    if(pieChart){

        pieChart.destroy();

    }

    const bar=document.getElementById("barChart");

    if(bar){

        barChart=new Chart(bar,{

            type:"bar",

            data:{

                labels:["Income","Expense"],

                datasets:[{

                    data:[totalIncome,totalExpense],

                    backgroundColor:[

                        "#22c55e",

                        "#ef4444"

                    ]

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        display:false

                    }

                }

            }

        });

    }

    // ==========================
    // PIE CHART
    // ==========================

    let categoryData={};

    transactions.forEach(item=>{

        if(item.type==="expense"){

            if(categoryData[item.category]){

                categoryData[item.category]+=item.amount;

            }

            else{

                categoryData[item.category]=item.amount;

            }

        }

    });

    const pie=document.getElementById("pieChart");

    if(pie){

        pieChart=new Chart(pie,{

            type:"pie",

            data:{

                labels:Object.keys(categoryData),

                datasets:[{

                    data:Object.values(categoryData),

                    backgroundColor:[

                        "#3b82f6",

                        "#22c55e",

                        "#f59e0b",

                        "#ef4444",

                        "#8b5cf6",

                        "#06b6d4",

                        "#ec4899",

                        "#14b8a6"

                    ]

                }]

            },

            options:{

                responsive:true

            }

        });

    }

}