/* V106 (Lionel) : levier ZOOM à 2 positions (1 normal, 2 plein écran) sur les pages sans livre, même aspect que sur l'accueil, avec sa croix de retour au zoom 1 */
(function(){var st=document.createElement('style');st.textContent='.zoom-lev{display:inline-flex;align-items:center;gap:4px;margin-right:2px}.zoom-lev[hidden]{display:none!important}\n.zoom-mot{font:800 10px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#f2c66d}\n.zoom-cad{width:68px;height:46px;touch-action:none;user-select:none;-webkit-user-select:none;cursor:pointer;position:relative;-webkit-tap-highlight-color:transparent}\n.zoom-cad svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}\n.zoom-cad:focus-visible{outline:3px solid #f2c66d;outline-offset:3px;border-radius:10px}\n.zoom-cad .ch{font:700 13px Georgia,\'Times New Roman\',serif;fill:#8d91a8;transition:fill .2s}\n.zoom-cad .ch.on{fill:#ffe39a;filter:drop-shadow(0 0 3px rgba(242,198,109,.9))}\n@media (max-width:480px){.zoom-mot{display:none}.zoom-cad{width:54px;height:37px}html.zl .marque{font-size:0;letter-spacing:0;gap:0}}\n.zoom-x{width:28px;height:28px;border-radius:50%;border:1.5px solid #f2c66d;background:#f2c66d;color:#1a1d33;font:800 14px/1 system-ui,sans-serif;display:grid;place-items:center;padding:0;cursor:pointer;margin-left:4px}.zoom-x[hidden]{display:none!important}.zoom-mot{align-self:flex-start;margin-top:3px}\n.zoom-x{width:28px;height:28px;border-radius:50%;border:1.5px solid #f2c66d;background:#f2c66d;color:#1a1d33;font:800 14px/1 system-ui,sans-serif;display:grid;place-items:center;padding:0;cursor:pointer;margin-left:4px}.zoom-x[hidden]{display:none!important}.zoom-mot{align-self:flex-start;margin-top:3px}';document.head.appendChild(st);
 var pb=document.getElementById('plein-btn');if(!pb)return;var box=document.createElement('div');box.className='zoom-lev';box.id='zoom-lev';box.hidden=true;box.innerHTML='<span class="zoom-mot" aria-hidden="true">Zoom</span><div class="zoom-cad" id="zoom-cad" role="slider" tabindex="0" aria-label="Zoom de la page" aria-valuemin="1" aria-valuemax="2" aria-valuenow="1" aria-valuetext="Normal" title="Zoom : 1 normal, 2 plein écran"></div><button type="button" class="zoom-x" id="zoom-x" hidden aria-label="Revenir au zoom normal" title="Revenir au zoom normal">✕</button>';pb.parentNode.insertBefore(box,pb);})();
