-- migration_v7c.sql
-- Asignación de leads y estado en negociación

ALTER TABLE prospectos
  ADD COLUMN IF NOT EXISTS tomado_por UUID REFERENCES vendedores(id),
  ADD COLUMN IF NOT EXISTS tomado_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS vehiculo_en_negociacion INTEGER REFERENCES vehiculos(id);

-- Flag de negociación activa en vehiculos
ALTER TABLE vehiculos
  ADD COLUMN IF NOT EXISTS en_negociacion BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS negociacion_vendedor_id UUID REFERENCES vendedores(id),
  ADD COLUMN IF NOT EXISTS negociacion_inicio TIMESTAMPTZ;

-- Tabla de comisiones / split (para cuando hay múltiples vendedores en una venta)
CREATE TABLE IF NOT EXISTS comisiones (
  id SERIAL PRIMARY KEY,
  venta_id INTEGER REFERENCES con_ventas(id) ON DELETE CASCADE,
  vendedor_id UUID REFERENCES vendedores(id),
  tipo TEXT DEFAULT 'cierre',
  -- 'cierre' | 'captacion' | 'referido'
  porcentaje NUMERIC DEFAULT 100,
  monto_usd NUMERIC,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comisiones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "full access comisiones" ON comisiones FOR ALL USING (true);
