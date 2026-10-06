/* 🎵 Ilagay dito ang link/data ng kanta. Kapag walang laman, built-in "Happy Birthday" melody ang tutugtog. */
var SONG_SRC = "audio.mp3";
/* 📸 Optional: lagay ng photo links dito para lumutang sa Final Chaos, e.g. ["pic1.jpg","pic2.jpg"] */
var PHOTOS = [];

var fxOn = false;
var $ = function(s){ return document.querySelector(s) }, inn = $('#in'), nick = 'Bro', cur = 0, busy = false, ac;
var cols = ['#8b5cf6','#ec4899','#c084fc','#f472b6','#a78bfa','#ffffff'];

function A(){ 
    if(!ac) ac = new (window.AudioContext||window.webkitAudioContext)(); 
    if(ac.state==='suspended') ac.resume(); 
    return ac; 
}

function esc(s){ 
    return s.replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); 
}

function sub(s){ 
    return s.replace(/\{N\}/g, '<b class="hw grad">'+esc(nick)+'</b>'); 
}

function shake(){ 
    gsap.fromTo('#in', {x:-12}, {x:0, duration:.7, ease:'elastic.out(3,.15)', clearProps:'transform'}); 
}

/* zoom-in + glow sa lahat ng box/button/input */
var HZ = '.card,.btn:not(.dis),.inp,#mus';
document.addEventListener('pointerover', function(e){ 
    var t = e.target.closest && e.target.closest(HZ); 
    if(!t||t._h) return; 
    t._h = 1;
    gsap.to(t, {scale: t.classList.contains('btn')?1.08:1.05, boxShadow:'0 0 42px 6px rgba(236,72,153,.55)', duration:.3, ease:'power2.out', overwrite:'auto'}); 
});

document.addEventListener('pointerout', function(e){ 
    var t = e.target.closest && e.target.closest(HZ); 
    if(!t||(e.relatedTarget && t.contains(e.relatedTarget))) return; 
    t._h = 0;
    gsap.to(t, {scale:1, duration:.35, overwrite:'auto', onComplete: function(){ if(!t._h) gsap.set(t, {clearProps:'scale,boxShadow'}); }}); 
});

/* BOLD words/headings: zoom + glow kapag nadaanan ng cursor */
function hw(el){
    var w = document.createTreeWalker(el, 4), ns = [], n;
    while (n = w.nextNode()) if (n.nodeValue.trim() && n.parentNode.closest('h1,h2,h3,b,.grad') && !n.parentNode.closest('.hw,button,.hb')) ns.push(n);
    ns.forEach(function(n){ 
        var f = document.createDocumentFragment(), g = !!n.parentNode.closest('.grad');
        n.nodeValue.split(/(\s+)/).forEach(function(t){ 
            if (!t) return; 
            if (/^\s+$/.test(t)) f.appendChild(document.createTextNode(t)); 
            else { 
                var s = document.createElement('span'); 
                s.className = 'hw' + (g ? ' grad' : ''); 
                s.textContent = t; 
                f.appendChild(s); 
            } 
        });
        n.parentNode.replaceChild(f, n); 
    });
}

/* TYPEWRITER para sa mga hindi bold na text */
function tw(el, cb){
    var w = document.createTreeWalker(el, 4), ns = [], n, tot = 0;
    while (n = w.nextNode()) if (n.nodeValue.length && !n.parentNode.closest('.hw,h1,h2,h3,b,.grad,button')) ns.push([n, n.nodeValue]);
    ns.forEach(function(a){ tot += a[1].length; a[0].nodeValue = ''; });
    if (!tot){ cb(false); return; }
    var d = tot > 200 ? 9 : tot > 80 ? 16 : 24, k = 0, c = 0, pg = inn.parentNode;
    (function t(){ 
        if (k >= ns.length){ cb(true); return; } 
        var a = ns[k]; 
        a[0].nodeValue = a[1].slice(0, ++c); 
        if (c >= a[1].length){ k++; c = 0; } 
        if (c % 10 == 0) pg.scrollTop = pg.scrollHeight; 
        setTimeout(t, d); 
    })();
}

