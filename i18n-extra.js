(() => {
  const MAP={
    'Active searches':{fr:'Recherches actives',en:'Active searches',es:'Búsquedas activas',pt:'Pesquisas ativas',de:'Aktive Suchen',it:'Ricerche attive',sw:'Utafutaji unaoendelea',ln:'Boluki oyo ezali kosala',ar:'عمليات البحث النشطة',zh:'活跃搜索',hi:'सक्रिय खोजें',tr:'Aktif aramalar'},
    'Prospects found':{fr:'Prospects trouvés',en:'Prospects found',es:'Prospectos encontrados',pt:'Prospectos encontrados',de:'Gefundene Interessenten',it:'Prospect trovati',sw:'Matarajio yaliyopatikana',ln:'Ba prospect bamonani',ar:'العملاء المحتملون encontrados',zh:'已找到的潜在客户',hi:'मिले हुए संभावित ग्राहक',tr:'Bulunan potansiyel müşteriler'},
    'Messages sent':{fr:'Messages envoyés',en:'Messages sent',es:'Mensajes enviados',pt:'Mensagens enviadas',de:'Gesendete Nachrichten',it:'Messaggi inviati',sw:'Ujumbe uliotumwa',ln:'Bansango etindami',ar:'الرسائل المرسلة',zh:'已发送消息',hi:'भेजे गए संदेश',tr:'Gönderilen mesajlar'},
    'High matches':{fr:'Correspondances fortes',en:'High matches',es:'Coincidencias fuertes',pt:'Correspondências fortes',de:'Starke Treffer',it:'Corrispondenze forti',sw:'Mechi kali',ln:'Ba match ya makasi',ar:'مطابقات قوية',zh:'高匹配',hi:'उच्च मिलान',tr:'Yüksek eşleşmeler'},
    'Quick Search':{fr:'RECHERCHE RAPIDE',en:'QUICK SEARCH',es:'BÚSQUEDA RÁPIDA',pt:'PESQUISA RÁPIDA',de:'SCHNELLSUCHE',it:'RICERCA RAPIDA',sw:'UTAFUTAJI WA HARAKA',ln:'BOLUKI YA NOKI',ar:'بحث سريع',zh:'快速搜索',hi:'त्वरित खोज',tr:'HIZLI ARAMA'},
    'Recent Prospects':{fr:'PROSPECTS RÉCENTS',en:'RECENT PROSPECTS',es:'PROSPECTOS RECIENTES',pt:'PROSPECTOS RECENTES',de:'LETZTE INTERESSENTEN',it:'PROSPECT RECENTI',sw:'MATARAJIO YA HIVI KARIBUNI',ln:'BA PROSPECT YA SIKA',ar:'العملاء المحتملون مؤخرًا',zh:'最近的潜在客户',hi:'हाल के संभावित ग्राहक',tr:'SON POTANSİYEL MÜŞTERİLER'},
    'PROSPECT':{fr:'PROSPECT',en:'PROSPECT',es:'PROSPECTO',pt:'PROSPECTO',de:'INTERESSENT',it:'PROSPECT',sw:'MTEJA MTARAJIWA',ln:'PROSPECT',ar:'عميل محتمل',zh:'潜在客户',hi:'संभावित ग्राहक',tr:'POTANSİYEL MÜŞTERİ'},
    'SOURCE':{fr:'SOURCE',en:'SOURCE',es:'FUENTE',pt:'FONTE',de:'QUELLE',it:'FONTE',sw:'CHANZO',ln:'ESIKA',ar:'المصدر',zh:'来源',hi:'स्रोत',tr:'KAYNAK'},
    'NEED DETECTED':{fr:'BESOIN DÉTECTÉ',en:'NEED DETECTED',es:'NECESIDAD DETECTADA',pt:'NECESSIDADE DETECTADA',de:'BEDARF ERKANNT',it:'BISOGNO RILEVATO',sw:'HITAJI ILIYOGUNDULIWA',ln:'BOSENGA EEMONI',ar:'الحاجة المكتشفة',zh:'检测到的需求',hi:'पहचानी गई जरूरत',tr:'TESPİT EDİLEN İHTİYAÇ'},
    'MATCH':{fr:'MATCH',en:'MATCH',es:'COINCIDENCIA',pt:'CORRESPONDÊNCIA',de:'TREFFER',it:'MATCH',sw:'MECHI',ln:'MATCH',ar:'تطابق',zh:'匹配',hi:'मिलान',tr:'EŞLEŞME'},
    'RECENT PROSPECTS':{fr:'PROSPECTS RÉCENTS',en:'RECENT PROSPECTS',es:'PROSPECTOS RECIENTES',pt:'PROSPECTOS RECENTES',de:'LETZTE INTERESSENTEN',it:'PROSPECT RECENTI',sw:'MATARAJIO YA HIVI KARIBUNI',ln:'BA PROSPECT YA SIKA',ar:'أحدث العملاء المحتملين',zh:'最近潜在客户',hi:'हाल के संभावित ग्राहक',tr:'SON POTANSİYEL MÜŞTERİLER'},
    '7 days · full access':{fr:'7 jours · accès complet',en:'7 days · full access',es:'7 días · acceso completo',pt:'7 dias · acesso completo',de:'7 Tage · voller Zugriff',it:'7 giorni · accesso completo',sw:'Siku 7 · ufikiaji kamili',ln:'Mikolo 7 · bokɔti mobimba',ar:'7 أيام · وصول كامل',zh:'7 天 · 完整访问',hi:'7 दिन · पूर्ण पहुँच',tr:'7 gün · tam erişim'}
  };
  const saved=new WeakMap(); let lang='en';
  function getLang(){const l=window.NexoraI18n?.getLanguage?.();if(l&&MAP['Dashboard']?.[l])return l;try{const s=JSON.parse(localStorage.getItem('nexoraSettings')||'{}');return s.language||'en'}catch{return'en'}}
  function run(){lang=getLang();document.querySelectorAll('body *').forEach(el=>{if(['SCRIPT','STYLE','OPTION'].includes(el.tagName)||el.childElementCount)return;const original=saved.has(el)?saved.get(el):el.textContent;if(!saved.has(el))saved.set(el,original);const key=String(original||'').replace(/\s+/g,' ').trim();if(MAP[key])el.textContent=MAP[key][lang]||MAP[key].en});}
  const observer=new MutationObserver(run);observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  window.addEventListener('nexora-language-changed',run);window.addEventListener('load',run);setTimeout(run,300);
})();
