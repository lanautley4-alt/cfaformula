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

// ── Pack 3: full body ────────────────────────────────────────
// Sessions that cover legs, a pull, an overhead press and core in one
// go — for weeks with fewer training days, a packed gym, or travel.
// Left out of the rotation on purpose: assign a full body week from
// the Week tab, or tap "rotation" on one in the Library.
const PACK_2026_09C = {
  id: 'pack-2026-09c',

  workouts: [
    {
      id: 'w-fb-squat-pull', name: 'Full Body · Squat & Pull', minutes: 50,
      focus: 'Back Squat · Pull-Up · Hinge · Core',
      blocks: [
        pkW('fsp-wu', 'Warm-up', WU_LEGS),
        pkB('fsp-a', 'superset', 'Squat + Pull-Up', 4, 120, [
          pkX('back-squat', 4, 6, '7-8', 95), pkX('pull-up', 4, 6, '8'),
        ], 'The big pair. Take the full two minutes between rounds.'),
        pkB('fsp-b', 'superset', 'Hinge + Pulldown', 3, 90, [
          pkX('rdl', 3, 8, '7-8', 95), pkX('lat-pulldown', 3, 10, '7-8', 70),
        ]),
        pkB('fsp-c', 'superset', 'Lunge + Rear Delt', 3, 60, [
          pkX('walking-lunge', 3, 10, '6-7', 20), pkX('face-pull', 3, 15, '6-7', 25),
        ]),
        pkB('fsp-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('hanging-knee', 2, 12), pkX('side-plank', 2, 30),
        ]),
      ],
    },
    {
      id: 'w-fb-hinge-press', name: 'Full Body · Hinge & Press', minutes: 50,
      focus: 'Deadlift · Push Press · Row · Core',
      blocks: [
        pkW('fhp-wu', 'Warm-up', [
          { text: 'Cat-Cow', amount: '10' },
          { text: '90/90 Hip Switches', amount: '10' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Band Overhead Press', amount: '12' },
          { text: 'Light deadlifts, then empty bar push press', amount: '8 each' },
          { text: 'Work up over 2-3 warm-up sets', amount: '' },
        ]),
        pkB('fhp-a', 'superset', 'Deadlift + Push Press', 4, 120, [
          pkX('deadlift', 4, 5, '7-8', 135), pkX('push-press', 4, 6, '7-8', 55),
        ], 'Pull, then press. Both are legs-first movements — stay braced.'),
        pkB('fhp-b', 'superset', 'Split Squat + Row', 3, 90, [
          pkX('bulgarian-split', 3, 10, '7-8', 25), pkX('cs-row', 3, 12, '7-8', 60),
        ]),
        pkB('fhp-c', 'circuit', 'Swing + Climb', 3, 60, [
          pkX('kb-swing', 3, 15, '6-7', 35), pkX('mountain-climber', 3, 30),
        ]),
        pkB('fhp-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('ab-wheel', 2, 12), pkX('pallof-press', 2, 10, '6-7', 20),
        ]),
      ],
    },
    {
      id: 'w-fb-clean-carry', name: 'Full Body · Clean & Carry', minutes: 48,
      focus: 'Hang Clean · Front Squat · Chin-Up · Carries',
      blocks: [
        pkW('fcc-wu', 'Warm-up', [
          { text: 'Jump Rope (easy pace)', amount: '1:00' },
          { text: 'Wrist circles & front-rack stretch', amount: ':45' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Empty bar hang clean drill (slow)', amount: '8' },
          { text: 'Empty bar front squats', amount: '8' },
          { text: 'Build up over 2-3 sets', amount: '' },
        ]),
        pkB('fcc-a', 'superset', 'Hang Clean + Hollow', 5, 90, [
          pkX('hang-clean', 5, 3, '7', 55), pkX('hollow-hold', 5, 20),
        ], 'Crisp triples — end the set the moment the bar slows down.'),
        pkB('fcc-b', 'superset', 'Front Squat + Chin-Up', 3, 90, [
          pkX('front-squat', 3, 8, '7-8', 65), pkX('chin-up', 3, 6, '8'),
        ]),
        pkB('fcc-c', 'superset', 'Single-Leg RDL + Carry', 3, 60, [
          pkX('single-leg-rdl', 3, 10, '7-8', 25), pkX('farmer-carry', 3, 40, '6-7', 35),
        ]),
        pkB('fcc-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('copenhagen-plank', 2, 20), pkX('dead-bug', 2, 12),
        ]),
      ],
    },
    {
      id: 'w-fb-barbell', name: 'Full Body · Barbell Only', minutes: 45,
      focus: 'One bar, one spot · Squat · Row · Press',
      blocks: [
        pkW('fbb-wu', 'Warm-up', WU_QUICK),
        pkB('fbb-a', 'superset', 'Squat + Row', 4, 90, [
          pkX('back-squat', 4, 8, '7-8', 85), pkX('barbell-row', 4, 8, '7-8', 65),
        ], 'Everything today uses the same bar — good for a packed gym.'),
        pkB('fbb-b', 'superset', 'Hinge + Press', 3, 90, [
          pkX('rdl', 3, 10, '7-8', 85), pkX('push-press', 3, 8, '7-8', 55),
        ]),
        pkB('fbb-c', 'circuit', 'Barbell Complex', 3, 90, [
          pkX('hang-clean', 3, 5, '6-7', 55), pkX('thruster', 3, 5, '6-7', 55),
          pkX('good-morning', 3, 5, '6-7', 55),
        ], 'Do not put the bar down inside a round. Same weight throughout.'),
        pkB('fbb-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('plank', 2, 45), pkX('russian-twist', 2, 20),
        ]),
      ],
    },
    {
      id: 'w-fb-dumbbell', name: 'Full Body · Dumbbells Only', minutes: 45,
      focus: 'Travel or home · Squat · Row · Press · Carry',
      blocks: [
        pkW('fbd-wu', 'Warm-up', WU_QUICK),
        pkB('fbd-a', 'superset', 'Goblet Squat + Row', 4, 60, [
          pkX('goblet-squat', 4, 12, '7-8', 45), pkX('db-row', 4, 12, '7-8', 35),
        ]),
        pkB('fbd-b', 'superset', 'Hinge + Press', 3, 60, [
          pkX('db-rdl', 3, 12, '7-8', 35), pkX('db-press', 3, 10, '7-8', 20),
        ]),
        pkB('fbd-c', 'superset', 'Lunge + Carry', 3, 60, [
          pkX('reverse-lunge', 3, 10, '7', 25), pkX('suitcase-carry', 3, 40, '6-7', 30),
        ]),
        pkB('fbd-d', 'circuit', 'Finisher', 2, 45, [
          pkX('db-snatch', 2, 10, '7', 25), pkX('plank-taps', 2, 20),
        ], 'No rest between exercises.'),
      ],
    },
    {
      id: 'w-fb-metcon', name: 'Full Body Metcon', minutes: 40,
      focus: 'Breathing hard · Thrusters · Pull-Ups · Swings',
      blocks: [
        pkW('fbm-wu', 'Warm-up', WU_QUICK),
        pkB('fbm-a', 'circuit', 'Engine Circuit', 5, 90, [
          pkX('thruster', 5, 10, '6-7', 45), pkX('pull-up', 5, 6, '8'), pkX('burpee', 5, 8),
        ], 'Steady, unbroken sets. 90s between rounds.'),
        pkB('fbm-b', 'circuit', 'Swings + Row', 3, 60, [
          pkX('kb-swing', 3, 15, '6-7', 35), pkX('rower', 3, 250),
        ]),
        pkB('fbm-c', 'circuit', 'Core Finisher', 3, 45, [
          pkX('v-up', 3, 12), pkX('hollow-rocks', 3, 15),
        ]),
      ],
    },
    {
      id: 'w-fb-express-b', name: 'Express Full Body B', minutes: 30,
      focus: '30 min · Full body · Trap bar & kettlebell',
      blocks: [
        pkW('feb-wu', 'Warm-up', WU_QUICK),
        pkB('feb-a', 'superset', 'Trap Bar + Pulldown', 4, 60, [
          pkX('trap-bar-deadlift', 4, 8, '7-8', 135), pkX('lat-pulldown', 4, 10, '7-8', 70),
        ]),
        pkB('feb-b', 'superset', 'Goblet Squat + Press', 3, 60, [
          pkX('goblet-squat', 3, 12, '7-8', 45), pkX('db-press', 3, 10, '7-8', 20),
        ]),
        pkB('feb-c', 'circuit', 'Finisher', 2, 45, [
          pkX('kb-swing', 2, 20, '6-7', 35), pkX('hollow-rocks', 2, 15),
        ], 'No rest between exercises.'),
      ],
    },
  ],

  weeks: [
    {
      id: 'wk-fullbody', name: 'Full Body · 50 min', focus: 'Three full body days with conditioning between',
      days: { 1: 'w-fb-squat-pull', 2: 'w-cardio-circuit', 3: 'w-fb-hinge-press', 4: 'w-cardio-steady', 5: 'w-fb-clean-carry', 6: 'w-fb-metcon', 0: null },
    },
    {
      id: 'wk-fullbody-short', name: 'Full Body · 30 min', focus: 'Short full body days for a busy week',
      days: { 1: 'w-express-full', 2: 'w-cardio-intervals', 3: 'w-fb-express-b', 4: null, 5: 'w-fb-dumbbell', 6: 'w-cardio-steady', 0: null },
    },
  ],
};

