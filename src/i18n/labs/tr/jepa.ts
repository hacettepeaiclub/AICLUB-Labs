import type en from "../en/jepa";

const copy: typeof en = {
  percent: (n: number) => `%${n}`,
  decimal: (x: number, digits: number) => x.toFixed(digits).replace(".", ","),
  interaction: {
    step: "10 adım ilerlet",
    before: "Eğitim öncesi",
    after: "Güncel model",
    preview: "Aynı örneği incele",
    previewHint: "Bloğu taşımak için resme dokun. Bu işlem modeli yeniden eğitmez.",
    nextPicture: "Yeni inceleme örneği",
    all: "Tüm parçalar",
    interior: "Aynı doku içi",
    boundary: "Sınır örnekleri",
    counts: "Doğru / değerlendirilen",
    scoreHint:
      "Eğitimden ayrı 30 görüntüde, görünür komşusu olan tüm gizli parçalar sayılır. Sınır grubu, komşularından en az biri farklı dokudan olan parçaları da içerir.",
    noScore: "Örnek yok",
    unavailable: "Görünen komşusu olmayan parçalar puanlanmaz.",
    method: "Eğitim yöntemi",
    joint: "İki taraftan gradyan",
    detached: "Yalnızca stop-gradient",
    ema: "EMA ve stop-gradient",
    advanced: "İki işlemi ayrı incele",
    stop: "Hedefe giden gradyanı durdur",
    resetHint: "Yöntem veya başlangıç değişince eğitim sıfırlanır. Önceki sonuç otomatik taşınmaz.",
    question: "Tahmin et: kayıp azalınca doku ayrımı mutlaka iyileşir mi?",
    yes: "Evet, düşük kayıp yeterli",
    no: "Hayır, temsiller aynılaşabilir",
    feedbackYes:
      "Tek başına yeterli değil. Her parçaya benzer bir vektör vermek de kaybı azaltabilir.",
    feedbackNo:
      "Doğru. Kayıpla birlikte yayılımı ve ayrı değerlendirme örneklerindeki başarıyı izle.",
    pauseHint: "Eğitim, bu bölüm ekran dışında veya sekme gizliyken bekler.",
    begin: "Karşılaştırmayı eğit",
    readyHint:
      "Bu bölüm kendiliğinden eğitim başlatmaz. Düğmeye basınca modeli yalnızca bu bölüm görünürken hazırlar.",
    projection:
      "PCA görünümü: dört boyut → iki boyut. Eksenler her görünümde değişebilir; başarı dört boyutlu vektörlerle hesaplanır.",
  },
  flow: {
    title: "Tahminin izini sür",
    choose: "Gizli parça",
    context: "Görünen komşular → kodlayıcı E",
    predictor: "Tahminci P → tahmini vektör",
    target: "Gizli parça → hedef kodlayıcı",
    compare: "Tahmin ↔ hedef",
    trained: "E ve P gradyanla güncellenir",
    copied: "Hedef, E’nin %1’iyle güncellenir (EMA)",
    detached: "Hedef dalına gradyan gitmez",
    joint: "Hedef dalından da E’ye gradyan gider",
    distance: "Vektörler arası karesel uzaklık",
    decode: "Etiketli referanslarla adlandırma",
    decodeHint:
      "Ağ bir isim üretmez. Dört boyutlu tahmin, beş en yakın etiketli referansla karşılaştırılır. Bu adım eğitim kaybına katılmaz.",
    details: [
      "Görünen komşular aynı kodlayıcıdan geçer; vektörlerinin ortalaması tahminciye girer.",
      "Tahminci gizli parçanın dört sayılık temsilini üretir. Çubuklar bu modelin gerçek çıktısıdır.",
      "Hedef dalı eğitimde gizli parçanın kendisini görür. Bu bilgi tahminciye girdi olarak verilmez.",
      "Kayıp bu iki vektörün farkından hesaplanır. Buradaki değer tek parçaya aittir; eğitim kaybı farklı örneklerin ortalamasıdır.",
    ],
    noContext: "Bu parçanın görünen komşusu yok. Başka bir gizli parçayı seç.",
  },
  application: {
    title: "Bir uygulamada: görselle arama",
    kicker: "Öğrenilen temsil ne işe yarar?",
    lede: "Bir doku seç. Görüntünün bir kısmını ört, ışığı ve gürültüyü değiştir. Katalogdaki sıralama, görünen parçaların vektörlerine göre anında güncellensin.",
    query: "Kameradan gelen görüntü",
    catalog: "En yakın katalog örnekleri",
    mask: "Örtü boyutu",
    light: "Işık",
    noise: "Görüntü gürültüsü",
    drag: "Örtüyü taşımak için görüntünün üzerinde sürükle. Klavyeyle bir parça seçebilirsin.",
    preparing: "Kodlayıcı hazırlanıyor; bu sırada görüntüyü değiştirebilirsin.",
    ready: "Öğrenilmiş kodlayıcı kullanılıyor",
    before: "Başlangıçtaki kodlayıcı",
    after: "Öğrenilen kodlayıcı",
    encoder: "Görünen parçalar → kodlayıcı → dört sayı",
    similarity: "Kosinüs benzerliği",
    notProbability:
      "Bu bir olasılık veya güven yüzdesi değil. Değer 1’e yaklaştıkça vektörlerin yönü benzer.",
    training: "Eğitim: gizlenen parçanın temsilini tahmin et.",
    inference: "Kullanım: kodlayıcıyla görüntüyü vektöre çevir, katalog vektörleriyle karşılaştır.",
    scope:
      "Bu, yapay dokularla çalışan küçük bir görsel arama örneği. Ürün fotoğraflarını tanıyan hazır bir model değil. Katalog adları eğitimde kullanılmaz; çok fazla örtü veya farklı ışık eşleşmeyi bozabilir.",
    visible: "Görünen parça",
    match: "En yakın örnek",
    model: "Hangi kodlayıcı?",
    input: "Görüntü",
    representation: "Temsil",
    results: "Eşleşmeler",
  },
  network: {
    open: "Ağın katmanlarını incele",
    choose: "İncelenen ağ",
    encoder: "Görünen parçanın kodlayıcısı",
    predictor: "Gizli parçanın tahmincisi",
    target: "Hedef kodlayıcı",
    input: "Giriş",
    hidden: "Ara katman · tanh",
    output: "Çıkış",
    neuron: "Ara katmandaki nöron",
    value: "Aktivasyon",
    note: "Her kutu tek bir katman değil, küçük bir ağdır. Aşağıda aynı anda yalnızca seçtiğin ağ gösteriliyor. Çizgiler bağlantıları, düğümlerin rengi ve parlaklığı gerçek aktivasyonları gösterir.",
    normalization:
      "Ağın ham çıktısı burada. Tahmin ve hedef karşılaştırılmadan önce birim uzunluğa getirilir.",
    encoderHint:
      "Kodlayıcı bir parçanın 16 pikselini alır; 16 ara nörondan geçirip dört sayı üretir.",
    predictorHint:
      "Tahminci komşu temsillerinin dört sayılık ortalamasını alır; 16 ara nörondan geçirip dört sayı üretir.",
    targetHint:
      "Hedef kodlayıcı gizli parçanın kendisini işler. Bu dal, tahminciye gizli pikselleri vermez.",
  },
  simulation: {
    scrub: "Eğitimi sürükleyerek incele",
    goal: "İstenen adım",
    trace: "Sinyalin yolunu sürükleyerek izle",
    steps: ["Görünenler", "Tahmin", "Hedef", "Karşılaştır"],
    detail: "Seçili adım",
    remaining:
      "Model seçtiğin adıma kadar hesaplanıyor. Geri çekersen aynı başlangıçtan yeniden hesaplanır.",
  },
  pixel: {
    label: "Seçili pikselin parlaklığı",
    hint: "Tablodan bir piksel seç, parlaklığını sürükle. Hem görüntü hem sayı aynı anda değişir.",
    selected: "Seçili piksel",
    reset: "Görüntüyü sıfırla",
  },
  kinds: {
    flat: "Düz",
    horizontal: "Yatay çizgiler",
    vertical: "Dikey çizgiler",
    dots: "Noktalar",
  },
  picture: {
    title: "Resim sayılardan oluşur",
    question:
      "Bu görüntü 256 parlaklık değerinden oluşuyor. Bir parçaya dokun; içindeki 16 pikselin değerlerini gör.",
    pictureLabel: "16'ya 16 piksellik bir resim, 4'e 4 piksellik 16 parçaya bölünmüş.",
    patchLabel: (n: number) => `Parça ${n}`,
    numbersTitle: (n: number) => `Parça ${n}: piksel değerleri`,
    numbersLabel: "Parçanın parlaklık değerleri: siyah için 0, beyaz için 1.",
    kindNote: (kind: string) => `Doku: ${kind}. Bu etiket eğitimde kullanılmaz.`,
    another: "Başka bir resim",
    caption:
      "Buradaki her resim, her biri tek bir dokudan oluşan iki bölgedir ve her parçanın deseni rastgele bir yerden başlar. Bir çizginin yanında büyük olasılıkla yine çizgi vardır, ama aynı pikseller değil.",
  },
  train: {
    kicker: "Etiketsiz öğrenme",
    title: "Gizle, tahmin et, karşılaştır",
    lede: "Görüntüde bir blok gizle. Model, görünen komşulardan gizli parçanın dört sayılık temsilini tahmin etsin. Eğitimden önce ve sonra aynı örneği karşılaştır.",
    pictureLabel:
      "Gizli bloğu taşımak için bir parçaya dokun. Bu inceleme örneği eğitim ve puanlama verilerinden ayrıdır.",
    mapLabel:
      "Dört boyutlu hedef vektörlerin PCA ile iki boyuta yansıtılması. Renkler yalnızca değerlendirme için kullanılan doku etiketleridir. Halkalar tahmini, çizgilerin uçları hedefi gösterir. İki boyutlu yakınlık yanıltabilir.",
    legendGuess: "Tahmin",
    legendGoal: "Hedef",
    lossLabel: "Eğitim boyunca kayıp",
    play: "Eğit",
    pause: "Durdur",
    restart: "Baştan başla",
    newStart: "Başka bir başlangıç noktası",
    newStartHint:
      "Yeni başlangıç, farklı rastgele ağırlıklarla aynı eğitim verisini kullanır. Bazen farklı dokular benzer temsillere dönüşür. Düşük kayıp tek başına dokuların ayrıldığını göstermez.",
    startLabel: "Başlangıç noktası ve gösterdiği",
    steps: "Adım",
    loss: "Kayıp",
    separation: "Türler arası / kaymalar arası uzaklık",
    kindGuess: "Tüm değerlendirilen parçalar",
    times: (x: number) => `×${x.toFixed(1).replace(".", ",")}`,
    announceDone: (percent: number) =>
      `Eğitim tamamlandı. Değerlendirilen tüm parçaların %${percent} kadarı doğru adlandırıldı.`,
    caption:
      "Tarayıcıda eğitilen küçük bir JEPA modeli: yapay dokular, yaklaşık 500 parametre ve Adam. Ağ doku etiketi görmez. Ekrandaki tür adları, eğitimden ayrı tutulan etiketli referanslara göre 5-nearest-neighbours ile bulunur; modelin doğrudan çıktısı bir vektördür.",
  },
  collapse: {
    kicker: "Düşük kayıp yeterli mi?",
    title: "Hiçbir şey öğrenmeyen sıfır kayıp",
    lede: "İki tarafı birlikte güncelleyen eğitimle başla. Sonra yalnızca stop-gradient veya EMA + stop-gradient seç. Her seçim aynı başlangıç ve veriyle yeni bir eğitim başlatır; yöntemleri aynı adım sayısında karşılaştır.",
    slowCopy: "Yavaş hedef kopyası (EMA)",
    slowCopyHint:
      "EMA açıksa hedefe gradyan gitmez. EMA kapalıyken stop-gradient seçeneğini ayrı değiştirebilirsin.",
    spread: "Vektörlerin yayılımı",
    announceCollapsed:
      "Vektörlerin yayılımı çok düşük. Bu örnekte temsiller birbirine çok yaklaştı; kayıp azalsa da doku ayrımı kaybolmuş olabilir.",
    caption:
      "İki taraftan gradyan akması bu modelde temsillerin tek noktaya yaklaşmasına yol açabilir. Stop-gradient ve EMA farklı işlemlerdir; tek bir değişiklikmiş gibi yorumlama. EMA tek başına her mimaride çöküşü önleme garantisi değildir. Aynı adım sayısında kaybı, yayılımı ve başarıyı birlikte karşılaştır.",
  },
  pixels: {
    kicker: "Hangi bilgiyi tahmin ediyoruz?",
    title: "Tahmin ne olmalı?",
    lede: "Aynı gizli parçalar için iki farklı çıktı gör: piksel değerleri ve JEPA vektöründen çıkarılan doku adı. Bu, eşdeğer iki modelin genel başarı karşılaştırması değildir.",
    pictureLabel: "2×2'lik bir bloğu gizlenmiş bir resim. Bloğu taşımak için bir parça seç.",
    preparing: (percent: number) => `Önce model eğitiliyor: %${percent}`,
    another: "Başka bir resim",
    real: "Gizli parça",
    pixelGuess: "Doğrusal piksel tahmini",
    meaningGuess: "Vektörden doku adı",
    noGuess: "Tahmin için görünen komşusu yok.",
    between: "Komşular farklı dokulardan geliyor. Bu sınır örneğinde tahmin belirsiz olabilir.",
    rowLabel: (n: number) => `Gizli parça ${n}`,
    caption:
      "Piksel tarafı, 600 görüntüyle hesaplanmış düzenlileştirilmiş doğrusal bir tahmincidir. Buradaki rastgele desen kaymaları, ortalama tahminde çizgilerin silikleşmesine yol açar. Bu sonuç bütün piksel üreten modeller için geçerli değildir. Diğer sütundaki doku adı, JEPA vektörünün etiketli referanslarla karşılaştırılmasından gelir.",
  },
  bridge: {
    title: "Bu lab nelerden oluşuyor",
    intro: "Bu modelin her parçasının kendi labı var.",
    open: "Aç",
    items: {
      convolution: "Resim sayılardır ve küçük pencereler onu parça parça okur.",
      "word-embeddings": "Bir yer olarak anlam: birbirine benzeyenler haritada yakın düşer.",
      "multilayer-perceptrons": "Kodlayıcı ve tahminci, bunlar gibi küçük ağlardır.",
      backpropagation: "Her ağırlığın hatadaki payını nasıl öğrendiği.",
      "gradient-descent": "Ne büyüklükte adım atılacağı ve Adam'ın onu neden uyarladığı.",
      generalization: "Düşük kayıp, öğrenmiş olmakla aynı şey değildir.",
      attention:
        "I-JEPA, görünen parçalar arasındaki ilişkileri Vision Transformer ile işler. Buradaki küçük model yalnızca komşuları kullanır.",
    },
  },
  recap: {
    lessons: [
      "Görüntünün bir kısmını gizleyip temsilini tahmin etmek, doku etiketleri olmadan öğrenme sinyali üretebilir.",
      "JEPA bir vektör tahmin eder. Doku adını göstermek için ayrıca etiketli referanslarla karşılaştırma yapıyoruz.",
      "Düşük kayıp tek başına başarı değildir. Yayılımı, tüm parçaların başarısını ve zor sınır örneklerini birlikte incele.",
    ],
    footer:
      "Bu bir I-JEPA yeniden üretimi değil, temel fikri gösteren küçük bir modeldir: sentetik dokular, dört boyutlu temsiller ve yalnızca komşuları gören bir tahminci. Öğrenilen özellikler bu doku dünyasıyla sınırlıdır.",
  },
  sources: {
    title: "Kaynaklar",
    ijepa:
      "I-JEPA: bir bağlam kodlayıcısı, bir tahminci ve üstel hareketli ortalamayla güncellenen bir hedef kodlayıcı; kayıp, gizli blokların piksellerini değil, tahmin edilen ve hedef temsillerini karşılaştırır.",
    byol: "BYOL, çevrimiçi ağın yavaş güncellenen hedef temsili tahmin ettiği asimetrik bir eğitim kullanır. Başarı, tek başına EMA için genel bir çöküşsüzlük garantisi değildir.",
    lecunPath:
      "Ortak gömme tahmin mimarilerini öneren görüş makalesi: tahmini temsil uzayında yap ve tahmin edilemeyen ayrıntıları dışarıda bırak.",
  },
  tour: {
    intro:
      "Bir resmin bir kısmını gizle ve modelin, gizli kısmın ne olduğunu tahmin ederek öğrendiğini izle.",
    stages: {
      picture: {
        grid: "Resim 256 sayıdır ve 16 parçaya bölünmüştür.",
        patch: "Bir parça seç: bu 16 sayı, modelin eline geçecek her şeydir.",
        another: "Her resim iki dokudur ve her parça kendi kaymasıyla başlar.",
      },
      train: {
        hidden:
          "Resimde bir parçaya dokunarak gizli bloğu taşı. İncelediğin örnek eğitim verisini değiştirmez.",
        play: "Eğit. Her adım on altı yeni resimde bloklar gizler.",
        watch:
          "Başarı tablosunda tüm parçaları ve sınır örneklerini ayrı incele. Harita dört boyutun iki boyutlu görünümüdür.",
      },
      application: {
        camera: "Farklı bir doku seç. Katalogdaki sıralama görüntünün temsiline göre hesaplanır.",
        mask: "Örtüyü sürükle veya boyutunu değiştir. Kodlayıcı yalnızca görünen parçaları kullanır.",
        match:
          "Kosinüs benzerliği bir olasılık değildir. Bu küçük örnek, öğrenilen kodlayıcının nasıl kullanılabileceğini gösterir.",
      },
      collapse: {
        off: "Burada hem EMA hem stop-gradient kapalı. Menüdeki üç yöntemi aynı adım sayısında karşılaştır.",
        play: "Eğit ve haritayı izle.",
        zero: "Kayıp azalırken yayılım da çok küçülebilir. Başarıya da bak: düşük kayıp tek başına yeterli değil.",
      },
      pixels: {
        compare:
          "Gerçek parçayı, doğrusal piksel tahminini ve vektörden çıkarılan doku adını karşılaştır. Bunlar farklı çıktılar.",
        another: "Başka bir resim dene.",
      },
    },
  },
  study: {
    topics: { jepa: "Ortak gömme tahmin mimarileri" },
    notes: {
      "meta-ijepa":
        "Meta'nın I-JEPA'yı kendi anlattığı kısa yazı: gizli bölgelerin piksellerini değil, soyut temsillerini tahmin etmek.",
      "ijepa-paper":
        "Makalenin kendisi: bağlam ve hedef kodlayıcıları, tahminci, maskeleme ve sonuçlar.",
    },
  },
};

export default copy;
