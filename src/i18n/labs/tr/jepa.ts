import type en from "../en/jepa";

const copy: typeof en = {
  percent: (n: number) => `%${n}`,
  decimal: (x: number, digits: number) => x.toFixed(digits).replace(".", ","),
  kinds: {
    flat: "Düz",
    horizontal: "Yatay çizgiler",
    vertical: "Dikey çizgiler",
    dots: "Noktalar",
  },
  picture: {
    title: "Resim sayılardan oluşur",
    question:
      "Bilgisayar çizgi ya da nokta görmez; 256 sayı görür. Bir parça seç ve onun 16 sayısını oku.",
    pictureLabel: "16'ya 16 piksellik bir resim, 4'e 4 piksellik 16 parçaya bölünmüş.",
    patchLabel: (n: number) => `Parça ${n}`,
    numbersTitle: (n: number) => `Parça ${n}: 16 sayısı`,
    numbersLabel: "Parçanın parlaklık değerleri: siyah için 0, beyaz için 1.",
    kindNote: (kind: string) => `Altındaki: ${kind}. Bu, modele hiçbir zaman söylenmez.`,
    another: "Başka bir resim",
    caption:
      "Buradaki her resim, her biri tek bir dokudan oluşan iki bölgedir ve her parçanın deseni rastgele bir yerden başlar. Bir çizginin yanında büyük olasılıkla yine çizgi vardır, ama aynı pikseller değil.",
  },
  train: {
    kicker: "Etiketsiz öğrenme",
    title: "Gizle, tahmin et, karşılaştır",
    lede: "2×2'lik bir blok gizlenir. Küçük bir yapay sinir ağı her görünen parçayı dört sayılık bir vektöre çevirir; ikinci bir ağ, gizli bir parçanın çevresindeki vektörlerden o parçanın vektörünün ne olacağını tahmin eder. Kimse neyin ne olduğunu söylemez: resim kendi cevap anahtarıdır.",
    pictureLabel: "Bu adımın resmi; gizli blok kapatılmış.",
    mapLabel:
      "On iki resmin her parçası bir nokta olarak: vektörü, düzleme yatırılmış hâliyle. Renk parçanın türüdür ve model bunu hiç görmez. Halkalar bu resmin tahminleridir; çizgiler her tahmini hedeflediği vektöre bağlar.",
    legendGuess: "Tahmin",
    legendGoal: "Hedefi",
    lossLabel: "Eğitim boyunca kayıp",
    play: "Eğit",
    pause: "Durdur",
    restart: "Baştan başla",
    newStart: "Başka bir başlangıç noktası",
    newStartHint:
      "Her başlangıç noktası, başka rastgele ilk ağırlıklardır. Bazen iki tür aynı yere düşer: tahminleri yine tutar, yani kayıp buna aldırmaz, ama doğru tür oranı düşer. Buna boyut çöküşü denir ve gerçek sistemler de bununla uğraşır.",
    startLabel: "Başlangıç noktası ve gösterdiği",
    steps: "Adım",
    loss: "Kayıp",
    separation: "Türler arası / kaymalar arası uzaklık",
    kindGuess: "Tahminlerin doğru türe düşme oranı",
    times: (x: number) => `×${x.toFixed(1).replace(".", ",")}`,
    announceDone: (percent: number) =>
      `Eğitim bitti. Tahminler zamanın %${percent} kadarında doğru türe düşüyor.`,
    caption:
      "Burada eğitilen, gerçek bir ortak gömme tahmin mimarisidir (JEPA): yaklaşık beş yüz öğrenilen sayı, elle yazılmış geri yayılım ve Adam. Türler yalnızca haritayı boyamak ve puanlamak için kullanılır; eğitim onları hiç okumaz.",
  },
  collapse: {
    kicker: "Neden yavaş bir kopya?",
    title: "Hiçbir şey öğrenmeyen sıfır kayıp",
    lede: "Her tahminin hedeflediği vektör, kodlayıcının hiç eğitilmeyen bir kopyasından gelir: her adımdan sonra kodlayıcıya biraz yaklaşır, o kadar. Onu kapat, böylece tahmin kodlayıcının kendisini hedeflesin, ve eğit.",
    slowCopy: "Kodlayıcının yavaş bir kopyasını hedefle",
    slowCopyHint:
      "Kapalıyken hedef, eğitilen kodlayıcının kendisinden gelir ve gradyanlar iki taraftan da akar.",
    spread: "Vektörlerin yayılımı",
    announceCollapsed:
      "Çöktü: her parçanın vektörü aynı. Her tahmin doğru, ama hiçbiri resim hakkında bir şey söylemiyor.",
    caption:
      "Her tahmini doğru yapmanın en ucuz yolu, her parçaya aynı vektörü vermektir. Yavaş kopyayla hedef, tahmini kaydıran adımla birlikte sürüklenemez; haritanın tek bir noktaya büzülmesini engelleyen budur. I-JEPA ve BYOL çöküşten bu asimetriyle kaçınır.",
  },
  pixels: {
    kicker: "Pikseller değil, anlam",
    title: "Tahmin ne olmalı?",
    lede: "Bir boşluğu doldurmanın başka bir yolu da var: piksellerini tahmin etmek. Burada ikisi aynı gizli parçaları tahmin ediyor. Gizli bloğu taşımak için resimde bir parça seç.",
    pictureLabel: "2×2'lik bir bloğu gizlenmiş bir resim. Bloğu taşımak için bir parça seç.",
    preparing: (percent: number) => `Önce model eğitiliyor: %${percent}`,
    another: "Başka bir resim",
    real: "Gizli parça",
    pixelGuess: "Piksellerini tahmin",
    meaningGuess: "Türünü tahmin",
    noGuess: "Tahmin için görünen komşusu yok.",
    between: "Komşuları iki ayrı türden, bu yüzden tahmin ikisinin arasına düşüyor.",
    rowLabel: (n: number) => `Gizli parça ${n}`,
    caption:
      "Piksel tahmini, komşuların piksellerinden yapılabilecek en iyi doğrusal tahmindir ve altı yüz resim üzerinde uydurulmuştur. Bir çizginin kayması yazı turadır, bu yüzden en az yanlış tahmin bütün kaymaların ortalamasıdır: gri. JEPA kaymayı vektörlerinin dışında bırakır ve onun yerine türü söyler.",
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
        "Gerçek JEPA'lar yalnızca komşuları değil, bütün resmi dikkat mekanizmasıyla okur.",
    },
  },
  recap: {
    lessons: [
      "Bir model, kimsenin etiketlemediği resimlerden, her birinin bir kısmını gizleyip geri kalanından tahmin ederek öğrenebilir.",
      "JEPA gizli kısmın piksellerini değil vektörünü tahmin eder; böylece tahmin edilemeyeni dışarıda bırakıp edilebileni tutabilir.",
      "Sıfır kayıp çöküş anlamına gelebilir: vektörlerin hepsinin aynılaşmasını engelleyen, yavaş kopyadır.",
    ],
    footer:
      "Öğretmek için kurulmuş bir model: yapay dokular, yaklaşık beş yüz öğrenilen sayı ve yalnızca komşuları gören bir tahminci. I-JEPA'nın mimarisi, bir ders büyüklüğünde.",
  },
  sources: {
    title: "Kaynaklar",
    ijepa:
      "I-JEPA: bir bağlam kodlayıcısı, bir tahminci ve üstel hareketli ortalamayla güncellenen bir hedef kodlayıcı; kayıp, gizli blokların piksellerini değil, tahmin edilen ve hedef temsillerini karşılaştırır.",
    byol: "BYOL: bir çevrimiçi ağ, yavaşça güncellenen bir hedef ağın temsilini tahmin eder; sabite çökmeyi engelleyen bu yavaş hedeftir.",
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
        hidden: "2×2'lik bir blok gizli. Onun için yapılan tahminler haritadaki halkalardır.",
        play: "Eğit. Her adım on altı yeni resimde bloklar gizler.",
        watch: "Kayıp düşer ve aynı türden parçalar tek bir bulutta toplanır.",
      },
      collapse: {
        off: "Yavaş kopya burada kapalı: tahminler kodlayıcının kendisini hedefliyor.",
        play: "Eğit ve haritayı izle.",
        zero: "Kayıp sıfıra, yayılım sıfıra iner ve hiçbir şey öğrenilmez.",
      },
      pixels: {
        compare: "Gerçek parça, piksel tahmini, tür tahmini: piksel tahmini gridir.",
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