/* ===== canvas: particles + confetti ===== */
var cv = $('#fx'), cx = cv.getContext('2d'), W, H, mouse = {x:-999, y:-999}, parts = [], conf = [];
function rs(){ W = cv.width = innerWidth; H = cv.height = innerHeight; } 
rs(); 
addEventListener('resize', rs);

for (var i = 0; i < 70; i++) parts.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.8+.5, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, c:cols[i%5]});

function burst(x, y, n, c){ 
    for (var i = 0; i < n; i++){ 
        var a = Math.random()*6.28, sp = Math.random()*11+3;
        conf.push({x:x, y:y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-6, w:Math.random()*8+5, h:Math.random()*5+3, rot:Math.random()*6, vr:(Math.random()-.5)*.4, c:c||cols[Math.floor(Math.random()*6)], life:1}); 
    } 
}

(function loop(){
    cx.clearRect(0, 0, W, H);
    parts.forEach(function(p){ 
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx*dx + dy*dy) || 1;
        if (d < 140){ p.x += dx/d*1.6; p.y += dy/d*1.6; } 
        p.x += p.vx; p.y += p.vy; 
        if(p.x < 0) p.x = W; if(p.x > W) p.x = 0; if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
        cx.globalAlpha = .7; cx.fillStyle = p.c; cx.shadowColor = p.c; cx.shadowBlur = 10; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.3); cx.fill(); 
    });
    cx.shadowBlur = 0;
    conf = conf.filter(function(f){ return f.life > 0 && f.y < H+30; });
    conf.forEach(function(f){ 
        f.vy += .28; f.vx *= .99; f.x += f.vx; f.y += f.vy; f.rot += f.vr; f.life -= .004;
        cx.save(); cx.globalAlpha = Math.max(f.life, 0); cx.translate(f.x, f.y); cx.rotate(f.rot); cx.fillStyle = f.c; cx.fillRect(-f.w/2, -f.h/2, f.w, f.h); cx.restore(); 
    });
    requestAnimationFrame(loop);
})();

var gx = gsap.quickTo('#glow', 'x', {duration:.6, ease:'power3'}), gy = gsap.quickTo('#glow', 'y', {duration:.6, ease:'power3'});
function mv(e){ var t = e.touches ? e.touches[0] : e; mouse.x = t.clientX; mouse.y = t.clientY; gx(t.clientX); gy(t.clientY); }
addEventListener('pointermove', mv); 
addEventListener('touchmove', mv, {passive:true});

/* ===== balloons ===== */
function popSound(){
    var c = A(), n = Math.floor(c.sampleRate*.14), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random()*2-1)*Math.pow(1-i/n, 5);
    var s = c.createBufferSource(); s.buffer = b; var f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 600; s.connect(f); f.connect(c.destination); s.start();
    var o = c.createOscillator(), og = c.createGain(); o.frequency.setValueAtTime(220, c.currentTime); o.frequency.exponentialRampToValueAtTime(40, c.currentTime+.09);
    og.gain.setValueAtTime(.6, c.currentTime); og.gain.exponentialRampToValueAtTime(.001, c.currentTime+.1); o.connect(og); og.connect(c.destination); o.start(); o.stop(c.currentTime+.12);
}

function bal(delay){
    var b = document.createElement('div'), col = cols[Math.floor(Math.random()*5)]; 
    b.className = 'bl'; b.col = col;
    b.style.background = 'radial-gradient(circle at 35% 30%,#fff8,'+col+')'; 
    b.style.left = Math.random()*92+'%'; 
    $('#balloons').appendChild(b); 
    gsap.set(b, {scale:.8+Math.random()*.7});
    b.tw = gsap.to(b, {y:-(innerHeight+260), x:'random(-70,70)', duration:'random(11,20)', ease:'none', delay:delay||0, onComplete:function(){ b.remove(); }});
}

var bi;
function startBalloons(){ 
    for (var i = 0; i < 6; i++) bal(i*1.1 + Math.random()); 
    if (!bi) bi = setInterval(function(){ if (document.querySelectorAll('.bl').length < 12) bal(Math.random()); }, 1500); 
}

