import type en from "../en/reinforcement-learning";

/** Türkçe metin: reinforcement-learning. Şekli `en/reinforcement-learning.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    qLearning:
      "Tablo tabanlı Q-learning güncelleme kuralını ve yakınsama koşullarını açıklar. Oda, ödüller ve ayarlanabilen işaretli kare bu lab'a aittir.",
  },

  room: {
    title: "Ajanın hareket alanı",
    question:
      "Ajan, ödüllere göre hareket etmeyi öğreniyor. Ödülü değiştirince çıkışa giden yol nasıl değişir?",
    sliderLabel: "İşaretli kareye girme ödülü",
    sliderValue: (value: string) => `İşaretli kareye girme ödülü ${value}`,
    hint: "Ödülü kaydırıcıdan değiştir. Her değişiklikte Q tablosu sıfırdan öğrenilir.",
    wow: "Kareye tekrar tekrar girmenin getirisi, kapıya gidip turu bitirmenin getirisini aşabilir.",
    behaviour: {
      avoided: "Kareye basmamak için uzun yoldan dolandı ve kapıya ulaştı.",
      passed: "Yolu üzerinde kareye basarak geçti ve kapıya ulaştı.",
      stayed: "İşaretli kareye tekrar girdi ve hamle sınırı içinde kapıya ulaşmadı.",
    },
    readout: (steps: number, visits: number) => `${steps} hamle · kareye ${visits} kez bastı`,
    mapLabel: (behaviour: string, steps: number, visits: number, at: number) =>
      `Yukarıdan görünen küçük bir oda. ${behaviour} Toplam ${steps} hamle, işaretli kareye ${visits} kez basıldı. Ajan ${at}. hamlede.`,
  },

  learn: {
    kicker: "Bunu nasıl çözdü?",
    title: "Ajan bir hamlenin değerini nasıl öğrenir?",
    lede: "Ödül ayarını değiştirdiğinde ajan yeniden eğitilir. Gösterilen Q-değerleri bu eğitimin sonucudur.",

    scrubber: "Tamamlanan eğitim turu",
    episode: (n: number) => `${n}. tur`,
    scrubberValue: (episode: number, total: number) => `${total} turun ${episode}. turundan sonra`,
    episodeLabel: "Eğitim turu",

    mapLabel: (episode: number) =>
      `${episode} turdan sonraki oda. Her karede en büyük Q-değeri ve bu değeri alan hamlenin yönü gösterilir.`,
    cellLabel: (row: number, col: number, value: string, action: string) =>
      `Satır ${row}, sütun ${col}. Değeri ${value}. Buradan ${action} giderdi.`,
    wallCell: (row: number, col: number) => `Satır ${row}, sütun ${col}. Duvar.`,

    actions: { 0: "yukarı", 1: "aşağı", 2: "sola", 3: "sağa" },
    noAction: "hiçbir yere: burası kapı",
    bestAction: "en iyi",
    selectedTitle: (row: number, col: number) => `Satır ${row}, sütun ${col}`,
    chain: (row: number, col: number, action: string, value: string) =>
      `Satır ${row}, sütun ${col}. En yüksek Q-değerine sahip hamleyle ajan ${action} gider. Bu hamlenin Q-değeri ${value}.`,

    unexploredLabel: "Rotanın uğramadığı kareler",
    unexploredHint: "en yüksek Q-değerli hamleler izlenirken",

    propagation:
      "Kaydırıcıyı başa çek ve turları sırayla ilerlet. Kapı ödülü önce kapıya götüren hamlenin Q-değerini değiştirir. Sonraki turlarda bu değer, kapıya komşu karelere götüren hamlelerin hesabına girer.",

    formulaTitle: "Her hamleden sonra uyguladığı kural",
    formulaNote:
      "Güncelleme, Q-değerini hedefe doğru α oranında değiştirir. Hedef, alınan ödül ile yeni durumdaki en büyük Q-değerinin γ ile çarpımının toplamıdır. Kapıya girince gelecek değer sıfırdır.",

    honesty:
      "Ajan bütün kareleri aynı ölçüde ziyaret etmez. Az ziyaret edilen durumlarda Q-değerleri başlangıç değerlerine yakın kalabilir. Öğrenilen yol, ortamın tamamının öğrenildiği anlamına gelmez.",

    scheduleWarning:
      "Kaydırıcı yalnızca kaydedilen turları gösterir. İki kayıt arasında da Q-değerleri güncellenir.",
  },

  recap: {
    lessons: [
      "Ödül, bir hamleden sonra alınan puandır. Ödülü değiştirince öğrenilen politika da değişebilir.",
      "Q-learning, her hamlede ilgili durum ve hamle çiftinin değerini günceller. Bir ödülün etkisi daha önceki durumlara sonraki güncellemelerle ulaşır.",
      "İşaretli karenin ödülü yeterince yüksekse aynı kareye dönmek, kapıya ulaşmaktan daha çok indirgenmiş getiri sağlayabilir.",
    ],
    footer:
      "Ajan 27 kareli deterministik ortamda tablo tabanlı Q-learning kullanır. Bu küçük örnek, verilen ödül ile istenen davranışın neden farklılaşabildiğini gösterir.",
  },
  world: {
    title: "Ajanın hareket alanı",
    question: "Ajan ne yapmalı?",
    sliderHint:
      "İşaretli kareye her girişte alınan ödülü kaydırıcıyla ayarla. Duvarlar, kapı ve hamle maliyeti sabittir.",
    caption:
      "Bu bölümde ajanı sen hareket ettirirsin. Her hamle 0,5 puan düşürür. İşaretli kareye girince seçtiğin ödül, kapıya girince 20 puan eklenir. Kapıya ulaşınca tur biter.",
    mapLabel: (moves: number, total: string) =>
      `Yukarıdan görünen küçük bir oda: duvarlar, işaretli bir kare ve bir kapı. Ajan ${moves} hamle yaptı, toplam ${total}.`,
    padLabel: "Ajanı hareket ettir",
    padHint: "Ya da yön tuşlarını kullan.",
    arrived: "Kapıya ulaştın. Bu, turu bitirir.",
    restart: "Başa dön",
    ledgerTitle: "Hamlelerin ödül dökümü",
    ledgerEmpty:
      "Bir hamle yap. Bu tabloda hamlenin maliyetini ve varsa kareden veya kapıdan alınan ödülü gör.",
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
    rulesLabel: "Bu kareden yapılabilecek hamlelerin ödülleri",
    previewHint: "Ajan bu tabloyu göremez. Ancak hareket ederek öğrenir.",
    moveAnnounce: (action: string, paid: string, total: string) =>
      `${action} gitme hamlesi seçildi. Hamlenin ödülü ${paid}. Toplam ${total}.`,
  },

  train: {
    kicker: "Eğitim",
    title: "Ajan deneyerek nasıl öğrenir?",
    lede: "Eğit düğmesine bas. Ajan hareket ederek ödül toplar ve Q-değerlerini günceller. Oklar, sayılar ve eğri bu çalıştırmanın sonuçlarını gösterir.",
    caption:
      "Adım'a bir basış bir hamledir: seç, hareket et, ödülü topla, bir sayıyı güncelle. Eğit aynı şeyi tur tur tekrarlar.",
    runLabel: "Eğit",
    oneEpisode: "Bir tur",
    speedLabel: "Saniyedeki tur",
    mapLabel: (episode: number, total: number) =>
      `${total} turun ${episode}. turunda oda. Oklar, politikanın her karede seçeceği hamledir; iz ise sürmekte olan turun rotasıdır.`,
    curveTitle: "Tur başına ödül",
    curveEmpty: "Bir iki tur çalıştır, eğri burada başlasın.",
    curveLabel: (episodes: number, first: string, last: string) =>
      `${episodes} turun her birinde toplanan ödül, yumuşatılmış. ${first} civarında başlıyor ve sonunda ${last} civarına geliyor.`,
    episodeShort: (n: number) => `tur ${n}`,
    lastEpisode: (episode: number, steps: number, reward: string, outcome: string) =>
      `Tur ${episode}: ${steps} hamle, ${reward} toplandı, ${outcome}.`,
    notStarted: "Eğitimi başlatmak için Adım veya Eğit düğmesine bas.",
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
    kicker: "Politika",
    title: "Öğrenilen değerler rotayı nasıl belirler?",
    lede: "Ajan hazır bir rota saklamaz. Her kare ve hamle için bir Q-değeri tutar. En yüksek Q-değerli hamleleri izlediğinde bir rota oluşur. Eğitim öncesi ve sonrasını karşılaştır.",
    caption:
      "Her ok, bulunduğu karede en büyük Q-değerine sahip hamleyi gösterir. Bir kare seçip dört hamlenin değerlerini karşılaştır.",
    beforeTitle: "Eğitimden önce",
    beforeLabel:
      "Hiç eğitim yapılmadan önceki oda. Bütün sayılar sıfır olduğu için her kare aynı yönü gösteriyor: hiçbir şey bilmemek böyle görünür.",
    afterTitle: (episode: number) => `${episode} tur sonra`,
    afterLabel: (episode: number) =>
      `${episode} tur sonrasında oda. Her kare, politikanın orada seçtiği hamleyi ve oradaki en iyi hamlenin ne kadar iyi olduğunu gösteriyor. Dört sayısını da görmek için bir kare seç.`,
    pickLabel: "Bir kareyi incele",
    pickHint: "Bir kareye tıkla veya ok tuşlarıyla kare değiştir.",
    selects: (row: number, col: number, action: string, value: string) =>
      `${row}. satır, ${col}. sütunda dört hamlenin dört sayısı var. Politika en yüksek Q-değerine sahip hamleyi seçer. Ajan ${value} Q-değerli hamleyle ${action} gider.`,
    episodeLabel: "Çalıştırılan tur",
    routeLabel: "Rota uzunluğu",
    routeHint: "hamle, keşif yapmadan",
    routeNone: "kapıya ulaşmıyor",
    valueLabel: "Buradaki en iyi değer",
    valueHint: "dördün en büyüğü",
  },

  update: {
    kicker: "Q-değeri güncellemesi",
    title: "Bir hamlenin değeri neden değişti?",
    lede: "Her hamlenin ardından yalnız ilgili durum-hamle çiftinin Q-değeri güncellenir. Aşağıda son hamlenin ödülünü, hedef değerini ve güncelleme sonucunu görebilirsin.",
    caption:
      "Henüz hareket yapılmadıysa güncelleme gösterilmez. Bir adım çalıştırarak hesabı incele.",
    nothingYet: "Henüz hamle yapılmadı. Yukarıdan ya da buradan Adım'a bas.",
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
      `${row}. satır, ${col}. sütundan ${action} gitmeyi denedi. ${choice}. Sonuç olarak ${landed}. Hamlenin ödülü ${reward}.`,
    choice: {
      explored: "Hamle rastgele seçildi",
      exploited: "Hamle en yüksek Q-değerine göre seçildi",
    },
    landed: {
      wall: "duvara çarpıp olduğu yerde kaldı",
      moved: (row: number, col: number) => `${row}. satır, ${col}. sütuna geçti`,
    },
    panels: {
      belief: "Önceki Q-değeri",
      beliefBody: "Hamleden önce Q tablosundaki değer.",
      evidence: "Hedef değer",
      evidenceBody:
        "Alınan ödüle, yeni karedeki en yüksek Q-değerinin γ katı eklenir. Kapıda bu ikinci terim sıfırdır.",
      updated: "Yeni Q-değeri",
      updatedBody: "Önceki Q-değerine, hedefle arasındaki farkın α katı eklenir.",
    },
    formulaTitle: "Kural, hamle başına bir kez",
    tableCaption: "Güncellemenin her terimi ve bu hamlede aldığı değer.",
    terms: {
      before: "Q(s,a) önce",
      reward: "r: toplanan",
      bootstrap: "γ · max Q(s′,a′), indiği yerden en iyisi",
      target: "r + γ · max Q(s′,a′), hedeflediği",
      error: "hedef ile önceki Q-değeri arasındaki fark",
      after: "Q(s,a) sonra",
    },
    errorLabel: "Hedefle arasındaki fark",
    errorHint: "hedef eksi önceki Q-değeri",
    movedLabel: "Q-değerindeki değişim",
    movedHint: "α çarpı hedef farkı",
    epsilonLabel: "Keşif oranı",
  },

  rules: {
    kicker: "Kuralları değiştir",
    title: "Üç ayarın öğrenmeye etkisi",
    lede: "Bu lab'da bir eğitim ayarını değiştirmek çalıştırmayı sıfırlar. Yeni ayarla yeniden eğit ve öğrenme eğrisini karşılaştır.",
    caption:
      "Ayarları birer birer değiştir. Art arda kapıya ulaşmanın kaç tur sürdüğünü ve bu sırada tur başına ödülün ne kadar değiştiğini karşılaştır.",
    curveTitle: "Tur başına ödül",
    curveEmpty: "Doldurmak için yukarıdan Eğit'e bas.",
    curveHint: "On tur üzerinden yumuşatıldı. Her nokta çalıştırılmış bir tur.",
    curveLabel: (episodes: number, last: string, settled: string) =>
      `${episodes} tur boyunca tur başına ödül, ${last} civarında bitiyor. Kararlı hâle geldiği tur ${settled}.`,
    alpha: {
      label: "Öğrenme oranı α",
      valueText: (value: string) => `Öğrenme oranı ${value}`,
      what: "Q-değerinin her güncellemede hedefe ne oranda yaklaştığını belirler.",
    },
    gamma: {
      label: "İndirim katsayısı γ",
      valueText: (value: string) => `İndirim katsayısı ${value}`,
      what: "Gelecekteki ödüllerin bugünkü değerini belirler. γ küçüldükçe sonraki hamlelerin ödülleri daha az ağırlık alır.",
    },
    epsilon: {
      label: "Keşif oranı ε",
      valueText: (value: string) => `Keşif oranı ${value}`,
      what: "ε olasılıkla rastgele hamle seçilir. Diğer hamlelerde mevcut en yüksek Q-değerinden yararlanılır. Bu bölümde keşif oranı eğitim boyunca azalır.",
    },
    restore: "Varsayılanlara dön",
    settledLabel: "Art arda kapıya ulaştığı ilk tur",
    settledHint: "arka arkaya yirmi turun hepsinin bittiği ilk tur",
    notSettled: "yok",
    successLabel: "Kapıya ulaştı",
    successHint: "son 50 tur",
    stepsLabel: "Tur başına hamle",
    stepsHint: "son 50'nin ortalaması",
    scopeLabel: "Bunun göstermediği",
    scope:
      "Bu ayarlar, 27 kareli deterministik ortamda tablo tabanlı Q-learning içindir. Buradaki sonuçlar büyük ortamlarda aynı etkinin görüleceğini garanti etmez.",
  },

  challenge: {
    kicker: "Görevler",
    title: "Ödülleri değiştirerek hedef davranışı öğret",
    lede: "Üç görev. Her birinde ajan istemediğin bir şey yapıyor ve değiştirebileceğin tek bir sayı var. Hiçbiri kaydırıcıyı belirli bir yere koyarak geçilemez: ajanın o şeyi gerçekten yapması gerekir.",
    puzzleLabel: "Görev",
    levers: {
      tileReward: "İşaretli kareye girme ödülü",
      epsilon: "Keşif oranı ε, sabit tutulur",
    },
    leverValue: (name: string, value: string) => `${name}: ${value}`,
    leverHint: {
      tileReward: "Her değişiklikte sıfırdan yeniden eğitilir.",
      epsilon: "Eğitim boyunca bu değerde tutulur, azalma yok.",
    },
    puzzles: {
      cross: {
        title: "Üstünden geçsin",
        brief:
          "Kare −3 değerinde, bu yüzden ajan iki fazla hamle yapıp etrafından dolaşıyor. Bunun yerine kapıya giderken karenin üstünden geçmesini sağla, ama orada durmasına yol açmadan.",
        lesson:
          "Karenin ödülü, dolanmanın önüne geçecek kadar yüksek olmalı. Ödül daha da artarsa kareye dönmek kapıya gitmekten daha fazla indirgenmiş getiri sağlayabilir.",
      },
      camp: {
        title: "Kapıdan vazgeçsin",
        brief:
          "Kare hiçbir şey etmiyor, bu yüzden ajan üstünden geçip yoluna devam ediyor. Kapıya hiç gitmemesini sağla. Kapıyı ya da duvarları oynatamazsın, yalnızca karenin ödediğini.",
        lesson:
          "Bu ayarda işaretli kareye tekrar girmenin indirgenmiş getirisi daha yüksek. Öğrenilen rota kapıya ulaşmadan hamle sınırına geliyor.",
      },
      settle: {
        title: "Kapıya düzenli ulaş",
        brief:
          "Keşif oranı eğitim boyunca 0,9'a sabitlenmiş: on hamlenin dokuzu rastgele. Sondaki tablo gayet iyi ama ajan turları neredeyse hiç bitiremiyor. Kapıya güvenilir biçimde ulaşmasını sağla.",
        lesson:
          "Rastgele hamleler yeni rotaların denenmesini sağlar. ε yüksek kaldığında ajan Q tablosunda iyi bir rota oluşsa bile sık sık bu rotadan ayrılır.",
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
    successHint: "eğitimin son 50 turu",
    verdict: {
      solved: "Görev tamamlandı.",
      untouched: "Kaydırıcıyı değiştir ve yeni ayarla eğitilen ajanın rotasına bak.",
      notYet: (behaviour: string) => `Henüz değil, ${behaviour}.`,
    },
    mapLabel: (behaviour: string, steps: number) =>
      `Bu ayarlarla eğitim sonrası oda: ${steps} hamlede ${behaviour}.`,
    announceSolved: (title: string) => `Çözüldü: ${title}.`,
    announceAttempt: (behaviour: string) => `Yeniden eğitildi, ${behaviour}.`,
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Önce ajanı elle hareket ettir ve ödülleri incele. Sonra eğitimi başlatıp öğrendiği davranışı karşılaştır.",
    stages: {
      world: {
        room: "Odanın üstten görünüşü: ajan, duvarlar, işaretli kare ve kapı. Kapıya girince 20 puan eklenir ve tur biter.",
        move: "Ekrandaki veya klavyedeki okları kullan. Duvara doğru denemeler dahil her hamlede 0,5 puan düşer.",
        reward:
          "Bu kaydırıcı işaretli karenin ne kazandıracağını belirler. Dünyada kararını verdiğin tek şey bu.",
      },
      train: {
        map: "Ajan köşeden hiçbir şey bilmeden başlar. Haritanın altındaki grafik tur başına toplanan ödülü gösterir.",
        run: "Eğitimi çalıştır: ajan dolaşır, kapıyı tesadüfen bulur ve o andan itibaren elinde bir ipucu olur.",
        figures:
          "Kapıya ulaşılan tur sayısına, son turdaki hamle sayısına ve son turun ödülüne bak.",
      },
      policy: {
        maps: "Solda eğitim öncesindeki, sağda eğitim sonrasındaki okları karşılaştır. Her ok, bulunduğu karede en yüksek Q-değerine sahip hamleyi gösterir.",
        pick: "Dört sayısını görmek için haritadan bir kare seç.",
        route: "Rota, her karede en yüksek Q-değerli hamle izlendiğinde ortaya çıkar.",
      },
      update: {
        step: "Adım düğmesine bas. Hamleyi ve güncellenen Q-değerini tabloda karşılaştır.",
        update: "Önceki Q-değerini, hedef değeri ve yeni Q-değerini karşılaştır.",
        error: "Hedefle arasındaki farka, Q-değerindeki değişime ve keşif oranına bak.",
      },
      rules: {
        chart: "Bu ayarlarla eğitimin nasıl ilerlediğine bak.",
        epsilon:
          "Öğrenme oranını, indirim katsayısını veya keşif oranını değiştir. Her değişiklikte eğitim baştan başlar.",
        restore: "Bu düğme başlangıç ayarlarını geri getirir.",
        figures:
          "Art arda kapıya ulaştığı ilk tura, son 50 turdaki başarıya ve tur başına hamle sayısına bak.",
      },
      challenge: {
        map: "Her görevde ajan istemediğin bir şey yapıyor. Görevi yukarıdan seç.",
        lever: "Değiştirebileceğin tek bir sayı var. Her oynattığında eğitim yeniden başlar.",
        result: "Ajanın şimdi ne yaptığı ve görevin istediğini yapıp yapmadığı.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      reward: "Ödüller, durumlar ve hamleler",
      q: "Deneyerek öğrenmek: Q-learning",
      gaming: "Ödül ile hedef arasındaki ilişki",
    },
    notes: {
      "sq-rl": "Pekiştirmeli öğrenmenin ana fikirleri.",
      "cp-mdp": "Odanın bir Markov karar süreci olarak ele alınması.",
      "deeplizard-q": "Q-değerleri, güncelleme kuralı ve keşif oranı.",
      "sutton-barto": "Alanın ders kitabı, yazarlarından ücretsiz (Q-learning için 6. bölüm).",
      "miles-spec": "Puanı tutturup asıl amacı ıskalayan ajanların dokuz gerçek örneği.",
      "deepmind-specgaming":
        "Ödülün tanımındaki açıklardan yararlanan ajan örnekleri (specification gaming).",
    },
  },
};

export default copy;
