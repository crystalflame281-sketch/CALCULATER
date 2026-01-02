/* =========================================
   1. منطق التبديل بين التبويبات (Tabs Logic)
   ========================================= */
function switchTab(tabName) {
    // إخفاء جميع الأقسام
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // إزالة التنشيط من جميع أزرار التبويب
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // تفعيل القسم المطلوب
    document.getElementById(tabName).classList.add('active');
    
    // تفعيل الزر الذي تم الضغط عليه
    // نستخدم event.currentTarget لضمان تحديد الزر حتى لو ضغطنا على الأيقونة داخله
    event.currentTarget.classList.add('active');
}

/* =========================================
   2. منطق الآلة الحاسبة العلمية (Scientific Calculator)
   ========================================= */
const display = document.getElementById('display');
let currentInput = ""; // المتغير الذي يحمل النص الذي سيتم حسابه

// دالة لإضافة الأرقام والعمليات البسيطة
function addVal(val) {
    // منع تكرار العمليات الحسابية المتتالية (مثل ++)
    const lastChar = currentInput.slice(-1);
    const operators = ['+', '-', '*', '/', '%', '.'];
    
    if (operators.includes(lastChar) && operators.includes(val)) {
        // استبدال العملية القديمة بالجديدة
        currentInput = currentInput.slice(0, -1) + val;
    } else {
        currentInput += val;
    }
    
    updateDisplay();
}

// دالة لإضافة الدوال العلمية (sin, cos, log...)
function addFunc(func) {
    currentInput += func;
    updateDisplay();
}

// تحديث الشاشة (نقوم بتنظيف كلمة Math لجعل الشكل أجمل للمستخدم)
function updateDisplay() {
    // استبدال Math.sin بـ sin للعرض فقط
    let displayString = currentInput
        .replace(/Math.sin\(/g, 'sin(')
        .replace(/Math.cos\(/g, 'cos(')
        .replace(/Math.tan\(/g, 'tan(')
        .replace(/Math.log10\(/g, 'log(')
        .replace(/Math.log\(/g, 'ln(')
        .replace(/Math.sqrt\(/g, '√(')
        .replace(/Math.PI/g, 'π')
        .replace(/Math.E/g, 'e')
        .replace(/\*\*/g, '^'); // استبدال الأس بشكل جمالي

    display.value = displayString;
}

// مسح الشاشة بالكامل
function clearDisplay() {
    currentInput = "";
    display.value = "";
}

// حذف آخر مدخل
function deleteLast() {
    // إذا كان آخر مدخل هو دالة كاملة مثل "Math.sin(" نحذفها دفعة واحدة
    if (currentInput.endsWith("Math.sin(") || 
        currentInput.endsWith("Math.cos(") || 
        currentInput.endsWith("Math.tan(") ||
        currentInput.endsWith("Math.log(")) {
        currentInput = currentInput.slice(0, -9); // حذف عدد حروف الدالة
    } else if (currentInput.endsWith("Math.log10(")) {
        currentInput = currentInput.slice(0, -11);
    } else if (currentInput.endsWith("Math.sqrt(")) {
        currentInput = currentInput.slice(0, -10);
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// حساب النتيجة النهائية
function calculate() {
    try {
        if (currentInput === "") return;

        // تنفيذ العملية الحسابية
        let result = eval(currentInput);

        // التعامل مع الأرقام العشرية الطويلة
        if (!Number.isInteger(result)) {
            result = result.toFixed(8); // تقريب لـ 8 خانات عشرية
            result = parseFloat(result); // إزالة الأصفار الزائدة من اليمين
        }

        display.value = result;
        currentInput = result.toString(); // تحديث المتغير بالنتيجة لإكمال الحساب عليها
    } catch (error) {
        display.value = "خطأ رياضي";
        setTimeout(() => {
            clearDisplay();
        }, 1500);
    }
}

/* =========================================
   3. منطق محول العملات (Currency Converter)
   ========================================= */

// أسعار الصرف التقريبية مقابل 1 دولار أمريكي (Fixed Rates Base USD)
const exchangeRates = {
    "USD": 1,       // الدولار الأمريكي
    "EUR": 0.92,    // اليورو
    "GBP": 0.79,    // الجنيه الاسترليني
    "SAR": 3.75,    // الريال السعودي
    "AED": 3.67,    // الدرهم الإماراتي
    "KWD": 0.31,    // الدينار الكويتي
    "EGP": 48.50,   // الجنيه المصري (متغير)
    "MAD": 10.10,   // الدرهم المغربي
    "JOD": 0.71,    // الدينار الأردني
    "TRY": 32.50,   // الليرة التركية
    "CNY": 7.23,    // اليوان الصيني
    "JPY": 151.5    // الين الياباني
};

function convertCurrency() {
    const amountInput = document.getElementById('amount');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const resultBox = document.getElementById('conversionResult');

    let amount = parseFloat(amountInput.value);

    // التحقق من صحة الرقم
    if (isNaN(amount) || amount < 0) {
        resultBox.style.display = 'block';
        resultBox.style.backgroundColor = '#e84118'; // لون أحمر للخطأ
        resultBox.style.color = '#fff';
        resultBox.innerText = "الرجاء إدخال مبلغ صحيح";
        return;
    }

    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    // الحصول على أسعار الصرف
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];

    // معادلة التحويل: (المبلغ / سعر عملة المصدر) * سعر عملة الهدف
    // لأن جميع الأسعار مرتبطة بالدولار
    const result = (amount / rateFrom) * rateTo;

    // عرض النتيجة
    resultBox.style.display = 'block';
    resultBox.style.backgroundColor = '#4cd137'; // لون أخضر للنجاح
    resultBox.style.color = '#2f3640';
    
    // تنسيق الرقم ليظهر الفواصل (مثلاً 1,200.50)
    const formattedResult = result.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });

    resultBox.innerText = `${formattedResult} ${toCurrency}`;
}

/* =========================================
   4. دعم لوحة المفاتيح (Keyboard Support)
   ========================================= */
document.addEventListener('keydown', function(event) {
    // التأكد من أننا في تبويب الآلة الحاسبة
    const calcSection = document.getElementById('calculator');
    if (!calcSection.classList.contains('active')) return;

    const key = event.key;

    // الأرقام والعمليات الأساسية
    if ((key >= '0' && key <= '9') || key === '.') {
        addVal(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        addVal(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // منع السطر الجديد
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});