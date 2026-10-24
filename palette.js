/* Misturador ilustrativo de corantes liquidos para bases glicerinadas.
   Proporcoes nao sao dosagens recomendadas nem previsoes exatas da cor. */
(() => {
  'use strict';
  const COLORS = [
    ['vermelho','Vermelho','#dd3441',{vermelho:1},'No sistema tradicional vermelho/amarelo/azul, vermelho e primario. Use corante vermelho proprio; amarelo e azul nao formam vermelho.'],
    ['vermelho-cmy','Vermelho misturado','#e44540',{magenta:2,amarelo:1},'Alternativa em corantes ciano/magenta/amarelo: teste 2 partes de magenta e 1 de amarelo. Pode ficar mais coral e depende da concentracao de cada corante.'],
    ['laranja','Laranja','#f28a28',{amarelo:2,vermelho:1},'Duas partes de amarelo para uma de vermelho, apenas como ponto inicial.'],
    ['amarelo','Amarelo','#ebc737',{amarelo:1},'Amarelo e primario no conjunto tradicional. Use corante amarelo proprio.'],
    ['verde','Verde','#43a16a',{amarelo:1,azul:1},'Comece com partes iguais de amarelo e azul.'],
    ['verde-lima','Verde-lima','#a0c845',{amarelo:3,azul:1},'Comece com tres partes de amarelo para uma de azul.'],
    ['azul','Azul','#3978ca',{azul:1},'Azul e primario no conjunto tradicional. Use corante azul proprio.'],
    ['verde-agua','Verde-agua','#2ba7a2',{azul:3,amarelo:1},'Azul com um pouco de amarelo. Turquesa vivo pode exigir corante ciano pronto.'],
    ['roxo','Roxo','#8551b6',{vermelho:1,azul:1},'Partes iguais de vermelho e azul: pode ficar amarronzado se os pigmentos nao forem adequados.'],
    ['lilas','Lilas','#ad9bd3',{vermelho:1,azul:1},'Mistura do roxo em menor intensidade ou em base branca, que suaviza os tons.'],
    ['rosa','Rosa','#e997ac',{vermelho:1},'Corante vermelho em quantidade menor e/ou base branca. Pode ser melhor usar corante rosa pronto.'],
    ['coral','Coral','#ef7a6d',{vermelho:2,amarelo:1},'Dois volumes de vermelho para um de amarelo, clareando conforme o tipo de base.'],
    ['marrom','Marrom','#936d4f',{amarelo:2,vermelho:1,azul:1},'Mistura experimental das tres primarias. Corante marrom pronto e mais previsivel.']
  ];
  const lookup = id => document.getElementById(id);
  const palette = lookup('colorPalette');
  if (!palette) return;
  const names = {vermelho:'Vermelho',amarelo:'Amarelo',azul:'Azul',magenta:'Magenta'};
  const hex = {vermelho:'#dd3441',amarelo:'#ebc737',azul:'#3978ca',magenta:'#d148a3'};
  const fmt = new Intl.NumberFormat('pt-BR', {minimumFractionDigits:2,maximumFractionDigits:3});
  let selected = COLORS[0];
  const numberFromText = text => {
    const input = String(text).trim().replace(/\s+/g,'');
    return /^\d+(?:[.,]\d+)?$/.test(input) ? Number(input.replace(',','.')) : NaN;
  };
  COLORS.forEach(item => {
    const button = document.createElement('button');
    button.type='button';button.className='color-choice';
    button.setAttribute('aria-label','Escolher '+item[1]);
    button.setAttribute('aria-pressed',String(item===selected));
    const dot=document.createElement('span');
    dot.className='color-dot';dot.style.backgroundColor=item[2];dot.setAttribute('aria-hidden','true');
    const name=document.createElement('span');name.textContent=item[1];
    button.append(dot,name);
    button.addEventListener('click',()=>{selected=item;render();});
    palette.append(button);
  });
  function render() {
    const choiceButtons=palette.querySelectorAll('button');
    choiceButtons.forEach((button,i)=>button.setAttribute('aria-pressed',String(COLORS[i]===selected)));
    lookup('selectedColor').textContent=selected[1];
    lookup('selectedSwatch').style.backgroundColor=selected[2];
    lookup('colorHint').textContent=selected[4];
    const baseInput=numberFromText(lookup('weight').value);
    const finalTab=lookup('tabFinal').getAttribute('aria-pressed')==='true';
    const base=finalTab?baseInput/1.25:baseInput;
    lookup('colorBatch').textContent=Number.isFinite(base)&&base>0 ?
      'Base no calculo atual: '+fmt.format(base)+' g. A dose total de corante nao e definida automaticamente.' :
      'Informe um peso valido na calculadora de sabonete acima.';
    const entered=lookup('colorTotal').value.trim();
    const total=entered ? numberFromText(entered) : 1;
    const isExample=!entered;
    if(!Number.isFinite(total)||total<=0||total>100000) {
      lookup('mixHeading').textContent='Informe um total de corante valido, maior que zero.';
      lookup('colorRows').replaceChildren();
      lookup('colorSummary').textContent='';
      return;
    }
    const parts=Object.entries(selected[3]);
    const totalParts=parts.reduce((s,item)=>s+item[1],0);
    lookup('mixHeading').textContent='Proporcao: '+parts.map(([name,p])=>p+' '+(p===1?'parte':'partes')+' de '+name).join(' + ');
    const body=lookup('colorRows');
    body.replaceChildren();
    parts.forEach(([name,quantity])=>{
      const tr=document.createElement('tr'),label=document.createElement('td'),result=document.createElement('td');
      const dot=document.createElement('span');
      dot.className='small-swatch';dot.style.backgroundColor=hex[name];
      label.append(dot,document.createTextNode('Corante '+names[name]));
      result.textContent=fmt.format(total*quantity/totalParts)+' mL';
      tr.append(label,result);body.append(tr);
    });
    lookup('colorSummary').textContent=isExample ?
      'Exemplo matematico para 1,00 mL total. NAO e recomendacao para adicionar 1 mL ao sabonete.' :
      'Total dividido: '+fmt.format(total)+' mL. Confira a dosagem maxima permitida pelo fabricante.';
  }
  lookup('colorTotal').addEventListener('input',render);
  lookup('weight').addEventListener('input',render);
  lookup('tabBase').addEventListener('click',render);
  lookup('tabFinal').addEventListener('click',render);
  render();
})();
