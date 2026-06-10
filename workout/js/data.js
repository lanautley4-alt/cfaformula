/* ============================================================
   Workout Tracker — Exercise Library & Default Program
   ============================================================ */

// ── Exercise library ──────────────────────────────────────────
// pattern: squat | lunge | hinge | hamstring | quad | glute | calf |
//          pull_v | pull_h | press | handstand | core_ae (anti-extension) |
//          core_flex | core_obl | carry | conditioning
// load: 'weight' (lbs input) | 'bw' (bodyweight) | 'time' (seconds)
// repUnit: label for the reps field ('rep' | 'sec' | 'm' | 'cal' | 'yd')
// inc: weight increment on successful progression

const BUILTIN_EXERCISES = [
  // Squat pattern
  { id: 'back-squat',        name: 'Back Squat',                pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'front-squat',       name: 'Front Squat',               pattern: 'squat',  muscles: ['quads', 'core'],   equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'goblet-squat',      name: 'Goblet Squat',              pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'smith-squat',       name: 'Smith Machine Squat',       pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'smith',     load: 'weight', inc: 5 },
  { id: 'hack-squat',        name: 'Hack Squat',                pattern: 'squat',  muscles: ['quads'],           equip: 'machine',   load: 'weight', inc: 10 },
  { id: 'leg-press',         name: 'Leg Press',                 pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'machine',   load: 'weight', inc: 10 },
  { id: 'heels-db-squat',    name: 'Heels-Elevated DB Squat',   pattern: 'squat',  muscles: ['quads'],           equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'box-jump',          name: 'Box Jump',                  pattern: 'squat',  muscles: ['quads', 'glutes'], equip: 'bodyweight', load: 'bw' },
  { id: 'jumping-squat',     name: 'Jumping Squat',             pattern: 'squat',  muscles: ['quads'],           equip: 'bodyweight', load: 'bw' },

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

  // Hinge / glutes
  { id: 'rdl',               name: 'Romanian Deadlift',         pattern: 'hinge',  muscles: ['hamstrings', 'glutes'], equip: 'barbell',  load: 'weight', inc: 5 },
  { id: 'db-rdl',            name: 'Dumbbell RDL',              pattern: 'hinge',  muscles: ['hamstrings', 'glutes'], equip: 'dumbbell', load: 'weight', inc: 5 },
  { id: 'deadlift',          name: 'Deadlift',                  pattern: 'hinge',  muscles: ['hamstrings', 'glutes', 'back'], equip: 'barbell', load: 'weight', inc: 10 },
  { id: 'single-leg-rdl',    name: 'Single-Leg RDL',            pattern: 'hinge',  muscles: ['hamstrings', 'glutes'], equip: 'dumbbell', load: 'weight', inc: 5 },
  { id: 'good-morning',      name: 'Good Morning',              pattern: 'hinge',  muscles: ['hamstrings', 'back'],   equip: 'barbell',  load: 'weight', inc: 5 },
  { id: 'back-extension',    name: 'Back Extension',            pattern: 'hinge',  muscles: ['glutes', 'hamstrings', 'back'], equip: 'machine', load: 'bw' },
  { id: 'hip-thrust',        name: 'Hip Thrust',                pattern: 'glute',  muscles: ['glutes'],          equip: 'barbell',   load: 'weight', inc: 10 },
  { id: 'smith-hip-thrust',  name: 'Smith Machine Hip Thrust',  pattern: 'glute',  muscles: ['glutes'],          equip: 'smith',     load: 'weight', inc: 10 },
  { id: 'glute-bridge',      name: 'Glute Bridge',              pattern: 'glute',  muscles: ['glutes'],          equip: 'bodyweight', load: 'bw' },
  { id: 'cable-pullthrough', name: 'Cable Pull-Through',        pattern: 'glute',  muscles: ['glutes', 'hamstrings'], equip: 'cable', load: 'weight', inc: 5 },
  { id: 'cable-kickback',    name: 'Cable Glute Kickback',      pattern: 'glute',  muscles: ['glutes'],          equip: 'cable',     load: 'weight', inc: 2.5 },
  { id: 'abduction-machine', name: 'Hip Abduction Machine',     pattern: 'glute',  muscles: ['glutes'],          equip: 'machine',   load: 'weight', inc: 5 },

  // Hamstring / quad isolation
  { id: 'lying-leg-curl',    name: 'Lying Leg Curl',            pattern: 'hamstring', muscles: ['hamstrings'],   equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'seated-leg-curl',   name: 'Seated Leg Curl',           pattern: 'hamstring', muscles: ['hamstrings'],   equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'nordic-curl',       name: 'Nordic Curl',               pattern: 'hamstring', muscles: ['hamstrings'],   equip: 'bodyweight', load: 'bw' },
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

  // Horizontal pull (back)
  { id: 'barbell-row',       name: 'Barbell Row',               pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'cs-row',            name: 'Chest-Supported Row',       pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'machine',   load: 'weight', inc: 5 },
  { id: 'cable-row',         name: 'Seated Cable Row',          pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'cable',     load: 'weight', inc: 5 },
  { id: 'db-row',            name: 'Single-Arm DB Row',         pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'dumbbell',  load: 'weight', inc: 5 },
  { id: 'tbar-row',          name: 'T-Bar Row',                 pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'barbell',   load: 'weight', inc: 5 },
  { id: 'inverted-row',      name: 'Inverted Row',              pattern: 'pull_h', muscles: ['back', 'lats'],    equip: 'bodyweight', load: 'bw' },
  { id: 'face-pull',         name: 'Face Pull',                 pattern: 'pull_h', muscles: ['back', 'shoulders'], equip: 'cable',   load: 'weight', inc: 2.5 },

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

  // Core — anti-extension
  { id: 'ab-wheel',          name: 'Ab Wheel Rollout',          pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'bw' },
  { id: 'plank',             name: 'Plank',                     pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'plank-taps',        name: 'Plank Shoulder Taps',       pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'bw' },
  { id: 'dead-bug',          name: 'Dead Bug',                  pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'bw' },
  { id: 'body-saw',          name: 'Body Saw',                  pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'bw' },
  { id: 'hanging-knee',      name: 'Hanging Knee Raise',        pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },
  { id: 'hanging-leg',       name: 'Hanging Leg Raise',         pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },

  // Core — flexion / oblique / waist
  { id: 'bicycle-crunch',    name: 'Bicycle Crunch',            pattern: 'core_flex', muscles: ['core', 'obliques'], equip: 'bodyweight', load: 'bw' },
  { id: 'cable-crunch',      name: 'Cable Crunch',              pattern: 'core_flex', muscles: ['core'],         equip: 'cable',     load: 'weight', inc: 5 },
  { id: 'reverse-crunch',    name: 'Reverse Crunch',            pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },
  { id: 'v-up',              name: 'V-Up',                      pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },
  { id: 'hollow-rocks',      name: 'Hollow Rocks',              pattern: 'core_flex', muscles: ['core'],         equip: 'bodyweight', load: 'bw' },
  { id: 'side-plank',        name: 'Side Plank (each side)',    pattern: 'core_obl', muscles: ['obliques'],      equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'pallof-press',      name: 'Pallof Press (each side)',  pattern: 'core_obl', muscles: ['obliques', 'core'], equip: 'cable',  load: 'weight', inc: 2.5 },
  { id: 'russian-twist',     name: 'Russian Twist',             pattern: 'core_obl', muscles: ['obliques'],      equip: 'bodyweight', load: 'bw' },
  { id: 'woodchopper',       name: 'Cable Woodchopper',         pattern: 'core_obl', muscles: ['obliques'],      equip: 'cable',     load: 'weight', inc: 2.5 },
  { id: 'stomach-vacuum',    name: 'Stomach Vacuum',            pattern: 'core_ae', muscles: ['core'],           equip: 'bodyweight', load: 'time', repUnit: 'sec' },

  // Carries
  { id: 'farmer-carry',      name: 'Farmer Carry',              pattern: 'carry',  muscles: ['core', 'back'],    equip: 'dumbbell',  load: 'weight', inc: 10, repUnit: 'yd' },
  { id: 'suitcase-carry',    name: 'Suitcase Carry (each side)', pattern: 'carry', muscles: ['obliques', 'core'], equip: 'dumbbell', load: 'weight', inc: 5, repUnit: 'yd' },
  { id: 'overhead-carry',    name: 'Overhead Carry',            pattern: 'carry',  muscles: ['shoulders', 'core'], equip: 'dumbbell', load: 'weight', inc: 5, repUnit: 'yd' },

  // Conditioning / cardio
  { id: 'kb-swing',          name: 'Kettlebell Swing',          pattern: 'conditioning', muscles: ['glutes', 'cardio'], equip: 'kettlebell', load: 'weight', inc: 9 },
  { id: 'rower',             name: 'Row (erg)',                 pattern: 'conditioning', muscles: ['cardio', 'back'], equip: 'cardio', load: 'bw', repUnit: 'm' },
  { id: 'air-bike',          name: 'Air Bike',                  pattern: 'conditioning', muscles: ['cardio'],    equip: 'cardio',    load: 'bw', repUnit: 'cal' },
  { id: 'burpee',            name: 'Burpees',                   pattern: 'conditioning', muscles: ['cardio'],    equip: 'bodyweight', load: 'bw' },
  { id: 'mountain-climber',  name: 'Mountain Climbers',         pattern: 'conditioning', muscles: ['cardio', 'core'], equip: 'bodyweight', load: 'bw' },
  { id: 'jump-rope',         name: 'Jump Rope',                 pattern: 'conditioning', muscles: ['cardio', 'calves'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'sled-push',         name: 'Sled Push',                 pattern: 'conditioning', muscles: ['legs', 'cardio'], equip: 'machine', load: 'weight', inc: 10, repUnit: 'yd' },
  { id: 'battle-ropes',      name: 'Battle Ropes',              pattern: 'conditioning', muscles: ['cardio', 'shoulders'], equip: 'bodyweight', load: 'time', repUnit: 'sec' },
  { id: 'wall-ball',         name: 'Wall Balls',                pattern: 'conditioning', muscles: ['legs', 'shoulders'], equip: 'bodyweight', load: 'weight', inc: 2 },
  { id: 'incline-walk',      name: 'Incline Treadmill Walk',    pattern: 'conditioning', muscles: ['cardio'],    equip: 'cardio',    load: 'time', repUnit: 'sec' },
];

// ── Default 5-day program ─────────────────────────────────────
// days keyed 0 (Sun) … 6 (Sat) to match Date.getDay()
// block.type: 'warmup' | 'superset' | 'circuit'
// item: { ex, sets, reps, rpe, weight } — weight is the starting suggestion

const DEFAULT_PROGRAM = {
  1: { // Monday
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
    name: 'Back & Lats + Handstand',
    focus: 'Lats · Upper Back · Handstand Skill · Core',
    minutes: 48,
    blocks: [
      {
        id: 'tue-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Wrist circles & stretches', amount: ':45' },
          { text: 'Cat-Cow', amount: '10' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Scapula Pull-Ups (dead hang shrugs)', amount: '8' },
          { text: 'Hollow Body practice', amount: ':20 ×2' },
          { text: 'Dead Hang', amount: ':30' },
        ],
      },
      {
        id: 'tue-a', type: 'circuit', name: 'Handstand Skill',
        rounds: 3, rest: 60, note: 'Fresh shoulders first. Quality over fatigue.',
        items: [
          { ex: 'wall-walk',       sets: 3, reps: 3,  rpe: '', weight: 0 },
          { ex: 'wall-hold-chest', sets: 3, reps: 25, rpe: '', weight: 0 },
          { ex: 'hollow-hold',     sets: 3, reps: 20, rpe: '', weight: 0 },
        ],
      },
      {
        id: 'tue-b', type: 'superset', name: 'Lats + Swing',
        rounds: 3, rest: 60,
        items: [
          { ex: 'lat-pulldown', sets: 3, reps: 10, rpe: '7-8', weight: 70 },
          { ex: 'kb-swing',     sets: 3, reps: 15, rpe: '6-7', weight: 35 },
        ],
      },
      {
        id: 'tue-c', type: 'superset', name: 'Row + Pulldown',
        rounds: 3, rest: 60,
        items: [
          { ex: 'cs-row',          sets: 3, reps: 12, rpe: '7-8', weight: 60 },
          { ex: 'straight-arm-pd', sets: 3, reps: 12, rpe: '6-7', weight: 30 },
        ],
      },
      {
        id: 'tue-d', type: 'circuit', name: 'Core Finisher',
        rounds: 2, rest: 45,
        items: [
          { ex: 'hanging-knee', sets: 2, reps: 12, rpe: '', weight: 0 },
          { ex: 'side-plank',   sets: 2, reps: 30, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  3: { // Wednesday
    name: 'Conditioning + Core',
    focus: 'Full Body Cardio · Abs · Waist',
    minutes: 45,
    blocks: [
      {
        id: 'wed-warmup', type: 'warmup', name: 'Warm-up',
        steps: [
          { text: 'Jump Rope (easy pace)', amount: '1:00' },
          { text: 'Arm Circles + Leg Swings', amount: '10 each' },
          { text: 'Air Squats', amount: '10' },
          { text: 'Inchworm Walkouts', amount: '5' },
          { text: 'Light Thrusters (empty bar)', amount: '8' },
        ],
      },
      {
        id: 'wed-a', type: 'circuit', name: 'Sweat Circuit',
        rounds: 4, rest: 60, note: 'Move steadily, no rest between exercises. 60s between rounds.',
        items: [
          { ex: 'thruster', sets: 4, reps: 10,  rpe: '6-7', weight: 45 },
          { ex: 'kb-swing', sets: 4, reps: 15,  rpe: '6-7', weight: 35 },
          { ex: 'rower',    sets: 4, reps: 250, rpe: '',    weight: 0 },
          { ex: 'burpee',   sets: 4, reps: 8,   rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'wed-b', type: 'circuit', name: 'Ab Circuit',
        rounds: 3, rest: 45,
        items: [
          { ex: 'dead-bug',     sets: 3, reps: 10, rpe: '', weight: 0 },
          { ex: 'plank-taps',   sets: 3, reps: 20, rpe: '', weight: 0 },
          { ex: 'cable-crunch', sets: 3, reps: 15, rpe: '6-7', weight: 40 },
        ],
      },
      {
        id: 'wed-c', type: 'circuit', name: 'Waist Finisher',
        rounds: 3, rest: 30, note: 'Vacuums on an empty-ish stomach work best. Breathe out fully, pull belly button to spine.',
        items: [
          { ex: 'stomach-vacuum', sets: 3, reps: 20, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  4: { // Thursday
    name: 'Glutes & Hamstrings',
    focus: 'Hinge · Glutes · Hamstrings · Calves',
    minutes: 50,
    blocks: [
      {
        id: 'thu-warmup', type: 'warmup', name: 'Warm-up',
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
        id: 'thu-a', type: 'superset', name: 'Hinge + Lunge',
        rounds: 4, rest: 90,
        items: [
          { ex: 'rdl',           sets: 4, reps: 8,  rpe: '7-8', weight: 95 },
          { ex: 'walking-lunge', sets: 4, reps: 10, rpe: '6-7', weight: 20 },
        ],
      },
      {
        id: 'thu-b', type: 'superset', name: 'Thrust + Curl',
        rounds: 3, rest: 60,
        items: [
          { ex: 'hip-thrust',     sets: 3, reps: 10, rpe: '7-8', weight: 135 },
          { ex: 'lying-leg-curl', sets: 3, reps: 12, rpe: '7-8', weight: 60 },
        ],
      },
      {
        id: 'thu-c', type: 'superset', name: 'Posterior + Calf',
        rounds: 3, rest: 60,
        items: [
          { ex: 'back-extension', sets: 3, reps: 12, rpe: '6-7', weight: 0 },
          { ex: 'standing-calf',  sets: 3, reps: 15, rpe: '6-7', weight: 70 },
        ],
      },
      {
        id: 'thu-d', type: 'circuit', name: 'Core Finisher',
        rounds: 2, rest: 45,
        items: [
          { ex: 'reverse-crunch', sets: 2, reps: 15, rpe: '', weight: 0 },
          { ex: 'pallof-press',   sets: 2, reps: 10, rpe: '6-7', weight: 20 },
        ],
      },
    ],
  },

  5: { // Friday
    name: 'Push Press + Handstand + Abs',
    focus: 'Overhead Power · Handstand Skill · Core',
    minutes: 48,
    blocks: [
      {
        id: 'fri-warmup', type: 'warmup', name: 'Warm-up',
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
        id: 'fri-a', type: 'superset', name: 'Push Press + Hollow',
        rounds: 4, rest: 90,
        items: [
          { ex: 'push-press',   sets: 4, reps: 6,  rpe: '7-8', weight: 55 },
          { ex: 'hollow-rocks', sets: 4, reps: 12, rpe: '',    weight: 0 },
        ],
      },
      {
        id: 'fri-b', type: 'circuit', name: 'Handstand Skill',
        rounds: 3, rest: 60,
        items: [
          { ex: 'pike-pushup',    sets: 3, reps: 8,  rpe: '', weight: 0 },
          { ex: 'wall-hold-back', sets: 3, reps: 30, rpe: '', weight: 0 },
          { ex: 'crow-pose',      sets: 3, reps: 15, rpe: '', weight: 0 },
        ],
      },
      {
        id: 'fri-c', type: 'superset', name: 'Lats + Carry',
        rounds: 3, rest: 60,
        items: [
          { ex: 'lat-pulldown', sets: 3, reps: 8,  rpe: '7-8', weight: 75 },
          { ex: 'farmer-carry', sets: 3, reps: 40, rpe: '6-7', weight: 35 },
        ],
      },
      {
        id: 'fri-d', type: 'circuit', name: 'Ab Circuit',
        rounds: 2, rest: 45,
        items: [
          { ex: 'mountain-climber', sets: 2, reps: 30, rpe: '', weight: 0 },
          { ex: 'v-up',             sets: 2, reps: 12, rpe: '', weight: 0 },
          { ex: 'russian-twist',    sets: 2, reps: 20, rpe: '', weight: 0 },
        ],
      },
    ],
  },

  6: { // Saturday — rest
    name: 'Rest Day',
    focus: 'Optional: walk, stretch, or light yoga',
    minutes: 0,
    blocks: [],
    rest: true,
  },

  0: { // Sunday — rest
    name: 'Rest Day',
    focus: 'Recovery — sleep, protein, hydrate',
    minutes: 0,
    blocks: [],
    rest: true,
  },
};
