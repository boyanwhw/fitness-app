-- 为动作库添加演示图片
-- 图片来源: yuhonas/free-exercise-db (GitHub)

-- 添加 image_url 列
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS image_url text;

-- 更新所有动作的图片URL（JSON数组格式，每个动作2帧）
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Bench_Press_-_Medium_Grip/1.jpg"]' WHERE name = '杠铃卧推';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Flyes/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Flyes/1.jpg"]' WHERE name = '哑铃飞鸟';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pushups/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pushups/1.jpg"]' WHERE name = '俯卧撑';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pullups/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Pullups/1.jpg"]' WHERE name = '引体向上';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Bent_Over_Barbell_Row/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Bent_Over_Barbell_Row/1.jpg"]' WHERE name = '杠铃划船';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Wide-Grip_Lat_Pulldown/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Wide-Grip_Lat_Pulldown/1.jpg"]' WHERE name = '高位下拉';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Squat/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Squat/1.jpg"]' WHERE name = '杠铃深蹲';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Leg_Press/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Leg_Press/1.jpg"]' WHERE name = '腿举';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Incline_Dumbbell_Curl/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Incline_Dumbbell_Curl/1.jpg"]' WHERE name = '哑铃弯举';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Bench_Dips/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Bench_Dips/1.jpg"]' WHERE name = '三头臂屈伸';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Shoulder_Press/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Shoulder_Press/1.jpg"]' WHERE name = '杠铃推举';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Side_Lateral_Raise/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Side_Lateral_Raise/1.jpg"]' WHERE name = '哑铃侧平举';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Plank/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Plank/1.jpg"]' WHERE name = '平板支撑';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Crunch_-_Hands_Overhead/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Crunch_-_Hands_Overhead/1.jpg"]' WHERE name = '卷腹';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Romanian_Deadlift/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Romanian_Deadlift/1.jpg"]' WHERE name = '罗马尼亚硬拉';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Shrug/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Dumbbell_Shrug/1.jpg"]' WHERE name = '哑铃耸肩';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Seated_Cable_Rows/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Seated_Cable_Rows/1.jpg"]' WHERE name = '坐姿划船';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Lying_Leg_Curls/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Lying_Leg_Curls/1.jpg"]' WHERE name = '腿弯举';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Curl/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Barbell_Curl/1.jpg"]' WHERE name = '杠铃弯举';
UPDATE exercises SET image_url = '["https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Hanging_Leg_Raise/0.jpg","https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/Hanging_Leg_Raise/1.jpg"]' WHERE name = '悬垂举腿';
