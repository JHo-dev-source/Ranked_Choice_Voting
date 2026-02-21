/**
 * sankey.js — Builds a Plotly Sankey diagram from RCV results.
 */

/**
 * Render a Sankey diagram into the given container element.
 * @param {HTMLElement} container - DOM element to render into
 * @param {{ rounds: object[], winner: string, totalBallots: number }} rcvResult
 * @param {object} colors - Map of candidate name → CSS color string
 * @param {number} [maxRound] - Only show up to this many rounds (0-indexed inclusive).
 *   If omitted, shows all rounds.
 */
function renderSankey(container, rcvResult, colors, maxRound) {
    const { rounds } = rcvResult;

    // We need at least 2 rounds (1 elimination + final) to draw flows
    const eliminationRounds = rounds.filter(r => r.eliminated);
    if (eliminationRounds.length === 0) {
        container.innerHTML = `<p style="color:#888;text-align:center;">${t('sankeyNoElimination')}</p>`;
        return;
    }

    const lastRound = (maxRound !== undefined) ? Math.min(maxRound, rounds.length - 1) : rounds.length - 1;

    const nodeLabels = [];
    const nodeColors = [];
    const linkSources = [];
    const linkTargets = [];
    const linkValues = [];
    const linkColors = [];

    // Build node index: one node per candidate per round
    const nodeIndex = {}; // key: "round-candidate" → index

    function getNodeId(round, candidate) {
        const key = `${round}-${candidate}`;
        if (!(key in nodeIndex)) {
            nodeIndex[key] = nodeLabels.length;
            nodeLabels.push(candidate);
            nodeColors.push(colors[candidate] || '#bab0ac');
        }
        return nodeIndex[key];
    }

    // Also add a single "No more choices" sink node per round if needed
    function getExhaustedId(round) {
        const key = `${round}-__exhausted__`;
        if (!(key in nodeIndex)) {
            nodeIndex[key] = nodeLabels.length;
            nodeLabels.push(t('sankeyNoMoreChoices'));
            nodeColors.push("#ddd");
        }
        return nodeIndex[key];
    }

    // Process rounds up to the revealed limit
    for (let i = 0; i <= lastRound; i++) {
        const round = rounds[i];
        const { voteCounts, eliminated, transfers } = round;

        // Create nodes for all candidates this round
        for (const candidate of Object.keys(voteCounts)) {
            getNodeId(i, candidate);
        }

        if (!eliminated || !transfers) continue;

        // Links: surviving candidates carry forward to next round
        const nextRound = rounds[i + 1];
        if (!nextRound) continue;

        // Carry-forward links (candidates that survive)
        for (const candidate of Object.keys(nextRound.voteCounts)) {
            const fromId = getNodeId(i, candidate);
            const toId = getNodeId(i + 1, candidate);
            // Their carry-forward = their votes this round (before transfers arrive)
            const carryForward = voteCounts[candidate] || 0;
            if (carryForward > 0) {
                linkSources.push(fromId);
                linkTargets.push(toId);
                linkValues.push(carryForward);
                const c = colors[candidate] || '#bab0ac';
                linkColors.push(hexToRgba(c, 0.4));
            }
        }

        // Transfer links from eliminated candidate
        const fromId = getNodeId(i, eliminated);
        for (const [target, count] of Object.entries(transfers)) {
            if (count <= 0) continue;
            if (target === 'noMoreChoices') {
                const toId = getExhaustedId(i + 1);
                linkSources.push(fromId);
                linkTargets.push(toId);
                linkValues.push(count);
                linkColors.push(hexToRgba(colors[eliminated] || '#bab0ac', 0.6));
            } else {
                const toId = getNodeId(i + 1, target);
                linkSources.push(fromId);
                linkTargets.push(toId);
                linkValues.push(count);
                linkColors.push(hexToRgba(colors[eliminated] || '#bab0ac', 0.6));
            }
        }
    }

    const data = [{
        type: "sankey",
        orientation: "h",
        node: {
            pad: 20,
            thickness: 20,
            label: nodeLabels,
            color: nodeColors,
            hovertemplate: t('sankeyNodeHover') + '<extra></extra>'
        },
        link: {
            source: linkSources,
            target: linkTargets,
            value: linkValues,
            color: linkColors,
            hovertemplate: t('sankeyLinkHover') + '<extra></extra>'
        }
    }];

    const layout = {
        font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 13 },
        margin: { l: 10, r: 10, t: 10, b: 10 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent'
    };

    Plotly.newPlot(container, data, layout, { responsive: true, displayModeBar: false });
}

/**
 * Convert hex color to rgba string.
 */
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}
