# Svayam · स्वयम्

Sentences that count themselves. Live at **https://svayam.avlokai.com**.

> This sentence contains three a's, one b, three c's, two d's, thirty-one e's, five f's, two g's, six h's, eleven i's,
> one j, one k, two l's, one m, twenty-one n's, sixteen o's, one p, one q, five r's, twenty-seven s's, twenty t's,
> two u's, six v's, eight w's, four x's, five y's and one z.

An autogram is a fixed point of "render these counts as English, then count the letters". Svayam searches for one
in a Web Worker: it moves a random subset of letters toward their true counts each round, occasionally nudges one
off by a step, and restarts when progress stalls. Letter totals for every number word are precomputed, so each
candidate costs a few hundred integer additions. Every hit is recounted independently before it is shown as true.

One file, no dependencies.
