(function () {
    'use strict';

    // --- 1. Remplacer application.css avec version dynamique ---
    const sourceLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .find(link => link.href.includes('/stylesheets/jquery/jquery-ui-1.13.2.css'));

    if (sourceLink) {
        const queryStringMatch = sourceLink.href.match(/\?(\d+)$/);
        if (queryStringMatch) {
            const queryString = queryStringMatch[1];

            const targetLinks = document.querySelectorAll('link[rel="stylesheet"][href*="/themes/PurpleMine/stylesheets/application.css"]');
            targetLinks.forEach(link => {
                const newLink = document.createElement("link");
                newLink.rel = "stylesheet";
                newLink.media = "all";
                newLink.href = `/stylesheets/application.css?${queryString}`;
                link.parentNode.replaceChild(newLink, link);
            });
        }
    }

    // --- 2. Appliquer les couleurs de priorité ---
    const applyPriorityColors = () => {
        document.querySelectorAll('td.priority').forEach(td => {
            const text = td.textContent.trim().toLowerCase();

            switch (text) {

                case 'low':
                case 'basse':
                    td.classList.add("low");
                    break;
                case 'moyenne':
                case 'medium':
                case 'average':
                    td.classList.add("medium");
                    break;
                case 'high':
                case 'haute':
                    td.style.backgroundColor = '#ffc7c7';
                    td.style.color = '#000000';
                    td.classList.add("medium");
                    break;
                case 'critique':
                case 'critical':
                    td.style.backgroundColor = '#f98484';
                    td.style.color = '#000000';
                    td.classList.add("high");
                    break;
                default:
                    break;
            }
        });
    };

    // --- 3. Appliquer les couleurs sur les menus ---
    const applyHeaderColors = () => {
        const topMenu = document.querySelector('#top-menu');
        const header = document.querySelector('#header');
        if (topMenu) topMenu.style.backgroundColor = '#36266b';
        if (header) header.style.backgroundColor = '#614ba6';
    };

    // --- 4. Appliquer style max-width sur la sidebar ---
    const applySidebarStyle = () => {
        const sidebar = document.querySelector('#sidebar');
        if (sidebar) {
            sidebar.style.maxWidth = '250px';
        }
    };

    // --- 5. Forcer le texte globalement en noir sauf sur td.priority ---
    const injectGlobalTextColor = () => {
        const style = document.createElement('style');
        style.textContent = `
      tr.context-menu-selection td.crtical {
        color: #ffffff !important;
      }
      td.priority {
        color: #000000 !important;
      }
      td.priority:hover {
        color: #000000 !important;
      }
    `;
        document.head.appendChild(style);
    };

    // --- 6. Exécuter toutes les règles ---
    const runAll = () => {
        applyPriorityColors();
        applyHeaderColors();
        applySidebarStyle();
    };

    // Initialisation
    injectGlobalTextColor();
    runAll();

    // Observer les changements dynamiques
    const observer = new MutationObserver(runAll);
    observer.observe(document.body, { childList: true, subtree: true });
})();
