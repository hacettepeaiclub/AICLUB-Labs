import type { Translation } from "./types";

/**
 * Türkçe.
 *
 * Bu dosya `en.ts` ile aynı şekle sahip olmak zorundadır; eksik ya da fazla bir
 * anahtar derleme hatasıdır.
 *
 * ## Çeviri ilkeleri
 *
 * Metinler İngilizceden kelime kelime çevrilmedi, konuşma diline yakın ve
 * doğal Türkçeyle yeniden yazıldı. "Siz" kipi kullanıldı ama cümleler
 * gereksiz yere resmileştirilmedi ya da uzatılmadı; teknik doğruluk, ağdalı
 * bir dil kullanmayı gerektirmiyor.
 *
 * Yerleşik Türkçe karşılığı olan terimler çevrildi (ağırlık, kayıp, gradyan,
 * geri yayılım, çakışma, terslik, derlem). Karşılığı yapay kalan ya da anlam
 * kaymasına yol açan terimler İngilizce bırakıldı: token, tokenizer, BPE, hash,
 * epok. Aynı kavram uygulamanın her yerinde aynı sözcükle karşılanıyor.
 *
 * Sayı biçimlerine dikkat edildi: Türkçede yüzde işareti sayıdan önce gelir
 * (%50) ve sayıdan sonra gelen ad çoğul eki almaz ("5 token", "5 tokenlar"
 * değil). Uzun tire (em dash) hiç kullanılmadı; Türkçede doğal olan virgül,
 * nokta ve iki nokta üst üste tercih edildi.
 */