addEventListener('pointerdown', function(e){
    A(); var t = e.target;
    if (!(t.closest && t.closest('button,input,.card,#mus'))){
        var bs = [].slice.call(document.querySelectorAll('.bl')).reverse();
        for (var i = 0; i < bs.length; i++){ 
            var r = bs[i].getBoundingClientRect();
            if (e.clientX > r.left-4 && e.clientX < r.right+4 && e.clientY > r.top-4 && e.clientY < r.bottom+4){
                var b = bs[i]; b.tw.kill(); popSound(); burst(r.left+r.width/2, r.top+r.height/2, 40, b.col); burst(r.left+r.width/2, r.top+r.height/2, 14); b.remove(); return; 
            } 
        }
    }
    if (fxOn) burst(e.clientX, e.clientY, 34);
});

/* ===== music ===== */
var playing = false, audio = SONG_SRC ? new Audio(SONG_SRC) : null, mt, mi = 0, beat = .42;
if (audio) audio.loop = true;
var mel = [[392,.75],[392,.25],[440,1],[392,1],[523,1],[494,2],[392,.75],[392,.25],[440,1],[392,1],[587,1],[523,2],[392,.75],[392,.25],[784,1],[659,1],[523,1],[494,1],[440,1],[698,.75],[698,.25],[659,1],[523,1],[587,1],[523,2],[0,1]];

function step(){
    if (!playing) return; 
    var n = mel[mi++ % mel.length], c = A();
    if (n[0]){ 
        var o = c.createOscillator(), g = c.createGain(); 
        o.type = 'triangle'; 
        o.frequency.value = n[0];
        g.gain.setValueAtTime(.0001, c.currentTime); 
        g.gain.exponentialRampToValueAtTime(.09, c.currentTime+.03); 
        g.gain.exponentialRampToValueAtTime(.0001, c.currentTime+n[1]*beat*1.1);
        o.connect(g); g.connect(c.destination); 
        o.start(); o.stop(c.currentTime+n[1]*beat*1.15); 
    }
    mt = setTimeout(step, n[1]*beat*1000);
}

function setMusic(on){
    playing = on; 
    $('#mus').textContent = on ? '🔊 PAUSE MUSIC' : '🎵 PLAY MUSIC'; 
    clearTimeout(mt);
    if (audio){ 
        on ? audio.play().catch(function(){ playing = false; $('#mus').textContent = '🎵 PLAY THE BIRTHDAY MUSIC'; }) : audio.pause(); 
        return; 
    }
    if (on) step();
}
$('#mus').onclick = function(e){ e.stopPropagation(); setMusic(!playing); };

/* ===== block engine ===== */
function add(el, cb){
    inn.appendChild(el); hw(el); 
    inn.parentNode.scrollTo({top: inn.parentNode.scrollHeight, behavior: 'smooth'});
    gsap.fromTo(el, {opacity:0, y:24, scale:.88}, {opacity:1, y:0, scale:1, duration:.6, ease:'back.out(1.7)', clearProps:'transform'});
    if (cb){ 
        if ((el.tagName=='P'||el.classList.contains('card')) && !el.querySelector('.bar')) tw(el, cb); 
        else cb(false); 
    } 
    return el;
}

function mk(tag, cls, html){ 
    var e = document.createElement(tag); 
    if (cls) e.className = cls; 
    if (html != null) e.innerHTML = sub(html); 
    return e; 
}

function run(B, i, g){
    i = i||0; if (i >= B.length) return; 
    var b = B[i], t = b[0], c = b[1], gap = g||800;
    function nx(d){ setTimeout(function(){ run(B, i+1, g); }, d==null?gap:d); }
    if (t=='w'){ nx(c); return; }
    if (t=='clr'){ gsap.to(inn, {opacity:0, duration:.35, onComplete:function(){ inn.innerHTML = ''; gsap.set(inn, {opacity:1}); run(B, i+1, g); }}); return; }
    if (t=='x'){ c(function(){ nx(300); }); return; }
    if (t=='b' || t=='n'){
        var bt = add(mk('button', 'btn', c)); 
        bt.onclick = function(){ 
            bt.onclick = null; 
            gsap.to(bt, {opacity:0, duration:.25, onComplete:function(){ bt.remove(); }});
            if (t=='n') go(cur+1); else if (b[2]) b[2](); else nx(250); 
        }; 
        return; 
    }
    add(t=='h' ? mk('h2','',c) : t=='H' ? mk('h1','',c) : t=='c' ? mk('div','card',c) : t=='r' ? mk('div','',c) : mk('p','',c), function(ty){ 
        nx(ty ? Math.min(gap, Math.max(450, gap/2)) : gap); 
    });
}

