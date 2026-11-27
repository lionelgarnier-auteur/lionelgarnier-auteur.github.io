/* V113 (Lionel, 27/11/2026) : invitation « Lire en grand » sous le levier ZOOM, quand le lecteur arrive sur « Feuilleter ».
   Un toucher met le livre en grand = position 2 (la barre du site reste, la page reste déroulable).
   Le navigateur interdit d'agrandir tout seul : il faut un vrai toucher, c'est le rôle de ce bouton.
   Elle respire, reste tant que le visiteur n'a touché à rien, et s'efface dès qu'il touche ailleurs.
   Une seule fois par visite ; jamais si le livre est déjà agrandi, ni sur un petit écran couché. */
(function(){var lev=document.getElementById('zoom-lev'),sec=document.getElementById('section-feuilleter');if(!lev||!sec)return;
 try{if(sessionStorage.getItem('inv_zoom'))return;}catch(e){}
 var st=document.createElement('style');st.textContent='#inv-zoom{position:fixed;z-index:6;display:none;align-items:center;gap:6px;padding:7px 13px;border-radius:999px;border:0;background:var(--or,#f2c66d);color:var(--nuit,#1f2438);font:600 13px/1.2 system-ui,sans-serif;white-space:nowrap;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.45);opacity:0;transition:opacity .5s}#inv-zoom.on{display:inline-flex;opacity:1;animation:invZ 2.2s ease-in-out 3}#inv-zoom.part{opacity:0}@keyframes invZ{50%{transform:translateY(3px)}}#inv-zoom::before{content:"";position:absolute;top:-5px;left:50%;margin-left:-5px;border:5px solid transparent;border-bottom-color:var(--or,#f2c66d);border-top:0}@media (prefers-reduced-motion:reduce){#inv-zoom.on{animation:none}}';document.head.appendChild(st);
 var b=document.createElement('button');b.type='button';b.id='inv-zoom';b.innerHTML='Lire en grand <span aria-hidden="true">↗</span>';document.body.appendChild(b);
 function place(){var r=lev.getBoundingClientRect();if(!r.width){cache();return;}b.style.left=Math.round(Math.min(innerWidth-b.offsetWidth-8,Math.max(8,r.left+r.width/2-b.offsetWidth/2)))+'px';b.style.top=Math.round(r.bottom+8)+'px';}
 var tm=0,parti=false;
 function cache(){if(parti)return;parti=true;b.classList.add('part');clearTimeout(tm);setTimeout(function(){b.remove();},600);try{sessionStorage.setItem('inv_zoom','1');}catch(e){}}
 function montre(){if(parti||b.classList.contains('on'))return;if(lev.hidden||document.fullscreenElement||(innerHeight<520&&innerWidth>innerHeight))return;b.classList.add('on');place();}   /* V113 : plus d'effacement au bout de 7 s, et le téléphone y a droit aussi */
 b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();try{if(window.__zoomVa)window.__zoomVa(1);}catch(x){}cache();});
 addEventListener('resize',function(){if(!parti&&b.classList.contains('on'))place();});
 addEventListener('scroll',function(){if(!parti&&b.classList.contains('on'))place();},{passive:true});
 document.addEventListener('pointerdown',function(e){if(b.classList.contains('on')&&!b.contains(e.target))cache();},true);
 new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting)setTimeout(montre,1200);});},{threshold:.35}).observe(sec);})();
