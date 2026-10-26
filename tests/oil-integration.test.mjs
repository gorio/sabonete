import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const inline=html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,'inline recipe calculator script should exist');
const molds=readFileSync(new URL('../molds.js',import.meta.url),'utf8');

class Control{
  constructor(id=''){
    this.id=id;this.value='';this.textContent='';this.attrs={};this.checked=false;this.hidden=false;
    this.children=[];this.listeners={};this.dataset={};
    this.classList={toggle:(label,value)=>{this.attrs['class:'+label]=value}};
  }
  getAttribute(k){return this.attrs[k]??null}
  setAttribute(k,v){this.attrs[k]=v}
  addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
  fire(k){for(const fn of this.listeners[k]??[])fn()}
  click(){this.fire('click')}
  append(...x){this.children.push(...x)}
  replaceChildren(...x){this.children=x}
}
function recipe(saved){
  const ids='weight weightLabel includeOil formula error base essencia extrato lauril oleo total finalLabel estimate tabBase tabFinal'.split(' ');
  const controls=Object.fromEntries(ids.map(id=>[id,new Control(id)]));
  controls.weight.value='100';
  controls.tabBase.attrs['aria-pressed']='true';
  const localStorage={data:{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=v}};
  if(saved)localStorage.setItem('sabonete-receita-v1',JSON.stringify(saved));
  const document={getElementById:id=>controls[id]??null};
  runInNewContext(inline,{document,localStorage,Intl});
  return {controls,localStorage};
}
test('standard formula remains unchanged when oil is off',()=>{
  const {controls:c}=recipe();
  assert.equal(c.includeOil.checked,false);
  assert.equal(c.total.textContent,'125,00 g');
  assert.equal(c.base.textContent,'100,00 g');
  assert.equal(c.oleo.textContent,'0,00 mL (não incluído)');
});
test('2.5mL of oil for each 100g base is displayed and persisted',()=>{
  const {controls:c,localStorage:s}=recipe();
  c.includeOil.checked=true;c.includeOil.fire('change');
  assert.equal(c.oleo.textContent,'2,50 mL');
  assert.equal(c.total.textContent,'127,50 g');
  assert.deepEqual(JSON.parse(s.data['sabonete-receita-v1']),{includeOil:true});
  const restored=recipe({includeOil:true});
  assert.equal(restored.controls.includeOil.checked,true);
  assert.equal(restored.controls.total.textContent,'127,50 g');
});
test('50g final weight changes inverse factor when optional oil is toggled',()=>{
  const {controls:c}=recipe();
  c.tabFinal.click();
  c.weight.value='50';c.weight.fire('input');
  assert.equal(c.base.textContent,'40,00 g');
  c.includeOil.checked=true;c.includeOil.fire('change');
  assert.equal(c.base.textContent,'39,22 g');
  assert.equal(c.oleo.textContent,'0,98 mL');
  assert.equal(c.total.textContent,'50,00 g');
  c.includeOil.checked=false;c.includeOil.fire('change');
  assert.equal(c.base.textContent,'40,00 g');
  assert.equal(c.total.textContent,'50,00 g');
});
test('molds include oil only when checked and preserve planned final mass',()=>{
  const ids=('moldes moldCavities moldGrams moldCycles moldReserve moldApply moldSave moldName '+
    'moldValidation moldTotalUnits moldFinishedMass moldBaseMass moldEssence moldExtract moldLauril '+
    'moldOil moldSummary moldLibrary moldLibraryCount moldNotice includeOil').split(' ');
  const c=Object.fromEntries(ids.map(id=>[id,new Control(id)]));
  const doc={getElementById:id=>c[id]??null,createElement:()=>new Control()};
  const localStorage={getItem(){return null},setItem(){}};
  const window={};
  runInNewContext(molds,{document:doc,localStorage,window,Intl,Math,Number});
  assert.equal(c.moldBaseMass.textContent,'840 g');
  assert.equal(c.moldOil.textContent,'0 mL (não incluído)');
  c.includeOil.checked=true;c.includeOil.fire('change');
  assert.equal(c.moldBaseMass.textContent,'823,53 g');
  assert.equal(c.moldOil.textContent,'20,59 mL');
  assert.equal(c.moldFinishedMass.textContent,'1.050 g estimados');
});