function go(n){
    if (busy) return; 
    busy = true; cur = n;
    gsap.to(inn, {opacity:0, y:-40, filter:'blur(8px)', duration:.45, ease:'power2.in', onComplete:function(){
        inn.innerHTML = ''; inn.parentNode.scrollTop = 0; gsap.set(inn, {clearProps:'all'});
        gsap.from(inn, {opacity:0, y:40, duration:.5, clearProps:'all'}); 
        busy = false; run(PAGES[n], 0, GAP[n]); 
    }});
}

/* ===== page 1 widgets ===== */
function ask(nx){
    var d = mk('div','',''); 
    d.style.cssText = 'display:flex;flex-direction:column;align-items:center;width:100%';
    d.innerHTML = '<input class="inp" maxlength="18" placeholder="Enter your name" autocomplete="off"><p class="wr"></p><button class="btn dis">CONTINUE →</button>';
    add(d); 
    var i = d.firstChild, w = d.children[1], b = d.lastChild;
    i.oninput = function(){ var v = i.value.trim(); b.classList.toggle('dis', !v); if (v) w.textContent = ''; };
    function ok(){ 
        var v = i.value.trim();
        if (!v){ 
            w.innerHTML = '⚠️ Please enter your nickname.<br>We need to know what to call you when we eventually blame you for something.'; 
            gsap.fromTo(w, {x:-8}, {x:0, duration:.5, ease:'elastic.out(3,.2)'}); 
            return; 
        }
        nick = v; i.onkeydown = b.onclick = null; nx(); 
    }
    b.onclick = ok; 
    i.onkeydown = function(e){ if (e.key=='Enter') ok(); };
}

/* ===== page 2 survey ===== */
var Q = [
    ['If you see a random pigeon staring directly at you, what do you do?', ['A. Stare back 👁️', 'B. Walk away like nothing happened', 'C. Wonder if the pigeon knows something', 'D. Challenge it to a fight 💀']],
    ['You suddenly receive ₱1,000. What is your first thought?', ['A. Save it', 'B. Food. Immediately.', 'C. Buy something completely unnecessary', 'D. “How do I turn this into ₱10,000?” 😎']],
    ['Which animal would you trust to protect your house?', ['A. Dog 🐶', 'B. Cat 🐱', 'C. Goose 🪿', 'D. That one angry rooster from the neighborhood']],
    ['Someone says: “Bro, I have something to tell you.” What do you do?', ['A. “What?”', 'B. Panic', 'C. “Ano na naman ginawa ko?” 😭', 'D. Ignore them and hope it disappears']]
];

function quiz(nx){
    var d = add(mk('div','','')); d.style.width = '100%'; var i = 0, lock = 0;
    (function q(){
        if (i >= Q.length){ gsap.to(d, {opacity:0, duration:.3, onComplete:function(){ d.remove(); nx(); }}); return; }
        d.innerHTML = '<div class="qp">Question '+(i+1)+'/4</div><div class="bar"><i></i></div><h3>'+Q[i][0]+'</h3>'+Q[i][1].map(function(o){ return '<button class="card opt">'+o+'</button>'; }).join('')+'<p class="rec"></p>';
        gsap.from(d.children, {opacity:0, y:20, stagger:.07, duration:.5, clearProps:'transform'});
        gsap.to(d.querySelector('.bar i'), {width:(i+1)*25+'%', duration:.9, delay:.3});
        [].forEach.call(d.querySelectorAll('.opt'), function(o){ 
            o.onclick = function(){ 
                if (lock) return; lock = 1; o.classList.add('sel');
                var r = d.querySelector('.rec'); r.textContent = 'Answer recorded ✓'; 
                gsap.from(r, {scale:.6, opacity:0, duration:.4, ease:'back.out(2)'});
                setTimeout(function(){ lock = 0; i++; q(); }, 850); 
            }; 
        });
    })();
}

