import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const src=readFileSync(new URL('../pricing.js',import.meta.url),'utf8');

class Element {
  constructor(tag,id=''){
    this.tagName=tag;this.id=id;this.children=[];this.dataset={};
    this.attrs={};this.listeners={};this.style={};this.className='';
    this.textContent='';this.value='';this.hidden=false;this.disabled=false;
    this.open=false;
    this.classList={toggle:(name,value)=>{this.attrs['class:'+name]=value}};
  }
  append(...items){this.children.push(...items);for(const e of items)if(e instanceof Element)e.parent=this}
  replaceChildren(...items){this.children=items;for(const e of items)if(e instanceof Element)e.parent=this}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(e=>e!==this)}
  setAttribute(k,v){this.attrs[k]=v}
  getAttribute(k){return this.attrs[k]??null}
  addEventListener(k,f){(this.listeners[k]??=[]).push(f)}
  click(){for(const f of this.listeners.click??[])f();if(typeof this.onclick==='function')this.onclick()}
  fire(k){for(const f of this.listeners[k]??[])f()}
  focus(){this.focused=true}
  scrollIntoView(){}
  querySelector(query){
    const nodes=[];const walk=e=>{for(const c of e.children)if(c instanceof Element){nodes.push(c);walk(c)}};walk(this);
    if(query==='input')return nodes.find(e=>e.tagName==='input')??null;
    if(query.startsWith('.'))return nodes.find(e=>e.className.split(/\s+/).includes(query.slice(1)))??null;
    const role=query.match(/^\[data-role="([^"]+)"\]$/);
    return role?nodes.find(e=>e.dataset.role===role[1])??null:null;
  }
}
const ids=('venda p_products p_add p_units p_markup_input p_sale_price p_hero p_sale_label p_cost_unit '+
 'p_batch_total p_breakdown_rows p_breakdown_unit_total p_breakdown_lot_total p_total_sale '+
 'p_units_copy p_lot_sale p_total_sale_label p_total_sale_note p_price_explainer p_recipe_batch '+
 'p_unit_weight markup-note p_status p_pending p_pending_title p_pending_text p_pending_fix '+
 'p_cost_unit_label p_batch_total_label p_units_hint weight tabBase tabFinal').split(' ');
const products=[
{id:'base',type:'base',name:'Base vegetal',unit:'g',pack:'3000',price:'78,89',used:''},
{id:'ess',type:'ess',name:'Essência',unit:'mL',pack:'100',price:'26,60',used:''},
{id:'ext',type:'ext',name:'Extrato',unit:'mL',pack:'100',price:'12,00',used:''},
{id:'lau',type:'lau',name:'Lauril',unit:'mL',pack:'1000',price:'26,00',used:''}
];
const copy=o=>JSON.parse(JSON.stringify(o));
const extra=(fields={})=>({id:'extra-1',type:'custom',name:'',unit:'mL',
pack:'',packUnit:'mL',price:'',used:'',usedUnit:'mL',...fields});
function setup({custom=null,markup='150',units='1',extractPack='100'}={}){
 const elements=Object.fromEntries(ids.map(id=>[id,new Element('div',id)]));
 elements.weight.value='50';
 elements.tabFinal.attrs['aria-pressed']='true';
 const list=copy(products);list[2].pack=extractPack;if(custom!==null)list.push(extra(custom));
 const draft={products:list,units,markup,next:custom!==null?2:1};
 const localStorage={
   data:{'sabonete-precos-v2':JSON.stringify(draft)},
   getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=v}
 };
 const document={createElement:tag=>new Element(tag),getElementById:id=>elements[id]??null,activeElement:null};
 const window={location:{hash:''},setTimeout:fn=>fn()};
 runInNewContext(src,{document,localStorage,window,Intl,Number,String,JSON,Array,Map,Object,Set,Math});
 return {elements,localStorage,window,summary:window.SabonetePricing.summary()};
}

test('four core products produce a final sale price and equal per-lot cost when yield is one',()=>{
 const {elements:e,summary}=setup();
 assert.equal(summary.complete,true);
 assert.match(e.p_sale_price.textContent,/R\$\s*5,86/);
 assert.equal(e.p_cost_unit.textContent,e.p_batch_total.textContent);
 assert.match(e.p_units_hint.textContent,/1 sabonete/);
 assert.equal(e.p_pending.hidden,true);
});
test('entirely blank optional custom row never blocks sale or alters saved data',()=>{
 const baseline=setup(), x=setup({custom:{}});
 assert.equal(x.summary.complete,true);
 assert.equal(x.elements.p_sale_price.textContent,baseline.elements.p_sale_price.textContent);
 assert.equal(x.elements.p_breakdown_rows.children.length,4);
 assert.equal(JSON.parse(x.localStorage.data['sabonete-precos-v2']).products.length,5);
});
test('partially populated custom row blocks pricing, names missing field and clearly labels partial costs',()=>{
 const {elements:e,summary}=setup({custom:{name:'Corante'}});
 assert.equal(summary.complete,false);
 assert.equal(e.p_sale_price.textContent,'—');
 assert.equal(e.p_pending.hidden,false);
 assert.match(e.p_pending_text.textContent,/Corante.*quantidade comprada/i);
 assert.match(e.p_cost_unit_label.textContent,/parcial/i);
 assert.equal(e.p_breakdown_rows.children.length,5);
});
test('adding a complete extra updates both summary and final sale',()=>{
 const baseline=setup(), x=setup({custom:{name:'Corante',pack:'100',price:'10',used:'1'}});
 assert.equal(x.summary.complete,true);
 assert.equal(x.elements.p_pending.hidden,true);
 assert.notEqual(x.elements.p_sale_price.textContent,baseline.elements.p_sale_price.textContent);
});
test('implausible 1 mL package prompts clarification instead of multiplying costs by hundreds',()=>{
 const {elements:e,summary}=setup({extractPack:'1'});
 assert.equal(summary.complete,false);
 assert.match(e.p_pending_text.textContent,/mL ou L/);
 assert.equal(e.p_sale_price.textContent,'—');
 assert.match(e.p_cost_unit_label.textContent,/parcial/);
});
test('invalid markup or yield cannot release a final sale price',()=>{
 for(const cfg of [{markup:'abc'},{units:'0'},{units:'1,5'}]){
   const {elements:e,summary}=setup(cfg);
   assert.equal(summary.complete,false);
   assert.equal(e.p_sale_price.textContent,'—');
 }
});
test('fix button takes artisan to the missing ingredient and focuses the failing field',()=>{
 const {elements:e,window}=setup({custom:{name:'Corante'}});
 e.p_pending_fix.click();
 assert.equal(window.location.hash,'ingredientes');
 assert.equal(e.p_products.children[4].querySelector('[data-role="pack-quantity"]').focused,true);
});
test('unit conversion and saved markup do not alter existing prices unexpectedly',()=>{
 const x=setup({units:'20'});
 assert.equal(x.summary.complete,true);
 assert.equal(x.summary.units,20);
 assert.equal(x.summary.lines.length,4);
 assert.equal(x.summary.batchCost>0,true);
 assert.equal(x.elements.p_pending.hidden,true);
});
