import type { Translation } from "./types";

/**
 * Türkçe.
 *
 * Bu dosya `en.ts` ile aynı şekle sahip olmak zorundadır; eksik ya da fazla bir
 * anahtar derleme hatasıdır.
 *
 * ## Çeviri ilkeleri
 *
 * Metinler İngilizceden kelime kelime çevrilmedi, konuşma diline yakın ve
 * doğal Türkçeyle yeniden yazıldı. "Siz" kipi kullanıldı ama cümleler
 * gereksiz yere resmileştirilmedi ya da uzatılmadı; teknik doğruluk, ağdalı
 * bir dil kullanmayı gerektirmiyor.
 *
 * Yerleşik Türkçe karşılığı olan terimler çevrildi (ağırlık, kayıp, gradyan,
 * geri yayılım, çakışma, terslik, derlem). Karşılığı yapay kalan ya da anlam
 * kaymasına yol açan terimler İngilizce bırakıldı: token, tokenizer, BPE, hash,
 * epok. Aynı kavram uygulamanın her yerinde aynı sözcükle karşılanıyor.
 *
 * Sayı biçimlerine dikkat edildi: Türkçede yüzde işareti sayıdan önce gelir
 * (%50) ve sayıdan sonra gelen ad çoğul eki almaz ("5 token", "5 tokenlar"
 * değil). Uzun tire (em dash) hiç kullanılmadı; Türkçede doğal olan virgül,
 * nokta ve iki nokta üst üste tercih edildi.
 */
