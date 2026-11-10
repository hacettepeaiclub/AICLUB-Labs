import type en from "../en/sorting";

/** Türkçe metin: sorting. Şekli `en/sorting.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  theRace: "The race",
  algorithm: "Algoritma",
  shape: "Biçim",
  shapeAndKeys: "Biçim ve klavye",
  puzzle: "Görev",
  sorterA: "Sorter A",
  sorterB: "Sorter B",
  sort: "Sırala",
  algorithms: { selection: "Seçmeli Sıralama", insertion: "Eklemeli Sıralama" },
  shapes: {
    almost: "Neredeyse sıralı",
    sorted: "Sıralı",
    random: "Karışık",
    reversed: "Ters",
  },
  legend: { settled: "yerleşti", comparing: "karşılaştırılıyor", lifted: "havada" },
  metrics: {
    comparisons: "Karşılaştırma",
    moves: "Taşıma",
    disorder: "Düzensizlik",
    questionsAsked: "sorulan soru",
    valuesRelocated: "yeri değişen değer",
    inversions: (n: number) => `${n} terslik`,
  },
  drawHint: "Veriyi yeniden biçimlendirmek için grafiğin üzerinde sürükle.",
  keyboardHint: "bir çubuk seçer,",
  keyboardHint2: "yüksekliğini değiştirir.",
  keyboardHelp:
    "Grafiği yeniden biçimlendirmek için üzerinde sürükle. Grafik odaktayken sol ve sağ oklar bir çubuk seçer, yukarı ve aşağı oklar yüksekliğini değiştirir.",
  chartLabel: (size: number, algorithm: string, disorder: number, state: string) =>
    `${size} değerden oluşan çubuk grafik. ${algorithm}. Düzensizlik: ${disorder} terslik. ${state}`,
  state: {
    done: (comparisons: number, moves: number) =>
      `${comparisons} karşılaştırma ve ${moves} taşıma ile sıralandı.`,
    running: (comparisons: number, moves: number) =>
      `Sıralanıyor: şu ana kadar ${comparisons} karşılaştırma, ${moves} taşıma.`,
    alreadySorted: "Zaten sıralı. Başlatılmadı.",
    notStarted: "Başlatılmadı.",
    cursor: (index: number, value: number) => `İmleç ${index}. çubukta, değer ${value}.`,
    sorting: "Sıralanıyor.",
    arrayReset: "Dizi sıfırlandı.",
    loaded: (shape: string) => `${shape} yüklendi.`,
    selected: (algorithm: string) => `${algorithm} seçildi.`,
  },
  race: {
    question: "Hangisi önce bitirir?",
    oneButton: "Tek düğme. İkisi de aynı veriden başlıyor.",
    bothDone: "Aynı sonuç, ama biri diğerinin sorduğu soruların çok azını sordu.",
    sorted: "sıralandı",
    caption: "Aynı dizi, aynı sonuç. Sayaçlar değil.",
    panelLabel: (title: string, size: number, state: string) =>
      `${title}: ${size} değerden oluşan çubuk grafik. ${state}`,
  },
  watch: {
    kicker: "Watch them work",
    title: "One sweeps. The other tiptoes.",
    lede: "Birer adım ilerle. A’nın kalan diziyi nasıl taradığını, B’nin ise seçtiği değeri nasıl yerine taşıdığını karşılaştır.",
    caption:
      "A, selection sort; B, insertion sort uygular. Karşılaştırma ve yazma sayılarını ayrı ayrı izle.",
  },
  data: {
    kicker: "Draw the data",
    title: "The work is in the data.",
    lede: "Çubukları sürükleyerek diziyi değiştir veya hazır bir dizi seç. Aynı diziyi iki algoritmayla yeniden sırala.",
    caption:
      "32 eleman için selection sort her seferinde 496 karşılaştırma yapar. Insertion sort’un karşılaştırma ve yazma sayıları ise girdinin ne kadar sıralı olduğuna bağlıdır.",
  },
  distance: {
    kicker: "How far from home",
    title: "It isn't how many are wrong.",
    lede: "Sıralı bir dizide tek bir çubuğu uzağa taşı. Ardından birkaç çubuğu küçük miktarlarda değiştir. İki durumda gereken yazma sayısını karşılaştır.",
    caption:
      "Terslik, sırası yanlış olan bir çifttir. Bu eklemeli sıralama, kendisine verilen dizideki her terslik için tam bir kez kaydırır, yani evinden çok uzaktaki tek bir değer, birkaç küçük hatadan daha pahalıya gelebilir. Taşıma ise bu kaydırmalara, yeri değişen her değeri yerine yazan son işlemi de ekler; bu yüzden Düzensizlik'in biraz üzerinde durur.",
  },
  challenge: {
    architecture: "Mimari",
    neuronsUsed: "Kullanılan nöron",
    testAccuracy: "Test doğruluğu",
    target: "Hedef",
    objectiveLine: (accuracy: string) =>
      `Spiralde ${accuracy} test doğruluğuna ulaşın: olabildiğince az gizli nöron kullanarak.`,
    solvedNote: "Çözüldü. Şimdi bir nöron eksiltip yeniden dene.",
    noBest: "Henüz yok. Bol nöronla başlayın, sonra bozulana kadar azalt.",
    bestLine: (neurons: number, accuracy: string, epoch: number) =>
      `En iyi: ${neurons} gizli nöron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
    canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
      `Spiral görevi: ${neurons} gizli nöron, ${epoch} epok sonra ${accuracy} test doğruluğu.`,
    announceSolved: (neurons: number, accuracy: string) =>
      `${neurons} gizli nöronla, ${accuracy} test doğruluğunda çözüldü.`,
    kicker: "The challenge",
    title: "Cheaper depends on what you count.",
    lede: "Her görevde sabit bir dizi ve işlem sınırı var. Karşılaştırma veya yazma bütçesine uyan ayarı bul.",
    budget: "Bütçe",
    atMost: (unit: string) => `en fazla ${unit}`,
    barsChanged: "değişen çubuk",
    beaten: (done: number, total: number) => `${total} görevden ${done} tanesi geçildi`,
    fixedTo: (algorithm: string) => `${algorithm} sabit. Onun yerine veriyi yeniden biçimlendirin.`,
    goal: (budget: number, unit: string) => `Hedef: en fazla ${budget}  ${unit}.`,
    chartLabel: (title: string, size: number, disorder: number, goal: string, state: string) =>
      `${title}: ${size} değerden oluşan çubuk grafik. Düzensizlik: ${disorder} terslik. ${goal}  ${state}`,
    editsUsed: (used: number, max: number) => `${max} düzenlemeden ${used} tanesi kullanıldı.`,
    finished: (comparisons: number, moves: number) =>
      `${comparisons} karşılaştırma ve ${moves} taşıma ile bitti.`,
    budgetValue: (budget: number, unit: string) => `${budget}  ${unit}`,
    editsLeft: (used: number, max: number) => `${max} düzenlemeden ${used} tanesi kullanıldı`,
    units: { comparisons: "karşılaştırma", moves: "taşıma" },
    puzzles: {
      "which-one-cares": {
        title: "Which one cares?",
        brief: "Bütçenin izin verdiğinden daha az soru sorarak sırala.",
      },
      "fewest-writes": {
        title: "Fewest writes",
        brief: "İstediğin kadar soru sorun: yeter ki fazla veri taşımayın.",
      },
      "three-edits": {
        title: "Three edits",
        brief: "En fazla üç çubuğu yeniden biçimlendirin, sonra bütçenin altına inin.",
      },
    },
    verdict: {
      tooManyEdits: (edits: number, max: number) =>
        `${edits} çubuk değiştirdin. En fazla ${max} değiştirebilirsin.`,
      overBudget: (used: number, unit: string, budget: number) =>
        `${used}  ${unit}. Bütçe: ${budget}.`,
      passed: (used: number, unit: string, budget: number) =>
        `${budget} bütçesinin altında, ${used}  ${unit} ile çözüldü.`,
    },
  },
  recap: {
    lessons: [
      "İki algoritma aynı sonuca, birbirinden çok farklı miktarda iş yaparak ulaşabilir",
      "Seçmeli sıralama her turda kalanın tamamını yeniden tarar, bu yüzden maliyeti sabittir; eklemeli sıralama yalnızca gerektiği kadar geriye yürür, bu yüzden maliyeti verinin bir özelliğidir",
      "Terslik, sırası yanlış olan bir çifttir ve bu eklemeli sıralama her biri için bir kez kaydırır; Taşıma buna her değeri yerine yazan son işlemi de ekler, ama daha az soru sormak, daha az veri yazmakla aynı hedef değildir",
    ],
    footer:
      "Bazı sıralama kütüphaneleri küçük veya büyük ölçüde sıralı parçaları insertion sort ile işler. Hangi yöntemin uygun olduğu girdiye ve önem verilen maliyete bağlıdır.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Aynı diziyi iki algoritmayla sırala. Oynatma hızından önce karşılaştırma ve yazma sayaçlarına bak.",
    stages: {
      race: {
        bars: "İki sıralayıcı, aynı karışık çubuklar.",
        sort: "Tek düğme ikisini birden başlatır.",
        counters:
          "Her birinin altında karşılaştırma ve taşıma sayısı. Sonuç aynı, maliyet çok farklı.",
      },
      watch: {
        bars: "Her seferinde tek sıralayıcı, yavaşlatılmış.",
        step: "Adımla: tek bir karşılaştırma ya da taşıma. Vurgulanan çubuklar o an bakılanlar.",
        algorithm:
          "Buradan A ve B sıralayıcıları arasında geçiş yapıp ikisinde de adım adım ilerleyin.",
      },
      data: {
        shape:
          "Verinin biçimini buradan seç: karışık, neredeyse sıralı, ters. Grafiğin üzerinde sürükleyerek de çizebilirsin.",
        sort: "Yeniden sırala.",
        figures:
          "Selection Sort her seferinde aynı sayıda soru sorar; Insertion Sort'un sayısı veriyle değişir.",
      },
      distance: {
        bars: "Sıralı çubuklar. Birini yerinden çok uzağa sürükle ya da birkaçını hafifçe kaydırın.",
        sort: "Sırala ve maliyeti karşılaştır.",
        figures:
          "Önemli olan kaç tanesinin yanlış olduğu değil, ne kadar uzakta olduğu: yanlış sıradaki her çift bir kaydırmaya mal olur.",
      },
      challenge: {
        array: "Üç sabit dizi, üç bütçe. Bulmacayı yukarıdan seç.",
        algorithm: "Sıralayıcıyı seç: hangisinin daha ucuz olduğu neyin sayıldığına bağlı.",
        sort: "Sırala ve bütçenin içinde kalıp kalmadığına bak.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      two: "Selection sort and insertion sort",
      cost: "The work is in the data",
    },
    notes: {
      "sambol-selection": "Üç dakikadan kısa sürede seçmeli sıralama.",
      "sambol-insertion": "Üç dakikadan kısa sürede eklemeli sıralama.",
      "mit-6006-sorting": "MIT'nin sıralama dersi, iki algoritma da dahil.",
      "tomscott-sorting": "İşi saymanın neden koddan daha önemli olduğu.",
      "algs4-sorts": "Eklemeli sıralamanın yer değiştirme sayısı ters çift sayısına eşittir.",
    },
  },
};

export default copy;
