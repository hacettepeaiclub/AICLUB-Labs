import type en from "../en/multilayer-perceptrons";

/** Türkçe metin: multilayer-perceptrons. Şekli `en/multilayer-perceptrons.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    backpropagation:
      "Bu laboratuvarın eğitimde kullandığı geri yayılım yöntemini destekler. Buradaki ağ, makalede anlatılan ağ değil, küçük bir öğretim modelidir.",
  },
  question: "Tek bir katman aslında neyi değiştiriyor?",
  diagram: {
    diagramLabel: (shape: string) =>
      `Ağ şeması: ${shape} nöron. Her düğüm, o nöronun girdi karesi boyunca neye tepki verdiğini gösterir.`,
    neuron: (label: string) => `${label} nöronu`,
    layers: {
      input: "Girdi",
      output: "Çıktı",
      hidden: (layer: number) => `Gizli ${layer}`,
      hiddenShort: (layer: number) => `G${layer}`,
    },
    inputNode: "girdi",
    bias: "bias",
    eachSquare: "Her kare, bir nöronun girdiye kendi bakışı.",
    pushesUp: "yukarı iter",
    pushesDown: "aşağı iter",
    thickness: "kalınlık gücü gösterir",
    editHint:
      "Ağı burada kurun: her gizli katmanın altında − ve +. Her değişiklik eğitimi baştan başlatır.",
    addLayer: "+ Katman ekle",
    addNeuron: (layer: string) => `${layer} katmanına nöron ekle`,
    removeNeuron: (layer: string) => `${layer} katmanından nöron çıkar`,
    removeLayer: (layer: string) => `${layer} katmanını kaldır`,
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
    idle: "İkisini yan yana çalıştır. Soldaki bir noktadan sonra daha iyiye gidemez.",
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
    rolling: "Teğet doğrusunu izle: adımın elindeki tek bilgi onun dikliği.",
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
    currentlyWrong: "Şu an yanlış",
    dataAndArchitecture: "Veri ve öğrenme",
    drawHint: "Nokta eklemek için tuvale tıkla ya da sürükle.",
    caption:
      "Solda: ağın her yerde ne tahmin ettiği. Sağda: aynı ağın içeriden görünümü, nöron başına bir kare.",
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
      "Çizgiyi taşımak için karenin üzerinde sürükle; döndürmek ve kenarını keskinleştirmek için mavi ucu sürükle.",
    slideHandle: "Çizginin konumu. Ok tuşları onu okunun yönünde kaydırır.",
    turnHandle:
      "Okun ucu: iki ağırlık. Sol ve sağ döndürür, yukarı ve aşağı keskinleştirir ya da yumuşatır.",
    weightsAndBias: "Ağırlıklar ve bias",
    caption:
      "Ağırlıkları değiştirsen de tek nöronun karar sınırı doğru olarak kalır. Bu sınırla hangi noktaların ayrılamadığına bak.",
    notes: {
      tanh: "−1…1 aralığına sıkıştırır. Yumuşak, simetrik, güvenli bir varsayılan.",
      relu: "Pozitifleri geçirir, negatifleri düzler. Hızlı ve modern varsayılan.",
      sigmoid: "0…1 aralığına sıkıştırır. Tarihsel ve takılmaya yatkın.",
    },
    kicker: "Sonuna kadar yakınlaşın",
    title: "Tek nöron hangi noktaları ayırabilir?",
    lede: "Tek nöron, iki girdiyi ağırlıklarıyla çarpar, sabit terimi ekler ve sonucu bir aktivasyon fonksiyonundan geçirir. Aşağıda bu parametreleri değiştirebilirsin.",
    weight1: "x₁ ağırlığı",
    weight2: "x₂ ağırlığı",
    bias: "Bias",
    activation: "Aktivasyon",
    note: "Sınırı taşıyıp döndürerek bütün noktaları ayırmayı dene. Tek nöronun karar sınırı yine bir doğrudur.",
    canvasLabel: "Tek bir nöronun girdi düzlemi üzerindeki çıktısı.",
    activations: {
      tanh: "−1…1 aralığına ezer. Düzgün, simetrik, güvenli bir başlangıç.",
      relu: "Pozitifleri geçirir, negatifleri düzler. Hızlı ve günümüzün varsayılanı.",
      sigmoid: "0…1 aralığına ezer. Tarihsel bir seçim; öğrenmeyi tıkamaya eğilimli.",
    },
  },

  handXor: {
    caption:
      "Her nokta, düştüğü taraf yüzünden doğru ya da yanlış; halkalı olanlar yanlış. Hangi tarafın hangi sınıf olduğu, hangisi daha çok tutturuyorsa o yönde için seçiliyor.",
    announce: (accuracy: string) => `Noktaların ${accuracy} kadarı doğru tarafta.`,
    canvasLabel: (lines: number, accuracy: string) =>
      `Sürükleyebileceğin ${lines === 1 ? "tek bir çizgiyle" : "iki çizgiyle"} XOR noktaları. ${accuracy} kadarı doğru tarafta.`,
    slideHandle: (i: number) => `Çizgi ${i}: konumu. Ok tuşları onu kaydırır.`,
    turnHandle: (i: number) =>
      `Çizgi ${i}: okun ucu, iki ağırlığı. Ok tuşları döndürür ve keskinleştirir.`,
    modeLabel: "Yerleştirdiğin nöronlar",
    modes: { one: "Tek çizgi", two: "İki çizgi" },
    oneHint: "Çizgiyi sürükle, ucundan tutup döndür. Her noktayı kendi tarafına almaya çalışın.",
    ceilingReached: (ceiling: string) =>
      `Tek bir çizginin ulaşabileceği en iyisi bu: ${ceiling}. Bu karede hiçbir çizgi daha iyisini yapamaz. Tek bir nöronun çarptığı duvar budur.`,
    twoHint:
      "Şimdi iki nöron ve yalnızca iki okun da gösterdiği yerde evet diyen bir çıktı. Karşılıklı iki köşeyi içine alan bir bant oluşturun.",
    twoBeaten: (ceiling: string) =>
      `Tek bir çizginin en fazla ulaşabildiği ${ceiling} değerini geçtin. İki gizli nöron ve bir çıktı: elle bir gizli katman kurdun.`,
    figures: {
      accuracy: "Doğru tarafta",
      best: "En iyin, tek çizgi",
      bestHint: "bu ziyarette",
      ceiling: "Bir çizginin en iyisi",
      ceilingHint: "her açı taranarak bulundu",
    },
  },
  layers: {
    panelLabel: (title: string, accuracy: number, epoch: number) =>
      `${title}: ${epoch} epok sonra XOR noktalarının %${accuracy} kadarı doğru sınıflandırıldı.`,
    kicker: "Katmanlar neden gerekli",
    title: "Dört nokta neden tek doğruyla ayrılamaz?",
    lede: "XOR verisinde aynı sınıftaki noktalar karşılıklı köşelerdedir. Tek bir doğru bu sınıfları ayıramaz. Gizli katman ekleyerek ağın karar sınırını nasıl değiştirdiğini karşılaştır.",
    noHidden: "Gizli katman yok",
    oneHidden: "Tek gizli katman",
    accuracy: "Doğruluk",
    trainBoth: "İki ağı da eğit",
    trainBothShort: "İkisini eğit",
    pauseBoth: "İkisini de duraklat",
    startOver: "Baştan başla",
    caption: "İkisini yan yana çalıştır. Soldaki bir noktadan sonra daha iyiye gidemez.",
  },

  descent: {
    slopeHint: "backprop'un her ağırlığa verdiği tek sayı",
    kicker: "Nasıl öğreniyor",
    title: "Ağırlıklar kaybı nasıl azaltır?",
    lede: "Ağırlıklar, kaybı azaltmak için gradyanın ters yönünde güncellenir. Adım boyunu değiştirerek yakınsama, salınım ve uzaklaşma davranışlarını karşılaştır.",
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
    title: "Bir eğitim adımında ne olur?",
    lede: "Eğitim bu dört işlemi tekrarlar: tahmin üretme, kaybı hesaplama, gradyanı bulma ve ağırlıkları güncelleme.",
    cards: {
      forward: {
        title: "İleri geçiş",
        body: "Her nöron girdilerini ağırlıklarıyla çarpar, bir bias ekler ve sonucu ezer. Bunu katman katman tekrarlayın; içeri giren bir nokta, dışarı çıkan bir tahmine dönüşür.",
      },
      loss: {
        title: "Kayıp",
        body: "Tahmini gerçek etiketle karşılaştır ve farkın karesini alın. Ortaya bütün ağ için tek bir sayı çıkar ve ağın küçültmeye çalıştığı tek şey de budur.",
      },
      backprop: {
        title: "Geri yayılım",
        body: "Hatayı zincir kuralıyla katmanlar boyunca geriye taşı. Her bir ağırlık, hataya ne kadar katkıda bulunduğunu öğrenir: kendi gradyanını.",
      },
      descent: {
        slopeHint: "backprop'un her ağırlığa verdiği tek sayı",
        title: "Gradyan inişi",
        body: "Her ağırlığı kendi gradyanının tersi yönde küçük bir adım kaydırın. Öğrenme oranı, o adımın büyüklüğüdür. Sonra bunu binlerce kez yineleyin.",
      },
    },
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
    kicker: "Görev",
    title: "Spirali en az kaç nöronla ayırabilirsin?",
    lede: "Spiral verisini ayırırken gizli katmandaki nöron sayısını azalt. Görevin doğruluk koşulunu sağlayan en küçük ağı bulmaya çalış.",
    objective: "Hedef",
    objectiveBody: (accuracy: number) =>
      `Spiralde %${accuracy} test doğruluğuna ulaşın. Sonra aynısını daha az nöronla yapın.`,
    hiddenLayers: "Gizli katman",
    neuronsPerLayer: "Katman başına nöron",
    learningRate: "Öğrenme oranı",
    train: "Eğit",
    pause: "Duraklat",
    newAttempt: "Yeni deneme",
    yourBest: "En iyin",
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
      "Bu küçük ağın eğitimi ileri hesaplama, kayıp, geri yayılım ve ağırlık güncellemesinden oluşur. Daha büyük modeller aynı ilkeleri çok daha fazla parametreyle kullanır.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Ağı eğiterek iki sınıfın karar sınırını izle. Eğitim verisine yeni noktalar ekleyebilir ve ağın yapısını değiştirebilirsin.",
    stages: {
      playground: {
        data: "Her nokta iki sınıftan birine ait. Arkadaki renkler, ağın her yer için tahmini.",
        train:
          "Eğitim zaten sürüyor: ağırlıklar adım adım değişir, bölgeler de noktalara uyacak biçimde yeniden şekillenir. Bu düğme eğitimi duraklatır.",
        draw: "Resme tıklayarak iki renkten de nokta ekle ya da hepsini silin; ağ yeniden uyum sağlamak zorunda kalır.",
        setup: "Veri, gürültü, aktivasyon ve adım boyu burada.",
      },
      neuron: {
        line: "Tek bir nöron: iki ağırlık, bir bias ve bir sıkıştırma. Sınırını taşımak için resmin üzerinde sürükle.",
        weight: "Ya da sayıları doğrudan ayarla. Tur ilk ağırlığı değiştirdi; çizgi döndü.",
        bias: "Bias çizgiyi döndürmeden kaydırır. Nasıl ayarlarsanız ayarla, çizgi düz kalır.",
      },
      handXor: {
        points: "Dört XOR noktası. Her birini doğru tarafa getirmek için çizgiyi sürükle.",
        mode: "Tek çizgi en fazla üçünü doğru yapabilir. Tur size ikinci bir çizgi verdi.",
        score:
          "Kaçının doğru olduğu, en iyi sonucun ve bu kadar çizgiyle ulaşılabilecek en yüksek değer.",
      },
      layers: {
        pair: "Solda gizli katmanı olmayan bir ağ, sağda bir gizli katmanı olan. Veri aynı: XOR.",
        run: "İkisini yan yana çalıştır.",
        accuracy: "Soldaki tam doğruluğa ulaşamadan takılır; çözümün tamamı gizli katman.",
      },
      descent: {
        slope:
          "Tek bir ağırlık için kayıp. Topu oraya koymak için eğrinin herhangi bir yerine tıkla.",
        run: "Çalıştır: top eğimin tersine adım adım ilerler.",
        figures: "Ağırlık, kayıp, eğim ve bir sonraki adım: adım boyu çarpı eğim.",
        rate: "Adım boyunu buradan büyütün; top hedefi aşmaya başlar.",
      },
      challenge: {
        spiral: "İç içe iki sarmal. On altı nöronla herkes ayırabilir.",
        size: "Katman ve nöron sayısını buradan ayarla: ne kadar az, o kadar iyi.",
        run: "Eğitin ve şekli tutup tutamadığına bak.",
        result: "Doğruluk ve kullanılan nöron sayısı.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      neuron: "Bir nöron bir doğrudur",
      xor: "XOR ve gizli katman",
      learning: "Kayıp ve öğrenme",
    },
    notes: {
      "3b1b-nn": "Nöronlar, ağırlıklar ve bias'lar, en baştan.",
      "sq-nn": "Birkaç nöronun bir doğruyu nasıl eğriye çevirdiği.",
      "lavrenko-xor": "Üniversite dersi: tek gizli katman XOR'u çözer.",
      "tf-playground": "Tarayıcıda küçük bir ağ eğitin, katmanları kendin ekle.",
      "nielsen-universal": "Yeterli gizli nöronun neden her şekli çizebildiği.",
      "3b1b-gd": "Ağın kaybında yokuş aşağı yürüyerek nasıl öğrendiği.",
    },
  },
};

export default copy;
