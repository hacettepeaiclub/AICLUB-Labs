import type en from "../en/tokenization";

/** Türkçe metin: tokenization. Şekli `en/tokenization.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    subwordBpe:
      "Bayt çifti kodlamasını bir alt sözcük parçalama yöntemi olarak destekler. Buradaki sözlük, laboratuvarın kendi küçük derlemi üzerinde eğitilir; herhangi bir üretim modelinin sözlüğü değildir.",
  },
  honesty:
    "Bu laboratuvar için birkaç kilobaytlık metin üzerinde eğitilmiş küçük bir BPE tokenizer'ı. Herhangi bir GPT modelinin kullandığı tokenizer değil.",
  nothingToTokenize: "Henüz tokenleştirilecek bir şey yok.",
  stripSummary: (label: string, count: number, list: string) => `${label}. ${count} token: ${list}`,

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
      `Şu anda her parça tek bir karakter: toplam ${base} parça ve derlemin maliyeti ${tokens} token. En sık geçen çifti birleştirin; parça sayısı da maliyet de değişir.`,
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
    announceFinishedAfter: (merges: number) => `Eğitim ${merges} birleştirmeden sonra tamamlandı.`,
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
    lede: "İki tokenizer; aynı algoritma, aynı miktarda eğitim, farklı okuma. İkisine de aynı metni verin: iki fatura birbirinden ayrılır. Sonra aradaki farkı kapatan bir cümle yazmayı deneyin.",
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
    neuronsUsed: "Kullanılan nöron",
    testAccuracy: "Test doğruluğu",
    target: "Hedef",
    objectiveLine: (accuracy: string) =>
      `Spiralde ${accuracy} test doğruluğuna ulaşın: olabildiğince az gizli nöron kullanarak.`,
    solvedNote: "Çözüldü. Şimdi bir nöron eksiltip yeniden deneyin.",
    noBest: "Henüz yok. Bol nöronla başlayın, sonra bozulana kadar azaltın.",
    bestLine: (neurons: number, accuracy: string, epoch: number) =>
      `En iyi: ${neurons} gizli nöron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
    canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
      `Spiral görevi: ${neurons} gizli nöron, ${epoch} epok sonra ${accuracy} test doğruluğu.`,
    announceSolved: (neurons: number, accuracy: string) =>
      `${neurons} gizli nöronla, ${accuracy} test doğruluğunda çözüldü.`,
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
      passed: (tokens: number, budget: number) => `${tokens} token, ${budget} bütçesinin içinde.`,
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

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Bir dil modeli metni parça parça okur. Bir cümleyi nereden böldüğünü tahmin edin, sonra gerçekte nereden böldüğünü açın.",
    stages: {
      guess: {
        strip: "Modelin okuduğu cümle bu. Nereden bölündüğünü düşünüyorsanız işaretleyin.",
        cut: "Bir harfe dokunduğunuzda önüne bir kesim konur. Tur bir tane koydu.",
        reveal: "Diğer tahminlerinizi de işaretleyin; “Sonucu aç” gerçek kesimleri gösterir.",
      },
      train: {
        corpus: "Okunabilecek kadar küçük bir derlem. Şu anda her parça tek bir karakter.",
        merge:
          "Birleştirin: en sık yan yana gelen çift, geçtiği her yerde tek bir parçaya dönüşür.",
        figures:
          "Şimdiye kadarki birleştirmeler, sözlüğün büyüklüğü ve derlemin token cinsinden maliyeti.",
        all: "Ya da eğitimi tek seferde sonuna kadar götürün.",
      },
      merge: {
        sentence: "Cümleyi istediğiniz gibi değiştirin. Tur bir kelime ekledi.",
        rewind:
          "Bu kaydırıcı eğitimi geri sarar. Az birleştirme öğrenilmişken aynı cümle çok daha fazla token tutar.",
        cost: "Eğitimin bu noktasında parça sayısı ve maliyet.",
      },
      compare: {
        text: "Biri İngilizce, biri Türkçe üzerinde eğitilmiş iki tokenizer. İkisine aynı metni verin; tur bir kelime ekledi.",
        samples: "Ya da buradan bir örnek seçin.",
        bill: "Aynı metnin ikisine maliyeti. Her biri okuduğu dilde ucuz.",
      },
      challenge: {
        puzzle: "İki bulmaca, tek bütçe. Bulmacayı yukarıdan seçin.",
        verdict: "Siz çalıştıkça sonuç güncellenir: kullanılan token ve bütçe.",
        figures:
          "Token sayısı ve bütçe. İki bulmacadan yalnızca biri daha çok uğraşarak çözülebilir.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      bpe: "Sayılarak öğrenilen parçalar",
      quirks: "Token nedir, neye mal olur",
    },
    notes: {
      "karpathy-tokenizer": "Birleştirmeleriyle birlikte, sıfırdan kurulan bir BPE tokenizer.",
      "hf-bpe": "Çözümlü örnekle BPE eğitim döngüsü.",
      "cp-glitch": "Bir tokenizer'ın öğrendiği tuhaf token'lar ve modele etkileri.",
      "petrov-unfair": "Aynı metin dillere göre çok farklı maliyet çıkarır.",
    },
  },
};

export default copy;