export const tr: Translation = {
  shell: {
    labPlate: (n: string, term: string, figure: string) => `Şekil ${n}. ${term}: ${figure}`,
    skipToContent: "İçeriğe geç",
    brand: "AI Club",
    brandSuffix: "Labs",
    primaryNav: "Ana gezinme",
    allLabs: "Tüm laboratuvarlar",
    breadcrumb: "Sayfa yolu",
    backToLabs: "← Tüm laboratuvarlar",
    footerTagline: "AI Club Labs: Bilgisayar bilimini oynayarak öğrenin.",
    parentOrg: "Hacettepe Yapay Zekâ Topluluğu",
    hashtag: "#AIForAll",
    footerRights: (year: number) => `© ${year} Hacettepe AI Club`,
    footerCredit: "Hacettepe Yapay Zekâ Topluluğu projesidir",
    developedBy: "{org} adına Metehan Özcan tarafından geliştirildi",
    feedback: "Bir sorun ya da öneriniz mi var?",
    sourceLink: "Kaynak kodu GitHub'da",
    privacy: "Ziyaretler anonim olarak sayılır: çerez yok, kişisel veri yok.",
    privacyLink: "Neler sayılıyor",
    minutes: (n: number) => `${n} dk`,
    loadingLab: "Laboratuvar yükleniyor",
    openLab: "Laboratuvarı aç →",

    errorTitle: "Sayfanın bu bölümü yüklenemedi.",
    errorBody:
      "Gösterilirken bir şeyler ters gitti. Yeniden denemek genellikle sorunu çözer, özellikle bu sayfa bir süredir açıksa.",
    errorRetry: "Yeniden dene",
    errorBackToLabs: "Tüm laboratuvarlara dön",
  },

  preferences: {
    languageLabel: "Dil",
    english: "EN",
    englishFull: "English",
    turkish: "TR",
    turkishFull: "Türkçe",
    themeLabel: "Tema",
    light: "Açık",
    dark: "Koyu",
  },

  home: {
    kicker: "AI Club Labs",
    // İlk sürümdeki başlık geri alındı: hem bilgisayar bilimini hem yapay
    // zekâyı adıyla söylüyor ve yine bir eylemle başlıyor.
    title: "Bilgisayar biliminin ve yapay zekânın arkasındaki fikirlerle oynayın.",
    lede: "On altı etkileşimli deney: algoritmalar, yapay sinir ağları ve hesaplamanın işleyişi. Uzun anlatım yok, çevirip kaydıracağınız düğmeler var.",
    cta: "Denemeye başla",
    labs: "Laboratuvarlar",
    labCount: (n: number) => `${n} düzenek`,
    experiments: "Deneyler",
    emptyTitle: "İlk deneyler hazırlanıyor.",
    emptyBody:
      "Platform hazır: laboratuvarlar kendilerini kaydeder ve burada otomatik olarak görünür.",
    browse: "Laboratuvarlara göz at",
    continueLab: (title: string) => `Kaldığın yerden devam et: ${title}`,
    filterLabel: "Laboratuvarları alana göre süz",
    allFields: "Tümü",
    otherLabs: "Diğer laboratuvarlar",
    showing: (shown: number, total: number, field: string) =>
      `${total} laboratuvardan ${shown} tanesi · ${field}`,
    visited: "Açıldı",
    opened: (n: number) => `${n} tanesi açıldı`,
    game: {
      play: "İşareti yeniden kur",
      again: "Tekrar oyna",
      stop: "Durdur",
      hint: "İmleci noktaların üzerinde gezdirin ya da ok tuşlarını kullanın",
      hintTouch: "Parmağınızı noktaların üzerinde sürükleyin",
      progress: (pct: number) => `%${pct} yerinde`,
      time: (seconds: number) => `${seconds.toFixed(1).replace(".", ",")} sn`,
      done: (seconds: number) => `${seconds.toFixed(1).replace(".", ",")} saniyede kuruldu`,
      best: (seconds: number) => `en iyi ${seconds.toFixed(1).replace(".", ",")} sn`,
      newBest: "yeni rekor",
      lesson: "Bu, momentumlu bir gradient descent'ti",
    },
  },

  notFound: {
    title: "Böyle bir laboratuvar henüz yok.",
    body: "Belki hâlâ bir tahtanın üzerinde duran bir fikirdir.",
    back: "Tüm laboratuvarlara dön",
    figure: "Şekil 404. Buraya henüz bir şey çizilmedi.",
  },

  category: {
    algorithms: "Algoritmalar",
    "data-structures": "Veri Yapıları",
    "machine-learning": "Makine Öğrenmesi",
    "neural-networks": "Yapay Sinir Ağları",
    systems: "Sistemler",
    theory: "Kuram",
  },

  difficulty: {
    intro: "giriş",
    intermediate: "orta",
    advanced: "ileri",
  },

  common: {
    run: "Çalıştır",
    pause: "Duraklat",
    step: "Adımla",
    reset: "Sıfırla",
    clear: "Temizle",
    startOver: "Baştan başla",
    tryAgain: "Yeniden deneyin",
    solved: (done: number, total: number) => `${total} görevden ${done} tanesi çözüldü`,
    recapTitle: "Bugün öğrendikleriniz",
    controlsLabel: "Deney kontrolleri",
    moreControls: "Ayarlar ve yardım",
    keyboardHint: "Grafik odaktayken",
    nextLab: "Koleksiyonda sıradaki",
    endOfCollection: "Koleksiyonun tamamı bu kadar.",
    endOfCollectionBody:
      "Bütün laboratuvarlar, anlatının ilerlediği sırayla. Birini yeniden seçmek için ızgaraya dönün.",
    backToCollection: "Tüm laboratuvarlar",
  },

  /**
   * What each lab is called, and the one sentence under it.
   *
   * Here rather than with the lab's own prose because the grid says all of it
   * before any lab is opened — and `meta.ts` keeps the structural facts (slug,
   * category, minutes) so a lab can be listed without being loaded at all.
   */

  palette: {
    open: "Laboratuvar bul",
    label: "Laboratuvar bul",
    placeholder: "Ada ya da alana göre ara",
    results: (n: number) => `${n} laboratuvar`,
    empty: (query: string) => `“${query}” ile eşleşen bir laboratuvar yok.`,
    current: "Buradasınız",
    navigate: "gezin",
    select: "aç",
    dismiss: "kapat",
  },
  // Tamamı İngilizce kalan terimler. Taslak lab'ın "Word embedding, prototip"
  // terimi burada değil: içinde Türkçe bir kelime de var.
  englishTerms: ["attention", "gradient-descent", "tokenization", "word-embeddings"],
  labMeta: {
    "word-embeddings-3d": {
      title: "Anlam Haritası, 3B",
      term: "Word embedding, prototip",
      figure: "nokta olarak kelimeler ve bunlardan birine en yakın dördü.",
      description: "Bir deney: aynı 318 kelime, iki yerine üç PCA eksenine indirgenmiş hâliyle.",
    },
    "word-embeddings": {
      title: "Anlam Haritası",
      term: "Word embedding",
      figure: "bir uzayda nokta olarak kelimeler ve bunlardan birine en yakın dördü.",
      description:
        "Bir modelin APPLE'a en yakın gördüğü kelimeyi tahmin et, sonra bu kelime haritasının neyi sakladığını gör.",
    },
    "hypothesis-testing": {
      title: "Emin Olmanın Bedeli",
      term: "Hipotez testi",
      figure: "iki örneklem dağılımı, aralarında karar veren çizgi ve onun ötesindeki kuyruk.",
      description:
        "\u0130ki hipotezi birbirinden uzakla\u015ft\u0131r\u0131n ve emin olman\u0131n bedelini izleyin: reddetme b\u00f6lgesi, kabul etti\u011finiz hatalar ve kazand\u0131\u011f\u0131n\u0131z g\u00fc\u00e7.",
    },
    "reinforcement-learning": {
      title: "Tam İstediğiniz Gibi",
      term: "Pekiştirmeli öğrenme",
      figure: "karelerden bir oda, robotun başladığı yer ve ulaşınca ödül aldığı kare.",
      description:
        "Bir robot için bir karenin ne kadar değerli olduğuna siz karar verin ve tam olarak dediğinizi yapmasını izleyin.",
    },
    attention: {
      title: "Model Nereye Bakıyor",
      term: "Attention",
      figure: "cümlesinin geri kalanına bakan bir kelime; en kalın yay, en çok baktığı yer.",
      description: "Bir kelime seçin ve modelin cümlenin hangi kısmına yaslandığını izleyin.",
    },
    "gradient-descent": {
      title: "Adımın Boyu",
      term: "Gradient descent",
      figure: "yukarıdan görülen bir çanak ve adımların tabanına indiği yol.",
      description:
        "Bir yüzeyin biçiminin, atmanıza izin verilen adımın boyutunu nasıl belirlediğini görün.",
    },
    backpropagation: {
      title: "Suç Kimde?",
      term: "Geri yayılım",
      figure:
        "çıkışından geriye doğru hatanın aktığı küçük bir ağ; suçun çoğu nereye gidiyorsa orası daha kalın.",
      description:
        "Bir ağın çıktısını çekin ve her ağırlığın suçtaki payını görün, sonra geri geçişi kendiniz yapın.",
    },
    convolution: {
      title: "Dokuz Ağırlık",
      term: "Evrişim",
      figure: "bir resmin üzerinde 3×3'lük bir pencere ve çıktıda yazdığı hücre.",
      description:
        "Dokuz ağırlığı bir resmin üzerinde kaydırın ve kenarları bulmalarını izleyin, sonra ağırlıkları sizin yerinize gradient descent bulsun.",
    },
    "floating-point": {
      title: "0,1 + 0,2",
      term: "Kayan nokta",
      figure:
        "işaret, üs ve kesir bitleri olarak bir sayı; altında bu bitlerin tutabildiği değerlerin cetveli.",
      description:
        "0.1 yazın ve bilgisayarınızın gerçekte sakladığı sayıyı görün, sonra 0.1 + 0.2'nin neden 0.3 etmediğini öğrenin.",
    },
    "cache-locality": {
      title: "Komşular Bedava",
      term: "Önbellek yerelliği",
      figure:
        "sekizli satırlar halinde sayılar; birini okumak bütün bloğunu, komşularıyla birlikte getirir.",
      description:
        "Aynı sayıları iki farklı sırayla toplayın, ikisini kendi bilgisayarınızda ölçün ve birinin neden kat kat yavaş olduğunu görün.",
    },
    "hash-tables": {
      title: "Hesaplanan Adres",
      term: "Hash tabloları",
      figure: "dolu bir yuvaya düşen ve ilk boş yuvaya kadar sağa adımlayan bir anahtar.",
      description:
        "Bir kelimeyi adrese çevirin, sonra tabloyu doldurun ve herhangi bir şeyi bulmanın maliyetinin patlamasını izleyin.",
    },
    "cryptographic-hashing": {
      title: "Dijital Parmak İzi",
      term: "Kriptografik hash",
      figure: "farklı uzunlukta iki girdi, tek bir fonksiyon ve aynı boyda iki çıktı.",
      description: "Tek bir karakteri değiştirin. Her şeyin değiştiğini görün.",
    },
    "multilayer-perceptrons": {
      title: "Çizgiyi Bükmek",
      term: "Çok katmanlı algılayıcılar",
      figure: "üç girdi, dört nöronlu bir gizli katman ve iki çıktı; her bağlantı çizili.",
      description: "İki tür nokta çizin. Bir ağın onları ayırt etmeyi öğrenişini izleyin.",
    },
    "graph-search": {
      title: "Yayılan Arama",
      term: "Graf araması",
      figure: "başlangıcından bir ızgaraya yayılan bir arama; parlak halka sınır.",
      description: "Engeller çizin; BFS, Dijkstra ve A* algoritmalarının yol arayışını izleyin.",
    },
    probability: {
      title: "Önce Tahmin, Sonra Hesap",
      term: "Olasılık",
      figure: "üç kapı ve sunucunun açtığı kapı.",
      description:
        "\u015eans hakk\u0131ndaki sezgine meydan okuyan alt\u0131 deney. \u00d6nce tahmin edin, sonra tahminin ne kadar yanl\u0131\u015f oldu\u011funu g\u00f6r\u00fcn.",
    },
    sorting: {
      title: "Düzenin Bedeli",
      term: "Sıralama algoritmaları",
      figure: "kısadan uzuna sıralanmış çubuklar; son yerleşenler vurgulu.",
      description:
        "Veriyi siz çizin; her algoritmanın onu sıralamak için ne kadar iş yaptığını görün.",
    },
    tokenization: {
      title: "Ucuz Kelimeler",
      term: "BPE tokenization",
      figure: "farklı uzunlukta token'lara bölünmüş bir cümle; biri vurgulu.",
      description:
        "Bir tokenizer'ı elinizle eğitin ve ne okuduğunun, neyi söylemenin ucuz olduğunu nasıl belirlediğini görün.",
    },
  },
};
