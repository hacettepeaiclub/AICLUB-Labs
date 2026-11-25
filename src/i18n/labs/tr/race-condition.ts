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
      "Paylaşılan sayacı artırma örneğini okuma, artırma ve yazma olarak inceler. İşlemler iç içe geçtiğinde bir artırmanın nasıl kaybolabildiğini, kilitlerin ve atomik komutların neyi koruduğunu açıklar.",
    mutex:
      "Kritik bölgeye aynı anda yalnızca bir sürecin girmesini sağlayan karşılıklı dışlama problemini ele alır.",
    concurrencyBugs:
      "5. bölümdeki iddiayı destekler. Gerçek yazılımdaki yarışlar çoğunlukla atomiklik ihlali ya da sıra ihlalidir. Çoğu, birkaç bellek erişimi belirli bir sırada gerçekleştiğinde ortaya çıkar. Bu yüzden testte yakalanmaları zordur.",
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
    status: { waiting: "m kilidini bekliyor", done: "bitti" },
    orderLabel: "Seçtiğin sıra",
    orderEmpty: "Henüz adım çalıştırmadın.",
    said: {
      load: (who: string, v: string, value: number) =>
        `${who}, ${v} değerini kendi yazmacına okudu: r = ${value}.`,
      add: (who: string, value: number) =>
        `${who}, yazmacındaki değere 1 ekledi: r = ${value}. Bellek değişmedi.`,
      store: (who: string, v: string, value: number) => `${who}, ${v} değişkenine ${value} yazdı.`,
      lock: (who: string) => `${who}, m kilidini aldı. Bırakana kadar öteki iş parçacığı bekler.`,
      unlock: (who: string) => `${who}, m kilidini bıraktı.`,
      atomicAdd: (who: string, v: string, before: number, after: number) =>
        `${who}, ${v} değişkenine tek ve bölünmez bir adımda 1 ekledi: ${before} → ${after}.`,
      checkPass: (who: string, value: number) =>
        `${who} bakiyeyi ${value} olarak okudu. Çekme koşulu sağlandı.`,
      checkFail: (who: string, value: number) =>
        `${who} bakiyeyi ${value} olarak okudu. Çekme koşulu sağlanmadı.`,
      withdraw: (who: string, before: number, after: number) =>
        `${who} 100 ödedi. Bakiye ${before} → ${after}.`,
    },
  },

  game: {
    title: "İki iş parçacığı aynı sayacı artırırsa",
    question:
      "İki iş parçacığı, 0'dan başlayan bir sayacı birer kez artırıyor. Her biri counter++ satırını tam bir kez çalıştırıyor. İki artırma da tamamlandığında sayaç 1 olabilir mi?",
    hint: "A veya B düğmesi ilgili iş parçacığının bir sonraki işlemini çalıştırır. İşlemlerin sırasını seçerek iki artırma tamamlandığında sayacın 1 olduğu bir sıra bul.",
    caption:
      "Model her counter++ işlemini üç adımda gösterir. İş parçacığı sayacı yazmacına okur, yazmaca 1 ekler ve sonucu belleğe yazar. A ve B tuşları sıradaki adımı çalıştırır. U geri alır, R başa döndürür.",
    lost: "Sayaç 1 oldu. İki iş parçacığı da ilk yazmadan önce 0 okudu. İkisi de 1 yazdığı için ikinci yazma ilk artırmanın üzerine yazdı.",
    kept: "Sayaç 2 oldu. Bir iş parçacığı yazdıktan sonra diğeri 1 okudu. İki okumanın da ilk yazmadan önce gerçekleştiği sırayı dene.",
    figures: {
      counter: "Sayaç",
      counterHint: "ortak bellekte, şu an",
      lostHint: "bir güncelleme kayboldu",
      keptHint: "iki artırma da sayaca yansıdı",
      expected: "Beklenen",
      expectedHint: "iki iş parçacığı, birer ekleme",
    },
  },

  orders: {
    kicker: "Bütün sıralar",
    title: "Hangi işlem sıralarında güncelleme kaybolur?",
    lede: "İki iş parçacığının üçer adımı, kendi iç sıraları korunarak 20 farklı sırada çalıştırılabilir. Kartlarda her sıranın son sayaç değerini karşılaştır.",
    caption:
      "Bir kart seç. Karttaki A ve B harfleri, altı adımı hangi iş parçacığının çalıştırdığını gösterir. Tabloda her adımın ardından iki yazmacın ve sayacın değerine bak.",
    announce: (order: string, counter: number) =>
      `${order} sırası: sayaç ${counter} olarak bitiyor.`,
    cardLabel: (order: string, counter: number) =>
      `${order} sırası, sayaç ${counter} olarak bitiyor`,
    traceCaption: "Seçilen sıra, her satırda bir adım",
    stepHeader: "Adım",
    regHeader: (name: string) => `${name} için r`,
    whyLost:
      "İlk yazmadan önce iki iş parçacığı da 0 okudu. Kalan adımlar hangi sırada çalışırsa çalışsın, ikisi de 1 yazar.",
    whyRight:
      "Bir iş parçacığı bütün adımlarını diğerinden önce tamamladı. Sonucu 2 olan iki sırada da bu koşul sağlanır.",
    figures: {
      orders: "Sıra",
      ordersHint: "6 adım, 3'ü A'nın",
      lost: "Güncelleme kaybettiren",
      lostHint: "sayaç 1'de bitiyor",
      right: "Doğru çıkan",
      rightHint: "bir iş parçacığı bütün adımlarını önce tamamladı",
    },
  },

  odds: {
    kicker: "Zamanlayıcı denemeleri",
    title: "Testler bu hatayı neden kaçırabilir?",
    lede: "Gerçek bir zamanlayıcı bu sıraları eşit olasılıkla seçmez. Buradaki model, ortalama kaç işlemde bir iş parçacığının değiştiğini ayarlamana izin verir. Aynı ayarla yapılan 200 çalıştırmanın sonuçlarını incele.",
    caption:
      "Nokta, sayacın beklenen sonuca ulaştığını gösterir. Boş kare, güncelleme kaybı olduğunu gösterir. Zamanlayıcı adımlar arasında rastgele geçiş yapar.",
    announce: (right: number, runs: number, worst: string, slice: string) =>
      `Yaklaşık her ${slice} adımda bir değişimle ${runs} çalıştırmanın ${right} tanesi doğru çıktı. En kötü çalıştırma ${worst} güncelleme kaybetti.`,
    setup: (k: string, target: string, slice: string) =>
      `Her iş parçacığı counter++ satırını ${k} kez çalıştırır. Beklenen sayaç değeri ${target}. İş parçacığı ortalama ${slice} adımda bir değişiyor.`,
    dotsLabel: (right: number, total: number) =>
      `${total} çalıştırmanın ${right} tanesi doğru çıktı.`,
    legendRight: (target: string) => `${target} ile bitti`,
    legendShort: "eksik bitti",
    running: "Çalışıyor…",
    runningShort: "Çalışıyor…",
    allRight:
      "Bu 200 çalıştırmada güncelleme kaybolmadı. Okuma, artırma ve yazma ayrı adımlar olduğu için başka bir sırada güncelleme kaybolabilir.",
    noneRight:
      "Bu ayarlarda her çalıştırmada en az bir güncelleme kayboldu. Değişim aralığını uzatıp doğru sonuç sayısını karşılaştır.",
    someRight:
      "Aynı kod ve girdiyle farklı sonuçlar çıktı. Bir yarış durumunda sonuç, adımların hangi sırada çalıştığına bağlıdır.",
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
    kicker: "Kritik bölgeyi koru",
    title: "Kilitleme ve atomik güncelleme",
    lede: "Okuma, artırma ve yazma işlemlerinin arasına başka bir iş parçacığı girebilir. Kilit bu üç işlemi birlikte korur; atomik artırma ise tek işlemde tamamlanır. Her yöntemde kayıp güncelleme oluşturmayı dene.",
    hint: {
      none: "İki iş parçacığının okuma adımını yazmalardan önce çalıştır. Son sayaç değerine bak.",
      lock: "A'nın kilidi almasını sağla. B'yi çalıştırmayı dene ve m kilidini bekliyor etiketine bak.",
      atomic:
        "A ve B düğmelerine birer kez bas. Her atomik artırma, sayaç değerini tek adımda değiştirir.",
    },
    caption:
      "m kilidi de bellekteki bir değerdir, ama onu aynı anda yalnızca bir iş parçacığı tutabilir. Öteki onu tutarken lock(m) satırına gelen iş parçacığı orada bekler.",
    kept: {
      none: "Sayaç bu sırada 2 oldu. İki okumayı da yazmalardan önce çalıştırıp sonucu karşılaştır.",
      lock: "Sayaç 2 oldu. Bir iş parçacığı kilidi tutarken diğeri bekledi. Her artırmanın üç adımı aynı kritik bölgede tamamlandı.",
      atomic: "Sayaç 2 oldu. Her artırma atomik olarak tamamlandı.",
    },
    lost: "Sayaç 1'de bitti. Korumasız iki iş parçacığı da, hiçbiri yazmadan önce 0 okudu.",
    fixLabel: "Koruma",
    fixes: { none: "Yok", lock: "Kilit", atomic: "Atomik ekleme" },
    secondaryLabel: "Korumayı seç",
    figures: {
      counter: "Sayaç",
      counterHint: "ortak bellekte, şu an",
      finalHint: "iki iş parçacığı da bittikten sonra",
      lost: "Kaybettiren sıra",
      lostHint: "zamanlayıcının bütün sıraları içinde",
      steps: "İş parçacığı başına adım",
      stepsHint: "kilit alma ve bırakma varsa dahil",
    },
  },

  atm: {
    kicker: "Bakiye deneyi",
    title: "İki ATM aynı bakiyeye göre ödeme yapabilir mi?",
    lede: "Modelde iki ATM, bakiyesi 100 olan bir hesaptan 100'er çekmeye çalışır. Bakiye kontrolü ve para çekme ayrı atomik adımlardır. Hangi sırada toplam ödeme 200 olur?",
    hint: {
      none: "İki ATM de önce bakiyeyi kontrol eder. Toplam ödemenin 200 olduğu sırayı bul.",
      lock: "Bakiye kontrolü ile para çekme aynı kritik bölgede. İkinci ATM'nin kontrolü ne zaman yapabildiğine bak.",
    },
    caption:
      "withdraw(100), bakiyeden 100 düşüp toplam ödemeye 100 ekler. Bu adım atomiktir. Bakiye kontrolü ayrı bir adım olduğu için iki ATM de ilk çekimden önce aynı bakiyeyi görebilir.",
    overdrawn:
      "İki ATM de bakiyeyi 100 olarak okudu. İlk ödeme yapıldığında ikinci ATM'nin okuduğu değer güncelliğini yitirdi. İkinci çekme de çalışınca toplam ödeme 200 oldu.",
    safe: {
      none: "Olması gerektiği gibi 100 ödendi. İkinci ATM, birincisi çektikten sonra baktı. İkisine de önce bakiyeye baktırmayı dene.",
      lock: "100 ödendi. Kontrol ile çekme aynı kilidin içindeyken ikinci ATM ancak birincisi bitince bakabildi ve 0 gördü.",
    },
    guardLabel: "Koruma",
    guards: { none: "Yok", lock: "Kontrol ve çekme için ortak kilit" },
    secondaryLabel: "Korumayı seç",
    figures: {
      paid: "Ödenen",
      paidHint: "başlangıç bakiyesi 100",
      paidOver: "hesaptakinden fazla",
      over: "Fazla ödeten sıra",
      overHint: "zamanlayıcının bütün sıraları içinde",
    },
  },

  recap: {
    lessons: [
      "Modelde counter++ üç adımdır. Sayacı oku, yazmaca 1 ekle ve sonucu belleğe yaz.",
      "İki iş parçacığı belleği paylaştığında sonuç yalnızca koda değil, zamanlayıcının seçtiği sıraya da bağlı olabilir.",
      "Korumasız iki eklemenin sıralarının çoğu bir eklemeyi kaybettirir; yalnızca bir iş parçacığının önce bittiği sıralar doğrudur.",
      "Bir test doğru sonuç verebilir. Kayıp güncelleme, okuma ve yazmalar farklı bir sırada çalıştığında ortaya çıkabilir.",
      "Sayacı korumak için okuma, artırma ve yazmayı birlikte kilitle veya tek atomik artırma kullan. ATM örneğinde kilit hem bakiye kontrolünü hem para çekmeyi kapsar.",
    ],
    footer:
      "Bu lab, iki iş parçacığının işlemlerini sırayla simüle eder. Sayaç örneğinde bütün geçerli sıralar hesaplanabilir. Bir kart seçerek her adımın belleğe ve yazmaçlara etkisini incele.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "İki iş parçacığı aynı sayacı artırıyor. İşlemleri sırayla çalıştırarak iki güncellemeden birinin nasıl kaybolduğunu incele.",
    stages: {
      game: {
        threads:
          "A ve B, counter++ işlemini birer kez, üç adımda çalıştırır: oku, 1 ekle, yaz. Her düğme kendi iş parçacığının sıradaki adımını çalıştırır.",
        readA: "A sayacı okur: kendi yazmacına 0 alır.",
        readB: "B de A yazmadan önce okur, yani o da 0 alır.",
        goal: "İki okumadan sonra kalan adımları çalıştır. İki iş parçacığı da belleğe 1 yazar.",
      },
      orders: {
        cards: "Kartlar altı adımın 20 olası sırasını ve son sayaç değerini gösterir.",
        open: "Bir kartı açınca sırası adım adım görünür.",
        count: "Sıraların çoğu bir güncellemeyi kaybeder.",
      },
      odds: {
        runs: "Her nokta, iki iş parçacığının tüm artırmalarını tamamladığı bir çalıştırmadır.",
        slice:
          "Ortalama değişim aralığını kısalt. Okuma ile yazmanın arasına başka bir adım girdikçe kayıp güncellemelerin nasıl değiştiğine bak.",
        result: "Doğru, En kötü çalıştırma ve Ortalama kayıp sayaçlarına bak.",
      },
      fix: {
        threads: "Aynı sayaçla korumasız, kilitli ve atomik artırma seçeneklerini karşılaştır.",
        lock: "Tur, Koruma seçeneklerinden Kilit'i seçti. Okuma, artırma ve yazma artık aynı kritik bölgede çalışır.",
        run: "Tur A'nın ilk adımını çalıştırdı ve A m kilidini aldı. Şimdi B'yi çalıştır ve m kilidini bekliyor etiketine bak.",
        atomic: "Atomik eklemeyi seç. A ve B birer adımda sayacı artırır.",
      },
      atm: {
        machines: "İki ATM aynı bakiyeyi okur. Her ATM'nin çekme tutarı 100.",
        run: "İki ATM'nin de bakiye kontrolünü çalıştır. Ardından çekimleri tamamla ve toplam ödemeye bak.",
        options: "Ortak kilidi seç ve aynı işlem sırasını dene.",
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
