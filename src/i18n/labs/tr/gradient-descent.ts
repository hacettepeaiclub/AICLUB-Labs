import type en from "../en/gradient-descent";

/** Türkçe metin: gradient-descent. Şekli `en/gradient-descent.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
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
    instruction:
      "Topu bırakmak için haritaya dokunun, yuvarlanmasını izlemek için bırakın. Her adımı uzatıp kısaltmak için camgöbeği ucu sürükleyin.",
    mapHint:
      "Başlangıç noktasını koymak için haritaya dokunun ya da sürükleyin, çalıştırmak için bırakın; ok tuşları noktayı taşır, Enter çalıştırır.",
    handleLabel:
      "İlk adımın ucu. Adım boyunu değiştirmek için sürükleyin ya da ok tuşlarını kullanın.",
    moreLabel: "Tam adım boyu ve adım adım denetimler",
    momentumHint:
      "Topun son adımından daha fazlasını korumasını sağlamak için kadranı çevirin. Başka bir yere bırakmak için haritalardan birine dokunun.",
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
};

export default copy;
