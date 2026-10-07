import type en from "../en/sorting";

/** Türkçe metin: sorting. Şekli `en/sorting.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  theRace: "Yarış",
  algorithm: "Algoritma",
  shape: "Biçim",
  shapeAndKeys: "Biçim ve klavye",
  puzzle: "Görev",
  sorterA: "Sıralayıcı A",
  sorterB: "Sıralayıcı B",
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
  drawHint: "Veriyi yeniden biçimlendirmek için grafiğin üzerinde sürükleyin.",
  keyboardHint: "bir çubuk seçer,",
  keyboardHint2: "yüksekliğini değiştirir.",
  keyboardHelp:
    "Grafiği yeniden biçimlendirmek için üzerinde sürükleyin. Grafik odaktayken sol ve sağ oklar bir çubuk seçer, yukarı ve aşağı oklar yüksekliğini değiştirir.",
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
    kicker: "Çalışırken izleyin",
    title: "Biri süpürür. Diğeri parmak ucuyla yürür.",
    lede: "Adım adım ilerleyin. Sıralayıcı A hiçbir şeyi kımıldatmadan önce kalanın tamamını yeniden tarar; Sıralayıcı B tek bir değeri alıp yalnızca gerektiği kadar geriye yürütür.",
    caption:
      "Bunlar Seçmeli Sıralama ve Eklemeli Sıralama. Uzun ve kesintisiz karşılaştırma dizileri birincisine; karşılaştır-kaydır-karşılaştır ritmi ikincisine ait.",
  },
  data: {
    kicker: "Veriyi çizin",
    title: "İş verinin içinde.",
    lede: "Grafiği yeniden biçimlendirin (üzerinde sürükleyin ya da bir biçim seçin), sonra yeniden sıralayın.",
    caption:
      "Seçmeli Sıralama burada her seferinde 496 soru sorar; sıralı, karışık ya da ters fark etmez, çünkü kalan her çifti yine de kontrol eder. Eklemeli Sıralama'nın sayısı ise çizdiğiniz biçimle birlikte değişir.",
  },
  distance: {
    kicker: "Evinden ne kadar uzakta",
    title: "Mesele kaç tanesinin yanlış olduğu değil.",
    lede: "Sıralı biçimden başlayın. Bir çubuğu ait olduğu yerden çok uzağa sürükleyin, sonra bunun yerine üç çubuğu hafifçe oynatın. Her birinin maliyetini karşılaştırın.",
    caption:
      "Terslik, sırası yanlış olan bir çifttir. Bu eklemeli sıralama, kendisine verilen dizideki her terslik için tam bir kez kaydırır, yani evinden çok uzaktaki tek bir değer, birkaç küçük hatadan daha pahalıya gelebilir. Taşıma ise bu kaydırmalara, yeri değişen her değeri yerine yazan son işlemi de ekler; bu yüzden Düzensizlik'in biraz üzerinde durur.",
  },
  challenge: {
    architecture: "Mimari",
    neuronsUsed: "Kullan\u0131lan n\u00f6ron",
    testAccuracy: "Test do\u011frulu\u011fu",
    target: "Hedef",
    objectiveLine: (accuracy: string) =>
      `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n: olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
    solvedNote: "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
    noBest:
      "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
    bestLine: (neurons: number, accuracy: string, epoch: number) =>
      `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
    canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
      `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
    announceSolved: (neurons: number, accuracy: string) =>
      `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
    kicker: "Meydan okuma",
    title: "Neyi saydığınıza göre ucuz değişir.",
    lede: "Üç sabit dizi, üç bütçe, ve bütçe her zaman aynı sayıyla ilgili değil.",
    budget: "Bütçe",
    atMost: (unit: string) => `en fazla ${unit}`,
    barsChanged: "değişen çubuk",
    beaten: (done: number, total: number) => `${total} görevden ${done} tanesi geçildi`,
    fixedTo: (algorithm: string) => `${algorithm} sabit. Onun yerine veriyi yeniden biçimlendirin.`,
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
        title: "Hangisi umursuyor?",
        brief: "Bütçenin izin verdiğinden daha az soru sorarak sıralayın.",
      },
      "fewest-writes": {
        title: "En az yazma",
        brief: "İstediğiniz kadar soru sorun: yeter ki fazla veri taşımayın.",
      },
      "three-edits": {
        title: "Üç düzenleme",
        brief: "En fazla üç çubuğu yeniden biçimlendirin, sonra bütçenin altına inin.",
      },
    },
    verdict: {
      tooManyEdits: (edits: number, max: number) =>
        `${edits} çubuk değiştirdiniz. En fazla ${max} değiştirebilirsiniz.`,
      overBudget: (used: number, unit: string, budget: number) =>
        `${used} ${unit}. Bütçe: ${budget}.`,
      passed: (used: number, unit: string, budget: number) =>
        `${budget} bütçesinin altında, ${used} ${unit} ile çözüldü.`,
    },
  },
  recap: {
    lessons: [
      "İki algoritma aynı sonuca, birbirinden çok farklı miktarda iş yaparak ulaşabilir",
      "Seçmeli sıralama her turda kalanın tamamını yeniden tarar, bu yüzden maliyeti sabittir; eklemeli sıralama yalnızca gerektiği kadar geriye yürür, bu yüzden maliyeti verinin bir özelliğidir",
      "Terslik, sırası yanlış olan bir çifttir ve bu eklemeli sıralama her biri için bir kez kaydırır; Taşıma buna her değeri yerine yazan son işlemi de ekler, ama daha az soru sormak, daha az veri yazmakla aynı hedef değildir",
    ],
    footer:
      "Gerçek sıralama kütüphaneleri tam olarak buna yaslanır: neredeyse sıralı parçaları eklemeli sıralamaya devrederler, çünkü o biçimde işin neredeyse tamamı zaten yapılmıştır.",
  },
};

export default copy;
