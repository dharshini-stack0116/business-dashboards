(function(){var K="cryol-theme",r=document.documentElement,t="dark";try{t=localStorage.getItem(K)||"dark"}catch(e){}r.setAttribute("data-theme",t);
document.addEventListener("DOMContentLoaded",function(){var h=document.querySelector(".top");if(!h)return;var b=document.createElement("button");b.type="button";b.className="o";b.setAttribute("aria-label","Switch between light and dark theme");
var s=function(){b.textContent=r.getAttribute("data-theme")=="dark"?"Light mode":"Dark mode"};s();
b.onclick=function(){var n=r.getAttribute("data-theme")=="dark"?"light":"dark";r.setAttribute("data-theme",n);try{localStorage.setItem(K,n)}catch(e){}s()};h.appendChild(b)})})();
