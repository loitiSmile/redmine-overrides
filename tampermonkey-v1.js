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
        /* Global Contrast & Typography */
        body, #content, table.list, p, td, th, li, span, div {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
            color: #111111 !important;
            font-size: 13px !important;
            line-height: 1.45 !important;
        }

        /* Purple Accents */
        #top-menu {
            background-color: #36266b !important;
            padding: 5px 10px !important;
        }
        #top-menu a {
            color: #ffffff !important;
            font-weight: bold !important;
            font-size: 11px !important;
        }
        #top-menu a:hover {
            background-color: #24194c !important;
        }

        #header {
            background-color: #614ba6 !important;
            border-bottom: 3px solid #36266b !important;
            padding: 12px 20px !important;
        }
        #header h1 {
            color: #ffffff !important;
            font-size: 20px !important;
            font-weight: bold !important;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
        }

        /* Headings */
        h1, h2, h3, h4 {
            color: #24194c !important;
            font-weight: bold !important;
            border-bottom: 2px solid #614ba6 !important;
            margin-top: 15px !important;
            margin-bottom: 10px !important;
            padding-bottom: 3px !important;
        }

        /* Dense & Zebra-striped Tables */
        table.list {
            border-collapse: collapse !important;
            width: 100% !important;
            border: 1.5px solid #999999 !important;
            margin-top: 10px !important;
            margin-bottom: 15px !important;
            background-color: #ffffff !important;
        }
        table.list th {
            background-color: #f0edf5 !important;
            color: #111111 !important;
            font-weight: bold !important;
            border: 1.5px solid #999999 !important;
            padding: 6px 8px !important;
            text-align: left !important;
        }
        table.list td {
            border: 1px solid #cccccc !important;
            padding: 6px 8px !important;
        }
        table.list tbody tr:nth-child(even) {
            background-color: #f7f7f9 !important;
        }
        table.list tbody tr:nth-child(odd) {
            background-color: #ffffff !important;
        }
        table.list tbody tr:hover {
            background-color: #ece7f4 !important;
        }

        /* Priority Colors on Cells */
        td.priority {
            font-weight: bold !important;
            text-align: center !important;
        }
        td.priority:hover {
            color: #000000 !important;
        }
        td.low {
            background-color: #e2f0d9 !important;
            color: #385723 !important;
        }
        td.medium {
            background-color: #fff2cc !important;
            color: #7f6000 !important;
        }
        td.high {
            background-color: #ffc7c7 !important;
            color: #c00000 !important;
            border: 1px solid #ff7e7e !important;
        }
        td.critical {
            background-color: #f98484 !important;
            color: #000000 !important;
            border: 1px solid #ff0000 !important;
        }

        /* Priority Row-Level Highlights */
        tr.priority-lowest { background-color: #fafafa !important; }
        tr.priority-lowest:hover { background-color: #ededed !important; }

        tr.priority-default { background-color: #ffffff !important; }

        tr.priority-high3, tr.priority-high4, tr.priority-high5 {
            background-color: #ffe8e8 !important;
        }
        tr.priority-high3:hover, tr.priority-high4:hover, tr.priority-high5:hover {
            background-color: #ffd4d4 !important;
        }

        tr.priority-highest {
            background-color: #ffcccc !important;
        }
        tr.priority-highest:hover {
            background-color: #ffbaba !important;
        }

        /* Structured Sidebar */
        #sidebar {
            background-color: #fbfbfd !important;
            border-left: 1.5px solid #dcdce6 !important;
            padding: 15px !important;
            max-width: 250px !important;
        }
        #sidebar h3 {
            font-size: 13px !important;
            color: #36266b !important;
            border-bottom: 2px solid #614ba6 !important;
            padding-bottom: 4px !important;
            text-transform: uppercase !important;
        }

        /* Inputs & Textareas */
        input[type="text"], input[type="password"], select, textarea {
            border: 1.5px solid #999999 !important;
            padding: 5px 8px !important;
            border-radius: 4px !important;
            color: #000000 !important;
            background-color: #ffffff !important;
        }
        input[type="text"]:focus, input[type="password"]:focus, select:focus, textarea:focus {
            border-color: #614ba6 !important;
            box-shadow: 0 0 4px rgba(97, 75, 166, 0.4) !important;
        }

        /* Flash banners */
        .flash {
            padding: 10px 15px !important;
            border-radius: 4px !important;
            margin-bottom: 15px !important;
            font-weight: bold !important;
        }
        .flash.notice {
            background-color: #e2f0d9 !important;
            border: 1.5px solid #70ad47 !important;
            color: #385723 !important;
        }
        .flash.error {
            background-color: #fce4d6 !important;
            border: 1.5px solid #c00000 !important;
            color: #c00000 !important;
        }
        .flash.warning {
            background-color: #fff2cc !important;
            border: 1.5px solid #ffc000 !important;
            color: #7f6000 !important;
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
