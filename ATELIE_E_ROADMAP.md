# Meu Ateliê — Biblioteca de Receitas e Assistente de Produção

## Entrega funcional (25/10/2026)

A plataforma pública em GitHub Pages ganhou a área **Meu Ateliê** (`#atelie`) com armazenamento local:

- **Biblioteca de receitas:** salva a receita atual com nome, peso (modo Base ou Peso Final), rendimento, markup, ingredientes, medidas, embalagens e preços cadastrados. Permite recuperar e excluir receitas com confirmação.
- **Assistente de produção:** cria planejamento de lote a partir dos dados atuais; congela o resumo de custo do planejamento; oferece checklist de quatro etapas; permite registrar conclusão explicitamente. Não baixa estoque.
- **Backup:** exporta um arquivo JSON contendo receitas, lote(s), preço atual e peso/mode atual; permite importar com validação de formato e confirmação prévia.
- **Persistência:** `localStorage`, chave `sabonete-atelie-v1` (até 40 receitas e 100 registros). O cadastro existente de preços continua na chave `sabonete-precos-v2`.
- **Sem infraestrutura privada:** sem cadastro de usuários, autenticação, sincronização, acesso pago, checkout, certificados ou estoque integrado nesta fase.

### Como salvar e reutilizar uma receita
1. Em **Receita**, escolha modo Base ou Peso Final e informe o peso.
2. Em **Matérias-primas**, confira produtos, embalagens, preços e quantidades usadas.
3. Em **Preço de venda**, confira unidades produzidas, custos e acréscimo.
4. Em **Meu Ateliê**, digite o nome e selecione **Salvar receita atual**.
5. Para recuperar depois, clique em **Usar receita**. A ação substitui o estado atual após confirmação; isto inclui **preços históricos da receita salva**. Revise preços novos antes de produzir.

### Como registrar o lote
1. Configure o lote na receita, matéria-prima e preço de venda.
2. Em **Meu Ateliê**, informe nome e notas e clique **Criar planejamento do lote**.
3. O custo salvo é o valor conhecido naquela data; se faltam preços, a interface mostra **Pendente** em vez de inventar um valor.
4. Marque quatro verificações e selecione **Registrar conclusão** após produzir.
5. Nenhuma ação movimenta estoque, gera nota fiscal ou certifica segurança do produto.

### Backup e restauração
- Faça download em **Meu Ateliê > Baixar backup**.
- Para transferir para outro dispositivo, abra **Meu Ateliê > Restaurar arquivo** e escolha o JSON.
- A restauração **substitui os dados locais do Ateliê e da precificação** após confirmação. Recomenda-se baixar antes um backup do dispositivo de destino.
- O formato inclui `format: "sabonete-backup", version: 1`; arquivo de importação limitado a 2 MB e com validação de estrutura.
- Não há sincronização em tempo real, backup na nuvem ou recuperação garantida depois de limpar dados do navegador.

## Arquivos
- `atelier.js` — biblioteca, lotes, backup e restauração.
- `atelier.css` — interface responsiva.
- `pricing.js` — interface `window.SabonetePricing.capture / apply / summary` para integrar o Ateliê à precificação existente.
- `index.html` e `app.js` — página, menu e navegação.

## Limites de formulação
A proporção **100 g base / 8 mL essência / 7 mL extrato / 10 mL lauril** é a receita informada para cálculo, não uma fórmula testada/validada. g e mL não são equivalentes; o peso final da fórmula é apenas uma estimativa ao assumir 1 g/mL quando faltam densidades. Os dados da base, fabricante, fragrância (IFRA categoria 9), tensoativo e extratos devem ser avaliados tecnicamente antes de produzir ou comercializar.

## Próximas fases técnicas

### Fase 2 — Usuários e banco de dados
- Fazer a migração para serviço **backend separado** com HTTPS, autenticação e autorização por conta.
- Entidades sugeridas: `users`, `materials`, `formulations`, `formulation_versions`, `batches`, `batch_ingredients`, `stock_movements`, `course_products`, `lessons`, `enrollments`, `lesson_progress`, `payments`, `payment_events`.
- Isolamento de dados por usuário, backups de banco, validação server-side, auditoria e política de privacidade/LGPD.
- Importar opcionalmente os dados do backup local após confirmação explícita.

### Fase 3 — Cursos e monetização
- Painel administrativo autenticado para títulos, roteiros, vídeos reais, conteúdos e preços.
- Checkout com confirmação de pagamento por webhook validado, permissões de acesso a cursos e regras claras de upgrade/upsell.
- Vídeos pagos nunca em arquivos públicos ou protegidos apenas por JavaScript em GitHub Pages.
- Área do aluno, progresso registrado no backend, suporte e materiais complementares.
- Critérios e operação explícitos antes de habilitar certificados.

### Fase 4 — Estoque e operações
- Cadastro de fornecedores e lotes comprados, validade quando cabível, entrada e movimentação de estoque com auditoria.
- Planejamento por molde, cálculo de necessidade, integração com receitas validadas.
- Registro de perdas e rendimento real, custo histórico e precificação de kits/encomendas.

### Testes de regressão essenciais
1. Abrir `#atelie` sem quebrar os outros menus.
2. Salvar receita, alterar a calculadora, recuperar a versão e conferir quantidades, preços e modo.
3. Planejar um lote sem preço completo e garantir que custo/resultado não sejam inventados.
4. Concluir lote somente após marcar checklist e confirmação do usuário.
5. Exportar JSON, simular outras alterações e restaurar com confirmação.
6. Conferir equivalências kg/g e L/mL sem converter massa/volume automaticamente.
7. Preservar os três treinamentos e a navegação entre Básico, Intermediário e Avançado.
