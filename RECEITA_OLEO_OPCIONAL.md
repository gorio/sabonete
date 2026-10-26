# Óleo vegetal opcional — atualização de 26/10/2026

## Requisito implementado
A tela **Receita** mantém a fórmula original de base glicerinada pronta:
- 100 g de base vegetal
- 8 mL de essência
- 7 mL de extrato glicólico
- 10 mL de lauril

Acrescenta **Óleo vegetal (opcional): 2,5 mL por 100 g de base**, visível mesmo quando desativado. A caixa de seleção fica **desmarcada por padrão**. A seleção é mantida na chave local `sabonete-receita-v1`.

## Exemplos matemáticos
| Modo | Óleo | Base | Essência | Extrato | Lauril | Óleo | Peso final estimado |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Base de 100 g | Não | 100 g | 8 mL | 7 mL | 10 mL | 0 | 125 g |
| Base de 100 g | Sim | 100 g | 8 mL | 7 mL | 10 mL | 2,5 mL | 127,5 g |
| Peso final de 50 g | Não | 40 g | 3,2 mL | 2,8 mL | 4 mL | 0 | 50 g |
| Peso final de 50 g | Sim | ≈39,216 g | ≈3,137 mL | ≈2,745 mL | ≈3,922 mL | ≈0,980 mL | 50 g |

Fator ilustrativo de peso final no cálculo inverso:
- Óleo desativado: `base_g = peso_final_estimado_g / 1,25`.
- Óleo ativado: `base_g = peso_final_estimado_g / 1,275`.

**Importante:** os fatores dependem da hipótese **simplificadora** de 1 g/mL para os aditivos. Ela não é uma medição de densidade. Se houver densidades reais, o fator correto será `1 + (8*d_ess + 7*d_ext + 10*d_lau + 2,5*d_oleo)/100` quando óleo for usado.

## Integração
- **Receita (index.html):** checkbox, linha de óleo, mudança automática do peso e da proporção, seleção local.
- **Matérias-primas (pricing.js):** item padrão `oil`, com embalagem, unidade e preço cadastráveis. Quando o óleo está desativado, este item é ignorado no custo; quando ativado, passa a ser obrigatório precificar. Os outros quatro produtos continuam funcionando.
- **Preço de venda:** reavalia quantidades, custo de ingredientes ativos e preço de venda. Óleo ativado mas sem preço deve gerar pendência explícita, não valor inventado.
- **Formas e Moldes (molds.js):** utiliza o fator escolhido e apresenta a quantidade de óleo, sem ativá-lo automaticamente.
- **Meu Ateliê (atelier.js):** receitas novas salvam `includeOil` e recuperam essa seleção. Receitas antigas sem essa propriedade voltam sem óleo. Backups preservam a escolha no `form.includeOil` e os dados de compra na seção `pricing`.
- **Compatibilidade:** materiais customizados e preços anteriores permanecem armazenados no navegador; não são apagados ou migrados silenciosamente.

## Testes
A workflow `.github/workflows/pricing-tests.yml` executa testes Node de:
- receita padrão sem óleo;
- proporção com óleo e persistência da seleção;
- cálculo inverso de peso final com óleo;
- atualização do planejamento de moldes;
- preço de venda, pendências e custos com óleo ativado ou desativado;
- regressões dos materiais extras e conversões anteriores.

## Atenção à composição
Esta plataforma faz **escalonamento matemático de uma proporção fornecida**, não validação de uma formulação cosmética. Verificar na ficha técnica do fabricante se a base glicerinada pronta suporta **todos** os aditivos em conjunto (incluindo óleo). Óleo em excesso pode alterar textura, espuma e estabilidade. Conferir limites de fragrância aplicáveis (IFRA categoria 9), tipo de lauril, compatibilidade e rotulagem antes da produção ou venda.
