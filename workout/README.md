# Lift — Workout Tracker

A personal workout tracker PWA: supersets, circuits, automatic progressive
overload, a library of saved workouts, and week templates you can swap in
depending on the week's focus and how much time you have.

## Add it to your iPhone Home Screen

1. Host this folder anywhere with HTTPS (GitHub Pages works great).
2. Open the URL in **Safari** on your phone.
3. Tap the **Share** button → **Add to Home Screen**.
4. It opens fullscreen with its own icon, and works offline at the gym.

## How the pieces fit together

**Workouts** are single sessions ("Heavy Legs", "Deadlift + Back"). They live
in the Library and can be dropped into any day.

**Week templates** are seven slots pointing at workouts — Monday through
Sunday, empty slots being rest days. Build one per focus or time budget
("Glute focus · 50 min", "Low time · 30 min") and assign it to any calendar
week from the Week tab.

**Shipped workouts** arrive with app updates and land in the library once
(`plan.seeded` records which packs have applied). Anything you delete stays
deleted, and your edits are never overwritten. The current pack adds a
back-safe set, glute and leg days, 30 minute versions, and cardio, plus three
week templates — Working Around It, Low Time · 30 min, and Glute Focus. New
week templates are added but left out of the rotation; they only run when you
assign them.

**Rotation** covers weeks you haven't assigned: they cycle through whichever
templates you've marked for rotation, in order. That's what keeps the
original Week A / Week B alternation running with no upkeep.

## Editing, and where the edit lands

Any structural change on a training day — swapping an exercise, adding a
block, editing sets and reps — asks where it should go:

- **Just this day** makes a copy for that date only. The day gets a
  `THIS DAY ONLY` badge, plus **revert** (back to the template) and
  **save to library** (keep the new version as its own workout, or overwrite
  the one it came from).
- **Update everywhere** edits the saved workout, so every day using it
  changes — including future weeks.

Workouts and week templates can also be edited directly from the Library tab,
no calendar day involved.

## How the dynamic weights work

Every exercise tracks your history. When you check off **all** your sets at or
above the target reps, the next session's suggested weight goes up
(+5 lbs lower body, +2.5–5 lbs upper). Miss reps and it holds; miss two
sessions in a row and it suggests a ~10% deload. You can always type over the
suggestion — whatever you actually log becomes the new baseline.

History is stamped per exercise, so it survives renaming a workout, moving a
day, swapping an exercise, or rebuilding a whole week template.

## Your data

Everything is saved on-device (localStorage). Use **Settings → Export backup**
before switching phones, then **Import backup** on the new one. Old v2
backups (before the library existed) import fine — they're converted into
workouts and week templates automatically.
