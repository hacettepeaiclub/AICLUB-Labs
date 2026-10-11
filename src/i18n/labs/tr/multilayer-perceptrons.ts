import type en from "../en/multilayer-perceptrons";

/** Türkçe metin: multilayer-perceptrons. Şekli `en/multilayer-perceptrons.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    backpropagation:
      "Bu laboratuvar\u0131n e\u011fitimde kulland\u0131\u011f\u0131 geri yay\u0131l\u0131m y\u00f6ntemini destekler. Buradaki a\u011f, makalede anlat\u0131lan a\u011f de\u011fil, k\u00fc\u00e7\u00fck bir \u00f6\u011fretim modelidir.",
  },
  question: "Tek bir katman asl\u0131nda neyi de\u011fi\u015ftiriyor?",
  diagram: {
    diagramLabel: (shape: string) =>
      `A\u011f \u015femas\u0131: ${shape} n\u00f6ron. Her d\u00fc\u011f\u00fcm, o n\u00f6ronun girdi karesi boyunca neye tepki verdi\u011fini g\u00f6sterir.`,
    neuron: (label: string) => `${label} n\u00f6ronu`,
    layers: {
      input: "Girdi",
      output: "Çıktı",
      hidden: (layer: number) => `Gizli ${layer}`,
      hiddenShort: (layer: number) => `G${layer}`,
    },
    inputNode: "girdi",
    bias: "bias",
    eachSquare: "Her kare, bir n\u00f6ronun girdiye kendi bak\u0131\u015f\u0131.",
    pushesUp: "yukar\u0131 iter",
    pushesDown: "a\u015fa\u011f\u0131 iter",
    thickness: "kal\u0131nl\u0131k g\u00fcc\u00fc g\u00f6sterir",
    editHint:
      "A\u011f\u0131 burada kurun: her gizli katman\u0131n alt\u0131nda − ve +. Her de\u011fi\u015fiklik e\u011fitimi ba\u015ftan ba\u015flat\u0131r.",
    addLayer: "+ Katman ekle",
    addNeuron: (layer: string) => `${layer} katman\u0131na n\u00f6ron ekle`,
    removeNeuron: (layer: string) => `${layer} katman\u0131ndan n\u00f6ron \u00e7\u0131kar`,
    removeLayer: (layer: string) => `${layer} katman\u0131n\u0131 kald\u0131r`,
  },
  liveTraining: "Canlı eğitim",

  canvasLabel: (points: number, accuracy: number) =>
    `İki sınıfta ${points} nokta. Ağ şu anda eğitim noktalarının %${accuracy} kadarını doğru biliyor; gölgeli arka plan ise diğer her yerde tahmin ettiği sınıf.`,
  datasets: {
    gauss: { label: "İki küme", hint: "Tek bir doğru yeterli." },
    circle: { label: "Çember", hint: "Eğri gerekiyor, düz bir çizgiyle bu iş olmaz." },
    xor: { label: "XOR", hint: "Klasik: gizli katman olmadan çözülemez." },
    spiral: { label: "Spiral", hint: "Zorlu. Nöron ve sabır gerekir." },
  },
  classA: "A sınıfı",
  classB: "B sınıfı",
  keyboardHint: {
    trainPause: "eğitir veya duraklatır ·",
    restart: "ağırlıkları sıfırlayıp yeniden başlatır",
  },
  layersCaption: {
    solved:
      "Düz ağ yazı tura düzeyinde takılı kaldı: hiçbir doğru bu dört köşeyi ayıramaz. Gizli katman sınırı büker ve problem ortadan kalkar.",
    idle: "İkisini yan yana çalıştırın ve soldakinin nerede pes ettiğini izleyin.",
  },
  layersPanels: {
    flat: {
      title: "Gizli katman yok",
      subtitle: "İki girdi doğrudan çıktıya bağlı: tek bir nöron.",
    },
    deep: { title: "Tek gizli katman", subtitle: "Aynı yapı, ama aralarında dört nöron var." },
  },
  descentNote: {
    overshoot:
      "Hedefi aştı. Her adım dibin ötesine sıçrayıp karşı duvarda daha yukarıya iniyor, kayıp da patlıyor.",
    deep: "En derin vadiye yerleşti. Sağlıklı bir eğitim böyle görünür.",
    shallow:
      "Yerleşti, ama sağdaki sığ çukura. Gradyan inişi yalnızca ayağının altındaki eğimi görür, manzaranın tamamını asla.",
    rolling: "Teğet doğrusunu izleyin: adımın elindeki tek bilgi onun dikliği.",
  },
  neuronLabel: (w1: string, w2: string, bias: string) =>
    `Tek bir nöronun girdi düzlemi üzerindeki çıktısı; ağırlıklar ${w1} ve ${w2}, bias ${bias}.`,
  solvedBadge: "Çözüldü",
  notYet: "Henüz değil",
  loopCards: {
    forward: { headline: "Bir tahmin" },
    loss: { headline: "Ne kadar yanıldı?" },
    backprop: { headline: "Suç kimde?" },
    descent: { headline: "Her şeyi yokuş aşağı it" },
  },
  playground: {
    currentlyWrong: "\u015eu an yanl\u0131\u015f",
    dataAndArchitecture: "Veri ve \u00f6\u011frenme",
    drawHint: "Nokta eklemek i\u00e7in tuvale t\u0131klay\u0131n ya da s\u00fcr\u00fckleyin.",
    caption:
      "Solda: a\u011f\u0131n her yerde ne tahmin etti\u011fi. Sa\u011fda: ayn\u0131 a\u011f\u0131n i\u00e7eriden g\u00f6r\u00fcn\u00fcm\u00fc, n\u00f6ron ba\u015f\u0131na bir kare.",
    draw: "Çiz",
    data: "Veri",
    noise: "Gürültü",
    activation: "Aktivasyon",
    learningRate: "Öğrenme oranı",
    train: "Eğit",
    pause: "Duraklat",
    clearPoints: "Temizle",
    newSample: "Yeni örneklem",
    insideTitle: "Ağın içeriden görünüşü",
    insideBody:
      "Aynı ağ, ikinci bir bakış açısıyla. Her kare, bir nöronun bütün girdi düzlemine verdiği kendi yanıtını gösterir: bir önceki katmanın kurduğu öznitelikler ve bir sonraki katmanın elinde bulunan malzeme.",
    canvasLabel: "Karar yüzeyi ve üzerine çizilmiş eğitim verisi.",
    playPause: "Boşluk",
  },

  stats: {
    epoch: "Epok",
    loss: "Kayıp",
    trainAcc: "Eğitim doğr.",
    testAcc: "Test doğr.",
    curveLabel: "Son birkaç saniyedeki eğitim kaybı, logaritmik ölçekte.",
    announce: (percent: number) => `Eğitim doğruluğu yüzde ${percent}.`,
  },

  neuron: {
    dragHint:
      "Çizgiyi taşımak için karenin üzerinde sürükleyin; döndürmek ve kenarını keskinleştirmek için mavi ucu sürükleyin.",
    slideHandle: "Çizginin konumu. Ok tuşları onu okunun yönünde kaydırır.",
    turnHandle:
      "Okun ucu: iki ağırlık. Sol ve sağ döndürür, yukarı ve aşağı keskinleştirir ya da yumuşatır.",
    weightsAndBias: "A\u011f\u0131rl\u0131klar ve bias",
    caption:
      "Yapamad\u0131\u011f\u0131n\u0131z \u015feye dikkat edin: çizgiyi nasıl hareket ettirirseniz ettirin s\u0131n\u0131r d\u00fcz bir \u00e7izgi olarak kal\u0131yor. Tek bir n\u00f6ronun b\u00fct\u00fcn s\u0131n\u0131r\u0131 bu, ve bir sonraki b\u00f6l\u00fcm\u00fcn var olma nedeni de bu.",
    notes: {
      tanh: "\u22121\u20261 aral\u0131\u011f\u0131na s\u0131k\u0131\u015ft\u0131r\u0131r. Yumu\u015fak, simetrik, g\u00fcvenli bir varsay\u0131lan.",
      relu: "Pozitifleri ge\u00e7irir, negatifleri d\u00fczler. H\u0131zl\u0131 ve modern varsay\u0131lan.",
      sigmoid:
        "0\u20261 aral\u0131\u011f\u0131na s\u0131k\u0131\u015ft\u0131r\u0131r. Tarihsel ve tak\u0131lmaya yatk\u0131n.",
    },
    kicker: "Sonuna kadar yakınlaşın",
    title: "Bir nöron sandığınızdan küçüktür.",
    lede: "Belleği yok, mantığı yok, hiçbir marifeti yok. Üç sayı ve bir ezme işlemi: bütün alanın üzerine kurulduğu birim bundan ibaret.",
    weight1: "x₁ ağırlığı",
    weight2: "x₂ ağırlığı",
    bias: "Bias",
    activation: "Aktivasyon",
    note: "Şuna dikkat edin: çizgiyi nasıl hareket ettirirseniz ettirin, sınır yine düz bir çizgi olarak kalır. Tek bir nöronun sınırı budur ve bir sonraki bölümün var olma nedeni de tam olarak bu.",
    canvasLabel: "Tek bir nöronun girdi düzlemi üzerindeki çıktısı.",
    activations: {
      tanh: "−1…1 aralığına ezer. Düzgün, simetrik, güvenli bir başlangıç.",
      relu: "Pozitifleri geçirir, negatifleri düzler. Hızlı ve günümüzün varsayılanı.",
      sigmoid: "0…1 aralığına ezer. Tarihsel bir seçim; öğrenmeyi tıkamaya eğilimli.",
    },
  },

  handXor: {
    caption:
      "Her nokta, düştüğü taraf yüzünden doğru ya da yanlış; halkalı olanlar yanlış. Hangi tarafın hangi sınıf olduğu, hangisi daha çok tutturuyorsa o yönde sizin için seçiliyor.",
    announce: (accuracy: string) => `Noktaların ${accuracy} kadarı doğru tarafta.`,
    canvasLabel: (lines: number, accuracy: string) =>
      `Sürükleyebileceğiniz ${lines === 1 ? "tek bir çizgiyle" : "iki çizgiyle"} XOR noktaları. ${accuracy} kadarı doğru tarafta.`,
    slideHandle: (i: number) => `Çizgi ${i}: konumu. Ok tuşları onu kaydırır.`,
    turnHandle: (i: number) =>
      `Çizgi ${i}: okun ucu, iki ağırlığı. Ok tuşları döndürür ve keskinleştirir.`,
    modeLabel: "Yerleştirdiğiniz nöronlar",
    modes: { one: "Tek çizgi", two: "İki çizgi" },
    oneHint:
      "Çizgiyi sürükleyin, ucundan tutup döndürün. Her noktayı kendi tarafına almaya çalışın.",
    ceilingReached: (ceiling: string) =>
      `Tek bir çizginin ulaşabileceği en iyisi bu: ${ceiling}. Bu karede hiçbir çizgi daha iyisini yapamaz. Tek bir nöronun çarptığı duvar budur.`,
    twoHint:
      "Şimdi iki nöron ve yalnızca iki okun da gösterdiği yerde evet diyen bir çıktı. Karşılıklı iki köşeyi içine alan bir bant oluşturun.",
    twoBeaten: (ceiling: string) =>
      `Tek bir çizginin en fazla ulaşabildiği ${ceiling} değerini geçtiniz. İki gizli nöron ve bir çıktı: elle bir gizli katman kurdunuz.`,
    figures: {
      accuracy: "Doğru tarafta",
      best: "En iyiniz, tek çizgi",
      bestHint: "bu ziyarette",
      ceiling: "Bir çizginin en iyisi",
      ceilingHint: "her açı taranarak bulundu",
    },
  },
  layers: {
    panelLabel: (title: string, accuracy: number, epoch: number) =>
      `${title}: ${epoch} epok sonra XOR noktalar\u0131n\u0131n %${accuracy} kadar\u0131 do\u011fru s\u0131n\u0131fland\u0131r\u0131ld\u0131.`,
    kicker: "Katmanlar neden gerekli",
    title: "Yapay zekâyı on yıl durduran dört nokta.",
    lede: "XOR: karşılıklı köşelere yerleşmiş iki sınıf. Tek bir nöron bunları birbirinden ayıramaz ve 1969'da fark edilen bu gerçek, alanı neredeyse bitiriyordu. Çözümün tamamıysa tek bir gizli katmandan ibaret.",
    noHidden: "Gizli katman yok",
    oneHidden: "Tek gizli katman",
    accuracy: "Doğruluk",
    trainBoth: "İki ağı da eğit",
    trainBothShort: "İkisini eğit",
    pauseBoth: "İkisini de duraklat",
    startOver: "Baştan başla",
    caption: "İkisini yan yana çalıştırın ve soldakinin nerede pes ettiğini izleyin.",
  },

  descent: {
    slopeHint: "backprop'un her a\u011f\u0131rl\u0131\u011fa verdi\u011fi tek say\u0131",
    kicker: "Nasıl öğreniyor",
    title: "Yokuş aşağı, her seferinde küçük bir adım.",
    lede: "Öğrenme, ansızın gelen bir kavrayış değildir. Bir yamaçta gradyanın tersi yönünde yuvarlanan bir top gibidir ve her şeyi belirleyen, attığı adımların büyüklüğüdür.",
    learningRate: "Öğrenme oranı",
    roll: "Yuvarla",
    oneStep: "Tek adım",
    weight: "ağırlık",
    loss: "kayıp",
    slope: "eğim",
    nextStep: "sonraki adım",
    steps: "adım",
    curveLabel: (w: string, l: string, s: string) =>
      `Kayıp eğrisi; top ${w} ağırlığında, kayıp ${l}, eğim ${s}.`,
  },

  loop: {
    kicker: "Döngü",
    title: "Dört adım, işe yarayana kadar tekrarlanır.",
    lede: "Şimdiye kadar izlediğiniz her şey, saniyede binlerce kez çalışan şu dört aşamadan ibaret.",
    cards: {
      forward: {
        title: "İleri geçiş",
        body: "Her nöron girdilerini ağırlıklarıyla çarpar, bir bias ekler ve sonucu ezer. Bunu katman katman tekrarlayın; içeri giren bir nokta, dışarı çıkan bir tahmine dönüşür.",
      },
      loss: {
        title: "Kayıp",
        body: "Tahmini gerçek etiketle karşılaştırın ve farkın karesini alın. Ortaya bütün ağ için tek bir sayı çıkar ve ağın küçültmeye çalıştığı tek şey de budur.",
      },
      backprop: {
        title: "Geri yayılım",
        body: "Hatayı zincir kuralıyla katmanlar boyunca geriye taşıyın. Her bir ağırlık, hataya ne kadar katkıda bulunduğunu öğrenir: kendi gradyanını.",
      },
      descent: {
        slopeHint: "backprop'un her a\u011f\u0131rl\u0131\u011fa verdi\u011fi tek say\u0131",
        title: "Gradyan inişi",
        body: "Her ağırlığı kendi gradyanının tersi yönde küçük bir adım kaydırın. Öğrenme oranı, o adımın büyüklüğüdür. Sonra bunu binlerce kez yineleyin.",
      },
    },
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
    kicker: "Görev",
    title: "Spirali olabildiğince az nöronla çözün.",
    lede: "On altı nöronla herkes çözer. Asıl soru, ağ şekli tutamaz hâle gelmeden önce kaça kadar inebildiğiniz.",
    objective: "Hedef",
    objectiveBody: (accuracy: number) =>
      `Spiralde %${accuracy} test doğruluğuna ulaşın. Sonra aynısını daha az nöronla yapın.`,
    hiddenLayers: "Gizli katman",
    neuronsPerLayer: "Katman başına nöron",
    learningRate: "Öğrenme oranı",
    train: "Eğit",
    pause: "Duraklat",
    newAttempt: "Yeni deneme",
    yourBest: "En iyiniz",
    none: "Henüz yok.",
    best: (neurons: number, epoch: number) =>
      `${neurons} nöron, ${epoch.toLocaleString("tr-TR")}. epokta çözüldü.`,
    totalNeurons: (n: number) => `${n} nöron`,
    solvedAnnounce: (neurons: number) => `${neurons} nöronla çözüldü.`,
  },

  recap: {
    lessons: [
      "Bir nöron, ağırlıklı bir toplam ve bir ezme işleminden ibarettir; tek başına yalnızca düz bir çizgi çizebilir",
      "Gizli katmanlar o çizgiyi büker; XOR bir gizli katman olmadan çözülemez",
      "Her nöron kendi özniteliğini öğrenir, sonraki katman da bunları birleştirir",
      "Kayıp ağın ne kadar yanıldığını söyler; geri yayılım ise hangi ağırlığın sorumlu olduğunu",
      "Gradyan inişi her ağırlığı yokuş aşağı iter; öğrenme oranı da atılan adımın büyüklüğüdür",
      "Adım çok küçükse sürünür, çok büyükse hedefi aşar; hiçbiri manzaranın tamamını görmez",
    ],
    footer:
      "Az önce izlediğiniz her şey 300 satırlık sıradan aritmetikti. Bugünün yapay zekâsının arkasındaki modeller de aynı dört adımdan oluşuyor, sadece çok daha fazla ağırlıkla.",
  },
};

export default copy;