/* ===== page 3 widgets ===== */
function prog(nx){
    var d = add(mk('div','','<p style="line-height:2.1">Processing answers...<br>Checking behavior...<br>Reviewing questionable decisions...<br>Consulting the experts...</p><div class="pct">0%</div><div class="bar"><i></i></div>'));
    d.style.width = '100%'; var p = d.querySelector('p'), pc = d.querySelector('.pct'), bf = d.querySelector('.bar i'), o = {v:0}, ls = p.innerHTML.split('<br>');
    p.innerHTML = ls.map(function(l){ return '<span style="opacity:0;display:block">'+l+'</span>'; }).join('');
    var tl = gsap.timeline({onComplete:function(){ 
        pc.textContent = 'ERROR.'; pc.className = 'pct gl'; 
        gsap.to(bf, {width:'100%', background:'#f472b6', duration:.2});
        var e = add(mk('p','','Personality too chaotic to calculate. 💀')); 
        setTimeout(nx, 1000); 
    }});
    [1,27,64,99].forEach(function(v,k){
        tl.to(p.children[k], {opacity:1, duration:.4}, k*1.1).to(o, {v:v, duration:.7, ease:'power1.out', onUpdate:function(){ pc.textContent = Math.round(o.v)+'%'; bf.style.width = o.v+'%'; }}, k*1.1);
    });
}

function stats(nx){
    var S = [['🧠','12% common sense',12], ['😂','38% random thoughts',38], ['🍔','27% food',27], ['💀','23% questionable decisions',23]], k = 0;
    (function nxt(){ 
        if (k >= S.length){ nx(); return; } 
        var s = S[k++], c = add(mk('div','card','<div style="text-align:left">'+s[0]+' '+s[1]+'</div><div class="bar"><i></i></div>'));
        gsap.to(c.querySelector('i'), {width:(s[2]*2.3)+'%', duration:1, delay:.2}); 
        setTimeout(nxt, 700); 
    })();
}

function dark(nx){ gsap.to('#dim', {opacity:.8, duration:1.2}); nx(); }
function pulse(nx){ burst(innerWidth/2, innerHeight/2, 0); nx(); }

/* ===== THE BIG REVEAL ===== */
function kaboom(){
    busy = true; var blk = $('#blk'), bt = $('#bt'), lb = $('#lb');
    gsap.to('#in', {x:'random(-16,16)', skewX:'random(-9,9)', filter:'hue-rotate(80deg) saturate(2.4)', duration:.06, repeat:13, yoyo:true, onComplete:function(){ gsap.set('#in', {clearProps:'all'}); }});
    setTimeout(function(){
        blk.style.display = 'flex'; bt.className = ''; bt.innerHTML = '⚠️ ERROR: survey.exe has stopped working.'; 
        gsap.to(blk, {opacity:1, duration:.4}); 
        gsap.to(lb, {width:'100%', duration:1.6, delay:.5, ease:'power1.inOut'}); 
    }, 900);
    setTimeout(function(){ $('#lbw').style.display = 'none'; bt.textContent = 'System override...'; gsap.fromTo(bt, {opacity:0}, {opacity:1, duration:.4}); }, 3000);
    [3,2,1].forEach(function(n,k){ 
        setTimeout(function(){ bt.className = 'b'; bt.textContent = n+'...'; gsap.fromTo(bt, {scale:.3, opacity:0}, {scale:1, opacity:1, duration:.5, ease:'back.out(2)'}); }, 4300+k*950); 
    });
    setTimeout(function(){
        inn.innerHTML = ''; $('#dim').style.opacity = 0; cur = 3; busy = false; fxOn = true;
        bt.textContent = '🎉'; gsap.fromTo(bt, {scale:.3}, {scale:3, opacity:0, duration:.5});
        gsap.to(blk, {opacity:0, duration:.7, delay:.2, onComplete:function(){ blk.style.display = 'none'; }});
        burst(innerWidth/2, innerHeight*.45, 300); burst(0, innerHeight*.7, 140); burst(innerWidth, innerHeight*.7, 140); shake();
        startBalloons(); 
        gsap.set('#mus', {x:200, opacity:0}); 
        gsap.to('#mus', {x:0, opacity:1, duration:.8, delay:1, ease:'back.out(1.6)', onStart:function(){ $('#mus').style.pointerEvents = 'auto'; }});
        setMusic(true); run(PAGES[3], 0, GAP[3]);
    }, 7450);
}

