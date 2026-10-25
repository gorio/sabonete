/* Atelie local: biblioteca de receitas, planejamentos e backup.
 * Nenhum dado e enviado a servidores. Nao representa estoque ou producao realizada automaticamente.
 */
(() => {
  'use strict';
  const api=window.SabonetePricing;
  const $=id=>document.getElementById(id);
  if(!$('atelie') || !api)return;
  const KEY='sabonete-atelie-v1';
  const MAX_RECIPES=40,MAX_BATCHES=100;
  const steps=[
    'Conferi fichas técnicas, limites e compatibilidade',
    'Separei materiais e medi os ingredientes',
    'Registrei o rendimento real do lote',
    'Conferi os custos e anotei eventuais pendências'
  ];
  const BRL=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
  const pretty=n=>Number.isFinite(n)?BRL.format(n):'Pendente';
  const obj=()=>({recipes:[],batches:[]});
  let data=obj();
  let notice='';
  const el=(tag,className,value)=>{
    const n=document.createElement(tag);
    if(className)n.className=className;
    if(value!==undefined)n.textContent=value;
    return n;
  };
  const okayName=x=>typeof x==='string' && x.trim().length>0 && x.trim().length<=90;
  const okayRecipe=r=>r&&typeof r.id==='string'&&r.id.length<80&&
    okayName(r.name)&&typeof r.createdAt==='string'&&r.createdAt.length<60&&
    r.form&&['base','final'].includes(r.form.mode)&&
    typeof r.form.weight==='string'&&r.form.weight.length<35&&
    r.pricing&&Array.isArray(r.pricing.products)&&r.pricing.products.length<=60;
  const okayBatch=b=>b&&typeof b.id==='string'&&b.id.length<80&&
    okayName(b.name)&&['planejado','concluido'].includes(b.status)&&
    typeof b.createdAt==='string'&&b.createdAt.length<60&&
    Array.isArray(b.checked)&&b.checked.length===steps.length&&b.checked.every(v=>typeof v==='boolean')&&
    typeof b.notes==='string'&&b.notes.length<=500&&
    (b.completedAt==null||typeof b.completedAt==='string')&&
    b.summary&&typeof b.summary==='object';
  const validData=d=>d&&typeof d==='object'&&Array.isArray(d.recipes)&&Array.isArray(d.batches)&&
    d.recipes.length<=MAX_RECIPES&&d.batches.length<=MAX_BATCHES&&
    d.recipes.every(okayRecipe)&&d.batches.every(okayBatch)&&
    new Set(d.recipes.map(r=>r.id)).size===d.recipes.length&&
    new Set(d.batches.map(b=>b.id)).size===d.batches.length;
  try{
    const restored=JSON.parse(localStorage.getItem(KEY)||'null');
    if(validData(restored))data=restored;
  }catch(_){}
  const now=()=>new Date().toISOString();
  const newId=()=>String(Date.now())+'-'+Math.floor(Math.random()*1e7);
  const getForm=()=>({
    mode:$('tabFinal').getAttribute('aria-pressed')==='true'?'final':'base',
    weight:$('weight').value
  });
  const getValue=x=>{
    const t=String(x??'').trim().replace(/\s/g,'');
    const cleaned=/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(t)?
      t.replace(/\./g,'').replace(',','.') : t.replace(',','.');
    return /^\d+(?:\.\d+)?$/.test(cleaned)?Number(cleaned):NaN;
  };
  const validForm=f=>f&&['base','final'].includes(f.mode)&&
    typeof f.weight==='string'&&f.weight.length<35&&
    Number.isFinite(getValue(f.weight))&&getValue(f.weight)>0&&getValue(f.weight)<=1e9;
  const setNotice=(text,isError=false)=>{
    notice=text;
    const n=$('atelierNotice');n.textContent=notice;
    n.classList.toggle('is-error',isError);
    n.hidden=!text;
  };
  const commit=()=>{
    try{localStorage.setItem(KEY,JSON.stringify(data));return true;}
    catch(_){setNotice('Não foi possível salvar neste navegador. Confira o espaço disponível.',true);return false;}
  };
  const formatDate=x=>{
    const date=new Date(x);
    return Number.isNaN(date.valueOf())?'Data desconhecida':date.toLocaleDateString('pt-BR');
  };
  function applyForm(f){
    const tab=$(f.mode==='final'?'tabFinal':'tabBase');
    tab.click();
    $('weight').value=f.weight;
    $('weight').dispatchEvent(new Event('input',{bubbles:true}));
  }
  function renderRecipes(){
    const holder=$('atelierRecipeList');holder.replaceChildren();
    $('atelierRecipeCount').textContent=data.recipes.length+' / '+MAX_RECIPES+' receitas salvas';
    if(!data.recipes.length){
      holder.append(el('p','atelier-empty','Nenhuma receita salva. Defina o peso na Calculadora, cadastre ingredientes e salve a primeira receita aqui.'));
      return;
    }
    [...data.recipes].reverse().forEach(recipe=>{
      const card=el('article','atelier-item');
      const txt=el('div','atelier-item-content');
      txt.append(el('strong','',recipe.name),
        el('small','','Salva em '+formatDate(recipe.createdAt)+' · '+
          recipe.form.weight+' g '+(recipe.form.mode==='final'?'finais estimados':'de base')));
      const buttons=el('div','atelier-item-actions');
      const load=el('button','atelier-primary','Usar receita');load.type='button';
      load.addEventListener('click',()=>{
        if(!window.confirm('Aplicar "'+recipe.name+'"? Isso substituirá o peso, os ingredientes, quantidades e preços atualmente exibidos.'))return;
        if(!validForm(recipe.form)||!api.apply(recipe.pricing)){
          setNotice('Não foi possível aplicar esta receita. Confira os dados salvos.',true);return;
        }
        applyForm(recipe.form);
        setNotice('Receita "'+recipe.name+'" carregada. Revise os preços antigos antes de produzir.');
        window.location.hash='ingredientes';
      });
      const remove=el('button','atelier-subtle','Excluir');remove.type='button';
      remove.addEventListener('click',()=>{
        if(!window.confirm('Excluir a receita "'+recipe.name+'"?'))return;
        data.recipes=data.recipes.filter(r=>r.id!==recipe.id);
        if(commit())renderRecipes();
      });
      buttons.append(load,remove);card.append(txt,buttons);holder.append(card);
    });
  }
  function renderBatches(){
    const holder=$('atelierBatchList');holder.replaceChildren();
    $('atelierBatchCount').textContent=data.batches.length+' / '+MAX_BATCHES+' registros';
    if(!data.batches.length){
      holder.append(el('p','atelier-empty','Nenhum planejamento registrado. Você pode criar um lote com os dados atuais, sem registrar automaticamente uma produção concluída.'));
      return;
    }
    [...data.batches].reverse().forEach(batch=>{
      const card=el('article','atelier-item atelier-batch');
      const head=el('div','atelier-item-content');
      const badge=el('span','atelier-batch-status',batch.status==='concluido'?'Concluído':'Planejado');
      badge.dataset.status=batch.status;
      head.append(el('strong','',batch.name),badge,
        el('small','',formatDate(batch.createdAt)+' · '+
          (Number.isInteger(batch.summary.units)?batch.summary.units+' unidade(s)':'Rendimento pendente')+
          ' · Custo do lote: '+pretty(batch.summary.batchCost)));
      const detail=el('p','atelier-mini',
        'Preço sugerido por unidade: '+pretty(batch.summary.unitPrice)+
        '. '+(batch.summary.complete?'Custos registrados no planejamento.':'Custos incompletos na data do planejamento.'));
      head.append(detail);
      if(batch.notes)head.append(el('p','atelier-batch-notes',batch.notes));
      card.append(head);
      const checklist=el('div','atelier-checklist');
      steps.forEach((step,index)=>{
        const row=el('label','atelier-check');
        const checkbox=el('input');
        checkbox.type='checkbox';
        checkbox.checked=batch.checked[index];
        checkbox.disabled=batch.status==='concluido';
        checkbox.addEventListener('change',()=>{
          batch.checked[index]=checkbox.checked;
          if(commit())renderBatches();
        });
        row.append(checkbox,el('span','',step));
        checklist.append(row);
      });
      card.append(checklist);
      const actions=el('div','atelier-item-actions');
      if(batch.status==='planejado'){
        const complete=el('button','atelier-primary','Registrar conclusão');
        complete.type='button';
        complete.disabled=!batch.checked.every(Boolean);
        complete.title=complete.disabled?'Marque as quatro verificações para registrar a conclusão':'Registrar conclusão desta produção';
        complete.addEventListener('click',()=>{
          if(!batch.checked.every(Boolean))return;
          if(!window.confirm('Registrar que esta produção foi concluída? Não haverá baixa automática no estoque.'))return;
          batch.status='concluido';batch.completedAt=now();
          if(commit())renderBatches();
        });
        actions.append(complete);
      }
      const remove=el('button','atelier-subtle','Excluir registro');remove.type='button';
      remove.addEventListener('click',()=>{
        if(!window.confirm('Excluir o registro "'+batch.name+'"?'))return;
        data.batches=data.batches.filter(b=>b.id!==batch.id);
        if(commit())renderBatches();
      });
      actions.append(remove);card.append(actions);holder.append(card);
    });
  }
  function render(){renderRecipes();renderBatches()}
  $('atelierSaveRecipe').addEventListener('click',()=>{
    const name=$('atelierRecipeName').value.trim();
    const form=getForm();
    if(!okayName(name)){setNotice('Informe um nome de receita com até 90 caracteres.',true);return;}
    if(!validForm(form)){setNotice('Informe um peso válido na Calculadora antes de salvar.',true);return;}
    if(data.recipes.length>=MAX_RECIPES){setNotice('Limite de 40 receitas atingido. Faça backup antes de excluir antigas.',true);return;}
    const recipe={id:newId(),name,createdAt:now(),form,pricing:api.capture()};
    data.recipes.push(recipe);
    if(commit()){
      $('atelierRecipeName').value='';
      renderRecipes();
      setNotice('Receita salva neste navegador. Você pode carregá-la quando quiser.');
    }
  });
  $('atelierSaveBatch').addEventListener('click',()=>{
    const name=$('atelierBatchName').value.trim();
    if(!okayName(name)){setNotice('Informe um nome para o lote.',true);return;}
    if(!validForm(getForm())){setNotice('O peso da receita precisa ser válido para planejar um lote.',true);return;}
    if(data.batches.length>=MAX_BATCHES){setNotice('Limite de registros atingido. Exporte um backup antes de excluir.',true);return;}
    const summary=api.summary();
    const batch={
      id:newId(),name,createdAt:now(),completedAt:null,
      status:'planejado',checked:steps.map(()=>false),
      notes:$('atelierBatchNotes').value.trim().slice(0,500),
      summary:{
        complete:summary.complete,units:summary.units,
        estimatedFinal:summary.estimatedFinal,base:summary.base,
        batchCost:summary.batchCost,unitCost:summary.unitCost,
        unitPrice:summary.unitPrice,salesTotal:summary.salesTotal,
        markup:summary.markup,lines:summary.lines
      }
    };
    data.batches.push(batch);
    if(commit()){
      $('atelierBatchName').value='';
      $('atelierBatchNotes').value='';
      renderBatches();
      setNotice('Planejamento criado. A produção só será marcada como concluída após sua confirmação.');
    }
  });
  $('atelierBackupDownload').addEventListener('click',()=>{
    const backup={format:'sabonete-backup',version:1,exportedAt:now(),
      atelier:data,pricing:api.capture(),form:getForm(),
      moldes:window.SaboneteMolds?window.SaboneteMolds.capture():undefined};
    try{
      const content=JSON.stringify(backup,null,2);
      const url=URL.createObjectURL(new Blob([content],{type:'application/json;charset=utf-8'}));
      const a=document.createElement('a');
      a.href=url;a.download='sabonete-backup-'+new Date().toISOString().slice(0,10)+'.json';
      document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      setNotice('Arquivo de backup gerado. Guarde-o em local seguro.');
    }catch(_){setNotice('Não foi possível gerar o backup neste navegador.',true)}
  });
  $('atelierBackupImport').addEventListener('change',event=>{
    const file=event.target.files&&event.target.files[0];
    event.target.value='';
    if(!file)return;
    if(file.size>2e6){setNotice('O arquivo excede o limite de 2 MB.',true);return;}
    const reader=new FileReader();
    reader.onerror=()=>setNotice('Não foi possível ler o arquivo de backup.',true);
    reader.onload=()=>{
      let backup;
      try{backup=JSON.parse(String(reader.result));}catch(_){setNotice('Arquivo JSON inválido.',true);return;}
      if(!backup||backup.format!=='sabonete-backup'||backup.version!==1||
        !validData(backup.atelier)||!validForm(backup.form)||!backup.pricing){
        setNotice('O arquivo não corresponde a um backup válido do Ateliê.',true);return;
      }
      if(!window.confirm('Restaurar backup? Isso substituirá as receitas, os planejamentos e a precificação salvos neste navegador.'))return;
      const oldData=data,oldPricing=api.capture(),oldForm=getForm();
      const moldApi=window.SaboneteMolds;
      const oldMolds=moldApi?moldApi.capture():null;
      try{
        // Backups anteriores continuam validos e mantem os moldes atuais.
        // Se o backup possui moldes, a validacao fica a cargo do modulo de moldes.
        if(backup.moldes!==undefined && (!moldApi||!moldApi.apply(backup.moldes)))
          throw Error('Catálogo de moldes incompatível');
        if(!api.apply(backup.pricing))throw Error('Precificação incompatível');
        localStorage.setItem(KEY,JSON.stringify(backup.atelier));
        data=backup.atelier;
        applyForm(backup.form);
        render();
        setNotice('Backup restaurado com sucesso. Confira ingredientes, moldes e preços antes de produzir.');
      }catch(_){
        data=oldData;
        api.apply(oldPricing);
        if(oldMolds && moldApi)moldApi.apply(oldMolds);
        try{localStorage.setItem(KEY,JSON.stringify(oldData))}catch(_){}
        applyForm(oldForm);render();
        setNotice('Falha na restauração. Os dados anteriores foram preservados quando possível.',true);
      }
    };
    reader.readAsText(file,'UTF-8');
  });
  render();
})();