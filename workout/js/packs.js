/* ============================================================
   Workout Tracker — Seed packs
   ------------------------------------------------------------
   Workouts and week templates shipped with an app update rather
   than built by hand. Each pack is added to the library once;
   plan.seeded remembers which packs have landed, so anything you
   delete stays deleted and edits are never overwritten.
   ============================================================ */

const pkB = (id, type, name, rounds, rest, items, note) => {
  const b = { id, type, name, rounds, rest, items };
  if (note) b.note = note;
  return b;
};
const pkW = (id, name, steps) => ({ id, type: 'warmup', name, steps });
const pkX = (ex, sets, reps, rpe, weight) => ({ ex, sets, reps, rpe: rpe || '', weight: weight || 0 });

// Shared warm-ups ─────────────────────────────────────────────
const WU_GENTLE = [
  { text: 'Cat-Cow', amount: '10' },
  { text: '90/90 Hip Switches', amount: '10' },
  { text: 'Band Pull-Aparts', amount: '15' },
  { text: 'Glute Bridge Hold', amount: ':30' },
  { text: 'Easy walk or bike', amount: '5:00' },
];
const WU_LEGS = [
  { text: 'Samson Stretch & Lunge', amount: ':30/side' },
  { text: 'Active Pigeon Pose', amount: ':30/side' },
  { text: 'Single Leg Glute Bridges', amount: '10/side' },
  { text: 'Cossack Squats', amount: '10' },
  { text: 'Air Squats', amount: '10' },
  { text: 'Work up over 2-3 warm-up sets', amount: '' },
];
const WU_QUICK = [
  { text: 'Jump Rope or easy bike', amount: '2:00' },
  { text: 'Arm Circles + Leg Swings', amount: '10 each' },
  { text: 'Air Squats', amount: '10' },
  { text: 'One light set of the first movement', amount: '' },
];
const WU_CARDIO = [
  { text: 'Easy pace, build gradually', amount: '3:00' },
  { text: 'Leg Swings + Ankle Circles', amount: '10 each' },
  { text: 'Inchworm Walkouts', amount: '5' },
];

