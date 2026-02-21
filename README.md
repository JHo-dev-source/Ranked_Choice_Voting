# Ranked Choice Voting Demo

An interactive, bilingual (DE/EN) explainer for ranked choice voting (Präferenzwahl / Instant Runoff Voting). Pure frontend — no build step, no server.

## Features

- **Three modes**
  - *Try the example* — pre-loaded 15-ballot scenario, animated round-by-round reveal
  - *Custom ballot* — define your own candidates and cast ballots in the browser
  - *Upload ballots* — import an `.xlsx` file (see `sample_ballots.xlsx` for format)
- **Round-by-round visualisation** using Plotly bar charts
- **Language switcher** (DE / EN) — all UI text and example data translate live

## How It Works

Ballots are counted using the standard IRV algorithm:

1. Tally first-choice votes.
2. If a candidate holds > 50 % of active ballots, they win.
3. Otherwise eliminate the last-place candidate and redistribute their ballots to each voter's next ranked choice.
4. Repeat until a winner is found.

## Usage

Open `index.html` directly in a browser — no installation required.

Dependencies are loaded from CDN:
- [Plotly 2.35](https://plotly.com/javascript/) — charts
- [SheetJS](https://sheetjs.com/) — `.xlsx` parsing

## File Structure

```
index.html          Main page (markup + i18n strings)
css/style.css       Styles
js/app.js           UI controller + IRV algorithm
sample_ballots.xlsx Example upload file
```
