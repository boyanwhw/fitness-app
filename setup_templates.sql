-- 训练计划模板表
CREATE TABLE workout_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users,
  name        text NOT NULL,
  is_preset   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE template_exercises (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   uuid REFERENCES workout_templates ON DELETE CASCADE,
  exercise_id   uuid REFERENCES exercises,
  sort_order    int DEFAULT 0,
  sets          int NOT NULL DEFAULT 3,
  reps          int NOT NULL DEFAULT 10,
  rest_seconds  int DEFAULT 60,
  notes         text
);

-- RLS
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;

-- 预设模板所有人可读
CREATE POLICY "Preset templates readable by all" ON workout_templates FOR SELECT USING (is_preset = true OR auth.uid() = user_id);
CREATE POLICY "Users manage own templates" ON workout_templates FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Preset template items readable by all" ON template_exercises FOR SELECT
  USING (EXISTS (SELECT 1 FROM workout_templates WHERE id = template_id AND (is_preset = true OR user_id = auth.uid())));
CREATE POLICY "Users manage own template items" ON template_exercises FOR ALL
  USING (EXISTS (SELECT 1 FROM workout_templates WHERE id = template_id AND user_id = auth.uid()));

-- 预设模板：推胸日
INSERT INTO workout_templates (name, is_preset) VALUES ('推胸日', true);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps, rest_seconds, notes)
SELECT (SELECT id FROM workout_templates WHERE name = '推胸日' AND is_preset = true),
       e.id, s.sort_order, s.sets, s.reps, s.rest_seconds, s.notes
FROM (VALUES
  ('杠铃卧推', 0, 4, 10, 90, '控制离心3秒'),
  ('哑铃飞鸟', 1, 3, 12, 60, '轻重量感受拉伸'),
  ('绳索下压', 2, 3, 15, 45, '顶峰收缩'),
  ('过头臂屈伸', 3, 3, 12, 60, '')
) AS s(name, sort_order, sets, reps, rest_seconds, notes)
JOIN exercises e ON e.name = s.name;

-- 预设模板：拉背日
INSERT INTO workout_templates (name, is_preset) VALUES ('拉背日', true);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps, rest_seconds, notes)
SELECT (SELECT id FROM workout_templates WHERE name = '拉背日' AND is_preset = true),
       e.id, s.sort_order, s.sets, s.reps, s.rest_seconds, s.notes
FROM (VALUES
  ('引体向上', 0, 4, 8, 90, '可弹力带辅助'),
  ('杠铃划船', 1, 4, 10, 90, '俯身45度'),
  ('坐姿划船', 2, 3, 12, 60, '挤压背部'),
  ('面拉', 3, 3, 15, 45, '肩胛后收')
) AS s(name, sort_order, sets, reps, rest_seconds, notes)
JOIN exercises e ON e.name = s.name;

-- 预设模板：腿日
INSERT INTO workout_templates (name, is_preset) VALUES ('腿日', true);
INSERT INTO template_exercises (template_id, exercise_id, sort_order, sets, reps, rest_seconds, notes)
SELECT (SELECT id FROM workout_templates WHERE name = '腿日' AND is_preset = true),
       e.id, s.sort_order, s.sets, s.reps, s.rest_seconds, s.notes
FROM (VALUES
  ('杠铃深蹲', 0, 4, 10, 120, '核心收紧'),
  ('罗马尼亚硬拉', 1, 3, 10, 90, '腿后侧拉伸感'),
  ('腿举', 2, 3, 12, 90, '全程控制'),
  ('小腿提踵', 3, 4, 20, 45, '顶峰停顿1秒')
) AS s(name, sort_order, sets, reps, rest_seconds, notes)
JOIN exercises e ON e.name = s.name;
