/* Precificacao para sabonetes com base glicerinada pronta.
   Core recipe 8/7/10 mL per 100g de base, invertida por fator ilustrativo 1.25.
   O rendimento vem de quantidade real de unidades, nao de um peso fixo por barra. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  if (!byId('venda')) return;
  const KEY = 'sabonete-precos-v2';
  const BRL = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
  const NUM = new Intl.NumberFormat('pt-BR', {maximumFractionDigits:2, minimumFractionDigits:2});
  const MAX_ITEMS=60;
  const DEFAULT_PRODUCTS = [
    {id:'base',type:'base', name:'Base vegetal V&G / Quimiz',unit:'g', pack:'3000',price:'78,89', used:''},
    {id:'ess',type:'ess', name:'Essência Capim-Limão',unit:'mL',pack:'100',price:'26,60',used:''},
    {id:'ext',type:'ext', name:'Extrato glicólico Hamamélis',unit:'mL',pack:'',price:'12,00',used:''},
    {id:'lau',type:'lau', name:'Lauril Éter Sulfato de Sódio 27%',unit:'mL',pack:'1000',price:'26,00',used:''}
  ];
  const clone = value => JSON.parse(JSON.stringify(value));
  const baseDefaults={units:'20',markup:'150'};
  let state={products:clone(DEFAULT_PRODUCTS),...baseDefaults,next:1};
  const numeric = raw => {
    const t=String(raw??'').trim().replace(/\s+/g,'');
    if(!t)return NaN;
    const normalized=/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(t) ?
      t.replace(/\./g,'').replace(',','.') : t.replace(',','.');
    return /^\d+(?:\.\d+)?$/.test(normalized)?Number(normalized):NaN;
  };
  const nonNegative = value => Number.isFinite(value) && value>=0 && value<=1e10;
  const positive = value => nonNegative(value) && value>0;
  const money = value => Number.isFinite(value)?BRL.format(value):'—';
  const measure = (value,unit) => Number.isFinite(value)?NUM.format(value)+' '+unit:'—';
  const output = (id,value) => {const e=byId(id); if(e)e.textContent=value;};
  const formFields = {p_units:'units',p_markup_input:'markup'};
  function store(){
    try {localStorage.setItem(KEY,JSON.stringify(state));}catch(_) {}
  }
  function load(){
    try {
      const saved=JSON.parse(localStorage.getItem(KEY)||'null');
      if(saved && Array.isArray(saved.products) && saved.products.length<=MAX_ITEMS
         && typeof saved.next==='number' && saved.next>0 && saved.next<=1e8){
        const types=['base','ess','ext','lau','custom'];
        const restored=saved.products.filter(p=>p && typeof p.id==='string'
          && p.id.length<40 && types.includes(p.type)
          && typeof p.name==='string' && p.name.length<150
          && ['g','mL','un'].includes(p.unit)
          && ['pack','price','used'].every(k=>typeof p[k]==='string'&&p[k].length<50));
        const original=DEFAULT_PRODUCTS.map(core=>{
          const past=restored.find(p=>p.id===core.id && p.type===core.type);
          return past?{...core, name:past.name, pack:past.pack, price:past.price}:core;
        });
        const customs=restored.filter(p=>p.type==='custom' && !original.some(c=>c.id===p.id));
        state={...state,products:[...original,...customs.slice(0,MAX_ITEMS-4)],next:saved.next};
        Object.keys(baseDefaults).forEach(key=>{
          if(typeof saved[key]==='string' && saved[key].length<50)state[key]=saved[key];
        });
      } else {
        // Compatibilidade com precos digitados na versao anterior.
        const legacy=JSON.parse(localStorage.getItem('sabonete-precos-v1')||'null');
        if(legacy && typeof legacy==='object'){
          const mapping={base:['p_base_qty','p_base_price'],
            ess:['p_ess_qty','p_ess_price'],ext:['p_ext_qty','p_ext_price'],
            lau:['p_lau_qty','p_lau_price']};
          state.products.forEach(p=>{
            const fields=mapping[p.id];
            if(fields){
              if(typeof legacy[fields[0]]==='string')p.pack=legacy[fields[0]];
              if(typeof legacy[fields[1]]==='string')p.price=legacy[fields[1]];
            }
          });
        }
      }
    } catch(_) {}
  }
  function make(tag, className, text) {
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(text!==undefined)el.textContent=text;
    return el;
  }
  function makeInput(label,value,callback,placeholder) {
    const wrap=make('label','p-field');
    wrap.append(make('span','p-field-label',label));
    const input=make('input','p-input');
    input.type='text';input.inputMode='decimal';input.value=value;input.autocomplete='off';
    if(placeholder)input.placeholder=placeholder;
    input.setAttribute('aria-label',label);
    input.addEventListener('input',()=>callback(input.value));
    wrap.append(input);
    return wrap;
  }
  function addRow(p) {
    const row=make('article','p-product-row');
    row.dataset.id=p.id;
    const heading=make('div','p-product-header');
    const nameLabel=make('label','p-product-title');
    const nameInput=make('input','p-name');
    nameInput.type='text';nameInput.value=p.name;nameInput.maxLength=130;
    nameInput.setAttribute('aria-label','Nome da matéria-prima');
    nameInput.addEventListener('input',()=>{p.name=nameInput.value;store();calculate();});
    nameLabel.append(nameInput);
    heading.append(nameLabel);
    if(p.type==='custom'){
      const remove=make('button','p-remove','Remover');
      remove.type='button';
      remove.setAttribute('aria-label','Remover '+(p.name||'novo ingrediente'));
      remove.addEventListener('click',()=>{
        state.products=state.products.filter(x=>x!==p);
        row.remove();store();calculate();
      });
      heading.append(remove);
    } else heading.append(make('span','p-auto','Receita automática'));
    row.append(heading);
    const fields=make('div','p-product-fields');
    if(p.type==='custom'){
      const unitWrap=make('label','p-field');
      unitWrap.append(make('span','p-field-label','Unidade'));
      const select=make('select','p-input');
      select.setAttribute('aria-label','Unidade de medida para '+p.name);
      ['mL','g','un'].forEach(unit=>{
        const option=make('option','',unit);option.value=unit;option.selected=unit===p.unit;select.append(option);
      });
      select.addEventListener('change',()=>{p.unit=select.value;store();renderRows();calculate();});
      unitWrap.append(select);fields.append(unitWrap);
    }
    fields.append(makeInput('Embalagem ('+p.unit+')',p.pack,value=>{p.pack=value;store();calculate();},'Ex.: 100'));
    fields.append(makeInput('Preço pago (R$)',p.price,value=>{p.price=value;store();calculate();},'Ex.: 25,00'));
    if(p.type==='custom')fields.append(makeInput('Uso neste lote ('+p.unit+')',p.used,value=>{p.used=value;store();calculate();},'Ex.: 2'));
    row.append(fields);
    const usage=make('div','p-product-foot');
    const uses=make('span','p-used','Uso no lote: —');
    uses.dataset.role='usage';
    const cost=make('strong','p-cost','Custo: —');
    cost.dataset.role='cost';
    usage.append(uses,cost);row.append(usage);
    return row;
  }
  function renderRows(){
    const rows=byId('p_products');
    rows.replaceChildren(...state.products.map(addRow));
    byId('p_add').disabled=state.products.length>=MAX_ITEMS;
  }
  function formula() {
    const input=numeric(byId('weight').value);
    const final=byId('tabFinal').getAttribute('aria-pressed')==='true';
    const base=positive(input)?(final?input/1.25:input):NaN;
    return {base,estimatedFinal:base*1.25};
  }
  function usedAmount(p, base) {
    if(p.type==='base')return base;
    if(p.type==='ess')return base*0.08;
    if(p.type==='ext')return base*0.07;
    if(p.type==='lau')return base*0.10;
    return numeric(p.used);
  }
  function calculate(){
    const {base,estimatedFinal}=formula();
    const n=numeric(state.units), markup=numeric(state.markup);
    const validUnits=Number.isInteger(n)&&n>0&&n<=10000000;
    let sum=0, partial=0, complete=true;
    const problems=[];
    if(!positive(base))problems.push('Informe o peso da receita na calculadora acima.');
    if(!validUnits)problems.push('Informe a quantidade produzida em unidades inteiras maiores que zero.');
    if(!nonNegative(markup)||markup>100000)problems.push('Informe um percentual de lucro válido.');
    state.products.forEach(p=>{
      const used=usedAmount(p,base);
      const qty=numeric(p.pack),price=numeric(p.price);
      const entry=Array.from(byId('p_products').children).find(e=>e.dataset.id===p.id);
      if(entry){
        const label=entry.querySelector('[data-role="usage"]');
        if(label)label.textContent='Uso no lote: '+measure(used,p.unit);
      }
      const ready=positive(qty)&&nonNegative(price)&&nonNegative(used)&&p.name.trim().length>0;
      const cost=ready?used*price/qty:NaN;
      if(entry){
        const dest=entry.querySelector('[data-role="cost"]');
        if(dest)dest.textContent='Custo: '+money(cost);
      }
      if(ready)partial+=cost;
      else {
        complete=false;
        problems.push('Complete embalagem, preço e uso de '+(p.name.trim()||'um novo ingrediente')+'.');
      }
    });
    if(!positive(base))complete=false;
    sum=complete?partial:NaN;
    const rawUnit=complete&&validUnits?sum/n:NaN;
    // O acréscimo comercial é calculado somente sobre matérias-primas.
    // Não declarar lucro líquido: despesas indiretas não são contabilizadas nesta versão.
    const unitCost=rawUnit;
    const suggestion=Number.isFinite(unitCost)&&nonNegative(markup)&&markup<=100000?
      unitCost*(1+markup/100):NaN;
    const grossDifference=Number.isFinite(suggestion)&&Number.isFinite(unitCost)?suggestion-unitCost:NaN;
    const margin=positive(suggestion)&&Number.isFinite(grossDifference)?grossDifference/suggestion*100:NaN;
    const estimateWeight=Number.isFinite(estimatedFinal)&&validUnits?estimatedFinal/n:NaN;
    output('p_batch_total',money(sum));
    output('p_partial_total',complete?'':'Parcial conhecido: '+money(partial)+' (custo incompleto)');
    output('p_unit_weight',measure(estimateWeight,'g/un'));
    output('p_unit_raw',money(rawUnit));
    output('p_unit_cost',money(unitCost));
    output('p_suggested',money(suggestion));
    output('p_profit',money(grossDifference));
    output('p_margin',Number.isFinite(margin)?NUM.format(margin)+'%':'—');
    output('p_lot_profit',money(Number.isFinite(grossDifference)&&validUnits?grossDifference*n:NaN));
    output('p_recipe_batch',Number.isFinite(base)?
      'Receita atual: '+measure(base,'g')+' de base; peso final estimado de '+measure(estimatedFinal,'g')+'.':
      'Informe o peso da receita na calculadora acima.');
    output('markup-note',nonNegative(markup)? NUM.format(markup)+'% de acréscimo sobre o custo significa multiplicar o custo por '+NUM.format(1+markup/100)+'. Não confunda esse acréscimo com margem sobre a venda.' : 'Informe um percentual de lucro válido.');
    const warning=byId('p_status');
    warning.textContent=problems.join(' ');
    warning.hidden=problems.length===0;
    output('p_sale_note','O acréscimo sobre os ingredientes serve como reserva para outras despesas e lucro. Não representa lucro líquido, pois custos indiretos ainda não são informados.');
  }
  load();
  Object.keys(formFields).forEach(id=>{
    const key=formFields[id],elem=byId(id);
    elem.value=state[key];
    elem.addEventListener('input',()=>{state[key]=elem.value;store();calculate();});
  });
  byId('p_add').addEventListener('click',()=>{
    if(state.products.length>=MAX_ITEMS)return;
    const item={id:'extra-'+state.next++,type:'custom',name:'',unit:'mL',pack:'',price:'',used:''};
    state.products.push(item);
    renderRows();store();calculate();
    const row=Array.from(byId('p_products').children).find(e=>e.dataset.id===item.id);
    if(row)row.querySelector('.p-name').focus();
  });
  ['weight','tabBase','tabFinal'].forEach(id=>
    byId(id).addEventListener(id==='weight'?'input':'click',calculate));
  renderRows();
  calculate();
})();