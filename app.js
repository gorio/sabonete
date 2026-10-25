/* Navegação pública: uma ferramenta por vez, sem descarregar calculadoras ou dados. */
(() => {
  'use strict';
  const SECTIONS = {
    receita:{
      title:'Calcule sua receita',
      description:'Defina a quantidade de base vegetal ou o peso final estimado e consulte a proporção de cada ingrediente.'
    },
    ingredientes:{
      title:'Matérias-primas',
      description:'Cadastre preços de compra, tamanhos de embalagem e quantidades utilizadas. Você pode adicionar novos produtos.'
    },
    venda:{
      title:'Preço de venda',
      description:'Acompanhe o custo por sabonete, o rendimento do lote e o preço sugerido após cadastrar os ingredientes.'
    },
    cores:{
      title:'Misturador de cores',
      description:'Veja proporções de mistura de corantes adequados para sabonete, com exemplos para pequenos testes.'
    },
    temperaturas:{
      title:'Guia de temperaturas',
      description:'Consulte etapas de aquecimento, adição de ingredientes e moldagem, com referências específicas dos fabricantes.'
    },
    treinamento:{
      title:'Treinamento online',
      description:'Aprenda em módulos, acompanhe o plano das vídeo-aulas e pratique utilizando as ferramentas da calculadora.'
    }
  };
  const pages=Array.from(document.querySelectorAll('[data-screen]'));
  const links=Array.from(document.querySelectorAll('[data-screen-link]'));
  const title=document.getElementById('screenHeading');
  const subtitle=document.getElementById('screenDescription');
  if(!title || !subtitle || pages.length!==6 || links.length!==6)return;

  const selectedHash=()=>{
    let hash='';
    try {hash=decodeURIComponent(window.location.hash.replace(/^#/,''));}catch(_){}
    if(hash==='precos' || hash==='custos')hash=hash==='precos'?'venda':'ingredientes';
    return Object.prototype.hasOwnProperty.call(SECTIONS,hash)?hash:'receita';
  };
  let current='';
  function select(name,scroll){
    if(!SECTIONS[name])name='receita';
    const changed=current!==name;
    current=name;
    pages.forEach(panel => {panel.hidden=panel.dataset.screen!==name});
    links.forEach(link=>{
      const active=link.dataset.screenLink===name;
      if(active)link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
      link.classList.toggle('is-active',active);
    });
    title.textContent=SECTIONS[name].title;
    subtitle.textContent=SECTIONS[name].description;
    document.title=SECTIONS[name].title+' | Calculadora de Sabonete Vegetal';
    document.documentElement.classList.add('app-ready');
    if(scroll&&changed)window.scrollTo({top:0,behavior:'instant'});
  }
  links.forEach(link=>link.addEventListener('click',(event)=>{
    const name=link.dataset.screenLink;
    if(!SECTIONS[name])return;
    event.preventDefault();
    if(window.location.hash==='#'+name){
      select(name,true);
      window.scrollTo({top:0,behavior:'instant'});
    } else {
      window.location.hash=name;
    }
  }));
  window.addEventListener('hashchange',()=>select(selectedHash(),true));
  select(selectedHash(),false);
  // On a deep link the browser may scroll before the other panels are hidden.
  if(window.location.hash && selectedHash()!=='receita'){
    requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));
  }
})();