var CAKE = '<svg class="cake" viewBox="0 0 200 190"><defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><ellipse cx="100" cy="176" rx="88" ry="9" fill="rgba(139,92,246,.25)"/><rect x="20" y="118" width="160" height="54" rx="12" fill="url(#g1)"/><rect x="42" y="78" width="116" height="44" rx="11" fill="#c084fc"/><path d="M42 90q10 14 20 0t20 0 20 0 20 0 18 0v-6a11 11 0 0 0-11-6H53a11 11 0 0 0-11 11z" fill="#fff" opacity=".9"/><path d="M20 130q13 14 26 0t26 0 26 0 26 0 26 0 26 0v-8H20z" fill="#fff" opacity=".9"/>'
  + [62,100,138].map(function(x){ return '<rect x="'+(x-3)+'" y="50" width="6" height="30" rx="2" fill="#fff"/><ellipse class="fl" cx="'+x+'" cy="42" rx="5" ry="10" fill="#fbbf24" style="filter:drop-shadow(0 0 8px #f59e0b)"/>'; }).join('') + '</svg>';

setTimeout(function(){ gsap.to('.fl', {scaleY:1.2, scaleX:.85, duration:.18, repeat:-1, yoyo:true, stagger:.07, ease:'sine.inOut'}); }, 100);

new MutationObserver(function(){ 
    if (document.querySelector('.fl:not(.on)')){ 
        gsap.to('.fl', {scaleY:1.2, scaleX:.85, duration:.18, repeat:-1, yoyo:true, stagger:.07, ease:'sine.inOut', overwrite:true}); 
        document.querySelectorAll('.fl').forEach(function(f){ f.classList.add('on'); }); 
    } 
}).observe(inn, {childList:true, subtree:true});

/* ===== FINAL CHAOS ===== */
var MSG = ['BROOOO 😭','YOU SURVIVED ANOTHER YEAR','Makulit Level: MAX','BIRTHDAY BOY DETECTED 🚨','CAKE DEPLOYED 🎂','COMMON SENSE NOT FOUND 💀','HAPPY BIRTHDAY!!! 🥳'], 
    EM = ['🎂','⭐','🎈','🎉','🥳','🍰','✨','🎁','💀','😂','🍔'];

function chaos(){
    if (!playing) setMusic(true);
    for (var i = 0; i < 14; i++) bal(i*.25);
    var n = 0, lay = $('#msgs'), iv = setInterval(function(){
        if (++n > 34){ clearInterval(iv); return; }
        burst(Math.random()*innerWidth, Math.random()*innerHeight*.6, 70);
        var e = document.createElement('span'); 
        e.className = 'fe'; 
        e.textContent = EM[Math.floor(Math.random()*EM.length)]; 
        e.style.cssText = 'left:'+Math.random()*92+'%;font-size:'+(24+Math.random()*40)+'px'; 
        $('#balloons').appendChild(e);
        gsap.to(e, {y:-(innerHeight+120), rotation:'random(-360,360)', duration:'random(4,8)', ease:'none', onComplete:function(){ e.remove(); }});
        burst(0, innerHeight*.85, 70); burst(innerWidth, innerHeight*.85, 70); burst(innerWidth/2, innerHeight*.3, 60);
        
        if (PHOTOS.length && n % 3 == 0){ 
            var im = document.createElement('img'); 
            im.src = PHOTOS[n % PHOTOS.length]; 
            im.style.cssText = 'position:absolute;width:110px;border:5px solid #fff;border-radius:6px;left:'+Math.random()*80+'%;top:'+Math.random()*70+'%';
            lay.appendChild(im); 
            gsap.fromTo(im, {scale:0, rotation:'random(-20,20)'}, {scale:1, duration:.6, ease:'back.out(2)'}); 
            gsap.to(im, {opacity:0, duration:.6, delay:2.4, onComplete:function(){ im.remove(); }}); 
        }
    }, 280);
    setTimeout(function(){ gsap.to(inn, {opacity:0, duration:.5, onComplete:function(){ inn.innerHTML = ''; gsap.set(inn, {opacity:1}); run(FINAL, 0, 1100); }}); }, 6500);
}

