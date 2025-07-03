// ==UserScript==
// @name         Redmine5 - OVERRIDE CSS & PRIORITY COLORS
// @match        *://*/*
// @run-at       document-idle
// ==/UserScript==

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
                    td.classList.add("medium");
                    break;
                case 'critique':
                case 'critical':
                    td.classList.add("high");
                    break;
                default:
                    break;
            }
        });
    };

    // --- 3. Exécuter toutes les règles ---
    const runAll = () => {
        applyPriorityColors();
    };

    // Initialisation
    runAll();

    // Observer les changements dynamiques
    const observer = new MutationObserver(runAll);
    observer.observe(document.body, { childList: true, subtree: true });
})();
