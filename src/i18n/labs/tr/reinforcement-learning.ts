import type en from "../en/reinforcement-learning";

/** Türkçe metin: reinforcement-learning. Şekli `en/reinforcement-learning.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Sources",
    qLearning:
      "Tablo tabanlı Q-öğrenme güncelleme kuralını ve yakınsama koşullarını destekler. Izgara, ödüller ve ziyaretçinin ayarladığı karo laboratuvara aittir.",
  },

  room: {
    title: "The room",
    question:
      "Ajan, ödüllere göre hareket etmeyi öğreniyor. Ödülü değiştirince çıkışa giden yol nasıl değişir?",
    sliderLabel: "İşaretli kare robot için ne kadar değerli?",
    sliderValue: (value: string) => `İşaretli karenin değeri ${value}`,
    hint: "Sürükle. Her oynattığında yol sıfırdan yeniden öğreniliyor.",
    wow: "Ona durmasını söylemedin. O karenin kapıdan daha değerli olduğunu söyledin.",
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
    kicker: "How did it work this out?",
    title: "It kept a number for every move it could make.",
    lede: "Ödül ayarını değiştirdiğinde ajan yeniden eğitilir. Gösterilen Q-değerleri bu eğitimin sonucudur.",

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
    selectedTitle: (row: number, col: number) => `Row ${row}, column ${col}`,
    chain: (row: number, col: number, action: string, value: string) =>
      `Satır ${row}, sütun ${col} üzerindeyken robotun yapabileceği dört hamle ve her biri için bir sayı var. En büyüğünü seçiyor (${action} giderek elde ettiği ${value}), çünkü o hamle en son denediğinde onu daha iyi bir yere götürmüştü. Bunu birkaç yüz kez tekrarlayın, sayılar değişmeyi bırakır.`,

    unexploredLabel: "Uğramadığı kare",
    unexploredHint: "oraya gitmeyi bıraktı",

    propagation:
      "Kaydırıcıyı en başa çek. İlk on-on beş denemede hiçbir şeyin değeri yok: robot dolanıyor ve attığı her adım ona biraz pahalıya geliyor. Sonra kapıya tesadüfen giriyor, kapının yanındaki bir kare pozitife dönüyor ve sonraki birkaç denemede bu iyi haber odaya doğru, kare kare yayılıyor. Öğrenmenin tamamı bu yayılma.",

    formulaTitle: "The rule it applies after every single move",
    formulaNote:
      "Şöyle oku: az önce yaptığın hamlenin sayısını, gerçekte elde ettiğin ödüle ve vardığın yerden artık mümkün gördüğün en iyi değere doğru biraz kaydırın. α bu kaydırmanın büyüklüğü, γ ise ileride gelecek bir ödülün şimdikine kıyasla ne kadar değerli sayıldığı.",

    honesty:
      "Ajan bütün hücreleri aynı ölçüde ziyaret etmez. Az ziyaret edilen durumlarda Q-değerleri başlangıç değerlerine yakın kalabilir. Öğrenilen yol, ortamın tamamının öğrenildiği anlamına gelmez.",

    scheduleWarning:
      "Kaydedilen denemeler eşit aralıklı, bu da öğrenmenin gerçekleştiği kısmı gizliyor.",
  },

  recap: {
    lessons: [
      "Ödül bir talimat değildir. Bir puandır ve robot en yüksek puanı veren davranışı bulur: aklından hiç geçmemiş olanı bile.",
      "Deneyerek öğrenir: her hamle bir sayıyı günceller ve işe yarayan sayılar, ilk kez iyi giden şeyden dışa doğru yayılır.",
      "Aklındaki sonucu değil, gerçekten yazdığın ödülü optimize eder.",
    ],
    footer:
      "Ajan 27 hücreli deterministik ortamda tablo tabanlı Q-learning kullanır. Bu küçük örnek, verilen ödül ile istenen davranışın neden farklılaşabildiğini gösterir.",
  },
  world: {
    title: "The room",
    question: "Ajan ne yapmalı?",
    sliderHint:
      "Dünyaya dair karar verebileceğin tek şey bu. Geri kalan her şey (duvarlar, kapı, bir hamlenin maliyeti) sabit.",
    caption:
      "Henüz hiçbir şey öğrenmiyor. Kontrol sizde. Her hamle 0,5 götürür, işaretli kare her girişte belirlediğin kadar öder, kapı ise 20 öder ve turu bitirir.",
    mapLabel: (moves: number, total: string) =>
      `Yukarıdan görünen küçük bir oda: duvarlar, işaretli bir kare ve bir kapı. Ajan ${moves} hamle yaptı, toplam ${total}.`,
    padLabel: "Ajanı hareket ettirin",
    padHint: "Ya da yön tuşlarını kullan.",
    arrived: "Kapıya ulaştın. Bu, turu bitirir.",
    restart: "Başa dön",
    ledgerTitle: "What each move paid",
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
    kicker: "Nobody showed it the way",
    title: "It tries, and the trying is the training.",
    lede: "Eğit düğmesine bas. Ajan hareket ederek ödül toplar ve Q-değerlerini günceller. Oklar, sayılar ve eğri bu çalıştırmanın sonuçlarını gösterir.",
    caption:
      "Adım'a bir basış bir hamledir: seç, hareket et, ödülü topla, bir sayıyı güncelle. Eğit aynı şeyi tur tur tekrarlar.",
    runLabel: "Eğit",
    oneEpisode: "Bir tur",
    speedLabel: "Saniyedeki tur",
    mapLabel: (episode: number, total: number) =>
      `${total} turun ${episode}. turunda oda. Oklar, politikanın her karede seçeceği hamledir; iz ise sürmekte olan turun rotasıdır.`,
    curveTitle: "Reward per episode",
    curveEmpty: "Bir iki tur çalıştır, eğri burada başlasın.",
    curveLabel: (episodes: number, first: string, last: string) =>
      `${episodes} turun her birinde toplanan ödül, yumuşatılmış. ${first} civarında başlıyor ve sonunda ${last} civarına geliyor.`,
    episodeShort: (n: number) => `tur ${n}`,
    lastEpisode: (episode: number, steps: number, reward: string, outcome: string) =>
      `Tur ${episode}: ${steps} hamle, ${reward} toplandı, ${outcome}.`,
    notStarted: "Henüz bir şey olmadı. Adım'a ya da Eğit'e bas.",
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
    kicker: "What it built while doing that",
    title: "A number for every move, and a route that falls out of them.",
    lede: "Ajan hazır bir rota saklamaz. Her hücre ve hareket için bir Q-değeri tutar. En yüksek değerli hareketleri izlediğinde bir rota oluşur. Eğitim öncesi ve sonrasını karşılaştır.",
    caption:
      "Bir ok, Q-değeri değildir. O karedeki en büyük Q-değerine sahip hamledir; politika kelimesinin anlamı da budur. Seçildiği dört sayı aşağıda.",
    beforeTitle: "Before training",
    beforeLabel:
      "Hiç eğitim yapılmadan önceki oda. Bütün sayılar sıfır olduğu için her kare aynı yönü gösteriyor: hiçbir şey bilmemek böyle görünür.",
    afterTitle: (episode: number) => `After ${episode} episodes`,
    afterLabel: (episode: number) =>
      `${episode} tur sonrasında oda. Her kare, politikanın orada seçtiği hamleyi ve oradaki en iyi hamlenin ne kadar iyi olduğunu gösteriyor. Dört sayısını da görmek için bir kare seç.`,
    pickLabel: "Bir kareyi incele",
    pickHint: "Bir kareye tıkla ya da yön tuşlarıyla gezinin.",
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
    kicker: "Why did it learn that?",
    title: "One number moved. Here is the whole reason.",
    lede: "Her hareketin ardından yalnız ilgili durum-hareket çiftinin Q-değeri güncellenir. Aşağıda son hareketin ödülünü, hedef değerini ve güncelleme sonucunu görebilirsin.",
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
    formulaTitle: "The rule, once per move",
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
    kicker: "Change the rules",
    title: "Three dials, and what each one actually changes.",
    lede: "Bu labda bir eğitim ayarını değiştirmek çalıştırmayı sıfırlar. Yeni ayarla yeniden eğit ve öğrenme eğrisini karşılaştır.",
    caption:
      "Bu oda küçük. Üçünü de taradığımızda ajanın neredeyse her ayarla odayı çözdüğü görüldü: bunların değiştirdiği şey, eğrinin ne kadar hızlı oturduğu, yolda ne kadar gürültülü olduğu ve oturup oturmadığı.",
    curveTitle: "Reward per episode, this run",
    curveEmpty: "Doldurmak için yukarıdan Eğit'e bas.",
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
      "Bu ayarlar, 27 hücreli deterministik ortamda tablo tabanlı Q-learning içindir. Buradaki sonuçlar büyük ortamlarda aynı etkinin görüleceğini garanti etmez.",
  },

  challenge: {
    kicker: "Now you set the reward",
    title: "Can you make it learn this?",
    lede: "Üç görev. Her birinde ajan istemediğin bir şey yapıyor ve değiştirebileceğin tek bir sayı var. Hiçbiri kaydırıcıyı belirli bir yere koyarak geçilemez: ajanın o şeyi gerçekten yapması gerekir.",
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
        title: "Walk over it",
        brief:
          "Kare −3 değerinde, bu yüzden ajan iki fazla hamle yapıp etrafından dolaşıyor. Bunun yerine kapıya giderken karenin üstünden geçmesini sağla, ama orada durmasına yol açmadan.",
        lesson:
          "Bir eşik değil, bir aralık var. Karenin değeri, kazandırdığı dolambaçtan fazla ve yerini alacağı kapıdan az olmalı.",
      },
      camp: {
        title: "Make it give up on the door",
        brief:
          "Kare hiçbir şey etmiyor, bu yüzden ajan üstünden geçip yoluna devam ediyor. Kapıya hiç gitmemesini sağla. Kapıyı ya da duvarları oynatamazsın, yalnızca karenin ödediğini.",
        lesson:
          "Ona durmasını hiç söylemedin. Karenin bitirmekten daha değerli olduğunu söyledin, o da size inandı. Tek bir kaydırıcıda bütün laboratuvar.",
      },
      settle: {
        title: "It never settles",
        brief:
          "Keşif bütün koşu boyunca 0,9'a sabitlenmiş: on hamlenin dokuzu rastgele. Sondaki tablo gayet iyi ama ajan turları neredeyse hiç bitiremiyor. Kapıya güvenilir biçimde ulaşmasını sağla.",
        lesson:
          "Rotayı bulan şey keşiftir; sonra da onu kullanmanı engelleyen şey odur. Bu koşu rotayı sürekli çöpe atıyor.",
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

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Önce ajanı elle hareket ettir ve ödülleri incele. Sonra eğitimi başlatıp öğrendiği davranışı karşılaştır.",
    stages: {
      world: {
        room: "Odanın üstten görünüşü: ajan, duvarlar, işaretli kare ve kapı. Kapı 20 kazandırır ve koşuyu bitirir.",
        move: "Ajanı bu oklarla ya da klavyenin ok tuşlarıyla hareket ettirin. Her hamle 0,5'e mal olur.",
        reward:
          "Bu kaydırıcı işaretli karenin ne kazandıracağını belirler. Dünyada kararını verdiğin tek şey bu.",
      },
      train: {
        map: "Ajan köşeden hiçbir şey bilmeden başlar. Haritanın altındaki eğri, bölüm başına aldığı ödül.",
        run: "Eğitimi çalıştır: ajan dolaşır, kapıyı tesadüfen bulur ve o andan itibaren elinde bir ipucu olur.",
        figures:
          "Kaç bölüm koşulduğu, kapıya ne sıklıkla ulaştığı ve son bölümün adım sayısıyla ödülü.",
      },
      policy: {
        maps: "Solda hiç bölüm koşulmadan önce, sağda eğitimden sonra. Her ok, en büyük sayıya sahip hamle.",
        pick: "Dört sayısını görmek için haritadan bir kare seç.",
        route: "Rota, her seferinde en büyük sayıyı seçince ortaya çıkan yol.",
      },
      update: {
        step: "Bir eylem yaptırın: ajan bir kez hareket eder ve tam olarak bir sayıyı değiştirir. Tur bir eylem yaptırdı.",
        update: "Elindeki sayı, dünyanın ödediği, sonrası için en iyi tahmin ve yeni sayı.",
        error: "Hata, sayının ne kadar kaydığı ve ne sıklıkla rastgele keşfe çıktığı.",
      },
      rules: {
        chart: "Bu ayarlarla koşunun nasıl davrandığı.",
        epsilon: "Üç ayar: öğrenme oranı, indirim ve keşif. Tur keşfi artırdı; koşu baştan başlar.",
        restore: "Bu düğme başlangıç ayarlarını geri getirir.",
        figures: "Ne zaman oturduğu, ne sıklıkla başardığı ve kaç adım attığı.",
      },
      challenge: {
        map: "Her görevde ajan istemediğin bir şey yapıyor. Görevi yukarıdan seç.",
        lever: "Değiştirebileceğin tek bir sayı var. Her oynattığında koşu yeniden başlar.",
        result: "Ajanın şimdi ne yaptığı ve görevin istediğini yapıp yapmadığı.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      reward: "Rewards, states and actions",
      q: "Learning by trying: Q-learning",
      gaming: "It optimises what you wrote down",
    },
    notes: {
      "sq-rl": "Pekiştirmeli öğrenmenin ana fikirleri.",
      "cp-mdp": "Odanın bir Markov karar süreci olarak ele alınması.",
      "deeplizard-q": "Q değerleri, güncelleme kuralı ve keşif.",
      "sutton-barto": "Alanın ders kitabı, yazarlarından ücretsiz (Q-learning için 6. bölüm).",
      "miles-spec": "Puanı tutturup asıl amacı ıskalayan ajanların dokuz gerçek örneği.",
      "deepmind-specgaming": "DeepMind'ın şartname oyunları (specification gaming) yazısı.",
    },
  },
};

export default copy;
