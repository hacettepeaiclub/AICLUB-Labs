import type en from "../en/convolution";

/** Türkçe metin: convolution. Şekli `en/convolution.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    lecunZip:
      "Bu laboratuvarın konusu olan kısıtlı ağı tanıtır: ağırlıkları resmin her konumunda ortak kullanılan, geri yayılımla öğrenilen ve el yazısı rakamları okuyan küçük çekirdekler.",
    convArithmetic:
      "Girdi boyutunun, çekirdek boyutunun, dolgunun ve adımın çıktı boyutunu nasıl belirlediğini, adımın hiç ulaşamadığı hücreleri düşüren taban işlemiyle birlikte adım adım çıkarır. Dördüncü bölümdeki formül, bu genel durum için verdiği ilişkidir.",
    vgg: "3×3 katman yığınlarını savunur: iki tanesi 5×5, üç tanesi 7×7 bir bölgeyi görür ve bunu tek bir büyük çekirdeğin gerektireceğinden daha az ağırlıkla yapar.",
    alexnet:
      "Derin bir ağın ilk katmanının fotoğraflardan kendi kendine öğrendiği çekirdekleri gösterir: çoğu belirli bir yöndeki kenarlara ya da renge yanıt verir.",
    hubelWiesel:
      "Görme korteksinde her biri görme alanının küçük bir bölgesine, çoğu da tek bir yöndeki bir kenara ya da çubuğa yanıt veren hücreleri anlatır. Alıcı alan terimi bu çalışmadan gelir.",
  },

  cellLabel: (row: number, column: number) => `Ağırlık, satır ${row}, sütun ${column}`,
  invalidWeight: "Her hücreye bir sayı gerekiyor: 1, -2, 0,5 ya da 1/9 deneyin.",
  kernelWord: "Çekirdek",

  // 1 ----------------------------------------------------------------------
  slide: {
    title: "Kayan bir pencere",
    question: "Dokuz ağırlık bir resmin üzerinde kayıyor. Geride ne bırakıyorlar?",
    input: "Resim",
    kernel: "Çekirdek",
    output: "Çıktı",
    inputLabel:
      "T harfinin 9'a 9 resmi. Çerçeveli kare penceredir. Bir pikseli açıp kapatmak için tıklayın.",
    kernelLabel: "Çekirdek: sol sütunda eksi 1, ortada 0, sağda artı 1.",
    outputLabel: (done: number, total: number) =>
      `Çıktı, ${total} hücreden ${done} tanesi hesaplandı. Pencereyi bir hücreye taşımak için tıklayın ya da ok tuşlarını kullanın.`,
    arithmetic: "Bu hücrenin hesabı",
    step: "Bir adım kaydır",
    fillRest: "Kalanını doldur",
    reset: "Baştan başla",
    caption:
      "Her çıktı hücresi, toplanan dokuz çarpımdır: ağırlık çarpı altındaki piksel. Ağırlıklar hiç değişmez; yalnızca pencere hareket eder. Resmin sağa doğru aydınlandığı yerde pozitif, karardığı yerde negatif.",
    announce: (column: number, row: number, value: string) =>
      `Pencere sütun ${column}, satır ${row}. Çıktı ${value}.`,
    figures: {
      cell: "Bu hücre",
      computed: "Hesaplanan",
      weights: "Ağırlık",
      weightsHint: "her adımda aynı dokuz tane",
    },
  },

  // 2 ----------------------------------------------------------------------
  kernels: {
    kicker: "Dokuz sayı",
    title: "Ağırlıkları değiştirin, gördüğü şey değişsin.",
    lede: "Aynı kayan toplam, bu kez daha büyük bir resimde. Bir çekirdek seçin ya da kendinizinkini yazın, sonra resmin üzerine çizin ve neyi yakaladığına bakın.",
    input: "Resim",
    output: "Çıktı",
    inputLabel:
      "32'ye 32 bir resim: bir disk, bir kare, eğik bir çubuk ve bir halka. Çizmek için üzerinde sürükleyin.",
    outputLabel: "Çekirdekten geçmiş resim. Sıfırla dolgulandığı için boyutu aynı.",
    drawHint: "Çizmek için sürükleyin.",
    editorLabel: "Çekirdek",
    presetLabel: "Başlangıç",
    presets: {
      identity: "Birim",
      blur: "Bulanıklaştır",
      sharpen: "Keskinleştir",
      vertical: "Dikey kenarlar",
      horizontal: "Yatay kenarlar",
      outline: "Dış hat",
    },
    notes: {
      identity: "Ortadaki tek bir 1, altındaki pikseli kopyalar: çıktı resmin kendisidir.",
      blur: "Dokuz tane dokuzda bir, her pikselin komşularıyla ortalamasını alır. Ağırlıkların toplamı 1 olduğu için düz alanlar parlaklığını korur.",
      sharpen:
        "Piksel, artı dört komşusundan ne kadar farklı olduğu. Ağırlıkların toplamı 1 olduğu için düz alanlar olduğu gibi kalır, kenarlar dikleşir.",
      vertical:
        "Sağ sütun eksi sol sütun. Parlaklığın soldan sağa değiştiği yerlere yanıt verir; karenin üst ve alt kenarlarında sessiz kalır.",
      horizontal:
        "Alt satır eksi üst satır: aynı dedektör çeyrek tur döndürülmüş hâli. Bu kez görmezden geldiği kenarlar sol ve sağ kenarlar.",
      outline:
        "Piksel, sekiz komşusunun hepsine karşı. Ağırlıkların toplamı 0 olduğu için düz olan her şey kaybolur, geriye yalnızca dış hatlar kalır.",
      custom:
        "Kendi çekirdeğiniz. Ağırlıkların toplamını izleyin: düz bir alan tam olarak bu sayıyla çarpılır.",
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
    title: "Şekli taşıyın. Yanıt onunla birlikte gelsin.",
    lede: "Bu çekirdek, aradığı şeklin kendisi: artının olduğu yerde artı bir, çevresinde eksi bir. Artıyı taşıyın ve çıktının en güçlü olduğu yere bakın.",
    input: "Resim",
    detector: "Çekirdek",
    output: "Çıktı",
    inputLabel: (x: number, y: number) =>
      `16'ya 16 bir resim: bir X, bir blok, bir çubuk ve merkezi sütun ${x}, satır ${y} olan bir artı. Ok tuşları artıyı taşır; tıklamak onu oraya koyar.`,
    outputNote: "Ne kadar parlaksa o kadar iyi eşleşiyor. Sıfır ve altı karanlık bırakıldı.",
    detectorLabel:
      "5'e 5 bir çekirdek: artı şeklinin üzerinde artı 1, geri kalan her yerde eksi 1.",
    outputLabel: (x: number, y: number, value: string) =>
      `Çıktı. En güçlü olduğu yer sütun ${x}, satır ${y}; değeri ${value}.`,
    keyboardHint: "Artıyı koymak için resme tıklayın ya da resmi seçip ok tuşlarını kullanın.",
    moveLabel: "Artıyı taşı",
    move: { left: "Sola taşı", up: "Yukarı taşı", down: "Aşağı taşı", right: "Sağa taşı" },
    caption:
      "Tam olarak artıyı içeren bir pencere 9 alır; bu, herhangi bir pencerenin alabileceği en yüksek değerdir. X, blok ve çubuk daha düşük alır. Her konumda aynı 25 ağırlık kullanıldığı için tepe noktası artıyı nereye giderse gitsin hücre hücre izler.",
    figures: {
      peak: "En güçlü",
      peakAt: (x: number, y: number) => `sütun ${x}, satır ${y}`,
      weights: "Kullanılan ağırlık",
      weightsHint: "256 konumun hepsinde ortak",
      dense: "Paylaşım olmasaydı",
      denseHint: "her piksel ve her çıktı hücresi için bir ağırlık",
    },
    announce: (x: number, y: number, value: string) =>
      `En güçlü yanıt ${value}, sütun ${x}, satır ${y}.`,
  },

  // 4 ----------------------------------------------------------------------
  size: {
    kicker: "Pencereleri saymak",
    title: "Çıktı ne kadar büyük?",
    lede: "Bunu dört sayı belirler: girdi, çekirdek, kenardaki dolgu ve pencerenin ne kadar sıçradığını söyleyen adım. Değiştirin ve sayın.",
    input: "Girdi ve dolgu",
    output: "Çıktı",
    inputLabel: (n: number, p: number) =>
      `${n} × ${n} hücrelik bir girdi ve çevresinde ${p} hücrelik sıfır dolgusu. Çerçeveli kare, seçilen çıktı hücresinin penceresidir.`,
    outputLabel: (o: number, x: number, y: number) =>
      `Çıktı, ${o} × ${o}. Sütun ${x}, satır ${y} seçili. Bir hücreye tıklayın ya da ok tuşlarını kullanın.`,
    noFit: "Çekirdek, dolgulu girdiden büyük: koyacak yer yok, dolayısıyla çıktı da yok.",
    leftover: (n: number) =>
      n === 1
        ? "Adım tam bölünmüyor: dolgulu girdinin son satırı ve sütunu hiçbir zaman pencerenin altına girmiyor."
        : `Adım tam bölünmüyor: dolgulu girdinin son ${n} satırı ve sütunu hiçbir zaman pencerenin altına girmiyor.`,
    caption:
      "Kesikli hücreler sıfır dolgusudur. Bir çıktı hücresine tıklayınca onu üreten pencereyi görürsünüz. Turuncuyla işaretli hücreler hiç okunmaz: formül aşağı yuvarlar, her framework de öyle.",
    labels: { n: "Girdi n", k: "Çekirdek k", p: "Dolgu p", s: "Adım s" },
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
    lede: "Tek bir 3×3 katman yan yana üç hücre görür. Üstüne bir tane daha koyun; onun her hücresi, alttaki üç hücrenin gördüğünü görür. Tepeden bir hücre seçin; aşağıdaki katmanlarda hangi hücrelere dayandığı işaretlenir.",
    inputName: "Girdi",
    layerName: (l: number) => `Katman ${l}`,
    diagramLabel: (count: number, chosen: number, top: number, size: number) =>
      `16 girdilik bir satırın üzerinde 3'e 3 çekirdekli ${count} katman. Tepedeki ${top} hücreden ${chosen}. hücre seçili; yan yana ${size} girdiye bağlı. Başka birini seçmek için sol ve sağ ok tuşlarını kullanın.`,
    edgeNote:
      "Bu hücrenin alanının bir kısmı resmin dışında, sıfır dolgusunun üzerinde kalıyor; bu yüzden yanan gerçek girdi sayısı alanın genişliğinden az.",
    layersLabel: "Katman",
    stridesLabel: "Her katmanın adımı",
    strideButton: (l: number, s: number) => `Katman ${l}: adım ${s}`,
    caption:
      "Her katman, tepenin görebildiği alana iki hücre ekler; bu iki hücre altındaki adımların çarpımıyla büyür. İki 3×3 katman 18 ağırlıkla 5×5 görür; tek bir 5×5 çekirdek 25 ağırlık isterdi. Derin ağların küçük çekirdeklerden kurulmasının nedeni tam olarak budur.",
    figures: {
      field: "Alıcı alan",
      fieldHint: "tepedeki tek bir hücrenin",
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
    title: "Çekirdeği ağırlıklar bulsun.",
    lede: "Bu resmin üzerinden gizli bir çekirdek zaten geçirildi; ağırlıklarını değil, yalnızca çıktısını görüyorsunuz. Dokuz rastgele sayıdan başlayın ve aradaki farkı gradient descent kapatsın.",
    input: "Resim",
    goal: "Hedef",
    current: "Şimdiki",
    inputLabel:
      "Bir disk, bir kare, eğik bir çubuk ve bir halkadan oluşan 24'e 24 dokulu bir resim.",
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
      `${steps} adımda buldu. Ağırlıklar artık gizli çekirdeğin kendisi: kenarın ne olduğunu onlara kimse söylemedi.`,
    ready:
      "Dokuz rastgele ağırlık. Eğit'e basın; gradient descent onları adım adım saklı çekirdeğe doğru taşır.",
    searching: "Her adım, dokuz ağırlığın hepsini hatanın gradyanının tersine kaydırır.",
    train: "Eğit",
    pause: "Duraklat",
    resume: "Devam et",
    again: "Yeni rastgele başlangıç",
    targetLabel: "Gizli çekirdek",
    targets: { vertical: "Kenar dedektörü", blur: "Bulanıklaştır", outline: "Dış hat" },
    reveal: "Gizli çekirdeği şimdi göster",
    secondaryLabel: "Başka bir gizli çekirdek seçin",
    caption:
      "Hata, tek bir dibi olan bir çanaktır ve gizli çekirdek tam o diptedir; bu yüzden nereden başlarsa başlasın iniş onda biter. Ağların girdileriyle yaptığı gibi, önce resmin ortalama parlaklığı çıkarılır; bu, uyumun nerede biteceğini değil, ne kadar hızlı gideceğini değiştirir.",
    figures: { steps: "Adım", loss: "Kayıp" },
    announceDone: (steps: number) => `Gizli çekirdek ${steps} adımda bulundu.`,
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Sıra sizde",
    title: "Elle bulunacak üç çekirdek.",
    lede: "Her biri bir cevap değil, bir davranış istiyor. O davranışı gösteren her çekirdek geçer.",
    pickLabel: "Görev",
    yours: "Çıktınız",
    reset: "İlerlememi unut",
    solvedLabel: "Çözülen",
    caption:
      "Her karar, çekirdeğinizi gösterilen resimlerin üzerinden sayfanın geri kalanıyla aynı aritmetikle geçirir. Cevap anahtarı yok.",
    announce: (solved: number, total: number) => `${total} görevden ${solved} tanesi çözüldü.`,
    shift: {
      tab: "Kaydır",
      task: "Resmin tamamını bir hücre sağa kaydırın.",
      hint: "Çıktı aynı boyuta dolgulanıyor; yani her pikselin gidecek bir yeri var.",
      input: "Resim",
      goal: "Hedef",
      solved: "Çözüldü. Solda tek bir 1: her çıktı solundaki pikseli okur ve bu, resmi sağa taşır.",
      notYet: "Henüz değil: çıktınız hedefle eşleşmiyor.",
      mirrored:
        "Bu, resmi sola taşıdı. Bir evrişim katmanı çekirdeği ters çevirmeden, yazıldığı gibi yerleştirir; bu yüzden 1'in öbür tarafa gitmesi gerekiyor.",
    },
    flat: {
      tab: "Düz",
      task: "Düz olan her alanı 0 yapın ama karenin kenarına yine de yanıt verin.",
      hint: "Düz bir alanın neyle çarpıldığını düşünün.",
      input: "Resim",
      rules: {
        flatZero: "Pencerenin tek renk gördüğü her yerde 0",
        edgeSeen: "Kenarda bir yerde 0'dan farklı",
      },
      solved:
        "Çözüldü. Ağırlıklarınızın toplamı sıfır; bu yüzden düzlük birbirini götürür ve geriye yalnızca değişim kalır. Her kenar dedektörünün bu özelliği vardır.",
      notYet: "Henüz değil: iki koşula bakın.",
    },
    vertical: {
      tab: "Dikey",
      task: "Dikey bir çizgiye yanıt verin, yatay olana asla.",
      hint: "Dikey çizgide bir yerde 0'ın üstünde, yatay çizgide hiçbir yerde 0'ın üstünde değil.",
      vertical: "Dikey çizgi",
      horizontal: "Yatay çizgi",
      verticalOut: "Dikey çizgideki çıktınız.",
      horizontalOut: "Yatay çizgideki çıktınız.",
      rules: {
        fires: "Dikey çizgide bir yerde 0'ın üstünde",
        silent: "Yatay çizgide hiçbir yerde 0'ın üstünde değil",
      },
      solved:
        "Çözüldü. Çekirdeğinizin bir sütununun toplamı 0'dan büyük ve hiçbir satırın toplamı 0'dan büyük değil. Tek bir yönün dedektörü tam olarak budur.",
      notYet: "Henüz değil: iki koşula bakın.",
    },
  },

  recap: {
    lessons: [
      "Evrişim, küçük bir çekirdeği girdinin üzerinde kaydırır; her çıktı, altındaki piksellerin ağırlıklı toplamıdır",
      "Ne bulacağına ağırlıklar karar verir: aynı aritmetik bulanıklaştırır, keskinleştirir ya da kenarları ayıklar",
      "Düz bir parçada çıktı, parlaklık çarpı ağırlıkların toplamıdır; bu yüzden kenar dedektörlerinin toplamı sıfırdır",
      "Her konumda aynı ağırlıklar, bir desenin nerede olursa olsun ağırlıkların küçücük bir kısmıyla bulunması demektir",
      "Çıktı boyutu ⌊(n + 2p − k)/s⌋ + 1'dir: dolgu boyutu korur, adım küçültür",
      "Üst üste konmuş küçük çekirdekler uzağı görür: her katman alıcı alanı genişletir",
      "Çekirdekler elle tasarlanmaz: gradient descent onları örneklerden bulur",
    ],
    footer:
      "1989'da posta kodlarındaki el yazısını okuyan ağdan bugün fotoğrafları tanıyan modellere kadar evrişimli ağlar, tam olarak bu toplamın katmanlarıdır; yalnızca daha çok kanal ve çok daha fazla çekirdekle.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Dokuz ağırlık küçük bir resmin üzerinde kayar ve geride yeni bir resim bırakır. Pencereyi hücre hücre siz ilerletirsiniz.",
    stages: {
      slide: {
        picture:
          "Solda T harfinin 9×9'luk resmi ve üzerinde 3×3'lük pencere. Ortada dokuz ağırlık. Sağda geride bıraktıkları.",
        step: "Her basışta pencere bir hücre kayar ve çıktının bir hücresi hesaplanır.",
        cell: "O hücre dokuz çarpımın toplamı: her ağırlık, altındaki pikselle çarpılır. Toplamın tamamı yukarıda yazıyor.",
        fill: "Kalanını tek seferde doldurun. Sonra resimdeki piksellere tıklayıp açıp kapatın; çıktı da onlarla değişir.",
      },
      kernels: {
        picture: "Soldaki resmin üzerine çizin; sağda çekirdeğin ondan neyi yakaladığı görünür.",
        preset: "Başka bir çekirdek seçin; çıktı yeniden hesaplanır.",
        type: "Ya da çekirdeğe kendi ağırlıklarınızı yazın. Tur ilk hücreye 2 yazdı.",
        sum: "Ağırlıkların toplamı, düz bir bölgenin çarpıldığı sayı. Kenar bulucuların toplamı sıfırdır.",
      },
      shift: {
        shapes: "Bir artı işareti ve üç tuzak. Çekirdek, aradığı şeklin ta kendisi.",
        move: "Artıyı bu oklarla taşıyın. Tur onu bir hücre sağa taşıdı.",
        peak: "En güçlü çıktı da onunla birlikte hücre hücre kaydı; çünkü her konumda aynı ağırlıklar kullanılıyor.",
      },
      size: {
        grid: "Kesikli dolgusuyla girdi ve çıktı. Bir çıktı hücresine tıklayınca onu üreten pencere görünür.",
        stride:
          "Dört kaydırıcı: girdi, çekirdek, dolgu ve adım. Tur pencerenin daha uzağa sıçramasını sağladı.",
        count: "Çıktı küçüldü. Kehribar renkli hücreler hiç okunmuyor; formül aşağı yuvarlar.",
      },
      depth: {
        stack:
          "Üst üste 3×3'lük katmanlar. En üstten bir hücre seçip girdiye kadar neyi gördüğünü takip edin.",
        layers: "Bu kaydırıcıyla katman ekleyin. Tur hepsini ekledi.",
        field:
          "Her katman tepenin gördüğü alanı genişletir; hem de tek büyük bir çekirdeğin gerektireceğinden daha az ağırlıkla.",
      },
      learn: {
        panels:
          "Hedef resmi gizli bir çekirdek üretti. Ağırlıklar rastgele başlıyor; eğri hatayı gösteriyor.",
        train: "Eğitin: gradient descent dokuz ağırlığı adım adım gizli çekirdeğe doğru taşır.",
        loss: "Atılan adımlar ve kayıp. Dibe ulaşınca ağırlıklar gizli çekirdekle aynı olur.",
      },
      challenge: {
        pick: "Elle kurmanız gereken üç davranış. Buradan birini seçin.",
        type: "Çekirdeğe ağırlık yazın; her değişiklik resimler üzerinde denenir. Tur 1 yazdı.",
        solved: "Doğru davranan her çekirdek geçer. Cevap anahtarı yok.",
      },
    },
  },
};

export default copy;
