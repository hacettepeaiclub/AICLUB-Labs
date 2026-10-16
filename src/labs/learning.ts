/**
 * The learning guide behind each lab's "Keep learning" button: videos,
 * lectures and readings, grouped under the lab's own main ideas.
 *
 * ## How this list was made
 *
 * Every entry was checked against the thing itself, not remembered. Each
 * video's title, channel and length were read from YouTube, and its address
 * confirmed through YouTube's own oEmbed endpoint; each book, course page and
 * article was opened at the address given here. Where a book's section
 * number could not be seen in its table of contents, none is given.
 *
 * What made the cut: a university's own lecture (MIT, Harvard, Stanford), a
 * field's standard textbook, or an educator the field itself teaches from
 * (3Blue1Brown, StatQuest, Andrew Ng's DeepLearning.AI, Computerphile,
 * Karpathy, Distill). What was left out, and why, is in docs/LEARNING-GUIDE.md:
 * among others, a convolution video that flips the kernel, which this lab does
 * not, and a SHA video built on SHA-1, which has since been broken.
 *
 * The words around each entry (why it is here, in the visitor's language)
 * live in the lab's copy, under `learn`. This file holds only what does not
 * change with the language.
 */

export type ResourceKind = "video" | "lecture" | "book" | "notes" | "article" | "interactive";

export interface LearningResource {
  readonly kind: ResourceKind;
  /** The title as the source itself gives it. */
  readonly title: string;
  /** Channel, author or institution. */
  readonly by: string;
  /** A video's running time, as YouTube shows it. */
  readonly length?: string;
  readonly year?: number;
  readonly url: string;
}

