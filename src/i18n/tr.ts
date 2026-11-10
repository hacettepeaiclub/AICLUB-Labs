import type { Translation } from "./types";

/** Turkish controls and teaching prose; canonical page and section headings stay English.
 * Use direct singular instructions. See docs/TURKISH.md for terminology and review rules. */
export const tr: Translation = {
  shell: {
    labPlate: (n: string, term: string, figure: string) => `Şekil ${n}. ${term}: ${figure}`,
    skipToContent: "İçeriğe geç",
    brand: "AI Club",
    brandSuffix: "Labs",
    primaryNav: "Ana menü",
    allLabs: "Tüm lablar",
    calculator: "Hesap makinesi",
    breadcrumb: "Sayfa konumu",
    backToLabs: "← Tüm lablar",
    footerTagline: "Bilgisayar bilimini deneyerek öğren.",
    parentOrg: "Hacettepe Yapay Zekâ Topluluğu",
    hashtag: "#AIForAll",
    footerRights: (year: number) => `© ${year} Hacettepe AI Club`,
    footerCredit: "Hacettepe Yapay Zekâ Topluluğu projesidir",
    developedBy: "{org} adına Metehan Özcan tarafından geliştirildi",
    feedback: "Bir sorun ya da önerin mi var?",
    sourceLink: "Kaynak kodu GitHub'da",
    privacy: "Ziyaretler anonim olarak sayılır: çerez yok, kişisel veri yok.",
    privacyLink: "Neler sayılıyor",
    minutes: (n: number) => `${n} dk`,
    loadingLab: "Lab yükleniyor",
    openLab: "Labı aç →",

    errorTitle: "This part of the page did not load.",
    errorBody: "Bu bölüm yüklenemedi. Yeniden deneyebilir veya lab listesine dönebilirsin.",
    errorRetry: "Yeniden dene",
    errorBackToLabs: "Lab listesine dön",
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
    title: "Play with the ideas behind computer science and artificial intelligence.",
    lede: "Algoritmaları ve yapay sinir ağlarını çalıştır. Bir ayarı değiştir, sonucu karşılaştır ve neden değiştiğini incele.",
    cta: "Deneylere başla",
    labs: "Labs",
    labCount: (n: number) => `${n} lab`,
    experiments: "Experiments",
    emptyTitle: "First experiments are brewing.",
    emptyBody: "Yeni lablar eklendikçe burada görünecek.",
    browse: "Labları incele",
    calculator: "Hesap makineni öğren",
    continueLab: (title: string) => `Devam et: ${title}`,
    filterLabel: "Labları konuya göre filtrele",
    allFields: "Tümü",
    otherLabs: "Other labs",
    showing: (shown: number, total: number, field: string) =>
      `${total} labdan ${shown} tanesi · ${field}`,
    visited: "Açıldı",
    opened: (n: number) => `${n} tanesi açıldı`,
    game: {
      play: "İşareti yeniden kur",
      again: "Tekrar oyna",
      stop: "Durdur",
      hint: "İmleci noktaların üzerinde gezdirin ya da ok tuşlarını kullan",
      hintTouch: "Parmağını noktaların üzerinde sürükle",
      progress: (pct: number) => `%${pct} yerinde`,
      time: (seconds: number) => `${seconds.toFixed(1).replace(".", ",")} sn`,
      done: (seconds: number) => `${seconds.toFixed(1).replace(".", ",")} saniyede kuruldu`,
      best: (seconds: number) => `en iyi ${seconds.toFixed(1).replace(".", ",")} sn`,
      newBest: "yeni rekor",
      lesson: "Bu, momentumlu bir gradient descent'ti",
    },
  },

  notFound: {
    title: "This lab doesn't exist. Yet.",
    body: "Bu adreste bir lab bulunamadı. Listeden başka bir lab seçebilirsin.",
    back: "Lab listesine dön",
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
    tryAgain: "Yeniden dene",
    solved: (done: number, total: number) => `${total} görevden ${done} tanesi çözüldü`,
    recapTitle: "Today you learned",
    controlsLabel: "Deney kontrolleri",
    moreControls: "Ayarlar ve yardım",
    keyboardHint: "Grafik odaktayken",
    nextLab: "Next in the collection",
    endOfCollection: "That is the whole collection.",
    endOfCollectionBody: "Başka bir deney için lab listesine dönebilirsin.",
    backToCollection: "Lab listesi",
  },

  /**
   * What each lab is called, and the one sentence under it.
   *
   * Here rather than with the lab's own prose because the grid says all of it
   * before any lab is opened — and `meta.ts` keeps the structural facts (slug,
   * category, minutes) so a lab can be listed without being loaded at all.
   */

  guide: {
    howItWorks: "Nasıl çalışıyor?",
    welcomeKicker: "First time here?",
    show: "Turu başlat",
    explore: "Kendim deneyeyim",
    later: "Turu, başlığın altındaki “Nasıl çalışıyor?” düğmesiyle yeniden açabilirsin.",
    tourLabel: "Guided tour",
    progress: (n: number, total: number) => `${n}/${total}`,
    next: "İleri",
    back: "Geri",
    done: "Anladım",
    close: "Turu kapat",
  },

  learn: {
    kicker: "Keep learning",
    title: "Take this lab's ideas further",
    body: "Bu labın konularıyla ilgili videoları, dersleri ve yazıları burada bulabilirsin.",
    open: "Öğrenme rehberini aç",
    dialogKicker: "Learning guide",
    close: "Kapat",
    kinds: {
      video: "Video",
      lecture: "Ders",
      book: "Kitap",
      notes: "Ders notu",
      article: "Makale",
      interactive: "Etkileşimli",
    },
    inEnglish: "Kaynakların dili İngilizce.",
    newTab: "(yeni sekmede açılır)",
  },

  palette: {
    open: "Lab ara",
    label: "Lab ara",
    placeholder: "Ada veya konuya göre ara",
    results: (n: number) => `${n} lab`,
    empty: (query: string) => `“${query}” için lab bulunamadı.`,
    current: "Buradasın",
    navigate: "gezin",
    select: "aç",
    dismiss: "kapat",
  },
  // Legacy metadata retained for compatibility; useLabMeta returns canonical English terms.
  englishTerms: ["attention", "gradient-descent", "tokenization", "word-embeddings"],
  labMeta: {
    diffusion: {
      title: "From noise to a guess",
      term: "Diffusion",
      figure: "Gauss gürültüsü ve sonlu önbilgi",
      description:
        "Gürültülü görüntüden bir tahmin oluştur. Modelin kullanabildiği şekilleri değiştirerek sonuçları karşılaştır.",
    },
    generalization: {
      title: "Learned or memorised?",
      term: "Generalisation",
      figure: "esnek bir sınır tanıdık noktalara uyuyor, sonra yeni örneklerle karşılaşıyor.",
      description: "Modeli eğitim verisinde dene. Sonra ayrı örnekleri açıp doğruluğu karşılaştır.",
    },
    "word-embeddings-3d": {
      title: "The Map of Meaning, in 3D",
      term: "Word embeddings, prototype",
      figure: "nokta olarak kelimeler ve bunlardan birine en yakın dördü.",
      description: "Bir deney: aynı 318 kelime, iki yerine üç PCA eksenine indirgenmiş hâliyle.",
    },
    "word-embeddings": {
      title: "The Map of Meaning",
      term: "Word embeddings",
      figure: "bir uzayda nokta olarak kelimeler ve bunlardan birine en yakın dördü.",
      description:
        "Kelime vektörlerini haritada incele. Ekrandaki uzaklıkla asıl vektör benzerliğini karşılaştır.",
    },
    "hypothesis-testing": {
      title: "The Price of Certainty",
      term: "Hypothesis testing",
      figure: "iki örneklem dağılımı, aralarında karar veren çizgi ve onun ötesindeki kuyruk.",
      description:
        "Ortalamayı, anlamlılık düzeyini ve örnek sayısını değiştir. Hata olasılıklarını ve testin gücünü karşılaştır.",
    },
    "reinforcement-learning": {
      title: "Exactly What You Asked",
      term: "Reinforcement learning",
      figure: "karelerden bir oda, robotun başladığı yer ve ulaşınca ödül aldığı kare.",
      description:
        "Ödülleri değiştirip ajanı yeniden eğit. Öğrendiği davranışın hedefinle uyuşup uyuşmadığını incele.",
    },
    attention: {
      title: "Where the Model Looks",
      term: "Attention",
      figure: "cümlesinin geri kalanına bakan bir kelime; en kalın yay, en çok baktığı yer.",
      description:
        "Bir kelimeyi değiştir. Seçili kelimenin attention ağırlıkları ve çıktı vektörü nasıl değişiyor?",
    },
    "gradient-descent": {
      title: "The Size of a Step",
      term: "Gradient descent",
      figure: "yukarıdan görülen bir çanak ve adımların tabanına indiği yol.",
      description:
        "Adım boyunu seç. Yüzeyin biçimi o adımı kaldıramıyorsa yol hedefe inmek yerine dağılır.",
    },
    backpropagation: {
      title: "Who Is to Blame?",
      term: "Backpropagation",
      figure:
        "çıkışından geriye doğru hatanın aktığı küçük bir ağ; suçun çoğu nereye gidiyorsa orası daha kalın.",
      description: "Çıktıyı değiştir ve hatanın ağırlık güncellemelerine nasıl yansıdığını incele.",
    },
    convolution: {
      title: "Nine Weights",
      term: "Convolution",
      figure: "bir resmin üzerinde 3×3'lük bir pencere ve çıktıda yazdığı hücre.",
      description:
        "Bir filtreyi görüntü üzerinde kaydır. Çarpımların her çıktı hücresini nasıl oluşturduğunu incele.",
    },
    "floating-point": {
      title: "0.1 + 0.2",
      term: "Floating point",
      figure:
        "işaret, üs ve kesir bitleri olarak bir sayı; altında bu bitlerin tutabildiği değerlerin cetveli.",
      description: "Bir sayı yaz. Bilgisayarın sakladığı değeri ve yuvarlama farkını incele.",
    },
    "cache-locality": {
      title: "The Neighbours Come Free",
      term: "Cache locality",
      figure:
        "sekizli satırlar halinde sayılar; birini okumak bütün bloğunu, komşularıyla birlikte getirir.",
      description:
        "Aynı veriyi farklı sıralarla oku. Ölçülen süreleri cache modeliyle karşılaştır.",
    },
    "race-condition": {
      title: "Lost Update",
      term: "Race condition",
      figure:
        "iki iş parçacığının adımları iç içe; ikisi de yazmadan önce okur ve bir güncelleme kaybolur.",
      description:
        "İki iş parçacığının işlem sırasını seç. Sayaçtaki bir güncellemenin nasıl kaybolduğunu göster.",
    },
    "hash-tables": {
      title: "Computed Address",
      term: "Hash tables",
      figure: "dolu bir yuvaya düşen ve ilk boş yuvaya kadar sağa adımlayan bir anahtar.",
      description: "Anahtar ekle, çakışma oluştur ve tablo büyüdüğünde yapılan işi karşılaştır.",
    },
    "cryptographic-hashing": {
      title: "Digital Fingerprint",
      term: "Cryptographic hashing",
      figure: "farklı uzunlukta iki girdi, tek bir fonksiyon ve aynı boyda iki çıktı.",
      description:
        "Bir mesajın SHA-256 özetini hesapla. Tek karakter değişince kaç bitin değiştiğine bak.",
    },
    "multilayer-perceptrons": {
      title: "Bending the Line",
      term: "Multilayer perceptrons",
      figure: "üç girdi, dört nöronlu bir gizli katman ve iki çıktı; her bağlantı çizili.",
      description:
        "Küçük bir sinir ağını eğit. Katmanları ve veriyi değiştirerek karar sınırını karşılaştır.",
    },
    "graph-search": {
      title: "The Spreading Search",
      term: "Graph search",
      figure: "başlangıcından bir ızgaraya yayılan bir arama; parlak halka sınır.",
      description:
        "Engeller ve farklı maliyetler ekle. BFS, Dijkstra ve A* yöntemlerinin incelediği hücreleri karşılaştır.",
    },
    probability: {
      title: "Guess, Then Count",
      term: "Probability",
      figure: "üç kapı ve sunucunun açtığı kapı.",
      description:
        "Altı deneyde önce tahmin yap. Hesaplanan olasılıkları, rastgele denemeleri ve fizik simülasyonunu karşılaştır.",
    },
    sorting: {
      title: "The Cost of Order",
      term: "Sorting algorithms",
      figure: "kısadan uzuna sıralanmış çubuklar; son yerleşenler vurgulu.",
      description:
        "Aynı diziyi iki algoritmayla sırala. Karşılaştırma ve yazma sayılarını ayrı ayrı incele.",
    },
    tokenization: {
      title: "Cheap Words",
      term: "BPE tokenization",
      figure: "farklı uzunlukta token'lara bölünmüş bir cümle; biri vurgulu.",
      description:
        "Metnin parçalara nasıl ayrıldığını tahmin et. BPE birleşimlerini ve eğitim metninin etkisini incele.",
    },
  },
};
