/* --- DATOS: Configuración de las Lecciones --- */
const lessons = [
    {
        id: 0,
        title: "Variables y Asignación",
        theory: `
            <p class="mb-4">Imagina que una variable es como una <strong>etiqueta</strong> que le pones a una caja para saber qué hay dentro. En Python, crear una variable es tan fácil como elegir un nombre y usar el operador <code>=</code>.</p>
            <div class="bg-slate-100 p-4 rounded-lg border-l-4 border-blue-500 mb-4 font-mono text-sm text-slate-700 shadow-sm">
                <span class="text-blue-600">nombre_variable</span> <span class="text-slate-400">=</span> <span class="text-green-600">valor</span>
            </div>
            <p>No necesitas decirle a Python qué tipo de dato es; él lo averigua por ti (tipado dinámico).</p>
        `,
        challenge: "Necesitamos guardar la edad de un usuario. Crea una variable llamada <code class='text-red-500 bg-red-50 px-1 rounded border border-red-100'>edad</code> y asígnale el valor <code class='text-blue-600 bg-blue-50 px-1 rounded border border-blue-100'>25</code>.",
        initialCode: "# Tu código va aquí\n\n",
        validate: (code) => {
            const regex = /(^|\n)\s*edad\s*=\s*25\s*($|\n|#)/;
            if (regex.test(code)) {
                return { success: true, output: "Variable creada en memoria: { edad: 25 }", message: "¡Excelente! Has definido tu primera variable." };
            } else {
                if(code.includes('25') && !code.includes('edad')) return { success: false, output: "Error: Valor 25 encontrado, pero falta la variable 'edad'.", message: "Revisa el nombre de la variable." };
                if(code.includes('edad') && !code.includes('25')) return { success: false, output: "Error: Variable 'edad' encontrada, valor incorrecto.", message: "La variable debe valer 25." };
                return { success: false, output: "NameError: name 'edad' is not defined", message: "Intenta escribir: edad = 25" };
            }
        }
    },
    {
        id: 1,
        title: "Strings y Concatenación",
        theory: `
            <p class="mb-4">Las cadenas de texto (<strong>Strings</strong>) son secuencias de caracteres encerradas en comillas. Puedes usar comillas simples <code>' '</code> o dobles <code>" "</code>.</p>
            <p class="mb-2">¿Quieres unir dos textos? ¡Súmalos!</p>
            <div class="bg-slate-100 p-4 rounded-lg border-l-4 border-violet-500 mb-4 font-mono text-sm text-slate-700 shadow-sm">
                print(<span class="text-green-600">"Hola "</span> + <span class="text-green-600">"Mundo"</span>)
            </div>
        `,
        challenge: "Usa <code>print()</code> para mostrar en la consola el saludo: <strong>Hola Python</strong>. Asegúrate de escribirlo exactamente igual.",
        initialCode: "# Imprime el saludo abajo\n",
        validate: (code) => {
            const regex = /print\s*\(\s*(["'])Hola Python\1\s*\)/;
            if (regex.test(code)) {
                return { success: true, output: "Hola Python", message: "¡Perfecto! Dominas la impresión en pantalla." };
            }
            return { success: false, output: "Error de salida", message: "Asegúrate de usar print() con el texto 'Hola Python' entre comillas." };
        }
    },
    {
        id: 2,
        title: "Lógica Condicional (If)",
        theory: `
            <p class="mb-4">Los programas necesitan tomar decisiones. La sentencia <code>if</code> (si) evalúa si algo es verdadero.</p>
            <div class="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4 text-sm text-amber-800 flex gap-3 items-start">
                <i class="fa-solid fa-triangle-exclamation mt-1"></i>
                <div><strong>¡Cuidado con la indentación!</strong><br>En Python, los espacios al inicio de la línea son obligatorios para indicar qué código va dentro del if.</div>
            </div>
            <div class="bg-slate-100 p-4 rounded-lg border-l-4 border-pink-500 font-mono text-sm text-slate-700 shadow-sm">
                <span class="text-purple-600">if</span> numero > <span class="text-blue-600">10</span>:<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-blue-600">print</span>(<span class="text-green-600">"Es grande"</span>)
            </div>
        `,
        challenge: "Escribe un <code>if</code> que verifique si <code>x</code> es mayor que 5. Si es cierto, imprime 'Mayor'. (x ya vale 10).",
        initialCode: "x = 10\n# Escribe tu if abajo:\n",
        validate: (code) => {
            const ifRegex = /if\s+x\s*>\s*5\s*:/;
            const printRegex = /\n\s+print\s*\(\s*(["'])Mayor\1\s*\)/;
            
            if (!ifRegex.test(code)) return { success: false, output: "SyntaxError: invalid syntax", message: "Revisa la línea del if. ¿Olvidaste los dos puntos ':'?" };
            if (!printRegex.test(code)) return { success: false, output: "IndentationError: expected an indented block", message: "El print debe tener 4 espacios antes." };
            
            return { success: true, output: "Mayor", message: "¡Lógica impecable!" };
        }
    }
];

/* --- UI Controller --- */
let currentIndex = 0;

const ui = {
    nav: document.getElementById('topic-list'),
    title: document.getElementById('lesson-title'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('lesson-progress-text'),
    theory: document.getElementById('theory-content'),
    desc: document.getElementById('challenge-desc'),
    editor: document.getElementById('code-input'),
    console: document.getElementById('console-output'),
    statusBadge: document.getElementById('status-badge'),
    btnRun: document.getElementById('run-btn'),
    btnNext: document.getElementById('next-btn'),
    menuBtn: document.getElementById('mobile-menu-btn')
};

function renderNav() {
    ui.nav.innerHTML = '';
    lessons.forEach((l, idx) => {
        const btn = document.createElement('button');
        btn.onclick = () => loadLesson(idx);
        const isActive = idx === currentIndex;
        
        // Estilos dinámicos para los botones de navegación
        btn.className = `w-full text-left px-6 py-4 text-sm font-medium transition-all duration-200 border-l-4 focus:outline-none flex items-center justify-between group ${
            isActive 
            ? 'nav-item active' 
            : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`;
        
        btn.innerHTML = `
            <span class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-md flex items-center justify-center text-xs ${isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}">${idx + 1}</span>
                ${l.title}
            </span>
            ${idx < currentIndex ? '<i class="fa-solid fa-check text-emerald-500"></i>' : ''}
        `;
        ui.nav.appendChild(btn);
    });
}

function loadLesson(idx) {
    currentIndex = idx;
    const lesson = lessons[idx];
    
    // Animación de carga
    ui.title.innerHTML = `<span class="inline-block w-2 h-8 bg-blue-500 rounded-full mr-1"></span> ${lesson.title}`;
    ui.theory.innerHTML = lesson.theory;
    ui.desc.innerHTML = lesson.challenge;
    ui.editor.value = lesson.initialCode;
    
    // Reset Console & Controls
    ui.console.innerHTML = `<span class="text-slate-500">$ python3 main.py</span><br><span class="opacity-50">Esperando ejecución...</span><span class="cursor-blink text-blue-500">_</span>`;
    ui.console.className = "bg-slate-900 rounded-lg p-4 font-mono text-sm min-h-[120px] max-h-[200px] overflow-y-auto custom-scrollbar text-slate-300 border border-slate-800 shadow-inner";
    ui.statusBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-500 uppercase";
    ui.statusBadge.innerText = "IDLE";
    
    ui.btnNext.classList.add('hidden');
    ui.btnNext.classList.remove('flex');
    ui.btnRun.innerHTML = '<i class="fa-solid fa-play text-xs"></i> Ejecutar';
    ui.btnRun.className = "flex-1 sm:flex-none px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-sm font-semibold rounded-lg shadow-lg shadow-emerald-900/20 transition-all-300 flex items-center justify-center gap-2 transform active:scale-95";

    // Update Progress
    const progress = Math.round(((idx) / lessons.length) * 100);
    ui.progressBar.style.width = `${progress}%`;
    ui.progressText.innerText = `${progress}%`;

    renderNav();
    
    // Mobile Menu Close
    if(window.innerWidth < 768) ui.nav.classList.add('hidden');
}

async function runCode() {
    const code = ui.editor.value;
    const lesson = lessons[currentIndex];

    // UI Loading State
    ui.btnRun.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-xs"></i> Procesando...';
    ui.btnRun.classList.add('opacity-75', 'cursor-not-allowed');
    ui.statusBadge.innerText = "RUNNING";
    ui.statusBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600 uppercase animate-pulse";

    // Simular delay de red/proceso
    await new Promise(r => setTimeout(r, 600));

    const result = lesson.validate(code);

    // Mostrar resultado en consola
    const timestamp = new Date().toLocaleTimeString();
    
    ui.btnRun.classList.remove('opacity-75', 'cursor-not-allowed');


    if (result.success) {
        ui.console.innerHTML = `
            <div class="mb-2 text-slate-500 border-b border-slate-800 pb-1">$ python3 main.py</div>
            <div class="text-emerald-400 font-bold mb-1">${result.output}</div>
            <div class="mt-2 text-xs text-slate-500">Process finished with exit code 0 (${timestamp})</div>
            <div class="mt-2 pt-2 border-t border-slate-800 text-emerald-300"><i class="fa-solid fa-check-circle"></i> ${result.message}</div>
        `;
        ui.console.className = "bg-slate-900 rounded-lg p-4 font-mono text-sm min-h-[120px] max-h-[200px] overflow-y-auto custom-scrollbar text-slate-300 border border-emerald-500/50 shadow-lg shadow-emerald-500/10";
        
        // Update Button & Status
        ui.btnRun.innerHTML = '<i class="fa-solid fa-rotate-right text-xs"></i> Reintentar';
        ui.btnRun.className = "px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg transition-all flex items-center gap-2";
        
        ui.statusBadge.innerText = "SUCCESS";
        ui.statusBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-600 uppercase";

        // Show Next
        ui.btnNext.classList.remove('hidden');
        ui.btnNext.classList.add('flex');
        
        // Update Progress if completed
        const progress = Math.round(((currentIndex + 1) / lessons.length) * 100);
        ui.progressBar.style.width = `${progress}%`;
        ui.progressText.innerText = `${progress}%`;

        renderNav();

    } else {
        ui.console.innerHTML = `
            <div class="mb-2 text-slate-500 border-b border-slate-800 pb-1">$ python3 main.py</div>
            <div class="text-red-400 font-bold mb-1">${result.output}</div>
            <div class="mt-2 text-xs text-slate-500">Process finished with exit code 1 (${timestamp})</div>
            <div class="mt-2 pt-2 border-t border-slate-800 text-red-300"><i class="fa-solid fa-circle-xmark"></i> ${result.message}</div>
        `;
        ui.console.className = "bg-slate-900 rounded-lg p-4 font-mono text-sm min-h-[120px] max-h-[200px] overflow-y-auto custom-scrollbar text-slate-300 border border-red-500/50 shadow-lg shadow-red-500/10";
        
        ui.btnRun.innerHTML = '<i class="fa-solid fa-play text-xs"></i> Ejecutar';
        
        ui.statusBadge.innerText = "ERROR";
        ui.statusBadge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase";

        // Hide Next
        ui.btnNext.classList.add('hidden');
        ui.btnNext.classList.remove('flex');
    }
}

// Listeners
ui.btnRun.addEventListener('click', runCode);
ui.btnNext.addEventListener('click', () => {
    if (currentIndex < lessons.length - 1) loadLesson(currentIndex + 1);
    else alert("¡Curso completado! 🚀");
});
ui.menuBtn.addEventListener('click', () => ui.nav.classList.toggle('hidden'));

// Tab support in Textarea
ui.editor.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
    }
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadLesson(0);
});