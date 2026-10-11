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
      "Önbellek bloklarına, ardışık erişimin neden ucuz, aralıklı erişimin neden pahalı olduğuna ve gerçek işlemcileri basit modelden ayıran ön getirmeye (prefetch) dayanak.",
    memoryWall:
      "Bunun neden her yıl daha önemli olduğuna dayanak: işlemciler, onları besleyen bellekten çok daha hızlı hızlandı.",
    blocked:
      "4. bölümdeki matris çarpımına dayanak: döngü sırası ve adım, önbelleğin ne sıklıkla ıskalandığını belirler; döngüleri yeniden sıralamak bilinen bir çaredir.",
    locality:
      "Laboratuvara adını veren ilkeye dayanak: programlar az önce kullandıklarını ve onların yakınındakileri yeniden kullanma eğilimindedir; önbellekler zaten bu yüzden işe yarar.",
  },

  race: {
    title: "Aynı toplam, iki kez",
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
      `${n} × ${n} sayılık bir tablo, 32 MB, sizin işlemcinizde ölçülüyor. Her sıra beş kez çalışıyor; en hızlısı sayılıyor.`,
    caption: (count: string) =>
      `İki döngü de aynı ${count} sayıyı topluyor ve aynı sonuca varıyor. Değişen yalnızca okuma sırası.`,
    announce: (row: string, column: string, ratio: string) =>
      `Satır satır ${row} milisaniye, sütun sütun ${column} milisaniye sürdü: aynı toplam için ${ratio} daha yavaş.`,
    error: "Ölçüm bu tarayıcıda çalışamadı. Sayfayı yenilemeyi deneyin.",
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
    kicker: "Önbellek blokları",
    title: "Bellek blok blok gelir.",
    lede: "İşlemci son kullanılan bellek parçalarından birkaçını yakınında, önbelleğinde tutar. Hiçbir zaman tek bir sayı getirmez: o sayının içinde durduğu bütün bloğu getirir, 64 bayt, sekiz sayı. Sonra o sekiz komşuyu okursanız yedisi zaten oradadır.",
    caption:
      "Bu tablonun her satırı tam bir bloktur. Önbellek dört blok tutar; dolduğunda en uzun süredir kullanılmayan blok dışarı atılır. • isabet, × ıska.",
    orderLabel: "Tabloyu oku",
    orders: { rows: "Satır satır", columns: "Sütun sütun", own: "Kendi sıranız" },
    sizeLabel: "Önbellek boyutu",
    size: (lines: number) => `${lines} blok`,
    secondaryLabel: "Sıra ve önbellek boyutu",
    scrub: "Okunan",
    replay: "Yeniden",
    clear: "Temizle, baştan başla",
    lineChip: (line: number) => `blok ${line}`,
    emptySlot: "boş",
    cacheLabel: (lines: number) => `Önbellekte (${lines} blok, en yenisi başta):`,
    startHint: "Tabloyu sayı sayı okumak için Çalıştır'a basın ya da kaydırıcıyı sürükleyin.",
    ownHint: "Sayılara istediğiniz sırayla tıklayın. Her tıklama bir okuma.",
    hitLine: (row: number, col: number, line: number) =>
      `Satır ${row}, sütun ${col}: isabet. Blok ${line} zaten önbellekteydi.`,
    missLine: (row: number, col: number, line: number, evicted: number | null) =>
      evicted === null
        ? `Satır ${row}, sütun ${col}: ıska. Blok ${line} getiriliyor, sekiz sayısının hepsiyle.`
        : `Satır ${row}, sütun ${col}: ıska. Blok ${line} getiriliyor, yer açmak için blok ${evicted} dışarı atılıyor.`,
    gridLabel: (reads: number, misses: number, hits: number, held: number) =>
      `8'e 8 sayılık bir tablo. Şimdiye kadar ${reads} okuma: ${misses} ıska, ${hits} isabet. Önbellekte ${held} blok.`,
    cellButton: (row: number, col: number, seen: boolean | undefined) =>
      `Satır ${row}, sütun ${col} okunsun${seen === undefined ? "" : seen ? ", son okuma isabetti" : ", son okuma ıskaydı"}`,
    announce: (reads: number, misses: number, hits: number) =>
      `${reads} okuma: ${misses} ıska, ${hits} isabet.`,
    figures: {
      reads: "Okuma",
      misses: "Iska",
      missesHint: "bellekten getirilen blok",
      hits: "İsabet",
      hitsHint: "zaten önbellekte",
    },
  },

  stride: {
    kicker: "Adım",
    title: "Okumalar uzaklaştıkça pahalanır, bir bloğa kadar.",
    lede: "Her sayıyı bir kez okuyun, ama okumalar arasında boşluk bırakın: her 2.'yi, her 4.'yü, her 8.'yi, sonra atlananlar için geri gelin. Her adımda iş aynı. Aşağıda modelin okuma başına ıskası, yukarıda işlemcinizin her okuma için ödediği.",
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
      "Çubuklar: bu bilgisayarda okuma başına nanosaniye. Her adımın altında: modelin okuma başına ıskası. Modelde tırmanış 8'de, bir blokta durur; gerçek işlemciler bir sonraki bloğu da önden getirdiği için tırmanış çoğu zaman daha geç durur, hatta geri düşebilir.",
    ns: (value: string) => `${value} ns`,
    caption: (length: string) =>
      `${length} sayı, 32 MB, her adımda her biri tam bir kez okunuyor. Değişen yalnızca art arda iki okuma arasındaki uzaklık.`,
    announce: (first: string, dearest: number, dearestNs: string) =>
      `Adım 1 iken okuma başına ${first} nanosaniye. Bu bilgisayarda en pahalı adım ${dearest}, okuma başına ${dearestNs} nanosaniye.`,
    error: "Ölçüm bu tarayıcıda çalışamadı. Sayfayı yenilemeyi deneyin.",
    tableCaption: "Her adımda okuma başına maliyet",
    strideHeader: "Adım",
    nsHeader: "Okuma başına nanosaniye, ölçülen",
    modelHeader: "Okuma başına ıska, model",
    figures: {
      first: "Adım 1",
      firstHint: "okuma başına, komşular art arda",
      dearest: "En pahalı adım",
      dearestHint: (ratio: string) => `adım 1'e göre ${ratio}`,
      dearestEmpty: "öğrenmek için ölçün",
      model: "Model",
      modelHint: (stride: number) => `ıska, adım ${stride} iken`,
    },
  },

  order: {
    kicker: "Sıra sizde",
    title: "Üç döngü, altı sıra, tek çarpım.",
    lede: "Bir matris çarpımı, üç döngüsü nasıl iç içe konursa konsun aynı aritmetiktir. Bir sıra seçin, en içteki döngünün her matriste nasıl yürüdüğüne bakın, sonra onu bilgisayarınızda ölçüp modelle karşılaştırın.",
    orderLabel: "Döngü sırası",
    secondaryLabel: "Bir döngü sırası seçin",
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
      "Model 16 × 16'lık bir çarpımı sekiz bloklu bir önbellekten geçiriyor. Kronometre ise 512 × 512'lik bir çarpımı, matris başına 2 MB, sizin işlemcinizde çalıştırıyor. Altısını ölçmek telefonda bir dakika sürebilir.",
    caption: (n: string) =>
      `Her sıra aynı ${n} × ${n} × ${n} çarpma ve toplamayı yapar. Sütun aşağı yürüyüş her adımda bütün bir satır öteye atlar; satır boyunca yürüyüş komşuları okur.`,
    announceOne: (order: string, ms: string) => `${order} bu bilgisayarda ${ms} milisaniye sürdü.`,
    announceAgree:
      "Altısı da ölçüldü. Bilgisayarınız üç çifti modelle aynı sıralıyor: en içte j en hızlı, sonra k, sonra i.",
    announceDisagree:
      "Altısı da ölçüldü. Bilgisayarınız çiftleri modelle tam olarak aynı sıralamıyor.",
    error: "Ölçüm bu tarayıcıda çalışamadı. Sayfayı yenilemeyi deneyin.",
    figures: {
      model: "Model",
      modelHint: "adım başına ıska, bu sıra",
      fastest: "En hızlınız",
      fastestHint: (ms: string) => `bu bilgisayarda ${ms} ms`,
      fastestEmpty: "başlamak için bir sıra ölçün",
      verdict: "Modele göre",
      agree: "Uyuşuyor",
      disagree: "Farklı",
      pending: "Altısını ölçün",
      verdictHint: "en içte j, sonra k, sonra i",
    },
  },

  recap: {
    lessons: [
      "Aynı sayıları başka bir sırayla toplamak, aritmetik birebir aynıyken birkaç kat uzun sürebilir.",
      "Bellek işlemciye blok blok ulaşır, 64 bayt; bir sayının komşuları onunla birlikte gelir.",
      "Komşuları art arda okumak okumaların çoğunu isabet yapar; uzağa atlamak her okumayı yeni bir ıska yapar.",
      "Önbellek, yeniden kullandığınız şey sığdığı sürece işe yarar: her bloğa yer verin, yavaş sıra da yetişir.",
      "Döngüleri yeniden sıralayabiliyorsanız, satır boyunca yürüyeni en içe koyun.",
    ],
    footer:
      "Sayılar sizin işlemcinizin kendi sayıları. Gerçek önbelleklerin birkaç seviyesi, sınırlı yolları ve önden tahmin eden bir ön getiricisi vardır; modelin temiz basamaklarını büker ama yönünü değiştirmez: yakın ucuz, uzak pahalı.",
  },
};

export default copy;
