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
    {id:'base',type:'base', name:'Base vegetal V&G / Quimiz',unit:'g', pack:'3000',packUnit:'g',price:'78,89', used:''},
    {id:'ess',type:'ess', name:'Essência Capim-Limão',unit:'mL',pack:'100',packUnit:'mL',price:'26,60',used:''},
    {id:'ext',type:'ext', name:'Extrato glicólico Hamamélis',unit:'mL',pack:'',packUnit:'mL',price:'12,00',used:''},
    {id:'lau',type:'lau', name:'Lauril Éter Sulfato de Sódio 27%',unit:'mL',pack:'1000',packUnit:'mL',price:'26,00',used:''}
  ];
  const clone = value => JSON.parse(JSON.stringify(value));
  const unitChoices = (unit) => unit==='g'?['g','kg']:unit==='mL'?['mL','L']:['un'];
  const validPackUnit = (unit,packUnit) => unitChoices(unit).includes(packUnit)?packUnit:unit;
  const packageAmount = (p) => {
    const value=numeric(p.pack);
    if(!positive(value))return NaN;
    const packUnit=validPackUnit(p.unit,p.packUnit);
    return value*(packUnit==='L'||packUnit==='kg'?1000:1);
  };
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
  // Fractions of a cent matter for the purchase price per mL or gram.
  const PRECISE = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:4,maximumFractionDigits:4});
  const moneyPrecise = value => Number.isFinite(value)?PRECISE.format(value):'—';
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
          return past?{...core, name:past.name, pack:past.pack,
            packUnit:validPackUnit(core.unit,past.packUnit), price:past.price,
            used:typeof past.used==='string'?past.used:'',
            usedUnit:validPackUnit(core.unit,past.usedUnit)}:core;
        });
        const customs=restored.filter(p=>p.type==='custom' && !original.some(c=>c.id===p.id)).map(p=>({...p,
          packUnit:validPackUnit(p.unit,p.packUnit),
          usedUnit:validPackUnit(p.unit,p.usedUnit)
        }));
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
    } else heading.append(make('span','p-auto','Uso sugerido pela receita'));
    row.append(heading);
    const fields=make('div','p-product-fields');
    if(p.type==='custom'){
      const unitWrap=make('label','p-field');
      unitWrap.append(make('span','p-field-label','Tipo de medida'));
      const select=make('select','p-input');
      select.setAttribute('aria-label','Unidade de medida para '+p.name);
      ['mL','g','un'].forEach(unit=>{
        const option=make('option','',unit);option.value=unit;option.selected=unit===p.unit;select.append(option);
      });
      select.addEventListener('change',()=>{
        if(p.unit===select.value)return;
        // Never carry a previously-entered liquid amount into a solid weight, or vice versa.
        p.unit=select.value;
        p.packUnit=select.value;
        p.usedUnit=select.value;
        p.pack='';
        p.used='';
        store();renderRows();calculate();
        const refreshed=Array.from(byId('p_products').children).find(e=>e.dataset.id===p.id);
        const newPack=refreshed&&refreshed.querySelector('[data-role="pack-quantity"]');
        if(newPack)newPack.focus();
      });
      unitWrap.append(select);fields.append(unitWrap);
    }
    const packageRow=make('div','p-package-row');
    const amountWrap=makeInput('Quantidade da embalagem',p.pack,value=>{p.pack=value;store();calculate();},'Ex.: 100');
    if(p.id==='ext')amountWrap.querySelector('input').id='p_ext_pack_input';
    amountWrap.querySelector('input').dataset.role='pack-quantity';
    const packageUnitWrap=make('label','p-field p-pack-unit');
    packageUnitWrap.append(make('span','p-field-label','Unidade da embalagem'));
    const packSelect=make('select','p-input');
    packSelect.setAttribute('aria-label','Unidade da embalagem de '+p.name);
    packSelect.dataset.role='package-unit';
    const selectedUnit=validPackUnit(p.unit,p.packUnit);
    unitChoices(p.unit).forEach(unit=>{
      const opt=make('option','',unit);
      opt.value=unit; opt.selected=selectedUnit===unit;
      packSelect.append(opt);
    });
    packSelect.value=selectedUnit;
    packSelect.addEventListener('change',()=>{p.packUnit=packSelect.value;store();calculate();});
    packageUnitWrap.append(packSelect);
    packageRow.append(amountWrap,packageUnitWrap);
    fields.append(packageRow);
    fields.append(makeInput('Preço pago (R$)',p.price,value=>{p.price=value;store();calculate();},'Ex.: 25,00'));
    {
      const useRow=make('div','p-usage-row');
      const useAmount=makeInput('Quantidade utilizada no lote',
        p.type==='custom'?p.used:(p.used!==''?p.used:autoUsedDisplay(p,formula().base)),
        value=>{p.used=value;store();calculate();},p.type==='custom'?'Ex.: 2':'Quantidade da receita');
      useAmount.querySelector('input').dataset.role='used-quantity';
      const useUnitWrap=make('label','p-field p-used-unit');
      useUnitWrap.append(make('span','p-field-label','Unidade utilizada'));
      const useSelect=make('select','p-input');
      useSelect.dataset.role='used-unit';
      useSelect.setAttribute('aria-label','Unidade utilizada no lote de '+p.name);
      const currentUsedUnit=validPackUnit(p.unit,p.usedUnit);
      unitChoices(p.unit).forEach(unit=>{
        const opt=make('option','',unit);opt.value=unit;opt.selected=(unit===currentUsedUnit);
        useSelect.append(opt);
      });
      useSelect.value=currentUsedUnit;
      useSelect.addEventListener('change',()=>{
        if(p.type!=='custom'&&p.used===''){
          p.usedUnit=useSelect.value;
          useAmount.querySelector('input').value=autoUsedDisplay(p,formula().base);
        } else {
          const previous=validPackUnit(p.unit,p.usedUnit);
          const amount=numeric(p.used);
          if(Number.isFinite(amount)){
            const baseValue=amount*(previous==='L'||previous==='kg'?1000:1);
            p.used=String(baseValue/(useSelect.value==='L'||useSelect.value==='kg'?1000:1)).replace('.',',');
            useAmount.querySelector('input').value=p.used;
          }
          p.usedUnit=useSelect.value;
        }
        store();calculate();
      });
      useUnitWrap.append(useSelect);
      useRow.append(useAmount,useUnitWrap);
      fields.append(useRow);
      if(p.type!=='custom'){
        const hintRow=make('div','p-usage-help');
        const hint=make('span','p-usage-note','');
        hint.dataset.role='usage-mode';
        const reset=make('button','p-restore-recipe','Restaurar quantidade da receita');
        reset.type='button';
        reset.addEventListener('click',()=>{
          p.used='';p.usedUnit=p.unit;
          useSelect.value=p.unit;
          useAmount.querySelector('input').value=autoUsedDisplay(p,formula().base);
          store();calculate();
        });
        hintRow.append(hint,reset);
        fields.append(hintRow);
      }
    }
    row.append(fields);
    const usage=make('div','p-product-foot');
    const uses=make('span','p-used','Uso no lote: —');
    uses.dataset.role='usage';
    const cost=make('strong','p-cost','Custo: —');
    cost.dataset.role='cost';
    const perPurchase=make('span','p-cost-unit-source','Valor por '+p.unit+': —');
    perPurchase.dataset.role='purchase-unit';
    usage.append(uses,perPurchase,cost);row.append(usage);
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
  function recipeUsed(p,base) {
    if(!Number.isFinite(base))return NaN;
    if(p.type==='base')return base;
    if(p.type==='ess')return base*0.08;
    if(p.type==='ext')return base*0.07;
    if(p.type==='lau')return base*0.10;
    return NaN;
  }
  function autoUsedDisplay(p,base) {
    const amount=recipeUsed(p,base);
    if(!Number.isFinite(amount))return '';
    const unit=validPackUnit(p.unit,p.usedUnit);
    return new Intl.NumberFormat('pt-BR',{maximumFractionDigits:5}).format(
      amount/(unit==='L'||unit==='kg'?1000:1));
  }
  function usedAmount(p, base) {
    // The built-in formula acts as a default until the user edits a quantity.
    if(p.type!=='custom' && (p.used==='' || p.used==null))
      return recipeUsed(p,base);
    const value=numeric(p.used);
    if(!Number.isFinite(value))return NaN;
    const unit=validPackUnit(p.unit,p.usedUnit);
    // Convert L -> mL and kg -> g, without mixing mass and volume.
    return value*(unit==='L'||unit==='kg'?1000:1);
  }
  function calculate(){
    const {base, estimatedFinal}=formula();
    const n=numeric(state.units), markup=numeric(state.markup);
    const validUnits=Number.isInteger(n)&&n>0&&n<=10000000;
    const validMarkup=nonNegative(markup)&&markup<=100000;
    let subtotal=0,known=0;
    const missing=[];
    const rows=new Map(Array.from(byId('p_products').children).map(row=>[row.dataset.id,row]));
    const breakdown=byId('p_breakdown_rows');
    const breakdownItems=[];

    state.products.forEach(p=>{
      const used=usedAmount(p,base), qty=packageAmount(p), price=numeric(p.price);
      const row=rows.get(p.id);
      if(row){
        const usage=row.querySelector('[data-role="usage"]');
        if(usage)usage.textContent='Uso no lote: '+measure(used,p.unit);
        if(p.type!=='custom'){
          const field=row.querySelector('[data-role="used-quantity"]');
          if(field && p.used==='' && document.activeElement!==field)
            field.value=autoUsedDisplay(p,base);
          const mode=row.querySelector('[data-role="usage-mode"]');
          if(mode)mode.textContent=p.used===''?
            'Automático pela receita. Você pode alterar esta quantidade.':
            'Quantidade informada manualmente; use Restaurar para voltar à receita.';
        }
      }
      // Uma embalagem de 1 mL para 14,56 mL consumidos costuma indicar
      // que "1 litro" foi digitado como "1 mL". Nao distorcer precos.
      const suspicious=positive(qty)&&qty<=1&&used>qty&&p.unit!=='un';
      const validProduct=positive(qty)&&nonNegative(price)&&nonNegative(used)&&p.name.trim().length>0&&!suspicious;
      const cost=validProduct?used*price/qty:NaN;
      const purchaseUnit=positive(qty)&&nonNegative(price)&&!suspicious?price/qty:NaN;
      const individual=validProduct&&validUnits?cost/n:NaN;
      if(row){
        const label=row.querySelector('[data-role="cost"]');
        if(label)label.textContent='Custo do lote: '+money(cost);
        const purchase=row.querySelector('[data-role="purchase-unit"]');
        if(purchase)purchase.textContent='Preço por '+p.unit+': '+(Number.isFinite(purchaseUnit)?
          moneyPrecise(purchaseUnit)+'/'+p.unit:'—');
      }
      const item=make('article','p-breakdown-item');
      const head=make('div','p-breakdown-item-head');
      head.append(make('strong','',p.name.trim()||'Novo ingrediente'),
        make('span','', 'Usado no lote: '+measure(used,p.unit)));
      item.append(head);
      const cols=make('div','p-breakdown-values');
      const perPiece=make('div','');
      perPiece.append(make('small','','Custo por sabonete'),
        make('strong','',money(individual)));
      const perLot=make('div','');
      perLot.append(make('small','','Custo total no lote'),
        make('strong','',money(cost)));
      cols.append(perPiece,perLot);
      item.append(cols);
      breakdownItems.push(item);
      if(validProduct){
        subtotal+=cost;
        known++;
      } else {
        missing.push(suspicious?(p.name.trim()||'Matéria-prima')+' (unidade da embalagem precisa de conferência)':(p.name.trim()||'matéria-prima sem nome'));
      }
    });
    breakdown.replaceChildren(...breakdownItems);
    const usable=positive(base)&&validUnits&&known>0;
    const complete=usable&&missing.length===0;
    const unitCost=usable?subtotal/n:NaN;
    const unitSaleRaw=usable&&validMarkup?unitCost*(1+markup/100):NaN;
    // Venda e faturamento devem usar o mesmo valor unitario cobrado em centavos.
    const unitSale=Number.isFinite(unitSaleRaw)?Math.round((unitSaleRaw+Number.EPSILON)*100)/100:NaN;
    const weightPerBar=Number.isFinite(estimatedFinal)&&validUnits?estimatedFinal/n:NaN;
    const hero=byId('p_hero');
    hero.classList.toggle('incomplete',!complete);
    output('p_sale_label',complete?'Preço sugerido por sabonete':'Preço sugerido (após completar os ingredientes)');
    output('p_sale_price',complete?money(unitSale):'—');
    output('p_cost_unit',money(unitCost));
    output('p_batch_total',usable?money(subtotal):'—');
    output('p_breakdown_unit_total',money(unitCost));
    output('p_breakdown_lot_total',usable?money(subtotal):'—');
    output('p_total_sale',complete?money(Number.isFinite(unitSale)&&validUnits?unitSale*n:NaN):'—');
    output('p_units_copy',validUnits?n+' sabonete(s)':'lote');
    const saleTotal=byId('p_lot_sale');
    saleTotal.classList.toggle('incomplete',!complete);
    output('p_total_sale_label',complete?'Valor total de venda do lote':'Valor total de venda (pendente)');
    output('p_total_sale_note',complete?'Preço unitário × unidades produzidas.':
      'Preencha todos os ingredientes para visualizar o valor total de venda.');
    output('p_unit_weight',measure(weightPerBar,'g/un'));
    output('p_price_explainer',!usable?'Informe o peso e a quantidade de sabonetes para calcular.':
      !validMarkup?'Informe um percentual de acréscimo válido.':
      complete?'Valor por unidade, usando os custos cadastrados e '+NUM.format(markup)+'% de acréscimo. Não inclui despesas indiretas detalhadas.':
      'Cadastre as quantidades e os preços de todos os ingredientes para calcular o preço final. '+known+' de '+state.products.length+' itens completos.');
    output('markup-note',validMarkup?
      NUM.format(markup)+'% de acréscimo sobre o custo = custo x '+NUM.format(1+markup/100)+
      '. Este acréscimo não é uma margem de lucro de '+NUM.format(markup)+'% sobre a venda.':
      'Informe um percentual de acréscimo válido.');
    output('p_recipe_batch',Number.isFinite(base)?
      'Receita: '+measure(base,'g')+' de base; lote de '+measure(estimatedFinal,'g')+' estimados.':
      'Informe um peso válido na calculadora principal.');
    const issues=[];
    if(!positive(base))issues.push('Informe o peso na calculadora de ingredientes.');
    if(!validUnits)issues.push('Informe o rendimento em unidades inteiras maiores que zero.');
    if(!validMarkup)issues.push('Informe um percentual de acréscimo válido.');
    if(missing.length)issues.push('Complete antes de precificar: '+missing.join(', ')+'.');
    const status=byId('p_status');
    status.textContent=issues.join(' ');
    status.hidden=issues.length===0;

  }
  load();
  Object.keys(formFields).forEach(id=>{
    const key=formFields[id],elem=byId(id);
    elem.value=state[key];
    elem.addEventListener('input',()=>{state[key]=elem.value;store();calculate();});
  });
  byId('p_add').addEventListener('click',()=>{
    if(state.products.length>=MAX_ITEMS)return;
    const item={id:'extra-'+state.next++,type:'custom',name:'',unit:'mL',pack:'',packUnit:'mL',price:'',used:'',usedUnit:'mL'};
    state.products.push(item);
    renderRows();store();calculate();
    const row=Array.from(byId('p_products').children).find(e=>e.dataset.id===item.id);
    if(row) {
      const name=row.querySelector('.p-name');
      if(name)name.focus();
      if(typeof row.scrollIntoView==='function')row.scrollIntoView({behavior:'smooth',block:'center'});
    }
  });
  ['weight','tabBase','tabFinal'].forEach(id=>
    byId(id).addEventListener(id==='weight'?'input':'click',calculate));
  // API publica para o Atelie: somente dados locais, sem autenticacao/remoto.
  // Os precos ficam vinculados a cada versao salva da receita.
  function pricingSummary(){
    const {base,estimatedFinal}=formula();
    const units=numeric(state.units),markup=numeric(state.markup);
    const validUnits=Number.isInteger(units)&&units>0&&units<=1e7;
    const validMarkup=nonNegative(markup)&&markup<=1e5;
    let total=0,validCount=0;
    const lines=state.products.map(p=>{
      const used=usedAmount(p,base),pack=packageAmount(p),price=numeric(p.price);
      const suspicious=positive(pack)&&pack<=1&&used>pack&&p.unit!=='un';
      const valid=positive(pack)&&nonNegative(price)&&nonNegative(used)&&p.name.trim().length>0&&!suspicious;
      const cost=valid?used*price/pack:null;
      if(valid){total+=cost;validCount++;}
      return {name:p.name,used:Number.isFinite(used)?used:null,unit:p.unit,cost};
    });
    const complete=positive(base)&&validUnits&&validMarkup&&validCount===state.products.length;
    const roundedPrice=complete?Math.round((total/units*(1+markup/100)+Number.EPSILON)*100)/100:null;
    return {
      complete,base:Number.isFinite(base)?base:null,
      estimatedFinal:Number.isFinite(estimatedFinal)?estimatedFinal:null,
      units:validUnits?units:null,markup:validMarkup?markup:null,
      batchCost:complete?total:null,unitCost:complete?total/units:null,
      unitPrice:roundedPrice,salesTotal:roundedPrice===null?null:roundedPrice*units,
      lines
    };
  }
  function validPricingDraft(raw){
    if(!raw||!Array.isArray(raw.products)||raw.products.length<4||raw.products.length>MAX_ITEMS||
       !Number.isInteger(raw.next)||raw.next<1||raw.next>1e8||
       typeof raw.units!=='string'||raw.units.length>49||
       typeof raw.markup!=='string'||raw.markup.length>49)return false;
    const seen=new Set();
    for(const p of raw.products){
      if(!p||typeof p.id!=='string'||p.id.length>39||seen.has(p.id)||
         !['g','mL','un'].includes(p.unit)||typeof p.name!=='string'||p.name.length>149||
         !['pack','price','used'].every(k=>typeof p[k]==='string'&&p[k].length<49))
         return false;
      seen.add(p.id);
      if(['base','ess','ext','lau'].includes(p.id)){
        if(p.type!==p.id||p.unit!==(p.id==='base'?'g':'mL'))return false;
      } else if(p.type!=='custom'||!/^extra-\d+$/.test(p.id))return false;
    }
    return ['base','ess','ext','lau'].every(id=>seen.has(id));
  }
  window.SabonetePricing=Object.freeze({
    capture:()=>clone(state),
    summary:pricingSummary,
    apply:raw=>{
      if(!validPricingDraft(raw))return false;
      const snapshot=clone(state);
      try{
        localStorage.setItem(KEY,JSON.stringify(raw));
        state={products:clone(DEFAULT_PRODUCTS),...baseDefaults,next:1};
        load();
        for(const [id,key] of Object.entries(formFields))byId(id).value=state[key];
        renderRows();
        calculate();
        return true;
      }catch(_){
        state=snapshot;
        for(const [id,key] of Object.entries(formFields))byId(id).value=state[key];
        renderRows();calculate();
        return false;
      }
    }
  });
  renderRows();
  calculate();
})();