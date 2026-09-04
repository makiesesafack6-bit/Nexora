(function(){
  const KEY='nexoraAnalyticsV2';
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').filter(x=>x&&Number(x.amount)>0&&x.date)}catch{return []}};
  const save=a=>localStorage.setItem(KEY,JSON.stringify(a));
  const fmt=n=>new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0);
  const money=(n,c)=>`${c==='£'?'£':'$'}${fmt(n)}`;
  let period=7;
  const periods=[['24','24 H'],['7','7 J'],['30','1 MOIS'],['365','1 AN']];

  function injectStyles(){
    if($('#nxAnalyticsStyles'))return;
    const st=document.createElement('style');st.id='nxAnalyticsStyles';
    st.textContent=`
      #nxAnalytics{display:none}
      .nx-an-wrap{display:grid;gap:18px}
      .nx-an-toolbar{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap}
      .nx-an-toolbar h2{margin:7px 0 4px;font:800 28px Manrope,Arial}
      .nx-an-toolbar p{margin:0;color:#7e8794;font-size:12px}
      .nx-an-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      .nx-an-periods{display:flex;gap:6px;flex-wrap:wrap}
      .nx-an-periods button,.nx-an-add{border:1px solid #dfe3e8;background:#fff;color:#20242a;border-radius:10px;padding:9px 13px;font-weight:800;font-size:12px;cursor:pointer;transition:all .2s ease}
      .nx-an-periods button:hover,.nx-an-periods button.active{background:#111318;color:#fff;border-color:#111318;transform:translateY(-1px)}
      .nx-an-add{background:#111318;color:#fff;border-color:#111318}
      .nx-an-add:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(17,19,24,.14)}
      .nx-an-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(260px,.8fr);gap:16px}
      .nx-an-card{background:#fff;border:1px solid #e5e7ea;border-radius:16px;padding:20px;box-shadow:0 8px 30px rgba(18,24,34,.04)}
      .nx-an-big{font:800 34px Manrope,Arial;margin:14px 0 3px;letter-spacing:-.03em}
      .nx-an-sub{font-size:11px;color:#7c8490;font-weight:700}
      .nx-an-chart{position:relative;margin-top:18px;width:100%;height:320px}
      .nx-an-chart canvas{width:100%;height:100%;display:block}
      .nx-an-chart-tip{position:absolute;pointer-events:none;display:none;min-width:125px;padding:9px 10px;border:1px solid #e4e7eb;background:#fff;border-radius:10px;box-shadow:0 12px 28px rgba(15,20,30,.14);font-size:10px;color:#333;z-index:5}
      .nx-an-chart-tip strong{display:block;font-size:12px;margin-bottom:4px}
      .nx-an-kpis{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:14px}
      .nx-an-kpi{background:#fafafa;border:1px solid #eceef0;border-radius:12px;padding:13px}
      .nx-an-kpi span{display:block;color:#90969e;font-size:10px;font-weight:700}
      .nx-an-kpi strong{display:block;font:800 19px Manrope,Arial;margin-top:5px}
      .nx-an-list{margin-top:16px;border:1px solid #eceef0;border-radius:12px;overflow:hidden}
      .nx-an-list-head{display:grid;grid-template-columns:1fr 100px 36px;gap:10px;padding:10px 12px;background:#fafafa;color:#8b929b;font-size:9px;font-weight:800;letter-spacing:.08em}
      .nx-an-row{display:grid;grid-template-columns:1fr 100px 36px;gap:10px;align-items:center;padding:11px 12px;border-top:1px solid #eef0f2;font-size:11px}
      .nx-an-row:first-of-type{border-top:0}
      .nx-an-row small{display:block;color:#90969e;font-size:10px;margin-top:2px}
      .nx-an-del{border:0;background:#f1f2f4;border-radius:8px;width:30px;height:30px;cursor:pointer;font-weight:800;color:#59606a}
      .nx-an-empty{padding:26px;text-align:center;color:#858c95;font-size:12px}
      .nx-an-empty strong{display:block;color:#23272d;font-size:14px;margin-bottom:5px}
      .nx-an-modal{position:fixed;inset:0;background:rgba(8,10,14,.58);backdrop-filter:blur(9px);z-index:9999;display:none;align-items:center;justify-content:center;padding:20px}
      .nx-an-modal.open{display:flex}
      .nx-an-form{width:min(540px,96vw);background:#fff;border-radius:18px;padding:22px;box-shadow:0 30px 90px rgba(0,0,0,.26)}
      .nx-an-form h3{font:800 22px Manrope,Arial;margin:0 0 6px}.nx-an-form p{font-size:12px;color:#7d848c;margin:0 0 17px}
      .nx-an-fields{display:grid;grid-template-columns:1fr 1fr;gap:11px}.nx-an-fields .wide{grid-column:1/-1}
      .nx-an-fields label{font-size:11px;font-weight:800;color:#242830}.nx-an-fields input,.nx-an-fields select{box-sizing:border-box;width:100%;margin-top:6px;border:1px solid #dfe3e8;border-radius:9px;padding:10px;outline:0;background:#fff}
      .nx-an-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}.nx-an-actions button{border:1px solid #dfe3e8;background:#fff;border-radius:9px;padding:10px 14px;font-weight:800;cursor:pointer}.nx-an-actions .save{background:#111318;color:#fff;border-color:#111318}
      @media(max-width:900px){.nx-an-grid{grid-template-columns:1fr}}@media(max-width:560px){.nx-an-fields{grid-template-columns:1fr}.nx-an-fields .wide{grid-column:auto}.nx-an-toolbar{align-items:flex-start}.nx-an-chart{height:260px}}
    `;
    document.head.appendChild(st);
  }

  function ensureSection(){
    let sec=$('#nxAnalytics');if(sec)return sec;
    const content=$('.content');if(!content)return null;
    sec=document.createElement('section');sec.id='nxAnalytics';
    sec.innerHTML=`<div class="nx-an-wrap">
      <div class="nx-an-toolbar">
        <div><span class="eyebrow">ANALYTICS</span><h2>Votre croissance, en direct.</h2><p>Chaque revenu saisi par vous est ajouté à votre évolution.</p></div>
        <div class="nx-an-actions"><div class="nx-an-periods" id="nxPeriods">${periods.map(([k,v])=>`<button type="button" data-period="${k}" class="${k==='7'?'active':''}">${v}</button>`).join('')}</div><button type="button" id="nxAddRevenue" class="nx-an-add">＋ Ajouter un revenu</button></div>
      </div>
      <div class="nx-an-grid">
        <section class="nx-an-card">
          <span class="eyebrow">REVENUS</span><div class="nx-an-big" id="nxRevenueTotal">$0.00</div><div class="nx-an-sub" id="nxRevenueSub">Aucune vente enregistrée</div>
          <div class="nx-an-chart" id="nxChartWrap"><canvas id="nxRevenueCanvas"></canvas><div class="nx-an-chart-tip" id="nxChartTip"></div></div>
        </section>
        <aside class="nx-an-card"><span class="eyebrow">PERFORMANCES</span><div class="nx-an-kpis">
          <div class="nx-an-kpi"><span>Ventes</span><strong id="nxSales">0</strong></div><div class="nx-an-kpi"><span>Contrats</span><strong id="nxContracts">0</strong></div><div class="nx-an-kpi"><span>Ticket moyen</span><strong id="nxAverage">$0.00</strong></div><div class="nx-an-kpi"><span>Devise</span><strong id="nxCurrency">USD</strong></div>
        </div><div class="nx-an-list" id="nxRevenueList"><div class="nx-an-empty"><strong>Votre courbe démarre à 0.</strong>Ajoutez une première vente pour voir la progression.</div></div></aside>
      </div>
    </div>`;
    content.appendChild(sec);

    const modal=document.createElement('div');modal.className='nx-an-modal';modal.id='nxRevenueModal';
    modal.innerHTML=`<div class="nx-an-form"><h3>Ajouter un revenu</h3><p>Les chiffres affichés dans Analytics proviennent uniquement des ventes que vous saisissez.</p><div class="nx-an-fields">
      <label>Montant<input id="nxAmount" type="number" step="0.01" min="0.01" placeholder="500"/></label>
      <label>Devise<select id="nxCurrencyInput"><option value="$">$ Dollar (USD)</option><option value="£">£ Livre sterling (GBP)</option></select></label>
      <label>Date<input id="nxDate" type="date"/></label>
      <label>Type<select id="nxType"><option>Vente</option><option>Contrat</option><option>Prestation</option><option>Abonnement</option></select></label>
      <label class="wide">Client<input id="nxClient" placeholder="Nom du client"/></label>
    </div><div class="nx-an-actions"><button type="button" id="nxRevenueCancel">Annuler</button><button type="button" id="nxRevenueSave" class="save">Enregistrer la vente</button></div></div>`;
    document.body.appendChild(modal);

    $('#nxAddRevenue').onclick=()=>{const d=new Date();$('#nxDate').value=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;modal.classList.add('open');setTimeout(()=>$('#nxAmount').focus(),50)};
    $('#nxRevenueCancel').onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
    $('#nxRevenueSave').onclick=()=>{
      const amount=Number($('#nxAmount').value),date=$('#nxDate').value,currency=$('#nxCurrencyInput').value;
      if(!(amount>0)||!date){alert('Veuillez renseigner un montant et une date.');return}
      const arr=read();arr.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),amount,currency,date,type:$('#nxType').value,client:$('#nxClient').value.trim()||'Client sans nom',createdAt:new Date().toISOString()});save(arr);
      modal.classList.remove('open');$('#nxAmount').value='';$('#nxClient').value='';render();
    };
    sec.querySelectorAll('[data-period]').forEach(b=>b.onclick=()=>{period=Number(b.dataset.period);sec.querySelectorAll('[data-period]').forEach(x=>x.classList.toggle('active',x===b));render()});
    return sec;
  }

  function startOfPeriod(){
    const now=new Date();
    if(period===24){const s=new Date(now);s.setMinutes(now.getMinutes(),0,0);s.setHours(s.getHours()-23);return s;}
    const s=new Date(now);s.setHours(0,0,0,0);s.setDate(s.getDate()-(period-1));return s;
  }

  function bucketTime(d){return d.getTime()}
  function getEntryDate(e){
    const entered=new Date(`${e.date}T12:00:00`);
    if(e.createdAt && e.date===new Date().toISOString().slice(0,10))return new Date(e.createdAt);
    return entered;
  }

  function buildSeries(entries){
    const now=new Date();const start=startOfPeriod();
    const count=period===24?24:period;const out=Array.from({length:count},(_,i)=>{const d=new Date(start);if(period===24)d.setTime(start.getTime()+i*3600000);else d.setDate(start.getDate()+i);return{t:d,v:0}});
    entries.forEach(e=>{const d=getEntryDate(e);let idx;if(period===24)idx=Math.floor((d.getTime()-start.getTime())/3600000);else idx=Math.floor((new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()-new Date(start.getFullYear(),start.getMonth(),start.getDate()).getTime())/86400000);if(idx>=0&&idx<out.length)out[idx].v+=Number(e.amount||0)});
    let running=0;return out.map(p=>{running+=p.v;return{...p,c:p.v>0?running:running}});
  }

  function renderCanvas(series,currency){
    const c=$('#nxRevenueCanvas'),wrap=$('#nxChartWrap'),tip=$('#nxChartTip');if(!c||!wrap)return;
    const r=wrap.getBoundingClientRect(),ratio=Math.max(1,window.devicePixelRatio||1);c.width=r.width*ratio;c.height=r.height*ratio;const ctx=c.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);const w=r.width,h=r.height;ctx.clearRect(0,0,w,h);
    const max=Math.max(1,...series.map(p=>p.c));const pad={l:46,r:18,t:18,b:34};
    ctx.strokeStyle='#edf0f2';ctx.lineWidth=1;for(let i=0;i<5;i++){const y=pad.t+(h-pad.t-pad.b)*i/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke()}
    ctx.fillStyle='#8b929b';ctx.font='10px DM Sans,Arial';ctx.textAlign='right';for(let i=0;i<5;i++){const val=max*(1-i/4),y=pad.t+(h-pad.t-pad.b)*i/4+4;ctx.fillText(`${currency}${fmt(val).replace(/\.00$/,'')}`,pad.l-8,y)}
    const step=(w-pad.l-pad.r)/Math.max(1,series.length-1);const pts=series.map((p,i)=>({x:pad.l+i*step,y:pad.t+(h-pad.t-pad.b)*(1-p.c/max),data:p}));
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.lineTo(pts[pts.length-1].x,h-pad.b);ctx.lineTo(pts[0].x,h-pad.b);ctx.closePath();ctx.fillStyle='rgba(17,19,24,.06)';ctx.fill();
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle='#111318';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#111318';pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,3.2,0,Math.PI*2);ctx.fill()});
    ctx.fillStyle='#8b929b';ctx.font='10px DM Sans,Arial';ctx.textAlign='center';const stride=period===24?4:Math.max(1,Math.ceil(series.length/5));series.forEach((p,i)=>{if(i===0||i===series.length-1||i%stride===0){const label=period===24?String(p.t.getHours()).padStart(2,'0')+'h':p.t.toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});ctx.fillText(label,pts[i].x,h-10)}});
    wrap.onmousemove=e=>{const rect=c.getBoundingClientRect();const x=e.clientX-rect.left;const idx=Math.max(0,Math.min(series.length-1,Math.round((x-pad.l)/step)));const p=pts[idx];if(!p)return;tip.style.display='block';tip.innerHTML=`<strong>${period===24?p.data.t.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):p.data.t.toLocaleDateString('fr-FR',{day:'2-digit',month:'long'})}</strong><span>Revenu cumulé : ${money(p.data.c,currency)}</span><br><span>Ventes ce jour : ${money(p.data.v,currency)}</span>`;tip.style.left=Math.min(w-140,Math.max(4,p.x+10))+'px';tip.style.top=Math.max(4,p.y-52)+'px'};
    wrap.onmouseleave=()=>{tip.style.display='none'};
  }

  function render(){
    const sec=ensureSection();if(!sec)return;const entries=read();const allCurrencies=[...new Set(entries.map(e=>e.currency))];const currency=allCurrencies.includes('$')?'$':(allCurrencies[0]||'$');
    const start=startOfPeriod();const end=new Date();const filtered=entries.filter(e=>{const d=getEntryDate(e);return d>=start&&d<=end});
    const total=filtered.filter(e=>e.currency===currency).reduce((s,e)=>s+Number(e.amount||0),0);const sales=filtered.filter(e=>e.currency===currency).length;const contracts=filtered.filter(e=>e.currency===currency&&e.type==='Contrat').length;
    $('#nxRevenueTotal').textContent=money(total,currency);$('#nxSales').textContent=sales;$('#nxContracts').textContent=contracts;$('#nxAverage').textContent=money(sales?total/sales:0,currency);$('#nxCurrency').textContent=currency==='£'?'GBP':'USD';
    $('#nxRevenueSub').textContent=entries.length?`${sales} vente${sales!==1?'s':''} enregistrée${sales!==1?'s':''} sur ${period===24?'les dernières 24 heures':period===7?'les 7 derniers jours':period===30?'les 30 derniers jours':'la dernière année'}`:'Votre courbe démarre à 0.00';
    renderCanvas(buildSeries(filtered.filter(e=>e.currency===currency)),currency);
    const list=$('#nxRevenueList');const sorted=[...entries].sort((a,b)=>{const da=getEntryDate(a),db=getEntryDate(b);return db-da}).slice(0,8);
    list.innerHTML=sorted.length?`<div class="nx-an-list-head"><span>VENTE</span><span>MONTANT</span><span></span></div>`+sorted.map(e=>`<div class="nx-an-row"><div><strong>${esc(e.client)}</strong><small>${esc(e.type)} · ${new Date(e.date).toLocaleDateString('fr-FR')} · ${e.currency==='£'?'GBP':'USD'}</small></div><strong>${money(e.amount,e.currency)}</strong><button class="nx-an-del" data-id="${esc(e.id)}" title="Supprimer" type="button">×</button></div>`).join(''):'<div class="nx-an-empty"><strong>Votre courbe démarre à 0.</strong>Ajoutez une première vente pour voir la progression.</div>';
    list.querySelectorAll('.nx-an-del').forEach(b=>b.onclick=()=>{save(read().filter(e=>e.id!==b.dataset.id));render()});
  }

  function hideOthers(){['.heading-row','.stats','.search-card','.automation','.lower-grid','.notifications-panel','.settings'].forEach(s=>$$(`${s}`).forEach(e=>e.style.display='none'))}
  function show(){injectStyles();const sec=ensureSection();if(!sec)return;hideOthers();sec.style.display='block';$$('.nav-item').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#analytics'));render();window.scrollTo({top:0,behavior:'smooth'})}
  function init(){document.addEventListener('click',e=>{const t=e.target.closest?.('a.nav-item');if(t&&t.getAttribute('href')==='#analytics'){e.preventDefault();e.stopImmediatePropagation();show()}},true);window.addEventListener('resize',()=>{if($('#nxAnalytics')?.style.display==='block')render()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();window.NexoraAnalytics={show,read,save};
})();
