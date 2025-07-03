// ==UserScript==
// @name         Custom Style & CSS Replacement
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    // Masquer la page au tout début
    document.documentElement.style.visibility = 'hidden';
    // --- 1. Remplacer application.css avec version dynamique ---
    // --- 1a. Récupération du timestamp de redmine à partir du fichier jQuery UI ---
    const sourceLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .find(link => link.href.includes('/stylesheets/jquery/jquery-ui-1.13.2.css'));
    
    if (sourceLink) {
        const queryStringMatch = sourceLink.href.match(/\?(\d+)$/);
        if (queryStringMatch) {
            const queryString = queryStringMatch[1];
            
            // --- 1b. Remplacement des liens PurpleMine par le nouveau lien ---
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
    
    // --- 2. Ajout d'une classe CSS pour gérer les priorités ---
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
    
    // --- 3. Injection des overrides dans une balise <style> ---
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
        }
        
        td.high {
            background-color: #f98484 !important;
        }
    `;
        document.head.appendChild(style);
    };
    
    
    // Afficher la page
    document.documentElement.style.visibility = 'visible';
    
    // Exécuter après DOM ready
    window.addEventListener('DOMContentLoaded', () => {
        applyPriorityColors();
        injectStyleOverrides();
        const observer = new MutationObserver(applyPriorityColors);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();