import type { LabsCopy } from "./types";

/**
 * Türkçe lab metinleri.
 *
 * `en.ts` yanındaki kabuk sözlüğünden ayrı bir parça: ziyaretçi ilk lab'ı
 * açana kadar indirilmez. Şekli `enLabs` ile birebir aynı olmak zorundadır.
 *
 * Lab adları ve tek cümlelik açıklamaları burada değil, `tr.labMeta` içinde:
 * onları ana sayfadaki ızgara, hiçbir lab açılmadan önce söylüyor.
 */

export const trLabs: LabsCopy = {
  // ------------------------------------------------ word embeddings 3d ----
  "word-embeddings-3d": {
    sources: {
      title: "Kaynaklar",
      gloveVectors:
        "Bu laboratuvar\u0131n okudu\u011fu vekt\u00f6rleri destekler. \u00dc\u00e7 boyutlu g\u00f6r\u00fcn\u00fcm izd\u00fc\u015f\u00fcm\u00fc de\u011fi\u015ftirir, alt\u0131ndaki g\u00f6mmeleri de\u011fil.",
    },
    lede: "Aynı kelimeler, aynı vektörler, bir eksen daha. Bulutu döndürmek için sürükle.",
    honesty:
      "Bu, gömmenin gerçek görüntüsü değildir. Uzayın 300 boyutu var; döndürdüğün şey, onun üç PCA eksenine indirgenmiş bir görünümü: düz haritadan bir eksen fazla, yine de neredeyse hiçbiri.",
    compare:
      "Bu bir prototip ve dersten bilerek ayrı tutuldu. Derinlik, bulutu bir mekân gibi hissettiriyor; ama projeksiyonu daha doğru yapmıyor. Bu takasın öğretmeye değip değmediğine karar vermek, prototipi yapmanın asıl sebebi.",
    error: "Kelime vektörleri yüklenemedi.",
    varianceLabel: "Açıklanan varyans",
    varianceHint: (dimensions: number) => `${dimensions} eksenin üçü`,
    selectedLabel: "Seçili",
    recapTitle: "Bu prototip ne gösteriyor",
    recap: {
      lessons: [
        "Üç eksen, uzayın ikiden biraz fazlasını taşıyor, yine de neredeyse hiçbirini.",
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

  // --------------------------------------------------- word embeddings ----
  "word-embeddings": {
    sources: {
      title: "Kaynaklar",
      gloveVectors:
        "Bu laboratuvar\u0131n ger\u00e7ekten kulland\u0131\u011f\u0131 vekt\u00f6rleri destekler: kendi g\u00f6mme y\u00f6ntemini uygulamaz, \u00f6nceden e\u011fitilmi\u015f GloVe vekt\u00f6rlerini okur.",
    },

    predict: {
      question: (word: string) => `${word} kelimesine en yakın hangisi?`,
      hint: "Üçü de ilgili, sen hangisini beklersin?",
      loading: "Kelime vektörleri yükleniyor…",
      chose: (word: string, rank: number, total: number, score: string) =>
        `${word} dedin: ${total} kelime içinde ${rank}. sırada, ${score} benzerlikle.`,
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
        "Çizgiler, seçili kelimeyi yanında listelenen sekiz kelimeye bağlar. Bunlar okumayı kolaylaştırmak içindir, modelin parçası değildir: gömmede bağlantı yoktur, yalnızca mesafeler vardır.",
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
        `${a} ile ${b}, ${total} çift içinde ${rank} en yakın çift, ${score} benzerlikle. Projeksiyon onları haritanın ${percent} kadarı uzağına koydu: resme bakarak ilişkili olduklarını asla tahmin edemezdin.`,
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
        `Bu iki eksen, bu veri kümesindeki varyansın ${percent} kadarını açıklıyor. Geri kalan değişim hiçbir yere gitmedi: düz bir ekranda yeri olmayan diğer ${remaining} yönde duruyor.`,
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
        "Gömme uzayı İngilizcedir. Buradaki Türkçe kelimeler okumayı kolaylaştırmak için bizim eklediğimiz etiketlerdir: gömülmediler ve bu bir Türkçe gömme uzayı değildir.",
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
    scope:
      "Bu kuramsal modeldir: her iki hipotez alt\u0131nda \u00f6rneklem ortalamas\u0131 X\u0304'in \u00f6rnekleme da\u011f\u0131l\u0131m\u0131; ikisi de \u03c3/\u221an standart hatas\u0131yla normal ve \u03c3 bilinen kabul ediliyor [Casella & Berger, 2. bask\u0131, Teorem 5.3.1, s. 218]. Bu kurguda test istatisti\u011fi \u00f6rneklem ortalamas\u0131 X\u0304'tir; reddetme b\u00f6lgesi de standartla\u015ft\u0131r\u0131lm\u0131\u015f bi\u00e7imde de\u011fil, do\u011frudan X\u0304 biriminde yaz\u0131l\u0131r [s. 374]. Kritik de\u011feri t de\u011fil z yapan da budur. Bu laboratuvarda hi\u00e7bir yerde \u00f6rneklem \u00e7ekilmez: her say\u0131, g\u00f6sterilen denklemlerin kapal\u0131 form de\u011feridir; yani okudu\u011funuz \u015fey bir deneyin tek bir ko\u015fusu de\u011fil, modelin kendisidir.",
    credit: {
      inspiration:
        "Ar\u015f. G\u00f6r. Dolunay Ezgi Seyhan'\u0131n \u00e7al\u0131\u015fmas\u0131ndan esinlenilmi\u015ftir.",
      adaptation:
        "Bu interaktif laboratuvar, hocan\u0131n \u00f6zg\u00fcn hipotez testleri projesinden esinlenerek e\u011fitim amac\u0131yla geli\u015ftirilmi\u015ftir.",
      profile: "Akademik profili g\u00f6r\u00fcnt\u00fcle →",
    },

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
        `\u00d6rneklem ortalamas\u0131n\u0131n iki \u00f6rnekleme da\u011f\u0131l\u0131m\u0131. H\u2080 alt\u0131nda ${mu0}, H\u2081 alt\u0131nda ${mu1} merkezli; ikisinin de standart hatas\u0131 ${se}. Reddetme b\u00f6lgesi ${criticals} noktas\u0131nda ba\u015fl\u0131yor. H\u2080 alt\u0131nda reddetme b\u00f6lgesine d\u00fc\u015fen alan \u03b1 = ${alpha}; H\u2081 alt\u0131nda bu b\u00f6lgenin d\u0131\u015f\u0131nda kalan alan \u03b2 = ${beta}. G\u00fc\u00e7 ${power}.`,
    },

    controls: {
      moreLabel: "Di\u011fer ayarlar",
      note: "Her kontrol ayn\u0131 modeli yeniden ayarlar. Burada hi\u00e7bir \u015fey \u00f6rneklenmez.",
      mu0: "\u03bc\u2080: s\u0131f\u0131r hipotezi ortalamas\u0131",
      mu0Value: (value: string) => `\u03bc\u2080 = ${value}`,
      mu1: "\u03bc\u2081: alternatif ortalama",
      mu1Value: (value: string) => `\u03bc\u2081 = ${value}`,
      sigma: "\u03c3: anak\u00fctle standart sapmas\u0131",
      sigmaValue: (value: string) => `\u03c3 = ${value}`,
      alpha: "\u03b1",
      alphaValue: (value: string) => `\u03b1 = ${value}`,
      n: "n: \u00f6rneklem b\u00fcy\u00fckl\u00fc\u011f\u00fc",
      nValue: (value: number) => `n = ${value}`,
    },

    separation: {
      title: "\u0130ki hipotez",
      question: "\u0130ki hipotez birbirinden uzakla\u015ft\u0131\u011f\u0131nda ne olur?",
      caption:
        "Ayn\u0131 anak\u00fctle ortalamas\u0131 hakk\u0131nda iki iddia. Hi\u00e7bir e\u011fri verinin kendisi de\u011fildir: her biri X\u0304'in \u00f6rnekleme da\u011f\u0131l\u0131m\u0131d\u0131r, yani o iddia do\u011fruysa n \u00f6l\u00e7\u00fcm\u00fcn ortalamas\u0131n\u0131n nas\u0131l davranaca\u011f\u0131d\u0131r [Casella & Berger, 2. bask\u0131, s. 213-214, 218].",
      mu1Label: "\u03bc\u2081: alternatifi hareket ettirin",
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
      kicker: "Reddetme b\u00f6lgesi nerede ba\u015fl\u0131yor",
      title:
        "Tek bir reddetme b\u00f6lgesi; i\u00e7ine d\u00fc\u015fen her \u015fey kan\u0131t say\u0131l\u0131r.",
      lede: "Bir testin kurala ihtiyac\u0131 vard\u0131r: X\u0304, \u03bc\u2080'dan ne kadar uza\u011fa d\u00fc\u015ferse H\u2080 reddedilir? Reddetmeye yol a\u00e7an de\u011ferler reddetme b\u00f6lgesini olu\u015fturur (Casella ve Berger bunu kritik b\u00f6lge olarak da adland\u0131r\u0131r); kritik de\u011fer ise bu b\u00f6lgenin ba\u015flad\u0131\u011f\u0131 noktad\u0131r. Anlaml\u0131l\u0131k d\u00fczeyi \u03b1, \u03bc = \u03bc\u2080 iken X\u0304'in bu b\u00f6lgeye d\u00fc\u015fme olas\u0131l\u0131\u011f\u0131d\u0131r [Casella & Berger, 2. bask\u0131, Tan\u0131m 8.1.3, s. 374; Tan\u0131m 8.3.5-8.3.6, s. 385].",
      caption:
        "\u03b1 veriden \u00f6nce sabitlenir: \u03bc = \u03bc\u2080 iken X\u0304'in reddetme b\u00f6lgesine d\u00fc\u015fme olas\u0131l\u0131\u011f\u0131d\u0131r. Kayd\u0131r\u0131c\u0131n\u0131n e\u011friyi de\u011fil kritik de\u011feri oynatmas\u0131n\u0131n nedeni de budur. H\u2080 do\u011fruyken onu reddetmek I. tip hatad\u0131r [Casella & Berger, 2. bask\u0131, B\u00f6l\u00fcm 8.3.1, s. 382-383].",
      alphaLabel: "\u03b1: kabul etti\u011finiz I. tip hata oran\u0131",
      alphaValue: (value: string) => `\u03b1 = ${value}`,
      alphaHint: "Reddetme b\u00f6lgesindeki taral\u0131 alan tam olarak bu say\u0131d\u0131r.",
      alphaFigure: "\u03b1",
      criticalLabel: "Kritik de\u011fer",
      criticalHint: "\u03bc\u2080 \u00b1 z\u00b7SE",
      criticalLeft: "Alt s\u0131n\u0131r",
      criticalRight: "\u00dcst s\u0131n\u0131r",
      seLabel: "SE",
      seHint: "\u03c3/\u221an",
      oneSided: (value: string) =>
        `\u03b1'n\u0131n tamam\u0131 tek kuyrukta: H\u2080 da\u011f\u0131l\u0131m\u0131n\u0131n ${value} kadar\u0131 reddetme b\u00f6lgesinde kal\u0131yor.`,
      twoSided: (half: string) =>
        `\u03b1 iki kuyru\u011fa b\u00f6l\u00fcn\u00fcr: her u\u00e7ta ${half}. B\u00f6ylece her kritik de\u011fer, tek y\u00f6nl\u00fc bir testin koyaca\u011f\u0131ndan daha d\u0131\u015farda durur.`,
      announce: (alpha: string, criticals: string) =>
        `\u03b1 = ${alpha}. S\u0131n\u0131r ${criticals} konumunda.`,
    },

    betaSection: {
      kicker: "Kimsenin saymad\u0131\u011f\u0131 hata",
      title:
        "\u03b2, H\u2081'in reddetme b\u00f6lgesi d\u0131\u015f\u0131nda b\u0131rakt\u0131\u011f\u0131 k\u0131s\u0131md\u0131r.",
      lede: "\u03b1, H\u2080 alt\u0131nda; \u03b2 ise H\u2081 alt\u0131nda hesaplan\u0131r ve ikisi ayn\u0131 reddetme b\u00f6lgesinin kar\u015f\u0131t yanlar\u0131nda durur. Kritik de\u011feri kayd\u0131r\u0131p birini k\u00fc\u00e7\u00fcltmek di\u011ferini b\u00fcy\u00fct\u00fcr; bu y\u00fczden testin hangi y\u00f6ne kuruldu\u011fu, kritik de\u011ferin nereye kondu\u011fu kadar \u00f6nemlidir [Casella & Berger, 2. bask\u0131, s. 385].",
      caption:
        "\u03b2, bu belirli \u03bc\u2081 do\u011fruyken H\u2080'\u0131n reddedilmeme olas\u0131l\u0131\u011f\u0131d\u0131r, yani II. tip hata; g\u00fc\u00e7 ise 1 \u2212 \u03b2'd\u0131r. \u0130kisi de modelin \u00f6zellikleridir, herhangi bir \u00f6rneklemin de\u011fil. G\u00fc\u00e7 tek bir \u03bc\u2081 yerine olabilecek b\u00fct\u00fcn \u03bc de\u011ferleri boyunca hesapland\u0131\u011f\u0131nda g\u00fc\u00e7 fonksiyonu elde edilir [Casella & Berger, 2. bask\u0131, Tan\u0131m 8.3.1, s. 383].",
      testTypeLabel: "H\u2081 ne iddia ediyor",
      mu1Label: "\u03bc\u2081",
      mu1Value: (value: string) => `\u03bc\u2081 = ${value}`,
      betaLabel: "\u03b2",
      betaHint: "H\u2081'in b\u00f6lge d\u0131\u015f\u0131ndaki alan\u0131",
      powerLabel: "G\u00fc\u00e7",
      powerHint: "1 \u2212 \u03b2",
      alphaLabel: "\u03b1",
      reading: (beta: string) =>
        `\u03b2 = ${beta}: H\u2081 da\u011f\u0131l\u0131m\u0131n\u0131n bu kadarl\u0131k k\u0131sm\u0131 reddetme b\u00f6lgesinin d\u0131\u015f\u0131na, yani testin H\u2080'\u0131 reddetmedi\u011fi yere d\u00fc\u015f\u00fcyor.`,
      warning: {
        left: "Test \u03bc\u2081 < \u03bc\u2080 ar\u0131yor, ancak \u03bc\u2081 \u03bc\u2080'\u0131n alt\u0131nda de\u011fil. Alternatif da\u011f\u0131l\u0131m reddetme b\u00f6lgesinden uzakta duruyor, dolay\u0131s\u0131yla neredeyse hi\u00e7 yakalanm\u0131yor: \u03b2 1'e, g\u00fc\u00e7 0'a yak\u0131n.",
        right:
          "Test \u03bc\u2081 > \u03bc\u2080 ar\u0131yor, ancak \u03bc\u2081 \u03bc\u2080'\u0131n \u00fczerinde de\u011fil. Alternatif da\u011f\u0131l\u0131m reddetme b\u00f6lgesinden uzakta duruyor, dolay\u0131s\u0131yla neredeyse hi\u00e7 yakalanm\u0131yor: \u03b2 1'e, g\u00fc\u00e7 0'a yak\u0131n.",
      },
      announce: (beta: string, power: string) => `\u03b2 = ${beta}. G\u00fc\u00e7 = ${power}.`,
    },

    sampleSection: {
      kicker: "\u0130kisine birden yarayan tek kol",
      title: "Daha fazla veri her \u015feyi ayn\u0131 anda daralt\u0131r.",
      lede: "E\u011friler ayn\u0131 geni\u015flikte kald\u0131\u011f\u0131 s\u00fcrece \u03b1 ile \u03b2 birbirine kar\u015f\u0131 takas edilir. Geni\u015fli\u011fi de\u011fi\u015ftiren \u015fey n'dir: SE = \u03c3/\u221an. B\u00f6ylece iki \u00f6rnekleme da\u011f\u0131l\u0131m\u0131 da kendi ortalamas\u0131 etraf\u0131nda s\u0131k\u0131\u015f\u0131r ve \u03b1 y\u00fckseltilmeden \u00f6rt\u00fc\u015fme azal\u0131r [Casella & Berger, 2. bask\u0131, s. 217 ve s. 385].",
      caption:
        "x ekseni \u00b14,5 SE olarak \u00e7izilir, yani pencere de e\u011frilerle birlikte daral\u0131r. Kayd\u0131r\u0131c\u0131n\u0131n ikinci yar\u0131s\u0131n\u0131n ilk yar\u0131s\u0131ndan \u00e7ok daha az kazand\u0131rmas\u0131n\u0131n nedeni \u221an'dir.",
      nLabel: "n: \u00f6rneklem b\u00fcy\u00fckl\u00fc\u011f\u00fc",
      nValue: (value: number) => `n = ${value}`,
      formula: (se: string) => `SE = \u03c3/\u221an = ${se}`,
      nFigure: "n",
      seLabel: "SE",
      seHint: "\u03c3/\u221an",
      powerLabel: "G\u00fc\u00e7",
      betaLabel: "\u03b2",
      curveTitle:
        "\u00d6rneklem b\u00fcy\u00fckl\u00fc\u011f\u00fcne kar\u015f\u0131 g\u00fc\u00e7",
      eighty: "0,80",
      curveLabel: (from: number, to: number, first: string, last: string) =>
        `Di\u011fer her \u015fey sabitken n = ${from}'den n = ${to}'e g\u00fc\u00e7. ${first} civar\u0131nda ba\u015fl\u0131yor ve yakla\u015f\u0131k ${last} de\u011ferine ula\u015f\u0131yor.`,
      announce: (n: number, se: string, power: string) =>
        `n = ${n}. SE = ${se}. G\u00fc\u00e7 = ${power}.`,
    },

    challenge: {
      kicker: "\u015eimdi bir say\u0131y\u0131 tutturun",
      title: "G\u00f6revin istedi\u011fi g\u00fcce ula\u015f\u0131n.",
      lede: "\u0130ki g\u00f6rev. Her biri oynat\u0131lacak bir kontrol de\u011fil, ula\u015f\u0131lacak bir sonu\u00e7 belirtir; b\u00f6ylece hi\u00e7biri kayd\u0131r\u0131c\u0131y\u0131 belirli bir yere koyarak ge\u00e7ilemez: modelin o say\u0131y\u0131 ger\u00e7ekten bildirmesi gerekir.",
      puzzleLabel: "G\u00f6rev",
      reset: "Ba\u015fa d\u00f6n",
      powerLabel: "G\u00fc\u00e7",
      alphaLabel: "\u03b1",
      seLabel: "SE",
      target: (value: string) => `hedef ${value}`,
      notYet: (power: string, target: string) =>
        `G\u00fc\u00e7 ${power}. ${target} de\u011ferine ula\u015fmas\u0131 gerekiyor.`,
      alphaTooHigh: (max: string) =>
        `\u03b1 bu g\u00f6revin s\u0131n\u0131r\u0131n\u0131n \u00fczerinde: en fazla ${max} olabilir.`,
      announceSolved: (power: string) => `\u00c7\u00f6z\u00fcld\u00fc. G\u00fc\u00e7 = ${power}.`,
      announceAttempt: (power: string, alpha: string) => `G\u00fc\u00e7 ${power}, \u03b1 ${alpha}.`,
      puzzles: {
        "reach-power": {
          title: "0,80'e ula\u015f",
          brief: (power: string, alpha: string) =>
            `Etki ger\u00e7ek ama k\u00fc\u00e7\u00fck: \u03bc\u2081, \u03bc\u2080'\u0131n yar\u0131m birim \u00fczerinde ve test bunu buldu\u011fundan daha s\u0131k ka\u00e7\u0131r\u0131yor. \u03b1'y\u0131 ${alpha} de\u011ferinin \u00fczerine \u00e7\u0131karmadan g\u00fcc\u00fc ${power} de\u011ferine getirin.`,
          lesson:
            "\u0130ki kol da g\u00fcc\u00fc art\u0131r\u0131r ama ayn\u0131 bi\u00e7imde de\u011fil. \u03b1'y\u0131 b\u00fcy\u00fctmek reddetme b\u00f6lgesini geni\u015fletir ve daha y\u00fcksek bir I. tip hata oran\u0131n\u0131 kabul etmek demektir; n'yi b\u00fcy\u00fctmek ise SE'yi daraltarak \u03b1'y\u0131 de\u011fi\u015ftirmeden \u03b2'y\u0131 d\u00fc\u015f\u00fcr\u00fcr [Casella & Berger, 2. bask\u0131, s. 385].",
          solved: (power: string, alpha: string) =>
            `G\u00fc\u00e7 ${power}, \u03b1 = ${alpha}. Buraya n ve \u03b1'n\u0131n hangi kar\u0131\u015f\u0131m\u0131yla geldiyseniz gelin, kritik de\u011fer SE'ye g\u00f6re \u03bc\u2080'a yeterince yakla\u015ft\u0131 ve H\u2081 da\u011f\u0131l\u0131m\u0131n\u0131n b\u00fcy\u00fck k\u0131sm\u0131 reddetme b\u00f6lgesine d\u00fc\u015ft\u00fc.`,
        },
        noisy: {
          title: "Fazla g\u00fcr\u00fclt\u00fc",
          brief: (power: string, alpha: string) =>
            `\u03c3 = 3 ve test iki y\u00f6nl\u00fc; yani \u03b1 iki kuyru\u011fa b\u00f6l\u00fcn\u00fcyor ve her iki kritik de\u011fer de epey d\u0131\u015farda duruyor. \u03b1 en fazla ${alpha} olacak \u015fekilde ${power} g\u00fcce ula\u015f\u0131n.`,
          lesson:
            "\u0130ki y\u00f6nl\u00fc test \u03b1'y\u0131 iki kuyru\u011fa b\u00f6l\u00fc\u015ft\u00fcr\u00fcr; bu y\u00fczden her kritik de\u011fer, tek y\u00f6nl\u00fc testin koyaca\u011f\u0131ndan daha d\u0131\u015farda durur. Tek y\u00f6nl\u00fc test \u03b1'n\u0131n tamam\u0131n\u0131 tek bir kuyrukta toplar: \u03bc\u2081 o y\u00f6ndeyse g\u00fc\u00e7 artar, de\u011filse azal\u0131r [Casella & Berger, 2. bask\u0131, s. 386].",
          solved: (power: string, alpha: string) =>
            `G\u00fc\u00e7 ${power}, \u03b1 = ${alpha}. \u03c3'y\u0131 k\u00fc\u00e7\u00fcltmek ya da n'yi b\u00fcy\u00fctmek SE'yi daralt\u0131r; tek y\u00f6nl\u00fc test ise \u03b1'n\u0131n tamam\u0131n\u0131 \u03bc\u2081'in ger\u00e7ekten bulundu\u011fu kuyru\u011fa koyar.`,
        },
      },
    },

    recap: {
      lessons: [
        "\u03b1, \u03bc = \u03bc\u2080 iken X\u0304'in reddetme b\u00f6lgesine d\u00fc\u015fme olas\u0131l\u0131\u011f\u0131d\u0131r: hi\u00e7bir \u015fey g\u00f6rmeden \u00f6nce sabitlenen I. tip hata oran\u0131.",
        "\u03b2, \u03bc = \u03bc\u2081 iken X\u0304'in bu b\u00f6lgenin d\u0131\u015f\u0131na d\u00fc\u015fme olas\u0131l\u0131\u011f\u0131d\u0131r; g\u00fc\u00e7 ise 1 \u2212 \u03b2'd\u0131r. \u0130kisi de \"herhangi bir etkiye\" g\u00f6re de\u011fil, belirli bir \u03bc\u2081'e g\u00f6re hesaplan\u0131r.",
        "Kritik de\u011feri oynatmak \u03b1 ile \u03b2'y\u0131 takas eder. \u0130kisini birden iyile\u015ftiren tek \u015fey SE = \u03c3/\u221an'in k\u00fc\u00e7\u00fclmesidir; n'in taviz olmayan kol olmas\u0131n\u0131n nedeni budur.",
      ],
      footer:
        "Buradaki her \u015fey \u03c3'n\u0131n bilindi\u011fi kapal\u0131 form normal modeldir: \u00f6rneklem ortalamas\u0131n\u0131n iki \u00f6rnekleme da\u011f\u0131l\u0131m\u0131, tek bir reddetme b\u00f6lgesi ve b\u00f6lge s\u0131n\u0131r\u0131n\u0131n iki yan\u0131ndaki alanlar. Ger\u00e7ek testlerde \u03c3'n\u0131n \u00f6rneklemden kestirilmesi gerekir (t da\u011f\u0131l\u0131m\u0131n\u0131 gerekli k\u0131lan da budur) ve y\u00f6n\u00fcn veriden \u00f6nce mi sonra m\u0131 se\u00e7ildi\u011fi ayr\u0131 bir sorundur. Bu laboratuvar, o zorluklar\u0131n \u00fczerine oturdu\u011fu geometriyi g\u00f6sterir.",
    },
    sources: {
      title: "Kaynaklar",
      theoryLabel: "Kuramsal kaynak",
      theory:
        "George Casella ve Roger L. Berger, Statistical Inference, 2. bask\u0131, Duxbury Press. Hipotez testleri, hata olas\u0131l\u0131klar\u0131 ve g\u00fc\u00e7 fonksiyonu i\u00e7in 8. b\u00f6l\u00fcm (s. 373-386); \u00f6rneklem ortalamas\u0131n\u0131n \u00f6rnekleme da\u011f\u0131l\u0131m\u0131 i\u00e7in 5. b\u00f6l\u00fcm (s. 213-218).",
      implementationLabel: "Uygulama ve esin kayna\u011f\u0131",
      implementation:
        "Say\u0131sal model, Ar\u015f. G\u00f6r. Dolunay Ezgi Seyhan'\u0131n \u00f6zg\u00fcn hipotez testleri projesinden aktar\u0131lm\u0131\u015ft\u0131r. Bu interaktif uyarlama, metinleri ve g\u00f6rsel tasar\u0131m\u0131 AI CLUB LABS'a aittir.",
      notation:
        "G\u00f6sterim: bu laboratuvar \u03b2'y\u0131 II. tip hata olas\u0131l\u0131\u011f\u0131, g\u00fcc\u00fc ise 1 \u2212 \u03b2 olarak yazar; uygulamada yayg\u0131n olan g\u00f6sterim budur. Casella ve Berger ise \u03b2(\u03b8) ile do\u011frudan g\u00fc\u00e7 fonksiyonunu g\u00f6sterir, dolay\u0131s\u0131yla onlar\u0131n \u03b2(\u03b8) de\u011feri buradaki 1 \u2212 \u03b2 de\u011ferine kar\u015f\u0131l\u0131k gelir (Tan\u0131m 8.3.1, s. 383).",
      pages:
        "Sayfa numaralar\u0131, bu revizyonda kullan\u0131lan ikinci bask\u0131n\u0131n bas\u0131l\u0131 sayfalar\u0131na aittir. Yay\u0131n y\u0131l\u0131, incelenen n\u00fcshadan do\u011frulanamad\u0131\u011f\u0131 i\u00e7in verilmemi\u015ftir.",
    },
  },

  // -------------------------------------------- reinforcement learning ----
  "reinforcement-learning": {
    sources: {
      title: "Kaynaklar",
      qLearning:
        "Tablo tabanl\u0131 Q-\u00f6\u011frenme g\u00fcncelleme kural\u0131n\u0131 ve yak\u0131nsama ko\u015fullar\u0131n\u0131 destekler. Izgara, \u00f6d\u00fcller ve ziyaret\u00e7inin ayarlad\u0131\u011f\u0131 karo laboratuvara aittir.",
    },

    room: {
      title: "Oda",
      question:
        "Bu robota çıkış yolunu kimse göstermedi. Yolu deneyerek buldu: neyi önemseyeceğine ise siz karar veriyorsunuz.",
      sliderLabel: "İşaretli kare robot için ne kadar değerli?",
      sliderValue: (value: string) => `İşaretli karenin değeri ${value}`,
      hint: "Sürükleyin. Her oynattığınızda yol sıfırdan yeniden öğreniliyor.",
      wow: "Ona durmasını söylemediniz. O karenin kapıdan daha değerli olduğunu söylediniz.",
      behaviour: {
        avoided: "Kareye basmamak için uzun yoldan dolandı ve kapıya ulaştı.",
        passed: "Yolu üzerinde kareye basarak geçti ve kapıya ulaştı.",
        stayed: "Kapıya hiç gitmedi. Sadece karenin yanında oyalanıyor.",
      },
      readout: (steps: number, visits: number) => `${steps} hamle · kareye ${visits} kez bastı`,
      mapLabel: (behaviour: string, steps: number, visits: number, at: number) =>
        `Yukarıdan görünen küçük bir oda. ${behaviour} Toplam ${steps} hamle, işaretli kareye ${visits} kez basıldı. Robot ${at}. hamlede.`,
    },

    learn: {
      kicker: "Bunu nasıl çözdü?",
      title: "Yapabileceği her hamle için bir sayı tuttu.",
      lede: "Buradaki hiçbir şey robotun öğrenmiş olabileceğinin bir resmi değil: kaydırıcıyı getirdiğiniz anda gerçekten öğrenmiş olduğu şey. Yukarıdaki kaydırıcıyı oynatın; bu sayfadaki her sayı yeni bir çalıştırmadan baştan hesaplanır.",

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
      noAction: "hiçbir yere: burası kapı",
      bestAction: "en iyi",
      selectedTitle: (row: number, col: number) => `Satır ${row}, sütun ${col}`,
      chain: (row: number, col: number, action: string, value: string) =>
        `Satır ${row}, sütun ${col} üzerindeyken robotun yapabileceği dört hamle ve her biri için bir sayı var. En büyüğünü seçiyor (${action} giderek elde ettiği ${value}), çünkü o hamle en son denediğinde onu daha iyi bir yere götürmüştü. Bunu birkaç yüz kez tekrarlayın, sayılar değişmeyi bırakır.`,

      unexploredLabel: "Uğramadığı kare",
      unexploredHint: "oraya gitmeyi bıraktı",

      propagation:
        "Kaydırıcıyı en başa çekin. İlk on-on beş denemede hiçbir şeyin değeri yok: robot dolanıyor ve attığı her adım ona biraz pahalıya geliyor. Sonra kapıya tesadüfen giriyor, kapının yanındaki bir kare pozitife dönüyor ve sonraki birkaç denemede bu iyi haber odaya doğru, kare kare yayılıyor. Öğrenmenin tamamı bu yayılma.",

      formulaTitle: "Her hamleden sonra uyguladığı kural",
      formulaNote:
        "Şöyle okuyun: az önce yaptığınız hamlenin sayısını, gerçekte elde ettiğiniz ödüle ve vardığınız yerden artık mümkün gördüğünüz en iyi değere doğru biraz kaydırın. α bu kaydırmanın büyüklüğü, γ ise ileride gelecek bir ödülün şimdikine kıyasla ne kadar değerli sayıldığı.",

      honesty:
        "Robot odanın tamamını öğrenmedi. İşine yarayan bir yol öğrendi ve geri kalanını keşfetmeyi bıraktı; bu yüzden bazı kareler hâlâ en baştaki tahminini taşıyor. Bu yöntemin bir kusuru değil: yalnızca kendi deneyiminden öğrenmek tam olarak böyle görünür.",

      scheduleWarning:
        "Kaydedilen denemeler eşit aralıklı, bu da öğrenmenin gerçekleştiği kısmı gizliyor.",
    },

    recap: {
      lessons: [
        "Ödül bir talimat değildir. Bir puandır ve robot en yüksek puanı veren davranışı bulur: aklınızdan hiç geçmemiş olanı bile.",
        "Deneyerek öğrenir: her hamle bir sayıyı günceller ve işe yarayan sayılar, ilk kez iyi giden şeyden dışa doğru yayılır.",
        "Aklınızdaki sonucu değil, gerçekten yazdığınız ödülü optimize eder.",
      ],
      footer:
        "Bu, küçük ve deterministic bir grid üzerinde gerçek tabular Q-learning'dir: yirmi yedi kare, dört hamle, her ikili için bir sayı. Gerçek robotlar ve büyük pekiştirmeli öğrenme sistemleri bundan çok daha karmaşıktır, ama verdiğiniz ödülle istediğiniz sonuç arasındaki açık, sistemler büyüdükçe kapanmıyor.",
    },
    world: {
      title: "Oda",
      question: "Ajan ne yapmalı?",
      sliderHint:
        "Dünyaya dair karar verebileceğiniz tek şey bu. Geri kalan her şey (duvarlar, kapı, bir hamlenin maliyeti) sabit.",
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
      lede: "Eğit'e basın. Ajan köşeden hiçbir şey bilmeden başlar, dolanır ve sonunda kapıya tesadüfen düşer. O andan itibaren elinde bir şey vardır. Aşağıdaki her ok, her sayı ve eğrideki her nokta o koşunun kendisidir, kaydı değil.",
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
      lede: "Ajan hiçbir zaman bir rota saklamadı. Kare başına, yön başına tek bir sayı sakladı (o hamlenin ne kadar iyi çıktığını) ve rota, hep en büyüğünü seçtiğinizde ortaya çıkan şeydir. Solda: tek bir tur öncesi. Sağda: şu an.",
      caption:
        "Bir ok, Q-değeri değildir. O karedeki en büyük Q-değerine sahip hamledir; politika kelimesinin anlamı da budur. Seçildiği dört sayı aşağıda.",
      beforeTitle: "Eğitimden önce",
      beforeLabel:
        "Hiç eğitim yapılmadan önceki oda. Bütün sayılar sıfır olduğu için her kare aynı yönü gösteriyor: hiçbir şey bilmemek böyle görünür.",
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
      lede: "Her hamleden sonra ajan tam olarak bir sayıyı değiştirir: az önce yaptığı hamleninkini. Aşağıdaki her şey yukarıdaki koşudan gelen en son güncellemedir: elindeki sayılar, dünyanın ödediği ve şimdi elinde tuttuğu.",
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
        `${row}. satır, ${col}. sütundan ${action} yönüne hareket etti: ${choice}. ${landed} ve dünya ${reward} ödedi.`,
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
        reward: "r: toplanan",
        bootstrap: "γ · max Q(s′,a′), indiği yerden en iyisi",
        target: "r + γ · max Q(s′,a′), hedeflediği",
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
        "Bu oda küçük. Üçünü de taradığımızda ajanın neredeyse her ayarla odayı çözdüğü görüldü: bunların değiştirdiği şey, eğrinin ne kadar hızlı oturduğu, yolda ne kadar gürültülü olduğu ve oturup oturmadığı.",
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
        what: "Mevcut en iyisinden yararlanmak yerine ne sıklıkta rastgele keşfe çıktığı. Bu değiş tokuşun adı var: keşif ve yararlanma. Koşu boyunca azalır.",
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
      lede: "Üç görev. Her birinde ajan sizin istemediğiniz bir şey yapıyor ve değiştirebileceğiniz tek bir sayı var. Hiçbiri kaydırıcıyı belirli bir yere koyarak geçilemez: ajanın o şeyi gerçekten yapması gerekir.",
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
            "Kare −3 değerinde, bu yüzden ajan iki fazla hamle yapıp etrafından dolaşıyor. Bunun yerine kapıya giderken karenin üstünden geçmesini sağlayın, ama orada durmasına yol açmadan.",
          lesson:
            "Bir eşik değil, bir aralık var. Karenin değeri, kazandırdığı dolambaçtan fazla ve yerini alacağı kapıdan az olmalı.",
        },
        camp: {
          title: "Kapıdan vazgeçsin",
          brief:
            "Kare hiçbir şey etmiyor, bu yüzden ajan üstünden geçip yoluna devam ediyor. Kapıya hiç gitmemesini sağlayın. Kapıyı ya da duvarları oynatamazsınız, yalnızca karenin ödediğini.",
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
        stayed: "kapıya hiç ulaşmıyor, karenin yanında kalıyor",
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
        notYet: (behaviour: string) => `Henüz değil, ${behaviour}.`,
      },
      mapLabel: (behaviour: string, steps: number) =>
        `Bu ayarlarla eğitim sonrası oda: ${steps} hamlede ${behaviour}.`,
      announceSolved: (title: string) => `Çözüldü: ${title}.`,
      announceAttempt: (behaviour: string) => `Yeniden eğitildi, ${behaviour}.`,
    },
  },

  // --------------------------------------------------------- attention ----
  attention: {
    sources: {
      title: "Kaynaklar",
      transformer:
        "Bu laboratuvar\u0131n hesaplad\u0131\u011f\u0131 \u00f6l\u00e7eklenmi\u015f nokta \u00e7arp\u0131m\u0131 dikkatini destekler. Laboratuvar tek bir ba\u015fl\u0131\u011f\u0131 elle kurar; makalenin tan\u0131tt\u0131\u011f\u0131 mimarinin tamam\u0131n\u0131 uygulamaz.",
    },

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
      "Beşinci kelimeyi değiştirin ve seçili kelimeye ne olduğuna bakın, ona hiç dokunmadığınız hâlde.",
    dogNote:
      "Artık iki canlı var ve model dikkatini ikisi arasında neredeyse eşit paylaştırdı. Dağılım değişti ama hangisinin yorgun olduğunu hâlâ ayırt edemiyor.",

    reveal: {
      kicker: "Nasıl karar verdi?",
      title: "Tek bir sayı, baştan sona.",
      lede: "Bu bölüm yukarıda seçili olan kelimeyi izler. Seçimi ya da değiştirilen kelimeyi değiştirin; buradaki her adım onunla birlikte değişir, çünkü bu, aynı hesabın kendisidir, ikinci bir kopyası değil.",
    },

    trace: {
      step1: "Seçtiğiniz kelime",
      step1Title: (word: string) => `“${word}” ile başlayın`,
      step1Note:
        "Aşağıdaki her şey, bu tek kelimenin diğerlerinin her biriyle sırayla karşılaştırılmasıdır.",

      step2: "Ne aradığı",
      step2Title: (word: string) => `“${word}” bunu istiyor, query'si`,
      step2Note:
        "Sağa uzanan bir çubuk kelimenin istediği bir özelliktir; sola uzanan ise özellikle aramadığı bir özelliktir. Bunlar modelin ne istediğine dair kendi ifadeleridir, okunabilir hâle getirilmiştir: gerçek bir modelinkiler hiç okunabilir değildir.",

      step3: "Diğer kelimenin sunduğu",
      step3Title: (word: string) => `“${word}” bunu sunuyor, key'i`,
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
        "Bir kelimeyi değiştirmek diğerlerinin paylarını da değiştirir: dokunmadığınız kelimeler dahil, çünkü hepsi aynı %100'ü paylaşıyor.",
        "Attention, çok daha büyük bir modelin içindeki tek bir mekanizmadır. Nereye bakılacağına ve neyin karıştırılacağına karar verir; tek başına cümleyi anlamaz.",
      ],
      footer:
        "Buradaki kelimelere elle yazılmış yedi özellik verildi; bu yüzden model bir kediyi bir toptan ayırabiliyor ama bir topu bir aynadan ayıramıyor. Gerçek Transformer'lar çok daha zengin temsiller kurmak için çok sayıda head ve katmanı üst üste yığar: bu, bu sayfanın anlattığından farklı ve çok daha uzun bir hikâye.",
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
      lede: "Eksen sayısının kareköküne bölmek, etkisini sonuca bakarak göremeyeceğiniz tek adımdır: alternatifiyle karşılaştırana kadar sonuç her iki hâlde de makul görünür. Bu yüzden aynı satır burada iki kez var: bir kez bu modelin hesapladığı gibi, bir kez de bölme atlanarak.",
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
      lede: "Bakılan her kelime, payı oranında kendi value vektörünü verir. Bunları toplayınca seçili kelimenin dönüştüğü şey ortaya çıkar: gerçek bir modelde bir sonraki katmana ulaşan da budur.",
      tableCaption: "En çok katkı veren üç kelime için pay ve value vektörü.",
      outputLabel: "Karışmış çıktı, eksen eksen",
    },
  },

  // -------------------------------------------------- gradient descent ----
  "gradient-descent": {
    sources: {
      title: "Kaynaklar",
      momentum:
        "Laboratuvar\u0131n sundu\u011fu momentum y\u00f6ntemini ve bu y\u00f6ntemin t\u00fcredi\u011fi a\u011f\u0131r top g\u00fcncellemesini destekler.",
      adam: "Laboratuvar\u0131n sundu\u011fu Adam eniyileyicisini, motorun hesaplad\u0131\u011f\u0131 moment kestirimleri ve yanl\u0131l\u0131k d\u00fczeltmesi dahil olmak \u00fczere destekler.",
    },

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
      gradientNorm: "Gradyan büyüklüğü",
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
        `Amaç fonksiyonunun eşyükselti haritası. Adım ${step}. Konum ${x}, ${y}. Amaç değeri ${objective}. Gradyan büyüklüğü ${gradient}. ${status}.`,
    },

    chart: {
      label: (objective: string, step: number) =>
        `Amaç değerinin adım sayısına göre logaritmik grafiği. ${step}. adımda amaç değeri ${objective}.`,
    },

    announce: {
      ready: "Başlangıç noktasına dönüldü.",
      finished: (steps: number, status: string) => `${steps} adım sonra bitti. ${status}.`,
    },

    drop: {
      instruction: "Topu bırakmak için haritaya dokunun, yuvarlanmasını izlemek için bırakın. Her adımı uzatıp kısaltmak için camgöbeği ucu sürükleyin.",
      mapHint: "Başlangıç noktasını koymak için haritaya dokunun ya da sürükleyin, çalıştırmak için bırakın; ok tuşları noktayı taşır, Enter çalıştırır.",
      handleLabel: "İlk adımın ucu. Adım boyunu değiştirmek için sürükleyin ya da ok tuşlarını kullanın.",
      moreLabel: "Tam adım boyu ve adım adım denetimler",
      momentumHint: "Topun son adımından daha fazlasını korumasını sağlamak için kadranı çevirin. Başka bir yere bırakmak için haritalardan birine dokunun.",
    },
    find: {
      title: "Dibi bulun",
      question: "Ne kadar büyük bir adım atabilirsiniz?",
      caption:
        "Camgöbeği ok, ölçeğine uygun çizilmiş ilk adımdır. Onu uzatınca bütün adımlar onunla birlikte büyür. Sayılardan çok yolun biçimine bakın.",
    },

    direction: {
      kicker: "Neden o yön",
      title: "Gradyan bir vektördür ve cevabı gösteren bir işaret değildir.",
      lede: "Mevcut noktadan iki ok çıkıyor: düz olan, adımın gerçekte gittiği yön, −∇f = −(a·x, b·y); kesikli olan ise minimuma giden doğru, −(x, y). Her koordinat kendi eğriliğiyle ölçekleniyor; bu yüzden iki yön ancak eğrilikler eşitken çakışır. Önce noktayı, sonra eğriliği sürükleyin.",
      descent: "Adımın gittiği yön: −∇f",
      target: "Minimuma giden doğru",
      equalLength: "İki ok da aynı uzunlukta çiziliyor; karşılaştırılan tek şey yönleri.",
      angle: "Aralarındaki açı",
      angleHint: "0° iki yönün çakıştığı durumdur",
      aligned: "Burada eğrilikler eşit, dolayısıyla iki yön tam olarak çakışıyor.",
      apart: "Eğrilikler farklı; adım minimuma değil dik eksene doğru çekiliyor.",
      onAxis:
        "Koordinatlardan biri zaten sıfır, yani eşit olmayan ölçeklemenin etki edeceği bir şey yok. Okları ayırmak için noktayı eksenden çıkarın.",
      dragHint:
        "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükleyin ya da haritaya odaklanıp",
      keyboardHint: "tuşlarını kullanın; başa döndürmek için:",
      keyboardHelp:
        "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükleyin. Harita odaktayken ok tuşları noktayı taşır, Home tuşu ise başlangıç konumuna geri gönderir.",
      legendAndKeys: "Oklar ve klavye",
      label: (x: string, y: string, kappa: string, angle: string) =>
        `Taşınabilir noktası olan eşyükselti haritası. Nokta ${x}, ${y} konumunda. Koşul sayısı ${kappa}. İniş yönü, minimuma giden doğrudan ${angle} derece sapmış durumda.`,
      caption:
        "Eğrilik oranını 1'e indirin; iki ok tek bir oka dönüşür. Eksenlerin dışında bu, ikisinin çakıştığı tek durumdur, ve tek boyutlu bir resmin hiçbir şekilde gösteremeyeceği bir durumdur, çünkü tek eksende gradyan yalnızca bir işarettir.",
    },

    rate: {
      kicker: "Adım boyu",
      title: "Tavanı belirleyen, algoritma değil yüzeydir.",
      lede: "Aynı yüzey, değişen tek bir sayı: o ilk adımın uzunluğu. Haritanın altındaki iki işaret bu yüzeyin eğriliğinden hesaplanıyor; gösterim işe yarasın diye seçilmiş değiller.",
      marks: { monotone: "aşma yok", stability: "kararlılık sınırı" },
      regimes: {
        monotone: "Doğrudan yaklaşıyor",
        oscillating: "Aşıyor ama yine de yaklaşıyor",
        boundary: "Tam sınırda",
        divergent: "Iraksıyor",
      },
      regimeNote: {
        monotone: "η her iki eğrilik için de 1/c altında: hiçbir koordinat minimumu aşmıyor.",
        oscillating:
          "η dik eksende 1/c değerini aşmış: her adımda işaret değiştiriyor ama küçülüyor.",
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
      lede: "Adam, her koordinatın adımını o koordinatın kendi gradyan büyüklüğüne dair yürüyen bir tahmine böler. m ortalama gradyan, s ise ortalama karesel gradyandır; ikisi de sıfırdan başlamanın yarattığı sapmaya karşı düzeltilir ve güncelleme η·m̂ ÷ (√ŝ + ε) olur.",
      firstStepTitle: "İki eğriliğin bir milyon kat ayrıldığı yerde ilk adım",
      firstStepLede: (a: string, b: string) =>
        `Bir eksende eğrilik ${a}, diğerinde ${b}. Gradyanın iki bileşeni arasında yaklaşık bir milyon kat fark var. Aşağıdaki her sayı, engine tek adım çalıştırılarak ölçülüyor.`,
      tableCaption:
        "Her eksende gradyan büyüklüğü ve ilk adımın boyutu; gradient descent ve Adam için.",
      colQuantity: "Büyüklük",
      colX: "Dik eksen",
      colY: "Düz eksen",
      rowGradient: "Gradyan büyüklüğü",
      rowGd: (rate: string) => `Gradient descent adımı, η = ${rate}`,
      rowAdam: (rate: string) => `Adam adımı, η = ${rate}`,
      firstStepNote:
        "Sapma düzeltmesinden sonra ilk güncelleme η·g ÷ (|g| + ε) hâline gelir. Gradyanın büyüklüğü sadeleşir ve iki eksen de yaklaşık η kadar hareket eder: düzeltmenin atlanmayıp gerçekten uygulanmasının nedeni budur.",
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
        stalled: (budget: number) => `Bu, hedefe hiç ulaşmıyor. Bütçe ${budget} adım.`,
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
          `Bu η iki yüzeyde de yakınsıyor: burada ve daha yumuşak olanda ${steps} adımda. Yukarı doğru itin ve hangisinin önce pes ettiğine bakın.`,
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
            "Bu, kararlılık sınırının üzerinde başlıyor ve ilk Çalıştır'da patlıyor. İşe yarayan bir adım boyu bulun: sonra aynı sayının daha yumuşak bir yüzeyde ne yaptığına bakın.",
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
        "Negatif gradyan yokuş aşağıyı gösterir, minimumu değil. Eksenlerin dışında ikisi ancak eğrilik her yönde aynıyken çakışır.",
        "Bir yüzeyin kaldırabileceği en büyük adım boyu, 2 bölü onun en dik eğriliğidir: algoritmanın değil, yüzeyin bir özelliği. Bunun yarısının altında yaklaşım doğrudandır, ikisinin arasında yol aşar ama yine de yaklaşır, üstünde ise çalışma yüzeyi terk eder.",
        "Koşul sayısı κ, dik eğriliğin düz eğriliğe bölümüdür ve tek bir adım boyunun iki yöne birden hizmet etmesini engelleyen şey odur: düz eksen hâlâ emeklerken dik eksen çoktan tavanındadır.",
        "Momentum kararlı aralığı η·max(a,b) < 2(1+β) değerine genişletir ve uzun bir zikzağı kısaltabilir; Adam her koordinatı kendi gradyan geçmişiyle ölçekler, böylece gradyan büyüklüğündeki bir milyon katlık fark adım boyunda bir milyon kat olmaz. Yine de ikisinde de seçilecek bir adım boyu kalır.",
      ],
      footer:
        "Buradaki her şey konveks ve ikinci dereceden: eğrilik her noktada aynı, gradyan tam, cevap daha başlamadan biliniyor. Gerçek eğitim bu üçünü de bırakır. Geriye kalan, ileri geri oynadığınız ilişkidir: yüzeyin biçimi, atmanıza izin verilen adımın boyutunu belirler.",
    },
  },

  // --------------------------------------------------- backpropagation ----
  backpropagation: {
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
      title: "Çıktıyı çekin",
      question: "Ağın çıktısını tutun ve bir yere çekin. Hangi ağırlıkların değişmesi gerekiyor?",
      caption:
        "Çıktıyı tuttuğunuz sürece her bağlantı, çekişten kendine düşen payla parlar: pay büyüdükçe kalınlaşır, büyümesi gerekiyorsa mavi, küçülmesi gerekiyorsa pembe olur ve kesik çizgiler, suçun hangi yöne gittiğini göstermek için çıktıdan geriye doğru akar. Bıraktığınızda ağırlıklar tam bu payları alır.",
      announceLanded: (aimed: string, landed: string) =>
        `Hedef ${aimed} idi, çıktı ${landed} oldu.`,
      announceAim: (target: string, leader: string) =>
        `Çıktı ${target} değerine çekiliyor. En büyük payı ${leader} taşıyor.`,
      diagramLabel: (out: string) =>
        `İki girdili, iki tanh nöronlu ve tek çıktılı bir ağ; çıktı şu an ${out}. Çıktıyı yukarı ya da aşağı sürükleyin veya seçip ok tuşlarını kullanın, sonra Enter'a basın.`,
      bias: (name: string, value: string) => `${name} ${value}`,
      handleLabel: "Ağın çıktısı",
      handleValue: (out: string, target: string | null) =>
        target === null ? `Çıktı ${out}` : `Çıktı ${out}, ${target} değerine çekiliyor`,
      leaderLine: (leader: string, share: string) =>
        `Bu çekişin en büyük payını ${leader} taşıyor: ${share} kadar değişirdi.`,
      landedLine: (aimed: string, landed: string) =>
        `Hedef ${aimed} idi, çıktı ${landed} oldu. Ağın içinden çizilen düz bir çizgi tam ${aimed} diyordu; aradaki fark tanh'ın eğriliği.`,
      hint: "Sağdaki beyaz noktayı sürükleyin. Her bağlantı ne kadar değişmesi gerektiğiyle parlayacak.",
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
      title: "Eğri bir çizgi olana kadar yaklaşın.",
      lede: "Biri hariç bütün ağırlıkları sabit tutun; kayıp bir eğriye dönüşür. Tek bir noktasına yaklaşın ve düzleşmesini izleyin.",
      caption:
        "Kesikli çizginin eğimi, geri yayılımın bu ağırlık için verdiği eğimdir. Uzaktan bakınca kötü bir uyumdur; yakından bakınca eğri ile çizgi ayırt edilemez. Gradyan bundan ibarettir: bu ağırlık değiştiğinde kaybın ne kadar hızlı değiştiği, yeterince yakından bakıldığında. Eğri boyunca ilerlemek için grafiği sürükleyin.",
      announce: (half: string, slope: string, gap: string) =>
        `Pencere ±${half}. Geri yayılım ${slope} diyor; ölçülen eğim ${gap} kadar farklı.`,
      chartLabel: (w: string, half: string) =>
        `w₁₁ ağırlığı ${w} çevresinde ±${half} içinde değişirken kayıp ve geri yayılımın öngördüğü teğet. Eğri boyunca ilerlemek için sürükleyin.`,
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
      title: "İlk kadranı çevirin. Sonuncuyu izleyin.",
      lede: "Tek bir mile bağlı beş kadran; her biri bir öncekiyle dönüyor. Her bağlantı komşusunu kendi oranıyla çeviriyor ve oranlar çarpılıyor.",
      caption:
        "Bir bağlantının üzerindeki sayı, önceki kadran çok az döndüğünde o kadranın ne kadar döndüğüdür: yerel türevi. Son kadran hepsinin çarpımı kadar döner. Geri yayılım, bu çarpmanın uzak uçtan başlayarak yapılmasıdır.",
      announce: (x: string, d: string, product: string) =>
        `x ${x}, d ${d}; d, x'in ${product} katı hızla değişiyor.`,
      diagramLabel: (values: string) =>
        `x, a, b, c ve d adlı beş kadran; değerleri ${values}. İlki bir denetimdir: döndürmek için sürükleyin ya da ok tuşlarını kullanın.`,
      stages: ["a = 1,5x", "b = tanh a", "c = b²", "d = 2c − 1"],
      dialLabel: "İlk kadran, x",
      hint: "Mavi kadranı sürükleyerek döndürün ya da seçip ok tuşlarını kullanın. Oranı en iyi küçük dönüşler gösterir.",
      figures: {
        product: "Bağlantıların çarpımı",
        productHint: "zincir kuralıyla d′(x)",
        measured: "Son dönüşünüz",
        measuredHint: (dx: string) => `Δx = ${dx} için Δd ÷ Δx`,
        measuredEmpty: "ilk kadranı çevirin",
      },
    },

    // 4 ----------------------------------------------------------------------
    ledger: {
      kicker: "Hesap sizde",
      title: "Geri geçişi siz yapın.",
      lede: "Gerçek bir kayıp: tek bir nöron, onun karesel hatası ve ağırlığı küçük tutan bir ceza. İleri değerler doldurulmuş durumda. Geri değerler sizin ve sıra önemli.",
      caption:
        "Bir düğümün gradyanı, onu okuyan her düğümden geri akanların toplamıdır; bu yüzden ancak hepsi bilindikten sonra bilinebilir. Geri yayılımın kayıptan ağırlıklara doğru ilerlemesinin ve iki düğümün okuduğu w'nin iki katkıyı toplamasının nedeni budur.",
      refused: (node: string, waiting: string) =>
        `Henüz değil: ${node} değerini ${waiting} okuyor ve onun gradyanı henüz bilinmiyor. Önce bütün okuyucular gelir.`,
      filledAnnounce: (name: string, adj: string) => `∂L/∂${name} = ${adj}.`,
      diagramLabel:
        "L = (tanh(w·x + b) − y)² + 0,1·w² ifadesinin hesap grafiği. Her düğüm ileri değerini gösterir; gradyanını doldurmak için bir düğüme dokunun.",
      nodeDone: (name: string, value: string, adj: string) =>
        `${name}, değer ${value}, gradyan ${adj}.`,
      nodeOpen: (name: string, value: string) => `${name}, değer ${value}, gradyan henüz doldurulmadı.`,
      nodeConst: (name: string, value: string) => `${name}, bir sabit, ${value}.`,
      rootLine: "∂L/∂L = 1. Her şey burada başlar: kayıp, tam olarak kendisi kadar hızlı değişir.",
      nodeLine: (name: string) =>
        `∂L/∂${name}: ${name} değerini okuyan her düğümden geri akan, o düğümün yerel türeviyle çarpılır.`,
      term: (reader: string) => `${reader} üzerinden:`,
      sum: (parts: string, total: string) => `iki yol, toplanır: ${parts} = ${total}`,
      checked: (ours: string, numeric: string) =>
        `Bitti. Sizin ∂L/∂w değeriniz ${ours}; w'yi oynatıp ölçmek ${numeric} veriyor.`,
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
      title: "Tek bir geri geçiş, ağırlık başına iki geçişe karşı.",
      lede: "Gradyan bulmanın daha basit bir yolu var: her ağırlığı biraz oynat, ağı çalıştır, neyin değiştiğine bak. Bunu geri yayılımla, gerçekten, bu tarayıcıda yarıştırın.",
      caption:
        "İki sütun da aynı gradyanı hesaplıyor ve yarış ancak ikisi aynı sonuca vardığı için geçerli. Oynatmak her ağırlık için ağı iki kez çalıştırmayı gerektirir, bu yüzden süresi ağırlık sayısıyla büyür; geri yayılım ise o sayı ne olursa olsun bir ileri ve bir geri geçiş ister. Süreler sizin makinenize ait; geçerli olan orandır.",
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
      title: "Ağı uzatın ve sinyalin sönmesini izleyin.",
      lede: "Her biri tek nöronlu katmanlardan oluşan bir zincir. Katman eklemek için sonuncuyu sağa sürükleyin ve gradyanın ne kadarının hâlâ başa ulaştığını görün.",
      caption:
        "Her katman gradyanı w ile aktivasyonunun eğiminin çarpımıyla çarpar. Sigmoid'in eğimi en fazla dörtte birdir; bu yüzden w = 1'de on katman en az altı büyüklük mertebesine mal olur ve ilk katmanlar öğrenmeyi bırakır. ReLU, sinyal pozitif kaldıkça gradyanı olduğu gibi geçirir; 1'den büyük bir ağırlık ise onu büyütür: gradyan patlar.",
      announce: (depth: number, first: string) =>
        `${depth} katman. Girdiye ulaşan gradyan ${first}.`,
      chartLabel: (depth: number, activation: string, first: string) =>
        `${depth} katmanlı bir ${activation} zinciri. Çubuklar, her katmana ne kadar gradyan ulaştığını log ölçekte gösteriyor; girdide ${first}.`,
      handleLabel: "Katman sayısı",
      end: "son",
      hint: "Sondaki mavi noktayı sürükleyin ya da seçip sol ve sağ ok tuşlarını kullanın.",
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
      title: "Birinin geri geçişi yanlış. Nerede olduğunu bulun.",
      lede: "Bu sayfadan üç grafik; her birinin geri geçişinde tek bir hata var. Elinizde uygulayıcıların kullandığı araç var: gradyan kontrolü.",
      caption:
        "Bir parametreyi kontrol etmek, geri geçişin sonucunu o parametreyi oynatıp ölçmekle karşılaştırır. Hangilerinin ve nasıl tutmadığı hatanın yerini gösterir. Yanlış bir suçlama yalnızca hatanın orada olmadığını söyler.",
      announce: (solved: number, total: number) => `${total} hatadan ${solved} tanesi bulundu.`,
      cases: {
        neuron: {
          tab: "Nöron",
          task: "Sayfanın başındaki küçük ağ. Bir nöronun geri adımı yanlış.",
          hint: "Ağırlıkları tek tek kontrol edin. Yanlış çıkanların hepsi hangi nörondan geçiyor?",
          solved:
            "Buldunuz. h₂, eğimi olarak 1 − tanh²(z) yerine tanh(z) kullanmış. Yalnızca h₂'nin arkasındaki ağırlıklar yanlıştı; onu gösteren de buydu.",
        },
        fork: {
          tab: "Çatal",
          task: "Elle doldurduğunuz grafik. Bir değerin iki kez kullanıldığı yerde bir şeyler ters gidiyor.",
          hint: "b doğru çıkıyor, w çıkmıyor. w'de olup b'de olmayan ne?",
          solved:
            "Buldunuz. w'ye geri dönen iki yoldan yalnızca en son geleni kaldı: toplanması gerekirken üzerine yazılmış. Paylaşılan her değer katkılarını toplamak zorundadır.",
        },
        sign: {
          tab: "İşaret",
          task: "Aynı kayıp, hata y − h olarak yazılmış. İki gradyan da yanlış çıkıyor.",
          hint: "İkisini dikkatle karşılaştırın: biri doğrunun tam olarak negatifi, diğeri değil. Bir işaret nerede kaybolmuş olabilir?",
          solved:
            "Buldunuz. Çıkarma, ikinci girdisi olan h'nin eksisini unutmuş; bu yüzden h'nin arkasındaki her şey negatif çıktı. w'nin ceza yolu oradan geçmiyor; w'nin yanlış ama tam ters olmamasının nedeni bu.",
        },
      },
      checkTitle: "Gradyan kontrolü",
      check: "Kontrol et",
      checkLegend: "Solda geri geçiş, sağda oynatarak ölçülen.",
      accuseTitle: "Hata nerede?",
      notYet: "Birkaç parametreyi kontrol edin, sonra düğümü seçin.",
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
        "Bugün eğitilen her yapay sinir ağı, bu sayfanın başındakinden milyarlarca ağırlıklı olanlara kadar, bu tek geri yürüyüşle öğrenir. Framework'ler onu sizin için yazar; yazdıkları budur.",
    },
  },

  // ------------------------------------------------------- convolution ----
  convolution: {
    sources: {
      title: "Kaynaklar",
      lecunZip:
        "Bu laboratuvarın konusu olan kısıtlı ağı tanıtır: ağırlıkları resmin her konumunda ortak kullanılan, geri yayılımla öğrenilen ve el yazısı rakamları okuyan küçük çekirdekler.",
      convArithmetic:
        "Girdi boyutunun, çekirdek boyutunun, dolgunun ve adımın çıktı boyutunu nasıl belirlediğini, adımın hiç ulaşamadığı hücreleri düşüren taban işlemiyle birlikte adım adım çıkarır. Dördüncü bölümdeki formül, bu genel durum için verdiği ilişkidir.",
      vgg: "3×3 katman yığınlarını savunur: iki tanesi 5×5, üç tanesi 7×7 bir bölgeyi görür ve bunu tek bir büyük çekirdeğin gerektireceğinden daha az ağırlıkla yapar.",
      alexnet:
        "Derin bir ağın ilk katmanının fotoğraflardan kendi kendine öğrendiği çekirdekleri gösterir: çoğu belirli bir yöndeki kenarlara ya da renge yanıt verir.",
      hubelWiesel:
        "Görme korteksinde her biri görme alanının küçük bir bölgesine, çoğu da tek bir yöndeki bir kenara ya da çubuğa yanıt veren hücreleri anlatır. Alıcı alan terimi bu çalışmadan gelir.",
    },

    cellLabel: (row: number, column: number) => `Ağırlık, satır ${row}, sütun ${column}`,
    invalidWeight: "Her hücreye bir sayı gerekiyor: 1, -2, 0,5 ya da 1/9 deneyin.",
    kernelWord: "Çekirdek",

    // 1 ----------------------------------------------------------------------
    slide: {
      title: "Kayan bir pencere",
      question: "Dokuz ağırlık bir resmin üzerinde kayıyor. Geride ne bırakıyorlar?",
      input: "Resim",
      kernel: "Çekirdek",
      output: "Çıktı",
      inputLabel:
        "T harfinin 9'a 9 resmi. Çerçeveli kare penceredir. Bir pikseli açıp kapatmak için tıklayın.",
      kernelLabel: "Çekirdek: sol sütunda eksi 1, ortada 0, sağda artı 1.",
      outputLabel: (done: number, total: number) =>
        `Çıktı, ${total} hücreden ${done} tanesi hesaplandı. Pencereyi bir hücreye taşımak için tıklayın ya da ok tuşlarını kullanın.`,
      arithmetic: "Bu hücrenin hesabı",
      step: "Bir adım kaydır",
      fillRest: "Kalanını doldur",
      reset: "Baştan başla",
      caption:
        "Her çıktı hücresi, toplanan dokuz çarpımdır: ağırlık çarpı altındaki piksel. Ağırlıklar hiç değişmez; yalnızca pencere hareket eder. Resmin sağa doğru aydınlandığı yerde pozitif, karardığı yerde negatif.",
      announce: (column: number, row: number, value: string) =>
        `Pencere sütun ${column}, satır ${row}. Çıktı ${value}.`,
      figures: {
        cell: "Bu hücre",
        computed: "Hesaplanan",
        weights: "Ağırlık",
        weightsHint: "her adımda aynı dokuz tane",
      },
    },

    // 2 ----------------------------------------------------------------------
    kernels: {
      kicker: "Dokuz sayı",
      title: "Ağırlıkları değiştirin, gördüğü şey değişsin.",
      lede: "Aynı kayan toplam, bu kez daha büyük bir resimde. Bir çekirdek seçin ya da kendinizinkini yazın, sonra resmin üzerine çizin ve neyi yakaladığına bakın.",
      input: "Resim",
      output: "Çıktı",
      inputLabel:
        "32'ye 32 bir resim: bir disk, bir kare, eğik bir çubuk ve bir halka. Çizmek için üzerinde sürükleyin.",
      outputLabel: "Çekirdekten geçmiş resim. Sıfırla dolgulandığı için boyutu aynı.",
      drawHint: "Çizmek için sürükleyin.",
      editorLabel: "Çekirdek",
      presetLabel: "Başlangıç",
      presets: {
        identity: "Birim",
        blur: "Bulanıklaştır",
        sharpen: "Keskinleştir",
        vertical: "Dikey kenarlar",
        horizontal: "Yatay kenarlar",
        outline: "Dış hat",
      },
      notes: {
        identity: "Ortadaki tek bir 1, altındaki pikseli kopyalar: çıktı resmin kendisidir.",
        blur: "Dokuz tane dokuzda bir, her pikselin komşularıyla ortalamasını alır. Ağırlıkların toplamı 1 olduğu için düz alanlar parlaklığını korur.",
        sharpen:
          "Piksel, artı dört komşusundan ne kadar farklı olduğu. Ağırlıkların toplamı 1 olduğu için düz alanlar olduğu gibi kalır, kenarlar dikleşir.",
        vertical:
          "Sağ sütun eksi sol sütun. Parlaklığın soldan sağa değiştiği yerlere yanıt verir; karenin üst ve alt kenarlarında sessiz kalır.",
        horizontal:
          "Alt satır eksi üst satır: aynı dedektör çeyrek tur döndürülmüş hâli. Bu kez görmezden geldiği kenarlar sol ve sağ kenarlar.",
        outline:
          "Piksel, sekiz komşusunun hepsine karşı. Ağırlıkların toplamı 0 olduğu için düz olan her şey kaybolur, geriye yalnızca dış hatlar kalır.",
        custom:
          "Kendi çekirdeğiniz. Ağırlıkların toplamını izleyin: düz bir alan tam olarak bu sayıyla çarpılır.",
      },
      restore: "Resmi geri getir",
      pictureLabel: "Resim",
      caption:
        "Düz bir parçada pencerenin altındaki her piksel aynıdır; bu yüzden çıktı, o parlaklık çarpı ağırlıkların toplamıdır. Kenar dedektörlerinin toplamı sıfırdır: düz alanların kaybolmasının nedeni budur.",
      legend: { positive: "pozitif", negative: "negatif" },
      figures: {
        sum: "Ağırlık toplamı",
        sumHint: "düz bir alanın çarpıldığı sayı",
        range: "Çıktı aralığı",
      },
      announce: (total: string, min: string, max: string) =>
        `Ağırlıkların toplamı ${total}. Çıktı ${min} ile ${max} arasında.`,
    },

    // 3 ----------------------------------------------------------------------
    shift: {
      kicker: "Resmin her yerinde",
      title: "Şekli taşıyın. Yanıt onunla birlikte gelsin.",
      lede: "Bu çekirdek, aradığı şeklin kendisi: artının olduğu yerde artı bir, çevresinde eksi bir. Artıyı taşıyın ve çıktının en güçlü olduğu yere bakın.",
      input: "Resim",
      detector: "Çekirdek",
      output: "Çıktı",
      inputLabel: (x: number, y: number) =>
        `16'ya 16 bir resim: bir X, bir blok, bir çubuk ve merkezi sütun ${x}, satır ${y} olan bir artı. Ok tuşları artıyı taşır; tıklamak onu oraya koyar.`,
      outputNote: "Ne kadar parlaksa o kadar iyi eşleşiyor. Sıfır ve altı karanlık bırakıldı.",
      detectorLabel: "5'e 5 bir çekirdek: artı şeklinin üzerinde artı 1, geri kalan her yerde eksi 1.",
      outputLabel: (x: number, y: number, value: string) =>
        `Çıktı. En güçlü olduğu yer sütun ${x}, satır ${y}; değeri ${value}.`,
      keyboardHint: "Artıyı koymak için resme tıklayın ya da resmi seçip ok tuşlarını kullanın.",
      moveLabel: "Artıyı taşı",
      move: { left: "Sola taşı", up: "Yukarı taşı", down: "Aşağı taşı", right: "Sağa taşı" },
      caption:
        "Tam olarak artıyı içeren bir pencere 9 alır; bu, herhangi bir pencerenin alabileceği en yüksek değerdir. X, blok ve çubuk daha düşük alır. Her konumda aynı 25 ağırlık kullanıldığı için tepe noktası artıyı nereye giderse gitsin hücre hücre izler.",
      figures: {
        peak: "En güçlü",
        peakAt: (x: number, y: number) => `sütun ${x}, satır ${y}`,
        weights: "Kullanılan ağırlık",
        weightsHint: "256 konumun hepsinde ortak",
        dense: "Paylaşım olmasaydı",
        denseHint: "her piksel ve her çıktı hücresi için bir ağırlık",
      },
      announce: (x: number, y: number, value: string) =>
        `En güçlü yanıt ${value}, sütun ${x}, satır ${y}.`,
    },

    // 4 ----------------------------------------------------------------------
    size: {
      kicker: "Pencereleri saymak",
      title: "Çıktı ne kadar büyük?",
      lede: "Bunu dört sayı belirler: girdi, çekirdek, kenardaki dolgu ve pencerenin ne kadar sıçradığını söyleyen adım. Değiştirin ve sayın.",
      input: "Girdi ve dolgu",
      output: "Çıktı",
      inputLabel: (n: number, p: number) =>
        `${n} × ${n} hücrelik bir girdi ve çevresinde ${p} hücrelik sıfır dolgusu. Çerçeveli kare, seçilen çıktı hücresinin penceresidir.`,
      outputLabel: (o: number, x: number, y: number) =>
        `Çıktı, ${o} × ${o}. Sütun ${x}, satır ${y} seçili. Bir hücreye tıklayın ya da ok tuşlarını kullanın.`,
      noFit: "Çekirdek, dolgulu girdiden büyük: koyacak yer yok, dolayısıyla çıktı da yok.",
      leftover: (n: number) =>
        n === 1
          ? "Adım tam bölünmüyor: dolgulu girdinin son satırı ve sütunu hiçbir zaman pencerenin altına girmiyor."
          : `Adım tam bölünmüyor: dolgulu girdinin son ${n} satırı ve sütunu hiçbir zaman pencerenin altına girmiyor.`,
      caption:
        "Kesikli hücreler sıfır dolgusudur. Bir çıktı hücresine tıklayınca onu üreten pencereyi görürsünüz. Turuncuyla işaretli hücreler hiç okunmaz: formül aşağı yuvarlar, her framework de öyle.",
      labels: { n: "Girdi n", k: "Çekirdek k", p: "Dolgu p", s: "Adım s" },
      figures: {
        output: "Çıktı",
        windows: "Pencere",
        unreached: "Hiç okunmayan",
        unreachedHint: "dolgulu girdinin hücresi",
      },
      announce: (o: number) => `Çıktı ${o} × ${o}.`,
    },

    // 5 ----------------------------------------------------------------------
    depth: {
      kicker: "Katman üstüne katman",
      title: "Küçük pencereler üst üste binince uzağı görür.",
      lede: "Tek bir 3×3 katman yan yana üç hücre görür. Üstüne bir tane daha koyun; onun her hücresi, alttaki üç hücrenin gördüğünü görür. Tepeden bir hücre seçin ve aşağıya doğru izleyin.",
      inputName: "Girdi",
      layerName: (l: number) => `Katman ${l}`,
      diagramLabel: (count: number, chosen: number, top: number, size: number) =>
        `16 girdilik bir satırın üzerinde 3'e 3 çekirdekli ${count} katman. Tepedeki ${top} hücreden ${chosen}. hücre seçili; yan yana ${size} girdiye bağlı. Başka birini seçmek için sol ve sağ ok tuşlarını kullanın.`,
      edgeNote:
        "Bu hücrenin alanının bir kısmı resmin dışında, sıfır dolgusunun üzerinde kalıyor; bu yüzden yanan gerçek girdi sayısı alanın genişliğinden az.",
      layersLabel: "Katman",
      stridesLabel: "Her katmanın adımı",
      strideButton: (l: number, s: number) => `Katman ${l}: adım ${s}`,
      caption:
        "Her katman, tepenin görebildiği alana iki hücre ekler; bu iki hücre altındaki adımların çarpımıyla büyür. İki 3×3 katman 18 ağırlıkla 5×5 görür; tek bir 5×5 çekirdek 25 ağırlık isterdi. Derin ağların küçük çekirdeklerden kurulmasının nedeni tam olarak budur.",
      figures: {
        field: "Alıcı alan",
        fieldHint: "tepedeki tek bir hücrenin",
        weights: "Ağırlık",
        weightsHint: (count: number) => (count === 1 ? "tek bir 3×3 çekirdek" : `${count} tane 3×3 çekirdek`),
        single: "Tek çekirdekle",
        singleHint: (size: number) => `aynı uzağı görmek için ${size}×${size}`,
      },
      announce: (size: number) => `Alıcı alan ${size} × ${size}.`,
    },

    // 6 ----------------------------------------------------------------------
    learn: {
      kicker: "Kimse tasarlamıyor",
      title: "Çekirdeği ağırlıklar bulsun.",
      lede: "Bu resmin üzerinden gizli bir çekirdek zaten geçirildi; ağırlıklarını değil, yalnızca çıktısını görüyorsunuz. Dokuz rastgele sayıdan başlayın ve aradaki farkı gradient descent kapatsın.",
      input: "Resim",
      goal: "Hedef",
      current: "Şimdiki",
      inputLabel: "Bir disk, bir kare, eğik bir çubuk ve bir halkadan oluşan 24'e 24 dokulu bir resim.",
      goalLabel: "Gizli çekirdeğin resim üzerindeki çıktısı.",
      currentLabel: (lossValue: string) => `Şimdiki ağırlıkların çıktısı. Kayıp ${lossValue}.`,
      weightsLabel: "Ağırlıklar",
      weightsAria: (list: string) => `Şimdiki ağırlıklar, satır satır: ${list}.`,
      hiddenLabel: "Gizli",
      hiddenAria: (list: string) => `Gizli çekirdek, satır satır: ${list}.`,
      hiddenSecret: "Gizli çekirdek, henüz gösterilmedi.",
      curve: "Kayıp, log ölçek",
      curveLabel: "Her adımdan sonraki kayıp, logaritmik ölçekte.",
      found: (steps: number) =>
        `${steps} adımda buldu. Ağırlıklar artık gizli çekirdeğin kendisi: kenarın ne olduğunu onlara kimse söylemedi.`,
      ready: "Dokuz rastgele ağırlık. Eğit düğmesine basın ve hareket etmelerini izleyin.",
      searching: "Her adım, dokuz ağırlığın hepsini hatanın gradyanının tersine kaydırır.",
      train: "Eğit",
      pause: "Duraklat",
      resume: "Devam et",
      again: "Yeni rastgele başlangıç",
      targetLabel: "Gizli çekirdek",
      targets: { vertical: "Kenar dedektörü", blur: "Bulanıklaştır", outline: "Dış hat" },
      reveal: "Gizli çekirdeği şimdi göster",
      secondaryLabel: "Başka bir gizli çekirdek seçin",
      caption:
        "Hata, tek bir dibi olan bir çanaktır ve gizli çekirdek tam o diptedir; bu yüzden nereden başlarsa başlasın iniş onda biter. Ağların girdileriyle yaptığı gibi, önce resmin ortalama parlaklığı çıkarılır; bu, uyumun nerede biteceğini değil, ne kadar hızlı gideceğini değiştirir.",
      figures: { steps: "Adım", loss: "Kayıp" },
      announceDone: (steps: number) => `Gizli çekirdek ${steps} adımda bulundu.`,
    },

    // 7 ----------------------------------------------------------------------
    challenge: {
      kicker: "Sıra sizde",
      title: "Elle bulunacak üç çekirdek.",
      lede: "Her biri bir cevap değil, bir davranış istiyor. O davranışı gösteren her çekirdek geçer.",
      pickLabel: "Görev",
      yours: "Çıktınız",
      reset: "İlerlememi unut",
      solvedLabel: "Çözülen",
      caption:
        "Her karar, çekirdeğinizi gösterilen resimlerin üzerinden sayfanın geri kalanıyla aynı aritmetikle geçirir. Cevap anahtarı yok.",
      announce: (solved: number, total: number) => `${total} görevden ${solved} tanesi çözüldü.`,
      shift: {
        tab: "Kaydır",
        task: "Resmin tamamını bir hücre sağa kaydırın.",
        hint: "Çıktı aynı boyuta dolgulanıyor; yani her pikselin gidecek bir yeri var.",
        input: "Resim",
        goal: "Hedef",
        solved:
          "Çözüldü. Solda tek bir 1: her çıktı solundaki pikseli okur ve bu, resmi sağa taşır.",
        notYet: "Henüz değil: çıktınız hedefle eşleşmiyor.",
        mirrored:
          "Bu, resmi sola taşıdı. Bir evrişim katmanı çekirdeği ters çevirmeden, yazıldığı gibi yerleştirir; bu yüzden 1'in öbür tarafa gitmesi gerekiyor.",
      },
      flat: {
        tab: "Düz",
        task: "Düz olan her alanı 0 yapın ama karenin kenarına yine de yanıt verin.",
        hint: "Düz bir alanın neyle çarpıldığını düşünün.",
        input: "Resim",
        rules: {
          flatZero: "Pencerenin tek renk gördüğü her yerde 0",
          edgeSeen: "Kenarda bir yerde 0'dan farklı",
        },
        solved:
          "Çözüldü. Ağırlıklarınızın toplamı sıfır; bu yüzden düzlük birbirini götürür ve geriye yalnızca değişim kalır. Her kenar dedektörünün bu özelliği vardır.",
        notYet: "Henüz değil: iki koşula bakın.",
      },
      vertical: {
        tab: "Dikey",
        task: "Dikey bir çizgiye yanıt verin, yatay olana asla.",
        hint: "Dikey çizgide bir yerde 0'ın üstünde, yatay çizgide hiçbir yerde 0'ın üstünde değil.",
        vertical: "Dikey çizgi",
        horizontal: "Yatay çizgi",
        verticalOut: "Dikey çizgideki çıktınız.",
        horizontalOut: "Yatay çizgideki çıktınız.",
        rules: {
          fires: "Dikey çizgide bir yerde 0'ın üstünde",
          silent: "Yatay çizgide hiçbir yerde 0'ın üstünde değil",
        },
        solved:
          "Çözüldü. Çekirdeğinizin bir sütununun toplamı 0'dan büyük ve hiçbir satırın toplamı 0'dan büyük değil. Tek bir yönün dedektörü tam olarak budur.",
        notYet: "Henüz değil: iki koşula bakın.",
      },
    },

    recap: {
      lessons: [
        "Evrişim, küçük bir çekirdeği girdinin üzerinde kaydırır; her çıktı, altındaki piksellerin ağırlıklı toplamıdır",
        "Ne bulacağına ağırlıklar karar verir: aynı aritmetik bulanıklaştırır, keskinleştirir ya da kenarları ayıklar",
        "Düz bir parçada çıktı, parlaklık çarpı ağırlıkların toplamıdır; bu yüzden kenar dedektörlerinin toplamı sıfırdır",
        "Her konumda aynı ağırlıklar, bir desenin nerede olursa olsun ağırlıkların küçücük bir kısmıyla bulunması demektir",
        "Çıktı boyutu ⌊(n + 2p − k)/s⌋ + 1'dir: dolgu boyutu korur, adım küçültür",
        "Üst üste konmuş küçük çekirdekler uzağı görür: her katman alıcı alanı genişletir",
        "Çekirdekler elle tasarlanmaz: gradient descent onları örneklerden bulur",
      ],
      footer:
        "1989'da posta kodlarındaki el yazısını okuyan ağdan bugün fotoğrafları tanıyan modellere kadar evrişimli ağlar, tam olarak bu toplamın katmanlarıdır; yalnızca daha çok kanal ve çok daha fazla çekirdekle.",
    },
  },

  // ---------------------------------------------------- floating point ----
  "floating-point": {
    sources: {
      title: "Kaynaklar",
      ieee754:
        "Bu laboratuvarın hesap yaptığı ikili formatları (float64, float32 ve float16), özel değerlerini ve varsayılan yuvarlamayı tanımlar: en yakın değere, eşitlikte çift olana. Laboratuvarın aritmetiği bu kuralların kendi kesin uygulamasıdır ve tarayıcınınkiyle karşılaştırılarak doğrulanmıştır.",
      goldberg:
        "Çoğu ondalık sayının neden kesin bir ikili karşılığı olmadığını, bir float'ın hatasının neden büyüklüğüne oranla ölçüldüğünü ve kayan nokta toplamasının neden birleşme özelliği taşımadığını anlatan klasik çalışma.",
      ecma262:
        "Bir JavaScript sayısının nasıl yazdırılacağını tanımlar: aynı sayıya geri dönüşen en az basamakla (Number::toString, 5. adım). Konsolun saklanan değeri değil 0.30000000000000004 göstermesinin nedeni budur.",
      bfloat16:
        "float32'nin aralığını koruyan bfloat16'yı inceler ve derin öğrenme eğitiminin bu formatta, hiperparametreleri değiştirmeden float32 sonuçlarına ulaştığını bildirir; IEEE float16 ise ayar gerektirir.",
      mixedPrecision:
        "Ağırlıkları, aktivasyonları ve gradyanları float16 olarak saklayıp belleği neredeyse yarıya indirerek ağ eğitir; float16'nın dar aralığında kaybolan küçük gradyan değerlerini geri kazanmak için kaybı ölçeklendirir.",
    },

    invalid: "Bu laboratuvarın okuyabileceği bir sayı değil. 0.1, -2.5e-8, 1/3 ya da 0,1 deneyin.",
    showAll: (count: number) => `${count} basamağın hepsini göster`,
    showLess: "Yeniden katla",
    storedExactly: "Kesin olarak saklandı: hiçbir şey kaybolmadı.",
    kinds: {
      zero: "sıfır",
      subnormal: "alt normal",
      normal: "normal",
      infinity: "sonsuz",
      nan: "sayı değil",
    },

    // 1 ----------------------------------------------------------------------
    store: {
      title: "Gerçekte saklanan",
      question: "Bir sayı yazın. Bilgisayarınız gerçekte neyi saklıyor?",
      inputLabel: "Bir sayı",
      storedAs: "Saklanan değer",
      format: "float64, JavaScript'in tek sayı türü",
      prints: (shown: string) =>
        `Tarayıcınız bunu ${shown} olarak yazdırır: aynı saklanan değere geri dönüşen en kısa ondalık.`,
      tooBig: "64 bite sığmayacak kadar büyük. Infinity olarak saklanır.",
      tooSmall: "64 bitle gösterilemeyecek kadar küçük. 0 olarak saklanır.",
      infinity: "Infinity kendi başına bir değerdir ve kesin olarak saklanır.",
      notANumber: "NaN kendisi olarak saklanır: kendisine bile eşit olmayan tek değer.",
      another: "Başka bir tane göster",
      caption:
        "İşaretli basamaklar, saklanan değerin yazdığınızla uyuşmayı bıraktığı yerdir. Bu sayfadaki her saklanan değer kesin olarak gösterilir: laboratuvar float ile değil, tam sayılarla hesap yapar.",
      figures: {
        offBy: "Fark",
        relative: "Oransal fark",
        bits: "Bit",
        bitsHint: "büyük küçük her sayı için",
      },
      announce: (stored: string) => `${stored} olarak saklandı.`,
    },

    // 2 ----------------------------------------------------------------------
    sum: {
      kicker: "İkisini toplamak",
      title: "0.1 + 0.2 kaç eder?",
      lede: "Bakmadan önce karar verin. Sonra istediğiniz iki sayıyı girin ve toplamın tamamını kesin olarak görün.",
      question: "Tarayıcınız 0.1 + 0.2 için ne buluyor?",
      options: {
        exact: "Tam olarak 0.3",
        above: "0.3'ten biraz fazla",
        below: "0.3'ten biraz az",
      },
      yours: "Tahmininiz",
      actual: "Olan",
      agreed: "Bunu bekliyordunuz.",
      disagreed: "Neredeyse herkes tam olarak 0.3 bekler.",
      answer:
        "Biraz fazla: 0.30000000000000004. İki sayı da saklanırken biraz yukarı yuvarlandı ve toplamları, 0.3'ün aldığı değerin bir adım üstündeki saklanan değere yuvarlanıyor.",
      aLabel: "a",
      bLabel: "b",
      rows: {
        a: "a, saklandığı haliyle",
        b: "b, saklandığı haliyle",
        exact: "ikisinin kesin toplamı",
        sum: "a + b, float64'e yuvarlanmış",
        target: "gerçek sonuç, doğrudan saklanmış",
      },
      printsAs: (shown: string) => `${shown} olarak yazdırılır`,
      lineLabel: (steps: string) =>
        `Sonucun çevresindeki komşu float64 değerleri, ölçekli çizilmiş. ${steps}`,
      marks: {
        exact: "kesin toplam",
        truth: "gerçek sonuç",
        sum: "a + b",
        target: "saklanan sonuç",
      },
      same: "Aynı saklanan değer: burada toplam, sonucu doğrudan yazmışsınız gibi çıkıyor.",
      tie: "Kesin toplam iki float64 değerinin tam ortasına düşüyor. Eşitlikte kural, son biti 0 olana gitmektir; burada o da üstteki.",
      apart: (steps: string) =>
        `${steps} uzakta: toplam, sonucu doğrudan yazınca elde edilen sayı değil.`,
      steps: (n: string) => (n === "1" ? "Bir adım" : `${n} adım`),
      reset: "0.1 + 0.2'ye dön",
      caption:
        "Bir adım, iki komşu float64 değeri arasındaki boşluktur. Her girdi saklanırken bir kez yuvarlandı, toplam ise bir kez daha yuvarlanıyor.",
      figures: {
        sum: "a + b",
        equals: "a + b == sonuç",
        apart: "Uzaklık",
        yes: "true",
        no: "false",
        stepUnit: (n: string) => (n === "1" ? "1 adım" : `${n} adım`),
        stepSize: "Buradaki bir adım",
      },
      announce: (sum: string, equal: boolean) =>
        `a + b, ${sum}; doğrudan saklanan sonuca ${equal ? "eşit" : "eşit değil"}.`,
    },

    // 3 ----------------------------------------------------------------------
    bits: {
      kicker: "Bitlerin içi",
      title: "Bir biti çevirin, sayıyı izleyin.",
      lede: "Bu float32: float64 ile aynı tasarım, yarısı kadar bit, böylece hepsi sığıyor. Her kare bir bit. Herhangi birine tıklayın.",
      hint: "Önce soldan ikinci kareyi, sonra en sondakini deneyin.",
      groupLabel: "Bir float32'nin 32 biti, en anlamlıdan başlayarak",
      bitLabel: (position: number, field: string, value: number) =>
        `32 bitin ${position}. biti, ${field}, şu an ${value}`,
      fields: {
        sign: "işaret",
        exponent: "üs",
        fraction: "kesir",
      },
      fieldNotes: {
        sign: "0 artı, 1 eksi",
        exponent: "büyüklüğü belirler",
        fraction: "basamakları belirler",
      },
      named:
        "Üç alan. Üs, ikili noktanın yerini kaydırır; kesir, noktadan sonraki basamakları tutar. Tasarımın tamamı bu; float64 da aynısı, yalnızca 11 ve 52 bitle.",
      formula: "Okunuşu",
      setLabel: "Bitleri bir sayıdan ayarlayın",
      specials: {
        infinity: "Üs bitlerinin hepsi 1, kesir sıfır: bu desen Infinity demek.",
        nan: "Üs bitlerinin hepsi 1, kesir sıfır değil: bu desen NaN, yani sayı değil demek.",
        zero: "İşaretten sonraki her şey sıfır: bu sıfır. İşaret biti 1 ise −0 olur ve 0'a eşit sayılır.",
        subnormal:
          "Üs bitlerinin hepsi 0: gizli 1 ortadan kalkar ve sayı 0.kesir × 2⁻¹²⁶ olur. Bu alt normal değerler, sıfır ile en küçük normal sayı arasındaki boşluğu doldurur.",
      },
      caption: "Bir bit odaktayken ok tuşları satırda gezdirir, Boşluk tuşu biti çevirir.",
      figures: {
        value: "Değer",
        power: "Ölçek",
        powerHint: (field: number) => `üs alanı ${field} − 127`,
        kind: "Tür",
      },
      announce: (value: string, kind: string) => `Değer artık ${value}, ${kind}.`,
    },

    // 4 ----------------------------------------------------------------------
    ruler: {
      kicker: "Yazabildiği her değer",
      title: "Sayılar eşit aralıklı değil.",
      lede: "Gerçek bir format milyarlarca değer tutar, çizilemeyecek kadar çok. Bu, aynı tasarımın oyuncak boyutu; saklayabildiği her değer tek bir çizgiye sığıyor.",
      exponentBits: "Üs bitleri",
      fractionBits: "Kesir bitleri",
      controlsLabel: "Format",
      pick: "Bir değer seçin",
      pickValue: (value: string, n: number, total: number) => `${value}, ${total} değerin ${n}.'si`,
      lineLabel: (count: number, largest: string, perDoubling: number) =>
        `0 ile ${largest} arasında ${count} değer. Her iki katına çıkışta ${perDoubling} tane var, bu yüzden aralıklar her seferinde ikiye katlanıyor.`,
      legend: {
        normal: "normal değerler",
        subnormal: "alt normaller, 0'a kadar eşit aralıklı",
        picked: "seçilen değer",
      },
      caption:
        "Her iki katına çıkış aynı sayıda değer tutar, bu yüzden her biri bir öncekinin iki katı seyrek dağılır. Kesir biti ekleyince her aralık dolar; üs biti ekleyince çizgi daha uzağa uzanır.",
      figures: {
        values: "Değer sayısı",
        largest: "En büyük",
        gap: "Sonrakine boşluk",
        top: "yok: en büyüğü bu",
        perDoubling: "İki kata çıkışta",
      },
      announce: (value: string, gap: string) => `${value}, sonraki değer ${gap} yukarıda.`,
    },

    // 5 ----------------------------------------------------------------------
    gap: {
      kicker: "Yakınlaştırmak",
      title: "Büyük sayı, büyük boşluk.",
      lede: "Gerçek bir formata dönelim: float32. Sayının büyüklüğünü kaydırın ve saklayabildiği bir sonraki sayıya olan uzaklığa bakın.",
      slider: "Sayının büyüklüğü",
      sliderValue: (power: string) => `yaklaşık 2 üzeri ${power}`,
      inputLabel: "Ya da yazın",
      value: "Bu float32",
      next: "Bir sonraki",
      plusOne: "Bu sayı + 1",
      lost: "aynı sayı: + 1 kayboldu",
      kept: "farklı bir sayı",
      chartLabel: (gap: string) =>
        `Sonraki float32'ye olan boşluk ile sayının büyüklüğü, ikisi de logaritmik ölçekte: her ikinin kuvvetinde ikiye katlanan bir merdiven. Şu anki boşluk ${gap}.`,
      axes: {
        size: "sayının büyüklüğü",
        gap: "sonrakine boşluk",
      },
      wholeNumbers: "2²⁴'ten itibaren boşluk 2: tek tam sayılar artık saklanamıyor",
      caption:
        "Boşluk sayıyla birlikte büyür ama boşluk ÷ sayı neredeyse hiç değişmez: float32, sayı nerede olursa olsun yaklaşık 7 anlamlı ondalık basamak tutar. Kayan sözcüğünün anlamı budur.",
      figures: {
        gap: "Boşluk",
        relative: "Boşluk ÷ sayı",
        relativeHint: "her normal float32 için 2⁻²⁴ ile 2⁻²³ arasında",
        plusOne: "x + 1",
        lost: "kayboldu",
        kept: "korundu",
      },
      announce: (value: string, gap: string) => `${value}, sonrakine boşluk ${gap}.`,
    },

    // 6 ----------------------------------------------------------------------
    formats: {
      kicker: "Yapay zekâ için daha az bit",
      title: "Aralık mı, hassasiyet mi: birini seçin.",
      lede: "Bir yapay sinir ağı milyarlarca sayı saklar ve 16 bitlik bir sayı, 32 bitlik bir sayının yarısı kadar bellek kaplar. İki 16 bitlik format bitlerini farklı harcar: float16 daha çok kesir biti tutar, bfloat16 float32'nin üssünü korur.",
      examplesLabel: "Örnek değerler",
      examples: {
        weight: "Bir ağırlık",
        gradient: "Küçük bir gradyan",
        activation: "Büyük bir aktivasyon",
        third: "Üçte bir",
      },
      inputLabel: "Ya da bir sayı yazın",
      status: {
        exact: "kesin",
        rounded: (offBy: string) => `yuvarlandı, fark ${offBy}`,
        overflow: "çok büyük: Infinity olur",
        underflow: "çok küçük: 0 olur",
        special: "olduğu gibi saklanır",
      },
      layout: (exponent: number, fraction: number) =>
        `1 işaret, ${exponent} üs ve ${fraction} kesir biti`,
      table: {
        caption: "Her formatın tutabildikleri",
        format: "Format",
        bits: "Bit",
        largest: "En büyük",
        smallest: "0'dan büyük en küçük",
        digits: "Ondalık basamak",
      },
      bfloatNote:
        "bfloat16, IEEE 754'te yer almaz. float32 ile aynı yerleşime sahiptir, yalnızca kesir 23 bitten 7 bite kısaltılmıştır; laboratuvar ona da diğerleri gibi yuvarlar: en yakın değere, eşitlikte çift olana.",
      caption:
        "2 × 10⁻⁸ büyüklüğündeki bir gradyan bfloat16'da 2.0023 × 10⁻⁸ olarak yaşar, float16'da ise 0 olur, çünkü float16 yaklaşık 6 × 10⁻⁸'in altına inemez. bfloat16 ile eğitim bu tür değerleri ek bir düzenek olmadan korur; float16 ile eğitimde kaybolmasınlar diye kaybın büyütülmesi gerekir.",
    },

    // 7 ----------------------------------------------------------------------
    challenge: {
      kicker: "Sıra sizde",
      title: "Aritmetiğin olamaz dediği üç şey.",
      lede: "Her biri bu sayfadaki formatların gerçek bir özelliği. Sayfa cevabınızı baştan beri kullandığı kesin aritmetikle denetliyor.",
      pickLabel: "Bulmaca",
      solvedLabel: "Çözülen",
      reset: "Baştan başla",
      plusOne: {
        tab: "x + 1 = x",
        task: "float32'de x + 1'in x'e eşit olduğu bir x sayısı bulun.",
        hint: "Boşluğun 2'ye ulaştığı yere geri bakın.",
        xLabel: "x",
        stored: "float32'de x",
        result: "float32'de x + 1",
        solved: "Çözüldü: 1 eklemek hiçbir şeyi değiştirmedi.",
        notYet: "Henüz değil: x + 1 farklı bir sayı.",
        infinite: "Infinity + 1 yine Infinity, ama bu boşluklar hakkında bir şey söylemez. Sonlu bir x bulun.",
        best: (value: string) => `Bulduğunuz en küçük: ${value}`,
      },
      associative: {
        tab: "(a + b) + c",
        task: "(a + b) + c ile a + (b + c)'nin farklı çıktığı a, b ve c sayılarını bulun; JavaScript gibi float64'te.",
        hint: "Çok büyük bir sayıyı küçük bir sayıyla birleştirin.",
        left: "(a + b) + c",
        right: "a + (b + c)",
        solved: "Çözüldü: toplamaların sırası sonucu değiştirdi.",
        notYet: "Henüz değil: iki sıra da aynı sonucu veriyor.",
        notFinite: "Sonuçlardan biri sonlu bir sayı değil. NaN hiçbir şeye, kendisine bile eşit olmaz, bu yüzden sayılmaz: sonlu a, b ve c bulun.",
      },
      exact: {
        tab: "Kesin bir ondalık",
        task: "0 ile 1 arasında, noktadan sonra en fazla üç basamaklı ve float32'nin kesin olarak sakladığı bir sayı bulun. 0.5 sayılmaz.",
        hint: "İkili sistem hangi kesirleri kalansız yazabilir?",
        inputLabel: "Sayınız",
        rules: {
          range: "0 ile 1 arasında",
          places: "noktadan sonra en fazla üç basamak",
          notHalf: "0.5 değil",
          exact: "float32'de kesin olarak saklanıyor",
        },
        solved: "Çözüldü.",
        notYet: "Henüz değil: yukarıdaki kurallardan biri sağlanmıyor.",
        reveal:
          "Tam yedi tane var, 0.5 de içlerinde: 0.125, 0.25, 0.375, 0.5, 0.625, 0.75 ve 0.875. Hepsi sekizde birlerin tam katı, çünkü bir ondalık sayı ikili sistemde ancak en sade kesir halinde paydası ikinin bir kuvveti olduğunda kesindir.",
      },
      caption: "Çözülen bulmacalar bu tarayıcıda hatırlanır.",
      announce: (solved: number, total: number) => `${total} bulmacadan ${solved} tanesi çözüldü.`,
    },

    recap: {
      lessons: [
        "Bir float, sabit sayıda bitle yazabildiği en yakın sayıyı saklar ve 0.1 de dahil çoğu ondalık sayı bunlardan biri değildir",
        "Her aritmetik sonuç yeniden yuvarlanır, bu yüzden hatalar birikir ve işlemlerin sırası sonucu değiştirebilir",
        "Üs büyüklüğü, kesir basamakları belirler; bu yüzden komşular arasındaki boşluk sayıyla büyürken oransal hata hemen hemen aynı kalır",
        "Format seçmek aralık ile hassasiyet arasında seçim yapmaktır; modellerin float16 yerine bfloat16 ile eğitilmesinin nedeni budur",
      ],
      footer:
        "Kodda bu, hesaplanmış iki float'ın == ile değil bir tolerans payıyla karşılaştırılmasının, paranın tam kuruşlarla sayılmasının ve uzun bir toplamın farklı sırayla toplandığında farklı çıkabilmesinin nedenidir.",
    },
  },

  // ------------------------------------------------------- hash tables ----
  "hash-tables": {
    sources: {
      title: "Kaynaklar",
      peterson:
        "Kayıtları anahtarlarından hesaplanan bir adreste saklamayı ve depolama doldukça aramanın nasıl uzadığını inceleyen ilk çalışmalardan biri.",
      linearProbing:
        "Doğrusal yoklamayı kesin olarak çözümler ve Knuth'un maliyetlerini yeniden elde eder: saklanan bir anahtarı bulmak için ½(1 + 1/(1 − α)) yoklama, ıskalayan bir arama için, yani bir ekleme için, ½(1 + 1/(1 − α)²).",
      birthday:
        "Doğum günü problemini, aynı günü paylaşan ikiden fazla kişiye genelleştirir. İki kişi için klasik sonucu verir: 23 kişide ortak bir doğum günü olması, olmamasından daha olasıdır.",
      amortized:
        "Amortize çözümlemeyi ortaya koyar: bir işlemi, bütün bir dizi boyunca ortalama maliyetiyle değerlendirmek. İkiye katlamanın, ara sıra attığı büyük adıma rağmen eklemeyi sabit zamanlı yapması bu anlamdadır.",
      javaApi:
        "Bu laboratuvarın kullandığı hash'i, int aritmetiğinde s[0]·31^(n−1) + … + s[n−1] olarak, ve HashMap'in varsayılanlarını tanımlar: 16 kova, 0,75 doluluk oranı ve her yeniden hash'lemede yaklaşık iki katı kova.",
    },

    percent: (value: string) => `%${String(value).replace(".", ",")}`,

    // 1 ----------------------------------------------------------------------
    address: {
      title: "Hesaplanan bir adres",
      question: "Bir kelime yazın. Nereye gidiyor, onu tekrar nasıl buluyorsunuz?",
      inputLabel: "Bir anahtar",
      emptyWord: "Nereye düştüğünü görmek için herhangi bir kelime yazın.",
      workingCaption: "Hash, her seferinde bir karakter.",
      columns: { char: "Karakter", code: "Kod", hash: "Ara hash" },
      wrapped: "32 bite sarılır:",
      bucketLine: (hash: string, m: number) => `${hash} mod ${m} =`,
      tableLabel: (n: number) => `16 kovalı, ${n} anahtar tutan bir tablo.`,
      bucketName: (i: number, keys: string) => (keys ? `Kova ${i}: ${keys}` : `Kova ${i}: boş`),
      put: "Tabloya koy",
      already: "Zaten tabloda",
      reset: "Baştan başla",
      caption:
        "Hash, Java'nın metinler için kullandığı hash'tir: 31 ile çarp, sıradaki karakteri ekle, 32 biti tut. 16'ya bölümünden kalan, kovadır. Aynı kovaya düşen iki kelime orayı kısa bir liste olarak paylaşır.",
      announce: (word: string, bucket: number, present: boolean, looks: number) =>
        present
          ? `${word}, kova ${bucket} içinde; ${looks} karşılaştırmada bulundu.`
          : `${word}, kova ${bucket} içine ait. Henüz orada değil.`,
      figures: {
        bucket: "Kova",
        looks: "Karşılaştırma",
        found: "bulmak için",
        absent: "orada olmadığını bilmek için",
        list: "Düz bir listede",
        listHint: "karşılaştırma, kelime kelime bakarak",
      },
    },

    // 2 ----------------------------------------------------------------------
    birthday: {
      kicker: "Çakışmalar",
      title: "Aynı kovada iki anahtar, sandığınızdan çok daha erken.",
      lede: "Her kova eşit olasılıklı, hiçbir kova dolu değil, yine de bir çakışma erkenden gelir. Önce ne kadar erken olduğuna karar verin.",
      question:
        "Bir tabloda 365 kova var ve her anahtar rastgele birine düşüyor. Kaç anahtardan sonra iki anahtarın aynı kovayı paylaşması, paylaşmamasından daha olası olur?",
      answer:
        "23. Bu, doğum günü problemidir: 23 kişilik bir odada ortak bir doğum günü olması, olmamasından daha olasıdır; üstelik 340'tan fazla gün hâlâ kullanılmamışken.",
      guess: {
        yours: "Tahmininiz",
        actual: "Cevap",
        agreed: "Biliyordunuz.",
        disagreed: "Neredeyse herkes çok daha yüksek bir sayı tahmin eder.",
      },
      caption:
        "Eğri kesindir: n anahtarın hepsinin birbirini ıskalama olasılığı (1 − 1/m)(1 − 2/m)…(1 − (n−1)/m) çarpımıdır. Hızla düşer, çünkü her yeni anahtar orada olan her anahtarı ıskalamak zorundadır.",
      announce: (keys: number, chance: string) =>
        `${keys} anahtarla ortak bir kova olasılığı ${chance}.`,
      curveTitle: (m: number) => `Ortak kova olasılığı, ${m} kova`,
      curveLabel: (m: number, half: number) =>
        `${m} kova için, en az bir ortak kova olasılığının anahtar sayısına göre eğrisi. ${half} anahtarda yarıyı geçer.`,
      axis: "anahtar",
      gridTitle: (m: number) => `Tek bir deneme, ${m} kova`,
      gridLabel: (n: number, m: number) =>
        `${m} kovaya ilk ortak kovaya kadar atılan anahtarlar: ${n} anahtar gerekti.`,
      gridEmpty:
        "Bir denemeyi izlemek için anahtar atın: her biri rastgele bir kovaya düşer, ta ki biri başka birinin üstüne düşene kadar.",
      trialLine: (n: number, empty: number) =>
        `${n}. anahtar zaten kullanılmış bir kovaya düştü; ${empty} kova hâlâ boş.`,
      keysLabel: "Anahtar",
      throw: "Biri çakışana kadar anahtar at",
      sizeLabel: "Kova",
      secondaryLabel: "Kova sayısını değiştirin",
      figures: {
        chance: "Olasılık",
        chanceHint: (n: number) => `${n} anahtarla ortak kova`,
        even: "Eşit şans",
        evenHint: (m: number) => `anahtarda, ${m} kova için`,
        trials: "Denemeleriniz",
        trialsHint: (half: number) => `${half}. anahtara kadar çakıştı`,
      },
    },

    // 3 ----------------------------------------------------------------------
    probe: {
      kicker: "Açık adresleme",
      title: "Liste yok: yuvası dolu olan anahtar bir sağa geçer.",
      lede: "32 yuvalı tek bir dizi. Her anahtarın bir ev yuvası var; o doluysa bir sonrakini, sonra bir sonrakini dener, ta ki boş bir yuva bulana kadar. Anahtar ekleyin ve yürüyüşlerin uzamasını izleyin.",
      caption:
        "Her dolu yuva, anahtarının istediği evi gösterir. Turuncu çerçeve, en yeni anahtarın denediği her yuvadır. Dolu yuva dizileri birleşerek büyür ve bir diziye düşen her anahtar sonuna kadar yürüyüp onu daha da uzatır.",
      announce: (count: number, home: number, slot: number, probes: number) =>
        `${count}. anahtar yuva ${home} istedi, ${probes} yoklamada yuva ${slot} içine yerleşti.`,
      tableLabel: (count: number, m: number) => `${m} yuvalı, ${count} anahtar tutan bir tablo.`,
      slotFull: (slot: number, home: number) => `Yuva ${slot}: evi ${home} olan bir anahtar`,
      slotEmpty: (slot: number) => `Yuva ${slot}: boş`,
      pathLine: (home: number, slot: number, probes: number) =>
        probes === 1
          ? `En yeni anahtar doğrudan evine, yuva ${home} içine girdi.`
          : `En yeni anahtar yuva ${home} istedi, dolu buldu ve yuva ${slot} konumuna kadar yürüdü: ${probes} yoklama.`,
      emptyLine: "Boş bir tablo. Bir anahtar ekleyin.",
      clusterLine: (lengths: string) => `Dolu yuva dizileri: ${lengths}.`,
      noClusters: "Henüz dizi yok.",
      add: "Anahtar ekle",
      full: "Tablo dolu",
      addFour: "4 ekle",
      restart: "Boşalt, yeni evlerle",
      secondaryLabel: "Yeniden başla",
      figures: {
        load: "Dolu",
        loadHint: (alpha: string) => `doluluk oranı α = ${String(alpha).replace(".", ",")}`,
        last: "Son ekleme",
        lastHint: "yoklama",
        mean: "Bir anahtarı bulmak",
        meanHint: "yoklama, ortalama",
        longest: "En uzun dizi",
      },
    },

    // 4 ----------------------------------------------------------------------
    compare: {
      kicker: "Listeye karşı adım",
      title: "İkisi de hızlıdır, tablo neredeyse dolana kadar.",
      lede: "Doluluk oranı α büyüdükçe, zincirleme ve doğrusal yoklama için saklanan bir anahtarı bulmanın maliyeti. Çizgiler formüllerdir; noktalar 1.024 yuvalı gerçek tablolardır.",
      caption:
        "Zincirlemenin maliyeti 1 + α/2'dir: düz bir çizgide kötüleşir, hatta α = 1'in ötesine de geçebilir. Doğrusal yoklamanınki ½(1 + 1/(1 − α)) olur; yarı doluyken iyidir, dolmaya yakın patlar. Eklemek daha da kötüdür, ½(1 + 1/(1 − α)²), ve α = 0,8'e varmadan grafiğin dışına çıkar.",
      announce: (alpha: string, chain: string, linear: string) =>
        `${String(alpha).replace(".", ",")} doluluğunda zincirleme ortalama ${String(chain).replace(".", ",")}, doğrusal yoklama ${String(linear).replace(".", ",")} karşılaştırma ister.`,
      chartLabel:
        "Bir anahtarı bulmak için ortalama yoklamanın doluluk oranına göre grafiği: zincirleme için düz bir çizgi, doğrusal yoklama için 1'e yaklaşırken dikleşen bir eğri ve ona ekleme için daha dik, kesikli bir eğri. Noktalar rastgele tablolarda ölçülmüştür.",
      axis: "doluluk oranı α",
      legend: {
        chain: "Zincirleme, bulma",
        linear: "Doğrusal yoklama, bulma",
        insert: "Doğrusal yoklama, ekleme",
        dots: "ölçülen",
      },
      loadLabel: "Doluluk oranı α",
      again: "Yeni tablolarda ölç",
      secondaryLabel: "Yeniden ölç",
      figures: {
        chain: "Zincirleme",
        linear: "Doğrusal yoklama",
        insert: "Ekleme",
        insertHint: "yoklama, doğrusal yoklamada",
      },
    },

    // 5 ----------------------------------------------------------------------
    resize: {
      kicker: "Hızlı kalmak",
      title: "Dolunca iki katı büyüklükte bir tabloya taşının.",
      lede: "Java'nın HashMap'i 16 kovayla başlar ve dörtte üçü dolduğunda her anahtarı kopyalayarak iki katına çıkar. Her taşınma pahalıdır. Anahtar ekleyin ve bunun ortalamada neye mal olduğunu görün.",
      caption:
        "Her çubuk, tek bir eklemenin yaptığı iştir: anahtar için 1, bir taşınmayı tetiklediyse kopyalanan her anahtar için de birer. Taşınmalar büyür ama aynı hızla seyrekleşir; bu yüzden ortalama 3'ün altında kalır: kopyalar toplamı her zaman anahtar sayısının iki katından azdır.",
      announce: (n: number, capacity: number, average: string) =>
        `${capacity} kovada ${n} anahtar. Ekleme başına ortalama iş ${String(average).replace(".", ",")}.`,
      chartLabel: (n: number, resizes: number, average: string) =>
        `${n} anahtar için ekleme başına iş: çoğunlukla 1, tablonun iki katına çıktığı yerlerde ${resizes} yüksek sıçrama. Ortalama ${String(average).replace(".", ",")}.`,
      averageTitle: "Şimdiye kadar ekleme başına ortalama iş",
      averageLabel: (average: string) =>
        `Ekleme başına işin yürüyen ortalaması, 3'teki kesikli çizginin altında kalıyor. Şu an ${String(average).replace(".", ",")}.`,
      axis: "eklenen anahtar",
      legend: {
        insert: "sıradan bir ekleme",
        resize: "tabloyu taşıyan bir ekleme",
        average: "şimdiye kadarki ortalama",
      },
      keysLabel: "Eklenen anahtar",
      figures: {
        capacity: "Kova",
        capacityHint: (threshold: number) => `${threshold} anahtarı geçince yine taşınır`,
        resizes: "Taşınma",
        average: "Ortalama iş",
        averageHint: "ekleme başına, her zaman 3'ün altında",
      },
    },

    // 6 ----------------------------------------------------------------------
    modulus: {
      kicker: "Kötü anahtarlar",
      title: "Eşit aralıklı anahtarlar yalnızca birkaç kovaya ulaşabilir.",
      lede: "Sekizer artan kimlikler, onar artan fiyatlar, 64'e hizalı adresler: anahtarlar çoğu zaman bir adımı paylaşır. Bir tablo boyutu ve bir adım seçin, kaç kovaya ulaştıklarını görün.",
      caption:
        "0, s, 2s, … anahtarları, başka her şey ne olursa olsun tam olarak m / ebob(s, m) kovaya ulaşır. İkinin bir kuvveti ile çift bir adım en kötü durumdur; bir asal sayının paylaşacak çarpanı yoktur. HashMap ikinin kuvvetlerini kullanır; kova seçmeden önce hash'in yüksek bitlerini düşük bitlerine karıştırmasının nedeni budur.",
      announce: (used: number, m: number, most: number) =>
        `Anahtarlar ${m} kovanın ${used} tanesine ulaşıyor; en dolu kovada ${most} anahtar var.`,
      keysLine: (step: number, keys: number) =>
        `${keys} anahtar: 0, ${step}, ${2 * step}, ${3 * step}, …`,
      chartLabel: (m: number, used: number, most: number) =>
        `${m} kovada kova başına anahtar sayısı. ${used} kova kullanılıyor, en dolusunda ${most} anahtar var.`,
      axis: "kova",
      mLabel: "Kova m",
      stepLabel: "Adım s",
      figures: {
        used: "Kullanılan kova",
        most: "En dolu kova",
        mostHint: (even: string) => `anahtar; eşit dağılsa ${String(even).replace(".", ",")}`,
      },
    },

    // 7 ----------------------------------------------------------------------
    challenge: {
      kicker: "Sıra sizde",
      title: "Bir hash tablosuna yaptırılacak üç şey.",
      lede: "Her biri bir cevap değil, bir özellik istiyor. O özelliği taşıyan her şey geçer.",
      caption:
        "Her karar, sayfanın geri kalanıyla aynı hash ve aynı tablolarla hesaplanır. Cevap anahtarı yok.",
      announce: (solved: number, total: number) => `${total} görevden ${solved} tanesi çözüldü.`,
      pickLabel: "Görev",
      reset: "İlerlememi unut",
      solvedLabel: "Çözülen",
      collide: {
        tab: "Çakıştır",
        task: "Java hash'i tam olarak aynı olan iki farklı metin bulun.",
        hint: "İki karakter yeter. Her adım 31 ile çarpar: ilk karakter bir artar, ikincisi 31 azalırsa ne olur?",
        first: "Birinci metin",
        second: "İkinci metin",
        hashOf: (hash: string) => `hash ${hash}`,
        sameString: "Bunlar aynı metin. İki farklı metin olmalı.",
        solved:
          "Çözüldü. İki farklı anahtar, tek bir hash: hiçbir tablo onları ayırt edemez ve uzun metinleri 32 bite indiren hiçbir hash bundan kaçınamaz.",
        notYetPlain: "Henüz değil: iki hash farklı.",
      },
      size: {
        tab: "Boyut",
        task: "Bu 16 anahtar onar artıyor: 0, 10, 20, …, 150. Her birini kendi kovasına koyan, 16 ile 32 arasında bir tablo boyutu seçin.",
        hint: "10 aralıklı anahtarlar m / ebob(10, m) kovaya ulaşır. Bunun en az 16 olması gerekiyor.",
        label: "Tablo boyutu m",
        range: "16 ile 32 arasında bir tam sayı.",
        chartLabel: (distinct: number) => `Her anahtar ve kovası: ${distinct} farklı kova.`,
        notYet: (distinct: number, total: number) =>
          `Henüz değil: ${total} anahtar yalnızca ${distinct} kovaya ulaşıyor.`,
        solved:
          "Çözüldü. On altı anahtar, on altı kova: m / ebob(10, m) en az 16, yani kovalar tekrar etmeye başlamadan anahtarlar bitiyor.",
        notYetPlain: "Henüz değil.",
      },
      perfect: {
        tab: "Kusursuz",
        task: "8 kovalı bir tablonun sekiz kovasının her birine bir tane düşecek sekiz farklı kelime seçin.",
        hint: "Her kelime kovasını gösteriyor. Çakışanları, her kova bir kez kullanılana kadar değiştirin.",
        word: (i: number) => `Kelime ${i}`,
        bucket: (b: number, clash: boolean) => (clash ? `kova ${b}, paylaşılıyor` : `kova ${b}`),
        rules: {
          filled: "Sekiz kelime",
          unique: "Hepsi farklı",
          spread: "Her kovada bir kelime",
        },
        solved:
          "Çözüldü. Kusursuz bir yerleşim: hiç çakışma yok. Şans bunu bin denemede yaklaşık iki kez başarır; tabloların boşluk bırakmasının nedeni budur.",
        notYetPlain: "Henüz değil: üç koşula bakın.",
      },
    },

    recap: {
      lessons: [
        "Bir hash tablosu, anahtarın adresini aramak yerine hesaplar",
        "Çakışmalar erken gelir: 365 kovada 23 anahtar, bir çakışmayı olmamasından daha olası yapar",
        "Zincirleme her kovada bir liste tutar; bir anahtarı bulmak yaklaşık 1 + α/2 karşılaştırmadır",
        "Doğrusal yoklama bir sonraki boş yuvaya geçer; dolu yuva dizileri birleşerek büyür",
        "Dolmaya yakın yoklama patlar: bulmak için ½(1 + 1/(1 − α)), eklemek için ½(1 + 1/(1 − α)²)",
        "Tablo dolunca iki katına çıkmak, eklemeyi ortalamada sabit tutar",
        "Tablo boyutuyla bir adımı paylaşan anahtarlar m / ebob(s, m) kovaya sıkışır",
      ],
      footer:
        "Python'un dict'leri, JavaScript'in Map ve Set'i, Java'nın HashMap'i: hepsinin altında bu dizi, bu kalan ve bu doluluk oranı vardır.",
    },
  },

  // --------------------------------------------- cryptographic hashing ----
  "cryptographic-hashing": {
    sources: {
      title: "Kaynaklar",
      sha2: "Bu laboratuvar\u0131n taray\u0131c\u0131n\u0131n Web Crypto uygulamas\u0131ndan istedi\u011fi SHA-256 \u00f6zetini tan\u0131mlar. Laboratuvar \u00f6zet i\u015flevini kendisi uygulamaz.",
    },
    inputLabel: "Mesajınız",
    inputPlaceholder: "merhaba dünya",
    copy: "Kopyala",
    copied: "Kopyalandı",
    copyHash: "Özeti kopyala",
    hashCopied: "Özet kopyalandı",

    unavailable: {
      title: "Bu laboratuvar burada çalışamıyor.",
      insecureContext:
        "Bu laboratuvarın tarayıcınızda özet hesaplayabilmesi için güvenli bir bağlantı (HTTPS) gerekiyor. Sayfayı https:// ile açmak sorunu çözecektir.",
      unsupported:
        "Tarayıcınız yerleşik özetleme özelliğini (Web Crypto) kullanıma sunmadı, bu yüzden gösterilecek bir özet yok. Bir ayar ya da bir eklenti bunu kapatmış olabilir.",
      note: "Burada hiçbir şey taklit edilmiyor: tarayıcının gerçek SHA-256'sı olmadan dürüstçe gösterilebilecek bir şey yok.",
    },

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
        "Ne isterseniz yazın. Mesaj ne kadar uzun olursa olsun tam 64 hex karakter geri döner, ve mesajın kendisi bunların içinde yoktur.",
      help: "Bir mesaj yazın. SHA-256 özeti alanın altında görünür ve siz yazdıkça güncellenir.",
      announce: (start: string) => `Özet güncellendi, artık ${start} ile başlıyor.`,
    },

    determinism: {
      kicker: "Aynı mesaj, aynı özet",
      title: "Her seferinde aynı yanıtı veriyor.",
      lede: "Mesajı yeniden hash'leyin. Hiçbir şey önbelleğe alınmıyor ve önceki çalıştırmadan kopyalanmıyor: her basış, aynı metin üzerinde yeni bir SHA-256 çağrısı.",
      hashAgain: "Yeniden hash'le",
      enough: "Bu kadar çalıştırma yeter",
      empty: "Henüz çalıştırma yok. Bu mesajı hash'lemek için düğmeye basın.",
      run: (n: number) => `${n}. çalıştırma`,
      runsLabel: "Çalıştırma",
      distinctLabel: "Farklı özet",
      distinctHint: "kaç kez çalıştırılırsa çalıştırılsın",
      caption:
        "Mesajı değiştirmek listeyi temizler, çünkü eski mesajın çalıştırması yenisi hakkında bir şey söylemez.",
      announce: (runs: number, distinct: number) => `${runs} çalıştırma, ${distinct} farklı özet.`,
    },

    avalanche: {
      kicker: "Tek küçük değişiklik",
      title: "Tek bir tuş her şeyi yeniden yazıyor.",
      lede: "Tek bir karakteri değiştirin ve iki özeti karşılaştırın. Farklı olan her karakter ikisinde de işaretlenir: gidende üstü çizili, yerine gelende altı çizili.",
      before: "Önce",
      after: "Sonra",
      fieldLabel: "Bir karakteri değiştirin",
      help: "Mesajı düzenleyin. Düzenlemeden önceki ve sonraki özetler yukarıda karakter karakter karşılaştırılır.",
      editPrompt: "İki özeti karşılaştırmak için mesajdaki bir karakteri değiştirin.",
      caption:
        "Sayım, iki gerçek özet üzerinde bit bit ölçülüyor: tahmin edilmiyor ve bir sayıya doğru canlandırılmıyor.",
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
      lede: "Özetin tamamı değil: ilk karakterinden başlayın. Her tur bir karakter daha istiyor ve her tur bir öncekinden on altı kat daha düşük olasılıklı. Bu eğri, çakışma direncinin kalbi; ve bunu dürüstçe hissetmenin tek yolu bu: burada bir çakışma bulunmuyor, uydurulmuyor da.",
      inputA: "Mesaj A",
      inputB: "Mesaj B",
      identical:
        "İki mesaj da aynı, dolayısıyla özetler tanım gereği eşleşiyor. Çakışma için iki farklı mesaj gerekir.",
      target: (round: number, odds: string) =>
        `${round}. tur: ilk ${round} hex karakteri paylaşsınlar. Deneme başına olasılık: ${odds}'de 1.`,
      nextRound: (round: number) => `${round}. tur, on altı kat zor`,
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
        "64 karakterin tamamının rastlantıyla eşleşmesi 2^256'da 1. Doğum günü kısayolu bile yaklaşık 2^128 hash gerektirir: saniyede bir trilyon hash'lense, kabaca 10^19 yıl.",
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
          body: "Git her commit'i, içeriğini ve ebeveyninin hash'ini hash'leyerek tanımlar. Geçmişteki bir satırı değiştirin, sonraki bütün hash'ler değişir, kurcalama görünür olur.",
        },
        passwords: {
          label: "Parolalar",
          body: "Sunucular parolanın kendisini değil, tuzlanmış parola hash'ini saklar; böylece sızan bir veritabanı parolaları değil hash'leri barındırır. Ama kullanılan fonksiyon SHA-256 değildir: parola saklamada Argon2id, scrypt, bcrypt ya da PBKDF2 gibi kasıtlı olarak yavaş bir hash kullanılır, böylece deneme yapmak pahalı kalır.",
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
        "Tek bir karakteri değiştirmek 256 bitin yaklaşık yarısını değiştirir: çığ etkisi, burada iddia edilmiyor ölçülüyor",
        "İki özetin paylaştığı her ek hex karakter on altı kat daha düşük olasılıklıdır; 64'ünün birden eşleşmesinin erişilemez olmasının nedeni budur",
      ],
      footer:
        'Bu sayfadaki hiçbir şey saklanmıyor ya da taklit edilmiyor: her özet, yazdığınız metin üzerinde tarayıcınızda çalışan crypto.subtle.digest("SHA-256", …) çağrısının sonucu.',
    },
  },

  // -------------------------------------------- multilayer perceptrons ----
  "multilayer-perceptrons": {
    sources: {
      title: "Kaynaklar",
      backpropagation:
        "Bu laboratuvar\u0131n e\u011fitimde kulland\u0131\u011f\u0131 geri yay\u0131l\u0131m y\u00f6ntemini destekler. Buradaki a\u011f, makalede anlat\u0131lan a\u011f de\u011fil, k\u00fc\u00e7\u00fck bir \u00f6\u011fretim modelidir.",
    },
    question: "Tek bir katman asl\u0131nda neyi de\u011fi\u015ftiriyor?",
    diagram: {
      diagramLabel: (shape: string) =>
        `A\u011f \u015femas\u0131: ${shape} n\u00f6ron. Her d\u00fc\u011f\u00fcm, o n\u00f6ronun girdi karesi boyunca neye tepki verdi\u011fini g\u00f6sterir.`,
      neuron: (label: string) => `${label} n\u00f6ronu`,
      layers: {
        input: "Girdi",
        output: "Çıktı",
        hidden: (layer: number) => `Gizli ${layer}`,
        hiddenShort: (layer: number) => `G${layer}`,
      },
      inputNode: "girdi",
      bias: "bias",
      eachSquare: "Her kare, bir n\u00f6ronun girdiye kendi bak\u0131\u015f\u0131.",
      pushesUp: "yukar\u0131 iter",
      pushesDown: "a\u015fa\u011f\u0131 iter",
      thickness: "kal\u0131nl\u0131k g\u00fcc\u00fc g\u00f6sterir",
    },
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
    keyboardHint: {
      trainPause: "eğitir veya duraklatır ·",
      restart: "ağırlıkları sıfırlayıp yeniden başlatır",
    },
    layersCaption: {
      solved:
        "Düz ağ yazı tura düzeyinde takılı kaldı: hiçbir doğru bu dört köşeyi ayıramaz. Gizli katman sınırı büker ve problem ortadan kalkar.",
      idle: "İkisini yan yana çalıştırın ve soldakinin nerede pes ettiğini izleyin.",
    },
    layersPanels: {
      flat: {
        title: "Gizli katman yok",
        subtitle: "İki girdi doğrudan çıktıya bağlı: tek bir nöron.",
      },
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
      dragHint: "Çizgiyi taşımak için karenin üzerinde sürükleyin; döndürmek ve kenarını keskinleştirmek için mavi ucu sürükleyin.",
      slideHandle: "Çizginin konumu. Ok tuşları onu okunun yönünde kaydırır.",
      turnHandle: "Okun ucu: iki ağırlık. Sol ve sağ döndürür, yukarı ve aşağı keskinleştirir ya da yumuşatır.",
      weightsAndBias: "A\u011f\u0131rl\u0131klar ve bias",
      caption:
        "Yapamad\u0131\u011f\u0131n\u0131z \u015feye dikkat edin: çizgiyi nasıl hareket ettirirseniz ettirin s\u0131n\u0131r d\u00fcz bir \u00e7izgi olarak kal\u0131yor. Tek bir n\u00f6ronun b\u00fct\u00fcn s\u0131n\u0131r\u0131 bu, ve bir sonraki b\u00f6l\u00fcm\u00fcn var olma nedeni de bu.",
      notes: {
        tanh: "\u22121\u20261 aral\u0131\u011f\u0131na s\u0131k\u0131\u015ft\u0131r\u0131r. Yumu\u015fak, simetrik, g\u00fcvenli bir varsay\u0131lan.",
        relu: "Pozitifleri ge\u00e7irir, negatifleri d\u00fczler. H\u0131zl\u0131 ve modern varsay\u0131lan.",
        sigmoid:
          "0\u20261 aral\u0131\u011f\u0131na s\u0131k\u0131\u015ft\u0131r\u0131r. Tarihsel ve tak\u0131lmaya yatk\u0131n.",
      },
      kicker: "Sonuna kadar yakınlaşın",
      title: "Bir nöron sandığınızdan küçüktür.",
      lede: "Belleği yok, mantığı yok, hiçbir marifeti yok. Üç sayı ve bir ezme işlemi: bütün alanın üzerine kurulduğu birim bundan ibaret.",
      weight1: "x₁ ağırlığı",
      weight2: "x₂ ağırlığı",
      bias: "Bias",
      activation: "Aktivasyon",
      note: "Şuna dikkat edin: çizgiyi nasıl hareket ettirirseniz ettirin, sınır yine düz bir çizgi olarak kalır. Tek bir nöronun sınırı budur ve bir sonraki bölümün var olma nedeni de tam olarak bu.",
      canvasLabel: "Tek bir nöronun girdi düzlemi üzerindeki çıktısı.",
      activations: {
        tanh: "−1…1 aralığına ezer. Düzgün, simetrik, güvenli bir başlangıç.",
        relu: "Pozitifleri geçirir, negatifleri düzler. Hızlı ve günümüzün varsayılanı.",
        sigmoid: "0…1 aralığına ezer. Tarihsel bir seçim; öğrenmeyi tıkamaya eğilimli.",
      },
    },

    handXor: {
      caption:
        "Her nokta, düştüğü taraf yüzünden doğru ya da yanlış; halkalı olanlar yanlış. Hangi tarafın hangi sınıf olduğu, hangisi daha çok tutturuyorsa o yönde sizin için seçiliyor.",
      announce: (accuracy: string) => `Noktaların ${accuracy} kadarı doğru tarafta.`,
      canvasLabel: (lines: number, accuracy: string) =>
        `Sürükleyebileceğiniz ${lines === 1 ? "tek bir çizgiyle" : "iki çizgiyle"} XOR noktaları. ${accuracy} kadarı doğru tarafta.`,
      slideHandle: (i: number) => `Çizgi ${i}: konumu. Ok tuşları onu kaydırır.`,
      turnHandle: (i: number) => `Çizgi ${i}: okun ucu, iki ağırlığı. Ok tuşları döndürür ve keskinleştirir.`,
      modeLabel: "Yerleştirdiğiniz nöronlar",
      modes: { one: "Tek çizgi", two: "İki çizgi" },
      oneHint: "Çizgiyi sürükleyin, ucundan tutup döndürün. Her noktayı kendi tarafına almaya çalışın.",
      ceilingReached: (ceiling: string) =>
        `Tek bir çizginin ulaşabileceği en iyisi bu: ${ceiling}. Bu karede hiçbir çizgi daha iyisini yapamaz. Tek bir nöronun çarptığı duvar budur.`,
      twoHint: "Şimdi iki nöron ve yalnızca iki okun da gösterdiği yerde evet diyen bir çıktı. Karşılıklı iki köşeyi içine alan bir bant oluşturun.",
      twoBeaten: (ceiling: string) =>
        `Tek bir çizginin en fazla ulaşabildiği ${ceiling} değerini geçtiniz. İki gizli nöron ve bir çıktı: elle bir gizli katman kurdunuz.`,
      figures: {
        accuracy: "Doğru tarafta",
        best: "En iyiniz, tek çizgi",
        bestHint: "bu ziyarette",
        ceiling: "Bir çizginin en iyisi",
        ceilingHint: "her açı taranarak bulundu",
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
        `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n: olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
      solvedNote:
        "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
      noBest:
        "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
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

  // ------------------------------------------------------ graph search ----
  "graph-search": {
    sources: {
      title: "Kaynaklar",
      astar:
        "Laboratuvarda \u00e7al\u0131\u015fan A* kurgusunu destekler: \u015fimdiye kadarki maliyet ile sezgisel tahminin toplam\u0131na g\u00f6re s\u0131ralanan en-iyi-\u00f6nce arama ve bu sezgiselin sa\u011flamas\u0131 gereken kabul edilebilirlik ko\u015fulu.",
      dijkstra:
        "Sezgisel kapat\u0131ld\u0131\u011f\u0131nda laboratuvar\u0131n \u00e7al\u0131\u015ft\u0131rd\u0131\u011f\u0131 en k\u0131sa yol y\u00f6ntemini ve bu y\u00f6ntemin varsayd\u0131\u011f\u0131 negatif olmayan kenar maliyetlerini destekler.",
    },
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
      toMove:
        "işaretlerini sürükleyerek taşıyın. Izgara odaktayken yön tuşları imleci hareket ettirir,",
      toggles: "bir hücreyi değiştirir,",
      drops: "ise işaret bırakır.",
    },
    gridSummary: (
      cols: number,
      rows: number,
      start: string,
      goal: string,
      walls: number,
      mud: number,
      algorithm: string,
      result: string,
    ) =>
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
      lede: "Dijkstra hedefin nerede olduğunu bilmez, bu yüzden her yöne eşit yayılır. A* ise kalan uzaklık için bir tahmin ekler ve onu izler: f = g + h; burada g şu ana kadarki maliyet, h ise sezgisel, yani kalan mesafenin tahminidir.",
      caption:
        "Aynı yol, aynı maliyet. İncelenen sayısına bakın. Buradaki sezgisel fonksiyon Manhattan uzaklığı. Dört yönlü bir ızgarada kalan mesafeyi asla olduğundan fazla gösteremez, yani kabul edilebilir; A*'ın ona güvenerek hiçbir şeyden ödün vermemesinin nedeni de tam olarak budur.",
    },
    challenge: {
      kicker: "Görev",
      title: "Aynı cevap, daha az iş.",
      lede: "Üç sabit harita. Her biri hem en ucuz yolu hem de bütçeden fazla hücre kesinleştirmeyen bir arama istiyor. Bunlardan biri tek başına kolay; asıl mesele ikisini birden sağlamak.",
      mazeLabel: (
        title: string,
        cols: number,
        rows: number,
        cost: number,
        budget: number,
        algorithm: string,
      ) =>
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
    sources: {
      title: "Kaynaklar",
      statisticalInference:
        "\u0130ki \u00e7ocuk deneyinin arkas\u0131ndaki ko\u015fullu olas\u0131l\u0131k kurallar\u0131n\u0131 (ko\u015fullu olas\u0131l\u0131k, s. 20; problemin kendisi Al\u0131\u015ft\u0131rma 1.25, s. 40), Pascal sat\u0131r\u0131n\u0131n arkas\u0131ndaki binom katsay\u0131lar\u0131n\u0131 (s. 15) ve b\u00fcy\u00fck say\u0131lar kanununu (zay\u0131f, s. 232; g\u00fc\u00e7l\u00fc, s. 235) destekler. Buradaki benzetimler bu sonu\u00e7lar\u0131 g\u00f6sterir; onlar\u0131 temellendirmez.",
      simpson:
        "D\u00f6rd\u00fcnc\u00fc deneyin g\u00f6sterdi\u011fi tersine d\u00f6nmeyi destekler: her alt grupta ge\u00e7erli olan bir ili\u015fkinin, alt gruplar birle\u015ftirildi\u011finde y\u00f6n de\u011fi\u015ftirmesi.",
    },

    scope:
      "D\u00f6rt \u00e7\u00f6z\u00fcml\u00fc problem; olas\u0131l\u0131\u011f\u0131n geneline bir bak\u0131\u015f de\u011fil. Her biri belirtilmi\u015f bir model kullan\u0131r (iki kurala ba\u011fl\u0131 bir sunucu, e\u015fit olas\u0131l\u0131kl\u0131 365 do\u011fum g\u00fcn\u00fc, her biri ba\u011f\u0131ms\u0131z olarak erkek ya da k\u0131z olan iki \u00e7ocuk, yay\u0131mlanm\u0131\u015f tek bir klinik tablo) ve cevaplar bu modellere aittir. Bir say\u0131 sim\u00fclasyondan geliyorsa sim\u00fclasyon olarak etiketlenir: bir deneyi \u00e7ok kez \u00e7al\u0131\u015ft\u0131rmak bir sonucu g\u00f6sterir, kan\u0131tlamaz.",

    prediction: {
      yours: "Siz dediniz",
      actual: "Ger\u00e7ekte",
      agreed: "Sezginiz modelle ayn\u0131 fikirde.",
      disagreed:
        "Sezginizle model ayn\u0131 fikirde de\u011fil. \u0130lgin\u00e7 olan k\u0131s\u0131m da bu.",
    },

    // Her sonucun alt\u0131ndaki iki ad\u0131m: \u00f6nce nedeni, sonra hesab\u0131.
    explain: {
      why: "Bu neden b\u00f6yle oluyor?",
      maths: "Say\u0131lar\u0131 g\u00f6ster",
    },

    monty: {
      title: "\u00dc\u00e7 kap\u0131",
      question: "Sunucuyu yenebilir misin?",
      setup: [
        "\u00dc\u00e7 kap\u0131. Birinin arkas\u0131nda bir araba, di\u011fer ikisinin arkas\u0131nda birer ke\u00e7i.",
        "Bir kap\u0131 se\u00e7ersin. Kap\u0131 kapal\u0131 kal\u0131r.",
        "Sunucu araban\u0131n yerini bilir ve di\u011fer ikisinden birini a\u00e7ar: her zaman arkas\u0131nda ke\u00e7i olan\u0131.",
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
            `\u0130lk se\u00e7imin zaman\u0131n ${stay} kadar\u0131nda arabad\u0131r ve kalmak yaln\u0131zca o zaman kazan\u0131r. Kalan ${swap} kadar\u0131nda araba se\u00e7medi\u011fin iki kap\u0131dan birinin arkas\u0131ndad\u0131r: sunucu da az \u00f6nce bu ikisinden hangisinde olmad\u0131\u011f\u0131n\u0131 g\u00f6sterdi.`,
        },
        hostKnows: {
          q: "Sunucunun biliyor olmas\u0131 \u00f6nemli mi?",
          a: "Her \u015fey o. Rastgele kap\u0131 a\u00e7an (bazen kazara arabay\u0131 g\u00f6steren) bir sunucu, kalmakla de\u011fi\u015ftirmeyi e\u015fit k\u0131lard\u0131. A\u00e7\u0131lan kap\u0131y\u0131 bilgilendirici yapan \u015fey, sunucunun bilmesi.",
        },
      },
      caption:
        "Sunucu iki kurala ba\u011fl\u0131d\u0131r: sizin kap\u0131n\u0131z\u0131 asla a\u00e7maz, arabay\u0131 asla a\u00e7maz. A\u00e7may\u0131 bilgilendirici k\u0131lan da bu kurallard\u0131r: rastgele kap\u0131 a\u00e7an bir sunucu iki se\u00e7ene\u011fi e\u015fit b\u0131rak\u0131rd\u0131.",
      predictQuestion: "Bir el oynad\u0131n. \u00c7ok say\u0131da elde hangisi daha iyi gider?",
      predict: { stay: "Kal", switch: "De\u011fi\u015ftir", same: "Fark etmez" },
      predictAnswer: (value: string) =>
        `De\u011fi\u015ftirmek zaman\u0131n ${value} kadar\u0131nda kazan\u0131r`,
      strategy: { stay: "Kal", switch: "De\u011fi\u015ftir" },
      doorsIdle:
        "\u00dc\u00e7 kapal\u0131 kap\u0131. Birinin arkas\u0131nda araba, ikisinde ke\u00e7i var.",
      doorsLabel: (picked: number, opened: number) =>
        `\u00dc\u00e7 kap\u0131. ${picked}. kap\u0131y\u0131 se\u00e7tiniz. Sunucu ke\u00e7iyi g\u00f6stermek i\u00e7in ${opened}. kap\u0131y\u0131 a\u00e7t\u0131.`,
      doorLabel: (n: number, state: string) => `${n}. kap\u0131, ${state}`,
      doorState: {
        closed: "kapal\u0131",
        picked: "sizin se\u00e7iminiz",
        opened: "sunucu a\u00e7t\u0131, ke\u00e7i",
        revealed: "araba",
      },
      won: "arabay\u0131 kazand\u0131n\u0131z",
      lost: "arabay\u0131 kazanamad\u0131n\u0131z",
      promptPick: "Bir kap\u0131 se\u00e7in.",
      promptDecide: (opened: number, other: number) =>
        `Sunucu ${opened}. kap\u0131y\u0131 a\u00e7t\u0131 ve arkas\u0131ndan ke\u00e7i \u00e7\u0131kt\u0131. Kap\u0131n\u0131zda kal\u0131n m\u0131, ${other}. kap\u0131ya m\u0131 ge\u00e7in?`,
      resultLine: (strategy: string, result: string) => `${strategy} dediniz, ${result}.`,
      again: "Yeniden oyna",
      announceOpened: (n: number) =>
        `Sunucu ${n}. kap\u0131y\u0131 a\u00e7t\u0131. Arkas\u0131ndan ke\u00e7i \u00e7\u0131kt\u0131.`,
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

      hostPick: "Bir kap\u0131 se\u00e7. Hangisi olursa.",
      hostReveal: (opened: number) =>
        `\u00dc\u00e7\u00fcn\u00fcn de arkas\u0131n\u0131 biliyorum. Bak, ${opened}. kap\u0131da ke\u00e7i var.`,
      hostDecide: (other: number) =>
        `\u015eimdi: se\u00e7ti\u011fin kap\u0131da kal ya da ${other}. kap\u0131y\u0131 al. Karar senin.`,
      hostWon: "Arabay\u0131 kazand\u0131n.",
      hostLost: "Ke\u00e7i. Yeniden oynayal\u0131m m\u0131?",
      explainWhat:
        "De\u011fi\u015ftirmek, kalmaktan yakla\u015f\u0131k iki kat daha s\u0131k kazan\u0131r.",
      explainWhy:
        "\u0130lk se\u00e7imin \u00fc\u00e7 kap\u0131dan biriydi, yani \u00fc\u00e7 seferde bir arabayd\u0131. Geriye kalan iki kap\u0131ya birlikte \u00fc\u00e7 seferde iki d\u00fc\u015f\u00fcyor, ve sunucu az \u00f6nce o ikisinden zaten araba olmayan\u0131 a\u00e7t\u0131.",
      explainMaths: (stay: string, swap: string) =>
        `Kalmak yaln\u0131zca ilk se\u00e7imin ba\u015ftan araba oldu\u011funda kazan\u0131r: ${stay}. De\u011fi\u015ftirmek di\u011fer b\u00fct\u00fcn durumlarda kazan\u0131r: ${swap}.`,
      batchInvite:
        "\u0130ki kap\u0131 kald\u0131 ve bu bir yaz\u0131 tura de\u011fil. 1.000 oyunda g\u00f6relim mi?",
    },

    birthday: {
      kicker: "Sand\u0131\u011f\u0131n\u0131zdan k\u00fc\u00e7\u00fck bir oda",
      title:
        "\u0130ki ki\u015finin do\u011fum g\u00fcn\u00fc tutmas\u0131 i\u00e7in ka\u00e7 ki\u015fi gerekir?",
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
          a: "Hay\u0131r: ger\u00e7ek do\u011fum g\u00fcnleri mevsime g\u00f6re k\u00fcmelenir ve k\u00fcmelenme tutmay\u0131 daha olas\u0131 k\u0131lar, daha az de\u011fil. Yani buradaki e\u015fit da\u011f\u0131l\u0131m modeli temkinli cevab\u0131 verir; ger\u00e7ekte %50 biraz daha erken ge\u00e7ilir.",
        },
      },
      caption:
        "Model: e\u015fit olas\u0131l\u0131kl\u0131 365 do\u011fum g\u00fcn\u00fc, art\u0131k y\u0131l yok, herkes ba\u011f\u0131ms\u0131z. Ger\u00e7ek do\u011fum g\u00fcnleri mevsime g\u00f6re k\u00fcmelenir ve bu, ger\u00e7ek olas\u0131l\u0131\u011f\u0131 biraz y\u00fckseltir, yani buradaki, temkinli olan\u0131.",
      predictQuestion: "Sizce olas\u0131l\u0131k ilk ne zaman %50'yi ge\u00e7er?",
      predict: { count: (n: number) => `${n} kiÅi` },
      predictAnswer: (n: number, value: string) => `${n} ki\u015fi, ${value} ile`,
      peopleLabel: "Odadaki ki\u015fi",
      peopleValue: (n: number, value: string) =>
        `${n} ki\u015fi, ayn\u0131 do\u011fum g\u00fcn\u00fc olas\u0131l\u0131\u011f\u0131 ${value}`,
      peopleHint: "Yirmili say\u0131lardan yava\u015f\u00e7a ge\u00e7irin.",
      roomLabel: (n: number) =>
        `${n} ki\u015filik bir oda. Hi\u00e7 kimsenin do\u011fum g\u00fcn\u00fc tutmuyor.`,
      roomLabelMatch: (n: number, a: number, b: number, day: string) =>
        `${n} ki\u015filik bir oda. ${a}. ve ${b}. ki\u015finin do\u011fum g\u00fcn\u00fc ayn\u0131: ${day}.`,
      foundPair: (a: number, b: number, day: string) =>
        `${a}. ve ${b}. ki\u015finin do\u011fum g\u00fcn\u00fc ayn\u0131: ${day}.`,
      noPair: (n: number) =>
        `${n} ki\u015filik bu odada herkesin do\u011fum g\u00fcn\u00fc farkl\u0131.`,
      tableCaption: (n: number) =>
        `${n} ki\u015fi aras\u0131nda ayn\u0131 do\u011fum g\u00fcn\u00fc olas\u0131l\u0131\u011f\u0131: tam de\u011fer ve sim\u00fclasyon.`,
      exactRow: "Tam olas\u0131l\u0131k",
      simulatedRow: (rooms: number) => `Sim\u00fclasyon (${rooms.toLocaleString("tr-TR")} oda)`,
      stale: (n: number) =>
        `yeniden \u00e7al\u0131\u015ft\u0131r\u0131n, son \u00e7al\u0131\u015fma ${n} ki\u015fiydi`,
      reading: (n: number, pairs: number) =>
        `${n} ki\u015fi ${pairs.toLocaleString("tr-TR")} farkl\u0131 \u00e7ift olu\u015fturur ve her biri tutma \u015fans\u0131d\u0131r.`,
      peopleFigure: "Ki\u015fi",
      pairsFigure: "\u00c7ift",
      pairsHint: "tutma \u015fans\u0131",
      chanceFigure: "Ayn\u0131 do\u011fum g\u00fcn\u00fc",
      exactHint: "tam de\u011fer",
      thresholdFigure: "%50'yi ge\u00e7ti\u011fi yer",
      thresholdHint: "ki\u015fi",

      personName: (n: number) => `${n}. ki\u015fi`,
      personLabel: (n: number, day: string) => `${n}. ki\u015fi, do\u011fum g\u00fcn\u00fc ${day}`,
      personMatchLabel: (n: number, day: string, other: number) =>
        `${n}. ki\u015fi, do\u011fum g\u00fcn\u00fc ${day}, ${other}. ki\u015fiyle ayn\u0131 g\u00fcn`,
      justArrived: "yeni geldi",
      sameDay: "ayn\u0131 g\u00fcn",
      roomEmpty: "Odada hen\u00fcz kimse yok.",
      explainWhat:
        "\u00c7o\u011fu ki\u015finin tahmin etti\u011finden \u00e7ok daha az insan yetiyor.",
      explainWhy:
        "Soru, birinin seninle tutup tutmad\u0131\u011f\u0131 de\u011fil. Herhangi iki ki\u015finin birbiriyle tutup tutmad\u0131\u011f\u0131, ve odaya giren her yeni ki\u015fi, i\u00e7erideki herkesle yeni bir \u00e7ift kuruyor. \u00c7iftler, insanlardan \u00e7ok daha h\u0131zl\u0131 birikiyor.",
      explainMaths: (n: number, pairs: string, value: string) =>
        `${n} ki\u015fiyle ${pairs} \u00e7ift olur. Hi\u00e7bir \u00e7iftin tutmama olas\u0131l\u0131\u011f\u0131 365/365 \u00d7 364/365 \u00d7 \u2026 \u00e7arp\u0131m\u0131d\u0131r; bunun bire t\u00fcmleyeni ${value}.`,
      simulateLabel: "Bunun yerine \u00e7al\u0131\u015ft\u0131r\u0131n",
      runRooms: (n: number) => `${n.toLocaleString("tr-TR")} oda doldur`,
      simulateNote: (days: number) =>
        `Her oda, ki\u015fi ba\u015f\u0131na e\u015fit olas\u0131l\u0131kl\u0131 ${days} g\u00fcnden bir do\u011fum g\u00fcn\u00fc \u00e7eker, sonra tekrar arar.`,
      announce: (n: number, value: string) =>
        `${n} ki\u015fi. Ayn\u0131 do\u011fum g\u00fcn\u00fc olas\u0131l\u0131\u011f\u0131: ${value}.`,
      months: [
        "Oca",
        "\u015eub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "A\u011fu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
      ],
    },

    conditional: {
      kicker: "\u0130\u015fi yapan \u015fey ipucu",
      title: "Bir ailenin iki \u00e7ocu\u011fu var. \u0130kisi de erkek mi?",
      setup: [
        "Bir ailenin iki \u00e7ocu\u011fu var: biri b\u00fcy\u00fck, biri k\u00fc\u00e7\u00fck.",
        "Her \u00e7ocuk erkek ya da k\u0131z ve ikisi de e\u015fit olas\u0131l\u0131kta, yani e\u015fit olas\u0131l\u0131kl\u0131 d\u00f6rt aile var.",
        "Biri sana bu aile hakk\u0131nda do\u011fru tek bir c\u00fcmle s\u00f6yl\u00fcyor.",
        "Senin sorun: ikisinin de erkek olma olas\u0131l\u0131\u011f\u0131 nedir?",
      ],
      coachLabel: "Herkesin sordu\u011fu sorular",
      coach: {
        notHalf: {
          q: "\u00c7ocuklardan biri erkek, o zaman di\u011feri 50/50 de\u011fil mi?",
          a: (value: string) =>
            `Bu, ba\u015fka bir c\u00fcmlenin cevab\u0131 olurdu: \u201cb\u00fcy\u00fck olan erkek\u201d. Sana s\u00f6ylenen, ikisinden en az birinin erkek oldu\u011fu: hangisi oldu\u011fu de\u011fil. D\u00f6rt aileden \u00fc\u00e7\u00fc bu c\u00fcmleye uyar ve bunlardan yaln\u0131zca biri iki erkektir; yani olas\u0131l\u0131k ${value}.`,
        },
        twoWays: {
          q: "Erkek-sonra-k\u0131z ile k\u0131z-sonra-erkek neden ayr\u0131 say\u0131l\u0131yor?",
          a: "\u00c7\u00fcnk\u00fc bunlar farkl\u0131 aileler ve her biri iki erkek kadar olas\u0131. Bir erkek bir k\u0131zl\u0131 aileye d\u00fc\u015fmek, iki erkekli bir aileye d\u00fc\u015fmekten iki kat kolayd\u0131r: birine iki yol \u00e7\u0131kar, di\u011ferine bir.",
        },
        wording: {
          q: "C\u00fcmlenin kurulu\u015fu cevab\u0131 nas\u0131l de\u011fi\u015ftiriyor?",
          a: "C\u00fcmle, kan\u0131t\u0131n kendisi. \u201cEn az biri erkek\u201d bir aileyi eler; \u201cb\u00fcy\u00fck olan erkek\u201d iki aileyi eler. Geriye daha az aile kal\u0131r ve iki erkek, kalan\u0131n i\u00e7inde daha b\u00fcy\u00fck bir pay tutar. Hi\u00e7bir ailede bir \u015fey de\u011fi\u015fmedi, yaln\u0131zca sana s\u00f6ylenen de\u011fi\u015fti.",
        },
      },
      caption:
        "Burada her \u00e7ocu\u011fun ba\u011f\u0131ms\u0131z olarak 1/2 olas\u0131l\u0131kla erkek ya da k\u0131z oldu\u011fu ve ipucunun tam olarak yaz\u0131ld\u0131\u011f\u0131 gibi ge\u00e7erli oldu\u011fu varsay\u0131l\u0131r. \u00dc\u00e7\u00fcnc\u00fc bir okuma (\u00e7ocuklardan biriyle rastgele kar\u015f\u0131la\u015f\u0131p erkek oldu\u011funu g\u00f6rmek) yine 1/2 verir ve burada modellenmemi\u015ftir.",
      predictQuestion:
        "\u0130ki \u00e7ocuk, en az biri erkek. \u0130kisinin de erkek olma olas\u0131l\u0131\u011f\u0131?",
      predict: { half: "1/2", third: "1/3", quarter: "1/4" },
      predictAnswer: (value: string) => `1/3, yani ${value}`,
      clueLabel: "\u0130pucu",
      clueShort: { atLeastOneBoy: "En az biri erkek", firstIsBoy: "\u0130lki erkek" },
      clue: {
        atLeastOneBoy: "En az biri erkek",
        firstIsBoy: "\u0130lk \u00e7ocuk erkek",
      },
      clueHint:
        "Ayn\u0131 aile, farkl\u0131 c\u00fcmle. Hangi kutular\u0131n kald\u0131\u011f\u0131na bak\u0131n.",
      outcome: { GG: "KK", GB: "KE", BG: "EK", BB: "EE" },
      possible: "h\u00e2l\u00e2 m\u00fcmk\u00fcn",
      counts: "ikisi de erkek",
      ruledOut: "elendi",
      matrixLabel: (clue: string, kept: string, value: string) =>
        `E\u015fit olas\u0131l\u0131kl\u0131 d\u00f6rt sonu\u00e7. “${clue}” bilgisiyle h\u00e2l\u00e2 m\u00fcmk\u00fcn olanlar: ${kept}. Yani ikisinin de erkek olma olas\u0131l\u0131\u011f\u0131 ${value}.`,
      fraction: (counts: string, value: string) =>
        `kalan sonu\u00e7lar\u0131n ${counts} kadar\u0131 = ${value}`,
      compareCaption:
        "\u0130ki ipucu, her birinin b\u0131rakt\u0131\u011f\u0131 sonu\u00e7lar ve \u00e7\u0131kan olas\u0131l\u0131k.",
      clueHeader: "\u0130pucu",
      leftHeader: "M\u00fcmk\u00fcn olanlar",
      answerHeader: "\u0130kisi de erkek",
      explain: {
        atLeastOneBoy:
          "KK elenince \u00fc\u00e7 sonu\u00e7 kal\u0131r ve bunlardan yaln\u0131zca biri EE'dir. \u0130pucu erke\u011fin hangi \u00e7ocuk oldu\u011funu s\u00f6ylemedi\u011fi i\u00e7in KE ve EK ikisi de ayakta kal\u0131r, ve birlikte EE'yi ikiye bir ge\u00e7erler.",
        firstIsBoy:
          "\u0130lk \u00e7ocu\u011fu adland\u0131rmak KK ile KE'yi birlikte eler ve geriye iki sonu\u00e7 kal\u0131r. Art\u0131k EE, \u00fc\u00e7te bir de\u011fil ikide birdir. Ailede hi\u00e7bir \u015fey de\u011fi\u015fmedi; c\u00fcmle de\u011fi\u015fti.",
      },
      keptFigure: "Kalan sonu\u00e7",
      keptHint: "d\u00f6rtte",
      bothFigure: "\u0130kisi de erkek",
      bothHint: "kalanlar i\u00e7inde",
      answerFigure: "Olas\u0131l\u0131k",

      older: "B\u00fcy\u00fck",
      younger: "K\u00fc\u00e7\u00fck",
      boy: "Erkek",
      girl: "K\u0131z",
      familyLabel: (older: string, younger: string) =>
        `B\u00fcy\u00fck \u00e7ocu\u011fu ${older}, k\u00fc\u00e7\u00fck \u00e7ocu\u011fu ${younger} olan aile`,
      familiesTitle: "E\u015fit olas\u0131l\u0131kl\u0131 d\u00f6rt aile",
      explainWhat:
        "Bir \u00e7ocuk hakk\u0131nda bilgi almak, di\u011ferinin ne olma ihtimalini de\u011fi\u015ftirir.",
      explainWhy:
        "\u201cEn az biri erkek\u201d hangisi oldu\u011funu s\u00f6ylemez. Yaln\u0131zca iki k\u0131zl\u0131 aileyi eler ve kalan \u00fc\u00e7 aileden ikisinde bir k\u0131z vard\u0131r. Bunun yerine \u201cb\u00fcy\u00fck olan erkek\u201d dersen bir de\u011fil iki aile elenir: ayn\u0131 aile, farkl\u0131 c\u00fcmle, farkl\u0131 cevap.",
      explainMaths: (kept: number, value: string) =>
        `D\u00f6rt aileden ${kept} tanesi ipucuna uyuyor ve bu ${kept} aileden biri iki erkek: ${value}.`,
      announce: (clue: string, kept: number, value: string) =>
        `\u0130pucu: ${clue}. ${kept} sonu\u00e7 kald\u0131. \u0130kisinin de erkek olma olas\u0131l\u0131\u011f\u0131: ${value}.`,
    },

    simpson: {
      kicker: "\u0130ki tedavi, tek bir karar",
      title: "Hangi tedaviyi se\u00e7erdin?",
      setup: [
        "B\u00f6brek ta\u015f\u0131 i\u00e7in iki tedavi, A ve B: 1986 tarihli ger\u00e7ek bir \u00e7al\u0131\u015fmadan.",
        "Hastalar ya k\u00fc\u00e7\u00fck ta\u015fla ya da b\u00fcy\u00fck ta\u015fla geliyor; b\u00fcy\u00fck olanlar zor vakalar.",
        "Tablo her tedavinin her grupta ve iki grubun toplam\u0131nda ne yapt\u0131\u011f\u0131n\u0131 g\u00f6steriyor.",
        "Tabloyu oku ve isteyece\u011fin tedaviyi se\u00e7.",
      ],
      named:
        "Bakt\u0131\u011f\u0131n \u015feyin bir ad\u0131 var: Simpson paradoksu: gruplar topland\u0131\u011f\u0131nda tersine d\u00f6nen bir kar\u015f\u0131la\u015ft\u0131rma.",
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
          a: "Tek bir hasta i\u00e7in tedavi se\u00e7erken grup sat\u0131rlar\u0131na, \u00e7\u00fcnk\u00fc o hastan\u0131n ya k\u00fc\u00e7\u00fck ta\u015f\u0131 vard\u0131r ya b\u00fcy\u00fck, ikisinin ortalamas\u0131 asla olmaz. Toplam sat\u0131r\u0131 ba\u015fka bir soruyu yan\u0131tlar: bu belirli hasta kar\u0131\u015f\u0131m\u0131na ne oldu.",
        },
      },
      caption:
        "Grup ba\u015f\u0131na ba\u015far\u0131 oranlar\u0131 Charig ve ark. (1986) \u00e7al\u0131\u015fmas\u0131ndan, iki b\u00f6brek ta\u015f\u0131 tedavisinin kar\u015f\u0131la\u015ft\u0131r\u0131lmas\u0131ndan geliyor. Kayd\u0131r\u0131c\u0131lar hastalar\u0131 gruplar aras\u0131nda ta\u015f\u0131r; oranlar yerinde kal\u0131r. Her y\u00fczde, yan\u0131nda yazan say\u0131lar\u0131n b\u00f6l\u00fcm\u00fcd\u00fcr.",
      predictQuestion: "Bir tedavi her grupta kazan\u0131p toplamda kaybedebilir mi?",
      predict: { impossible: "Hay\u0131r, bu imk\u00e2ns\u0131z", possible: "Evet, olabilir" },
      predictAnswer: "Evet; a\u015fa\u011f\u0131daki tablo ger\u00e7ek bir \u00f6rnek",
      tableCaption:
        "Grup ve tedavi baz\u0131nda ba\u015far\u0131 oranlar\u0131 ve say\u0131lar, toplamla birlikte.",
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
      shareHint:
        "Her tedavi 350 hastas\u0131n\u0131 ve grup ba\u015f\u0131na ba\u015far\u0131 oranlar\u0131n\u0131 korur. Yaln\u0131zca kar\u0131\u015f\u0131m de\u011fi\u015fir.",
      restore: "Yay\u0131mlanm\u0131\u015f tabloya d\u00f6n",
      overallA: "A toplam",
      overallB: "B toplam",
      reversedFigure: "Ters d\u00f6nd\u00fc m\u00fc?",
      reversedYes: "Evet",
      reversedNo: "Hay\u0131r",

      treatmentName: { a: "A\u00e7\u0131k ameliyat", b: "Kapal\u0131 y\u00f6ntem" },
      treatmentNote: {
        a: "b\u00fcy\u00fck olan ameliyat",
        b: "k\u00fc\u00e7\u00fck bir kesi, a\u00e7\u0131k ameliyat yok",
      },
      stepSmallTitle: "Kolay vakalarla ba\u015flayal\u0131m",
      stepLargeButton: "\u015eimdi b\u00fcy\u00fck ta\u015flar\u0131 g\u00f6ster",
      stepOverallButton: "\u0130ki grubu topla",
      seenBoth: "Her iki grupta da kazanan ayn\u0131.",
      chooseQuestion:
        "\u0130ki grup da ayn\u0131 \u015feyi s\u00f6yl\u00fcyor. Sen hangi tedaviyi se\u00e7erdin?",
      choose: { a: "A\u00e7\u0131k ameliyat", b: "Kapal\u0131 y\u00f6ntem" },
      chooseAnswer: (leader: string) =>
        `\u0130ki grup da ${leader} diyor. \u015eimdi iki grubu topla.`,
      explainWhat: "Her grupta kazanan taraf, gruplar toplan\u0131nca kaybedebilir.",
      explainWhy:
        "\u0130ki tedavi ayn\u0131 t\u00fcr hastaya verilmedi. A\u00e7\u0131k ameliyat b\u00fcy\u00fck ta\u015flar\u0131n \u00e7o\u011funu (zor vakalar\u0131) \u00fcstlendi, kapal\u0131 y\u00f6ntem ise k\u00fc\u00e7\u00fck ta\u015flar\u0131n \u00e7o\u011funu. Gruplar\u0131 toplamak \u201changi tedavi\u201d ile \u201changi hastalar\u201d sorusunu birbirine kar\u0131\u015ft\u0131r\u0131r ve hasta kar\u0131\u015f\u0131m\u0131 daha g\u00fc\u00e7l\u00fc etkidir.",
      explainMaths:
        "Her toplam oran, o tedavinin iki grup oran\u0131n\u0131n a\u011f\u0131rl\u0131kl\u0131 ortalamas\u0131d\u0131r; a\u011f\u0131rl\u0131klar da her gruptaki hasta say\u0131s\u0131d\u0131r. A\u011f\u0131rl\u0131klar de\u011fi\u015fince ortalama da de\u011fi\u015fir: grup oranlar\u0131 sabit kalsa bile.",
      illustrative:
        "Say\u0131lar 1986 tarihli yay\u0131mlanm\u0131\u015f bir kar\u015f\u0131la\u015ft\u0131rmadan; burada veride bir etkiyi g\u00f6stermek i\u00e7in kullan\u0131l\u0131yor. T\u0131bbi tavsiye de\u011fildir.",
      announce: (a: string, b: string, reversed: string) =>
        `Toplam: A ${a}, B ${b}. Ters d\u00f6nd\u00fc: ${reversed}.`,
    },

    bridge:
      "Tek bir d\u00fczene\u011fin iki modeli, ayn\u0131 g\u00f6zler konusunda anla\u015fam\u0131yor. S\u0131radaki deney \u00f6nce modeli sabitler; b\u00f6ylece de\u011fi\u015fen tek \u015fey, denemenin ka\u00e7 kez yinelendi\u011fi olur.",

    pascal: {
      kicker: "Pascal'\u0131n bilyeleri",
      title: "Ayn\u0131 d\u00fczene\u011fin iki modeli.",
      setup: [
        "Bilye, \u00e7ivilerden olu\u015fan \u00fc\u00e7genin \u00fcst\u00fcnden b\u0131rak\u0131l\u0131r ve yer\u00e7ekimiyle d\u00fc\u015fer.",
        "Y\u00f6n de\u011fi\u015fimlerinin her biri bir \u00e7arp\u0131\u015fmadan do\u011far, bir yaz\u0131 turadan de\u011fil.",
        "Sonunda durdu\u011fu g\u00f6z hangisiyse orada say\u0131l\u0131r.",
      ],
      caption:
        "\u0130deal matematiksel model her s\u0131ray\u0131 ba\u011f\u0131ms\u0131z bir sol ya da sa\u011f ad\u0131m\u0131 olarak ele al\u0131r; bu da binom da\u011f\u0131l\u0131m\u0131n\u0131 verir. Ekrandaki fiziksel d\u00fczenekte ise ad\u0131m diye bir \u015fey yoktur: bilyenin nereye gidece\u011fine yer\u00e7ekimi, temas geometrisi, esneklik ve s\u00fcrt\u00fcnme karar verir. \u0130kisi farkl\u0131 mekanizmalard\u0131r ve tablo onlar\u0131 ayr\u0131 s\u00fctunlarda tutar.",
      predictQuestion: "Birka\u00e7 bilye b\u0131rak\u0131n. Nerede durur bunlar?",
      predict: {
        edges: "\u0130ki u\u00e7ta",
        centre: "Ortada",
        even: "G\u00f6zlere e\u015fit da\u011f\u0131larak",
      },
      predictAnswer: (bin: number, share: string) =>
        `ideal modele g\u00f6re ${bin} numaral\u0131 g\u00f6z; model bu g\u00f6ze ${share} pay verir`,
      dropLabel: "Bilye b\u0131rak",
      dropBatch: (n: number) => (n === 1 ? "1 bilye" : `${n} bilye`),
      dropHint:
        "Buradaki her bilye fizik motorunda benzetilir. Hi\u00e7bir say\u0131 hesapla eklenmez.",
      falling: (n: number) => `${n} bilye h\u00e2l\u00e2 d\u00fc\u015f\u00fcyor`,
      boardLabel: (dropped: number, rows: number) =>
        `${rows} s\u0131ra \u00e7ividen olu\u015fan bir d\u00fczenek. ${dropped} bilye fiziksel olarak a\u015fa\u011f\u0131 d\u00fc\u015ft\u00fc ve alttaki g\u00f6zlerde durdu.`,
      boardEmptyLabel: (rows: number) =>
        `${rows} s\u0131ra \u00e7ividen olu\u015fan bir d\u00fczenek; alt\u0131ndaki g\u00f6zler bo\u015f.`,
      tableCaption: (rows: number, dropped: number) =>
        `${rows} s\u0131ral\u0131 d\u00fczene\u011fin her g\u00f6z\u00fc: ideal modelin sayd\u0131\u011f\u0131 yol say\u0131s\u0131, \u00f6ng\u00f6rd\u00fc\u011f\u00fc pay ve fiziksel olarak benzetilen ${dropped} bilyenin ula\u015ft\u0131\u011f\u0131 ger\u00e7ek pay.`,
      binColumn: "G\u00f6z",
      pathsColumn: "Yol",
      idealColumn: "\u0130deal model",
      physicalColumn: "Fiziksel d\u00fczenek",
      shapeColumn: "Bi\u00e7im",
      legend:
        "\u00dcstteki \u00e7ubuk ideal binom modelini, alttaki fiziksel sonu\u00e7lar\u0131 g\u00f6sterir. Ayr\u0131\u015ft\u0131klar\u0131 yerde d\u00fczenek, hesab\u0131n modellemedi\u011fi bir \u015feyi s\u00f6yl\u00fcyordur.",
      reading: (dropped: number, rows: number) =>
        `${dropped} bilye, her biri ${rows} s\u0131ra \u00e7ivinin aras\u0131ndan; hepsi tek tek benzetildi.`,
      readingEmpty:
        "G\u00f6zler bo\u015f. Bir bilye b\u0131rak\u0131n ve karar\u0131 yer\u00e7ekimiyle \u00e7ivilerin vermesini izleyin.",
      explainWhat:
        "\u0130ki model de bilyelerin \u00e7o\u011funu ortaya yak\u0131n yerle\u015ftirir; ka\u00e7 tanesini konusunda ise anla\u015famazlar.",
      explainWhy:
        "\u0130deal model bir sayma sorusu sorar: bu b\u00fcy\u00fckl\u00fckteki bir d\u00fczene\u011fin izin verdi\u011fi b\u00fct\u00fcn sol-sa\u011f dizileri i\u00e7inde ka\u00e7 tanesi hangi g\u00f6zde biter? Fiziksel d\u00fczenekte ise hi\u00e7bir \u015fey ad\u0131m atmaz. Bilye bir \u00e7iviye belirli bir h\u0131z ve a\u00e7\u0131yla gelir, temas\u0131n verdi\u011fiyle ayr\u0131l\u0131r ve bir sonrakine giderken yanal hareketinin bir k\u0131sm\u0131n\u0131 s\u00fcrt\u00fcnmeye kapt\u0131r\u0131r. Bu kay\u0131p onu ortaya do\u011fru \u00e7eker; dolay\u0131s\u0131yla bu d\u00fczenek, sayma arg\u00fcman\u0131n\u0131n \u00f6ng\u00f6rd\u00fc\u011f\u00fcnden daha dar toplan\u0131r. \u0130ki yan\u0131t da yanl\u0131\u015f de\u011fildir; farkl\u0131 sorular\u0131n yan\u0131tlar\u0131d\u0131r.",
      explainMaths: (rows: number, paths: string, total: string) =>
        `\u0130deal modelde ${rows} s\u0131ral\u0131 bir d\u00fczenek, her karar dizisine bir tane d\u00fc\u015fmek \u00fczere ${total} yola izin verir; belirli bir g\u00f6zde biten yollar\u0131n say\u0131s\u0131 da Pascal \u00fc\u00e7geninin o sat\u0131r\u0131ndaki de\u011ferdir. En kalabal\u0131k g\u00f6ze ${paths} yol ula\u015f\u0131r, yani pay\u0131 bu say\u0131n\u0131n ${total} de\u011ferine b\u00f6l\u00fcm\u00fcd\u00fcr. Bu de\u011ferler binom katsay\u0131lar\u0131d\u0131r, verdikleri paylar da binom da\u011f\u0131l\u0131m\u0131d\u0131r. Fiziksel s\u00fctun ise bunlar\u0131n hi\u00e7birinden hesaplanmaz: benzetilen bilyelerin nerede durdu\u011funun say\u0131m\u0131d\u0131r.`,
      ballsFigure: "Benzetilen bilye",
      ballsHint: "Her biri bir fiziksel deneme",
      rowsFigure: "S\u0131ra",
      pathsFigure: "\u0130deal modeldeki yol",
      pathsHint: "2'nin s\u0131ra say\u0131s\u0131 kuvveti",
      peakFigure: "En kalabal\u0131k g\u00f6z",
      peakHint: (ideal: number) => `\u0130deal modelin en kalabal\u0131\u011f\u0131 ${ideal}`,
      boardSettings: "D\u00fczenek",
      rowsLabel: "\u00c7ivi s\u0131ras\u0131",
      rowsValue: (rows: number, paths: string) => `${rows} s\u0131ra, ideal modelde ${paths} yol`,
      rowsHint:
        "D\u00fczene\u011fi yeniden kurmak g\u00f6zleri bo\u015falt\u0131r: farkl\u0131 bir d\u00fczenek, farkl\u0131 bir deneydir.",
      emptyBoard: "G\u00f6zleri bo\u015falt",
      announce: (dropped: number, bin: number) =>
        `${dropped} bilye benzetildi. En \u00e7ok bilye ${bin} numaral\u0131 g\u00f6zde.`,
      coachLabel: "S\u0131k sorulanlar",
      coach: {
        twoModels: {
          q: "Neden iki da\u011f\u0131l\u0131m var?",
          a: "\u00c7\u00fcnk\u00fc iki model var. Biri, her s\u0131ran\u0131n ba\u011f\u0131ms\u0131z ve adil bir ad\u0131m oldu\u011fu idealle\u015ftirilmi\u015f bir d\u00fczenekteki yollar\u0131 sayar. Di\u011feri ise i\u00e7inde yer\u00e7ekimi, temas ve s\u00fcrt\u00fcnme bulunan bir kat\u0131 cisim benzetimidir. Ayn\u0131 resmi anlat\u0131rlar ama ayn\u0131 \u015fey de\u011fildirler; bu y\u00fczden tek bir e\u011fride ortalanmak yerine ayr\u0131 s\u00fctunlarda g\u00f6sterilirler.",
        },
        whyDiffer: {
          q: "Hangisi do\u011fru?",
          a: "Her biri kendi konusunda do\u011frudur. Binom da\u011f\u0131l\u0131m\u0131, sayma modeli hakk\u0131nda tam olarak do\u011frudur. Fiziksel s\u00fctun da bu benzetilmi\u015f d\u00fczene\u011fin tam olarak yapt\u0131\u011f\u0131 \u015feydir. Model, bir mekanizman\u0131n idealle\u015ftirilmesidir; mekanizmada idealle\u015ftirmede bulunmayan \u015feyler varsa ikisi ayr\u0131\u015f\u0131r. \u0130\u015fe yarar k\u0131s\u0131m da tam olarak nerede ayr\u0131\u015ft\u0131klar\u0131n\u0131 fark etmektir.",
        },
        whyMiddle: {
          q: "\u0130ki modelde de orta neden doluyor?",
          a: (paths: string, total: string) =>
            `\u0130deal modelde bu bir sayma meselesidir: d\u00fczene\u011fin izin verdi\u011fi ${total} yoldan ${paths} tanesi en kalabal\u0131k g\u00f6zde, u\u00e7taki g\u00f6zlerin her birinde ise tam olarak bir tanesi biter. Fiziksel d\u00fczenekte ise bir bilyenin uca ula\u015fmas\u0131 i\u00e7in her s\u0131rada ayn\u0131 y\u00f6ne sapmas\u0131 gerekir; \u00fcstelik her temas yanal h\u0131z\u0131n\u0131n bir k\u0131sm\u0131n\u0131 al\u0131p g\u00f6t\u00fcrd\u00fc\u011f\u00fc i\u00e7in b\u00f6yle bir \u015fans dizisi daha da seyrekle\u015fir.`,
        },
      },
    },

    largeNumbers: {
      kicker: "B\u00fcy\u00fck Say\u0131lar Kanunu",
      title: "Karar\u0131 tekrarlay\u0131n; oran yerine oturur.",
      setup: [
        "Tek bir \u00e7ivi, tek bir adil karar: sol ya da sa\u011f.",
        "Karar, ba\u011f\u0131ms\u0131z bi\u00e7imde \u00e7ok kez tekrarlan\u0131r.",
        "Sa\u011fa gidenlerin oran\u0131 teorik olas\u0131l\u0131kla kar\u015f\u0131la\u015ft\u0131r\u0131l\u0131r.",
      ],
      caption:
        "Kanun, ba\u011f\u0131ms\u0131z denemeler biriktik\u00e7e g\u00f6zlenen oran\u0131n teorik olas\u0131l\u0131\u011fa yakla\u015fma e\u011filiminde oldu\u011funu s\u00f6yler. Aradaki fark\u0131n her ad\u0131mda k\u00fc\u00e7\u00fclece\u011fini s\u00f6ylemez; bu ko\u015fuda da k\u00fc\u00e7\u00fclmez: \u00e7izgi yerine oturmadan \u00f6nce uzakla\u015ft\u0131\u011f\u0131 yerleri izleyin.",
      predictQuestion: "Deneme say\u0131s\u0131 artt\u0131k\u00e7a g\u00f6zlenen oran ne yapar?",
      predict: {
        settles: "Teorik de\u011ferin yak\u0131n\u0131nda durulur",
        swings: "Ayn\u0131 genlikte sal\u0131nmay\u0131 s\u00fcrd\u00fcr\u00fcr",
        exact: "Tam olarak teorik de\u011fere e\u015fitlenir",
      },
      predictAnswer: "\u00fczerine tam oturmadan teorik de\u011ferin yak\u0131n\u0131nda durur",
      thousands: ".",
      scaleLabel: "Deneme say\u0131s\u0131",
      watchHint: "Her karar\u0131n geli\u015fini izleyecek kadar k\u00fc\u00e7\u00fck.",
      acceleratedHint:
        "Tek tek \u00e7izilemeyecek kadar \u00e7ok. Yine de her deneme say\u0131l\u0131yor.",
      chartLabel: (trials: string, observed: string, theoretical: string) =>
        `${trials} deneme boyunca g\u00f6zlenen oran, logaritmik \u00f6l\u00e7ekte. ${observed} de\u011ferinde bitiyor; d\u00fcz referans \u00e7izgisi olarak \u00e7izilen teorik olas\u0131l\u0131k ise ${theoretical}.`,
      axisStart: "1 deneme",
      axisEnd: (trials: string) => `${trials} deneme`,
      outcomesLabel: (n: number) => `\u0130lk ${n} karar, s\u0131ras\u0131yla`,
      outcomeLabel: (index: number, side: string) => `${index}. deneme: ${side}`,
      right: "sa\u011f",
      left: "sol",
      rightMark: "S",
      leftMark: "L",
      tableCaption:
        "Ayn\u0131 ko\u015funun ge\u00e7ti\u011fi her \u00f6l\u00e7ekte okunu\u015fu: teorik olas\u0131l\u0131k, g\u00f6zlenen oran ve aralar\u0131ndaki uzakl\u0131k.",
      trialsColumn: "Deneme",
      theoreticalColumn: "Teorik",
      observedColumn: "G\u00f6zlenen",
      deviationColumn: "Sapma",
      tableNote:
        "Sapma s\u00fctununu yukar\u0131dan a\u015fa\u011f\u0131ya okuyun. K\u00fc\u00e7\u00fclme e\u011filimindedir; her sat\u0131rda k\u00fc\u00e7\u00fclmesi gerekmez.",
      reading: (trials: string) =>
        `Tek bir tohumdan \u00fcretilmi\u015f ${trials} ba\u011f\u0131ms\u0131z karar. Ayn\u0131 tohum her seferinde ayn\u0131 ko\u015fuyu verir.`,
      explainWhat:
        "Oran ba\u015flarda gezinir, sonra teorik olas\u0131l\u0131\u011f\u0131n yak\u0131n\u0131nda durulur.",
      explainWhy:
        "Her yeni deneme, y\u00fcr\u00fcyen oran\u0131 bir \u00f6ncekinden daha az oynat\u0131r; \u00e7\u00fcnk\u00fc giderek artan say\u0131da sonucun yaln\u0131zca biridir. Ba\u015flang\u0131\u00e7ta tek bir sonu\u00e7 pay\u0131 onda bir oynatabilir; on bin denemeden sonra on binde birden fazla oynatamaz. Gezinme durmaz, yaln\u0131zca bu \u00f6l\u00e7ekte g\u00f6r\u00fcnmez olur.",
      explainMaths:
        "G\u00f6zlenen oran, sa\u011fa giden karar say\u0131s\u0131n\u0131n deneme say\u0131s\u0131na b\u00f6l\u00fcm\u00fcd\u00fcr; sapma ise bu oran\u0131n teorik olas\u0131l\u0131\u011fa uzakl\u0131\u011f\u0131d\u0131r. \u0130kisi de bir form\u00fclden de\u011fil, ko\u015funun kendisinden okunur; sapma s\u00fctununun arada bir yeniden y\u00fckselmesinin nedeni de budur.",
      theoreticalFigure: "Teorik olas\u0131l\u0131k",
      theoreticalHint:
        "Adil bir karar; \u00f6l\u00e7\u00fclm\u00fc\u015f de\u011fil, tan\u0131mlanm\u0131\u015f",
      observedFigure: "G\u00f6zlenen oran",
      deviationFigure: "Sapma",
      deviationHint: "Teorik de\u011fere uzakl\u0131k",
      trialsFigure: "Deneme",
      announce: (trials: string, observed: string) =>
        `${trials} deneme. G\u00f6zlenen oran ${observed}.`,
      coachLabel: "S\u0131k sorulanlar",
      coach: {
        notEvenly: {
          q: "\u0130ki taraf\u0131n tam olarak e\u015fitlenmesi gerekmez mi?",
          a: "Gerekmez. Sa\u011fa gidenlerin pay\u0131 yar\u0131ya yakla\u015f\u0131r, ama iki say\u0131 aras\u0131ndaki fark b\u00fcy\u00fcmekte serbesttir. Bir ko\u015fu bir tarafta on bin fazla bitirip yine de oran olarak yar\u0131ya \u00e7ok yak\u0131n durabilir; \u00e7\u00fcnk\u00fc oran \u00e7ok daha b\u00fcy\u00fck bir say\u0131ya b\u00f6l\u00fcn\u00fcr.",
        },
        dueForOne: {
          q: "\u00dcst \u00fcste sola gittikten sonra sa\u011f gelmesi gerekmez mi?",
          a: "Gerekmez. Her karar ba\u011f\u0131ms\u0131zd\u0131r; s\u0131radaki karar da ilki kadar her iki y\u00f6ne gidebilir. Dengesiz bir ba\u015flang\u0131c\u0131 d\u00fczelten \u015fey, ters y\u00f6nde telafi eden bir seri de\u011fil, sonraki denemelerin \u00e7oklu\u011funun onu seyreltmesidir.",
        },
        howMany: {
          q: "Ka\u00e7 deneme yeterlidir?",
          a: "Ne kadar yak\u0131n olman\u0131z gerekti\u011fine ve bundan ne kadar emin olmak istedi\u011finize ba\u011fl\u0131d\u0131r. Kanun bir takvim de\u011fil bir e\u011filim tarif eder ve g\u00f6zlenen oran\u0131n teorik olas\u0131l\u0131\u011f\u0131n yak\u0131n\u0131nda kalaca\u011f\u0131n\u0131 garanti eden bir say\u0131 vermez.",
        },
      },
    },

    recap: {
      lessons: [
        "Sezgi bir olas\u0131l\u0131k hesaplay\u0131c\u0131s\u0131 de\u011fildir. D\u00f6rt deneyin d\u00f6rd\u00fcnde de akla ilk gelen cevap yanl\u0131\u015f olan\u0131d\u0131r.",
        'Bir ipucu hangi sonu\u00e7lar\u0131n m\u00fcmk\u00fcn kald\u0131\u011f\u0131n\u0131 de\u011fi\u015ftirir ve hangilerinin kalaca\u011f\u0131na c\u00fcmlenin kurulu\u015fu karar verir. "En az biri erkek" ile "ilki erkek" farkl\u0131 k\u00fcmeler b\u0131rak\u0131r.',
        "Tutma meselesi ki\u015filerle de\u011fil \u00e7iftlerle ilgilidir. Yirmi \u00fc\u00e7 ki\u015fi 253 \u00e7ift olu\u015fturur; ayn\u0131 do\u011fum g\u00fcn\u00fcn\u00fcn hissedildi\u011finden \u00e7ok daha erken gelmesinin nedeni budur.",
        "Gruplar\u0131 toplamak, gruplar ayn\u0131 bi\u00e7imde doldurulmam\u0131\u015fsa i\u00e7lerindeki kar\u015f\u0131la\u015ft\u0131rmay\u0131 tersine \u00e7evirebilir.",
      ],
      footer:
        "Bunlar\u0131n her biri, belirtilmi\u015f bir modeli olan \u00e7\u00f6z\u00fcml\u00fc birer problemdir; \u015fansa dair genel bir kural de\u011fil. Tam olas\u0131l\u0131klar kapal\u0131 formda hesaplan\u0131r; sim\u00fcle edilenler ise deneyin tohumlanm\u0131\u015f bir \u00fcrete\u00e7le ger\u00e7ekten \u00e7al\u0131\u015ft\u0131r\u0131lmas\u0131ndan gelir ve her zaman b\u00f6yle etiketlenir. Bir soru ger\u00e7ekten belirsizse (en a\u00e7\u0131k \u00f6rnek iki \u00e7ocuk problemidir), varsay\u0131m sessizce se\u00e7ilmez, yaz\u0131l\u0131r.",
    },
  },

  // ----------------------------------------------------------- sorting ----
  sorting: {
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
      cursor: (index: number, value: number) => `İmleç ${index}. çubukta, değer ${value}.`,
      sorting: "Sıralanıyor.",
      arrayReset: "Dizi sıfırlandı.",
      loaded: (shape: string) => `${shape} yüklendi.`,
      selected: (algorithm: string) => `${algorithm} seçildi.`,
    },
    race: {
      question: "Hangisi önce bitirir?",
      oneButton: "Tek düğme. İkisi de aynı veriden başlıyor.",
      bothDone: "Aynı sonuç, ama biri diğerinin sorduğu soruların çok azını sordu.",
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
      lede: "Grafiği yeniden biçimlendirin (üzerinde sürükleyin ya da bir biçim seçin), sonra yeniden sıralayın.",
      caption:
        "Seçmeli Sıralama burada her seferinde 496 soru sorar; sıralı, karışık ya da ters fark etmez, çünkü kalan her çifti yine de kontrol eder. Eklemeli Sıralama'nın sayısı ise çizdiğiniz biçimle birlikte değişir.",
    },
    distance: {
      kicker: "Evinden ne kadar uzakta",
      title: "Mesele kaç tanesinin yanlış olduğu değil.",
      lede: "Sıralı biçimden başlayın. Bir çubuğu ait olduğu yerden çok uzağa sürükleyin, sonra bunun yerine üç çubuğu hafifçe oynatın. Her birinin maliyetini karşılaştırın.",
      caption:
        "Terslik, sırası yanlış olan bir çifttir. Bu eklemeli sıralama, kendisine verilen dizideki her terslik için tam bir kez kaydırır, yani evinden çok uzaktaki tek bir değer, birkaç küçük hatadan daha pahalıya gelebilir. Taşıma ise bu kaydırmalara, yeri değişen her değeri yerine yazan son işlemi de ekler; bu yüzden Düzensizlik'in biraz üzerinde durur.",
    },
    challenge: {
      architecture: "Mimari",
      neuronsUsed: "Kullan\u0131lan n\u00f6ron",
      testAccuracy: "Test do\u011frulu\u011fu",
      target: "Hedef",
      objectiveLine: (accuracy: string) =>
        `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n: olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
      solvedNote:
        "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
      noBest:
        "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
      bestLine: (neurons: number, accuracy: string, epoch: number) =>
        `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
      canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
        `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
      announceSolved: (neurons: number, accuracy: string) =>
        `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
      kicker: "Meydan okuma",
      title: "Neyi saydığınıza göre ucuz değişir.",
      lede: "Üç sabit dizi, üç bütçe, ve bütçe her zaman aynı sayıyla ilgili değil.",
      budget: "Bütçe",
      atMost: (unit: string) => `en fazla ${unit}`,
      barsChanged: "değişen çubuk",
      beaten: (done: number, total: number) => `${total} görevden ${done} tanesi geçildi`,
      fixedTo: (algorithm: string) =>
        `${algorithm} sabit. Onun yerine veriyi yeniden biçimlendirin.`,
      goal: (budget: number, unit: string) => `Hedef: en fazla ${budget} ${unit}.`,
      chartLabel: (title: string, size: number, disorder: number, goal: string, state: string) =>
        `${title}: ${size} değerden oluşan çubuk grafik. Düzensizlik: ${disorder} terslik. ${goal} ${state}`,
      editsUsed: (used: number, max: number) => `${max} düzenlemeden ${used} tanesi kullanıldı.`,
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
          brief: "İstediğiniz kadar soru sorun: yeter ki fazla veri taşımayın.",
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
        "Terslik, sırası yanlış olan bir çifttir ve bu eklemeli sıralama her biri için bir kez kaydırır; Taşıma buna her değeri yerine yazan son işlemi de ekler, ama daha az soru sormak, daha az veri yazmakla aynı hedef değildir",
      ],
      footer:
        "Gerçek sıralama kütüphaneleri tam olarak buna yaslanır: neredeyse sıralı parçaları eklemeli sıralamaya devrederler, çünkü o biçimde işin neredeyse tamamı zaten yapılmıştır.",
    },
  },

  // ------------------------------------------------------ tokenization ----
  tokenization: {
    sources: {
      title: "Kaynaklar",
      subwordBpe:
        "Bayt \u00e7ifti kodlamas\u0131n\u0131 bir alt s\u00f6zc\u00fck par\u00e7alama y\u00f6ntemi olarak destekler. Buradaki s\u00f6zl\u00fck, laboratuvar\u0131n kendi k\u00fc\u00e7\u00fck derlemi \u00fczerinde e\u011fitilir; herhangi bir \u00fcretim modelinin s\u00f6zl\u00fc\u011f\u00fc de\u011fildir.",
    },
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
        `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n: olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
      solvedNote:
        "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
      noBest:
        "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
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
        passed: (tokens: number, budget: number) => `${tokens} token, ${budget} bütçesinin içinde.`,
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
};