const PACK_2026_09 = {
  id: 'pack-2026-09',

  workouts: [
    // ── Back-safe: nothing loading or bending the spine ──────
    {
      id: 'w-bs-push', name: 'Push · Back Supported', minutes: 50,
      focus: 'Shoulders · Chest · Upper Back — seated & supported',
      blocks: [
        pkW('bs-push-wu', 'Warm-up', WU_GENTLE),
        pkB('bs-push-a', 'superset', 'Seated Press + Face Pull', 4, 90, [
          pkX('db-press', 4, 10, '7-8', 20), pkX('face-pull', 4, 15, '6-7', 25),
        ]),
        pkB('bs-push-b', 'superset', 'Pullover + Rear Delt', 3, 60, [
          pkX('machine-pullover', 3, 12, '7-8', 50), pkX('rear-delt-fly', 3, 15, '6-7', 30),
        ]),
        pkB('bs-push-c', 'circuit', 'Core', 3, 45, [
          pkX('dead-bug', 3, 10), pkX('side-plank', 3, 30),
        ]),
      ],
    },
    {
      id: 'w-bs-pull', name: 'Pull · Chest Supported', minutes: 55,
      focus: 'Lats · Upper Back — no free-standing rows',
      blocks: [
        pkW('bs-pull-wu', 'Warm-up', WU_GENTLE),
        pkB('bs-pull-a', 'superset', 'Row + Pulldown', 4, 90, [
          pkX('cs-row', 4, 12, '7-8', 60), pkX('lat-pulldown', 4, 10, '7-8', 70),
        ]),
        pkB('bs-pull-b', 'superset', 'Neutral Grip + Straight Arm', 3, 60, [
          pkX('neutral-pulldown', 3, 12, '7-8', 65), pkX('straight-arm-pd', 3, 12, '6-7', 30),
        ]),
        pkB('bs-pull-c', 'superset', 'Rear Delts', 3, 60, [
          pkX('face-pull', 3, 15, '6-7', 25), pkX('rear-delt-fly', 3, 15, '6-7', 30),
        ]),
        pkB('bs-pull-d', 'circuit', 'Core', 3, 45, [
          pkX('pallof-press', 3, 10, '6-7', 20), pkX('dead-bug', 3, 10),
        ]),
      ],
    },
    {
      id: 'w-bs-lower', name: 'Lower · Spine Unloaded', minutes: 50,
      focus: 'Quads · Hams · Glutes — machines only',
      blocks: [
        pkW('bs-lower-wu', 'Warm-up', WU_GENTLE),
        pkB('bs-lower-a', 'superset', 'Extension + Curl', 4, 75, [
          pkX('leg-extension', 4, 12, '7-8', 50), pkX('seated-leg-curl', 4, 12, '7-8', 55),
        ]),
        pkB('bs-lower-b', 'superset', 'Abduction + Adduction', 3, 60, [
          pkX('abduction-machine', 3, 15, '7-8', 70), pkX('adduction-machine', 3, 15, '6-7', 60),
        ]),
        pkB('bs-lower-c', 'superset', 'Glutes + Calves', 3, 60, [
          pkX('cable-kickback', 3, 12, '7-8', 15), pkX('seated-calf', 3, 15, '6-7', 45),
        ]),
        pkB('bs-lower-d', 'circuit', 'Core', 3, 45, [
          pkX('glute-bridge', 3, 15), pkX('side-plank', 3, 30),
        ]),
      ],
    },
    {
      id: 'w-bs-reset', name: 'Walk + Hip & Core Reset', minutes: 40,
      focus: 'Blood flow · Glute activation · Bracing',
      blocks: [
        pkW('bs-reset-wu', 'Warm-up', [
          { text: 'Cat-Cow', amount: '10' },
          { text: '90/90 Hip Switches', amount: '10' },
          { text: 'Standing hip circles', amount: '10/side' },
        ]),
        pkB('bs-reset-a', 'circuit', 'Hip & Core Circuit', 3, 45, [
          pkX('glute-bridge', 3, 15), pkX('dead-bug', 3, 10),
          pkX('side-plank', 3, 30), pkX('frog-pump', 3, 20),
        ], 'No rest between exercises. 45s between rounds.'),
        pkB('bs-reset-b', 'circuit', 'Walk', 2, 60, [
          pkX('incline-walk', 2, 600),
        ], 'Easy incline, conversational pace.'),
      ],
    },
    {
      id: 'w-bs-upper', name: 'Upper · Back Safe', minutes: 55,
      focus: 'Whole upper body — every set seated or supported',
      blocks: [
        pkW('bs-upper-wu', 'Warm-up', WU_GENTLE),
        pkB('bs-upper-a', 'superset', 'Pulldown + Press', 4, 90, [
          pkX('lat-pulldown', 4, 10, '7-8', 70), pkX('db-press', 4, 10, '7-8', 20),
        ]),
        pkB('bs-upper-b', 'superset', 'Row + Rear Delt', 3, 60, [
          pkX('cs-row', 3, 12, '7-8', 60), pkX('rear-delt-fly', 3, 15, '6-7', 30),
        ]),
        pkB('bs-upper-c', 'superset', 'Pullover + Face Pull', 3, 60, [
          pkX('machine-pullover', 3, 12, '7-8', 50), pkX('face-pull', 3, 15, '6-7', 25),
        ]),
        pkB('bs-upper-d', 'circuit', 'Core', 3, 45, [
          pkX('pallof-press', 3, 10, '6-7', 20), pkX('plank', 3, 45),
        ]),
      ],
    },
    {
      id: 'w-cardio-lowimpact', name: 'Low Impact Cardio', minutes: 35,
      focus: 'Steady state · No impact, no hinging',
      blocks: [
        pkW('c-low-wu', 'Warm-up', WU_CARDIO),
        pkB('c-low-a', 'circuit', 'Incline Walk', 2, 60, [pkX('incline-walk', 2, 600)],
          'Incline 8-12%, steady pace you could hold a conversation at.'),
        pkB('c-low-b', 'circuit', 'Bike Finish', 1, 0, [pkX('air-bike', 1, 60)],
          'Easy spin, nothing hard.'),
      ],
    },

    // ── Glutes & legs ────────────────────────────────────────
    {
      id: 'w-glutes-heavy', name: 'Glutes · Heavy', minutes: 50,
      focus: 'Hip Thrust · Split Squat · Hinge',
      blocks: [
        pkW('gh-wu', 'Warm-up', WU_LEGS),
        pkB('gh-a', 'superset', 'Hip Thrust + Bridge', 4, 90, [
          pkX('hip-thrust', 4, 8, '8', 155), pkX('glute-bridge', 4, 15),
        ]),
        pkB('gh-b', 'superset', 'Split Squat + Curl', 3, 90, [
          pkX('bulgarian-split', 3, 10, '7-8', 25), pkX('lying-leg-curl', 3, 12, '7-8', 60),
        ]),
        pkB('gh-c', 'superset', 'RDL + Abduction', 3, 75, [
          pkX('rdl', 3, 8, '7-8', 95), pkX('abduction-machine', 3, 15, '7-8', 70),
        ]),
        pkB('gh-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('hanging-knee', 2, 12), pkX('side-plank', 2, 30),
        ]),
      ],
    },
    {
      id: 'w-glutes-pump', name: 'Glutes · Pump', minutes: 45,
      focus: 'High rep · Cables & machines · Short rest',
      blocks: [
        pkW('gp-wu', 'Warm-up', WU_LEGS),
        pkB('gp-a', 'superset', 'Bridge + Kickback', 4, 60, [
          pkX('kas-glute-bridge', 4, 12, '7-8', 95), pkX('cable-kickback', 4, 15, '7-8', 15),
        ]),
        pkB('gp-b', 'superset', 'Curtsy + Abduction', 3, 60, [
          pkX('curtsy-lunge', 3, 12, '7-8', 20), pkX('abduction-machine', 3, 20, '7-8', 60),
        ]),
        pkB('gp-c', 'circuit', 'Burnout', 3, 45, [
          pkX('frog-pump', 3, 25), pkX('cable-pullthrough', 3, 15, '6-7', 40),
        ], 'No rest between exercises. Chase the burn, not the weight.'),
        pkB('gp-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('reverse-crunch', 2, 15), pkX('plank', 2, 45),
        ]),
      ],
    },
    {
      id: 'w-quad-focus', name: 'Quad Focus', minutes: 50,
      focus: 'Front Squat · Leg Press · Extension',
      blocks: [
        pkW('qf-wu', 'Warm-up', WU_LEGS),
        pkB('qf-a', 'superset', 'Front Squat + Jump', 4, 90, [
          pkX('front-squat', 4, 6, '7-8', 75), pkX('jumping-squat', 4, 8),
        ]),
        pkB('qf-b', 'superset', 'Hack Squat + Lunge', 3, 90, [
          pkX('hack-squat', 3, 10, '7-8', 90), pkX('walking-lunge', 3, 10, '6-7', 20),
        ]),
        pkB('qf-c', 'superset', 'Extension + Calf', 3, 60, [
          pkX('leg-extension', 3, 15, '7-8', 50), pkX('leg-press-calf', 3, 15, '6-7', 55),
        ]),
        pkB('qf-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('ab-wheel', 2, 12), pkX('bicycle-crunch', 2, 20),
        ]),
      ],
    },
    {
      id: 'w-ham-posterior', name: 'Hamstrings & Posterior', minutes: 50,
      focus: 'RDL · Curls · Back Extension',
      blocks: [
        pkW('hp-wu', 'Warm-up', WU_LEGS),
        pkB('hp-a', 'superset', 'RDL + Hollow', 4, 90, [
          pkX('rdl', 4, 8, '7-8', 105), pkX('hollow-hold', 4, 20),
        ]),
        pkB('hp-b', 'superset', 'Curl + Single Leg RDL', 3, 75, [
          pkX('lying-leg-curl', 3, 12, '7-8', 60), pkX('single-leg-rdl', 3, 10, '6-7', 25),
        ]),
        pkB('hp-c', 'superset', 'Extension + Curl', 3, 60, [
          pkX('back-extension', 3, 12, '6-7'), pkX('seated-leg-curl', 3, 15, '7-8', 55),
        ]),
        pkB('hp-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('dead-bug', 2, 10), pkX('side-plank', 2, 30),
        ]),
      ],
    },

    // ── 30 minute versions ───────────────────────────────────
    {
      id: 'w-express-full', name: 'Express Full Body', minutes: 30,
      focus: '30 min · Full body · Minimal rest',
      blocks: [
        pkW('ef-wu', 'Warm-up', WU_QUICK),
        pkB('ef-a', 'superset', 'Squat + Row', 4, 60, [
          pkX('goblet-squat', 4, 10, '7-8', 40), pkX('db-row', 4, 10, '7-8', 30),
        ]),
        pkB('ef-b', 'superset', 'Hinge + Press', 3, 60, [
          pkX('db-rdl', 3, 10, '7-8', 30), pkX('db-press', 3, 10, '7-8', 20),
        ]),
        pkB('ef-c', 'circuit', 'Finisher', 2, 45, [
          pkX('kb-swing', 2, 15, '6-7', 35), pkX('plank-taps', 2, 20),
        ], 'No rest between exercises.'),
      ],
    },
    {
      id: 'w-express-legs', name: 'Express Legs', minutes: 30,
      focus: '30 min · Squat + Glutes',
      blocks: [
        pkW('el-wu', 'Warm-up', WU_QUICK),
        pkB('el-a', 'superset', 'Squat + Lunge', 4, 75, [
          pkX('back-squat', 4, 6, '7-8', 95), pkX('walking-lunge', 4, 10, '6-7', 20),
        ]),
        pkB('el-b', 'superset', 'Thrust + Curl', 3, 60, [
          pkX('hip-thrust', 3, 10, '7-8', 135), pkX('lying-leg-curl', 3, 12, '7-8', 60),
        ]),
        pkB('el-c', 'circuit', 'Finisher', 2, 45, [
          pkX('abduction-machine', 2, 20, '6-7', 60), pkX('reverse-crunch', 2, 15),
        ]),
      ],
    },
    {
      id: 'w-express-upper', name: 'Express Upper', minutes: 30,
      focus: '30 min · Lats · Back · Shoulders',
      blocks: [
        pkW('eu-wu', 'Warm-up', WU_QUICK),
        pkB('eu-a', 'superset', 'Pulldown + Press', 4, 60, [
          pkX('lat-pulldown', 4, 10, '7-8', 70), pkX('db-press', 4, 10, '7-8', 20),
        ]),
        pkB('eu-b', 'superset', 'Row + Face Pull', 3, 60, [
          pkX('cable-row', 3, 12, '7-8', 70), pkX('face-pull', 3, 15, '6-7', 25),
        ]),
        pkB('eu-c', 'circuit', 'Finisher', 2, 45, [
          pkX('hanging-knee', 2, 12), pkX('plank', 2, 45),
        ]),
      ],
    },

    // ── Cardio ───────────────────────────────────────────────
    {
      id: 'w-cardio-intervals', name: 'Intervals', minutes: 30,
      focus: 'Hard efforts · Bike & Rower',
      blocks: [
        pkW('ci-wu', 'Warm-up', WU_CARDIO),
        pkB('ci-a', 'circuit', 'Bike Intervals', 8, 60, [pkX('air-bike', 8, 12)],
          '30s hard, 60s easy. 8 rounds.'),
        pkB('ci-b', 'circuit', 'Row Intervals', 5, 60, [pkX('rower', 5, 250)],
          'Steady hard pace, 60s rest between.'),
      ],
    },
    {
      id: 'w-cardio-steady', name: 'Steady Cardio', minutes: 40,
      focus: 'Zone 2 · Incline walk & stairs',
      blocks: [
        pkW('cs-wu', 'Warm-up', WU_CARDIO),
        pkB('cs-a', 'circuit', 'Incline Walk', 2, 60, [pkX('incline-walk', 2, 600)],
          'Incline 10-12%, steady.'),
        pkB('cs-b', 'circuit', 'Stair Climber', 1, 0, [pkX('stair-climber', 1, 600)],
          'Easy, no leaning on the rails.'),
      ],
    },
    {
      id: 'w-cardio-circuit', name: 'Conditioning Circuit', minutes: 35,
      focus: 'Full body sweat · Kettlebell & bodyweight',
      blocks: [
        pkW('cc-wu', 'Warm-up', WU_QUICK),
        pkB('cc-a', 'circuit', 'Engine Circuit', 4, 60, [
          pkX('kb-swing', 4, 15, '6-7', 35), pkX('burpee', 4, 8),
          pkX('wall-ball', 4, 12, '6-7', 10), pkX('mountain-climber', 4, 30),
        ], 'No rest between exercises. 60s between rounds.'),
        pkB('cc-b', 'circuit', 'Rope Finisher', 3, 45, [
          pkX('jump-rope', 3, 60), pkX('battle-ropes', 3, 30),
        ]),
      ],
    },
  ],

  weeks: [
    {
      id: 'wk-backsafe', name: 'Working Around It', focus: 'Back safe · nothing loading or bending the spine',
      days: { 1: null, 2: 'w-bs-push', 3: 'w-bs-reset', 4: 'w-bs-pull', 5: 'w-bs-lower', 6: 'w-cardio-lowimpact', 0: 'w-bs-upper' },
    },
    {
      id: 'wk-lowtime', name: 'Low Time · 30 min', focus: 'Short sessions for busy weeks',
      days: { 1: 'w-express-legs', 2: 'w-express-upper', 3: 'w-cardio-intervals', 4: 'w-express-full', 5: 'w-express-upper', 6: 'w-cardio-steady', 0: null },
    },
    {
      id: 'wk-glutes', name: 'Glute Focus · 50 min', focus: 'Glutes and legs, twice each, with cardio between',
      days: { 1: 'w-glutes-heavy', 2: 'w-quad-focus', 3: 'w-cardio-circuit', 4: 'w-ham-posterior', 5: 'w-glutes-pump', 6: 'w-cardio-steady', 0: null },
    },
  ],
};

