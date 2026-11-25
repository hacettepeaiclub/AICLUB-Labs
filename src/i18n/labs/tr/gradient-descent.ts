import type en from "../en/gradient-descent";

/** Türkçe metin: gradient-descent. Şekli `en/gradient-descent.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    momentum:
      "Momentum güncellemesinin ve önceki hızın nasıl kullanıldığının matematiksel açıklaması.",
    adam: "Adam güncellemesinde momentlerin hesabı ve başlangıç yanlılığının düzeltilmesi.",
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
    betaValue: (value: string) => `Momentum katsayısı ${value}`,
    curvature: "Koşul sayısı κ",
    curvatureValue: (value: string) => `Koşul sayısı ${value}`,
    optimizer: "Yöntem",
    resetPoint: "Başlangıç noktasına dön",
    aboutThisSurface: "Bu yüzey hakkında",
    stepSizeAndScale: "Adım boyu",
  },

  optimizers: {
    gd: "Gradient Descent",
    momentum: "Momentum",
    adam: "Adam",
  },

  status: {
    ready: "Hazır",
    paused: "Duraklatıldı",
    running: "Çalışıyor",
    converged: "Hedefe ulaştı",
    diverged: "Uzaklık sınırı aşıldı",
    exhausted: "Adımlar tükendi",
  },

  figures: {
    step: "Adım",
    objective: "Amaç değeri",
    objectiveHint: "f fonksiyonunun bu noktadaki değeri",
    gradientNorm: "Gradyan büyüklüğü",
    position: "Konum",
    status: "Sonuç",
    conditionNumber: "Koşul sayısı",
    conditionNumberHint: "κ = büyük eğrilik ÷ küçük eğrilik",
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
      "Başlangıç noktasını haritada seç. Adım boyunu değiştirmek için camgöbeği okun ucunu sürükle.",
    mapHint:
      "Başlangıç noktasını seçmek için haritaya dokun veya noktayı sürükle. Bıraktığında hareket başlar. Klavyede ok tuşları noktayı taşır, Enter hareketi başlatır.",
    handleLabel:
      "İlk adımı gösteren okun ucu. Adım boyunu değiştirmek için sürükle veya ok tuşlarını kullan.",
    moreLabel: "Tam adım boyu ve adım adım denetimler",
    momentumHint:
      "Önceki hızın etkisini artırmak için β kadranını çevir. Başlangıç noktasını değiştirmek için iki haritadan birine dokun.",
  },
  find: {
    title: "Minimuma yaklaş",
    question: "Adım boyunu artırınca izlenen yol nasıl değişir?",
    caption:
      "Camgöbeği ok ilk adımı ölçeğiyle gösterir. Oku uzat ve noktanın minimumu geçip geçmediğine bak.",
  },

  direction: {
    kicker: "Adımın yönü",
    title: "Gradyan hangi yönü gösterir?",
    lede: "Sürekli çizgili ok negatif gradyanı, −∇f = −(a·x, b·y), kesikli ok ise minimuma giden yönü, −(x, y), gösterir. Eğrilikler farklı olduğunda bu yönler genellikle ayrılır. Noktayı ve koşul sayısını değiştirerek karşılaştır.",
    descent: "Adımın gittiği yön: −∇f",
    target: "Minimumun yönü",
    equalLength: "Yönleri karşılaştırabilmen için iki ok aynı uzunlukta çizilir.",
    angle: "Aralarındaki açı",
    angleHint: "0° iki yönün çakıştığı durumdur",
    aligned: "Burada eğrilikler eşit, dolayısıyla iki yön tam olarak çakışıyor.",
    apart:
      "Eğrilikler farklı. Negatif gradyan, eğriliğin büyük olduğu eksene daha yakın bir yön gösteriyor.",
    onAxis:
      "Bir koordinat sıfır olduğunda iki ok da aynı eksen üzerindedir. Yönlerin ayrılması için noktayı eksenden uzaklaştır.",
    dragHint:
      "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükle ya da haritaya odaklanıp",
    keyboardHint: "tuşlarını kullan; başa döndürmek için:",
    keyboardHelp:
      "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükle. Harita odaktayken ok tuşları noktayı taşır, Home tuşu ise başlangıç konumuna geri gönderir.",
    legendAndKeys: "Oklar ve klavye",
    label: (x: string, y: string, kappa: string, angle: string) =>
      `Taşınabilir noktası olan eşyükselti haritası. Nokta ${x}, ${y} konumunda. Koşul sayısı ${kappa}. İniş yönü, minimuma giden doğru çizgiden ${angle} derece sapmış durumda.`,
    caption:
      "Koşul sayısı κ 1 olduğunda oklar çakışır. Oran farklıyken, koordinat eksenleri dışındaki noktalarda negatif gradyan doğrudan minimumu göstermez.",
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
      monotone:
        "0 < η ≤ 1/max(a, b) olduğunda iki koordinat da işaret değiştirmeden sıfıra yaklaşır.",
      oscillating:
        "Eğriliği büyük olan eksende koordinat her adımda işaret değiştirir. Mutlak değeri giderek küçülür.",
      boundary:
        "Eğriliği büyük olan eksende koordinat her adımda işaret değiştirir. Mutlak değeri sabit kalır.",
      divergent:
        "Eğriliği büyük olan eksende sıfırdan farklı bir koordinatın mutlak değeri her adımda büyür.",
    },
    scope:
      "Bu eşikler burada kullanılan ikinci dereceden fonksiyon için tam geçerlidir; onun eğriliği her noktada aynıdır. Eğriliğin konuma göre değiştiği yerde kullanılabilir adım boyu da onunla değişir.",
    caption:
      "Bu kuadratikte bütün başlangıçlar için yakınsama, 0 < η < 2 / max(a, b) koşuluyla garanti edilir. Dik koordinatın tam sıfır olduğu özel başlangıçlar sınırın üstünde de yakınsayabilir. Yüzeyin eğriliği değiştiğinde kullanılabilecek adım boyu da değişir.",
  },

  golf: {
    kicker: "Golf",
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
      "Bir sopa seç ve vur. Ok vuruşun yönünü gösterir. Vuruşun uzunluğu seçtiğin sopaya ve gradyanın büyüklüğüne bağlıdır.",
    didNotFinish: "Bitiremedi.",
    holeLabel: (i: number, total: number) => `Delik ${i} / ${total}`,
    freeRule: "Her vuruşta istediğin sopa",
    fixedRule: "Bütün vuruşlar için tek sopa",
    mapLabel: (name: string, strokes: number) =>
      `${name}: deliğin eşyükselti haritası, şimdiye dek vuruş sayısı ${strokes}.`,
    clubLabel: "Sopa",
    clubs: {
      putter: "Putter",
      wedge: "Wedge",
      iron9: "Demir 9",
      iron5: "Demir 5",
      wood: "Wood",
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
          "İki eksende de eğrilik 2. η = 1/2 ile top herhangi bir başlangıç noktasından tek vuruşta deliğe gider. η = 1 ile karşı noktaya geçer. Daha büyük η değerlerinde delikten uzaklaşır.",
      },
      oval: {
        name: "Oval",
        lesson:
          "Eğrilikler farklı olduğunda her koordinat kendi 1 − η·c çarpanıyla güncellenir. Eğriliği büyük olan eksende işe yarayan bir sopa, diğer eksende küçük bir ilerleme sağlayabilir.",
      },
      ravine: {
        name: "Yarık",
        lesson:
          "Yarığın enine eğriliği 20. η = 1/20 olan sopayla enine koordinatı sıfırla. Sonraki vuruşta hareket yarık boyunca sürer. η = 2/20 iken enine koordinat işaret değiştirir ve mutlak değeri sabit kalır.",
      },
      valley: {
        name: "Uzun Vadi",
        lesson:
          "Bu sopaların hiçbiri enine koordinatı bir adımda sıfırlamaz. Uzun vuruşlarda enine koordinat 1 − η·18 ile çarpılır. Uzun sopaya geçmeden önce kısa vuruşlarla enine uzaklığı azalt.",
      },
      oneClub: {
        name: "Tek Sopa",
        lesson:
          "Bu delik ikinci delikle aynı yüzeyi kullanır. Sabit adım boyunu, büyük eğriliğin belirlediği sınırın altında seçince küçük eğrilikli eksende ilerleme yavaş kalabilir.",
      },
      oneClubNarrow: {
        name: "Tek Sopa, Dar",
        lesson:
          "Bu yüzeyde eğriliklerin oranı daha büyük. Sabit adım boyunda büyük eğrilik kararlılık sınırını belirler. Sonraki bölümlerde momentum ve Adam ile izlenen yolları karşılaştır.",
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
        "Son iki delikte bir sopa seç ve bütün vuruşlarda onu kullan. Böylece adım boyu tur boyunca sabit kalır.",
      ],
    },
    end: {
      kicker: "Tur",
      relative: "Par farkı: E eşit demektir, eksi par altıdır.",
      newBest: "Bu tarayıcıdaki yeni rekorun.",
      takeaways: [
        "Her vuruş negatif gradyan yönünde, η·|∇f| kadar ilerledi. Gradyan küçüldükçe aynı sopayla gidilen mesafe de kısaldı.",
        "Eğriliği c olan eksendeki koordinat 1 − η·c ile çarpılır. η = 1/c için koordinat sıfıra iner. η = 2/c için yalnızca işareti değişir. Sınırın üstünde sıfırdan farklı koordinatın mutlak değeri artar.",
        "Skor kartında tek sopa kullandığın deliklerin vuruş sayılarını karşılaştır. Eğrilikler arasındaki fark, sabit adım boyuyla hedefe ulaşmayı yavaşlatabilir.",
      ],
    },
  },

  momentumSection: {
    kicker: "Momentum",
    title: "Momentum bir sonraki adımı nasıl etkiler?",
    lede: "Momentum, önceki gradyanların etkisini bir hız değişkeninde tutar: v ← β·v + ∇f, ardından θ ← θ − η·v. β'yı değiştir ve aynı başlangıçtan yapılan iki çalıştırmayı karşılaştır.",
    marks: { plain: "momentumsuz sınır", momentum: "momentum sınırı" },
    caption:
      "Kararlılık koşulu η·max(a,b) < 2(1+β) olur; bu, momentumsuz gradient descent'in η·max(a,b) < 2 koşulundan daha geniştir. Yani momentum, momentumsuz gradient descent'in taşıyamayacağı kadar büyük bir adım boyunu taşıyabilir. Bu aralığın bedeli salınımdır. Adım boyunu sabit tutup β'yı yükselt: çalışma önce kısalır, belli bir noktadan sonra yeniden uzar.",
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
      `Bir eksende eğrilik ${a}, diğerinde ${b}. Gradyanın iki bileşeni arasında yaklaşık bir milyon kat fark var. Aşağıdaki her sayı, ilgili yöntemin ilk adımı hesaplanarak elde edilir.`,
    tableCaption:
      "Her eksende gradyan büyüklüğü ve ilk adımın boyutu; gradient descent ve Adam için.",
    colQuantity: "Büyüklük",
    colX: "Dik eksen",
    colY: "Düz eksen",
    rowGradient: "Gradyan büyüklüğü",
    rowGd: (rate: string) => `Gradient descent adımı, η = ${rate}`,
    rowAdam: (rate: string) => `Adam adımı, η = ${rate}`,
    firstStepNote:
      "Başlangıç yanlılığı düzeltildikten sonra ilk güncelleme η·g ÷ (|g| + ε) hâline gelir. Gradyanın büyüklüğü sadeleşir ve iki eksen de yaklaşık η kadar hareket eder: düzeltmenin atlanmayıp gerçekten uygulanmasının nedeni budur.",
    rate: "Adam adım boyu η",
    honesty:
      "Adam her yüzeyde daha hızlı yakınsamaz. Bu lab'daki κ = 60 vadisinde, taranan 300 adım boyu içinde Adam'ın en iyi sonucu 17 adımdır. İyi seçilmiş bir momentum ayarı aynı toleransa yaklaşık 10 adımda ulaşır. Adam için η = 0,10 seçildiğinde 66 adım gerekir. Yöntem kadar adım boyu seçimi de sonucu etkiler.",
  },

  challenge: {
    kicker: "Üç soru",
    title: "Hedefe kaç adımda ulaşırsın?",
    lede: "Her soruda yüzey, başlangıç noktası ve adım sınırı sabittir. Verilen adım sayısı içinde hedef toleransa ulaşan ayarları bul.",
    puzzle: "Soru",
    budget: (n: number) => `${n} adım`,
    goal: (budget: number, tolerance: string) =>
      `Hedef: ${budget} adım içinde amaç değeri ≤ ${tolerance}.`,
    progress: (done: number, total: number) => `${total} sorudan ${done} tanesi çözüldü`,
    pressRun:
      "Bu denemenin sonucunu görmek için Çalıştır'a bas ya da adım kaydırıcısını sona sürükle.",
    pass: "Çözüldü.",
    notYet: "Henüz değil.",
    optimizerAndSettings: "Yöntem ve ayarlar",
    boundaryHint: (limit: string, kappa: string) =>
      `Bu ayarlar için kararlılık sınırı: ${limit}. Koşul sayısı κ = ${kappa}.`,
    verdicts: {
      solved: (steps: number, budget: number) =>
        `${budget} adımlık bütçenin içinde, ${steps} adımda hedefe ulaşıldı.`,
      overBudget: (steps: number, budget: number) =>
        `Hedefe varıyor ama ${steps} adımda; bütçe ise ${budget}.`,
      stalled: (budget: number) => `Bu, hedefe hiç ulaşmıyor. Bütçe ${budget} adım.`,
      diverged:
        "Çalıştırma uzaklık sınırını aştı veya sonlu olmayan bir değere ulaştı. Adım boyunu küçültüp aynı noktadan yeniden çalıştır.",
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
        `Bu η iki yüzeyde de yakınsıyor: burada ve daha yumuşak olanda ${steps} adımda. Adım boyunu artır ve hangi yüzeyde önce yakınsama koşulunun bozulduğuna bak.`,
      worksOnNeither:
        "Bu η, izin verilen adım sayısı içinde hiçbir yüzeyde hedefe ulaşmıyor. Sorun büyük olması değil, küçük olması.",
      mapLabel: (rate: string, status: string, steps: number) =>
        `Daha yumuşak yüzeyin ${rate} adım boyuyla çalıştırılmış eşyükselti haritası. ${steps} adım sonra ${status}.`,
    },
    items: {
      c1: {
        title: "Tam nokta",
        brief:
          "Momentumsuz gradient descent ile verilen adım sayısı içinde hedefe ulaştıran η değerini bul.",
      },
      c2: {
        title: "Fazla büyük",
        brief:
          "İlk ayar kararlılık sınırının üzerinde. Çalıştırdıktan sonra daha küçük bir η seç ve aynı değeri eğriliği daha küçük olan yüzeyde dene.",
      },
      c3: {
        title: "Dar vadi",
        brief:
          "κ = 60 olan bu vadide momentumsuz gradient descent hiçbir adım boyuyla verilen adım sayısı içinde hedefe ulaşamaz. Momentum veya Adam ile dene.",
      },
    },
  },

  recap: {
    lessons: [
      "Negatif gradyan yokuş aşağıyı gösterir, minimumu değil. Eksenlerin dışında ikisi ancak eğrilik her yönde aynıyken çakışır.",
      "Bu ikinci dereceden yüzeyde kararlılık sınırı 2/max(a, b). Adım boyu sınırın yarısını geçtiğinde eğriliği büyük olan eksende minimum aşılır. Sınır geçildiğinde o eksendeki sıfırdan farklı koordinat büyüyerek salınır.",
      "Koşul sayısı κ, büyük eğriliğin küçük eğriliğe oranıdır. Bu oran büyüdüğünde büyük eğriliğe göre seçilen adım boyuyla diğer eksende ilerleme yavaş kalabilir.",
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
          "Adım sayısına, amaç değerine ve sonuç etiketine bak. Adım boyunu değiştirmek için haritadaki okun ucunu sürükle.",
      },
      direction: {
        arrows:
          "Sürekli çizgili ok, adımın gerçekte gittiği yön. Kesikli ok, minimuma giden düz çizgi. Noktayı haritada istediğin yere sürükle.",
        curvature:
          "Bu kaydırıcı bir yönü diğerinden daha dik yapar. Tur ikisini çok farklılaştırdı.",
        angle: "Oklar aynı yönü gösterdiğinde açı 0° olur. Noktayı bir eksene getirip dene.",
      },
      rate: {
        map: "Haritada adımların izini, yanındaki grafikte amaç değerinin adım adım değişimini gör.",
        rate: "Adım boyunu ayarla. Tur onu ilk işaretin ötesine itti.",
        run: "Çalıştır ve izlenen yolu haritanın altındaki açıklamayla karşılaştır.",
        marks:
          "İlk işaret minimumun aşılmaya başladığı eşiği gösterir. İkinci işaret kararlılık sınırıdır.",
      },
      golf: {
        course: "Altı delik. Nişan alamazsın; her vuruşun yönüne eğim karar verir.",
        start: "Bir tur başlat.",
        club: "Bir sopa seç; her sopa bir adım boyu. Tur ortadakilerden birini aldı.",
        hit: "Vur. Küçük bir adım boyuyla daha çok vuruş gerekebilir. Büyük bir adım boyuyla top saha dışına çıkabilir.",
        score: "Deliğin parı, vuruş sayın ve topun altındaki eğim.",
      },
      momentum: {
        map: "Uzun ve dar bir vadi: momentumsuz gradient descent onu zikzak çizerek geçer.",
        beta: "β'yı, yani son adımın ne kadarının aktarıldığını artır. Kadranı sürükle ya da ok tuşlarını kullan.",
        run: "Çalıştır: hep aynı yöne iten adımlar birikir, zikzaklar birbirini götürür.",
        figures: "Amaç değerini ve hedefe kaç adımda ulaşıldığını karşılaştır.",
      },
      adam: {
        map: "Adam her parametreye kendi adım boyunu verir; o parametrenin gradyan geçmişine göre ölçeklenmiş.",
        rate: "Adım boyunu buradan ayarla.",
        run: "Çalıştır ve haritadaki yolu izle.",
        steps: "Yeterince yaklaşmak için kaç adım gerektiği ve diğer değerler.",
      },
      challenge: {
        map: "Her soruda yüzey, başlangıç noktası ve adım sınırı sabit. Soruyu haritanın üstünden seç.",
        settings: "Yöntemi ve ayarlarını seç.",
        run: "Çalıştır ve amaç değerinin verilen adım sayısı içinde hedefe ulaşıp ulaşmadığına bak.",
        status: "Adım sayısını, amaç değerini ve sonucu karşılaştır.",
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
        "Öğrenme oranının (bu lab'daki adım boyunun) yakınsamayı nasıl etkilediğini tek ve çok değişkenli örneklerle incele. Türev ve vektör bilgisi gerektirir; lab'daki adımları formüllerle takip etmek için uygun.",
    },
  },
};

export default copy;
