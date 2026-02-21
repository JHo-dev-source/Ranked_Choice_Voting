/**
 * rcv-engine.js — Pure Ranked Choice Voting counting logic.
 * No DOM dependencies. Works with arrays of ballot data.
 */

/**
 * Run a full RCV (Instant Runoff) count.
 * @param {string[][]} ballots - Array of ballots. Each ballot is an ordered
 *   array of candidate names, first choice first. e.g. [["Alice","Bob"],["Bob","Alice"]]
 * @returns {{ rounds: object[], winner: string|null, totalBallots: number }}
 */
function countRCV(ballots) {
    if (!ballots || ballots.length === 0) {
        return { rounds: [], winner: null, totalBallots: 0 };
    }

    // Deep copy so we don't mutate the input
    let activeBallots = ballots.map(b => [...b]);
    const totalBallots = ballots.length;

    // Collect all unique candidate names
    const allCandidates = [...new Set(ballots.flat().filter(c => c))];
    let activeCandidates = new Set(allCandidates);
    const rounds = [];

    while (activeCandidates.size > 1) {
        // Count first choices among active candidates
        const voteCounts = {};
        for (const c of activeCandidates) voteCounts[c] = 0;

        for (const ballot of activeBallots) {
            const top = ballot.find(c => activeCandidates.has(c));
            if (top) voteCounts[top]++;
        }

        // Count active (non-exhausted) ballots this round
        const activeVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

        // Check for majority winner (>50% of active votes)
        for (const [candidate, count] of Object.entries(voteCounts)) {
            if (count > activeVotes / 2) {
                rounds.push({
                    voteCounts: { ...voteCounts },
                    eliminated: null,
                    transfers: null
                });
                return { rounds, winner: candidate, totalBallots };
            }
        }

        // Find candidate with fewest votes (tie-break: alphabetical)
        let minVotes = Infinity;
        let toEliminate = null;
        const sorted = [...activeCandidates].sort();
        for (const c of sorted) {
            if (voteCounts[c] < minVotes) {
                minVotes = voteCounts[c];
                toEliminate = c;
            }
        }

        // Calculate transfers
        const transfers = {};
        for (const c of activeCandidates) {
            if (c !== toEliminate) transfers[c] = 0;
        }
        transfers["noMoreChoices"] = 0;

        for (const ballot of activeBallots) {
            const top = ballot.find(c => activeCandidates.has(c));
            if (top !== toEliminate) continue;

            // This ballot's first choice is the eliminated candidate
            // Find their next choice among remaining candidates
            const remaining = new Set(activeCandidates);
            remaining.delete(toEliminate);

            const next = ballot.find(c => remaining.has(c));
            if (next) {
                transfers[next]++;
            } else {
                transfers["noMoreChoices"]++;
            }
        }

        rounds.push({
            voteCounts: { ...voteCounts },
            eliminated: toEliminate,
            transfers
        });

        activeCandidates.delete(toEliminate);
    }

    // One candidate left — they win
    const winner = [...activeCandidates][0] || null;

    // Add final round showing the winner's count
    if (winner) {
        const voteCounts = {};
        for (const c of activeCandidates) voteCounts[c] = 0;
        for (const ballot of activeBallots) {
            const top = ballot.find(c => activeCandidates.has(c));
            if (top) voteCounts[top]++;
        }
        rounds.push({
            voteCounts,
            eliminated: null,
            transfers: null
        });
    }

    return { rounds, winner, totalBallots };
}

/**
 * Simple first-past-the-post count (first choices only).
 * @param {string[][]} ballots
 * @returns {{ voteCounts: object, winner: string|null }}
 */
function countFPTP(ballots) {
    if (!ballots || ballots.length === 0) {
        return { voteCounts: {}, winner: null };
    }

    const voteCounts = {};
    for (const ballot of ballots) {
        const first = ballot[0];
        if (first) {
            voteCounts[first] = (voteCounts[first] || 0) + 1;
        }
    }

    // Winner = whoever has the most first-choice votes
    let maxVotes = 0;
    let winner = null;
    for (const [candidate, count] of Object.entries(voteCounts)) {
        if (count > maxVotes) {
            maxVotes = count;
            winner = candidate;
        }
    }

    return { voteCounts, winner };
}

/**
 * Parse a SheetJS workbook into ballot arrays.
 * Expects: Row 1 = headers (ignored). Each subsequent row = one ballot.
 * Columns = Rank 1, Rank 2, Rank 3, ... Cell values = candidate names.
 * Empty cells = no further preference.
 * @param {object} workbook - SheetJS workbook object
 * @returns {string[][]}
 */
function parseExcelData(workbook) {
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length < 2) return [];

    // Skip header row, convert each row to a ballot
    const ballots = [];
    for (let i = 1; i < rows.length; i++) {
        const ballot = rows[i]
            .map(cell => (cell != null ? String(cell).trim() : ""))
            .filter(c => c.length > 0);
        if (ballot.length > 0) {
            ballots.push(ballot);
        }
    }
    return ballots;
}

/**
 * Get a consistent color palette for candidates.
 * @param {string[]} candidates - Array of candidate names
 * @returns {object} - Map of candidate name → CSS color
 */
function getCandidateColors(candidates) {
    const palette = [
        "#4e79a7", "#f28e2b", "#e15759", "#76b7b2",
        "#59a14f", "#edc948", "#b07aa1", "#ff9da7",
        "#9c755f", "#bab0ac"
    ];
    const colors = {};
    candidates.forEach((c, i) => {
        colors[c] = palette[i % palette.length];
    });
    return colors;
}