(function(){var box=document.getElementById('zoom-lev'),c=document.getElementById('zoom-cad'),f={},D=document.documentElement;
 if(!box||!c)return;var ok=!!(D.requestFullscreen||D.webkitRequestFullscreen);if(!ok)return;box.hidden=false;D.classList.add('zl');
 var mp=document.getElementById('menu-plein');if(mp){mp.hidden=true;mp.style.display='none';}var pb=document.getElementById('plein-btn');if(pb){pb.hidden=true;pb.style.display='none';}   /* le levier remplace le bouton plein écran de la barre */
 var NOMS=['Normal','Plein écran'],ANG=[-30,30],PX=56,PY=62;
 function pt(a,r){var t=a*Math.PI/180;return [PX+Math.sin(t)*r,PY-Math.cos(t)*r];}
 var gr=[-40,-20,0,20,40].map(function(a){var p=pt(a,38),q=pt(a,a%40?34:31);return '<line x1="'+p[0].toFixed(1)+'" y1="'+p[1].toFixed(1)+'" x2="'+q[0].toFixed(1)+'" y2="'+q[1].toFixed(1)+'" stroke="#c9a04a" stroke-width="'+(a%40?1:1.6)+'"/>';}).join('');
 var ch=ANG.map(function(a,i){var p=pt(a,47);return '<text class="ch" x="'+p[0].toFixed(1)+'" y="'+(p[1]+4).toFixed(1)+'" text-anchor="middle">'+(i+1)+'</text>';}).join('');
 c.innerHTML='<svg viewBox="0 0 112 76" aria-hidden="true"><defs><radialGradient id="zOr" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#fff4d0"/><stop offset=".45" stop-color="#f2c66d"/><stop offset="1" stop-color="#7d5d1c"/></radialGradient>'+
  '<linearGradient id="zCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c6"/><stop offset=".35" stop-color="#e2b552"/><stop offset=".7" stop-color="#f7d98a"/><stop offset="1" stop-color="#8a6a22"/></linearGradient>'+
  '<linearGradient id="zLaiton" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9b0"/><stop offset=".5" stop-color="#d9a945"/><stop offset="1" stop-color="#6e521a"/></linearGradient></defs>'+
  '<path d="M10 66 A46 46 0 0 1 102 66 Z" fill="url(#zLaiton)"/><path d="M15 66 A41 41 0 0 1 97 66 Z" fill="#231c10"/>'+gr+'<path d="M10 66 L102 66" stroke="#6e521a" stroke-width="2"/>'+ch+
  '<g class="lev"><path d="M56 24 L61.5 62 L50.5 62 Z" fill="url(#zCone)"/><path d="M56 24 L57.5 62 L54 62 Z" fill="#fff6d8" opacity=".5"/><path d="M56 24 L61.5 62 L59 62 Z" fill="#5a4318" opacity=".45"/></g>'+
  '<circle cx="56" cy="62" r="5" fill="url(#zOr)" stroke="#6e521a" stroke-width=".8"/></svg>';
 var lev=c.querySelector('.lev'),chs=[].slice.call(c.querySelectorAll('.ch')),pos=0,ang=ANG[0],vit=0,cible=ANG[0],raf=0,g=null,AC=null;
 function coup(t0,dur,fr,q,vol){var n=Math.floor(AC.sampleRate*dur),b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,5);var s=AC.createBufferSource();s.buffer=b;var fl=AC.createBiquadFilter();fl.type='bandpass';fl.frequency.value=fr;fl.Q.value=q;var gn=AC.createGain();gn.gain.value=vol;s.connect(fl);fl.connect(gn);gn.connect(AC.destination);s.start(AC.currentTime+t0);}
 function clic(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();coup(0,.035,2600,1.8,.55);coup(.018,.05,1100,2.2,.6);}catch(e){}   /* « clic-clac » d'un vieil interrupteur : un claquement aigu puis le corps du laiton */try{if(navigator.vibrate&&!/MiuiBrowser|XiaoMi\//i.test(navigator.userAgent))navigator.vibrate([34,45,26]);}catch(e){}}   /* V104 : « clac-clac » fort, calé sur les deux coups du son */
 function peint(){lev.setAttribute('transform','rotate('+ang.toFixed(2)+' '+PX+' '+PY+')');}
 function maj(){var zx=document.getElementById('zoom-x');if(zx)zx.hidden=pos===0;chs.forEach(function(t,i){t.classList.toggle('on',i===pos);});c.setAttribute('aria-valuenow',pos+1);c.setAttribute('aria-valuetext',NOMS[pos]);}
 function fe(){return document.fullscreenElement||document.webkitFullscreenElement||null;}
 function sortir(){try{(document.exitFullscreen||document.webkitExitFullscreen).call(document);}catch(e){}}
 function entrer(el){try{var r=(el.requestFullscreen||el.webkitRequestFullscreen).call(el);if(r&&r.catch)r.catch(function(){suit();});}catch(e){suit();}}
 var veut=null;
 function applique(i){var e=fe();veut=i;   /* le geste de l'utilisateur est encore actif ici : le navigateur accepte le plein écran */
  if(i===0){if(e)sortir();}else if(i>=1){if(!e)entrer(D);}
  else if(i===1){if(e===f)sortir();else if(!e)entrer(D);}   /* depuis 3 : on sort d'abord du livre, puis la page reprend le plein écran (voir suit) */
  else{if(e!==f){pret3();entrer(f);}}}
 /* V103 : position 3 avec « Feuilleter » replié : on déplie la section et on charge le livre AVANT le plein écran (avant : cadre vide en plein écran, écran noir, impossible d'en sortir) */
 function pret3(){try{var sec=document.getElementById('section-feuilleter'),bd=sec&&sec.querySelector('button.bandeau');if(bd&&bd.getAttribute('aria-expanded')!=='true')bd.click();if(!f.getAttribute('src')&&f.dataset.src)f.src=f.dataset.src;}catch(x){}}
 /* filet de sécurité : le livre dit « salut » quand il est chargé ; si, 12 s après le passage en position 3, il n'a jamais répondu (pas de réseau…), on sort tout seul du plein écran */
 var livreVu=false,garde3=0;window.addEventListener('message',function(e){if(e.source===f.contentWindow)livreVu=true;});
 ['fullscreenchange','webkitfullscreenchange'].forEach(function(n){document.addEventListener(n,function(){clearTimeout(garde3);if(fe()===f&&!livreVu)garde3=setTimeout(function(){if(fe()===f&&!livreVu){veut=0;sortir();}},12000);});});
 function suit(){var e=fe(),p=!e?0:(e===f?2:1);
  if(veut===1&&p===0){veut=null;entrer(D);return;}   /* 3 → 2 : on était sorti du livre, la page repasse en plein écran */
  if(veut===0&&p!==0){sortir();return;}               /* 3 → 1 avec la page en dessous : on sort complètement */
  veut=null;if(p!==pos){pos=p;maj();}cible=ANG[pos];ressort(false);}
 ['fullscreenchange','webkitfullscreenchange'].forEach(function(n){document.addEventListener(n,function(){setTimeout(suit,30);});});
 /* ressort : la position est prise au PREMIER contact avec le cran ; le rebond qui suit est seulement visuel */
 function ressort(nouv){cancelAnimationFrame(raf);var der=performance.now(),touche=false;
  function pas(t){var dt=Math.min(32,t-der)/1000;der=t;vit+=((cible-ang)*420-vit*17)*dt;var av=ang;ang+=vit*dt;
   if(!touche&&(av-cible)*(ang-cible)<=0){touche=true;if(nouv!==false&&nouv!==null&&nouv!==undefined){pos=nouv;maj();clic();applique(nouv);}}peint();
   if(Math.abs(cible-ang)<.05&&Math.abs(vit)<1){ang=cible;peint();return;}raf=requestAnimationFrame(pas);}raf=requestAnimationFrame(pas);}
 function va(i){cible=ANG[i];if(i===pos){ressort(false);return;}ressort(i);}
 function reveil(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(x){}}   /* le son doit être « réveillé » pendant le toucher, sinon téléphones et tablettes le coupent */
 c.addEventListener('pointerdown',function(e){reveil();try{c.setPointerCapture(e.pointerId);}catch(x){}cancelAnimationFrame(raf);g={x:e.clientX,a:ang,parti:false};});
 c.addEventListener('pointermove',function(e){if(!g||g.parti)return;var dx=e.clientX-g.x;ang=Math.max(-48,Math.min(48,g.a+dx*.7));peint();
  if(Math.abs(dx)>10){var sens=dx>0?1:-1;g.parti=true;vit=sens*260;va(Math.max(0,Math.min(1,pos+sens)));}});
 function fin(e){if(!g)return;var w=g;g=null;if(w.parti)return;if(Math.abs(e.clientX-w.x)<5){var r=c.getBoundingClientRect(),q=(e.clientX-r.left)/r.width;va(q<.5?0:1);}else va(pos);}
 c.addEventListener('pointerup',fin);c.addEventListener('pointercancel',fin);
 c.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowUp'){va(Math.min(1,pos+1));e.preventDefault();}if(e.key==='ArrowLeft'||e.key==='ArrowDown'){va(Math.max(0,pos-1));e.preventDefault();}});
 /* le livre demande de sortir (sa croix, en position 3) : on revient à la position 1 */
 window.addEventListener('message',function(e){if(e.origin!=='https://edition-discrete.pages.dev'||e.source!==f.contentWindow)return;var d=e.data;if(d&&d.ed==='sortPlein'&&fe()){veut=0;sortir();}});
 var zx0=document.getElementById('zoom-x');if(zx0)zx0.addEventListener('click',function(){reveil();va(0);});
 window.__zoomLevier=true;peint();maj();suit();})();
