window.App = window.App || {};

(function() {
    // --- Local Storage Wrapper ---
    App.Storage = {
        get(key, defaultValue) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage parse error', e);
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Storage set error', e);
            }
        }
    };

    // --- ID Generator ---
    App.generateId = function() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    };

    // --- Debounce ---
    App.debounce = function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // --- Toast Notification ---
    App.toast = function(message, type = 'success') {
        const $container = $('#toast-container');
        if (!$container.length) return;

        const colors = {
            success: 'bg-slate-800 text-white border-slate-700',
            error: 'bg-red-50 text-red-800 border-red-200',
            info: 'bg-blue-50 text-blue-800 border-blue-200'
        };

        const icon = type === 'success' 
            ? '<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' 
            : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

        const $toast = $(`
            <div class="${colors[type]} px-4 py-3 rounded-lg shadow-xl border flex items-center gap-3 transform translate-y-10 opacity-0 transition-all duration-300 min-w-[300px]">
                ${icon}
                <span class="text-sm font-medium">${message}</span>
            </div>
        `);

        $container.append($toast);
        
        // Animate in
        requestAnimationFrame(() => {
            $toast.removeClass('translate-y-10 opacity-0');
        });

        // Animate out
        setTimeout(() => {
            $toast.addClass('opacity-0 translate-y-2');
            setTimeout(() => $toast.remove(), 300);
        }, 3000);
    };
})();