// ── Pack 4: more full body, straight sets ────────────────────
// Built around the movements she reaches for — hip thrusts, lat
// pulldowns, thrusters, straight-arm pulldowns, Smith machine — and
// leaning on straight sets rather than pairing everything up.
const PACK_2026_10 = {
  id: 'pack-2026-10',

  workouts: [
    {
      id: 'w-fb-thrust-thruster', name: 'Full Body · Thrusts & Thrusters', minutes: 50,
      focus: 'Hip Thrust · Thrusters · Lat Pulldown',
      blocks: [
        pkW('ftt-wu', 'Warm-up', [
          { text: '90/90 Hip Switches', amount: '10' },
          { text: 'Glute Bridge Hold', amount: ':30' },
          { text: 'Band Pull-Aparts', amount: '15' },
          { text: 'Air Squats', amount: '10' },
          { text: 'Empty bar thrusters', amount: '8' },
          { text: 'Work up over 2 warm-up sets', amount: '' },
        ]),
        pkB('ftt-a', 'straight', 'Hip Thrust', 4, 90, [
          pkX('hip-thrust', 4, 8, '8', 155),
        ], 'On its own. Pause and squeeze a full second at the top.'),
        pkB('ftt-b', 'straight', 'Thrusters', 4, 90, [
          pkX('thruster', 4, 8, '7-8', 45),
        ], 'Squat and press as one movement — the legs do the work.'),
        pkB('ftt-c', 'superset', 'Lat Pulldown + Straight-Arm', 3, 60, [
          pkX('lat-pulldown', 3, 10, '7-8', 70), pkX('straight-arm-pd', 3, 12, '6-7', 30),
        ], 'Pulldown first, then straight-arm to finish the lats off.'),
        pkB('ftt-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('hanging-knee', 2, 12), pkX('pallof-press', 2, 10, '6-7', 20),
        ]),
      ],
    },
    {
      id: 'w-fb-smith', name: 'Full Body · Smith Machine', minutes: 48,
      focus: 'Smith Squat · Smith RDL · Hip Thrust · Lats',
      blocks: [
        pkW('fsm-wu', 'Warm-up', WU_LEGS),
        pkB('fsm-a', 'straight', 'Smith Machine Squat', 4, 90, [
          pkX('smith-squat', 4, 8, '7-8', 95),
        ], 'Bar path is fixed, so you can push close to failure safely.'),
        pkB('fsm-b', 'straight', 'Smith Machine RDL', 3, 90, [
          pkX('smith-rdl', 3, 10, '7-8', 85),
        ]),
        pkB('fsm-c', 'superset', 'Smith Hip Thrust + Pulldown', 3, 75, [
          pkX('smith-hip-thrust', 3, 10, '7-8', 115), pkX('lat-pulldown', 3, 12, '7-8', 70),
        ]),
        pkB('fsm-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('ab-wheel', 2, 12), pkX('side-plank', 2, 30),
        ]),
      ],
    },
    {
      id: 'w-fb-machines', name: 'Full Body · Machines & Cables', minutes: 45,
      focus: 'Leg Press · Cables · Straight-Arm Pulldown',
      blocks: [
        pkW('fmc-wu', 'Warm-up', WU_QUICK),
        pkB('fmc-a', 'straight', 'Leg Press', 4, 75, [
          pkX('leg-press', 4, 12, '7-8', 115),
        ], 'Feet high and wide for more glute, lower and closer for quads.'),
        pkB('fmc-b', 'superset', 'Pulldown + Straight-Arm', 3, 60, [
          pkX('lat-pulldown', 3, 10, '7-8', 70), pkX('straight-arm-pd', 3, 12, '6-7', 30),
        ]),
        pkB('fmc-c', 'superset', 'Row + Pull-Through', 3, 60, [
          pkX('cable-row', 3, 12, '7-8', 70), pkX('cable-pullthrough', 3, 15, '6-7', 40),
        ]),
        pkB('fmc-d', 'circuit', 'Core Finisher', 3, 45, [
          pkX('cable-crunch', 3, 15, '6-7', 40), pkX('hanging-knee', 3, 12),
        ]),
      ],
    },
    {
      id: 'w-fb-straight', name: 'Full Body · Straight Sets', minutes: 50,
      focus: 'No supersets · Squat · Thrust · Pull · Press',
      blocks: [
        pkW('fst-wu', 'Warm-up', WU_LEGS),
        pkB('fst-a', 'straight', 'Back Squat', 4, 120, [
          pkX('back-squat', 4, 6, '7-8', 95),
        ], 'Nothing is paired today — take your time and lift heavy.'),
        pkB('fst-b', 'straight', 'Hip Thrust', 3, 90, [
          pkX('hip-thrust', 3, 10, '8', 155),
        ]),
        pkB('fst-c', 'straight', 'Lat Pulldown', 3, 75, [
          pkX('lat-pulldown', 3, 10, '7-8', 70),
        ]),
        pkB('fst-d', 'straight', 'Push Press', 3, 90, [
          pkX('push-press', 3, 6, '7-8', 55),
        ]),
        pkB('fst-e', 'circuit', 'Core Finisher', 2, 45, [
          pkX('dead-bug', 2, 12), pkX('plank', 2, 45),
        ]),
      ],
    },
    {
      id: 'w-fb-glutes-lats', name: 'Full Body · Glutes & Lats', minutes: 48,
      focus: 'Hip Thrust · Smith Split Squat · Lats · Core',
      blocks: [
        pkW('fgl-wu', 'Warm-up', WU_LEGS),
        pkB('fgl-a', 'straight', 'Hip Thrust', 4, 90, [
          pkX('hip-thrust', 4, 10, '8', 155),
        ]),
        pkB('fgl-b', 'superset', 'Split Squats', 3, 90, [
          pkX('smith-split-l', 3, 10, '7-8', 30), pkX('smith-split-r', 3, 10, '7-8', 30),
        ], 'Left leg, then right leg — that is one round.'),
        pkB('fgl-c', 'superset', 'Lats + Kickback', 3, 60, [
          pkX('straight-arm-pd', 3, 12, '7-8', 30), pkX('cable-kickback', 3, 15, '6-7', 20),
        ]),
        pkB('fgl-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('reverse-crunch', 2, 15), pkX('copenhagen-plank', 2, 20),
        ]),
      ],
    },
    {
      id: 'w-fb-thruster-swing', name: 'Full Body · Thrusters & Swings', minutes: 42,
      focus: 'Fast session · Thrusters · Swings · Pulldown',
      blocks: [
        pkW('fts-wu', 'Warm-up', WU_QUICK),
        pkB('fts-a', 'straight', 'Thrusters', 5, 90, [
          pkX('thruster', 5, 6, '7-8', 55),
        ], 'Heavier than the circuit version — these are working sets.'),
        pkB('fts-b', 'superset', 'Pulldown + Swing', 4, 60, [
          pkX('lat-pulldown', 4, 10, '7-8', 70), pkX('kb-swing', 4, 15, '6-7', 35),
        ]),
        pkB('fts-c', 'circuit', 'Finisher', 3, 45, [
          pkX('mountain-climber', 3, 30), pkX('hollow-rocks', 3, 15),
        ], 'No rest between exercises.'),
      ],
    },
  ],

  weeks: [
    {
      id: 'wk-fullbody-mixed', name: 'Full Body · Mixed', focus: 'Straight sets, machines and barbell across the week',
      days: { 1: 'w-fb-straight', 2: 'w-cardio-circuit', 3: 'w-fb-thrust-thruster', 4: 'w-cardio-steady', 5: 'w-fb-smith', 6: 'w-fb-thruster-swing', 0: null },
    },
  ],
};

