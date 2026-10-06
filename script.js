// تعريف العناصر
const expenseForm = document.getElementById('expenseForm');
const salesForm = document.getElementById('salesForm');

const expenseTableBody = document.getElementById('expenseTableBody');
const salesTableBody = document.getElementById('salesTableBody');

const totalExpensesDisplay = document.getElementById('totalExpenses');
const totalSalesDisplay = document.getElementById('totalSales');

const emptyExpenses = document.getElementById('emptyExpenses');
const emptySales = document.getElementById('emptySales');
const clearAllBtn = document.getElementById('clearAll');

// ضبط التواريخ الافتراضية
document.getElementById('expenseDate').valueAsDate = new Date();
document.getElementById('salesDate').valueAsDate = new Date();

// جلب البيانات من LocalStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let salesRecords = JSON.parse(localStorage.getItem('salesRecords')) || [];

function renderApp() {
    // 1. عرض المصاريف
    expenseTableBody.innerHTML = '';
    let totalExp = 0;
    if (expenses.length === 0) {
        emptyExpenses.style.display = 'block';
    } else {
        emptyExpenses.style.display = 'none';
        expenses.forEach((item, index) => {
            totalExp += Number(item.amount);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${escapeHtml(item.title)}</strong></td>
                <td style="color: #f43f5e;">$${Number(item.amount).toFixed(2)}</td>
                <td>${item.date}</td>
                <td><button class="delete-btn" onclick="deleteExpense(${index})"><i class="fa-solid fa-trash"></i></button></td>
            `;
            expenseTableBody.appendChild(row);
        });
    }
    totalExpensesDisplay.textContent = `$${totalExp.toFixed(2)}`;

    // 2. عرض المبيعات والإنتاج
    salesTableBody.innerHTML = '';
    let totalSl = 0;
    if (salesRecords.length === 0) {
        emptySales.style.display = 'block';
    } else {
        emptySales.style.display = 'none';
        salesRecords.forEach((item, index) => {
            totalSl += Number(item.profit);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${escapeHtml(item.product)}</strong></td>
                <td>${item.produced}</td>
                <td><span style="color: #4ade80; font-weight: bold;">${item.sold}</span></td>
                <td>${escapeHtml(item.client)}</td>
                <td style="color: #38bdf8; font-weight: bold;">$${Number(item.profit).toFixed(2)}</td>
                <td>${item.date}</td>
                <td><button class="delete-btn" onclick="deleteSale(${index})"><i class="fa-solid fa-trash"></i></button></td>
            `;
            salesTableBody.appendChild(row);
        });
    }
    totalSalesDisplay.textContent = `$${totalSl.toFixed(2)}`;
}

// إضافة مصروف
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('expenseTitle').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;

    if (!title || isNaN(amount)) return;

    expenses.push({ title, amount, date });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    document.getElementById('expenseTitle').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDate').valueAsDate = new Date();
    renderApp();
});

// إضافة مبيعات وإنتاج (تمت إضافة renderApp هنا لكي يظهر السجل وتتحدث الصفحة فوراً)
salesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = document.getElementById('productName').value.trim();
    const produced = parseInt(document.getElementById('prodQuantity').value);
    const sold = parseInt(document.getElementById('soldQuantity').value);
    const client = document.getElementById('clientName').value.trim();
    const profit = parseFloat(document.getElementById('totalProfit').value);
    const date = document.getElementById('salesDate').value;

    if (!product || isNaN(produced) || isNaN(sold) || !client || isNaN(profit)) return;

    salesRecords.push({ product, produced, sold, client, profit, date });
    localStorage.setItem('salesRecords', JSON.stringify(salesRecords));

    salesForm.reset();
    document.getElementById('salesDate').valueAsDate = new Date();
    
    // استدعاء دالة التحديث لتظهر العناصر فوراً في الجدول
    renderApp();
});

// حذف مصروف
window.deleteExpense = function(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderApp();
};

// حذف سجل بيع
window.deleteSale = function(index) {
    salesRecords.splice(index, 1);
    localStorage.setItem('salesRecords', JSON.stringify(salesRecords));
    renderApp();
};

// مسح جميع المصاريف
clearAllBtn.addEventListener('click', () => {
    if(confirm('هل تريد مسح جميع المصاريف؟')) {
        expenses = [];
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderApp();
    }
});

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// التشغيل الأولي
renderApp();