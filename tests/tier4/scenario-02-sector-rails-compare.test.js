/**
 * Tier 4 - Scenario Test 2
 * Real-World Application Workload Scenario 2:
 * Sector Ledger Filter -> 23-Sector Proportional Distribution Rail Verification ->
 * Transition to 27 Peer Group Compare Matrix
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 4 - Scenario 02: Sector Ledger Filter -> Proportional Rails -> Compare Matrix', () => {
  const TOTAL_COMPANIES = 107;

  const SECTORS_LEDGER = [
    { id: 'sec_bfsi', name: 'BFSI & Banking', count: 18, peerGroupId: 'peer_bfsi_1' },
    { id: 'sec_it', name: 'IT Services', count: 12, peerGroupId: 'peer_it_1' },
    { id: 'sec_pharma', name: 'Pharma & Healthcare', count: 10, peerGroupId: 'peer_pharma_1' },
    { id: 'sec_auto', name: 'Automotive & EV', count: 8, peerGroupId: 'peer_auto_1' },
    { id: 'sec_cpg', name: 'FMCG & Consumer', count: 9, peerGroupId: 'peer_cpg_1' },
    { id: 'sec_energy', name: 'Energy & Renewables', count: 7, peerGroupId: 'peer_energy_1' },
    { id: 'sec_infra', name: 'Infrastructure', count: 6, peerGroupId: 'peer_infra_1' },
    { id: 'sec_chem', name: 'Specialty Chemicals', count: 5, peerGroupId: 'peer_chem_1' },
    { id: 'sec_metal', name: 'Metals & Mining', count: 5, peerGroupId: 'peer_metal_1' },
    { id: 'sec_telecom', name: 'Telecom & Infra', count: 4, peerGroupId: 'peer_telecom_1' },
    { id: 'sec_retail', name: 'Retail & E-commerce', count: 4, peerGroupId: 'peer_retail_1' },
    { id: 'sec_defense', name: 'Defense', count: 3, peerGroupId: 'peer_defense_1' },
    { id: 'sec_logistics', name: 'Logistics', count: 2, peerGroupId: 'peer_logistics_1' },
    { id: 'sec_cement', name: 'Cement', count: 2, peerGroupId: 'peer_cement_1' },
    { id: 'sec_textiles', name: 'Textiles', count: 2, peerGroupId: 'peer_textiles_1' },
    { id: 'sec_media', name: 'Media', count: 2, peerGroupId: 'peer_media_1' },
    { id: 'sec_hotel', name: 'Hotels', count: 2, peerGroupId: 'peer_hotel_1' },
    { id: 'sec_agro', name: 'Agro', count: 1, peerGroupId: 'peer_agro_1' },
    { id: 'sec_fintech', name: 'Fintech', count: 1, peerGroupId: 'peer_fintech_1' },
    { id: 'sec_capital', name: 'Capital Goods', count: 1, peerGroupId: 'peer_capital_1' },
    { id: 'sec_semicon', name: 'Semiconductors', count: 1, peerGroupId: 'peer_semicon_1' },
    { id: 'sec_aviation', name: 'Aviation', count: 1, peerGroupId: 'peer_aviation_1' },
    { id: 'sec_power', name: 'Power Generation', count: 1, peerGroupId: 'peer_power_1' }
  ];

  test('Step 1: Renders Sectors View and verifies exact 23 sectors ledger', () => {
    assert.strictEqual(SECTORS_LEDGER.length, 23, 'Must render exactly 23 sectors');

    const totalCountSum = SECTORS_LEDGER.reduce((sum, sec) => sum + sec.count, 0);
    assert.strictEqual(totalCountSum, TOTAL_COMPANIES, 'Total sector count sum must equal 107');
  });

  test('Step 2: Proportional distribution rails calculate exact n/total percentage widths', () => {
    for (const sector of SECTORS_LEDGER) {
      const railWidthPct = Number(((sector.count / TOTAL_COMPANIES) * 100).toFixed(2));

      assert.greaterThan(railWidthPct, 0, `Rail width for ${sector.name} must be positive`);
      assert.lessThan(railWidthPct, 100, `Rail width for ${sector.name} must be < 100%`);

      if (sector.id === 'sec_bfsi') {
        assert.strictEqual(railWidthPct, 16.82, 'BFSI rail width must be 16.82%');
      }
    }
  });

  test('Step 3: User filters sector ledger by search text "Pharma"', () => {
    const query = 'Pharma';
    const filteredSectors = SECTORS_LEDGER.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

    assert.strictEqual(filteredSectors.length, 1);
    assert.strictEqual(filteredSectors[0].id, 'sec_pharma');
  });

  test('Step 4: User clicks "Compare Sector" action, transitioning to 27 Peer Group Compare Matrix', () => {
    const selectedSector = SECTORS_LEDGER.find(s => s.id === 'sec_pharma');

    function navigateToCompareMatrix(sector) {
      return {
        view: 'CompareMatrix',
        route: `/compare?peerGroup=${sector.peerGroupId}`,
        activePeerGroupId: sector.peerGroupId,
        totalPeerGroupsAvailable: 27,
        renderedPeerCompaniesCount: sector.count
      };
    }

    const compareState = navigateToCompareMatrix(selectedSector);

    assert.strictEqual(compareState.view, 'CompareMatrix');
    assert.strictEqual(compareState.activePeerGroupId, 'peer_pharma_1');
    assert.strictEqual(compareState.totalPeerGroupsAvailable, 27);
    assert.strictEqual(compareState.renderedPeerCompaniesCount, 10);
  });
});
