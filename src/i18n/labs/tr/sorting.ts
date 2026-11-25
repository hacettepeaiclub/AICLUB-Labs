import type en from "../en/sorting";

/** Türkçe metin: sorting. Şekli `en/sorting.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  theRace: "Yarış",
  algorithm: "Algoritma",
  shape: "Başlangıç dizisi",
  shapeAndKeys: "Dizi ve klavye",
  puzzle: "Görev",
  sorterA: "Sıralayıcı A",
  sorterB: "Sıralayıcı B",
  sort: "Sırala",
  algorithms: { selection: "Seçmeli sıralama", insertion: "Eklemeli sıralama" },
  shapes: {
    almost: "Neredeyse sıralı",
    sorted: "Sıralı",
    random: "Karışık",
    reversed: "Ters",
  },
  legend: { settled: "sıralı bölüm", comparing: "karşılaştırılıyor", lifted: "eklenecek değer" },
  metrics: {
    comparisons: "Karşılaştırma",
    moves: "Taşıma",
    disorder: "Düzensizlik",
    questionsAsked: "iki değer arasında",
    valuesRelocated: "yer değiştirme veya kaydırma",
    inversions: (n: number) => `${n} terslik`,
  },
  drawHint: "Diziyi yeniden çizmek için grafiğin üzerinde sürükle.",
  keyboardHint: "bir çubuk seçer.",
  keyboardHint2: "yüksekliğini değiştirir.",
  keyboardHelp:
    "Diziyi yeniden çizmek için grafiğin üzerinde sürükle. Grafik odaktayken sol ve sağ oklar çubuk seçer. Yukarı ve aşağı oklar seçili çubuğun değerini değiştirir.",
  chartRole: "Sıralanabilir çubuk grafik",
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
    oneButton: "Sırala düğmesine bas. İki algoritma da aynı başlangıç dizisini alır.",
    bothDone: "İki algoritma da aynı diziyi elde etti. Karşılaştırma ve taşıma sayılarına bak.",
    sorted: "sıralandı",
    caption: "Aynı başlangıç dizisinde bile karşılaştırma ve taşıma sayıları farklı olabilir.",
    panelLabel: (title: string, size: number, state: string) =>
      `${title}: ${size} değerden oluşan çubuk grafik. ${state}`,
  },
  watch: {
    kicker: "Adım adım",
    title: "Aynı diziyi iki yöntemle sırala",
    lede: "Adımla düğmesine bas. A, sıralanmamış bölümün en küçük değerini arar. B, sıradaki değeri sıralı bölümdeki yerine ekler.",
    caption:
      "A seçmeli sıralama, B eklemeli sıralama uygular. Karşılaştırma ve taşıma sayaçlarını ayrı ayrı izle.",
  },
  data: {
    kicker: "Başlangıç dizisini değiştir",
    title: "Başlangıç sırası işlem sayısını nasıl etkiler?",
    lede: "Çubukları sürükleyerek diziyi değiştir veya hazır bir dizi seç. Aynı diziyi iki algoritmayla yeniden sırala.",
    caption:
      "Seçmeli sıralama 32 elemanda her zaman 496 karşılaştırma yapar. Eklemeli sıralamanın karşılaştırma ve taşıma sayıları elemanların başlangıç sırasına bağlıdır.",
  },
  distance: {
    kicker: "Terslik sayısı",
    title: "Terslikler kaydırma sayısını nasıl etkiler?",
    lede: "Sıralı dizide bir çubuğun yüksekliğini çok değiştir. Sonra sıralı diziden başlayıp birkaç çubuğu az değiştir. Her iki dizide Düzensizlik ve Taşıma değerlerini karşılaştır.",
    caption:
      "Daha büyük değer daha küçük değerden önce gelirse bu çift bir tersliktir. Eklemeli sıralama her terslik için bir kaydırma yapar. Taşıma sayacı, kaydırmaları ve bir değeri farklı konuma yazan son ekleme işlemlerini birlikte sayar.",
  },
  challenge: {
    architecture: "Mimari",
    neuronsUsed: "Kullanılan nöron",
    testAccuracy: "Test doğruluğu",
    target: "Hedef",
    objectiveLine: (accuracy: string) =>
      `Spiralde olabildiğince az gizli nöronla ${accuracy} test doğruluğuna ulaş.`,
    solvedNote: "Çözüldü. Şimdi bir nöron eksiltip yeniden dene.",
    noBest: "Henüz yok. Nöron sayısını artır, sonra hedefi karşılayan en küçük sayıyı bul.",
    bestLine: (neurons: number, accuracy: string, epoch: number) =>
      `En iyi: ${neurons} gizli nöron, ${epoch.toLocaleString("tr-TR")} epok sonra ${accuracy}.`,
    canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
      `Spiral görevi: ${neurons} gizli nöron, ${epoch} epok sonra ${accuracy} test doğruluğu.`,
    announceSolved: (neurons: number, accuracy: string) =>
      `${neurons} gizli nöronla, ${accuracy} test doğruluğunda çözüldü.`,
    kicker: "Görevler",
    title: "İşlem sınırını aşmadan sırala",
    lede: "Her görevde bir başlangıç dizisi ve işlem sınırı var. Sayaçta belirtilen karşılaştırma veya taşıma sınırını aşmadan diziyi sırala.",
    budget: "İşlem sınırı",
    atMost: (unit: string) => `en fazla ${unit}`,
    barsChanged: "değişen çubuk",
    beaten: (done: number, total: number) => `${total} görevden ${done} tanesi geçildi`,
    fixedTo: (algorithm: string) =>
      `Bu görevde sabit algoritma ${algorithm}. Çubuk değerlerini değiştirerek işlem sayısını düşür.`,
    goal: (budget: number, unit: string) => `Hedef: en fazla ${budget} ${unit}.`,
    chartLabel: (title: string, size: number, disorder: number, goal: string, state: string) =>
      `${title}: ${size} değerden oluşan çubuk grafik. Düzensizlik: ${disorder} terslik. ${goal} ${state}`,
    editsUsed: (used: number, max: number) => `${max} düzenlemeden ${used} tanesi kullanıldı.`,
    finished: (comparisons: number, moves: number) =>
      `${comparisons} karşılaştırma ve ${moves} taşıma ile bitti.`,
    budgetValue: (budget: number, unit: string) => `${budget} ${unit}`,
    editsLeft: (used: number, max: number) => `${max} düzenlemeden ${used} tanesi kullanıldı`,
    units: { comparisons: "karşılaştırma", moves: "taşıma" },
    puzzles: {
      "which-one-cares": {
        title: "Karşılaştırma sınırı",
        brief: "Karşılaştırma sınırını aşmadan diziyi sırala.",
      },
      "fewest-writes": {
        title: "Taşıma sınırı",
        brief: "Taşıma sınırını aşmadan diziyi sırala. Karşılaştırma sayısı serbest.",
      },
      "three-edits": {
        title: "Üç düzenleme",
        brief: "En fazla üç çubuğun değerini değiştir. Sonra işlem sınırını aşmadan diziyi sırala.",
      },
    },
    verdict: {
      tooManyEdits: (edits: number, max: number) =>
        `${edits} çubuk değiştirdin. En fazla ${max} değiştirebilirsin.`,
      overBudget: (used: number, unit: string, budget: number) =>
        `${used} ${unit}. Sınır ${budget}.`,
      passed: (used: number, unit: string, budget: number) =>
        `${used} ${unit} ile çözüldü. Sınır ${budget}.`,
    },
  },
  recap: {
    lessons: [
      "İki algoritma aynı sıralı diziyi üretir. Karşılaştırma ve taşıma sayıları farklı olabilir.",
      "Seçmeli sıralama kalan elemanları taradığı için karşılaştırma sayısı yalnızca dizinin uzunluğuna bağlıdır. Eklemeli sıralama yalnızca gerekli elemanları kaydırır.",
      "Eklemeli sıralamada her terslik bir kaydırmaya karşılık gelir. Taşıma sayacı, kaydırmaların yanı sıra değer farklı bir konuma eklenirse o işlemi de sayar.",
    ],
    footer:
      "Bazı sıralama kütüphaneleri küçük veya büyük ölçüde sıralı parçaları eklemeli sıralamayla işler. Hangi yöntemin uygun olduğu girdiye ve önem verilen maliyete bağlıdır.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro: "Aynı diziyi iki algoritmayla sırala. Karşılaştırma ve Taşıma sayaçlarına bak.",
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
          "A ve B arasında geçiş yap. Adımla düğmesiyle iki algoritmanın bir sonraki işlemini karşılaştır.",
      },
      data: {
        shape:
          "Başlangıç dizisini seç. Grafiğin üzerinde sürükleyerek kendi dizini de çizebilirsin.",
        sort: "Yeniden sırala.",
        figures:
          "Seçmeli sıralamanın karşılaştırma sayısı başlangıç sırasıyla değişmez. Eklemeli sıralamanın sayacı diziye göre değişir.",
      },
      distance: {
        bars: "Bir çubuğun değerini çok değiştir veya birkaç çubuğun değerini az değiştir.",
        sort: "Sırala ve maliyeti karşılaştır.",
        figures:
          "Düzensizlik sayacında terslik sayısını gör. Eklemeli sıralamada her terslik bir kaydırmaya karşılık gelir.",
      },
      challenge: {
        array: "Yukarıdan bir görev seç. İşlem sınırı grafiğin üstünde gösterilir.",
        algorithm:
          "Görev izin veriyorsa sıralama algoritmasını seç. Hangi sayacın sınırlandığına bak.",
        sort: "Sırala düğmesine bas ve sayacı işlem sınırıyla karşılaştır.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      two: "Seçmeli ve eklemeli sıralama",
      cost: "Başlangıç sırası ve işlem sayısı",
    },
    notes: {
      "sambol-selection": "Üç dakikadan kısa sürede seçmeli sıralama.",
      "sambol-insertion": "Üç dakikadan kısa sürede eklemeli sıralama.",
      "mit-6006-sorting": "MIT'nin sıralama dersi, iki algoritma da dahil.",
      "tomscott-sorting": "İşi saymanın neden koddan daha önemli olduğu.",
      "algs4-sorts": "Eklemeli sıralamada kaydırmalar ile terslik sayısı arasındaki ilişki.",
      "ods-book":
        "Sorting Algorithms bölümünde yöntemlerin maliyetini ve hangi koşullarda karşılaştırıldığını oku. Bu lab'daki tek bir çalıştırmayı bütün girdiler için performans garantisi sayma.",
    },
  },
};

export default copy;
