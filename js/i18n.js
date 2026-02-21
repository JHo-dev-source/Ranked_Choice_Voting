/**
 * i18n.js — Minimal translation system. German default, English option.
 */

const TRANSLATIONS = {
    de: {
        // Page
        title: "Präferenzwahl — So funktioniert's",
        intro: "Bei der Präferenzwahl wählst du nicht nur einen Favoriten — du ordnest die Optionen in der Reihenfolge, wie gut sie dir gefallen. Wenn keine Option mehr als die Hälfte der Stimmen bekommt, fliegt die am wenigsten beliebte raus und deren Stimmen gehen an die jeweils nächstbeste Wahl weiter. Das wiederholt sich, bis eine Option mehr als die Hälfte hat!",

        // Tabs
        tabExample: "Beispiel ausprobieren",
        tabCustom: "Eigene Abstimmung",
        tabUpload: "Stimmzettel hochladen",

        // Example tab
        exampleTitle: "Klassenfahrt-Abstimmung",
        exampleDesc: "Eine Klasse mit 15 Schülern hat abgestimmt, wohin die Klassenfahrt gehen soll. Jeder hat die Ziele nach Wunsch sortiert.",
        btnCountVotes: "Stimmen auszählen!",

        // Example options (translated for the demo)
        optThemePark: "Freizeitpark",
        optMuseum: "Museum",
        optBeach: "Strand",
        optHiking: "Wandern",

        // Custom voting: setup
        setupTitle: "Schritt 1: Optionen festlegen",
        setupDesc: "Worüber wird abgestimmt? Mindestens 2 Optionen hinzufügen.",
        optionPlaceholder: "Option",
        btnAddOption: "+ Option hinzufügen",
        btnStartVoting: "Abstimmung starten",
        btnRemoveTitle: "Entfernen",

        // Custom voting: voting
        votingTitle: "Schritt 2: Stimmen abgeben",
        votingDesc: 'Für jede Option eine Zahl eingeben, um die Reihenfolge festzulegen. <strong>1 = Lieblingsoption</strong>, 2 = zweite Wahl, usw. Leer lassen, wenn du eine Option nicht bewerten möchtest.',
        btnSubmitBallot: "Stimmzettel abgeben",
        ballotsCast: "{n} Stimmzettel abgegeben",
        showAllBallots: "Alle Stimmzettel anzeigen",
        btnBackSetup: "Zurück zu Schritt 1",

        // Upload tab
        uploadTitle: "Excel-Datei hochladen",
        uploadDesc: 'Eine <code>.xlsx</code>-Datei hochladen, in der jede Zeile ein Stimmzettel ist. Die Spalten sind Rang 1, Rang 2, Rang 3 usw. In den Zellen stehen die Namen der Optionen.',
        dropZoneText: "Datei hierher ziehen<br>oder",
        btnChooseFile: "Datei auswählen",
        uploadFound: "{n} Stimmzettel gefunden. Wird ausgezählt\u2026",

        // Results
        resultsTitle: "Ergebnisse",
        btnNextRound: "Nächste Runde →",
        sankeyTitle: "So haben sich die Stimmen bewegt",
        fptpTitle: "Was wäre, wenn nur die erste Wahl zählt?",
        btnStartOver: "Neu starten",

        // Round cards
        roundOf: "Runde {current} von {total}",
        finalCount: "Endergebnis",
        thOption: "Option",
        thVotes: "Stimmen",
        knockedOut: "Ausgeschieden!",
        votesMove: "Stimmen gehen an:",
        noMoreChoices: "{n} Stimmzettel ohne weitere Präferenz",
        transferTo: "{n} → {target}",

        // FPTP comparison
        wouldWin: "← Hätte gewonnen!",
        voteSingular: "Stimme",
        votePlural: "Stimmen",
        fptpDifferent: 'Bei einfacher Mehrheitswahl hätte „{fptp}" gewonnen. Aber bei der Präferenzwahl gewinnt „{rcv}", weil diese Option die breiteste Unterstützung unter allen Wählern hatte!',
        fptpSame: 'In diesem Fall gewinnt „{winner}" bei beiden Verfahren!',

        // Winner
        winnerText: "Sieger: {name}!",

        // Sankey
        sankeyNoElimination: "Keine Auszählungsrunden nötig — eine Option hat direkt gewonnen!",
        sankeyNoMoreChoices: "Keine weitere Präferenz",
        sankeyNodeHover: "%{label}: %{value} Stimmen",
        sankeyLinkHover: "%{source.label} → %{target.label}: %{value} Stimmen",

        // Alerts
        alertMin2Options: "Bitte mindestens 2 Optionen eingeben.",
        alertUniqueNames: "Die Optionsnamen müssen unterschiedlich sein.",
        alertInvalidRank: '„{candidate}" hat einen ungültigen Rang. Bitte Zahlen von 1 bis {max} verwenden oder leer lassen.',
        alertRankAtLeastOne: "Bitte mindestens eine Option bewerten.",
        alertDuplicateRank: "Jede Rangzahl darf nur einmal vergeben werden.",
        alertNoBallots: "Es wurden noch keine Stimmzettel abgegeben!",
        alertUploadXlsx: "Bitte eine .xlsx-Datei hochladen.",
        alertNoValidBallots: "Keine gültigen Stimmzettel in der Datei gefunden. Zeile 1 muss Überschriften enthalten, die folgenden Zeilen die Rangfolgen.",
        alertFileError: "Fehler beim Lesen der Datei: ",
    },

    en: {
        title: "Ranked Choice Voting — How It Works",
        intro: "In ranked choice voting, you don't just pick one favourite — you rank the options in order of preference. If no option gets more than half the votes, the least popular one is knocked out and those votes move to each voter's next choice. This repeats until someone has more than half!",

        tabExample: "Try the Example",
        tabCustom: "Create Your Own Vote",
        tabUpload: "Upload Ballots",

        exampleTitle: "School Trip Vote",
        exampleDesc: "A class of 15 students voted on where to go for their school trip. Each student ranked the options in order of preference.",
        btnCountVotes: "Count the Votes!",

        optThemePark: "Theme Park",
        optMuseum: "Museum",
        optBeach: "Beach",
        optHiking: "Hiking",

        setupTitle: "Step 1: Set up the options",
        setupDesc: "What are people voting on? Add at least 2 options.",
        optionPlaceholder: "Option",
        btnAddOption: "+ Add option",
        btnStartVoting: "Start Voting",
        btnRemoveTitle: "Remove",

        votingTitle: "Step 2: Cast your votes",
        votingDesc: 'For each option, type a number to show your ranking. <strong>1 = first choice</strong>, 2 = second choice, and so on. Leave blank if you don\'t want to rank an option.',
        btnSubmitBallot: "Submit Ballot",
        ballotsCast: "{n} ballot(s) cast",
        showAllBallots: "Show all ballots",
        btnBackSetup: "Back to Setup",

        uploadTitle: "Upload an Excel file",
        uploadDesc: 'Upload a <code>.xlsx</code> file where each row is one ballot. Columns should be Rank 1, Rank 2, Rank 3, etc. Cell values are the option names.',
        dropZoneText: "Drag & drop your file here<br>or",
        btnChooseFile: "Choose file",
        uploadFound: "Found {n} ballots. Counting...",

        resultsTitle: "Results",
        btnNextRound: "Next Round →",
        sankeyTitle: "How the votes moved",
        fptpTitle: "What if we just counted first choices?",
        btnStartOver: "Start Over",

        roundOf: "Round {current} of {total}",
        finalCount: "Final Count",
        thOption: "Option",
        thVotes: "Votes",
        knockedOut: "Knocked out!",
        votesMove: "Votes move:",
        noMoreChoices: "{n} ballot(s) had no more choices",
        transferTo: "{n} → {target}",

        wouldWin: "← Would win!",
        voteSingular: "vote",
        votePlural: "votes",
        fptpDifferent: 'With normal voting, "{fptp}" would win. But with ranked choice voting, "{rcv}" wins because they had the broadest support across all voters!',
        fptpSame: 'In this case, "{winner}" wins under both methods!',

        winnerText: "Winner: {name}!",

        sankeyNoElimination: "No eliminations needed — one option won outright!",
        sankeyNoMoreChoices: "No more choices",
        sankeyNodeHover: "%{label}: %{value} votes",
        sankeyLinkHover: "%{source.label} → %{target.label}: %{value} votes",

        alertMin2Options: "Please enter at least 2 options.",
        alertUniqueNames: "Option names must be unique.",
        alertInvalidRank: '"{candidate}" has an invalid rank. Use numbers from 1 to {max}, or leave blank.',
        alertRankAtLeastOne: "Please rank at least one option.",
        alertDuplicateRank: "Each rank number can only be used once.",
        alertNoBallots: "No ballots have been cast yet!",
        alertUploadXlsx: "Please upload an .xlsx file.",
        alertNoValidBallots: "No valid ballots found in the file. Make sure row 1 has headers and subsequent rows contain rankings.",
        alertFileError: "Error reading file: ",
    }
};

let currentLang = 'de';

/**
 * Get a translated string, with optional placeholder replacement.
 * @param {string} key - Translation key
 * @param {object} [params] - Placeholder values, e.g. { n: 5, name: "Alice" }
 * @returns {string}
 */
function t(key, params) {
    let str = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || key;
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            str = str.replaceAll(`{${k}}`, v);
        }
    }
    return str;
}

/**
 * Set the active language and update all static DOM elements with data-i18n attributes.
 * @param {string} lang - Language code ('de' or 'en')
 */
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const str = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = str;
        } else if (el.dataset.i18nAttr === 'title') {
            el.title = str;
        } else {
            el.innerHTML = str;
        }
    });

    // Update page title
    document.title = t('title');

    // Highlight active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}
