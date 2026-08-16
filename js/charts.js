// =======================================
// FinanceFlow - charts.js
// Handles ALL charts
// =======================================


// =======================================
// CHART INSTANCES
// =======================================

let barChart = null;
let pieChart = null;
let monthlyTrendChart = null;


// =======================================
// UPDATE ALL CHARTS
// =======================================

function updateCharts() {

    updateIncomeExpenseChart();

    updateExpenseDistributionChart();

    updateMonthlyTrendChart();

}


// =======================================
// 1. INCOME VS EXPENSE
// =======================================

function updateIncomeExpenseChart() {

    const canvas =
        document.getElementById("barChart");

    if (!canvas) {
        return;
    }


    let totalIncome = 0;
    let totalExpense = 0;


    // Calculate totals
    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount) || 0;


        if (transaction.type === "income") {

            totalIncome += amount;

        }

        else if (transaction.type === "expense") {

            totalExpense += amount;

        }

    });


    // Destroy previous chart
    if (barChart) {

        barChart.destroy();

        barChart = null;

    }


    // Create chart
    barChart = new Chart(
        canvas,
        {

            type: "bar",

            data: {

                labels: [
                    "Income",
                    "Expense"
                ],

                datasets: [

                    {
                        label: "Amount",

                        data: [
                            totalIncome,
                            totalExpense
                        ],

                        backgroundColor: [
                            "#22c55e",
                            "#ef4444"
                        ],

                        borderRadius: 10,

                        borderWidth: 0

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                plugins: {

                    legend: {
                        display: false
                    },


                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                return (
                                    " ₹" +
                                    Number(
                                        context.raw || 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                );

                            }

                        }

                    }

                },


                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {
                            color: "#94a3b8"
                        }

                    },


                    y: {

                        beginAtZero: true,

                        grid: {

                            color:
                                "rgba(148, 163, 184, 0.08)"

                        },


                        ticks: {

                            color: "#94a3b8",

                            callback: function(value) {

                                return (
                                    "₹" +
                                    Number(value)
                                        .toLocaleString("en-IN")
                                );

                            }

                        }

                    }

                }

            }

        }
    );

}


// =======================================
// 2. EXPENSE DISTRIBUTION
// =======================================

function updateExpenseDistributionChart() {

    const canvas =
        document.getElementById("pieChart");

    if (!canvas) {
        return;
    }


    const categoryData = {};


    // Calculate category-wise expenses
    transactions.forEach(transaction => {

        if (
            transaction.type !== "expense"
        ) {
            return;
        }


        const category =
            transaction.category || "Others";


        const amount =
            Number(transaction.amount) || 0;


        if (categoryData[category]) {

            categoryData[category] += amount;

        }

        else {

            categoryData[category] =
                amount;

        }

    });


    // Destroy previous chart
    if (pieChart) {

        pieChart.destroy();

        pieChart = null;

    }


    // ===================================
    // NO EXPENSES
    // ===================================

    if (
        Object.keys(categoryData).length === 0
    ) {

        pieChart = new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "No Expenses"
                    ],

                    datasets: [

                        {
                            data: [1],

                            backgroundColor: [
                                "#334155"
                            ],

                            borderWidth: 0

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "65%",


                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color: "#94a3b8",

                                usePointStyle: true

                            }

                        }

                    }

                }

            }
        );

        return;

    }


    // ===================================
    // CREATE DOUGHNUT CHART
    // ===================================

    pieChart = new Chart(
        canvas,
        {

            type: "doughnut",

            data: {

                labels:
                    Object.keys(categoryData),

                datasets: [

                    {

                        data:
                            Object.values(categoryData),

                        backgroundColor: [

                            "#3b82f6",
                            "#22c55e",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#06b6d4",
                            "#ec4899",
                            "#14b8a6"

                        ],

                        borderWidth: 0

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "65%",


                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            color: "#94a3b8",

                            padding: 15,

                            usePointStyle: true

                        }

                    },


                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                return (
                                    " " +
                                    context.label +
                                    ": ₹" +
                                    Number(
                                        context.raw || 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                );

                            }

                        }

                    }

                }

            }

        }
    );

}


// =======================================
// 3. MONTHLY ANALYTICS
// LAST 6 MONTHS
// =======================================

