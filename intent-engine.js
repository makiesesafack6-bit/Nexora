(function(){
  const KEY='nexoraIntentProfile';
  const EVENTS='nexoraBehaviorEvents';
  const normalize=s=>(s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const readJson=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}};
  const writeJson=(key,value)=>localStorage.setItem(key,JSON.stringify(value));

  const answerWeights={role:1.0,level:0.9,skills:1.0,sector:0.9,service:1.15,zone:0.55,clients:0.85,goal:1.15,availability:0.45};
  const meaningfulActions=new Set(['search','open_prospect','copy_message','open_profile','save_prospect','open_auto_match']);

  function getQuiz(){
    const q=readJson('nexoraProfile',{});
    return q&&typeof q==='object'?q:{};
  }

  function getBehavior(){
    const events=readJson(EVENTS,[]);
    return Array.isArray(events)?events:[];
  }

  function buildProfile(){
    const quiz=getQuiz();
    const behavior=getBehavior();
    const actionCounts={};
    const topics={};
    for(const e of behavior){
      actionCounts[e.type]=(actionCounts[e.type]||0)+1;
      for(const topic of (e.topics||[])) topics[topic]=(topics[topic]||0)+1;
    }
    const behaviorTopics=Object.entries(topics).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([topic])=>topic);
    return {
      explicit:{...quiz},
      behavior:{actionCounts,topics:behaviorTopics},
      priorities:{
        role: quiz.role||null,
        level: quiz.level||null,
        skills: quiz.skills||null,
        sector: quiz.sector||null,
        service: quiz.service||null,
        zone: quiz.zone||null,
        clients: quiz.clients||null,
        goal: quiz.goal||null,
        availability: quiz.availability||null
      },
      weights:{...answerWeights},
      generatedAt:new Date().toISOString()
    };
  }

  function refresh(){const p=buildProfile();writeJson(KEY,p);return p;}

  function trackAction(type,payload={}){
    if(!meaningfulActions.has(type)) return refresh();
    const events=getBehavior();
    const next={
      type,
      at:new Date().toISOString(),
      query:payload.query||'',
      prospectId:payload.prospectId||null,
      topics:(payload.topics||[]).map(normalize).filter(Boolean).slice(0,12)
    };
    events.push(next);
    while(events.length>100) events.shift();
    writeJson(EVENTS,events);
    return refresh();
  }

  function topicTerms(){
    const p=refresh();
    const terms=[];
    const add=v=>{
      if(Array.isArray(v)) v.forEach(add); else if(v) terms.push(normalize(v));
    };
    add(Object.values(p.explicit));
    add(p.behavior.topics);
    return [...new Set(terms.flatMap(x=>x.split(/[^a-z0-9]+/).filter(t=>t.length>2)))];
  }

  function explain(){
    const p=refresh();
    const e=p.explicit;
    const strong=[];
    if(e.role) strong.push('métier');
    if(e.skills) strong.push('compétences');
    if(e.service) strong.push('service');
    if(e.goal) strong.push('objectif');
    if(e.sector) strong.push('secteur');
    if(e.clients) strong.push('type de client');
    return `Profil d’intention basé sur ${strong.length} signaux explicites${p.behavior.topics.length?' et les comportements pertinents':''}.`;
  }

  window.NexoraIntent={
    refresh,
    get:()=>readJson(KEY,buildProfile()),
    getQuiz,
    getBehavior,
    trackAction,
    topicTerms,
    explain,
    normalize
  };

  refresh();
})();