// ── Pack 5: bootcamp (treadmill + floor) ─────────────────────
// Barry's-style: the room splits into treadmill blocks and floor
// blocks and you alternate. Every run is written out as a speed held
// for a set time — the mph box is yours to set, these are a starting
// point. Paces, roughly: walk 3.5, jog 4.5-5.5, base 6, push 7.5,
// sprint 9+. Incline work runs slower on purpose.
const WU_TREAD = [
  { text: 'Walk, building to an easy jog', amount: '3:00' },
  { text: 'Leg Swings + Arm Circles (off the belt)', amount: '10 each' },
  { text: 'Air Squats', amount: '10' },
  { text: 'Two 20s strides at base pace', amount: '2 ×:20' },
];

const PACK_2026_11 = {
  id: 'pack-2026-11',

  workouts: [
    {
      id: 'w-bc-legs', name: 'Bootcamp · Butt & Legs', minutes: 50,
      focus: 'Tread intervals + glute and leg floor blocks',
      blocks: [
        pkW('bcl-wu', 'Warm-up', WU_TREAD),
        pkB('bcl-t1', 'circuit', 'Tread 1 · Incline Builder', 3, 0, [
          pkX('tread-inc-walk', 3, 60, '', 3.5),
          pkX('tread-inc-run', 3, 45, '', 5.5),
          pkX('tread-walk', 3, 45, '', 3.5),
        ], 'Incline 6-8%. Walk 1:00, run :45, walk :45 — three times through, straight into the floor.'),
        pkB('bcl-f1', 'superset', 'Floor 1 · Glutes', 3, 45, [
          pkX('hip-thrust', 3, 12, '7-8', 135), pkX('walking-lunge', 3, 10, '6-7', 20),
        ]),
        pkB('bcl-t2', 'circuit', 'Tread 2 · Push & Sprint', 4, 0, [
          pkX('tread-push', 4, 45, '', 7.5),
          pkX('tread-sprint', 4, 20, '', 9.5),
          pkX('tread-walk', 4, 40, '', 3.5),
        ], 'Flat road. Push :45, sprint :20, walk :40 — four rounds.'),
        pkB('bcl-f2', 'superset', 'Floor 2 · Legs', 3, 45, [
          pkX('goblet-squat', 3, 15, '7-8', 45), pkX('bulgarian-split', 3, 10, '7-8', 20),
        ]),
        pkB('bcl-core', 'circuit', 'Core Finisher', 2, 30, [
          pkX('bicycle-crunch', 2, 20), pkX('plank', 2, 45),
        ]),
      ],
    },
    {
      id: 'w-bc-back', name: 'Bootcamp · Back & Abs', minutes: 50,
      focus: 'Tread intervals + pulling and core floor blocks',
      blocks: [
        pkW('bcb-wu', 'Warm-up', WU_TREAD),
        pkB('bcb-t1', 'circuit', 'Tread 1 · Base to Push', 3, 0, [
          pkX('tread-base', 3, 90, '', 6),
          pkX('tread-push', 3, 60, '', 7.5),
          pkX('tread-walk', 3, 45, '', 3.5),
        ], 'Base 1:30, push 1:00, walk :45 — three rounds.'),
        pkB('bcb-f1', 'superset', 'Floor 1 · Pull', 3, 45, [
          pkX('db-row', 3, 12, '7-8', 35), pkX('straight-arm-pd', 3, 12, '6-7', 30),
        ]),
        pkB('bcb-t2', 'circuit', 'Tread 2 · Sprint Ladder', 3, 0, [
          pkX('tread-sprint', 3, 30, '', 9),
          pkX('tread-walk', 3, 30, '', 3.5),
          pkX('tread-all-out', 3, 15, '', 10),
          pkX('tread-walk', 3, 45, '', 3.5),
        ], 'Sprint :30, walk :30, all-out :15, walk :45. Three rounds — the :15 is a true all-out.'),
        pkB('bcb-f2', 'superset', 'Floor 2 · Back', 3, 45, [
          pkX('cs-row', 3, 12, '7-8', 60), pkX('face-pull', 3, 15, '6-7', 25),
        ]),
        pkB('bcb-core', 'circuit', 'Core Finisher', 3, 30, [
          pkX('hanging-knee', 3, 12), pkX('side-plank', 3, 30), pkX('dead-bug', 3, 12),
        ]),
      ],
    },
    {
      id: 'w-bc-total', name: 'Bootcamp · Total Body', minutes: 50,
      focus: 'Tread intervals + full body floor blocks',
      blocks: [
        pkW('bct-wu', 'Warm-up', WU_TREAD),
        pkB('bct-t1', 'circuit', 'Tread 1 · Steady Build', 2, 0, [
          pkX('tread-jog', 2, 120, '', 5),
          pkX('tread-base', 2, 90, '', 6),
          pkX('tread-push', 2, 45, '', 7.5),
          pkX('tread-walk', 2, 45, '', 3.5),
        ], 'Jog 2:00, base 1:30, push :45, walk :45. Two rounds.'),
        pkB('bct-f1', 'superset', 'Floor 1 · Squat & Press', 3, 45, [
          pkX('db-thruster', 3, 12, '7', 20), pkX('db-rdl', 3, 12, '7-8', 35),
        ]),
        pkB('bct-t2', 'circuit', 'Tread 2 · Intervals', 5, 0, [
          pkX('tread-push', 5, 30, '', 7.5),
          pkX('tread-walk', 5, 30, '', 3.5),
        ], 'Five rounds of :30 push, :30 walk. Keep the pace honest.'),
        pkB('bct-f2', 'superset', 'Floor 2 · Pull & Swing', 3, 45, [
          pkX('lat-pulldown', 3, 12, '7-8', 70), pkX('kb-swing', 3, 15, '6-7', 35),
        ]),
        pkB('bct-core', 'circuit', 'Core Finisher', 2, 30, [
          pkX('mountain-climber', 2, 30), pkX('v-up', 2, 12),
        ]),
      ],
    },
    {
      id: 'w-bc-run', name: 'Bootcamp · Run Club', minutes: 45,
      focus: 'Mostly treadmill · long intervals and sprints',
      blocks: [
        pkW('bcr-wu', 'Warm-up', WU_TREAD),
        pkB('bcr-t1', 'circuit', 'Tread 1 · Long Intervals', 3, 0, [
          pkX('tread-base', 3, 180, '', 6),
          pkX('tread-walk', 3, 60, '', 3.5),
        ], 'Three minutes at base, one minute walking. Three rounds.'),
        pkB('bcr-f1', 'circuit', 'Floor Break', 2, 45, [
          pkX('walking-lunge', 2, 12, '6-7', 20), pkX('plank-taps', 2, 20),
        ], 'A short break off the belt — keep moving.'),
        pkB('bcr-t2', 'circuit', 'Tread 2 · Hills', 4, 0, [
          pkX('tread-hill', 4, 60, '', 4),
          pkX('tread-walk', 4, 60, '', 3.5),
        ], 'Incline 10-12% at a strong walk or slow run, 1:00 on, 1:00 flat recovery.'),
        pkB('bcr-t3', 'circuit', 'Tread 3 · Sprint Finish', 4, 0, [
          pkX('tread-sprint', 4, 20, '', 9.5),
          pkX('tread-walk', 4, 40, '', 3.5),
        ], 'Four sprints, :20 on, :40 off. Empty the tank.'),
        pkB('bcr-core', 'circuit', 'Core Finisher', 2, 30, [
          pkX('hollow-rocks', 2, 15), pkX('russian-twist', 2, 20),
        ]),
      ],
    },
    {
      id: 'w-bc-core', name: 'Bootcamp · Core & Sprint', minutes: 40,
      focus: 'Short sprints + an abs-heavy floor',
      blocks: [
        pkW('bcc-wu', 'Warm-up', WU_TREAD),
        pkB('bcc-t1', 'circuit', 'Tread 1 · Short Sprints', 6, 0, [
          pkX('tread-sprint', 6, 20, '', 9.5),
          pkX('tread-walk', 6, 40, '', 3.5),
        ], 'Six rounds, :20 sprint and :40 walk. Step off the belt if you need the recovery.'),
        pkB('bcc-f1', 'circuit', 'Floor 1 · Abs', 3, 40, [
          pkX('ab-wheel', 3, 12), pkX('reverse-crunch', 3, 15), pkX('copenhagen-plank', 3, 20),
        ]),
        pkB('bcc-t2', 'circuit', 'Tread 2 · Incline Burn', 3, 0, [
          pkX('tread-inc-walk', 3, 90, '', 3.5),
          pkX('tread-walk', 3, 30, '', 3.5),
        ], 'Incline 12-15%, 1:30 on, :30 flat. Three rounds.'),
        pkB('bcc-f2', 'circuit', 'Floor 2 · Waist', 3, 40, [
          pkX('pallof-press', 3, 12, '6-7', 20), pkX('side-plank', 3, 30), pkX('hollow-hold', 3, 25),
        ]),
      ],
    },
  ],

  weeks: [
    {
      id: 'wk-bootcamp', name: 'Bootcamp · 50 min', focus: 'Tread and floor days through the week, with lifting between',
      days: { 1: 'w-bc-legs', 2: 'w-fb-squat-pull', 3: 'w-bc-back', 4: 'w-bc-run', 5: 'w-fb-hinge-press', 6: 'w-bc-core', 0: null },
    },
  ],
};

