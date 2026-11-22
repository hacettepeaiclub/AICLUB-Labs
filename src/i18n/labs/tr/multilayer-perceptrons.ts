import type en from "../en/multilayer-perceptrons";

/**
 * Türkçe metin: multilayer-perceptrons. Şekli `en/multilayer-perceptrons.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## multilayer-perceptrons), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır.
 */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    backpropagation:
      "Bu lab'ın eğitimde kullandığı geri yayılım yöntemini savunur. Buradaki ağ, makalede anlatılan ağ değil, küçük bir öğretim modelidir.",
  },
  question: "Tek bir gizli katman neyi değiştirir?",
  diagram: {
    diagramLabel: (shape: string) =>
      `Ağ şeması: ${shape} nöron. Her düğüm, o nöronun girdi karesinin her noktasında verdiği yanıtı gösterir.`,
    neuron: (label: string) => `${label} nöronu`,
    layers: {
      input: "Girdi",
      output: "Çıktı",
      hidden: (layer: number) => `Gizli ${layer}`,
      hiddenShort: (layer: number) => `G${layer}`,
    },
    inputNode: "girdi",
    bias: "bias",
    eachSquare: "Her kare, bir nöronun bütün girdi karesine verdiği yanıt.",
    pushesUp: "artırır",
    pushesDown: "azaltır",
    thickness: "kalınlık: ağırlığın büyüklüğü",
    editHint:
      "Ağı burada kur: her gizli katmanın altında − ve + var. Her değişiklik eğitimi baştan başlatır.",
    addLayer: "+ Katman ekle",
    addNeuron: (layer: string) => `${layer} katmanına nöron ekle`,
    removeNeuron: (layer: string) => `${layer} katmanından nöron çıkar`,
    removeLayer: (layer: string) => `${layer} katmanını kaldır`,
  },
  liveTraining: "Canlı eğitim",

  canvasLabel: (points: number, accuracy: number) =>
    `İki sınıfta ${points} nokta. Ağ şu anda eğitim noktalarının %${accuracy} kadarını doğru sınıflıyor; gölgeli zemin, ağın diğer her noktada tahmin ettiği sınıftır.`,
  datasets: {
    gauss: { label: "İki küme", hint: "Tek bir doğru yeter." },
    circle: { label: "Çember", hint: "Eğri bir sınır gerekir; hiçbir doğru ayıramaz." },
    xor: { label: "XOR", hint: "Klasik örnek: gizli katman olmadan ayrılamaz." },
    spiral: { label: "Spiral", hint: "Zor. Çok nöron ve uzun eğitim gerekir." },
  },
  classA: "A sınıfı",
  classB: "B sınıfı",
  keyboardHint: {
    trainPause: "eğitimi başlatır ya da duraklatır ·",
    restart: "yeni rastgele ağırlıklarla baştan başlatır",
  },
  layersCaption: {
    solved:
      "Gizli katmanı olmayan ağ yazı tura düzeyinde takıldı: hiçbir doğru bu dört köşeyi ayıramaz. Gizli katman karar sınırını büker ve noktalar ayrılır.",
    idle: "İki ağı yan yana eğit ve soldakinin nerede takıldığına bak.",
  },
  layersPanels: {
    flat: {
      title: "Gizli katman yok",
      subtitle: "İki girdi doğrudan çıktıya bağlı: tek bir nöron.",
    },
    deep: {
      title: "Tek gizli katman",
      subtitle: "Aynı ağ, arada dört nöronlu bir katmanla.",
    },
  },
  descentNote: {
    overshoot:
      "Dibi aştı. Her adım dibin ötesine sıçrıyor ve karşı yamaçta daha yükseğe iniyor; kayıp büyüyerek patlıyor.",
    deep: "En derin vadiye yerleşti. Sağlıklı bir eğitim böyle görünür.",
    shallow:
      "Yerleşti, ama sağdaki sığ çukura. Gradient descent yalnızca bulunduğu noktadaki eğimi görür, kayıp eğrisinin tamamını görmez.",
    rolling: "Teğet doğrusuna bak: adımın kullandığı tek bilgi onun eğimidir.",
  },
  neuronLabel: (w1: string, w2: string, bias: string) =>
    `Tek bir nöronun girdi karesi üzerindeki çıktısı; ağırlıklar ${w1} ve ${w2}, bias ${bias}.`,
  solvedBadge: "Çözüldü",
  notYet: "Henüz değil",
  loopCards: {
    forward: { headline: "Bir tahmin" },
    loss: { headline: "Ne kadar yanıldı?" },
    backprop: { headline: "Hangi ağırlık ne kadar sorumlu?" },
    descent: { headline: "Her ağırlığı yokuş aşağı kaydır" },
  },
  playground: {
    currentlyWrong: "Şu an yanlış",
    dataAndArchitecture: "Veri ve öğrenme",
    drawHint: "Nokta eklemek için tuvale tıkla ya da sürükle.",
    caption:
      "Solda: ağın her noktada tahmin ettiği sınıf. Sağda: aynı ağın içi, her nöron için bir kare.",
    draw: "Çiz",
    data: "Veri",
    noise: "Gürültü",
    activation: "Aktivasyon fonksiyonu",
    learningRate: "Öğrenme oranı",
    train: "Eğit",
    pause: "Duraklat",
    clearPoints: "Temizle",
    newSample: "Yeni örneklem",
    insideTitle: "Ağın içi",
    insideBody:
      "Aynı ağın ikinci bir görünümü. Her kare, bir nöronun bütün girdi karesine verdiği yanıtı gösterir: önceki katmanın ürettiği öznitelikler ve sonraki katmanın kullanacağı girdiler.",
    canvasLabel: "Karar yüzeyi ve üzerine çizilmiş eğitim verisi.",
    playPause: "Boşluk",
  },

  stats: {
    epoch: "Epok",
    loss: "Kayıp",
    trainAcc: "Eğitim doğruluğu",
    testAcc: "Test doğruluğu",
    curveLabel: "Son birkaç saniyedeki eğitim kaybı, logaritmik ölçekte.",
    announce: (percent: number) => `Eğitim doğruluğu yüzde ${percent}.`,
  },

  neuron: {
    dragHint:
      "Doğruyu taşımak için karenin üzerinde sürükle; döndürmek ve geçişini keskinleştirmek için mavi ucu sürükle.",
    slideHandle: "Doğrunun konumu. Ok tuşları onu okun yönünde kaydırır.",
    turnHandle:
      "Okun ucu: iki ağırlık. Sol ve sağ ok tuşları döndürür; yukarı ve aşağı ok tuşları geçişi keskinleştirir ya da yumuşatır.",
    weightsAndBias: "Ağırlıklar ve bias",
    caption:
      "Neyi yapamadığına dikkat et: doğruyu nasıl oynatırsan oynat, karar sınırı düz kalır. Tek nöronun bütün sınırı budur ve bir sonraki bölümün nedeni de bu.",
    notes: {
      tanh: "Çıktıyı −1…1 aralığına sıkıştırır. Yumuşak, simetrik, güvenli bir varsayılan.",
      relu: "Pozitif değerleri geçirir, negatifleri sıfırlar. Hızlı ve günümüzün varsayılanı.",
      sigmoid: "Çıktıyı 0…1 aralığına sıkıştırır. Tarihsel bir seçim; eğitimi yavaşlatmaya yatkın.",
    },
    kicker: "Sonuna kadar yaklaş",
    title: "Bir nöron sandığından basittir.",
    lede: "Ne belleği ne mantığı var. Üç sayı ve bir sıkıştırma: alanın bütünü bu birim üzerine kurulur. Nöron iki girdiyi ağırlıklarıyla çarpar, bias'ı ekler ve sonucu bir aktivasyon fonksiyonundan geçirir.",
    weight1: "x₁ ağırlığı",
    weight2: "x₂ ağırlığı",
    bias: "Bias",
    activation: "Aktivasyon fonksiyonu",
    note: "Neyi yapamadığına dikkat et: doğruyu nasıl oynatırsan oynat, karar sınırı düz kalır. Tek nöronun bütün sınırı budur ve bir sonraki bölümün nedeni de bu.",
    canvasLabel: "Tek bir nöronun girdi karesi üzerindeki çıktısı.",
    activations: {
      tanh: "Çıktıyı −1…1 aralığına sıkıştırır. Yumuşak, simetrik, güvenli bir varsayılan.",
      relu: "Pozitif değerleri geçirir, negatifleri sıfırlar. Hızlı ve günümüzün varsayılanı.",
      sigmoid: "Çıktıyı 0…1 aralığına sıkıştırır. Tarihsel bir seçim; eğitimi yavaşlatmaya yatkın.",
    },
  },

  handXor: {
    caption:
      "Her nokta, doğrunun hangi tarafına düştüğüne göre doğru ya da yanlış sınıflanır; halkalı olanlar yanlış. Hangi tarafın hangi sınıf sayılacağı, daha çok noktayı doğru sınıflayan seçeneğe göre senin yerine seçilir.",
    announce: (accuracy: string) => `Noktaların ${accuracy} kadarı doğru tarafta.`,
    canvasLabel: (lines: number, accuracy: string) =>
      `XOR noktaları ve sürükleyebileceğin ${lines === 1 ? "tek doğru" : "iki doğru"}. Noktaların ${accuracy} kadarı doğru tarafta.`,
    slideHandle: (i: number) => `${i}. doğrunun konumu. Ok tuşları onu kaydırır.`,
    turnHandle: (i: number) =>
      `${i}. doğrunun okunun ucu: iki ağırlığı. Ok tuşları döndürür ve geçişi keskinleştirir.`,
    modeLabel: "Yerleştirdiğin nöronlar",
    modes: { one: "Tek doğru", two: "İki doğru" },
    oneHint:
      "Doğruyu sürükle, ucundan tutup döndür. Her noktayı kendi sınıfının tarafına almaya çalış.",
    ceilingReached: (ceiling: string) =>
      `Tek bir doğrunun ulaşabileceği en iyi sonuç bu: ${ceiling}. Bu karede hiçbir doğru daha iyisini yapamaz. Tek bir nöronun aşamadığı sınır budur.`,
    twoHint:
      "Şimdi iki nöron ve yalnızca iki okun da gösterdiği bölgede evet diyen bir çıktı var. Karşılıklı iki köşeyi içine alan bir bant oluştur.",
    twoBeaten: (ceiling: string) =>
      `Tek bir doğrunun en fazla ulaşabildiği ${ceiling} sonucunu geçtin. İki gizli nöron ve bir çıktı: elle bir gizli katman kurdun.`,
    figures: {
      accuracy: "Doğru tarafta",
      best: "Tek doğruyla en iyin",
      bestHint: "bu ziyarette",
      ceiling: "Bir doğrunun en iyisi",
      ceilingHint: "bütün açılar taranarak bulundu",
    },
  },
  layers: {
    panelLabel: (title: string, accuracy: number, epoch: number) =>
      `${title}: ${epoch} epok sonra XOR noktalarının %${accuracy} kadarı doğru sınıflandı.`,
    kicker: "Neden katman",
    title: "Yapay zekâyı yıllarca durduran dört nokta.",
    lede: "XOR: iki sınıf karşılıklı köşelerde. Tek bir nöron bu sınıfları ayıramaz; 1969'da bu gözlem, alana duyulan ilginin uzun süre azalmasına katkıda bulundu. Çözüm tek bir gizli katmandır.",
    noHidden: "Gizli katman yok",
    oneHidden: "Tek gizli katman",
    accuracy: "Doğruluk",
    trainBoth: "İki ağı da eğit",
    trainBothShort: "İkisini eğit",
    pauseBoth: "İkisini duraklat",
    startOver: "Baştan başla",
    caption: "İki ağı yan yana eğit ve soldakinin nerede takıldığına bak.",
  },

  descent: {
    slopeHint: "geri yayılımın her ağırlık için verdiği tek sayı",
    kicker: "Nasıl öğrenir",
    title: "Yokuş aşağı, her seferinde küçük bir adım.",
    lede: "Öğrenme bir kavrayış değildir. Eğimli bir yüzeyde, gradyanın tersi yönünde ilerleyen bir top gibidir ve adımlarının büyüklüğü sonucu büyük ölçüde belirler. Öğrenme oranını değiştir ve topun yakınsamasını, salınmasını ya da uzaklaşmasını karşılaştır.",
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
    title: "Dört adım, ağ öğrenene kadar tekrar.",
    lede: "Şimdiye kadar izlediğin her şey bu dört adımdır; saniyede binlerce kez çalışır.",
    cards: {
      forward: {
        title: "İleri geçiş",
        body: "Her nöron girdilerini ağırlıklarıyla çarpar, bias'ı ekler ve sonucu aktivasyon fonksiyonundan geçirir. Bu katman katman tekrarlanır; içeri giren bir nokta, dışarı çıkan bir tahmine dönüşür.",
      },
      loss: {
        title: "Kayıp",
        body: "Tahmin gerçek etiketle karşılaştırılır; bu lab farkın karesinin yarısını kullanır. Bütün eğitim noktalarının ortalaması tek bir sayı verir ve eğitimin küçültmeye çalıştığı tek şey budur.",
      },
      backprop: {
        title: "Geri yayılım",
        body: "Zincir kuralıyla, kayıptan başlayarak katmanlar boyunca geriye doğru ilerlenir. Her ağırlık için kaybın o ağırlığa göre türevi, yani gradyanı bulunur.",
      },
      descent: {
        slopeHint: "geri yayılımın her ağırlık için verdiği tek sayı",
        title: "Gradient descent",
        body: "Her ağırlık, kendi gradyanının tersi yönünde küçük bir adım kaydırılır. Öğrenme oranı gradyanı ölçekleyerek bu adımın büyüklüğünü etkiler; bu lab ağırlıkları küçük tutan bir L2 terimi de ekler. Sonra bu binlerce kez tekrarlanır.",
      },
    },
  },

  challenge: {
    architecture: "Mimari",
    neuronsUsed: "Kullanılan nöron",
    testAccuracy: "Test doğruluğu",
    target: "Hedef",
    objectiveLine: (accuracy: string) =>
      `Spiralde ${accuracy} test doğruluğuna ulaş, hem de olabildiğince az gizli nöronla.`,
    solvedNote: "Çözüldü. Şimdi bir nöron eksilt ve yeniden dene.",
    noBest: "Henüz yok. Çok nöronla başla, sonra ağ şekli tutamayana kadar azalt.",
    bestLine: (neurons: number, accuracy: string, epoch: number) =>
      `En iyi: ${neurons} gizli nöron, ${epoch.toLocaleString("tr-TR")} epok sonra ${accuracy}.`,
    canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
      `Spiral görevi: ${neurons} gizli nöron, ${epoch} epok sonra ${accuracy} test doğruluğu.`,
    announceSolved: (neurons: number, accuracy: string) =>
      `${neurons} gizli nöronla, ${accuracy} test doğruluğuyla çözüldü.`,
    kicker: "Görev",
    title: "Spirali olabildiğince az nöronla ayır.",
    lede: "On altı nöronla herkes çözer. Asıl soru, ağ şekli tutamaz hâle gelmeden nöron sayısını ne kadar azaltabileceğin.",
    objective: "Hedef",
    objectiveBody: (accuracy: number) =>
      `Spiralde %${accuracy} test doğruluğuna ulaş. Sonra aynısını daha az nöronla yap.`,
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
      "Bir nöron, ağırlıklı bir toplam ve bir sıkıştırmadan ibarettir; tek başına yalnızca düz bir karar sınırı çizebilir",
      "Gizli katmanlar bu sınırı büker; XOR, gizli katman olmadan ayrılamaz",
      "Her gizli nöron kendi özniteliğini öğrenir; sonraki katman bunları birleştirir",
      "Kayıp ağın ne kadar yanıldığını söyler; geri yayılım her ağırlığın kayba etkisini, yani gradyanı bulur",
      "Gradient descent her ağırlığı yokuş aşağı kaydırır; öğrenme oranı gradyanı ölçekleyerek adımın büyüklüğünü etkiler",
      "Adım çok küçükse eğitim çok yavaş ilerler, çok büyükse dibi aşar; iki durumda da yöntem kayıp eğrisinin tamamını görmez",
    ],
    footer:
      "Az önce izlediğin her şey 300 satırlık sade aritmetikti. Günümüzün yapay zekâ modellerinin arkasında da aynı dört adım var, yalnızca çok daha fazla ağırlıkla.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Küçük bir yapay sinir ağı iki renk noktayı ayırmayı öğreniyor; eğitim sürerken kendi noktalarını ekleyebilirsin.",
    stages: {
      playground: {
        data: "Her nokta iki sınıftan birine ait. Gölgeli zemin, ağın her noktada tahmin ettiği sınıftır.",
        train:
          "Eğitim zaten sürüyor: ağırlıklar adım adım değişir ve bölgeler noktalara uyacak biçimde yeniden şekillenir. Bu düğme eğitimi duraklatır.",
        draw: "İki renkten de nokta eklemek için resme tıkla ya da noktaları temizle; ağ yeni veriye uyum sağlamak zorunda kalır.",
        setup: "Veri, gürültü, aktivasyon fonksiyonu ve öğrenme oranı burada.",
      },
      neuron: {
        line: "Tek bir nöron: iki ağırlık, bir bias ve bir sıkıştırma. Sınırını taşımak için resmin üzerinde sürükle.",
        weight: "Ya da sayıları doğrudan ayarla. Tur ilk ağırlığı değiştirdi: doğru döndü.",
        bias: "Bias doğruyu döndürmeden kaydırır. Nasıl ayarlarsan ayarla, doğru düz kalır.",
      },
      handXor: {
        points: "Dört XOR noktası. Her birini doğru tarafa almak için doğruyu sürükle.",
        mode: "Tek doğru en fazla üçünü doğru sınıflar. Tur sana ikinci bir doğru verdi.",
        score:
          "Kaç noktanın doğru tarafta olduğu, en iyi sonucun ve bu kadar doğruyla ulaşılabilecek en yüksek değer.",
      },
      layers: {
        pair: "Solda gizli katmanı olmayan bir ağ, sağda bir gizli katmanı olan. Veri aynı: XOR.",
        run: "İkisini yan yana eğit.",
        accuracy: "Soldaki tam doğruluğa ulaşamadan takılır; farkı gizli katman yaratır.",
      },
      descent: {
        slope:
          "Tek bir ağırlık için kayıp. Topu oraya koymak için eğrinin herhangi bir yerine tıkla.",
        run: "Çalıştır: top eğimin tersi yönünde adım adım ilerler.",
        figures: "Ağırlık, kayıp, eğim ve bir sonraki adım: öğrenme oranı çarpı eğim.",
        rate: "Öğrenme oranını buradan büyüt ve topun dibi aşmaya başlamasına bak.",
      },
      challenge: {
        spiral: "İç içe iki sarmal. On altı nöronla herkes ayırabilir.",
        size: "Katman ve nöron sayısını buradan ayarla: ne kadar az, o kadar iyi.",
        run: "Eğit ve ağın şekli tutup tutamadığına bak.",
        result: "Test doğruluğu ve kullanılan nöron sayısı.",
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
      "lavrenko-xor": "Bir üniversite dersi: tek gizli katman XOR'u çözer.",
      "tf-playground": "Tarayıcıda küçük bir ağ eğit ve katmanları kendin ekle.",
      "nielsen-universal": "Yeterince gizli nöronun neden her şekle yaklaşabildiği.",
      "3b1b-gd": "Ağın, kaybında yokuş aşağı yürüyerek nasıl öğrendiği.",
      "d2l-mlp-book":
        "Doğrusal katmanların arasına neden doğrusal olmayan bir aktivasyon fonksiyonu gerektiğini açıklar. Bölümdeki denklemleri lab'daki nöronlar ve ağırlıklarla eşleştir.",
    },
  },
};

export default copy;
