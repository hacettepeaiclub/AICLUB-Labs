import type en from "../en/convolution";

/**
 * Türkçe metin: convolution. Şekli `en/convolution.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## convolution), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır.
 */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    lecunZip:
      "Bu lab'ın konusu olan kısıtlı ağı tanıtır: ağırlıkları resmin her konumunda ortak kullanılan, geri yayılımla öğrenilen ve el yazısı rakamları okuyan küçük çekirdekler.",
    convArithmetic:
      "Girdi boyutunun, çekirdek boyutunun, dolgunun ve adım kaydırmanın (stride) çıktı boyutunu nasıl belirlediğini, pencerenin hiç ulaşamadığı hücreleri düşüren taban (aşağı yuvarlama) işlemiyle birlikte çıkarır. Dördüncü bölümdeki formül, bu genel durum için verdiği ilişkidir.",
    vgg: "3×3 katman yığınlarını savunur: iki tanesi 5×5, üç tanesi 7×7 bir bölgeyi görür ve bunu tek bir büyük çekirdeğin gerektireceğinden daha az ağırlıkla yapar.",
    alexnet:
      "Derin bir ağın ilk katmanının fotoğraflardan kendi kendine öğrendiği çekirdekleri gösterir: çoğu belirli bir yöndeki kenarlara ya da renge yanıt verir.",
    hubelWiesel:
      "Görme korteksinde her biri görme alanının küçük bir bölgesine, çoğu da tek bir yöndeki bir kenara ya da çubuğa yanıt veren hücreleri anlatır. Alıcı alan terimi bu çalışmadan gelir.",
  },

  cellLabel: (row: number, column: number) => `Ağırlık, satır ${row}, sütun ${column}`,
  invalidWeight: "Her hücreye bir sayı gerekiyor: 1, -2, 0,5 ya da 1/9 dene.",
  kernelWord: "Çekirdek",

  // 1 ----------------------------------------------------------------------
  slide: {
    title: "Kayan bir pencere",
    question: "Dokuz ağırlık bir resmin üzerinde kayıyor. Geride ne bırakıyorlar?",
    input: "Resim",
    kernel: "Çekirdek",
    output: "Çıktı",
    inputLabel:
      "T harfinin 9 × 9 piksellik resmi. Çerçeveli kare penceredir. Bir pikseli açıp kapatmak için ona tıkla.",
    kernelLabel: "Çekirdek: sol sütunda eksi 1, ortada 0, sağda artı 1.",
    outputLabel: (done: number, total: number) =>
      `Çıktı, ${total} hücreden ${done} tanesi hesaplandı. Pencereyi bir hücreye taşımak için tıkla ya da ok tuşlarını kullan.`,
    arithmetic: "Bu hücrenin hesabı",
    step: "Bir adım kaydır",
    fillRest: "Kalanını doldur",
    reset: "Baştan başla",
    caption:
      "Her çıktı hücresi dokuz çarpımın toplamıdır: her ağırlık, altındaki pikselle çarpılır. Ağırlıklar hiç değişmez; yalnızca pencere kayar. Bu çekirdek, resmin sağa doğru parlaklaştığı yerde pozitif, karardığı yerde negatif sonuç verir.",
    announce: (column: number, row: number, value: string) =>
      `Pencere sütun ${column}, satır ${row}. Çıktı ${value}.`,
    figures: {
      cell: "Bu hücre",
      computed: "Hesaplanan",
      weights: "Ağırlık",
      weightsHint: "her konumda aynı dokuz ağırlık",
    },
  },

  // 2 ----------------------------------------------------------------------
  kernels: {
    kicker: "Dokuz sayı",
    title: "Ağırlıkları değiştir, çekirdeğin gördüğü değişsin.",
    lede: "Aynı kayan toplam, bu kez daha büyük bir resimde. Hazır bir çekirdek seç ya da ağırlıkları kendin yaz; sonra resmin üzerine çiz ve çıktıda nelerin belirdiğine bak.",
    input: "Resim",
    output: "Çıktı",
    inputLabel:
      "32 × 32 piksellik bir resim: bir disk, bir kare, eğik bir çubuk ve bir halka. Çizmek için üzerinde sürükle.",
    outputLabel: "Çekirdek uygulanmış resim. Kenarları sıfırla dolgulandığı için boyutu aynı.",
    drawHint: "Çizmek için sürükle.",
    editorLabel: "Çekirdek",
    presetLabel: "Başlangıç",
    presets: {
      identity: "Birim çekirdek",
      blur: "Bulanıklaştır",
      sharpen: "Keskinleştir",
      vertical: "Dikey kenarlar",
      horizontal: "Yatay kenarlar",
      outline: "Dış hat",
    },
    notes: {
      identity: "Ortadaki tek bir 1, altındaki pikseli kopyalar: çıktı resmin kendisidir.",
      blur: "Dokuz tane 1/9, her pikselin komşularıyla ortalamasını alır. Ağırlıkların toplamı 1 olduğu için düz alanlar parlaklığını korur.",
      sharpen:
        "Pikselin kendisi, artı dört komşusundan ne kadar farklı olduğu. Ağırlıkların toplamı 1 olduğu için düz alanlar olduğu gibi kalır, kenarlar dikleşir.",
      vertical:
        "Sağ sütun eksi sol sütun. Parlaklığın soldan sağa değiştiği yerlere yanıt verir; karenin üst ve alt kenarlarında sessiz kalır.",
      horizontal:
        "Alt satır eksi üst satır: aynı dedektörün çeyrek tur döndürülmüş hâli. Bu kez yanıt vermediği kenarlar sol ve sağ kenarlardır.",
      outline:
        "Piksel, sekiz komşusunun hepsiyle karşılaştırılır. Ağırlıkların toplamı 0 olduğu için düz olan her şey kaybolur, geriye yalnızca dış hatlar kalır.",
      custom:
        "Kendi çekirdeğin. Ağırlıkların toplamına bak: düz bir alan tam olarak bu sayıyla çarpılır.",
    },
    restore: "Resmi geri getir",
    pictureLabel: "Resim",
    caption:
      "Düz bir parçada pencerenin altındaki her piksel aynıdır; bu yüzden çıktı, o parlaklık çarpı ağırlıkların toplamıdır. Kenar dedektörlerinin toplamı sıfırdır: düz alanların kaybolmasının nedeni budur.",
    legend: { positive: "pozitif", negative: "negatif" },
    figures: {
      sum: "Ağırlık toplamı",
      sumHint: "düz bir alanın çarpıldığı sayı",
      range: "Çıktı aralığı",
    },
    announce: (total: string, min: string, max: string) =>
      `Ağırlıkların toplamı ${total}. Çıktı ${min} ile ${max} arasında.`,
  },

  // 3 ----------------------------------------------------------------------
  shift: {
    kicker: "Resmin her yerinde",
    title: "Şekli taşı, yanıt da onunla birlikte taşınır.",
    lede: "Bu çekirdek, aradığı şeklin kendisi: artının olduğu yerde artı bir, çevresinde eksi bir. Artıyı taşı ve çıktının en büyük olduğu yere bak.",
    input: "Resim",
    detector: "Çekirdek",
    output: "Çıktı",
    inputLabel: (x: number, y: number) =>
      `16 × 16 piksellik bir resim: bir X, bir blok, bir çubuk ve merkezi sütun ${x}, satır ${y} olan bir artı. Ok tuşları artıyı taşır; tıklamak onu oraya koyar.`,
    outputNote:
      "Daha parlak, daha iyi eşleşme demek. Sıfır ve altındaki değerler karanlık bırakıldı.",
    detectorLabel:
      "5 × 5 bir çekirdek: artı şeklinin üzerinde artı 1, geri kalan her yerde eksi 1.",
    outputLabel: (x: number, y: number, value: string) =>
      `Çıktı. En büyük değer sütun ${x}, satır ${y} konumunda: ${value}.`,
    keyboardHint: "Artıyı koymak için resme tıkla ya da resmi seçip ok tuşlarını kullan.",
    moveLabel: "Artıyı taşı",
    move: { left: "Sola taşı", up: "Yukarı taşı", down: "Aşağı taşı", right: "Sağa taşı" },
    caption:
      "Yalnızca artıyı içeren bir pencere 9 alır; bu, herhangi bir pencerenin alabileceği en yüksek değerdir. X, blok ve çubuk daha düşük alır. Her konumda aynı 25 ağırlık kullanıldığı için, 5×5 pencereye başka bir şeklin pikselleri girmediği sürece en büyük değer artıyı hücre hücre izler. Artı bir şeklin üzerine gelirse pencere 9'dan az alabilir.",
    figures: {
      peak: "En büyük yanıt",
      peakAt: (x: number, y: number) => `sütun ${x}, satır ${y}`,
      weights: "Kullanılan ağırlık",
      weightsHint: "256 konumun hepsinde ortak",
      dense: "Paylaşım olmasaydı",
      denseHint: "her piksel ve her çıktı hücresi için bir ağırlık",
    },
    announce: (x: number, y: number, value: string) =>
      `En büyük yanıt ${value}, sütun ${x}, satır ${y}.`,
  },

  // 4 ----------------------------------------------------------------------
  size: {
    kicker: "Pencereleri saymak",
    title: "Çıktı ne kadar büyük?",
    lede: "Dört sayı belirler: girdi, çekirdek, kenardaki dolgu ve pencerenin her seferinde ne kadar sıçradığını söyleyen adım kaydırma (stride). Bunları değiştir ve pencereleri say.",
    input: "Girdi ve dolgu",
    output: "Çıktı",
    inputLabel: (n: number, p: number) =>
      `${n} × ${n} hücrelik bir girdi ve çevresinde ${p} hücrelik sıfır dolgusu. Çerçeveli kare, seçilen çıktı hücresinin penceresidir.`,
    outputLabel: (o: number, x: number, y: number) =>
      `Çıktı, ${o} × ${o}. Sütun ${x}, satır ${y} seçili. Bir hücreye tıkla ya da ok tuşlarını kullan.`,
    noFit: "Çekirdek, dolgulu girdiden büyük: koyacak yer yok, dolayısıyla çıktı da yok.",
    leftover: (n: number) =>
      n === 1
        ? "Adım tam bölünmüyor: dolgulu girdinin son satırı ve sütunu hiçbir zaman pencerenin altına girmiyor."
        : `Adım tam bölünmüyor: dolgulu girdinin son ${n} satırı ve sütunu hiçbir zaman pencerenin altına girmiyor.`,
    caption:
      "Kesikli hücreler sıfır dolgudur. Bir çıktı hücresine tıklayınca onu üreten pencereyi görürsün. Turuncu işaretli hücreler hiç okunmaz: formül aşağı yuvarlar, kütüphaneler de öyle yapar.",
    labels: { n: "Girdi n", k: "Çekirdek k", p: "Dolgu p", s: "Adım kaydırma s" },
    figures: {
      output: "Çıktı",
      windows: "Pencere",
      unreached: "Hiç okunmayan",
      unreachedHint: "dolgulu girdinin hücresi",
    },
    announce: (o: number) => `Çıktı ${o} × ${o}.`,
  },

  // 5 ----------------------------------------------------------------------
  depth: {
    kicker: "Katman üstüne katman",
    title: "Küçük pencereler üst üste binince uzağı görür.",
    lede: "Tek bir 3×3 katman yan yana üç hücre görür. Üstüne bir katman daha koyarsan, onun her hücresi alttaki üç hücrenin gördüğünü görür. En üstte bir hücre seç ve girdiye kadar neye bağlı olduğunu izle.",
    inputName: "Girdi",
    layerName: (l: number) => `Katman ${l}`,
    diagramLabel: (count: number, chosen: number, top: number, size: number) =>
      `16 girdilik bir satırın üzerinde 3'e 3 çekirdekli ${count} katman. Tepedeki ${top} hücreden ${chosen}. hücre seçili; yan yana ${size} girdiye bağlı. Başka birini seçmek için sol ve sağ ok tuşlarını kullan.`,
    edgeNote:
      "Bu hücrenin alanının bir kısmı resmin dışında, sıfır dolgusunun üzerinde kalıyor; bu yüzden yanan gerçek girdi sayısı alanın genişliğinden az.",
    layersLabel: "Katman",
    stridesLabel: "Her katmanın adım kaydırması",
    strideButton: (l: number, s: number) => `Katman ${l}: adım kaydırma ${s}`,
    caption:
      "Her katman, en üstün görebildiği alana iki hücre ekler; bu iki hücre, altındaki katmanların adım kaydırmalarının çarpımıyla büyür. Adım kaydırma 1 iken ve her katmanda tek çekirdek varken, iki 3×3 katman 18 ağırlıkla 5×5 görür; tek bir 5×5 çekirdek 25 ağırlık isterdi. Derin ağların küçük çekirdeklerden kurulmasının nedeni budur.",
    figures: {
      field: "Alıcı alan",
      fieldHint: "en üstteki tek bir hücrenin",
      weights: "Ağırlık",
      weightsHint: (count: number) =>
        count === 1 ? "tek bir 3×3 çekirdek" : `${count} tane 3×3 çekirdek`,
      single: "Tek çekirdekle",
      singleHint: (size: number) => `aynı uzağı görmek için ${size}×${size}`,
    },
    announce: (size: number) => `Alıcı alan ${size} × ${size}.`,
  },

  // 6 ----------------------------------------------------------------------
  learn: {
    kicker: "Kimse tasarlamıyor",
    title: "Çekirdeği ağırlıklar kendisi bulsun.",
    lede: "Bu resmin üzerinde gizli bir çekirdek çalıştırıldı; çıktısını görüyorsun, ağırlıklarını görmüyorsun. Dokuz rastgele sayıdan başla ve aradaki farkı gradient descent kapatsın.",
    input: "Resim",
    goal: "Hedef",
    current: "Şimdiki",
    inputLabel:
      "Bir disk, bir kare, eğik bir çubuk ve bir halkadan oluşan 24 × 24 piksellik dokulu bir resim.",
    goalLabel: "Gizli çekirdeğin resim üzerindeki çıktısı.",
    currentLabel: (lossValue: string) => `Şimdiki ağırlıkların çıktısı. Kayıp ${lossValue}.`,
    weightsLabel: "Ağırlıklar",
    weightsAria: (list: string) => `Şimdiki ağırlıklar, satır satır: ${list}.`,
    hiddenLabel: "Gizli",
    hiddenAria: (list: string) => `Gizli çekirdek, satır satır: ${list}.`,
    hiddenSecret: "Gizli çekirdek, henüz gösterilmedi.",
    curve: "Kayıp, log ölçek",
    curveLabel: "Her adımdan sonraki kayıp, logaritmik ölçekte.",
    found: (steps: number) =>
      `${steps} adımda buldu. Ağırlıklar artık gösterilen hassasiyette gizli çekirdekle aynı: kenarın ne olduğunu onlara kimse söylemedi.`,
    ready: "Dokuz rastgele ağırlık. “Eğit” düğmesine bas ve ağırlıkların nasıl değiştiğine bak.",
    searching: "Her adım, dokuz ağırlığın hepsini hatanın gradyanının tersi yönünde kaydırır.",
    train: "Eğit",
    pause: "Duraklat",
    resume: "Devam et",
    again: "Yeni rastgele başlangıç",
    targetLabel: "Gizli çekirdek",
    targets: { vertical: "Kenar dedektörü", blur: "Bulanıklaştır", outline: "Dış hat" },
    reveal: "Gizli çekirdeği şimdi göster",
    secondaryLabel: "Başka bir gizli çekirdek seç",
    caption:
      "Bu resimde hata, tek bir dibi olan bir çanaktır ve gizli çekirdek o diptedir; lab güvenli bir adım boyu seçtiği için gradient descent rastgele başlangıçlardan bu dibe yaklaşır. Kayıp çok küçüldüğünde (10⁻¹⁰'un altında) durur; en çok 3.000 adım atar. Ağların girdileriyle yaptığı gibi, önce resmin ortalama parlaklığı çıkarılır; bu, uyumun nerede biteceğini değil, ne kadar hızlı ilerleyeceğini değiştirir.",
    figures: { steps: "Adım", loss: "Kayıp" },
    announceDone: (steps: number) =>
      `${steps} adımda gizli çekirdeğe gösterilen hassasiyette ulaşıldı.`,
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Sıra sende",
    title: "Elle bulunacak üç çekirdek.",
    lede: "Her görev bir cevap değil, bir davranış ister. Bu davranışı gösteren her çekirdek geçer.",
    pickLabel: "Görev",
    yours: "Çıktın",
    reset: "İlerlememi sıfırla",
    solvedLabel: "Çözülen",
    caption:
      "Her değerlendirme, çekirdeğini gösterilen resimlerin üzerinde, sayfanın geri kalanıyla aynı aritmetikle çalıştırır. Cevap anahtarı yok.",
    announce: (solved: number, total: number) => `${total} görevden ${solved} tanesi çözüldü.`,
    shift: {
      tab: "Kaydır",
      task: "Resmin tamamını bir hücre sağa kaydır.",
      hint: "Çıktı girdiyle aynı boyutta kalır: en sağdaki sütun resmin dışına çıkar ve soldan açılan sütun sıfırla dolar.",
      input: "Resim",
      goal: "Hedef",
      solved: "Çözüldü. Solda tek bir 1: her çıktı solundaki pikseli okur ve bu, resmi sağa taşır.",
      notYet: "Henüz değil: çıktın hedefle eşleşmiyor.",
      mirrored:
        "Bu, resmi sola taşıdı. Bir evrişim katmanı çekirdeği ters çevirmeden, yazıldığı gibi yerleştirir (matematikte buna çapraz korelasyon denir); bu yüzden 1'in öbür tarafa gitmesi gerekiyor.",
    },
    flat: {
      tab: "Düz",
      task: "Düz olan her alanı 0 yap, ama karenin kenarına yine de yanıt ver.",
      hint: "Düz bir alanın hangi sayıyla çarpıldığını düşün.",
      input: "Resim",
      rules: {
        flatZero: "Pencerenin tek renk gördüğü her yerde 0",
        edgeSeen: "Kenarda bir yerde 0'dan farklı",
      },
      solved:
        "Çözüldü. Ağırlıklarının toplamı sıfır; bu yüzden düzlük birbirini götürür ve geriye yalnızca değişim kalır. Her kenar dedektörünün bu özelliği vardır.",
      notYet: "Henüz değil: iki koşula bak.",
    },
    vertical: {
      tab: "Dikey",
      task: "Dikey bir çizgiye yanıt ver, yatay olana hiç verme.",
      hint: "Dikey çizgide bir yerde 0'ın üstünde, yatay çizgide hiçbir yerde 0'ın üstünde değil.",
      vertical: "Dikey çizgi",
      horizontal: "Yatay çizgi",
      verticalOut: "Dikey çizgideki çıktın.",
      horizontalOut: "Yatay çizgideki çıktın.",
      rules: {
        fires: "Dikey çizgide bir yerde 0'ın üstünde",
        silent: "Yatay çizgide hiçbir yerde 0'ın üstünde değil",
      },
      solved:
        "Çözüldü. Bu iki deneme resminde çekirdeğin dikey çizgide 0'ın üstünde bir yanıt verdi, yatay çizgide hiçbir yerde 0'ın üstüne çıkmadı. Bu, iki koşulu bu resimlerde sağladığını gösterir; her durumda tek bir yöne duyarlı olduğunu kanıtlamaz.",
      notYet: "Henüz değil: iki koşula bak.",
    },
  },

  recap: {
    lessons: [
      "Evrişim, küçük bir çekirdeği girdinin üzerinde kaydırır; her çıktı, altındaki piksellerin ağırlıklı toplamıdır",
      "Neyin bulunacağını ağırlıklar belirler: aynı aritmetik bulanıklaştırır, keskinleştirir ya da kenarları bulur",
      "Düz bir parçada çıktı, parlaklık çarpı ağırlıkların toplamıdır; bu yüzden kenar dedektörlerinin toplamı sıfırdır",
      "Her konumda aynı ağırlıkların kullanılması, bir desenin nerede olursa olsun, çok daha az ağırlıkla bulunması demektir",
      "Çekirdek dolgulu girdiye sığıyorsa çıktı boyutu ⌊(n + 2p − k)/s⌋ + 1'dir: dolgu boyutu artırır, adım kaydırma küçültür",
      "Üst üste konmuş küçük çekirdekler uzağı görür: her katman alıcı alanı genişletir",
      "Çekirdekler elle tasarlanmaz: gradient descent onları örneklerden bulur",
    ],
    footer:
      "Evrişimli ağlar, 1989'da el yazısı posta kodlarını okuyan ağdan fotoğrafları tanıyan modellere kadar, tam olarak bu toplamın katmanlarından oluşur; yalnızca kanal ve çekirdek sayısı çok daha fazladır.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Dokuz ağırlık küçük bir resmin üzerinde kayar ve geride yeni bir resim bırakır. Pencereyi her seferinde bir hücre ilerletirsin.",
    stages: {
      slide: {
        picture:
          "Solda T harfinin 9×9'luk resmi ve üzerinde 3×3'lük pencere. Ortada dokuz ağırlık. Sağda ağırlıkların geride bıraktığı çıktı.",
        step: "Her basışta pencere bir hücre kayar ve çıktının bir hücresi hesaplanır.",
        cell: "O hücre dokuz çarpımın toplamı: her ağırlık, altındaki pikselle çarpılır. Toplamın tamamı yukarıda yazıyor.",
        fill: "Kalanını tek seferde doldur. Sonra resimdeki piksellere tıklayıp açıp kapat; çıktı da onlarla değişir.",
      },
      kernels: {
        picture: "Soldaki resmin üzerine çiz; sağda çekirdeğin ondan neyi yakaladığı görünür.",
        preset: "Başka bir çekirdek seç; çıktı yeniden hesaplanır.",
        type: "Ya da çekirdeğe kendi ağırlıklarını yaz. Tur ilk hücreye 2 yazdı.",
        sum: "Ağırlıkların toplamı, düz bir bölgenin çarpıldığı sayıdır. Kenar dedektörlerinin toplamı sıfırdır.",
      },
      shift: {
        shapes: "Bir artı işareti ve üç yanıltıcı şekil. Çekirdek, aradığı şeklin kendisidir.",
        move: "Artıyı bu oklarla taşı. Tur onu bir hücre sağa taşıdı.",
        peak: "5×5 pencereye başka bir şeklin pikselleri girmediği sürece en büyük çıktı da onunla birlikte hücre hücre kaydı; çünkü her konumda aynı ağırlıklar kullanılıyor.",
      },
      size: {
        grid: "Kesikli dolgusuyla girdi ve çıktı. Bir çıktı hücresine tıklayınca onu üreten pencere görünür.",
        stride:
          "Dört kaydırıcı: girdi, çekirdek, dolgu ve adım kaydırma. Tur, pencerenin daha uzağa sıçramasını sağladı.",
        count: "Çıktı küçüldü. Turuncu işaretli hücreler hiç okunmaz: formül aşağı yuvarlar.",
      },
      depth: {
        stack:
          "Üst üste 3×3'lük katmanlar. En üstten bir hücre seç ve girdiye kadar neyi gördüğünü izle.",
        layers: "Bu kaydırıcıyla katman ekle. Tur hepsini ekledi.",
        field:
          "Her katman en üstün gördüğü alanı genişletir, hem de tek bir büyük çekirdeğin gerektireceğinden daha az ağırlıkla.",
      },
      learn: {
        panels:
          "Hedef resmi gizli bir çekirdek üretti. Ağırlıklar rastgele başlıyor; eğri hatayı gösteriyor.",
        train: "Eğit: gradient descent dokuz ağırlığı adım adım gizli çekirdeğe doğru taşır.",
        loss: "Atılan adımlar ve kayıp. Kayıp çok küçüldüğünde ağırlıklar, gösterilen hassasiyette gizli çekirdekle aynı olur.",
      },
      challenge: {
        pick: "Elle kurman gereken üç davranış. Buradan birini seç.",
        type: "Çekirdeğe ağırlık yaz; her değişiklik resimler üzerinde denenir. Tur 1 yazdı.",
        solved: "Doğru davranan her çekirdek geçer. Cevap anahtarı yok.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      window: "Kayan bir ağırlık penceresi",
      sharing: "Her yerde aynı ağırlıklar",
      size: "Dolgu, adım kaydırma ve çıktı boyutu",
    },
    notes: {
      "ng-edge": "3×3'lük bir kenar çekirdeğinin resim üzerinde toplam toplam kaydırılması.",
      "sq-cnn": "Resim sınıflandıran bir ağda çekirdeklerin yeri.",
      "ng-why-conv": "Parametre paylaşımı ve neden bu kadar az ağırlık gerektirdiği.",
      "cs231n-conv": "Katmanın tamamı: paylaşım, alıcı alan, derinlik.",
      "ng-padding": "Dolgu ve lab'ın kullandığı çıktı boyutu formülü.",
      "ng-stride": "Adım kaydırma ve aşağı yuvarlama.",
      "d2l-padding": "Aynı formül, çözümlü örneklerle.",
      "d2l-convolution-book":
        "Kayan pencereyi küçük matrislerle hesapla. Bölüm, lab gibi çekirdeği çevirmeden uygulanan çapraz korelasyonla başlar ve bunu matematikteki evrişimden ayırır.",
    },
  },
};

export default copy;
