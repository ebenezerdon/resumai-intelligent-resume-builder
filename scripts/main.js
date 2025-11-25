$(function() {
    // Contract Check
    if (!window.App || !window.App.init) {
        console.error('App.init missing');
        return;
    }

    // Initialize App
    try {
        App.init();
    } catch (e) {
        console.error('Init failed', e);
    }

    // Event Listeners for Toolbar
    $('#template-selector').val(App.Storage.get('resume_data')?.meta?.template || 'modern').on('change', function() {
        App.setTemplate($(this).val());
    });

    $('#btn-reset').on('click', function() {
        App.resetData();
    });

    $('#btn-print').on('click', function() {
        window.print();
    });

    // Zoom Controls
    let zoom = 1;
    const $preview = $('#resume-preview');
    
    function updateZoom() {
        // Use CSS zoom where supported (Chrome/Edge/Safari) for correct layout reflow
        // Fallback to transform for others, though scrollbars may behave differently
        if ('zoom' in document.body.style) {
            $preview.css('zoom', zoom);
            $preview.css('transform', 'none');
        } else {
            $preview.css('transform', `scale(${zoom})`);
             // Adjust margins for Firefox transform scaling to prevent clip
            const height = $preview.outerHeight();
            const marginY = (height * zoom - height) / 2;
            $preview.css('margin-bottom', marginY);
            $preview.css('margin-top', marginY);
        }
        $('#zoom-level').text(`${Math.round(zoom * 100)}%`);
    }

    $('#zoom-in').on('click', () => {
        if(zoom < 1.5) { zoom += 0.1; updateZoom(); }
    });

    $('#zoom-out').on('click', () => {
        if(zoom > 0.5) { zoom -= 0.1; updateZoom(); }
    });

    // Responsive Sidebar toggle (if needed for mobile, though main requirements imply desktop-focused tool)
    // Simple fix for mobile layout: stack editor on top of preview in CSS (done via flex-col on body, but app.html structure is row for lg)
    // We add a class to handle mobile orientation change if needed, but Tailwind classes handle most layout shifts.

});