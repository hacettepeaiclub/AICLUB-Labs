import type { Translation } from "./types";

/** Turkish controls and teaching prose; only lab names and the home slogan stay English.
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

    errors: {
      waiting: "bekleniyor",
      trying: "deneniyor",
      retry: "Yeniden dene",
      retrying: "Deneniyor…",
      reload: "Sayfayı yenile",
      backToLabs: "Tüm lablara dön",
      unreachable: "Siteye hâlâ ulaşılamıyor.",
      offline: {
        title: "Bağlantı yok.",
        lab: "Bu lab henüz yüklenmedi. Bağlantın geri geldiğinde yeniden deneyeceğiz.",
        page: "Bu sayfa henüz yüklenmedi. Bağlantın geri geldiğinde yeniden deneyeceğiz.",
      },
      load: {
        lab: "Lab yüklenemedi.",
        page: "Sayfa yüklenemedi.",
        body: "Dosyalar indirilemedi. Yeniden deneyebilirsin.",
        stale: "Site, bu sayfa açıkken güncellendi. Yeni sürümü yüklemek için sayfayı yenile.",
      },
      runtime: {
        title: "Bir sorun oluştu.",
        lab: "Deney beklenmeyen bir hata yüzünden durdu.",
        page: "Sayfa beklenmeyen bir hata yüzünden durdu.",
        restartLab: "Deneyi yeniden başlat",
        restartPage: "Yeniden dene",
        restartNoteLab: "Deney en baştan başlar.",
        restartNotePage: "Sayfa baştan açılır.",
        restartFailed: "Yine durdu. Sayfayı yenilemeyi deneyebilirsin.",
      },
    },

    offlineNotice:
      "Çevrimdışısın. Açık sayfa çalışmaya devam eder; yeni bir sayfa açmak için bağlantı gerekir.",
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
    languageFailed: (language: string) =>
      `Dil değiştirilemedi (${language}). Bağlantını kontrol edip yeniden dene.`,
    dismiss: "Kapat",
  },

  home: {
    kicker: "AI Club Labs",
    title: "Bilgisayar bilimini ve yapay zekâyı deneyerek öğren.",
    lede: "Algoritmaları ve yapay sinir ağlarını çalıştır. Bir ayarı değiştirip sonucu gör.",
    cta: "Deneylere başla",
    labs: "Laboratuvarlar",
    labCount: (n: number) => `${n} lab`,
    experiments: "Deneyler",
    emptyTitle: "İlk deneyler hazırlanıyor.",
    emptyBody: "Yeni lablar eklendikçe burada görünecek.",
    browse: "Labları incele",
    calculator: "Hesap makineni öğren",
    continueLab: (title: string) => `Devam et: ${title}`,
    filterLabel: "Labları konuya göre filtrele",
    allFields: "Tümü",
    otherLabs: "Diğer laboratuvarlar",
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
    title: "Bu sayfa bulunamadı.",
    body: "Adres yanlış yazılmış ya da sayfa kaldırılmış olabilir.",
    back: "Tüm lablara dön",
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
    recapTitle: "Bu deneyden ne öğrendin?",
    controlsLabel: "Deney kontrolleri",
    moreControls: "Ayarlar ve yardım",
    keyboardHint: "Grafik odaktayken",
    nextLab: "Sıradaki lab",
    endOfCollection: "Son laba geldin.",
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
    welcomeKicker: "İlk kez mi deniyorsun?",
    show: "Turu başlat",
    explore: "Kendim deneyeyim",
    later: "Turu, başlığın altındaki “Nasıl çalışıyor?” düğmesiyle yeniden açabilirsin.",
    tourLabel: "Rehberli tur",
    progress: (n: number, total: number) => `${n}/${total}`,
    next: "İleri",
    back: "Geri",
    done: "Anladım",
    close: "Turu kapat",
  },

  learn: {
    kicker: "İlgili kaynaklar",
    title: "Konuyu daha yakından incele",
    body: "Bu labın konularıyla ilgili videoları, dersleri ve yazıları burada bulabilirsin.",
    open: "Öğrenme rehberini aç",
    failed: "Öğrenme rehberi yüklenemedi. Yeniden deneyebilirsin.",
    retry: "Yeniden dene",
    retrying: "Deneniyor…",
    dialogKicker: "Öğrenme rehberi",
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
    loading: "Lab arama açılıyor…",
    unavailable: "Lab arama şu anda kullanılamıyor.",
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
    pca: {
      title: "The Widest Shadow",
      term: "Temel bileşen analizi",
      figure: "bir nokta bulutu ve en geniş yayıldığı çizgi.",
      description:
        "Bir matrisin yalnızca uzattığı yönleri, sonra bir veri bulutunun en geniş yayıldığı çizgiyi bul.",
    },
    jepa: {
      title: "The Missing Piece",
      term: "Öz-denetimli öğrenme",
      figure: "gizli bir parçanın dört sayılık temsili, görünen komşularından tahmin ediliyor.",
      description:
        "Görüntünün bir kısmını gizle. Modelin, görünen komşulardan gizli parçanın temsilini nasıl öğrendiğini incele.",
    },
    generalization: {
      title: "Learned or memorised?",
      term: "Genelleme",
      figure: "esnek bir sınır tanıdık noktalara uyuyor, sonra yeni örneklerle karşılaşıyor.",
      description: "Modeli eğitim verisinde dene. Sonra ayrı örnekleri açıp doğruluğu karşılaştır.",
    },
    "word-embeddings-3d": {
      title: "The Map of Meaning, in 3D",
      term: "Word embedding, prototip",
      figure: "nokta olarak kelimeler ve bunlardan birine en yakın dördü.",
      description: "Bir deney: aynı 318 kelime, iki yerine üç PCA eksenine indirgenmiş hâliyle.",
    },
    "word-embeddings": {
      title: "The Map of Meaning",
      term: "Word embedding",
      figure: "bir uzayda nokta olarak kelimeler ve bunlardan birine en yakın dördü.",
      description:
        "Kelime vektörlerini haritada incele. Ekrandaki uzaklıkla asıl vektör benzerliğini karşılaştır.",
    },
    "hypothesis-testing": {
      title: "The Price of Certainty",
      term: "Hipotez testi",
      figure:
        "iki örnekleme dağılımı, kritik değeri gösteren çizgi ve onun ötesindeki ret bölgesi.",
      description:
        "Ortalamayı, anlamlılık düzeyini ve örneklem büyüklüğünü değiştir. Hata olasılıklarını ve testin gücünü karşılaştır.",
    },
    "reinforcement-learning": {
      title: "Exactly What You Asked",
      term: "Pekiştirmeli öğrenme",
      figure: "başlangıç noktası, ödül veren kare ve çıkış kapısı olan bir oda.",
      description:
        "İşaretli karenin ödülünü değiştir ve ajanı yeniden eğit. Rotanın kapıya mı gittiğine, kareye mi döndüğüne bak.",
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
      figure: "amaç fonksiyonunun eşyükselti eğrileri ve başlangıç noktasından atılan adımlar.",
      description:
        "Adım boyunu değiştir. Aynı yüzeyde hangi ayarların minimuma yaklaştığını haritada karşılaştır.",
    },
    backpropagation: {
      title: "Who Is to Blame?",
      term: "Geri yayılım",
      figure:
        "çıkışından geriye doğru hatanın aktığı küçük bir ağ; suçun çoğu nereye gidiyorsa orası daha kalın.",
      description: "Çıktıyı değiştir ve hatanın ağırlık güncellemelerine nasıl yansıdığını incele.",
    },
    convolution: {
      title: "Nine Weights",
      term: "Evrişim",
      figure: "bir resmin üzerinde 3×3'lük bir pencere ve çıktıda yazdığı hücre.",
      description:
        "Bir filtreyi görüntü üzerinde kaydır. Çarpımların her çıktı hücresini nasıl oluşturduğunu incele.",
    },
    "floating-point": {
      title: "0.1 + 0.2",
      term: "Kayan nokta",
      figure:
        "bir sayının işaret, üs ve kesir bitleri ile temsil edilebilen değerlerin sayı doğrusu.",
      description:
        "Bir ondalık sayı yaz. Girdiyle saklanan değer arasındaki farkı incele ve float32 ile float16 gösterimlerini karşılaştır.",
    },
    "cache-locality": {
      title: "The Neighbours Come Free",
      term: "Önbellek yerelliği",
      figure:
        "sekizli satırlar halinde sayılar; birini okumak bütün bloğunu, komşularıyla birlikte getirir.",
      description:
        "Aynı veriyi farklı sıralarla oku. Ölçülen süreleri cache modeliyle karşılaştır.",
    },
    "race-condition": {
      title: "Lost Update",
      term: "Yarış durumu",
      figure:
        "iki iş parçacığının adımları iç içe; ikisi de yazmadan önce okur ve bir güncelleme kaybolur.",
      description:
        "İki iş parçacığının işlem sırasını seç. Sayaçtaki bir güncellemenin nasıl kaybolduğunu göster.",
    },
    "hash-tables": {
      title: "Computed Address",
      term: "Hash tabloları",
      figure: "hesaplanan yuva doluyken sırayla yoklanan yuvalar.",
      description:
        "Anahtar ekle ve çakışma olduğunda kaç yuva yoklandığına bak. Kapasite artınca ekleme maliyetini karşılaştır.",
    },
    "cryptographic-hashing": {
      title: "Digital Fingerprint",
      term: "Kriptografik hash",
      figure: "farklı uzunlukta iki girdi, tek bir fonksiyon ve aynı boyda iki çıktı.",
      description:
        "Bir mesajın SHA-256 özetini hesapla. Tek karakter değişince kaç bitin değiştiğine bak.",
    },
    "multilayer-perceptrons": {
      title: "Bending the Line",
      term: "Çok katmanlı algılayıcılar",
      figure: "üç girdi, dört nöronlu bir gizli katman ve iki çıktı; her bağlantı çizili.",
      description:
        "Küçük bir sinir ağını eğit. Katmanları ve veriyi değiştirerek karar sınırını karşılaştır.",
    },
    "graph-search": {
      title: "The Spreading Search",
      term: "Çizgede arama",
      figure:
        "arama sırasında bekleyen hücreleri, işlenen hücreleri ve bulunan yolu gösteren ızgara.",
      description:
        "Engel ve çamur ekle. BFS, Dijkstra ve A* ile bulunan yolların maliyetini ve işlenen hücre sayısını karşılaştır.",
    },
    probability: {
      title: "Guess, Then Count",
      term: "Olasılık",
      figure: "üç kapı ve sunucunun açtığı kapı.",
      description:
        "Kapı seç, odaya kişi ekle, Galton tahtasına bilye bırak. Altı deneyde tahminlerini hesaplarla ve simülasyonla karşılaştır.",
    },
    sorting: {
      title: "The Cost of Order",
      term: "Sıralama algoritmaları",
      figure: "değerleri gösteren çubuklar ve sıralı bölümü belirten vurgu.",
      description:
        "Aynı diziyi seçmeli ve eklemeli sıralamayla sırala. Karşılaştırma ve taşıma sayaçlarını incele.",
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
