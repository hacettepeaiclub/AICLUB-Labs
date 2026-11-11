import type en from "../en/backpropagation";

/** Türkçe metin: backpropagation. Şekli `en/backpropagation.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    backpropagation:
      "Katmanlı ağları eğitmenin bir yolu olarak geri yayılımı destekler: hatayı katmanlar boyunca geriye taşı ve her ağırlığı payına düştüğü kadar değiştir. Bu sayfadaki ağlar makaledekiler değil, küçük öğretim örnekleridir.",
    linnainmaa:
      "Geri yayılımın bir özel durumu olduğu genel yöntemin, ters mod türevin ilk yayımlanmış anlatımı: türevleri bir hesaplamanın içinden, her seferinde bir yerel adımla geriye taşımak.",
    griewank:
      "Algoritmik türev almanın temel başvuru kitabı. Ters modun, girdi sayısı ne olursa olsun, skaler bir fonksiyonun tam gradyanını onu hesaplamanın küçük, sabit bir katı maliyetle verdiğini gösterir; beşinci bölümdeki yarışın ölçtüğü şey budur.",
    autodiffSurvey:
      "Otomatik türev almayı, sonlu farkları girdi başına bir hesap isteyen ve kesme ile yuvarlama hatası taşıyan sayısal türevden ve sembolik türevden ayırır. Bu sayfanın geri yayılımı sayısal türevle denetlemesinin, tersini yapmamasının nedeni budur.",
    vanishing:
      "Çok sayıda adım boyunca geriye taşınan gradyanların neden üstel olarak küçüldüğünü ya da patladığını ve bunun uzun menzilli bağımlılıkları gradient descent ile öğrenmeyi neden zorlaştırdığını gösterir. Altıncı bölüm, katmanlardan oluşan bir zincirde aynı çarpanlar çarpımıdır.",
  },

  // 1 ----------------------------------------------------------------------
  pull: {
    title: "Çıktı değiştiğinde hata nasıl değişir?",
    question:
      "Çıktı noktasını sürükle. Çıktının istediğin değere yaklaşması için hangi ağırlıklar değişmeli?",
    caption:
      "Bağlantılar, ağırlık güncellemesinin yönünü ve büyüklüğünü gösterir. Çizgi kalınlığı değişim miktarını belirtir. Noktayı bıraktığında hesaplanan güncellemeler uygulanır.",
    announceLanded: (aimed: string, landed: string) => `Hedef ${aimed} idi, çıktı ${landed} oldu.`,
    announceAim: (target: string, leader: string) =>
      `Çıktı ${target} değerine çekiliyor. En büyük payı ${leader} taşıyor.`,
    diagramLabel: (out: string) =>
      `İki girdili, iki tanh nöronlu ve tek çıktılı bir ağ; çıktı şu an ${out}. Çıktıyı yukarı ya da aşağı sürükle veya seçip ok tuşlarını kullan, sonra Enter'a bas.`,
    bias: (name: string, value: string) => `${name}  ${value}`,
    handleLabel: "Ağın çıktısı",
    handleValue: (out: string, target: string | null) =>
      target === null ? `Çıktı ${out}` : `Çıktı ${out}, ${target} değerine çekiliyor`,
    leaderLine: (leader: string, share: string) =>
      `Bu çekişin en büyük payını ${leader} taşıyor: ${share} kadar değişirdi.`,
    landedLine: (aimed: string, landed: string) =>
      `Hedef ${aimed} idi, çıktı ${landed} oldu. Ağın içinden çizilen düz bir çizgi tam ${aimed} diyordu; aradaki fark tanh'ın eğriliği.`,
    hint: "Sağdaki beyaz noktayı sürükle. Her bağlantı ne kadar değişmesi gerektiğiyle parlayacak.",
    letGo: "Bırak",
    reset: "Baştan başla",
    tableTitle: "Her ağırlık ve gradyanı",
    columns: { weight: "Ağırlık", value: "Değer" },
    figures: {
      output: "Çıktı",
      target: "Çekilen değer",
      landed: "Varılan",
      missedBy: (miss: string) => `${miss} kadar ıskaladı`,
    },
  },

  // 2 ----------------------------------------------------------------------
  zoom: {
    kicker: "Sayının anlamı",
    title: "Bir eğrinin eğimini nasıl ölçeriz?",
    lede: "Diğer ağırlıklar sabitken bir ağırlığın kaybı nasıl değiştirdiğini incele. Grafiğe yaklaştıkça eğri ile teğet doğrusu arasındaki fark küçülür.",
    caption:
      "Kesikli doğrunun eğimi, seçili ağırlık için hesaplanan gradyandır. Bu değer, ağırlıktaki küçük bir değişimin kaybı ne kadar değiştireceğini gösterir. Grafiği sürükleyerek başka bir noktayı incele.",
    announce: (half: string, slope: string, gap: string) =>
      `Pencere ±${half}. Geri yayılım ${slope} diyor; ölçülen eğim ${gap} kadar farklı.`,
    chartLabel: (w: string, half: string) =>
      `w₁₁ ağırlığı ${w} çevresinde ±${half} içinde değişirken kayıp ve geri yayılımın öngördüğü teğet. Eğri boyunca ilerlemek için sürükle.`,
    axis: "w₁₁ ağırlığı",
    legend: { curve: "kayıp", tangent: "geri yayılımın eğimi" },
    zoomLabel: "Büyütme",
    zoomValue: (x: string) => `${x} kat`,
    figures: {
      backprop: "Geri yayılım",
      backpropHint: "∂L/∂w₁₁, tek bir geri geçişten",
      secant: "Ölçülen eğim",
      secantHint: "pencere boyunca artış bölü genişlik",
      gap: "Fark",
    },
  },

  // 3 ----------------------------------------------------------------------
  chain: {
    kicker: "Zincir kuralı",
    title: "İlk ağırlık son çıktıyı nasıl etkiler?",
    lede: "Tek bir mile bağlı beş kadran; her biri bir öncekiyle dönüyor. Her bağlantı komşusunu kendi oranıyla çeviriyor ve oranlar çarpılıyor.",
    caption:
      "Bir bağlantının üzerindeki sayı, önceki kadran çok az döndüğünde o kadranın ne kadar döndüğüdür: yerel türevi. Son kadran hepsinin çarpımı kadar döner. Geri yayılım, bu çarpmanın uzak uçtan başlayarak yapılmasıdır.",
    announce: (x: string, d: string, product: string) =>
      `x ${x}, d ${d}; d, x'in ${product} katı hızla değişiyor.`,
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
    kicker: "Hesap sizde",
    title: "Gradyanları geriye doğru hesapla",
    lede: "Tek nöronun karesel hatasına, ağırlığın büyüklüğünü sınırlayan bir ceza ekleniyor. İleri hesaplama hazır. Gradyanları bağımlılık sırasına göre doldur.",
    caption:
      "Bir düğümün gradyanı, onu kullanan bütün dallardan gelen katkıların toplamıdır. Bu yüzden geriye doğru hesaplama kayıptan başlar. İki dalda kullanılan w için her iki katkı da toplanır.",
    refused: (node: string, waiting: string) =>
      `Henüz değil: ${node} değerini ${waiting} okuyor ve onun gradyanı henüz bilinmiyor. Önce bütün okuyucular gelir.`,
    filledAnnounce: (name: string, adj: string) => `∂L/∂${name} = ${adj}.`,
    diagramLabel:
      "L = (tanh(w·x + b) − y)² + 0,1·w² ifadesinin hesap grafiği. Her düğüm ileri değerini gösterir; gradyanını doldurmak için bir düğüme dokun.",
    nodeDone: (name: string, value: string, adj: string) =>
      `${name}, değer ${value}, gradyan ${adj}.`,
    nodeOpen: (name: string, value: string) =>
      `${name}, değer ${value}, gradyan henüz doldurulmadı.`,
    nodeConst: (name: string, value: string) => `${name}, bir sabit, ${value}.`,
    rootLine: "∂L/∂L = 1. Her şey burada başlar: kayıp, tam olarak kendisi kadar hızlı değişir.",
    nodeLine: (name: string) =>
      `∂L/∂${name}: ${name} değerini okuyan her düğümden geri akan, o düğümün yerel türeviyle çarpılır.`,
    term: (reader: string) => `${reader} üzerinden:`,
    sum: (parts: string, total: string) => `iki yol, toplanır: ${parts} = ${total}`,
    checked: (ours: string, numeric: string) =>
      `Bitti. ∂L/∂w değerin ${ours}; w'yi oynatıp ölçmek ${numeric} veriyor.`,
    reset: "Gradyanları temizle",
    figures: {
      filled: "Doldurulan",
      w: "∂L/∂w",
      wHint: "iki yolun toplamı",
    },
  },

  // 5 ----------------------------------------------------------------------
  cost: {
    kicker: "Neden kazandı",
    title: "Tek geçişte bütün ağırlıkların gradyanını bulmak",
    lede: "Her ağırlığı küçük miktarda değiştirip kaybı yeniden hesaplayarak da gradyan tahmin edilebilir. Bu sayısal yöntemin süresini geri yayılımla karşılaştır.",
    caption:
      "Merkezi sonlu fark yöntemi her ağırlık için iki ileri hesaplama yapar. Geri yayılım ise bir ileri ve bir geri geçiş kullanır. İki yöntemin sonuçları karşılaştırılır; süreler bu cihazda ölçülür.",
    announce: (ratio: string, params: number) =>
      `${params} ağırlıkta geri yayılım ${ratio} kat daha hızlıydı.`,
    sizeLine: (count: string, passes: number) =>
      `${count} ağırlıklı bir ağ: her birini yukarı ve aşağı oynatmak, ağı ${passes} kez çalıştırmak demek.`,
    numeric: "Her ağırlığı oynat",
    backprop: "Geri yayılım",
    numericPasses: (n: number) => `${n} ileri geçiş`,
    backpropPasses: "1 ileri ve 1 geri geçiş",
    agree: (worst: string) => `İkisi de aynı gradyanı buldu: en fazla ${worst} kadar farklılar.`,
    widthLabel: "Gizli katman başına nöron",
    running: "Yarışıyor…",
    race: "Yarıştır",
    figures: {
      weights: "Ağırlık",
      ratio: "Geri yayılım şu kadar hızlı",
      ratioHint: "ve fark ağ büyüdükçe açılıyor",
    },
  },

  // 6 ----------------------------------------------------------------------
  depth: {
    kicker: "Bozulduğu yer",
    title: "Katman sayısı arttıkça gradyan neden küçülür?",
    lede: "Tek nöronlu katmanlardan oluşan ağı uzat. Son noktayı sağa sürükledikçe katman sayısı artar. İlk katmana ulaşan gradyanı izle.",
    caption:
      "Her katman gradyanı w ile aktivasyonunun eğiminin çarpımıyla çarpar. Sigmoid'in eğimi en fazla dörtte birdir; bu yüzden w = 1'de on katman en az altı büyüklük mertebesine mal olur ve ilk katmanlar öğrenmeyi bırakır. ReLU, sinyal pozitif kaldıkça gradyanı olduğu gibi geçirir; 1'den büyük bir ağırlık ise onu büyütür: gradyan patlar.",
    announce: (depth: number, first: string) => `${depth} katman. Girdiye ulaşan gradyan ${first}.`,
    chartLabel: (depth: number, activation: string, first: string) =>
      `${depth} katmanlı bir ${activation} zinciri. Çubuklar, her katmana ne kadar gradyan ulaştığını log ölçekte gösteriyor; girdide ${first}.`,
    handleLabel: "Katman sayısı",
    end: "son",
    hint: "Sondaki mavi noktayı sürükle ya da seçip sol ve sağ ok tuşlarını kullan.",
    activationLabel: "Aktivasyon",
    activations: { sigmoid: "Sigmoid", tanh: "Tanh", relu: "ReLU" },
    weightLabel: "Her katmandaki w ağırlığı",
    depthLabel: "Katman",
    secondaryLabel: "Ağırlık ve derinlik",
    figures: {
      first: "Girdide",
      firstHint: "sondaki gradyanın",
      factor: "Katman başına",
      factorHint: "ortalama",
    },
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Hata ayıklama",
    title: "Gradyan hesabındaki hatayı bul",
    lede: "Üç hesaplama grafiğinin her birinde geri yayılım hatası var. Sayısal gradyan kontrolünü kullanarak hatalı işlemi bul.",
    caption:
      "Bir parametreyi kontrol etmek, geri geçişin sonucunu o parametreyi oynatıp ölçmekle karşılaştırır. Hangilerinin ve nasıl tutmadığı hatanın yerini gösterir. Yanlış bir suçlama yalnızca hatanın orada olmadığını söyler.",
    announce: (solved: number, total: number) => `${total} hatadan ${solved} tanesi bulundu.`,
    cases: {
      neuron: {
        tab: "Nöron",
        task: "Sayfanın başındaki küçük ağ. Bir nöronun geri adımı yanlış.",
        hint: "Ağırlıkları tek tek kontrol edin. Yanlış çıkanların hepsi hangi nörondan geçiyor?",
        solved:
          "Buldun. h₂, eğimi olarak 1 − tanh²(z) yerine tanh(z) kullanmış. Yalnızca h₂'nin arkasındaki ağırlıklar yanlıştı; onu gösteren de buydu.",
      },
      fork: {
        tab: "Çatal",
        task: "Elle doldurduğun grafik. Bir değerin iki kez kullanıldığı yerde bir şeyler ters gidiyor.",
        hint: "b doğru çıkıyor, w çıkmıyor. w'de olup b'de olmayan ne?",
        solved:
          "Buldun. w'ye geri dönen iki yoldan yalnızca en son geleni kaldı: toplanması gerekirken üzerine yazılmış. Paylaşılan her değer katkılarını toplamak zorundadır.",
      },
      sign: {
        tab: "İşaret",
        task: "Aynı kayıp, hata y − h olarak yazılmış. İki gradyan da yanlış çıkıyor.",
        hint: "İkisini dikkatle karşılaştır: biri doğrunun tam olarak negatifi, diğeri değil. Bir işaret nerede kaybolmuş olabilir?",
        solved:
          "Buldun. Çıkarma, ikinci girdisi olan h'nin eksisini unutmuş; bu yüzden h'nin arkasındaki her şey negatif çıktı. w'nin ceza yolu oradan geçmiyor; w'nin yanlış ama tam ters olmamasının nedeni bu.",
      },
    },
    checkTitle: "Gradyan kontrolü",
    check: "Kontrol et",
    checkLegend: "Solda geri geçiş, sağda oynatarak ölçülen.",
    accuseTitle: "Hata nerede?",
    notYet: "Birkaç parametreyi kontrol edin, sonra düğümü seç.",
    wrong: (name: string) => `${name} değil. Onun geri adımı doğru.`,
    pickLabel: "Vaka",
    reset: "İlerlememi unut",
    solvedLabel: "Bulunan",
  },

  recap: {
    lessons: [
      "Gradyan bir eğimdir: kayba yeterince yakından bakınca düz bir çizgidir",
      "Zincir kuralı yerel türevleri çarpar; geri yayılım bu çarpmayı kayıptan geriye doğru yapar",
      "İki yerde kullanılan bir değer, ikisinden gelen gradyanı toplayarak alır",
      "Geri geçiş sırayla ilerlemek zorundadır: bir düğümden önce onu okuyan her düğüm",
      "Tek bir geri geçiş her ağırlığın gradyanını verir; oynatmak ağırlık başına iki geçiş ister",
      "Derin zincirler çok sayıda çarpanı çarpar: 1'in altında gradyan söner, üstünde patlar",
      "Gradyan kontrolü geri yayılımı oynatarak ölçmeyle karşılaştırır; bozuk bir geri geçiş böyle yakalanır",
    ],
    footer:
      "Geri yayılım, hesaplama grafiğindeki türevleri zincir kuralıyla birleştirir. Yaygın derin öğrenme kütüphaneleri bu hesabı otomatik olarak yapar.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Çıktı noktasını sürükle. Bağlantılar her ağırlığın güncelleme yönünü ve büyüklüğünü gösterecek.",
    stages: {
      pull: {
        pull: "Bu nokta ağın çıktısı. Yukarı ya da aşağı sürükle veya ok tuşlarını kullan; tur onu yukarı çekti.",
        letGo: "Bıraktığında her ağırlık, çekişteki payı kadar değişir.",
        result:
          "Nereye hedeflediğin, nereye vardığı ve ne kadar ıskaladığı. Daha uzağa çektikçe ıska büyür.",
      },
      zoom: {
        curve:
          "Tek bir ağırlık değişirken kayıp. Kesik çizgi, geri yayılımın bulduğu eğim. Eğri boyunca sürükleyebilirsin.",
        zoom: "Tur sonuna kadar yaklaştı: eğri ile çizgi artık ayırt edilemiyor.",
        slope:
          "Geri yayılımın eğimi ve pencere boyunca ölçülen eğim yan yana. Yaklaştıkça fark küçülür; gradyan tam olarak bu eğim.",
      },
      chain: {
        dial: "İlk kadranı sürükleyerek ya da ok tuşlarıyla çevir. Tur onu biraz çevirdi.",
        links: "Her bağlantıdaki sayı, önceki kadran azıcık dönünce o kadranın ne kadar döndüğü.",
        last: "Bağlantıların çarpımı ve son çevirişinde ölçülen değer yan yana. İkisi tutar; zincir kuralı budur.",
      },
      ledger: {
        graph:
          "Gerçek bir kayıp, graf olarak. Her düğüm ileri değerini gösteriyor; gradyanları dolduracaksın.",
        tap: "Bir düğüme dokununca gradyanı yazılır. Önce kayıp gelir; tur onu doldurdu.",
        order:
          "Kaç düğümü doldurduğun ve iki yolun toplamı olan ∂L/∂w. Bir düğüme erken dokunursanız neyi beklediğini söyler.",
      },
      cost: {
        columns:
          "Aynı gradyanı bulmanın iki yolu: her ağırlığı dürtüp ağı yeniden çalıştırmak ya da tek bir geri geçiş.",
        width: "Bu, her katmanda kaç nöron olduğunu belirler. Tur ağı genişletti.",
        race: "İkisini bu tarayıcıda yarıştırın. Ağ genişledikçe dürtme yöntemi daha da geride kalır.",
      },
      depth: {
        chart: "Gradyanın ne kadarının her katmana ulaştığı, sondan başa doğru.",
        add: "Katman eklemek için sonuncuyu sağa sürükle ya da ok tuşlarını kullan. Tur dört katman ekledi.",
        activation: "Buradan başka bir aktivasyon dene: ReLU ile sinyal değişmeden geçer.",
      },
      challenge: {
        cases: "Her birinin geri geçişinde bir hata olan üç graf. Buradan birini seç.",
        check:
          "Bir parametreyi kontrol edin: geri geçişin gradyanı ölçülen değerle karşılaştırılır. Tur ilkini kontrol etti.",
        accuse: "Hatanın nerede olduğunu bulunca o düğümü buradan suçlayın.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      slope: "Gradyan bir eğimdir; zincir kuralı",
      graph: "Hesap grafiği ve geri geçişin sırası",
      depth: "Kaybolan ve patlayan gradyanlar",
      check: "Gradyan kontrolü",
    },
    notes: {
      "3b1b-backprop": "Geri yayılımın ne yaptığı, önce formülsüz.",
      "3b1b-backprop-calc": "Aynısı, zincir kuralı yazılarak.",
      "sq-chain": "Zincir kuralının gerçek sayılarla adım adım uygulanışı.",
      "karpathy-micrograd": "Geri yayılımı düğüm düğüm, yüz satır kadar kodla kendin kurun.",
      "sq-backprop": "Her seferinde tek ağırlık: hangi yöne ve ne kadar oynatılacağı.",
      "cs231n-backprop": "Kapılar, yerel gradyanlar ve iki yerde kullanılan değerde toplama.",
      "ng-vanishing":
        "1'in altındaki ya da üstündeki uzun bir çarpan zincirinin neden söndüğü ya da patladığı.",
      "ng-gradcheck":
        "Lab'ın son bölümündeki gibi, geri yayılımı dürterek ölçmeyle karşılaştırmak.",
      "d2l-backprop-book":
        "İleri ve geri hesaplamayı aynı hesaplama grafiği üzerinde takip et. Labdaki yerel türevlerin nasıl birikerek ağırlık gradyanına dönüştüğünü denklemlerle gösterir.",
    },
  },
};

export default copy;
