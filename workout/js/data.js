/* ============================================================
   Workout Tracker — Exercise Library & Default Program
   ============================================================ */

// ── Exercise library ──────────────────────────────────────────
// pattern: squat | lunge | hinge | hamstring | quad | glute | calf |
//          olympic | pull_v | pull_h | press | handstand |
//          core_ae (anti-extension) | core_flex | core_obl | carry | conditioning
// load: 'weight' (lbs input) | 'bw' (bodyweight) | 'time' (seconds)
// repUnit: label for the reps field ('rep' | 'sec' | 'm' | 'cal' | 'yd')
// inc: weight increment on successful progression

const BUILTIN_EXERCISES = [
  // Squat pattern
  { id: 'back-squat',        name: 'Back Squat',                pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'front-squat',       name: 'Front Squat',               pattern: 'squat',  muscles: ['quads', 'core'],   equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'zercher-squat',     name: 'Zercher Squat',             pattern: 'squat',  muscles: ['quads', 'core'],   equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'goblet-squat',      name: 'Goblet Squat',              pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'smith-squat',       name: 'Smith Machine Squat',       pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'smith',     load: 'weight', inc: 5 },
  { id: 'smith-front-squat', name: 'Smith Front Squat',         pattern: 'squat',  muscles: ['quads'],           equip: 'smith',     load: 'weight', inc: 5 },
  { id: 'hack-squat',        name: 'Hack Squat',                pattern: 'squat',  muscles: ['quads'],           equip: 'machine',   load: 'weight', inc: 10 },
  { id: 'pendulum-squat',    name: 'Pendulum Squat',            pattern: 'squat',  muscles: ['quads'],           equip: 'machine',   load: 'weight', inc: 10 },
  { id: 'belt-squat',        name: 'Belt Squat',                pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'machine',   load: 'weight', inc: 10 },
  { id: 'leg-press',         name: 'Leg Press',                 pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'machine',   load: 'weight', inc: 10 },
  { id: 'heels-db-squat',    name: 'Heels-Elevated DB Squat',   pattern: 'squat',  muscles: ['quads'],           equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'box-jump',          name: 'Box Jump',                  pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'bodyweight', load: 'bw' },
  { id: 'jumping-squat',     name: 'Jumping Squat',             pattern: 'squat',  muscles: ['quads'],           equip: 'bodyweight', load: 'bw' },

  // Olympic / full-body barbell
  { id: 'hang-clean',        name: 'Barbell Hang Clean',        pattern: 'olympic', muscles: ['legs', 'back', 'shoulders'], equip: 'barbell', load: 'weight', inc: 5 },
  { id: 'power-clean',       name: 'Power Clean',               pattern: 'olympic', muscles: ['legs', 'back', 'shoulders'], equip: 'barbell', load: 'weight', inc: 5 },
  { id: 'clean-jerk',        name: 'Clean & Jerk',              pattern: 'olympic', muscles: ['legs', 'shoulders', 'back'], equip: 'barbell', load: 'weight', inc: 5 },
  { id: 'push-jerk',         name: 'Push Jerk',                 pattern: 'olympic', muscles: ['shoulders', 'legs'],         equip: 'barbell', load: 'weight', inc: 5 },

  // Lunge / unilateral
  { id: 'walking-lunge',     name: 'Walking Lunge',             pattern: 'lunge',  muscles: ['quads', 'glutes'], equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'jumping-lunge',     name: 'Jumping Lunges',            pattern: 'lunge',  muscles: ['quads', 'glutes'], equip: 'bodyweight', load: 'bw' },
  { id: 'smith-split-l',     name: 'Smith Split Squat (left)',  pattern: 'lunge',  muscles: ['quads', 'glutes'], equip: 'smith',     load: 'weight', inc: 5 },
  { id: 'smith-split-r',     name: 'Smith Split Squat (right)', pattern: 'lunge',  muscles: ['quads', 'glutes'], equip: 'smith',     load: 'weight', inc: 5 },
  { id: 'bulgarian-split',   name: 'Bulgarian Split Squat',     pattern: 'lunge',  muscles: ['quads', 'glutes'], equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'reverse-lunge',     name: 'Reverse Lunge',             pattern: 'lunge',  muscles: ['quads', 'glutes'], equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'step-up',           name: 'Step-Up',                   pattern: 'lunge',  muscles: ['quads', 'glutes'], equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'cossack-squat',     name: 'Cossack Squat',             pattern: 'lunge',  muscles: ['quads', 'adductors'], equip: 'bodyweight', load: 'bw' },
  { id: 'curtsy-lunge',      name: 'Curtsy Lunge',              pattern: 'lunge',  muscles: ['glutes', 'quads'], equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'lateral-lunge',     name: 'Lateral Lunge',             pattern: 'lunge',  muscles: ['quads', 'adductors'], equip: 'dumbbell', load: 'weight', inc: 5 },

  // Hinge
  { id: 'deadlift',          name: 'Deadlift',                  pattern: 'hinge',  muscles: ['hamstrings', 'glutes', 'back'], equip: 'barbell', load: 'weight', inc: 10 },
  { id: 'sumo-deadlift',     name: 'Sumo Deadlift',             pattern: 'hinge',  muscles: ['glutes', 'hamstrings', 'quads'], equip: 'barbell', load: 'weight', inc: 10 },
  { id: 'trap-bar-deadlift', name: 'Trap Bar Deadlift',         pattern: 'hinge',  muscles: ['quads', 'glutes', 'back'], equip: 'barbell', load: 'weight', inc: 10 },
  { id: 'snatch-grip-dl',    name: 'Snatch-Grip Deadlift',      pattern: 'hinge',  muscles: ['hamstrings', 'back'], equip: 'barbell', load: 'weight', inc: 5 },
  { id: 'deficit-deadlift',  name: 'Deficit Deadlift',          pattern: 'hinge',  muscles: ['hamstrings', 'glutes'], equip: 'barbell', load: 'weight', inc: 5 },
  { id: 'rack-pull',         name: 'Rack Pull',                 pattern: 'hinge',  muscles: ['back', 'glutes'],  equip: 'barbell',   load: 'weight', inc: 10 },
  { id: 'rdl',               name: 'Romanian Deadlift',         pattern: 'hinge',  muscles: ['hamstrings', 'glutes'], equip: 'barbell',  load: 'weight', inc: 5 },
  { id: 'db-rdl',            name: 'Dumbbell RDL',              pattern: 'hinge',  muscles: ['hamstrings', 'glutes'], equip: 'dumbbell', load: 'weight', inc: 5 },
  { id: 'smith-rdl',         name: 'Smith Machine RDL',         pattern: 'hinge',  muscles: ['hamstrings', 'glutes'], equip: 'smith',    load: 'weight', inc: 5 },
  { id: 'single-leg-rdl',    name: 'Single-Leg RDL',            pattern: 'hinge',  muscles: ['hamstrings', 'glutes'], equip: 'dumbbell', load: 'weight', inc: 5 },
  { id: 'good-morning',      name: 'Good Morning',              pattern: 'hinge',  muscles: ['hamstrings', 'back'],   equip: 'barbell',  load: 'weight', inc: 5 },
  { id: 'back-extension',    name: 'Back Extension',            pattern: 'hinge',  muscles: ['glutes', 'hamstrings', 'back'], equip: 'machine', load: 'bw' },
  { id: 'reverse-hyper',     name: 'Reverse Hyper',             pattern: 'hinge',  muscles: ['glutes', 'hamstrings'], equip: 'machine', load: 'weight', inc: 10 },

  // Glutes
  { id: 'hip-thrust',        name: 'Hip Thrust',                pattern: 'glute',  muscles: ['glutes'],          equip: 'barbell',   load: 'weight', inc: 10 },
  { id: 'smith-hip-thrust',  name: 'Smith Machine Hip Thrust',  pattern: 'glute',  muscles: ['glutes'],          equip: 'smith',     load: 'weight', inc: 10 },
  { id: 'kas-glute-bridge',  name: 'KAS Glute Bridge',          pattern: 'glute',  muscles: ['glutes'],          equip: 'barbell',   load: 'weight', inc: 10 },
  { id: 'glute-bridge',      name: 'Glute Bridge',              pattern: 'glute',  muscles: ['glutes'],          equip: 'bodyweight', load: 'bw' },
  { id: 'frog-pump',         name: 'Frog Pump',                 pattern: 'glute',  muscles: ['glutes'],          equip: 'bodyweight', load: 'bw' },
  { id: 'cable-pullthrough', name: 'Cable Pull-Through',        pattern: 'glute',  muscles: ['glutes', 'hamstrings'], equip: 'cable', load: 'weight', inc: 5 },
  { id: 'cable-kickback',    name: 'Cable Glute Kickback',      pattern: 'glute',  muscles: ['glutes'],          equip: 'cable',     load: 'weight', inc: 2.5 },
  { id: 'abduction-machine', name: 'Hip Abduction Machine',     pattern: 'glute',  muscles: ['glutes'],          equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'adduction-machine', name: 'Hip Adduction Machine',     pattern: 'glute',  muscles: ['adductors'],       equip: 'machine',   load: 'weight', inc: 5 },

  // Hamstring / quad isolation
  { id: 'lying-leg-curl',    name: 'Lying Leg Curl',            pattern: 'hamstring', muscles: ['hamstrings'],   equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'seated-leg-curl',   name: 'Seated Leg Curl',           pattern: 'hamstring', muscles: ['hamstrings'],   equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'nordic-curl',       name: 'Nordic Curl',               pattern: 'hamstring', muscles: ['hamstrings'],   equip: 'bodyweight', load: 'bw' },
  { id: 'ghd-raise',         name: 'GHD Hip Extension',         pattern: 'hamstring', muscles: ['hamstrings', 'glutes'], equip: 'machine', load: 'bw' },
  { id: 'ball-leg-curl',     name: 'Stability Ball Leg Curl',   pattern: 'hamstring', muscles: ['hamstrings'],   equip: 'bodyweight', load: 'bw' },
  { id: 'leg-extension',     name: 'Leg Extension',             pattern: 'quad',   muscles: ['quads'],           equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'sissy-squat',       name: 'Sissy Squat',               pattern: 'quad',   muscles: ['quads'],           equip: 'bodyweight', load: 'bw' },

  // Calves
  { id: 'standing-calf',     name: 'Standing Calf Raise',       pattern: 'calf',   muscles: ['calves'],          equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'seated-calf',       name: 'Seated Calf Raise',         pattern: 'calf',   muscles: ['calves'],          equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'leg-press-calf',    name: 'Leg Press Calf Raises',     pattern: 'calf',   muscles: ['calves'],          equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'single-leg-calf',   name: 'Single-Leg Calf Raise',     pattern: 'calf',   muscles: ['calves'],          equip: 'bodyweight', load: 'bw' },

  // Vertical pull (lats)
  { id: 'pull-up',           name: 'Pull-Up',                   pattern: 'pull_v', muscles: ['lats', 'back'],    equip: 'bodyweight', load: 'bw' },
  { id: 'chin-up',           name: 'Chin-Up',                   pattern: 'pull_v', muscles: ['lats', 'back'],    equip: 'bodyweight', load: 'bw' },
  { id: 'assisted-pull-up',  name: 'Assisted Pull-Up',          pattern: 'pull_v', muscles: ['lats', 'back'],    equip: 'machine',   load: 'weight', inc: -5 },
  { id: 'lat-pulldown',      name: 'Lat Pulldown',              pattern: 'pull_v', muscles: ['lats', 'back'],    equip: 'cable',     load: 'weight', inc: 5 },
  { id: 'neutral-pulldown',  name: 'Neutral-Grip Pulldown',     pattern: 'pull_v', muscles: ['lats', 'back'],    equip: 'cable',     load: 'weight', inc: 5 },
  { id: 'straight-arm-pd',   name: 'Straight-Arm Pulldown',     pattern: 'pull_v', muscles: ['lats'],            equip: 'cable',     load: 'weight', inc: 2.5 },
  { id: 'machine-pullover',  name: 'Machine Pullover',          pattern: 'pull_v', muscles: ['lats'],            equip: 'machine',   load: 'weight', inc: 5 },

  // Horizontal pull (back)
  { id: 'barbell-row',       name: 'Barbell Row',               pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'pendlay-row',       name: 'Pendlay Row',               pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'cs-row',            name: 'Chest-Supported Row',       pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'cable-row',         name: 'Seated Cable Row',          pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'cable',     load: 'weight', inc: 5 },
  { id: 'wide-cable-row',    name: 'Wide-Grip Cable Row',       pattern: 'pull_h', muscles: ['back'],            equip: 'cable',     load: 'weight', inc: 5 },
  { id: 'db-row',            name: 'Single-Arm DB Row',         pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'kroc-row',          name: 'Kroc Row (high-rep DB)',    pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'meadows-row',       name: 'Meadows Row',               pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'tbar-row',          name: 'T-Bar Row',                 pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'inverted-row',      name: 'Inverted Row',              pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'bodyweight', load: 'bw' },
  { id: 'face-pull',         name: 'Face Pull',                 pattern: 'pull_h', muscles: ['back', 'shoulders'], equip: 'cable',   load: 'weight', inc: 2.5 },
  { id: 'rear-delt-fly',     name: 'Rear Delt Fly',             pattern: 'pull_h', muscles: ['back', 'shoulders'], equip: 'machine', load: 'weight', inc: 2.5 },

  // Compound presses (allowed arm work)
  { id: 'push-press',        name: 'Push Press',                pattern: 'press',  muscles: ['shoulders', 'legs'], equip: 'barbell', load: 'weight', inc: 5 },
  { id: 'overhead-press',    name: 'Overhead Press',            pattern: 'press',  muscles: ['shoulders'],       equip: 'barbell',   load: 'weight', inc: 2.5 },
  { id: 'db-press',          name: 'DB Shoulder Press',         pattern: 'press',  muscles: ['shoulders'],       equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'thruster',          name: 'Thrusters',                 pattern: 'press',  muscles: ['legs', 'shoulders'], equip: 'barbell', load: 'weight', inc: 5 },
  { id: 'db-thruster',       name: 'DB Thrusters',              pattern: 'press',  muscles: ['legs', 'shoulders'], equip: 'dumbbell', load: 'weight', inc: 5 },
  { id: 'pike-pushup',       name: 'Pike Push-Up',              pattern: 'press',  muscles: ['shoulders', 'core'], equip: 'bodyweight', load: 'bw' },
  { id: 'hspu-wall',         name: 'Wall Handstand Push-Up',    pattern: 'press',  muscles: ['shoulders'],       equip: 'bodyweight', load: 'bw' },

  // Handstand skill
  { id: 'wall-hold-back',    name: 'Wall Handstand Hold',       pattern: 'handstand', muscles: ['shoulders', 'core'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'wall-hold-chest',   name: 'Chest-to-Wall Handstand',   pattern: 'handstand', muscles: ['shoulders', 'core'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'wall-walk',         name: 'Wall Walk',                 pattern: 'handstand', muscles: ['shoulders', 'core'], equip: 'bodyweight', load: 'bw' },
  { id: 'kickup-practice',   name: 'Handstand Kick-Up Practice', pattern: 'handstand', muscles: ['shoulders', 'core'], equip: 'bodyweight', load: 'bw' },
  { id: 'crow-pose',         name: 'Crow Pose',                 pattern: 'handstand', muscles: ['core', 'shoulders'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'hollow-hold',       name: 'Hollow Body Hold',          pattern: 'handstand', muscles: ['core'],         equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'arch-hold',         name: 'Arch (Superman) Hold',      pattern: 'handstand', muscles: ['back', 'core'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },

  // Core — anti-extension / bracing
  { id: 'ab-wheel',          name: 'Ab Wheel Rollout',          pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'bw' },
  { id: 'plank',             name: 'Plank',                     pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'weighted-plank',    name: 'Weighted Plank',            pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'weight', inc: 5, repUnit: 'sec' },
  { id: 'plank-taps',        name: 'Plank Shoulder Taps',       pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'bw' },
  { id: 'dead-bug',          name: 'Dead Bug',                  pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'bw' },
  { id: 'body-saw',          name: 'Body Saw',                  pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'bw' },
  { id: 'l-sit',             name: 'L-Sit',                     pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'dragon-flag-neg',   name: 'Dragon Flag Negative',      pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'bw' },

  // Core — flexion
  { id: 'hanging-knee',      name: 'Hanging Knee Raise',        pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },
  { id: 'hanging-leg',       name: 'Hanging Leg Raise',         pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },
  { id: 'bicycle-crunch',    name: 'Bicycle Crunch',            pattern: 'core_flex', muscles: ['core', 'obliques'], equip: 'bodyweight', load: 'bw' },
  { id: 'cable-crunch',      name: 'Cable Crunch',              pattern: 'core_flex', muscles: ['core'],         equip: 'cable',     load: 'weight', inc: 5 },
  { id: 'reverse-crunch',    name: 'Reverse Crunch',            pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },
  { id: 'decline-situp',     name: 'Decline Sit-Up',            pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },
  { id: 'v-up',              name: 'V-Up',                      pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },
  { id: 'hollow-rocks',      name: 'Hollow Rocks',              pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },

  // Core — oblique / lateral (kept light to keep the waist tight, not thick)
  { id: 'side-plank',        name: 'Side Plank (each side)',    pattern: 'core_obl', muscles: ['obliques'],      equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'copenhagen-plank',  name: 'Copenhagen Plank (each side)', pattern: 'core_obl', muscles: ['obliques', 'adductors'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'pallof-press',      name: 'Pallof Press (each side)',  pattern: 'core_obl', muscles: ['obliques', 'core'], equip: 'cable',  load: 'weight', inc: 2.5 },
  { id: 'russian-twist',     name: 'Russian Twist',             pattern: 'core_obl', muscles: ['obliques'],      equip: 'bodyweight', load: 'bw' },
  { id: 'windshield-wiper',  name: 'Hanging Windshield Wiper',  pattern: 'core_obl', muscles: ['obliques', 'core'], equip: 'bodyweight', load: 'bw' },
  { id: 'woodchopper',       name: 'Cable Woodchopper',         pattern: 'core_obl', muscles: ['obliques'],      equip: 'cable',     load: 'weight', inc: 2.5 },

  // Carries
  { id: 'farmer-carry',      name: 'Farmer Carry',              pattern: 'carry',  muscles: ['core', 'back'],    equip: 'dumbbell',  load: 'weight', inc: 10, repUnit: 'yd' },
  { id: 'suitcase-carry',    name: 'Suitcase Carry (each side)', pattern: 'carry', muscles: ['obliques', 'core'], equip: 'dumbbell', load: 'weight', inc: 5, repUnit: 'yd' },
  { id: 'overhead-carry',    name: 'Overhead Carry',            pattern: 'carry',  muscles: ['shoulders', 'core'], equip: 'dumbbell', load: 'weight', inc: 5, repUnit: 'yd' },
  { id: 'sandbag-carry',     name: 'Sandbag Carry',             pattern: 'carry',  muscles: ['core', 'legs'],    equip: 'bodyweight', load: 'weight', inc: 10, repUnit: 'yd' },

  // Conditioning / cardio
  { id: 'kb-swing',          name: 'Kettlebell Swing',          pattern: 'conditioning', muscles: ['glutes', 'cardio'], equip: 'kettlebell', load: 'weight', inc: 9 },
  { id: 'rower',             name: 'Row (erg)',                 pattern: 'conditioning', muscles: ['cardio', 'back'], equip: 'cardio', load: 'bw', repUnit: 'm' },
  { id: 'ski-erg',           name: 'Ski Erg',                   pattern: 'conditioning', muscles: ['cardio', 'lats'], equip: 'cardio', load: 'bw', repUnit: 'cal' },
  { id: 'air-bike',          name: 'Air Bike',                  pattern: 'conditioning', muscles: ['cardio'],    equip: 'cardio',    load: 'bw', repUnit: 'cal' },
  { id: 'stair-climber',     name: 'Stair Climber',             pattern: 'conditioning', muscles: ['cardio', 'glutes'], equip: 'cardio', load: 'time', repUnit: 'sec' },
  { id: 'treadmill-run',     name: 'Treadmill Run',             pattern: 'conditioning', muscles: ['cardio'],    equip: 'cardio',    load: 'time', repUnit: 'sec' },
  { id: 'incline-walk',      name: 'Incline Treadmill Walk',    pattern: 'conditioning', muscles: ['cardio'],    equip: 'cardio',    load: 'time', repUnit: 'sec' },
  { id: 'burpee',            name: 'Burpees',                   pattern: 'conditioning', muscles: ['cardio'],    equip: 'bodyweight', load: 'bw' },
  { id: 'devils-press',      name: "Devil's Press",             pattern: 'conditioning', muscles: ['cardio', 'shoulders', 'legs'], equip: 'dumbbell', load: 'weight', inc: 5 },
  { id: 'mountain-climber',  name: 'Mountain Climbers',         pattern: 'conditioning', muscles: ['cardio', 'core'], equip: 'bodyweight', load: 'bw' },
  { id: 'jump-rope',         name: 'Jump Rope',                 pattern: 'conditioning', muscles: ['cardio', 'calves'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'sled-push',         name: 'Sled Push',                 pattern: 'conditioning', muscles: ['legs', 'cardio'], equip: 'machine', load: 'weight', inc: 10, repUnit: 'yd' },
  { id: 'battle-ropes',      name: 'Battle Ropes',              pattern: 'conditioning', muscles: ['cardio', 'shoulders'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'wall-ball',         name: 'Wall Balls',                pattern: 'conditioning', muscles: ['legs', 'shoulders'], equip: 'bodyweight', load: 'weight', inc: 2 },
  { id: 'shadowboxing',      name: 'Shadowboxing',              pattern: 'conditioning', muscles: ['cardio', 'shoulders'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },
];

// ── Default program: two alternating weeks ───────────────────
// Every training day opens with a main barbell compound.
// Week selection is automatic: weeks alternate A → B → A → B by calendar week.
// days keyed 0 (Sun) … 6 (Sat) to match Date.getDay()
// block.type: 'warmup' | 'superset' | 'circuit'

const WEEK_A = {
  1: { // Monday — her favorite, block ids preserved for history
    name: 'Heavy Legs',
    focus: 'Back Squat · Lunge · Leg Press · Core',
    minutes: 50,
    blocks: [
      {
        id: 'mon-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Samson Stretch & Lunge', amount: ':30/side' },
          { text: 'Active Pigeon Pose', amount: ':30/side' },
          { text: 'Single Leg Glute Bridges', amount: '10/side' },
          { text: 'Glute Bridge Hold', amount: ':30' },
          { text: 'Cossack Squats', amount: '10' },
          { text: 'Air Squats', amount: '10' },
          { text: 'Jumping Squats', amount: '5' },
          { text: 'Empty bar squats (or light KB goblet)', amount: '10' },
          { text: 'Work up to working weight over 2-3 warm-up sets', amount: '' },
        ],
      },
      {
        id: 'mon-a', type: 'superset', name: 'Back Squat + Jumping Lunges',
        rounds: 5, rest: 90,
        items: [
          { ex: 'back-squat',    sets: 5, reps: 5,  rpe: '7-8', weight: 95 },
          { ex: 'jumping-lunge', sets: 5, reps: 10, rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'mon-b', type: 'superset', name: 'Split Squats',
        rounds: 3, rest: 90,
        items: [
          { ex: 'smith-split-l', sets: 3, reps: 10, rpe: '7-8', weight: 30 },
          { ex: 'smith-split-r', sets: 3, reps: 10, rpe: '7-8', weight: 30 },
        ],
      },
      {
        id: 'mon-c', type: 'superset', name: 'Machine + Calf',
        rounds: 3, rest: 60,
        items: [
          { ex: 'leg-press',      sets: 3, reps: 10, rpe: '7-8', weight: 115 },
          { ex: 'leg-press-calf', sets: 3, reps: 15, rpe: '6-7', weight: 55 },
        ],
      },
      {
        id: 'mon-d', type: 'circuit', name: 'Core Finisher',
        rounds: 2, rest: 45, note: 'No rest between exercises. 45s between rounds.',
        items: [
          { ex: 'ab-wheel',       sets: 2, reps: 12, rpe: '', weight: 0 },
          { ex: 'bicycle-crunch', sets: 2, reps: 20, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  2: { // Tuesday
    name: 'Deadlift + Back',
    focus: 'Deadlift · Lats · Upper Back · Core',
    minutes: 50,
    blocks: [
      {
        id: 'a-tue-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Cat-Cow', amount: '10' },
          { text: '90/90 Hip Switches', amount: '10' },
          { text: 'Single Leg Glute Bridges', amount: '10/side' },
          { text: 'Bodyweight Good Mornings', amount: '12' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Light Deadlift (135 or less)', amount: '8' },
          { text: 'Work up to working weight over 2-3 warm-up sets', amount: '' },
        ],
      },
      {
        id: 'a-tue-a', type: 'superset', name: 'Deadlift + Hollow',
        rounds: 4, rest: 120,
        items: [
          { ex: 'deadlift',    sets: 4, reps: 5,  rpe: '7-8', weight: 135 },
          { ex: 'hollow-hold', sets: 4, reps: 20, rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'a-tue-b', type: 'superset', name: 'Lats + Swing',
        rounds: 3, rest: 60,
        items: [
          { ex: 'lat-pulldown', sets: 3, reps: 10, rpe: '7-8', weight: 70 },
          { ex: 'kb-swing',     sets: 3, reps: 15, rpe: '6-7', weight: 35 },
        ],
      },
      {
        id: 'a-tue-c', type: 'superset', name: 'Row + Pulldown',
        rounds: 3, rest: 60,
        items: [
          { ex: 'cs-row',          sets: 3, reps: 12, rpe: '7-8', weight: 60 },
          { ex: 'straight-arm-pd', sets: 3, reps: 12, rpe: '6-7', weight: 30 },
        ],
      },
      {
        id: 'a-tue-d', type: 'circuit', name: 'Core Finisher',
        rounds: 2, rest: 45,
        items: [
          { ex: 'hanging-knee', sets: 2, reps: 12, rpe: '', weight: 0 },
          { ex: 'side-plank',   sets: 2, reps: 30, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  3: { // Wednesday
    name: 'Hang Clean + Conditioning',
    focus: 'Power · Full Body Cardio · Abs',
    minutes: 47,
    blocks: [
      {
        id: 'a-wed-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Jump Rope (easy pace)', amount: '1:00' },
          { text: 'Arm Circles + Leg Swings', amount: '10 each' },
          { text: 'Air Squats', amount: '10' },
          { text: 'Empty bar hang clean drill (slow)', amount: '8' },
          { text: 'Empty bar front squats', amount: '8' },
          { text: 'Build to working weight over 2-3 sets', amount: '' },
        ],
      },
      {
        id: 'a-wed-a', type: 'superset', name: 'Hang Clean + Hollow',
        rounds: 5, rest: 90, note: 'Power work — crisp reps, never to failure.',
        items: [
          { ex: 'hang-clean',  sets: 5, reps: 3,  rpe: '7', weight: 55 },
          { ex: 'hollow-rocks', sets: 5, reps: 10, rpe: '', weight: 0 },
        ],
      },
      {
        id: 'a-wed-b', type: 'circuit', name: 'Sweat Circuit',
        rounds: 4, rest: 60, note: 'Move steadily, no rest between exercises. 60s between rounds.',
        items: [
          { ex: 'thruster', sets: 4, reps: 10,  rpe: '6-7', weight: 45 },
          { ex: 'rower',    sets: 4, reps: 250, rpe: '',    weight: 0 },
          { ex: 'burpee',   sets: 4, reps: 8,   rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'a-wed-c', type: 'circuit', name: 'Ab Circuit',
        rounds: 3, rest: 45,
        items: [
          { ex: 'dead-bug',     sets: 3, reps: 10, rpe: '', weight: 0 },
          { ex: 'plank-taps',   sets: 3, reps: 20, rpe: '', weight: 0 },
          { ex: 'cable-crunch', sets: 3, reps: 15, rpe: '6-7', weight: 40 },
        ],
      },
    ],
  },

  4: { // Thursday
    name: 'RDL + Glutes',
    focus: 'Hinge · Glutes · Hamstrings · Calves',
    minutes: 50,
    blocks: [
      {
        id: 'a-thu-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: '90/90 Hip Switches', amount: '10' },
          { text: 'Single Leg Glute Bridges', amount: '10/side' },
          { text: 'Bodyweight Good Mornings', amount: '12' },
          { text: 'Walking Lunges (bodyweight)', amount: '10/side' },
          { text: 'Light RDL (empty bar)', amount: '10' },
          { text: 'Work up to working weight over 2 warm-up sets', amount: '' },
        ],
      },
      {
        id: 'a-thu-a', type: 'superset', name: 'Hinge + Lunge',
        rounds: 4, rest: 90,
        items: [
          { ex: 'rdl',           sets: 4, reps: 8,  rpe: '7-8', weight: 95 },
          { ex: 'walking-lunge', sets: 4, reps: 10, rpe: '6-7', weight: 20 },
        ],
      },
      {
        id: 'a-thu-b', type: 'superset', name: 'Thrust + Curl',
        rounds: 3, rest: 60,
        items: [
          { ex: 'hip-thrust',     sets: 3, reps: 10, rpe: '7-8', weight: 135 },
          { ex: 'lying-leg-curl', sets: 3, reps: 12, rpe: '7-8', weight: 60 },
        ],
      },
      {
        id: 'a-thu-c', type: 'superset', name: 'Posterior + Calf',
        rounds: 3, rest: 60,
        items: [
          { ex: 'back-extension', sets: 3, reps: 12, rpe: '6-7', weight: 0 },
          { ex: 'standing-calf',  sets: 3, reps: 15, rpe: '6-7', weight: 70 },
        ],
      },
      {
        id: 'a-thu-d', type: 'circuit', name: 'Core Finisher',
        rounds: 2, rest: 45,
        items: [
          { ex: 'reverse-crunch', sets: 2, reps: 15, rpe: '', weight: 0 },
          { ex: 'pallof-press',   sets: 2, reps: 10, rpe: '6-7', weight: 20 },
        ],
      },
    ],
  },

  5: { // Friday
    name: 'Push Jerk + Upper',
    focus: 'Overhead Power · Lats · Handstand · Abs',
    minutes: 48,
    blocks: [
      {
        id: 'a-fri-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Wrist circles & stretches', amount: ':45' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Band Overhead Press', amount: '12' },
          { text: 'Empty bar push jerk drill', amount: '8' },
          { text: 'Hollow Body practice', amount: ':20 ×2' },
          { text: 'Work up to working weight over 2 warm-up sets', amount: '' },
        ],
      },
      {
        id: 'a-fri-a', type: 'superset', name: 'Push Jerk + Hollow',
        rounds: 5, rest: 90, note: 'Drive with the legs — fast dip, punch under the bar.',
        items: [
          { ex: 'push-jerk',    sets: 5, reps: 3,  rpe: '7-8', weight: 65 },
          { ex: 'hollow-rocks', sets: 5, reps: 10, rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'a-fri-b', type: 'circuit', name: 'Handstand Skill',
        rounds: 3, rest: 60, note: 'Short and crisp — quality over fatigue.',
        items: [
          { ex: 'wall-walk',      sets: 3, reps: 3,  rpe: '', weight: 0 },
          { ex: 'wall-hold-back', sets: 3, reps: 30, rpe: '', weight: 0 },
        ],
      },
      {
        id: 'a-fri-c', type: 'superset', name: 'Lats + Carry',
        rounds: 3, rest: 60,
        items: [
          { ex: 'lat-pulldown', sets: 3, reps: 8,  rpe: '7-8', weight: 75 },
          { ex: 'farmer-carry', sets: 3, reps: 40, rpe: '6-7', weight: 35 },
        ],
      },
      {
        id: 'a-fri-d', type: 'circuit', name: 'Ab Circuit',
        rounds: 2, rest: 45,
        items: [
          { ex: 'mountain-climber', sets: 2, reps: 30, rpe: '', weight: 0 },
          { ex: 'v-up',             sets: 2, reps: 12, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  6: { name: 'Rest Day', focus: 'Optional: walk, stretch, or light yoga', minutes: 0, blocks: [], rest: true },
  0: { name: 'Rest Day', focus: 'Recovery — sleep, protein, hydrate', minutes: 0, blocks: [], rest: true },
};

const WEEK_B = {
  1: { // Monday
    name: 'Front Squat + Legs',
    focus: 'Front Squat · Single Leg · Quads · Core',
    minutes: 50,
    blocks: [
      {
        id: 'b-mon-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Samson Stretch & Lunge', amount: ':30/side' },
          { text: 'Wrist & front-rack stretch', amount: ':30' },
          { text: 'Single Leg Glute Bridges', amount: '10/side' },
          { text: 'Cossack Squats', amount: '10' },
          { text: 'Air Squats', amount: '10' },
          { text: 'Empty bar front squats', amount: '10' },
          { text: 'Work up to working weight over 2-3 warm-up sets', amount: '' },
        ],
      },
      {
        id: 'b-mon-a', type: 'superset', name: 'Front Squat + Box Jumps',
        rounds: 5, rest: 90,
        items: [
          { ex: 'front-squat', sets: 5, reps: 5, rpe: '7-8', weight: 65 },
          { ex: 'box-jump',    sets: 5, reps: 5, rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'b-mon-b', type: 'superset', name: 'Bulgarian Split Squats',
        rounds: 3, rest: 90, note: 'Left leg, then right leg — that’s one round.',
        items: [
          { ex: 'bulgarian-split', sets: 3, reps: 10, rpe: '7-8', weight: 20 },
          { ex: 'jumping-squat',   sets: 3, reps: 8,  rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'b-mon-c', type: 'superset', name: 'Machine + Calf',
        rounds: 3, rest: 60,
        items: [
          { ex: 'hack-squat',  sets: 3, reps: 10, rpe: '7-8', weight: 90 },
          { ex: 'seated-calf', sets: 3, reps: 15, rpe: '6-7', weight: 45 },
        ],
      },
      {
        id: 'b-mon-d', type: 'circuit', name: 'Core Finisher',
        rounds: 2, rest: 45,
        items: [
          { ex: 'ab-wheel',       sets: 2, reps: 12, rpe: '', weight: 0 },
          { ex: 'reverse-crunch', sets: 2, reps: 15, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  2: { // Tuesday
    name: 'Clean & Jerk + Pull',
    focus: 'Full Body Power · Lats · Back · Core',
    minutes: 50,
    blocks: [
      {
        id: 'b-tue-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Jump Rope (easy pace)', amount: '1:00' },
          { text: 'Wrist circles & front-rack stretch', amount: ':45' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Empty bar clean & jerk drill (slow)', amount: '6' },
          { text: 'Dead Hang', amount: ':30' },
          { text: 'Build to working weight over 2-3 sets', amount: '' },
        ],
      },
      {
        id: 'b-tue-a', type: 'superset', name: 'Clean & Jerk + Hollow',
        rounds: 6, rest: 90, note: 'Power work — crisp singles and doubles, never to failure.',
        items: [
          { ex: 'clean-jerk',  sets: 6, reps: 2,  rpe: '7', weight: 65 },
          { ex: 'hollow-hold', sets: 6, reps: 15, rpe: '',  weight: 0 },
        ],
      },
      {
        id: 'b-tue-b', type: 'superset', name: 'Pull-Ups + Swing',
        rounds: 3, rest: 60, note: 'Swap to Assisted Pull-Up or Lat Pulldown any time.',
        items: [
          { ex: 'pull-up',  sets: 3, reps: 6,  rpe: '8', weight: 0 },
          { ex: 'kb-swing', sets: 3, reps: 15, rpe: '6-7', weight: 35 },
        ],
      },
      {
        id: 'b-tue-c', type: 'superset', name: 'Row + Rear Delt',
        rounds: 3, rest: 60,
        items: [
          { ex: 'barbell-row', sets: 3, reps: 10, rpe: '7-8', weight: 65 },
          { ex: 'face-pull',   sets: 3, reps: 15, rpe: '6-7', weight: 25 },
        ],
      },
      {
        id: 'b-tue-d', type: 'circuit', name: 'Core Finisher',
        rounds: 2, rest: 45,
        items: [
          { ex: 'hanging-leg', sets: 2, reps: 10, rpe: '', weight: 0 },
          { ex: 'side-plank',  sets: 2, reps: 30, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  3: { // Wednesday
    name: 'Conditioning + Core',
    focus: 'Full Body Cardio · Abs',
    minutes: 45,
    blocks: [
      {
        id: 'b-wed-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Jump Rope (easy pace)', amount: '1:00' },
          { text: 'Arm Circles + Leg Swings', amount: '10 each' },
          { text: 'Air Squats', amount: '10' },
          { text: 'Inchworm Walkouts', amount: '5' },
          { text: 'Light KB Swings', amount: '10' },
        ],
      },
      {
        id: 'b-wed-a', type: 'circuit', name: 'Engine Circuit',
        rounds: 4, rest: 60, note: 'Move steadily, no rest between exercises. 60s between rounds.',
        items: [
          { ex: 'wall-ball',        sets: 4, reps: 12, rpe: '6-7', weight: 10 },
          { ex: 'air-bike',         sets: 4, reps: 10, rpe: '',    weight: 0 },
          { ex: 'kb-swing',         sets: 4, reps: 15, rpe: '6-7', weight: 35 },
          { ex: 'mountain-climber', sets: 4, reps: 30, rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'b-wed-b', type: 'circuit', name: 'Ab Circuit',
        rounds: 3, rest: 45,
        items: [
          { ex: 'hanging-leg',  sets: 3, reps: 10, rpe: '', weight: 0 },
          { ex: 'pallof-press', sets: 3, reps: 10, rpe: '6-7', weight: 20 },
          { ex: 'body-saw',     sets: 3, reps: 10, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  4: { // Thursday
    name: 'Deadlift + Glutes',
    focus: 'Deadlift · Glutes · Hamstrings · Calves',
    minutes: 50,
    blocks: [
      {
        id: 'b-thu-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: '90/90 Hip Switches', amount: '10' },
          { text: 'Single Leg Glute Bridges', amount: '10/side' },
          { text: 'Bodyweight Good Mornings', amount: '12' },
          { text: 'Glute Bridge Hold', amount: ':30' },
          { text: 'Light Deadlift (135 or less)', amount: '8' },
          { text: 'Work up to working weight over 2-3 warm-up sets', amount: '' },
        ],
      },
      {
        id: 'b-thu-a', type: 'superset', name: 'Deadlift + Bridge',
        rounds: 4, rest: 120,
        items: [
          { ex: 'deadlift',     sets: 4, reps: 5,  rpe: '7-8', weight: 135 },
          { ex: 'glute-bridge', sets: 4, reps: 15, rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'b-thu-b', type: 'superset', name: 'Thrust + Curl',
        rounds: 3, rest: 60,
        items: [
          { ex: 'smith-hip-thrust', sets: 3, reps: 10, rpe: '7-8', weight: 115 },
          { ex: 'seated-leg-curl',  sets: 3, reps: 12, rpe: '7-8', weight: 60 },
        ],
      },
      {
        id: 'b-thu-c', type: 'superset', name: 'Posterior + Calf',
        rounds: 3, rest: 60,
        items: [
          { ex: 'cable-pullthrough', sets: 3, reps: 12, rpe: '6-7', weight: 40 },
          { ex: 'single-leg-calf',   sets: 3, reps: 12, rpe: '6-7', weight: 0 },
        ],
      },
      {
        id: 'b-thu-d', type: 'circuit', name: 'Core Finisher',
        rounds: 2, rest: 45,
        items: [
          { ex: 'dead-bug',   sets: 2, reps: 10, rpe: '', weight: 0 },
          { ex: 'plank',      sets: 2, reps: 45, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  5: { // Friday
    name: 'Push Press + Skill',
    focus: 'Overhead Power · Back · Skill · Abs',
    minutes: 48,
    blocks: [
      {
        id: 'b-fri-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Wrist circles & stretches', amount: ':45' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Band Overhead Press', amount: '12' },
          { text: 'Empty Bar Push Press', amount: '10' },
          { text: 'Hollow Body practice', amount: ':20 ×2' },
          { text: 'Work up to working weight over 2 warm-up sets', amount: '' },
        ],
      },
      {
        id: 'b-fri-a', type: 'superset', name: 'Push Press + Hollow',
        rounds: 4, rest: 90,
        items: [
          { ex: 'push-press',   sets: 4, reps: 6,  rpe: '7-8', weight: 55 },
          { ex: 'hollow-rocks', sets: 4, reps: 12, rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'b-fri-b', type: 'circuit', name: 'Skill Circuit',
        rounds: 2, rest: 60, note: 'Light skill touch-up — quality over fatigue.',
        items: [
          { ex: 'pike-pushup', sets: 2, reps: 8,  rpe: '', weight: 0 },
          { ex: 'crow-pose',   sets: 2, reps: 15, rpe: '', weight: 0 },
        ],
      },
      {
        id: 'b-fri-c', type: 'superset', name: 'Row + Carry',
        rounds: 3, rest: 60,
        items: [
          { ex: 'cable-row',      sets: 3, reps: 10, rpe: '7-8', weight: 70 },
          { ex: 'suitcase-carry', sets: 3, reps: 40, rpe: '6-7', weight: 30 },
        ],
      },
      {
        id: 'b-fri-d', type: 'circuit', name: 'Ab Circuit',
        rounds: 2, rest: 45,
        items: [
          { ex: 'v-up',          sets: 2, reps: 12, rpe: '', weight: 0 },
          { ex: 'plank-taps',    sets: 2, reps: 20, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  6: { name: 'Rest Day', focus: 'Optional: walk, stretch, or light yoga', minutes: 0, blocks: [], rest: true },
  0: { name: 'Rest Day', focus: 'Recovery — sleep, protein, hydrate', minutes: 0, blocks: [], rest: true },
};

const DEFAULT_PROGRAM = { weeks: [WEEK_A, WEEK_B] };

// A Monday used as the fixed anchor for week A/B alternation
const EPOCH_MONDAY = '2026-01-05';

// ── Legacy block map ──────────────────────────────────────────
// Maps blocks from the original single-week program (v1) that no longer
// exist, so old logged sets keep their exercise identity after migration.
const LEGACY_BLOCKS = {
  'tue-a': [{ ex: 'wall-walk', reps: 3 }, { ex: 'wall-hold-chest', reps: 25 }, { ex: 'hollow-hold', reps: 20 }],
  'tue-b': [{ ex: 'lat-pulldown', reps: 10 }, { ex: 'kb-swing', reps: 15 }],
  'tue-c': [{ ex: 'cs-row', reps: 12 }, { ex: 'straight-arm-pd', reps: 12 }],
  'tue-d': [{ ex: 'hanging-knee', reps: 12 }, { ex: 'side-plank', reps: 30 }],
  'wed-a': [{ ex: 'thruster', reps: 10 }, { ex: 'kb-swing', reps: 15 }, { ex: 'rower', reps: 250 }, { ex: 'burpee', reps: 8 }],
  'wed-b': [{ ex: 'dead-bug', reps: 10 }, { ex: 'plank-taps', reps: 20 }, { ex: 'cable-crunch', reps: 15 }],
  'wed-c': [{ ex: 'plank', reps: 20 }],
  'thu-a': [{ ex: 'rdl', reps: 8 }, { ex: 'walking-lunge', reps: 10 }],
  'thu-b': [{ ex: 'hip-thrust', reps: 10 }, { ex: 'lying-leg-curl', reps: 12 }],
  'thu-c': [{ ex: 'back-extension', reps: 12 }, { ex: 'standing-calf', reps: 15 }],
  'thu-d': [{ ex: 'reverse-crunch', reps: 15 }, { ex: 'pallof-press', reps: 10 }],
  'fri-a': [{ ex: 'push-press', reps: 6 }, { ex: 'hollow-rocks', reps: 12 }],
  'fri-b': [{ ex: 'pike-pushup', reps: 8 }, { ex: 'wall-hold-back', reps: 30 }, { ex: 'crow-pose', reps: 15 }],
  'fri-c': [{ ex: 'lat-pulldown', reps: 8 }, { ex: 'farmer-carry', reps: 40 }],
  'fri-d': [{ ex: 'mountain-climber', reps: 30 }, { ex: 'v-up', reps: 12 }, { ex: 'russian-twist', reps: 20 }],
};
