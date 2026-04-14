import type { ProgramCurriculumCollege } from './programs'

/**
 * Castalia colleges beyond AINS — placeholder shells until course SKUs and LMS categories are wired.
 * Align naming with `scripts/data/castalia-colleges.json` in the LMS repo when those exist.
 */
export const CASTALIA_PLACEHOLDER_COLLEGES: ProgramCurriculumCollege[] = [
  {
    code: 'ABUS',
    title: 'ABUS — College of Business & Innovation',
    placeholder: true,
    blocks: [
      {
        title: 'Catalog status',
        courses: [
          'Graduate business-AI, analytics, and leadership course lines are in planning. Listings will follow the same licensing pattern as AINS (codes, syllabi, IMS CC where applicable).',
          'Partner with Castalia to prioritize ABUS course authoring and Moodle category alignment.',
        ],
      },
    ],
  },
  {
    code: 'AHEL',
    title: 'AHEL — College of Health, Equity & Life Sciences',
    placeholder: true,
    blocks: [
      {
        title: 'Catalog status',
        courses: [
          'Clinical informatics, population health, and life-sciences AI pathways are scoped with partner institutions; public course rows will appear here as SKUs are finalized.',
          'Healthcare specializations under AINS today can be a bridge while AHEL-specific codes roll out.',
        ],
      },
    ],
  },
  {
    code: 'AESP',
    title: 'AESP — College of Education & Social Impact',
    placeholder: true,
    blocks: [
      {
        title: 'Catalog status',
        courses: [
          'Teacher preparation, learning analytics, and civic-technology course lines are in discovery. Expect graduate certificates and stackable modules similar to the AINS reference stack.',
          'Contact Castalia for co-design and accreditation-friendly packaging.',
        ],
      },
    ],
  },
  {
    code: 'AENG',
    title: 'AENG — College of Engineering & Computing Systems',
    placeholder: true,
    blocks: [
      {
        title: 'Catalog status',
        courses: [
          'Systems, software, robotics-adjacent, and embedded-AI offerings will publish here as licensable SKUs. Robotics AI under AINS previews part of this footprint.',
          'Engineering programs should watch this space for discipline-specific lab and capstone bundles.',
        ],
      },
    ],
  },
]
