/**
 * Simpson's paradox, on real numbers.
 *
 * Pure TypeScript, no randomness: this one is arithmetic, and the whole point
 * is that every percentage on screen is a quotient of two counts the visitor
 * can also see.
 *
 * ## Where the numbers come from
 *
 * The per-group success rates are those of Charig et al. (1986), a comparison
 * of two kidney-stone treatments that is the standard worked example of this
 * effect. Treatment A does better than B on small stones *and* on large
 * stones, and worse overall — because A was given mostly to the hard cases and
 * B mostly to the easy ones.
 *
 * What the visitor changes is that allocation, not the rates. Each treatment
 * has a fixed number of patients and one slider deciding how many of them were
 * small-stone cases; successes are then that group's rate applied to the
 * trials and rounded to a whole patient, and every rate the lab prints is
 * recomputed from the rounded counts. So the displayed group rates drift by a
 * fraction of a point from the nominal ones at some allocations, and that is
 * correct: they are the rates of the counts actually shown.
 *
 * At the default allocation the counts reproduce the published table exactly.
 *
 * ## What this is not
 *
 * Not a trick, and not an error in either calculation. Both the group rates
 * and the overall rate are right; they answer different questions, and the
 * aggregate answers a question nobody asked unless the group sizes were
 * comparable. `simpson.test.ts` checks the reversal is genuine rather than a
 * rounding artefact.
 */

export type GroupId = "small" | "large";
export type TreatmentId = "a" | "b";

export const GROUPS: readonly GroupId[] = ["small", "large"];
export const TREATMENTS: readonly TreatmentId[] = ["a", "b"];

/**
 * Success rate per group and treatment, as the published fractions.
 *
 * Kept as exact quotients rather than rounded decimals so the default
 * allocation reproduces the source table to the patient.
 */
export const RATES: Readonly<Record<GroupId, Record<TreatmentId, number>>> = {
  small: { a: 81 / 87, b: 234 / 270 },
  large: { a: 192 / 263, b: 55 / 80 },
};

/** Patients per treatment. Both arms are the same size in the source table. */
export const TRIALS_PER_TREATMENT = 350;

/** The published allocation: A went mostly to large stones, B mostly to small. */
export const DEFAULT_SMALL_SHARE: Readonly<Record<TreatmentId, number>> = {
  a: 87,
  b: 270,
};

export interface Cell {
  readonly group: GroupId;
  readonly treatment: TreatmentId;
  readonly trials: number;
  readonly successes: number;
  /** `successes / trials`, or null when nobody was in this cell. */
  readonly rate: number | null;
}

export interface Totals {
  readonly trials: number;
  readonly successes: number;
  readonly rate: number | null;
}

export interface Table {
  /** How many of each treatment's patients were small-stone cases. */
  readonly smallShare: Readonly<Record<TreatmentId, number>>;
  readonly cells: readonly Cell[];
  /** Per treatment, summed across both groups. */
  readonly overall: Readonly<Record<TreatmentId, Totals>>;
  /** True when A leads in both groups but trails overall. */
  readonly reversed: boolean;
}

const rateOf = (successes: number, trials: number): number | null =>
  trials === 0 ? null : successes / trials;

export const cellOf = (table: Table, group: GroupId, treatment: TreatmentId): Cell | undefined =>
  table.cells.find((cell) => cell.group === group && cell.treatment === treatment);

/**
 * Build the whole table from one allocation.
 *
 * `smallShare[t]` is how many of treatment `t`'s patients had small stones;
 * the rest had large. Successes are rounded to whole patients, and every rate
 * below — group and overall alike — is then computed from those counts and
 * nothing else.
 */
export function build(smallShare: Readonly<Record<TreatmentId, number>>): Table {
  const cells: Cell[] = [];

  for (const treatment of TREATMENTS) {
    const small = Math.max(0, Math.min(TRIALS_PER_TREATMENT, Math.round(smallShare[treatment])));
    const large = TRIALS_PER_TREATMENT - small;
    for (const [group, trials] of [
      ["small", small],
      ["large", large],
    ] as const) {
      const successes = Math.round(RATES[group][treatment] * trials);
      cells.push({ group, treatment, trials, successes, rate: rateOf(successes, trials) });
    }
  }

  const overall = {} as Record<TreatmentId, Totals>;
  for (const treatment of TREATMENTS) {
    const mine = cells.filter((cell) => cell.treatment === treatment);
    const trials = mine.reduce((sum, cell) => sum + cell.trials, 0);
    const successes = mine.reduce((sum, cell) => sum + cell.successes, 0);
    overall[treatment] = { trials, successes, rate: rateOf(successes, trials) };
  }

  const leadsIn = (group: GroupId): boolean => {
    const a = cellOf({ smallShare, cells, overall, reversed: false }, group, "a");
    const b = cellOf({ smallShare, cells, overall, reversed: false }, group, "b");
    return a?.rate !== null && b?.rate != null && (a?.rate ?? 0) > (b?.rate ?? 0);
  };

  const reversed = GROUPS.every(leadsIn) && (overall.a.rate ?? 0) < (overall.b.rate ?? 0);

  return { smallShare, cells, overall, reversed };
}

/** The published table, unchanged. */
export const published = (): Table => build(DEFAULT_SMALL_SHARE);
