// B.O.O.B.A. script v1.0
(function() {
    const customization = window.BOOBACustomization;
    if (!customization) {
        console.error("Customization settings are missing.");
        return;
    }

    // Check if PWA install is supported
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        init();
    });

    function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const installer = urlParams.get('installer');
        if (installer === 'instant') {
            installPWA();
        }
    }

    function createDialog(fullWindow = false) {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '0';
        dialog.style.left = '0';
        dialog.style.width = '100%';
        dialog.style.height = fullWindow ? '100%' : 'auto';
        dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        dialog.style.backgroundImage = `url(${customization.backgroundImage})`;
        dialog.style.backgroundSize = 'cover';
        dialog.style.display = 'flex';
        dialog.style.flexDirection = 'column';
        dialog.style.alignItems = 'center';
        dialog.style.justifyContent = 'center';
        dialog.style.zIndex = '10000';

        const icon = document.createElement('img');
        icon.src = customization.appIcon;
        icon.style.width = '100px';
        icon.style.height = '100px';
        dialog.appendChild(icon);

        const title = document.createElement('h1');
        title.innerText = customization.appName;
        title.style.color = '#fff';
        dialog.appendChild(title);

        const installButton = document.createElement('button');
        installButton.innerText = 'Install PWA';
        installButton.onclick = installPWA;
        dialog.appendChild(installButton);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.onclick = () => document.body.removeChild(dialog);
        dialog.appendChild(closeButton);

        document.body.appendChild(dialog);
    }

    function installPWA() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('PWA installed');
                } else {
                    console.log('PWA installation dismissed');
                }
                deferredPrompt = null;
            });
        }
    }

    // Expose functions to the global scope
    window.BOOBAScript = {
        createDialogBox: () => createDialog(false),
        createFullWindowDialog: () => createDialog(true),
        installPWA: installPWA
    };

    // Auto-run installer if query parameter is present
    init();
})();
