import type en from "../en/floating-point";

/** Türkçe metin: floating-point. Şekli `en/floating-point.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    ieee754:
      "Bu laboratuvarın hesap yaptığı ikili formatları (float64, float32 ve float16), özel değerlerini ve varsayılan yuvarlamayı tanımlar: en yakın değere, eşitlikte çift olana. Laboratuvarın aritmetiği bu kuralların kendi kesin uygulamasıdır ve tarayıcınınkiyle karşılaştırılarak doğrulanmıştır.",
    goldberg:
      "Çoğu ondalık sayının neden kesin bir ikili karşılığı olmadığını, bir float'ın hatasının neden büyüklüğüne oranla ölçüldüğünü ve kayan nokta toplamasının neden birleşme özelliği taşımadığını anlatan klasik çalışma.",
    ecma262:
      "Bir JavaScript sayısının nasıl yazdırılacağını tanımlar: aynı sayıya geri dönüşen en az basamakla (Number::toString, 5. adım). Konsolun saklanan değeri değil 0.30000000000000004 göstermesinin nedeni budur.",
    bfloat16:
      "float32'nin aralığını koruyan bfloat16'yı inceler ve derin öğrenme eğitiminin bu formatta, hiperparametreleri değiştirmeden float32 sonuçlarına ulaştığını bildirir; IEEE float16 ise ayar gerektirir.",
    mixedPrecision:
      "Ağırlıkları, aktivasyonları ve gradyanları float16 olarak saklayıp belleği neredeyse yarıya indirerek ağ eğitir; float16'nın dar aralığında kaybolan küçük gradyan değerlerini geri kazanmak için kaybı ölçeklendirir.",
  },

  invalid: "Bu laboratuvarın okuyabileceği bir sayı değil. 0.1, -2.5e-8, 1/3 ya da 0,1 deneyin.",
  showAll: (count: number) => `${count} basamağın hepsini göster`,
  showLess: "Yeniden katla",
  storedExactly: "Kesin olarak saklandı: hiçbir şey kaybolmadı.",
  kinds: {
    zero: "sıfır",
    subnormal: "alt normal",
    normal: "normal",
    infinity: "sonsuz",
    nan: "sayı değil",
  },

  // 1 ----------------------------------------------------------------------
  store: {
    title: "Gerçekte saklanan",
    question: "Bir sayı yazın. Bilgisayarınız gerçekte neyi saklıyor?",
    inputLabel: "Bir sayı",
    storedAs: "Saklanan değer",
    format: "float64, JavaScript'in tek sayı türü",
    prints: (shown: string) =>
      `Tarayıcınız bunu ${shown} olarak yazdırır: aynı saklanan değere geri dönüşen en kısa ondalık.`,
    tooBig: "64 bite sığmayacak kadar büyük. Infinity olarak saklanır.",
    tooSmall: "64 bitle gösterilemeyecek kadar küçük. 0 olarak saklanır.",
    infinity: "Infinity kendi başına bir değerdir ve kesin olarak saklanır.",
    notANumber: "NaN kendisi olarak saklanır: kendisine bile eşit olmayan tek değer.",
    another: "Başka bir tane göster",
    caption:
      "İşaretli basamaklar, saklanan değerin yazdığınızla uyuşmayı bıraktığı yerdir. Bu sayfadaki her saklanan değer kesin olarak gösterilir: laboratuvar float ile değil, tam sayılarla hesap yapar.",
    figures: {
      offBy: "Fark",
      relative: "Oransal fark",
      bits: "Bit",
      bitsHint: "büyük küçük her sayı için",
    },
    announce: (stored: string) => `${stored} olarak saklandı.`,
  },

  // 2 ----------------------------------------------------------------------
  sum: {
    kicker: "İkisini toplamak",
    title: "0.1 + 0.2 kaç eder?",
    lede: "Bakmadan önce karar verin. Sonra istediğiniz iki sayıyı girin; toplamın kesin değeri, hiçbir basamağı atılmadan yazılır.",
    question: "Tarayıcınız 0.1 + 0.2 için ne buluyor?",
    options: {
      exact: "Tam olarak 0.3",
      above: "0.3'ten biraz fazla",
      below: "0.3'ten biraz az",
    },
    yours: "Tahmininiz",
    actual: "Olan",
    agreed: "Bunu bekliyordunuz.",
    disagreed: "Neredeyse herkes tam olarak 0.3 bekler.",
    answer:
      "Biraz fazla: 0.30000000000000004. İki sayı da saklanırken biraz yukarı yuvarlandı ve toplamları, 0.3'ün aldığı değerin bir adım üstündeki saklanan değere yuvarlanıyor.",
    aLabel: "a",
    bLabel: "b",
    rows: {
      a: "a, saklandığı haliyle",
      b: "b, saklandığı haliyle",
      exact: "ikisinin kesin toplamı",
      sum: "a + b, float64'e yuvarlanmış",
      target: "gerçek sonuç, doğrudan saklanmış",
    },
    printsAs: (shown: string) => `${shown} olarak yazdırılır`,
    lineLabel: (steps: string) =>
      `Sonucun çevresindeki komşu float64 değerleri, ölçekli çizilmiş. ${steps}`,
    marks: {
      exact: "kesin toplam",
      truth: "gerçek sonuç",
      sum: "a + b",
      target: "saklanan sonuç",
    },
    same: "Aynı saklanan değer: burada toplam, sonucu doğrudan yazmışsınız gibi çıkıyor.",
    tie: "Kesin toplam iki float64 değerinin tam ortasına düşüyor. Eşitlikte kural, son biti 0 olana gitmektir; burada o da üstteki.",
    apart: (steps: string) =>
      `${steps} uzakta: toplam, sonucu doğrudan yazınca elde edilen sayı değil.`,
    steps: (n: string) => (n === "1" ? "Bir adım" : `${n} adım`),
    reset: "0.1 + 0.2'ye dön",
    caption:
      "Bir adım, iki komşu float64 değeri arasındaki boşluktur. Her girdi saklanırken bir kez yuvarlandı, toplam ise bir kez daha yuvarlanıyor.",
    figures: {
      sum: "a + b",
      equals: "a + b == sonuç",
      apart: "Uzaklık",
      yes: "true",
      no: "false",
      stepUnit: (n: string) => (n === "1" ? "1 adım" : `${n} adım`),
      stepSize: "Buradaki bir adım",
    },
    announce: (sum: string, equal: boolean) =>
      `a + b, ${sum}; doğrudan saklanan sonuca ${equal ? "eşit" : "eşit değil"}.`,
  },

  // 3 ----------------------------------------------------------------------
  bits: {
    kicker: "Bitlerin içi",
    title: "Bir biti çevirin, sayıyı izleyin.",
    lede: "Bu float32: float64 ile aynı tasarım, yarısı kadar bit, böylece hepsi sığıyor. Her kare bir bit. Herhangi birine tıklayın.",
    hint: "Önce soldan ikinci kareyi, sonra en sondakini deneyin.",
    groupLabel: "Bir float32'nin 32 biti, en anlamlıdan başlayarak",
    bitLabel: (position: number, field: string, value: number) =>
      `32 bitin ${position}. biti, ${field}, şu an ${value}`,
    fields: {
      sign: "işaret",
      exponent: "üs",
      fraction: "kesir",
    },
    fieldNotes: {
      sign: "0 artı, 1 eksi",
      exponent: "büyüklüğü belirler",
      fraction: "basamakları belirler",
    },
    named:
      "Üç alan. Üs, ikili noktanın yerini kaydırır; kesir, noktadan sonraki basamakları tutar. Tasarımın tamamı bu; float64 da aynısı, yalnızca 11 ve 52 bitle.",
    formula: "Okunuşu",
    setLabel: "Bitleri bir sayıdan ayarlayın",
    specials: {
      infinity: "Üs bitlerinin hepsi 1, kesir sıfır: bu desen Infinity demek.",
      nan: "Üs bitlerinin hepsi 1, kesir sıfır değil: bu desen NaN, yani sayı değil demek.",
      zero: "İşaretten sonraki her şey sıfır: bu sıfır. İşaret biti 1 ise −0 olur ve 0'a eşit sayılır.",
      subnormal:
        "Üs bitlerinin hepsi 0: gizli 1 ortadan kalkar ve sayı 0.kesir × 2⁻¹²⁶ olur. Bu alt normal değerler, sıfır ile en küçük normal sayı arasındaki boşluğu doldurur.",
    },
    caption: "Bir bit odaktayken ok tuşları satırda gezdirir, Boşluk tuşu biti çevirir.",
    figures: {
      value: "Değer",
      power: "Ölçek",
      powerHint: (field: number) => `üs alanı ${field} − 127`,
      kind: "Tür",
    },
    announce: (value: string, kind: string) => `Değer artık ${value}, ${kind}.`,
  },

  // 4 ----------------------------------------------------------------------
  ruler: {
    kicker: "Yazabildiği her değer",
    title: "Sayılar eşit aralıklı değil.",
    lede: "Gerçek bir format milyarlarca değer tutar, çizilemeyecek kadar çok. Bu, aynı tasarımın oyuncak boyutu; saklayabildiği her değer tek bir çizgiye sığıyor.",
    exponentBits: "Üs bitleri",
    fractionBits: "Kesir bitleri",
    controlsLabel: "Format",
    pick: "Bir değer seçin",
    pickValue: (value: string, n: number, total: number) => `${value}, ${total} değerin ${n}.'si`,
    lineLabel: (count: number, largest: string, perDoubling: number) =>
      `0 ile ${largest} arasında ${count} değer. Her iki katına çıkışta ${perDoubling} tane var, bu yüzden aralıklar her seferinde ikiye katlanıyor.`,
    legend: {
      normal: "normal değerler",
      subnormal: "alt normaller, 0'a kadar eşit aralıklı",
      picked: "seçilen değer",
    },
    caption:
      "Her iki katına çıkış aynı sayıda değer tutar, bu yüzden her biri bir öncekinin iki katı seyrek dağılır. Kesir biti ekleyince her aralık dolar; üs biti ekleyince çizgi daha uzağa uzanır.",
    figures: {
      values: "Değer sayısı",
      largest: "En büyük",
      gap: "Sonrakine boşluk",
      top: "yok: en büyüğü bu",
      perDoubling: "İki kata çıkışta",
    },
    announce: (value: string, gap: string) => `${value}, sonraki değer ${gap} yukarıda.`,
  },

  // 5 ----------------------------------------------------------------------
  gap: {
    kicker: "Yakınlaştırmak",
    title: "Büyük sayı, büyük boşluk.",
    lede: "Gerçek bir formata dönelim: float32. Sayının büyüklüğünü kaydırın ve saklayabildiği bir sonraki sayıya olan uzaklığa bakın.",
    slider: "Sayının büyüklüğü",
    sliderValue: (power: string) => `yaklaşık 2 üzeri ${power}`,
    inputLabel: "Ya da yazın",
    value: "Bu float32",
    next: "Bir sonraki",
    plusOne: "Bu sayı + 1",
    lost: "aynı sayı: + 1 kayboldu",
    kept: "farklı bir sayı",
    chartLabel: (gap: string) =>
      `Sonraki float32'ye olan boşluk ile sayının büyüklüğü, ikisi de logaritmik ölçekte: her ikinin kuvvetinde ikiye katlanan bir merdiven. Şu anki boşluk ${gap}.`,
    axes: {
      size: "sayının büyüklüğü",
      gap: "sonrakine boşluk",
    },
    wholeNumbers: "2²⁴'ten itibaren boşluk 2: tek tam sayılar artık saklanamıyor",
    caption:
      "Boşluk sayıyla birlikte büyür ama boşluk ÷ sayı neredeyse hiç değişmez: float32, sayı nerede olursa olsun yaklaşık 7 anlamlı ondalık basamak tutar. Kayan sözcüğünün anlamı budur.",
    figures: {
      gap: "Boşluk",
      relative: "Boşluk ÷ sayı",
      relativeHint: "her normal float32 için 2⁻²⁴ ile 2⁻²³ arasında",
      plusOne: "x + 1",
      lost: "kayboldu",
      kept: "korundu",
    },
    announce: (value: string, gap: string) => `${value}, sonrakine boşluk ${gap}.`,
  },

  // 6 ----------------------------------------------------------------------
  formats: {
    kicker: "Yapay zekâ için daha az bit",
    title: "Aralık mı, hassasiyet mi: birini seçin.",
    lede: "Bir yapay sinir ağı milyarlarca sayı saklar ve 16 bitlik bir sayı, 32 bitlik bir sayının yarısı kadar bellek kaplar. İki 16 bitlik format bitlerini farklı harcar: float16 daha çok kesir biti tutar, bfloat16 float32'nin üssünü korur.",
    examplesLabel: "Örnek değerler",
    examples: {
      weight: "Bir ağırlık",
      gradient: "Küçük bir gradyan",
      activation: "Büyük bir aktivasyon",
      third: "Üçte bir",
    },
    inputLabel: "Ya da bir sayı yazın",
    status: {
      exact: "kesin",
      rounded: (offBy: string) => `yuvarlandı, fark ${offBy}`,
      overflow: "çok büyük: Infinity olur",
      underflow: "çok küçük: 0 olur",
      special: "olduğu gibi saklanır",
    },
    layout: (exponent: number, fraction: number) =>
      `1 işaret, ${exponent} üs ve ${fraction} kesir biti`,
    table: {
      caption: "Her formatın tutabildikleri",
      format: "Format",
      bits: "Bit",
      largest: "En büyük",
      smallest: "0'dan büyük en küçük",
      digits: "Ondalık basamak",
    },
    bfloatNote:
      "bfloat16, IEEE 754'te yer almaz. float32 ile aynı yerleşime sahiptir, yalnızca kesir 23 bitten 7 bite kısaltılmıştır; laboratuvar ona da diğerleri gibi yuvarlar: en yakın değere, eşitlikte çift olana.",
    caption:
      "2 × 10⁻⁸ büyüklüğündeki bir gradyan bfloat16'da 2.0023 × 10⁻⁸ olarak yaşar, float16'da ise 0 olur, çünkü float16 yaklaşık 6 × 10⁻⁸'in altına inemez. bfloat16 ile eğitim bu tür değerleri ek bir düzenek olmadan korur; float16 ile eğitimde kaybolmasınlar diye kaybın büyütülmesi gerekir.",
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Sıra sizde",
    title: "Aritmetiğin olamaz dediği üç şey.",
    lede: "Her biri bu sayfadaki formatların gerçek bir özelliği. Sayfa cevabınızı baştan beri kullandığı kesin aritmetikle denetliyor.",
    pickLabel: "Bulmaca",
    solvedLabel: "Çözülen",
    reset: "Baştan başla",
    plusOne: {
      tab: "x + 1 = x",
      task: "float32'de x + 1'in x'e eşit olduğu bir x sayısı bulun.",
      hint: "Boşluğun 2'ye ulaştığı yere geri bakın.",
      xLabel: "x",
      stored: "float32'de x",
      result: "float32'de x + 1",
      solved: "Çözüldü: 1 eklemek hiçbir şeyi değiştirmedi.",
      notYet: "Henüz değil: x + 1 farklı bir sayı.",
      infinite:
        "Infinity + 1 yine Infinity, ama bu boşluklar hakkında bir şey söylemez. Sonlu bir x bulun.",
      best: (value: string) => `Bulduğunuz en küçük: ${value}`,
    },
    associative: {
      tab: "(a + b) + c",
      task: "(a + b) + c ile a + (b + c)'nin farklı çıktığı a, b ve c sayılarını bulun; JavaScript gibi float64'te.",
      hint: "Çok büyük bir sayıyı küçük bir sayıyla birleştirin.",
      left: "(a + b) + c",
      right: "a + (b + c)",
      solved: "Çözüldü: toplamaların sırası sonucu değiştirdi.",
      notYet: "Henüz değil: iki sıra da aynı sonucu veriyor.",
      notFinite:
        "Sonuçlardan biri sonlu bir sayı değil. NaN hiçbir şeye, kendisine bile eşit olmaz, bu yüzden sayılmaz: sonlu a, b ve c bulun.",
    },
    exact: {
      tab: "Kesin bir ondalık",
      task: "0 ile 1 arasında, noktadan sonra en fazla üç basamaklı ve float32'nin kesin olarak sakladığı bir sayı bulun. 0.5 sayılmaz.",
      hint: "İkili sistem hangi kesirleri kalansız yazabilir?",
      inputLabel: "Sayınız",
      rules: {
        range: "0 ile 1 arasında",
        places: "noktadan sonra en fazla üç basamak",
        notHalf: "0.5 değil",
        exact: "float32'de kesin olarak saklanıyor",
      },
      solved: "Çözüldü.",
      notYet: "Henüz değil: yukarıdaki kurallardan biri sağlanmıyor.",
      reveal:
        "Tam yedi tane var, 0.5 de içlerinde: 0.125, 0.25, 0.375, 0.5, 0.625, 0.75 ve 0.875. Hepsi sekizde birlerin tam katı, çünkü bir ondalık sayı ikili sistemde ancak en sade kesir halinde paydası ikinin bir kuvveti olduğunda kesindir.",
    },
    caption: "Çözülen bulmacalar bu tarayıcıda hatırlanır.",
    announce: (solved: number, total: number) => `${total} bulmacadan ${solved} tanesi çözüldü.`,
  },

  recap: {
    lessons: [
      "Bir float, sabit sayıda bitle yazabildiği en yakın sayıyı saklar ve 0.1 de dahil çoğu ondalık sayı bunlardan biri değildir",
      "Her aritmetik sonuç yeniden yuvarlanır, bu yüzden hatalar birikir ve işlemlerin sırası sonucu değiştirebilir",
      "Üs büyüklüğü, kesir basamakları belirler; bu yüzden komşular arasındaki boşluk sayıyla büyürken oransal hata hemen hemen aynı kalır",
      "Format seçmek aralık ile hassasiyet arasında seçim yapmaktır; modellerin float16 yerine bfloat16 ile eğitilmesinin nedeni budur",
    ],
    footer:
      "Kodda bu, hesaplanmış iki float'ın == ile değil bir tolerans payıyla karşılaştırılmasının, paranın tam kuruşlarla sayılmasının ve uzun bir toplamın farklı sırayla toplandığında farklı çıkabilmesinin nedenidir.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Bir sayı yazın; bilgisayarınızın onun yerine gerçekte neyi sakladığı basamak basamak yazılır.",
    stages: {
      store: {
        type: "Bu kutuya bir sayı yazın. Tur 0.1 yazdı.",
        stored:
          "Gerçekte saklanan değer. İşaretli basamaklar, yazdığınızla uyuşmadığı yerden başlar.",
        offBy:
          "Saklanan değerin sizinkinden ne kadar saptığı: hem sayı olarak hem de büyüklüğüne oranla.",
        another: "Bu düğme denemeniz için başka bir örnek yazar.",
      },
      sum: {
        line: "a ve b'nin saklanan halleri, kesin toplamları ve float64'ün onu yuvarladığı yer.",
        type: "İstediğiniz iki sayıyı girin. Tur b'yi 0.4 yaptı.",
        steps:
          "Yuvarlanmış toplamın gerçek cevaptan uzaklığı, komşu değerler arasındaki adımlarla sayılmış.",
        reset: "Bu düğme 0.1 + 0.2'yi geri getirir.",
      },
      bits: {
        bits: "float32, her bit bir kare: işaret, üs ve kesir.",
        flip: "Bir bite tıklayınca tersine döner. Tur ikinciyi, üssün en üst bitini çevirdi.",
        value: "Bu bitlerin şimdi anlattığı değer ve üssün seçtiği ikinin kuvveti.",
        set: "Ya da buradan bir değer seçip hangi bitleri gerektirdiğine bakın.",
      },
      ruler: {
        line: "Küçük bir biçimin saklayabildiği bütün değerler, tek bir çizgide. Her ikiye katlanan aralıkta aynı sayıda değer var.",
        pick: "Bu kaydırıcıyla bir değer seçin. Bu uçta değerler birbirinden çok uzak.",
        bits: "Üs biti eklerseniz çizgi uzar; kesir biti eklerseniz sıklaşır.",
      },
      gap: {
        chart: "Yine float32: bir sayıdan saklanabilen bir sonraki sayıya olan uzaklık.",
        size: "Daha büyük bir sayıya kaydırın. Tur aralığın tepesine doğru çıktı.",
        gap: "Aralık sayıyla birlikte büyüdü ama aralık ÷ sayı neredeyse aynı kaldı: her yerde yaklaşık 7 anlamlı basamak.",
      },
      formats: {
        type: "Bir sayı yazın; float32, float16 ve bfloat16'daki hali görünür. Tur çok küçük bir gradyan yazdı.",
        rows: "bfloat16 onu korur, float16 ise 0'a çevirir: aynı 16 bit, farklı harcanmış.",
        examples: "Diğer örnekleri buradan deneyin.",
      },
      challenge: {
        pick: "Aritmetiğe göre olamayacak üç şey. Buradan birini seçin.",
        work: "Bunu gerçekleştiren bir sayı bulun. Sayfa, kesin aritmetikle kontrol eder.",
        solved: "Çözülen bulmacalar bu tarayıcıda hatırlanır.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      stored: "Bir float neyi saklayabilir, neyi saklayamaz",
      rounding: "Tekrar tekrar yuvarlama",
      formats: "Aralık mı, hassasiyet mi",
    },
    notes: {
      "cp-float": "0,1 + 0,2'nin neden 0,3 olmadığı, en baştan.",
      "cp-float-1": "İşaret, üs ve kesir, bit bit.",
      "cp-float-2": "İki float'ın nasıl toplandığı ve yuvarlamanın nerede olduğu.",
      "goldberg-float": "Yuvarlama hatası ve IEEE aritmetiği üzerine klasik makale.",
      "google-bfloat16":
        "bfloat16'nın neden float32'nin üssünü koruyup kesir bitlerinden vazgeçtiği.",
    },
  },
};

export default copy;
