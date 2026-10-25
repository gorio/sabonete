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

  const advancedModules=[
    {title:'Organização e rastreabilidade',subtitle:'Controle lotes, perdas e matérias-primas.',lessons:[
      {id:'a14',title:'Planejamento de produção e capacidade',minutes:12,
        goal:'Organizar volumes de produção, moldes, tempo e rendimento sem depender de estimativas soltas.',
        topics:['Capacidade de formas e planejamento de lotes','Rendimento real versus previsto','Checklist de separação e produção'],
        task:'Monte um planejamento de três lotes com insumos e rendimentos esperados.',tool:'receita'},
      {id:'a15',title:'Estoque e rastreabilidade de insumos',minutes:13,
        goal:'Criar um método simples para registrar entradas, consumo e origem dos insumos.',
        topics:['Identificação do fornecedor, lote e validade quando aplicável','Entradas, saídas e conferências','Separação de produtos pendentes de avaliação'],
        task:'Monte uma planilha ou ficha de rastreabilidade para uma produção real.',tool:'ingredientes'}
    ]},
    {title:'Portfólio, encomendas e operação',subtitle:'Estruture preços e fluxo de trabalho para vender com consistência.',lessons:[
      {id:'a16',title:'Preço para kits, encomendas e atacado',minutes:14,
        goal:'Comparar cenários comerciais e entender o efeito de descontos na margem de contribuição.',
        topics:['Composição de kits e consumo real','Desconto versus preço mínimo e custos indiretos','Diferença entre markup, margem bruta e lucro líquido'],
        task:'Compare preço unitário com um kit e uma encomenda, sem vender abaixo dos custos conhecidos.',tool:'venda'},
      {id:'a17',title:'Controle de pedidos, produção e entregas',minutes:12,
        goal:'Desenhar um processo de pedidos com registro de quantidade, prazo e revisão de estoque.',
        topics:['Pedido confirmado e programação de lote','Registro de perdas, retrabalho e entregas','Como documentar ajustes entre previsão e resultado'],
        task:'Crie um fluxo simples do pedido à entrega para um lote de sabonetes.',tool:'venda'},
      {id:'a18',title:'Plano de operação e evolução do negócio',minutes:15,
        goal:'Consolidar um processo de produção repetível e um plano para aprimorar custos e qualidade.',
        topics:['Indicadores de custo, rendimento e desperdício','Rotina de revisão de fornecedores e fichas técnicas','Planejamento de melhorias e questões regulatórias pendentes'],
        task:'Escreva um plano de 30 dias com metas de produção, revisão de custos e documentação.',tool:'venda'}
    ]}
  ];
  const tracks=[
    {id:'basico',name:'Básico',tagline:'Comece com confiança',
      outcome:'Domine as etapas essenciais, medições e planejamento do primeiro lote.',
      modules:[
        modules[0],
        {title:'Primeiros cálculos',subtitle:'Faça contas sem confundir peso e volume.',lessons:modules[1].lessons.slice(0,2)}
      ]},
    {id:'intermediario',name:'Intermediário',tagline:'Produza com consistência',
      outcome:'Trabalhe aditivos, cores, moldes e custos com mais controle.',
      modules:[
        {title:'Ingredientes e técnicas',subtitle:'Aditivos, derretimento, cores e moldagem.',lessons:[
          modules[1].lessons[2],...modules[2].lessons
        ]},
        modules[3]
      ]},
    {id:'avancado',name:'Avançado',tagline:'Estruture o negócio artesanal',
      outcome:'Organize lotes, rastreabilidade, estoque, kits, encomendas e operação.',
      modules:[modules[4],...advancedModules]
    }
  ];
  const byTrack=Object.fromEntries(tracks.map(track=>[
    track.id,track.modules.flatMap((module,mi)=>module.lessons.map((lesson,li)=>({
      ...lesson,moduleIndex:mi,lessonIndex:li,moduleTitle:module.title,trackId:track.id
    })))
  ]));
  const allLessons=tracks.flatMap(track=>byTrack[track.id]);
  const ids=new Set(allLessons.map(l=>l.id));
  const $=id=>document.getElementById(id);
  if(!$('courseLessons')||!$('courseLessonTitle')||!$('courseVideo'))return;
  const key='sabonete-treinamento-v1';
  let completed=new Set();
  let activeTrack='basico';
  let activeLesson=byTrack.basico[0].id;
  try {
    const data=JSON.parse(localStorage.getItem(key)||'null');
    if(data && Array.isArray(data.completed))
      completed=new Set(data.completed.filter(id=>ids.has(id)));
    if(data && typeof data.selected==='string' && ids.has(data.selected)){
      activeLesson=data.selected;
      activeTrack=allLessons.find(l=>l.id===data.selected).trackId;
    }
    if(data && tracks.some(t=>t.id===data.track)){
      activeTrack=data.track;
      if(!byTrack[activeTrack].some(l=>l.id===activeLesson))
        activeLesson=byTrack[activeTrack][0].id;
    }
  }catch(_){}

  const el=(tag,cls,text)=>{
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  const list=$('courseLessons');
  const productButtons=Array.from(document.querySelectorAll('[data-track-select]'));
  const totalMinutes=allLessons.reduce((sum,l)=>sum+l.minutes,0);
  $('courseCount').textContent=allLessons.length+' aulas planejadas em 3 níveis';
  $('courseDuration').textContent='~'+Math.round(totalMinutes/5)*5+' min previstos no total';

  function save(){
    try{localStorage.setItem(key,JSON.stringify({
      completed:[...completed],selected:activeLesson,track:activeTrack
    }))}catch(_){}
  }
  function updateProgress(){
    const units=byTrack[activeTrack];
    const done=units.filter(l=>completed.has(l.id)).length;
    $('courseProgress').value=done;
    $('courseProgress').max=units.length;
    $('courseProgressText').textContent=done+' de '+units.length+' atividades marcadas neste nível';
    $('courseProgressPercent').textContent=Math.round(done/units.length*100)+'%';
  }
  function paintProducts(){
    productButtons.forEach(btn=>{
      const active=btn.dataset.trackSelect===activeTrack;
      btn.setAttribute('aria-pressed',String(active));
      btn.textContent=active?'Visualizando '+tracks.find(t=>t.id===activeTrack).name:'Ver programa';
    });
  }
  function makeList(){
    list.replaceChildren();
    const t=tracks.find(x=>x.id===activeTrack);
    $('courseSelectedName').textContent='Aulas do nível '+t.name;
    t.modules.forEach((module,mi)=>{
      const wrapper=el('section','course-module');
      wrapper.append(el('h3','course-module-title',(mi+1)+'. '+module.title));
      wrapper.append(el('p','course-module-desc',module.subtitle));
      const group=el('div','course-module-items');
      module.lessons.forEach(lesson=>{
        const index=byTrack[activeTrack].findIndex(l=>l.id===lesson.id);
        const b=el('button','course-lesson-button');
        b.type='button';
        b.dataset.lessonId=lesson.id;
        const number=el('span','course-lesson-number',String(index+1).padStart(2,'0'));
        const text=el('span','course-lesson-button-text');
        text.append(el('strong','',lesson.title),el('small','','~'+lesson.minutes+' min previstos'));
        const check=el('span','course-lesson-check',completed.has(lesson.id)?'✓':'○');
        check.setAttribute('aria-hidden','true');
        b.append(number,text,check);
        b.setAttribute('aria-pressed',String(lesson.id===activeLesson));
        b.addEventListener('click',()=>showLesson(lesson.id,true));
        group.append(b);
      });
      wrapper.append(group);
      list.append(wrapper);
    });
  }
  function drawVideo(lesson){
    const holder=$('courseVideo');
    holder.replaceChildren();
    // Public GitHub Pages does not offer protected paid video access.
    // Only videos deliberately flagged as public previews may be embedded.
    if(lesson.isPublicPreview===true &&
       typeof lesson.youtubeId==='string' && /^[A-Za-z0-9_-]{11}$/.test(lesson.youtubeId)){
      const iframe=document.createElement('iframe');
      iframe.src='https://www.youtube-nocookie.com/embed/'+lesson.youtubeId;
      iframe.title='Vídeo-aula: '+lesson.title;
      iframe.loading='lazy';
      iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen=true;
      iframe.referrerPolicy='strict-origin-when-cross-origin';
      holder.append(iframe);
      $('courseVideoState').textContent='Amostra gratuita em vídeo';
    } else {
      const placeholder=el('div','course-video-placeholder');
      placeholder.append(
        el('span','course-play-icon','▶'),
        el('strong','','Vídeo-aula em preparação'),
        el('span','','Este é o programa planejado. A aula será publicada quando o conteúdo e o acesso forem configurados.')
      );
      holder.append(placeholder);
      $('courseVideoState').textContent='Vídeo ainda não publicado';
    }
  }
  function paintUpsell(){
    const idx=tracks.findIndex(t=>t.id===activeTrack);
    const next=tracks[idx+1];
    const area=$('courseUpsell');
    area.hidden=!next;
    if(!next)return;
    $('courseUpsellTitle').textContent='Seu próximo passo: '+next.name;
    $('courseUpsellText').textContent=next.outcome+' Consulte o programa do próximo treinamento.';
    $('courseUpsellButton').textContent='Conhecer o '+next.name;
  }
  function showLesson(id,scroll){
    const lesson=byTrack[activeTrack].find(l=>l.id===id);
    if(!lesson)return;
    activeLesson=id;
    const lessons=byTrack[activeTrack],idx=lessons.findIndex(l=>l.id===id);
    const track=tracks.find(t=>t.id===activeTrack);
    $('courseLessonNumber').textContent=track.name+' · Módulo '+(lesson.moduleIndex+1)+' · Aula '+(idx+1)+' de '+lessons.length;
    $('courseLessonTitle').textContent=lesson.title;
    $('courseLessonGoal').textContent=lesson.goal;
    $('courseLessonTask').textContent=lesson.task;
    $('courseLessonDuration').textContent='Duração planejada: '+lesson.minutes+' min';
    const topics=$('courseLessonTopics');
    topics.replaceChildren(...lesson.topics.map(t=>el('li','',t)));
    drawVideo(lesson);
    $('courseToolLink').href='#'+lesson.tool;
    const tools={receita:'Abrir calculadora de receita',ingredientes:'Abrir matérias-primas',
      venda:'Abrir preço de venda',cores:'Abrir misturador de cores',temperaturas:'Abrir temperaturas'};
    $('courseToolLink').textContent=tools[lesson.tool]||'Abrir ferramenta';
    $('courseComplete').setAttribute('aria-pressed',String(completed.has(id)));
    $('courseComplete').textContent=completed.has(id)?
      '✓ Atividade marcada como concluída':'Marcar atividade como concluída';
    $('coursePrev').disabled=idx===0;
    $('courseNext').disabled=idx===lessons.length-1;
    for(const btn of list.querySelectorAll('[data-lesson-id]')){
      const selected=btn.dataset.lessonId===id;
      btn.setAttribute('aria-pressed',String(selected));
      const tick=btn.querySelector('.course-lesson-check');
      if(tick)tick.textContent=completed.has(btn.dataset.lessonId)?'✓':'○';
    }
    save();
    if(scroll)
      $('courseLessonDetails').scrollIntoView({block:'start',behavior:'smooth'});
  }
  function selectTrack(id,scroll){
    if(!byTrack[id])return;
    activeTrack=id;
    activeLesson=byTrack[id].some(l=>l.id===activeLesson)?activeLesson:byTrack[id][0].id;
    paintProducts();
    makeList();
    updateProgress();
    paintUpsell();
    showLesson(activeLesson,false);
    if(scroll)$('courseCatalog').scrollIntoView({block:'start',behavior:'smooth'});
  }
  productButtons.forEach(btn=>btn.addEventListener('click',()=>selectTrack(btn.dataset.trackSelect,true)));
  $('courseUpsellButton').addEventListener('click',()=>{
    const idx=tracks.findIndex(t=>t.id===activeTrack);
    if(tracks[idx+1])selectTrack(tracks[idx+1].id,true);
  });
  $('courseComplete').addEventListener('click',()=>{
    if(completed.has(activeLesson))completed.delete(activeLesson);
    else completed.add(activeLesson);
    updateProgress();
    showLesson(activeLesson,false);
  });
  $('coursePrev').addEventListener('click',()=>{
    const lessons=byTrack[activeTrack],idx=lessons.findIndex(l=>l.id===activeLesson);
    if(idx>0)showLesson(lessons[idx-1].id,true);
  });
  $('courseNext').addEventListener('click',()=>{
    const lessons=byTrack[activeTrack],idx=lessons.findIndex(l=>l.id===activeLesson);
    if(idx>=0&&idx<lessons.length-1)showLesson(lessons[idx+1].id,true);
  });
  selectTrack(activeTrack,false);
})();