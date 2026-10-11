/**
 * Two threads, one shared memory, and whoever schedules them.
 *
 * ## The model
 *
 * Each thread runs the same short program, one instruction at a time, and
 * keeps one private register, `r`. Memory is shared. Between any two
 * instructions the scheduler may hand the processor to the other thread, and
 * that choice — not the program — is what this lab puts in the visitor's
 * hands.
 *
 * Instructions are indivisible: once one starts, it finishes before the other
 * thread moves. That is the whole point of splitting `counter++` into a load,
 * an add and a store, as a compiler does: each of those is indivisible on its
 * own, and the gaps between them are where a race lives.
 *
 * ## Why a simulation is enough here
 *
 * A race condition is a property of the *order* of operations, nothing else.
 * Given an order, the outcome follows exactly, and for two threads of a few
 * steps every order can be listed (`enumerate`). Nothing is approximated in
 * that part. The one modelling choice is in `counterRun`, where the scheduler
 * switches threads at random, and its docs say so.
 *
 * Everything here is pure; nothing imports React.
 */

export type Thread = 0 | 1;
export const THREADS: readonly Thread[] = [0, 1];

export type Instruction =
  /** r = memory[v] */
  | { readonly op: "load"; readonly v: string }
  /** r = r + n */
  | { readonly op: "add"; readonly n: number }
  /** memory[v] = r */
  | { readonly op: "store"; readonly v: string }
  /** Wait until the lock is free, then take it. */
  | { readonly op: "lock" }
  /** Give the lock back. */
  | { readonly op: "unlock" }
  /** memory[v] += n, as one indivisible step. */
  | { readonly op: "atomicAdd"; readonly v: string; readonly n: number }
  /** if (memory[v] >= atLeast) go on, else jump to `skipTo`. */
  | { readonly op: "check"; readonly v: string; readonly atLeast: number; readonly skipTo: number }
  /** balance -= amount and paid += amount, as one indivisible step. */
  | { readonly op: "withdraw"; readonly amount: number };

export interface Line {
  readonly instruction: Instruction;
  /** The line as it is drawn: language-neutral code. */
  readonly code: string;
  /** Indentation, in levels, for drawing. */
  readonly indent?: number;
}

export interface Program {
  readonly lines: readonly Line[];
  readonly memory: Readonly<Record<string, number>>;
}

export interface State {
  /** The next line each thread will run; `lines.length` when it is done. */
  readonly pc: readonly [number, number];
  /** Each thread's private register. */
  readonly reg: readonly [number, number];
  readonly memory: Readonly<Record<string, number>>;
  /** Which thread holds the lock, if any. */
  readonly holder: Thread | null;
  /** The threads in the order they were run, one entry per step. */
  readonly order: readonly Thread[];
}

/** What one step did, for narration. */
export interface Event {
  readonly thread: Thread;
  readonly line: number;
  readonly instruction: Instruction;
  /** The value read from memory, if the step read one. */
  readonly read?: number;
  /** The value written to memory, or to the register for an add. */
  readonly wrote?: number;
  /** For a check: whether it passed. */
  readonly passed?: boolean;
}

export function initial(program: Program): State {
  return { pc: [0, 0], reg: [0, 0], memory: { ...program.memory }, holder: null, order: [] };
}

export const isDone = (program: Program, state: State, t: Thread): boolean =>
  state.pc[t] >= program.lines.length;

/** Waiting at a lock someone else holds. */
export function isBlocked(program: Program, state: State, t: Thread): boolean {
  const line = program.lines[state.pc[t]];
  return line?.instruction.op === "lock" && state.holder !== null && state.holder !== t;
}

export const canRun = (program: Program, state: State, t: Thread): boolean =>
  !isDone(program, state, t) && !isBlocked(program, state, t);

export const isFinished = (program: Program, state: State): boolean =>
  THREADS.every((t) => isDone(program, state, t));

const set = <T>(pair: readonly [T, T], t: Thread, value: T): [T, T] =>
  t === 0 ? [value, pair[1]] : [pair[0], value];

/** Run thread `t`'s next instruction. Throws if it cannot run. */
export function step(program: Program, state: State, t: Thread): { state: State; event: Event } {
  if (!canRun(program, state, t)) throw new Error(`Thread ${t} cannot run now.`);
  const at = state.pc[t];
  const { instruction } = program.lines[at]!;
  const memory = { ...state.memory };
  let reg = state.reg;
  let holder = state.holder;
  let next = at + 1;
  let event: Event = { thread: t, line: at, instruction };

  switch (instruction.op) {
    case "load": {
      const value = memory[instruction.v] ?? 0;
      reg = set(reg, t, value);
      event = { ...event, read: value };
      break;
    }
    case "add": {
      const value = reg[t] + instruction.n;
      reg = set(reg, t, value);
      event = { ...event, wrote: value };
      break;
    }
    case "store": {
      memory[instruction.v] = reg[t];
      event = { ...event, wrote: reg[t] };
      break;
    }
    case "lock":
      holder = t;
      break;
    case "unlock":
      holder = null;
      break;
    case "atomicAdd": {
      const before = memory[instruction.v] ?? 0;
      memory[instruction.v] = before + instruction.n;
      event = { ...event, read: before, wrote: before + instruction.n };
      break;
    }
    case "check": {
      const value = memory[instruction.v] ?? 0;
      const passed = value >= instruction.atLeast;
      if (!passed) next = instruction.skipTo;
      event = { ...event, read: value, passed };
      break;
    }
    case "withdraw": {
      const before = memory.balance ?? 0;
      memory.balance = before - instruction.amount;
      memory.paid = (memory.paid ?? 0) + instruction.amount;
      event = { ...event, read: before, wrote: before - instruction.amount };
      break;
    }
  }

  return {
    state: { pc: set(state.pc, t, next), reg, memory, holder, order: [...state.order, t] },
    event,
  };
}

