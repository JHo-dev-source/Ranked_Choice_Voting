/**
 * app.js — UI controller for the Ranked Choice Voting demo.
 */

(function () {
    "use strict";

    // ── Pre-loaded example data ──
    // Uses translation keys for option names so the example works in any language.
    // The actual display names are resolved via t() at count time.
    const EXAMPLE_BALLOT_KEYS = [
        ["optThemePark", "optBeach",  "optMuseum",  "optHiking"],
        ["optThemePark", "optBeach",  "optHiking",  "optMuseum"],
        ["optThemePark", "optMuseum", "optBeach",   "optHiking"],
        ["optThemePark", "optHiking", "optMuseum",  "optBeach"],
        ["optThemePark", "optBeach",  "optMuseum"             ],
        ["optMuseum",    "optBeach",  "optHiking",  "optThemePark"],
        ["optMuseum",    "optHiking", "optBeach",   "optThemePark"],
        ["optMuseum",    "optBeach",  "optThemePark"           ],
        ["optMuseum",    "optHiking", "optBeach"               ],
        ["optBeach",     "optMuseum", "optHiking",  "optThemePark"],
        ["optBeach",     "optHiking", "optMuseum",  "optThemePark"],
        ["optBeach",     "optThemePark", "optMuseum"           ],
        ["optHiking",    "optMuseum", "optBeach",   "optThemePark"],
        ["optHiking",    "optBeach",  "optMuseum"              ],
        ["optHiking",    "optThemePark", "optMuseum", "optBeach"],
    ];

    /** Resolve example ballots using current language translations. */
    function getExampleBallots() {
        return EXAMPLE_BALLOT_KEYS.map(ballot =>
            ballot.map(key => t(key))
        );
    }

    // ── State ──
    let customCandidates = [];
    let customBallots = [];
    let currentResult = null;
    let currentColors = null;
    let revealedRound = 0;

    // ── DOM refs ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ── Language switcher ──
    $$('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
            // Re-render ballot counter if in voting mode
            updateBallotCounter();
            // Re-render ballot list if visible
            if (customBallots.length > 0) updateBallotList();
        });
    });

    // ── Tab switching ──
    $$('.tab').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.tab').forEach(t => t.classList.remove('active'));
            $$('.tab-content').forEach(tc => tc.classList.remove('active'));
            btn.classList.add('active');
            $(`#tab-${btn.dataset.tab}`).classList.add('active');
            hideResults();
        });
    });

    // ── Example tab ──
    $('#btn-count-example').addEventListener('click', () => {
        runCount(getExampleBallots());
    });

    // ── Custom voting: setup ──
    $('#btn-add-candidate').addEventListener('click', addCandidateRow);

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const row = e.target.closest('.candidate-row');
            if ($$('.candidate-row').length > 2) {
                row.remove();
            }
        }
    });

    $('#btn-start-voting').addEventListener('click', () => {
        const inputs = $$('.candidate-input');
        const names = [];
        for (const inp of inputs) {
            const name = inp.value.trim();
            if (name) names.push(name);
        }
        if (names.length < 2) {
            alert(t('alertMin2Options'));
            return;
        }
        if (new Set(names).size !== names.length) {
            alert(t('alertUniqueNames'));
            return;
        }
        customCandidates = names;
        customBallots = [];
        showVotingForm();
    });

    $('#btn-back-setup').addEventListener('click', () => {
        $('#custom-setup').classList.remove('hidden');
        $('#custom-voting').classList.add('hidden');
        hideResults();
    });

    // ── Custom voting: ballot submission ──
    $('#btn-submit-ballot').addEventListener('click', submitBallot);

    $('#toggle-ballots').addEventListener('change', (e) => {
        const list = $('#ballot-list');
        if (e.target.checked) {
            list.classList.remove('hidden');
        } else {
            list.classList.add('hidden');
        }
    });

    $('#btn-count-custom').addEventListener('click', () => {
        if (customBallots.length === 0) {
            alert(t('alertNoBallots'));
            return;
        }
        runCount(customBallots);
    });

    // ── Upload tab ──
    const dropZone = $('#drop-zone');
    const fileInput = $('#file-input');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    // ── Start Over ──
    $('#btn-start-over').addEventListener('click', () => {
        hideResults();
        customBallots = [];
        updateBallotCounter();
        $('#ballot-list').innerHTML = '';
        $$('.vote-rank-input').forEach(inp => { inp.value = ''; });
        $('#btn-count-custom').classList.add('hidden');
    });

    // ── Next Round button ──
    $('#btn-next-round').addEventListener('click', () => {
        revealedRound++;
        renderNextRound();
    });

    // ── Helpers ──

    function addCandidateRow() {
        const count = $$('.candidate-row').length + 1;
        const row = document.createElement('div');
        row.className = 'candidate-row';
        row.innerHTML = `
            <input type="text" class="candidate-input" placeholder="${t('optionPlaceholder')} ${count}" maxlength="40">
            <button class="btn btn-small btn-remove" title="${t('btnRemoveTitle')}" data-i18n="btnRemoveTitle" data-i18n-attr="title">&times;</button>
        `;
        $('#candidate-list').appendChild(row);
    }

    function showVotingForm() {
        $('#custom-setup').classList.add('hidden');
        $('#custom-voting').classList.remove('hidden');
        hideResults();

        const form = $('#voting-form');
        form.innerHTML = '';
        for (const name of customCandidates) {
            const row = document.createElement('div');
            row.className = 'vote-row';
            row.innerHTML = `
                <label>${name}</label>
                <input type="number" class="vote-rank-input" data-candidate="${name}"
                       min="1" max="${customCandidates.length}" placeholder="-">
            `;
            form.appendChild(row);
        }
        updateBallotCounter();
        $('#btn-count-custom').classList.add('hidden');
    }

    function submitBallot() {
        const inputs = $$('.vote-rank-input');
        const ranks = [];

        for (const inp of inputs) {
            const val = inp.value.trim();
            const candidate = inp.dataset.candidate;
            if (val !== '') {
                const rank = parseInt(val, 10);
                if (isNaN(rank) || rank < 1 || rank > customCandidates.length) {
                    alert(t('alertInvalidRank', { candidate, max: customCandidates.length }));
                    return;
                }
                ranks.push({ candidate, rank });
            }
        }

        if (ranks.length === 0) {
            alert(t('alertRankAtLeastOne'));
            return;
        }

        const rankNums = ranks.map(r => r.rank);
        if (new Set(rankNums).size !== rankNums.length) {
            alert(t('alertDuplicateRank'));
            return;
        }

        ranks.sort((a, b) => a.rank - b.rank);
        const ballot = ranks.map(r => r.candidate);

        customBallots.push(ballot);

        inputs.forEach(inp => { inp.value = ''; });

        updateBallotCounter();
        updateBallotList();

        if (customBallots.length >= 2) {
            $('#btn-count-custom').classList.remove('hidden');
        }
    }

    function updateBallotCounter() {
        const n = customBallots.length;
        $('#ballot-counter').textContent = t('ballotsCast', { n });
    }

    function updateBallotList() {
        const list = $('#ballot-list');
        list.innerHTML = '';
        customBallots.forEach((ballot, i) => {
            const entry = document.createElement('div');
            entry.className = 'ballot-entry';
            const ranking = ballot.map((c, j) => `${j + 1}. ${c}`).join(', ');
            entry.textContent = `${t('optionPlaceholder')} ${i + 1}: ${ranking}`;
            list.appendChild(entry);
        });
    }

    function handleFile(file) {
        if (!file.name.match(/\.xlsx?$/i)) {
            alert(t('alertUploadXlsx'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: 'array' });
                const ballots = parseExcelData(workbook);

                if (ballots.length === 0) {
                    alert(t('alertNoValidBallots'));
                    return;
                }

                const status = $('#upload-status');
                status.classList.remove('hidden');
                status.textContent = t('uploadFound', { n: ballots.length });

                setTimeout(() => {
                    runCount(ballots);
                }, 300);
            } catch (err) {
                alert(t('alertFileError') + err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // ── Run count & render results ──

    function runCount(ballots) {
        const rcvResult = countRCV(ballots);
        const fptpResult = countFPTP(ballots);

        const allCandidates = [...new Set(ballots.flat().filter(c => c))];
        currentColors = getCandidateColors(allCandidates);
        currentResult = { rcv: rcvResult, fptp: fptpResult, colors: currentColors };

        revealedRound = 0;
        showResults();
        renderNextRound();
    }

    function showResults() {
        $('#results').classList.remove('hidden');
        $('#rounds-container').innerHTML = '';
        $('#fptp-comparison').classList.add('hidden');
        $('#sankey-container').classList.remove('hidden');
        $('#winner-banner').classList.add('hidden');
        $('#btn-next-round').classList.add('hidden');
    }

    function hideResults() {
        $('#results').classList.add('hidden');
    }

    function renderNextRound() {
        const { rcv, fptp, colors } = currentResult;
        const rounds = rcv.rounds;
        const container = $('#rounds-container');

        if (revealedRound < rounds.length) {
            const round = rounds[revealedRound];
            const card = buildRoundCard(revealedRound, round, rounds.length, colors);
            container.appendChild(card);

            updateSankey(rcv, colors, revealedRound);

            if (revealedRound < rounds.length - 1) {
                $('#btn-next-round').classList.remove('hidden');
            } else {
                $('#btn-next-round').classList.add('hidden');
                showFPTPComparison(fptp, rcv, colors);
                showWinner(rcv, fptp);
            }

            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function buildRoundCard(index, round, totalRounds, colors) {
        const card = document.createElement('div');
        card.className = 'round-card';

        const title = round.eliminated
            ? t('roundOf', { current: index + 1, total: totalRounds })
            : t('finalCount');
        card.innerHTML = `<h4>${title}</h4>`;

        const table = document.createElement('table');
        table.className = 'round-table';

        const thead = document.createElement('thead');
        thead.innerHTML = `<tr><th>${t('thOption')}</th><th>${t('thVotes')}</th><th></th></tr>`;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const sorted = Object.entries(round.voteCounts).sort((a, b) => b[1] - a[1]);

        for (const [candidate, votes] of sorted) {
            const tr = document.createElement('tr');
            const isEliminated = candidate === round.eliminated;
            if (isEliminated) tr.className = 'eliminated';

            const color = colors[candidate] || '#bab0ac';
            tr.innerHTML = `
                <td><span class="color-dot" style="background:${color}"></span>${candidate}</td>
                <td>${votes}</td>
                <td>${isEliminated ? t('knockedOut') : ''}</td>
            `;
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        card.appendChild(table);

        if (round.eliminated && round.transfers) {
            const info = document.createElement('div');
            info.className = 'transfer-info';

            const parts = [];
            for (const [target, count] of Object.entries(round.transfers)) {
                if (count <= 0) continue;
                if (target === 'noMoreChoices') {
                    parts.push(t('noMoreChoices', { n: count }));
                } else {
                    parts.push(t('transferTo', { n: count, target }));
                }
            }
            info.innerHTML = `<strong>${t('votesMove')}</strong> ${parts.join(', ')}`;
            card.appendChild(info);
        }

        return card;
    }

    function showFPTPComparison(fptp, rcv, colors) {
        const panel = $('#fptp-comparison');
        const content = $('#fptp-content');
        content.innerHTML = '';

        const sorted = Object.entries(fptp.voteCounts).sort((a, b) => b[1] - a[1]);
        for (const [candidate, votes] of sorted) {
            const row = document.createElement('div');
            row.className = 'fptp-row';
            const color = colors[candidate] || '#bab0ac';
            const marker = candidate === fptp.winner ? ` ${t('wouldWin')}` : '';
            const voteWord = votes !== 1 ? t('votePlural') : t('voteSingular');
            row.innerHTML = `
                <span><span class="color-dot" style="background:${color}"></span>${candidate}</span>
                <span>${votes} ${voteWord}${marker}</span>
            `;
            content.appendChild(row);
        }

        const note = document.createElement('div');
        note.className = 'fptp-winner-note';
        if (fptp.winner !== rcv.winner) {
            note.textContent = t('fptpDifferent', { fptp: fptp.winner, rcv: rcv.winner });
        } else {
            note.style.color = '#2e7d32';
            note.textContent = t('fptpSame', { winner: rcv.winner });
        }
        content.appendChild(note);

        panel.classList.remove('hidden');
    }

    function updateSankey(rcv, colors, maxRound) {
        renderSankey($('#sankey-chart'), rcv, colors, maxRound);
    }

    function showWinner(rcv, fptp) {
        const banner = $('#winner-banner');
        const text = banner.querySelector('.winner-text');
        text.textContent = t('winnerText', { name: rcv.winner });
        banner.classList.remove('hidden');
        spawnConfetti();
    }

    function spawnConfetti() {
        const container = $('#confetti-container');
        container.innerHTML = '';
        const colors = ['#1a7a6d', '#e8604c', '#f28e2b', '#4e79a7', '#76b7b2', '#edc948', '#59a14f'];
        for (let i = 0; i < 40; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.top = Math.random() * 30 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 0.8 + 's';
            piece.style.width = (4 + Math.random() * 6) + 'px';
            piece.style.height = (4 + Math.random() * 6) + 'px';
            if (Math.random() > 0.5) piece.style.borderRadius = '50%';
            container.appendChild(piece);
        }
    }

})();
