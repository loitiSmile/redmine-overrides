// ==UserScript==
// @name         Redmine - RESTORE DEFAULT CLASSIC THEME (github)
// @author       loitiSmile
// @description  Disables the Opale theme and loads the default Redmine 6 classic stylesheet from jsDelivr CDN
// @downloadURL  https://raw.githubusercontent.com/loitiSmile/redmine-overrides/feat/redmine6-overrides/tampermonkey-v2.js
// @updateURL    https://raw.githubusercontent.com/loitiSmile/redmine-overrides/feat/redmine6-overrides/tampermonkey-v2.js
// @supportURL   https://github.com/loitiSmile/redmine-overrides
// @license      GPL-3.0
// @version      2.2.1
// @tag          production
// @tag          github-fetch
// @match        https://*.alterway.fr/*
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    // At the very start, hide the page to prevent flickering
    document.documentElement.style.visibility = 'hidden';

    // 1. Inject the official Redmine 6.0 default stylesheet as soon as <head> is ready
    const injectDefaultTheme = () => {
        if (document.getElementById("redmine-default-theme")) return;
        const defaultLink = document.createElement("link");
        defaultLink.id = "redmine-default-theme";
        defaultLink.rel = "stylesheet";
        defaultLink.media = "all";
        defaultLink.href = "https://cdn.jsdelivr.net/gh/redmine/redmine@6.0-stable/app/assets/stylesheets/application.css";
        
        defaultLink.onload = () => {
            document.documentElement.style.visibility = 'visible';
            console.log("Tampermonkey: Default Redmine 6 theme injected successfully.");
        };
        defaultLink.onerror = () => {
            document.documentElement.style.visibility = 'visible';
            console.error("Tampermonkey: Failed to load default Redmine 6 stylesheet.");
        };
        document.head.appendChild(defaultLink);
    };

    if (document.head) {
        injectDefaultTheme();
    } else {
        const headObserver = new MutationObserver((mutations, obs) => {
            if (document.head) {
                injectDefaultTheme();
                obs.disconnect();
            }
        });
        headObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    // 2. Disable Opale stylesheet as soon as it is appended by the browser parser
    const disableOpale = (link) => {
        link.disabled = true;
        link.remove();
        console.log("Tampermonkey: Successfully disabled Opale stylesheet.");
    };

    const opaleObserver = new MutationObserver(() => {
        const opaleLink = document.querySelector('link[rel="stylesheet"][href*="/themes/opale/application"]');
        if (opaleLink) {
            disableOpale(opaleLink);
            opaleObserver.disconnect(); // Stop observing once disabled
        }
    });
    opaleObserver.observe(document.documentElement, { childList: true, subtree: true });

    // 3. Inject CSS overrides from Github's sources
    const overrideHref = "https://raw.githubusercontent.com/loitiSmile/redmine-overrides/feat/redmine6-overrides/overrides.css";
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
            document.documentElement.style.visibility = 'visible';
        });

    // 4. Adds priority colors dynamically
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

    window.addEventListener('DOMContentLoaded', () => {
        applyPriorityColors();
        const observer = new MutationObserver(applyPriorityColors);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
