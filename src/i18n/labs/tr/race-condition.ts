import type en from "../en/race-condition";

/**
 * Türkçe metin: race-condition. Şekli `en/race-condition.ts` ile birebir aynı
 * olmak zorundadır.
 *
 * "Thread" burada "iş parçacığı", "register" "yazmaç", "lock" "kilit". Kod
 * içindeki adlar (counter, balance, lock(m)) çevrilmez: ekranda kod olarak
 * durdukları için ek de almazlar; cümleler onlara "değişkeni", "kilidi" gibi
 * bir sözcükle yaslanır.
 */

/** İki iş parçacığının adı ekini okunuşuna göre alır: A'yı, B'yi. */
const accusative = (name: string) => (name === "A" ? "A'yı" : "B'yi");

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    ostep:
      "Lab'ın temel örneğini destekler: counter++ bir okuma, bir toplama ve bir yazmaya derlenir ve aralarına giren bir kesme bir güncellemeyi kaybettirir. Çare olarak kilitlerin ve atomik komutların anlatımını da destekler.",
    mutex:
      "4. bölümdeki kilidin ardındaki fikri destekler: kritik bölüme aynı anda yalnızca bir sürecin girmesi problemi ilk kez burada ortaya konup çözülmüştür.",
    concurrencyBugs:
      "5. bölümdeki iddiayı destekler: gerçek yazılımdaki yarışlar çoğunlukla bozulan bölünmezlik ya da bozulan sıradır ve çoğu yalnızca birkaç bellek erişiminin belirli bir sırasında ortaya çıkar; testte yakalanmalarını zorlaştıran da budur.",
    therac:
      "Nadir olanın zararsız olmadığını destekler: bir radyoterapi cihazının yazılımındaki, yalnızca belirli zamanlamalarda ortaya çıkan yarış durumları ölümcül aşırı dozlara yol açan nedenler arasındaydı.",
  },

  scheduler: {
    name: (t: 0 | 1) => (t === 0 ? "A" : "B"),
    thread: (name: string) => `İş parçacığı ${name}`,
    run: (name: string) => `${accusative(name)} çalıştır`,
    undo: "Geri al",
    reset: "Baştan başla",
    register: "r",
    memory: "Ortak bellek",
    lockFree: "boşta",
    lockHeld: (name: string) => `${name} tutuyor`,
    status: { waiting: "m'yi bekliyor", done: "bitti" },
    orderLabel: "Seçtiğiniz sıra",
    orderEmpty: "Henüz hiçbir şey çalışmadı.",
    said: {
      load: (who: string, v: string, value: number) =>
        `${who}, ${v} değerini kendi yazmacına okudu: r = ${value}.`,
      add: (who: string, value: number) =>
        `${who}, yazmacında 1 ekledi: r = ${value}. Bellek değişmedi.`,
      store: (who: string, v: string, value: number) => `${who}, ${v} değişkenine ${value} yazdı.`,
      lock: (who: string) => `${who}, m kilidini aldı. Bırakana kadar öteki iş parçacığı bekler.`,
      unlock: (who: string) => `${who}, m kilidini bıraktı.`,
      atomicAdd: (who: string, v: string, before: number, after: number) =>
        `${who}, ${v} değişkenine tek ve bölünmez bir adımda 1 ekledi: ${before} → ${after}.`,
      checkPass: (who: string, value: number) =>
        `${who} bakiyeye baktı: ${value}. Yeterli, yani para çekecek.`,
      checkFail: (who: string, value: number) =>
        `${who} bakiyeye baktı: ${value}. Yetmiyor, yani hiçbir şey ödemeyecek.`,
      withdraw: (who: string, before: number, after: number) =>
        `${who} 100 çekip ödedi: bakiye ${before} → ${after}.`,
    },
  },

  game: {
    title: "İki iş parçacığı, bir sayaç",
    question:
      "İki iş parçacığı, 0'dan başlayan bir sayaca birer ekliyor. Her biri counter++ satırını tam bir kez çalıştırıyor. Sayaç 1'de bitebilir mi?",
    hint: "Zamanlayıcı sizsiniz: bir iş parçacığının düğmesine basınca onun sıradaki adımı çalışır. Sayacı 1'de bitirmeye çalışın.",
    caption:
      "Her iş parçacığı counter++ satırını, işlemcinin yaptığı gibi üç adıma böler: belleği kendi yazmacına oku, orada 1 ekle, geri yaz. Tuşlar: A ve B bir adım çalıştırır, U geri alır, R baştan başlatır.",
    lost: "Sayaç 1'de bitti. İki iş parçacığı da, hiçbiri yazmadan önce 0 okudu; ikisi de 1 yazdı ve ikinci yazma birincisini sildi. İkisi de çalıştığı halde bir ekleme kayboldu.",
    kept: "Sayaç 2'de bitti. Bir iş parçacığı, öteki okumadan önce yazdı; kaybolan bir şey yok. Birkaç adım geri alıp önce iki okumayı da çalıştırmayı deneyin.",
    figures: {
      counter: "Sayaç",
      counterHint: "ortak bellekte, şu an",
      lostHint: "bir güncelleme kayboldu",
      keptHint: "iki güncelleme de yerine ulaştı",
      expected: "Beklenen",
      expectedHint: "iki iş parçacığı, birer ekleme",
    },
  },

  orders: {
    kicker: "Bütün sıralar",
    title: "Sıraların çoğu kaybettirir.",
    lede: "Sizin sıranız yirmi sıradan biriydi. Üçer adımlı iki iş parçacığı tam yirmi farklı biçimde iç içe geçebilir ve zamanlayıcı bunlardan herhangi birini seçmekte serbesttir. İşte hepsi, geride bıraktıkları sayaçla birlikte.",
    caption:
      "Her kart, altı adımın soldan sağa A'lı B'li bir sırasıdır. Birini seçince izini görürsünüz: her adımdan sonra iki yazmacın ve sayacın değeri.",
    announce: (order: string, counter: number) =>
      `${order} sırası: sayaç ${counter} olarak bitiyor.`,
    cardLabel: (order: string, counter: number) =>
      `${order} sırası, sayaç ${counter} olarak bitiyor`,
    traceCaption: "Seçilen sıra, her satırda bir adım",
    stepHeader: "Adım",
    regHeader: (name: string) => `${name} için r`,
    whyLost:
      "İki iş parçacığı da sayacı, hiçbiri geri yazmadan önce okudu. Sonra ne olursa olsun ikisi de aynı 1'i yazar.",
    whyRight:
      "Bir iş parçacığı, öteki hiçbir şey okumadan önce bitti. 2 bırakan sıralar yalnızca bu ikisi.",
    figures: {
      orders: "Sıra",
      ordersHint: "6 adım, 3'ü A'nın",
      lost: "Güncelleme kaybettiren",
      lostHint: "sayaç 1'de bitiyor",
      right: "Doğru çıkan",
      rightHint: "bir iş parçacığı tümüyle önce",
    },
  },

  odds: {
    kicker: "Nadir, ama var",
    title: "Testlerden neden geçiyor.",
    lede: "Sıraların çoğu kaybettiriyorsa böyle bir kod nasıl oluyor da çalışıyor? Çünkü gerçek bir zamanlayıcı sıraları eşit olasılıkla seçmez. Bir iş parçacığını bir süre çalıştırır, sonra değiştirir; zarar vermesi için değişimin tam o üç adımın arasına denk gelmesi gerekir. Burada iki iş parçacığı daha yükseğe sayıyor, iki yüz kez üst üste.",
    caption:
      "Her nokta tamamlanmış bir çalıştırmadır. Zamanlayıcı rastgele değiştirir; ortalama olarak yukarıda seçilen adım sayısında bir. Model bilerek basit tutuldu; önemli olan, iki iş parçacığının adımlarının ne kadar sık iç içe geçtiği.",
    announce: (right: number, runs: number, worst: string, slice: string) =>
      `Yaklaşık her ${slice} adımda bir değişimle ${runs} çalıştırmanın ${right} tanesi doğru çıktı. En kötü çalıştırma ${worst} güncelleme kaybetti.`,
    setup: (k: string, target: string, slice: string) =>
      `Her iş parçacığı counter++ satırını ${k} kez çalıştırıyor; doğru sonuç ${target}. Zamanlayıcı yaklaşık her ${slice} adımda bir değiştiriyor.`,
    dotsLabel: (right: number, total: number) =>
      `${total} çalıştırmanın ${right} tanesi doğru çıktı.`,
    legendRight: (target: string) => `${target} ile bitti`,
    legendShort: "eksik bitti",
    running: "Çalışıyor…",
    runningShort: "Çalışıyor…",
    allRight:
      "Bütün çalıştırmalar doğru çıktı. Yayına alalım mı? Hata hâlâ orada: o üç adım hâlâ bölünebilir, yalnızca iki yüz denemede denk gelmedi.",
    noneRight:
      "Tek bir çalıştırma bile doğru çıkmadı. Değişimler bu kadar sıkken ya da bu kadar çok sayarken okuma ile yazma arasındaki boşluğa her seferinde denk geliniyor.",
    someRight:
      "Aynı kod, aynı girdi; kimi çalıştırma doğru, kimi değil. Yarış durumunu bulmayı zorlaştıran tam da bu: bir test bugün geçip yarın kalabilir.",
    sliceLabel: "Ortalama değişim aralığı",
    sliceValue: (n: string) => `${n} adım`,
    again: (runs: number) => `${runs} kez daha çalıştır`,
    incrementsLabel: "İş parçacığı başına ekleme",
    secondaryLabel: "Her iş parçacığı ne kadar sayacak",
    figures: {
      right: "Doğru",
      rightHint: "hiçbir şey kaybetmeyen çalıştırma",
      worst: "En kötü çalıştırma",
      worstHint: "tek çalıştırmada kaybolan güncelleme",
      mean: "Ortalama kayıp",
      meanHint: "çalıştırma başına güncelleme",
    },
  },

  fix: {
    kicker: "Boşluğu kapatmak",
    title: "Kilitleyin ya da tek adım yapın.",
    lede: "Yarış, okuma ile yazma arasında yaşar. Bu boşluğu kapatmanın iki standart yolu var: o üç adıma aynı anda yalnızca bir iş parçacığını sokan bir kilit ve işlemcinin tek adımda yaptığı atomik ekleme. Şimdi bir güncelleme kaybettirmeyi deneyin.",
    hint: {
      none: "Koruma yok: öncekiyle aynı üç adım. Burada nasıl kaybettireceğinizi zaten biliyorsunuz.",
      lock: "A'nın ilk adımını çalıştırın, sonra araya B'yi sokmayı deneyin. Neden olmadığını düğmesi söylüyor.",
      atomic: "Her birinde tek adım var. Arasına girilecek bir yer yok.",
    },
    caption:
      "m kilidi de bellekteki bir değerdir, ama onu aynı anda yalnızca bir iş parçacığı tutabilir. Öteki onu tutarken lock(m) satırına gelen iş parçacığı orada bekler.",
    kept: {
      none: "Sayaç bu sefer 2'de bitti. Kod güvenli olduğu için değil: önce iki okumayı deneyin.",
      lock: "Sayaç 2'de bitti. Bir iş parçacığı kilidi tutarken öteki başlayamadı bile: zamanlayıcı yalnızca kimin önce gideceğini seçebildi.",
      atomic:
        "Sayaç 2'de bitti. Her ekleme tek adımdı, yani bir okuma ile onun yazması arasında hiçbir an olmadı.",
    },
    lost: "Sayaç 1'de bitti. Korumasız iki iş parçacığı da, hiçbiri yazmadan önce 0 okudu.",
    fixLabel: "Koruma",
    fixes: { none: "Yok", lock: "Kilit", atomic: "Atomik ekleme" },
    secondaryLabel: "Korumayı seçin",
    figures: {
      counter: "Sayaç",
      counterHint: "ortak bellekte, şu an",
      finalHint: "iki iş parçacığı da bittikten sonra",
      lost: "Kaybettiren sıra",
      lostHint: "zamanlayıcının bütün sıraları içinde",
      steps: "İş parçacığı başına adım",
      stepsHint: "korumanın bedeli",
    },
  },

  atm: {
    kicker: "Sıra sizde",
    title: "Bankaya iki kez ödetin.",
    lede: "İki ATM, içinde 100 olan tek bir hesabı paylaşıyor ve ikisi de 100 çekmeye çalışıyor. Bu sefer her adım zaten bölünmez, para çekme de dahil. 100 olan bir hesaptan yine de 200 çıkarabilir misiniz?",
    hint: {
      none: "Her ATM önce bakiyeye bakar, yeterliyse çeker. 200 ödeten sırayı bulun.",
      lock: "Şimdi bakiye kontrolü ile para çekme aynı kilidin içinde. Aynı numarayı deneyin.",
    },
    caption:
      "withdraw(100), bakiyeden 100 düşer ve onu tek, bölünmez bir adımda öder. Yarış hiçbir adımın içinde değil; iki adımın arasında.",
    overdrawn:
      "Banka, 100 olan bir hesaptan 200 ödedi. İki ATM de bakiye hâlâ 100 iken baktı, sonra ikisi de artık doğru olmayan bir kontrole dayanarak çekti. Her adım atomikti, yine de yarış oldu.",
    safe: {
      none: "Olması gerektiği gibi 100 ödendi. İkinci ATM, birincisi çektikten sonra baktı. İkisine de önce bakiyeye baktırmayı deneyin.",
      lock: "100 ödendi. Kontrol ile çekme aynı kilidin içindeyken ikinci ATM ancak birincisi bitince bakabildi ve 0 gördü.",
    },
    guardLabel: "Koruma",
    guards: { none: "Yok", lock: "İkisine birden kilit" },
    secondaryLabel: "Korumayı seçin",
    figures: {
      paid: "Ödenen",
      paidHint: "hesapta 100 vardı",
      paidOver: "hesaptakinden fazla",
      over: "Fazla ödeten sıra",
      overHint: "zamanlayıcının bütün sıraları içinde",
    },
  },

  recap: {
    lessons: [
      "Tek satır kod gibi görünen counter++, işlemci için birkaç adımdır: oku, değiştir, yaz.",
      "İki iş parçacığı belleği paylaştığında sonuç yalnızca koda değil, zamanlayıcının seçtiği sıraya da bağlı olabilir.",
      "Korumasız iki eklemenin sıralarının çoğu bir eklemeyi kaybettirir; yalnızca bir iş parçacığının önce bittiği sıralar doğrudur.",
      "Bir yarış durumu testten teste geçip yine de orada olabilir: ne sıklıkla görüneceğini doğruluk değil, zamanlama belirler.",
      "Kilit ya da atomik komut boşluğu kapatır, ama yalnızca adımları tek tek değil, kontrol-et-sonra-yap bütününü kapsıyorsa.",
    ],
    footer:
      "Lab zamanlayıcıyı simüle ediyor, çünkü bir web sayfası özel tarayıcı ayarları olmadan iş parçacıkları arasında düz bir değişkeni paylaşamaz. İki iş parçacığı ve birkaç adım için bu hiçbir şey kaybettirmez: yarış sıranın bir özelliğidir ve her sıra eksiksiz listelenir.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "İki iş parçacığı aynı sayaca 1 ekliyor. Sırayı siz belirlersiniz ve bir güncellemeyi kaybettirmeye çalışırsınız.",
    stages: {
      game: {
        threads:
          "A ve B, counter++ işlemini birer kez, üç adımda çalıştırır: oku, 1 ekle, yaz. Her düğme kendi iş parçacığının sıradaki adımını çalıştırır.",
        readA: "A sayacı okur: kendi yazmacına 0 alır.",
        readB: "B de A yazmadan önce okur, yani o da 0 alır.",
        goal: "Buradan sonra hangi sırayla bitirirseniz bitirin sayaç 2'de değil, 1'de kalır. Bitirip kontrol edin.",
      },
      orders: {
        cards:
          "Altı adımı iç içe geçirmenin yirmi yolunun hepsi; her biri geride bıraktığı sayaçla birlikte.",
        open: "Bir kartı açınca sırası adım adım görünür.",
        count: "Sıraların çoğu bir güncellemeyi kaybeder.",
      },
      odds: {
        runs: "İki iş parçacığı defalarca büyük bir sayıya kadar sayar. Her koşu bir nokta.",
        slice:
          "Zamanlayıcı geçiş yapmadan önce bir iş parçacığının ne kadar çalıştığı. Dilim kısaldıkça adımın ortasına denk gelme şansı artar.",
        result: "Kaç koşunun doğru çıktığı, en kötüsü ve ortalama.",
      },
      fix: {
        threads: "Aynı oyun, bu kez bir düzeltmeyle.",
        lock: "Korumayı seçin. Tur üç adımın etrafına bir kilit koydu.",
        run: "A'nın ilk adımını çalıştırın, sonra B'yi araya sokmaya çalışın; düğmesi neden beklemesi gerektiğini söyler.",
        atomic: "Ya da atomik toplamayı deneyin: her biri tek adım, araya girecek bir boşluk yok.",
      },
      atm: {
        machines:
          "İki ATM, içinde 100 olan tek bir hesabı paylaşıyor. Her biri 100 çekmek istiyor.",
        run: "Her adım bölünmez, yine de sıra önemli. Çalıştırın ve 200 çekmeye çalışın.",
        options: "Sorunu bulduğunuzda düzeltmesi burada.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      steps: "counter++ üç adımdır",
      fix: "Kilitler ve atomik komutlar",
      check: "Önce kontrol, sonra eylem",
    },
    notes: {
      "cp-race": "Yarış durumları insan ölçeğinde canlandırılmış.",
      "ostep-threads": "Lab'daki sayacın aynısı ve neden güncelleme kaybettiği.",
      "spanning-race": "Kritik bölgeyi korumak: Dekker algoritması.",
      "ostep-locks": "Kilitlerin atomik donanım komutlarından nasıl kurulduğu.",
      "ostep-bugs": "Gerçek yazılımlarda atomiklik ihlalleri (32.2 Non-Deadlock Bugs).",
    },
  },
};

export default copy;
