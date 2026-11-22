import type en from "../en/cache-locality";

/**
 * Türkçe metin: cache-locality. Şekli `en/cache-locality.ts` ile birebir aynı
 * olmak zorundadır.
 *
 * İngilizcedeki "cache line" burada "önbellek bloğu": aynı kavramın yaygın
 * diğer adı. "Satır" matrisin satırına ayrıldı; ikisi aynı kelime olsaydı
 * laboratuvarın tam da ayırt ettirmek istediği iki şey tek kelimede
 * birleşirdi.
 */
const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    drepper:
      "Önbellek bloklarını, ardışık ve aralıklı erişimi, ayrıca gerçek işlemcilerin önceden veri getirmesini (prefetch) açıklar.",
    memoryWall: "İşlemci hızı ile ana bellek erişim hızı arasındaki farkın artmasını inceler.",
    blocked:
      "Matris çarpımında döngü sırasının bellek erişimlerine etkisini ve erişim yerelliğini artıran yöntemleri inceler.",
    locality:
      "Yakın zamanda erişilen adreslere tekrar erişilmesi ile komşu adreslere erişilmesi arasındaki ayrımı açıklar.",
  },

  race: {
    title: "Aynı veriyi iki farklı sırayla topla",
    question:
      "İki döngü aynı sayıları toplar. Biri satır satır, diğeri sütun sütun okur. İki sıranın ölçülen sürelerini karşılaştır.",
    rowLabel: "Satır satır",
    columnLabel: "Sütun sütun",
    rowHow: "Aynı satırda ardışık bellek adresleri okunur.",
    columnHow: "Aynı sütunda her sonraki sayı bellekte bir satır, yani 16 KiB ileridedir.",
    ms: (value: string) => `${value} ms`,
    run: "İkisini bu bilgisayarda ölç",
    again: "Yeniden ölç",
    running: "Ölçülüyor…",
    gridNote: (n: string) =>
      `${n} × ${n} sayılık bir tablo, 32 MiB bellek kullanır. Her sıra için beş ölçüm yapılır ve en kısa süre gösterilir.`,
    caption: (count: string) =>
      `İki döngü de aynı ${count} sayıyı topluyor ve aynı sonuca varıyor. Değişen yalnızca okuma sırası.`,
    announce: (row: string, column: string, ratio: string) =>
      `Satır sırası ${row} milisaniye, sütun sırası ${column} milisaniye sürdü. Sütun süresinin satır süresine oranı ${ratio}.`,
    error: "Ölçüm bu tarayıcıda çalışamadı. Sayfayı yenilemeyi dene.",
    figures: {
      ratio: "Sütunlar",
      ratioHint: "sütun süresi ÷ satır süresi",
      sum: "Toplam",
      sumHint: "iki sırada da aynı",
      sumSame: "iki sırada da birebir aynı",
      sumDiffers: "iki sıra farklı sonuç verdi, bu olmamalı",
    },
  },

  line: {
    kicker: "Önbellek blokları",
    title: "Önbelleğe hangi veriler birlikte gelir?",
    lede: "Modelde bir önbellek bloğu 64 bayttır ve sekiz sayı içerir. Önbellekte bulunmayan bir sayı okununca bloğu getirilir. Aynı blok önbellekte kaldığı sürece diğer yedi sayı da bellekten yeniden getirilmeden okunabilir.",
    caption:
      "Tabloda her satır bir önbellek bloğuna karşılık gelir. Başlangıçta önbellek dört blok alır. Dolduğunda, en uzun süredir kullanılmayan blok çıkarılır. • isabeti, × ıskayı gösterir.",
    orderLabel: "Tabloyu oku",
    orders: { rows: "Satır satır", columns: "Sütun sütun", own: "Kendi sıran" },
    sizeLabel: "Önbellek kapasitesi",
    size: (lines: number) => `${lines} blok`,
    secondaryLabel: "Okuma sırası ve önbellek kapasitesi",
    scrub: "Okunan",
    replay: "Yeniden",
    clear: "Önbelleği boşalt",
    lineChip: (line: number) => `blok ${line}`,
    emptySlot: "boş",
    cacheLabel: (lines: number) => `Önbellek. En son kullanılan blok başta. Toplam ${lines} yer.`,
    startHint: "Tabloyu sayı sayı okumak için Çalıştır'a bas ya da kaydırıcıyı sürükle.",
    ownHint: "Sayılara istediğin sırayla tıkla. Her tıklama bir okuma.",
    hitLine: (row: number, col: number, line: number) =>
      `Satır ${row}, sütun ${col}. İsabet. ${line} numaralı blok önbellekteydi.`,
    missLine: (row: number, col: number, line: number, evicted: number | null) =>
      evicted === null
        ? `Satır ${row}, sütun ${col}. Iska. ${line} numaralı blok sekiz sayısıyla birlikte bellekteki yerinden getirildi.`
        : `Satır ${row}, sütun ${col}. Iska. ${line} numaralı blok getirildi. Yer açmak için ${evicted} numaralı blok çıkarıldı.`,
    gridLabel: (reads: number, misses: number, hits: number, held: number) =>
      `8'e 8 sayılık bir tablo. Okuma sayısı ${reads}, ıska sayısı ${misses}, isabet sayısı ${hits}. Önbellekte ${held} blok.`,
    cellButton: (row: number, col: number, seen: boolean | undefined) =>
      `Satır ${row}, sütun ${col} okunsun${seen === undefined ? "" : seen ? ", son okuma isabetti" : ", son okuma ıskaydı"}`,
    announce: (reads: number, misses: number, hits: number) =>
      `${reads} okuma: ${misses} ıska, ${hits} isabet.`,
    figures: {
      reads: "Okuma",
      misses: "Iska",
      missesHint: "bellekten getirilen blok",
      hits: "İsabet",
      hitsHint: "blok önbellekte",
    },
  },

  stride: {
    kicker: "Adım",
    title: "Okumalar arasındaki mesafe arttığında ne olur?",
    lede: "İki okuma arasında kaç eleman ilerleyeceğini seç. Her sayı bir kez okunur. Modeldeki ıska oranını cihazında ölçülen okuma süreleriyle karşılaştır.",
    run: "Bu bilgisayarda ölç",
    again: "Yeniden ölç",
    running: "Ölçülüyor…",
    chooseLabel: "Bir adım göster",
    secondaryLabel: "Şeritte gösterilen adım",
    stripLabel: (stride: number) =>
      stride === 1
        ? "1 adımlık bir tur her sayıyı okur:"
        : `${stride} adımlık bir tur her ${stride}. sayıyı okur:`,
    stripNote: (fraction: string) => `Modelde bu, ${fraction} ıska demek.`,
    everyRead: "her okumada",
    oneIn: (n: number) => `${n} okumada 1`,
    axisNote:
      "Çubuklar okuma başına ölçülen nanosaniyeyi gösterir. Altlarındaki değerler modelde okuma başına önbellek ıskasıdır. Gerçek işlemcilerin önceden veri getirme gibi özellikleri, sürelerin modelden farklı değişmesine yol açabilir.",
    ns: (value: string) => `${value} ns`,
    caption: (length: string) =>
      `${length} sayı, toplam 32 MiB yer kaplar. Her erişim adımı için bütün sayılar birer kez okunur.`,
    announce: (first: string, dearest: number, dearestNs: string) =>
      `Adım 1 iken okuma başına ${first} nanosaniye. Bu bilgisayarda en pahalı adım ${dearest}, okuma başına ${dearestNs} nanosaniye.`,
    error: "Ölçüm bu tarayıcıda çalışamadı. Sayfayı yenilemeyi dene.",
    tableCaption: "Her adımda okuma başına maliyet",
    strideHeader: "Adım",
    nsHeader: "Okuma başına nanosaniye, ölçülen",
    modelHeader: "Okuma başına ıska, model",
    figures: {
      first: "Adım 1",
      firstHint: "okuma başına, komşular art arda",
      dearest: "En pahalı adım",
      dearestHint: (ratio: string) => `adım 1'e göre ${ratio}`,
      dearestEmpty: "öğrenmek için ölç",
      model: "Model",
      modelHint: (stride: number) => `ıska, adım ${stride} iken`,
    },
  },

  order: {
    kicker: "Döngü sırası deneyi",
    title: "Matris çarpımında döngü sırası",
    lede: "Matris çarpımındaki üç döngünün sırasını değiştir. Her sırada aynı sayıda çarpma ve toplama yapılır. Bellek erişimleri değiştiğinde modeldeki ıska sayısına ve cihazında ölçülen süreye bak.",
    orderLabel: "Döngü sırası",
    secondaryLabel: "Bir döngü sırası seç",
    walkLabel: "En içteki döngünün matrislerdeki erişim yönü",
    walk: { row: "satır boyunca", column: "sütun boyunca", still: "yerinde" },
    legendModel: "model: adım başına ıska",
    legendMeasured: "bu bilgisayarda ölçülen",
    measure: (order: string) => `${order} sırasını ölç`,
    measureAll: "Altısını da ölç",
    running: "Ölçülüyor…",
    ms: (value: string) => `${value} ms`,
    rowLabel: (order: string, model: string, ms: string | null) =>
      `${order}: model adım başına ${model} ıska${ms === null ? ", henüz ölçülmedi" : `, ölçülen ${ms} milisaniye`}`,
    chartNote:
      "Model, 16 × 16 boyutlu matrisleri sekiz blokluk önbellekle çarpar. Cihazındaki ölçüm 512 × 512 boyutlu matrisleri kullanır. Her matris 2 MiB yer kaplar.",
    caption: (n: string) =>
      `Her sıra aynı ${n} × ${n} × ${n} çarpma ve toplamayı yapar. Sütun boyunca erişimde adres bir satır kadar artar. Satır boyunca erişimde sıradaki komşu okunur.`,
    announceOne: (order: string, ms: string) => `${order} bu bilgisayarda ${ms} milisaniye sürdü.`,
    announceAgree:
      "Altısı da ölçüldü. Bilgisayarın üç çifti modelle aynı sıralıyor: en içte j en hızlı, sonra k, sonra i.",
    announceDisagree:
      "Altısı da ölçüldü. Bilgisayarın çiftleri modelle tam olarak aynı sıralamıyor.",
    error: "Ölçüm bu tarayıcıda çalışamadı. Sayfayı yenilemeyi dene.",
    figures: {
      model: "Model",
      modelHint: "adım başına ıska, bu sıra",
      fastest: "Ölçülen en kısa süre",
      fastestHint: (ms: string) => `bu bilgisayarda ${ms} ms`,
      fastestEmpty: "başlamak için bir sıra ölç",
      verdict: "Modele göre",
      agree: "Uyuşuyor",
      disagree: "Farklı",
      pending: "Altısını ölç",
      verdictHint: "en içte j, sonra k, sonra i",
    },
  },

  recap: {
    lessons: [
      "Aynı sayıları başka bir sırayla toplamak, aritmetik birebir aynıyken birkaç kat uzun sürebilir.",
      "Modelde bellekten 64 baytlık bloklar getirilir. Aynı bloktaki komşular bir okumayla birlikte önbelleğe gelir.",
      "Ardışık okumalar aynı önbellek bloğunu yeniden kullanabilir. Erişim adımı blok kadar büyüdüğünde tek geçişte her okuma yeni bir bloğa gidebilir.",
      "Gerekli bloklar önbelleğe sığdığında sütun sırasındaki okumalar da daha önce getirilen blokları kullanabilir.",
      "Matris çarpımında en iç döngüyü değiştir. Satır boyunca erişimin ıska sayısına etkisine bak.",
    ],
    footer:
      "Süreler bu cihazda ölçülür. Model tek seviyeli ve en uzun süredir kullanılmayan bloğu çıkaran bir önbellek kullanır. Ölçümde işlemcinin önceden veri getirmesi ve diğer bellek düzeyleri de sonucu etkileyebilir.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Aynı veriyi iki farklı sırayla toplayan döngüleri çalıştır. Ölçümü tekrarla ve süreleri karşılaştır.",
    stages: {
      race: {
        lanes:
          "Üstteki döngü sayıları satır satır, alttaki sütun sütun okur. Sayılar da toplam da aynı.",
        run: "Bu düğme ikisini de işlemcinde ölçer. Birkaç saniye sürer.",
        ratio:
          "Sütunlar kutusundaki süre oranına bak. Yeniden ölç düğmesiyle süreleri karşılaştır.",
      },
      line: {
        grid: "Izgaranın her satırı sekiz sayılık bir önbellek bloğudur. Başlangıçta önbellek dört blok alır.",
        run: "Okumaları tek tek çalıştır. • blok önbellekte bulunduğunda, × blok bellekten getirildiğinde görünür.",
        score:
          "Iska ve İsabet kutularına bak. Dört blokla satır sırası her blokta bir kez ıskalar. Sütun sırası her okumada ıskalar.",
        options:
          "Sütun sütun seçeneğini dene. Ardından önbellek kapasitesini artır veya Kendi sıran seçeneğiyle sayıları istediğin sırada oku.",
      },
      stride: {
        chart:
          "Çubuklar okuma başına ölçülen süreyi gösterir. Altlarındaki değerler, modelin okuma başına ıskasıdır.",
        measure:
          "Bu bilgisayarda ölç düğmesine bas. Adım sayısı değiştikçe ölçülen süreyle modeldeki ıska oranını karşılaştır.",
        show: "Buradan bir adım aralığı seç; önce hangi sayıları okuduğunu görürsün.",
      },
      order: {
        orders:
          "Matris çarpımının üç döngüsünü iç içe koymanın altı yolu ve en içteki döngünün her matriste nasıl yürüdüğü.",
        time: "Seçili sırayı bu bilgisayarda ölç ve modelle karşılaştır.",
        all: "Altısını da ölç düğmesine bas ve en kısa süreyi veren sıraya bak.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      line: "Önbellek bloğu ve yerellik",
      order: "Adım aralığı ve döngü sırası",
    },
    notes: {
      "cp-caches-why": "İşlemcilerin önbellek kullanma nedeni.",
      "cp-caches-how": "Önbellek bloklarının ve isabetlerin açıklaması.",
      "mit-6172-l14":
        "Önbelleği verimli kullanan kod üzerine tam bir ders; döşemeli matris çarpımı dahil.",
      "drepper-memory": "Bellek ve önbelleğin gerçekte nasıl davrandığına dair uzun başvuru metni.",
    },
  },
};

export default copy;
