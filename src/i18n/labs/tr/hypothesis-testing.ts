import type en from "../en/hypothesis-testing";

/**
 * Türkçe metin: hypothesis-testing. Şekli `en/hypothesis-testing.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md, anlatım kuralları docs/language/tr-style.md
 * dosyasındadır. Bu lab o belgelerin pilotudur.
 */

const copy: typeof en = {
  scope:
    "Bu lab kuramsal modeli gösterir: her iki hipotez altında örneklem ortalaması X̄'in örnekleme dağılımı. İki dağılım da σ/√n standart hatalı normal dağılımdır ve σ bilinen kabul edilir [Casella & Berger, 2. baskı, Teorem 5.3.1, s. 218]. Test istatistiği X̄'tir; ret bölgesi standartlaştırılmış biçimde değil, doğrudan X̄ biriminde yazılır [s. 374]. Kritik değerin t ile değil z ile bulunmasının nedeni budur. Lab hiçbir yerde örneklem çekmez: gördüğün her sayı, gösterilen denklemlerin kapalı biçimli değeridir. Yani okuduğun şey bir deneyin tek bir koşusu değil, modelin kendisidir.",
  credit: {
    inspiration: "Arş. Gör. Dolunay Ezgi Seyhan'ın çalışmasından esinlenilmiştir.",
    adaptation:
      "Bu etkileşimli lab, hocanın özgün hipotez testleri projesinden esinlenerek eğitim amacıyla geliştirilmiştir.",
    profile: "Akademik profili görüntüle →",
  },

  testType: {
    right: "μ > μ₀ (sağ kuyruk)",
    left: "μ < μ₀ (sol kuyruk)",
    two: "μ ≠ μ₀ (iki kuyruk)",
  },

  plot: {
    h0: "H₀",
    h1: "μ₁ (gerçek ortalama)",
    alphaTag: (value: string) => `α = ${value}`,
    betaTag: (value: string) => `Ret bölgesi dışı = ${value}`,
    summary: (
      mu0: string,
      mu1: string,
      se: string,
      criticals: string,
      alpha: string,
      beta: string,
      power: string,
    ) =>
      `Örneklem ortalamasının iki örnekleme dağılımı. H₀ altındaki dağılımın merkezi ${mu0}, gerçek ortalama μ₁ altındakinin merkezi ${mu1}; ikisinin de standart hatası ${se}. Ret bölgesi ${criticals} noktasında başlıyor. H₀ eğrisinin ret bölgesinde kalan alanı α = ${alpha}; μ₁ eğrisinin ret bölgesi dışında kalan alanı β = ${beta}. Testin gücü ${power}.`,
  },

  controls: {
    moreLabel: "Diğer ayarlar",
    note: "Her ayar aynı kuramsal modeli yeniden hesaplar. Rastgele örneklem çekilmez.",
    mu0: "μ₀: sıfır hipotezindeki ortalama",
    mu0Value: (value: string) => `μ₀ = ${value}`,
    mu1: "μ₁: gerçek ortalama",
    mu1Value: (value: string) => `μ₁ = ${value}`,
    sigma: "σ: evren standart sapması",
    sigmaValue: (value: string) => `σ = ${value}`,
    alpha: "α: anlamlılık düzeyi",
    alphaValue: (value: string) => `α = ${value}`,
    n: "n: örneklem büyüklüğü",
    nValue: (value: number) => `n = ${value}`,
  },

  separation: {
    title: "İki hipotezi karşılaştır",
    question: "μ₁, μ₀'dan uzaklaştıkça eğrilere ne olur?",
    caption:
      "Eğriler ham veriyi göstermez. Her eğri, ilgili ortalama (μ₀ ya da μ₁) gerçek ortalama olsaydı n gözlemin ortalamasının nasıl dağılacağını gösterir; yani X̄'in örnekleme dağılımıdır [Casella & Berger, 2. baskı, s. 213–214, 218].",
    mu1Label: "μ₁: gerçek ortalamayı değiştir",
    mu1Value: (value: string) => `μ₁ = ${value}`,
    mu1Hint: "Kaydırıcıyı μ₀'ın üzerinden geçirip öbür tarafa taşı. Eğrilerin örtüşmesine bak.",
    mu0Label: "μ₀",
    mu1Figure: "μ₁",
    gapLabel: "Uzaklık",
    gapHint: "standart hata cinsinden",
    announce: (mu1: string, gap: string) =>
      `μ₁ = ${mu1}. İki ortalama arasındaki uzaklık ${gap} standart hata.`,
  },

  alphaSection: {
    kicker: "Ret bölgesi nerede başlıyor",
    title: "Hangi sonuçlarda sıfır hipotezini reddederiz?",
    lede: "Testin bir karar kuralı vardır: X̄, μ₀'dan ne kadar uzağa düşerse H₀ reddedilir? H₀'ın reddedilmesine yol açan X̄ değerleri ret bölgesini oluşturur; Casella ve Berger bu bölgeye kritik bölge de der. Kritik değer, ret bölgesinin başladığı noktadır. Anlamlılık düzeyi α, μ = μ₀ iken X̄'in ret bölgesine düşme olasılığıdır [Casella & Berger, 2. baskı, Tanım 8.1.3, s. 374; Tanım 8.3.5–8.3.6, s. 385].",
    caption:
      "α veriden önce seçilir; bu yüzden α kaydırıcısı eğriyi değil kritik değeri taşır. H₀ doğruyken onu reddetmek I. tip hatadır; α bu hatanın olasılığıdır [Casella & Berger, 2. baskı, Bölüm 8.3.1, s. 382–383].",
    alphaLabel: "α: anlamlılık düzeyi",
    alphaValue: (value: string) => `α = ${value}`,
    alphaHint: "H₀ eğrisinin ret bölgesindeki taralı alanı tam olarak bu sayıdır.",
    alphaFigure: "α",
    criticalLabel: "Kritik değer",
    criticalHint: "μ₀ ± z·SE",
    criticalLeft: "Alt sınır",
    criticalRight: "Üst sınır",
    seLabel: "SE",
    seHint: "standart hata, σ/√n",
    oneSided: (value: string) =>
      `α'nın tamamı tek kuyrukta: H₀ dağılımının ${value} kadarı ret bölgesinde.`,
    twoSided: (half: string) =>
      `α iki kuyruğa bölünür: her kuyrukta ${half}. Bu yüzden iki yönlü testin kritik değerleri, tek yönlü testinkinden μ₀'a daha uzaktadır.`,
    announce: (alpha: string, criticals: string) => `α = ${alpha}. Kritik değer: ${criticals}.`,
  },

  betaSection: {
    kicker: "II. tip hata",
    title: "Gerçek bir farkı kaçırma olasılığı",
    lede: "α, H₀ doğruyken; β ise gerçek ortalama μ₁ iken hesaplanır. İkisi aynı kritik değerin iki yanındaki alanlardır: kritik değeri kaydırıp birini küçültürsen öbürü büyür. Bu yüzden testin yönü, kritik değerin yeri kadar önemlidir [Casella & Berger, 2. baskı, s. 385].",
    caption:
      "μ₁ alternatif hipotezin gösterdiği yöndeyse H₀'ı reddetme olasılığı testin gücüdür; reddetmeme olasılığı ise II. tip hata olasılığı β'dır. μ₁ ters yöndeyse ya da μ₀'a eşitse bu iki sayı yalnızca reddetme ve reddetmeme olasılıklarıdır.",
    testTypeLabel: "H₁ ne iddia ediyor?",
    mu1Label: "μ₁",
    mu1Value: (value: string) => `μ₁ = ${value}`,
    betaLabel: "H₀'ı reddetmeme olasılığı",
    betaHint: "μ₁ alternatif yöndeyse β",
    powerLabel: "H₀'ı reddetme olasılığı",
    powerHint: "μ₁ alternatif yöndeyse testin gücü",
    alphaLabel: "α",
    reading: (beta: string) =>
      `β = ${beta}: μ₁ eğrisinin bu kadarı ret bölgesinin dışında kalıyor. X̄ buraya düşerse H₀ reddedilemez.`,
    warning: {
      left: "Test μ < μ₀ durumunu arıyor, ama μ₁, μ₀'ın altında değil. μ₁ eğrisi ret bölgesinden uzakta kaldığı için X̄ neredeyse hiç ret bölgesine düşmüyor: β 1'e, güç 0'a yakın.",
      right:
        "Test μ > μ₀ durumunu arıyor, ama μ₁, μ₀'ın üstünde değil. μ₁ eğrisi ret bölgesinden uzakta kaldığı için X̄ neredeyse hiç ret bölgesine düşmüyor: β 1'e, güç 0'a yakın.",
    },
    announce: (beta: string, power: string) => `β = ${beta}. Güç = ${power}.`,
  },

  sampleSection: {
    kicker: "Örneklem büyüklüğünün etkisi",
    title: "Örneklem büyüdükçe hata olasılıkları nasıl değişir?",
    lede: "n arttıkça standart hata SE = σ/√n küçülür. α sabitken, μ₁ alternatif yöndeyse testin gücü artar. Gerçek ortalama μ₀'a eşitse reddetme olasılığı α'da kalır; μ₁ ters yöndeyse azalabilir.",
    caption:
      "X eksenini sabit tutup n'yi artır: iki eğri de daralır. Otomatik modda eksen eğrilere göre yeniden ölçeklenir. SE, n'nin kareköküyle ters orantılıdır; bu yüzden her ek gözlem SE'yi bir öncekinden daha az küçültür.",
    nLabel: "n: örneklem büyüklüğü",
    nValue: (value: number) => `n = ${value}`,
    formula: (se: string) => `SE = σ/√n = ${se}`,
    nFigure: "n",
    seLabel: "SE",
    seHint: "standart hata, σ/√n",
    powerLabel: "H₀'ı reddetme olasılığı",
    betaLabel: "H₀'ı reddetmeme olasılığı",
    curveTitle: "Örneklem büyüklüğüne göre H₀'ı reddetme olasılığı",
    eighty: "0,80",
    curveLabel: (from: number, to: number, first: string, last: string) =>
      `Diğer ayarlar sabitken n = ${from} ile n = ${to} arasında testin gücü. Yaklaşık ${first} değerinden başlıyor ve yaklaşık ${last} değerine ulaşıyor.`,
    announce: (n: number, se: string, power: string) => `n = ${n}. SE = ${se}. Güç = ${power}.`,
  },

  challenge: {
    kicker: "Görevler",
    title: "Hedeflenen test gücüne ulaş",
    lede: "İki görev var. Her biri bir kaydırıcının konumunu değil, ulaşılacak bir sonucu ister: ayarları değiştirerek testin gücünü hedef değere getir, α'yı görevin sınırının üstüne çıkarma.",
    puzzleLabel: "Görev",
    reset: "Başa dön",
    powerLabel: "Güç",
    alphaLabel: "α",
    seLabel: "SE",
    target: (value: string) => `hedef ${value}`,
    notYet: (power: string, target: string) => `Güç ${power}. Hedef: ${target}.`,
    alphaTooHigh: (max: string) => `α bu görevin sınırını aşıyor: en fazla ${max} olabilir.`,
    announceSolved: (power: string) => `Çözüldü. Güç = ${power}.`,
    announceAttempt: (power: string, alpha: string) => `Güç = ${power}, α = ${alpha}.`,
    puzzles: {
      "reach-power": {
        title: "0,80'e ulaş",
        brief: (power: string, alpha: string) =>
          `Etki gerçek ama küçük: μ₁, μ₀'ın yarım birim üstünde ve test bu farkı bulduğundan daha sık kaçırıyor. α'yı ${alpha} değerinin üstüne çıkarmadan testin gücünü ${power} değerine getir.`,
        lesson:
          "İki ayar da gücü artırır ama farklı bedellerle. α'yı büyütmek ret bölgesini genişletir; yani I. tip hata olasılığının artmasını kabul etmektir. n'yi büyütmek SE'yi küçültür ve α değişmeden β'yı düşürür [Casella & Berger, 2. baskı, s. 385].",
        solved: (power: string, alpha: string) =>
          `Güç ${power}, α = ${alpha}. n ve α'yı hangi birleşimle ayarlamış olursan ol, kritik değer SE'ye göre μ₀'a yeterince yaklaştı ve μ₁ eğrisinin büyük kısmı ret bölgesine düştü.`,
      },
      noisy: {
        title: "Büyük standart sapma",
        brief: (power: string, alpha: string) =>
          `σ = 3 ve test iki yönlü: α iki kuyruğa bölünüyor ve iki kritik değer de μ₀'dan epey uzakta. α en fazla ${alpha} olacak biçimde testin gücünü ${power} değerine getir.`,
        lesson:
          "İki yönlü test α'yı iki kuyruğa böler; bu yüzden her kritik değer, tek yönlü testinkinden μ₀'a daha uzaktadır. Tek yönlü test α'nın tamamını tek kuyruğa koyar: μ₁ o yöndeyse güç artar, değilse azalır [Casella & Berger, 2. baskı, s. 386].",
        solved: (power: string, alpha: string) =>
          `Güç ${power}, α = ${alpha}. σ'yı küçültmek ya da n'yi büyütmek SE'yi küçültür; tek yönlü test ise α'nın tamamını μ₁'in bulunduğu kuyruğa koyar.`,
      },
    },
  },

  recap: {
    lessons: [
      "α, μ = μ₀ iken X̄'in ret bölgesine düşme olasılığıdır: veriden önce seçilen I. tip hata olasılığı.",
      "β, μ = μ₁ iken X̄'in ret bölgesi dışına düşme olasılığıdır; testin gücü 1 − β'dır. İkisi de genel olarak \"bir etkiye\" göre değil, belirli bir μ₁ değerine göre hesaplanır.",
      "α sabitken ve μ₁ alternatif yöndeyken n arttıkça testin gücü artar. μ₁ ters yöndeyse reddetme olasılığı azalabilir.",
    ],
    footer:
      "Buradaki her şey σ'nın bilindiği kapalı biçimli normal modeldir: örneklem ortalamasının iki örnekleme dağılımı, tek bir ret bölgesi ve bu bölgenin sınırının iki yanındaki alanlar. Gerçek testlerde σ örneklemden tahmin edilir; t dağılımı bu yüzden gerekir. Test yönünün veriden önce mi sonra mı seçildiği de ayrı bir sorundur. Bu lab, bu ayrıntıların dayandığı geometriyi gösterir.",
  },
  sources: {
    title: "Kaynaklar",
    theoryLabel: "Kuramsal kaynak",
    theory:
      "George Casella ve Roger L. Berger, Statistical Inference, 2. baskı, Duxbury Press. Hipotez testleri, hata olasılıkları ve güç fonksiyonu için 8. bölüm (s. 373-386); örneklem ortalamasının örnekleme dağılımı için 5. bölüm (s. 213-218).",
    implementationLabel: "Uygulama ve esin kaynağı",
    implementation:
      "Sayısal model, Arş. Gör. Dolunay Ezgi Seyhan'ın özgün hipotez testleri projesinden aktarılmıştır. Bu etkileşimli uyarlamanın metinleri ve görsel tasarımı AI CLUB LABS'a aittir.",
    notation:
      "Gösterim: bu lab β'yı II. tip hata olasılığı, testin gücünü ise 1 − β olarak yazar; uygulamada yaygın gösterim budur. Casella ve Berger ise β(θ) ile doğrudan güç fonksiyonunu gösterir; yani onların β(θ) değeri buradaki 1 − β'ya karşılık gelir (Tanım 8.3.1, s. 383).",
    pages:
      "Sayfa numaraları, bu revizyonda kullanılan ikinci baskının basılı sayfalarına aittir. Yayın yılı, incelenen nüshadan doğrulanamadığı için verilmemiştir.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "İki eğri, aynı evren ortalaması hakkındaki iki iddiayı gösterir. μ₁'i değiştir ve iki eğrinin ne zaman birbirinden ayırt edilebildiğine bak.",
    stages: {
      separation: {
        curves:
          "Her eğri, o iddia (μ₀ ya da μ₁) doğruysa n gözlemin ortalamasının nasıl dağılacağını gösterir.",
        move: "Bu kaydırıcı μ₁'i taşır. Onu μ₀'ın üzerinden geçirip öbür tarafa çıkar.",
        gap: "İki ortalama arasındaki uzaklık, standart hata cinsinden. Uzaklık küçüldükçe eğriler üst üste biner.",
      },
      alpha: {
        region: "Taralı kuyruk ret bölgesidir: X̄ buraya düşerse H₀ reddedilir.",
        alpha:
          "Bu kaydırıcı α'yı, yani H₀ doğruyken onu reddetme olasılığını belirler. Tur α'yı yükseltti.",
        critical: "α büyüdükçe kritik değer μ₀'a yaklaşır ve ret bölgesi genişler.",
      },
      beta: {
        curves: "β, μ₁ eğrisinin ret bölgesi dışında kalan kısmıdır: testin kaçırdığı gerçek fark.",
        type: "Test yönünü değiştir. Tur yönü çevirdi; β'nın nasıl değiştiğine bak.",
        power: "β, testin gücü (1 − β) ve α yan yana.",
      },
      sample: {
        curves: "İki eğri ve bu örneklem büyüklüğünde ne kadar geniş oldukları.",
        n: "n arttıkça iki eğri de daralır. μ₁ alternatif yöndeyse testin gücü artar.",
        figures: "Daha büyük örneklem, α'yı artırmadan β'yı düşürür.",
      },
      challenge: {
        task: "Her görev bir sonuç ister: ulaşılacak bir güç değeri. Görevi yukarıdan seç.",
        controls: "Test yönünü, n'yi, α'yı ve σ'yı sen ayarlarsın.",
        power: "Testin şu anki gücü. Görevi geçmek için hedefe ulaş.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      alpha: "İki hipotez, α ve ret bölgesi",
      power: "β, testin gücü ve örneklem büyüklüğü",
    },
    notes: {
      "sq-hyptest": "Sıfır hipotezinin ne olduğu ve onu reddetmenin ne anlama geldiği.",
      "sq-althyp": "Alternatif hipotez: lab'daki öbür eğri.",
      "sq-power": "Testin gücü: gerçek bir farkı yakalama olasılığı.",
      "sq-power-analysis": "Belirli bir güç için kaç gözlem gerektiği.",
      "khan-power": "Güç, α ve β'nın birlikte anlatımı.",
      "openintro-stats": "Hipotez testi ve güç üzerine ücretsiz bir ders kitabı bölümü.",
    },
  },
};

export default copy;
