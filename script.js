// العناصر الأساسية في الصفحة
const expenseForm = document.getElementById('expenseForm');
const expenseTitleInput = document.getElementById('expenseTitle');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseDateInput = document.getElementById('expenseDate');
const expenseTableBody = document.getElementById('expenseTableBody');
const totalAmountDisplay = document.getElementById('totalAmount');
const emptyState = document.getElementById('emptyState');
const clearAllBtn = document.getElementById('clearAll');

// ضبط تاريخ اليوم افتراضياً في حقل التاريخ عند فتح الصفحة
document.getElementById('expenseDate').valueAsDate = new Date();

// جلب البيانات المحفوظة مسبقاً من الـ LocalStorage أو مصفوفة فارغة
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// دالة لتحديث واجهة المستخدم وعرض البيانات
function renderApp() {
    expenseTableBody.innerHTML = '';
    let total = 0;

    if (expenses.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        
        // ترتيب المصاريف من الأحدث للأقدم بناءً على التاريخ
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        expenses.forEach((expense, index) => {
            total += Number(expense.amount);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${escapeHtml(expense.title)}</strong></td>
                <td style="color: #38bdf8; font-weight: 600;">$${Number(expense.amount).toFixed(2)}</td>
                <td><i class="fa-regular fa-calendar-days" style="margin-left: 5px; color: #94a3b8;"></i> ${expense.date}</td>
                <td>
                    <button class="delete-btn" onclick="deleteExpense(${index})" title="حذف">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            expenseTableBody.appendChild(row);
        });
    }

    // تحديث إجمالي المصروفات الشهرية
    totalAmountDisplay.textContent = `$${total.toFixed(2)}`;
}

// إضافة مصروف جديد
expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = expenseTitleInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const date = expenseDateInput.value;

    if (!title || isNaN(amount) || !date) return;

    const newExpense = {
        title,
        amount,
        date
    };

    expenses.push(newExpense);
    saveAndRefresh();

    // إعادة تعيين الحامل
    expenseTitleInput.value = '';
    expenseAmountInput.value = '';
    expenseDateInput.valueAsDate = new Date(); // إرجاع تاريخ اليوم
});

// حذف مصروف معين
window.deleteExpense = function(index) {
    expenses.splice(index, 1);
    saveAndRefresh();
}

// حذف جميع المصاريف
clearAllBtn.addEventListener('click', function() {
    if (expenses.length > 0 && confirm('هل أنت متأكد من رغبتك في حذف جميع سجلات المصاريف؟')) {
        expenses = [];
        saveAndRefresh();
    }
});

// حفظ البيانات في الـ LocalStorage وتحديث الشاشة
function saveAndRefresh() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderApp();
}

// حماية بسيطة ضد الـ XSS
function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// التشغيل الأولي عند تحميل الصفحة
renderApp();