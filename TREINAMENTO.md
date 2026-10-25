# Escola do Artesão — Três produtos digitais

**Situação em 25/10/2026:** estrutura comercial e curricular criada. As vídeo-aulas ainda não foram gravadas/publicadas. Não há checkout, preço de venda definido, autenticação de alunos, bloqueio de conteúdo pago ou certificados.

## Posicionamento comercial

A ferramenta de cálculo permanece **gratuita** e pode ser usada como porta de entrada para três **treinamentos separados**. Cada um resolve uma etapa diferente. A proposta é oferecer Basic -> Intermediate -> Advanced como progressão de aprendizado e, depois, permitir upgrades opcionais.

| Produto | Posicionamento | Transformação principal | Aulas planejadas |
|---|---|---|---:|
| 01 — Básico | Comece com confiança | Conhecer base pronta, equipamentos, segurança, medidas e primeiro lote | 5 |
| 02 — Intermediário | Produza com consistência | Planejar aditivos, temperatura, cor, moldes, rendimento e precificação | 6 |
| 03 — Avançado | Estruture o negócio artesanal | Qualidade, documentação, lotes, estoque, kits, encomendas e gestão | 7 |

Os treinamentos tratam de sabonete em barra com **base glicerinada vegetal pronta para derreter e moldar**, e não de saponificação do zero. A fórmula volumétrica 8/7/10 informada pelo usuário não foi validada como receita segura.

## Programa Básico — 5 aulas
- A01 — Boas-vindas e visão geral
- A02 — Organização, higiene e equipamentos
- A03 — Lendo fichas técnicas
- A04 — Gramas, mililitros e densidade
- A05 — Calculando o tamanho do lote

Resultado do aprendizado: o aluno compreende o processo, sabe medir ingredientes com cuidado e simula um lote na calculadora, sem tratar a proporção como aprovação da formulação.

## Programa Intermediário — 6 aulas
- A06 — Essências, extratos e tensoativos
- A07 — Derretimento e temperaturas
- A08 — Mistura de cores e testes
- A09 — Moldes, rendimento e registro
- A10 — Cadastrando matérias-primas
- A11 — Preço por sabonete e margem

Resultado do aprendizado: um roteiro de produção mais padronizado, uma ficha de ingredientes e um cálculo unitário de custos e preço comercial.

## Programa Avançado — 7 aulas
- A12 — Qualidade, identificação e cuidados de venda
- A13 — Projeto final: da receita ao preço
- A14 — Planejamento de produção e capacidade
- A15 — Estoque e rastreabilidade de insumos
- A16 — Preço para kits, encomendas e atacado
- A17 — Controle de pedidos, produção e entregas
- A18 — Plano de operação e evolução do negócio

Resultado do aprendizado: um plano operacional com registros de lote, controles de insumos e simulações de precificação para pedidos e kits. Aulas sobre requisitos regulatórios orientam a consultar fontes oficiais e profissionais, não substituem avaliação legal/técnica.

## Funil proposto
1. **Descoberta:** calculadora gratuita, vídeos curtos e conteúdo educacional.
2. **Primeira compra:** produto Básico, com foco no primeiro lote.
3. **Upsell 1:** apresentar produto Intermediário a quem demonstrar interesse em padronizar e precificar.
4. **Upsell 2:** apresentar produto Avançado a quem quiser estruturar produção e vendas.
5. **Pós-venda:** materiais complementares e eventualmente ofertas de pacote, somente após definir os direitos e os preços de cada produto.

**Não há ofertas comerciais ativas neste momento.** Os botões na página alternam o programa visualizado, sem simular compra, inscrição, pagamento ou acesso garantido. Um fluxo de upsell verdadeiro precisa de checkout configurado, controle de permissões, regras de desconto/crédito claras e confirmação de compra real.

## Entregáveis a produzir
- Para cada aula: roteiro revisado, gravação real, edição, título, descrição, legendas, atividade prática e material complementar quando necessário.
- Para cada produto: página de oferta com conteúdo, duração **real após gravação**, preço, entregáveis e política de acesso.
- Para os três produtos: regras de upgrade, acesso, reembolso, suporte e atualizações, definidas antes de vender.
- Banco de dados/serviço autenticado para vídeos pagos, permissões e progressos (quando a venda começar). **Não publicar URLs ou arquivos de vídeos pagos em um repositório/cliente público.**

## Publicação de vídeos e segurança
No atual `training.js`, somente vídeos marcados explicitamente como `isPublicPreview:true` podem ser incorporados via `youtubeId`. Isso é apropriado apenas para **amostras públicas** autorizadas. Não adicionar identificadores de vídeo pago ao JavaScript do GitHub Pages, nem confiar em IDs não listados para restringir acesso.

As aulas sem vídeo mostram "Vídeo-aula em preparação". Marcar uma atividade no navegador não comprova que um vídeo foi assistido, não emite certificado e não substitui registro em plataforma de ensino.

## Roteiro de gravação de uma aula
1. Abertura com objetivo e contexto.
2. Conceito, termos e riscos relevantes.
3. Demonstração com ingredientes identificados ou com a calculadora.
4. Erros comuns e verificação da ficha técnica.
5. Atividade prática, atalho para a ferramenta e fechamento.

### Aula A01 — Boas-vindas e visão geral (~7 min planejados)
- 00:00–00:40: apresentar a proposta da Escola do Artesão e seus três níveis.
- 00:40–02:00: explicar base glicerinada pronta versus processo com soda.
- 02:00–03:20: mostrar o fluxo de bancada e o conceito de controle do lote.
- 03:20–04:45: apresentar os menus da calculadora.
- 04:45–06:00: explicar que g e mL diferem e que limites do fabricante devem ser seguidos.
- 06:00–07:00: orientar exercício do aluno e apresentar o programa Intermediário como caminho posterior, sem pressão comercial.

## Controle da versão pública
- Seção `#treinamento` com três cards.
- Programa selecionado, lista, atividades e player do nível correspondente.
- Progressos locais mantidos na chave `sabonete-treinamento-v1`, preservando dados existentes.
- Navegação Básico -> Intermediário -> Avançado por convite de próximo nível.
- O sistema público não cadastra matrículas, não recebe pagamentos e não protege vídeos de assinantes.

## Cuidados obrigatórios
- Para a base e cada aditivo, verificar ficha técnica, aquecimento permitido, compatibilidade e carga máxima.
- Para fragrância, verificar limite aplicável no certificado IFRA categoria 9. Para tensoativo, identificar tipo e teor ativo.
- Não confundir gramas e mililitros nem transformar estimativa de densidade em fato.
- Para comercialização, validar as exigências sanitárias e de rotulagem com fontes competentes e profissionais.
- "Markup" sobre custo não é equivalente a margem sobre venda ou lucro líquido.
