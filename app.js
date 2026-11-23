(()=>{'use strict';
const $=(q,root=document)=>root.querySelector(q),$$=(q,root=document)=>[...root.querySelectorAll(q)];
const cfg=window.GREENICH_CONFIG||{};
const model={'170-C10':'GB017','170-C20':'GB027','220-C10':'GB012','220-C20':'GB022'};
const params=new URLSearchParams(location.search);
const state={ah:['110','150','170','220','250'].includes(params.get('ah'))?params.get('ah'):'220',rating:['C10','C20'].includes(params.get('rating'))?params.get('rating'):'C20'};
const code=()=>model[`${state.ah}-${state.rating}`]||'Not assigned';
const clean=s=>String(s||'').trim().replace(/[<>]/g,'');
const indianPhone=p=>{let n=String(p).replace(/\D/g,'');if(n.startsWith('91')&&n.length===12)n=n.slice(2);return /^[6-9]\d{9}$/.test(n);};
let timeout;
function toast(message){const t=$('#toast');if(!t)return;t.textContent=message;t.classList.add('visible');clearTimeout(timeout);timeout=setTimeout(()=>t.classList.remove('visible'),4400);}
async function copy(message){try{if(navigator.clipboard&&isSecureContext)await navigator.clipboard.writeText(message);else{const t=document.createElement('textarea');t.value=message;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();if(!document.execCommand('copy'))throw Error('Copy failed');t.remove();}toast('Details copied.');}catch(e){toast('Clipboard unavailable in this browser.');}}
function sendEnquiry(message){const number=String(cfg.whatsappNumber||'');if(!/^\d{10,15}$/.test(number)){toast('The enquiry contact is not configured.');return;}const url=`https://wa.me/${number}?text=${encodeURIComponent(message)}`;window.location.assign(url);}
$$('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
$$('[data-phone-link]').forEach(el=>{el.href=`tel:+91${cfg.customerCareNumber||'8590750044'}`;el.textContent='Customer Care: '+(cfg.customerCareNumber||'8590750044');});
$$('[data-email-link]').forEach(el=>{el.href=`mailto:${cfg.email||''}`;el.textContent=cfg.email||'Email Greenich';});
const mobileNav=$('#mobile-nav'),menuButton=$('#menu-button');function closeMenu(){if(!mobileNav)return;mobileNav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Open menu');document.body.classList.remove('nav-open');}
menuButton?.addEventListener('click',()=>{const next=!mobileNav.classList.contains('open');mobileNav.classList.toggle('open',next);menuButton.setAttribute('aria-expanded',String(next));menuButton.setAttribute('aria-label',next?'Close menu':'Open menu');document.body.classList.toggle('nav-open',next);});
$$('.mobile-nav a').forEach(el=>el.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();$('#install-overlay')?.classList.remove('open');}});document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
let deferredPrompt=null;const installOverlay=$('#install-overlay'),installNative=$('#install-native');window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;});
$$('[data-install]').forEach(el=>el.addEventListener('click',()=>{closeMenu();if(matchMedia('(display-mode: standalone)').matches||window.navigator.standalone){toast('Greenich is already installed.');return;}const ios=/iPad|iPhone|iPod/.test(navigator.userAgent);$('#install-instructions').textContent=deferredPrompt?'Install Greenich for quick access to battery details and enquiries.':ios?'In Safari, tap Share, then Add to Home Screen.':'Use the browser menu and choose Install app or Add to Home Screen. Install requires the live HTTPS website.';installNative.hidden=!deferredPrompt;installOverlay.classList.add('open');}));
$('#close-install')?.addEventListener('click',()=>installOverlay.classList.remove('open'));installOverlay?.addEventListener('click',e=>{if(e.target===installOverlay)installOverlay.classList.remove('open');});
installNative?.addEventListener('click',async()=>{if(!deferredPrompt)return;const prompt=deferredPrompt;deferredPrompt=null;installOverlay.classList.remove('open');await prompt.prompt();});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;toast('Greenich installed.');});
if('serviceWorker'in navigator&&/^https?:$/.test(location.protocol))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
const page=document.body.dataset.page;
function bindSelectors(){ $$('[data-ah]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.ah===state.ah));b.addEventListener('click',()=>{state.ah=b.dataset.ah;renderSelection();});}); $$('[data-rating]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.rating===state.rating));b.addEventListener('click',()=>{state.rating=b.dataset.rating;renderSelection();});});renderSelection();}
function renderSelection(){ $$('[data-ah]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ah===state.ah)));$$('[data-rating]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.rating===state.rating))); const values={'#product-model':code(),'#product-variant':`${state.ah} Ah / ${state.rating}`,'#mobile-product-variant':`${state.ah} Ah / ${state.rating}`,'#summary-model':code(),'#summary-ah':`${state.ah} Ah`,'#summary-rating':state.rating,'#summary-model-inline':code(),'#summary-selection-inline':`${state.ah} Ah · ${state.rating}`};Object.entries(values).forEach(([key,value])=>{const el=$(key);if(el)el.textContent=value;});['#product-order','#mobile-product-order'].forEach(id=>{const a=$(id);if(a)a.href=`order.html?intent=product&ah=${state.ah}&rating=${state.rating}`;});}
// Header back action respects local navigation and has a sensible fallback for directly opened pages.
$$('[data-go-back]').forEach(button=>button.addEventListener('click',()=>{
 const fallback=button.dataset.fallback||'index.html';
 try{
  if(document.referrer){
   const from=new URL(document.referrer),here=new URL(location.href);
   const sameSite=(here.protocol==='file:'&&from.protocol==='file:'&&from.pathname.substring(0,from.pathname.lastIndexOf('/')+1)===here.pathname.substring(0,here.pathname.lastIndexOf('/')+1))||(here.protocol!=='file:'&&from.origin===here.origin);
   if(sameSite&&from.href!==here.href&&history.length>1){history.back();return;}
  }
 }catch(e){}
 location.assign(fallback);
}));
if(page==='product.html'){
 bindSelectors();
 const thumbs=$$('[data-image]'),gallery=$('.gallery-display'),picture=$('#gallery-image'),lightbox=$('#gallery-lightbox'),zoomPic=$('#gallery-zoom-image');
 const photos=thumbs.map(b=>({src:b.dataset.image,alt:b.dataset.alt}));
 let selected=0,gestureStart=null,suppressTapUntil=0,restoreFocus=null;
 function showPhoto(index){
  selected=(index+photos.length)%photos.length;
  const photo=photos[selected];
  picture.src=photo.src;picture.alt=photo.alt;
  const indexLabel=$('#gallery-index');if(indexLabel)indexLabel.textContent=`0${selected+1} / 0${photos.length}`;
  thumbs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));
  $$('[data-gallery-progress]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));
  if(zoomPic){zoomPic.src=photo.src;zoomPic.alt=photo.alt.replace(' view',' view enlarged');}
  const zoomLabel=$('#gallery-zoom-index');if(zoomLabel)zoomLabel.textContent=`${selected+1} / ${photos.length}`;
 }
 thumbs.forEach((b,i)=>b.addEventListener('click',()=>showPhoto(i)));
 $$('[data-gallery-progress]').forEach(b=>b.addEventListener('click',()=>showPhoto(Number(b.dataset.galleryProgress))));
 function swipeStart(e){const touch=e.touches?.[0];if(touch)gestureStart={x:touch.clientX,y:touch.clientY};}
 function swipeEnd(e){
  const touch=e.changedTouches?.[0];if(!gestureStart||!touch)return;
  const dx=touch.clientX-gestureStart.x,dy=touch.clientY-gestureStart.y;gestureStart=null;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.15){
   showPhoto(selected+(dx<0?1:-1));suppressTapUntil=Date.now()+550;
  }
 }
 gallery?.addEventListener('touchstart',swipeStart,{passive:true});
 gallery?.addEventListener('touchend',swipeEnd,{passive:true});
 function openLightbox(){if(Date.now()<suppressTapUntil||!lightbox)return;restoreFocus=document.activeElement;showPhoto(selected);lightbox.hidden=false;document.body.classList.add('gallery-open');$('#gallery-zoom-close')?.focus();}
 function closeLightbox(){if(!lightbox)return;lightbox.hidden=true;document.body.classList.remove('gallery-open');if(restoreFocus?.focus)restoreFocus.focus();}
 picture?.addEventListener('click',openLightbox);
 picture?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox();}});
 $('#gallery-zoom-close')?.addEventListener('click',closeLightbox);
 $('#gallery-zoom-prev')?.addEventListener('click',()=>showPhoto(selected-1));
 $('#gallery-zoom-next')?.addEventListener('click',()=>showPhoto(selected+1));
 lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
 lightbox?.addEventListener('touchstart',swipeStart,{passive:true});
 lightbox?.addEventListener('touchend',swipeEnd,{passive:true});
 document.addEventListener('keydown',e=>{
  if(lightbox?.hidden===false){
   if(e.key==='Escape'){e.preventDefault();closeLightbox();}
   else if(e.key==='ArrowRight'){e.preventDefault();showPhoto(selected+1);}
   else if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(selected-1);}
  }
 });
 showPhoto(0);
}

