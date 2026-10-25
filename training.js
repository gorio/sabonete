/* Trilha de videoaulas: plano editorial e player preparado.
 * Para publicar uma aula, preencha youtubeId com o ID real de 11 caracteres.
 * Nao simular video, certificado, duracao publicada ou visualizacao.
 */
(() => {
  'use strict';
  const modules = [
    {
      title:'Começando com segurança', subtitle:'Entenda os materiais e os limites das bases prontas.',
      lessons:[
        {id:'a01',title:'Boas-vindas e visão geral',minutes:7,
          goal:'Conhecer o processo de sabonetes com base glicerinada vegetal pronta e como usar esta plataforma.',
          topics:['O que é uma base pronta para derreter e moldar','Diferença entre base pronta e saponificação do zero','Etapas do planejamento até a produção'], 
          task:'Anote o tipo e o fabricante da sua base e descreva o primeiro sabonete que quer produzir.',tool:'receita'},
        {id:'a02',title:'Organização, higiene e equipamentos',minutes:10,
          goal:'Organizar um espaço de trabalho limpo e controlar o aquecimento sem improvisos.',
          topics:['Utensílios dedicados e medição de peso e volume','Higiene de bancada, recipientes e moldes','Cuidados com calor, respingos e armazenamento'], 
          task:'Monte uma lista de utensílios e um checklist de preparação antes de iniciar.',tool:'temperaturas'},
        {id:'a03',title:'Lendo fichas técnicas',minutes:12,
          goal:'Identificar as instruções e os limites informados por cada fabricante.',
          topics:['Ficha da base: aquecimento e carga máxima de aditivos','Ficha da fragrância e limite aplicável IFRA categoria 9','Tipo e concentração do tensoativo; incompatibilidades'], 
          task:'Separe as fichas técnicas de sua base, fragrância, extrato e tensoativo. Liste o que ainda falta confirmar.',tool:'temperaturas'}
      ]
    },
    {
      title:'Receitas e cálculos', subtitle:'Aprenda a transformar quantidades em uma receita reproduzível.',
      lessons:[
        {id:'a04',title:'Gramas, mililitros e densidade',minutes:10,
          goal:'Compreender por que gramas e mililitros não são intercambiáveis.',
          topics:['Peso (g e kg) e volume (mL e L)','Como a densidade relaciona massa e volume','Por que a estimativa de 1 g/mL deve ser identificada'], 
          task:'Compare a quantidade de base em gramas com o volume de um ingrediente em mL. Confira a densidade na ficha técnica.',tool:'receita'},
        {id:'a05',title:'Calculando o tamanho do lote',minutes:12,
          goal:'Usar a calculadora nos modos quantidade de base e peso final estimado.',
          topics:['Quantidade de base como ponto de partida','Cálculo inverso e peso final apenas estimado','Exemplo didático da proporção 8/7/10 informada pelo usuário — não é receita validada'], 
          task:'Faça dois cálculos na ferramenta e registre as quantidades; compare com o resultado real quando tiver um lote testado.',tool:'receita'},
        {id:'a06',title:'Essências, extratos e tensoativos',minutes:12,
          goal:'Planejar aditivos sem confundir a proporção do cálculo com uma dosagem segura.',
          topics:['Diferenças entre fragrância, extrato, lauril e corantes','Verificação de compatibilidade com a base','Como consultar limites técnicos antes de fabricar'], 
          task:'Revise a lista de ingredientes escolhidos e marque quais já têm limite confirmado pelo fabricante.',tool:'ingredientes'}
      ]
    },
    {
      title:'Da bancada à forma', subtitle:'Temperatura, cor, moldagem e registro do lote.',
      lessons:[
        {id:'a07',title:'Derretimento e temperaturas',minutes:11,
          goal:'Usar termômetro e obedecer as recomendações específicas da base.',
          topics:['Aquecimento gradual sem ferver','Temperatura de adição informada pelo fornecedor','Despejo e resfriamento conforme o produto'], 
          task:'Abra o guia de temperaturas e compare com a orientação da sua base; não generalize valores entre marcas.',tool:'temperaturas'},
        {id:'a08',title:'Mistura de cores e testes',minutes:10,
          goal:'Preparar testes pequenos de cor sem assumir resultados exatos.',
          topics:['Corantes adequados para cosméticos de enxágue','Diferenças visuais entre bases branca e transparente','Como registrar uma mistura experimental'], 
          task:'Escolha uma combinação no misturador, anote a proporção e planeje um teste pequeno dentro do limite do corante.',tool:'cores'},
        {id:'a09',title:'Moldes, rendimento e registro',minutes:10,
          goal:'Conferir o rendimento real em unidades, perdas e peso por peça.',
          topics:['Capacidade das cavidades e produção por lote','Rendimento real versus peso teórico','Registro de data, materiais, observações e eventuais perdas'], 
          task:'Simule um lote na receita e registre quantas unidades sua forma produz; depois compare com a produção real.',tool:'venda'}
      ]
    },
    {
      title:'Custos e preço de venda', subtitle:'Saiba quanto custa cada peça antes de definir um preço.',
      lessons:[
        {id:'a10',title:'Cadastrando matérias-primas',minutes:10,
          goal:'Transformar preço da embalagem em custo da quantidade utilizada.',
          topics:['Quantidade comprada em g, kg, mL ou L','Custo proporcional do ingrediente no lote','Cadastro de produtos adicionais e dados pendentes'], 
          task:'Cadastre os ingredientes de uma receita real com preço e tamanho de embalagem completos.',tool:'ingredientes'},
        {id:'a11',title:'Preço por sabonete e margem',minutes:12,
          goal:'Diferenciar custo unitário, acréscimo sobre custo e margem sobre vendas.',
          topics:['Custo do lote dividido pelo rendimento real','Exemplo de 150% de acréscimo = custo × 2,5','Despesas não detalhadas e diferença para lucro líquido'], 
          task:'Simule dois percentuais de acréscimo e compare o preço por unidade e o valor de venda de todo o lote.',tool:'venda'}
      ]
    },
    {
      title:'Qualidade e projeto final', subtitle:'Consolide a produção e organize a documentação.',
      lessons:[
        {id:'a12',title:'Qualidade, identificação e cuidados de venda',minutes:12,
          goal:'Criar um checklist de qualidade e reconhecer quando buscar orientação técnica e regulatória.',
          topics:['Aspecto, consistência e registro de alterações','Rastreabilidade de lotes e fornecedores','Rotulagem e requisitos sanitários aplicáveis: verificar antes da venda'], 
          task:'Prepare uma ficha com lote, data, produtos utilizados, informações de fornecedores e pontos a verificar.',tool:'temperaturas'},
        {id:'a13',title:'Projeto final: da receita ao preço',minutes:15,
          goal:'Concluir uma simulação completa com receita, custos e precificação.',
          topics:['Selecionar ingredientes e conferir dados técnicos','Calcular um lote e registrar seu rendimento','Cadastrar custos e obter preço de venda por peça'], 
          task:'Faça a simulação de um lote, gere sua lista de insumos e anote custo por unidade, preço sugerido e questões técnicas pendentes.',tool:'venda'}
      ]
    }
  ];
  const flatten = modules.flatMap((module,mi)=>module.lessons.map((lesson,li)=>({...lesson,moduleIndex:mi,lessonIndex:li,moduleTitle:module.title})));
  const $ = id => document.getElementById(id);
  if(!$('courseLessons')||!$('courseLessonTitle')||!$('courseVideo'))return;
  const key='sabonete-treinamento-v1';
  const validIds = new Set(flatten.map(l=>l.id));
  let done=new Set();
  let active=flatten[0].id;
  try{
    const data=JSON.parse(localStorage.getItem(key)||'null');
    if(data&&Array.isArray(data.completed)){
      done=new Set(data.completed.filter(id=>validIds.has(id)));
    }
    if(data&&validIds.has(data.selected))active=data.selected;
  }catch(_){}
  const el=(tag,cls,text)=>{
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  const totalMinutes=flatten.reduce((s,l)=>s+l.minutes,0);
  $('courseCount').textContent=flatten.length+' aulas planejadas';
  $('courseDuration').textContent='~'+Math.round(totalMinutes/5)*5+' min de conteúdo previsto';
  const list=$('courseLessons');

  function save(){
    try{localStorage.setItem(key,JSON.stringify({completed:[...done],selected:active}))}catch(_){}
  }
  function updateProgress(){
    const n=done.size,total=flatten.length;
    $('courseProgress').value=n;
    $('courseProgress').max=total;
    $('courseProgressText').textContent=n+' de '+total+' atividades marcadas';
    $('courseProgressPercent').textContent=Math.round(n/total*100)+'%';
  }
  function makeList(){
    list.replaceChildren();
    modules.forEach((m,mi)=>{
      const wrapper=el('section','course-module');
      const title=el('h3','course-module-title',(mi+1)+'. '+m.title);
      const desc=el('p','course-module-desc',m.subtitle);
      wrapper.append(title,desc);
      const group=el('div','course-module-items');
      m.lessons.forEach((lesson,li)=>{
        const b=el('button','course-lesson-button');
        b.type='button';
        b.dataset.lessonId=lesson.id;
        const number=el('span','course-lesson-number',String(flatten.findIndex(l=>l.id===lesson.id)+1).padStart(2,'0'));
        const text=el('span','course-lesson-button-text');
        text.append(el('strong','',lesson.title),el('small','','~'+lesson.minutes+' min previstos'));
        const completed=el('span','course-lesson-check',done.has(lesson.id)?'✓':'○');
        completed.setAttribute('aria-hidden','true');
        b.append(number,text,completed);
        b.setAttribute('aria-pressed',String(lesson.id===active));
        b.addEventListener('click',()=>show(lesson.id,true));
        group.append(b);
      });
      wrapper.append(group);
      list.append(wrapper);
    });
  }
  function drawTopics(items){
    const list=$('courseLessonTopics');
    list.replaceChildren();
    items.forEach(t=>list.append(el('li','',t)));
  }
  function drawVideo(lesson){
    const video=$('courseVideo');
    video.replaceChildren();
    // Somente vídeos reais inseridos pelo editor do site são publicados.
    if(typeof lesson.youtubeId==='string'&&/^[A-Za-z0-9_-]{11}$/.test(lesson.youtubeId)){
      const iframe=document.createElement('iframe');
      iframe.src='https://www.youtube-nocookie.com/embed/'+lesson.youtubeId;
      iframe.title='Vídeo-aula: '+lesson.title;
      iframe.loading='lazy';
      iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen=true;
      iframe.referrerPolicy='strict-origin-when-cross-origin';
      video.append(iframe);
      $('courseVideoState').textContent='Vídeo-aula disponível';
    } else {
      const placeholder=el('div','course-video-placeholder');
      placeholder.append(el('span','course-play-icon','▶'),
        el('strong','','Vídeo-aula em preparação'),
        el('span','','O roteiro e a atividade já estão disponíveis. O vídeo será exibido aqui quando for publicado.'));
      video.append(placeholder);
      $('courseVideoState').textContent='Vídeo ainda não publicado';
    }
  }
  function show(id,scroll){
    const selected=flatten.find(l=>l.id===id);
    if(!selected)return;
    active=id;
    const position=flatten.indexOf(selected);
    $('courseLessonNumber').textContent='Módulo '+(selected.moduleIndex+1)+' · Aula '+(position+1)+' de '+flatten.length;
    $('courseLessonTitle').textContent=selected.title;
    $('courseLessonGoal').textContent=selected.goal;
    $('courseLessonTask').textContent=selected.task;
    $('courseLessonDuration').textContent='Duração planejada: '+selected.minutes+' min';
    drawTopics(selected.topics);
    drawVideo(selected);
    $('courseToolLink').href='#'+selected.tool;
    const tools={receita:'Abrir calculadora de receita',ingredientes:'Abrir matérias-primas',
      venda:'Abrir preço de venda',cores:'Abrir misturador de cores',temperaturas:'Abrir temperaturas'};
    $('courseToolLink').textContent=tools[selected.tool]||'Abrir ferramenta';
    $('courseComplete').setAttribute('aria-pressed',String(done.has(id)));
    $('courseComplete').textContent=done.has(id)?'✓ Atividade marcada como concluída':'Marcar atividade como concluída';
    $('coursePrev').disabled=position===0;
    $('courseNext').disabled=position===flatten.length-1;
    for(const button of list.querySelectorAll('[data-lesson-id]')){
      const chosen=button.dataset.lessonId===id;
      button.setAttribute('aria-pressed',String(chosen));
      button.querySelector('.course-lesson-check').textContent=done.has(button.dataset.lessonId)?'✓':'○';
    }
    save();
    if(scroll){
      // Keep selection and player visible after choosing a lesson on mobile.
      $('courseLessonDetails').scrollIntoView({block:'start',behavior:'smooth'});
    }
  }
  $('courseComplete').addEventListener('click',()=>{
    if(done.has(active))done.delete(active); else done.add(active);
    updateProgress();
    show(active,false);
  });
  $('coursePrev').addEventListener('click',()=>{const i=flatten.findIndex(l=>l.id===active);if(i>0)show(flatten[i-1].id,true)});
  $('courseNext').addEventListener('click',()=>{const i=flatten.findIndex(l=>l.id===active);if(i>=0&&i<flatten.length-1)show(flatten[i+1].id,true)});
  makeList();updateProgress();show(active,false);
})();