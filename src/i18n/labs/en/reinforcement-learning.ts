/** English prose for the reinforcement-learning lab. Its shape is the contract `tr/reinforcement-learning.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    qLearning:
      "Supports the tabular Q-learning update rule and the conditions under which it converges. The grid, the rewards and the tile the visitor sets are the lab's own.",
  },

  room: {
    title: "The room",
    question:
      "Nobody showed this robot the way out. It worked the route out by trying things, and you get to decide what it cares about.",
    sliderLabel: "What is the marked square worth to the robot?",
    sliderValue: (value: string) => `The marked square is worth ${value}`,
    hint: "Drag it. The route is worked out again from scratch every time you move it.",
    wow: "You never told it to stop. You told it the square was worth more than the door.",
    behaviour: {
      avoided: "It walked the long way round to keep off the square, and reached the door.",
      passed: "It crossed the square on its way and reached the door.",
      stayed: "It never went to the door at all. It just stays by the square.",
    },
    readout: (steps: number, visits: number) =>
      `${steps} moves · stepped on the square ${visits} ${visits === 1 ? "time" : "times"}`,
    mapLabel: (behaviour: string, steps: number, visits: number, at: number) =>
      `A small room seen from above. ${behaviour} ${steps} moves in total, stepping on the marked square ${visits} times. The robot is at move ${at}.`,
  },

  learn: {
    kicker: "How did it work this out?",
    title: "It kept a number for every move it could make.",
    lede: "Nothing here is a picture of what the robot might have learned: it is what it did learn, at the moment you scrub to. Move the slider above and every number on this page is recomputed from a fresh run.",

    scrubber: "How much practice it has had",
    episode: (n: number) => `attempt ${n}`,
    scrubberValue: (episode: number, total: number) => `After attempt ${episode} of ${total}`,
    episodeLabel: "Attempts so far",

    mapLabel: (episode: number) =>
      `The room after ${episode} attempts. Each square shows how good the robot thinks it is, and the direction it would move from there.`,
    cellLabel: (row: number, col: number, value: string, action: string) =>
      `Row ${row}, column ${col}. Worth ${value}. It would move ${action}.`,
    wallCell: (row: number, col: number) => `Row ${row}, column ${col}. Wall.`,

    actions: { 0: "up", 1: "down", 2: "left", 3: "right" },
    noAction: "nowhere: this is the door",
    bestAction: "best",
    selectedTitle: (row: number, col: number) => `Row ${row}, column ${col}`,
    chain: (row: number, col: number, action: string, value: string) =>
      `Standing at row ${row}, column ${col}, the robot has four moves it could make and a number for each one. It keeps the largest (${value}, by moving ${action}) because that move led somewhere better the last time it tried. Repeat that a few hundred times and the numbers stop changing.`,

    unexploredLabel: "Squares its route skips",
    unexploredHint: "it stopped going there",

    propagation:
      "Scrub back to the very beginning. For the first dozen attempts nothing is worth anything: the robot is wandering, and every move it makes costs it a little. Then it stumbles into the door, one square near the door turns positive, and over the next handful of attempts that good news spreads outward across the room, one square at a time. That spread is the whole of the learning.",

    formulaTitle: "The rule it applies after every single move",
    formulaNote:
      "Read it as: nudge the number for the move you just made towards what you actually got, plus the best you now think is available from where you landed. α is how big a nudge, γ is how much a later reward is worth compared with one right now.",

    honesty:
      "The robot did not learn the whole room. It learned a route that works and stopped exploring the rest, so some squares still carry whatever it happened to think early on. That is not a fault in the method: it is what learning only from your own experience looks like.",

    scheduleWarning:
      "The saved attempts are evenly spaced, which hides the part where the learning happens.",
  },

  recap: {
    lessons: [
      "A reward is not an instruction. It is a score, and the robot will find whatever behaviour scores highest, including one you never had in mind.",
      "It learns by trying: each move updates a number, and the useful numbers spread outward from the first thing that ever went well.",
      "It optimises the reward you actually wrote down, not the outcome you were picturing when you wrote it.",
    ],
    footer:
      "This is real tabular Q-learning on a small deterministic grid: twenty-seven squares, four moves, one number per pair. Real robots and large reinforcement-learning systems are far more complicated, but the gap between what you rewarded and what you wanted does not get smaller as they grow.",
  },
  world: {
    title: "The room",
    question: "What should the agent do?",
    sliderHint:
      "This is the only thing about the world you get to decide. Everything else (the walls, the door, the cost of a move) is fixed.",
    caption:
      "Nothing is learning yet. You are driving. Every move costs 0.5, the marked square pays what you set it to each time it is entered, and the door pays 20 and ends the run.",
    mapLabel: (moves: number, total: string) =>
      `A small room seen from above, with walls, a marked square and a door. The agent has made ${moves} moves for a total of ${total}.`,
    padLabel: "Move the agent",
    padHint: "Or use the arrow keys.",
    arrived: "You reached the door. That ends the run.",
    restart: "Back to the start",
    ledgerTitle: "What each move paid",
    ledgerEmpty: "Make a move. What it costs, and why, will appear here.",
    consequence: {
      floor: "moved one square",
      wall: "walked into a wall and stayed put",
      square: "stepped onto the marked square",
      door: "reached the door",
    },
    rewardKind: { step: "move", tile: "square", goal: "door" },
    movesLabel: "Moves",
    totalLabel: "Collected",
    totalHint: "sum of every move",
    squareLabel: "Marked square",
    squareHint: "each time it is entered",
    rulesLabel: "What each move would pay from here",
    previewHint: "The agent cannot see this table. It only finds out by moving.",
    moveAnnounce: (action: string, paid: string, total: string) =>
      `Moved ${action}. That paid ${paid}. Total ${total}.`,
  },

  train: {
    kicker: "Nobody showed it the way",
    title: "It tries, and the trying is the training.",
    lede: "Press Run. The agent starts from the corner knowing nothing, wanders, and eventually falls through the door by accident. From then on it has something to go on. Every arrow, every number and every point on the curve below is that run, not a recording of one.",
    caption:
      "One press of Step is one action: choose, move, collect the reward, update one number. Run does the same thing repeatedly, an episode at a time.",
    runLabel: "Train",
    oneEpisode: "One episode",
    speedLabel: "Episodes per second",
    mapLabel: (episode: number, total: number) =>
      `The room during episode ${episode} of ${total}. The arrows are the action the policy would take in each square, and the trail is the route of the episode in progress.`,
    curveTitle: "Reward per episode",
    curveEmpty: "Run an episode or two and the curve starts here.",
    curveLabel: (episodes: number, first: string, last: string) =>
      `Reward collected in each of ${episodes} episodes, smoothed. It starts near ${first} and is near ${last} by the end.`,
    episodeShort: (n: number) => `ep ${n}`,
    lastEpisode: (episode: number, steps: number, reward: string, outcome: string) =>
      `Episode ${episode}: ${steps} moves, ${reward} collected, ${outcome}.`,
    notStarted: "Nothing has happened yet. Press Step or Train.",
    outcome: { reached: "reached the door", ranOut: "ran out of moves" },
    episodeLabel: "Episode",
    ofTotal: (total: number) => `of ${total}`,
    successLabel: "Reached the door",
    successHint: (n: number) => `last ${n} episodes`,
    stepsLabel: "Moves last episode",
    rewardLabel: "Reward last episode",
    announce: (episode: number, reward: string) =>
      `Episode ${episode}. ${reward} collected so far.`,
    announceDone: (total: number) => `Training finished after ${total} episodes.`,
  },

  policy: {
    kicker: "What it built while doing that",
    title: "A number for every move, and a route that falls out of them.",
    lede: "The agent never stored a route. It stored one number per square per direction (how good that move turned out to be), and the route is simply what you get by always taking the largest. Left: before a single episode. Right: now.",
    caption:
      "An arrow is not a Q-value. It is the action with the largest Q-value in that square, which is what the word policy means. The four numbers it was chosen from are below.",
    beforeTitle: "Before training",
    beforeLabel:
      "The room before any training. Every number is zero, so every square points the same way, which is what knowing nothing looks like.",
    afterTitle: (episode: number) => `After ${episode} episodes`,
    afterLabel: (episode: number) =>
      `The room after ${episode} episodes. Each square shows the action the policy selects there and how good the best move from it is. Select a square to see all four of its numbers.`,
    pickLabel: "Inspect a square",
    pickHint: "Click a square, or move with the arrow keys.",
    selects: (row: number, col: number, action: string, value: string) =>
      `At row ${row}, column ${col} the four moves have four numbers. The policy selects ${action}, because ${value} is the largest of them.`,
    episodeLabel: "Episodes run",
    routeLabel: "Route length",
    routeHint: "moves, no exploration",
    routeNone: "it does not reach the door",
    valueLabel: "Best value here",
    valueHint: "largest of the four",
  },

  update: {
    kicker: "Why did it learn that?",
    title: "One number moved. Here is the whole reason.",
    lede: "After every single move the agent changes exactly one number: the one for the move it just made. Everything below is the most recent update from the run above: the numbers it held, what the world paid, and what it holds now.",
    caption:
      "Nothing on this page is an example. If no move has been made, nothing is shown, because an update that did not happen is not worth looking at.",
    nothingYet: "No move has been made yet. Press Step, above or here.",
    stepLabel: "Take one action",
    stepHint: "Each press moves the agent once and updates one number.",
    whatHappened: "What just happened",
    sentence: (
      row: number,
      col: number,
      action: string,
      choice: string,
      landed: string,
      reward: string,
    ) =>
      `From row ${row}, column ${col} it moved ${action}: ${choice}. It ${landed}, and the world paid ${reward}.`,
    choice: {
      explored: "a random move, not its current best",
      exploited: "its current best move",
    },
    landed: {
      wall: "hit a wall and stayed where it was",
      moved: (row: number, col: number) => `landed on row ${row}, column ${col}`,
    },
    panels: {
      belief: "What it believed",
      beliefBody: "What it thought that move was worth, before this.",
      evidence: "What it just found out",
      evidenceBody:
        "The reward it collected, plus the best it now thinks is available from where it landed.",
      updated: "What it believes now",
      updatedBody: "The old number moved part of the way towards the new evidence.",
    },
    formulaTitle: "The rule, once per move",
    tableCaption: "Every term of the update, with the value it had for this move.",
    terms: {
      before: "Q(s,a) before",
      reward: "r: collected",
      bootstrap: "γ · max Q(s′,a′): best from where it landed",
      target: "r + γ · max Q(s′,a′): what it aims at",
      error: "the gap it is closing",
      after: "Q(s,a) after",
    },
    errorLabel: "Surprise",
    errorHint: "how wrong it was",
    movedLabel: "The number moved",
    movedHint: "by α times the surprise",
    epsilonLabel: "Exploration rate",
  },

  rules: {
    kicker: "Change the rules",
    title: "Three dials, and what each one actually changes.",
    lede: "Move any of these and the run restarts from episode one, because there is no such thing as changing the learning rate halfway through. Then press Train in the section above and watch the curve.",
    caption:
      "This room is small. Sweeping all three showed the agent solves it from almost any setting: what these change is how fast the curve settles, how noisy it is on the way, and whether it settles at all.",
    curveTitle: "Reward per episode, this run",
    curveEmpty: "Press Train above to fill this in.",
    curveHint: "Smoothed over ten episodes. Every point is an episode that ran.",
    curveLabel: (episodes: number, last: string, settled: string) =>
      `Reward per episode over ${episodes} episodes, ending near ${last}. Settled at episode ${settled}.`,
    alpha: {
      label: "Learning rate α",
      valueText: (value: string) => `Learning rate ${value}`,
      what: "How much a single new experience moves the number. High learns fast and forgets fast.",
    },
    gamma: {
      label: "Discount γ",
      valueText: (value: string) => `Discount ${value}`,
      what: "How much a reward further ahead counts compared with one right now.",
    },
    epsilon: {
      label: "Exploration ε",
      valueText: (value: string) => `Exploration ${value}`,
      what: "How often it explores at random instead of exploiting its current best. That trade has a name: exploration against exploitation. Decays across the run.",
    },
    restore: "Back to the defaults",
    settledLabel: "Settled at episode",
    settledHint: "first of twenty in a row that all finished",
    notSettled: "never",
    successLabel: "Reached the door",
    successHint: "last 50 episodes",
    stepsLabel: "Moves per episode",
    stepsHint: "mean of the last 50",
    scopeLabel: "What this does not show",
    scope:
      "These three are the parameters of tabular Q-learning on a 27-square deterministic grid. They are not settings that a larger reinforcement-learning system would have in the same form, and the effect any of them has here says nothing about the size of its effect elsewhere.",
  },

  challenge: {
    kicker: "Now you set the reward",
    title: "Can you make it learn this?",
    lede: "Three tasks. In each one the agent is doing something you did not ask for, and one number is yours to change. None of them can be passed by putting a slider anywhere in particular: the agent has to actually do the thing.",
    puzzleLabel: "Task",
    levers: {
      tileReward: "What the marked square pays",
      epsilon: "Exploration ε, held constant",
    },
    leverValue: (name: string, value: string) => `${name}: ${value}`,
    leverHint: {
      tileReward: "Retrains from scratch on every change.",
      epsilon: "Held at this value for the whole run, with no decay.",
    },
    puzzles: {
      cross: {
        title: "Walk over it",
        brief:
          "The square is worth −3, so the agent takes the two extra moves to walk around it. Make it walk over the square on its way to the door instead, without making it stop there.",
        lesson:
          "There is a band, not a threshold. The square has to be worth more than the detour it saves and less than the door it would replace.",
      },
      camp: {
        title: "Make it give up on the door",
        brief:
          "The square is worth nothing, so the agent crosses it and carries on. Make it stop going to the door at all. You are not allowed to move the door or the walls: only what the square pays.",
        lesson:
          "You never told it to stop. You told it the square was worth more than finishing, and it believed you. This is the whole lab in one slider.",
      },
      settle: {
        title: "It never settles",
        brief:
          "Exploration is pinned at 0.9 for the entire run: nine moves in ten are random. The final table is fine, but the agent almost never finishes an episode. Make it reach the door reliably.",
        lesson:
          "Exploration is what finds the route, and then it is what stops you using it. This run never stops throwing the route away.",
      },
    },
    behaviour: {
      avoided: "it walks around the square and reaches the door",
      passed: "it crosses the square on the way and reaches the door",
      stayed: "it never reaches the door: it stays by the square",
    },
    behaviourShort: { avoided: "walks around", passed: "walks over", stayed: "stays put" },
    behaviourLabel: "What it does",
    stepsLabel: "Route length",
    successLabel: "Episodes finished",
    successHint: "last 50 of the run",
    verdict: {
      solved: "That is it. The agent does what the task asked.",
      untouched: "Move the slider and the agent retrains from scratch.",
      notYet: (behaviour: string) => `Not yet: ${behaviour}.`,
    },
    mapLabel: (behaviour: string, steps: number) =>
      `The room after training with these settings: ${behaviour} in ${steps} moves.`,
    announceSolved: (title: string) => `Solved: ${title}.`,
    announceAttempt: (behaviour: string) => `After retraining, ${behaviour}.`,
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "An agent in a small room, and a reward you set. First you drive it yourself; later it learns on its own.",
    stages: {
      world: {
        room: "The room from above: the agent, the walls, a marked square and the door. The door pays 20 and ends the run.",
        move: "Move it with these arrows, or the arrow keys. Every move costs 0.5.",
        reward:
          "This slider sets what the marked square pays. It is the one thing about the world you decide.",
      },
      train: {
        map: "The agent starts in the corner knowing nothing. The curve below the map is its reward per episode.",
        run: "Run the training: it wanders, falls through the door by accident, and from then on has something to go on.",
        figures:
          "Episodes run, how often it reached the door, and the steps and reward of the last one.",
      },
      policy: {
        maps: "Left, before any episode; right, after training. Each arrow is the move with the biggest number.",
        pick: "Pick a square on the map to see its four numbers.",
        route: "The route is just what you get by always taking the largest number.",
      },
      update: {
        step: "Take one action: the agent moves once and changes exactly one number. The tour took one.",
        update:
          "The number it held, what the world paid, the best guess about what comes next, and the new number.",
        error: "The error, how far the number moved, and how often it explores at random.",
      },
      rules: {
        chart: "How the run behaves with these settings.",
        epsilon:
          "Three dials: learning rate, discount and exploration. The tour raised exploration; the run starts over.",
        restore: "This puts the original settings back.",
        figures: "When it settled, how often it succeeds, and how many steps it takes.",
      },
      challenge: {
        map: "In each task the agent does something you did not ask for. Pick the task above.",
        lever: "One number is yours to change. The run starts again every time you move it.",
        result: "What the agent now does, and whether it does what the task asks.",
      },
    },
  },
};

export default copy;
