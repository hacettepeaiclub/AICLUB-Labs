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
    lede: "Algoritmalar, yapay sinir ağları ve bilgisayarın içindeki işleyiş üzerine on yedi deney. Uzun anlatım yerine elinizle değiştirip sonucunu hemen göreceğiniz düzenekler var.",
    cta: "Denemeye başla",
    labs: "Laboratuvarlar",
    labCount: (n: number) => `${n} düzenek`,
    experiments: "Deneyler",
    emptyTitle: "İlk deneyler hazırlanıyor.",
    emptyBody: "Laboratuvarlar eklendikçe burada listelenecek.",
    browse: "Laboratuvarlara göz at",
    continueLab: (title: string) => `Kaldığınız yerden devam edin: ${title}`,
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
      "Laboratuvarların hepsi bu kadar. Başka birini açmak için listeye dönebilirsiniz.",
    backToCollection: "Tüm laboratuvarlar",
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
    welcomeKicker: "İlk kez mi buradasınız?",
    show: "Bana gösterin",
    explore: "Kendim keşfedeyim",
    later:
      "Turu istediğiniz zaman başlığın altındaki “Nasıl çalışıyor?” düğmesinden yeniden izleyebilirsiniz.",
    tourLabel: "Rehberli tur",
    progress: (n: number, total: number) => `${n}/${total}`,
    next: "İleri",
    back: "Geri",
    done: "Anladım",
    close: "Turu kapat",
  },

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
        "Bir modelin APPLE'a en yakın bulduğu kelimeyi tahmin edin; sonra bu haritanın kelimeler hakkında neyi tuttuğuna bakın.",
    },
    "hypothesis-testing": {
      title: "Emin Olmanın Bedeli",
      term: "Hipotez testi",
      figure: "iki örneklem dağılımı, aralarında karar veren çizgi ve onun ötesindeki kuyruk.",
      description:
        "İki hipotezi birbirinden uzaklaştırın: reddetme bölgesi, göze aldığınız hatalar ve testin gücü birlikte değişir.",
    },
    "reinforcement-learning": {
      title: "Tam İstediğiniz Gibi",
      term: "Pekiştirmeli öğrenme",
      figure: "karelerden bir oda, robotun başladığı yer ve ulaşınca ödül aldığı kare.",
      description:
        "Bir robot için hangi karenin ne kadar değerli olduğunu siz belirleyin. Robot, istediğinizi değil ödüllendirdiğinizi öğrenir.",
    },
    attention: {
      title: "Model Nereye Bakıyor",
      term: "Attention",
      figure: "cümlesinin geri kalanına bakan bir kelime; en kalın yay, en çok baktığı yer.",
      description:
        "Bir kelime seçin ve cümlenin geri kalanına dağıttığı dikkati okuyun: en kalın yay, en çok baktığı kelime.",
    },
    "gradient-descent": {
      title: "Adımın Boyu",
      term: "Gradient descent",
      figure: "yukarıdan görülen bir çanak ve adımların tabanına indiği yol.",
      description:
        "Adım boyunu siz seçin. Yüzeyin biçimi o adımı kaldıramıyorsa yol hedefe inmek yerine dağılır.",
    },
    backpropagation: {
      title: "Suç Kimde?",
      term: "Geri yayılım",
      figure:
        "çıkışından geriye doğru hatanın aktığı küçük bir ağ; suçun çoğu nereye gidiyorsa orası daha kalın.",
      description:
        "Bir ağın çıktısını çekin; her ağırlığın hatadaki payı anında belirir. Sonra geri geçişi kendi elinizle yapın.",
    },
    convolution: {
      title: "Dokuz Ağırlık",
      term: "Evrişim",
      figure: "bir resmin üzerinde 3×3'lük bir pencere ve çıktıda yazdığı hücre.",
      description:
        "Dokuz ağırlığı bir resmin üzerinde kaydırıp kenarları buldurun; sonra aynı ağırlıkları gradient descent'in kendi bulmasına bırakın.",
    },
    "floating-point": {
      title: "0,1 + 0,2",
      term: "Kayan nokta",
      figure:
        "işaret, üs ve kesir bitleri olarak bir sayı; altında bu bitlerin tutabildiği değerlerin cetveli.",
      description:
        "0.1 yazın: bilgisayarınızın sakladığı sayı tam olarak 0.1 değil. 0.1 + 0.2'nin neden 0.3 etmediği de buradan çıkıyor.",
    },
    "cache-locality": {
      title: "Komşular Bedava",
      term: "Önbellek yerelliği",
      figure:
        "sekizli satırlar halinde sayılar; birini okumak bütün bloğunu, komşularıyla birlikte getirir.",
      description:
        "Aynı sayıları iki sırayla toplayıp kendi bilgisayarınızda ölçün. Biri kat kat yavaş; nedeni bellekte yan yana duran komşular.",
    },
    "race-condition": {
      title: "Kayıp Güncelleme",
      term: "Yarış durumu",
      figure:
        "iki iş parçacığının adımları iç içe; ikisi de yazmadan önce okur ve bir güncelleme kaybolur.",
      description:
        "Sayaca birer ekleyen iki iş parçacığının sırasını siz belirleyin. Sayaç 2 yerine 1'de kalacak sırayı bulabilir misiniz?",
    },
    "hash-tables": {
      title: "Hesaplanan Adres",
      term: "Hash tabloları",
      figure: "dolu bir yuvaya düşen ve ilk boş yuvaya kadar sağa adımlayan bir anahtar.",
      description:
        "Bir kelimeyi bir adrese çevirin, sonra tabloyu doldurun: tablo doldukça bir şeyi bulmanın maliyeti hızla büyür.",
    },
    "cryptographic-hashing": {
      title: "Dijital Parmak İzi",
      term: "Kriptografik hash",
      figure: "farklı uzunlukta iki girdi, tek bir fonksiyon ve aynı boyda iki çıktı.",
      description:
        "Tek bir karakteri değiştirin: SHA-256 özetinin bitlerinin yaklaşık yarısı değişir.",
    },
    "multilayer-perceptrons": {
      title: "Çizgiyi Bükmek",
      term: "Çok katmanlı algılayıcılar",
      figure: "üç girdi, dört nöronlu bir gizli katman ve iki çıktı; her bağlantı çizili.",
      description:
        "İki tür nokta çizin; onları ayıran sınırı bir ağın kendi kendine bulmasını izleyin.",
    },
    "graph-search": {
      title: "Yayılan Arama",
      term: "Graf araması",
      figure: "başlangıcından bir ızgaraya yayılan bir arama; parlak halka sınır.",
      description:
        "Engelleri siz çizin. BFS, Dijkstra ve A*'ın yolu ararken nereleri dolaştığı haritada iz bırakır.",
    },
    probability: {
      title: "Önce Tahmin, Sonra Hesap",
      term: "Olasılık",
      figure: "üç kapı ve sunucunun açtığı kapı.",
      description:
        "Şans hakkındaki sezgilerinizi sınayan altı deney. Önce tahmininizi yapın, sonra sayılarla karşılaştırın.",
    },
    sorting: {
      title: "Düzenin Bedeli",
      term: "Sıralama algoritmaları",
      figure: "kısadan uzuna sıralanmış çubuklar; son yerleşenler vurgulu.",
      description:
        "Veriyi siz çizin; her algoritmanın onu sıralarken kaç karşılaştırma ve kaç taşıma yaptığı sayılır.",
    },
    tokenization: {
      title: "Ucuz Kelimeler",
      term: "BPE tokenization",
      figure: "farklı uzunlukta token'lara bölünmüş bir cümle; biri vurgulu.",
      description:
        "Bir tokenizer'ı elinizle eğitin: okuduğu metin, hangi kelimelerin ona ucuza mal olacağını belirler.",
    },
  },
};