/** Every state along an order, starting from the initial one. */
export function replay(
  program: Program,
  order: readonly Thread[],
): { states: State[]; events: Event[] } {
  const states = [initial(program)];
  const events: Event[] = [];
  for (const t of order) {
    const { state, event } = step(program, states[states.length - 1]!, t);
    states.push(state);
    events.push(event);
  }
  return { states, events };
}

export interface Outcome {
  readonly order: readonly Thread[];
  readonly memory: Readonly<Record<string, number>>;
}

/**
 * Every order the scheduler could choose, run to the end. With one lock and
 * two threads nothing can deadlock, so every branch finishes.
 */
export function enumerate(program: Program): Outcome[] {
  const out: Outcome[] = [];
  const walk = (state: State) => {
    if (isFinished(program, state)) {
      out.push({ order: state.order, memory: state.memory });
      return;
    }
    for (const t of THREADS) if (canRun(program, state, t)) walk(step(program, state, t).state);
  };
  walk(initial(program));
  return out;
}

// ----------------------------------------------------------- programs ----

const load = (v: string): Line => ({ instruction: { op: "load", v }, code: `r = ${v}` });

/** `counter++`, as the three steps a processor actually takes. */
export const COUNTER: Program = {
  memory: { counter: 0 },
  lines: [
    load("counter"),
    { instruction: { op: "add", n: 1 }, code: "r = r + 1" },
    { instruction: { op: "store", v: "counter" }, code: "counter = r" },
  ],
};

/** The same three steps, inside a lock. */
export const LOCKED_COUNTER: Program = {
  memory: { counter: 0 },
  lines: [
    { instruction: { op: "lock" }, code: "lock(m)" },
    ...COUNTER.lines.map((l) => ({ ...l, indent: 1 })),
    { instruction: { op: "unlock" }, code: "unlock(m)" },
  ],
};

/** The processor's own indivisible read-add-write. */
export const ATOMIC_COUNTER: Program = {
  memory: { counter: 0 },
  lines: [{ instruction: { op: "atomicAdd", v: "counter", n: 1 }, code: "atomic_add(counter, 1)" }],
};

/** Two cash machines, one account holding exactly one withdrawal. */
export const ATM: Program = {
  memory: { balance: 100, paid: 0 },
  lines: [
    {
      instruction: { op: "check", v: "balance", atLeast: 100, skipTo: 2 },
      code: "if (balance >= 100)",
    },
    { instruction: { op: "withdraw", amount: 100 }, code: "withdraw(100)", indent: 1 },
  ],
};

/** The check and the withdrawal, inside one lock. */
export const LOCKED_ATM: Program = {
  memory: { balance: 100, paid: 0 },
  lines: [
    { instruction: { op: "lock" }, code: "lock(m)" },
    {
      instruction: { op: "check", v: "balance", atLeast: 100, skipTo: 3 },
      code: "if (balance >= 100)",
      indent: 1,
    },
    { instruction: { op: "withdraw", amount: 100 }, code: "withdraw(100)", indent: 2 },
    { instruction: { op: "unlock" }, code: "unlock(m)" },
  ],
};

// --------------------------------------------------------- at scale ----

/**
 * Two threads each run `counter++` `increments` times, under a scheduler
 * that, after every instruction, switches to the other thread with
 * probability `1 / meanSlice` — so a thread runs on average `meanSlice`
 * instructions before it is interrupted. Returns the final counter; anything
 * short of `2 × increments` is lost updates.
 *
 * That memoryless scheduler is the model's one simplification: a real
 * operating system switches on a timer, and two cores run truly at once. What
 * carries over is the variable that matters, how finely the two threads'
 * steps interleave.
 *
 * Runs a slice at a time rather than an instruction at a time: inside a slice
 * nothing else touches memory, so whole increments inside it are simply
 * counted. That keeps a hundred thousand increments cheap without changing a
 * single outcome.
 */
export function counterRun(increments: number, meanSlice: number, rng: () => number): number {
  let counter = 0;
  // Per thread: increments still to finish, the step within the current one
  // (0 load, 1 add, 2 store), and the register.
  const left: [number, number] = [increments, increments];
  const pc: [number, number] = [0, 0];
  const reg: [number, number] = [0, 0];
  const p = 1 / meanSlice;
  const logStay = Math.log(1 - p);
  const slice = () => (p >= 1 ? 1 : 1 + Math.floor(Math.log(1 - rng()) / logStay));

  let t: Thread = rng() < 0.5 ? 0 : 1;
  while (left[0] > 0 || left[1] > 0) {
    if (left[t] === 0) t = t === 0 ? 1 : 0;
    let budget = slice();
    while (budget > 0 && left[t] > 0) {
      if (pc[t] === 0 && budget >= 3) {
        // Whole increments, uninterrupted: each one lands.
        const whole = Math.min(left[t], Math.floor(budget / 3));
        counter += whole;
        left[t] -= whole;
        budget -= 3 * whole;
        continue;
      }
      if (pc[t] === 0) {
        reg[t] = counter;
        pc[t] = 1;
      } else if (pc[t] === 1) {
        reg[t] += 1;
        pc[t] = 2;
      } else {
        counter = reg[t];
        pc[t] = 0;
        left[t] -= 1;
      }
      budget--;
    }
    t = t === 0 ? 1 : 0;
  }
  return counter;
}
