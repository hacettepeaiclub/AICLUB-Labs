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
      figure: "Gauss gürültüsü ve sonlu bir önsel dağılım",
      description:
        "Gürültülü bir görüntüden ters süreçle bir tahmin üret ve sonucun önsel dağılıma nasıl bağlı olduğuna bak.",
    },
    pca: {
      title: "The Widest Shadow",
      term: "Temel bileşenler analizi",
      figure: "bir nokta bulutu ve bulutun en geniş yayıldığı doğru.",
      description:
        "Önce bir matrisin doğrultusunu değiştirmediği yönleri, sonra bir veri bulutunun en geniş yayıldığı doğruyu bul.",
    },
    jepa: {
      title: "The Missing Piece",
      term: "Öz-denetimli öğrenme",
      figure: "gizli bir parçanın dört sayılık temsili, görünen komşularından tahmin ediliyor.",
      description:
        "Bir resmin bir kısmını gizle ve modelin, gizli parçanın temsilini görünen komşularından tahmin etmeyi nasıl öğrendiğine bak.",
    },
    generalization: {
      title: "Learned or memorised?",
      term: "Genelleme",
      figure: "eğitim noktalarına tam uyan esnek bir karar sınırı ve yeni örnekler.",
      description:
        "k'yı değiştir, sonra ayrı örnekleri göster ve eğitim doğruluğunu doğrulama doğruluğuyla karşılaştır.",
    },
    "word-embeddings-3d": {
      title: "The Map of Meaning, in 3D",
      term: "Word embedding, prototip",
      figure: "nokta olarak kelimeler ve bunlardan birine en yakın dört kelime.",
      description: "Bir prototip: aynı 318 kelime, iki yerine üç PCA eksenine indirgenmiş hâliyle.",
    },
    "word-embeddings": {
      title: "The Map of Meaning",
      term: "Word embedding",
      figure: "bir uzayda nokta olarak kelimeler ve bunlardan birine en yakın dört kelime.",
      description:
        "Kelimeleri bir haritada gez ve ekrandaki uzaklığı, 300 boyutlu vektörlerin kosinüs benzerliğiyle karşılaştır.",
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
      description: "Bir kelime seç ve modelin cümlenin hangi kısmına dayandığına bak.",
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
        "çıktısından geriye doğru türevlerin aktığı küçük bir ağ; çok değişmesi gereken bağlantı daha kalın.",
      description:
        "Ağın çıktısını çek ve her ağırlığın ne kadar değişmesi gerektiğine bak; sonra geri geçişi kendin hesapla.",
    },
    convolution: {
      title: "Nine Weights",
      term: "Evrişim",
      figure: "bir resmin üzerinde 3×3'lük bir pencere ve çıktıda hesapladığı hücre.",
      description:
        "Dokuz ağırlıklık bir çekirdeği resim üzerinde kaydır ve her çıktı hücresinin dokuz çarpımın toplamı olarak nasıl hesaplandığına bak.",
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
      figure: "sekiz sayılık önbellek blokları ve her erişimdeki isabet ya da ıska.",
      description:
        "Aynı sayıları satır ve sütun sırasıyla oku. Cihazında ölçülen süreleri önbellek modeliyle karşılaştır.",
    },
    "race-condition": {
      title: "Lost Update",
      term: "Yarış durumu",
      figure: "iki iş parçacığının yazmaçları, ortak sayaç ve okuma, artırma, yazma adımları.",
      description:
        "İki iş parçacığının adımlarını sırala. Bir artırmanın ne zaman kaybolduğunu ve kilidin bunu nasıl önlediğini incele.",
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
      figure: "iki farklı mesajın 256 bitlik SHA-256 özetleri.",
      description:
        "Bir mesaj yazıp bir karakterini değiştir. SHA-256 özetinde değişen bitleri say ve iki özetin ortak ön ekini karşılaştır.",
    },
    "multilayer-perceptrons": {
      title: "Bending the Line",
      term: "Çok katmanlı algılayıcılar",
      figure: "üç girdi, dört nöronlu bir gizli katman ve iki çıktı; her bağlantı çizili.",
      description:
        "İki renk nokta çiz ve küçük bir yapay sinir ağının onları ayırmayı nasıl öğrendiğine bak.",
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
      figure: "farklı uzunlukta tokenlere ayrılmış bir cümle; biri vurgulu.",
      description:
        "Bir cümlenin nerelerden kesildiğini tahmin et, sonra BPE birleştirmelerinin ve okunan derlemin token sayısını nasıl değiştirdiğine bak.",
    },
  },
};