/* ================= CONTENT ================= */
var PAGES = [], GAP = [900, 700, 850, 750, 900, 1100, 900, 1700, 1300, 900];

PAGES[0] = [
    ['H','Welcome.'], ['p','Before you continue, we need a few basic details.'], ['p','This will only take approximately 37 seconds.'], ['p','Probably.'], ['p','Maybe.'], ['p','We don\'t actually know. 💀'], ['w',500], ['h','What should we call you?'], ['x',ask], ['clr'],
    ['h','Nice to meet you, {N}.'], ['p','Or at least...<br>that\'s what we\'re going to call you from now on.'], ['p','Your nickname has been successfully registered. ✅'], ['p','Please proceed.'], ['n','NEXT →']
];

PAGES[1] = [
    ['h','🧠 QUICK PERSONALITY CHECK'], ['p','Answer honestly.<br>Your answers may reveal something about you.<br>We don\'t know what.<br>But something.'], ['x',quiz], ['b','SUBMIT MY ANSWERS →'], ['clr'],
    ['h','Analyzing answers...'], ['p','Please do not close this page.'], ['p','Your answers are currently being judged by absolutely nobody. 😂'], ['w',2600], ['x',function(){ go(2); }]
];

PAGES[2] = [
    ['h','🔬 ANALYZING YOUR PERSONALITY...'], ['x',prog], ['p','But we found something.'], ['b','REVEAL MY RESULTS →'], ['clr'],
    ['h','PERSONALITY RESULT'], ['H','TYPE: <span class="grad">{N}</span>'], ['p','Your personality appears to consist of:'], ['x',stats], ['p','Total: 100% human.<br>Congratulations.'], ['w',900], ['p','But there\'s one more thing...'], ['p','The system detected an unusual activity associated with your account.'], ['b','WHAT ACTIVITY? 👀'],
    ['x',dark], ['clr'], ['p','Scanning...'], ['p','Searching...'], ['p','Searching...'], ['p','Searching...'], ['w',700], ['r','<span class="hb">FOUND.</span>'], ['w',1200],
    ['h','⚠️ UNAUTHORIZED EVENT DETECTED'], ['p','Something has been prepared specifically for you.<br>We don\'t know why.<br>We don\'t know who did it.<br>But you need to see it.'], ['w',2200], ['b','OPEN IT →', kaboom]
];

PAGES[3] = [
    ['r',CAKE], ['H','🎉 SURPRISE, <span class="grad">{N}</span>! 🎉'], ['h','YOU\'VE BEEN BAMBOOZLED. 💀'], ['p','You thought you were answering some random personality survey...'], ['h','BUT NOPE.'], ['h','IT\'S YOUR <span class="grad">BIRTHDAY WEBSITE.</span> 😭🎂'],
    ['H','HAPPY BIRTHDAY, <span class="grad">{N}</span>! 🥳'], ['p','<b style="color:#fff">Congratulations!</b><br>You successfully completed a completely unnecessary survey...<br>just to get here. 😂'], ['n','OKAY... CONTINUE →']
];

PAGES[4] = [
    ['h','🎁 Since you made it this far...'], ['p','Since you successfully survived the extremely difficult personality test...<br>You deserve a birthday gift. 🎁'], ['p','I spent a lot of time thinking about what to give you.<br>Something useful.<br>Something memorable.<br>Something expensive.'], ['p','And finally...<br>I decided...'], ['r','<span style="font-size:5rem;display:block">🎁</span>'], ['b','OPEN MY GIFT 🎁'],
    ['x',function(nx){ burst(innerWidth/2, innerHeight/2, 200); shake(); nx(); }], ['H','<span class="grad">THIS WEBSITE.</span> 😭'], ['p','That\'s it.<br>You\'re welcome.<br>Please don\'t ask for a refund.'], ['c','<b>Friendship subscription:</b> ACTIVE<br><b>Renewal date:</b> Every year<br><b>Cancellation:</b> NOT AVAILABLE 😂'], ['n','NEXT →']
];

