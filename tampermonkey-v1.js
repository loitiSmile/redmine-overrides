// ==UserScript==
// @name         Redmine - OVERRIDE CSS & PRIORITY COLORS (local)
// @author       loitiSmile
// @description  Compute overrides CSS and apply priority colors dynamically in Redmine 6 (Opale theme)
// @downloadURL  https://raw.githubusercontent.com/loitiSmile/redmine-overrides/feat/redmine6-overrides/tampermonkey-v1.js
// @updateURL    https://raw.githubusercontent.com/loitiSmile/redmine-overrides/feat/redmine6-overrides/tampermonkey-v1.js
// @supportURL   https://github.com/loitiSmile/redmine-overrides
// @license      GPL-3.0
// @version      1.1.0
// @tag          production
// @tag          browser-compute
// @match        https://*.alterway.fr/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    // At the very start, hide the page to prevent flickering
    document.documentElement.style.visibility = 'hidden';

    // --- 1. Replace application.css (legacy Redmine 5 cleanup) ---
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
        /* 1. Global typography and fonts (Classic Redmine uses Verdana) */
        body, #content, table.list, p, td, th, li, span, div {
            font-family: Verdana, sans-serif !important;
            color: #333333 !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
        }

        /* 2. Top Menu - Classic Dark Slate/Blue */
        #top-menu {
            background-color: #3e5b76 !important;
            padding: 3px 10px !important;
            height: auto !important;
        }
        #top-menu a {
            color: #ffffff !important;
            font-weight: normal !important;
            font-size: 10px !important;
            padding: 2px 6px !important;
        }
        #top-menu a:hover {
            background-color: #2e435a !important;
            text-decoration: underline !important;
        }

        /* 3. Header - Classic Soft Slate/Blue */
        #header {
            background-color: #628db6 !important;
            border-bottom: none !important;
            padding: 10px 20px 5px 20px !important;
            min-height: 55px !important;
        }
        #header h1 {
            color: #ffffff !important;
            font-family: "Trebuchet MS", Verdana, sans-serif !important;
            font-size: 20px !important;
            font-weight: bold !important;
            margin: 0 !important;
            padding: 0 !important;
            text-shadow: none !important;
        }

        /* 4. Main Menu - Tabs */
        #main-menu {
            background-color: #628db6 !important;
            margin-left: 0 !important;
            padding-left: 10px !important;
        }
        #main-menu ul {
            margin: 0 !important;
            padding: 0 !important;
        }
        #main-menu ul li {
            display: inline-block !important;
            margin-right: 2px !important;
        }
        #main-menu ul li a {
            background-color: #3e5b76 !important;
            color: #e4e4e4 !important;
            font-weight: bold !important;
            border: none !important;
            padding: 4px 10px !important;
            font-size: 11px !important;
            border-top-left-radius: 3px !important;
            border-top-right-radius: 3px !important;
            text-decoration: none !important;
        }
        #main-menu ul li a:hover {
            background-color: #2e435a !important;
            color: #ffffff !important;
        }
        #main-menu ul li a.selected {
            background-color: #ffffff !important;
            color: #1b4f72 !important;
            font-weight: bold !important;
            border-bottom: none !important;
        }

        /* 5. Headings */
        h1, h2, h3, h4 {
            color: #444444 !important;
            font-family: "Trebuchet MS", Verdana, sans-serif !important;
            font-weight: bold !important;
            border-bottom: 1px solid #cccccc !important;
            padding-bottom: 2px !important;
            margin-top: 15px !important;
            margin-bottom: 10px !important;
        }
        h2 {
            font-size: 16px !important;
        }
        h3 {
            font-size: 14px !important;
        }

        /* 6. Standard Redmine Links */
        a, a:link, a:visited {
            color: #169 !important;
            text-decoration: none !important;
        }
        a:hover, a:active {
            color: #c61a1a !important;
            text-decoration: underline !important;
        }

        /* 7. Classic Tables with light borders and Verdana fonts */
        table.list {
            border-collapse: collapse !important;
            width: 100% !important;
            border: 1px solid #e4e4e4 !important;
            margin: 10px 0 !important;
            background-color: #ffffff !important;
        }
        table.list th {
            background-color: #eeeeee !important;
            color: #000000 !important;
            font-weight: bold !important;
            border: 1px solid #e4e4e4 !important;
            padding: 4px 6px !important;
            font-size: 11px !important;
        }
        table.list td {
            border: 1px solid #e4e4e4 !important;
            padding: 4px 6px !important;
        }
        table.list tbody tr:nth-child(even) {
            background-color: #f6f8fc !important;
        }
        table.list tbody tr:nth-child(odd) {
            background-color: #ffffff !important;
        }
        table.list tbody tr:hover {
            background-color: #eff4fa !important;
        }

        /* 8. Priorities (Classic colors, very soft and non-intrusive) */
        td.priority {
            text-align: left !important;
            font-weight: normal !important;
        }
        td.low {
            background-color: inherit !important;
            color: inherit !important;
        }
        td.medium {
            background-color: inherit !important;
            color: inherit !important;
        }
        td.high {
            background-color: #ffdddd !important;
            color: #900000 !important;
        }
        td.critical {
            background-color: #ffbbbb !important;
            color: #900000 !important;
            font-weight: bold !important;
        }

        /* Row-level priorities */
        tr.priority-lowest { background-color: #fafafa !important; }
        tr.priority-default { background-color: #ffffff !important; }
        tr.priority-high3, tr.priority-high4, tr.priority-high5 {
            background-color: #ffeedd !important;
        }
        tr.priority-highest {
            background-color: #ffdddd !important;
        }

        /* 9. Sidebar */
        #sidebar {
            background-color: #f6f6f6 !important;
            border-left: 1px solid #e4e4e4 !important;
            padding: 10px !important;
            max-width: 250px !important;
        }
        #sidebar h3 {
            font-size: 12px !important;
            color: #333333 !important;
            border-bottom: 1px solid #cccccc !important;
            padding-bottom: 3px !important;
            margin-top: 10px !important;
            text-transform: none !important;
        }

        /* 10. Forms and buttons (Traditional design) */
        input[type="text"], input[type="password"], select, textarea {
            border: 1px solid #cccccc !important;
            padding: 3px 5px !important;
            font-size: 12px !important;
            border-radius: 2px !important;
        }
        input[type="submit"], input[type="button"], button {
            background-color: #f2f2f2 !important;
            border: 1px solid #cccccc !important;
            border-radius: 2px !important;
            padding: 3px 8px !important;
            color: #333333 !important;
            cursor: pointer !important;
        }
        input[type="submit"]:hover, input[type="button"]:hover, button:hover {
            background-color: #e4e4e4 !important;
            border-color: #adadad !important;
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
