import type en from "../en/floating-point";

/** Türkçe metin: floating-point. Şekli `en/floating-point.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    ieee754:
      "Bu lab'ın hesap yaptığı ikili biçimleri (float64, float32 ve float16), özel değerlerini ve varsayılan yuvarlamayı tanımlar: en yakın değere, eşitlikte çift olana. Lab'ın aritmetiği bu kuralların kendi kesin uygulamasıdır ve tarayıcınınkiyle karşılaştırılarak doğrulanmıştır.",
    goldberg:
      "Çoğu ondalık sayının neden kesin bir ikili karşılığı olmadığını, kayan noktalı bir sayının hatasının neden büyüklüğüne oranla ölçüldüğünü ve kayan nokta toplamasının neden birleşme özelliği taşımadığını anlatan klasik çalışma.",
    ecma262:
      "Bir JavaScript sayısının nasıl yazdırılacağını tanımlar: aynı sayıya geri dönüşen en az basamakla (Number::toString, 5. adım). Konsolun saklanan değeri değil 0.30000000000000004 göstermesinin nedeni budur.",
    bfloat16:
      "float32'nin aralığını koruyan bfloat16'yı inceler ve derin öğrenme eğitiminin bu biçimde, hiperparametreleri değiştirmeden float32 sonuçlarına ulaştığını bildirir; IEEE float16 ise ayar gerektirir.",
    mixedPrecision:
      "Ağırlıkları, aktivasyonları ve gradyanları float16 olarak saklayıp belleği neredeyse yarıya indirerek ağ eğitir; float16'nın dar aralığında kaybolan küçük gradyan değerlerini geri kazanmak için kaybı ölçeklendirir.",
  },

  invalid: "0,1 veya -2,5e-8 ya da 1/3 gibi bir sayı gir.",
  showAll: (count: number) => `${count} basamağın hepsini göster`,
  showLess: "Daha az basamak göster",
  storedExactly: "Değer tam olarak temsil ediliyor.",
  kinds: {
    zero: "sıfır",
    subnormal: "alt normal",
    normal: "normal",
    infinity: "sonsuz",
    nan: "sayı değil",
  },

  // 1 ----------------------------------------------------------------------
  store: {
    title: "Bilgisayar hangi değeri saklar?",
    question:
      "Bir sayı yaz. Saklanan değerin tam ondalık gösterimini girdiğin sayıyla karşılaştır.",
    inputLabel: "Bir sayı",
    storedAs: "Saklanan değer",
    format: "float64, JavaScript'in Number türü",
    prints: (shown: string) =>
      `Tarayıcın bunu ${shown} olarak yazdırır: aynı saklanan değere geri dönüşen en kısa ondalık.`,
    tooBig: "Sayı float64 aralığını aşıyor ve sonsuza yuvarlanıyor.",
    tooSmall: "Sayının mutlak değeri çok küçük. float64 gösteriminde sıfıra yuvarlanıyor.",
    infinity: "Sonsuzluk, float64 biçiminde özel bir bit dizisiyle gösterilir.",
    notANumber:
      "NaN, sayı olmayan sonucu gösterir. Eşitlik karşılaştırmasında kendisiyle bile eşit çıkmaz.",
    another: "Başka bir örnek göster",
    caption:
      "İşaretli basamakların başladığı yere bak. Saklanan değer bu basamakta girdiden ayrılır. Tam ondalık açılım, tam sayı aritmetiğiyle hesaplanır.",
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
    kicker: "Toplama",
    title: "0,1 + 0,2 kaç eder?",
    lede: "Önce toplamı tahmin et. Sonra iki sayıyı gir ve float işleminin ürettiği değerin tam açılımını incele.",
    question: "Tarayıcı 0,1 + 0,2 için hangi sonucu hesaplar?",
    options: {
      exact: "Tam olarak 0,3",
      above: "0,3'ten biraz büyük",
      below: "0,3'ten biraz küçük",
    },
    yours: "Tahminin",
    actual: "Hesaplanan sonuç",
    agreed: "Bunu bekliyordun.",
    disagreed: "Girdilerin saklanan değerlerini ve yuvarlanmış toplamı aşağıda karşılaştır.",
    answer:
      "Tarayıcı sonucu 0.30000000000000004 olarak yazar. İki girdi de float64 biçiminde biraz yukarı yuvarlanır. Saklanan girdilerin tam toplamı, 0,3 yazıldığında saklanan değerin bir sonraki komşusuna yuvarlanır.",
    aLabel: "a",
    bLabel: "b",
    rows: {
      a: "a, saklandığı hâliyle",
      b: "b, saklandığı hâliyle",
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
    same: "Aynı saklanan değer: burada toplam, sonucu doğrudan yazmışsın gibi çıkıyor.",
    tie: "Kesin toplam iki float64 değerinin tam ortasına düşüyor. Tam ortada, en düşük anlamlı biti 0 olan değer seçilir. Bu örnekte o değer üstteki komşudur.",
    apart: (steps: string) =>
      `${steps} uzakta: toplam, sonucu doğrudan yazınca elde edilen sayı değil.`,
    steps: (n: string) => (n === "1" ? "Bir adım" : `${n} adım`),
    reset: "0,1 + 0,2'ye dön",
    caption:
      "Bir adım, iki komşu float64 değeri arasındaki uzaklıktır. Her girdi saklanırken bir kez yuvarlandı, toplam ise bir kez daha yuvarlanıyor.",
    figures: {
      sum: "a + b",
      equals: "a + b == sonuç",
      apart: "Uzaklık",
      yes: "Eşit",
      no: "Eşit değil",
      stepUnit: (n: string) => (n === "1" ? "1 adım" : `${n} adım`),
      stepSize: "Buradaki bir adım",
    },
    announce: (sum: string, equal: boolean) =>
      `a + b, ${sum}; doğrudan saklanan sonuca ${equal ? "eşit" : "eşit değil"}.`,
  },

  // 3 ----------------------------------------------------------------------
  bits: {
    kicker: "İşaret, üs ve kesir",
    title: "Bir biti değiştirince sayı nasıl değişir?",
    lede: "float32 biçiminde her sayı için 32 bit ayrılır. Her kare bir bittir. Bir kareye tıklayıp işaret, üs veya kesir alanındaki değişimin sayıyı nasıl etkilediğini gör.",
    hint: "Önce soldan ikinci kareyi, sonra en sondakini dene.",
    groupLabel: "Bir float32'nin 32 biti, en anlamlıdan başlayarak",
    bitLabel: (position: number, field: string, value: number) =>
      `Bit ${position}, ${field} alanı. Değer ${value}.`,
    fields: {
      sign: "işaret",
      exponent: "üs",
      fraction: "kesir",
    },
    fieldNotes: {
      sign: "0 artı, 1 eksi",
      exponent: "ikinin kuvvetini belirler",
      fraction: "kesrin ikili basamaklarını tutar",
    },
    named:
      "Üs, değeri ikinin bir kuvvetiyle ölçekler. Kesir alanı noktanın sağındaki ikili basamakları tutar. float64 biçiminde üse 11, kesre 52 bit ayrılır.",
    formula: "Okunuşu",
    setLabel: "Bitleri bir sayıdan ayarla",
    specials: {
      infinity: "Üs bitlerinin hepsi 1, kesir sıfır: bu desen Infinity demek.",
      nan: "Üs bitlerinin hepsi 1, kesir sıfır değil: bu desen NaN, yani sayı değil demek.",
      zero: "İşaretten sonraki her şey sıfır: bu sıfır. İşaret biti 1 ise −0 olur ve 0'a eşit sayılır.",
      subnormal:
        "Üs bitlerinin hepsi 0: gizli 1 ortadan kalkar ve sayı 0.kesir × 2⁻¹²⁶ olur. Bu alt normal değerler, sıfır ile en küçük normal sayı arasında eşit aralıklıdır.",
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
    kicker: "Temsil edilebilen değerler",
    title: "Komşu sayılar arasındaki mesafe",
    lede: "Bu küçük biçim, kayan noktalı sayıların çalışma biçimini az sayıda bitle gösterir. Temsil edilebilen değerlerin tamamını çizgi üzerinde görebilirsin.",
    exponentBits: "Üs bitleri",
    fractionBits: "Kesir bitleri",
    controlsLabel: "Biçim",
    pick: "Bir değer seç",
    pickValue: (value: string, n: number, total: number) =>
      `Değer ${value}. ${total} değerden sıra ${n}.`,
    lineLabel: (count: number, largest: string, perDoubling: number) =>
      `0 ile ${largest} arasında ${count} değer. İkinin ardışık kuvvetleri arasındaki her normal değer aralığında ${perDoubling} değer bulunur. Komşuların uzaklığı bu aralıklar arasında iki katına çıkar.`,
    legend: {
      normal: "normal değerler",
      subnormal: "alt normaller, 0'a kadar eşit aralıklı",
      picked: "seçilen değer",
    },
    caption:
      "İkinin birbirini izleyen iki kuvveti arasındaki normal değerleri karşılaştır. Değer sayısı aynı kalır, komşular arasındaki uzaklık iki katına çıkar. Kesir biti eklemek komşu değerler arasındaki uzaklığı azaltır. Üs biti eklemek değer aralığını genişletir.",
    figures: {
      values: "Değer sayısı",
      largest: "En büyük",
      gap: "Bir sonraki değere uzaklık",
      top: "yok: en büyüğü bu",
      perDoubling: "İkinin ardışık kuvvetleri arasında",
    },
    announce: (value: string, gap: string) => `Değer ${value}. Sonraki değere uzaklık ${gap}.`,
  },

  // 5 ----------------------------------------------------------------------
  gap: {
    kicker: "float32 aralıkları",
    title: "Sayı büyüdükçe komşular arasındaki uzaklık nasıl değişir?",
    lede: "Bir float32 sayısının büyüklüğünü değiştir. Temsil edilebilen bir sonraki sayıya olan uzaklığı incele.",
    slider: "Sayının büyüklüğü",
    sliderValue: (power: string) => `yaklaşık 2 üzeri ${power}`,
    inputLabel: "Sayı gir",
    value: "Saklanan float32 değeri",
    next: "Bir sonraki",
    plusOne: "Bu sayı + 1",
    lost: "aynı sayı: + 1 kayboldu",
    kept: "farklı bir sayı",
    chartLabel: (gap: string) =>
      `Grafik logaritmik eksenlerde sayının büyüklüğünü ve sonraki float32 değerine uzaklığı gösterir. Bu uzaklık ikinin ardışık kuvvetleri arasında iki katına çıkar. Seçili uzaklık ${gap}.`,
    axes: {
      size: "sayının büyüklüğü",
      gap: "sonraki değere uzaklık",
    },
    wholeNumbers:
      "2²⁴ ile 2²⁵ arasında ardışık float32 değerleri 2 birim aralıklıdır. Tek tam sayılar bu aralıkta temsil edilemez.",
    caption:
      "Pozitif normal float32 sayılarında üs büyüdükçe komşu değerler uzaklaşır. Komşuya uzaklığın sayıya oranı dar bir aralıkta kalır. Bu aralık, yaklaşık 7 anlamlı ondalık basamağa karşılık gelir.",
    figures: {
      gap: "Uzaklık",
      relative: "Uzaklık ÷ sayı",
      relativeHint: "her normal float32 için 2⁻²⁴ ile 2⁻²³ arasında",
      plusOne: "x + 1",
      lost: "kayboldu",
      kept: "korundu",
    },
    announce: (value: string, gap: string) => `${value}, sonraki değere uzaklık ${gap}.`,
  },

  // 6 ----------------------------------------------------------------------
  formats: {
    kicker: "16 ve 32 bitlik biçimler",
    title: "Değer aralığı ve duyarlık",
    lede: "Ağırlık ve gradyanları 16 bitle saklamak, sayı başına 32 bitin yarısı kadar bellek gerektirir. float16 daha çok kesir biti ayırır. bfloat16, float32 gibi 8 üs biti kullanır. Aynı girdiyi üç biçimde karşılaştır.",
    examplesLabel: "Örnek değerler",
    examples: {
      weight: "Bir ağırlık",
      gradient: "Küçük bir gradyan",
      activation: "Büyük bir aktivasyon",
      third: "Üçte bir",
    },
    inputLabel: "Ya da bir sayı yaz",
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
      caption: "Biçimlerin değer aralığı ve duyarlığı",
      format: "Biçim",
      bits: "Bit",
      largest: "En büyük",
      smallest: "0'dan büyük en küçük",
      digits: "Ondalık basamak",
    },
    bfloatNote:
      "bfloat16, IEEE 754'te yer almaz. float32 ile aynı yerleşime sahiptir, yalnızca kesir 23 bitten 7 bite kısaltılmıştır; lab bu biçimde de diğerleri gibi yuvarlar: en yakın değere, eşitlikte çift olana.",
    caption:
      "Yaklaşık 2 × 10⁻⁸ büyüklüğündeki değer bfloat16'da sıfırdan farklı kalır, float16'da ise sıfıra yuvarlanır. float16 ile eğitimde küçük gradyanların kaybolmasını azaltmak için kayıp ölçekleme (loss scaling) kullanılabilir.",
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Bulmacalar",
    title: "Yuvarlama işlem sonucunu nasıl etkiler?",
    lede: "Bulmacaları çözmek için sayı biçimlerinin sınırlarını kullan. Yanıtlar bu lab'ın tam aritmetik hesabıyla kontrol edilir.",
    pickLabel: "Bulmaca",
    solvedLabel: "Çözülen",
    reset: "Baştan başla",
    plusOne: {
      tab: "x + 1 = x",
      task: "float32'de x + 1'in x'e eşit olduğu bir x sayısı bul.",
      hint: "Sonraki float32 değerine uzaklığın 2 olduğu bölgeye bak.",
      xLabel: "x",
      stored: "float32'de x",
      result: "float32'de x + 1",
      solved: "Çözüldü: 1 eklemek hiçbir şeyi değiştirmedi.",
      notYet: "Henüz değil: x + 1 farklı bir sayı.",
      infinite:
        "Infinity + 1 yine Infinity, ama bu örnekte sonlu komşuların arasındaki uzaklık inceleniyor. Sonlu bir x bul.",
      best: (value: string) => `Bulduğun en küçük: ${value}`,
    },
    associative: {
      tab: "(a + b) + c",
      task: "(a + b) + c ile a + (b + c)'nin farklı çıktığı a, b ve c sayılarını bul; JavaScript gibi float64'te.",
      hint: "Çok büyük bir sayıyı küçük bir sayıyla birleştir.",
      left: "(a + b) + c",
      right: "a + (b + c)",
      solved: "Çözüldü: toplamaların sırası sonucu değiştirdi.",
      notYet: "Henüz değil: iki sıra da aynı sonucu veriyor.",
      notFinite:
        "Sonuçlardan biri sonlu bir sayı değil. NaN hiçbir şeye, kendisine bile eşit olmaz, bu yüzden sayılmaz: sonlu a, b ve c bul.",
    },
    exact: {
      tab: "Kesin bir ondalık",
      task: "0 ile 1 arasında, virgülden sonra en fazla üç basamaklı ve float32'nin kesin olarak sakladığı bir sayı bul. 0,5 sayılmaz.",
      hint: "İkili sistem hangi kesirleri kalansız yazabilir?",
      inputLabel: "Sayın",
      rules: {
        range: "0 ile 1 arasında",
        places: "virgülden sonra en fazla üç basamak",
        notHalf: "0,5 dışında",
        exact: "float32'de kesin olarak saklanıyor",
      },
      solved: "Çözüldü.",
      notYet: "Henüz değil: yukarıdaki kurallardan biri sağlanmıyor.",
      reveal:
        "0,5 dahil yedi değer var. Bunlar 0,125, 0,25, 0,375, 0,5, 0,625, 0,75 ve 0,875. Hepsi 1/8'in tam katı. Bir kesir sadeleştirildiğinde paydası ikinin bir kuvvetiyse ikili açılımı sonludur.",
    },
    caption: "Çözülen bulmacalar bu tarayıcıda hatırlanır.",
    announce: (solved: number, total: number) => `${total} bulmacadan ${solved} tanesi çözüldü.`,
  },

  recap: {
    lessons: [
      "En yakına yuvarlamada girdi, biçimin temsil edebildiği en yakın değere çevrilir. Örneğin 0,1 sonlu sayıda ikili basamakla tam yazılamaz.",
      "Her toplamanın sonucu biçime yeniden yuvarlanır. Birden çok toplama varsa parantezlerin yeri sonucu değiştirebilir.",
      "Normal sayılarda üs büyüdükçe komşu değerler arasındaki uzaklık artar. Bu uzaklığın sayıya oranı dar bir aralıkta kalır.",
      "float16 daha çok kesir biti ayırır. bfloat16 daha çok üs biti ayırdığı için daha geniş bir değer aralığı sağlar.",
    ],
    footer:
      "Kodda bu, hesaplanmış iki float'ın == ile değil bir tolerans payıyla karşılaştırılmasının, paranın tam kuruşlarla sayılmasının ve uzun bir toplamın farklı sırayla toplandığında farklı çıkabilmesinin nedenidir.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro: "Bir sayı yaz. Girdinin saklanan float64 değerinden hangi basamakta ayrıldığını incele.",
    stages: {
      store: {
        type: "Bu kutuya 0,1 yaz ve saklanan değerle karşılaştır.",
        stored:
          "Gerçekte saklanan değer. İşaretli basamaklar, yazdığınla uyuşmadığı yerden başlar.",
        offBy:
          "Saklanan değer ile girdin arasındaki farkı, sonra farkın girdi büyüklüğüne oranını incele.",
        another: "Bu düğme denemen için başka bir örnek yazar.",
      },
      sum: {
        line: "a ve b'nin saklanan hâlleri, kesin toplamları ve float64'ün onu yuvarladığı yer.",
        type: "İki sayı yaz. Girdilerin tam toplamıyla saklanan değerlerin toplamını karşılaştır.",
        steps:
          "Yuvarlanmış toplamın gerçek cevaptan uzaklığı, komşu değerler arasındaki adımlarla sayılmış.",
        reset: "Başlangıçtaki 0,1 ve 0,2 değerlerine dönmek için bu düğmeye bas.",
      },
      bits: {
        bits: "float32, her bit bir kare: işaret, üs ve kesir.",
        flip: "Bir bite tıklayınca tersine döner. Tur ikinciyi, üssün en üst bitini çevirdi.",
        value: "Bu bitlerin şimdi anlattığı değer ve üssün seçtiği ikinin kuvveti.",
        set: "Ya da buradan bir değer seçip hangi bitleri gerektirdiğine bak.",
      },
      ruler: {
        line: "Küçük bir biçimin saklayabildiği bütün değerler, tek bir çizgide. İkinin ardışık kuvvetleri arasındaki normal değerleri karşılaştır.",
        pick: "Bu kaydırıcıyla bir değer seç. Bu uçta değerler birbirinden çok uzak.",
        bits: "Bir üs biti ekleyip en büyük değere bak. Ardından bir kesir biti ekleyip komşu değerler arasındaki uzaklığı karşılaştır.",
      },
      gap: {
        chart: "Yine float32: bir sayıdan saklanabilen bir sonraki sayıya olan uzaklık.",
        size: "Kaydırıcıyı sağa götür. Seçili sayı büyüdüğünde bir sonraki float32 değerine uzaklığı karşılaştır.",
        gap: "Normal sayı büyüdükçe komşuya uzaklık artar. Uzaklık ÷ sayı kutusundaki oranın nasıl değiştiğine bak.",
      },
      formats: {
        type: "Bir sayı yaz; float32, float16 ve bfloat16'daki hâli görünür. Tur çok küçük bir gradyan yazdı.",
        rows: "bfloat16 onu korur, float16 ise 0'a çevirir: iki biçim 16 biti farklı alanlara ayırır.",
        examples: "Diğer örnekleri buradan dene.",
      },
      challenge: {
        pick: "Yuvarlamanın sonucunu değiştirebildiği üç bulmacadan birini seç.",
        work: "Bunu gerçekleştiren bir sayı bul. Sayfa, kesin aritmetikle kontrol eder.",
        solved: "Çözülen bulmacalar bu tarayıcıda hatırlanır.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      stored: "Bir float neyi saklayabilir, neyi saklayamaz",
      rounding: "Tekrar tekrar yuvarlama",
      formats: "Aralık mı, duyarlık mı",
    },
    notes: {
      "cp-float": "0,1 + 0,2'nin neden 0,3 olmadığı, en baştan.",
      "cp-float-1": "İşaret, üs ve kesir, bit bit.",
      "cp-float-2": "İki float'ın nasıl toplandığı ve yuvarlamanın nerede olduğu.",
      "goldberg-float": "Yuvarlama hatası ve IEEE aritmetiği üzerine klasik makale.",
      "google-bfloat16":
        "bfloat16'nın neden float32'nin üssünü koruyup kesir bitlerinden vazgeçtiği.",
      "fnc-book":
        "Ücretsiz Python sürümündeki kayan noktalı sayılar ve yuvarlama hatası konularıyla başla. Lab'daki bit gösterimini sayısal hesaplamalarda hata birikimiyle ilişkilendir.",
    },
  },
};

export default copy;
