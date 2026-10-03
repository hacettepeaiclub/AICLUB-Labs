/**
 * The challenge's three broken backward passes, and what counts as finding
 * the fault.
 *
 * Each case is a real graph from the page with one of the `Bug`s planted in
 * its backward pass. The visitor's only instrument is a gradient check —
 * the backward pass's answer for one parameter beside central differences —
 * and they win by naming the node where the backward pass goes wrong.
 */

import { LEDGER_PARAMS, ledgerGraph, network, type Bug, type Graph, type Params } from "./engine";

export type CaseId = "neuron" | "fork" | "sign";
export const CASES: readonly CaseId[] = ["neuron", "fork", "sign"];

export interface Case {
  readonly graph: Graph;
  readonly params: Params;
  readonly bug: Bug;
  /** The nodes the visitor may accuse, by index. */
  readonly suspects: readonly number[];
}

const NET = network(0.6, -0.4);
const NET_PARAMS: Params = {
  w11: 0.7,
  w12: -0.3,
  b1: 0.2,
  w21: 0.5,
  w22: 0.9,
  b2: -0.1,
  v1: 0.8,
  v2: -0.6,
  c: 0.1,
};
const named = (graph: Graph) =>
  graph.nodes.flatMap((n, i) => (n.name && n.op !== "param" && n.op !== "const" ? [i] : []));

const LEDGER = ledgerGraph();
const TURNED = ledgerGraph(1.5, 0.8, true);
const indexOf = (graph: Graph, name: string) => graph.nodes.findIndex((n) => n.name === name);

export function caseOf(id: CaseId): Case {
  switch (id) {
    case "neuron":
      return {
        graph: NET.graph,
        params: NET_PARAMS,
        bug: { kind: "tanh-as-value", node: NET.at.h2 },
        suspects: named(NET.graph),
      };
    case "fork":
      return {
        graph: LEDGER,
        params: LEDGER_PARAMS,
        bug: { kind: "overwrite", node: indexOf(LEDGER, "w") },
        suspects: [indexOf(LEDGER, "w"), ...named(LEDGER)],
      };
    case "sign":
      return {
        graph: TURNED,
        params: LEDGER_PARAMS,
        bug: { kind: "sub-sign", node: indexOf(TURNED, "y − h") },
        suspects: named(TURNED),
      };
  }
}

/** Where the fault is: the node the bug names. */
export const culprit = (c: Case): number => c.bug.node;
