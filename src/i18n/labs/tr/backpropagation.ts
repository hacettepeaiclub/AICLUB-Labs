import type en from "../en/backpropagation";

/**
 * Türkçe metin: backpropagation. Şekli `en/backpropagation.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## backpropagation), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır.
 */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    backpropagation:
      "Katmanlı ağları eğitmenin bir yolu olarak geri yayılımı savunur: kaybın her ağırlığa göre türevi katmanlar boyunca geriye doğru hesaplanır. Güncellemenin yönünü bu türevler, büyüklüğünü optimizasyon yöntemi ve adım boyu belirler. Bu sayfadaki ağlar makaledekiler değil, küçük öğretim örnekleridir.",
    linnainmaa:
      "Ters mod türev almanın yayımlanmış ilk anlatımı; geri yayılım bu genel yöntemin bir özel durumudur. Türevler, hesaplamanın içinden geriye doğru, her seferinde bir yerel adımla taşınır.",
    griewank:
      "Algoritmik türev almanın temel başvuru kitabı. Ters modun, girdi sayısı ne olursa olsun, skaler bir fonksiyonun tam gradyanını fonksiyonu hesaplamanın küçük, sabit bir katı maliyetle verdiğini gösterir. Beşinci bölümdeki yarışın ölçtüğü budur.",
    autodiffSurvey:
      "Otomatik türev almayı iki yöntemden ayırır: sembolik türevden ve sayısal türevden. Sayısal türevin sonlu farkları her girdi için ayrı bir hesaplama ister ve kesme ile yuvarlama hatası taşır. Bu sayfanın geri yayılımı merkezi farklarla denetlemesinin, tersini yapmamasının nedeni budur.",
    vanishing:
      "Çok sayıda adım boyunca geriye taşınan gradyanların neden üstel olarak küçüldüğünü ya da büyüdüğünü ve bunun uzun menzilli bağımlılıkları gradient descent ile öğrenmeyi neden zorlaştırdığını gösterir. Altıncı bölüm aynı çarpanlar çarpımını bir katman zincirinde gösterir.",
  },

  // 1 ----------------------------------------------------------------------
  pull: {
    title: "Çıktıyı çek",
    question:
      "Ağın çıktısını tut ve başka bir değere çek. Bunun için hangi ağırlıkların değişmesi gerekir?",
    caption:
      "Çıktıyı tuttuğun sürece her bağlantı, çıktıyı hedefe taşımak için önerilen ağırlık değişimini gösterir: değişim büyüdükçe çizgi kalınlaşır; mavi artışı, pembe azalışı gösterir. Kesikli çizgiler çıktıdan geriye doğru akar ve türevlerin hesaplandığı yönü gösterir. Önerilen değişimler, çıktının her ağırlığa göre türevinden (∂ŷ/∂θ) bulunur. Bıraktığında ağırlıklar tam bu kadar değişir.",
    announceLanded: (aimed: string, landed: string) => `Hedef ${aimed} idi, çıktı ${landed} oldu.`,
    announceAim: (target: string, leader: string) =>
      `Çıktı ${target} değerine çekiliyor. En büyük değişim ${leader} ağırlığında.`,
    diagramLabel: (out: string) =>
      `İki girdili, tanh kullanan iki nöronlu ve tek çıktılı bir ağ; çıktı şu an ${out}. Çıktıyı yukarı ya da aşağı sürükle veya seçip ok tuşlarını kullan, sonra Enter'a bas.`,
    bias: (name: string, value: string) => `${name} ${value}`,
    handleLabel: "Ağın çıktısı",
    handleValue: (out: string, target: string | null) =>
      target === null ? `Çıktı ${out}` : `Çıktı ${out}, ${target} değerine çekiliyor`,
    leaderLine: (leader: string, share: string) =>
      `Bu çekişte en çok ${leader} değişiyor: ${share} kadar değişirdi.`,
    landedLine: (aimed: string, landed: string) =>
      `Hedef ${aimed} idi, çıktı ${landed} oldu. Ağın doğrusal yaklaşımı tam ${aimed} öngörüyordu; aradaki farkı tanh'ın eğriliği yaratır.`,
    hint: "Sağdaki beyaz noktayı sürükle. Her bağlantı, ne kadar değişmesi gerektiğine göre parlar.",
    letGo: "Bırak",
    reset: "Baştan başla",
    tableTitle: "Her ağırlık ve çıktının ona göre türevi (∂ŷ/∂θ)",
    columns: { weight: "Ağırlık", value: "Değer" },
    figures: {
      output: "Çıktı",
      target: "Çekilen değer",
      landed: "Ulaşılan",
      missedBy: (miss: string) => `fark: ${miss}`,
    },
  },

  // 2 ----------------------------------------------------------------------
  zoom: {
    kicker: "Sayının anlamı",
    title: "Eğriye, teğetinden ayırt edilemeyene kadar yaklaş.",
    lede: "Bir ağırlık dışındaki bütün ağırlıkları sabit tut; kayıp o ağırlığın bir fonksiyonu, yani bir eğri olur. Eğrinin bir noktasına yaklaş ve eğrinin teğet doğrusuna nasıl yaklaştığına bak.",
    caption:
      "Kesikli doğrunun eğimi, geri yayılımın bu ağırlık için bulduğu kısmi türev ∂L/∂w₁₁'dir; ağırlık gradyanının bir bileşenidir. Uzaktan bakınca teğet eğriye pek uymaz; yaklaştıkça aradaki fark küçülür, çünkü teğet eğrinin o noktadaki yerel doğrusal yaklaşımıdır. Kısmi türev bu eğimdir: yalnızca bu ağırlık değiştiğinde kaybın ne hızla değiştiği. Eğri boyunca ilerlemek için grafiği sürükle.",
    announce: (half: string, slope: string, gap: string) =>
      `Pencere ±${half}. Geri yayılımın eğimi ${slope}; ölçülen eğimle farkı ${gap}.`,
    chartLabel: (w: string, half: string) =>
      `w₁₁ ağırlığı ${w} çevresinde ±${half} aralığında değişirken kayıp ve geri yayılımın öngördüğü teğet. Eğri boyunca ilerlemek için sürükle.`,
    axis: "w₁₁ ağırlığı",
    legend: { curve: "kayıp", tangent: "geri yayılımın eğimi" },
    zoomLabel: "Büyütme",
    zoomValue: (x: string) => `${x} kat`,
    figures: {
      backprop: "Geri yayılımın eğimi",
      backpropHint: "∂L/∂w₁₁, tek bir geri geçişten",
      secant: "Ölçülen eğim",
      secantHint: "pencere boyunca artış bölü genişlik",
      gap: "Fark",
    },
  },

  // 3 ----------------------------------------------------------------------
  chain: {
    kicker: "Zincir kuralı",
    title: "İlk kadranı çevir, sonuncuya bak.",
    lede: "Beş kadran birbirine bağlı; her biri bir öncekiyle döner. Her bağlantı komşusunu kendi oranıyla çevirir ve oranlar çarpılır.",
    caption:
      "Bir bağlantının üzerindeki sayı, o kadranın önceki kadrana göre yerel türevidir: önceki kadran çok az döndüğünde ne kadar döndüğü. Bu sayıların çarpımı, şu anki x için d′(x)'tir; son dönüşte ölçülen Δd ÷ Δx, dönüş küçüldükçe bu değere yaklaşır. Geri yayılım bu çarpmayı uzak uçtan başlayarak yapar.",
    announce: (x: string, d: string, product: string) =>
      `x = ${x}, d = ${d}. Şu anki x için d, x'in ${product} katı hızla değişiyor.`,
    diagramLabel: (values: string) =>
      `x, a, b, c ve d adlı beş kadran; değerleri ${values}. İlki bir denetimdir: döndürmek için sürükle ya da ok tuşlarını kullan.`,
    stages: ["a = 1,5x", "b = tanh a", "c = b²", "d = 2c − 1"],
    dialLabel: "İlk kadran, x",
    hint: "Mavi kadranı sürükleyerek döndür ya da seçip ok tuşlarını kullan. Oranı en iyi küçük dönüşler gösterir.",
    figures: {
      product: "Bağlantıların çarpımı",
      productHint: "zincir kuralıyla d′(x)",
      measured: "Son dönüşün",
      measuredHint: (dx: string) => `Δx = ${dx} için Δd ÷ Δx`,
      measuredEmpty: "ilk kadranı çevir",
    },
  },

  // 4 ----------------------------------------------------------------------
  ledger: {
    kicker: "Hesap sende",
    title: "Geri geçişi sen yap.",
    lede: "Gerçek bir kayıp: tek bir nöron, karesel hatası ve ağırlığı küçük tutan bir ceza terimi. İleri hesaplamanın değerleri yazılı. Gradyanları sen dolduracaksın; sıra önemlidir.",
    caption:
      "Bir düğümün gradyanı, onu okuyan bütün düğümlerden geri akan katkıların toplamıdır; bu yüzden o düğümlerin hepsi bilinmeden hesaplanamaz. Geri yayılımın kayıptan ağırlıklara doğru ilerlemesinin ve iki düğümün okuduğu w'nin iki katkıyı toplamasının nedeni budur.",
    refused: (node: string, waiting: string) =>
      `Henüz değil: ${node} değerini ${waiting} okuyor ve onun gradyanı henüz bilinmiyor. Önce okuyan düğümlerin hepsi doldurulmalı.`,
    filledAnnounce: (name: string, adj: string) => `∂L/∂${name} = ${adj}.`,
    diagramLabel:
      "L = (tanh(w·x + b) − y)² + 0,1·w² ifadesinin hesaplama çizgesi. Her düğüm ileri değerini gösterir; gradyanını doldurmak için bir düğüme dokun.",
    nodeDone: (name: string, value: string, adj: string) =>
      `${name}, değer ${value}, gradyan ${adj}.`,
    nodeOpen: (name: string, value: string) =>
      `${name}, değer ${value}, gradyan henüz doldurulmadı.`,
    nodeConst: (name: string, value: string) => `${name}, sabit, ${value}.`,
    rootLine: "∂L/∂L = 1. Her şey burada başlar: kaybın kendisine göre türevi 1'dir.",
    nodeLine: (name: string) =>
      `∂L/∂${name}: ${name} değerini okuyan her düğümden geri akan değer, o düğümün yerel türeviyle çarpılır ve toplanır.`,
    term: (reader: string) => `${reader} üzerinden:`,
    sum: (parts: string, total: string) => `iki yol toplanır: ${parts} = ${total}`,
    checked: (ours: string, numeric: string) =>
      `Bitti. Senin ∂L/∂w değerin ${ours}; w'yi biraz değiştirip kaybı ölçünce ${numeric} çıkıyor.`,
    reset: "Gradyanları temizle",
    figures: {
      filled: "Doldurulan",
      w: "∂L/∂w",
      wHint: "iki yolun toplamı",
    },
  },

  // 5 ----------------------------------------------------------------------
  cost: {
    kicker: "Neden geri yayılım",
    title: "Tek geri geçiş, ağırlık başına iki geçişe karşı.",
    lede: "Gradyanı bulmanın daha basit bir yolu var: her ağırlığı biraz değiştir, ağı yeniden çalıştır ve kayıptaki değişime bak. Bu yöntemi geri yayılımla bu tarayıcıda gerçekten yarıştır.",
    caption:
      "İki sütun da aynı gradyanı hesaplar: sayısal yöntem yaklaşık, geri yayılım tam değeri verir. Yarış, iki sonuç birbirine çok yakın olduğu için anlamlıdır. Sayısal yöntem her ağırlık için ağı iki kez çalıştırır, bu yüzden geçiş sayısı ağırlık sayısıyla büyür. Geri yayılım, ağırlık sayısı ne olursa olsun bir ileri ve bir geri geçiş ister. Süreler ve aralarındaki oran senin cihazına bağlıdır; değişmeyen, geçiş sayılarıdır.",
    announce: (ratio: string, params: number) =>
      `${params} ağırlıkta geri yayılım ${ratio} kat daha hızlıydı.`,
    sizeLine: (count: string, passes: number) =>
      `${count} ağırlıklı bir ağ: her birini biraz artırıp biraz azaltmak, ağı ${passes} kez çalıştırmak demek.`,
    numeric: "Her ağırlığı tek tek değiştir",
    backprop: "Geri yayılım",
    numericPasses: (n: number) => `${n} ileri geçiş`,
    backpropPasses: "1 ileri ve 1 geri geçiş",
    agree: (worst: string) => `İki yöntemin gradyanları arasındaki en büyük mutlak fark: ${worst}.`,
    widthLabel: "Gizli katman başına nöron",
    running: "Yarış sürüyor…",
    race: "Yarıştır",
    figures: {
      weights: "Ağırlık",
      ratio: "Geri yayılım kaç kat hızlı",
      ratioHint: "bu cihazda ölçüldü; ağ büyüdükçe genellikle artar",
    },
  },

  // 6 ----------------------------------------------------------------------
  depth: {
    kicker: "Nerede bozulur",
    title: "Ağı uzat, gradyanın nasıl söndüğüne bak.",
    lede: "Her katmanında tek nöron olan bir zincir. Katman eklemek için son katmanı sağa sürükle ve gradyanın ne kadarının hâlâ başa ulaştığına bak.",
    caption:
      "Her katman gradyanın büyüklüğünü |w × aktivasyon fonksiyonunun eğimi| ile çarpar. Sigmoid'in eğimi en çok dörtte birdir; bu yüzden w = 1 iken on katman gradyanın büyüklüğünü en az altı büyüklük mertebesi küçültür ve ilk katmanların öğrenmesi çok zorlaşır. ReLU'nun eğimi sinyal pozitifken 1'dir, yani katman başına çarpan w olur: gradyan yalnızca w = 1 iken değişmeden geçer, 1'den büyük bir w ise onu büyütür: gradyan patlar.",
    announce: (depth: number, first: string) =>
      `${depth} katman. Girdiye ulaşan gradyanın büyüklüğü ${first}.`,
    chartLabel: (depth: number, activation: string, first: string) =>
      `${activation} kullanan ${depth} katmanlı bir zincir. Çubuklar her katmana ulaşan gradyanın büyüklüğünü (mutlak değerini) logaritmik ölçekte gösterir; girdide ${first}.`,
    handleLabel: "Katman sayısı",
    end: "son",
    hint: "Sondaki mavi noktayı sürükle ya da seçip sol ve sağ ok tuşlarını kullan.",
    activationLabel: "Aktivasyon fonksiyonu",
    activations: { sigmoid: "Sigmoid", tanh: "Tanh", relu: "ReLU" },
    weightLabel: "Her katmandaki w ağırlığı",
    depthLabel: "Katman",
    secondaryLabel: "Ağırlık ve derinlik",
    figures: {
      first: "Girdide",
      firstHint: "sondaki gradyana oranı",
      factor: "Katman başına",
      factorHint: "ortalama çarpan büyüklüğü",
    },
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Hata ayıklama",
    title: "Birinin geri geçişi yanlış. Nerede olduğunu bul.",
    lede: "Bu sayfadaki üç hesaplama çizgesi; her birinin geri geçişinde bir hata var. Elinde uygulamada kullanılan araç var: gradyan kontrolü.",
    caption:
      "Bir parametreyi kontrol etmek, geri geçişin bulduğu gradyanı, o parametreyi biraz değiştirip kaybı ölçerek bulunan değerle karşılaştırır. Hangi parametrelerin ve nasıl tutmadığı hatanın yerini gösterir. Yanlış bir düğümü seçersen yalnızca hatanın orada olmadığını öğrenirsin.",
    announce: (solved: number, total: number) => `${total} hatanın ${solved} tanesi bulundu.`,
    cases: {
      neuron: {
        tab: "Nöron",
        task: "Sayfanın başındaki küçük ağ. Bir nöronun geri adımı yanlış.",
        hint: "Ağırlıkları tek tek kontrol et. Yanlış çıkanların hepsi hangi nörondan geçiyor?",
        solved:
          "Buldun. h₂, eğim olarak 1 − tanh²(z) yerine tanh(z) kullanmış. Yalnızca h₂'nin arkasındaki ağırlıklar yanlıştı; hatayı gösteren de buydu.",
      },
      fork: {
        tab: "Çatal",
        task: "Elle doldurduğun çizge. Bir değerin iki kez kullanıldığı yerde bir şey yanlış gidiyor.",
        hint: "b doğru çıkıyor, w çıkmıyor. w'de olup b'de olmayan ne?",
        solved:
          "Buldun. w'ye geri dönen iki yoldan yalnızca en son geleni kaldı: katkı toplanacağına öncekinin üzerine yazılmış. Paylaşılan her değer, katkılarını toplamalıdır.",
      },
      sign: {
        tab: "İşaret",
        task: "Aynı kayıp, hata y − h olarak yazılmış. İki gradyan da yanlış çıkıyor.",
        hint: "İkisini dikkatle karşılaştır: biri doğru değerin tam negatifi, diğeri değil. Bir işaret nerede kaybolmuş olabilir?",
        solved:
          "Buldun. Çıkarma işlemi, ikinci girdisi h için eksi işaretini unutmuş; bu yüzden h'nin arkasındaki her şeyin işareti ters çıktı. w'nin ceza teriminden gelen yolu oradan geçmiyor; w'nin yanlış olup tam ters olmamasının nedeni bu.",
      },
    },
    checkTitle: "Gradyan kontrolü",
    check: "Kontrol et",
    checkLegend: "Solda geri geçişin bulduğu, sağda değiştirerek ölçülen değer.",
    accuseTitle: "Hata nerede?",
    notYet: "Önce birkaç parametreyi kontrol et, sonra düğümü seç.",
    wrong: (name: string) => `${name} değil. Onun geri adımı doğru.`,
    pickLabel: "Vaka",
    reset: "İlerlememi sıfırla",
    solvedLabel: "Bulunan",
  },

  recap: {
    lessons: [
      "Kısmi türev bir eğimdir: kayba yeterince yakından bakınca eğri, o noktadaki teğetinden ayırt edilemez",
      "Zincir kuralı yerel türevleri çarpar; geri yayılım bu çarpmayı kayıptan geriye doğru yapar",
      "İki yerde kullanılan bir değer, iki yoldan gelen gradyanların toplamını alır",
      "Geri geçiş sırayla ilerler: bir düğümden önce, onu okuyan bütün düğümler hesaplanır",
      "Tek bir geri geçiş bütün ağırlıkların gradyanını verir; sayısal yöntem ağırlık başına iki geçiş ister",
      "Derin zincirler çok sayıda çarpanı çarpar: çarpanların büyüklüğü 1'in altındaysa gradyan kaybolur, üstündeyse patlar",
      "Gradyan kontrolü, geri yayılımın sonucunu sayısal olarak ölçülen değerle karşılaştırır; bozuk bir geri geçiş böyle yakalanır",
    ],
    footer:
      "Bugün gradyanla eğitilen yapay sinir ağları, bu sayfanın başındaki küçük ağdan milyarlarca ağırlığı olanlara kadar, gradyanlarını bu geri yürüyüşle hesaplar. Derin öğrenme kütüphaneleri bu hesabı senin yerine yazar; yazdıkları budur.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Küçük bir ağ ve çıktısı, tutup çekebileceğin bir nokta. Noktayı çekince her bağlantı, önerilen ağırlık değişimine göre parlar.",
    stages: {
      pull: {
        pull: "Bu nokta ağın çıktısı. Yukarı ya da aşağı sürükle veya ok tuşlarını kullan; tur onu yukarı çekti.",
        letGo: "Bıraktığında her ağırlık, önerilen değişim kadar değişir.",
        result:
          "Hedeflediğin değer, ulaşılan değer ve aradaki fark. Daha uzağa çektikçe fark büyür.",
      },
      zoom: {
        curve:
          "Tek bir ağırlık değişirken kayıp; kesikli doğru geri yayılımın bulduğu eğimi gösterir. Eğri boyunca sürükleyebilirsin.",
        zoom: "Tur sonuna kadar yaklaştı: eğri ile teğet artık neredeyse ayırt edilemiyor.",
        slope:
          "Geri yayılımın eğimi ve pencere boyunca ölçülen eğim yan yana. Yaklaştıkça fark küçülür: ∂L/∂w₁₁ bu eğimdir.",
      },
      chain: {
        dial: "İlk kadranı sürükleyerek ya da ok tuşlarıyla çevir. Tur onu biraz çevirdi.",
        links:
          "Her bağlantıdaki sayı, önceki kadran çok az döndüğünde o kadranın ne kadar döndüğüdür.",
        last: "Bağlantıların çarpımı ve son dönüşünde ölçülen oran yan yana. Dönüş küçüldükçe ikisi birbirine yaklaşır: zincir kuralı budur.",
      },
      ledger: {
        graph:
          "Gerçek bir kayıp, hesaplama çizgesi olarak. Her düğüm ileri değerini gösteriyor; gradyanları sen dolduracaksın.",
        tap: "Gradyanını doldurmak için bir düğüme dokun. İlk sırada kayıp var; tur onu doldurdu.",
        order:
          "Kaç düğümü doldurduğun ve iki yolun toplamı olan ∂L/∂w. Bir düğüme erken dokunursan neyi beklediğini söyler.",
      },
      cost: {
        columns:
          "Aynı gradyanı bulmanın iki yolu: her ağırlığı biraz değiştirip ağı yeniden çalıştırmak ya da tek bir geri geçiş.",
        width: "Bu ayar her katmandaki nöron sayısını belirler. Tur ağı genişletti.",
        race: "İkisini bu tarayıcıda yarıştır. Ağ genişledikçe sayısal yöntemin geçiş sayısı artar ve genellikle daha da geride kalır.",
      },
      depth: {
        chart: "Her katmana ulaşan gradyanın büyüklüğü, sondan başa doğru.",
        add: "Katman eklemek için son katmanı sağa sürükle ya da ok tuşlarını kullan. Tur dört katman ekledi.",
        activation:
          "Buradan başka bir aktivasyon fonksiyonu seç: ReLU'da katman başına çarpan w olur; w = 1 iken gradyan değişmeden geçer.",
      },
      challenge: {
        cases: "Her birinin geri geçişinde bir hata olan üç çizge. Buradan birini seç.",
        check:
          "Bir parametreyi kontrol et: geri geçişin bulduğu gradyan ölçülen değerle karşılaştırılır. Tur ilkini kontrol etti.",
        accuse: "Hatanın nerede olduğunu bulunca o düğümü buradan seç.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      slope: "Kısmi türev bir eğimdir; zincir kuralı",
      graph: "Hesaplama çizgesi ve geri geçişin sırası",
      depth: "Kaybolan ve patlayan gradyanlar",
      check: "Gradyan kontrolü",
    },
    notes: {
      "3b1b-backprop": "Geri yayılımın ne yaptığını önce formülsüz anlatır.",
      "3b1b-backprop-calc": "Aynı konu, zincir kuralı yazılarak.",
      "sq-chain": "Zincir kuralının gerçek sayılarla adım adım uygulanışı.",
      "karpathy-micrograd": "Geri yayılımı düğüm düğüm, yüz satır kadar kodla kendin kur.",
      "sq-backprop": "Her seferinde tek ağırlık: hangi yöne ve ne kadar değiştirileceği.",
      "cs231n-backprop":
        "Kapılar, yerel gradyanlar ve bir değer iki kez kullanıldığında katkıların toplanması.",
      "ng-vanishing":
        "1'in altındaki ya da üstündeki çarpanlardan oluşan uzun bir zincirin neden küçüldüğü ya da patladığı.",
      "ng-gradcheck":
        "Lab'ın son bölümündeki gibi, geri yayılımın sonucunu sayısal ölçümle karşılaştırmak.",
      "d2l-backprop-book":
        "İleri ve geri hesaplamayı aynı hesaplama çizgesi üzerinde izle. Denklemler, lab'daki yerel türevlerin nasıl birleşerek ağırlık gradyanlarına dönüştüğünü gösterir.",
    },
  },
};

export default copy;
