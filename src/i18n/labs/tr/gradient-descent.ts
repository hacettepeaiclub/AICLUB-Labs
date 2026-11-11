import type en from "../en/gradient-descent";

/** Türkçe metin: gradient-descent. Şekli `en/gradient-descent.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    momentum:
      "Laboratuvar\u0131n sundu\u011fu momentum y\u00f6ntemini ve bu y\u00f6ntemin t\u00fcredi\u011fi a\u011f\u0131r top g\u00fcncellemesini destekler.",
    adam: "Laboratuvarın sunduğu Adam optimizer’ı, motorun hesapladığı moment kestirimleri ve yanlılık düzeltmesi dahil olmak üzere destekler.",
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
    diverged: "Uzaklık sınırı aşıldı",
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
      "Topu bırakmak için haritaya dokun, yuvarlanmasını izlemek için bırak. Her adımı uzatıp kısaltmak için camgöbeği ucu sürükle.",
    mapHint:
      "Başlangıç noktasını koymak için haritaya dokun ya da sürükle, çalıştırmak için bırak; ok tuşları noktayı taşır, Enter çalıştırır.",
    handleLabel: "İlk adımın ucu. Adım boyunu değiştirmek için sürükle ya da ok tuşlarını kullan.",
    moreLabel: "Tam adım boyu ve adım adım denetimler",
    momentumHint:
      "Topun son adımından daha fazlasını korumasını sağlamak için kadranı çevir. Başka bir yere bırakmak için haritalardan birine dokun.",
  },
  find: {
    title: "En düşük noktayı bul",
    question: "Ne kadar büyük bir adım atabilirsin?",
    caption:
      "Camgöbeği ok, ölçeğine uygun çizilmiş ilk adımdır. Onu uzatınca bütün adımlar onunla birlikte büyür. Sayılardan çok yolun biçimine bak.",
  },

  direction: {
    kicker: "Neden o yön",
    title: "Gradyan hangi yönü gösterir?",
    lede: "Düz ok negatif gradyanı, −∇f = −(a·x, b·y), kesikli ok ise minimuma giden yönü, −(x, y), gösterir. Eğrilikler farklı olduğunda bu yönler genellikle ayrılır. Noktayı ve eğrilik oranını değiştirerek karşılaştır.",
    descent: "Adımın gittiği yön: −∇f",
    target: "Minimuma giden doğru",
    equalLength: "İki ok da aynı uzunlukta çiziliyor; karşılaştırılan tek şey yönleri.",
    angle: "Aralarındaki açı",
    angleHint: "0° iki yönün çakıştığı durumdur",
    aligned: "Burada eğrilikler eşit, dolayısıyla iki yön tam olarak çakışıyor.",
    apart: "Eğrilikler farklı; adım minimuma değil dik eksene doğru çekiliyor.",
    onAxis:
      "Koordinatlardan biri zaten sıfır, yani eşit olmayan ölçeklemenin etki edeceği bir şey yok. Okları ayırmak için noktayı eksenden çıkar.",
    dragHint:
      "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükle ya da haritaya odaklanıp",
    keyboardHint: "tuşlarını kullan; başa döndürmek için:",
    keyboardHelp:
      "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükle. Harita odaktayken ok tuşları noktayı taşır, Home tuşu ise başlangıç konumuna geri gönderir.",
    legendAndKeys: "Oklar ve klavye",
    label: (x: string, y: string, kappa: string, angle: string) =>
      `Taşınabilir noktası olan eşyükselti haritası. Nokta ${x}, ${y} konumunda. Koşul sayısı ${kappa}. İniş yönü, minimuma giden doğrudan ${angle} derece sapmış durumda.`,
    caption:
      "Eğrilik oranı 1 olduğunda oklar çakışır. Oran farklıyken, koordinat eksenleri dışındaki noktalarda negatif gradyan doğrudan minimumu göstermez.",
  },

  rate: {
    kicker: "Adım boyu",
    title: "Adım boyu ne zaman fazla gelir?",
    lede: "Aynı yüzeyde yalnız adım boyunu değiştir. Haritanın altındaki eşikler bu yüzeyin eğriliklerinden hesaplanır.",
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
      "Bu kuadratikte bütün başlangıçlar için yakınsama, 0 < η < 2 / max(a, b) koşuluyla garanti edilir. Dik koordinatın tam sıfır olduğu özel başlangıçlar sınırın üstünde de yakınsayabilir. Yüzeyin eğriliği değiştiğinde kullanılabilecek adım boyu da değişir.",
  },

  golf: {
    kicker: "Şimdi oynayın",
    title: "Kaç adımda hedefe ulaşabilirsin?",
    lede: "Altı farklı başlangıçta minimuma ulaşmaya çalış. Yönü negatif gradyan belirler. Seçtiğin sopa adım boyunu değiştirir.",
    caption:
      "Her vuruş, laboratuvarın geri kalanıyla aynı motorun hesapladığı tek bir sade gradient descent adımıdır. Par, her başlangıç noktası için elindeki altı sopanın aynısıyla arama yapılarak bulunur.",
    start: "Oyuna başla",
    again: "Yeni bir tur oyna",
    hit: (club: string) => `${club} ile vur`,
    playOut: (club: string) => `Tüm vuruşları ${club} ile oyna`,
    nextHole: "Sonraki delik",
    finish: "Skor kartını gör",
    out: "Saha dışı: bir ceza vuruşu ve top yerine kondu.",
    firstShot:
      "Bir sopa seçip vurun. Ok, topun hangi yöne gideceğini gösterir; ne kadar gideceği sopaya bağlıdır.",
    didNotFinish: "Bitiremedi.",
    holeLabel: (i: number, total: number) => `Delik ${i} / ${total}`,
    freeRule: "Her vuruşta istediğin sopa",
    fixedRule: "Bütün vuruşlar için tek sopa",
    mapLabel: (name: string, strokes: number) =>
      `${name}: deliğin eş yükselti haritası, şimdiye dek vuruş sayısı ${strokes}.`,
    clubLabel: "Sopa",
    clubs: {
      putter: "Putter",
      wedge: "Wedge",
      iron9: "Demir 9",
      iron5: "Demir 5",
      wood: "Ahşap",
      driver: "Driver",
    },
    shotLine: (n: number, club: string, eta: string, slope: string, distance: string) =>
      `${n}. ${club}: η ${eta} × eğim ${slope} = ${distance}`,
    results: { out: "saha dışı, +1", holed: "delikte" },
    figures: {
      par: "Par",
      strokes: "Vuruş",
      slope: "Eğim |∇f|",
      slopeHint: "sopa bunu çarpar",
      round: "Tur",
      best: "En iyi tur",
    },
    announce: {
      hole: (i: number, name: string, par: number) => `Delik ${i}: ${name}. Par ${par}.`,
      holed: (strokes: number) => `Delikte. Vuruş sayısı: ${strokes}.`,
      rolled: (strokes: number) => `Vuruş sayısı: ${strokes}.`,
      round: (score: string) => `Tur bitti. Par farkı: ${score}.`,
    },
    scoreNames: {
      holeInOne: "Tek vuruşta delik!",
      eagle: "Eagle.",
      birdie: "Birdie.",
      par: "Par.",
      bogey: "Bogey.",
      doubleBogey: "Çift bogey.",
      worse: "Parın epey üstünde.",
    },
    holeScore: (strokes: number, par: number) => `Vuruş: ${strokes}, par: ${par}.`,
    parLine: (clubs: string) => `Bu başlangıçtan par yolu: ${clubs}.`,
    fixedLine: (club: string, par: number) =>
      `Bu başlangıçtan en iyi tek sopa ${club} oldu. Vuruş sayısı: ${par}.`,
    fixedFail: (club: string) =>
      `${club} hiç ulaşamadı: ya η'sı 2 bölü dik eğriliğe eşit ya da ondan büyük, ya da vuruş sınırı içinde varamayacak kadar kısa.`,
    holes: {
      bowl: {
        name: "Kase",
        lesson:
          "Yuvarlak bir kasede eğim doğrudan deliği gösterir, bu yüzden tek bir sopa topu her yerden sokar: η'sı 1 bölü eğrilik olan, burada 1/2. Bunun iki katı topu ayna noktasına indirir; daha fazlası topu her seferinde daha uzağa savurur.",
      },
      oval: {
        name: "Oval",
        lesson:
          "Kaseyi uzatınca eğim artık deliği göstermez. Her yön kendi çarpanıyla, 1 − η·c ile küçülür; dik yönü yatıştıran sopa topu yatık yönde neredeyse hiç ilerletmez ve tek vuruş artık yetmez.",
      },
      ravine: {
        name: "Yarık",
        lesson:
          "Yarığın enine eğrilik 20'dir, bu yüzden wedge, yani η = 1/20, topu tam tabana indirir. Oradan eğim yarık boyunca uzanır ve uzun bir sopa işi bitirir. η = 2/20'de dik yön küçülmeyi bırakır; bunun ötesinde top sahadan uçar.",
      },
      valley: {
        name: "Uzun Vadi",
        lesson:
          "Hiçbir sopa topu bu tabana tam indirmez. Uzun bir vuruş, vadinin enine kalan her şeyi 1 − η·18 ile çarpar; bu yüzden uzun sopa güvenli hâle gelmeden önce dik yön kısa sopalarla küçültülmelidir.",
      },
      oneClub: {
        name: "Tek Sopa",
        lesson:
          "Her vuruş için tek sopa, sabit bir adım boyudur. 2 bölü en dik eğrilikten küçük kalmak zorundadır, bu yüzden yatık yönde sürünür: bu, 2. delikle aynı yüzeydir ve kat kat fazla vuruş ister.",
      },
      oneClubNarrow: {
        name: "Tek Sopa, Dar",
        lesson:
          "Daha da dar bir yüzey ve vuruş sayısı yine artar. Tek bir adım boyuyla sınırı dik yön koyar, bedelini yatık yön öder. Sonraki iki bölümdeki momentum ve Adam, bundan çıkmanın iki yoludur.",
      },
    },
    scorecard: { title: "Skor kartı", hole: "Delik", par: "Par", you: "Sen" },
    intro: {
      kicker: "Saha",
      story:
        "Top parametrelerdir, delik de minimum. Nişan almazsın: her vuruş yokuş aşağı, tam −∇f doğrultusunda gider. Seçtiğin tek şey sopadır ve bir sopa, bir adım boyudur.",
      rules: [
        "Bir vuruş topu η çarpı altındaki eğim kadar ilerletir. Dik zemin onu uzağa yollar; deliğe yakın neredeyse kıpırdamaz.",
        "Haritadan çıkmak saha dışıdır: bir ceza vuruşu ve top geri gelir.",
        "Her turda başlangıç noktaları yenidir. Par her biri için elindeki sopaların aynısıyla arama yapılarak hesaplanır, yani her zaman ulaşılabilir.",
        "Son iki delik size bütün vuruşlar için tek sopa verir; sabit adım boylu bir optimizer da tam böyle çalışır.",
      ],
    },
    end: {
      kicker: "Tur",
      relative: "Par farkı: E eşit demektir, eksi par altıdır.",
      newBest: "Bu tarayıcıdaki yeni rekorun.",
      takeaways: [
        "Her vuruşun yönünü eğim seçti, yalnızca η'yı seçtin. Gidilen mesafe η çarpı eğimdi; aynı sopanın duvarlarda uçup deliğe yakın sürünmesinin nedeni budur.",
        "Her yön kendi eğriliği c için 1 − η·c ile çarpılır. η = 1/c'de tabana iner, 2/c'de ayna noktasına seker, ötesinde sahadan çıkar. Tavanı en dik yön belirler.",
        "Her vuruşta sopa seçmek, herhangi tek bir sopadan iyi sonuç verdi. Sade bir optimizer'ın her adım için tek bir adım boyu vardır; kötü koşullu bir yüzey ona vuruş kaybettirir. Sonraki iki bölüm bunları geri kazanmakla ilgilidir.",
      ],
    },
  },

  momentumSection: {
    kicker: "Momentum",
    title: "Momentum bir sonraki adımı nasıl etkiler?",
    lede: "Momentum, önceki gradyanların etkisini bir hız değişkeninde tutar: v ← β·v + ∇f, ardından θ ← θ − η·v. β’yı değiştir ve aynı başlangıçtan yapılan iki çalıştırmayı karşılaştır.",
    marks: { plain: "düz sınır", momentum: "momentum sınırı" },
    caption:
      "Kararlılık koşulu η·max(a,b) < 2(1+β) olur; bu, düz inişin η·max(a,b) < 2 koşulundan daha geniştir. Yani momentum, düz inişin taşıyamayacağı kadar büyük bir adım boyunu taşıyabilir. Bu aralığın bedeli salınımdır. Adım boyunu sabit tutup β'yı yükselt: çalışma önce kısalır, belli bir noktadan sonra yeniden uzar.",
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
    title: "Her parametre için ayrı adım boyu",
    lede: "Adam, gradyanların ve karelerinin hareketli ortalamalarını kullanır. Başlangıç yanlılığı düzeltildikten sonra güncelleme η·m̂ / (√ŝ + ε) olarak hesaplanır. Her koordinatın adımı bu değerlerle ölçeklenir.",
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
      "Adam her yüzeyde daha hızlı yakınsamaz. Bu labdaki κ = 60 vadisinde, taranan ayarlar içinde Adam 17 adımda, momentum yaklaşık 10 adımda aynı toleransa ulaşır. Adam için η = 0,10 seçildiğinde 66 adım gerekir. Yöntem kadar adım boyu seçimi de sonucu etkiler.",
  },

  challenge: {
    kicker: "Üç soru",
    title: "Aynı adım sayısıyla hangi yöntem daha ileri gider?",
    lede: "Her görevde yüzey, başlangıç noktası ve adım sınırı sabittir. Verilen adım sayısı içinde hedef toleransa ulaşan ayarları bul.",
    puzzle: "Soru",
    budget: (n: number) => `${n} adım`,
    goal: (budget: number, tolerance: string) =>
      `Hedef: ${budget} adım içinde amaç değeri ≤ ${tolerance}.`,
    progress: (done: number, total: number) => `${total} görevden ${done} tanesi çözüldü`,
    pressRun:
      "Bu denemenin sonucunu görmek için Çalıştır'a bas ya da adım kaydırıcısını sona sürükle.",
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
        "Yol çizim için belirlenen uzaklık sınırını aştı. Başlangıç ve adım boyunu kontrol et.",
    },
    transfer: {
      title: "Aynı sayı, daha yumuşak bir yüzeyde",
      divergesHereConvergesThere: (
        rate: string,
        limitHere: string,
        limitThere: string,
        steps: number,
      ) =>
        `η = ${rate}, bu yüzeyin ${limitHere} olan kararlılık sınırının üzerinde; bu yüzden bütün başlangıçlar için yakınsama garantisi yok. Daha yumuşak yüzeyin sınırı ${limitThere} ve tam olarak aynı η orada ${steps} adımda yerleşiyor. Değişen adım boyu değil, yüzeydi.`,
      worksOnBoth: (steps: number) =>
        `Bu η iki yüzeyde de yakınsıyor: burada ve daha yumuşak olanda ${steps} adımda. Yukarı doğru itin ve hangisinin önce pes ettiğine bak.`,
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
          "Bu, kararlılık sınırının üzerinde başlıyor ve ilk Çalıştır'da patlıyor. İşe yarayan bir adım boyu bul: sonra aynı sayının daha yumuşak bir yüzeyde ne yaptığına bak.",
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
      "Bu lab ikinci dereceden konveks yüzeyler kullanır; eğrilik sabittir ve gradyan tam hesaplanır. Büyük modellerde bu koşullar genellikle sağlanmaz. Buradaki karşılaştırmalar, yüzey ile adım boyu arasındaki ilişkiyi gösterir.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Haritaya bir nokta bırak. Adım boyunu değiştir ve negatif gradyan yönündeki hareketin minimuma yaklaşıp yaklaşmadığını incele.",
    stages: {
      find: {
        map: "Yukarıdan bakılan yüzey bu. Camgöbeği ok, ilk adımın gerçek boyutu.",
        step: "Bu kaydırıcı adım boyunu belirler. Tur adımı uzattı.",
        run: "Çalıştır: nokta yokuş aşağı adım adım iner. Fazla uzun bir adım hedefi aşar ve noktayı savurabilir.",
        figures:
          "Atılan adım sayısı, ulaşılan yükseklik ve koşunun oturup oturmadığı. Haritadaki okun ucunu da sürükleyebilirsin.",
      },
      direction: {
        arrows:
          "Düz ok, adımın gerçekte gittiği yön. Kesikli ok, minimuma giden düz çizgi. Noktayı haritada istediğin yere sürükle.",
        curvature:
          "Bu kaydırıcı bir yönü diğerinden daha dik yapar. Tur ikisini çok farklılaştırdı.",
        angle: "İki ok arasındaki açı. Yalnızca eğrilikler eşitken 0° olur.",
      },
      rate: {
        map: "Aynı fikir, daha dik bir yüzeyde; haritanın yanında kaybın zamanla değişimi var.",
        rate: "Adım boyunu ayarla. Tur onu ilk işaretin ötesine itti.",
        run: "Çalıştır ve yolu haritanın altında yazan rejimle karşılaştır.",
        marks:
          "İki işaret bu yüzeyin eğriliğinden hesaplanır: ikincisinin ötesinde her adım boyu dağılır.",
      },
      golf: {
        course: "Altı delik. Nişan alamazsın; her vuruşun yönüne eğim karar verir.",
        start: "Bir tur başlat.",
        club: "Bir sopa seç; her sopa bir adım boyu. Tur ortadakilerden birini aldı.",
        hit: "Vurun. Fazla kısa olursa çok vuruş gerekir; fazla uzun olursa top saha dışına uçar.",
        score: "Deliğin parı, vuruş sayın ve topun altındaki eğim.",
      },
      momentum: {
        map: "Uzun ve dar bir vadi: düz gradient descent onu zikzak çizerek geçer.",
        beta: "β'yı, yani son adımın ne kadarının aktarıldığını artır. Kadranı sürükle ya da ok tuşlarını kullan.",
        run: "Çalıştır: hep aynı yöne iten adımlar birikir, zikzaklar birbirini götürür.",
        figures: "Ulaşılan yükseklik ve oturup oturmadığı. β fazla olursa bu kez hedefi aşar.",
      },
      adam: {
        map: "Adam her parametreye kendi adım boyunu verir; o parametrenin gradyan geçmişine göre ölçeklenmiş.",
        rate: "Adım boyunu buradan ayarla.",
        run: "Çalıştır ve haritadaki yolu takip edin.",
        steps: "Yeterince yaklaşmak için kaç adım gerektiği ve diğer değerler.",
      },
      challenge: {
        map: "Her bulmacada yüzey, başlangıç ve adım bütçesi sabit. Bulmacayı haritanın üstünden seç.",
        settings: "Optimizer'ı ve ayarlarını seçersin.",
        run: "Çalıştır. Geç varmak geçer not değil.",
        status: "Kullanılan adımlar, ulaşılan yükseklik ve sonuç.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      downhill: "Adım adım yokuş aşağı",
      ceiling: "Adım boyu tavanı ve koşul sayısı",
      momentum: "Momentum ve Adam",
    },
    notes: {
      "3b1b-gd": "Negatif gradyanın yokuş aşağı yön olması.",
      "sq-gd": "Adım boyu dahil, elle çözülmüş gradient descent.",
      "distill-momentum":
        "Etkileşimli: en büyük kararlı adımın neden eğriliğe bağlı olduğu ve κ'nın etkisi.",
      "ng-momentum": "Gradyanların hareketli ortalaması ve zikzakın neden söndüğü.",
      "ng-adam": "Her parametreye kendi geçmişine göre ölçeklenmiş bir adım boyu.",
      "d2l-gradient-book":
        "Öğrenme oranının yakınsamayı nasıl etkilediğini tek ve çok değişkenli örneklerle incele. Türev ve vektör bilgisi gerektirir; labdaki adımları formüllerle takip etmek için uygun.",
    },
  },
};

export default copy;
