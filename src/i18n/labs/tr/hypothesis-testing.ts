import type en from "../en/hypothesis-testing";

/** Türkçe metin: hypothesis-testing. Şekli `en/hypothesis-testing.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
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
    handleMu1: "H\u2081: eksen boyunca s\u00fcr\u00fckleyin",
    handleMu1Value: (value: string) => `\u03bc\u2081 = ${value}`,
    handleCritical: "Kritik de\u011fer: eksen boyunca s\u00fcr\u00fckleyin",
    handleCriticalValue: (critical: string, alpha: string) =>
      `s\u0131n\u0131r ${critical}, \u03b1 = ${alpha}`,
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
    mu1Hint:
      "Grafikteki H\u2081'i tutup s\u00fcr\u00fckleyin: \u03bc\u2080 \u00fczerinden ge\u00e7irip di\u011fer tarafa ta\u015f\u0131y\u0131n.",
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
      "\u03b1 veriden \u00f6nce sabitlenir: \u03bc = \u03bc\u2080 iken X\u0304'in reddetme b\u00f6lgesine d\u00fc\u015fme olas\u0131l\u0131\u011f\u0131d\u0131r. Onu de\u011fi\u015ftirmenin e\u011friyi de\u011fil kritik de\u011feri oynatmas\u0131n\u0131n nedeni de budur. H\u2080 do\u011fruyken onu reddetmek I. tip hatad\u0131r [Casella & Berger, 2. bask\u0131, B\u00f6l\u00fcm 8.3.1, s. 382-383].",
    alphaHint:
      "Kesikli \u00e7izgiyi s\u00fcr\u00fckleyin. H\u2080'\u0131n onun \u00f6tesinde kalan taral\u0131 alan\u0131 tam olarak \u03b1'd\u0131r ve say\u0131 elinizi izler.",
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
    dragHint:
      "Hem H\u2081 hem kesikli \u00e7izgi s\u00fcr\u00fcklenebilir. \u00c7izgiyi bir y\u00f6ne itin: \u03b2 k\u00fc\u00e7\u00fcl\u00fcrken \u03b1 b\u00fcy\u00fcr. Sonra testi yanl\u0131\u015f y\u00f6ne \u00e7evirin.",
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
    curveTitle: "\u00d6rneklem b\u00fcy\u00fckl\u00fc\u011f\u00fcne kar\u015f\u0131 g\u00fc\u00e7",
    curveHint:
      "n'yi se\u00e7mek i\u00e7in e\u011fri boyunca bas\u0131n ya da s\u00fcr\u00fckleyin.",
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
};

export default copy;
