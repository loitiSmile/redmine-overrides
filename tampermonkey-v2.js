// ==UserScript==
// @name         Redmine5 - OVERRIDE CSS & PRIORITY COLORS (github)
// @description  Injects custom CSS overrides and applies priority colors dynamically in Redmine 5
// @downloadURL https://raw.githubusercontent.com/loitiSmile/redmine-overrides/master/tampermonkey-v2.js
// @author       loitiSmile
// @tag          production
// @tag          github-fetch
// @version      2.0.0
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    // At the very start, hide the page to prevent flickering
    document.documentElement.style.visibility = 'hidden';

    // --- 1. Replace application.css with dynamic version ---
    // --- Get the timestamp from Redmine's jQuery UI file ---
    // This is used to ensure that the correct version of the CSS is loaded
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

    // --- 2. Inject CSS overrides from Github's sources ---
    const overrideHref = "https://raw.githubusercontent.com/loitiSmile/redmine-overrides/master/overrides.css";
    // Fetch the override CSS file from GitHub
    fetch(overrideHref)
        .then(response => {
            if (!response.ok) throw new Error("Tampermonkey: Erreur chargement CSS override");
            return response.text();
        })
        .then(cssText => {
            const style = document.createElement('style');
            style.textContent = cssText;
            document.head.appendChild(style);

            // --- Make the page visible after CSS injection ---
            // This ensures that the page is only visible after the CSS has been applied and prevents flickering.
            document.documentElement.style.visibility = 'visible';

            console.log("Tampermonkey: Override CSS injecté et page visible");
        })
        .catch(e => {
            console.error("Tampermonkey: Erreur injection CSS override:", e);
            // Make the page visible even if the CSS fails to load
            // This prevents the page from being stuck hidden in case of an error.
            document.documentElement.style.visibility = 'visible';
        });

    // --- 3. Adds priority colors dynamically ---
    // This function applies specific styles to priority cells based on their text content
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
                    td.classList.add("high");
                    break;
                case 'critique':
                case 'critical':
                    td.classList.add("critical");
                    break;
                default:
                    break;
            }
        });
    };

    // --- 4. Apply priority colors on initial load and dynamically ---
    // This ensures that the priority colors are applied both on initial load
    window.addEventListener('DOMContentLoaded', () => {
        applyPriorityColors();
        // Observe changes in the document body to apply priority colors dynamically
        const observer = new MutationObserver(applyPriorityColors);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
