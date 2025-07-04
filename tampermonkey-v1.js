// ==UserScript==
// @name         Redmine5 - OVERRIDE CSS & PRIORITY COLORS (local)
// @description  Compute overrides CSS and apply priority colors dynamically in Redmine 5
// @downloadURL https://raw.githubusercontent.com/loitiSmile/redmine-overrides/master/tampermonkey-v1.js
// @author       loitiSmile
// @tag          production
// @tag          browser-compute
// @version      1.0.0
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
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
    
    // --- 2. Add priority colors dynamically ---
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
    
    // --- 3. Inject CSS overrides in <style> ---
    const injectStyleOverrides = () => {
        const style = document.createElement('style');
        style.textContent = `
        #top-menu {
            background-color: #36266b !important;
        }
        
        #header {
            background-color: #614ba6 !important;
        }
        
        #sidebar {
            max-width: 250px !important;
        }
        
        
        td.priority:hover {
            color: #000000 !important;
        }
        
        td.critical {
            background-color: #ffc7c7 !important;
            color: #000000 !important;
        }
        
        td.high {
            background-color: #f98484 !important;
            color: #000000 !important;
        }
    `;
        document.head.appendChild(style);
    };
    
    
    // --- Make the page visible after CSS injection ---
    document.documentElement.style.visibility = 'visible';
    
    // --- 4. Apply overrides on initial load and dynamically ---
    window.addEventListener('DOMContentLoaded', () => {
        applyPriorityColors();
        injectStyleOverrides();
        const observer = new MutationObserver(applyPriorityColors);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();