export const tr: Translation = {
  shell: {
    skipToContent: "İçeriğe geç",
    brand: "AI Club",
    brandSuffix: "Labs",
    primaryNav: "Ana gezinme",
    allLabs: "Tüm laboratuvarlar",
    breadcrumb: "Sayfa yolu",
    backToLabs: "← Tüm laboratuvarlar",
    footerTagline:
      "AI Club Labs: Bilgisayar bilimini oynayarak öğrenin.",
    byLine: "bir",
    parentOrg: "Hacettepe Yapay Zekâ Topluluğu",
    hashtag: "#AIForAll",
    footerRights: (year: number) => `© ${year} Hacettepe AI Club`,
    footerCredit: "Hacettepe Yapay Zeka Topluluğu projesidir",
    minutes: (n: number) => `${n} dk`,
    loadingLab: "Laboratuvar yükleniyor",
    openLab: "Laboratuvarı aç →",
  },

  preferences: {
    languageLabel: "Dil",
    english: "EN",
    englishFull: "English",
    turkish: "TR",
    turkishFull: "Türkçe",
    themeLabel: "Tema",
    light: "Açık",
    dark: "Koyu",
  },

  home: {
    kicker: "AI Club Labs",
    // İlk sürümdeki başlık geri alındı: hem bilgisayar bilimini hem yapay
    // zekâyı adıyla söylüyor ve yine bir eylemle başlıyor.
    title: "Bilgisayar biliminin ve yapay zekânın arkasındaki fikirlerle oynayın.",
    lede: "Dokuz etkileşimli deney — algoritmalar, yapay sinir ağları ve hesaplamanın işleyişi. Uzun anlatım yok, çevirip kaydıracağınız düğmeler var.",
    cta: "Denemeye başla",
    labs: "Laboratuvarlar",
    labCount: (n: number) => `${n} düzenek`,
    experiments: "Deneyler",
    emptyTitle: "İlk deneyler hazırlanıyor.",
    emptyBody: "Platform hazır — laboratuvarlar kendilerini kaydeder ve burada otomatik olarak görünür.",
  },

  notFound: {
    title: "Böyle bir laboratuvar henüz yok.",
    body: "Belki hâlâ bir tahtanın üzerinde duran bir fikirdir.",
    back: "Tüm laboratuvarlara dön",
  },

  category: {
    algorithms: "Algoritmalar",
    "data-structures": "Veri Yapıları",
    "machine-learning": "Makine Öğrenmesi",
    "neural-networks": "Yapay Sinir Ağları",
    systems: "Sistemler",
    theory: "Kuram",
  },

  difficulty: {
    intro: "giriş",
    intermediate: "orta",
    advanced: "ileri",
  },

  common: {
    run: "Çalıştır",
    pause: "Duraklat",
    step: "Adımla",
    reset: "Sıfırla",
    clear: "Temizle",
    startOver: "Baştan başla",
    tryAgain: "Yeniden deneyin",
    solved: (done: number, total: number) => `${total} görevden ${done} tanesi çözüldü`,
    recapTitle: "Bugün öğrendikleriniz",
    controlsLabel: "Deney kontrolleri",
    moreControls: "Ayarlar ve yardım",
    keyboardHint: "Grafik odaktayken",
  },

  labs: {
    // ------------------------------- embedding universe (3D prototype) ----
  "embedding-universe-3d": {
      title: "Gömme Evreni — 3B prototip",
      description:
        "Bir deney: aynı 318 kelime, iki yerine üç PCA eksenine indirgenmiş hâliyle.",
      lede: "Aynı kelimeler, aynı vektörler, bir eksen daha. Bulutu döndürmek için sürükle.",
      honesty:
        "Bu, gömmenin gerçek görüntüsü değildir. Uzayın 300 boyutu var; döndürdüğün şey, onun üç PCA eksenine indirgenmiş bir görünümü — düz haritadan bir eksen fazla, yine de neredeyse hiçbiri.",
      compare:
        "Bu bir prototip ve dersten bilerek ayrı tutuldu. Derinlik, bulutu bir mekân gibi hissettiriyor; ama projeksiyonu daha doğru yapmıyor. Bu takasın öğretmeye değip değmediğine karar vermek, prototipi yapmanın asıl sebebi.",
      error: "Kelime vektörleri yüklenemedi.",
      varianceLabel: "Açıklanan varyans",
      varianceHint: (dimensions: number) => `${dimensions} eksenin üçü`,
      selectedLabel: "Seçili",
      recapTitle: "Bu prototip ne gösteriyor",
      recap: {
        lessons: [
          "Üç eksen, uzayın ikiden biraz fazlasını taşıyor — yine de neredeyse hiçbirini.",
          "Derinlik bulutu bir mekân gibi hissettiriyor; bu, bilgilendirici olsun ya da olmasın ikna edici.",
          "Kelimeler, vektörler ve en yakın komşular düz haritayla birebir aynı; değişen yalnızca görüş.",
        ],
      },
      map: {
        mapLabel:
          "Üç boyutta kelime bulutu. Döndürmek için sürükle. Ok tuşları en yakın kelimeler arasında gezinir, Shift ve ok tuşları görüşü çevirir, Enter seçer.",
        hint: "Döndürmek için sürükle · Shift + ok tuşları",
        pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
        neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
          `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}`,
        selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Seçili`,
        pending: "Üç eksen hesaplanıyor…",
      },
    },

    // ------------------------------------------------ embedding universe ----
    "embedding-universe": {
      title: "Gömme Evreni",
      description:
        "Bir modelin APPLE'a en yakın gördüğü kelimeyi tahmin et, sonra bu kelime haritasının neyi sakladığını gör.",

      predict: {
        question: (word: string) => `${word} kelimesine en yakın hangisi?`,
        hint: "Üçü de ilgili — sen hangisini beklersin?",
        loading: "Kelime vektörleri yükleniyor…",
        chose: (word: string, rank: number, total: number, score: string) =>
          `${word} dedin — ${total} kelime içinde ${rank}. sırada, ${score} benzerlikle.`,
        nearest: (word: string, score: string) => `En yakını ${word}, ${score} benzerlikle.`,
        because:
          "Bu vektörler kelimelerin ne anlama geldiğinden değil, nasıl kullanıldığından öğrenildi. Haber ve ansiklopedi metinlerinde apple, meyvelerden çok software ile yan yana geçiyor.",
      },

      explore: {
        title: "Evreni keşfet",
        neighboursTitle: "En yakın kelimeler",
        announce: (word: string, gloss: string) => `${word} seçildi, ${gloss}.`,
      },

      map: {
        mapLabel: "Kelime haritası. Ok tuşları en yakın kelimeler arasında gezinir, Enter seçer.",
        pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
        neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
          `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}`,
        selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Seçili`,
        pending: "Kelimelerin nereye düştüğü hesaplanıyor…",
        linksNote:
          "Çizgiler, seçili kelimeyi yanında listelenen sekiz kelimeye bağlar. Bunlar okumayı kolaylaştırmak içindir, modelin parçası değildir — gömmede bağlantı yoktur, yalnızca mesafeler vardır.",
      },

      search: {
        label: "Kelime bul",
        placeholder: "türkçe ya da english…",
        noMatch: (query: string) => `Bu kümede “${query}” ile eşleşen kelime yok.`,
        resultsLabel: "Arama sonuçları",
        optionLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
      },

      neighbours: {
        title: (word: string) => `${word} kelimesine en yakınlar`,
        rankHeader: "Sıra",
        wordHeader: "Kelime",
        scoreHeader: "Benzerlik",
        rowLabel: (word: string, gloss: string, rank: number, score: string) =>
          `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}. Haritayı buraya taşımak için seç.`,
      },

      projection: {
        kicker: "Haritanın göstermedikleri",
        title: "Uzayın kendisine bakmıyorsun",
        lede: "Yukarıdaki kelimeler gerçek. Konumları ise 300 sayının 2'ye yassıltılmış hâli ve yassıltmak bir şeyleri kaybetmek zorunda. Tam olarak neyi kaybettiği burada.",
        modeLabel: "Bana göster",
        modeNone: "Kendi seçimim",
        modeHidden: "Yakın, uzağa çizilmiş",
        modeFalse: "Uzak, yakına çizilmiş",
        idle: "Yukarıdaki ikisinden birini seç ve o kelimelerin haritada nerede olduğuna bak.",
        // Türkçe sıra sayıları düzenli: sayının ardından nokta yeter.
        ordinal: (n: number) => `${n}.`,
        hiddenBody: (
          a: string,
          b: string,
          rank: string,
          total: number,
          score: string,
          percent: string,
        ) =>
          `${a} ile ${b}, ${total} çift içinde ${rank} en yakın çift, ${score} benzerlikle. Projeksiyon onları haritanın ${percent} kadarı uzağına koydu — resme bakarak ilişkili olduklarını asla tahmin edemezdin.`,
        falseBody: (
          a: string,
          b: string,
          screenRank: string,
          trueRank: string,
          total: number,
          score: string,
        ) =>
          `${a} ile ${b} ekranda ${screenRank} en yakın, neredeyse bitişik duruyor. Gerçek uzayda ise ${total} içinde ${trueRank} sıradalar, ${score} benzerlikle. Bu yakınlığı resim uydurdu.`,
        varianceLabel: "Açıklanan varyans",
        varianceHint: (first: string, second: string) => `PC1 ${first} + PC2 ${second}`,
        varianceBody: (percent: string, remaining: number) =>
          `Bu iki eksen, bu veri kümesindeki varyansın ${percent} kadarını açıklıyor. Geri kalan değişim hiçbir yere gitmedi — düz bir ekranda yeri olmayan diğer ${remaining} yönde duruyor.`,
        correlationLabel: "Mesafe uyumu",
        correlationHint: "−1.00 olsaydı harita hiçbir şey kaybetmemiş olurdu",
        pending: "Projeksiyon hesaplanıyor…",
      },

      data: {
        error: "Kelime vektörleri yüklenemedi.",
      },

      recap: {
        lessons: [
          "Gömme, bir öğeyi vektöre çevirir; böylece öğeler arasındaki ilişkiler mesafeye dönüşür.",
          "Bu ilişkiler kelimelerin anlamından değil, birlikte nasıl kullanıldıklarından gelir.",
          "300 boyutlu bir uzayın 2 boyutlu haritası bir gölgedir: gösterdiğinin bir kısmı orada yoktur, orada olanın bir kısmı da gösterilmez.",
        ],
      },

      honesty: {
        source:
          "Vektörler GloVe 6B 300d; Stanford NLP tarafından Wikipedia 2014 ve Gigaword 5 üzerinde önceden eğitildi. Bu lab her kelimeyi o yayımlanmış tablodan arayıp birim uzunluğa normalize ediyor; burada hiçbir şey eğitilmiyor, ince ayar yapılmıyor ya da üretilmiyor.",
        turkish:
          "Gömme uzayı İngilizcedir. Buradaki Türkçe kelimeler okumayı kolaylaştırmak için bizim eklediğimiz etiketlerdir — gömülmediler ve bu bir Türkçe gömme uzayı değildir.",
      },
    },

    // ------------------------------------------------ reward playground ----
    "reward-playground": {
      title: "Ödül Laboratuvarı",
      description:
        "Bir robot için bir karenin ne kadar değerli olduğuna siz karar verin ve tam olarak dediğinizi yapmasını izleyin.",

      room: {
        title: "Oda",
        question:
          "Bu robota çıkış yolunu kimse göstermedi. Yolu deneyerek buldu — neyi önemseyeceğine ise siz karar veriyorsunuz.",
        sliderLabel: "İşaretli kare robot için ne kadar değerli?",
        sliderValue: (value: string) => `İşaretli karenin değeri ${value}`,
        hint: "Sürükleyin. Her oynattığınızda yol sıfırdan yeniden öğreniliyor.",
        wow: "Ona durmasını söylemediniz. O karenin kapıdan daha değerli olduğunu söylediniz.",
        behaviour: {
          avoided: "Kareye basmamak için uzun yoldan dolandı ve kapıya ulaştı.",
          passed: "Yolu üzerinde kareye basarak geçti ve kapıya ulaştı.",
          stayed: "Kapıya hiç gitmedi. Sadece karenin yanında oyalanıyor.",
        },
        readout: (steps: number, visits: number) =>
          `${steps} hamle · kareye ${visits} kez bastı`,
        mapLabel: (behaviour: string, steps: number, visits: number, at: number) =>
          `Yukarıdan görünen küçük bir oda. ${behaviour} Toplam ${steps} hamle, işaretli kareye ${visits} kez basıldı. Robot ${at}. hamlede.`,
      },

      learn: {
        kicker: "Bunu nasıl çözdü?",
        title: "Yapabileceği her hamle için bir sayı tuttu.",
        lede: "Buradaki hiçbir şey robotun öğrenmiş olabileceğinin bir resmi değil — kaydırıcıyı getirdiğiniz anda gerçekten öğrenmiş olduğu şey. Yukarıdaki kaydırıcıyı oynatın; bu sayfadaki her sayı yeni bir çalıştırmadan baştan hesaplanır.",

        scrubber: "Ne kadar deneme yaptığı",
        episode: (n: number) => `${n}. deneme`,
        scrubberValue: (episode: number, total: number) =>
          `${total} denemenin ${episode}. denemesinden sonra`,
        episodeLabel: "Yapılan deneme",

        mapLabel: (episode: number) =>
          `${episode} denemeden sonraki oda. Her kare, robotun orayı ne kadar iyi bulduğunu ve oradan hangi yöne gideceğini gösterir.`,
        cellLabel: (row: number, col: number, value: string, action: string) =>
          `Satır ${row}, sütun ${col}. Değeri ${value}. Buradan ${action} giderdi.`,
        wallCell: (row: number, col: number) => `Satır ${row}, sütun ${col}. Duvar.`,

        actions: { 0: "yukarı", 1: "aşağı", 2: "sola", 3: "sağa" },
        noAction: "hiçbir yere — burası kapı",
        bestAction: "en iyi",
        selectedTitle: (row: number, col: number) => `Satır ${row}, sütun ${col}`,
        chain: (row: number, col: number, action: string, value: string) =>
          `Satır ${row}, sütun ${col} üzerindeyken robotun yapabileceği dört hamle ve her biri için bir sayı var. En büyüğünü seçiyor — ${action} giderek elde ettiği ${value} — çünkü o hamle en son denediğinde onu daha iyi bir yere götürmüştü. Bunu birkaç yüz kez tekrarlayın, sayılar değişmeyi bırakır.`,

        unexploredLabel: "Uğramadığı kare",
        unexploredHint: "oraya gitmeyi bıraktı",

        propagation:
          "Kaydırıcıyı en başa çekin. İlk on-on beş denemede hiçbir şeyin değeri yok: robot dolanıyor ve attığı her adım ona biraz pahalıya geliyor. Sonra kapıya tesadüfen giriyor, kapının yanındaki bir kare pozitife dönüyor ve sonraki birkaç denemede bu iyi haber odaya doğru, kare kare yayılıyor. Öğrenmenin tamamı bu yayılma.",

        formulaTitle: "Her hamleden sonra uyguladığı kural",
        formulaNote:
          "Şöyle okuyun: az önce yaptığınız hamlenin sayısını, gerçekte elde ettiğiniz ödüle ve vardığınız yerden artık mümkün gördüğünüz en iyi değere doğru biraz kaydırın. α bu kaydırmanın büyüklüğü, γ ise ileride gelecek bir ödülün şimdikine kıyasla ne kadar değerli sayıldığı.",

        honesty:
          "Robot odanın tamamını öğrenmedi. İşine yarayan bir yol öğrendi ve geri kalanını keşfetmeyi bıraktı; bu yüzden bazı kareler hâlâ en baştaki tahminini taşıyor. Bu yöntemin bir kusuru değil — yalnızca kendi deneyiminden öğrenmek tam olarak böyle görünür.",

        scheduleWarning:
          "Kaydedilen denemeler eşit aralıklı, bu da öğrenmenin gerçekleştiği kısmı gizliyor.",
      },

      recap: {
        lessons: [
          "Ödül bir talimat değildir. Bir puandır ve robot en yüksek puanı veren davranışı bulur — aklınızdan hiç geçmemiş olanı bile.",
          "Deneyerek öğrenir: her hamle bir sayıyı günceller ve işe yarayan sayılar, ilk kez iyi giden şeyden dışa doğru yayılır.",
          "Aklınızdaki sonucu değil, gerçekten yazdığınız ödülü optimize eder.",
        ],
        footer:
          "Bu, küçük ve deterministic bir grid üzerinde gerçek tabular Q-learning'dir: yirmi yedi kare, dört hamle, her ikili için bir sayı. Gerçek robotlar ve büyük pekiştirmeli öğrenme sistemleri bundan çok daha karmaşıktır — ama verdiğiniz ödülle istediğiniz sonuç arasındaki açık, sistemler büyüdükçe kapanmıyor.",
      },
    },

    // ------------------------------------------------------- attention ----
    attention: {
      title: "Attention Laboratuvarı",
      description: "Bir kelime seçin ve modelin cümlenin hangi kısmına yaslandığını izleyin.",

      hero: {
        title: "Bu kelime nereye bakıyor?",
        question: "Her kelime diğerlerine bakıyor. Birini seçin ve nereye baktığını görün.",
      },

      sentenceLabel: "Cümle. Nereye baktığını görmek için bir kelime seçin.",
      sentenceHint:
        "Kelimeler arasında gezinmek için sol ve sağ ok tuşlarını, iki uca atlamak için Home ve End tuşlarını kullanın.",
      tokenLabel: (word: string, share: number, position: number, total: number) =>
        `${word}, yüzde ${share}, ${total} kelimeden ${position}.`,
      percent: (share: number) => `%${share}`,
      pair: (word: string, share: number) => `${word} yüzde ${share}`,
      announce: (word: string, targets: string) => `${word} en çok şuraya bakıyor: ${targets}.`,
      mostlyLookingAt: (word: string) => `“${word}” en çok şuraya bakıyor`,
      nearTie:
        "Bu ikisi neredeyse başa baş. Bu küçük modelin dil bilgisi yok; seçtiğiniz kelimenin hangisiyle ilişkili olduğunu ayırt edemiyor.",

      swapLabel: "Bir kelimeyi değiştirin",
      swapHint:
        "Beşinci kelimeyi değiştirin ve seçili kelimeye ne olduğuna bakın — ona hiç dokunmadığınız hâlde.",
      dogNote:
        "Artık iki canlı var ve model dikkatini ikisi arasında neredeyse eşit paylaştırdı. Dağılım değişti ama hangisinin yorgun olduğunu hâlâ ayırt edemiyor.",

      reveal: {
        kicker: "Nasıl karar verdi?",
        title: "Tek bir sayı, baştan sona.",
        lede: "Bu bölüm yukarıda seçili olan kelimeyi izler. Seçimi ya da değiştirilen kelimeyi değiştirin; buradaki her adım onunla birlikte değişir — çünkü bu, aynı hesabın kendisidir, ikinci bir kopyası değil.",
      },

      trace: {
        step1: "Seçtiğiniz kelime",
        step1Title: (word: string) => `“${word}” ile başlayın`,
        step1Note:
          "Aşağıdaki her şey, bu tek kelimenin diğerlerinin her biriyle sırayla karşılaştırılmasıdır.",

        step2: "Ne aradığı",
        step2Title: (word: string) => `“${word}” bunu istiyor — query'si`,
        step2Note:
          "Sağa uzanan bir çubuk kelimenin istediği bir özelliktir; sola uzanan ise özellikle aramadığı bir özelliktir. Bunlar modelin ne istediğine dair kendi ifadeleridir, okunabilir hâle getirilmiştir — gerçek bir modelinkiler hiç okunabilir değildir.",

        step3: "Diğer kelimenin sunduğu",
        step3Title: (word: string) => `“${word}” bunu sunuyor — key'i`,
        step3Note:
          "Query ve key bilerek iki farklı projeksiyondan gelir: bir kelimenin sunduğu şey, istediği şeyle aynı değildir. Attention'ın benzerlik ölçmekten fazlası olmasının nedeni budur.",

        step4: "Eşleşme",
        step4Title: (score: string) => `Örtüşme değeri ${score}`,
        step4Note: (from: string, to: string) =>
          `“${from}” kelimesinin istediğiyle “${to}” kelimesinin sunduğunu çarpın, toplayın ve eksen sayısının kareköküne bölün. Bu son adım, model genişledikçe sayıları çalışılabilir bir aralıkta tutar.`,

        step5: "%100'ün payı",
        step5Title: (share: number) => `Bu da dikkatin %${share} kadarı oluyor`,
        step5Note:
          "Paylar her zaman %100'e tamamlanır; yani bunlar puan değil, pay. Yeni bir rakip eklendiğinde izlediğiniz pay da dahil olmak üzere diğer bütün payların küçülmesinin nedeni tam olarak budur.",
        tableCaption: "En güçlü birkaç kelime için eşleşme ve dikkat payı.",
        colToken: "Kelime",
        colScore: "Eşleşme",
        colShare: "Pay",

        step6: "Neye dönüştüğü",
        step6Title: (word: string) => `“${word}” artık bir karışım taşıyor`,
        step6Note:
          "Attention yalnızca nereye bakılacağıyla ilgili değildir. Baktığı her kelime, payı oranında kendi value'sunu katar; böylece kelime, baktığı şeylerin bir karışımını taşımaya başlar. Gerçek bir modelde bir sonraki katmana ulaşan şey bu karışımdır.",

        axes: {
          nounness: "ad gibi",
          animacy: "canlı",
          verbness: "eylem gibi",
        },
      },

      honesty:
        "Bu, küçük ve eğitim amaçlı bir self-attention modelidir. Yedi özelliği ve üç projeksiyon matrisi bu deney için elle yazıldı; metinden öğrenilmedi. Gerçek bir model, kimsenin adlandırmadığı temsilleri yüzlerce boyutta öğrenir. Burada gerçek olan aritmetiktir: bir Transformer'ın yaptığı karşılaştırmanın, ölçeklemenin, softmax'in ve ağırlıklı toplamın aynısı.",

      recap: {
        lessons: [
          "Attention, bağlam üzerine sabit bir %100'lük odağı dağıtır; yani her kelime evet ya da hayır değil, bir pay alır.",
          "Bir kelimeyi değiştirmek diğerlerinin paylarını da değiştirir — dokunmadığınız kelimeler dahil, çünkü hepsi aynı %100'ü paylaşıyor.",
          "Attention, çok daha büyük bir modelin içindeki tek bir mekanizmadır. Nereye bakılacağına ve neyin karıştırılacağına karar verir; tek başına cümleyi anlamaz.",
        ],
        footer:
          "Buradaki kelimelere elle yazılmış yedi özellik verildi; bu yüzden model bir kediyi bir toptan ayırabiliyor ama bir topu bir aynadan ayıramıyor. Gerçek Transformer'lar çok daha zengin temsiller kurmak için çok sayıda head ve katmanı üst üste yığar — bu, bu sayfanın anlattığından farklı ve çok daha uzun bir hikâye.",
      },
      pickLabel: "Kelime",
      wholeRowLabel: "Bütün paylar, cümle sırasıyla",
      mixLabel: "Her birinin kattığı",

      figures: {
        selected: "Seçili",
        biggestShare: "En büyük pay",
        sharesTotal: "Payların toplamı",
        matchedWith: "Yaslandığı",
        rawMatch: "Eşleşme",
        score: "Bölme sonrası",
        axes: "Eksen",
        divisor: "Bölen",
        peakWith: "En büyük pay",
        peakWithout: "Bölme olmasaydı",
        aboveTen: "Onda birin üstündeki kelime",
      },

      scale: {
        kicker: "Bölme neden var?",
        title: "Böleni kaldırın, paylar çöküyor.",
        lede: "Eksen sayısının kareköküne bölmek, etkisini sonuca bakarak göremeyeceğiniz tek adımdır — alternatifiyle karşılaştırana kadar sonuç her iki hâlde de makul görünür. Bu yüzden aynı satır burada iki kez var: bir kez bu modelin hesapladığı gibi, bir kez de bölme atlanarak.",
        collapse:
          "Bölme atlanınca puanlar daha büyük kalıyor ve daha büyük sayılar üzerindeki softmax daha keskin oluyor: bütçenin neredeyse tamamı tek bir kelimeye gidiyor, geri kalanı yuvarlanıp yok oluyor. Okunacak bir dağılımı ortada bırakan şey, bu bölme.",
        note: "Her iki sütun da burada, aynı puanlar üzerinde aynı softmax ile hesaplanıyor. Sayfanın başka hiçbir yerinde bölünmemiş olan kullanılmıyor.",
        tableCaption:
          "En güçlü birkaç kelime için: eşleşme, bölme sonrası eşleşme ve her iki durumda payına düşen oran.",
        colRaw: "Eşleşme",
        colScaled: "Bölünmüş",
        colWithout: "Bölmesiz pay",
        colWith: "Bölmeli pay",
      },

      softmax: {
        kicker: "Eşleşmelerden paylara",
        title: "On puan, tek bir bütçe.",
        lede: "Softmax, eşleşme satırını toplamı %100 olan bir pay satırına çevirir. Hiçbir şey atılmaz ve hiçbir şey seçilmez: her kelime bir pay alır ve paylar ancak birbirinden çıkabilir.",
      },

      mix: {
        kicker: "Payların harcandığı yer",
        title: "Paylar bir hüküm değil, birer katsayı.",
        lede: "Bakılan her kelime, payı oranında kendi value vektörünü verir. Bunları toplayınca seçili kelimenin dönüştüğü şey ortaya çıkar — gerçek bir modelde bir sonraki katmana ulaşan da budur.",
        tableCaption: "En çok katkı veren üç kelime için pay ve value vektörü.",
        outputLabel: "Karışmış çıktı, eksen eksen",
      },
    },

    // ------------------------------------------------ gradient descent ----
    "gradient-descent": {
      title: "Gradient Descent",
      description:
        "Bir yüzeyin biçiminin, atmanıza izin verilen adımın boyutunu nasıl belirlediğini görün.",

      controls: {
        run: "Çalıştır",
        pause: "Duraklat",
        reset: "Sıfırla",
        stepOnce: "Tek adım",
        scrubber: "Adım",
        scrubberValue: (index: number, total: number) => `${total} adımdan ${index}. adım`,
        stepSize: "Adım boyu",
        learningRate: "Adım boyu η",
        learningRateValue: (value: string) => `Adım boyu ${value}`,
        beta: "Momentum β",
        betaValue: (value: string) => `Momentum beta ${value}`,
        curvature: "Eğrilik oranı",
        curvatureValue: (value: string) => `Koşul sayısı ${value}`,
        optimizer: "Optimizer",
        resetPoint: "Noktayı geri al",
        aboutThisSurface: "Bu yüzey hakkında",
        stepSizeAndScale: "Adım boyu",
      },

      optimizers: {
        gd: "Gradient Descent",
        momentum: "Momentum",
        adam: "Adam",
      },

      status: {
        running: "Çalışıyor",
        converged: "Hedefe ulaştı",
        diverged: "Iraksadı",
        exhausted: "Adımlar tükendi",
      },

      figures: {
        step: "Adım",
        objective: "Amaç değeri",
        objectiveHint: "f fonksiyonunun buradaki değeri",
        gradientNorm: "Gradient büyüklüğü",
        position: "Konum",
        status: "Sonuç",
        conditionNumber: "Koşul sayısı",
        conditionNumberHint: "κ = dik eğrilik ÷ düz eğrilik",
        stepsTaken: (n: number) => `${n} adım`,
        stepsToTolerance: "Hedefe kadar adım",
      },

      map: {
        label: (
          x: string,
          y: string,
          step: number,
          objective: string,
          gradient: string,
          status: string,
        ) =>
          `Amaç fonksiyonunun eşyükselti haritası. Adım ${step}. Konum ${x}, ${y}. Amaç değeri ${objective}. Gradient büyüklüğü ${gradient}. ${status}.`,
      },

      chart: {
        label: (objective: string, step: number) =>
          `Amaç değerinin adım sayısına göre logaritmik grafiği. ${step}. adımda amaç değeri ${objective}.`,
      },

      announce: {
        ready: "Başlangıç noktasına dönüldü.",
        finished: (steps: number, status: string) => `${steps} adım sonra bitti. ${status}.`,
      },

      find: {
        title: "Dibi bulun",
        question: "Ne kadar büyük bir adım atabilirsiniz?",
        caption:
          "Başlangıç noktası her seferinde aynı ve değiştirebileceğiniz tek bir şey var. Sayılardan çok yolun biçimine bakın.",
      },

      direction: {
        kicker: "Neden o yön",
        title: "Gradient bir vektördür ve cevabı gösteren bir işaret değildir.",
        lede: "Mevcut noktadan iki ok çıkıyor: düz olan, adımın gerçekte gittiği yön, −∇f = −(a·x, b·y); kesikli olan ise minimuma giden doğru, −(x, y). Her koordinat kendi eğriliğiyle ölçekleniyor; bu yüzden iki yön ancak eğrilikler eşitken çakışır. Önce noktayı, sonra eğriliği sürükleyin.",
        descent: "Adımın gittiği yön: −∇f",
        target: "Minimuma giden doğru",
        equalLength: "İki ok da aynı uzunlukta çiziliyor; karşılaştırılan tek şey yönleri.",
        angle: "Aralarındaki açı",
        angleHint: "0° iki yönün çakıştığı durumdur",
        aligned: "Burada eğrilikler eşit, dolayısıyla iki yön tam olarak çakışıyor.",
        apart: "Eğrilikler farklı; adım minimuma değil dik eksene doğru çekiliyor.",
        onAxis: "Koordinatlardan biri zaten sıfır, yani eşit olmayan ölçeklemenin etki edeceği bir şey yok. Okları ayırmak için noktayı eksenden çıkarın.",
        dragHint: "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükleyin ya da haritaya odaklanıp",
        keyboardHint: "tuşlarını kullanın; başa döndürmek için:",
        keyboardHelp:
          "Noktayı taşımak için harita üzerinde herhangi bir yeri sürükleyin. Harita odaktayken ok tuşları noktayı taşır, Home tuşu ise başlangıç konumuna geri gönderir.",
        legendAndKeys: "Oklar ve klavye",
        label: (x: string, y: string, kappa: string, angle: string) =>
          `Taşınabilir noktası olan eşyükselti haritası. Nokta ${x}, ${y} konumunda. Koşul sayısı ${kappa}. İniş yönü, minimuma giden doğrudan ${angle} derece sapmış durumda.`,
        caption:
          "Eğrilik oranını 1'e indirin; iki ok tek bir oka dönüşür. Eksenlerin dışında bu, ikisinin çakıştığı tek durumdur — ve tek boyutlu bir resmin hiçbir şekilde gösteremeyeceği bir durumdur, çünkü tek eksende gradient yalnızca bir işarettir.",
      },

      rate: {
        kicker: "Adım boyu",
        title: "Tavanı belirleyen, algoritma değil yüzeydir.",
        lede: "Aynı yüzey, aynı başlangıç noktası, değişen tek bir sayı. Haritanın altındaki iki işaret bu yüzeyin eğriliğinden hesaplanıyor; gösterim işe yarasın diye seçilmiş değiller.",
        marks: { monotone: "aşma yok", stability: "kararlılık sınırı" },
        regimes: {
          monotone: "Doğrudan yaklaşıyor",
          oscillating: "Aşıyor ama yine de yaklaşıyor",
          boundary: "Tam sınırda",
          divergent: "Iraksıyor",
        },
        regimeNote: {
          monotone: "η her iki eğrilik için de 1/c altında: hiçbir koordinat minimumu aşmıyor.",
          oscillating: "η dik eksende 1/c değerini aşmış: her adımda işaret değiştiriyor ama küçülüyor.",
          boundary: "η dik eksende tam olarak 2/c: o koordinat ne küçülüyor ne büyüyor.",
          divergent: "η dik eksende 2/c değerini aşmış: o koordinat her adımda büyüyor.",
        },
        scope:
          "Bu eşikler burada kullanılan ikinci dereceden fonksiyon için tam geçerlidir; onun eğriliği her noktada aynıdır. Eğriliğin konuma göre değiştiği yerde kullanılabilir adım boyu da onunla değişir.",
        caption:
          "Kararlılık sınırı, 2 bölü büyük eğriliktir; yüzey değişince o da değişir. Hiçbir adım boyu tek başına büyük ya da küçük değildir: bu yüzeyi tamamen terk eden η, daha yumuşak bir yüzeye sakince yerleşir.",
      },

      momentumSection: {
        kicker: "Momentum",
        title: "Bir önceki adımdan bir şeyler taşımak.",
        lede: "Momentum bir hız değeri tutar: v ← β·v + ∇f, ardından θ ← θ − η·v. Aynı yöne bakmayı sürdüren itmeler birikir; sürekli yön değiştirenler birbirini götürür. β'yı yükseltin ve ikinci işaretin hareketine bakın.",
        marks: { plain: "düz sınır", momentum: "momentum sınırı" },
        caption:
          "Kararlılık koşulu η·max(a,b) < 2(1+β) olur; bu, düz inişin η·max(a,b) < 2 koşulundan daha geniştir. Yani momentum, düz inişin taşıyamayacağı kadar büyük bir adım boyunu taşıyabilir. Bu aralığın bedeli salınımdır. Adım boyunu sabit tutup β'yı yükseltin: çalışma önce kısalır, belli bir noktadan sonra yeniden uzar.",
        announce: (
          plainSteps: number,
          plainStatus: string,
          momentumSteps: number,
          momentumStatus: string,
        ) =>
          `Gradient descent: ${plainSteps} adım, ${plainStatus}. Momentum: ${momentumSteps} adım, ${momentumStatus}.`,
      },

      adam: {
        kicker: "Adam",
        title: "Her parametre için ayrı bir adım boyu.",
        lede: "Adam, her koordinatın adımını o koordinatın kendi gradient büyüklüğüne dair yürüyen bir tahmine böler. m ortalama gradient, s ise ortalama karesel gradienttir; ikisi de sıfırdan başlamanın yarattığı sapmaya karşı düzeltilir ve güncelleme η·m̂ ÷ (√ŝ + ε) olur.",
        firstStepTitle: "İki eğriliğin bir milyon kat ayrıldığı yerde ilk adım",
        firstStepLede: (a: string, b: string) =>
          `Bir eksende eğrilik ${a}, diğerinde ${b}. Gradient'in iki bileşeni arasında yaklaşık bir milyon kat fark var. Aşağıdaki her sayı, engine tek adım çalıştırılarak ölçülüyor.`,
        tableCaption:
          "Her eksende gradient büyüklüğü ve ilk adımın boyutu; gradient descent ve Adam için.",
        colQuantity: "Büyüklük",
        colX: "Dik eksen",
        colY: "Düz eksen",
        rowGradient: "Gradient büyüklüğü",
        rowGd: (rate: string) => `Gradient descent adımı, η = ${rate}`,
        rowAdam: (rate: string) => `Adam adımı, η = ${rate}`,
        firstStepNote:
          "Sapma düzeltmesinden sonra ilk güncelleme η·g ÷ (|g| + ε) hâline gelir. Gradient'in büyüklüğü sadeleşir ve iki eksen de yaklaşık η kadar hareket eder — düzeltmenin atlanmayıp gerçekten uygulanmasının nedeni budur.",
        rate: "Adam adım boyu η",
        honesty:
          "Bunların hiçbiri Adam daha hızlı yakınsar demek değildir. Yukarıdaki κ = 60 vadisinde 300 adım boyu taranarak ölçüldüğünde Adam'ın en iyi sonucu 17 adımdır; iyi seçilmiş bir momentum ayarı ise aynı toleransa yaklaşık 10 adımda ulaşır. 0,10 gibi ölçülü bir adım boyunda Adam'ın ihtiyacı 66 adımdır. Seçilecek bir adım boyu hâlâ vardır ve onu kötü seçmenin bedeli hâlâ ödenir.",
      },

      challenge: {
        kicker: "Üç soru",
        title: "Bütçe adım cinsinden sayılır.",
        lede: "Her biri bir yüzeyi, bir başlangıç noktasını ve bir adım sayısını sabitliyor. Yavaşça varmak geçmek sayılmaz ve üçünün cevabı aynı değil.",
        puzzle: "Soru",
        budget: (n: number) => `${n} adım`,
        goal: (budget: number, tolerance: string) =>
          `Hedef: ${budget} adım içinde amaç değeri ≤ ${tolerance}.`,
        progress: (done: number, total: number) => `${total} görevden ${done} tanesi çözüldü`,
        pressRun:
          "Bu denemenin sonucunu görmek için Çalıştır'a basın ya da adım kaydırıcısını sona sürükleyin.",
        pass: "Çözüldü.",
        notYet: "Henüz değil.",
        optimizerAndSettings: "Optimizer ve ayarlar",
        boundaryHint: (limit: string, kappa: string) =>
          `Bu ayarlar için kararlılık sınırı: ${limit}. Koşul sayısı κ = ${kappa}.`,
        verdicts: {
          solved: (steps: number, budget: number) =>
            `${budget} adımlık bütçenin içinde, ${steps} adımda hedefe ulaşıldı.`,
          overBudget: (steps: number, budget: number) =>
            `Hedefe varıyor ama ${steps} adımda; bütçe ise ${budget}.`,
          stalled: (budget: number) =>
            `Bu, hedefe hiç ulaşmıyor. Bütçe ${budget} adım.`,
          diverged:
            "Çalışma yüzeyi terk etti: bu ayarlarda adım boyu buradaki kararlılık sınırında ya da üzerinde.",
        },
        transfer: {
          title: "Aynı sayı, daha yumuşak bir yüzeyde",
          divergesHereConvergesThere: (
            rate: string,
            limitHere: string,
            limitThere: string,
            steps: number,
          ) =>
            `η = ${rate}, bu yüzeyin ${limitHere} olan kararlılık sınırının üzerinde; bu yüzden çalışma patlıyor. Daha yumuşak yüzeyin sınırı ${limitThere} ve tam olarak aynı η orada ${steps} adımda yerleşiyor. Değişen adım boyu değil, yüzeydi.`,
          worksOnBoth: (steps: number) =>
            `Bu η iki yüzeyde de yakınsıyor — burada ve daha yumuşak olanda ${steps} adımda. Yukarı doğru itin ve hangisinin önce pes ettiğine bakın.`,
          worksOnNeither:
            "Bu η, izin verilen adım sayısı içinde hiçbir yüzeyde hedefe ulaşmıyor. Sorun büyük olması değil, küçük olması.",
          mapLabel: (rate: string, status: string, steps: number) =>
            `Daha yumuşak yüzeyin ${rate} adım boyuyla çalıştırılmış eşyükselti haritası. ${steps} adım sonra ${status}.`,
        },
        items: {
          c1: {
            title: "Tam nokta",
            brief:
              "Tek bir yüzey, düz gradient descent ve dar bir bütçe. Oraya çabucak ulaştıran bir adım boyu var; ulaştırmayan pek çok adım boyu da var.",
          },
          c2: {
            title: "Fazla büyük",
            brief:
              "Bu, kararlılık sınırının üzerinde başlıyor ve ilk Çalıştır'da patlıyor. İşe yarayan bir adım boyu bulun — sonra aynı sayının daha yumuşak bir yüzeyde ne yaptığına bakın.",
          },
          c3: {
            title: "Dar vadi",
            brief:
              "κ = 60 olan bir vadi. Hiçbir adım boyu, düz gradient descent'in bu bütçe içinde bitirmesini sağlamıyor; diğer iki optimizer'ın var olma nedeni de bu.",
          },
        },
      },

      recap: {
        lessons: [
          "Negatif gradient yokuş aşağıyı gösterir, minimumu değil. Eksenlerin dışında ikisi ancak eğrilik her yönde aynıyken çakışır.",
          "Bir yüzeyin kaldırabileceği en büyük adım boyu, 2 bölü onun en dik eğriliğidir — algoritmanın değil, yüzeyin bir özelliği. Bunun yarısının altında yaklaşım doğrudandır, ikisinin arasında yol aşar ama yine de yaklaşır, üstünde ise çalışma yüzeyi terk eder.",
          "Koşul sayısı κ, dik eğriliğin düz eğriliğe bölümüdür ve tek bir adım boyunun iki yöne birden hizmet etmesini engelleyen şey odur: düz eksen hâlâ emeklerken dik eksen çoktan tavanındadır.",
          "Momentum kararlı aralığı η·max(a,b) < 2(1+β) değerine genişletir ve uzun bir zikzağı kısaltabilir; Adam her koordinatı kendi gradient geçmişiyle ölçekler, böylece gradient büyüklüğündeki bir milyon katlık fark adım boyunda bir milyon kat olmaz. Yine de ikisinde de seçilecek bir adım boyu kalır.",
        ],
        footer:
          "Buradaki her şey konveks ve ikinci dereceden: eğrilik her noktada aynı, gradient tam, cevap daha başlamadan biliniyor. Gerçek eğitim bu üçünü de bırakır. Geriye kalan, ileri geri oynadığınız ilişkidir — yüzeyin biçimi, atmanıza izin verilen adımın boyutunu belirler.",
      },
    },

    // ---------------------------------------------------------- hash ----
    "hash-playground": {
      title: "Hash Laboratuvarı",
      description: "Tek bir karakteri değiştirin. Her şeyin değiştiğini görün.",
      inputLabel: "Mesajınız",
      inputPlaceholder: "merhaba dünya",
      copy: "Kopyala",
      copied: "Kopyalandı",
      copyHash: "Özeti kopyala",
      hashCopied: "Özet kopyalandı",

      figures: {
        messageLength: "Mesaj",
        characters: "karakter girdi",
        digestLength: "Özet",
        hexChars: "hex karakter çıktı",
        digestBits: "Bit",
        alwaysBits: "mesaj ne kadar uzun olursa olsun",
        bitsChanged: "Değişen bit",
        percentChanged: "Özetin",
        expectedHalf: "yaklaşık yarısı beklenir",
        charsChanged: "Değişen hex karakter",
        ofSixtyFour: "64 karakterden",
      },

      hero: {
        title: "Ne çıkıyor",
        question: "İki farklı mesaj aynı uzunlukta çıktı üretebilir mi?",
        digestLabel: "SHA-256 özeti",
        caption:
          "Ne isterseniz yazın. Mesaj ne kadar uzun olursa olsun tam 64 hex karakter geri döner — ve mesajın kendisi bunların içinde yoktur.",
        help: "Bir mesaj yazın. SHA-256 özeti alanın altında görünür ve siz yazdıkça güncellenir.",
        announce: (start: string) => `Özet güncellendi, artık ${start} ile başlıyor.`,
      },

      determinism: {
        kicker: "Aynı mesaj, aynı özet",
        title: "Her seferinde aynı yanıtı veriyor.",
        lede: "Mesajı yeniden hash'leyin. Hiçbir şey önbelleğe alınmıyor ve önceki çalıştırmadan kopyalanmıyor — her basış, aynı metin üzerinde yeni bir SHA-256 çağrısı.",
        hashAgain: "Yeniden hash'le",
        enough: "Bu kadar çalıştırma yeter",
        empty: "Henüz çalıştırma yok. Bu mesajı hash'lemek için düğmeye basın.",
        run: (n: number) => `${n}. çalıştırma`,
        runsLabel: "Çalıştırma",
        distinctLabel: "Farklı özet",
        distinctHint: "kaç kez çalıştırılırsa çalıştırılsın",
        caption:
          "Mesajı değiştirmek listeyi temizler, çünkü eski mesajın çalıştırması yenisi hakkında bir şey söylemez.",
        announce: (runs: number, distinct: number) =>
          `${runs} çalıştırma, ${distinct} farklı özet.`,
      },

      avalanche: {
        kicker: "Tek küçük değişiklik",
        title: "Tek bir tuş her şeyi yeniden yazıyor.",
        lede: "Tek bir karakteri değiştirin ve iki özeti karşılaştırın. Farklı olan her karakter ikisinde de işaretlenir — gidende üstü çizili, yerine gelende altı çizili.",
        before: "Önce",
        after: "Sonra",
        fieldLabel: "Bir karakteri değiştirin",
        help: "Mesajı düzenleyin. Düzenlemeden önceki ve sonraki özetler yukarıda karakter karakter karşılaştırılır.",
        editPrompt: "İki özeti karşılaştırmak için mesajdaki bir karakteri değiştirin.",
        caption:
          "Sayım, iki gerçek özet üzerinde bit bit ölçülüyor — tahmin edilmiyor ve bir sayıya doğru canlandırılmıyor.",
        announce: (changed: number, total: number, percent: number) =>
          `${total} bitten ${changed} tanesi değişti, özetin yüzde ${percent}'i.`,
      },

      bits: {
        gridLabel: (total: number, ones: number, zeros: number, flipped: number) =>
          `Mevcut özetin ${total} biti, 16'ya 16 ızgara olarak. ${ones} tanesi 1, ${zeros} tanesi 0. Son düzenlemede ${flipped} tanesi değişti.`,
        legendOne: "bit 1",
        legendZero: "bit 0",
        legendChanged: "değişti",
      },

      challenge: {
        kicker: "Meydan okuma",
        title: "İki farklı mesajın aynı özeti üretmesini sağlayabilir misiniz?",
        lede: "Özetin tamamı değil — ilk karakterinden başlayın. Her tur bir karakter daha istiyor ve her tur bir öncekinden on altı kat daha düşük olasılıklı. Bu eğri, hash güvenliğinin tamamı; ve bunu dürüstçe hissetmenin tek yolu bu: burada bir çakışma bulunmuyor, uydurulmuyor da.",
        inputA: "Mesaj A",
        inputB: "Mesaj B",
        identical:
          "İki mesaj da aynı, dolayısıyla özetler tanım gereği eşleşiyor. Çakışma için iki farklı mesaj gerekir.",
        target: (round: number, odds: string) =>
          `${round}. tur: ilk ${round} hex karakteri paylaşsınlar. Deneme başına olasılık: ${odds}'de 1.`,
        nextRound: (round: number) => `${round}. tur — on altı kat zor`,
        keepTrying: "Denemeye devam",
        maxRound: "İnsanların durduğu yer burası",
        matchedLabel: "Ortak ön ek",
        roundLabelFull: "Tur",
        oddsHint: (odds: string) => `deneme başına ${odds}'de 1`,
        bestLabel: "En iyi",
        attemptsLabel: "Deneme",
        ladderLabel: (matched: number, total: number, round: number) =>
          `Ortak ön ek: ${total} hex karakterden ${matched} tanesi eşleşiyor. Bu tur ${round} tane istiyor.`,
        caption:
          "64 karakterin tamamının rastlantıyla eşleşmesi 2^256'da 1. Doğum günü kısayolu bile yaklaşık 2^128 hash gerektirir — saniyede bir trilyon hash'lense, kabaca 10^19 yıl.",
        announce: (matched: number, total: number, best: number, round: number) =>
          `${total} baştaki karakterden ${matched} tanesi eşleşiyor. En iyi ${best}. ${round}. tur ${round} tane istiyor.`,
      },

      usage: {
        kicker: "Gerçek hayatta",
        title: "Özetlerin karşınıza çıktığı yerler.",
        lede: "Aynı sabit boyutlu parmak izi, beş farklı biçimde kullanılıyor.",
        items: {
          git: {
            label: "Git",
            body: "Git her commit'i, içeriğini ve ebeveyninin hash'ini hash'leyerek tanımlar. Geçmişteki bir satırı değiştirin, sonraki bütün hash'ler değişir — kurcalama görünür olur.",
          },
          passwords: {
            label: "Parolalar",
            body: "Sunucular parolanın kendisini değil, tuzlanmış hash'ini saklar. Girişte parola yeniden hash'lenip karşılaştırılır; böylece sızan bir veritabanı parolaları değil hash'leri barındırır.",
          },
          https: {
            label: "HTTPS",
            body: "TLS, sertifikaları parmak izlemek ve verinin yolda değiştirilmediğini doğrulamak için hash kullanır. Tek bir bitin değişmesi hash'i bozar.",
          },
          blockchain: {
            label: "Blok zinciri",
            body: "Her blok bir öncekinin hash'ini içerir ve böylece birbirlerine zincirlenir. Eski bir bloğu değiştirin, sonraki bütün hash'ler bozulur; defteri kurcalamaya karşı görünür kılan da budur.",
          },
          signatures: {
            label: "İmzalar",
            body: "Dijital imza, belgenin kendisi üzerinde değil hash'i üzerinde atılır. Herkes belgeyi yeniden hash'leyip imzayı doğrulayabilir.",
          },
        },
      },

      recap: {
        lessons: [
          "Aynı mesaj her zaman aynı özeti üretir ve özet, girene bakılmaksızın aynı uzunluktadır",
          "Tek bir karakteri değiştirmek 256 bitin yaklaşık yarısını değiştirir — çığ etkisi, burada iddia edilmiyor ölçülüyor",
          "İki özetin paylaştığı her ek hex karakter on altı kat daha düşük olasılıklıdır; 64'ünün birden eşleşmesinin erişilemez olmasının nedeni budur",
        ],
        footer:
          "Bu sayfadaki hiçbir şey saklanmıyor ya da taklit edilmiyor: her özet, yazdığınız metin üzerinde tarayıcınızda çalışan crypto.subtle.digest(\"SHA-256\", …) çağrısının sonucu.",
      },
    },

    // -------------------------------------------------------- neural ----
    "neural-playground": {
      question: "Tek bir katman asl\u0131nda neyi de\u011fi\u015ftiriyor?",
      diagram: {
        diagramLabel: (shape: string) =>
          `A\u011f \u015femas\u0131: ${shape} n\u00f6ron. Her d\u00fc\u011f\u00fcm, o n\u00f6ronun girdi karesi boyunca neye tepki verdi\u011fini g\u00f6sterir.`,
        neuron: (label: string) => `${label} n\u00f6ronu`,
        inputNode: "girdi",
        bias: "yanl\u0131l\u0131k",
        eachSquare: "Her kare, bir n\u00f6ronun girdiye kendi bak\u0131\u015f\u0131.",
        pushesUp: "yukar\u0131 iter",
        pushesDown: "a\u015fa\u011f\u0131 iter",
        thickness: "kal\u0131nl\u0131k g\u00fcc\u00fc g\u00f6sterir",
      },
      title: "Yapay Sinir Ağı Laboratuvarı",
      description: "İki tür nokta çizin. Bir ağın onları ayırt etmeyi öğrenişini izleyin.",
      liveTraining: "Canlı eğitim",

      canvasLabel: (points: number, accuracy: number) =>
        `İki sınıfta ${points} nokta. Ağ şu anda eğitim noktalarının %${accuracy} kadarını doğru biliyor; gölgeli arka plan ise diğer her yerde tahmin ettiği sınıf.`,
      datasets: {
        gauss: { label: "İki küme", hint: "Tek bir doğru yeterli." },
        circle: { label: "Çember", hint: "Eğri gerekiyor, düz bir çizgiyle bu iş olmaz." },
        xor: { label: "XOR", hint: "Klasik: gizli katman olmadan çözülemez." },
        spiral: { label: "Spiral", hint: "Zorlu. Nöron ve sabır gerekir." },
      },
      classA: "A sınıfı",
      classB: "B sınıfı",
      keyboardHint: { trainPause: "eğitir veya duraklatır ·", restart: "ağırlıkları sıfırlayıp yeniden başlatır" },
      layersCaption: {
        solved:
          "Düz ağ yazı tura düzeyinde takılı kaldı: hiçbir doğru bu dört köşeyi ayıramaz. Gizli katman sınırı büker ve problem ortadan kalkar.",
        idle: "İkisini yan yana çalıştırın ve soldakinin nerede pes ettiğini izleyin.",
      },
      layersPanels: {
        flat: { title: "Gizli katman yok", subtitle: "İki girdi doğrudan çıktıya bağlı: tek bir nöron." },
        deep: { title: "Tek gizli katman", subtitle: "Aynı yapı, ama aralarında dört nöron var." },
      },
      descentNote: {
        overshoot:
          "Hedefi aştı. Her adım dibin ötesine sıçrayıp karşı duvarda daha yukarıya iniyor, kayıp da patlıyor.",
        deep: "En derin vadiye yerleşti. Sağlıklı bir eğitim böyle görünür.",
        shallow:
          "Yerleşti, ama sağdaki sığ çukura. Gradyan inişi yalnızca ayağının altındaki eğimi görür, manzaranın tamamını asla.",
        rolling: "Teğet doğrusunu izleyin: adımın elindeki tek bilgi onun dikliği.",
      },
      neuronLabel: (w1: string, w2: string, bias: string) =>
        `Tek bir nöronun girdi düzlemi üzerindeki çıktısı; ağırlıklar ${w1} ve ${w2}, bias ${bias}.`,
      solvedBadge: "Çözüldü",
      notYet: "Henüz değil",
      loopCards: {
        forward: { headline: "Bir tahmin" },
        loss: { headline: "Ne kadar yanıldı?" },
        backprop: { headline: "Suç kimde?" },
        descent: { headline: "Her şeyi yokuş aşağı it" },
      },
      playground: {
        currentlyWrong: "\u015eu an yanl\u0131\u015f",
        dataAndArchitecture: "Veri ve mimari",
        drawHint: "Nokta eklemek i\u00e7in tuvale t\u0131klay\u0131n ya da s\u00fcr\u00fckleyin.",
        caption:
          "Solda: a\u011f\u0131n her yerde ne tahmin etti\u011fi. Sa\u011fda: ayn\u0131 a\u011f\u0131n i\u00e7eriden g\u00f6r\u00fcn\u00fcm\u00fc, n\u00f6ron ba\u015f\u0131na bir kare.",
        noneLabel: "yok",
        offLabel: "kapal\u0131",
        draw: "Çiz",
        data: "Veri",
        noise: "Gürültü",
        hiddenLayers: "Gizli katman",
        neuronsPerLayer: "Katman başına nöron",
        activation: "Aktivasyon",
        learningRate: "Öğrenme oranı",
        regularization: "Düzenlileştirme (L2)",
        speed: "Hız",
        train: "Eğit",
        pause: "Duraklat",
        clearPoints: "Temizle",
        newSample: "Yeni örneklem",
        insideTitle: "Ağın içeriden görünüşü",
        insideBody:
          "Aynı ağ, ikinci bir bakış açısıyla. Her kare, bir nöronun bütün girdi düzlemine verdiği kendi yanıtını gösterir: bir önceki katmanın kurduğu öznitelikler ve bir sonraki katmanın elinde bulunan malzeme.",
        canvasLabel: "Karar yüzeyi ve üzerine çizilmiş eğitim verisi.",
        playPause: "Boşluk",
      },

      stats: {
        epoch: "Epok",
        loss: "Kayıp",
        trainAcc: "Eğitim doğr.",
        testAcc: "Test doğr.",
        curveLabel: "Son birkaç saniyedeki eğitim kaybı, logaritmik ölçekte.",
        announce: (percent: number) => `Eğitim doğruluğu yüzde ${percent}.`,
      },

      neuron: {
        weightsAndBias: "A\u011f\u0131rl\u0131klar ve yanl\u0131l\u0131k",
        caption:
          "Yapamad\u0131\u011f\u0131n\u0131z \u015feye dikkat edin: bu \u00fc\u00e7 kayd\u0131r\u0131c\u0131y\u0131 nas\u0131l \u00e7ekerseniz \u00e7ekin s\u0131n\u0131r d\u00fcz bir \u00e7izgi olarak kal\u0131yor. Tek bir n\u00f6ronun b\u00fct\u00fcn s\u0131n\u0131r\u0131 bu \u2014 ve bir sonraki b\u00f6l\u00fcm\u00fcn var olma nedeni de bu.",
        notes: {
          tanh: "\u22121\u20261 aral\u0131\u011f\u0131na s\u0131k\u0131\u015ft\u0131r\u0131r. Yumu\u015fak, simetrik, g\u00fcvenli bir varsay\u0131lan.",
          relu: "Pozitifleri ge\u00e7irir, negatifleri d\u00fczler. H\u0131zl\u0131 ve modern varsay\u0131lan.",
          sigmoid: "0\u20261 aral\u0131\u011f\u0131na s\u0131k\u0131\u015ft\u0131r\u0131r. Tarihsel ve tak\u0131lmaya yatk\u0131n.",
        },
        kicker: "Sonuna kadar yakınlaşın",
        title: "Bir nöron sandığınızdan küçüktür.",
        lede: "Belleği yok, mantığı yok, hiçbir marifeti yok. Üç sayı ve bir ezme işlemi: bütün alanın üzerine kurulduğu birim bundan ibaret.",
        weight1: "x₁ ağırlığı",
        weight2: "x₂ ağırlığı",
        bias: "Bias",
        activation: "Aktivasyon",
        note: "Şuna dikkat edin: bu üç kaydırıcıyı nasıl çekerseniz çekin, sınır yine düz bir çizgi olarak kalır. Tek bir nöronun sınırı budur ve bir sonraki bölümün var olma nedeni de tam olarak bu.",
        canvasLabel: "Tek bir nöronun girdi düzlemi üzerindeki çıktısı.",
        activations: {
          tanh: "−1…1 aralığına ezer. Düzgün, simetrik, güvenli bir başlangıç.",
          relu: "Pozitifleri geçirir, negatifleri düzler. Hızlı ve günümüzün varsayılanı.",
          sigmoid: "0…1 aralığına ezer. Tarihsel bir seçim; öğrenmeyi tıkamaya eğilimli.",
        },
      },

      layers: {
        panelLabel: (title: string, accuracy: number, epoch: number) =>
          `${title}: ${epoch} epok sonra XOR noktalar\u0131n\u0131n %${accuracy} kadar\u0131 do\u011fru s\u0131n\u0131fland\u0131r\u0131ld\u0131.`,
        kicker: "Katmanlar neden gerekli",
        title: "Yapay zekâyı on yıl durduran dört nokta.",
        lede: "XOR: karşılıklı köşelere yerleşmiş iki sınıf. Tek bir nöron bunları birbirinden ayıramaz ve 1969'da fark edilen bu gerçek, alanı neredeyse bitiriyordu. Çözümün tamamıysa tek bir gizli katmandan ibaret.",
        noHidden: "Gizli katman yok",
        oneHidden: "Tek gizli katman",
        accuracy: "Doğruluk",
        trainBoth: "İki ağı da eğit",
        trainBothShort: "İkisini eğit",
        pauseBoth: "İkisini de duraklat",
        startOver: "Baştan başla",
        caption: "İkisini yan yana çalıştırın ve soldakinin nerede pes ettiğini izleyin.",
      },

      descent: {
        slopeHint: "backprop'un her a\u011f\u0131rl\u0131\u011fa verdi\u011fi tek say\u0131",
        kicker: "Nasıl öğreniyor",
        title: "Yokuş aşağı, her seferinde küçük bir adım.",
        lede: "Öğrenme, ansızın gelen bir kavrayış değildir. Bir yamaçta gradyanın tersi yönünde yuvarlanan bir top gibidir ve her şeyi belirleyen, attığı adımların büyüklüğüdür.",
        learningRate: "Öğrenme oranı",
        roll: "Yuvarla",
        oneStep: "Tek adım",
        weight: "ağırlık",
        loss: "kayıp",
        slope: "eğim",
        nextStep: "sonraki adım",
        steps: "adım",
        curveLabel: (w: string, l: string, s: string) =>
          `Kayıp eğrisi; top ${w} ağırlığında, kayıp ${l}, eğim ${s}.`,
      },

      loop: {
        kicker: "Döngü",
        title: "Dört adım, işe yarayana kadar tekrarlanır.",
        lede: "Şimdiye kadar izlediğiniz her şey, saniyede binlerce kez çalışan şu dört aşamadan ibaret.",
        cards: {
          forward: {
            title: "İleri geçiş",
            body: "Her nöron girdilerini ağırlıklarıyla çarpar, bir bias ekler ve sonucu ezer. Bunu katman katman tekrarlayın; içeri giren bir nokta, dışarı çıkan bir tahmine dönüşür.",
          },
          loss: {
            title: "Kayıp",
            body: "Tahmini gerçek etiketle karşılaştırın ve farkın karesini alın. Ortaya bütün ağ için tek bir sayı çıkar ve ağın küçültmeye çalıştığı tek şey de budur.",
          },
          backprop: {
            title: "Geri yayılım",
            body: "Hatayı zincir kuralıyla katmanlar boyunca geriye taşıyın. Her bir ağırlık, hataya ne kadar katkıda bulunduğunu öğrenir: kendi gradyanını.",
          },
          descent: {
        slopeHint: "backprop'un her a\u011f\u0131rl\u0131\u011fa verdi\u011fi tek say\u0131",
            title: "Gradyan inişi",
            body: "Her ağırlığı kendi gradyanının tersi yönde küçük bir adım kaydırın. Öğrenme oranı, o adımın büyüklüğüdür. Sonra bunu binlerce kez yineleyin.",
          },
        },
      },

      challenge: {
        architecture: "Mimari",
        neuronsUsed: "Kullan\u0131lan n\u00f6ron",
        testAccuracy: "Test do\u011frulu\u011fu",
        target: "Hedef",
        objectiveLine: (accuracy: string) =>
          `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n \u2014 olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
        solvedNote: "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
        noBest: "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
        bestLine: (neurons: number, accuracy: string, epoch: number) =>
          `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
        canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
          `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
        announceSolved: (neurons: number, accuracy: string) =>
          `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
        kicker: "Görev",
        title: "Spirali olabildiğince az nöronla çözün.",
        lede: "On altı nöronla herkes çözer. Asıl soru, ağ şekli tutamaz hâle gelmeden önce kaça kadar inebildiğiniz.",
        objective: "Hedef",
        objectiveBody: (accuracy: number) =>
          `Spiralde %${accuracy} test doğruluğuna ulaşın. Sonra aynısını daha az nöronla yapın.`,
        hiddenLayers: "Gizli katman",
        neuronsPerLayer: "Katman başına nöron",
        learningRate: "Öğrenme oranı",
        train: "Eğit",
        pause: "Duraklat",
        newAttempt: "Yeni deneme",
        yourBest: "En iyiniz",
        none: "Henüz yok.",
        best: (neurons: number, epoch: number) =>
          `${neurons} nöron, ${epoch.toLocaleString("tr-TR")}. epokta çözüldü.`,
        totalNeurons: (n: number) => `${n} nöron`,
        solvedAnnounce: (neurons: number) => `${neurons} nöronla çözüldü.`,
      },

      recap: {
        lessons: [
          "Bir nöron, ağırlıklı bir toplam ve bir ezme işleminden ibarettir; tek başına yalnızca düz bir çizgi çizebilir",
          "Gizli katmanlar o çizgiyi büker; XOR bir gizli katman olmadan çözülemez",
          "Her nöron kendi özniteliğini öğrenir, sonraki katman da bunları birleştirir",
          "Kayıp ağın ne kadar yanıldığını söyler; geri yayılım ise hangi ağırlığın sorumlu olduğunu",
          "Gradyan inişi her ağırlığı yokuş aşağı iter; öğrenme oranı da atılan adımın büyüklüğüdür",
          "Adım çok küçükse sürünür, çok büyükse hedefi aşar; hiçbiri manzaranın tamamını görmez",
        ],
        footer:
          "Az önce izlediğiniz her şey 300 satırlık sıradan aritmetikti. Bugünün yapay zekâsının arkasındaki modeller de aynı dört adımdan oluşuyor, sadece çok daha fazla ağırlıkla.",
      },
    },

    // --------------------------------------------------- pathfinding ----
    pathfinding: {
      title: "Yol Bulma",
      description: "Engeller çizin; BFS, Dijkstra ve A* algoritmalarının yol arayışını izleyin.",
      findTheWay: "Yolu bulun",
      algorithm: "Algoritma",
      draw: "Çiz",
      gridAndKeys: "Harita araçları ve klavye",
      map: "Harita",
      tools: { wall: "Engel", mud: "Çamur", erase: "Sil", start: "Başlangıç", goal: "Hedef" },
      legend: {
        wall: "engel",
        frontier: "sınır",
        settled: "kesinleşen",
        path: "yol",
        mud: "çamur",
      },
      metrics: {
        explored: "İncelenen",
        path: "Yol",
        cost: "Maliyet",
        noPath: "Yol yok",
      },
      steps: (n: number) => `${n} adım`,
      gridLabel: (walls: number, mud: number, state: string) =>
        `Düzenlenebilir ızgara. Engel: ${walls}. Çamurlu hücre: ${mud}. ${state}`,
      gridHelp:
        "Çizmek için ızgaranın üzerinde sürükleyin. Izgara odaktayken yön tuşları hareket ettirir, Boşluk boyar.",
      gridHelpFull: {
        drag: "Çizmek veya silmek için ızgarada sürükleyin.",
        or: "veya",
        toMove: "işaretlerini sürükleyerek taşıyın. Izgara odaktayken yön tuşları imleci hareket ettirir,",
        toggles: "bir hücreyi değiştirir,",
        drops: "ise işaret bırakır.",
      },
      gridSummary: (cols: number, rows: number, start: string, goal: string, walls: number, mud: number, algorithm: string, result: string) =>
        `Yol bulma ızgarası, ${cols} sütun × ${rows} satır. Başlangıç: ${start}. Hedef: ${goal}. Engel: ${walls}. Çamurlu hücre: ${mud}. Algoritma: ${algorithm}. ${result}`,
      status: {
        solved: (explored: number, steps: number, cost: number) =>
          `Çözüldü: ${explored} hücre incelendi, yol ${steps} adım, maliyet ${cost}.`,
        unreachable: (explored: number) => `Yol yok. ${explored} hücre incelendi.`,
        running: (explored: number) => `Aranıyor. Şu ana kadar ${explored} hücre incelendi.`,
        notStarted: "Başlatılmadı.",
        gridReset: "Izgara sıfırlandı.",
        gridCleared: "Izgara temizlendi.",
        selected: (algorithm: string) => `${algorithm} seçildi.`,
        loaded: (map: string) => `${map} yüklendi.`,
      },
      row: (row: number, col: number) => `satır ${row}, sütun ${col}`,
      intro: {
        question: "İlk olarak hangi kareye bakıyor?",
        caption:
          "Birkaç engel çizin, sonra Çalıştır'a basın. Aramanın gerçekte nereye yayıldığını izleyin, hedefin olmadığı yerler de dahil.",
      },
      bfs: {
        kicker: "Düşünürken izleyin",
        title: "Çizgiler hâlinde değil, katmanlar hâlinde yayılır.",
        lede: "Adım adım ilerleyin. Halkalı hücreler bilinen ama henüz ziyaret edilmemiş hücrelerdir, yani sınır. Dolu hücreler ise kesinleşmiştir: arama, her birine kaç hamlede ulaşıldığını bilir ve bir daha oraya bakmaz.",
        caption:
          "Hücreleri ilk giren ilk çıkar sırasıyla ele almak işin tamamı: bu, onların uzaklık sırasına göre kesinleşmesini sağlar, dolayısıyla hedefe ulaşan ilk rota en kısasıdır. Buna genişlik öncelikli arama denir.",
      },
      cost: {
        kicker: "Uzaklık maliyet değildir",
        title: "Bazı zeminlerde ilerlemek daha yavaştır.",
        lede: "Çamura girmenin maliyeti 5, açık zeminin 1. Önce BFS'i, sonra Dijkstra'yı çalıştırın ve ızgaranın altındaki iki sayıyı karşılaştırın.",
        caption:
          "BFS yine en az hamleyle gidiyor, doğruca bataklığın içinden. Dijkstra daha çok adım atıyor ama daha az ödüyor; çünkü her seferinde en yakın hücreyi değil, bildiği en ucuz hücreyi kesinleştiriyor.",
      },
      astar: {
        kicker: "Aramaya bir ipucu verin",
        title: "Aynı doğru cevap, çok daha az arama.",
        lede: "Dijkstra hedefin nerede olduğunu bilmez, bu yüzden her yöne eşit yayılır. A* ise kalan uzaklık için bir tahmin ekler ve onu izler: f = g + h; burada g şu ana kadarki maliyet, h ise tahmindir.",
        caption:
          "Aynı yol, aynı maliyet. İncelenen sayısına bakın. Buradaki tahmin Manhattan uzaklığı; dört yönlü bir ızgarada kalan mesafeyi asla olduğundan fazla gösteremez, A*'ın ona güvenerek hiçbir şeyden ödün vermemesinin nedeni de tam olarak budur.",
      },
      challenge: {
        architecture: "Mimari",
        neuronsUsed: "Kullan\u0131lan n\u00f6ron",
        testAccuracy: "Test do\u011frulu\u011fu",
        target: "Hedef",
        objectiveLine: (accuracy: string) =>
          `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n \u2014 olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
        solvedNote: "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
        noBest: "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
        bestLine: (neurons: number, accuracy: string, epoch: number) =>
          `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
        canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
          `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
        announceSolved: (neurons: number, accuracy: string) =>
          `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
        kicker: "Görev",
        title: "Aynı cevap, daha az iş.",
        lede: "Üç sabit harita. Her biri hem en ucuz yolu hem de bütçeden fazla hücre kesinleştirmeyen bir arama istiyor. Bunlardan biri tek başına kolay; asıl mesele ikisini birden sağlamak.",
        mazeLabel: (title: string, cols: number, rows: number, cost: number, budget: number, algorithm: string) =>
          `${title}: sabit ${cols} × ${rows} labirent. Hedefe ${cost} olan en uygun maliyetle ulaşın ve en çok ${budget} hücre kesinleştirin. Geçerli algoritma: ${algorithm}.`,
        bothAtOnce: "İkisi birden",
        beaten: (done: number, total: number) => `${total} haritadan ${done} tanesi geçildi`,
        costMustBe: "maliyet şu olmalı",
        exploredAtMost: "en çok incelenecek",
        maps: {
          swamp: {
            title: "Bataklık",
            hint: "En hızlı geçiş, en ucuz geçiş değildir.",
          },
          "open-ground": {
            title: "Açık arazi",
            hint: "Burada hiçbir şey pahalı değil. Tasarruf edilecek tek şey emek.",
          },
          "wrong-door": {
            title: "Yanlış kapı",
            hint: "Hedef yakın. İçeri giden yol değil.",
          },
        },
        budget: (cost: number, budget: number) =>
          `En ucuz yolun maliyeti ${cost}. En çok ${budget} hücre kesinleştirin.`,
        verdict: {
          unreachable: "Bu arama hedefe hiç ulaşamadı.",
          solved: (cost: number, explored: number) =>
            `Çözüldü. Maliyet ${cost} ve yalnızca ${explored} hücre kesinleşti.`,
          overBudget: (explored: number, budget: number) =>
            `Yol en uygun olanı ama ${explored} hücre incelediniz. Bütçe: ${budget}.`,
          suboptimal: (explored: number, cost: number, optimal: number) =>
            `Yalnızca ${explored} hücre incelediniz, ancak yolunuzun maliyeti ${cost}. En uygun maliyet: ${optimal}.`,
          both: (cost: number, optimal: number, explored: number, budget: number) =>
            `Yolunuzun maliyeti ${cost}; en uygunu ${optimal}. Ayrıca ${explored} hücre incelediniz; bütçe ise ${budget}.`,
        },
      },
      recap: {
        lessons: [
          "Bir arama doğrudan hedefe yönelmez; hedef, ulaştığı noktalardan biri olana kadar her yöne yayılır",
          "BFS hücreleri ilk giren ilk çıkar sırasıyla alır; böylece onları en az hamle sırasına göre kesinleştirir",
          "Zemin tekdüze olmaktan çıktığı anda en az hamle ile en ucuz rota farklı sorulardır",
          "Dijkstra her zaman bildiği en ucuz hücreyi kesinleştirir; cevabının en ucuz olmasının nedeni budur",
          "A* kalan mesafe için bir tahmin ekler ve çabasını hedefin bulunduğu yöne harcar",
          "Tahmin mesafeyi asla olduğundan fazla göstermez; bu yüzden A* daha hızlı ulaşırken hiçbir şeyden ödün vermez",
        ],
        footer:
          "Telefonunuzun bugüne kadar önerdiği her güzergâh buna benzer bir döngüden çıktı: bir sınır, kesinleşmiş bir küme ve sıradaki hücreyi seçen bir kural.",
      },
    },

    // ------------------------------------------------------- sorting ----
    "sorting-race": {
      title: "Sıralama Yarışı",
      description:
        "Veriyi siz çizin; her algoritmanın onu sıralamak için ne kadar iş yaptığını görün.",
      theRace: "Yarış",
      algorithm: "Algoritma",
      shape: "Biçim",
      shapeAndKeys: "Biçim ve klavye",
      puzzle: "Görev",
      sorterA: "Sıralayıcı A",
      sorterB: "Sıralayıcı B",
      sort: "Sırala",
      algorithms: { selection: "Seçmeli Sıralama", insertion: "Eklemeli Sıralama" },
      shapes: {
        almost: "Neredeyse sıralı",
        sorted: "Sıralı",
        random: "Karışık",
        reversed: "Ters",
      },
      legend: { settled: "yerleşti", comparing: "karşılaştırılıyor", lifted: "havada" },
      metrics: {
        comparisons: "Karşılaştırma",
        moves: "Taşıma",
        disorder: "Düzensizlik",
        questionsAsked: "sorulan soru",
        valuesRelocated: "yeri değişen değer",
        inversions: (n: number) => `${n} terslik`,
      },
      drawHint: "Veriyi yeniden biçimlendirmek için grafiğin üzerinde sürükleyin.",
      keyboardHint: "bir çubuk seçer,",
      keyboardHint2: "yüksekliğini değiştirir.",
      keyboardHelp:
        "Grafiği yeniden biçimlendirmek için üzerinde sürükleyin. Grafik odaktayken sol ve sağ oklar bir çubuk seçer, yukarı ve aşağı oklar yüksekliğini değiştirir.",
      chartLabel: (size: number, algorithm: string, disorder: number, state: string) =>
        `${size} değerden oluşan çubuk grafik. ${algorithm}. Düzensizlik: ${disorder} terslik. ${state}`,
      state: {
        done: (comparisons: number, moves: number) =>
          `${comparisons} karşılaştırma ve ${moves} taşıma ile sıralandı.`,
        running: (comparisons: number, moves: number) =>
          `Sıralanıyor: şu ana kadar ${comparisons} karşılaştırma, ${moves} taşıma.`,
        alreadySorted: "Zaten sıralı. Başlatılmadı.",
        notStarted: "Başlatılmadı.",
        cursor: (index: number, value: number) =>
          `İmleç ${index}. çubukta, değer ${value}.`,
        sorting: "Sıralanıyor.",
        arrayReset: "Dizi sıfırlandı.",
        loaded: (shape: string) => `${shape} yüklendi.`,
        selected: (algorithm: string) => `${algorithm} seçildi.`,
      },
      race: {
        question: "Hangisi önce bitirir?",
        oneButton: "Tek düğme. İkisi de aynı veriden başlıyor.",
        bothDone: "Aynı sonuç — ama biri diğerinin sorduğu soruların çok azını sordu.",
        sorted: "sıralandı",
        caption: "Aynı dizi, aynı sonuç. Sayaçlar değil.",
        panelLabel: (title: string, size: number, state: string) =>
          `${title}: ${size} değerden oluşan çubuk grafik. ${state}`,
      },
      watch: {
        kicker: "Çalışırken izleyin",
        title: "Biri süpürür. Diğeri parmak ucuyla yürür.",
        lede: "Adım adım ilerleyin. Sıralayıcı A hiçbir şeyi kımıldatmadan önce kalanın tamamını yeniden tarar; Sıralayıcı B tek bir değeri alıp yalnızca gerektiği kadar geriye yürütür.",
        caption:
          "Bunlar Seçmeli Sıralama ve Eklemeli Sıralama. Uzun ve kesintisiz karşılaştırma dizileri birincisine; karşılaştır-kaydır-karşılaştır ritmi ikincisine ait.",
      },
      data: {
        kicker: "Veriyi çizin",
        title: "İş verinin içinde.",
        lede: "Grafiği yeniden biçimlendirin — üzerinde sürükleyin ya da bir biçim seçin — sonra yeniden sıralayın.",
        caption:
          "Seçmeli Sıralama burada her seferinde 496 soru sorar; sıralı, karışık ya da ters fark etmez, çünkü kalan her çifti yine de kontrol eder. Eklemeli Sıralama'nın sayısı ise çizdiğiniz biçimle birlikte değişir.",
      },
      distance: {
        kicker: "Evinden ne kadar uzakta",
        title: "Mesele kaç tanesinin yanlış olduğu değil.",
        lede: "Sıralı biçimden başlayın. Bir çubuğu ait olduğu yerden çok uzağa sürükleyin, sonra bunun yerine üç çubuğu hafifçe oynatın. Her birinin maliyetini karşılaştırın.",
        caption:
          "Terslik, sırası yanlış olan bir çifttir. Bu eklemeli sıralama, kendisine verilen dizideki her terslik için tam bir kez kaydırır — yani evinden çok uzaktaki tek bir değer, birkaç küçük hatadan daha pahalıya gelebilir.",
      },
      challenge: {
        architecture: "Mimari",
        neuronsUsed: "Kullan\u0131lan n\u00f6ron",
        testAccuracy: "Test do\u011frulu\u011fu",
        target: "Hedef",
        objectiveLine: (accuracy: string) =>
          `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n \u2014 olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
        solvedNote: "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
        noBest: "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
        bestLine: (neurons: number, accuracy: string, epoch: number) =>
          `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
        canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
          `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
        announceSolved: (neurons: number, accuracy: string) =>
          `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
        kicker: "Meydan okuma",
        title: "Neyi saydığınıza göre ucuz değişir.",
        lede: "Üç sabit dizi, üç bütçe — ve bütçe her zaman aynı sayıyla ilgili değil.",
        budget: "Bütçe",
        atMost: (unit: string) => `en fazla ${unit}`,
        barsChanged: "değişen çubuk",
        beaten: (done: number, total: number) => `${total} görevden ${done} tanesi geçildi`,
        fixedTo: (algorithm: string) =>
          `${algorithm} sabit. Onun yerine veriyi yeniden biçimlendirin.`,
        goal: (budget: number, unit: string) => `Hedef: en fazla ${budget} ${unit}.`,
        chartLabel: (title: string, size: number, disorder: number, goal: string, state: string) =>
          `${title}: ${size} değerden oluşan çubuk grafik. Düzensizlik: ${disorder} terslik. ${goal} ${state}`,
        editsUsed: (used: number, max: number) =>
          `${max} düzenlemeden ${used} tanesi kullanıldı.`,
        finished: (comparisons: number, moves: number) =>
          `${comparisons} karşılaştırma ve ${moves} taşıma ile bitti.`,
        budgetValue: (budget: number, unit: string) => `${budget} ${unit}`,
        editsLeft: (used: number, max: number) => `${max} düzenlemeden ${used} tanesi kullanıldı`,
        units: { comparisons: "karşılaştırma", moves: "taşıma" },
        puzzles: {
          "which-one-cares": {
            title: "Hangisi umursuyor?",
            brief: "Bütçenin izin verdiğinden daha az soru sorarak sıralayın.",
          },
          "fewest-writes": {
            title: "En az yazma",
            brief: "İstediğiniz kadar soru sorun — yeter ki fazla veri taşımayın.",
          },
          "three-edits": {
            title: "Üç düzenleme",
            brief: "En fazla üç çubuğu yeniden biçimlendirin, sonra bütçenin altına inin.",
          },
        },
        verdict: {
          tooManyEdits: (edits: number, max: number) =>
            `${edits} çubuk değiştirdiniz. En fazla ${max} değiştirebilirsiniz.`,
          overBudget: (used: number, unit: string, budget: number) =>
            `${used} ${unit}. Bütçe: ${budget}.`,
          passed: (used: number, unit: string, budget: number) =>
            `${budget} bütçesinin altında, ${used} ${unit} ile çözüldü.`,
        },
      },
      recap: {
        lessons: [
          "İki algoritma aynı sonuca, birbirinden çok farklı miktarda iş yaparak ulaşabilir",
          "Seçmeli sıralama her turda kalanın tamamını yeniden tarar, bu yüzden maliyeti sabittir; eklemeli sıralama yalnızca gerektiği kadar geriye yürür, bu yüzden maliyeti verinin bir özelliğidir",
          "Terslik, sırası yanlış olan bir çifttir ve bu eklemeli sıralama her biri için bir kez kaydırır — ama daha az soru sormak, daha az veri yazmakla aynı hedef değildir",
        ],
        footer:
          "Gerçek sıralama kütüphaneleri tam olarak buna yaslanır: neredeyse sıralı parçaları eklemeli sıralamaya devrederler, çünkü o biçimde işin neredeyse tamamı zaten yapılmıştır.",
      },
    },

    // ----------------------------------------------------- tokenizer ----
    tokenizer: {
      title: "Tokenizer Laboratuvarı",
      description:
        "Bir tokenizer'ı elinizle eğitin ve ne okuduğunun, neyi söylemenin ucuz olduğunu nasıl belirlediğini görün.",
      honesty:
        "Bu laboratuvar için birkaç kilobaytlık metin üzerinde eğitilmiş küçük bir BPE tokenizer'ı. Herhangi bir GPT modelinin kullandığı tokenizer değil.",
      nothingToTokenize: "Henüz tokenleştirilecek bir şey yok.",
      stripSummary: (label: string, count: number, list: string) =>
        `${label}. ${count} token: ${list}`,

      guess: {
        sectionLabel: "Kesikleri tahmin edin",
        heading: "Sizce bu metin nerelerden ayrılıyor?",
        lede: "Bir dil modeli bu cümleyi hiçbir zaman harfler olarak görmez; tam olarak kelimeler olarak da görmez. Onun ne gördüğünü söylemeden önce, cümleyi nerelerden parçaladığını düşünüyorsanız oraları işaretleyin. Sonra sonucu açın.",
        stripLabel: (sentence: string) =>
          `“${sentence}” cümlesi. Nerelerden ayrıldığını düşünüyorsanız işaretleyin. Sol ve sağ yön tuşlarıyla hareket edin, Boşluk ile kesik koyun veya kaldırın.`,
        cellLabel: (character: string, position: number) =>
          `${character} karakterinden önce kes, konum ${position}`,
        theSpace: "boşluk",
        hint: "Bir harfin önünden kesmek için ona dokunun. Şerit odaktayken",
        hintMove: "hareket eder,",
        hintPlace: "kesik koyar.",
        hintSpace: "bir boşluğu gösterir.",
        reveal: "Sonucu aç",
        preparing: "Hazırlanıyor…",
        cutEveryWord: "Her kelimeden kes",
        legendReal: "gerçekte kestiği yer",
        legendImagined: "işaretlediğiniz ama orada olmayan kesik",
        legendMatched: "bunu bildiniz",
        resultOne: (matched: boolean) =>
          `1 kesik işaretlediniz ve bu, gerçek kesiklerden biri ${matched ? "" : "değil"}.`,
        resultMany: (guessed: number, matched: number) =>
          `${guessed} kesik işaretlediniz ve bunlardan ${matched} tanesi gerçek.`,
        resultTail: (actual: number, tokens: number) =>
          `Tokenizer toplam ${actual} kesik yaptı ve geriye ${tokens} parça kaldı.`,
        explain:
          "Kelime değiller. “gardeners” ikiye ayrıldı: “garden” ve “ers”. Nokta tek başına duruyor ve her boşluk kendisinden sonraki kelimeye aittir, aralarında durmuyor.",
        actualLabel: "Cümlenin gerçekte ayrıldığı parçalar",
        announceCleared: "Temizlendi. Kesikleri yeniden işaretleyin.",
        announceEveryWord: "Her kelimenin önüne bir kesik konuldu.",
        describe: (
          guessed: number,
          matched: number,
          imagined: number,
          missed: number,
          actual: number,
          tokens: number,
        ) =>
          guessed === 0
            ? `Hiç kesik işaretlemediniz. Tokenizer ${actual} kesik yaptı ve cümleyi ${tokens} tokene ayırdı.`
            : `${guessed} kesik işaretlediniz. Bunlardan ${matched} tanesi gerçek. ` +
              `${imagined} tanesi orada değil. ${missed} tanesini kaçırdınız. ` +
              `Tokenizer toplam ${actual} kesik yaptı ve cümleyi ${tokens} tokene ayırdı.`,
        figures: {
          yourCuts: "Sizin kesikleriniz",
          matched: "Tutan",
          actualCuts: "Gerçek kesikler",
          tokens: "Parça",
        },
      },

      train: {
        kicker: "Parçalar nereden geliyor",
        title: "O parçaları kimse seçmedi.",
        lede: "Onlar sayıldı. Burada adım adım izleyebileceğiniz kadar küçük bir derlem var: Birleştir'e basın, derlemdeki en sık geçen komşu çift, geçtiği her yerde tek bir parçaya kaynaşsın. Sonra sayım yeniden başlar.",
        corpusLabel: "Okuduğu derlem",
        mergeNext: "Sıradaki çifti birleştir",
        trainAll: "Tümünü eğit",
        training: "Eğitiliyor…",
        untouched: (base: number, tokens: number) =>
          `Şu anda her parça tek bir karakter: toplam ${base} parça ve derlemin maliyeti ${tokens} token. En sık geçen çifti birleştirin ve ne olduğunu görün.`,
        merged: (
          index: number,
          left: string,
          right: string,
          frequency: number,
          token: string,
          vocabulary: number,
          tokens: number,
        ) =>
          `${index}. birleştirme: en sık geçen komşu çift ${left} + ${right} idi, ${frequency} kez görüldü. Artık tek bir token: ${token}. Sözlük: ${vocabulary} parça. Derlemin maliyeti ${tokens} token.`,
        exhausted: (merges: number, vocabulary: number) =>
          `Birleştirilecek bir şey kalmadı. Artık hiçbir çift birden fazla geçmiyor, dolayısıyla birini kaynaştırmak öğrenmek değil ezberlemek olurdu. ${merges} birleştirmede durdu; sözlük ${vocabulary} parçadan oluşuyor.`,
        explain:
          "İşte byte-pair encoding (BPE) budur. Bütün komşu çiftleri sayın, en sık olanı kaynaştırın, yeniden sayın. Sonunda elde ettiği parçalar onun sözlüğüdür ve her kaynaşma bir birleştirmedir. Kimse ona “·read” bir kelimedir demedi; bu, ilk dört sayım turunun sırayla ürettiği bir sonuçtan ibaret. Boşluğun daha ilk birleştirmeden itibaren parçaya dâhil olduğuna dikkat edin: öğrendiği parça “read” değil, “·read”. “·every” ise sonuna kadar parçalı kalıyor, çünkü metinde yalnızca bir kez geçiyor.",
        announceFinished:
          "Eğitim tamamlandı. Birden fazla geçen hiçbir çift kalmadı, dolayısıyla birleştirmeye değer bir şey yok.",
        announceFinishedAfter: (merges: number) =>
          `Eğitim ${merges} birleştirmeden sonra tamamlandı.`,
        announceReset: "Derlem sıfırlandı. Henüz hiçbir şey öğrenilmedi.",
        mergesLabel: "Birleştirme",
        vocabularyLabel: "Sözlük",
        corpusTokensLabel: "Derlem parçası",
      },

      merge: {
        kicker: "Ne kadar öğrendi?",
        title: "“Tek token” değişken bir hedeftir.",
        lede: "Bu tokenizer birkaç kilobaytlık Türkçe okudu. Eğitimini geri sarmak için kaydırıcıyı sürükleyin ve cümleyi dilediğiniz gibi değiştirin. Parçalar her konumda gerçekten yeniden hesaplanır.",
        sentenceLabel: "Cümleniz",
        sentenceHint:
          "Cümleyi değiştirin ya da kendiniz yazın. Türkçe veya İngilizce, tokenizer ikisine de yanıt verir.",
        mergesLearned: "Öğrenilen birleştirme",
        mergesValueText: (merges: number, max: number) => `${max} birleştirmeden ${merges} tanesi`,
        untrained: "Eğitimsiz",
        full: "Tamamı",
        stripLabel: (merges: number) => `Cümleniz, ${merges} birleştirme sonrasında`,
        trainingProgress: (done: number, total: number) =>
          `Tokenizer eğitiliyor… ${total} birleştirmeden ${done} tanesi.`,
        ready: "Tokenizer'ın eğitimi tamamlandı. Birleştirme kaydırıcısını sürükleyin.",
        explain:
          "Sıfır birleştirmede her karakter kendi başına bir tokendir, çünkü tokenizer harflerden başka bir şey bilmiyordur. Sağa doğru sürükleyin ve “·ev · ler · imiz · den” dizisinin önce “·ev · lerimiz · den”e, sonra “·evlerimiz · den”e dönüşmesini izleyin. Bu parçalar Türkçe ekler ama algoritmanın hiçbir yerinde ekin ne olduğu yazmıyor; bunlar yalnızca sürekli yan yana çıkan komşular.",
        jumpTo: "Atla",
      },

      compare: {
        kicker: "Ne üzerinde eğitildi?",
        title: "Ne okuduysa onu ucuzlatır.",
        lede: "İki tokenizer; aynı algoritma, aynı miktarda eğitim, farklı okuma. İkisine de aynı metni verin ve faturanın nasıl ayrıştığını görün. Sonra aradaki farkı kapatan bir cümle yazmayı deneyin.",
        textLabel: "İki tokenizer'ın da aldığı metin",
        textHint:
          "Metni istediğiniz gibi değiştirin. Hiçbir tokenizer'ı, hiç okumadığı bir dilde akıcı kılan bir cümle bulamayacaksınız.",
        trainedOnEnglish: "İngilizce üzerinde eğitildi",
        trainedOnTurkish: "Türkçe üzerinde eğitildi",
        englishCorpus: "birkaç kilobaytlık İngilizce düzyazı",
        turkishCorpus: "birkaç kilobaytlık Türkçe düzyazı",
        tokens: "token",
        cheaper: "Burada daha ucuz, çünkü bu onun okuduğu bir dil.",
        ratio: (ratio: string) =>
          `Aynı karakterler, aynı algoritma, aynı sayıda birleştirme. Yine de biri diğerinin ${ratio} katına mal oluyor. Aradaki fark, tamamen her birine ne okutulduğundan kaynaklanıyor.`,
        sampleLoaded: (label: string, words: number, characters: number) =>
          `${label} örneği yüklendi: ${words} kelime, ${characters} karakter.`,
        samples: {
          "tr-sea": "Türkçe",
          "tr-visit": "Türkçe 2",
          "en-room": "İngilizce",
          "en-bread": "İngilizce 2",
        },
        sampleLabel: "Metin",
      },

      metrics: {
        tokens: "Token",
        characters: "Karakter",
        words: "Kelime",
        merges: "Birleştirme",
      },

      challenge: {
        architecture: "Mimari",
        neuronsUsed: "Kullan\u0131lan n\u00f6ron",
        testAccuracy: "Test do\u011frulu\u011fu",
        target: "Hedef",
        objectiveLine: (accuracy: string) =>
          `Spiralde ${accuracy} test do\u011frulu\u011funa ula\u015f\u0131n \u2014 olabildi\u011fince az gizli n\u00f6ron kullanarak.`,
        solvedNote: "\u00c7\u00f6z\u00fcld\u00fc. \u015eimdi bir n\u00f6ron eksiltip yeniden deneyin.",
        noBest: "Hen\u00fcz yok. Bol n\u00f6ronla ba\u015flay\u0131n, sonra bozulana kadar azalt\u0131n.",
        bestLine: (neurons: number, accuracy: string, epoch: number) =>
          `En iyi: ${neurons} gizli n\u00f6ron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
        canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
          `Spiral g\u00f6revi: ${neurons} gizli n\u00f6ron, ${epoch} epok sonra ${accuracy} test do\u011frulu\u011fu.`,
        announceSolved: (neurons: number, accuracy: string) =>
          `${neurons} gizli n\u00f6ronla, ${accuracy} test do\u011frulu\u011funda \u00e7\u00f6z\u00fcld\u00fc.`,
        kicker: "Görev",
        title: "Tek bütçe. Onu kaçırmanın iki yolu.",
        lede: "İlk görevde tokenizer sabit, cümle sizin. İkincisinde cümle sabit, tokenizer sizin. Bunlardan yalnızca biri daha çok uğraşarak çözülebilir.",
        budgetBadge: (budget: number) => `bütçe ${budget} token`,
        rewriteLabel: "Yeniden yazın",
        rewriteHint:
          "Büyük harfler, boşluklar, noktalama ve gereksiz sözcükler tamamen sizin elinizde. Listelenen kelimelerin metinde kalması gerekiyor.",
        rewriteStrip: "Yeniden yazdığınız metin, tokenleştirilmiş hâli",
        fixedLabel: "Cümle (değiştirilemez)",
        fixedStrip: "Cümlenin tokenleştirilmiş hâli",
        trainedOn: "Eğitildiği derlem",
        english: "İngilizce",
        turkish: "Türkçe",
        mergesLearned: "Öğrenilen birleştirme",
        unknownNote: (unknown: number) =>
          `${unknown} parça kesik çizgiyle çevrelenmiş ve ? ile işaretlenmiş: bunlar tokenizer'ın daha önce hiç görmediği karakterler. Sıradan düzyazı okudu ve düzyazı neredeyse tamamen küçük harflerden oluşur.`,
        englishCeiling:
          "İngilizce tokenizer'ın tam olarak eğitilmiş hâli bu, bu cümlede varabileceği en iyi nokta burası. Eksik olan şey daha fazla eğitim değil.",
        puzzles: {
          "say-it-cheaper": {
            title: "Daha ucuza söyleyin",
            brief:
              "Zorunlu kelimelerin hepsini koruyun ve aynı cümleyi bütçenin altına indirin. Nasıl yazıldığına dair geri kalan her şeyi değiştirebilirsiniz.",
            lesson:
              "Anlamda hiçbir şey değişmedi. Büyük harfler tokenizer'ın hiç öğrenmediği parçalar ve çift boşluk başlı başına bir token.",
          },
          "feed-it-the-right-words": {
            title: "Doğru kelimeleri okutun",
            brief:
              "Bu cümle değiştirilemez. Cümle bütçeye sığana kadar tokenizer'ın ne okuduğunu ve ne kadar eğitildiğini seçin.",
            lesson:
              "İngilizce tokenizer'ı ne kadar eğitirseniz eğitin oraya ulaşamadı. Mesele çaba değil: bir tokenizer yalnızca gerçekten okuduğu bir dilde ucuz olabilir.",
          },
        },
        verdict: {
          untouched: (tokens: number, budget: number) =>
            `Şu hâliyle bu metnin maliyeti ${tokens} token. Bütçe ${budget}.`,
          missingWords: (words: readonly string[]) =>
            `Şunlar hâlâ eksik: ${words.map((w) => `“${w}”`).join(", ")}. Cümlenin tamamının korunması gerekiyor.`,
          overBudget: (tokens: number, budget: number) =>
            `${tokens} token, ${budget} bütçesini ${tokens - budget} aşıyor.`,
          passed: (tokens: number, budget: number) =>
            `${tokens} token, ${budget} bütçesinin içinde.`,
          solvedAnnounce: (message: string) => `Çözüldü. ${message}`,
        },
        puzzleLabel: "Bulmaca",
        tokensLabel: "Token",
        budgetLabel: "Bütçe",
      },

      recap: {
        lessons: [
          "Bir tokenizer metni kelimelere değil, sık rastlanan parçalara ayırır",
          "Bu parçalar sayarak öğrenilir: en sık komşu çifti kaynaştır, sonra yeniden say",
          "Kaç birleştirme öğrendiği neyin tek token sayılacağını belirler ve kazancın büyük kısmı başlarda gelir",
          "Baştaki boşluk kendisinden sonraki kelimeye aittir; bu yüzden boşlukların ve büyük harflerin bir bedeli vardır",
          "Aynı cümlenin maliyeti, tokenizer'ın ne üzerinde eğitildiğine göre büyük ölçüde değişir",
          "Türkçe ekler yalnızca gerçekten Türkçe okumuş bir tokenizer için tek token hâline gelir",
        ],
        footer:
          "Gerçek modeller de bu yolla eğitiliyor; çok daha fazla metinle, karakterler yerine ham baytlar üzerinde. Eğitim verisinde az bulunan bir dilin, model onu konuşmayı öğrendikten çok sonra bile pahalı kalmasının nedeni de bu.",
      },
    },
  },
};
