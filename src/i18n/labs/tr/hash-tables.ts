import type en from "../en/hash-tables";

/** Türkçe metin: hash-tables. Şekli `en/hash-tables.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    peterson:
      "Kayıtları anahtarlarından hesaplanan bir adreste saklamayı ve depolama doldukça aramanın nasıl uzadığını inceleyen ilk çalışmalardan biri.",
    linearProbing:
      "Doğrusal yoklamanın beklenen maliyetini inceler. Başarılı arama için ½(1 + 1/(1 − α)), başarısız arama ve ekleme için ½(1 + 1/(1 − α)²) sonucunu verir.",
    birthday:
      "Doğum günü problemini, aynı günü paylaşan ikiden fazla kişiye genelleştirir. İki kişi için klasik sonucu verir: 23 kişide ortak bir doğum günü olması, olmamasından daha olasıdır.",
    amortized:
      "Amortize çözümlemede işlem dizisinin toplam maliyeti işlem sayısına bölünür. Kapasiteyi iki katına çıkarmanın maliyeti de bütün eklemelere dağıtılır.",
    javaApi:
      "String.hashCode için 32 bitlik tamsayı aritmetiğindeki hesabı tanımlar. HashMap belgeleri 16 başlangıç kovasını, 0,75 varsayılan doluluk eşiğini ve kapasitenin yaklaşık iki katına çıkmasını açıklar.",
  },

  percent: (value: string) => `%${String(value).replace(".", ",")}`,

  // 1 ----------------------------------------------------------------------
  address: {
    title: "Anahtar hangi adrese gider?",
    question: "Bir anahtar yaz ve hesaplanan kova numarasına bak.",
    inputLabel: "Bir anahtar",
    emptyWord: "Kova numarasını hesaplamak için bir kelime yaz.",
    workingCaption: "UTF-16 kod birimlerine göre hash hesabı",
    columns: { char: "Karakter", code: "UTF-16 kodu", hash: "Ara hash değeri" },
    wrapped: "Düşük 32 bit alınır",
    bucketLine: (hash: string, m: number) => `${hash} mod ${m} =`,
    tableLabel: (n: number) => `16 kovalı, ${n} anahtar tutan bir tablo.`,
    bucketName: (i: number, keys: string) => (keys ? `Kova ${i}: ${keys}` : `Kova ${i}: boş`),
    put: "Tabloya koy",
    already: "Zaten tabloda",
    reset: "Baştan başla",
    caption:
      "Sonucu 31 ile çarp, sıradaki UTF-16 kod birimini ekle ve düşük 32 biti al. Son hash değerinin 16'ya göre negatif olmayan kalanı kova numarasıdır. Aynı kovaya giden anahtarlar o kovanın listesinde saklanır.",
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
    title: "İki anahtar ne zaman aynı kovaya düşer?",
    lede: "Her anahtar birbirinden bağımsız olarak ve eşit olasılıkla bir kovaya atanır. En az bir çakışmanın hangi anahtar sayısında %50 olasılığı geçtiğini tahmin et.",
    question:
      "365 kovalı tabloda en az iki anahtarın aynı kovaya atanma olasılığı kaç anahtarla %50'yi geçer?",
    answer:
      "23 anahtarda çakışma olasılığı %50'yi geçer. Aynı hesap, 365 günün eşit olasılıklı kabul edildiği doğum günü probleminde de kullanılır.",
    guess: {
      yours: "Tahminin",
      actual: "Cevap",
      agreed: "Biliyordun.",
      disagreed: "Grafikte olasılığın %50'yi geçtiği noktaya bak.",
    },
    caption:
      "Çakışma olasılığını bulmak için bütün anahtarların farklı kovalara atanma olasılığını 1'den çıkar. n ≤ m iken bu olasılık (1 − 1/m)(1 − 2/m)…(1 − (n−1)/m) çarpımıdır. n > m olduğunda çakışma kesindir.",
    announce: (keys: number, chance: string) =>
      `${keys} anahtarla ortak bir kova olasılığı ${chance}.`,
    curveTitle: (m: number) => `Çakışma olasılığı, ${m} kova`,
    curveLabel: (m: number, half: number) =>
      `${m} kova için, en az bir ortak kova olasılığının anahtar sayısına göre eğrisi. ${half} anahtarda yarıyı geçer.`,
    axis: "anahtar",
    gridTitle: (m: number) => `Tek bir deneme, ${m} kova`,
    gridLabel: (n: number, m: number) =>
      `${m} kovaya ilk ortak kovaya kadar atılan anahtarlar: ${n} anahtar gerekti.`,
    gridEmpty: "Denemeyi başlat. Dolu bir kovaya ilk kez anahtar geldiğinde deneme durur.",
    trialLine: (n: number, empty: number) =>
      `${n}. anahtar zaten kullanılmış bir kovaya düştü; ${empty} kova hâlâ boş.`,
    keysLabel: "Anahtar",
    throw: "Biri çakışana kadar anahtar at",
    sizeLabel: "Kova",
    secondaryLabel: "Kova sayısını değiştir",
    figures: {
      chance: "Olasılık",
      chanceHint: (n: number) => `${n} anahtarla ortak kova`,
      even: "Eşit şans",
      evenHint: (m: number) => `anahtarda, ${m} kova için`,
      trials: "Denemelerin",
      trialsHint: (half: number) => `${half}. anahtara kadar çakıştı`,
    },
  },

  // 3 ----------------------------------------------------------------------
  probe: {
    kicker: "Açık adresleme",
    title: "İlk yuva doluysa sırada hangisi var?",
    lede: "Tabloda 32 yuva var. Anahtarın hesaplanan yuvası doluysa sıradaki yuva denenir. Anahtar ekleyerek boş yer bulmak için yapılan deneme sayısını izle.",
    caption:
      "Hücrelerde anahtarların başlangıç yuvaları gösterilir. Kehribar çerçeveler son eklemede denenen yuvalardır. Dolu hücreler yan yana biriktikçe arama uzayabilir.",
    announce: (count: number, home: number, slot: number, probes: number) =>
      `${count}. anahtar için ilk yuva ${home}. ${probes} yoklamayla ${slot} numaralı yuvaya yerleşti.`,
    tableLabel: (count: number, m: number) => `${m} yuvalı, ${count} anahtar tutan bir tablo.`,
    slotFull: (slot: number, home: number) =>
      `Yuva ${slot}. Bu anahtarın hesaplanan yuvası ${home}.`,
    slotEmpty: (slot: number) => `Yuva ${slot}: boş`,
    pathLine: (home: number, slot: number, probes: number) =>
      probes === 1
        ? `Son anahtar, hesaplanan ${home} numaralı yuvaya yerleşti.`
        : `Son anahtarın ilk yuvası ${home} doluydu. ${probes} yoklamayla ${slot} numaralı boş yuva bulundu.`,
    emptyLine: "Boş bir tablo. Bir anahtar ekle.",
    clusterLine: (lengths: string) => `Dolu yuva dizileri: ${lengths}.`,
    noClusters: "Henüz dizi yok.",
    add: "Anahtar ekle",
    full: "Tablo dolu",
    addFour: "4 ekle",
    restart: "Tabloyu boşalt ve yeniden başla",
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
    kicker: "Zincirleme ve doğrusal yoklama",
    title: "Doluluk oranı arama maliyetini nasıl değiştirir?",
    lede: "Doluluk oranını değiştir. Zincirlemede ortalama anahtar karşılaştırmasını, doğrusal yoklamada ortalama yuva yoklamasını karşılaştır. Eğriler kuramsal değerleri, noktalar 1.024 konumlu tablolardaki ölçümleri gösterir.",
    caption:
      "Eşit olasılıklı kova seçiminde zincirlemenin başarılı arama maliyeti yaklaşık 1 + α/2 olur. Doğrusal yoklamada α değeri 1'e yaklaşırken başarılı arama maliyeti ½(1 + 1/(1 − α)), ekleme maliyeti ½(1 + 1/(1 − α)²) ile artar.",
    announce: (alpha: string, chain: string, linear: string) =>
      `${String(alpha).replace(".", ",")} doluluğunda zincirleme ortalama ${String(chain).replace(".", ",")} karşılaştırma, doğrusal yoklama ${String(linear).replace(".", ",")} yoklama gerektirir.`,
    chartLabel:
      "Bir anahtarı bulmak için ortalama yoklamanın doluluk oranına göre grafiği: zincirleme için düz bir çizgi, doğrusal yoklama için 1'e yaklaşırken dikleşen bir eğri ve ona ekleme için daha dik, kesikli bir eğri. Noktalar rastgele tablolarda ölçülmüştür.",
    axis: "doluluk oranı α",
    legend: {
      chain: "Zincirleme, başarılı arama",
      linear: "Doğrusal yoklama, başarılı arama",
      insert: "Doğrusal yoklama, ekleme",
      dots: "ölçülen",
    },
    loadLabel: "Doluluk oranı α",
    loadValue: (value: string) => `α = ${value}`,
    dragHint:
      "Doluluk oranını ayarlamak için grafiğin herhangi bir yerine bas ya da sürükle. Halkalar her eğriyle kesiştiği yeri gösterir.",
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
    kicker: "Kapasite artışı",
    title: "Tablonun kapasitesi iki katına çıkınca",
    lede: "Bu modelde tablo 16 kovayla başlar. Doluluk eşiği aşıldığında kapasite iki katına çıkar ve anahtarlar taşınır. Tek eklemenin maliyetiyle bütün eklemelerin ortalamasını karşılaştır.",
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
      resize: "kapasiteyi artıran ekleme",
      average: "şimdiye kadarki ortalama",
    },
    keysLabel: "Eklenen anahtar",
    keysValue: (n: number) => `${n} anahtar eklendi`,
    dragHint: "Daha çok anahtar eklemek ya da geri almak için grafik boyunca bas veya sürükle.",
    figures: {
      capacity: "Kova",
      capacityHint: (threshold: number) => `${threshold} anahtarı geçince kapasite yine artar`,
      resizes: "Kapasite artışı",
      average: "Ortalama iş",
      averageHint: "ekleme başına, her zaman 3'ün altında",
    },
  },

  // 6 ----------------------------------------------------------------------
  modulus: {
    kicker: "Sabit adımla artan anahtarlar",
    title: "Düzenli aralıklardaki anahtarlar nasıl dağılır?",
    lede: "Sekizer artan kimlikler, onar artan fiyatlar, 64'e hizalı adresler: anahtarlar çoğu zaman bir adımı paylaşır. Bir tablo boyutu ve bir adım seç: anahtarların kaç kovaya dağıldığı hemen sayılır.",
    caption:
      "0, s, 2s, … dizisi mod m ile m / ebob(s, m) farklı kova üretir, sonra kova numaraları tekrarlanır. Anahtar sayısı bu sayıdan küçükse kullanılan kova sayısı anahtar sayısı kadardır. s ile m aralarında asalsa döngü bütün kovaları kapsar. Java HashMap, kova seçerken hash değerinin yüksek bitlerini düşük bitlerle birleştirir.",
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
    kicker: "Görevler",
    title: "Hash tablolarıyla üç görev",
    lede: "Görevde istenen özelliği sağlayan anahtarları veya tablo ayarını bul. Birden fazla geçerli yanıt olabilir.",
    caption:
      "Yanıtlar bu lab'daki hash fonksiyonu ve tablo işlemleri çalıştırılarak kontrol edilir.",
    announce: (solved: number, total: number) => `${total} görevden ${solved} tanesi çözüldü.`,
    pickLabel: "Görev",
    reset: "İlerlememi unut",
    solvedLabel: "Çözülen",
    collide: {
      tab: "Çakıştır",
      task: "Java hash'i tam olarak aynı olan iki farklı metin bul.",
      hint: "İki karakter yeter. Her adım 31 ile çarpar: ilk karakter bir artar, ikincisi 31 azalırsa ne olur?",
      first: "Birinci metin",
      second: "İkinci metin",
      hashOf: (hash: string) => `hash ${hash}`,
      sameString: "Bunlar aynı metin. İki farklı metin olmalı.",
      solved:
        "Çözüldü. İki farklı anahtarın 32 bitlik hash değeri aynı. Hash değeri tek başına anahtarları ayırt edemez. Tablo, anahtarların kendisini karşılaştırarak ayırt edebilir.",
      notYetPlain: "Henüz değil: iki hash farklı.",
    },
    size: {
      tab: "Boyut",
      task: "Bu 16 anahtar onar artıyor: 0, 10, 20, …, 150. Her birini kendi kovasına koyan, 16 ile 32 arasında bir tablo boyutu seç.",
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
      task: "8 kovalı bir tablonun sekiz kovasının her birine bir tane düşecek sekiz farklı kelime seç.",
      hint: "Her kelime kovasını gösteriyor. Çakışanları, her kova bir kez kullanılana kadar değiştir.",
      word: (i: number) => `Kelime ${i}`,
      bucket: (b: number, clash: boolean) => (clash ? `kova ${b}, paylaşılıyor` : `kova ${b}`),
      rules: {
        filled: "Sekiz kelime",
        unique: "Hepsi farklı",
        spread: "Her kovada bir kelime",
      },
      solved:
        "Çözüldü. Her kovaya bir anahtar yerleşti. Çakışma yok. Sekiz bağımsız ve eşit olasılıklı atamada bu sonucun olasılığı yaklaşık %0,24'tür.",
      notYetPlain: "Henüz değil: üç koşula bak.",
    },
  },

  recap: {
    lessons: [
      "Hash tablosu, hash değerinden ilk kova veya yuva numarasını hesaplar.",
      "365 kovada 23 bağımsız ve eşit olasılıklı atamada çakışma olasılığı %50'yi geçer.",
      "Zincirleme her kovada bir liste tutar. Eşit olasılıklı kova seçiminde başarılı aramanın ortalaması yaklaşık 1 + α/2 karşılaştırmadır.",
      "Doğrusal yoklama boş yuva bulana kadar yuvaları sırayla inceler. Yan yana dolu yuvalar aramayı uzatabilir.",
      "α değeri 1'e yaklaşırken doğrusal yoklamanın maliyeti hızla artar. Başarılı arama için ½(1 + 1/(1 − α)), ekleme için ½(1 + 1/(1 − α)²) yoklama gerekir.",
      "Kapasite doluluk eşiğinde iki katına çıkarsa ekleme başına amortize maliyet sabit kalır.",
      "s adımıyla artan anahtarların kova numaraları m / ebob(s, m) adımda tekrar eder.",
    ],
    footer:
      "Hash tablosu uygulamaları ayrıntılarda farklılaşır. Buradaki deneyler kova seçimini, çakışma çözümünü ve kapasite artırmanın maliyetini ayrı ayrı gösterir.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Bir anahtar yaz. Hash hesabını, seçilen kovayı ve aynı kovaya düşen anahtarları incele.",
    stages: {
      address: {
        type: "Anahtar olarak bir kelime yaz. Örneğin pizza yaz.",
        bucket:
          "Hash değeri UTF-16 kod birimlerinden hesaplanır. Tabloda vurgulanan kova, hesaplanan numarayı gösterir.",
        put: "Tabloya koy düğmesine bas. Anahtar, gösterilen kovaya eklenir.",
        looks: "Onu yeniden bulmak için yalnızca kendi kovasındaki anahtarlara bakılır.",
      },
      birthday: {
        chart:
          "Önce tahminini yap. Ardından grafikte anahtar sayısına göre çakışma olasılığını izle.",
        keys: "Kaç anahtar atılacağını ayarla.",
        throw: "Denemeyi başlat ve ilk çakışmanın kaçıncı anahtarda olduğunu gör.",
        chance:
          "Kesin olasılık, %50 olasılık için gereken anahtar sayısı ve şimdiye kadar yaptığın denemeler.",
      },
      probe: {
        slots: "Tabloda 32 yuva var. İlk yuva doluysa sağdaki yuvalar sırayla yoklanır.",
        add: "Bir anahtar ekle. Kehribar çerçeve, denediği her yuvayı gösterir.",
        four: "Dört anahtar ekle. Doluluk artınca yoklama sayısının nasıl değiştiğine bak.",
        walks: "Doluluk oranını ve Son ekleme kutusundaki yoklama sayısını karşılaştır.",
      },
      compare: {
        chart: "Tablo doldukça bir anahtarı bulmanın maliyeti: zincirleme ve doğrusal yoklama.",
        load: "Doluluk oranını grafik boyunca sürükleyerek ya da ok tuşlarıyla ayarla. Eğrilerin doluluğa göre nasıl değiştiğine bak.",
        costs: "Dolmaya yakınken yoklama dikleşerek artar, zincirleme ise düz bir çizgide büyür.",
      },
      resize: {
        bars: "Her çubuk bir eklemenin yaptığı iş; tablo ikiye katlandığında kopyalanan bütün anahtarlar dahil.",
        add: "Anahtar eklemek için grafik boyunca sürükle ya da ok tuşlarını kullan. Kapasitenin hangi eklemede arttığına bak.",
        average:
          "Yüksek çubuklar kapasitenin arttığı eklemeleri gösterir. Ekleme başına ortalama iş grafiğini bu çubuklarla karşılaştır.",
      },
      modulus: {
        buckets: "Eşit adımlarla artan anahtarlar ve düştükleri kovalar.",
        step: "Adımı değiştir. Kullanılan kova sayısının nasıl değiştiğine bak.",
        size: "m ile s aralarında asal olacak bir boyut seç. Kullanılan kova sayısını karşılaştır.",
      },
      challenge: {
        pick: "Bir hash tablosuna kazandırman gereken üç özellik. Buradan birini seç.",
        work: "Anahtarlarını buraya yaz; her değişiklik sayfanın geri kalanıyla aynı hash ile kontrol edilir.",
        solved: "Bu özelliği taşıyan her şey geçer. Cevap anahtarı yok.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      address: "Adresi hesaplamak",
      collisions: "Zincirleme ve doğrusal yoklama",
      resize: "Dolunca iki katına çıkmak",
    },
    notes: {
      "mit-6006-hashing": "MIT'nin en baştan hash tabloları dersi.",
      "cp-birthday": "İki anahtarın neden sandığından erken aynı kovaya düştüğü.",
      "mit-6006-openaddr": "Açık adresleme ve doğrusal yoklama, maliyetleriyle.",
      "algs4-hash": "Lab'ın kullandığı yoklama formülleri (Önerme M).",
      "java-hashmap": "Java'nın kendi kuralı: 0,75 doluluk, sonra yaklaşık iki kat kova.",
      "ods-book":
        "Ücretsiz kitabın Hash Tables bölümünde zincirleme ve doğrusal yoklama yöntemlerini karşılaştır. Lab'daki doluluk oranı arttığında arama maliyetinin neden değiştiğini takip et.",
    },
  },
};

export default copy;
