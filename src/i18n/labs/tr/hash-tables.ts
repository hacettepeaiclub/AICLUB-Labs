import type en from "../en/hash-tables";

/** Türkçe metin: hash-tables. Şekli `en/hash-tables.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
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
    lede: "32 yuvalı tek bir dizi. Her anahtarın bir ev yuvası var; o doluysa bir sonrakini, sonra bir sonrakini dener, ta ki boş bir yuva bulana kadar. Anahtar ekledikçe boş yuva arayan yürüyüşler uzar.",
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
    loadValue: (value: string) => `α = ${value}`,
    dragHint:
      "Doluluk oranını ayarlamak için grafiğin herhangi bir yerine basın ya da sürükleyin. Halkalar her eğriyle kesiştiği yeri gösterir.",
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
    lede: "Java'nın HashMap'i 16 kovayla başlar ve dörtte üçü dolduğunda her anahtarı kopyalayarak iki katına çıkar. Her taşınma pahalıdır. Anahtar ekleyin; taşınmaların ortalamada neye mal olduğu her eklemede hesaplanır.",
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
    keysValue: (n: number) => `${n} anahtar eklendi`,
    dragHint:
      "Daha çok anahtar eklemek ya da geri almak için grafik boyunca basın veya sürükleyin.",
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
    lede: "Sekizer artan kimlikler, onar artan fiyatlar, 64'e hizalı adresler: anahtarlar çoğu zaman bir adımı paylaşır. Bir tablo boyutu ve bir adım seçin: anahtarların kaç kovaya dağıldığı hemen sayılır.",
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

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Bir kelime yazıp nerede saklanacağını hesaplarsınız; böylece onu yeniden bulmak arama değil, tek bir bakış olur.",
    stages: {
      address: {
        type: "Anahtar olarak bir kelime yazın. Tur pizza yazdı.",
        bucket: "Harf harf hesaplanan hash, 16 kovadan birini seçer ve o kova yanar.",
        put: "“Tabloya koy” deyin: kelime o kovaya yerleşir.",
        looks: "Onu yeniden bulmak için yalnızca kendi kovasındaki anahtarlara bakılır.",
      },
      birthday: {
        chart:
          "Anahtar eklendikçe iki anahtarın aynı kovaya düşme olasılığı. Önce yukarıda tahmininizi yapın.",
        keys: "Kaç anahtar atılacağını ayarlayın.",
        throw: "Onları rastgele kovalara atın ve ikisinin çakışıp çakışmadığına bakın.",
        chance:
          "Kesin olasılık, yarı yarıya ihtimal için gereken anahtar sayısı ve şimdiye kadarki denemeleriniz.",
      },
      probe: {
        slots: "Liste yok, 32 yuvalık tek bir dizi. Evi dolu olan anahtar sağa kayar.",
        add: "Bir anahtar ekleyin. Kehribar çerçeve, denediği her yuvayı gösterir.",
        four: "Dördünü birden ekleyin: tablo doldukça yürüyüşler uzar.",
        walks: "Tablonun doluluğu ve yürüyüşlerin ne kadar uzadığı.",
      },
      compare: {
        chart: "Tablo doldukça bir anahtarı bulmanın maliyeti: zincirleme ve doğrusal yoklama.",
        load: "Doluluk oranını grafik boyunca sürükleyerek ya da ok tuşlarıyla ayarlayın. Tur tabloyu doldurdu.",
        costs: "Dolmaya yakınken yoklama dikleşerek artar, zincirleme ise düz bir çizgide büyür.",
      },
      resize: {
        bars: "Her çubuk bir eklemenin yaptığı iş; tablo ikiye katlandığında kopyalanan bütün anahtarlar dahil.",
        add: "Anahtar eklemek için grafik boyunca sürükleyin ya da ok tuşlarını kullanın. Tur birkaç tane ekledi.",
        average: "Taşınmalar büyüdükçe seyrekleşir; bu yüzden ortalama düşük kalır.",
      },
      modulus: {
        buckets: "Eşit adımlarla artan anahtarlar ve düştükleri kovalar.",
        step: "Adımı değiştirin. Tur çift bir adım seçti ve kovaların çoğu boş kaldı.",
        size: "Şimdi buradan asal bir tablo boyutu deneyin: bütün kovalar kullanılır.",
      },
      challenge: {
        pick: "Bir hash tablosuna kazandırmanız gereken üç özellik. Buradan birini seçin.",
        work: "Anahtarlarınızı buraya yazın; her değişiklik sayfanın geri kalanıyla aynı hash ile kontrol edilir.",
        solved: "Bu özelliği taşıyan her şey geçer. Cevap anahtarı yok.",
      },
    },
  },
};

export default copy;
