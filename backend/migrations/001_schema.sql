-- Estrutura inicial PROPOSTA para futura API privada de Sabonete Vegetal.
-- PostgreSQL >= 14, sem credenciais, sem triggers externos ou deploy.
-- Nao executar em producao sem revisao, backup e migrador transacional.
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'artisan' CHECK (role IN ('artisan','editor','admin')),
  email_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  disabled_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS app_users_email_ci ON app_users (lower(email));

CREATE TABLE IF NOT EXISTS app_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS app_sessions_user_idx ON app_sessions(user_id);

CREATE TABLE IF NOT EXISTS user_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  name text NOT NULL,
  measure_kind text NOT NULL CHECK(measure_kind IN('mass','volume','units')),
  purchase_quantity numeric(15,5) CHECK(purchase_quantity>0),
  purchase_unit text NOT NULL CHECK(purchase_unit IN('g','kg','mL','L','un')),
  purchase_cost_cents bigint CHECK(purchase_cost_cents>=0),
  supplier_name text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_materials_owner_idx ON user_materials(owner_id);

CREATE TABLE IF NOT EXISTS user_molds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  name text NOT NULL,
  cavities integer NOT NULL CHECK(cavities BETWEEN 1 AND 1000),
  nominal_finished_grams numeric(12,4) NOT NULL CHECK(nominal_finished_grams>0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_molds_owner_idx ON user_molds(owner_id);

CREATE TABLE IF NOT EXISTS user_formulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_formulations_owner_idx ON user_formulations(owner_id);

CREATE TABLE IF NOT EXISTS formulation_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formulation_id uuid NOT NULL REFERENCES user_formulations(id) ON DELETE CASCADE,
  revision_number integer NOT NULL CHECK(revision_number>0),
  ingredients_snapshot jsonb NOT NULL,
  calculation_mode text NOT NULL CHECK(calculation_mode IN('base','final')),
  target_grams numeric(15,5) NOT NULL CHECK(target_grams>0),
  saved_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(formulation_id,revision_number)
);

CREATE TABLE IF NOT EXISTS production_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  formulation_revision_id uuid REFERENCES formulation_revisions(id) ON DELETE SET NULL,
  label text NOT NULL,
  status text NOT NULL DEFAULT 'planned' CHECK(status IN('planned','completed','cancelled')),
  expected_units integer CHECK(expected_units>0),
  planned_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS production_batches_owner_idx ON production_batches(owner_id);

CREATE TABLE IF NOT EXISTS training_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  level text NOT NULL UNIQUE CHECK(level IN('basic','intermediate','advanced')),
  published boolean NOT NULL DEFAULT false,
  price_cents bigint CHECK(price_cents>=0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES training_products(id) ON DELETE CASCADE,
  ordinal integer NOT NULL CHECK(ordinal>0),
  title text NOT NULL,
  content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  private_video_asset_id text,
  is_public_preview boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  UNIQUE(course_id,ordinal)
);

CREATE TABLE IF NOT EXISTS student_entitlements (
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES training_products(id) ON DELETE CASCADE,
  granted_by text NOT NULL CHECK(granted_by IN('purchase','admin','bundle','migration')),
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  PRIMARY KEY(user_id,course_id)
);
CREATE INDEX IF NOT EXISTS student_entitlements_course_idx ON student_entitlements(course_id);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES training_lessons(id) ON DELETE CASCADE,
  completed_at timestamptz,
  last_position_seconds integer NOT NULL DEFAULT 0 CHECK(last_position_seconds>=0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id,lesson_id)
);

CREATE TABLE IF NOT EXISTS payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES app_users(id),
  course_id uuid NOT NULL REFERENCES training_products(id),
  gateway text NOT NULL,
  external_order_id text,
  idempotency_key text NOT NULL UNIQUE,
  expected_amount_cents bigint NOT NULL CHECK(expected_amount_cents>=0),
  currency text NOT NULL DEFAULT 'BRL',
  status text NOT NULL DEFAULT 'created' CHECK(status IN('created','pending','paid','failed','refunded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS payment_orders_gateway_external
  ON payment_orders(gateway,external_order_id)
  WHERE external_order_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway text NOT NULL,
  event_id text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  verified boolean NOT NULL DEFAULT false,
  handled_at timestamptz,
  UNIQUE(gateway,event_id)
);

COMMIT;
