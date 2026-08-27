// Initial demo dataset. Written to server/data.json on first run and rebuilt by
// POST /api/demo/reset.

const AV = (id, w = 96) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${w}&fit=crop&auto=format`

export function seed() {
  return {
    customer: {
      id: 'c1',
      name: 'Nadeesha',
      lastInitial: 'F',
      address: '12B, Galle Road, Colombo 05',
      unit: 'Apartment 3F',
      area: 'Colombo 05',
      availability: '4:30 PM – 7:00 PM today',
      spaces: 3,
    },

    pros: [
      {
        id: 'p1',
        name: 'Chamod Fernando',
        category: 'plumbing',
        categoryLabel: 'Plumbing',
        specialisation: 'pipe-leak',
        specialty: 'Plumbing · Pipe & Leak Specialist',
        avatar: AV('1507003211169-0a1dd7228f2d'),
        hero: AV('1507003211169-0a1dd7228f2d', 390),
        distanceKm: 2.4,
        etaMin: 42,
        inspectionFee: 1000,
        attributes: ['Leak specialist', 'NIC verified', 'TVEC certified', '7 yrs experience'],
        about: 'Specialises in residential plumbing, particularly pipe leaks and drain repairs. TVEC-certified with 7 years of verified field experience in Colombo and Gampaha districts.',
        evidence: {
          identityVerified: true,
          qualification: 'TVEC Vocational Certificate — Level 4',
          qualificationVerified: true,
          jobsCompleted: 46,
          relevantJobs: 31,
          completionRate: 96,
          onTimeRate: 94,
          disputes: 0,
          lastActive: 'This week',
          yearsExperience: 7,
        },
        ratings: [
          { by: 'Amara S.', rating: 5, text: 'Identified the problem quickly and explained everything clearly. Clean work.', date: 'Jul 2026', verified: true },
          { by: 'Priya K.', rating: 5, text: 'Very professional. Fixed the leak in under an hour with no mess.', date: 'Jun 2026', verified: true },
          { by: 'Ruwan D.', rating: 4, text: 'Arrived a little late but the repair has held up perfectly since.', date: 'May 2026', verified: true },
        ],
      },
      {
        id: 'p2',
        name: 'Suresh Perera',
        category: 'plumbing',
        categoryLabel: 'Plumbing',
        specialisation: 'general plumbing',
        specialty: 'Plumbing · General',
        avatar: AV('1472099645785-5658abf4ff4e'),
        hero: AV('1472099645785-5658abf4ff4e', 390),
        distanceKm: 0.9,
        etaMin: 18,
        inspectionFee: 900,
        attributes: ['NIC verified', 'TVEC certified', '4 yrs experience'],
        about: 'General residential plumbing across Colombo. Fast response times within Colombo 03 to 07.',
        evidence: {
          identityVerified: true,
          qualification: 'TVEC Vocational Certificate — Level 3',
          qualificationVerified: true,
          jobsCompleted: 28,
          relevantJobs: 18,
          completionRate: 93,
          onTimeRate: 88,
          disputes: 0,
          lastActive: 'Today',
          yearsExperience: 4,
        },
        ratings: [
          { by: 'Ishara M.', rating: 5, text: 'Came within twenty minutes of accepting. Sorted it the same evening.', date: 'Aug 2026', verified: true },
          { by: 'Dinuka P.', rating: 4, text: 'Good work overall, tidy and polite.', date: 'Jun 2026', verified: true },
        ],
      },
      {
        id: 'p3',
        name: 'Dilshan Wijesinghe',
        category: 'plumbing',
        categoryLabel: 'Plumbing',
        specialisation: 'maintenance plumbing',
        specialty: 'Plumbing · Maintenance',
        avatar: AV('1500648767791-00dcc994a43e'),
        hero: AV('1500648767791-00dcc994a43e', 390),
        distanceKm: 4.1,
        etaMin: 65,
        inspectionFee: 750,
        attributes: ['NIC verified', '3 yrs experience'],
        about: 'Routine maintenance plumbing and preventive servicing for apartments and small properties.',
        evidence: {
          identityVerified: true,
          qualification: 'TVEC Vocational Certificate — Level 3',
          qualificationVerified: true,
          jobsCompleted: 19,
          relevantJobs: 11,
          completionRate: 91,
          onTimeRate: 90,
          disputes: 0,
          lastActive: 'Yesterday',
          yearsExperience: 3,
        },
        ratings: [
          { by: 'Tharindu B.', rating: 4, text: 'Reasonable price and thorough about checking the other fittings too.', date: 'Jul 2026', verified: true },
        ],
      },
      {
        id: 'p4',
        name: 'Nuwan Silva',
        category: 'electrical',
        categoryLabel: 'Electrical',
        specialisation: 'domestic wiring',
        specialty: 'Electrical · Domestic Wiring',
        avatar: AV('1519085360753-af0119f7cbe7'),
        hero: AV('1519085360753-af0119f7cbe7', 390),
        distanceKm: 3.2,
        etaMin: 35,
        inspectionFee: 1200,
        attributes: ['NIC verified', 'CEB approved', '9 yrs experience'],
        about: 'Domestic wiring, distribution boards and safety inspections. CEB-approved wireman with nine years of field experience.',
        evidence: {
          identityVerified: true,
          qualification: 'CEB Approved Wireman — Grade 1',
          qualificationVerified: true,
          jobsCompleted: 61,
          relevantJobs: 38,
          completionRate: 97,
          onTimeRate: 92,
          disputes: 0,
          lastActive: 'Today',
          yearsExperience: 9,
        },
        ratings: [
          { by: 'Kasun R.', rating: 5, text: 'Explained the fault properly and showed me the test readings.', date: 'Aug 2026', verified: true },
          { by: 'Hasini W.', rating: 5, text: 'Very safety-conscious. Would call again.', date: 'Jul 2026', verified: true },
        ],
      },
      {
        id: 'p5',
        name: 'Samith Rajapaksa',
        category: 'aircon',
        categoryLabel: 'Air Conditioning',
        specialisation: 'split-unit servicing',
        specialty: 'Air Conditioning · Split Units',
        avatar: AV('1544723795-3fb6469f5b39'),
        hero: AV('1544723795-3fb6469f5b39', 390),
        distanceKm: 5.6,
        etaMin: 55,
        inspectionFee: 1500,
        attributes: ['NIC verified', 'TVEC certified', '6 yrs experience'],
        about: 'Split and inverter AC servicing, gas recharging and fault diagnosis across the Colombo district.',
        evidence: {
          identityVerified: true,
          qualification: 'TVEC Vocational Certificate — Level 4',
          qualificationVerified: true,
          jobsCompleted: 37,
          relevantJobs: 29,
          completionRate: 94,
          onTimeRate: 89,
          disputes: 0,
          lastActive: 'This week',
          yearsExperience: 6,
        },
        ratings: [
          { by: 'Nadeesha F.', rating: 5, text: 'Serviced both units and the cooling is noticeably better.', date: 'Jul 2026', verified: true },
        ],
      },
    ],

    // Completed jobs across the platform, used for price context. Not this
    // customer's history — this is the market comparison set.
    history: [
      ...[4200, 4800, 5100, 5600, 5900, 6200, 6500, 7100, 7400, 8200, 9100, 10400, 11800, 12500]
        .map((total, i) => ({ id: `h-pl-${i}`, category: 'plumbing', area: 'Colombo', total })),
      ...[3800, 4400, 4900, 5400, 6100, 6800, 7600, 8800, 9900, 11200]
        .map((total, i) => ({ id: `h-el-${i}`, category: 'electrical', area: 'Colombo', total })),
      ...[6500, 7200, 8100, 8900, 9600, 10800, 12200, 14500]
        .map((total, i) => ({ id: `h-ac-${i}`, category: 'aircon', area: 'Colombo', total })),
      ...[5200, 6400, 7300, 8600, 9800, 11500]
        .map((total, i) => ({ id: `h-ap-${i}`, category: 'appliance', area: 'Colombo', total })),
      ...[3200, 4100, 4700, 5500, 6300, 7800]
        .map((total, i) => ({ id: `h-ca-${i}`, category: 'carpentry', area: 'Colombo', total })),
    ],

    // The customer's own service record, before anything done in this session.
    records: [
      { id: 'rec1', room: 'Bedroom AC', service: 'Full service & filter replacement', tech: 'Samith Rajapaksa', date: 'July 2026', warranty: null },
      { id: 'rec2', room: 'Electrical', service: 'Safety inspection', tech: 'Nuwan Silva', date: 'March 2026', warranty: 'Certificate valid' },
      { id: 'rec3', room: 'Bathroom', service: 'Shower valve replacement', tech: 'Chamod Fernando', date: 'December 2025', warranty: null },
    ],

    requests: [],
    jobs: [],
    seq: 0,
  }
}
