-- Proposed migration for CastaliaInstitute/magisterium: supabase/migrations/006_aurnova_alignment.sql
-- Fills the course gaps found reconciling Aurnova's MSAI (AINS####) with magisterium's catalog.
-- See ../../COURSE-CODE-MAP.md (in CastaliaInstitute/programs) for the full mapping.
--
-- IMPORTANT — what this does NOT do, and why:
--   Aurnova's Cybersecurity and Robotics specializations do NOT get new AIN-<domain>-MAG programs.
--   `application_college_code` is a CLOSED enum (com, gov, war, hlt, ert, spc, cul, inf, nrg, int)
--   — there is no "security"/"robotics" domain, and adding one is an enum change, not a seed.
--     • Cybersecurity AI  → existing AIN-INT-MAG (Intelligence) [primary], or AIN-WAR-MAG (defense).
--     • Robotics AI       → an embodied-AI *capability*, not a real-world application domain.
--                           Compose from AI-151/152 + Eng-104/109/403, or a School-of-Engineering
--                           Magister — not an AIN-domain program.
--   Aurnova specialization → existing program alignment (no new programs needed):
--     • Business AI    → AIN-COM-MAG (active/flagship)
--     • Healthcare AI  → AIN-HLT-MAG (planned)
--     • Cybersecurity  → AIN-INT-MAG (planned)
--     • Robotics       → capability cluster (see above)

begin;

-------------------------------------------------------------------------------
-- 1. Two genuinely-missing courses (safe, additive)
-------------------------------------------------------------------------------

-- CS-100 fills the AINS6007 gap: the CS catalog starts at CS-101 (Discrete Math) and assumes
-- programming, so a from-zero on-ramp is missing for the non-programmer K–PhD+ pathway.
-- AI-157 fills the AINS6010 (Sovereign AI) gap: no course covers sovereign/on-prem/edge AI.
insert into courses (id, code, name, description, era, college_code, category, key_topics, artifact_requirements) values
  (gen_random_uuid(), 'CS-100', 'Programming Foundations',
   'Introductory programming for learners with no prior coding background: Python fundamentals, data types, control flow, functions, files, and testing — the on-ramp assumed by later CS and AI courses.',
   'baccalaureate', 'cs', 'foundation',
   array['Python fundamentals and environments','Control flow, functions, and data structures','Reading and modifying existing code','Testing and debugging basics'],
   array['Working Python programs','A tested mini-project']),

  (gen_random_uuid(), 'AI-157', 'Sovereign & Private AI',
   'Running capable AI under institutional control: on-premises and edge deployment, data residency, air-gapped or region-bound operation, quantization for constrained hardware, and privacy-preserving inference — without defaulting to public-cloud custody of models and data.',
   'baccalaureate', 'ai', 'elective',
   array['Sovereignty, residency, and threat models','On-prem, edge, and air-gapped serving','Quantization and constrained-hardware inference','Governed operations and secure lifecycle'],
   array['A local/edge inference deployment','A sovereignty design memo'])
on conflict (code) do nothing;

-------------------------------------------------------------------------------
-- 2. Proposed structural addition (OPTIONAL — magisterium's call): program ↔ course composition
-------------------------------------------------------------------------------
-- There is currently no table linking programs to their composing courses, so "which courses make
-- up Mag.AI in Commerce" can't be expressed. This adds one and seeds the Business program from the
-- Aurnova Business specialization mapping. Drop this section if magisterium models composition
-- differently.

create table if not exists program_courses (
  id           uuid primary key default gen_random_uuid(),
  program_id   uuid not null references programs(id) on delete cascade,
  course_id    uuid not null references courses(id),
  requirement  text default 'core',   -- 'core' | 'elective'
  created_at   timestamptz default now(),
  unique (program_id, course_id)
);

alter table program_courses enable row level security;
create policy "Public read program_courses" on program_courses for select using (true);

-- Seed AIN-COM-MAG (Mag.AI in Commerce ≈ Aurnova Business AI) with its composing courses.
insert into program_courses (program_id, course_id, requirement)
select p.id, c.id, v.requirement
from (values
  ('AI-102','core'),      -- Machine Learning
  ('AI-103','core'),      -- Deep Learning
  ('AI-104','core'),      -- NLP
  ('Com-105','core'),     -- Marketing & Consumer Behavior  (AINS6200)
  ('Com-106','core'),     -- Operations & Supply Chain      (AINS6201)
  ('Com-405','core'),     -- Technology & Business Integration (AINS6202)
  ('Com-109','elective'), -- Data-Driven Decision Making
  ('AI-450','elective')   -- Autonomous Agents & Tool Use
) as v(code, requirement)
join courses c on c.code = v.code
cross join programs p
where p.internal_code = 'AIN-COM-MAG'
on conflict (program_id, course_id) do nothing;

commit;