export const RESOURCES = {
  "3b1b-attention": {
    kind: "video",
    title: "Attention in transformers, step-by-step | Deep Learning Chapter 6",
    by: "3Blue1Brown",
    length: "26:10",
    url: "https://www.youtube.com/watch?v=eMlx5fFNoYc",
  },
  "sq-attention": {
    kind: "video",
    title: "Attention for Neural Networks, Clearly Explained!!!",
    by: "StatQuest with Josh Starmer",
    length: "15:51",
    url: "https://www.youtube.com/watch?v=PSs6nxngL6k",
  },
  "d2l-attention": {
    kind: "book",
    title: "Dive into Deep Learning: 11.3 Attention Scoring Functions",
    by: "Zhang, Lipton, Li, Smola",
    url: "https://d2l.ai/chapter_attention-mechanisms-and-transformers/attention-scoring-functions.html",
  },
  "sq-softmax": {
    kind: "video",
    title: "Neural Networks Part 5: ArgMax and SoftMax",
    by: "StatQuest with Josh Starmer",
    length: "14:03",
    url: "https://www.youtube.com/watch?v=KpKog-L9veg",
  },
  "3b1b-transformers": {
    kind: "video",
    title: "Transformers, the tech behind LLMs | Deep Learning Chapter 5",
    by: "3Blue1Brown",
    length: "27:14",
    url: "https://www.youtube.com/watch?v=wjZofJX0v4M",
  },
  "karpathy-gpt": {
    kind: "video",
    title: "Let's build GPT: from scratch, in code, spelled out.",
    by: "Andrej Karpathy",
    length: "1:56:20",
    url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
  },
  "alammar-transformer": {
    kind: "article",
    title: "The Illustrated Transformer",
    by: "Jay Alammar",
    year: 2018,
    url: "https://jalammar.github.io/illustrated-transformer/",
  },
  "3b1b-backprop": {
    kind: "video",
    title: "Backpropagation, intuitively | Deep Learning Chapter 3",
    by: "3Blue1Brown",
    length: "12:47",
    url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
  },
  "3b1b-backprop-calc": {
    kind: "video",
    title: "Backpropagation calculus | Deep Learning Chapter 4",
    by: "3Blue1Brown",
    length: "10:18",
    url: "https://www.youtube.com/watch?v=tIeHLnjs5U8",
  },
  "sq-chain": {
    kind: "video",
    title: "Backpropagation Details Pt. 2: Going bonkers with The Chain Rule",
    by: "StatQuest with Josh Starmer",
    length: "13:09",
    url: "https://www.youtube.com/watch?v=GKZoOHXGcLo",
  },
  "karpathy-micrograd": {
    kind: "video",
    title: "The spelled-out intro to neural networks and backpropagation: building micrograd",
    by: "Andrej Karpathy",
    length: "2:25:52",
    url: "https://www.youtube.com/watch?v=VMj-3S1tku0",
  },
  "sq-backprop": {
    kind: "video",
    title: "Neural Networks Pt. 2: Backpropagation Main Ideas",
    by: "StatQuest with Josh Starmer",
    length: "17:34",
    url: "https://www.youtube.com/watch?v=IN2XmBhILt4",
  },
  "cs231n-backprop": {
    kind: "notes",
    title: "Backpropagation, Intuitions",
    by: "Stanford CS231n",
    url: "https://cs231n.github.io/optimization-2/",
  },
  "ng-vanishing": {
    kind: "video",
    title: "Vanishing/Exploding Gradients (C2W1L10)",
    by: "DeepLearningAI (Andrew Ng)",
    length: "6:08",
    url: "https://www.youtube.com/watch?v=qhXZsFVxGKo",
  },
  "ng-gradcheck": {
    kind: "video",
    title: "Gradient Checking (C2W1L13)",
    by: "DeepLearningAI (Andrew Ng)",
    length: "6:35",
    url: "https://www.youtube.com/watch?v=QrzApibhohY",
  },
  "cp-caches-why": {
    kind: "video",
    title: "Why do CPUs Need Caches? - Computerphile",
    by: "Computerphile",
    length: "6:06",
    url: "https://www.youtube.com/watch?v=6JpLD3PUAZk",
  },
  "cp-caches-how": {
    kind: "video",
    title: "How CPU Memory & Caches Work - Computerphile",
    by: "Computerphile",
    length: "34:54",
    url: "https://www.youtube.com/watch?v=SAk-6gVkio0",
  },
  "mit-6172-l14": {
    kind: "lecture",
    title: "14. Caching and Cache-Efficient Algorithms (6.172, Fall 2018)",
    by: "MIT OpenCourseWare · Julian Shun",
    length: "1:18:23",
    url: "https://www.youtube.com/watch?v=xDKnMXtZKq8",
  },
  "drepper-memory": {
    kind: "article",
    title: "What Every Programmer Should Know About Memory",
    by: "Ulrich Drepper",
    year: 2007,
    url: "https://lwn.net/Articles/250967/",
  },
  "ng-edge": {
    kind: "video",
    title: "C4W1L02 Edge Detection Examples",
    by: "DeepLearningAI (Andrew Ng)",
    length: "11:31",
    url: "https://www.youtube.com/watch?v=XuD4C8vJzEQ",
  },
  "sq-cnn": {
    kind: "video",
    title: "Neural Networks Part 8: Image Classification with Convolutional Neural Networks (CNNs)",
    by: "StatQuest with Josh Starmer",
    length: "15:24",
    url: "https://www.youtube.com/watch?v=HGwBXDKFk9I",
  },
  "ng-why-conv": {
    kind: "video",
    title: "C4W1L11 Why Convolutions",
    by: "DeepLearningAI (Andrew Ng)",
    length: "9:41",
    url: "https://www.youtube.com/watch?v=ay3zYUeuyhU",
  },
  "cs231n-conv": {
    kind: "notes",
    title: "Convolutional Neural Networks: Architectures, Convolution / Pooling Layers",
    by: "Stanford CS231n",
    url: "https://cs231n.github.io/convolutional-networks/",
  },
  "ng-padding": {
    kind: "video",
    title: "C4W1L04 Padding",
    by: "DeepLearningAI (Andrew Ng)",
    length: "9:50",
    url: "https://www.youtube.com/watch?v=smHa2442Ah4",
  },
  "ng-stride": {
    kind: "video",
    title: "C4W1L05 Strided Convolutions",
    by: "DeepLearningAI (Andrew Ng)",
    length: "9:02",
    url: "https://www.youtube.com/watch?v=tQYZaDn_kSg",
  },
  "d2l-padding": {
    kind: "book",
    title: "Dive into Deep Learning: 7.3 Padding and Stride",
    by: "Zhang, Lipton, Li, Smola",
    url: "https://d2l.ai/chapter_convolutional-neural-networks/padding-and-strides.html",
  },
  "paar-hash": {
    kind: "lecture",
    title: "Lecture 20: Hash Functions",
    by: "Christof Paar (Introduction to Cryptography)",
    length: "1:05:04",
    url: "https://www.youtube.com/watch?v=tLkHk__-M6Q",
  },
  "mit-6046-hash": {
    kind: "lecture",
    title: "21. Cryptography: Hash Functions",
    by: "MIT OpenCourseWare",
    length: "1:22:01",
    url: "https://www.youtube.com/watch?v=KqqOXndnvic",
  },
  "cp-birthday": {
    kind: "video",
    title: "Hash Collisions & The Birthday Paradox - Computerphile",
    by: "Computerphile",
    length: "14:21",
    url: "https://www.youtube.com/watch?v=jsraR-el8_o",
  },
  "3b1b-256bit": {
    kind: "video",
    title: "How secure is 256 bit security?",
    by: "3Blue1Brown",
    length: "5:06",
    url: "https://www.youtube.com/watch?v=S9JGmA5_unY",
  },
  "cp-float": {
    kind: "video",
    title: "Floating Point Numbers - Computerphile",
    by: "Computerphile",
    length: "9:16",
    url: "https://www.youtube.com/watch?v=PZRI1IfStY0",
  },
  "cp-float-1": {
    kind: "video",
    title: "Floating Point Numbers (Part1: Fp vs Fixed) - Computerphile",
    by: "Computerphile",
    length: "15:41",
    url: "https://www.youtube.com/watch?v=f4ekifyijIg",
  },
  "cp-float-2": {
    kind: "video",
    title: "Floating Point Numbers (Part2: Fp Addition) - Computerphile",
    by: "Computerphile",
    length: "8:09",
    url: "https://www.youtube.com/watch?v=782QWNOD_Z0",
  },
  "goldberg-float": {
    kind: "article",
    title: "What Every Computer Scientist Should Know About Floating-Point Arithmetic",
    by: "David Goldberg · ACM Computing Surveys 23(1)",
    year: 1991,
    url: "https://doi.org/10.1145/103162.103163",
  },
  "google-bfloat16": {
    kind: "article",
    title: "BFloat16: The secret to high performance on Cloud TPUs",
    by: "Shibo Wang, Pankaj Kanwar · Google Cloud Blog",
    year: 2019,
    url: "https://cloud.google.com/blog/products/ai-machine-learning/bfloat16-the-secret-to-high-performance-on-cloud-tpus",
  },
  "3b1b-gd": {
    kind: "video",
    title: "Gradient descent, how neural networks learn | Deep Learning Chapter 2",
    by: "3Blue1Brown",
    length: "20:33",
    url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
  },
  "sq-gd": {
    kind: "video",
    title: "Gradient Descent, Step-by-Step",
    by: "StatQuest with Josh Starmer",
    length: "23:54",
    url: "https://www.youtube.com/watch?v=sDv4f4s2SB8",
  },
  "distill-momentum": {
    kind: "article",
    title: "Why Momentum Really Works",
    by: "Gabriel Goh · Distill",
    year: 2017,
    url: "https://distill.pub/2017/momentum/",
  },
  "ng-momentum": {
    kind: "video",
    title: "Gradient Descent With Momentum (C2W2L06)",
    by: "DeepLearningAI (Andrew Ng)",
    length: "9:21",
    url: "https://www.youtube.com/watch?v=k8fTYJPd3_I",
  },
  "ng-adam": {
    kind: "video",
    title: "Adam Optimization Algorithm (C2W2L08)",
    by: "DeepLearningAI (Andrew Ng)",
    length: "7:08",
    url: "https://www.youtube.com/watch?v=JXQT_vxqwIs",
  },
  "reducible-bfs": {
    kind: "video",
    title: "Breadth First Search (BFS): Visualized and Explained",
    by: "Reducible",
    length: "10:41",
    url: "https://www.youtube.com/watch?v=xlVX7dXLS64",
  },
  "mit-6006-bfs": {
    kind: "lecture",
    title: "9. Breadth-First Search (6.006, Spring 2020)",
    by: "MIT OpenCourseWare",
    length: "52:53",
    url: "https://www.youtube.com/watch?v=oFVYVzlvk9c",
  },
  "cp-dijkstra": {
    kind: "video",
    title: "Dijkstra's Algorithm - Computerphile",
    by: "Computerphile",
    length: "10:43",
    url: "https://www.youtube.com/watch?v=GazC3A4OQTE",
  },
  "mit-6006-dijkstra": {
    kind: "lecture",
    title: "13. Dijkstra (6.006, Spring 2020)",
    by: "MIT OpenCourseWare",
    length: "57:22",
    url: "https://www.youtube.com/watch?v=NSHizBK9JD8",
  },
  "cp-astar": {
    kind: "video",
    title: "A* (A Star) Search Algorithm - Computerphile",
    by: "Computerphile",
    length: "14:04",
    url: "https://www.youtube.com/watch?v=ySN5Wnu88nE",
  },
  "reducible-astar": {
    kind: "video",
    title: "A* Search: How Your Map Applications Find Shortest Routes",
    by: "Reducible",
    length: "16:17",
    url: "https://www.youtube.com/watch?v=88I6IidylGc",
  },
  "redblob-astar": {
    kind: "interactive",
    title: "Introduction to the A* Algorithm",
    by: "Amit Patel · Red Blob Games",
    url: "https://www.redblobgames.com/pathfinding/a-star/introduction.html",
  },
  "mit-6006-hashing": {
    kind: "lecture",
    title: "4. Hashing (6.006, Spring 2020)",
    by: "MIT OpenCourseWare",
    length: "52:55",
    url: "https://www.youtube.com/watch?v=Nu8YGneFCWE",
  },
  "mit-6006-openaddr": {
    kind: "lecture",
    title: "Lecture 10: Open Addressing, Cryptographic Hashing",
    by: "MIT OpenCourseWare",
    length: "50:55",
    url: "https://www.youtube.com/watch?v=rvdJDijO2Ro",
  },
  "algs4-hash": {
    kind: "book",
    title: "Algorithms, 4th ed.: 3.4 Hash Tables",
    by: "Robert Sedgewick, Kevin Wayne",
    url: "https://algs4.cs.princeton.edu/34hash/",
  },
  "java-hashmap": {
    kind: "notes",
    title: "java.util.HashMap (Java SE 21 API)",
    by: "Oracle",
    url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html",
  },
  "sq-hyptest": {
    kind: "video",
    title: "Hypothesis Testing and The Null Hypothesis, Clearly Explained!!!",
    by: "StatQuest with Josh Starmer",
    length: "14:41",
    url: "https://www.youtube.com/watch?v=0oc49DyA3hU",
  },
  "sq-althyp": {
    kind: "video",
    title: "Alternative Hypotheses: Main Ideas!!!",
    by: "StatQuest with Josh Starmer",
    length: "9:50",
    url: "https://www.youtube.com/watch?v=5koKb5B_YWo",
  },
  "sq-power": {
    kind: "video",
    title: "Statistical Power, Clearly Explained!!!",
    by: "StatQuest with Josh Starmer",
    length: "8:19",
    url: "https://www.youtube.com/watch?v=Rsc5znwR5FA",
  },
  "sq-power-analysis": {
    kind: "video",
    title: "Power Analysis, Clearly Explained!!!",
    by: "StatQuest with Josh Starmer",
    length: "16:45",
    url: "https://www.youtube.com/watch?v=VX_M3tIyiYk",
  },
  "khan-power": {
    kind: "video",
    title: "Introduction to power in significance tests | AP Statistics | Khan Academy",
    by: "Khan Academy",
    length: "9:45",
    url: "https://www.youtube.com/watch?v=6_Cuz0QqRWc",
  },
  "openintro-stats": {
    kind: "book",
    title: "OpenIntro Statistics, 4th ed.: 5.3 Hypothesis testing, 7.4 Power calculations",
    by: "Diez, Çetinkaya-Rundel, Barr",
    year: 2019,
    url: "https://www.openintro.org/book/os/",
  },
  "3b1b-nn": {
    kind: "video",
    title: "But what is a neural network? | Deep learning chapter 1",
    by: "3Blue1Brown",
    length: "18:40",
    url: "https://www.youtube.com/watch?v=aircAruvnKk",
  },
  "sq-nn": {
    kind: "video",
    title: "The Essential Main Ideas of Neural Networks",
    by: "StatQuest with Josh Starmer",
    length: "18:54",
    url: "https://www.youtube.com/watch?v=CqOfi41LfDw",
  },
  "lavrenko-xor": {
    kind: "video",
    title: "Neural Networks 6: solving XOR with a hidden layer",
    by: "Victor Lavrenko (University of Edinburgh)",
    length: "5:53",
    url: "https://www.youtube.com/watch?v=kNPGXgzxoHw",
  },
  "tf-playground": {
    kind: "interactive",
    title: "TensorFlow Playground",
    by: "Daniel Smilkov, Shan Carter",
    url: "https://playground.tensorflow.org/",
  },
  "nielsen-universal": {
    kind: "book",
    title:
      "Neural Networks and Deep Learning, ch. 4: A visual proof that neural nets can compute any function",
    by: "Michael Nielsen",
    url: "http://neuralnetworksanddeeplearning.com/chap4.html",
  },
  "np-monty": {
    kind: "video",
    title: "Monty Hall Problem - Numberphile",
    by: "Numberphile",
    length: "5:30",
    url: "https://www.youtube.com/watch?v=4Lb-6rxZxx0",
  },
  "stat110-l6": {
    kind: "lecture",
    title: "Lecture 6: Monty Hall, Simpson's Paradox",
    by: "Harvard University · Statistics 110",
    length: "49:01",
    url: "https://www.youtube.com/watch?v=fDcjhAKuhqQ",
  },
  "stat110-l3": {
    kind: "lecture",
    title: "Lecture 3: Birthday Problem, Properties of Probability",
    by: "Harvard University · Statistics 110",
    length: "48:55",
    url: "https://www.youtube.com/watch?v=LZ5Wergp_PA",
  },
  "mp-simpson": {
    kind: "video",
    title: "Simpson's Paradox",
    by: "minutephysics",
    length: "4:40",
    url: "https://www.youtube.com/watch?v=ebEkn-BiW5k",
  },
  "3b1b-clt": {
    kind: "video",
    title: "But what is the Central Limit Theorem?",
    by: "3Blue1Brown",
    length: "31:15",
    url: "https://www.youtube.com/watch?v=zeJD6dqJ5lo",
  },
  "stat110-l29": {
    kind: "lecture",
    title: "Lecture 29: Law of Large Numbers and Central Limit Theorem",
    by: "Harvard University · Statistics 110",
    length: "49:48",
    url: "https://www.youtube.com/watch?v=OprNqnHsVIA",
  },
  "cp-race": {
    kind: "video",
    title: "Race Conditions on a Human Scale - Computerphile",
    by: "Computerphile",
    length: "20:14",
    url: "https://www.youtube.com/watch?v=W0jPTqIo5oE",
  },
  "ostep-threads": {
    kind: "book",
    title: "Operating Systems: Three Easy Pieces, ch. 26: Concurrency and Threads",
    by: "Remzi & Andrea Arpaci-Dusseau",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf",
  },
  "spanning-race": {
    kind: "video",
    title: "Race Conditions and How to Prevent Them - A Look at Dekker's Algorithm",
    by: "Spanning Tree",
    length: "6:54",
    url: "https://www.youtube.com/watch?v=MqnpIwN7dz0",
  },
  "ostep-locks": {
    kind: "book",
    title: "Operating Systems: Three Easy Pieces, ch. 28: Locks",
    by: "Remzi & Andrea Arpaci-Dusseau",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf",
  },
  "ostep-bugs": {
    kind: "book",
    title: "Operating Systems: Three Easy Pieces, ch. 32: Common Concurrency Problems",
    by: "Remzi & Andrea Arpaci-Dusseau",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf",
  },
  "sq-rl": {
    kind: "video",
    title: "Reinforcement Learning: Essential Concepts",
    by: "StatQuest with Josh Starmer",
    length: "18:13",
    url: "https://www.youtube.com/watch?v=Z-T0iJEXiwM",
  },
  "cp-mdp": {
    kind: "video",
    title: "Markov Decision Processes - Computerphile",
    by: "Computerphile",
    length: "17:42",
    url: "https://www.youtube.com/watch?v=2iF9PRriA7w",
  },
  "deeplizard-q": {
    kind: "video",
    title: "Q-Learning Explained - A Reinforcement Learning Technique",
    by: "deeplizard",
    length: "8:38",
    url: "https://www.youtube.com/watch?v=qhRNvCVVJaA",
  },
  "sutton-barto": {
    kind: "book",
    title: "Reinforcement Learning: An Introduction, 2nd ed.",
    by: "Richard S. Sutton, Andrew G. Barto",
    year: 2018,
    url: "http://incompleteideas.net/book/the-book-2nd.html",
  },
  "miles-spec": {
    kind: "video",
    title: "9 Examples of Specification Gaming",
    by: "Robert Miles AI Safety",
    length: "9:40",
    url: "https://www.youtube.com/watch?v=nKJlF-olKmg",
  },
  "deepmind-specgaming": {
    kind: "article",
    title: "Specification gaming: the flip side of AI ingenuity",
    by: "Krakovna et al. · Google DeepMind",
    year: 2020,
    url: "https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/",
  },
  "sambol-selection": {
    kind: "video",
    title: "Selection sort in 3 minutes",
    by: "Michael Sambol",
    length: "2:43",
    url: "https://www.youtube.com/watch?v=g-PGLbMth_g",
  },
  "sambol-insertion": {
    kind: "video",
    title: "Insertion sort in 2 minutes",
    by: "Michael Sambol",
    length: "2:19",
    url: "https://www.youtube.com/watch?v=JU767SDMDvA",
  },
  "mit-6006-sorting": {
    kind: "lecture",
    title: "3. Sets and Sorting (6.006, Spring 2020)",
    by: "MIT OpenCourseWare",
    length: "52:56",
    url: "https://www.youtube.com/watch?v=oS9aPzUNG-s",
  },
  "tomscott-sorting": {
    kind: "video",
    title: "Why My Teenage Code Was Terrible: Sorting Algorithms and Big O Notation",
    by: "Tom Scott",
    length: "9:46",
    url: "https://www.youtube.com/watch?v=RGuJga2Gl_k",
  },
  "algs4-sorts": {
    kind: "book",
    title: "Algorithms, 4th ed.: 2.1 Elementary Sorts",
    by: "Robert Sedgewick, Kevin Wayne",
    url: "https://algs4.cs.princeton.edu/21elementary/",
  },
  "karpathy-tokenizer": {
    kind: "video",
    title: "Let's build the GPT Tokenizer",
    by: "Andrej Karpathy",
    length: "2:13:35",
    url: "https://www.youtube.com/watch?v=zduSFxRajkE",
  },
  "hf-bpe": {
    kind: "notes",
    title: "LLM Course, 6.5: Byte-Pair Encoding tokenization",
    by: "Hugging Face",
    url: "https://huggingface.co/learn/llm-course/chapter6/5",
  },
  "cp-glitch": {
    kind: "video",
    title: "Glitch Tokens - Computerphile",
    by: "Computerphile",
    length: "19:29",
    url: "https://www.youtube.com/watch?v=WO2X3oZEJOA",
  },
  "petrov-unfair": {
    kind: "article",
    title: "Language Model Tokenizers Introduce Unfairness Between Languages",
    by: "Petrov, La Malfa, Torr, Bibi · NeurIPS 2023",
    year: 2023,
    url: "https://arxiv.org/abs/2305.15425",
  },
  "sq-word2vec": {
    kind: "video",
    title: "Word Embedding and Word2Vec, Clearly Explained!!!",
    by: "StatQuest with Josh Starmer",
    length: "16:12",
    url: "https://www.youtube.com/watch?v=viZrOnJclY0",
  },
  "cp-vectoring": {
    kind: "video",
    title: "Vectoring Words (Word Embeddings) - Computerphile",
    by: "Computerphile",
    length: "16:56",
    url: "https://www.youtube.com/watch?v=gQddtTdmG_8",
  },
  "alammar-word2vec": {
    kind: "article",
    title: "The Illustrated Word2vec",
    by: "Jay Alammar",
    year: 2019,
    url: "https://jalammar.github.io/illustrated-word2vec/",
  },
  "cs224n-l1": {
    kind: "lecture",
    title: "CS224N Winter 2021, Lecture 1: Intro & Word Vectors",
    by: "Stanford Online · Christopher Manning",
    length: "1:24:27",
    url: "https://www.youtube.com/watch?v=rmVRLeJRkl4",
  },
  "sq-pca": {
    kind: "video",
    title: "StatQuest: PCA main ideas in only 5 minutes!!!",
    by: "StatQuest with Josh Starmer",
    length: "6:05",
    url: "https://www.youtube.com/watch?v=HMOI_lkzW08",
  },
  "distill-tsne": {
    kind: "article",
    title: "How to Use t-SNE Effectively",
    by: "Wattenberg, Viégas, Johnson · Distill",
    year: 2016,
    url: "https://distill.pub/2016/misread-tsne/",
  },
} satisfies Record<string, LearningResource>;

