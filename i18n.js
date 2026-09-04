(() => {
  const LANGS = {
    fr: {label:'Français',dir:'ltr'}, en:{label:'English',dir:'ltr'}, es:{label:'Español',dir:'ltr'}, pt:{label:'Português',dir:'ltr'}, de:{label:'Deutsch',dir:'ltr'}, it:{label:'Italiano',dir:'ltr'}, sw:{label:'Kiswahili',dir:'ltr'}, ln:{label:'Lingála',dir:'ltr'}, ar:{label:'العربية',dir:'rtl'}, zh:{label:'中文',dir:'ltr'}, hi:{label:'हिन्दी',dir:'ltr'}, tr:{label:'Türkçe',dir:'ltr'}
  };

  const T = {
    'Dashboard': {fr:'Dashboard',en:'Dashboard',es:'Panel',pt:'Painel',de:'Dashboard',it:'Dashboard',sw:'Dashibodi',ln:'Tableau ya boyangeli',ar:'لوحة التحكم',zh:'仪表板',hi:'डैशबोर्ड',tr:'Panel'},
    'Find': {fr:'Find',en:'Find',es:'Buscar',pt:'Encontrar',de:'Suchen',it:'Trova',sw:'Tafuta',ln:'Luka',ar:'بحث',zh:'查找',hi:'खोजें',tr:'Bul'},
    'Auto-Match': {fr:'Auto-Match',en:'Auto-Match',es:'Auto-Match',pt:'Auto-Match',de:'Auto-Match',it:'Auto-Match',sw:'Auto-Match',ln:'Auto-Match',ar:'المطابقة التلقائية',zh:'自动匹配',hi:'ऑटो-मैच',tr:'Otomatik Eşleşme'},
    'Prospects': {fr:'Prospects',en:'Prospects',es:'Prospectos',pt:'Prospectos',de:'Interessenten',it:'Prospect',sw:'Matarajio',ln:'Bato ya boluki',ar:'العملاء المحتملون',zh:'潜在客户',hi:'संभावित ग्राहक',tr:'Potansiyel müşteriler'},
    'Messages': {fr:'Messages',en:'Messages',es:'Mensajes',pt:'Mensagens',de:'Nachrichten',it:'Messaggi',sw:'Ujumbe',ln:'Bansango',ar:'الرسائل',zh:'消息',hi:'संदेश',tr:'Mesajlar'},
    'Analytics': {fr:'Analytics',en:'Analytics',es:'Analítica',pt:'Análises',de:'Analysen',it:'Analisi',sw:'Takwimu',ln:'Botali',ar:'التحليلات',zh:'数据分析',hi:'विश्लेषण',tr:'Analiz'},
    'Settings': {fr:'Paramètres',en:'Settings',es:'Configuración',pt:'Configurações',de:'Einstellungen',it:'Impostazioni',sw:'Mipangilio',ln:'Bobongisi',ar:'الإعدادات',zh:'设置',hi:'सेटिंग्स',tr:'Ayarlar'},
    'Welcome back. 👋': {fr:'Bon retour. 👋',en:'Welcome back. 👋',es:'Bienvenido de nuevo. 👋',pt:'Bem-vindo de volta. 👋',de:'Willkommen zurück. 👋',it:'Bentornato. 👋',sw:'Karibu tena. 👋',ln:'Boyei malamu lisusu. 👋',ar:'مرحبًا بعودتك. 👋',zh:'欢迎回来。👋',hi:'वापसी पर स्वागत है। 👋',tr:'Tekrar hoş geldin. 👋'},
    'Find your next client.': {fr:'Trouvez votre prochain client.',en:'Find your next client.',es:'Encuentra tu próximo cliente.',pt:'Encontre seu próximo cliente.',de:'Finden Sie Ihren nächsten Kunden.',it:'Trova il tuo prossimo cliente.',sw:'Pata mteja wako anayefuata.',ln:'Luka client na yo oyo elandi.',ar:'اعثر على عميلك التالي.',zh:'寻找你的下一个客户。',hi:'अपना अगला ग्राहक खोजें।',tr:'Bir sonraki müşterinizi bulun.'},
    'Auto-Match': {fr:'Auto-Match',en:'Auto-Match',es:'Auto-Match',pt:'Auto-Match',de:'Auto-Match',it:'Auto-Match',sw:'Auto-Match',ln:'Auto-Match',ar:'المطابقة التلقائية',zh:'自动匹配',hi:'ऑटो-मैच',tr:'Otomatik Eşleşme'},
    'People who may need what you offer': {fr:'Les personnes qui peuvent avoir besoin de votre offre',en:'People who may need what you offer',es:'Personas que pueden necesitar lo que ofreces',pt:'Pessoas que podem precisar do que você oferece',de:'Menschen, die Ihr Angebot benötigen könnten',it:'Persone che potrebbero aver bisogno di ciò che offri',sw:'Watu ambao wanaweza kuhitaji unachotoa',ln:'Bato oyo bakoki kozala na bosenga ya likabo na yo',ar:'أشخاص قد يحتاجون إلى ما تقدمه',zh:'可能需要你所提供服务的人',hi:'जिन लोगों को आपकी सेवा की जरूरत हो सकती है',tr:'Sunduğunuz şeye ihtiyaç duyabilecek kişiler'},
    'Analytics': {fr:'ANALYTICS',en:'ANALYTICS',es:'ANALÍTICA',pt:'ANÁLISES',de:'ANALYSEN',it:'ANALISI',sw:'TAKWIMU',ln:'BOT­ALI',ar:'التحليلات',zh:'数据分析',hi:'विश्लेषण',tr:'ANALİZ'},
    'Vos revenus, votre progression.': {fr:'Vos revenus, votre progression.',en:'Your revenue, your progress.',es:'Tus ingresos, tu progreso.',pt:'Sua receita, seu progresso.',de:'Ihre Einnahmen, Ihr Fortschritt.',it:'I tuoi ricavi, i tuoi progressi.',sw:'Mapato yako, maendeleo yako.',ln:'Makoki na yo, bokoli na yo.',ar:'إيراداتك وتقدمك.',zh:'你的收入，你的增长。',hi:'आपकी आय, आपकी प्रगति।',tr:'Geliriniz ve ilerlemeniz.'},
    'Preferences': {fr:'Préférences',en:'Preferences',es:'Preferencias',pt:'Preferências',de:'Einstellungen',it:'Preferenze',sw:'Mapendeleo',ln:'Mpona na yo',ar:'التفضيلات',zh:'偏好设置',hi:'प्राथमिकताएँ',tr:'Tercihler'},
    'What do you offer?': {fr:'Que proposez-vous ?',en:'What do you offer?',es:'¿Qué ofreces?',pt:'O que você oferece?',de:'Was bieten Sie an?',it:'Cosa offri?',sw:'Unatoa nini?',ln:'Okoki kopesa nini?',ar:'ماذا تقدم؟',zh:'你提供什么？',hi:'आप क्या पेश करते हैं?',tr:'Ne sunuyorsunuz?'},
    'Find Clients': {fr:'Trouver des clients',en:'Find Clients',es:'Encontrar clientes',pt:'Encontrar clientes',de:'Kunden finden',it:'Trova clienti',sw:'Tafuta wateja',ln:'Luka ba client',ar:'العثور على العملاء',zh:'查找客户',hi:'ग्राहक खोजें',tr:'Müşteri Bul'},
    'New Search': {fr:'Nouvelle recherche',en:'New Search',es:'Nueva búsqueda',pt:'Nova pesquisa',de:'Neue Suche',it:'Nuova ricerca',sw:'Utafutaji mpya',ln:'Boluki ya sika',ar:'بحث جديد',zh:'新搜索',hi:'नई खोज',tr:'Yeni Arama'},
    'Your profile': {fr:'Votre profil',en:'Your profile',es:'Tu perfil',pt:'Seu perfil',de:'Ihr Profil',it:'Il tuo profilo',sw:'Wasifu wako',ln:'Profil na yo',ar:'ملفك الشخصي',zh:'你的个人资料',hi:'आपकी प्रोफ़ाइल',tr:'Profiliniz'},
    'Profile strength': {fr:'Force du profil',en:'Profile strength',es:'Fortaleza del perfil',pt:'Força do perfil',de:'Profilstärke',it:'Completezza del profilo',sw:'Nguvu ya wasifu',ln:'Makasi ya profil',ar:'قوة الملف الشخصي',zh:'资料完整度',hi:'प्रोफ़ाइल शक्ति',tr:'Profil gücü'},
    'Profile complete': {fr:'Profil complet',en:'Profile complete',es:'Perfil completo',pt:'Perfil completo',de:'Profil vollständig',it:'Profilo completo',sw:'Wasifu umekamilika',ln:'Profil esili',ar:'الملف مكتمل',zh:'资料完整',hi:'प्रोफ़ाइल पूर्ण',tr:'Profil tamamlandı'},
    'Scanning continuously': {fr:'Recherche continue',en:'Scanning continuously',es:'Búsqueda continua',pt:'Busca contínua',de:'Laufende Suche',it:'Ricerca continua',sw:'Inatafuta kila wakati',ln:'Boluki ezalaka ntango nyonso',ar:'البحث مستمر',zh:'持续扫描',hi:'लगातार खोज जारी',tr:'Sürekli tarama'},
    'No prospects yet': {fr:'Aucun prospect pour le moment',en:'No prospects yet',es:'Aún no hay prospectos',pt:'Nenhum prospecto ainda',de:'Noch keine Interessenten',it:'Nessun prospect ancora',sw:'Bado hakuna matarajio',ln:'Nzela ya prospect ezali naino te',ar:'لا توجد عملاء محتملون بعد',zh:'暂时没有潜在客户',hi:'अभी कोई संभावित ग्राहक नहीं',tr:'Henüz potansiyel müşteri yok'},
    'Latest matches': {fr:'Dernières correspondances',en:'Latest matches',es:'Últimas coincidencias',pt:'Correspondências recentes',de:'Neueste Treffer',it:'Ultime corrispondenze',sw:'Mechi za hivi karibuni',ln:'Ba match ya sika',ar:'أحدث المطابقات',zh:'最新匹配',hi:'नवीनतम मिलान',tr:'Son eşleşmeler'},
    'Notifications': {fr:'Notifications',en:'Notifications',es:'Notificaciones',pt:'Notificações',de:'Benachrichtigungen',it:'Notifiche',sw:'Arifa',ln:'Mayebisi',ar:'الإشعارات',zh:'通知',hi:'सूचनाएँ',tr:'Bildirimler'},
    'Mark all read': {fr:'Tout marquer comme lu',en:'Mark all read',es:'Marcar todo como leído',pt:'Marcar tudo como lido',de:'Alle als gelesen markieren',it:'Segna tutto come letto',sw:'Weka zote zimesomwa',ln:'Tanga nyonso',ar:'وضع علامة مقروء على الكل',zh:'全部标为已读',hi:'सभी को पढ़ा हुआ चिह्नित करें',tr:'Tümünü okundu işaretle'},
    'Edit': {fr:'Modifier',en:'Edit',es:'Editar',pt:'Editar',de:'Bearbeiten',it:'Modifica',sw:'Hariri',ln:'Bongisa',ar:'تعديل',zh:'编辑',hi:'संपादित करें',tr:'Düzenle'},
    'View all →': {fr:'Voir tout →',en:'View all →',es:'Ver todo →',pt:'Ver tudo →',de:'Alle anzeigen →',it:'Vedi tutto →',sw:'Tazama yote →',ln:'Tala nyonso →',ar:'عرض الكل →',zh:'查看全部 →',hi:'सभी देखें →',tr:'Tümünü gör →'},
    'Modifier mon activité et mon profil': {fr:'Modifier mon activité et mon profil',en:'Edit my activity and profile',es:'Editar mi actividad y mi perfil',pt:'Editar minha atividade e perfil',de:'Aktivität und Profil bearbeiten',it:'Modifica attività e profilo',sw:'Hariri shughuli na wasifu wangu',ln:'Bongisa mosala mpe profil na ngai',ar:'تعديل نشاطي وملفي الشخصي',zh:'修改我的业务和个人资料',hi:'मेरी गतिविधि और प्रोफ़ाइल संपादित करें',tr:'Faaliyetimi ve profilimi düzenle'},
    'Exporter mes données': {fr:'Exporter mes données',en:'Export my data',es:'Exportar mis datos',pt:'Exportar meus dados',de:'Meine Daten exportieren',it:'Esporta i miei dati',sw:'Hamisha data zangu',ln:'Bimisa ba données na ngai',ar:'تصدير بياناتي',zh:'导出我的数据',hi:'मेरा डेटा निर्यात करें',tr:'Verilerimi dışa aktar'},
    'Se déconnecter': {fr:'Se déconnecter',en:'Sign out',es:'Cerrar sesión',pt:'Sair',de:'Abmelden',it:'Esci',sw:'Toka',ln:'Bima',ar:'تسجيل الخروج',zh:'退出登录',hi:'साइन आउट',tr:'Çıkış yap'},
    'Mode clair / sombre': {fr:'Mode clair / sombre',en:'Light / dark mode',es:'Modo claro / oscuro',pt:'Modo claro / escuro',de:'Hell- / Dunkelmodus',it:'Modalità chiara / scura',sw:'Hali nyepesi / giza',ln:'Mode polele / molili',ar:'الوضع الفاتح / الداكن',zh:'浅色 / 深色模式',hi:'लाइट / डार्क मोड',tr:'Açık / koyu mod'},
    'Gérer mon abonnement': {fr:'Gérer mon abonnement',en:'Manage my subscription',es:'Gestionar mi suscripción',pt:'Gerir minha assinatura',de:'Mein Abo verwalten',it:'Gestisci abbonamento',sw:'Dhibiti usajili wangu',ln:'Tala abonnemente na ngai',ar:'إدارة اشتراكي',zh:'管理我的订阅',hi:'मेरी सदस्यता प्रबंधित करें',tr:'Aboneliğimi yönet'},
    'Notifications Nexora': {fr:'Notifications Nexora',en:'Nexora notifications',es:'Notificaciones de Nexora',pt:'Notificações Nexora',de:'Nexora-Benachrichtigungen',it:'Notifiche Nexora',sw:'Arifa za Nexora',ln:'Mayebisi ya Nexora',ar:'إشعارات Nexora',zh:'Nexora 通知',hi:'Nexora सूचनाएँ',tr:'Nexora bildirimleri'},
    'Recherche automatique active': {fr:'Recherche automatique active',en:'Automatic search active',es:'Búsqueda automática activa',pt:'Busca automática ativa',de:'Automatische Suche aktiv',it:'Ricerca automatica attiva',sw:'Utafutaji wa kiotomatiki umewashwa',ln:'Boluki ya automatique ezali kosala',ar:'البحث التلقائي نشط',zh:'自动搜索已启用',hi:'स्वचालित खोज सक्रिय',tr:'Otomatik arama aktif'},
    'Recherche automatique arrêtée': {fr:'Recherche automatique arrêtée',en:'Automatic search paused',es:'Búsqueda automática pausada',pt:'Busca automática pausada',de:'Automatische Suche pausiert',it:'Ricerca automatica in pausa',sw:'Utafutaji wa kiotomatiki umesitishwa',ln:'Boluki ya automatique etelemi',ar:'تم إيقاف البحث التلقائي',zh:'自动搜索已暂停',hi:'स्वचालित खोज रुकी हुई',tr:'Otomatik arama duraklatıldı'},
    'Le système de paiement sera connecté à l’étape SaaS.': {fr:'Le système de paiement sera connecté à l’étape SaaS.',en:'The payment system will be connected in the SaaS stage.',es:'El sistema de pago se conectará en la etapa SaaS.',pt:'O sistema de pagamento será conectado na etapa SaaS.',de:'Das Zahlungssystem wird in der SaaS-Phase verbunden.',it:'Il sistema di pagamento verrà collegato nella fase SaaS.',sw:'Mfumo wa malipo utaunganishwa katika hatua ya SaaS.',ln:'Système ya kofuta ekokangisama na étape SaaS.',ar:'سيتم ربط نظام الدفع في مرحلة SaaS.',zh:'支付系统将在 SaaS 阶段接入。',hi:'भुगतान प्रणाली SaaS चरण में जोड़ी जाएगी।',tr:'Ödeme sistemi SaaS aşamasında bağlanacak.'},
    '7 jours · accès complet': {fr:'7 jours · accès complet',en:'7 days · full access',es:'7 días · acceso completo',pt:'7 dias · acesso completo',de:'7 Tage · voller Zugriff',it:'7 giorni · accesso completo',sw:'Siku 7 · ufikiaji kamili',ln:'Mikolo 7 · bokɔti mobimba',ar:'7 أيام · وصول كامل',zh:'7 天 · 完整访问',hi:'7 दिन · पूर्ण पहुँच',tr:'7 gün · tam erişim'},
    'Free Trial': {fr:'Essai gratuit',en:'Free Trial',es:'Prueba gratuita',pt:'Teste grátis',de:'Kostenlose Testversion',it:'Prova gratuita',sw:'Majaribio ya bure',ln:'Momekano ya ofele',ar:'تجربة مجانية',zh:'免费试用',hi:'निःशुल्क परीक्षण',tr:'Ücretsiz Deneme'},
    'Your account': {fr:'Votre compte',en:'Your account',es:'Tu cuenta',pt:'Sua conta',de:'Ihr Konto',it:'Il tuo account',sw:'Akaunti yako',ln:'Compte na yo',ar:'حسابك',zh:'你的账户',hi:'आपका खाता',tr:'Hesabınız'},
    'Professional': {fr:'Professionnel',en:'Professional',es:'Profesional',pt:'Profissional',de:'Profi',it:'Professionista',sw:'Mtaalamu',ln:'Professionnel',ar:'محترف',zh:'专业人士',hi:'पेशेवर',tr:'Profesyonel'}
  };

  const originals = new Map();
  const normalize = s => String(s||'').replace(/\s+/g,' ').trim();
  let lang = 'en';
  let busy = false;

  function detect(){
    const saved = localStorage.getItem('nexoraSettings');
    try { const s=JSON.parse(saved||'{}'); if(s.language && (s.language==='auto'||LANGS[s.language])) return s.language; } catch {}
    const nav=(navigator.language||'en').toLowerCase();
    const code=nav.split('-')[0];
    return LANGS[code] ? code : 'en';
  }

  function translateString(value){
    const clean=normalize(value);
    for(const [key,dict] of Object.entries(T)){
      if(clean===key) return dict[lang]||dict.en||value;
      if(key==='Find Clients' && /^⌕\s*Find Clients$/i.test(clean)) return '⌕ '+(dict[lang]||dict.en);
    }
    if(clean.startsWith('Bonjour ') && clean.endsWith('.')){
      const name=clean.slice(8,-1);
      const lead={en:'Welcome back, ',fr:'Bon retour, ',es:'Bienvenido de nuevo, ',pt:'Bem-vindo de volta, ',de:'Willkommen zurück, ',it:'Bentornato, ',sw:'Karibu tena, ',ln:'Boyei malamu lisusu, ',ar:'مرحبًا بعودتك، ',zh:'欢迎回来，',hi:'वापसी पर स्वागत है, ',tr:'Tekrar hoş geldin, '}[lang]||'Welcome back, ';
      return lead+name+'.';
    }
    return value;
  }

  function translateElement(el){
    if(!el || el.children.length) return;
    const text=el.textContent;
    if(!text || !normalize(text)) return;
    if(!originals.has(el)) originals.set(el,text);
    const original=originals.get(el);
    const translated=translateString(original);
    if(translated!==el.textContent) el.textContent=translated;
  }

  function translateTree(){
    if(busy) return;
    busy=true;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT);
    const els=[];while(walker.nextNode()) els.push(walker.currentNode);
    els.forEach(el=>{if(['SCRIPT','STYLE','SELECT','OPTION'].includes(el.tagName))return; if(el.childElementCount===0) translateElement(el);});
    document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{if(!originals.has(el))originals.set(el,el.getAttribute('placeholder'));const tr=translateString(originals.get(el));if(tr!==originals.get(el))el.setAttribute('placeholder',tr)});
    document.querySelectorAll('select option').forEach(opt=>{if(!originals.has(opt))originals.set(opt,opt.textContent);const tr=translateString(originals.get(opt));opt.textContent=tr;});
    document.documentElement.lang=lang;
    document.documentElement.dir=LANGS[lang]?.dir||'ltr';
    document.body.classList.toggle('nx-rtl',LANGS[lang]?.dir==='rtl');
    busy=false;
  }

  function setLanguage(next){
    if(!LANGS[next]) next='en';
    lang=next;
    try{const s=JSON.parse(localStorage.getItem('nexoraSettings')||'{}');localStorage.setItem('nexoraSettings',JSON.stringify({...s,language:next}))}catch{localStorage.setItem('nexoraSettings',JSON.stringify({language:next}))}
    translateTree();
    window.dispatchEvent(new CustomEvent('nexora-language-changed',{detail:{language:lang}}));
  }

  function setup(){
    lang=detect();
    translateTree();
    const observer=new MutationObserver(()=>translateTree());
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    window.NexoraI18n={languages:LANGS,setLanguage,getLanguage:()=>lang,translateTree};
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup); else setup();
})();
