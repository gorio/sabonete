/* Planejador de moldes de sabonete vegetal com base pronta.
 * Capacidade informada em GRAMAS DE PRODUTO FINAL por cavidade.
 * Peso final e aproximado quando as densidades dos liquidos sao desconhecidas.
 */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  if(!$('moldes'))return;
  const KEY='sabonete-moldes-v1',MAX=25;
  const fields=['moldCavities','moldGrams','moldCycles','moldReserve'];
  const example={cavities:'10',grams:'100',cycles:'1',reserve:'5'};
  const fmt=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2,minimumFractionDigits:0});
  let store={molds:[]};
  let selectedId='';
  const decimal=raw=>{
    const t=String(raw??'').trim().replace(/\s/g,'');
    if(!t)return NaN;
    const v=/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(t)?
      t.replace(/\./g,'').replace(',','.') : t.replace(',','.');
    return /^\d+(?:\.\d+)?$/.test(v)?Number(v):NaN;
  };
  const natural=v=>Number.isInteger(v)&&v>0;
  const sanitize=m=>m&&typeof m.id==='string'&&m.id.length<75&&
    typeof m.name==='string'&&m.name.trim().length>0&&m.name.length<=90&&
    typeof m.cavities==='string'&&m.cavities.length<=25&&
    typeof m.grams==='string'&&m.grams.length<=25&&
    natural(decimal(m.cavities))&&decimal(m.cavities)<=1000&&
    decimal(m.grams)>0&&decimal(m.grams)<=10000;
  const validate=d=>d&&Array.isArray(d.molds)&&d.molds.length<=MAX&&
    d.molds.every(sanitize)&&new Set(d.molds.map(x=>x.id)).size===d.molds.length;
  const clone=o=>JSON.parse(JSON.stringify(o));
  try{
    const v=JSON.parse(localStorage.getItem(KEY)||'null');
    if(validate(v))store=v;
  }catch(_){}
  const save=()=>{
    try{localStorage.setItem(KEY,JSON.stringify(store));return true}
    catch(_){notice('Não foi possível salvar os moldes neste navegador.',true);return false}
  };
  const el=(tag,className,content)=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(content!==undefined)node.textContent=content;
    return node;
  };
  const notice=(message,error=false)=>{
    const n=$('moldNotice');
    n.textContent=message;
    n.hidden=!message;
    n.classList.toggle('is-error',error);
  };
  const value=()=>({
    cavities:decimal($('moldCavities').value),
    grams:decimal($('moldGrams').value),
    cycles:decimal($('moldCycles').value),
    reserve:decimal($('moldReserve').value)
  });
  let preview=null;
  function update(){
    const x=value();
    const valid=natural(x.cavities)&&x.cavities<=1000&&
      x.grams>0&&x.grams<=10000&&
      natural(x.cycles)&&x.cycles<=500&&
      Number.isFinite(x.reserve)&&x.reserve>=0&&x.reserve<=30&&
      x.cavities*x.cycles<=100000&&
      x.cavities*x.grams*x.cycles<=1e6;
    $('moldApply').disabled=!valid;
    $('moldSave').disabled=!valid||store.molds.length>=MAX;
    $('moldValidation').textContent=valid?
      'Cálculo estimado para uma base pronta. A massa real depende das densidades e do rendimento medido.':
      'Confira: cavidades de 1 a 1.000, peso positivo até 10.000 g por cavidade, preenchimentos de 1 a 500 e reserva de 0% a 30%. Limite de 100.000 peças e 1.000 kg por planejamento.';
    if(!valid){
      preview=null;
      $('moldSummary').textContent='Aguardando informações válidas da forma.';
      for(const id of ['moldTotalUnits','moldFinishedMass','moldBaseMass','moldEssence','moldExtract','moldLauril'])
        $(id).textContent='—';
      return;
    }
    const units=x.cavities*x.cycles;
    const production=units*x.grams;
    const total=production*(1+x.reserve/100);
    const base=total/1.25;
    preview={units,production,total,base,essence:base*.08,extract:base*.07,lauril:base*.10};
    const format=(n,unit)=>fmt.format(n)+' '+unit;
    $('moldTotalUnits').textContent=fmt.format(units);
    $('moldFinishedMass').textContent=format(total,'g estimados');
    $('moldBaseMass').textContent=format(base,'g');
    $('moldEssence').textContent=format(preview.essence,'mL');
    $('moldExtract').textContent=format(preview.extract,'mL');
    $('moldLauril').textContent=format(preview.lauril,'mL');
    $('moldSummary').textContent='Peças: '+units+' · '+fmt.format(x.grams)+
      ' g finais estimados por peça · reserva de '+fmt.format(x.reserve)+'% incluída no total de materiais.';
  }
  function render(){
    const target=$('moldLibrary');target.replaceChildren();
    $('moldLibraryCount').textContent=store.molds.length+' de '+MAX+' moldes';
    if(!store.molds.length){
      target.append(el('p','mold-empty','Você ainda não salvou moldes. Cadastre suas cavidades e a capacidade real estimada por peça.'));
      return;
    }
    for(const item of store.molds){
      const row=el('article','mold-item');
      const desc=el('div','mold-item-desc');
      desc.append(el('strong','',item.name),el('small','',item.cavities+' cavidades · '+item.grams+' g finais/cavidade'));
      const buttons=el('div','mold-item-actions');
      const load=el('button','mold-load','Utilizar');load.type='button';
      load.addEventListener('click',()=>{
        $('moldCavities').value=item.cavities;
        $('moldGrams').value=item.grams;
        selectedId=item.id;
        update();
        notice('Molde "'+item.name+'" selecionado. Ajuste preenchimentos e reserva conforme a produção.');
      });
      const del=el('button','mold-delete','Excluir');del.type='button';
      del.addEventListener('click',()=>{
        if(!window.confirm('Excluir o molde "'+item.name+'"?'))return;
        store.molds=store.molds.filter(m=>m.id!==item.id);
        if(selectedId===item.id)selectedId='';
        save();render();update();
      });
      buttons.append(load,del);row.append(desc,buttons);target.append(row);
    }
  }
  $('moldSave').addEventListener('click',()=>{
    update();
    if(!preview)return;
    const name=$('moldName').value.trim();
    if(!name||name.length>90){notice('Informe um nome de molde com até 90 caracteres.',true);return;}
    if(store.molds.length>=MAX){notice('Limite de 25 moldes atingido. Faça backup antes de excluir registros.',true);return;}
    store.molds.push({
      id:String(Date.now())+'-'+Math.floor(Math.random()*1e8),
      name,cavities:$('moldCavities').value,grams:$('moldGrams').value
    });
    if(save()){
      $('moldName').value='';
      render();
      update();
      notice('Molde cadastrado. Ele também será incluído no backup do Ateliê.');
    }
  });
  $('moldApply').addEventListener('click',()=>{
    update();
    if(!preview)return;
    const pricing=window.SabonetePricing;
    const snapshot=pricing&&pricing.capture();
    const overrides=snapshot&&snapshot.products.filter(p=>p.type==='custom'||p.used!=='');
    if(overrides && overrides.length){
      const names=overrides.map(p=>p.name||'item sem nome').join(', ');
      if(!window.confirm('ATENÇÃO: as quantidades personalizadas NÃO serão redimensionadas automaticamente ('+
        names+'). Confira-as em Matérias-primas antes de usar o preço de venda. Continuar?'))return;
    }
    const target=$('weight'),finalTab=$('tabFinal'),units=$('p_units');
    if(!target||!finalTab||!units){notice('Calculadora de receita ou precificação indisponível.',true);return;}
    finalTab.click();
    // The costing engine recognizes the two-decimal finished weight entered here.
    target.value=preview.total.toFixed(5).replace('.',',');
    target.dispatchEvent(new Event('input',{bubbles:true}));
    units.value=String(preview.units);
    units.dispatchEvent(new Event('input',{bubbles:true}));
    notice('Planejamento aplicado. Confira as quantidades usadas, o rendimento e os preços cadastrados.');
    window.location.hash='venda';
  });
  for(const id of fields)$(id).addEventListener('input',update);
  $('moldName').addEventListener('input',()=>notice(''));
  window.SaboneteMolds=Object.freeze({
    capture:()=>clone(store),
    apply:next=>{
      if(!validate(next))return false;
      try {
        localStorage.setItem(KEY,JSON.stringify(next));
        store=clone(next);
        selectedId='';
        render();update();return true;
      }catch(_){return false}
    }
  });
  for(const [key,raw] of Object.entries(example))$('mold'+key[0].toUpperCase()+key.slice(1)).value=raw;
  render();update();
})();