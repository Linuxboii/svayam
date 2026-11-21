# Svayam · स्वयम्

**Sentences that correctly count their own letters.**
Live: **https://svayam.avlokai.com**

> This sentence contains three a's, one b, three c's, two d's, thirty-one e's, five f's, two g's, six h's,
> eleven i's, one j, one k, two l's, one m, twenty-one n's, sixteen o's, one p, one q, five r's,
> twenty-seven s's, twenty t's, two u's, six v's, eight w's, four x's, five y's and one z.

Count any letter. It is right. A sentence like this is an **autogram**, and finding one is a search, not a
calculation: every number you write down changes the very counts you were writing about. Give Svayam any
opening words and a Web Worker hunts for the self-describing sentence that follows them.

---

## What it does

- Takes any opening ("This sentence contains", "Sushanth wrote a sentence with", …) and searches for an
  autogram, optionally listing all 26 letters (a self-enumerating pangram).
- Shows the closest miss live while it searches: wrong number words are underlined in red, and a 26-cell
  table shows claimed versus actual counts.
- Reports candidates tried, speed (typically around a million per second on a laptop), restarts and elapsed
  time.
- Every hit is **recounted independently on the page** before it is shown as true.
- Keeps the autograms you find in your browser and shows them under "Found here", next to a few found while
  building the page (each one re-verified on load).

## The mathematics

Fix an opening P. A candidate is a vector v of 26 claimed counts. Writing it out as English
("… three a's, one b, … and one z.") and counting letters gives a second vector c(v). An autogram is a
**fixed point**: c(v) = v.

The obvious approach, v ← c(v), almost never converges: changing "twenty" to "thirty" changes the counts of
t, w, e, n, y, h, i and r all at once, and the iteration falls into cycles. Svayam uses a randomised
relaxation in the spirit of Lee Sallows' work on autograms:

1. Start from the counts implied by a random guess.
2. Each round, compute c(v). For each letter whose claim is wrong, with probability 0.3 move it to its true
   count, and a quarter of the time nudge it one off.
3. Track the L1 distance Σ|cᵢ − vᵢ|. If 400,000 rounds pass without improvement, restart from scratch.
4. Distance 0 means an autogram.

Letters that appear must be listed, and letters that are listed must appear, so the closing "and" and the
plural "'s" are part of the counting rules.

### Making a candidate cheap

The letter content of every number word from "zero" to "ninety-nine" is precomputed as a 26-vector. Counting
a candidate is then the opening's letters, plus "and", plus for each listed letter its number word's vector,
one for the letter itself and one extra *s* when plural. That is a few hundred integer additions with no
strings built, which is how the worker reaches about a million candidates a second.

## How it was built

- **The solver** lives in a `<script type="text/plain">` block in `index.html`. The page turns it into a
  Worker through a `Blob` URL, so the site stays a single file and the search never blocks the UI. Stopping
  a search terminates the worker outright, which lets the hot loop skip any polling.
- **The page** renders the best candidate as it improves, recounts it in the main thread, and colours each
  number word right or wrong. The recount uses completely separate code from the solver, so a solver bug
  cannot certify a wrong sentence.
- **Openings** offered as one-click ideas were each confirmed to resolve within seconds to tens of seconds.
  Some openings have no autogram at all, or hide it very well; after 45 seconds the page says so.
- Found sentences are stored in `localStorage` (wrapped in try/catch for private windows) and re-verified on
  every load.

## Verification

```bash
node test.cjs
```

The test extracts the solver from `index.html` (so it tests exactly what ships), checks the number-word
generator, then finds autograms for three openings and confirms each with an independent letter count.

## Run locally

```bash
python -m http.server 8000   # then http://localhost:8000
```

(Opening the file directly also works, apart from `localStorage` in some browsers.)

## Files

```
index.html   page, worker-hosted solver, independent verifier, library of found sentences
test.cjs     extracts the shipped solver and checks its hits
```

## Name

*Svayam* (स्वयम्) is Sanskrit for "oneself, by itself" — a sentence that describes nothing but itself.

---

Built by Sushanth Kasturi as one of a set of deliberately useless things. More at
https://sushanth.avlokai.com/projects