function updateMonthlyTrendChart() {

    const canvas =
        document.getElementById(
            "monthlyTrendChart"
        );


    if (!canvas) {

        console.warn(
            "monthlyTrendChart canvas not found."
        );

        return;

    }


    // ===================================
    // CREATE LAST 6 MONTHS
    // ===================================

    const months = [];

    const today = new Date();


    for (
        let i = 5;
        i >= 0;
        i--
    ) {

        const date =
            new Date(
                today.getFullYear(),
                today.getMonth() - i,
                1
            );


        months.push(date);

    }


    // ===================================
    // MONTH LABELS
    // ===================================

    const labels =
        months.map(month => {

            return month.toLocaleString(
                "en-US",
                {
                    month: "short"
                }
            );

        });


    // ===================================
    // DATA ARRAYS
    // ===================================

    const monthlyIncome =
        new Array(6).fill(0);

    const monthlyExpense =
        new Array(6).fill(0);


    // ===================================
    // PROCESS TRANSACTIONS
    // ===================================

    transactions.forEach(transaction => {

        if (!transaction.date) {
            return;
        }


        /*
         * Adding T00:00:00 prevents
         * timezone-related date shifting.
         */

        const transactionDate =
            new Date(
                transaction.date +
                "T00:00:00"
            );


        if (
            Number.isNaN(
                transactionDate.getTime()
            )
        ) {
            return;
        }


        months.forEach(
            (month, index) => {

                const sameMonth =
                    transactionDate.getFullYear()
                    ===
                    month.getFullYear()

                    &&

                    transactionDate.getMonth()
                    ===
                    month.getMonth();


                if (!sameMonth) {
                    return;
                }


                const amount =
                    Number(
                        transaction.amount
                    ) || 0;


                if (
                    transaction.type ===
                    "income"
                ) {

                    monthlyIncome[index] +=
                        amount;

                }

                else if (
                    transaction.type ===
                    "expense"
                ) {

                    monthlyExpense[index] +=
                        amount;

                }

            }
        );

    });


    // ===================================
    // DESTROY OLD MONTHLY CHART
    // ===================================

    if (monthlyTrendChart) {

        monthlyTrendChart.destroy();

        monthlyTrendChart = null;

    }


    // ===================================
    // CREATE MONTHLY LINE CHART
    // ===================================

    monthlyTrendChart =
        new Chart(
            canvas,
            {

                type: "line",


                data: {

                    labels: labels,


                    datasets: [

                        // =========================
                        // INCOME
                        // =========================

                        {

                            label: "Income",

                            data:
                                monthlyIncome,

                            borderColor:
                                "#22c55e",

                            backgroundColor:
                                "rgba(34, 197, 94, 0.08)",

                            borderWidth: 3,

                            tension: 0.35,

                            fill: true,

                            pointRadius: 5,

                            pointHoverRadius: 8,

                            pointBackgroundColor:
                                "#22c55e",

                            pointBorderWidth: 2

                        },


                        // =========================
                        // EXPENSE
                        // =========================

                        {

                            label: "Expense",

                            data:
                                monthlyExpense,

                            borderColor:
                                "#ef4444",

                            backgroundColor:
                                "rgba(239, 68, 68, 0.06)",

                            borderWidth: 3,

                            tension: 0.35,

                            fill: true,

                            pointRadius: 5,

                            pointHoverRadius: 8,

                            pointBackgroundColor:
                                "#ef4444",

                            pointBorderWidth: 2

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    interaction: {

                        mode: "index",

                        intersect: false

                    },


                    animation: {

                        duration: 900,

                        easing: "easeOutQuart"

                    },


                    plugins: {

                        legend: {

                            display: true,

                            position: "top",


                            labels: {

                                color:
                                    "#cbd5e1",

                                usePointStyle: true,

                                pointStyle:
                                    "circle",

                                padding: 18,

                                boxWidth: 8,

                                font: {

                                    size: 12,

                                    weight: "500"

                                }

                            }

                        },


                        tooltip: {

                            backgroundColor:
                                "#0f172a",

                            titleColor:
                                "#ffffff",

                            bodyColor:
                                "#e2e8f0",

                            borderColor:
                                "rgba(255,255,255,0.1)",

                            borderWidth: 1,

                            padding: 12,


                            displayColors: true,


                            callbacks: {

                                label:
                                    function(context) {

                                        const value =
                                            Number(
                                                context.raw
                                            ) || 0;


                                        return (
                                            context.dataset.label +
                                            ": ₹" +
                                            value.toLocaleString(
                                                "en-IN"
                                            )
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        // =========================
                        // X AXIS
                        // =========================

                        x: {

                            grid: {

                                color:
                                    "rgba(148, 163, 184, 0.08)"

                            },


                            ticks: {

                                color:
                                    "#94a3b8",

                                font: {

                                    size: 11

                                }

                            }

                        },


                        // =========================
                        // Y AXIS
                        // =========================

                        y: {

                            beginAtZero: true,


                            grid: {

                                color:
                                    "rgba(148, 163, 184, 0.08)"

                            },


                            ticks: {

                                color:
                                    "#94a3b8",

                                font: {

                                    size: 11

                                },


                                callback:
                                    function(value) {

                                        if (
                                            value >=
                                            100000
                                        ) {

                                            return (
                                                "₹" +
                                                (
                                                    value /
                                                    100000
                                                ).toFixed(1) +
                                                "L"
                                            );

                                        }


                                        if (
                                            value >=
                                            1000
                                        ) {

                                            return (
                                                "₹" +
                                                (
                                                    value /
                                                    1000
                                                ).toFixed(0) +
                                                "K"
                                            );

                                        }


                                        return (
                                            "₹" +
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }

        );


    // ===================================
    // DEBUG INFORMATION
    // ===================================

    console.log(
        "Monthly Income:",
        monthlyIncome
    );

    console.log(
        "Monthly Expense:",
        monthlyExpense
    );

    console.log(
        "Monthly Labels:",
        labels
    );

}


// =======================================
// OPTIONAL: UPDATE CHARTS WHEN PAGE LOADS
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
         * Small delay ensures that:
         * 1. storage.js has loaded
         * 2. Chart.js has loaded
         * 3. HTML canvas elements exist
         */

        setTimeout(() => {

            if (
                typeof transactions !==
                "undefined"
            ) {

                updateCharts();

            }

        }, 100);

    }
);