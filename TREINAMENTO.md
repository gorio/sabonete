# Treinamento online — Sabonete Vegetal

## Objetivo
Criar um percurso didático para artesãos que utilizam base glicerinada vegetal **pronta para derreter e moldar**, com vídeo-aulas curtas, atividades práticas e ferramentas da calculadora. Não é um curso de saponificação com soda.

**Situação em 25/10/2026:** estrutura do curso e atividades disponíveis; nenhuma vídeo-aula foi fornecida, gravada ou publicada. O site mostra explicitamente essa condição.

## Formato
- 5 módulos, 13 aulas planejadas, duração editorial estimada em aproximadamente 2h30 (sujeita a alterações após gravação).
- Cada aula: objetivo, roteiro resumido, vídeo real quando houver, atividade prática e atalho para a ferramenta pertinente.
- Conclusão de atividade opcional no navegador; não é certificação nem confirmação de visualização.
- Acesso público. Sem login, pagamentos, upload de vídeo ou biblioteca privada nesta fase.

## Grade
| Módulo | Aulas |
| --- | --- |
| 1. Começando com segurança | A01 Boas-vindas e visão geral; A02 Organização, higiene e equipamentos; A03 Lendo fichas técnicas |
| 2. Receitas e cálculos | A04 Gramas, mililitros e densidade; A05 Calculando o tamanho do lote; A06 Essências, extratos e tensoativos |
| 3. Da bancada à forma | A07 Derretimento e temperaturas; A08 Mistura de cores e testes; A09 Moldes, rendimento e registro |
| 4. Custos e preço de venda | A10 Cadastrando matérias-primas; A11 Preço por sabonete e margem |
| 5. Qualidade e projeto final | A12 Qualidade, identificação e cuidados de venda; A13 Projeto final |

## Modelo de gravação
1. Abertura curta com objetivo da aula.
2. Explicação simples do conceito e riscos relevantes.
3. Demonstração em bancada ou na calculadora, com medidas visíveis.
4. Erros comuns e o que conferir no fabricante.
5. Atividade prática, atalho para a ferramenta e fechamento.

### Roteiro-base: Aula 01 — Boas-vindas e visão geral (cerca de 7 minutos planejados)
- **00:00–00:40 — Apresentação:** explicar o curso e a proposta de aprender a preparar, calcular e precificar sabonetes com base pronta.
- **00:40–02:00 — Qual produto estamos abordando:** base glicerinada pronta, geralmente chamada de *melt and pour*. Diferenciar de uma produção de sabonete do zero.
- **02:00–03:20 — O fluxo de trabalho:** escolher a base e ler a ficha técnica; separar materiais; calcular lote; preparar; moldar; registrar quantidades; calcular custo e preço.
- **03:20–04:45 — Demonstração da plataforma:** navegar por Receita, Matérias-primas, Preço de venda, Cores e Temperaturas.
- **04:45–06:00 — O que a calculadora pode e não pode afirmar:** a fórmula 8/7/10 é uma proporção informada, não dosagem recomendada; sem densidade, o peso final é estimado. Respeitar os limites de cada fabricante.
- **06:00–07:00 — Atividade e fechamento:** orientar o aluno a registrar a marca da base e listar o sabonete que pretende planejar.

**Sugestões de captação:** visão de bancada com produtos reais identificados, close em uma balança e um termômetro, captura de tela da calculadora e alertas de segurança legíveis.

## Como publicar vídeo-aulas
1. Grave, edite e publique a vídeo-aula em canal autorizado de hospedagem (exemplo: YouTube).
2. Em `training.js`, encontre o objeto com `id:'a01'` (ou a aula desejada).
3. Adicione a propriedade `youtubeId:'XXXXXXXXXXX'` com o **ID verdadeiro de 11 caracteres** do vídeo. Não use URL inteira.
4. Faça commit. O GitHub Pages carregará o vídeo incorporado na aula.
5. Valide reprodução, áudio, legenda, acessibilidade, duração e link relacionado.
6. No site, aula sem ID válido mostra "Vídeo-aula em preparação". Não divulgar como assistida ou certificada.

## Cuidados técnicos e de conteúdo
- Não informar uma temperatura universal ou limite de essência universal. Sempre referenciar fabricante e ficha técnica.
- Exigir compatibilidade entre base e aditivos; verificar o documento IFRA categoria 9 da fragrância quando aplicável.
- Não converter g e mL sem densidade; peso final aproximado deve vir identificado como estimativa.
- Descrever precificação com **acréscimo sobre custo (markup)**, que não é o mesmo que margem ou lucro líquido.
- Antes de apresentar orientação de comercialização, validar informações sanitárias, exigências de rotulagem e responsabilidades aplicáveis ao caso.
- Não emitir certificado ou alegação de conclusão de curso por simples marcação de atividades.
- O progresso é local (`localStorage`, chave `sabonete-treinamento-v1`), sem conta de aluno ou sincronização.

## Próximas etapas
- Receber vídeos reais e materiais complementares.
- Transcrever e revisar legendas das aulas.
- Adicionar PDFs de exercícios, checklist e fichas técnicas somente após revisão.
- Considerar autenticação, histórico por aluno e certificados apenas se houver necessidade real e infraestrutura de dados apropriada.
