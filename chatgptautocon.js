// ==UserScript==
// @name         ChatGPT Auto Continue
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically inputs "continue" in ChatGPT's dialog box after a response is received
// @author       不告诉你 ,mkaa
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @match        https://chat.openai.com/auth/login
// @license      GPL-3.0
// @run-at       document-idie
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Add a toggle button
    let toggleBtn = document.createElement("button");
    toggleBtn.style.position = "fixed";
    toggleBtn.style.top = "10px";
    toggleBtn.style.right = "10px";
    toggleBtn.innerHTML = "Auto Continue: Off";
    toggleBtn.onclick = function() {
        if (this.innerHTML === "Auto Continue: Off") {
            this.innerHTML = "Auto Continue: On";
            startAutoInput();
        } else {
            this.innerHTML = "Auto Continue: Off";
            stopAutoInput();
        }
    };
    document.body.appendChild(toggleBtn);
 
    let interval;
    function startAutoInput() {
        interval = setInterval(function() {
            // Justify if there is element for regenerate response on the page
            let button1 = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative > div.flex.h-full.flex-1.flex-col.md\\:pl-\\[260px\\] > main > div.absolute.bottom-0.left-0.w-full.border-t.md\\:border-t-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:bg-vert-light-gradient.bg-white.dark\\:bg-gray-800.md\\:\\!bg-transparent.dark\\:md\\:bg-vert-dark-gradient > form > div > div.flex.ml-1.mt-1\\.5.md\\:w-full.md\\:m-auto.md\\:mb-2.gap-0.md\\:gap-2.justify-center > button");
            if (button1.innerHTML.includes("Regenerate response")) {
                //try to find out if there is any wording related to "sorry" in the response
                var allParagraphs = document.getElementsByTagName("p");
                var lastParagraph = allParagraphs[allParagraphs.length - 1];
                if ((lastParagraph.innerText.indexOf("很抱歉")!= -1) || (lastParagraph.innerText.indexOf("對不起")!=-1) || (lastParagraph.innerText.indexOf("Sorry")!=-1) || (lastParagraph.innerText.indexOf("sorry")!=-1)){
                    console.info(lastParagraph.innerText);
                    clearInterval(interval);
                    toggleBtn.innerHTML = "Auto Continue: Off";
                    stopAutoInput();
                }
                // if the response is seems not finish yet, input "continue" and press enter key automatically
                let inputElem = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative > div.flex.h-full.flex-1.flex-col.md\\:pl-\\[260px\\] > main > div.absolute.bottom-0.left-0.w-full.border-t.md\\:border-t-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:bg-vert-light-gradient.bg-white.dark\\:bg-gray-800.md\\:\\!bg-transparent.dark\\:md\\:bg-vert-dark-gradient > form > div > div.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4.relative.border.border-black\\/10.bg-white.dark\\:border-gray-900\\/50.dark\\:text-white.dark\\:bg-gray-700.rounded-md.shadow-\\[0_0_10px_rgba\\(0\\,0\\,0\\,0\\.10\\)\\].dark\\:shadow-\\[0_0_15px_rgba\\(0\\,0\\,0\\,0\\.10\\)\\] > textarea");
                inputElem.value = "continue";
 
                var event = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                });
                inputElem.dispatchEvent(event);
            }
        }, 2000);
    }
 
    function stopAutoInput() {
        clearInterval(interval);
    }
})();
