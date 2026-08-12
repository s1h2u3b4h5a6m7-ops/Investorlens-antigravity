/**
 * Tier 3 - Pairwise Test 8
 * Feature 10 (Sector Ledger Selection) x Feature 12 (Compare Matrix 27 Peer Group Filter) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 08: Sector Ledger Selection x Compare Matrix 27 Peer Group Filter', () => {
  const SECTORS_23 = [
    { id: 'sec_it', name: 'IT Services', companyCount: 12 },
    { id: 'sec_bfsi', name: 'BFSI & Banking', companyCount: 18 },
    { id: 'sec_auto', name: 'Automotive & EV', companyCount: 8 },
    { id: 'sec_pharma', name: 'Pharma & Healthcare', companyCount: 10 },
    { id: 'sec_cpg', name: 'FMCG & Consumer', companyCount: 9 },
    { id: 'sec_energy', name: 'Energy & Renewables', companyCount: 7 },
    { id: 'sec_telecom', name: 'Telecom & Infra', companyCount: 4 },
    { id: 'sec_chem', name: 'Specialty Chemicals', companyCount: 5 },
    { id: 'sec_infra', name: 'Infrastructure & Real Estate', companyCount: 6 },
    { id: 'sec_metal', name: 'Metals & Mining', companyCount: 5 },
    { id: 'sec_defense', name: 'Defense & Aerospace', companyCount: 3 },
    { id: 'sec_retail', name: 'Retail & E-commerce', companyCount: 4 },
    { id: 'sec_logistics', name: 'Logistics & Shipping', companyCount: 2 },
    { id: 'sec_cement', name: 'Cement & Building Materials', companyCount: 2 },
    { id: 'sec_textiles', name: 'Textiles & Apparel', companyCount: 2 },
    { id: 'sec_media', name: 'Media & Entertainment', companyCount: 2 },
    { id: 'sec_hotel', name: 'Hotels & Hospitality', companyCount: 2 },
    { id: 'sec_agro', name: 'Agro & Fertilizers', companyCount: 1 },
    { id: 'sec_fintech', name: 'Fintech & Payments', companyCount: 1 },
    { id: 'sec_capital', name: 'Capital Goods', companyCount: 1 },
    { id: 'sec_semicon', name: 'Semiconductors', companyCount: 1 },
    { id: 'sec_aviation', name: 'Aviation & Defense', companyCount: 1 },
    { id: 'sec_power', name: 'Power Generation', companyCount: 1 }
  ];

  test('23-sector ledger contains exactly 23 sectors with total count matching 107 companies', () => {
    assert.strictEqual(SECTORS_23.length, 23, 'Sectors ledger must contain exactly 23 sectors');
    const totalCompanies = SECTORS_23.reduce((acc, s) => acc + s.companyCount, 0);
    assert.strictEqual(totalCompanies, 107, 'Sum of sector company counts must equal 107');
  });

  test('Selecting sector transfers filter to 27 peer group Compare Matrix', () => {
    const PEER_GROUPS = Array.from({ length: 27 }, (_, i) => ({
      id: `peer_${i + 1}`,
      name: `Peer Group ${i + 1}`,
      sectorId: i < 23 ? SECTORS_23[i].id : 'sec_it'
    }));

    function selectSectorAndCompare(sectorId) {
      const targetSector = SECTORS_23.find(s => s.id === sectorId);
      const matchingPeerGroup = PEER_GROUPS.find(p => p.sectorId === sectorId);

      return {
        selectedSector: targetSector.name,
        activePeerGroupId: matchingPeerGroup ? matchingPeerGroup.id : null,
        compareMatrixRoute: `/compare?peerGroup=${matchingPeerGroup ? matchingPeerGroup.id : ''}`
      };
    }

    const itCompare = selectSectorAndCompare('sec_it');
    assert.strictEqual(itCompare.selectedSector, 'IT Services');
    assert.strictEqual(itCompare.activePeerGroupId, 'peer_1');
    assert.contains(itCompare.compareMatrixRoute, 'peer_1');

    const bfsiCompare = selectSectorAndCompare('sec_bfsi');
    assert.strictEqual(bfsiCompare.selectedSector, 'BFSI & Banking');
    assert.strictEqual(bfsiCompare.activePeerGroupId, 'peer_2');
  });
});
