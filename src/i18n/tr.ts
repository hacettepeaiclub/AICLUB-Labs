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
    footerTagline:
      "AI Club Labs: Bilgisayar bilimini oynayarak öğrenin.",
    byLine: "bir",
    parentOrg: "Hacettepe Yapay Zekâ Topluluğu",
    hashtag: "#AIForAll",
    footerRights: (year: number) => `© ${year} Hacettepe AI Club`,
    footerCredit: "Hacettepe Yapay Zeka Topluluğu projesidir",
    minutes: (n: number) => `${n} dk`,
    loadingLab: "Laboratuvar yükleniyor",
    openLab: "Laboratuvarı aç →",
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
    lede: "Dokuz etkileşimli deney — algoritmalar, yapay sinir ağları ve hesaplamanın işleyişi. Uzun anlatım yok, çevirip kaydıracağınız düğmeler var.",
    cta: "Denemeye başla",
    labs: "Laboratuvarlar",
    labCount: (n: number) => `${n} düzenek`,
    experiments: "Deneyler",
    emptyTitle: "İlk deneyler hazırlanıyor.",
    emptyBody: "Platform hazır — laboratuvarlar kendilerini kaydeder ve burada otomatik olarak görünür.",
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
  },

  labs: {
    // ------------------------------- embedding universe (3D prototype) ----
  "embedding-universe-3d": {
      title: "Gömme Evreni — 3B prototip",
      description:
        "Bir deney: aynı 318 kelime, iki yerine üç PCA eksenine indirgenmiş hâliyle.",
      lede: "Aynı kelimeler, aynı vektörler, bir eksen daha. Bulutu döndürmek için sürükle.",
      honesty:
        "Bu, gömmenin gerçek görüntüsü değildir. Uzayın 300 boyutu var; döndürdüğün şey, onun üç PCA eksenine indirgenmiş bir görünümü — düz haritadan bir eksen fazla, yine de neredeyse hiçbiri.",
      compare:
        "Bu bir prototip ve dersten bilerek ayrı tutuldu. Derinlik, bulutu bir mekân gibi hissettiriyor; ama projeksiyonu daha doğru yapmıyor. Bu takasın öğretmeye değip değmediğine karar vermek, prototipi yapmanın asıl sebebi.",
      error: "Kelime vektörleri yüklenemedi.",
      varianceLabel: "Açıklanan varyans",
      varianceHint: (dimensions: number) => `${dimensions} eksenin üçü`,
      selectedLabel: "Seçili",
      recapTitle: "Bu prototip ne gösteriyor",
      recap: {
        lessons: [
          "Üç eksen, uzayın ikiden biraz fazlasını taşıyor — yine de neredeyse hiçbirini.",
          "Derinlik bulutu bir mekân gibi hissettiriyor; bu, bilgilendirici olsun ya da olmasın ikna edici.",
          "Kelimeler, vektörler ve en yakın komşular düz haritayla birebir aynı; değişen yalnızca görüş.",
        ],
      },
      map: {
        mapLabel:
          "Üç boyutta kelime bulutu. Döndürmek için sürükle. Ok tuşları en yakın kelimeler arasında gezinir, Shift ve ok tuşları görüşü çevirir, Enter seçer.",
        hint: "Döndürmek için sürükle · Shift + ok tuşları",
        pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
        neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
          `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}`,
        selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Seçili`,
        pending: "Üç eksen hesaplanıyor…",
      },
    },

    // ------------------------------------------------ embedding universe ----
    "embedding-universe": {
      title: "Gömme Evreni",
      description:
        "Bir modelin APPLE'a en yakın gördüğü kelimeyi tahmin et, sonra bu kelime haritasının neyi sakladığını gör.",

      predict: {
        question: (word: string) => `${word} kelimesine en yakın hangisi?`,
        hint: "Üçü de ilgili — sen hangisini beklersin?",
        loading: "Kelime vektörleri yükleniyor…",
        chose: (word: string, rank: number, total: number, score: string) =>
          `${word} dedin — ${total} kelime içinde ${rank}. sırada, ${score} benzerlikle.`,
        nearest: (word: string, score: string) => `En yakını ${word}, ${score} benzerlikle.`,
        because:
          "Bu vektörler kelimelerin ne anlama geldiğinden değil, nasıl kullanıldığından öğrenildi. Haber ve ansiklopedi metinlerinde apple, meyvelerden çok software ile yan yana geçiyor.",
      },

      explore: {
        title: "Evreni keşfet",
        neighboursTitle: "En yakın kelimeler",
        announce: (word: string, gloss: string) => `${word} seçildi, ${gloss}.`,
        selectedLabel: "Seçili",
        nearestLabel: "En yakın, kosinüs",
      },

      map: {
        mapLabel: "Kelime haritası. Ok tuşları en yakın kelimeler arasında gezinir, Enter seçer.",
        pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
        neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
          `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}`,
        selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Seçili`,
        pending: "Kelimelerin nereye düştüğü hesaplanıyor…",
        linksNote:
          "Çizgiler, seçili kelimeyi yanında listelenen sekiz kelimeye bağlar. Bunlar okumayı kolaylaştırmak içindir, modelin parçası değildir — gömmede bağlantı yoktur, yalnızca mesafeler vardır.",
        pinnedLabel: (word: string, gloss: string) =>
          `${word} (${gloss}), karşılaştırma için tutuluyor`,
        compareLabel: (a: string, b: string, score: string) =>
          `${a} ile ${b} arasındaki benzerlik ${score}.`,
      },

      search: {
        label: "Kelime bul",
        placeholder: "türkçe ya da english…",
        noMatch: (query: string) => `Bu kümede “${query}” ile eşleşen kelime yok.`,
        resultsLabel: "Arama sonuçları",
        optionLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
      },

      neighbours: {
        title: (word: string) => `${word} kelimesine en yakınlar`,
        rankHeader: "Sıra",
        wordHeader: "Kelime",
        scoreHeader: "Benzerlik",
        rowLabel: (word: string, gloss: string, rank: number, score: string) =>
          `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}. Haritayı buraya taşımak için seç.`,
      },

      projection: {
        kicker: "Haritanın göstermedikleri",
        title: "Uzayın kendisine bakmıyorsun",
        lede: "Yukarıdaki kelimeler gerçek. Konumları ise 300 sayının 2'ye yassıltılmış hâli ve yassıltmak bir şeyleri kaybetmek zorunda. Tam olarak neyi kaybettiği burada.",
        modeLabel: "Bana göster",
        modeNone: "Kendi seçimim",
        modeHidden: "Yakın, uzağa çizilmiş",
        modeFalse: "Uzak, yakına çizilmiş",
        idle: "Yukarıdaki ikisinden birini seç ve o kelimelerin haritada nerede olduğuna bak.",
        // Türkçe sıra sayıları düzenli: sayının ardından nokta yeter.
        ordinal: (n: number) => `${n}.`,
        hiddenBody: (
          a: string,
          b: string,
          rank: string,
          total: number,
          score: string,
          percent: string,
        ) =>
          `${a} ile ${b}, ${total} çift içinde ${rank} en yakın çift, ${score} benzerlikle. Projeksiyon onları haritanın ${percent} kadarı uzağına koydu — resme bakarak ilişkili olduklarını asla tahmin edemezdin.`,
        falseBody: (
          a: string,
          b: string,
          screenRank: string,
          trueRank: string,
          total: number,
          score: string,
        ) =>
          `${a} ile ${b} ekranda ${screenRank} en yakın, neredeyse bitişik duruyor. Gerçek uzayda ise ${total} içinde ${trueRank} sıradalar, ${score} benzerlikle. Bu yakınlığı resim uydurdu.`,
        varianceLabel: "Açıklanan varyans",
        varianceHint: (first: string, second: string) => `PC1 ${first} + PC2 ${second}`,
        varianceBody: (percent: string, remaining: number) =>
          `Bu iki eksen, bu veri kümesindeki varyansın ${percent} kadarını açıklıyor. Geri kalan değişim hiçbir yere gitmedi — düz bir ekranda yeri olmayan diğer ${remaining} yönde duruyor.`,
        correlationLabel: "Mesafe uyumu",
        correlationHint: "−1.00 olsaydı harita hiçbir şey kaybetmemiş olurdu",
        pending: "Projeksiyon hesaplanıyor…",
      },

      data: {
        error: "Kelime vektörleri yüklenemedi.",
      },

      recap: {
        lessons: [
          "Gömme, bir öğeyi vektöre çevirir; böylece öğeler arasındaki ilişkiler mesafeye dönüşür.",
          "Bu ilişkiler kelimelerin anlamından değil, birlikte nasıl kullanıldıklarından gelir.",
          "300 boyutlu bir uzayın 2 boyutlu haritası bir gölgedir: gösterdiğinin bir kısmı orada yoktur, orada olanın bir kısmı da gösterilmez.",
        ],
      },

      honesty: {
        source:
          "Vektörler GloVe 6B 300d; Stanford NLP tarafından Wikipedia 2014 ve Gigaword 5 üzerinde önceden eğitildi. Bu lab her kelimeyi o yayımlanmış tablodan arayıp birim uzunluğa normalize ediyor; burada hiçbir şey eğitilmiyor, ince ayar yapılmıyor ya da üretilmiyor.",
        turkish:
          "Gömme uzayı İngilizcedir. Buradaki Türkçe kelimeler okumayı kolaylaştırmak için bizim eklediğimiz etiketlerdir — gömülmediler ve bu bir Türkçe gömme uzayı değildir.",
      },
      compare: {
        title: "İki kelimeyi karşılaştırın",
        hold: "Bu kelimeyi tut",
        holding: (word: string) => `Tutulan: ${word}`,
        release: "Bırak",
        idle: "Bir kelimeyi tutun, sonra haritadan bir başkasını seçin. Aralarındaki kosinüs bir yerden bakılmıyor, ölçülüyor.",
        samePoint: "Tuttuğunuz kelime bu. Başka birini seçin.",
        scoreLabel: "Benzerlik",
        rankLabel: "Sıra",
        rankValue: (rank: number, total: number) => `${total} içinde ${rank}.`,
        sentence: (a: string, b: string, score: string, rank: number, total: number) =>
          `${a} ile ${b} arasındaki kosinüs ${score}. Diğer ${total} kelime arasında ${b}, ${a} kelimesine en yakın ${rank}. kelime.`,
      },
    },
    // ------------------------------------------------ hypothesis testing ----
    "hypothesis-testing": {
      title: "Hipotez Testleri",
      description:
        "\u0130ki hipotezi birbirinden uzakla\u015ft\u0131r\u0131n ve emin olman\u0131n bedelini izleyin: red b\u00f6lgesi, kabul etti\u011finiz hatalar ve kar\u015f\u0131l\u0131\u011f\u0131nda ald\u0131\u011f\u0131n\u0131z g\u00fc\u00e7.",

      scope:
        "Bu kuramsal modeldir: ortalaman\u0131n iki normal \u00f6rnekleme da\u011f\u0131l\u0131m\u0131, ikisi de \u03c3/\u221an standart hatas\u0131yla ve \u03c3 bilinen kabul edilerek. S\u0131n\u0131r\u0131 t de\u011fil z yapan da budur. Bu laboratuvarda hi\u00e7bir yerde \u00f6rneklem \u00e7ekilmez \u2014 her say\u0131, g\u00f6sterilen denklemlerin kapal\u0131 form de\u011feridir; yani okudu\u011funuz \u015fey bir deneyin tek bir ko\u015fusu de\u011fil, modelin kendisidir.",

      testType: {
        right: "\u03bc\u2081 > \u03bc\u2080",
        left: "\u03bc\u2081 < \u03bc\u2080",
        two: "\u03bc\u2081 \u2260 \u03bc\u2080",
      },

      plot: {
        h0: "H\u2080",
        h1: "H\u2081",
        alphaTag: (value: string) => `\u03b1 = ${value}`,
        betaTag: (value: string) => `\u03b2 = ${value}`,
        summary: (
          mu0: string,
          mu1: string,
          se: string,
          criticals: string,
          alpha: string,
          beta: string,
          power: string,
        ) =>
          `\u0130ki normal e\u011fri. H\u2080 ${mu0} merkezli, H\u2081 ${mu1} merkezli, ikisinin de standart hatas\u0131 ${se}. S\u0131n\u0131r ${criticals} konumunda. H\u2080 alt\u0131nda s\u0131n\u0131r\u0131n \u00f6tesindeki taral\u0131 alan \u03b1 = ${alpha}; H\u2081 alt\u0131nda s\u0131n\u0131r\u0131n i\u00e7indeki taral\u0131 alan \u03b2 = ${beta}. G\u00fc\u00e7 ${power}.`,
      },

      controls: {
        moreLabel: "Di\u011fer ayarlar",
        note: "Her kontrol ayn\u0131 modeli yeniden ayarlar. Burada hi\u00e7bir \u015fey \u00f6rneklenmez.",
        mu0: "\u03bc\u2080 \u2014 s\u0131f\u0131r hipotezi ortalamas\u0131",
        mu0Value: (value: string) => `\u03bc\u2080 = ${value}`,
        mu1: "\u03bc\u2081 \u2014 alternatif ortalama",
        mu1Value: (value: string) => `\u03bc\u2081 = ${value}`,
        sigma: "\u03c3 \u2014 kitle yay\u0131l\u0131m\u0131",
        sigmaValue: (value: string) => `\u03c3 = ${value}`,
        alpha: "\u03b1",
        alphaValue: (value: string) => `\u03b1 = ${value}`,
        n: "n \u2014 \u00f6rneklem b\u00fcy\u00fckl\u00fc\u011f\u00fc",
        nValue: (value: number) => `n = ${value}`,
      },

      separation: {
        title: "\u0130ki hipotez",
        question: "\u0130ki hipotez birbirinden uzakla\u015ft\u0131\u011f\u0131nda ne olur?",
        caption:
          "Ayn\u0131 ortalama hakk\u0131nda iki iddia. Hi\u00e7biri veri de\u011fildir; ikisi de o iddia do\u011fru olsayd\u0131 n \u00f6l\u00e7\u00fcm\u00fcn ortalamas\u0131n\u0131n nas\u0131l davranaca\u011f\u0131d\u0131r.",
        mu1Label: "\u03bc\u2081 \u2014 alternatifi hareket ettirin",
        mu1Value: (value: string) => `\u03bc\u2081 = ${value}`,
        mu1Hint: "\u03bc\u2080 \u00fczerinden ge\u00e7irip di\u011fer tarafa ta\u015f\u0131y\u0131n.",
        mu0Label: "\u03bc\u2080",
        mu1Figure: "\u03bc\u2081",
        gapLabel: "Aral\u0131k",
        gapHint: "standart hata cinsinden",
        announce: (mu1: string, gap: string) =>
          `\u03bc\u2081 = ${mu1}. \u0130ki ortalama aras\u0131nda ${gap} standart hata var.`,
      },

      alphaSection: {
        kicker: "\u00c7izgiyi nereye \u00e7ekiyorsunuz",
        title: "Tek bir s\u0131n\u0131r; \u00f6tesindeki her \u015fey kan\u0131t say\u0131l\u0131r.",
        lede: "Bir testin kurala ihtiyac\u0131 vard\u0131r: sonu\u00e7 \u03bc\u2080'dan ne kadar uzakta d\u00fc\u015fmeli ki H\u2080'a inanmay\u0131 b\u0131rakas\u0131n\u0131z? Bu \u00e7izgi kritik de\u011ferdir ve \u03b1, H\u2080'\u0131n ne kadar\u0131n\u0131 bu \u00e7izginin yanl\u0131\u015f taraf\u0131nda b\u0131rakmaya raz\u0131 oldu\u011funuzdur.",
        caption:
          "\u03b1 yapt\u0131\u011f\u0131n\u0131z bir hata de\u011fildir. \u00d6nceden kan\u0131t saymay\u0131 kabul etti\u011finiz H\u2080 k\u00fctlesidir; kayd\u0131r\u0131c\u0131n\u0131n e\u011friyi de\u011fil \u00e7izgiyi oynatmas\u0131n\u0131n nedeni de budur.",
        alphaLabel: "\u03b1 \u2014 kabul etti\u011finiz yanl\u0131\u015f alarm",
        alphaValue: (value: string) => `\u03b1 = ${value}`,
        alphaHint: "H\u2080 alt\u0131ndaki taral\u0131 alan tam olarak bu say\u0131d\u0131r.",
        alphaFigure: "\u03b1",
        criticalLabel: "Kritik de\u011fer",
        criticalHint: "\u03bc\u2080 \u00b1 z\u00b7SE",
        criticalLeft: "Alt s\u0131n\u0131r",
        criticalRight: "\u00dcst s\u0131n\u0131r",
        seLabel: "SE",
        seHint: "\u03c3/\u221an",
        oneSided: (value: string) =>
          `\u03b1'n\u0131n tamam\u0131 tek kuyrukta: H\u2080'\u0131n ${value} kadar\u0131 s\u0131n\u0131r\u0131n \u00f6tesinde kal\u0131yor.`,
        twoSided: (half: string) =>
          `\u03b1 iki kuyru\u011fa b\u00f6l\u00fcn\u00fcr: her u\u00e7ta ${half}. B\u00f6ylece her s\u0131n\u0131r, tek y\u00f6nl\u00fc bir testin koyaca\u011f\u0131ndan daha d\u0131\u015farda durur.`,
        announce: (alpha: string, criticals: string) =>
          `\u03b1 = ${alpha}. S\u0131n\u0131r ${criticals} konumunda.`,
      },

      betaSection: {
        kicker: "Kimsenin saymad\u0131\u011f\u0131 hata",
        title: "\u03b2, H\u2081'in \u00e7izginin g\u00fcvenli taraf\u0131nda b\u0131rakt\u0131\u011f\u0131 k\u0131s\u0131md\u0131r.",
        lede: "\u03b1 H\u2080 alt\u0131nda, \u03b2 H\u2081 alt\u0131nda ya\u015far; ayn\u0131 s\u0131n\u0131r\u0131n z\u0131t taraflar\u0131nda. Birini k\u00fc\u00e7\u00fcltmek i\u00e7in s\u0131n\u0131r\u0131 oynat\u0131n, di\u011feri b\u00fcy\u00fcr \u2014 testi hangi y\u00f6ne \u00e7evirdi\u011finizin, \u00e7izgiyi nereye koydu\u011funuz kadar \u00f6nemli olmas\u0131n\u0131n nedeni budur.",
        caption:
          "\u03b2, bu belirli H\u2081 do\u011fruyken H\u2080'\u0131 reddetmeme olas\u0131l\u0131\u011f\u0131d\u0131r. G\u00fc\u00e7 1 \u2212 \u03b2'd\u0131r. \u0130kisi de modelin \u00f6zellikleridir, herhangi bir \u00f6rneklemin de\u011fil.",
        testTypeLabel: "H\u2081 ne iddia ediyor",
        mu1Label: "\u03bc\u2081",
        mu1Value: (value: string) => `\u03bc\u2081 = ${value}`,
        betaLabel: "\u03b2",
        betaHint: "reddedilmeyen H\u2081 k\u00fctlesi",
        powerLabel: "G\u00fc\u00e7",
        powerHint: "1 \u2212 \u03b2",
        alphaLabel: "\u03b1",
        reading: (beta: string) =>
          `\u03b2 = ${beta}: H\u2081'in bu kadarl\u0131k k\u0131sm\u0131, testin H\u2080'\u0131 reddetmedi\u011fi b\u00f6lgeye d\u00fc\u015f\u00fcyor.`,
        warning: {
          left: "Test \u03bc\u2081 < \u03bc\u2080 ar\u0131yor, ancak \u03bc\u2081 \u03bc\u2080'\u0131n alt\u0131nda de\u011fil. Alternatif da\u011f\u0131l\u0131m red b\u00f6lgesinden uzakta duruyor, dolay\u0131s\u0131yla neredeyse hi\u00e7 yakalanm\u0131yor: \u03b2 1'e, g\u00fc\u00e7 0'a yak\u0131n.",
          right: "Test \u03bc\u2081 > \u03bc\u2080 ar\u0131yor, ancak \u03bc\u2081 \u03bc\u2080'\u0131n \u00fczerinde de\u011fil. Alternatif da\u011f\u0131l\u0131m red b\u00f6lgesinden uzakta duruyor, dolay\u0131s\u0131yla neredeyse hi\u00e7 yakalanm\u0131yor: \u03b2 1'e, g\u00fc\u00e7 0'a yak\u0131n.",
        },
        announce: (beta: string, power: string) => `\u03b2 = ${beta}. G\u00fc\u00e7 = ${power}.`,
      },

      sampleSection: {
        kicker: "\u0130kisine birden yarayan tek kol",
        title: "Daha fazla veri her \u015feyi ayn\u0131 anda daralt\u0131r.",
        lede: "E\u011friler ayn\u0131 geni\u015flikte kald\u0131\u011f\u0131 s\u00fcrece \u03b1 ile \u03b2 birbirine kar\u015f\u0131 takas edilir. Geni\u015fli\u011fi de\u011fi\u015ftiren \u015fey n'dir: SE = \u03c3/\u221an. B\u00f6ylece iki da\u011f\u0131l\u0131m da kendi ortalamas\u0131 etraf\u0131nda s\u0131k\u0131\u015f\u0131r ve kimse daha fazla yanl\u0131\u015f alarm kabul etmeden \u00f6rt\u00fc\u015fme azal\u0131r.",
        caption:
          "x ekseni \u00b14,5 SE olarak \u00e7izilir, yani pencere de e\u011frilerle birlikte daral\u0131r. Kayd\u0131r\u0131c\u0131n\u0131n ikinci yar\u0131s\u0131n\u0131n ilk yar\u0131s\u0131ndan \u00e7ok daha az kazand\u0131rmas\u0131n\u0131n nedeni \u221an'dir.",
        nLabel: "n \u2014 \u00f6rneklem b\u00fcy\u00fckl\u00fc\u011f\u00fc",
        nValue: (value: number) => `n = ${value}`,
        formula: (se: string) => `SE = \u03c3/\u221an = ${se}`,
        nFigure: "n",
        seLabel: "SE",
        seHint: "\u03c3/\u221an",
        powerLabel: "G\u00fc\u00e7",
        betaLabel: "\u03b2",
        curveTitle: "\u00d6rneklem b\u00fcy\u00fckl\u00fc\u011f\u00fcne kar\u015f\u0131 g\u00fc\u00e7",
        eighty: "0,80",
        curveLabel: (from: number, to: number, first: string, last: string) =>
          `Di\u011fer her \u015fey sabitken n = ${from}'den n = ${to}'e g\u00fc\u00e7. ${first} civar\u0131nda ba\u015fl\u0131yor ve yakla\u015f\u0131k ${last} de\u011ferine ula\u015f\u0131yor.`,
        announce: (n: number, se: string, power: string) =>
          `n = ${n}. SE = ${se}. G\u00fc\u00e7 = ${power}.`,
      },

      challenge: {
        kicker: "\u015eimdi bir say\u0131y\u0131 tutturun",
        title: "G\u00f6revin istedi\u011fi g\u00fcce ula\u015f\u0131n.",
        lede: "\u0130ki g\u00f6rev. Her biri oynat\u0131lacak bir kontrol de\u011fil, ula\u015f\u0131lacak bir sonu\u00e7 belirtir; b\u00f6ylece hi\u00e7biri kayd\u0131r\u0131c\u0131y\u0131 belirli bir yere koyarak ge\u00e7ilemez \u2014 modelin o say\u0131y\u0131 ger\u00e7ekten bildirmesi gerekir.",
        puzzleLabel: "G\u00f6rev",
        reset: "Ba\u015fa d\u00f6n",
        powerLabel: "G\u00fc\u00e7",
        alphaLabel: "\u03b1",
        seLabel: "SE",
        target: (value: string) => `hedef ${value}`,
        notYet: (power: string, target: string) => `G\u00fc\u00e7 ${power}. ${target} de\u011ferine ula\u015fmas\u0131 gerekiyor.`,
        alphaTooHigh: (max: string) => `\u03b1 bu g\u00f6revin s\u0131n\u0131r\u0131n\u0131n \u00fczerinde: en fazla ${max} olabilir.`,
        announceSolved: (power: string) => `\u00c7\u00f6z\u00fcld\u00fc. G\u00fc\u00e7 = ${power}.`,
        announceAttempt: (power: string, alpha: string) => `G\u00fc\u00e7 ${power}, \u03b1 ${alpha}.`,
        puzzles: {
          "reach-power": {
            title: "0,80'e ula\u015f",
            brief: (power: string, alpha: string) =>
              `Etki ger\u00e7ek ama k\u00fc\u00e7\u00fck: \u03bc\u2081, \u03bc\u2080'\u0131n yar\u0131m birim \u00fczerinde ve test bunu yanl\u0131\u015f alarm verdi\u011finden ancak biraz daha s\u0131k buluyor. \u03b1'y\u0131 ${alpha} de\u011ferinin \u00fczerine \u00e7\u0131karmadan g\u00fcc\u00fc ${power} de\u011ferine getirin.`,
            lesson:
              "\u0130ki kol da i\u015fe yarar ama ayn\u0131 takas de\u011fildir. \u03b1, daha fazla yanl\u0131\u015f alarm kabul ederek g\u00fc\u00e7 sat\u0131n al\u0131r; n ise SE'yi daraltarak al\u0131r ve bunun veriden ba\u015fka bedeli yoktur.",
            solved: (power: string, alpha: string) =>
              `G\u00fc\u00e7 ${power}, \u03b1 = ${alpha}. Buraya n ve \u03b1'n\u0131n hangi kar\u0131\u015f\u0131m\u0131yla geldiyseniz gelin, s\u0131n\u0131r SE'ye g\u00f6re \u03bc\u2080'a yeterince yakla\u015ft\u0131 ve H\u2081'in b\u00fcy\u00fck k\u0131sm\u0131 onun \u00f6tesine d\u00fc\u015ft\u00fc.`,
          },
          noisy: {
            title: "Fazla g\u00fcr\u00fclt\u00fc",
            brief: (power: string, alpha: string) =>
              `\u03c3 = 3 ve test iki y\u00f6nl\u00fc; yani \u03b1 iki kuyru\u011fa b\u00f6l\u00fcn\u00fcyor ve her iki s\u0131n\u0131r da epey d\u0131\u015farda duruyor. \u03b1 en fazla ${alpha} olacak \u015fekilde ${power} g\u00fcce ula\u015f\u0131n.`,
            lesson:
              "\u0130ki y\u00f6nl\u00fc bir test, \u03b1'n\u0131n yar\u0131s\u0131n\u0131 alternatifin bulunmad\u0131\u011f\u0131 bir y\u00f6n\u00fc izlemeye harcar. Bir y\u00f6ne ba\u011flanmak bedava g\u00fc\u00e7t\u00fcr \u2014 ve yaln\u0131zca y\u00f6n konusunda hakl\u0131ysan\u0131z bedavad\u0131r.",
            solved: (power: string, alpha: string) =>
              `G\u00fc\u00e7 ${power}, \u03b1 = ${alpha}. \u03c3'y\u0131 k\u00fc\u00e7\u00fcltmek ya da n'yi b\u00fcy\u00fctmek SE'yi daralt\u0131r; tek y\u00f6nl\u00fc test ise \u03b1'n\u0131n tamam\u0131n\u0131 \u03bc\u2081'in ger\u00e7ekten bulundu\u011fu kuyru\u011fa koyar.`,
          },
        },
      },

      recap: {
        lessons: [
          "\u03b1, kritik de\u011ferin \u00f6tesindeki H\u2080 k\u00fctlesidir \u2014 hi\u00e7bir \u015fey g\u00f6rmeden \u00f6nce kabul etti\u011finiz yanl\u0131\u015f alarmlar.",
          "\u03b2, s\u0131n\u0131r\u0131n i\u00e7inde kalan H\u2081 k\u00fctlesidir ve g\u00fc\u00e7 1 \u2212 \u03b2'd\u0131r. \u0130kisi de \"herhangi bir etkiye\" g\u00f6re de\u011fil, belirli bir \u03bc\u2081'e g\u00f6re hesaplan\u0131r.",
          "S\u0131n\u0131r\u0131 oynatmak \u03b1 ile \u03b2'y\u0131 takas eder. \u0130kisini birden iyile\u015ftiren tek \u015fey SE = \u03c3/\u221an'dir; n'in taviz olmayan kol olmas\u0131n\u0131n nedeni budur.",
        ],
        footer:
          "Buradaki her \u015fey \u03c3'n\u0131n bilindi\u011fi kapal\u0131 form normal modeldir: ortalaman\u0131n iki \u00f6rnekleme da\u011f\u0131l\u0131m\u0131, tek bir s\u0131n\u0131r ve s\u0131n\u0131r\u0131n iki yan\u0131ndaki alanlar. Ger\u00e7ek testlerde \u03c3'n\u0131n \u00f6rneklemden kestirilmesi gerekir \u2014 t da\u011f\u0131l\u0131m\u0131n\u0131 gerekli k\u0131lan da budur \u2014 ve y\u00f6n\u00fcn veriden \u00f6nce mi sonra m\u0131 se\u00e7ildi\u011fi ayr\u0131 bir sorundur. Bu laboratuvar, o zorluklar\u0131n \u00fczerine oturdu\u011fu geometriyi g\u00f6sterir.",
      },
    },

    // ------------------------------------------------ reward playground ----
    "reward-playground": {
      title: "Ödül Laboratuvarı",
      description:
        "Bir robot için bir karenin ne kadar değerli olduğuna siz karar verin ve tam olarak dediğinizi yapmasını izleyin.",

      room: {
        title: "Oda",
        question:
          "Bu robota çıkış yolunu kimse göstermedi. Yolu deneyerek buldu — neyi önemseyeceğine ise siz karar veriyorsunuz.",
        sliderLabel: "İşaretli kare robot için ne kadar değerli?",
        sliderValue: (value: string) => `İşaretli karenin değeri ${value}`,
        hint: "Sürükleyin. Her oynattığınızda yol sıfırdan yeniden öğreniliyor.",
        wow: "Ona durmasını söylemediniz. O karenin kapıdan daha değerli olduğunu söylediniz.",
        behaviour: {
          avoided: "Kareye basmamak için uzun yoldan dolandı ve kapıya ulaştı.",
          passed: "Yolu üzerinde kareye basarak geçti ve kapıya ulaştı.",
          stayed: "Kapıya hiç gitmedi. Sadece karenin yanında oyalanıyor.",
        },
        readout: (steps: number, visits: number) =>
          `${steps} hamle · kareye ${visits} kez bastı`,
        mapLabel: (behaviour: string, steps: number, visits: number, at: number) =>
          `Yukarıdan görünen küçük bir oda. ${behaviour} Toplam ${steps} hamle, işaretli kareye ${visits} kez basıldı. Robot ${at}. hamlede.`,
      },

      learn: {
        kicker: "Bunu nasıl çözdü?",
        title: "Yapabileceği her hamle için bir sayı tuttu.",
        lede: "Buradaki hiçbir şey robotun öğrenmiş olabileceğinin bir resmi değil — kaydırıcıyı getirdiğiniz anda gerçekten öğrenmiş olduğu şey. Yukarıdaki kaydırıcıyı oynatın; bu sayfadaki her sayı yeni bir çalıştırmadan baştan hesaplanır.",

        scrubber: "Ne kadar deneme yaptığı",
        episode: (n: number) => `${n}. deneme`,
        scrubberValue: (episode: number, total: number) =>
          `${total} denemenin ${episode}. denemesinden sonra`,
        episodeLabel: "Yapılan deneme",

        mapLabel: (episode: number) =>
          `${episode} denemeden sonraki oda. Her kare, robotun orayı ne kadar iyi bulduğunu ve oradan hangi yöne gideceğini gösterir.`,
        cellLabel: (row: number, col: number, value: string, action: string) =>
          `Satır ${row}, sütun ${col}. Değeri ${value}. Buradan ${action} giderdi.`,
        wallCell: (row: number, col: number) => `Satır ${row}, sütun ${col}. Duvar.`,

        actions: { 0: "yukarı", 1: "aşağı", 2: "sola", 3: "sağa" },
        noAction: "hiçbir yere — burası kapı",
        bestAction: "en iyi",
        selectedTitle: (row: number, col: number) => `Satır ${row}, sütun ${col}`,
        chain: (row: number, col: number, action: string, value: string) =>
          `Satır ${row}, sütun ${col} üzerindeyken robotun yapabileceği dört hamle ve her biri için bir sayı var. En büyüğünü seçiyor — ${action} giderek elde ettiği ${value} — çünkü o hamle en son denediğinde onu daha iyi bir yere götürmüştü. Bunu birkaç yüz kez tekrarlayın, sayılar değişmeyi bırakır.`,

        unexploredLabel: "Uğramadığı kare",
        unexploredHint: "oraya gitmeyi bıraktı",

        propagation:
          "Kaydırıcıyı en başa çekin. İlk on-on beş denemede hiçbir şeyin değeri yok: robot dolanıyor ve attığı her adım ona biraz pahalıya geliyor. Sonra kapıya tesadüfen giriyor, kapının yanındaki bir kare pozitife dönüyor ve sonraki birkaç denemede bu iyi haber odaya doğru, kare kare yayılıyor. Öğrenmenin tamamı bu yayılma.",

        formulaTitle: "Her hamleden sonra uyguladığı kural",
        formulaNote:
          "Şöyle okuyun: az önce yaptığınız hamlenin sayısını, gerçekte elde ettiğiniz ödüle ve vardığınız yerden artık mümkün gördüğünüz en iyi değere doğru biraz kaydırın. α bu kaydırmanın büyüklüğü, γ ise ileride gelecek bir ödülün şimdikine kıyasla ne kadar değerli sayıldığı.",

        honesty:
          "Robot odanın tamamını öğrenmedi. İşine yarayan bir yol öğrendi ve geri kalanını keşfetmeyi bıraktı; bu yüzden bazı kareler hâlâ en baştaki tahminini taşıyor. Bu yöntemin bir kusuru değil — yalnızca kendi deneyiminden öğrenmek tam olarak böyle görünür.",

        scheduleWarning:
          "Kaydedilen denemeler eşit aralıklı, bu da öğrenmenin gerçekleştiği kısmı gizliyor.",
      },

      recap: {
        lessons: [
          "Ödül bir talimat değildir. Bir puandır ve robot en yüksek puanı veren davranışı bulur — aklınızdan hiç geçmemiş olanı bile.",
          "Deneyerek öğrenir: her hamle bir sayıyı günceller ve işe yarayan sayılar, ilk kez iyi giden şeyden dışa doğru yayılır.",
          "Aklınızdaki sonucu değil, gerçekten yazdığınız ödülü optimize eder.",
        ],
        footer:
          "Bu, küçük ve deterministic bir grid üzerinde gerçek tabular Q-learning'dir: yirmi yedi kare, dört hamle, her ikili için bir sayı. Gerçek robotlar ve büyük pekiştirmeli öğrenme sistemleri bundan çok daha karmaşıktır — ama verdiğiniz ödülle istediğiniz sonuç arasındaki açık, sistemler büyüdükçe kapanmıyor.",
      },
      world: {
        title: "Oda",
        question: "Ajan ne yapmalı?",
        sliderHint:
          "Dünyaya dair karar verebileceğiniz tek şey bu. Geri kalan her şey — duvarlar, kapı, bir hamlenin maliyeti — sabit.",
        caption:
          "Henüz hiçbir şey öğrenmiyor. Kontrol sizde. Her hamle 0,5 götürür, işaretli kare her girişte sizin belirlediğiniz kadar öder, kapı ise 20 öder ve turu bitirir.",
        mapLabel: (moves: number, total: string) =>
          `Yukarıdan görünen küçük bir oda: duvarlar, işaretli bir kare ve bir kapı. Ajan ${moves} hamle yaptı, toplam ${total}.`,
        padLabel: "Ajanı hareket ettirin",
        padHint: "Ya da yön tuşlarını kullanın.",
        arrived: "Kapıya ulaştınız. Bu, turu bitirir.",
        restart: "Başa dön",
        ledgerTitle: "Her hamle ne ödedi",
        ledgerEmpty: "Bir hamle yapın. Neye mal olduğu ve nedeni burada görünecek.",
        consequence: {
          floor: "bir kare ilerledi",
          wall: "duvara çarptı ve yerinde kaldı",
          square: "işaretli kareye bastı",
          door: "kapıya ulaştı",
        },
        rewardKind: { step: "hamle", tile: "kare", goal: "kapı" },
        movesLabel: "Hamle",
        totalLabel: "Toplanan",
        totalHint: "bütün hamlelerin toplamı",
        squareLabel: "İşaretli kare",
        squareHint: "her girişte",
        rulesLabel: "Buradan her hamle ne öderdi",
        previewHint: "Ajan bu tabloyu göremez. Ancak hareket ederek öğrenir.",
        moveAnnounce: (action: string, paid: string, total: string) =>
          `${action} yönünde hareket edildi. Bu ${paid} ödedi. Toplam ${total}.`,
      },

      train: {
        kicker: "Kimse ona yolu göstermedi",
        title: "Deniyor; öğrenme de zaten bu deneme.",
        lede: "Eğit'e basın. Ajan köşeden hiçbir şey bilmeden başlar, dolanır ve sonunda kapıya tesadüfen düşer. O andan itibaren elinde bir şey vardır. Aşağıdaki her ok, her sayı ve eğrideki her nokta o koşunun kendisidir — kaydı değil.",
        caption:
          "Adım'a bir basış bir hamledir: seç, hareket et, ödülü topla, bir sayıyı güncelle. Eğit aynı şeyi tur tur tekrarlar.",
        runLabel: "Eğit",
        oneEpisode: "Bir tur",
        speedLabel: "Saniyedeki tur",
        mapLabel: (episode: number, total: number) =>
          `${total} turun ${episode}. turunda oda. Oklar, politikanın her karede seçeceği hamledir; iz ise sürmekte olan turun rotasıdır.`,
        curveTitle: "Tur başına ödül",
        curveEmpty: "Bir iki tur çalıştırın, eğri burada başlasın.",
        curveLabel: (episodes: number, first: string, last: string) =>
          `${episodes} turun her birinde toplanan ödül, yumuşatılmış. ${first} civarında başlıyor ve sonunda ${last} civarına geliyor.`,
        episodeShort: (n: number) => `tur ${n}`,
        lastEpisode: (episode: number, steps: number, reward: string, outcome: string) =>
          `Tur ${episode}: ${steps} hamle, ${reward} toplandı, ${outcome}.`,
        notStarted: "Henüz bir şey olmadı. Adım'a ya da Eğit'e basın.",
        outcome: { reached: "kapıya ulaştı", ranOut: "hamlesi bitti" },
        episodeLabel: "Tur",
        ofTotal: (total: number) => `/ ${total}`,
        successLabel: "Kapıya ulaştı",
        successHint: (n: number) => `son ${n} tur`,
        stepsLabel: "Son turdaki hamle",
        rewardLabel: "Son turun ödülü",
        announce: (episode: number, reward: string) =>
          `Tur ${episode}. Şu ana kadar ${reward} toplandı.`,
        announceDone: (total: number) => `Eğitim ${total} tur sonunda bitti.`,
      },

      policy: {
        kicker: "Bunu yaparken ne kurdu",
        title: "Her hamle için bir sayı, ve onlardan düşen bir rota.",
        lede: "Ajan hiçbir zaman bir rota saklamadı. Kare başına, yön başına tek bir sayı sakladı — o hamlenin ne kadar iyi çıktığını — ve rota, hep en büyüğünü seçtiğinizde ortaya çıkan şeydir. Solda: tek bir tur öncesi. Sağda: şu an.",
        caption:
          "Bir ok, Q-değeri değildir. O karedeki en büyük Q-değerine sahip hamledir; politika kelimesinin anlamı da budur. Seçildiği dört sayı aşağıda.",
        beforeTitle: "Eğitimden önce",
        beforeLabel:
          "Hiç eğitim yapılmadan önceki oda. Bütün sayılar sıfır olduğu için her kare aynı yönü gösteriyor — hiçbir şey bilmemek böyle görünür.",
        afterTitle: (episode: number) => `${episode} tur sonra`,
        afterLabel: (episode: number) =>
          `${episode} tur sonrasında oda. Her kare, politikanın orada seçtiği hamleyi ve oradaki en iyi hamlenin ne kadar iyi olduğunu gösteriyor. Dört sayısını da görmek için bir kare seçin.`,
        pickLabel: "Bir kareyi inceleyin",
        pickHint: "Bir kareye tıklayın ya da yön tuşlarıyla gezinin.",
        selects: (row: number, col: number, action: string, value: string) =>
          `${row}. satır, ${col}. sütunda dört hamlenin dört sayısı var. Politika ${action} yönünü seçiyor, çünkü ${value} bunların en büyüğü.`,
        episodeLabel: "Çalıştırılan tur",
        routeLabel: "Rota uzunluğu",
        routeHint: "hamle, keşif yapmadan",
        routeNone: "kapıya ulaşmıyor",
        valueLabel: "Buradaki en iyi değer",
        valueHint: "dördün en büyüğü",
      },

      update: {
        kicker: "Bunu neden öğrendi?",
        title: "Tek bir sayı değişti. Bütün nedeni burada.",
        lede: "Her hamleden sonra ajan tam olarak bir sayıyı değiştirir: az önce yaptığı hamleninkini. Aşağıdaki her şey yukarıdaki koşudan gelen en son güncellemedir — elindeki sayılar, dünyanın ödediği ve şimdi elinde tuttuğu.",
        caption:
          "Bu sayfada hiçbir şey örnek değildir. Hiç hamle yapılmadıysa hiçbir şey gösterilmez; çünkü gerçekleşmemiş bir güncellemeye bakmanın değeri yoktur.",
        nothingYet: "Henüz hamle yapılmadı. Yukarıdan ya da buradan Adım'a basın.",
        stepLabel: "Bir hamle yap",
        stepHint: "Her basış ajanı bir kez hareket ettirir ve bir sayıyı günceller.",
        whatHappened: "Az önce ne oldu",
        sentence: (
          row: number,
          col: number,
          action: string,
          choice: string,
          landed: string,
          reward: string,
        ) =>
          `${row}. satır, ${col}. sütundan ${action} yönüne hareket etti — ${choice}. ${landed} ve dünya ${reward} ödedi.`,
        choice: {
          explored: "rastgele bir hamle, mevcut en iyisi değil",
          exploited: "mevcut en iyi hamlesi",
        },
        landed: {
          wall: "duvara çarpıp olduğu yerde kaldı",
          moved: (row: number, col: number) => `${row}. satır, ${col}. sütuna indi`,
        },
        panels: {
          belief: "Neye inanıyordu",
          beliefBody: "Bundan önce o hamlenin ne değerde olduğunu düşünüyordu.",
          evidence: "Az önce ne öğrendi",
          evidenceBody:
            "Topladığı ödül, artı indiği yerden ulaşılabilir olduğunu düşündüğü en iyi değer.",
          updated: "Şimdi neye inanıyor",
          updatedBody: "Eski sayı, yeni kanıta doğru yolun bir kısmını gitti.",
        },
        formulaTitle: "Kural, hamle başına bir kez",
        tableCaption: "Güncellemenin her terimi ve bu hamlede aldığı değer.",
        terms: {
          before: "Q(s,a) önce",
          reward: "r — toplanan",
          bootstrap: "γ · max Q(s′,a′) — indiği yerden en iyisi",
          target: "r + γ · max Q(s′,a′) — hedeflediği",
          error: "kapattığı fark",
          after: "Q(s,a) sonra",
        },
        errorLabel: "Şaşkınlık",
        errorHint: "ne kadar yanılmıştı",
        movedLabel: "Sayının hareketi",
        movedHint: "α çarpı şaşkınlık kadar",
        epsilonLabel: "Keşif oranı",
      },

      rules: {
        kicker: "Kuralları değiştirin",
        title: "Üç kadran ve her birinin gerçekte neyi değiştirdiği.",
        lede: "Bunlardan birini oynattığınızda koşu birinci turdan yeniden başlar; çünkü öğrenme oranını yarı yolda değiştirmek diye bir şey yoktur. Sonra yukarıdaki bölümde Eğit'e basıp eğriyi izleyin.",
        caption:
          "Bu oda küçük. Üçünü de taradığımızda ajanın neredeyse her ayarla odayı çözdüğü görüldü — bunların değiştirdiği şey, eğrinin ne kadar hızlı oturduğu, yolda ne kadar gürültülü olduğu ve oturup oturmadığı.",
        curveTitle: "Bu koşuda tur başına ödül",
        curveEmpty: "Doldurmak için yukarıdan Eğit'e basın.",
        curveHint: "On tur üzerinden yumuşatıldı. Her nokta çalıştırılmış bir tur.",
        curveLabel: (episodes: number, last: string, settled: string) =>
          `${episodes} tur boyunca tur başına ödül, ${last} civarında bitiyor. ${settled}. turda oturdu.`,
        alpha: {
          label: "Öğrenme oranı α",
          valueText: (value: string) => `Öğrenme oranı ${value}`,
          what: "Tek bir yeni deneyimin sayıyı ne kadar oynattığı. Yüksek olan hızlı öğrenir ve hızlı unutur.",
        },
        gamma: {
          label: "İndirim γ",
          valueText: (value: string) => `İndirim ${value}`,
          what: "İleride gelecek bir ödülün, şimdiki bir ödüle kıyasla ne kadar saydığı.",
        },
        epsilon: {
          label: "Keşif ε",
          valueText: (value: string) => `Keşif ${value}`,
          what: "Mevcut en iyisi yerine ne sıklıkta rastgele hamle yaptığı. Koşu boyunca azalır.",
        },
        restore: "Varsayılanlara dön",
        settledLabel: "Oturduğu tur",
        settledHint: "arka arkaya yirmi turun hepsinin bittiği ilk tur",
        notSettled: "hiç",
        successLabel: "Kapıya ulaştı",
        successHint: "son 50 tur",
        stepsLabel: "Tur başına hamle",
        stepsHint: "son 50'nin ortalaması",
        scopeLabel: "Bunun göstermediği",
        scope:
          "Bu üçü, 27 kareli deterministik bir ızgarada tablo tabanlı Q-learning'in parametreleridir. Daha büyük bir pekiştirmeli öğrenme sisteminin aynı biçimde sahip olacağı ayarlar değildir ve herhangi birinin buradaki etkisi, başka yerdeki etkisinin büyüklüğü hakkında bir şey söylemez.",
      },

      challenge: {
        kicker: "Şimdi ödülü siz belirleyin",
        title: "Bunu ona öğretebilir misiniz?",
        lede: "Üç görev. Her birinde ajan sizin istemediğiniz bir şey yapıyor ve değiştirebileceğiniz tek bir sayı var. Hiçbiri kaydırıcıyı belirli bir yere koyarak geçilemez — ajanın o şeyi gerçekten yapması gerekir.",
        puzzleLabel: "Görev",
        levers: {
          tileReward: "İşaretli karenin ödediği",
          epsilon: "Keşif ε, sabit tutulur",
        },
        leverValue: (name: string, value: string) => `${name}: ${value}`,
        leverHint: {
          tileReward: "Her değişiklikte sıfırdan yeniden eğitilir.",
          epsilon: "Koşu boyunca bu değerde tutulur, azalma yok.",
        },
        puzzles: {
          cross: {
            title: "Üstünden geçsin",
            brief:
              "Kare −3 değerinde, bu yüzden ajan iki fazla hamle yapıp etrafından dolaşıyor. Bunun yerine kapıya giderken karenin üstünden geçmesini sağlayın — ama orada durmasına yol açmadan.",
            lesson:
              "Bir eşik değil, bir aralık var. Karenin değeri, kazandırdığı dolambaçtan fazla ve yerini alacağı kapıdan az olmalı.",
          },
          camp: {
            title: "Kapıdan vazgeçsin",
            brief:
              "Kare hiçbir şey etmiyor, bu yüzden ajan üstünden geçip yoluna devam ediyor. Kapıya hiç gitmemesini sağlayın. Kapıyı ya da duvarları oynatamazsınız — yalnızca karenin ödediğini.",
            lesson:
              "Ona durmasını hiç söylemediniz. Karenin bitirmekten daha değerli olduğunu söylediniz, o da size inandı. Tek bir kaydırıcıda bütün laboratuvar.",
          },
          settle: {
            title: "Bir türlü oturmuyor",
            brief:
              "Keşif bütün koşu boyunca 0,9'a sabitlenmiş: on hamlenin dokuzu rastgele. Sondaki tablo gayet iyi ama ajan turları neredeyse hiç bitiremiyor. Kapıya güvenilir biçimde ulaşmasını sağlayın.",
            lesson:
              "Rotayı bulan şey keşiftir; sonra da onu kullanmanızı engelleyen şey odur. Bu koşu rotayı sürekli çöpe atıyor.",
          },
        },
        behaviour: {
          avoided: "karenin etrafından dolaşıp kapıya ulaşıyor",
          passed: "yolda karenin üstünden geçip kapıya ulaşıyor",
          stayed: "kapıya hiç ulaşmıyor — karenin yanında kalıyor",
        },
        behaviourShort: {
          avoided: "etrafından dolaşıyor",
          passed: "üstünden geçiyor",
          stayed: "yerinde kalıyor",
        },
        behaviourLabel: "Ne yapıyor",
        stepsLabel: "Rota uzunluğu",
        successLabel: "Biten tur",
        successHint: "koşunun son 50 turu",
        verdict: {
          solved: "İşte bu. Ajan görevin istediğini yapıyor.",
          untouched: "Kaydırıcıyı oynatın, ajan sıfırdan yeniden eğitilsin.",
          notYet: (behaviour: string) => `Henüz değil — ${behaviour}.`,
        },
        mapLabel: (behaviour: string, steps: number) =>
          `Bu ayarlarla eğitim sonrası oda: ${steps} hamlede ${behaviour}.`,
        announceSolved: (title: string) => `Çözüldü: ${title}.`,
        announceAttempt: (behaviour: string) => `Yeniden eğitildi, ${behaviour}.`,
      },
    },

    // ------------------------------------------------------- attention ----
    attention: {
      title: "Attention Laboratuvarı",
      description: "Bir kelime seçin ve modelin cümlenin hangi kısmına yaslandığını izleyin.",

      hero: {
        title: "Bu kelime nereye bakıyor?",
        question: "Her kelime diğerlerine bakıyor. Birini seçin ve nereye baktığını görün.",
      },

      sentenceLabel: "Cümle. Nereye baktığını görmek için bir kelime seçin.",
      sentenceHint:
        "Kelimeler arasında gezinmek için sol ve sağ ok tuşlarını, iki uca atlamak için Home ve End tuşlarını kullanın.",
      tokenLabel: (word: string, share: number, position: number, total: number) =>
        `${word}, yüzde ${share}, ${total} kelimeden ${position}.`,
      percent: (share: number) => `%${share}`,
      pair: (word: string, share: number) => `${word} yüzde ${share}`,
      announce: (word: string, targets: string) => `${word} en çok şuraya bakıyor: ${targets}.`,
      mostlyLookingAt: (word: string) => `“${word}” en çok şuraya bakıyor`,
      nearTie:
        "Bu ikisi neredeyse başa baş. Bu küçük modelin dil bilgisi yok; seçtiğiniz kelimenin hangisiyle ilişkili olduğunu ayırt edemiyor.",

      swapLabel: "Bir kelimeyi değiştirin",
      swapHint:
        "Beşinci kelimeyi değiştirin ve seçili kelimeye ne olduğuna bakın — ona hiç dokunmadığınız hâlde.",
      dogNote:
        "Artık iki canlı var ve model dikkatini ikisi arasında neredeyse eşit paylaştırdı. Dağılım değişti ama hangisinin yorgun olduğunu hâlâ ayırt edemiyor.",

      reveal: {
        kicker: "Nasıl karar verdi?",
        title: "Tek bir sayı, baştan sona.",
        lede: "Bu bölüm yukarıda seçili olan kelimeyi izler. Seçimi ya da değiştirilen kelimeyi değiştirin; buradaki her adım onunla birlikte değişir — çünkü bu, aynı hesabın kendisidir, ikinci bir kopyası değil.",
      },

      trace: {
        step1: "Seçtiğiniz kelime",
        step1Title: (word: string) => `“${word}” ile başlayın`,
        step1Note:
          "Aşağıdaki her şey, bu tek kelimenin diğerlerinin her biriyle sırayla karşılaştırılmasıdır.",

        step2: "Ne aradığı",
        step2Title: (word: string) => `“${word}” bunu istiyor — query'si`,
        step2Note:
          "Sağa uzanan bir çubuk kelimenin istediği bir özelliktir; sola uzanan ise özellikle aramadığı bir özelliktir. Bunlar modelin ne istediğine dair kendi ifadeleridir, okunabilir hâle getirilmiştir — gerçek bir modelinkiler hiç okunabilir değildir.",

        step3: "Diğer kelimenin sunduğu",
        step3Title: (word: string) => `“${word}” bunu sunuyor — key'i`,
        step3Note:
          "Query ve key bilerek iki farklı projeksiyondan gelir: bir kelimenin sunduğu şey, istediği şeyle aynı değildir. Attention'ın benzerlik ölçmekten fazlası olmasının nedeni budur.",

        step4: "Eşleşme",
        step4Title: (score: string) => `Örtüşme değeri ${score}`,
        step4Note: (from: string, to: string) =>
          `“${from}” kelimesinin istediğiyle “${to}” kelimesinin sunduğunu çarpın, toplayın ve eksen sayısının kareköküne bölün. Bu son adım, model genişledikçe sayıları çalışılabilir bir aralıkta tutar.`,

        step5: "%100'ün payı",
        step5Title: (share: number) => `Bu da dikkatin %${share} kadarı oluyor`,
        step5Note:
          "Paylar her zaman %100'e tamamlanır; yani bunlar puan değil, pay. Yeni bir rakip eklendiğinde izlediğiniz pay da dahil olmak üzere diğer bütün payların küçülmesinin nedeni tam olarak budur.",
        tableCaption: "En güçlü birkaç kelime için eşleşme ve dikkat payı.",
        colToken: "Kelime",
        colScore: "Eşleşme",
        colShare: "Pay",

        step6: "Neye dönüştüğü",
        step6Title: (word: string) => `“${word}” artık bir karışım taşıyor`,
        step6Note:
          "Attention yalnızca nereye bakılacağıyla ilgili değildir. Baktığı her kelime, payı oranında kendi value'sunu katar; böylece kelime, baktığı şeylerin bir karışımını taşımaya başlar. Gerçek bir modelde bir sonraki katmana ulaşan şey bu karışımdır.",

        axes: {
          nounness: "ad gibi",
          animacy: "canlı",
          verbness: "eylem gibi",
        },
      },

      honesty:
        "Bu, küçük ve eğitim amaçlı bir self-attention modelidir. Yedi özelliği ve üç projeksiyon matrisi bu deney için elle yazıldı; metinden öğrenilmedi. Gerçek bir model, kimsenin adlandırmadığı temsilleri yüzlerce boyutta öğrenir. Burada gerçek olan aritmetiktir: bir Transformer'ın yaptığı karşılaştırmanın, ölçeklemenin, softmax'in ve ağırlıklı toplamın aynısı.",

      recap: {
        lessons: [
          "Attention, bağlam üzerine sabit bir %100'lük odağı dağıtır; yani her kelime evet ya da hayır değil, bir pay alır.",
          "Bir kelimeyi değiştirmek diğerlerinin paylarını da değiştirir — dokunmadığınız kelimeler dahil, çünkü hepsi aynı %100'ü paylaşıyor.",
          "Attention, çok daha büyük bir modelin içindeki tek bir mekanizmadır. Nereye bakılacağına ve neyin karıştırılacağına karar verir; tek başına cümleyi anlamaz.",
        ],
        footer:
          "Buradaki kelimelere elle yazılmış yedi özellik verildi; bu yüzden model bir kediyi bir toptan ayırabiliyor ama bir topu bir aynadan ayıramıyor. Gerçek Transformer'lar çok daha zengin temsiller kurmak için çok sayıda head ve katmanı üst üste yığar — bu, bu sayfanın anlattığından farklı ve çok daha uzun bir hikâye.",
      },
      pickLabel: "Kelime",
      wholeRowLabel: "Bütün paylar, cümle sırasıyla",
      mixLabel: "Her birinin kattığı",

      figures: {
        selected: "Seçili",
        biggestShare: "En büyük pay",
        sharesTotal: "Payların toplamı",
        matchedWith: "Yaslandığı",
        rawMatch: "Eşleşme",
        score: "Bölme sonrası",
        axes: "Eksen",
        divisor: "Bölen",
        peakWith: "En büyük pay",
        peakWithout: "Bölme olmasaydı",
        aboveTen: "Onda birin üstündeki kelime",
      },

      scale: {
        kicker: "Bölme neden var?",
        title: "Böleni kaldırın, paylar çöküyor.",
        lede: "Eksen sayısının kareköküne bölmek, etkisini sonuca bakarak göremeyeceğiniz tek adımdır — alternatifiyle karşılaştırana kadar sonuç her iki hâlde de makul görünür. Bu yüzden aynı satır burada iki kez var: bir kez bu modelin hesapladığı gibi, bir kez de bölme atlanarak.",
        collapse:
          "Bölme atlanınca puanlar daha büyük kalıyor ve daha büyük sayılar üzerindeki softmax daha keskin oluyor: bütçenin neredeyse tamamı tek bir kelimeye gidiyor, geri kalanı yuvarlanıp yok oluyor. Okunacak bir dağılımı ortada bırakan şey, bu bölme.",
        note: "Her iki sütun da burada, aynı puanlar üzerinde aynı softmax ile hesaplanıyor. Sayfanın başka hiçbir yerinde bölünmemiş olan kullanılmıyor.",
        tableCaption:
          "En güçlü birkaç kelime için: eşleşme, bölme sonrası eşleşme ve her iki durumda payına düşen oran.",
        colRaw: "Eşleşme",
        colScaled: "Bölünmüş",
        colWithout: "Bölmesiz pay",
        colWith: "Bölmeli pay",
      },

      softmax: {
        kicker: "Eşleşmelerden paylara",
        title: "On puan, tek bir bütçe.",
        lede: "Softmax, eşleşme satırını toplamı %100 olan bir pay satırına çevirir. Hiçbir şey atılmaz ve hiçbir şey seçilmez: her kelime bir pay alır ve paylar ancak birbirinden çıkabilir.",
      },

      mix: {
        kicker: "Payların harcandığı yer",
        title: "Paylar bir hüküm değil, birer katsayı.",
        lede: "Bakılan her kelime, payı oranında kendi value vektörünü verir. Bunları toplayınca seçili kelimenin dönüştüğü şey ortaya çıkar — gerçek bir modelde bir sonraki katmana ulaşan da budur.",
        tableCaption: "En çok katkı veren üç kelime için pay ve value vektörü.",
        outputLabel: "Karışmış çıktı, eksen eksen",
      },
    },

    // ------------------------------------------------ gradient descent ----
    "gradient-descent": {
      title: "Gradient Descent",
      description:
        "Bir yüzeyin biçiminin, atmanıza izin verilen adımın boyutunu nasıl belirlediğini görün.",

      controls: {
        run: "Çalıştır",
        pause: "Duraklat",
        reset: "Sıfırla",
        stepOnce: "Tek adım",
        scrubber: "Adım",
        scrubberValue: (index: number, total: number) => `${total} adımdan ${index}. adım`,
        stepSize: "Adım boyu",
        learningRate: "Adım boyu η",
        learningRateValue: (value: string) => `Adım boyu ${value}`,
        beta: "Momentum β",
        betaValue: (value: string) => `Momentum beta ${value}`,
        curvature: "Eğrilik oranı",
        curvatureValue: (value: string) => `Koşul sayısı ${value}`,
        optimizer: "Optimizer",
        resetPoint: "Noktayı geri al",
        aboutThisSurface: "Bu yüzey hakkında",
        stepSizeAndScale: "Adım boyu",
      },

      optimizers: {
        gd: "Gradient Descent",
        momentum: "Momentum",
        adam: "Adam",
      },

      status: {
        running: "Çalışıyor",
        converged: "Hedefe ulaştı",
        diverged: "Iraksadı",
        exhausted: "Adımlar tükendi",
      },

      figures: {
        step: "Adım",
        objective: "Amaç değeri",
        objectiveHint: "f fonksiyonunun buradaki değeri",
        gradientNorm: "Gradient büyüklüğü",
        position: "Konum",
        status: "Sonuç",
        conditionNumber: "Koşul sayısı",
        conditionNumberHint: "κ = dik eğrilik ÷ düz eğrilik",
        stepsTaken: (n: number) => `${n} adım`,
        stepsToTolerance: "Hedefe kadar adım",
      },

      map: {
        label: (
          x: string,
          y: string,
          step: number,
          objective: string,
          gradient: string,
          status: string,
        ) =>
          `Amaç fonksiyonunun eşyükselti haritası. Adım ${step}. Konum ${x}, ${y}. Amaç değeri ${objective}. Gradient büyüklüğü ${gradient}. ${status}.`,
      },

      chart: {
        label: (objective: string, step: number) =>
          `Amaç değerinin adım sayısına göre logaritmik grafiği. ${step}. adımda amaç değeri ${objective}.`,
      },

      announce: {
        ready: "Başlangıç noktasına dönüldü.",
        finished: (steps: number, status: string) => `${steps} adım sonra bitti. ${status}.`,
      },

      find: {
        title: "Dibi bulun",
        question: "Ne kadar büyük bir adım atabilirsiniz?",
        caption:
          "Başlangıç noktası her seferinde aynı ve değiştirebileceğiniz tek bir şey var. Sayılardan çok yolun biçimine bakın.",
      },

      direction: {
        kicker: "Neden o yön",
        title: "Gradient bir vektördür ve cevabı gösteren bir işaret değildir.",
        lede: "Mevcut noktadan iki ok çıkıyor: düz olan, adımın gerçekte gittiği yön, −∇f = −(a·x, b·y); kesikli olan ise minimuma giden doğru, −(x, y). Her koordinat kendi eğriliğiyle ölçekleniyor; bu yüzden iki yön ancak eğrilikler eşitken çakışır. Önce noktayı, sonra eğriliği sürükleyin.",
        descent: "Adımın gittiği yön: −∇f",
        target: "Minimuma giden doğru",
        equalLength: "İki ok da aynı uzunlukta çiziliyor; karşılaştırılan tek şey yönleri.",
        angle: "Aralarındaki açı",
        angleHint: "0° iki yönün çakıştığı durumdur",
        aligned: "Burada eğrilikler eşit, dolayısıyla iki yön tam olarak çakışıyor.",
        apart: "Eğrilikler farklı; adım minimuma değil dik eksene doğru çekiliyor.",
        onAxis: "Koordinatlardan biri zaten sıfır, yani eşit olmayan ölçeklemenin etki edeceği bir şey yok. Okları ayırmak için noktayı eksenden çıkarın.",
        dragHint: "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükleyin ya da haritaya odaklanıp",
        keyboardHint: "tuşlarını kullanın; başa döndürmek için:",
        keyboardHelp:
          "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükleyin. Harita odaktayken ok tuşları noktayı taşır, Home tuşu ise başlangıç konumuna geri gönderir.",
        legendAndKeys: "Oklar ve klavye",
        label: (x: string, y: string, kappa: string, angle: string) =>
          `Taşınabilir noktası olan eşyükselti haritası. Nokta ${x}, ${y} konumunda. Koşul sayısı ${kappa}. İniş yönü, minimuma giden doğrudan ${angle} derece sapmış durumda.`,
        caption:
          "Eğrilik oranını 1'e indirin; iki ok tek bir oka dönüşür. Eksenlerin dışında bu, ikisinin çakıştığı tek durumdur — ve tek boyutlu bir resmin hiçbir şekilde gösteremeyeceği bir durumdur, çünkü tek eksende gradient yalnızca bir işarettir.",
      },

      rate: {
        kicker: "Adım boyu",
        title: "Tavanı belirleyen, algoritma değil yüzeydir.",
        lede: "Aynı yüzey, aynı başlangıç noktası, değişen tek bir sayı. Haritanın altındaki iki işaret bu yüzeyin eğriliğinden hesaplanıyor; gösterim işe yarasın diye seçilmiş değiller.",
        marks: { monotone: "aşma yok", stability: "kararlılık sınırı" },
        regimes: {
          monotone: "Doğrudan yaklaşıyor",
          oscillating: "Aşıyor ama yine de yaklaşıyor",
          boundary: "Tam sınırda",
          divergent: "Iraksıyor",
        },
        regimeNote: {
          monotone: "η her iki eğrilik için de 1/c altında: hiçbir koordinat minimumu aşmıyor.",
          oscillating: "η dik eksende 1/c değerini aşmış: her adımda işaret değiştiriyor ama küçülüyor.",
          boundary: "η dik eksende tam olarak 2/c: o koordinat ne küçülüyor ne büyüyor.",
          divergent: "η dik eksende 2/c değerini aşmış: o koordinat her adımda büyüyor.",
        },
        scope:
          "Bu eşikler burada kullanılan ikinci dereceden fonksiyon için tam geçerlidir; onun eğriliği her noktada aynıdır. Eğriliğin konuma göre değiştiği yerde kullanılabilir adım boyu da onunla değişir.",
        caption:
          "Kararlılık sınırı, 2 bölü büyük eğriliktir; yüzey değişince o da değişir. Hiçbir adım boyu tek başına büyük ya da küçük değildir: bu yüzeyi tamamen terk eden η, daha yumuşak bir yüzeye sakince yerleşir.",
      },

      momentumSection: {
        kicker: "Momentum",
        title: "Bir önceki adımdan bir şeyler taşımak.",
        lede: "Momentum bir hız değeri tutar: v ← β·v + ∇f, ardından θ ← θ − η·v. Aynı yöne bakmayı sürdüren itmeler birikir; sürekli yön değiştirenler birbirini götürür. β'yı yükseltin ve ikinci işaretin hareketine bakın.",
        marks: { plain: "düz sınır", momentum: "momentum sınırı" },
        caption:
          "Kararlılık koşulu η·max(a,b) < 2(1+β) olur; bu, düz inişin η·max(a,b) < 2 koşulundan daha geniştir. Yani momentum, düz inişin taşıyamayacağı kadar büyük bir adım boyunu taşıyabilir. Bu aralığın bedeli salınımdır. Adım boyunu sabit tutup β'yı yükseltin: çalışma önce kısalır, belli bir noktadan sonra yeniden uzar.",
        announce: (
          plainSteps: number,
          plainStatus: string,
          momentumSteps: number,
          momentumStatus: string,
        ) =>
          `Gradient descent: ${plainSteps} adım, ${plainStatus}. Momentum: ${momentumSteps} adım, ${momentumStatus}.`,
      },

      adam: {
        kicker: "Adam",
        title: "Her parametre için ayrı bir adım boyu.",
        lede: "Adam, her koordinatın adımını o koordinatın kendi gradient büyüklüğüne dair yürüyen bir tahmine böler. m ortalama gradient, s ise ortalama karesel gradienttir; ikisi de sıfırdan başlamanın yarattığı sapmaya karşı düzeltilir ve güncelleme η·m̂ ÷ (√ŝ + ε) olur.",
        firstStepTitle: "İki eğriliğin bir milyon kat ayrıldığı yerde ilk adım",
        firstStepLede: (a: string, b: string) =>
          `Bir eksende eğrilik ${a}, diğerinde ${b}. Gradient'in iki bileşeni arasında yaklaşık bir milyon kat fark var. Aşağıdaki her sayı, engine tek adım çalıştırılarak ölçülüyor.`,
        tableCaption:
          "Her eksende gradient büyüklüğü ve ilk adımın boyutu; gradient descent ve Adam için.",
        colQuantity: "Büyüklük",
        colX: "Dik eksen",
        colY: "Düz eksen",
        rowGradient: "Gradient büyüklüğü",
        rowGd: (rate: string) => `Gradient descent adımı, η = ${rate}`,
        rowAdam: (rate: string) => `Adam adımı, η = ${rate}`,
        firstStepNote:
          "Sapma düzeltmesinden sonra ilk güncelleme η·g ÷ (|g| + ε) hâline gelir. Gradient'in büyüklüğü sadeleşir ve iki eksen de yaklaşık η kadar hareket eder — düzeltmenin atlanmayıp gerçekten uygulanmasının nedeni budur.",
        rate: "Adam adım boyu η",
        honesty:
          "Bunların hiçbiri Adam daha hızlı yakınsar demek değildir. Yukarıdaki κ = 60 vadisinde 300 adım boyu taranarak ölçüldüğünde Adam'ın en iyi sonucu 17 adımdır; iyi seçilmiş bir momentum ayarı ise aynı toleransa yaklaşık 10 adımda ulaşır. 0,10 gibi ölçülü bir adım boyunda Adam'ın ihtiyacı 66 adımdır. Seçilecek bir adım boyu hâlâ vardır ve onu kötü seçmenin bedeli hâlâ ödenir.",
      },

      challenge: {
        kicker: "Üç soru",
        title: "Bütçe adım cinsinden sayılır.",
        lede: "Her biri bir yüzeyi, bir başlangıç noktasını ve bir adım sayısını sabitliyor. Yavaşça varmak geçmek sayılmaz ve üçünün cevabı aynı değil.",
        puzzle: "Soru",
        budget: (n: number) => `${n} adım`,
        goal: (budget: number, tolerance: string) =>
          `Hedef: ${budget} adım içinde amaç değeri ≤ ${tolerance}.`,
        progress: (done: number, total: number) => `${total} görevden ${done} tanesi çözüldü`,
        pressRun:
          "Bu denemenin sonucunu görmek için Çalıştır'a basın ya da adım kaydırıcısını sona sürükleyin.",
        pass: "Çözüldü.",
        notYet: "Henüz değil.",
        optimizerAndSettings: "Optimizer ve ayarlar",
        boundaryHint: (limit: string, kappa: string) =>
          `Bu ayarlar için kararlılık sınırı: ${limit}. Koşul sayısı κ = ${kappa}.`,
        verdicts: {
          solved: (steps: number, budget: number) =>
            `${budget} adımlık bütçenin içinde, ${steps} adımda hedefe ulaşıldı.`,
          overBudget: (steps: number, budget: number) =>
            `Hedefe varıyor ama ${steps} adımda; bütçe ise ${budget}.`,
          stalled: (budget: number) =>
            `Bu, hedefe hiç ulaşmıyor. Bütçe ${budget} adım.`,
          diverged:
            "Çalışma yüzeyi terk etti: bu ayarlarda adım boyu buradaki kararlılık sınırında ya da üzerinde.",
        },
        transfer: {
          title: "Aynı sayı, daha yumuşak bir yüzeyde",
          divergesHereConvergesThere: (
            rate: string,
            limitHere: string,
            limitThere: string,
            steps: number,
          ) =>
            `η = ${rate}, bu yüzeyin ${limitHere} olan kararlılık sınırının üzerinde; bu yüzden çalışma patlıyor. Daha yumuşak yüzeyin sınırı ${limitThere} ve tam olarak aynı η orada ${steps} adımda yerleşiyor. Değişen adım boyu değil, yüzeydi.`,
          worksOnBoth: (steps: number) =>
            `Bu η iki yüzeyde de yakınsıyor — burada ve daha yumuşak olanda ${steps} adımda. Yukarı doğru itin ve hangisinin önce pes ettiğine bakın.`,
          worksOnNeither:
            "Bu η, izin verilen adım sayısı içinde hiçbir yüzeyde hedefe ulaşmıyor. Sorun büyük olması değil, küçük olması.",
          mapLabel: (rate: string, status: string, steps: number) =>
            `Daha yumuşak yüzeyin ${rate} adım boyuyla çalıştırılmış eşyükselti haritası. ${steps} adım sonra ${status}.`,
        },
        items: {
          c1: {
            title: "Tam nokta",
            brief:
              "Tek bir yüzey, düz gradient descent ve dar bir bütçe. Oraya çabucak ulaştıran bir adım boyu var; ulaştırmayan pek çok adım boyu da var.",
          },
          c2: {
            title: "Fazla büyük",
            brief:
              "Bu, kararlılık sınırının üzerinde başlıyor ve ilk Çalıştır'da patlıyor. İşe yarayan bir adım boyu bulun — sonra aynı sayının daha yumuşak bir yüzeyde ne yaptığına bakın.",
          },
          c3: {
            title: "Dar vadi",
            brief:
              "κ = 60 olan bir vadi. Hiçbir adım boyu, düz gradient descent'in bu bütçe içinde bitirmesini sağlamıyor; diğer iki optimizer'ın var olma nedeni de bu.",
          },
        },
      },

      recap: {
        lessons: [
          "Negatif gradient yokuş aşağıyı gösterir, minimumu değil. Eksenlerin dışında ikisi ancak eğrilik her yönde aynıyken çakışır.",
          "Bir yüzeyin kaldırabileceği en büyük adım boyu, 2 bölü onun en dik eğriliğidir — algoritmanın değil, yüzeyin bir özelliği. Bunun yarısının altında yaklaşım doğrudandır, ikisinin arasında yol aşar ama yine de yaklaşır, üstünde ise çalışma yüzeyi terk eder.",
          "Koşul sayısı κ, dik eğriliğin düz eğriliğe bölümüdür ve tek bir adım boyunun iki yöne birden hizmet etmesini engelleyen şey odur: düz eksen hâlâ emeklerken dik eksen çoktan tavanındadır.",
          "Momentum kararlı aralığı η·max(a,b) < 2(1+β) değerine genişletir ve uzun bir zikzağı kısaltabilir; Adam her koordinatı kendi gradient geçmişiyle ölçekler, böylece gradient büyüklüğündeki bir milyon katlık fark adım boyunda bir milyon kat olmaz. Yine de ikisinde de seçilecek bir adım boyu kalır.",
        ],
        footer:
          "Buradaki her şey konveks ve ikinci dereceden: eğrilik her noktada aynı, gradient tam, cevap daha başlamadan biliniyor. Gerçek eğitim bu üçünü de bırakır. Geriye kalan, ileri geri oynadığınız ilişkidir — yüzeyin biçimi, atmanıza izin verilen adımın boyutunu belirler.",
      },
    },

    // ---------------------------------------------------------- hash ----
    "hash-playground": {
      title: "Hash Laboratuvarı",
      description: "Tek bir karakteri değiştirin. Her şeyin değiştiğini görün.",
      inputLabel: "Mesajınız",
      inputPlaceholder: "merhaba dünya",
      copy: "Kopyala",
      copied: "Kopyalandı",
      copyHash: "Özeti kopyala",
      hashCopied: "Özet kopyalandı",

      figures: {
        messageLength: "Mesaj",
        characters: "karakter girdi",
        digestLength: "Özet",
        hexChars: "hex karakter çıktı",
        digestBits: "Bit",
        alwaysBits: "mesaj ne kadar uzun olursa olsun",
        bitsChanged: "Değişen bit",
        percentChanged: "Özetin",
        expectedHalf: "yaklaşık yarısı beklenir",
        charsChanged: "Değişen hex karakter",
        ofSixtyFour: "64 karakterden",
      },

      hero: {
        title: "Ne çıkıyor",
        question: "İki farklı mesaj aynı uzunlukta çıktı üretebilir mi?",
        digestLabel: "SHA-256 özeti",
        caption:
          "Ne isterseniz yazın. Mesaj ne kadar uzun olursa olsun tam 64 hex karakter geri döner — ve mesajın kendisi bunların içinde yoktur.",
        help: "Bir mesaj yazın. SHA-256 özeti alanın altında görünür ve siz yazdıkça güncellenir.",
        announce: (start: string) => `Özet güncellendi, artık ${start} ile başlıyor.`,
      },

      determinism: {
        kicker: "Aynı mesaj, aynı özet",
        title: "Her seferinde aynı yanıtı veriyor.",
        lede: "Mesajı yeniden hash'leyin. Hiçbir şey önbelleğe alınmıyor ve önceki çalıştırmadan kopyalanmıyor — her basış, aynı metin üzerinde yeni bir SHA-256 çağrısı.",
        hashAgain: "Yeniden hash'le",
        enough: "Bu kadar çalıştırma yeter",
        empty: "Henüz çalıştırma yok. Bu mesajı hash'lemek için düğmeye basın.",
        run: (n: number) => `${n}. çalıştırma`,
        runsLabel: "Çalıştırma",
        distinctLabel: "Farklı özet",
        distinctHint: "kaç kez çalıştırılırsa çalıştırılsın",
        caption:
          "Mesajı değiştirmek listeyi temizler, çünkü eski mesajın çalıştırması yenisi hakkında bir şey söylemez.",
        announce: (runs: number, distinct: number) =>
          `${runs} çalıştırma, ${distinct} farklı özet.`,
      },

      avalanche: {
        kicker: "Tek küçük değişiklik",
        title: "Tek bir tuş her şeyi yeniden yazıyor.",
        lede: "Tek bir karakteri değiştirin ve iki özeti karşılaştırın. Farklı olan her karakter ikisinde de işaretlenir — gidende üstü çizili, yerine gelende altı çizili.",
        before: "Önce",
        after: "Sonra",
        fieldLabel: "Bir karakteri değiştirin",
        help: "Mesajı düzenleyin. Düzenlemeden önceki ve sonraki özetler yukarıda karakter karakter karşılaştırılır.",
        editPrompt: "İki özeti karşılaştırmak için mesajdaki bir karakteri değiştirin.",
        caption:
          "Sayım, iki gerçek özet üzerinde bit bit ölçülüyor — tahmin edilmiyor ve bir sayıya doğru canlandırılmıyor.",
        announce: (changed: number, total: number, percent: number) =>
          `${total} bitten ${changed} tanesi değişti, özetin yüzde ${percent}'i.`,
      },

      bits: {
        gridLabel: (total: number, ones: number, zeros: number, flipped: number) =>
          `Mevcut özetin ${total} biti, 16'ya 16 ızgara olarak. ${ones} tanesi 1, ${zeros} tanesi 0. Son düzenlemede ${flipped} tanesi değişti.`,
        legendOne: "bit 1",
        legendZero: "bit 0",
        legendChanged: "değişti",
      },

      challenge: {
        kicker: "Meydan okuma",
        title: "İki farklı mesajın aynı özeti üretmesini sağlayabilir misiniz?",
        lede: "Özetin tamamı değil — ilk karakterinden başlayın. Her tur bir karakter daha istiyor ve her tur bir öncekinden on altı kat daha düşük olasılıklı. Bu eğri, hash güvenliğinin tamamı; ve bunu dürüstçe hissetmenin tek yolu bu: burada bir çakışma bulunmuyor, uydurulmuyor da.",
        inputA: "Mesaj A",
        inputB: "Mesaj B",
        identical:
          "İki mesaj da aynı, dolayısıyla özetler tanım gereği eşleşiyor. Çakışma için iki farklı mesaj gerekir.",
        target: (round: number, odds: string) =>
          `${round}. tur: ilk ${round} hex karakteri paylaşsınlar. Deneme başına olasılık: ${odds}'de 1.`,
        nextRound: (round: number) => `${round}. tur — on altı kat zor`,
        keepTrying: "Denemeye devam",
        maxRound: "İnsanların durduğu yer burası",
        matchedLabel: "Ortak ön ek",
        roundLabelFull: "Tur",
        oddsHint: (odds: string) => `deneme başına ${odds}'de 1`,
        bestLabel: "En iyi",
        attemptsLabel: "Deneme",
        ladderLabel: (matched: number, total: number, round: number) =>
          `Ortak ön ek: ${total} hex karakterden ${matched} tanesi eşleşiyor. Bu tur ${round} tane istiyor.`,
        caption:
          "64 karakterin tamamının rastlantıyla eşleşmesi 2^256'da 1. Doğum günü kısayolu bile yaklaşık 2^128 hash gerektirir — saniyede bir trilyon hash'lense, kabaca 10^19 yıl.",
        announce: (matched: number, total: number, best: number, round: number) =>
          `${total} baştaki karakterden ${matched} tanesi eşleşiyor. En iyi ${best}. ${round}. tur ${round} tane istiyor.`,
      },

      usage: {
        kicker: "Gerçek hayatta",
        title: "Özetlerin karşınıza çıktığı yerler.",
        lede: "Aynı sabit boyutlu parmak izi, beş farklı biçimde kullanılıyor.",
        items: {
          git: {
            label: "Git",
            body: "Git her commit'i, içeriğini ve ebeveyninin hash'ini hash'leyerek tanımlar. Geçmişteki bir satırı değiştirin, sonraki bütün hash'ler değişir — kurcalama görünür olur.",
          },
          passwords: {
            label: "Parolalar",
            body: "Sunucular parolanın kendisini değil, tuzlanmış hash'ini saklar. Girişte parola yeniden hash'lenip karşılaştırılır; böylece sızan bir veritabanı parolaları değil hash'leri barındırır.",
          },
          https: {
            label: "HTTPS",
            body: "TLS, sertifikaları parmak izlemek ve verinin yolda değiştirilmediğini doğrulamak için hash kullanır. Tek bir bitin değişmesi hash'i bozar.",
          },
          blockchain: {
            label: "Blok zinciri",
            body: "Her blok bir öncekinin hash'ini içerir ve böylece birbirlerine zincirlenir. Eski bir bloğu değiştirin, sonraki bütün hash'ler bozulur; defteri kurcalamaya karşı görünür kılan da budur.",
          },
          signatures: {
            label: "İmzalar",
            body: "Dijital imza, belgenin kendisi üzerinde değil hash'i üzerinde atılır. Herkes belgeyi yeniden hash'leyip imzayı doğrulayabilir.",
          },
        },
      },

      recap: {
        lessons: [
          "Aynı mesaj her zaman aynı özeti üretir ve özet, girene bakılmaksızın aynı uzunluktadır",
          "Tek bir karakteri değiştirmek 256 bitin yaklaşık yarısını değiştirir — çığ etkisi, burada iddia edilmiyor ölçülüyor",
          "İki özetin paylaştığı her ek hex karakter on altı kat daha düşük olasılıklıdır; 64'ünün birden eşleşmesinin erişilemez olmasının nedeni budur",
        ],
        footer:
          "Bu sayfadaki hiçbir şey saklanmıyor ya da taklit edilmiyor: her özet, yazdığınız metin üzerinde tarayıcınızda çalışan crypto.subtle.digest(\"SHA-256\", …) çağrısının sonucu.",
      },
    },

    // -------------------------------------------------------- neural ----
    "neural-playground": {
      question: "Tek bir katman asl\u0131nda neyi de\u011fi\u015ftiriyor?",
      diagram: {
        diagramLabel: (shape: string) =>
          `A\u011f \u015femas\u0131: ${shape} n\u00f6ron. Her d\u00fc\u011f\u00fcm, o n\u00f6ronun girdi karesi boyunca neye tepki verdi\u011fini g\u00f6sterir.`,
        neuron: (label: string) => `${label} n\u00f6ronu`,
        inputNode: "girdi",
        bias: "yanl\u0131l\u0131k",
        eachSquare: "Her kare, bir n\u00f6ronun girdiye kendi bak\u0131\u015f\u0131.",
        pushesUp: "yukar\u0131 iter",
        pushesDown: "a\u015fa\u011f\u0131 iter",
        thickness: "kal\u0131nl\u0131k g\u00fcc\u00fc g\u00f6sterir",
      },
      title: "Yapay Sinir Ağı Laboratuvarı",
      description: "İki tür nokta çizin. Bir ağın onları ayırt etmeyi öğrenişini izleyin.",
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
      keyboardHint: { trainPause: "eğitir veya duraklatır ·", restart: "ağırlıkları sıfırlayıp yeniden başlatır" },
      layersCaption: {
        solved:
          "Düz ağ yazı tura düzeyinde takılı kaldı: hiçbir doğru bu dört köşeyi ayıramaz. Gizli katman sınırı büker ve problem ortadan kalkar.",
        idle: "İkisini yan yana çalıştırın ve soldakinin nerede pes ettiğini izleyin.",
      },
      layersPanels: {
        flat: { title: "Gizli katman yok", subtitle: "İki girdi doğrudan çıktıya bağlı: tek bir nöron." },
        deep: { title: "Tek gizli katman", subtitle: "Aynı yapı, ama aralarında dört nöron var." },
      },
      descentNote: {
        overshoot:
          "Hedefi aştı. Her adım dibin ötesine sıçrayıp karşı duvarda daha yukarıya iniyor, kayıp da patlıyor.",
        deep: "En derin vadiye yerleşti. Sağlıklı bir eğitim böyle görünür.",
        shallow:
          "Yerleşti, ama sağdaki sığ çukura. Gradyan inişi yalnızca ayağının altındaki eğimi görür, manzaranın tamamını asla.",
        rolling: "Teğet doğrusunu izleyin: adımın elindeki tek bilgi onun dikliği.",
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
        currentlyWrong: "\u015eu an yanl\u0131\u015f",
        dataAndArchitecture: "Veri ve mimari",
        drawHint: "Nokta eklemek i\u00e7in tuvale t\u0131klay\u0131n ya da s\u00fcr\u00fckleyin.",
        caption:
          "Solda: a\u011f\u0131n her yerde ne tahmin etti\u011fi. Sa\u011fda: ayn\u0131 a\u011f\u0131n i\u00e7eriden g\u00f6r\u00fcn\u00fcm\u00fc, n\u00f6ron ba\u015f\u0131na bir kare.",
        noneLabel: "yok",
        offLabel: "kapal\u0131",
        draw: "Çiz",
        data: "Veri",
        noise: "Gürültü",
        hiddenLayers: "Gizli katman",
        neuronsPerLayer: "Katman başına nöron",
        activation: "Aktivasyon",
        learningRate: "Öğrenme oranı",
        regularization: "Düzenlileştirme (L2)",
        speed: "Hız",
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
        weightsAndBias: "A\u011f\u0131rl\u0131klar ve yanl\u0131l\u0131k",
        caption:
          "Yapamad\u0131\u011f\u0131n\u0131z \u015feye dikkat edin: bu \u00fc\u00e7 kayd\u0131r\u0131c\u0131y\u0131 nas\u0131l \u00e7ekerseniz \u00e7ekin s\u0131n\u0131r d\u00fcz bir \u00e7izgi olarak kal\u0131yor. Tek bir n\u00f6ronun b\u00fct\u00fcn s\u0131n\u0131r\u0131 bu \u2014 ve bir sonraki b\u00f6l\u00fcm\u00fcn var olma nedeni de bu.",
        notes: {
          tanh: "\u22121\u20261 aral\u0131\u011f\u0131na s\u0131k\u0131\u015ft\u0131r\u0131r. Yumu\u015fak, simetrik, g\u00fcvenli bir varsay\u0131lan.",
          relu: "Pozitifleri ge\u00e7irir, negatifleri d\u00fczler. H\u0131zl\u0131 ve modern varsay\u0131lan.",
          sigmoid: "0\u20261 aral\u0131\u011f\u0131na s\u0131k\u0131\u015ft\u0131r\u0131r. Tarihsel ve tak\u0131lmaya yatk\u0131n.",
        },
        kicker: "Sonuna kadar yakınlaşın",
        title: "Bir nöron sandığınızdan küçüktür.",
        lede: "Belleği yok, mantığı yok, hiçbir marifeti yok. Üç sayı ve bir ezme işlemi: bütün alanın üzerine kurulduğu birim bundan ibaret.",
        weight1: "x₁ ağırlığı",
        weight2: "x₂ ağırlığı",
        bias: "Bias",
        activation: "Aktivasyon",
        note: "Şuna dikkat edin: bu üç kaydırıcıyı nasıl çekerseniz çekin, sınır yine düz bir çizgi olarak kalır. Tek bir nöronun sınırı budur ve bir sonraki bölümün var olma nedeni de tam olarak bu.",
        canvasLabel: "Tek bir nöronun girdi düzlemi üzerindeki çıktısı.",
        activations: {
          tanh: "−1…1 aralığına ezer. Düzgün, simetrik, güvenli bir başlangıç.",
          relu: "Pozitifleri geçirir, negatifleri düzler. Hızlı ve günümüzün varsayılanı.",
          sigmoid: "0…1 aralığına ezer. Tarihsel bir seçim; öğrenmeyi tıkamaya eğilimli.",
        },
      },

      layers: {
        panelLabel: (title: string, accuracy: number, epoch: number) =>
          `${title}: ${epoch} epok sonra XOR noktalar\u0131n\u0131n %${accuracy} kadar\u0131 do\u011fru s\u0131n\u0131fland\u0131r\u0131ld\u0131.`,
        kicker: "Katmanlar neden gerekli",
        title: "Yapay zekâyı on yıl durduran dört nokta.",
        lede: "XOR: karşılıklı köşelere yerleşmiş iki sınıf. Tek bir nöron bunları birbirinden ayıramaz ve 1969'da fark edilen bu gerçek, alanı neredeyse bitiriyordu. Çözümün tamamıysa tek bir gizli katmandan ibaret.",
        noHidden: "Gizli katman yok",
        oneHidden: "Tek gizli katman",
        accuracy: "Doğruluk",
        trainBoth: "İki ağı da eğit",
        trainBothShort: "İkisini eğit",
        pauseBoth: "İkisini de duraklat",
        startOver: "Baştan başla",
        caption: "İkisini yan yana çalıştırın ve soldakinin nerede pes ettiğini izleyin.",
      },

      descent: {
        slopeHint: "backprop'un her a\u011f\u0131rl\u0131\u011fa verdi\u011fi tek say\u0131",
        kicker: "Nasıl öğreniyor",
        title: "Yokuş aşağı, her seferinde küçük bir adım.",
        lede: "Öğrenme, ansızın gelen bir kavrayış değildir. Bir yamaçta gradyanın tersi yönünde yuvarlanan bir top gibidir ve her şeyi belirleyen, attığı adımların büyüklüğüdür.",
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
        title: "Dört adım, işe yarayana kadar tekrarlanır.",
        lede: "Şimdiye kadar izlediğiniz her şey, saniyede binlerce kez çalışan şu dört aşamadan ibaret.",
        cards: {
          forward: {
            title: "İleri geçiş",
            body: "Her nöron girdilerini ağırlıklarıyla çarpar, bir bias ekler ve sonucu ezer. Bunu katman katman tekrarlayın; içeri giren bir nokta, dışarı çıkan bir tahmine dönüşür.",
          },
          loss: {
            title: "Kayıp",
            body: "Tahmini gerçek etiketle karşılaştırın ve farkın karesini alın. Ortaya bütün ağ için tek bir sayı çıkar ve ağın küçültmeye çalıştığı tek şey de budur.",
          },
          backprop: {
            title: "Geri yayılım",
            body: "Hatayı zincir kuralıyla katmanlar boyunca geriye taşıyın. Her bir ağırlık, hataya ne kadar katkıda bulunduğunu öğrenir: kendi gradyanını.",
          },
          descent: {
        slopeHint: "backprop'un her a\u011f\u0131rl\u0131\u011fa verdi\u011fi tek say\u0131",
            title: "Gradyan inişi",
            body: "Her ağırlığı kendi gradyanının tersi yönde küçük bir adım kaydırın. Öğrenme oranı, o adımın büyüklüğüdür. Sonra bunu binlerce kez yineleyin.",
          },
        },
      },

      challenge: {
        architecture: "Mimari",
        neuronsUsed: "Kullan\u0131lan n\u00f6ron",
        testAccuracy: "Test do\u011frulu\u011fu",
        target: "Hedef",
        objectiveLine: (accuracy: string) =>
          `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n \u2014 olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
        solvedNote: "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
        noBest: "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
        bestLine: (neurons: number, accuracy: string, epoch: number) =>
          `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
        canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
          `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
        announceSolved: (neurons: number, accuracy: string) =>
          `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
        kicker: "Görev",
        title: "Spirali olabildiğince az nöronla çözün.",
        lede: "On altı nöronla herkes çözer. Asıl soru, ağ şekli tutamaz hâle gelmeden önce kaça kadar inebildiğiniz.",
        objective: "Hedef",
        objectiveBody: (accuracy: number) =>
          `Spiralde %${accuracy} test doğruluğuna ulaşın. Sonra aynısını daha az nöronla yapın.`,
        hiddenLayers: "Gizli katman",
        neuronsPerLayer: "Katman başına nöron",
        learningRate: "Öğrenme oranı",
        train: "Eğit",
        pause: "Duraklat",
        newAttempt: "Yeni deneme",
        yourBest: "En iyiniz",
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
          "Az önce izlediğiniz her şey 300 satırlık sıradan aritmetikti. Bugünün yapay zekâsının arkasındaki modeller de aynı dört adımdan oluşuyor, sadece çok daha fazla ağırlıkla.",
      },
    },

    // --------------------------------------------------- pathfinding ----
    pathfinding: {
      title: "Yol Bulma",
      description: "Engeller çizin; BFS, Dijkstra ve A* algoritmalarının yol arayışını izleyin.",
      findTheWay: "Yolu bulun",
      algorithm: "Algoritma",
      draw: "Çiz",
      gridAndKeys: "Harita araçları ve klavye",
      map: "Harita",
      tools: { wall: "Engel", mud: "Çamur", erase: "Sil", start: "Başlangıç", goal: "Hedef" },
      legend: {
        wall: "engel",
        frontier: "sınır",
        settled: "kesinleşen",
        path: "yol",
        mud: "çamur",
      },
      metrics: {
        explored: "İncelenen",
        path: "Yol",
        cost: "Maliyet",
        noPath: "Yol yok",
      },
      steps: (n: number) => `${n} adım`,
      gridLabel: (walls: number, mud: number, state: string) =>
        `Düzenlenebilir ızgara. Engel: ${walls}. Çamurlu hücre: ${mud}. ${state}`,
      gridHelp:
        "Çizmek için ızgaranın üzerinde sürükleyin. Izgara odaktayken yön tuşları hareket ettirir, Boşluk boyar.",
      gridHelpFull: {
        drag: "Çizmek veya silmek için ızgarada sürükleyin.",
        or: "veya",
        toMove: "işaretlerini sürükleyerek taşıyın. Izgara odaktayken yön tuşları imleci hareket ettirir,",
        toggles: "bir hücreyi değiştirir,",
        drops: "ise işaret bırakır.",
      },
      gridSummary: (cols: number, rows: number, start: string, goal: string, walls: number, mud: number, algorithm: string, result: string) =>
        `Yol bulma ızgarası, ${cols} sütun × ${rows} satır. Başlangıç: ${start}. Hedef: ${goal}. Engel: ${walls}. Çamurlu hücre: ${mud}. Algoritma: ${algorithm}. ${result}`,
      status: {
        solved: (explored: number, steps: number, cost: number) =>
          `Çözüldü: ${explored} hücre incelendi, yol ${steps} adım, maliyet ${cost}.`,
        unreachable: (explored: number) => `Yol yok. ${explored} hücre incelendi.`,
        running: (explored: number) => `Aranıyor. Şu ana kadar ${explored} hücre incelendi.`,
        notStarted: "Başlatılmadı.",
        gridReset: "Izgara sıfırlandı.",
        gridCleared: "Izgara temizlendi.",
        selected: (algorithm: string) => `${algorithm} seçildi.`,
        loaded: (map: string) => `${map} yüklendi.`,
      },
      row: (row: number, col: number) => `satır ${row}, sütun ${col}`,
      intro: {
        question: "İlk olarak hangi kareye bakıyor?",
        caption:
          "Birkaç engel çizin, sonra Çalıştır'a basın. Aramanın gerçekte nereye yayıldığını izleyin, hedefin olmadığı yerler de dahil.",
      },
      bfs: {
        kicker: "Düşünürken izleyin",
        title: "Çizgiler hâlinde değil, katmanlar hâlinde yayılır.",
        lede: "Adım adım ilerleyin. Halkalı hücreler bilinen ama henüz ziyaret edilmemiş hücrelerdir, yani sınır. Dolu hücreler ise kesinleşmiştir: arama, her birine kaç hamlede ulaşıldığını bilir ve bir daha oraya bakmaz.",
        caption:
          "Hücreleri ilk giren ilk çıkar sırasıyla ele almak işin tamamı: bu, onların uzaklık sırasına göre kesinleşmesini sağlar, dolayısıyla hedefe ulaşan ilk rota en kısasıdır. Buna genişlik öncelikli arama denir.",
      },
      cost: {
        kicker: "Uzaklık maliyet değildir",
        title: "Bazı zeminlerde ilerlemek daha yavaştır.",
        lede: "Çamura girmenin maliyeti 5, açık zeminin 1. Önce BFS'i, sonra Dijkstra'yı çalıştırın ve ızgaranın altındaki iki sayıyı karşılaştırın.",
        caption:
          "BFS yine en az hamleyle gidiyor, doğruca bataklığın içinden. Dijkstra daha çok adım atıyor ama daha az ödüyor; çünkü her seferinde en yakın hücreyi değil, bildiği en ucuz hücreyi kesinleştiriyor.",
      },
      astar: {
        kicker: "Aramaya bir ipucu verin",
        title: "Aynı doğru cevap, çok daha az arama.",
        lede: "Dijkstra hedefin nerede olduğunu bilmez, bu yüzden her yöne eşit yayılır. A* ise kalan uzaklık için bir tahmin ekler ve onu izler: f = g + h; burada g şu ana kadarki maliyet, h ise tahmindir.",
        caption:
          "Aynı yol, aynı maliyet. İncelenen sayısına bakın. Buradaki tahmin Manhattan uzaklığı; dört yönlü bir ızgarada kalan mesafeyi asla olduğundan fazla gösteremez, A*'ın ona güvenerek hiçbir şeyden ödün vermemesinin nedeni de tam olarak budur.",
      },
      challenge: {
        architecture: "Mimari",
        neuronsUsed: "Kullan\u0131lan n\u00f6ron",
        testAccuracy: "Test do\u011frulu\u011fu",
        target: "Hedef",
        objectiveLine: (accuracy: string) =>
          `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n \u2014 olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
        solvedNote: "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
        noBest: "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
        bestLine: (neurons: number, accuracy: string, epoch: number) =>
          `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
        canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
          `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
        announceSolved: (neurons: number, accuracy: string) =>
          `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
        kicker: "Görev",
        title: "Aynı cevap, daha az iş.",
        lede: "Üç sabit harita. Her biri hem en ucuz yolu hem de bütçeden fazla hücre kesinleştirmeyen bir arama istiyor. Bunlardan biri tek başına kolay; asıl mesele ikisini birden sağlamak.",
        mazeLabel: (title: string, cols: number, rows: number, cost: number, budget: number, algorithm: string) =>
          `${title}: sabit ${cols} × ${rows} labirent. Hedefe ${cost} olan en uygun maliyetle ulaşın ve en çok ${budget} hücre kesinleştirin. Geçerli algoritma: ${algorithm}.`,
        bothAtOnce: "İkisi birden",
        beaten: (done: number, total: number) => `${total} haritadan ${done} tanesi geçildi`,
        costMustBe: "maliyet şu olmalı",
        exploredAtMost: "en çok incelenecek",
        maps: {
          swamp: {
            title: "Bataklık",
            hint: "En hızlı geçiş, en ucuz geçiş değildir.",
          },
          "open-ground": {
            title: "Açık arazi",
            hint: "Burada hiçbir şey pahalı değil. Tasarruf edilecek tek şey emek.",
          },
          "wrong-door": {
            title: "Yanlış kapı",
            hint: "Hedef yakın. İçeri giden yol değil.",
          },
        },
        budget: (cost: number, budget: number) =>
          `En ucuz yolun maliyeti ${cost}. En çok ${budget} hücre kesinleştirin.`,
        verdict: {
          unreachable: "Bu arama hedefe hiç ulaşamadı.",
          solved: (cost: number, explored: number) =>
            `Çözüldü. Maliyet ${cost} ve yalnızca ${explored} hücre kesinleşti.`,
          overBudget: (explored: number, budget: number) =>
            `Yol en uygun olanı ama ${explored} hücre incelediniz. Bütçe: ${budget}.`,
          suboptimal: (explored: number, cost: number, optimal: number) =>
            `Yalnızca ${explored} hücre incelediniz, ancak yolunuzun maliyeti ${cost}. En uygun maliyet: ${optimal}.`,
          both: (cost: number, optimal: number, explored: number, budget: number) =>
            `Yolunuzun maliyeti ${cost}; en uygunu ${optimal}. Ayrıca ${explored} hücre incelediniz; bütçe ise ${budget}.`,
        },
      },
      recap: {
        lessons: [
          "Bir arama doğrudan hedefe yönelmez; hedef, ulaştığı noktalardan biri olana kadar her yöne yayılır",
          "BFS hücreleri ilk giren ilk çıkar sırasıyla alır; böylece onları en az hamle sırasına göre kesinleştirir",
          "Zemin tekdüze olmaktan çıktığı anda en az hamle ile en ucuz rota farklı sorulardır",
          "Dijkstra her zaman bildiği en ucuz hücreyi kesinleştirir; cevabının en ucuz olmasının nedeni budur",
          "A* kalan mesafe için bir tahmin ekler ve çabasını hedefin bulunduğu yöne harcar",
          "Tahmin mesafeyi asla olduğundan fazla göstermez; bu yüzden A* daha hızlı ulaşırken hiçbir şeyden ödün vermez",
        ],
        footer:
          "Telefonunuzun bugüne kadar önerdiği her güzergâh buna benzer bir döngüden çıktı: bir sınır, kesinleşmiş bir küme ve sıradaki hücreyi seçen bir kural.",
      },
    },
    // ------------------------------------------------------- probability ----
    probability: {
      title: "Olas\u0131l\u0131k Laboratuvar\u0131",
      description:
        "\u015eans hakk\u0131ndaki sezgine meydan okuyan d\u00f6rt deney. \u00d6nce tahmin edin, sonra tahminin ne kadar yanl\u0131\u015f oldu\u011funu g\u00f6r\u00fcn.",

      scope:
        "D\u00f6rt \u00e7\u00f6z\u00fcml\u00fc problem; olas\u0131l\u0131\u011f\u0131n geneline bir bak\u0131\u015f de\u011fil. Her biri belirtilmi\u015f bir model kullan\u0131r \u2014 iki kurala ba\u011fl\u0131 bir sunucu, e\u015fit olas\u0131l\u0131kl\u0131 365 do\u011fum g\u00fcn\u00fc, her biri ba\u011f\u0131ms\u0131z olarak erkek ya da k\u0131z olan iki \u00e7ocuk, yay\u0131mlanm\u0131\u015f tek bir klinik tablo \u2014 ve cevaplar bu modellere aittir. Bir say\u0131 sim\u00fclasyondan geliyorsa sim\u00fclasyon olarak etiketlenir: bir deneyi \u00e7ok kez \u00e7al\u0131\u015ft\u0131rmak bir sonucu g\u00f6sterir, kan\u0131tlamaz.",

      prediction: {
        yours: "Siz dediniz",
        actual: "Ger\u00e7ekte",
        agreed: "Sezginiz modelle ayn\u0131 fikirde.",
        disagreed: "Sezginizle model ayn\u0131 fikirde de\u011fil. \u0130lgin\u00e7 olan k\u0131s\u0131m da bu.",
      },

      monty: {
        title: "\u00dc\u00e7 kap\u0131",
        question: "Sunucuyu yenebilir misin?",
        setup: [
          "\u00dc\u00e7 kap\u0131. Birinin arkas\u0131nda bir araba, di\u011fer ikisinin arkas\u0131nda birer ke\u00e7i.",
          "Bir kap\u0131 se\u00e7ersin. Kap\u0131 kapal\u0131 kal\u0131r.",
          "Sunucu araban\u0131n yerini bilir ve di\u011fer ikisinden birini a\u00e7ar \u2014 her zaman arkas\u0131nda ke\u00e7i olan\u0131.",
          "Sonra se\u00e7ersin: kendi kap\u0131nda kal ya da sunucunun dokunmad\u0131\u011f\u0131 kap\u0131y\u0131 al.",
        ],
        coachLabel: "Herkesin sordu\u011fu sorular",
        coach: {
          notHalf: {
            q: "\u0130ki kap\u0131 kald\u0131. Neden 50/50 de\u011fil?",
            a: "\u00c7\u00fcnk\u00fc iki kap\u0131 buraya ayn\u0131 yoldan gelmedi. Seninkini hi\u00e7bir \u015fey bilmezken se\u00e7tin. Di\u011feri ise araban\u0131n yerini tam olarak bilen ve onu asla a\u00e7mayacak olan birinin se\u00e7iminden sa\u011f \u00e7\u0131kt\u0131.",
          },
          whySwitch: {
            q: "De\u011fi\u015ftirmek neden daha iyi?",
            a: (stay: string, swap: string) =>
              `\u0130lk se\u00e7imin zaman\u0131n ${stay} kadar\u0131nda arabad\u0131r ve kalmak yaln\u0131zca o zaman kazan\u0131r. Kalan ${swap} kadar\u0131nda araba se\u00e7medi\u011fin iki kap\u0131dan birinin arkas\u0131ndad\u0131r \u2014 sunucu da az \u00f6nce bu ikisinden hangisinde olmad\u0131\u011f\u0131n\u0131 g\u00f6sterdi.`,
          },
          hostKnows: {
            q: "Sunucunun biliyor olmas\u0131 \u00f6nemli mi?",
            a: "Her \u015fey o. Rastgele kap\u0131 a\u00e7an \u2014 bazen kazara arabay\u0131 g\u00f6steren \u2014 bir sunucu, kalmakla de\u011fi\u015ftirmeyi e\u015fit k\u0131lard\u0131. A\u00e7\u0131lan kap\u0131y\u0131 bilgilendirici yapan \u015fey, sunucunun bilmesi.",
          },
        },
        caption:
          "Sunucu iki kurala ba\u011fl\u0131d\u0131r: sizin kap\u0131n\u0131z\u0131 asla a\u00e7maz, arabay\u0131 asla a\u00e7maz. A\u00e7may\u0131 bilgilendirici k\u0131lan da bu kurallard\u0131r \u2014 rastgele kap\u0131 a\u00e7an bir sunucu iki se\u00e7ene\u011fi e\u015fit b\u0131rak\u0131rd\u0131.",
        predictQuestion: "Bir el oynad\u0131n. \u00c7ok say\u0131da elde hangisi daha iyi gider?",
        predict: { stay: "Kal", switch: "De\u011fi\u015ftir", same: "Fark etmez" },
        predictAnswer: (value: string) => `De\u011fi\u015ftirmek zaman\u0131n ${value} kadar\u0131nda kazan\u0131r`,
        strategy: { stay: "Kal", switch: "De\u011fi\u015ftir" },
        doorsIdle: "\u00dc\u00e7 kapal\u0131 kap\u0131. Birinin arkas\u0131nda araba, ikisinde ke\u00e7i var.",
        doorsLabel: (picked: number, opened: number) =>
          `\u00dc\u00e7 kap\u0131. ${picked}. kap\u0131y\u0131 se\u00e7tiniz. Sunucu ke\u00e7iyi g\u00f6stermek i\u00e7in ${opened}. kap\u0131y\u0131 a\u00e7t\u0131.`,
        doorLabel: (n: number, state: string) => `${n}. kap\u0131, ${state}`,
        doorState: {
          closed: "kapal\u0131",
          picked: "sizin se\u00e7iminiz",
          opened: "sunucu a\u00e7t\u0131, ke\u00e7i",
          revealed: "araba",
        },
        car: "araba",
        goat: "ke\u00e7i",
        won: "arabay\u0131 kazand\u0131n\u0131z",
        lost: "arabay\u0131 kazanamad\u0131n\u0131z",
        promptPick: "Bir kap\u0131 se\u00e7in.",
        promptDecide: (opened: number, other: number) =>
          `Sunucu ${opened}. kap\u0131y\u0131 a\u00e7t\u0131 ve arkas\u0131ndan ke\u00e7i \u00e7\u0131kt\u0131. Kap\u0131n\u0131zda kal\u0131n m\u0131, ${other}. kap\u0131ya m\u0131 ge\u00e7in?`,
        resultLine: (strategy: string, result: string) => `${strategy} dediniz \u2014 ${result}.`,
        again: "Yeniden oyna",
        announceOpened: (n: number) => `Sunucu ${n}. kap\u0131y\u0131 a\u00e7t\u0131. Arkas\u0131ndan ke\u00e7i \u00e7\u0131kt\u0131.`,
        announceResult: (result: string) => `Tur bitti: ${result}.`,
        runBatch: (n: number) => `${n.toLocaleString("tr-TR")} tur \u00e7al\u0131\u015ft\u0131r`,
        batchTitle: "Sim\u00fcle edilen turlar",
        batchIdle: (n: number) =>
          `Elle birka\u00e7 tur oynamak bunu \u00e7\u00f6zmez. ${n.toLocaleString("tr-TR")} tur \u00e7al\u0131\u015ft\u0131r\u0131n.`,
        batchCaption: (n: number) =>
          `${n} sim\u00fcle edilmi\u015f turda kalman\u0131n ve de\u011fi\u015ftirmenin kazanma oranlar\u0131, tam olas\u0131l\u0131klar\u0131n yan\u0131nda.`,
        strategyHeader: "Strateji",
        simulatedHeader: (n: number) => `Sim\u00fclasyon (${n.toLocaleString("tr-TR")})`,
        exactHeader: "Tam de\u011fer",
        wins: (wins: number, rounds: number) => `${wins}/${rounds}`,
        playedLabel: "Oynad\u0131\u011f\u0131n\u0131z tur",
        yourStayLabel: "Kalmak kazand\u0131r\u0131rd\u0131",
        yourSwitchLabel: "De\u011fi\u015ftirmek kazand\u0131r\u0131rd\u0131",
        handHint: "sizin turlar\u0131n\u0131zda",
      },

      birthday: {
        kicker: "Sand\u0131\u011f\u0131n\u0131zdan k\u00fc\u00e7\u00fck bir oda",
        title: "\u0130ki ki\u015finin do\u011fum g\u00fcn\u00fc tutmas\u0131 i\u00e7in ka\u00e7 ki\u015fi gerekir?",
        setup: [
          "\u0130nsanlar odaya teker teker giriyor.",
          "Herkesin do\u011fum g\u00fcn\u00fc 365 g\u00fcnden biri ve her g\u00fcn e\u015fit olas\u0131l\u0131kta.",
          "Soru, birinin seninle ayn\u0131 do\u011fum g\u00fcn\u00fcne sahip olup olmad\u0131\u011f\u0131 de\u011fil. Odadaki herhangi iki ki\u015finin tutup tutmad\u0131\u011f\u0131.",
        ],
        addPerson: "Bir ki\u015fi ekle",
        addPersonHint: "\u00c7ift say\u0131s\u0131na ne oldu\u011funa bak.",
        roomFull: "Oda doldu.",
        coachLabel: "Herkesin sordu\u011fu sorular",
        coach: {
          soonWhy: {
            q: (n: number) => `${n} ki\u015fi nas\u0131l yaz\u0131 tura oluyor?`,
            a: (n: number, pairs: string) =>
              `Ki\u015fileri de\u011fil \u00e7iftleri say. ${n} ki\u015fi ${pairs} farkl\u0131 \u00e7ift yapar ve her \u00e7ift kendi ba\u015f\u0131na bir tutma \u015fans\u0131d\u0131r. Bir ki\u015fi daha ekledi\u011finde odadaki herkesle yeni birer \u00e7ift getirir; yani \u015fanslar kalabal\u0131ktan \u00e7ok daha h\u0131zl\u0131 birikir.`,
          },
          notMine: {
            q: "Bu benim do\u011fum g\u00fcn\u00fcmle ilgili de\u011fil mi?",
            a: "Sezginin yapt\u0131\u011f\u0131 takas bu ve o \u00e7ok daha zor bir soru. Birinin tam olarak seninle tutmas\u0131 i\u00e7in yakla\u015f\u0131k 253 ki\u015fi gerekir. Herhangi iki ki\u015finin birbiriyle tutmas\u0131 i\u00e7in 23.",
          },
          realBirthdays: {
            q: "Do\u011fum g\u00fcnleri ger\u00e7ekten e\u015fit mi da\u011f\u0131l\u0131r?",
            a: "Hay\u0131r \u2014 ger\u00e7ek do\u011fum g\u00fcnleri mevsime g\u00f6re k\u00fcmelenir ve k\u00fcmelenme tutmay\u0131 daha olas\u0131 k\u0131lar, daha az de\u011fil. Yani buradaki e\u015fit da\u011f\u0131l\u0131m modeli temkinli cevab\u0131 verir; ger\u00e7ekte %50 biraz daha erken ge\u00e7ilir.",
          },
        },
        caption:
          "Model: e\u015fit olas\u0131l\u0131kl\u0131 365 do\u011fum g\u00fcn\u00fc, art\u0131k y\u0131l yok, herkes ba\u011f\u0131ms\u0131z. Ger\u00e7ek do\u011fum g\u00fcnleri mevsime g\u00f6re k\u00fcmelenir ve bu, ger\u00e7ek olas\u0131l\u0131\u011f\u0131 biraz y\u00fckseltir \u2014 yani buradaki, temkinli olan\u0131.",
        predictQuestion: "Sizce olas\u0131l\u0131k ilk ne zaman %50'yi ge\u00e7er?",
        predict: { count: (n: number) => `${n} kiÅi` },
        predictAnswer: (n: number, value: string) => `${n} ki\u015fi, ${value} ile`,
        peopleLabel: "Odadaki ki\u015fi",
        peopleValue: (n: number, value: string) => `${n} ki\u015fi, ayn\u0131 do\u011fum g\u00fcn\u00fc olas\u0131l\u0131\u011f\u0131 ${value}`,
        peopleHint: "Yirmili say\u0131lardan yava\u015f\u00e7a ge\u00e7irin.",
        roomLabel: (n: number) => `${n} ki\u015filik bir oda. Hi\u00e7 kimsenin do\u011fum g\u00fcn\u00fc tutmuyor.`,
        roomLabelMatch: (n: number, a: number, b: number, day: string) =>
          `${n} ki\u015filik bir oda. ${a}. ve ${b}. ki\u015finin do\u011fum g\u00fcn\u00fc ayn\u0131: ${day}.`,
        foundPair: (a: number, b: number, day: string) =>
          `${a}. ve ${b}. ki\u015finin do\u011fum g\u00fcn\u00fc ayn\u0131: ${day}.`,
        noPair: (n: number) => `${n} ki\u015filik bu odada herkesin do\u011fum g\u00fcn\u00fc farkl\u0131.`,
        tableCaption: (n: number) => `${n} ki\u015fi aras\u0131nda ayn\u0131 do\u011fum g\u00fcn\u00fc olas\u0131l\u0131\u011f\u0131: tam de\u011fer ve sim\u00fclasyon.`,
        exactRow: "Tam olas\u0131l\u0131k",
        simulatedRow: (rooms: number) => `Sim\u00fclasyon (${rooms.toLocaleString("tr-TR")} oda)`,
        stale: (n: number) => `yeniden \u00e7al\u0131\u015ft\u0131r\u0131n \u2014 son \u00e7al\u0131\u015fma ${n} ki\u015fiydi`,
        reading: (n: number, pairs: number) =>
          `${n} ki\u015fi ${pairs.toLocaleString("tr-TR")} farkl\u0131 \u00e7ift olu\u015fturur ve her biri tutma \u015fans\u0131d\u0131r.`,
        peopleFigure: "Ki\u015fi",
        pairsFigure: "\u00c7ift",
        pairsHint: "tutma \u015fans\u0131",
        chanceFigure: "Ayn\u0131 do\u011fum g\u00fcn\u00fc",
        exactHint: "tam de\u011fer",
        thresholdFigure: "%50'yi ge\u00e7ti\u011fi yer",
        thresholdHint: "ki\u015fi",
        simulateLabel: "Bunun yerine \u00e7al\u0131\u015ft\u0131r\u0131n",
        runRooms: (n: number) => `${n.toLocaleString("tr-TR")} oda doldur`,
        simulateNote: (days: number) =>
          `Her oda, ki\u015fi ba\u015f\u0131na e\u015fit olas\u0131l\u0131kl\u0131 ${days} g\u00fcnden bir do\u011fum g\u00fcn\u00fc \u00e7eker, sonra tekrar arar.`,
        announce: (n: number, value: string) => `${n} ki\u015fi. Ayn\u0131 do\u011fum g\u00fcn\u00fc olas\u0131l\u0131\u011f\u0131: ${value}.`,
        months: ["Oca", "\u015eub", "Mar", "Nis", "May", "Haz", "Tem", "A\u011fu", "Eyl", "Eki", "Kas", "Ara"],
      },

      conditional: {
        kicker: "\u0130\u015fi yapan \u015fey ipucu",
        title: "Bir ailenin iki \u00e7ocu\u011fu var. \u0130kisi de erkek mi?",
        setup: [
          "Bir ailenin iki \u00e7ocu\u011fu var: biri b\u00fcy\u00fck, biri k\u00fc\u00e7\u00fck.",
          "Her \u00e7ocuk erkek ya da k\u0131z ve ikisi de e\u015fit olas\u0131l\u0131kta \u2014 yani e\u015fit olas\u0131l\u0131kl\u0131 d\u00f6rt aile var.",
          "Biri sana bu aile hakk\u0131nda do\u011fru tek bir c\u00fcmle s\u00f6yl\u00fcyor.",
          "Senin sorun: ikisinin de erkek olma olas\u0131l\u0131\u011f\u0131 nedir?",
        ],
        coachLabel: "Herkesin sordu\u011fu sorular",
        coach: {
          notHalf: {
            q: "\u00c7ocuklardan biri erkek, o zaman di\u011feri 50/50 de\u011fil mi?",
            a: (value: string) =>
              `Bu, ba\u015fka bir c\u00fcmlenin cevab\u0131 olurdu: \u201cb\u00fcy\u00fck olan erkek\u201d. Sana s\u00f6ylenen, ikisinden en az birinin erkek oldu\u011fu \u2014 hangisi oldu\u011fu de\u011fil. D\u00f6rt aileden \u00fc\u00e7\u00fc bu c\u00fcmleye uyar ve bunlardan yaln\u0131zca biri iki erkektir; yani olas\u0131l\u0131k ${value}.`,
          },
          twoWays: {
            q: "Erkek-sonra-k\u0131z ile k\u0131z-sonra-erkek neden ayr\u0131 say\u0131l\u0131yor?",
            a: "\u00c7\u00fcnk\u00fc bunlar farkl\u0131 aileler ve her biri iki erkek kadar olas\u0131. Bir erkek bir k\u0131zl\u0131 aileye d\u00fc\u015fmek, iki erkekli bir aileye d\u00fc\u015fmekten iki kat kolayd\u0131r \u2014 birine iki yol \u00e7\u0131kar, di\u011ferine bir.",
          },
          wording: {
            q: "C\u00fcmlenin kurulu\u015fu cevab\u0131 nas\u0131l de\u011fi\u015ftiriyor?",
            a: "C\u00fcmle, kan\u0131t\u0131n kendisi. \u201cEn az biri erkek\u201d bir aileyi eler; \u201cb\u00fcy\u00fck olan erkek\u201d iki aileyi eler. Geriye daha az aile kal\u0131r ve iki erkek, kalan\u0131n i\u00e7inde daha b\u00fcy\u00fck bir pay tutar. Hi\u00e7bir ailede bir \u015fey de\u011fi\u015fmedi \u2014 yaln\u0131zca sana s\u00f6ylenen de\u011fi\u015fti.",
          },
        },
        caption:
          "Burada her \u00e7ocu\u011fun ba\u011f\u0131ms\u0131z olarak 1/2 olas\u0131l\u0131kla erkek ya da k\u0131z oldu\u011fu ve ipucunun tam olarak yaz\u0131ld\u0131\u011f\u0131 gibi ge\u00e7erli oldu\u011fu varsay\u0131l\u0131r. \u00dc\u00e7\u00fcnc\u00fc bir okuma \u2014 \u00e7ocuklardan biriyle rastgele kar\u015f\u0131la\u015f\u0131p erkek oldu\u011funu g\u00f6rmek \u2014 yine 1/2 verir ve burada modellenmemi\u015ftir.",
        predictQuestion: "\u0130ki \u00e7ocuk, en az biri erkek. \u0130kisinin de erkek olma olas\u0131l\u0131\u011f\u0131?",
        predict: { half: "1/2", third: "1/3", quarter: "1/4" },
        predictAnswer: (value: string) => `1/3, yani ${value}`,
        clueLabel: "\u0130pucu",
        clueShort: { atLeastOneBoy: "En az biri erkek", firstIsBoy: "\u0130lki erkek" },
        clue: {
          atLeastOneBoy: "En az biri erkek",
          firstIsBoy: "\u0130lk \u00e7ocuk erkek",
        },
        clueHint: "Ayn\u0131 aile, farkl\u0131 c\u00fcmle. Hangi kutular\u0131n kald\u0131\u011f\u0131na bak\u0131n.",
        outcome: { GG: "KK", GB: "KE", BG: "EK", BB: "EE" },
        possible: "h\u00e2l\u00e2 m\u00fcmk\u00fcn",
        counts: "ikisi de erkek",
        ruledOut: "elendi",
        matrixLabel: (clue: string, kept: string, value: string) =>
          `E\u015fit olas\u0131l\u0131kl\u0131 d\u00f6rt sonu\u00e7. “${clue}” bilgisiyle h\u00e2l\u00e2 m\u00fcmk\u00fcn olanlar: ${kept}. Yani ikisinin de erkek olma olas\u0131l\u0131\u011f\u0131 ${value}.`,
        fraction: (counts: string, value: string) => `kalan sonu\u00e7lar\u0131n ${counts} kadar\u0131 = ${value}`,
        compareCaption: "\u0130ki ipucu, her birinin b\u0131rakt\u0131\u011f\u0131 sonu\u00e7lar ve \u00e7\u0131kan olas\u0131l\u0131k.",
        clueHeader: "\u0130pucu",
        leftHeader: "M\u00fcmk\u00fcn olanlar",
        answerHeader: "\u0130kisi de erkek",
        explain: {
          atLeastOneBoy:
            "KK elenince \u00fc\u00e7 sonu\u00e7 kal\u0131r ve bunlardan yaln\u0131zca biri EE'dir. \u0130pucu erke\u011fin hangi \u00e7ocuk oldu\u011funu s\u00f6ylemedi\u011fi i\u00e7in KE ve EK ikisi de ayakta kal\u0131r \u2014 ve birlikte EE'yi ikiye bir ge\u00e7erler.",
          firstIsBoy:
            "\u0130lk \u00e7ocu\u011fu adland\u0131rmak KK ile KE'yi birlikte eler ve geriye iki sonu\u00e7 kal\u0131r. Art\u0131k EE, \u00fc\u00e7te bir de\u011fil ikide birdir. Ailede hi\u00e7bir \u015fey de\u011fi\u015fmedi; c\u00fcmle de\u011fi\u015fti.",
        },
        keptFigure: "Kalan sonu\u00e7",
        keptHint: "d\u00f6rtte",
        bothFigure: "\u0130kisi de erkek",
        bothHint: "kalanlar i\u00e7inde",
        answerFigure: "Olas\u0131l\u0131k",
        announce: (clue: string, kept: number, value: string) =>
          `\u0130pucu: ${clue}. ${kept} sonu\u00e7 kald\u0131. \u0130kisinin de erkek olma olas\u0131l\u0131\u011f\u0131: ${value}.`,
      },

      simpson: {
        kicker: "\u0130ki tedavi, tek bir karar",
        title: "Hangi tedaviyi se\u00e7erdin?",
        setup: [
          "B\u00f6brek ta\u015f\u0131 i\u00e7in iki tedavi, A ve B \u2014 1986 tarihli ger\u00e7ek bir \u00e7al\u0131\u015fmadan.",
          "Hastalar ya k\u00fc\u00e7\u00fck ta\u015fla ya da b\u00fcy\u00fck ta\u015fla geliyor; b\u00fcy\u00fck olanlar zor vakalar.",
          "Tablo her tedavinin her grupta ve iki grubun toplam\u0131nda ne yapt\u0131\u011f\u0131n\u0131 g\u00f6steriyor.",
          "Tabloyu oku ve isteyece\u011fin tedaviyi se\u00e7.",
        ],
        named:
          "Bakt\u0131\u011f\u0131n \u015feyin bir ad\u0131 var: Simpson paradoksu \u2014 gruplar topland\u0131\u011f\u0131nda tersine d\u00f6nen bir kar\u015f\u0131la\u015ft\u0131rma.",
        coachLabel: "Herkesin sordu\u011fu sorular",
        coach: {
          howBoth: {
            q: "A her iki grupta kazan\u0131p toplamda nas\u0131l kaybedebilir?",
            a: "\u00c7\u00fcnk\u00fc iki tedavi ayn\u0131 t\u00fcr hastaya verilmedi. A \u00e7o\u011funlukla zor vakalarda, B \u00e7o\u011funlukla kolay vakalarda kullan\u0131ld\u0131. Gruplar\u0131 toplamak \u201changi tedavi\u201d ile \u201changi hastalar\u201d sorusunu birbirine kar\u0131\u015ft\u0131r\u0131r ve hasta kar\u0131\u015f\u0131m\u0131 daha g\u00fc\u00e7l\u00fc etkidir.",
          },
          whichWrong: {
            q: "Say\u0131lardan biri yanl\u0131\u015f m\u0131?",
            a: "\u0130kisi de de\u011fil. \u0130kisi de ayn\u0131 say\u0131mlar \u00fczerinde aritmetik ve her y\u00fczdeyi yan\u0131ndaki iki say\u0131yla kar\u015f\u0131la\u015ft\u0131r\u0131p do\u011frulayabilirsin. Bunlar iki farkl\u0131 sorunun do\u011fru cevaplar\u0131.",
          },
          whichBelieve: {
            q: "Peki hangi say\u0131ya inanmal\u0131y\u0131m?",
            a: "Tek bir hasta i\u00e7in tedavi se\u00e7erken grup sat\u0131rlar\u0131na \u2014 \u00e7\u00fcnk\u00fc o hastan\u0131n ya k\u00fc\u00e7\u00fck ta\u015f\u0131 vard\u0131r ya b\u00fcy\u00fck, ikisinin ortalamas\u0131 asla olmaz. Toplam sat\u0131r\u0131 ba\u015fka bir soruyu yan\u0131tlar: bu belirli hasta kar\u0131\u015f\u0131m\u0131na ne oldu.",
          },
        },
        caption:
          "Grup ba\u015f\u0131na ba\u015far\u0131 oranlar\u0131 Charig ve ark. (1986) \u00e7al\u0131\u015fmas\u0131ndan, iki b\u00f6brek ta\u015f\u0131 tedavisinin kar\u015f\u0131la\u015ft\u0131r\u0131lmas\u0131ndan geliyor. Kayd\u0131r\u0131c\u0131lar hastalar\u0131 gruplar aras\u0131nda ta\u015f\u0131r; oranlar yerinde kal\u0131r. Her y\u00fczde, yan\u0131nda yazan say\u0131lar\u0131n b\u00f6l\u00fcm\u00fcd\u00fcr.",
        predictQuestion: "Bir tedavi her grupta kazan\u0131p toplamda kaybedebilir mi?",
        predict: { impossible: "Hay\u0131r \u2014 bu imk\u00e2ns\u0131z", possible: "Evet \u2014 olabilir" },
        predictAnswer: "Evet; a\u015fa\u011f\u0131daki tablo ger\u00e7ek bir \u00f6rnek",
        tableCaption: "Grup ve tedavi baz\u0131nda ba\u015far\u0131 oranlar\u0131 ve say\u0131lar, toplamla birlikte.",
        groupHeader: "Grup",
        group: { small: "K\u00fc\u00e7\u00fck ta\u015flar", large: "B\u00fcy\u00fck ta\u015flar" },
        treatment: { a: "Tedavi A", b: "Tedavi B" },
        treatmentShort: { a: "A", b: "B" },
        overall: "\u0130ki grup birlikte",
        ahead: "\u00f6nde",
        barsLabel: (
          smallA: string,
          smallB: string,
          largeA: string,
          largeB: string,
          overallA: string,
          overallB: string,
        ) =>
          `K\u00fc\u00e7\u00fck ta\u015flar: A ${smallA}, B ${smallB}. B\u00fcy\u00fck ta\u015flar: A ${largeA}, B ${largeB}. \u0130ki grup birlikte: A ${overallA}, B ${overallB}.`,
        reversedBody:
          "A her iki grupta \u00f6nde, toplamda geride. A \u00e7o\u011funlukla zor vakalara, B \u00e7o\u011funlukla kolay vakalara verilmi\u015f; yani toplam, iki tedaviyi de\u011fil iki farkl\u0131 hasta kar\u0131\u015f\u0131m\u0131n\u0131 kar\u015f\u0131la\u015ft\u0131r\u0131yor.",
        notReversedBody:
          "Gruplar b\u00f6yle da\u011f\u0131t\u0131ld\u0131\u011f\u0131nda toplam, gruplarla ayn\u0131 \u015feyi s\u00f6yl\u00fcyor. Ters d\u00f6nme i\u00e7in iki tedavinin farkl\u0131 hasta kar\u0131\u015f\u0131mlar\u0131na verilmesi gerekir.",
        shareLabel: (treatment: string) => `${treatment}: k\u00fc\u00e7\u00fck ta\u015fl\u0131 hasta`,
        shareValue: (treatment: string, small: number, large: number) =>
          `${treatment}: ${small} k\u00fc\u00e7\u00fck ta\u015fl\u0131, ${large} b\u00fcy\u00fck ta\u015fl\u0131 hasta`,
        shareHint: "Her tedavi 350 hastas\u0131n\u0131 ve grup ba\u015f\u0131na ba\u015far\u0131 oranlar\u0131n\u0131 korur. Yaln\u0131zca kar\u0131\u015f\u0131m de\u011fi\u015fir.",
        restore: "Yay\u0131mlanm\u0131\u015f tabloya d\u00f6n",
        overallA: "A toplam",
        overallB: "B toplam",
        reversedFigure: "Ters d\u00f6nd\u00fc m\u00fc?",
        reversedYes: "Evet",
        reversedNo: "Hay\u0131r",
        announce: (a: string, b: string, reversed: string) =>
          `Toplam: A ${a}, B ${b}. Ters d\u00f6nd\u00fc: ${reversed}.`,
      },

      recap: {
        lessons: [
          "Sezgi bir olas\u0131l\u0131k hesaplay\u0131c\u0131s\u0131 de\u011fildir. D\u00f6rt deneyin d\u00f6rd\u00fcnde de akla ilk gelen cevap yanl\u0131\u015f olan\u0131d\u0131r.",
          "Bir ipucu hangi sonu\u00e7lar\u0131n m\u00fcmk\u00fcn kald\u0131\u011f\u0131n\u0131 de\u011fi\u015ftirir ve hangilerinin kalaca\u011f\u0131na c\u00fcmlenin kurulu\u015fu karar verir. \"En az biri erkek\" ile \"ilki erkek\" farkl\u0131 k\u00fcmeler b\u0131rak\u0131r.",
          "Tutma meselesi ki\u015filerle de\u011fil \u00e7iftlerle ilgilidir. Yirmi \u00fc\u00e7 ki\u015fi 253 \u00e7ift olu\u015fturur; ayn\u0131 do\u011fum g\u00fcn\u00fcn\u00fcn hissedildi\u011finden \u00e7ok daha erken gelmesinin nedeni budur.",
          "Gruplar\u0131 toplamak, gruplar ayn\u0131 bi\u00e7imde doldurulmam\u0131\u015fsa i\u00e7lerindeki kar\u015f\u0131la\u015ft\u0131rmay\u0131 tersine \u00e7evirebilir.",
        ],
        footer:
          "Bunlar\u0131n her biri, belirtilmi\u015f bir modeli olan \u00e7\u00f6z\u00fcml\u00fc birer problemdir; \u015fansa dair genel bir kural de\u011fil. Tam olas\u0131l\u0131klar kapal\u0131 formda hesaplan\u0131r; sim\u00fcle edilenler ise deneyin tohumlanm\u0131\u015f bir \u00fcrete\u00e7le ger\u00e7ekten \u00e7al\u0131\u015ft\u0131r\u0131lmas\u0131ndan gelir ve her zaman b\u00f6yle etiketlenir. Bir soru ger\u00e7ekten belirsizse \u2014 en a\u00e7\u0131k \u00f6rnek iki \u00e7ocuk problemidir \u2014 varsay\u0131m sessizce se\u00e7ilmez, yaz\u0131l\u0131r.",
      },
    },

    // ------------------------------------------------------- sorting ----
    "sorting-race": {
      title: "Sıralama Yarışı",
      description:
        "Veriyi siz çizin; her algoritmanın onu sıralamak için ne kadar iş yaptığını görün.",
      theRace: "Yarış",
      algorithm: "Algoritma",
      shape: "Biçim",
      shapeAndKeys: "Biçim ve klavye",
      puzzle: "Görev",
      sorterA: "Sıralayıcı A",
      sorterB: "Sıralayıcı B",
      sort: "Sırala",
      algorithms: { selection: "Seçmeli Sıralama", insertion: "Eklemeli Sıralama" },
      shapes: {
        almost: "Neredeyse sıralı",
        sorted: "Sıralı",
        random: "Karışık",
        reversed: "Ters",
      },
      legend: { settled: "yerleşti", comparing: "karşılaştırılıyor", lifted: "havada" },
      metrics: {
        comparisons: "Karşılaştırma",
        moves: "Taşıma",
        disorder: "Düzensizlik",
        questionsAsked: "sorulan soru",
        valuesRelocated: "yeri değişen değer",
        inversions: (n: number) => `${n} terslik`,
      },
      drawHint: "Veriyi yeniden biçimlendirmek için grafiğin üzerinde sürükleyin.",
      keyboardHint: "bir çubuk seçer,",
      keyboardHint2: "yüksekliğini değiştirir.",
      keyboardHelp:
        "Grafiği yeniden biçimlendirmek için üzerinde sürükleyin. Grafik odaktayken sol ve sağ oklar bir çubuk seçer, yukarı ve aşağı oklar yüksekliğini değiştirir.",
      chartLabel: (size: number, algorithm: string, disorder: number, state: string) =>
        `${size} değerden oluşan çubuk grafik. ${algorithm}. Düzensizlik: ${disorder} terslik. ${state}`,
      state: {
        done: (comparisons: number, moves: number) =>
          `${comparisons} karşılaştırma ve ${moves} taşıma ile sıralandı.`,
        running: (comparisons: number, moves: number) =>
          `Sıralanıyor: şu ana kadar ${comparisons} karşılaştırma, ${moves} taşıma.`,
        alreadySorted: "Zaten sıralı. Başlatılmadı.",
        notStarted: "Başlatılmadı.",
        cursor: (index: number, value: number) =>
          `İmleç ${index}. çubukta, değer ${value}.`,
        sorting: "Sıralanıyor.",
        arrayReset: "Dizi sıfırlandı.",
        loaded: (shape: string) => `${shape} yüklendi.`,
        selected: (algorithm: string) => `${algorithm} seçildi.`,
      },
      race: {
        question: "Hangisi önce bitirir?",
        oneButton: "Tek düğme. İkisi de aynı veriden başlıyor.",
        bothDone: "Aynı sonuç — ama biri diğerinin sorduğu soruların çok azını sordu.",
        sorted: "sıralandı",
        caption: "Aynı dizi, aynı sonuç. Sayaçlar değil.",
        panelLabel: (title: string, size: number, state: string) =>
          `${title}: ${size} değerden oluşan çubuk grafik. ${state}`,
      },
      watch: {
        kicker: "Çalışırken izleyin",
        title: "Biri süpürür. Diğeri parmak ucuyla yürür.",
        lede: "Adım adım ilerleyin. Sıralayıcı A hiçbir şeyi kımıldatmadan önce kalanın tamamını yeniden tarar; Sıralayıcı B tek bir değeri alıp yalnızca gerektiği kadar geriye yürütür.",
        caption:
          "Bunlar Seçmeli Sıralama ve Eklemeli Sıralama. Uzun ve kesintisiz karşılaştırma dizileri birincisine; karşılaştır-kaydır-karşılaştır ritmi ikincisine ait.",
      },
      data: {
        kicker: "Veriyi çizin",
        title: "İş verinin içinde.",
        lede: "Grafiği yeniden biçimlendirin — üzerinde sürükleyin ya da bir biçim seçin — sonra yeniden sıralayın.",
        caption:
          "Seçmeli Sıralama burada her seferinde 496 soru sorar; sıralı, karışık ya da ters fark etmez, çünkü kalan her çifti yine de kontrol eder. Eklemeli Sıralama'nın sayısı ise çizdiğiniz biçimle birlikte değişir.",
      },
      distance: {
        kicker: "Evinden ne kadar uzakta",
        title: "Mesele kaç tanesinin yanlış olduğu değil.",
        lede: "Sıralı biçimden başlayın. Bir çubuğu ait olduğu yerden çok uzağa sürükleyin, sonra bunun yerine üç çubuğu hafifçe oynatın. Her birinin maliyetini karşılaştırın.",
        caption:
          "Terslik, sırası yanlış olan bir çifttir. Bu eklemeli sıralama, kendisine verilen dizideki her terslik için tam bir kez kaydırır — yani evinden çok uzaktaki tek bir değer, birkaç küçük hatadan daha pahalıya gelebilir.",
      },
      challenge: {
        architecture: "Mimari",
        neuronsUsed: "Kullan\u0131lan n\u00f6ron",
        testAccuracy: "Test do\u011frulu\u011fu",
        target: "Hedef",
        objectiveLine: (accuracy: string) =>
          `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n \u2014 olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
        solvedNote: "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
        noBest: "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
        bestLine: (neurons: number, accuracy: string, epoch: number) =>
          `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
        canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
          `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
        announceSolved: (neurons: number, accuracy: string) =>
          `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
        kicker: "Meydan okuma",
        title: "Neyi saydığınıza göre ucuz değişir.",
        lede: "Üç sabit dizi, üç bütçe — ve bütçe her zaman aynı sayıyla ilgili değil.",
        budget: "Bütçe",
        atMost: (unit: string) => `en fazla ${unit}`,
        barsChanged: "değişen çubuk",
        beaten: (done: number, total: number) => `${total} görevden ${done} tanesi geçildi`,
        fixedTo: (algorithm: string) =>
          `${algorithm} sabit. Onun yerine veriyi yeniden biçimlendirin.`,
        goal: (budget: number, unit: string) => `Hedef: en fazla ${budget} ${unit}.`,
        chartLabel: (title: string, size: number, disorder: number, goal: string, state: string) =>
          `${title}: ${size} değerden oluşan çubuk grafik. Düzensizlik: ${disorder} terslik. ${goal} ${state}`,
        editsUsed: (used: number, max: number) =>
          `${max} düzenlemeden ${used} tanesi kullanıldı.`,
        finished: (comparisons: number, moves: number) =>
          `${comparisons} karşılaştırma ve ${moves} taşıma ile bitti.`,
        budgetValue: (budget: number, unit: string) => `${budget} ${unit}`,
        editsLeft: (used: number, max: number) => `${max} düzenlemeden ${used} tanesi kullanıldı`,
        units: { comparisons: "karşılaştırma", moves: "taşıma" },
        puzzles: {
          "which-one-cares": {
            title: "Hangisi umursuyor?",
            brief: "Bütçenin izin verdiğinden daha az soru sorarak sıralayın.",
          },
          "fewest-writes": {
            title: "En az yazma",
            brief: "İstediğiniz kadar soru sorun — yeter ki fazla veri taşımayın.",
          },
          "three-edits": {
            title: "Üç düzenleme",
            brief: "En fazla üç çubuğu yeniden biçimlendirin, sonra bütçenin altına inin.",
          },
        },
        verdict: {
          tooManyEdits: (edits: number, max: number) =>
            `${edits} çubuk değiştirdiniz. En fazla ${max} değiştirebilirsiniz.`,
          overBudget: (used: number, unit: string, budget: number) =>
            `${used} ${unit}. Bütçe: ${budget}.`,
          passed: (used: number, unit: string, budget: number) =>
            `${budget} bütçesinin altında, ${used} ${unit} ile çözüldü.`,
        },
      },
      recap: {
        lessons: [
          "İki algoritma aynı sonuca, birbirinden çok farklı miktarda iş yaparak ulaşabilir",
          "Seçmeli sıralama her turda kalanın tamamını yeniden tarar, bu yüzden maliyeti sabittir; eklemeli sıralama yalnızca gerektiği kadar geriye yürür, bu yüzden maliyeti verinin bir özelliğidir",
          "Terslik, sırası yanlış olan bir çifttir ve bu eklemeli sıralama her biri için bir kez kaydırır — ama daha az soru sormak, daha az veri yazmakla aynı hedef değildir",
        ],
        footer:
          "Gerçek sıralama kütüphaneleri tam olarak buna yaslanır: neredeyse sıralı parçaları eklemeli sıralamaya devrederler, çünkü o biçimde işin neredeyse tamamı zaten yapılmıştır.",
      },
    },

    // ----------------------------------------------------- tokenizer ----
    tokenizer: {
      title: "Tokenizer Laboratuvarı",
      description:
        "Bir tokenizer'ı elinizle eğitin ve ne okuduğunun, neyi söylemenin ucuz olduğunu nasıl belirlediğini görün.",
      honesty:
        "Bu laboratuvar için birkaç kilobaytlık metin üzerinde eğitilmiş küçük bir BPE tokenizer'ı. Herhangi bir GPT modelinin kullandığı tokenizer değil.",
      nothingToTokenize: "Henüz tokenleştirilecek bir şey yok.",
      stripSummary: (label: string, count: number, list: string) =>
        `${label}. ${count} token: ${list}`,

      guess: {
        sectionLabel: "Kesikleri tahmin edin",
        heading: "Sizce bu metin nerelerden ayrılıyor?",
        lede: "Bir dil modeli bu cümleyi hiçbir zaman harfler olarak görmez; tam olarak kelimeler olarak da görmez. Onun ne gördüğünü söylemeden önce, cümleyi nerelerden parçaladığını düşünüyorsanız oraları işaretleyin. Sonra sonucu açın.",
        stripLabel: (sentence: string) =>
          `“${sentence}” cümlesi. Nerelerden ayrıldığını düşünüyorsanız işaretleyin. Sol ve sağ yön tuşlarıyla hareket edin, Boşluk ile kesik koyun veya kaldırın.`,
        cellLabel: (character: string, position: number) =>
          `${character} karakterinden önce kes, konum ${position}`,
        theSpace: "boşluk",
        hint: "Bir harfin önünden kesmek için ona dokunun. Şerit odaktayken",
        hintMove: "hareket eder,",
        hintPlace: "kesik koyar.",
        hintSpace: "bir boşluğu gösterir.",
        reveal: "Sonucu aç",
        preparing: "Hazırlanıyor…",
        cutEveryWord: "Her kelimeden kes",
        legendReal: "gerçekte kestiği yer",
        legendImagined: "işaretlediğiniz ama orada olmayan kesik",
        legendMatched: "bunu bildiniz",
        resultOne: (matched: boolean) =>
          `1 kesik işaretlediniz ve bu, gerçek kesiklerden biri ${matched ? "" : "değil"}.`,
        resultMany: (guessed: number, matched: number) =>
          `${guessed} kesik işaretlediniz ve bunlardan ${matched} tanesi gerçek.`,
        resultTail: (actual: number, tokens: number) =>
          `Tokenizer toplam ${actual} kesik yaptı ve geriye ${tokens} parça kaldı.`,
        explain:
          "Kelime değiller. “gardeners” ikiye ayrıldı: “garden” ve “ers”. Nokta tek başına duruyor ve her boşluk kendisinden sonraki kelimeye aittir, aralarında durmuyor.",
        actualLabel: "Cümlenin gerçekte ayrıldığı parçalar",
        announceCleared: "Temizlendi. Kesikleri yeniden işaretleyin.",
        announceEveryWord: "Her kelimenin önüne bir kesik konuldu.",
        describe: (
          guessed: number,
          matched: number,
          imagined: number,
          missed: number,
          actual: number,
          tokens: number,
        ) =>
          guessed === 0
            ? `Hiç kesik işaretlemediniz. Tokenizer ${actual} kesik yaptı ve cümleyi ${tokens} tokene ayırdı.`
            : `${guessed} kesik işaretlediniz. Bunlardan ${matched} tanesi gerçek. ` +
              `${imagined} tanesi orada değil. ${missed} tanesini kaçırdınız. ` +
              `Tokenizer toplam ${actual} kesik yaptı ve cümleyi ${tokens} tokene ayırdı.`,
        figures: {
          yourCuts: "Sizin kesikleriniz",
          matched: "Tutan",
          actualCuts: "Gerçek kesikler",
          tokens: "Parça",
        },
      },

      train: {
        kicker: "Parçalar nereden geliyor",
        title: "O parçaları kimse seçmedi.",
        lede: "Onlar sayıldı. Burada adım adım izleyebileceğiniz kadar küçük bir derlem var: Birleştir'e basın, derlemdeki en sık geçen komşu çift, geçtiği her yerde tek bir parçaya kaynaşsın. Sonra sayım yeniden başlar.",
        corpusLabel: "Okuduğu derlem",
        mergeNext: "Sıradaki çifti birleştir",
        trainAll: "Tümünü eğit",
        training: "Eğitiliyor…",
        untouched: (base: number, tokens: number) =>
          `Şu anda her parça tek bir karakter: toplam ${base} parça ve derlemin maliyeti ${tokens} token. En sık geçen çifti birleştirin ve ne olduğunu görün.`,
        merged: (
          index: number,
          left: string,
          right: string,
          frequency: number,
          token: string,
          vocabulary: number,
          tokens: number,
        ) =>
          `${index}. birleştirme: en sık geçen komşu çift ${left} + ${right} idi, ${frequency} kez görüldü. Artık tek bir token: ${token}. Sözlük: ${vocabulary} parça. Derlemin maliyeti ${tokens} token.`,
        exhausted: (merges: number, vocabulary: number) =>
          `Birleştirilecek bir şey kalmadı. Artık hiçbir çift birden fazla geçmiyor, dolayısıyla birini kaynaştırmak öğrenmek değil ezberlemek olurdu. ${merges} birleştirmede durdu; sözlük ${vocabulary} parçadan oluşuyor.`,
        explain:
          "İşte byte-pair encoding (BPE) budur. Bütün komşu çiftleri sayın, en sık olanı kaynaştırın, yeniden sayın. Sonunda elde ettiği parçalar onun sözlüğüdür ve her kaynaşma bir birleştirmedir. Kimse ona “·read” bir kelimedir demedi; bu, ilk dört sayım turunun sırayla ürettiği bir sonuçtan ibaret. Boşluğun daha ilk birleştirmeden itibaren parçaya dâhil olduğuna dikkat edin: öğrendiği parça “read” değil, “·read”. “·every” ise sonuna kadar parçalı kalıyor, çünkü metinde yalnızca bir kez geçiyor.",
        announceFinished:
          "Eğitim tamamlandı. Birden fazla geçen hiçbir çift kalmadı, dolayısıyla birleştirmeye değer bir şey yok.",
        announceFinishedAfter: (merges: number) =>
          `Eğitim ${merges} birleştirmeden sonra tamamlandı.`,
        announceReset: "Derlem sıfırlandı. Henüz hiçbir şey öğrenilmedi.",
        mergesLabel: "Birleştirme",
        vocabularyLabel: "Sözlük",
        corpusTokensLabel: "Derlem parçası",
      },

      merge: {
        kicker: "Ne kadar öğrendi?",
        title: "“Tek token” değişken bir hedeftir.",
        lede: "Bu tokenizer birkaç kilobaytlık Türkçe okudu. Eğitimini geri sarmak için kaydırıcıyı sürükleyin ve cümleyi dilediğiniz gibi değiştirin. Parçalar her konumda gerçekten yeniden hesaplanır.",
        sentenceLabel: "Cümleniz",
        sentenceHint:
          "Cümleyi değiştirin ya da kendiniz yazın. Türkçe veya İngilizce, tokenizer ikisine de yanıt verir.",
        mergesLearned: "Öğrenilen birleştirme",
        mergesValueText: (merges: number, max: number) => `${max} birleştirmeden ${merges} tanesi`,
        untrained: "Eğitimsiz",
        full: "Tamamı",
        stripLabel: (merges: number) => `Cümleniz, ${merges} birleştirme sonrasında`,
        trainingProgress: (done: number, total: number) =>
          `Tokenizer eğitiliyor… ${total} birleştirmeden ${done} tanesi.`,
        ready: "Tokenizer'ın eğitimi tamamlandı. Birleştirme kaydırıcısını sürükleyin.",
        explain:
          "Sıfır birleştirmede her karakter kendi başına bir tokendir, çünkü tokenizer harflerden başka bir şey bilmiyordur. Sağa doğru sürükleyin ve “·ev · ler · imiz · den” dizisinin önce “·ev · lerimiz · den”e, sonra “·evlerimiz · den”e dönüşmesini izleyin. Bu parçalar Türkçe ekler ama algoritmanın hiçbir yerinde ekin ne olduğu yazmıyor; bunlar yalnızca sürekli yan yana çıkan komşular.",
        jumpTo: "Atla",
      },

      compare: {
        kicker: "Ne üzerinde eğitildi?",
        title: "Ne okuduysa onu ucuzlatır.",
        lede: "İki tokenizer; aynı algoritma, aynı miktarda eğitim, farklı okuma. İkisine de aynı metni verin ve faturanın nasıl ayrıştığını görün. Sonra aradaki farkı kapatan bir cümle yazmayı deneyin.",
        textLabel: "İki tokenizer'ın da aldığı metin",
        textHint:
          "Metni istediğiniz gibi değiştirin. Hiçbir tokenizer'ı, hiç okumadığı bir dilde akıcı kılan bir cümle bulamayacaksınız.",
        trainedOnEnglish: "İngilizce üzerinde eğitildi",
        trainedOnTurkish: "Türkçe üzerinde eğitildi",
        englishCorpus: "birkaç kilobaytlık İngilizce düzyazı",
        turkishCorpus: "birkaç kilobaytlık Türkçe düzyazı",
        tokens: "token",
        cheaper: "Burada daha ucuz, çünkü bu onun okuduğu bir dil.",
        ratio: (ratio: string) =>
          `Aynı karakterler, aynı algoritma, aynı sayıda birleştirme. Yine de biri diğerinin ${ratio} katına mal oluyor. Aradaki fark, tamamen her birine ne okutulduğundan kaynaklanıyor.`,
        sampleLoaded: (label: string, words: number, characters: number) =>
          `${label} örneği yüklendi: ${words} kelime, ${characters} karakter.`,
        samples: {
          "tr-sea": "Türkçe",
          "tr-visit": "Türkçe 2",
          "en-room": "İngilizce",
          "en-bread": "İngilizce 2",
        },
        sampleLabel: "Metin",
      },

      metrics: {
        tokens: "Token",
        characters: "Karakter",
        words: "Kelime",
        merges: "Birleştirme",
      },

      challenge: {
        architecture: "Mimari",
        neuronsUsed: "Kullan\u0131lan n\u00f6ron",
        testAccuracy: "Test do\u011frulu\u011fu",
        target: "Hedef",
        objectiveLine: (accuracy: string) =>
          `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n \u2014 olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
        solvedNote: "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
        noBest: "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
        bestLine: (neurons: number, accuracy: string, epoch: number) =>
          `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
        canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
          `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
        announceSolved: (neurons: number, accuracy: string) =>
          `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
        kicker: "Görev",
        title: "Tek bütçe. Onu kaçırmanın iki yolu.",
        lede: "İlk görevde tokenizer sabit, cümle sizin. İkincisinde cümle sabit, tokenizer sizin. Bunlardan yalnızca biri daha çok uğraşarak çözülebilir.",
        budgetBadge: (budget: number) => `bütçe ${budget} token`,
        rewriteLabel: "Yeniden yazın",
        rewriteHint:
          "Büyük harfler, boşluklar, noktalama ve gereksiz sözcükler tamamen sizin elinizde. Listelenen kelimelerin metinde kalması gerekiyor.",
        rewriteStrip: "Yeniden yazdığınız metin, tokenleştirilmiş hâli",
        fixedLabel: "Cümle (değiştirilemez)",
        fixedStrip: "Cümlenin tokenleştirilmiş hâli",
        trainedOn: "Eğitildiği derlem",
        english: "İngilizce",
        turkish: "Türkçe",
        mergesLearned: "Öğrenilen birleştirme",
        unknownNote: (unknown: number) =>
          `${unknown} parça kesik çizgiyle çevrelenmiş ve ? ile işaretlenmiş: bunlar tokenizer'ın daha önce hiç görmediği karakterler. Sıradan düzyazı okudu ve düzyazı neredeyse tamamen küçük harflerden oluşur.`,
        englishCeiling:
          "İngilizce tokenizer'ın tam olarak eğitilmiş hâli bu, bu cümlede varabileceği en iyi nokta burası. Eksik olan şey daha fazla eğitim değil.",
        puzzles: {
          "say-it-cheaper": {
            title: "Daha ucuza söyleyin",
            brief:
              "Zorunlu kelimelerin hepsini koruyun ve aynı cümleyi bütçenin altına indirin. Nasıl yazıldığına dair geri kalan her şeyi değiştirebilirsiniz.",
            lesson:
              "Anlamda hiçbir şey değişmedi. Büyük harfler tokenizer'ın hiç öğrenmediği parçalar ve çift boşluk başlı başına bir token.",
          },
          "feed-it-the-right-words": {
            title: "Doğru kelimeleri okutun",
            brief:
              "Bu cümle değiştirilemez. Cümle bütçeye sığana kadar tokenizer'ın ne okuduğunu ve ne kadar eğitildiğini seçin.",
            lesson:
              "İngilizce tokenizer'ı ne kadar eğitirseniz eğitin oraya ulaşamadı. Mesele çaba değil: bir tokenizer yalnızca gerçekten okuduğu bir dilde ucuz olabilir.",
          },
        },
        verdict: {
          untouched: (tokens: number, budget: number) =>
            `Şu hâliyle bu metnin maliyeti ${tokens} token. Bütçe ${budget}.`,
          missingWords: (words: readonly string[]) =>
            `Şunlar hâlâ eksik: ${words.map((w) => `“${w}”`).join(", ")}. Cümlenin tamamının korunması gerekiyor.`,
          overBudget: (tokens: number, budget: number) =>
            `${tokens} token, ${budget} bütçesini ${tokens - budget} aşıyor.`,
          passed: (tokens: number, budget: number) =>
            `${tokens} token, ${budget} bütçesinin içinde.`,
          solvedAnnounce: (message: string) => `Çözüldü. ${message}`,
        },
        puzzleLabel: "Bulmaca",
        tokensLabel: "Token",
        budgetLabel: "Bütçe",
      },

      recap: {
        lessons: [
          "Bir tokenizer metni kelimelere değil, sık rastlanan parçalara ayırır",
          "Bu parçalar sayarak öğrenilir: en sık komşu çifti kaynaştır, sonra yeniden say",
          "Kaç birleştirme öğrendiği neyin tek token sayılacağını belirler ve kazancın büyük kısmı başlarda gelir",
          "Baştaki boşluk kendisinden sonraki kelimeye aittir; bu yüzden boşlukların ve büyük harflerin bir bedeli vardır",
          "Aynı cümlenin maliyeti, tokenizer'ın ne üzerinde eğitildiğine göre büyük ölçüde değişir",
          "Türkçe ekler yalnızca gerçekten Türkçe okumuş bir tokenizer için tek token hâline gelir",
        ],
        footer:
          "Gerçek modeller de bu yolla eğitiliyor; çok daha fazla metinle, karakterler yerine ham baytlar üzerinde. Eğitim verisinde az bulunan bir dilin, model onu konuşmayı öğrendikten çok sonra bile pahalı kalmasının nedeni de bu.",
      },
    },
  },
};
