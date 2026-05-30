-- 身体数据追踪表
CREATE TABLE body_measurements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users NOT NULL,
  weight_kg    float NOT NULL,
  body_fat_pct float,
  chest_cm     float,
  waist_cm     float,
  hip_cm       float,
  arm_cm       float,
  thigh_cm     float,
  measured_at  date NOT NULL DEFAULT CURRENT_DATE,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own measurements"
  ON body_measurements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own measurements"
  ON body_measurements FOR INSERT
  WITH CHECK (auth.uid() = user_id);
