// ==UserScript==
// @name         Redmine - RESTORE DEFAULT CLASSIC THEME (github)
// @author       loitiSmile
// @description  Disables the Opale theme and loads the default Redmine 6 classic stylesheet from jsDelivr CDN
// @downloadURL  https://raw.githubusercontent.com/loitiSmile/redmine-overrides/feat/redmine6-overrides/tampermonkey-v2.js
// @updateURL    https://raw.githubusercontent.com/loitiSmile/redmine-overrides/feat/redmine6-overrides/tampermonkey-v2.js
// @supportURL   https://github.com/loitiSmile/redmine-overrides
// @license      GPL-3.0
// @version      2.2.0
// @tag          production
// @tag          github-fetch
// @match        https://*.alterway.fr/*
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    // At the very start, hide the page to prevent flickering
    document.documentElement.style.visibility = 'hidden';

    // Function to disable Opale and inject official Default Redmine 6 stylesheet
    const applyDefaultTheme = () => {
        // 1. Find and remove/disable Opale theme stylesheet
        const opaleLink = document.querySelector('link[rel="stylesheet"][href*="/themes/opale/application"]');
        if (opaleLink) {
            opaleLink.disabled = true;
            opaleLink.remove();
        }

        // 2. Create and inject the official Redmine 6.0 default stylesheet from jsDelivr CDN
        const defaultLink = document.createElement("link");
        defaultLink.id = "redmine-default-theme";
        defaultLink.rel = "stylesheet";
        defaultLink.media = "all";
        defaultLink.href = "https://cdn.jsdelivr.net/gh/redmine/redmine@6.0-stable/app/assets/stylesheets/application.css";
        
        // Show page as soon as the stylesheet is loaded or fails
        defaultLink.onload = () => {
            document.documentElement.style.visibility = 'visible';
            console.log("Tampermonkey: Default Redmine 6 theme loaded successfully.");
        };
        defaultLink.onerror = () => {
            document.documentElement.style.visibility = 'visible';
            console.error("Tampermonkey: Failed to load default Redmine 6 stylesheet.");
        };

        document.head.appendChild(defaultLink);
    };

    // --- Apply on document-start to prevent flash of Opale theme ---
    if (document.head) {
        applyDefaultTheme();
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.head) {
                applyDefaultTheme();
                obs.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // --- 2. Inject CSS overrides from Github's sources ---
    const overrideHref = "https://raw.githubusercontent.com/loitiSmile/redmine-overrides/feat/redmine6-overrides/overrides.css";
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
            console.log("Tampermonkey: Override CSS injecté");
        })
        .catch(e => {
            console.error("Tampermonkey: Erreur injection CSS override:", e);
            // Ensure page is visible even if overrides fail
            document.documentElement.style.visibility = 'visible';
        });

    // --- 3. Adds priority colors dynamically ---
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
    window.addEventListener('DOMContentLoaded', () => {
        applyPriorityColors();
        const observer = new MutationObserver(applyPriorityColors);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
