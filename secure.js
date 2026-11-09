(function(){
var enc=new TextEncoder(),dec=new TextDecoder(),M="cryol-meta",P="cryol-",NAMES=["accts-v1","est-v1"],IDLE=300000,IT=310000,SK="cryol-sk";
var key=null,rawb="",cache={},cbs=[],q=Promise.resolve(),last=Date.now(),fails=0;
function b64(b){var a=new Uint8Array(b),s="";for(var i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s)}
function ub(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lset(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function lrem(k){try{localStorage.removeItem(k)}catch(e){}}
function ss(k,v){try{v==null?sessionStorage.removeItem(k):sessionStorage.setItem(k,v)}catch(e){}}
function derive(p,salt){return crypto.subtle.importKey("raw",enc.encode(p),"PBKDF2",false,["deriveKey"]).then(function(k){return crypto.subtle.deriveKey({name:"PBKDF2",salt:salt,iterations:IT,hash:"SHA-256"},k,{name:"AES-GCM",length:256},true,["encrypt","decrypt"])})}
function seal(k,o){var iv=crypto.getRandomValues(new Uint8Array(12));return crypto.subtle.encrypt({name:"AES-GCM",iv:iv},k,enc.encode(JSON.stringify(o))).then(function(c){return{iv:b64(iv),ct:b64(c)}})}
function open(k,r){return crypto.subtle.decrypt({name:"AES-GCM",iv:ub(r.iv)},k,ub(r.ct)).then(function(p){return JSON.parse(dec.decode(p))})}
function loadAll(){return Promise.all(NAMES.map(function(n){var r=ls(P+n);
if(r)return open(key,JSON.parse(r)).then(function(v){cache[n]=v});
var lg=ls(n);if(lg===null)return;var v;try{v=JSON.parse(lg)}catch(e){return}
cache[n]=v;return seal(key,v).then(function(x){lset(P+n,JSON.stringify(x));lrem(n)})}))}
function lock(){ss(SK,null);key=null;cache={};location.reload()}
function watch(){var t=function(){last=Date.now()};["click","keydown","touchstart","mousemove"].forEach(function(e){addEventListener(e,t,{passive:true})});
var sv=function(){ss(SK,JSON.stringify({k:rawb,t:last}))};addEventListener("pagehide",sv);
setInterval(function(){if(Date.now()-last>IDLE)lock();else sv()},15000)}
function done(k){key=k;return loadAll().then(function(){return crypto.subtle.exportKey("raw",k)}).then(function(raw){rawb=b64(raw);ss(SK,JSON.stringify({k:rawb,t:Date.now()}));
var u=document.getElementById("lockui");if(u)u.remove();
var tb=document.querySelector(".tb");if(tb){var b=document.createElement("button");b.className="o";b.textContent="Lock now";b.onclick=lock;tb.appendChild(b)}
watch();setTimeout(function(){var c=cbs;cbs=[];c.forEach(function(f){f()})},0)})}
function ui(){var first=!ls(M),d=document.createElement("div");d.id="lockui";
d.style.cssText="position:fixed;inset:0;z-index:99;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto";
if(!(window.crypto&&crypto.subtle)){d.innerHTML='<div class="c" style="max-width:340px"><h2>Cannot start securely</h2><p>This browser blocks encryption on this page. Open the app from its https link.</p></div>';document.body.appendChild(d);return}
d.innerHTML='<form class="c" style="max-width:340px;width:100%;grid-template-columns:1fr"><h2 style="margin:0">Cryol Accounts</h2><p class="s" style="margin:0">'+(first?"Create a passphrase to encrypt your data. If you forget it, the data cannot be recovered.":"Enter your passphrase to unlock.")+'</p><input type="password" id="lp" placeholder="Passphrase" autocomplete="'+(first?"new-password":"current-password")+'" required>'+(first?'<input type="password" id="lp2" placeholder="Repeat passphrase" autocomplete="new-password" required>':'')+'<button id="lb">'+(first?"Create and unlock":"Unlock")+'</button><p id="le" class="neg" role="alert" style="margin:0"></p>'+(first?'':'<button type="button" class="x" id="lx" style="padding:8px">Forgot passphrase? Erase all data</button>')+'</form>';
document.body.appendChild(d);
var g=function(i){return document.getElementById(i)},f=d.firstChild,er=function(m){g("le").textContent=m};g("lp").focus();
f.onsubmit=function(e){e.preventDefault();var p=g("lp").value,lb=g("lb");
if(first){if(p.length<10)return er("Use at least 10 characters.");if(p!==g("lp2").value)return er("The passphrases do not match.");
var salt=crypto.getRandomValues(new Uint8Array(16));lb.disabled=true;
derive(p,salt).then(function(k){return seal(k,"ok").then(function(v){lset(M,JSON.stringify({salt:b64(salt),v:v}));return done(k)})}).catch(function(){lb.disabled=false;er("Setup failed. Try again.")});return}
var m=JSON.parse(ls(M));lb.disabled=true;
derive(p,ub(m.salt)).then(function(k){return open(k,m.v).then(function(x){if(x!=="ok")throw 0;return done(k)})}).catch(function(){fails++;er("Wrong passphrase.");setTimeout(function(){lb.disabled=false},Math.min(fails,5)*1000)})};
if(g("lx"))g("lx").onclick=function(){if(confirm("This permanently erases all Cryol Accounts data stored in this browser. Continue?")){lrem(M);NAMES.forEach(function(n){lrem(P+n);lrem(n)});ss(SK,null);location.reload()}}}
function init(){if(!(window.crypto&&crypto.subtle))return ui();var s=null;try{s=JSON.parse(sessionStorage.getItem(SK)||"null")}catch(e){}
if(s&&s.k&&Date.now()-s.t<IDLE&&ls(M)){crypto.subtle.importKey("raw",ub(s.k),"AES-GCM",true,["encrypt","decrypt"]).then(done).catch(ui);return}ui()}
function dlf(n,t){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"application/json"}));a.download=n;a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}
window.SEC={ready:function(f){key?f():cbs.push(f)},load:function(n){return cache.hasOwnProperty(n)?cache[n]:null},
save:function(n,v){cache[n]=v;q=q.then(function(){return seal(key,v)}).then(function(r){lset(P+n,JSON.stringify(r))}).catch(function(){})},lock:lock,
exportBackup:function(n,data){var p=prompt("Choose a passphrase to protect this backup file. You will need it to import the file.");if(!p)return;var salt=crypto.getRandomValues(new Uint8Array(16));
derive(p,salt).then(function(k){return seal(k,data)}).then(function(r){r.salt=b64(salt);r.enc=1;dlf(n,JSON.stringify(r))})},
readBackup:function(t){var o=JSON.parse(t);if(Array.isArray(o))return Promise.resolve(o);if(!o.enc)return Promise.reject();var p=prompt("Enter the passphrase for this backup file:");if(!p)return Promise.reject();return derive(p,ub(o.salt)).then(function(k){return open(k,o)})}};
init()})();
