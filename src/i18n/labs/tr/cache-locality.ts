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
    title: "Sources",
    drepper:
      "Cache bloklarına, ardışık erişimin neden ucuz, aralıklı erişimin neden pahalı olduğuna ve gerçek işlemcileri basit modelden ayıran ön getirmeye (prefetch) dayanak.",
    memoryWall:
      "Bunun neden her yıl daha önemli olduğuna dayanak: işlemciler, onları besleyen bellekten çok daha hızlı hızlandı.",
    blocked:
      "4. bölümdeki matris çarpımına dayanak: döngü sırası ve adım, cache’in ne sıklıkla ıskalandığını belirler; döngüleri yeniden sıralamak bilinen bir çaredir.",
    locality:
      "Laboratuvara adını veren ilkeye dayanak: programlar az önce kullandıklarını ve onların yakınındakileri yeniden kullanma eğilimindedir; önbellekler zaten bu yüzden işe yarar.",
  },

  race: {
    title: "The same sum, twice",
    question:
      "İki döngü aynı dört milyon sayıyı topluyor. Biri satır satır okuyor, öteki sütun sütun. Sıra fark eder mi?",
    rowLabel: "Satır satır",
    columnLabel: "Sütun sütun",
    rowHow: "Her sayı, okunan bir öncekinin hemen yanında.",
    columnHow: "Her sayı, okunan bir öncekinden bütün bir satır, 16 KB uzakta.",
    ms: (value: string) => `${value} ms`,
    run: "İkisini bu bilgisayarda ölç",
    again: "Yeniden ölç",
    running: "Ölçülüyor…",
    gridNote: (n: string) =>
      `${n} × ${n} sayılık bir tablo, 32 MB, işlemcinde ölçülüyor. Her sıra beş kez çalışıyor; en hızlısı sayılıyor.`,
    caption: (count: string) =>
      `İki döngü de aynı ${count} sayıyı topluyor ve aynı sonuca varıyor. Değişen yalnızca okuma sırası.`,
    announce: (row: string, column: string, ratio: string) =>
      `Satır satır ${row} milisaniye, sütun sütun ${column} milisaniye sürdü: aynı toplam için ${ratio} daha yavaş.`,
    error: "Ölçüm bu tarayıcıda çalışamadı. Sayfayı yenilemeyi dene.",
    figures: {
      ratio: "Sütunlar",
      ratioHint: "satırların süresi kadar sürdü, bu bilgisayarda",
      sum: "Toplam",
      sumHint: "iki sırada da aynı",
      sumSame: "iki sırada da birebir aynı",
      sumDiffers: "iki sıra farklı sonuç verdi, bu olmamalı",
    },
  },

  line: {
    kicker: "Cache lines",
    title: "Memory arrives a line at a time.",
    lede: "Bu modelde bellek, 64 baytlık bloklar hâlinde okunur. Bir blok sekiz sayı içerir. İlk sayı okunduğunda aynı bloktaki diğer sayılar da cache’e gelir; onları okumak için yeniden ana belleğe gitmek gerekmez.",
    caption:
      "Her satır bir cache bloğunu gösterir. Model dört blok tutar ve yer dolduğunda en uzun süredir kullanılmayan bloğu çıkarır. • isabeti, × cache ıskasını gösterir.",
    orderLabel: "Tabloyu oku",
    orders: { rows: "Satır satır", columns: "Sütun sütun", own: "Kendi sıranız" },
    sizeLabel: "Cache boyutu",
    size: (lines: number) => `${lines} blok`,
    secondaryLabel: "Sıra ve cache boyutu",
    scrub: "Okunan",
    replay: "Yeniden",
    clear: "Temizle, baştan başla",
    lineChip: (line: number) => `blok ${line}`,
    emptySlot: "boş",
    cacheLabel: (lines: number) => `Cache’te (${lines} blok, en yenisi başta):`,
    startHint: "Tabloyu sayı sayı okumak için Çalıştır'a bas ya da kaydırıcıyı sürükle.",
    ownHint: "Sayılara istediğin sırayla tıkla. Her tıklama bir okuma.",
    hitLine: (row: number, col: number, line: number) =>
      `Satır ${row}, sütun ${col}: isabet. Blok ${line} zaten önbellekteydi.`,
    missLine: (row: number, col: number, line: number, evicted: number | null) =>
      evicted === null
        ? `Satır ${row}, sütun ${col}: ıska. Blok ${line} getiriliyor, sekiz sayısının hepsiyle.`
        : `Satır ${row}, sütun ${col}: ıska. Blok ${line} getiriliyor, yer açmak için blok ${evicted} dışarı atılıyor.`,
    gridLabel: (reads: number, misses: number, hits: number, held: number) =>
      `8'e 8 sayılık bir tablo. Şimdiye kadar ${reads} okuma: ${misses} ıska, ${hits} isabet. Cache’te ${held} blok.`,
    cellButton: (row: number, col: number, seen: boolean | undefined) =>
      `Satır ${row}, sütun ${col} okunsun${seen === undefined ? "" : seen ? ", son okuma isabetti" : ", son okuma ıskaydı"}`,
    announce: (reads: number, misses: number, hits: number) =>
      `${reads} okuma: ${misses} ıska, ${hits} isabet.`,
    figures: {
      reads: "Okuma",
      misses: "Iska",
      missesHint: "bellekten getirilen blok",
      hits: "İsabet",
      hitsHint: "zaten cache’te",
    },
  },

  stride: {
    kicker: "Stride",
    title: "The further apart, the dearer, up to a line.",
    lede: "Aynı sayıların hepsini oku, ancak ardışık okumalar arasındaki aralığı değiştir. Modelin cache ıskalarını cihazında ölçülen okuma süreleriyle karşılaştır.",
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
      "Çubuklar okuma başına ölçülen nanosaniyeyi gösterir. Altlarındaki değerler modelde okuma başına cache ıskasıdır. Gerçek işlemcilerin önceden veri getirme gibi özellikleri, sürelerin modelden farklı değişmesine yol açabilir.",
    ns: (value: string) => `${value} ns`,
    caption: (length: string) =>
      `${length} sayı, 32 MB, her adımda her biri tam bir kez okunuyor. Değişen yalnızca art arda iki okuma arasındaki uzaklık.`,
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
    kicker: "Your turn",
    title: "Three loops, six orders, one product.",
    lede: "Matris çarpımındaki üç döngünün sırasını değiştir. Yapılan çarpma ve toplama sayısı aynı kalır; bellek erişim sırası değişir. Sonucu önce modelde, sonra cihazında ölç.",
    orderLabel: "Döngü sırası",
    secondaryLabel: "Bir döngü sırası seç",
    walkLabel: "En içteki döngünün her matriste yürüyüşü",
    walk: { row: "satır boyunca", column: "sütun aşağı", still: "yerinde" },
    legendModel: "model: adım başına ıska",
    legendMeasured: "bu bilgisayarda ölçülen",
    measure: (order: string) => `${order} sırasını ölç`,
    measureAll: "Altısını da ölç",
    running: "Ölçülüyor…",
    ms: (value: string) => `${value} ms`,
    rowLabel: (order: string, model: string, ms: string | null) =>
      `${order}: model adım başına ${model} ıska${ms === null ? ", henüz ölçülmedi" : `, ölçülen ${ms} milisaniye`}`,
    chartNote:
      "Model 16 × 16'lık bir çarpımı sekiz bloklu bir cache’ten geçiriyor. Kronometre ise 512 × 512'lik bir çarpımı, matris başına 2 MB, işlemcinde çalıştırıyor. Altısını ölçmek telefonda bir dakika sürebilir.",
    caption: (n: string) =>
      `Her sıra aynı ${n} × ${n} × ${n} çarpma ve toplamayı yapar. Sütun aşağı yürüyüş her adımda bütün bir satır öteye atlar; satır boyunca yürüyüş komşuları okur.`,
    announceOne: (order: string, ms: string) => `${order} bu bilgisayarda ${ms} milisaniye sürdü.`,
    announceAgree:
      "Altısı da ölçüldü. Bilgisayarın üç çifti modelle aynı sıralıyor: en içte j en hızlı, sonra k, sonra i.",
    announceDisagree:
      "Altısı da ölçüldü. Bilgisayarın çiftleri modelle tam olarak aynı sıralamıyor.",
    error: "Ölçüm bu tarayıcıda çalışamadı. Sayfayı yenilemeyi dene.",
    figures: {
      model: "Model",
      modelHint: "adım başına ıska, bu sıra",
      fastest: "En hızlın",
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
      "Bellek işlemciye blok blok ulaşır, 64 bayt; bir sayının komşuları onunla birlikte gelir.",
      "Komşuları art arda okumak okumaların çoğunu isabet yapar; uzağa atlamak her okumayı yeni bir ıska yapar.",
      "Cache, yeniden kullandığın şey sığdığı sürece işe yarar: her bloğa yer verin, yavaş sıra da yetişir.",
      "Döngüleri yeniden sıralayabiliyorsanız, satır boyunca yürüyeni en içe koyun.",
    ],
    footer:
      "Süreler bu cihazda ölçüldü. Modelin tek seviyeli cache’i gerçek işlemcinin bütün özelliklerini içermez. Sonuçları birkaç kez ölçerek karşılaştır; modeli sürelerin kesin tahmini olarak kullanma.",
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
        ratio: "Sütun sırasının kaç kat uzun sürdüğü. Değişen tek şey okuma sırası.",
      },
      line: {
        grid: "Bu ızgaranın her satırı sekiz sayılık bir cache satırı. Yanındaki cache dört satır tutar.",
        run: "Okumaları tek tek çalıştır: • isabet, × ise bütün bir satırı getiren ıska.",
        score:
          "Şimdiye kadarki ıska ve isabetler. Satır sırası her satırda bir kez ıskalar, sütun sırası neredeyse her okumada.",
        options:
          "Buradan sütun sırasına, daha büyük bir cache’e ya da sayılara kendin tıkladığın kendi sıranıza geçin.",
      },
      stride: {
        chart:
          "Altta her adım aralığında okuma başına ıska modeli, üstte işlemcinin her okuma için ödettiği süre.",
        measure:
          "Bu bilgisayarda ölç. Maliyet aralıkla birlikte artar, ta ki her satırdan tek okumaya kadar.",
        show: "Buradan bir adım aralığı seç; önce hangi sayıları okuduğunu görürsün.",
      },
      order: {
        orders:
          "Matris çarpımının üç döngüsünü iç içe koymanın altı yolu ve en içteki döngünün her matriste nasıl yürüdüğü.",
        time: "Seçili sırayı bu bilgisayarda ölç ve modelle karşılaştır.",
        all: "Ya da altısını birden ölçüp hangi sıranın kazandığını görün.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      line: "Memory arrives a line at a time",
      order: "Stride and loop order",
    },
    notes: {
      "cp-caches-why": "İşlemcinin neden bir cache’e ihtiyaç duyduğu.",
      "cp-caches-how": "Cache, satırlar ve isabetler, ayrıntılı olarak.",
      "mit-6172-l14": "Cache dostu kod üzerine tam bir ders; döşemeli matris çarpımı dahil.",
      "drepper-memory": "Bellek ve cache’in gerçekte nasıl davrandığına dair uzun başvuru metni.",
    },
  },
};

export default copy;