PAGES[5] = [
    ['h','🕵️ CASE FILE: <span class="grad">{N}</span>'], ['p','We investigated your behavior.<br>The results are concerning.'], ['w',600],
    ['c','<small style="color:#f472b6">Evidence #01</small><br>Subject is extremely cute.'], ['c','<small style="color:#f472b6">Evidence #02</small><br>Subject has a suspicious amount of random thoughts.'], ['c','<small style="color:#f472b6">Evidence #03</small><br>Subject is super handsome.'], ['c','<small style="color:#f472b6">Evidence #04</small><br>Subject is a good oat.'],
    ['w',600], ['h','FINAL VERDICT'], ['p','Guilty of being annoying...<br>but in a funny way. 😂'], ['b','I OBJECT!'], ['h','Objection denied.'], ['p','The court has decided.<br>You\'re still my friend. 🤝'], ['n','NEXT →']
];

PAGES[6] = [
    ['h','🏆 OFFICIAL AWARD CEREMONY'], ['p','After extensive research...<br>You have been selected for a prestigious award.'], ['b','REVEAL AWARD'],
    ['x',function(nx){ burst(innerWidth/2, innerHeight*.4, 250); shake(); nx(); }], ['h','🥇 <span class="grad">MOST CUTIEE FRIEND OF THE YEAR</span>'], ['p','Awarded to:'], ['H','<span class="grad">{N}</span>'],
    ['c','For outstanding achievements in:<br>• Kind<br>• Hot Boy<br>• Making people laugh<br>• A lover boy i guess 😂<br>• Funny 😂'], ['p','Congratulations.<br>There is no cash prize.<br>There is no trophy.<br>There is only this website.'], ['n','NEXT →']
];

PAGES[7] = [
    ['h','Okay, <span class="grad">seriously...</span>'], ['p','Okay...<br>Enough muna sa kalokohan.'], ['p','I just want you to know that I\'m genuinely happy that I got to know you.'], ['p','Thank you for all the random conversations, laughs, jokes, and stupid moments.'], ['p','You\'re one of those people who can make an ordinary day more fun just by being yourself.'],
    ['p','So even though you\'re super hirap makausap, di jk 😂...<br>I\'m still glad that i get to know u (or friend i guess). 😂'], ['p','I hope this year gives you more happiness, good memories, and opportunities.'], ['h','Happy Birthday, <span class="grad">{N}</span>. ❤️'], ['p','Now...<br>back to kalokohan.'], ['n','ONE LAST THING →']
];

PAGES[8] = [
    ['h','🔐 SECRET MESSAGE UNLOCKED'], ['p','You weren\'t supposed to find this.<br>But since you\'re already here...<br>might as well.'], ['b','UNLOCK 🔓'],
    ['x',function(nx){ burst(innerWidth/2, innerHeight/2, 160); nx(); }], ['c','<b>{N},</b><br><br>Someone actually made an entire website just for you.<br><br>That\'s either:<br>A. Really sweet tombits. jk 😂.<br>B. Extremely unnecessary.<br>C. Both. 😂<br><br>The answer is obviously C.<br><br>But seriously...<br>I hope you enjoyed this little surprise.<br><br>Keep being cute.<br>Keep being funny.<br>Keep being handsome.<br><br>Just don\'t become boring.<br>We already have enough boring people. 😭'], ['n','FINAL CHAOS →']
];

PAGES[9] = [
    ['h','🎉 <span class="grad">{N}</span> 🎉'], ['p','YOU HAVE COMPLETED THE BIRTHDAY EXPERIENCE.'], ['c','Age: <b>+1</b><br>Wisdom: Loading...<br>Common Sense: Not found 😂<br>Nonchalant Level: <b>MAXIMUM</b><br>Cutiee Level: <b>100%</b><br>Birthday Status: 🎂 <b>LEGENDARY</b>'], ['H','<span class="grad">HAPPY BIRTHDAY !!!</span> 🥳🎂'], ['b','🎂 PRESS FOR CHAOS', chaos]
];

var FINAL = [
    ['H','HAPPY BIRTHDAY, <span class="grad">{N}</span>! ❤️'], ['p','Thanks for being one of the most random, funny, and cutiee people I know.'], ['p','Stay weird. 😂<br>Stay awesome.'], ['p','And please...<br>don\'t let the new age come with new kabadingan jk 😂'], ['b','↻ START OVER', function(){ location.reload(); }]
];

run(PAGES[0], 0, GAP[0]);