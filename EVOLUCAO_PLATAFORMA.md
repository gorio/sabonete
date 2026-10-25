# Evolução da plataforma — fase de produção por moldes e fundação privada

## Entrega funcional no site público

A ferramenta **Formas e Moldes** fica em `#moldes` e permite:
- Informar cavidades por forma, peso final estimado em g por cavidade, número de preenchimentos e reserva de preparo (0 a 30%).
- Calcular unidades previstas e a quantidade teórica de base, essência, extrato e lauril a partir da proporção informada de **100 g de base / 8 mL essência / 7 mL extrato / 10 mL lauril**.
- Aplicar o resultado ao modo "Quero peso final" da calculadora e atualizar o rendimento de venda. Ao existir ingrediente com uso editado manualmente ou matéria-prima adicional, a ferramenta **avisa** que o uso não será redimensionado automaticamente.
- Salvar até 25 moldes por navegador, reutilizar e excluir.
- Incluir os moldes nos backups gerados pelo Meu Ateliê. Backups antigos permanecem compatíveis.
- Ver indicadores do Meu Ateliê: receitas salvas, lotes planejados e lotes declarados concluídos.
- A aula Intermediária sobre moldes aponta diretamente para a ferramenta.

**Limitações matemáticas e de segurança**: peso final e consumo em função dele são aproximações **dependentes das densidades reais**, não afirmações de massa/volume equivalentes nem aprovação de dosagem. A capacidade deve ser estimada pelo **peso final por cavidade**, não confundida com o volume da forma. A margem é uma reserva arbitrada pelo usuário. O usuário deve conferir compatibilidade de base, aditivos, IFRA 9 da essência e o tipo/teor ativo do tensoativo antes de produção ou venda.

## Etapa seguinte — backend, contas e três produtos pagos

O repositório GitHub Pages é **público e estático**. Logo, não oferece armazenamento seguro de login, controle de acesso pago, dados pessoais, pagamentos ou vídeos protegidos. Não construir essas funcionalidades só com `localStorage` ou flags no JavaScript cliente.

### Arquitetura proposta
- **Frontend público:** calculadora, funções gratuitas, vitrine de Básico/Intermediário/Avançado e aulas públicas de demonstração. GitHub Pages pode continuar até migração planejada.
- **API privada** em HTTPS, hospeda-se separadamente do GitHub Pages, com autenticação real e autorização por usuário e curso, cookies `HttpOnly`, `Secure`, `SameSite`, CSRF onde adequado, sessões expiradas/revogáveis, limitação de tentativas e registro de auditoria.
- **Banco PostgreSQL** para usuários, receitas com versões, matérias-primas, moldes, lotes, cursos, aulas, matrículas e pagamentos. Esquema proposto em `backend/migrations/001_schema.sql`. **Não foi executado** em nenhum servidor.
- **Senhas:** algoritmo de hashing apropriado, p.ex. Argon2id com parâmetros atualizados; sem senhas em texto plano, sem chaves no repositório.
- **Aulas pagas:** verificação server-side de permissão antes de emitir links de vídeo de curta duração. IDs/URLs privados não devem estar no HTML ou JavaScript público.
- **Checkout:** integrar provedor escolhido com verificação server-side, webhooks autenticados, reconciliação de valor/moeda/estado, proteção contra replays e idempotência; liberar entitlement somente depois de confirmação real. Sem página de pagamento ativa hoje.
- **Separação de dados:** owner sempre derivado da sessão autenticada; nunca do ID enviado pelo cliente. Backups e exportação de dados com autorização do titular.
- **Privacidade:** política LGPD, informações sobre finalidade/retensão, backups criptografados, rotina de exclusão e recuperação de desastres.
- **Deploy:** homologação isolada antes de produção, migrações testadas em cópia, TLS, backups verificados e rollback. Não compartilhar bases existentes de outros projetos por padrão.

### Entidades do banco
`app_users`, `app_sessions`, `user_materials`, `user_molds`, `user_formulations`, `formulation_revisions`, `production_batches`, `training_products`, `training_lessons`, `student_entitlements`, `lesson_progress`, `payment_orders` e `payment_webhook_events`.

### Ordem segura de implementação
1. **Contrato de API e autenticação:** endpoints registrados, testes de autorização, registro e recuperação de conta; decidir hospedagem da API e política de dados.
2. **Sincronização opt-in:** permitir importar backup JSON do navegador e converter em registros isolados por usuário após validação. Não apagar dados locais sem confirmação.
3. **Painel administrativo autenticado:** editar produtos, títulos, módulos, aulas e vídeos, sem acesso irrestrito a dados de artesãos.
4. **Loja e matrículas:** criar produtos reais e preços com consentimento comercial, checkout, callbacks, auditoria e permissão por curso.
5. **Evoluções futuras:** estoque com baixas auditáveis, fichas de produção e indicadores por turma/vendas.

## Especificação de API inicial (a implementar)
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/me`; validar cookie seguro e autorização.
- `GET/POST /api/me/formulations`, `GET/POST /api/me/molds`, `GET/POST /api/me/batches`: acessíveis apenas ao dono.
- `GET /api/courses`: vitrine pública. `GET /api/me/courses`: direitos adquiridos.
- `GET /api/me/lessons/{lesson_id}/play`: link de reprodução só para comprador autorizado.
- `POST /api/payments/webhook/{gateway}`: assinatura validada, processamento idempotente e sem confiar no cliente.

## Testes de aceitação da fase atual
- Navegação `#moldes` com todos os demais menus preservados.
- 10 cavidades × 100 g × 1 preenchimento com 5% de reserva → 10 unidades, 1050 g **finais estimados**, 840 g de base, 67,2 mL essência, 58,8 mL extrato, 84 mL lauril.
- Aplicação à calculadora → 1050 g no modo peso final; rendimento de 10 peças, sem somar volume e massa como se fossem iguais.
- Rejeição de campos inválidos e aviso ao escalar ingredientes manuais.
- Backup novo exporta moldes; importação restaura; backup antigo sem moldes mantém os existentes; valores de moldes inválidos não são aplicados.
- Treinamentos e preços permanecem funcionando.

**Status:** ferramenta de moldes implementada; esquema PostgreSQL e plano de API são apenas artefatos de arquitetura, sem backend ou login em produção.
