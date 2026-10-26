# Auditoria da precificação — 26/10/2026

## Sintoma observado nas capturas do usuário
- Receita em modo **peso final desejado de 50 g**: base 40 g; essência 3,20 mL; extrato 2,80 mL; lauril 4 mL.
- Tela de Venda mostrava **4 de 5 ingredientes completos** e não apresentava preço sugerido.
- Aparecia custo conhecido de **R$ 2,33 por unidade** e **R$ 2,33 no lote**, compatível com rendimento informado de **uma unidade**.
- A captura não inclui o cadastro completo do quinto item nem o `localStorage` do navegador. **Não é possível afirmar o nome ou o dado faltante apenas com as imagens.** A interface anterior não tornava a causa suficientemente clara.

## Causas técnicas no código anterior
1. Todo registro de matéria-prima customizada contava como ingrediente obrigatório, **inclusive um item adicional completamente vazio** deixado no cadastro.
2. A interface de venda ocultava o preço, mas exibia o subtotal dos ingredientes calculados sem destacá-lo como **parcial**.
3. A identificação exata da pendência ficava no menu de Matérias-primas, desconectada da tela de Venda.
4. A variável de apresentação `complete` não verificava se o acréscimo era válido.
5. A apresentação do peso por unidade não diferenciava adequadamente o peso esperado de cada peça e a **massa de materiais incluindo reserva para perdas** lançada pelo módulo de moldes.

## Correções realizadas
- **Rascunho customizado inteiramente vazio:** mantido no navegador, mas ignorado no total de ingredientes ativos e no custo, sem bloquear o preço.
- **Ingrediente parcialmente preenchido:** permanece exigido, nomeado como pendente e com motivo de validação específico (nome, embalagem, preço, uso ou possível confusão entre mL/L).
- **Atalho para corrigir:** a tela de venda aponta para o cadastro do primeiro produto incompleto e leva o foco até o campo pendente.
- **Custos parciais destacados:** valores conhecidos continuam visíveis para diagnóstico, mas nunca são rotulados como total final nem geram preço de venda enquanto faltar custo necessário.
- **Validação unificada:** o motor `SabonetePricing.summary()`, usado pelo Meu Ateliê, utiliza a mesma regra de validação da tela.
- **Rendimento informado:** a interface esclarece que, com apenas 1 sabonete, custo por unidade e custo do lote são iguais.
- **Margem inválida:** impede a conclusão da precificação.
- **Peso e reserva:** documentação na tela diferencia materiais consumidos por unidade e peso físico esperado de cada barra.
- **Persistência preservada:** não apagamos a chave `sabonete-precos-v2`, nem preços, nem matérias-primas salvas. A correção não atribui automaticamente um preço ou volume a ingrediente incompleto.

## Testes de regressão
Arquivo: `tests/pricing-regression.test.mjs` (Node.js, `node --test`).

Cenários automatizados:
1. Quatro ingredientes principais geram preço final com custo conhecido.
2. Item customizado 100% vazio não altera o preço nem o cadastro armazenado.
3. Item parcialmente preenchido bloqueia preço e detalha a pendência.
4. Ingrediente adicional completo é corretamente somado.
5. Embalagem suspeita de 1 mL (muito menor que consumo) bloqueia cálculo e pede revisão da unidade.
6. Acréscimo inválido ou rendimento não inteiro não liberam preço.
7. O botão de correção abre o cadastro e foca o campo pendente.
8. Rendimentos com mais de uma unidade preservam os valores do lote.

CI: `.github/workflows/pricing-tests.yml` executa o conjunto em cada alteração relevante.

## Limite do cálculo físico
Esta plataforma calcula a proporção informada de **8 mL de essência + 7 mL de extrato + 10 mL de lauril por 100 g de base pronta**. Esses são volumes relativos ao peso da base, não percentuais em massa. O cálculo inverso para peso final usa provisoriamente 1 g/mL por aditivo, **hipótese apenas matemática**. Validar as densidades, compatibilidade e limites do fabricante, inclusive certificado IFRA categoria 9 da fragrância, antes de fabricar ou comercializar. O problema de preço corrigido aqui não substitui a avaliação técnica da receita.