export type ResourceId = keyof typeof RESOURCES;

/**
 * Each lab's guide: its main ideas in the order the lab teaches them, and the
 * resources under each. The ideas' names and each resource's reason for being
 * here are in the lab's copy, keyed the same way.
 */
export const GUIDES: Record<string, readonly { topic: string; items: readonly ResourceId[] }[]> = {
  attention: [
    { topic: "qkv", items: ["3b1b-attention", "sq-attention", "d2l-attention"] },
    { topic: "softmax", items: ["sq-softmax"] },
    { topic: "transformer", items: ["3b1b-transformers", "karpathy-gpt", "alammar-transformer"] },
  ],
  backpropagation: [
    { topic: "slope", items: ["3b1b-backprop", "3b1b-backprop-calc", "sq-chain"] },
    { topic: "graph", items: ["karpathy-micrograd", "sq-backprop", "cs231n-backprop"] },
    { topic: "depth", items: ["ng-vanishing"] },
    { topic: "check", items: ["ng-gradcheck"] },
  ],
  "cache-locality": [
    { topic: "line", items: ["cp-caches-why", "cp-caches-how"] },
    { topic: "order", items: ["mit-6172-l14", "drepper-memory"] },
  ],
  convolution: [
    { topic: "window", items: ["ng-edge", "sq-cnn"] },
    { topic: "sharing", items: ["ng-why-conv", "cs231n-conv"] },
    { topic: "size", items: ["ng-padding", "ng-stride", "d2l-padding"] },
  ],
  "cryptographic-hashing": [
    { topic: "digest", items: ["paar-hash", "mit-6046-hash"] },
    { topic: "collision", items: ["cp-birthday", "3b1b-256bit"] },
  ],
  "floating-point": [
    { topic: "stored", items: ["cp-float", "cp-float-1"] },
    { topic: "rounding", items: ["cp-float-2", "goldberg-float"] },
    { topic: "formats", items: ["google-bfloat16"] },
  ],
  "gradient-descent": [
    { topic: "downhill", items: ["3b1b-gd", "sq-gd"] },
    { topic: "ceiling", items: ["distill-momentum"] },
    { topic: "momentum", items: ["ng-momentum", "ng-adam"] },
  ],
  "graph-search": [
    { topic: "bfs", items: ["reducible-bfs", "mit-6006-bfs"] },
    { topic: "dijkstra", items: ["cp-dijkstra", "mit-6006-dijkstra"] },
    { topic: "astar", items: ["cp-astar", "reducible-astar", "redblob-astar"] },
  ],
  "hash-tables": [
    { topic: "address", items: ["mit-6006-hashing", "cp-birthday"] },
    { topic: "collisions", items: ["mit-6006-openaddr", "algs4-hash"] },
    { topic: "resize", items: ["java-hashmap"] },
  ],
  "hypothesis-testing": [
    { topic: "alpha", items: ["sq-hyptest", "sq-althyp"] },
    { topic: "power", items: ["sq-power", "sq-power-analysis", "khan-power", "openintro-stats"] },
  ],
  "multilayer-perceptrons": [
    { topic: "neuron", items: ["3b1b-nn", "sq-nn"] },
    { topic: "xor", items: ["lavrenko-xor", "tf-playground", "nielsen-universal"] },
    { topic: "learning", items: ["3b1b-gd"] },
  ],
  probability: [
    { topic: "monty", items: ["np-monty", "stat110-l6"] },
    { topic: "birthday", items: ["stat110-l3"] },
    { topic: "simpson", items: ["mp-simpson"] },
    { topic: "galton", items: ["3b1b-clt", "stat110-l29"] },
  ],
  "race-condition": [
    { topic: "steps", items: ["cp-race", "ostep-threads"] },
    { topic: "fix", items: ["spanning-race", "ostep-locks"] },
    { topic: "check", items: ["ostep-bugs"] },
  ],
  "reinforcement-learning": [
    { topic: "reward", items: ["sq-rl", "cp-mdp"] },
    { topic: "q", items: ["deeplizard-q", "sutton-barto"] },
    { topic: "gaming", items: ["miles-spec", "deepmind-specgaming"] },
  ],
  sorting: [
    { topic: "two", items: ["sambol-selection", "sambol-insertion", "mit-6006-sorting"] },
    { topic: "cost", items: ["tomscott-sorting", "algs4-sorts"] },
  ],
  tokenization: [
    { topic: "bpe", items: ["karpathy-tokenizer", "hf-bpe"] },
    { topic: "quirks", items: ["cp-glitch", "petrov-unfair"] },
  ],
  "word-embeddings": [
    { topic: "vectors", items: ["sq-word2vec", "cp-vectoring", "alammar-word2vec"] },
    { topic: "usage", items: ["cs224n-l1"] },
    { topic: "shadow", items: ["sq-pca", "distill-tsne"] },
  ],
};