// ── Pack 6: Winter Arc ───────────────────────────────────────
// The split: two heavy compound leg days, each built on one lift
// supersetted with core, and three bootcamp-style running days whose
// floor blocks are arms, back & chest, and core. Two versions of the
// week so nothing repeats fortnight to fortnight.
//
// Monday legs / Thursday legs leaves three days between the heavy
// sessions, and the running days fall on the days between them.
const PACK_2026_11B = {
  id: 'pack-2026-11b',
  rotate: true,
  replaces_rotation: true,

  workouts: [
    // ══ WEEK A ══════════════════════════════════════════════
    {
      id: 'w-wa-legs1-a', name: 'Legs I · Back Squat (A)', minutes: 55,
      focus: 'Back Squat + core · Hinge · Quads',
      blocks: [
        pkW('wa1a-wu', 'Warm-up', WU_LEGS),
        pkB('wa1a-a', 'superset', 'Back Squat + Core', 5, 150, [
          pkX('back-squat', 5, 5, '8', 115), pkX('hanging-leg', 5, 10),
        ], 'The day is built on this. Squat heavy, then hang and control the legs up — the rest is accessory.'),
        pkB('wa1a-b', 'superset', 'Hinge + Lunge', 3, 90, [
          pkX('rdl', 3, 8, '7-8', 95), pkX('walking-lunge', 3, 10, '6-7', 25),
        ]),
        pkB('wa1a-c', 'superset', 'Press + Calf', 3, 60, [
          pkX('leg-press', 3, 12, '7-8', 135), pkX('standing-calf', 3, 15, '6-7', 70),
        ]),
        pkB('wa1a-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('ab-wheel', 2, 12), pkX('pallof-press', 2, 10, '6-7', 20),
        ]),
      ],
    },
    {
      id: 'w-wa-run-arms-a', name: 'Run + Arms (A)', minutes: 50,
      focus: 'Tread intervals · Biceps & triceps floor',
      blocks: [
        pkW('wraa-wu', 'Warm-up', WU_TREAD),
        pkB('wraa-t1', 'circuit', 'Tread 1 · Base to Push', 3, 0, [
          pkX('tread-base', 3, 90, '', 6), pkX('tread-push', 3, 60, '', 7.5), pkX('tread-walk', 3, 45, '', 3.5),
        ], 'Base 1:30, push 1:00, walk :45 — three rounds, then straight to the floor.'),
        pkB('wraa-f1', 'circuit', 'Floor 1 · Arms', 3, 45, [
          pkX('db-curl', 3, 12, '7-8', 20), pkX('rope-pushdown', 3, 15, '7-8', 30),
        ]),
        pkB('wraa-t2', 'circuit', 'Tread 2 · Push & Sprint', 4, 0, [
          pkX('tread-push', 4, 45, '', 7.5), pkX('tread-sprint', 4, 20, '', 9.5), pkX('tread-walk', 4, 40, '', 3.5),
        ], 'Push :45, sprint :20, walk :40 — four rounds.'),
        pkB('wraa-f2', 'circuit', 'Floor 2 · Arms', 3, 45, [
          pkX('hammer-curl', 3, 12, '7-8', 20), pkX('overhead-tricep', 3, 12, '7-8', 25),
        ]),
        pkB('wraa-core', 'circuit', 'Core Finisher', 2, 30, [
          pkX('bicycle-crunch', 2, 20), pkX('plank', 2, 45),
        ]),
      ],
    },
    {
      id: 'w-wa-run-bc-a', name: 'Run + Back & Chest (A)', minutes: 50,
      focus: 'Tread intervals · Pull and press floor',
      blocks: [
        pkW('wrba-wu', 'Warm-up', WU_TREAD),
        pkB('wrba-t1', 'circuit', 'Tread 1 · Incline Builder', 3, 0, [
          pkX('tread-inc-walk', 3, 60, '', 3.5), pkX('tread-inc-run', 3, 45, '', 5.5), pkX('tread-walk', 3, 45, '', 3.5),
        ], 'Incline 6-8%. Walk 1:00, run :45, flat walk :45 — three rounds.'),
        pkB('wrba-f1', 'superset', 'Floor 1 · Pull + Press', 3, 60, [
          pkX('lat-pulldown', 3, 12, '7-8', 70), pkX('db-bench', 3, 10, '7-8', 30),
        ]),
        pkB('wrba-t2', 'circuit', 'Tread 2 · Intervals', 5, 0, [
          pkX('tread-push', 5, 30, '', 7.5), pkX('tread-walk', 5, 30, '', 3.5),
        ], 'Five rounds of :30 on, :30 off.'),
        pkB('wrba-f2', 'superset', 'Floor 2 · Row + Incline', 3, 60, [
          pkX('cable-row', 3, 12, '7-8', 70), pkX('incline-db-press', 3, 10, '7-8', 25),
        ]),
        pkB('wrba-core', 'circuit', 'Core Finisher', 2, 30, [
          pkX('hanging-knee', 2, 12), pkX('side-plank', 2, 30),
        ]),
      ],
    },
    {
      id: 'w-wa-legs2-a', name: 'Legs II · Hip Thrust (A)', minutes: 55,
      focus: 'Hip Thrust + core · Glutes · Hamstrings',
      blocks: [
        pkW('wa2a-wu', 'Warm-up', WU_LEGS),
        pkB('wa2a-a', 'superset', 'Hip Thrust + Core', 5, 120, [
          pkX('hip-thrust', 5, 8, '8', 185), pkX('hollow-hold', 5, 25),
        ], 'The day is built on this. Full second squeeze at the top, then straight into the hold.'),
        pkB('wa2a-b', 'superset', 'Split Squat + Curl', 3, 90, [
          pkX('bulgarian-split', 3, 10, '7-8', 25), pkX('lying-leg-curl', 3, 12, '7-8', 60),
        ]),
        pkB('wa2a-c', 'superset', 'Glute + Calf', 3, 60, [
          pkX('cable-kickback', 3, 15, '6-7', 20), pkX('seated-calf', 3, 15, '6-7', 45),
        ]),
        pkB('wa2a-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('reverse-crunch', 2, 15), pkX('copenhagen-plank', 2, 20),
        ]),
      ],
    },
    {
      id: 'w-wa-run-core-a', name: 'Run + Core (A)', minutes: 45,
      focus: 'Tread intervals · Abs and waist floor',
      blocks: [
        pkW('wrca-wu', 'Warm-up', WU_TREAD),
        pkB('wrca-t1', 'circuit', 'Tread 1 · Short Sprints', 6, 0, [
          pkX('tread-sprint', 6, 20, '', 9.5), pkX('tread-walk', 6, 40, '', 3.5),
        ], 'Six rounds, :20 sprint and :40 walk.'),
        pkB('wrca-f1', 'circuit', 'Floor 1 · Abs', 3, 40, [
          pkX('ab-wheel', 3, 12), pkX('dead-bug', 3, 12), pkX('v-up', 3, 12),
        ]),
        pkB('wrca-t2', 'circuit', 'Tread 2 · Incline Burn', 3, 0, [
          pkX('tread-inc-walk', 3, 90, '', 3.5), pkX('tread-walk', 3, 30, '', 3.5),
        ], 'Incline 12-15%, 1:30 on, :30 flat. Three rounds.'),
        pkB('wrca-f2', 'circuit', 'Floor 2 · Waist', 3, 40, [
          pkX('pallof-press', 3, 12, '6-7', 20), pkX('side-plank', 3, 30), pkX('hollow-rocks', 3, 15),
        ]),
      ],
    },

    // ══ WEEK B ══════════════════════════════════════════════
    {
      id: 'w-wa-legs1-b', name: 'Legs I · Back Squat (B)', minutes: 55,
      focus: 'Heavier squat + core · Unilateral · Quads',
      blocks: [
        pkW('wa1b-wu', 'Warm-up', WU_LEGS),
        pkB('wa1b-a', 'superset', 'Back Squat + Core', 6, 180, [
          pkX('back-squat', 6, 3, '8-9', 135), pkX('weighted-plank', 6, 30, '', 25),
        ], 'Heavier than week A, fewer reps. Three strong reps, then brace under the plate.'),
        pkB('wa1b-b', 'superset', 'Step-Up + Hinge', 3, 90, [
          pkX('step-up', 3, 10, '7-8', 25), pkX('good-morning', 3, 10, '7', 65),
        ]),
        pkB('wa1b-c', 'superset', 'Hack Squat + Calf', 3, 60, [
          pkX('hack-squat', 3, 12, '7-8', 90), pkX('single-leg-calf', 3, 15, '6-7'),
        ]),
        pkB('wa1b-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('hanging-knee', 2, 15), pkX('body-saw', 2, 12),
        ]),
      ],
    },
    {
      id: 'w-wa-run-arms-b', name: 'Run + Arms (B)', minutes: 50,
      focus: 'Sprint ladder · Biceps & triceps floor',
      blocks: [
        pkW('wrab-wu', 'Warm-up', WU_TREAD),
        pkB('wrab-t1', 'circuit', 'Tread 1 · Sprint Ladder', 3, 0, [
          pkX('tread-sprint', 3, 30, '', 9), pkX('tread-walk', 3, 30, '', 3.5),
          pkX('tread-all-out', 3, 15, '', 10), pkX('tread-walk', 3, 45, '', 3.5),
        ], 'Sprint :30, walk :30, all-out :15, walk :45. Three rounds.'),
        pkB('wrab-f1', 'circuit', 'Floor 1 · Arms', 3, 45, [
          pkX('barbell-curl', 3, 10, '7-8', 40), pkX('skull-crusher', 3, 12, '7-8', 40),
        ]),
        pkB('wrab-t2', 'circuit', 'Tread 2 · Long Push', 3, 0, [
          pkX('tread-push', 3, 90, '', 7.5), pkX('tread-walk', 3, 60, '', 3.5),
        ], 'Push 1:30, walk 1:00 — three rounds. Hold the pace honest.'),
        pkB('wrab-f2', 'circuit', 'Floor 2 · Arms', 3, 45, [
          pkX('incline-curl', 3, 12, '7-8', 17.5), pkX('bench-dip', 3, 12),
        ]),
        pkB('wrab-core', 'circuit', 'Core Finisher', 2, 30, [
          pkX('mountain-climber', 2, 30), pkX('hollow-rocks', 2, 15),
        ]),
      ],
    },
    {
      id: 'w-wa-run-bc-b', name: 'Run + Back & Chest (B)', minutes: 50,
      focus: 'Hills · Pull-ups, push-ups and flyes',
      blocks: [
        pkW('wrbb-wu', 'Warm-up', WU_TREAD),
        pkB('wrbb-t1', 'circuit', 'Tread 1 · Hills', 4, 0, [
          pkX('tread-hill', 4, 60, '', 4), pkX('tread-walk', 4, 60, '', 3.5),
        ], 'Incline 10-12%, 1:00 climbing, 1:00 flat recovery. Four rounds.'),
        pkB('wrbb-f1', 'superset', 'Floor 1 · Pull-Up + Push-Up', 3, 60, [
          pkX('pull-up', 3, 6, '8'), pkX('push-up', 3, 12, '7-8'),
        ], 'Swap the pull-up for assisted or a pulldown any time.'),
        pkB('wrbb-t2', 'circuit', 'Tread 2 · Base & Sprint', 3, 0, [
          pkX('tread-base', 3, 120, '', 6), pkX('tread-sprint', 3, 20, '', 9.5), pkX('tread-walk', 3, 40, '', 3.5),
        ], 'Base 2:00, sprint :20, walk :40 — three rounds.'),
        pkB('wrbb-f2', 'superset', 'Floor 2 · Row + Fly', 3, 60, [
          pkX('cs-row', 3, 12, '7-8', 60), pkX('cable-fly', 3, 15, '6-7', 25),
        ]),
        pkB('wrbb-core', 'circuit', 'Core Finisher', 2, 30, [
          pkX('hanging-leg', 2, 10), pkX('pallof-press', 2, 12, '6-7', 20),
        ]),
      ],
    },
    {
      id: 'w-wa-legs2-b', name: 'Legs II · Hip Thrust (B)', minutes: 55,
      focus: 'Hip thrust volume + core · Hamstrings · Glutes',
      blocks: [
        pkW('wa2b-wu', 'Warm-up', WU_LEGS),
        pkB('wa2b-a', 'superset', 'Hip Thrust + Core', 4, 120, [
          pkX('hip-thrust', 4, 12, '8', 155), pkX('l-sit', 4, 20),
        ], 'Higher reps than week A. Squeeze every rep, then hold the L-sit as long as it stays clean.'),
        pkB('wa2b-b', 'superset', 'RDL + Curl', 3, 90, [
          pkX('single-leg-rdl', 3, 10, '7-8', 30), pkX('seated-leg-curl', 3, 15, '7-8', 55),
        ]),
        pkB('wa2b-c', 'superset', 'Pull-Through + Abduction', 3, 60, [
          pkX('cable-pullthrough', 3, 15, '6-7', 45), pkX('abduction-machine', 3, 20, '6-7', 60),
        ]),
        pkB('wa2b-d', 'circuit', 'Core Finisher', 2, 45, [
          pkX('decline-situp', 2, 15), pkX('plank-taps', 2, 20),
        ]),
      ],
    },
    {
      id: 'w-wa-run-core-b', name: 'Run + Core (B)', minutes: 45,
      focus: 'Long intervals · Abs and waist floor',
      blocks: [
        pkW('wrcb-wu', 'Warm-up', WU_TREAD),
        pkB('wrcb-t1', 'circuit', 'Tread 1 · Long Intervals', 3, 0, [
          pkX('tread-base', 3, 180, '', 6), pkX('tread-walk', 3, 60, '', 3.5),
        ], 'Three minutes at base, one minute walking. Three rounds.'),
        pkB('wrcb-f1', 'circuit', 'Floor 1 · Abs', 3, 40, [
          pkX('hanging-leg', 3, 10), pkX('cable-crunch', 3, 15, '7-8', 45), pkX('body-saw', 3, 12),
        ]),
        pkB('wrcb-t2', 'circuit', 'Tread 2 · Sprint Finish', 5, 0, [
          pkX('tread-sprint', 5, 20, '', 9.5), pkX('tread-walk', 5, 40, '', 3.5),
        ], 'Five sprints, :20 on, :40 off.'),
        pkB('wrcb-f2', 'circuit', 'Floor 2 · Waist', 3, 40, [
          pkX('copenhagen-plank', 3, 20), pkX('windshield-wiper', 3, 8), pkX('hollow-hold', 3, 30),
        ]),
      ],
    },
  ],

  weeks: [
    {
      id: 'wk-winter-a', name: 'Winter Arc · Week A', focus: 'Legs Mon & Thu, running Tue, Wed and Fri',
      days: { 1: 'w-wa-legs1-a', 2: 'w-wa-run-arms-a', 3: 'w-wa-run-bc-a', 4: 'w-wa-legs2-a', 5: 'w-wa-run-core-a', 6: null, 0: null },
    },
    {
      id: 'wk-winter-b', name: 'Winter Arc · Week B', focus: 'Same split, heavier squats and different floor work',
      days: { 1: 'w-wa-legs1-b', 2: 'w-wa-run-arms-b', 3: 'w-wa-run-bc-b', 4: 'w-wa-legs2-b', 5: 'w-wa-run-core-b', 6: null, 0: null },
    },
  ],
};

const SEED_PACKS = [PACK_2026_09, PACK_2026_09B, PACK_2026_09C, PACK_2026_10, PACK_2026_11, PACK_2026_11B];

// Everything the Winter Arc split needs. Anything else that shipped and
// was never touched is cleared out when the split lands, to keep the
// library short.
const KEEP_ON_TIDY = new Set([
  ...PACK_2026_11B.workouts.map(w => w.id),
  ...PACK_2026_11B.weeks.map(w => w.id),
]);
