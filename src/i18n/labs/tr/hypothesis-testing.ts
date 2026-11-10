import type en from "../en/hypothesis-testing";

/** Türkçe metin: hypothesis-testing. Şekli `en/hypothesis-testing.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  scope:
    "Bu kuramsal modeldir: her iki hipotez altında örneklem ortalaması X̄'in örnekleme dağılımı; ikisi de σ/√n standart hatasıyla normal ve σ bilinen kabul ediliyor [Casella & Berger, 2. baskı, Teorem 5.3.1, s. 218]. Bu kurguda test istatistiği örneklem ortalaması X̄'tir; reddetme bölgesi de standartlaştırılmış biçimde değil, doğrudan X̄ biriminde yazılır [s. 374]. Kritik değeri t değil z yapan da budur. Bu laboratuvarda hiçbir yerde örneklem çekilmez: her sayı, gösterilen denklemlerin kapalı form değeridir; yani okuduğun şey bir dene tek bir koşusu değil, modelin kendisidir.",
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
    alphaTag: (value: string) => `α = ${value}`,
    betaTag: (value: string) => `β = ${value}`,
    summary: (
      mu0: string,
      mu1: string,
      se: string,
      criticals: string,
      alpha: string,
      beta: string,
      power: string,
    ) =>
      `Örneklem ortalamasının iki örnekleme dağılımı. H₀ altında ${mu0}, H₁ altında ${mu1} merkezli; ikisinin de standart hatası ${se}. Reddetme bölgesi ${criticals} noktasında başlıyor. H₀ altında reddetme bölgesine düşen alan α = ${alpha}; H₁ altında bu bölgenin dışında kalan alan β = ${beta}. Güç ${power}.`,
  },

  controls: {
    moreLabel: "Di\u011fer ayarlar",
    note: "Her ayar aynı kuramsal modeli yeniden hesaplar. Rastgele örneklem üretilmez.",
    mu0: "\u03bc\u2080: s\u0131f\u0131r hipotezi ortalamas\u0131",
    mu0Value: (value: string) => `μ₀ = ${value}`,
    mu1: "\u03bc\u2081: alternatif ortalama",
    mu1Value: (value: string) => `μ₁ = ${value}`,
    sigma: "\u03c3: anak\u00fctle standart sapmas\u0131",
    sigmaValue: (value: string) => `σ = ${value}`,
    alpha: "\u03b1",
    alphaValue: (value: string) => `α = ${value}`,
    n: "n: \u00f6rneklem b\u00fcy\u00fckl\u00fc\u011f\u00fc",
    nValue: (value: number) => `n = ${value}`,
  },

  separation: {
    title: "Two hypotheses",
    question: "\u0130ki hipotez birbirinden uzakla\u015ft\u0131\u011f\u0131nda ne olur?",
    caption:
      "Eğriler ham veriyi değil, iki hipotez altında örneklem ortalamasının dağılımını gösterir. Her eğri, ilgili ortalama doğru kabul edildiğinde n ölçümün ortalamasının dağılımıdır [Casella & Berger, 2. baskı, s. 213–214, 218].",
    mu1Label: "\u03bc\u2081: alternatifi hareket ettirin",
    mu1Value: (value: string) => `μ₁ = ${value}`,
    mu1Hint: "μ₀ üzerinden geçirip diğer tarafa taşı.",
    mu0Label: "\u03bc\u2080",
    mu1Figure: "\u03bc\u2081",
    gapLabel: "Aral\u0131k",
    gapHint: "standart hata cinsinden",
    announce: (mu1: string, gap: string) =>
      `μ₁ = ${mu1}. İki ortalama arasında ${gap} standart hata var.`,
  },

  alphaSection: {
    kicker: "Where you draw the line",
    title: "One rejection region, and everything inside it counts as evidence.",
    lede: "Bir testin kurala ihtiyac\u0131 vard\u0131r: X\u0304, \u03bc\u2080'dan ne kadar uza\u011fa d\u00fc\u015ferse H\u2080 reddedilir? Reddetmeye yol a\u00e7an de\u011ferler reddetme b\u00f6lgesini olu\u015fturur (Casella ve Berger bunu kritik b\u00f6lge olarak da adland\u0131r\u0131r); kritik de\u011fer ise bu b\u00f6lgenin ba\u015flad\u0131\u011f\u0131 noktad\u0131r. Anlaml\u0131l\u0131k d\u00fczeyi \u03b1, \u03bc = \u03bc\u2080 iken X\u0304'in bu b\u00f6lgeye d\u00fc\u015fme olas\u0131l\u0131\u011f\u0131d\u0131r [Casella & Berger, 2. bask\u0131, Tan\u0131m 8.1.3, s. 374; Tan\u0131m 8.3.5-8.3.6, s. 385].",
    caption:
      "\u03b1 veriden \u00f6nce sabitlenir: \u03bc = \u03bc\u2080 iken X\u0304'in reddetme b\u00f6lgesine d\u00fc\u015fme olas\u0131l\u0131\u011f\u0131d\u0131r. Kayd\u0131r\u0131c\u0131n\u0131n e\u011friyi de\u011fil kritik de\u011feri oynatmas\u0131n\u0131n nedeni de budur. H\u2080 do\u011fruyken onu reddetmek I. tip hatad\u0131r [Casella & Berger, 2. bask\u0131, B\u00f6l\u00fcm 8.3.1, s. 382-383].",
    alphaLabel: "α: kabul ettiğin I. tip hata oranı",
    alphaValue: (value: string) => `α = ${value}`,
    alphaHint: "Reddetme b\u00f6lgesindeki taral\u0131 alan tam olarak bu say\u0131d\u0131r.",
    alphaFigure: "\u03b1",
    criticalLabel: "Kritik de\u011fer",
    criticalHint: "\u03bc\u2080 \u00b1 z\u00b7SE",
    criticalLeft: "Alt s\u0131n\u0131r",
    criticalRight: "\u00dcst s\u0131n\u0131r",
    seLabel: "SE",
    seHint: "\u03c3/\u221an",
    oneSided: (value: string) =>
      `α'nın tamamı tek kuyrukta: H₀ dağılımının ${value} kadarı reddetme bölgesinde kalıyor.`,
    twoSided: (half: string) =>
      `α iki kuyruğa bölünür: her uçta ${half}. B\u00f6ylece her kritik de\u011fer, tek y\u00f6nl\u00fc bir testin koyaca\u011f\u0131ndan daha d\u0131\u015farda durur.`,
    announce: (alpha: string, criticals: string) => `α = ${alpha}. Sınır ${criticals} konumunda.`,
  },

  betaSection: {
    kicker: "The error nobody counts",
    title: "\u03b2 is what H\u2081 leaves outside the rejection region.",
    lede: "\u03b1, H\u2080 alt\u0131nda; \u03b2 ise H\u2081 alt\u0131nda hesaplan\u0131r ve ikisi ayn\u0131 reddetme b\u00f6lgesinin kar\u015f\u0131t yanlar\u0131nda durur. Kritik de\u011feri kayd\u0131r\u0131p birini k\u00fc\u00e7\u00fcltmek di\u011ferini b\u00fcy\u00fct\u00fcr; bu y\u00fczden testin hangi y\u00f6ne kuruldu\u011fu, kritik de\u011ferin nereye kondu\u011fu kadar \u00f6nemlidir [Casella & Berger, 2. bask\u0131, s. 385].",
    caption:
      "\u03b2, bu belirli \u03bc\u2081 do\u011fruyken H\u2080'\u0131n reddedilmeme olas\u0131l\u0131\u011f\u0131d\u0131r, yani II. tip hata; g\u00fc\u00e7 ise 1 \u2212 \u03b2'd\u0131r. \u0130kisi de modelin \u00f6zellikleridir, herhangi bir \u00f6rneklemin de\u011fil. G\u00fc\u00e7 tek bir \u03bc\u2081 yerine olabilecek b\u00fct\u00fcn \u03bc de\u011ferleri boyunca hesapland\u0131\u011f\u0131nda g\u00fc\u00e7 fonksiyonu elde edilir [Casella & Berger, 2. bask\u0131, Tan\u0131m 8.3.1, s. 383].",
    testTypeLabel: "H\u2081 ne iddia ediyor",
    mu1Label: "\u03bc\u2081",
    mu1Value: (value: string) => `μ₁ = ${value}`,
    betaLabel: "\u03b2",
    betaHint: "H\u2081'in b\u00f6lge d\u0131\u015f\u0131ndaki alan\u0131",
    powerLabel: "G\u00fc\u00e7",
    powerHint: "1 \u2212 \u03b2",
    alphaLabel: "\u03b1",
    reading: (beta: string) =>
      `β = ${beta}: H\u2081 da\u011f\u0131l\u0131m\u0131n\u0131n bu kadarl\u0131k k\u0131sm\u0131 reddetme b\u00f6lgesinin d\u0131\u015f\u0131na, yani testin H\u2080'\u0131 reddetmedi\u011fi yere d\u00fc\u015f\u00fcyor.`,
    warning: {
      left: "Test \u03bc\u2081 < \u03bc\u2080 ar\u0131yor, ancak \u03bc\u2081 \u03bc\u2080'\u0131n alt\u0131nda de\u011fil. Alternatif da\u011f\u0131l\u0131m reddetme b\u00f6lgesinden uzakta duruyor, dolay\u0131s\u0131yla neredeyse hi\u00e7 yakalanm\u0131yor: \u03b2 1'e, g\u00fc\u00e7 0'a yak\u0131n.",
      right:
        "Test \u03bc\u2081 > \u03bc\u2080 ar\u0131yor, ancak \u03bc\u2081 \u03bc\u2080'\u0131n \u00fczerinde de\u011fil. Alternatif da\u011f\u0131l\u0131m reddetme b\u00f6lgesinden uzakta duruyor, dolay\u0131s\u0131yla neredeyse hi\u00e7 yakalanm\u0131yor: \u03b2 1'e, g\u00fc\u00e7 0'a yak\u0131n.",
    },
    announce: (beta: string, power: string) => `β = ${beta}. Güç = ${power}.`,
  },

  sampleSection: {
    kicker: "The only lever that helps both",
    title: "More data narrows everything at once.",
    lede: "Örnek sayısı n arttığında standart hata SE = σ/√n azalır. Dağılımlar daralır ve alfa sabitken, belirtilen alternatif için güç artar [Casella & Berger, 2. baskı, s. 217, 385].",
    caption:
      "Sabit x ekseninde eğrilerin genişliklerini karşılaştır. Otomatik mod ekseni eğrilere göre ayarlar. SE, n’nin kareköküyle ters orantılıdır; her ek örneğin etkisi giderek azalır.",
    nLabel: "n: \u00f6rneklem b\u00fcy\u00fckl\u00fc\u011f\u00fc",
    nValue: (value: number) => `n = ${value}`,
    formula: (se: string) => `SE = σ/√n = ${se}`,
    nFigure: "n",
    seLabel: "SE",
    seHint: "\u03c3/\u221an",
    powerLabel: "G\u00fc\u00e7",
    betaLabel: "\u03b2",
    curveTitle: "Power against sample size",
    eighty: "0,80",
    curveLabel: (from: number, to: number, first: string, last: string) =>
      `Diğer her şey sabitken n = ${from}'den n = ${to}'e güç. ${first} civarında başlıyor ve yaklaşık ${last} değerine ulaşıyor.`,
    announce: (n: number, se: string, power: string) => `n = ${n}. SE = ${se}. Güç = ${power}.`,
  },

  challenge: {
    kicker: "Now hit a number",
    title: "Reach the power the task asks for.",
    lede: "Her görev belirli bir sonuç ister. Kontrolleri değiştirerek modelin istenen hata veya güç değerine ulaşmasını sağla.",
    puzzleLabel: "G\u00f6rev",
    reset: "Ba\u015fa d\u00f6n",
    powerLabel: "G\u00fc\u00e7",
    alphaLabel: "\u03b1",
    seLabel: "SE",
    target: (value: string) => `hedef ${value}`,
    notYet: (power: string, target: string) =>
      `Güç ${power}. ${target} değerine ulaşması gerekiyor.`,
    alphaTooHigh: (max: string) => `α bu görevin sınırının üzerinde: en fazla ${max} olabilir.`,
    announceSolved: (power: string) => `Çözüldü. Güç = ${power}.`,
    announceAttempt: (power: string, alpha: string) => `Güç ${power}, α ${alpha}.`,
    puzzles: {
      "reach-power": {
        title: "Reach 0.80",
        brief: (power: string, alpha: string) =>
          `Etki gerçek ama küçük: μ₁, μ₀'ın yarım birim üzerinde ve test bunu bulduğundan daha sık kaçırıyor. α'yı ${alpha} değerinin üzerine çıkarmadan gücü ${power} değerine getirin.`,
        lesson:
          "\u0130ki kol da g\u00fcc\u00fc art\u0131r\u0131r ama ayn\u0131 bi\u00e7imde de\u011fil. \u03b1'y\u0131 b\u00fcy\u00fctmek reddetme b\u00f6lgesini geni\u015fletir ve daha y\u00fcksek bir I. tip hata oran\u0131n\u0131 kabul etmek demektir; n'yi b\u00fcy\u00fctmek ise SE'yi daraltarak \u03b1'y\u0131 de\u011fi\u015ftirmeden \u03b2'y\u0131 d\u00fc\u015f\u00fcr\u00fcr [Casella & Berger, 2. bask\u0131, s. 385].",
        solved: (power: string, alpha: string) =>
          `Güç ${power}, α = ${alpha}. Buraya n ve α'nın hangi karışımıyla geldiysen gelin, kritik değer SE'ye göre μ₀'a yeterince yaklaştı ve H₁ dağılımının büyük kısmı reddetme bölgesine düştü.`,
      },
      noisy: {
        title: "Too much noise",
        brief: (power: string, alpha: string) =>
          `σ = 3 ve test iki yönlü; yani α iki kuyruğa bölünüyor ve her iki kritik değer de epey dışarda duruyor. α en fazla ${alpha} olacak şekilde ${power} güce ulaşın.`,
        lesson:
          "\u0130ki y\u00f6nl\u00fc test \u03b1'y\u0131 iki kuyru\u011fa b\u00f6l\u00fc\u015ft\u00fcr\u00fcr; bu y\u00fczden her kritik de\u011fer, tek y\u00f6nl\u00fc testin koyaca\u011f\u0131ndan daha d\u0131\u015farda durur. Tek y\u00f6nl\u00fc test \u03b1'n\u0131n tamam\u0131n\u0131 tek bir kuyrukta toplar: \u03bc\u2081 o y\u00f6ndeyse g\u00fc\u00e7 artar, de\u011filse azal\u0131r [Casella & Berger, 2. bask\u0131, s. 386].",
        solved: (power: string, alpha: string) =>
          `Güç ${power}, α = ${alpha}. \u03c3'y\u0131 k\u00fc\u00e7\u00fcltmek ya da n'yi b\u00fcy\u00fctmek SE'yi daralt\u0131r; tek y\u00f6nl\u00fc test ise \u03b1'n\u0131n tamam\u0131n\u0131 \u03bc\u2081'in ger\u00e7ekten bulundu\u011fu kuyru\u011fa koyar.`,
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
    title: "Sources",
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

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "İki eğri aynı anakütle ortalaması için farklı hipotezleri gösterir. Alternatif ortalamayı değiştirerek dağılımların örtüşmesini incele.",
    stages: {
      separation: {
        curves:
          "Her eğri, o iddia (μ₀ ya da μ₁) doğruysa n ölçümün ortalamasının nasıl dağılacağını gösterir.",
        move: "Bu kaydırıcı μ₁'i taşır. Onu μ₀'ın içinden geçirip öbür tarafa çıkar.",
        gap: "İkisi arasındaki fark, standart hata cinsinden. Fark küçüldükçe eğriler üst üste biner.",
      },
      alpha: {
        region: "Gölgeli kuyruk ret bölgesi: ortalama oraya düşerse H₀ aleyhine kanıt sayılır.",
        alpha:
          "Bu kaydırıcı α'yı, yani H₀ doğruyken onu reddetme riskini belirler. Tur onu yükseltti.",
        critical: "α büyüdükçe kritik değer içeri kayar ve bölge genişler.",
      },
      beta: {
        curves:
          "β, H₁ eğrisinin ret bölgesi dışında kalan kısmı: testin kaçırdığı gerçek bir etki.",
        type: "Testi öbür yöne çevir. Tur yönü değiştirdi; β'ya ne olduğuna bak.",
        power: "β, güç (1 − β) ve α yan yana.",
      },
      sample: {
        curves: "İki eğri ve bu kadar ölçümle ne kadar geniş oldukları.",
        n: "Daha çok ölçüm alın. Tur n'yi artırdı; iki eğri de daraldı ve örtüşme küçüldü.",
        figures: "Daha çok veri, α'yı artırmadan β'yı düşürür.",
      },
      challenge: {
        task: "Her görev bir sonuç ister: ulaşılması gereken bir güç. Görevi yukarıdan seç.",
        controls: "Test yönü, n, α ve σ'yı ayarlarsın.",
        power: "Modelin şu anki gücü. Geçmek için hedefe ulaşın.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      alpha: "Two hypotheses, α and the rejection region",
      power: "β, power and sample size",
    },
    notes: {
      "sq-hyptest": "Sıfır hipotezinin ne olduğu ve onu reddetmenin anlamı.",
      "sq-althyp": "Alternatif hipotez: lab'daki öbür eğri.",
      "sq-power": "Gücün, gerçek bir farkı yakalama olasılığı olması.",
      "sq-power-analysis": "Belirli bir güç için kaç ölçüm gerektiği.",
      "khan-power": "Güç, α ve β birlikte.",
      "openintro-stats": "Test ve güç üzerine ücretsiz bir ders kitabı bölümü.",
    },
  },
};

export default copy;
