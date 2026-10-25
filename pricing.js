/* Precos por embalagem, quantidade utilizada pela receita 8/7/10 e custo por unidade.
   O fator 1,25 e estimativa provisoria de massa: 1g/mL para os tres aditivos.
   Nao confundir com peso final medido. */
(() => {
  'use strict';
  const el = id => document.getElementById(id);
  if (!el('venda')) return;
  const cfg = [
    {key:'base', qty:'p_base_qty',price:'p_base_price',cost:'p_base_used',factor:1},
    {key:'ess', qty:'p_ess_qty',price:'p_ess_price',cost:'p_ess_used',factor:0.08},
    {key:'ext', qty:'p_ext_qty',price:'p_ext_price',cost:'p_ext_used',factor:0.07},
    {key:'lau', qty:'p_lau_qty',price:'p_lau_price',cost:'p_lau_used',factor:0.10}
  ];
  const tracked = [
    ...cfg.flatMap(x => [x.qty,x.price]),
    'p_bar_weight','p_sale','p_pack','p_other','p_fee'
  ];
  const fmtBR = new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const fmtInt = new Intl.NumberFormat('pt-BR',{maximumFractionDigits:0});
  const money = v => Number.isFinite(v) ? 'R$ '+fmtBR.format(v) : '—';
  const grams = v => Number.isFinite(v) ? fmtBR.format(v)+' g' : '—';
  const valid = v => Number.isFinite(v) && v>=0 && v<=1e10;
  const nonZero = v => valid(v) && v>0;
  const read = id => {
    const raw=el(id).value.trim().replace(/\s+/g,'');
    if(!raw)return NaN;
    /* BR 3.000,50; BR 12,5; numeric 12.5 */
    const t = /^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(raw)
      ? raw.replace(/\./g,'').replace(',','.')
      : raw.replace(',','.');
    if(!/^\d+(?:\.\d+)?$/.test(t)) return NaN;
    return Number(t);
  };
  const out = (id,value) => {el(id).textContent=value;};
  const storageKey='sabonete-precos-v1';
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');
    if(saved && typeof saved==='object')tracked.forEach(id=>{
      if(typeof saved[id]==='string' && saved[id].length<40)el(id).value=saved[id];
    });
  } catch(_) {}
  function save(){
    try {
      const record={};
      tracked.forEach(id=>record[id]=el(id).value);
      localStorage.setItem(storageKey,JSON.stringify(record));
    }catch(_) {}
  }
  function calculate(){
    const amount=read('weight');
    const finalMode=el('tabFinal').getAttribute('aria-pressed')==='true';
    const base=nonZero(amount)?(finalMode?amount/1.25:amount):NaN;
    const target=read('p_bar_weight');
    const goodTarget=nonZero(target);
    const unitBase=goodTarget?target/1.25:NaN;
    let batchRaw=0,unitRaw=0,missing=[];
    for(const item of cfg){
      const pack=read(item.qty), price=read(item.price);
      const ok=nonZero(pack) && valid(price);
      const used=base*item.factor;
      const unitUsed=unitBase*item.factor;
      out('p_'+item.key+'_amount','Uso: '+(Number.isFinite(used)?fmtBR.format(used)+(item.key==='base'?' g':' mL'):'—'));
      if(!ok){
        missing.push(item.key);
        out(item.cost,'—');
        continue;
      }
      const unitCost=price/pack;
      out(item.cost,Number.isFinite(used)?money(used*unitCost):'—');
      if(Number.isFinite(base))batchRaw+=used*unitCost;
      if(Number.isFinite(unitBase))unitRaw+=unitUsed*unitCost;
    }
    const calcReady=missing.length===0 && nonZero(base) && goodTarget;
    const packCost=read('p_pack'),otherCost=read('p_other'),fee=read('p_fee'),sale=read('p_sale');
    const extrasOK=valid(packCost)&&valid(otherCost)&&valid(fee)&&fee<=100;
    const approximateTotal=base*1.25;
    const units=Number.isFinite(approximateTotal)&&goodTarget
      ?Math.floor(approximateTotal/target+1e-9):NaN;
    const remainder=Number.isFinite(units)?Math.max(0,approximateTotal-units*target):NaN;
    out('p_yield',Number.isFinite(units)?fmtInt.format(units)+' unidade(s)':'—');
    out('p_leftover',Number.isFinite(remainder)?'Sobra teórica: '+grams(remainder):'Sobra teórica: —');
    out('p_batch_total',missing.length===0 && nonZero(base)?money(batchRaw):'—');
    out('p_unit_raw',calcReady?money(unitRaw):'—');
    const unitNoSale=calcReady&&extrasOK ?unitRaw+packCost+otherCost:NaN;
    const hasSale=nonZero(sale);
    const saleFee=hasSale && extrasOK?sale*fee/100:NaN;
    const fullCost=hasSale&&Number.isFinite(unitNoSale)?unitNoSale+saleFee:unitNoSale;
    out('p_unit_cost',Number.isFinite(fullCost)?money(fullCost):'—');
    const profit=hasSale&&Number.isFinite(fullCost)?sale-fullCost:NaN;
    out('p_profit',money(profit));
    out('p_margin',Number.isFinite(profit)?fmtBR.format(profit/sale*100)+'%':'—');
    out('p_markup',Number.isFinite(profit)&&fullCost>0?fmtBR.format(profit/fullCost*100)+'%':'—');
    const issues=[];
    if(!nonZero(base))issues.push('Informe um peso válido na calculadora principal.');
    if(!goodTarget)issues.push('Informe um peso por sabonete maior que zero.');
    const labels={base:'base vegetal',ess:'essência',ext:'extrato de hamamélis',lau:'lauril'};
    missing.forEach(key=>issues.push('Informe quantidade da embalagem e preço de '+labels[key]+'.'));
    if(!extrasOK)issues.push('Confira embalagem, custos extras e taxa de venda (entre 0% e 100%).');
    if(!hasSale)issues.push('Informe o preço de venda para calcular lucro e margem.');
    out('p_status',issues.join(' '));
    el('p_status').hidden=issues.length===0;
    out('p_assumptions','Rendimento e custo por sabonete usam peso final teórico (1 mL ≈ 1 g para cada líquido). Não incluem desperdício; ajuste outros custos para representar perdas, mão de obra, energia, corantes e frete conforme seu caso.');
    out('p_recipe_batch',nonZero(base)?'Ingredientes para '+grams(base)+' de base.':'Informe o peso da receita acima.');
  }
  tracked.forEach(id=>el(id).addEventListener('input',()=>{save();calculate();}));
  el('weight').addEventListener('input',calculate);
  el('tabBase').addEventListener('click',calculate);
  el('tabFinal').addEventListener('click',calculate);
  calculate();
})();