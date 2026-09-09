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

const SEED_PACKS = [PACK_2026_09];