if(page==='order.html'){
 const error=$('#enquiry-error'),form=$('#enquiry-form');
 const val=id=>clean($(id)?.value);
 // A specific product is carried from the product detail page; general enquiries remain general.
 const hasSelectedModel=(params.get('intent')==='product'&&(params.has('ah')||params.has('rating')));
 const context=$('#enquiry-product-context');if(context)context.hidden=!hasSelectedModel;
 if(hasSelectedModel){
  const label=$('#enquiry-product-variant');if(label)label.textContent=`${state.ah} Ah · ${state.rating} · ${code()}`;
  const change=$('.enquiry-product-context a');if(change)change.href=`product.html?ah=${state.ah}&rating=${state.rating}`;
 }
 if(params.has('message')&&$('#customer-message'))$('#customer-message').value=clean(params.get('message')).slice(0,700);
 function enquiryMessage(){
  const lines=['Hello Greenich,','','I would like to make an enquiry.'];
  if(hasSelectedModel){lines.push('','Product: Greenich Tubular Battery',`Capacity: ${state.ah}Ah`,`Rating: ${state.rating}`);if(code()!=='Not assigned')lines.push(`Model: ${code()}`);}
  lines.push('',`Name: ${val('#customer-name')}`,`Mobile: ${val('#customer-phone')}`);
  if(val('#customer-place'))lines.push(`Location: ${val('#customer-place')}`);
  if(val('#customer-message'))lines.push('',`Message: ${val('#customer-message')}`);
  lines.push('','Please contact me with more information. Thank you.');
  return lines.join('\n');
 }
 form?.addEventListener('submit',e=>{
  e.preventDefault();error.textContent='';
  if(val('#customer-name').length<2){error.textContent='Please enter your name.';$('#customer-name').focus();return;}
  if(!indianPhone(val('#customer-phone'))){error.textContent='Please enter a valid 10-digit mobile number.';$('#customer-phone').focus();return;}
  sendEnquiry(enquiryMessage());
 });
}

})();
