import type en from "../en/reinforcement-learning";

/** Türkçe metin: reinforcement-learning. Şekli `en/reinforcement-learning.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    qLearning:
      "Tablo tabanlı Q-öğrenme güncelleme kuralını ve yakınsama koşullarını destekler. Izgara, ödüller ve ziyaretçinin ayarladığı karo laboratuvara aittir.",
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
    lede: "Bunlardan birini oynattığınızda koşu birinci turdan yeniden başlar; çünkü öğrenme oranını yarı yolda değiştirmek diye bir şey yoktur. Sonra yukarıdaki bölümde Eğit'e basın; eğri yeni ayarla baştan çizilir.",
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
};

export default copy;