// ── Pack 2: power & tempo, volume & sweat ────────────────────
// Two more full weeks of training so the rotation can run a month
// without repeating a session. Same shape as the originals: a main
// barbell lift first, three lower-body days, one conditioning day,
// pulling twice, core every session, no arm isolation, 45-50 min.
const PACK_2026_09B = {
  id: 'pack-2026-09b',
  rotate: true, // these two join the automatic rotation, so the variety happens on its own

  workouts: [
    // ── Power & tempo ────────────────────────────────────────
    {
      id: 'w-pause-squat', name: 'Pause Squat + Legs', minutes: 50,
      focus: 'Tempo Squat · Single Leg · Quads · Core',
      blocks: [
        pkW('ps-wu', 'Warm-up', WU_LEGS),
        pkB('ps-a', 'superset', 'Pause Squat + Lateral Lunge', 4, 120, [
          pkX('pause-squat', 4, 5, '7-8', 75), pkX('lateral-lunge', 4, 10, '6-7', 20),
        ], '3-second pause at the bottom of every squat. Stay tight, drive up fast.'),
        pkB('ps-b', 'superset', 'Split Squat + Extension', 3, 90, [
          pkX('bulgarian-split', 3, 10, '7-8', 25), pkX('leg-extension', 3, 15, '7-8', 50),
        ]),
        pkB('ps-c', 'superset', 'Machine + Calf', 3, 60, [
          pkX('hack-squat', 3, 12, '7-8', 90), pkX('standing-calf', 3, 15, '6-7', 70),
        ]),
        pkB('ps-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('hanging-leg', 2, 10), pkX('copenhagen-plank', 2, 20),
        ]),
      ],
    },
    {
      id: 'w-power-clean', name: 'Power Clean + Back', minutes: 50,
      focus: 'Power · Lats · Upper Back · Core',
      blocks: [
        pkW('pc-wu', 'Warm-up', [
          { text: 'Jump Rope (easy pace)', amount: '1:00' },
          { text: 'Cat-Cow', amount: '10' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Empty bar clean pulls', amount: '8' },
          { text: 'Empty bar power cleans (slow)', amount: '6' },
          { text: 'Build up over 2-3 warm-up sets', amount: '' },
        ]),
        pkB('pc-a', 'superset', 'Power Clean + Arch', 5, 90, [
          pkX('power-clean', 5, 3, '7', 65), pkX('arch-hold', 5, 20),
        ], 'Explosive triples — end the set the moment the bar slows down.'),
        pkB('pc-b', 'superset', 'Pull-Up + Row', 3, 75, [
          pkX('pull-up', 3, 6, '8'), pkX('meadows-row', 3, 10, '7-8', 45),
        ]),
        pkB('pc-c', 'superset', 'Lats + Rear Delt', 3, 60, [
          pkX('machine-pullover', 3, 12, '7-8', 55), pkX('face-pull', 3, 15, '6-7', 25),
        ]),
        pkB('pc-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('windshield-wiper', 2, 8), pkX('dead-bug', 2, 12),
        ]),
      ],
    },
    {
      id: 'w-grit-cardio', name: 'Grit Conditioning', minutes: 45,
      focus: 'Sled · Ropes · Full Body Sweat · Abs',
      blocks: [
        pkW('gc-wu', 'Warm-up', WU_QUICK),
        pkB('gc-a', 'circuit', 'Grit Circuit', 4, 75, [
          pkX('sled-push', 4, 30, '7-8', 90), pkX('devils-press', 4, 8, '7', 20),
          pkX('battle-ropes', 4, 30),
        ], 'Hard but steady. No rest inside a round, 75s between rounds.'),
        pkB('gc-b', 'circuit', 'Ab Circuit', 3, 45, [
          pkX('decline-situp', 3, 15), pkX('russian-twist', 3, 20), pkX('l-sit', 3, 15),
        ]),
        pkB('gc-c', 'circuit', 'Rope Finisher', 1, 0, [pkX('jump-rope', 1, 180)],
          'One steady push to finish — pick a pace and hold it.'),
      ],
    },
    {
      id: 'w-trapbar-glutes', name: 'Trap Bar + Glutes', minutes: 50,
      focus: 'Hinge · Glutes · Hamstrings · Calves',
      blocks: [
        pkW('tg-wu', 'Warm-up', [
          { text: '90/90 Hip Switches', amount: '10' },
          { text: 'Glute Bridge Hold', amount: ':30' },
          { text: 'Single Leg Glute Bridges', amount: '10/side' },
          { text: 'Bodyweight Good Mornings', amount: '12' },
          { text: 'Light trap bar pulls', amount: '8' },
          { text: 'Work up over 2-3 warm-up sets', amount: '' },
        ]),
        pkB('tg-a', 'superset', 'Trap Bar + Frog Pump', 4, 120, [
          pkX('trap-bar-deadlift', 4, 6, '7-8', 155), pkX('frog-pump', 4, 20),
        ]),
        pkB('tg-b', 'superset', 'Glute Bridge + Curl', 3, 75, [
          pkX('kas-glute-bridge', 3, 12, '7-8', 95), pkX('nordic-curl', 3, 6, '8'),
        ]),
        pkB('tg-c', 'superset', 'RDL + Calf', 3, 60, [
          pkX('smith-rdl', 3, 10, '7-8', 85), pkX('seated-calf', 3, 15, '6-7', 45),
        ]),
        pkB('tg-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('ab-wheel', 2, 12), pkX('pallof-press', 2, 10, '6-7', 20),
        ]),
      ],
    },
    {
      id: 'w-thruster-lats', name: 'Thruster + Lats', minutes: 48,
      focus: 'Full Body Power · Lats · Carries · Abs',
      blocks: [
        pkW('tl-wu', 'Warm-up', [
          { text: 'Wrist circles & front-rack stretch', amount: ':45' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Band Overhead Press', amount: '12' },
          { text: 'Empty bar thrusters', amount: '10' },
          { text: 'Hollow Body practice', amount: ':20 ×2' },
          { text: 'Work up over 2 warm-up sets', amount: '' },
        ]),
        pkB('tl-a', 'superset', 'Thruster + Hollow', 5, 90, [
          pkX('thruster', 5, 5, '7-8', 55), pkX('hollow-hold', 5, 20),
        ], 'Legs drive the bar — one smooth movement from squat to lockout.'),
        pkB('tl-b', 'superset', 'Lats + Carry', 3, 60, [
          pkX('neutral-pulldown', 3, 10, '7-8', 70), pkX('overhead-carry', 3, 30, '6-7', 25),
        ]),
        pkB('tl-c', 'circuit', 'Skill Circuit', 2, 60, [
          pkX('wall-walk', 2, 3), pkX('crow-pose', 2, 20),
        ], 'Quick skill touch-up — stop while it still looks good.'),
        pkB('tl-d', 'circuit', 'Ab Circuit', 2, 45, [
          pkX('v-up', 2, 12), pkX('plank-taps', 2, 20),
        ]),
      ],
    },

    // ── Volume & sweat ───────────────────────────────────────
    {
      id: 'w-squat-volume', name: 'Squat Volume + Legs', minutes: 50,
      focus: 'High-Rep Squat · Glutes · Quads · Core',
      blocks: [
        pkW('sv-wu', 'Warm-up', WU_LEGS),
        pkB('sv-a', 'superset', 'Squat Volume + Jumps', 4, 90, [
          pkX('back-squat', 4, 10, '7', 85), pkX('box-jump', 4, 6),
        ], 'Lighter than your heavy weeks — chase the burn, not the number.'),
        pkB('sv-b', 'superset', 'Step-Up + Curtsy', 3, 60, [
          pkX('step-up', 3, 12, '7', 20), pkX('curtsy-lunge', 3, 12, '7', 20),
        ]),
        pkB('sv-c', 'superset', 'Press + Calf', 3, 60, [
          pkX('leg-press', 3, 20, '7-8', 100), pkX('single-leg-calf', 3, 15, '6-7'),
        ]),
        pkB('sv-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('ab-wheel', 2, 12), pkX('hanging-knee', 2, 15),
        ]),
      ],
    },
    {
      id: 'w-snatch-pull', name: 'Snatch-Grip Pull + Back', minutes: 50,
      focus: 'Hinge · Lats · Upper Back · Core',
      blocks: [
        pkW('sp-wu', 'Warm-up', [
          { text: 'Cat-Cow', amount: '10' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Scapula Pull-Ups (dead hang shrugs)', amount: '8' },
          { text: 'Bodyweight Good Mornings', amount: '12' },
          { text: 'Light snatch-grip pulls (empty bar)', amount: '8' },
          { text: 'Work up over 2-3 warm-up sets', amount: '' },
        ]),
        pkB('sp-a', 'superset', 'Snatch-Grip DL + Hollow', 4, 120, [
          pkX('snatch-grip-dl', 4, 6, '7-8', 115), pkX('hollow-rocks', 4, 12),
        ], 'Wide grip, long pull — this one builds the whole back.'),
        pkB('sp-b', 'superset', 'Chin-Up + Kroc Row', 3, 75, [
          pkX('chin-up', 3, 6, '8'), pkX('kroc-row', 3, 15, '7-8', 40),
        ]),
        pkB('sp-c', 'superset', 'Row + Rear Delt', 3, 60, [
          pkX('wide-cable-row', 3, 12, '7-8', 65), pkX('rear-delt-fly', 3, 15, '6-7', 25),
        ]),
        pkB('sp-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('side-plank', 2, 35), pkX('pallof-press', 2, 12, '6-7', 20),
        ]),
      ],
    },
    {
      id: 'w-engine-core', name: 'Engine + Core', minutes: 45,
      focus: 'Intervals · Full Body Cardio · Abs',
      blocks: [
        pkW('ec-wu', 'Warm-up', WU_QUICK),
        pkB('ec-a', 'circuit', 'Interval Circuit', 4, 60, [
          pkX('ski-erg', 4, 12, '7-8'), pkX('db-snatch', 4, 10, '7', 25), pkX('burpee', 4, 10),
        ], 'Push the erg, recover on the bodyweight moves. 60s between rounds.'),
        pkB('ec-b', 'circuit', 'Ab Circuit', 3, 45, [
          pkX('weighted-plank', 3, 30, '', 10), pkX('reverse-crunch', 3, 15),
          pkX('bicycle-crunch', 3, 20),
        ]),
        pkB('ec-c', 'circuit', 'Cool Down', 1, 0, [pkX('incline-walk', 1, 300)],
          'Steady incline walk to bring the heart rate down.'),
      ],
    },
    {
      id: 'w-thrust-hams', name: 'Hip Thrust + Hamstrings', minutes: 50,
      focus: 'Glutes · Hamstrings · Adductors · Core',
      blocks: [
        pkW('th-wu', 'Warm-up', [
          { text: '90/90 Hip Switches', amount: '10' },
          { text: 'Glute Bridge Hold', amount: ':30' },
          { text: 'Frog Pumps', amount: '20' },
          { text: 'Bodyweight Good Mornings', amount: '12' },
          { text: 'Light hip thrusts (empty bar)', amount: '12' },
          { text: 'Work up over 2 warm-up sets', amount: '' },
        ]),
        pkB('th-a', 'superset', 'Hip Thrust + Bridge', 4, 90, [
          pkX('hip-thrust', 4, 8, '8', 155), pkX('glute-bridge', 4, 20),
        ], 'Pause and squeeze for a full second at the top of every rep.'),
        pkB('th-b', 'superset', 'Single-Leg RDL + Curl', 3, 75, [
          pkX('single-leg-rdl', 3, 10, '7-8', 25), pkX('seated-leg-curl', 3, 15, '7-8', 55),
        ]),
        pkB('th-c', 'superset', 'Posterior + Adductor', 3, 60, [
          pkX('reverse-hyper', 3, 15, '6-7', 45), pkX('adduction-machine', 3, 15, '6-7', 50),
        ]),
        pkB('th-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('body-saw', 2, 12), pkX('copenhagen-plank', 2, 20),
        ]),
      ],
    },
    {
      id: 'w-pushpress-lats', name: 'Push Press + Lats', minutes: 48,
      focus: 'Overhead · Lats · Carries · Abs',
      blocks: [
        pkW('pl-wu', 'Warm-up', [
          { text: 'Wrist circles & stretches', amount: ':45' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Band Overhead Press', amount: '12' },
          { text: 'Empty Bar Push Press', amount: '10' },
          { text: 'Hollow Body practice', amount: ':20 ×2' },
          { text: 'Work up over 2 warm-up sets', amount: '' },
        ]),
        pkB('pl-a', 'superset', 'Push Press + Arch', 5, 90, [
          pkX('push-press', 5, 5, '7-8', 60), pkX('arch-hold', 5, 20),
        ]),
        pkB('pl-b', 'superset', 'Landmine + Pulldown', 3, 60, [
          pkX('landmine-press', 3, 10, '7-8', 35), pkX('lat-pulldown', 3, 12, '7-8', 70),
        ]),
        pkB('pl-c', 'superset', 'Row + Carry', 3, 60, [
          pkX('db-row', 3, 12, '7-8', 35), pkX('sandbag-carry', 3, 40, '6-7', 50),
        ]),
        pkB('pl-d', 'circuit', 'Ab Circuit', 2, 45, [
          pkX('mountain-climber', 2, 30), pkX('dragon-flag-neg', 2, 8),
        ]),
      ],
    },
  ],

  weeks: [
    {
      id: 'wk-power', name: 'Power & Tempo · 50 min', focus: 'Pause squats, power cleans, trap bar pulls — heavier and slower',
      days: { 1: 'w-pause-squat', 2: 'w-power-clean', 3: 'w-grit-cardio', 4: 'w-trapbar-glutes', 5: 'w-thruster-lats', 6: null, 0: null },
    },
    {
      id: 'wk-volume', name: 'Volume & Sweat · 50 min', focus: 'Higher reps, shorter rest — the pump week between heavy blocks',
      days: { 1: 'w-squat-volume', 2: 'w-snatch-pull', 3: 'w-engine-core', 4: 'w-thrust-hams', 5: 'w-pushpress-lats', 6: null, 0: null },
    },
  ],
};

const SEED_PACKS = [PACK_2026_09, PACK_2026_09B];
