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
    skipToContent: "İçeriğe geç",
    brand: "AI Club",
    brandSuffix: "Labs",
    primaryNav: "Ana gezinme",
    allLabs: "Tüm laboratuvarlar",
    breadcrumb: "Sayfa yolu",
    backToLabs: "← Tüm laboratuvarlar",
    footerTagline: "AI Club Labs: Bilgisayar bilimini oynayarak öğrenin.",
    byLine: "bir",
    parentOrg: "Hacettepe Yapay Zekâ Topluluğu",
    hashtag: "#AIForAll",
    footerRights: (year: number) => `© ${year} Hacettepe AI Club`,
    footerCredit: "Hacettepe Yapay Zekâ Topluluğu projesidir",
    builtBy: "Topluluk üyeleri tarafından yapıldı",
    sourceLink: "Kaynak kodu GitHub'da",
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
    lede: "On bir etkileşimli deney: algoritmalar, yapay sinir ağları ve hesaplamanın işleyişi. Uzun anlatım yok, çevirip kaydıracağınız düğmeler var.",
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
  },

  notFound: {
    title: "Böyle bir laboratuvar henüz yok.",
    body: "Belki hâlâ bir tahtanın üzerinde duran bir fikirdir.",
    back: "Tüm laboratuvarlara dön",
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
  labMeta: {
    "embedding-universe-3d": {
      title: "Gömme Evreni, 3B prototip",
      description: "Bir deney: aynı 318 kelime, iki yerine üç PCA eksenine indirgenmiş hâliyle.",
    },
    "embedding-universe": {
      title: "Gömme Evreni",
      description:
        "Bir modelin APPLE'a en yakın gördüğü kelimeyi tahmin et, sonra bu kelime haritasının neyi sakladığını gör.",
    },
    "hypothesis-testing": {
      title: "Hipotez Testleri",
      description:
        "\u0130ki hipotezi birbirinden uzakla\u015ft\u0131r\u0131n ve emin olman\u0131n bedelini izleyin: reddetme b\u00f6lgesi, kabul etti\u011finiz hatalar ve kazand\u0131\u011f\u0131n\u0131z g\u00fc\u00e7.",
    },
    "reward-playground": {
      title: "Ödül Laboratuvarı",
      description:
        "Bir robot için bir karenin ne kadar değerli olduğuna siz karar verin ve tam olarak dediğinizi yapmasını izleyin.",
    },
    attention: {
      title: "Attention Laboratuvarı",
      description: "Bir kelime seçin ve modelin cümlenin hangi kısmına yaslandığını izleyin.",
    },
    "gradient-descent": {
      title: "Gradient Descent",
      description:
        "Bir yüzeyin biçiminin, atmanıza izin verilen adımın boyutunu nasıl belirlediğini görün.",
    },
    "hash-playground": {
      title: "Hash Laboratuvarı",
      description: "Tek bir karakteri değiştirin. Her şeyin değiştiğini görün.",
    },
    "neural-playground": {
      title: "Yapay Sinir Ağı Laboratuvarı",
      description: "İki tür nokta çizin. Bir ağın onları ayırt etmeyi öğrenişini izleyin.",
    },
    pathfinding: {
      title: "Yol Bulma",
      description: "Engeller çizin; BFS, Dijkstra ve A* algoritmalarının yol arayışını izleyin.",
    },
    probability: {
      title: "Olas\u0131l\u0131k Laboratuvar\u0131",
      description:
        "\u015eans hakk\u0131ndaki sezgine meydan okuyan alt\u0131 deney. \u00d6nce tahmin edin, sonra tahminin ne kadar yanl\u0131\u015f oldu\u011funu g\u00f6r\u00fcn.",
    },
    "sorting-race": {
      title: "Sıralama Yarışı",
      description:
        "Veriyi siz çizin; her algoritmanın onu sıralamak için ne kadar iş yaptığını görün.",
    },
    tokenizer: {
      title: "Tokenizer Laboratuvarı",
      description:
        "Bir tokenizer'ı elinizle eğitin ve ne okuduğunun, neyi söylemenin ucuz olduğunu nasıl belirlediğini görün.",
    },
  },
};
