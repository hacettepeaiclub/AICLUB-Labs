import type en from "../en/tokenization";

/** Türkçe metin: tokenization. Şekli `en/tokenization.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Sources",
    subwordBpe:
      "Bayt çifti kodlamasını bir alt sözcük parçalama yöntemi olarak destekler. Buradaki sözlük, laboratuvarın kendi küçük eğitim metnini üzerinde eğitilir; herhangi bir üretim modelinin sözlüğü değildir.",
  },
  honesty:
    "Bu lab birkaç kilobaytlık metinle eğitilen küçük bir BPE tokenizer kullanır. Belirli bir GPT modelinin tokenizer’ını temsil etmez.",
  nothingToTokenize: "Henüz tokenleştirilecek bir şey yok.",
  stripSummary: (label: string, count: number, list: string) => `${label}. ${count} token: ${list}`,

  guess: {
    sectionLabel: "Guess the cuts",
    heading: "Where do you think this gets cut?",
    lede: "Cümlenin hangi parçalara ayrılacağını tahmin et. Bir parçanın başlangıcı olduğunu düşündüğün harfleri işaretle, sonra tokenizer’ın sonucunu aç.",
    stripLabel: (sentence: string) =>
      `“${sentence}” cümlesi. Nerelerden ayrıldığını düşünüyorsanız işaretle. Sol ve sağ yön tuşlarıyla hareket edin, Boşluk ile kesik koyun veya kaldırın.`,
    cellLabel: (character: string, position: number) =>
      `${character} karakterinden önce kes, konum ${position}`,
    theSpace: "boşluk",
    hint: "Bir harfin önünden kesmek için ona dokun. Şerit odaktayken",
    hintMove: "hareket eder,",
    hintPlace: "kesik koyar.",
    hintSpace: "bir boşluğu gösterir.",
    reveal: "Sonucu aç",
    preparing: "Hazırlanıyor…",
    cutEveryWord: "Her kelimeden kes",
    legendReal: "tokenizer’ın seçtiği sınır",
    legendImagined: "eşleşmeyen tahmin",
    legendMatched: "eşleşen tahmin",
    resultOne: (matched: boolean) =>
      matched
        ? "İşaretlediğin sınır tokenizer’ın sonucuyla eşleşiyor."
        : "İşaretlediğin sınır tokenizer’ın seçtiği sınırlardan biri değil.",
    resultMany: (guessed: number, matched: number) =>
      `İşaretlediğin ${guessed} sınırdan ${matched} tanesi tokenizer’ın sonucuyla eşleşiyor.`,
    resultTail: (actual: number, tokens: number) =>
      `Tokenizer metni ${tokens} parçaya ayırdı. Parçalar arasında ${actual} sınır var.`,
    explain:
      "Kelime değiller. “gardeners” ikiye ayrıldı: “garden” ve “ers”. Nokta tek başına duruyor ve her boşluk kendisinden sonraki kelimeye aittir, aralarında durmuyor.",
    actualLabel: "Cümlenin gerçekte ayrıldığı parçalar",
    announceCleared: "Temizlendi. Kesikleri yeniden işaretle.",
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
        ? `Hiç kesik işaretlemedin. Tokenizer ${actual} kesik yaptı ve cümleyi ${tokens} tokene ayırdı.`
        : `${guessed} kesik işaretledin. Bunlardan ${matched} tanesi gerçek. ` +
          `${imagined} tanesi orada değil. ${missed} tanesini kaçırdın. ` +
          `Tokenizer toplam ${actual} kesik yaptı ve cümleyi ${tokens} tokene ayırdı.`,
    figures: {
      yourCuts: "kesiklerin",
      matched: "Tutan",
      actualCuts: "Gerçek kesikler",
      tokens: "Parça",
    },
  },

  train: {
    kicker: "Where the pieces come from",
    title: "Nobody chose those pieces.",
    lede: "Bu küçük eğitim metninde en sık geçen komşu çifti bul. Birleştir düğmesi, bu çiftin bütün eşleşmelerini tek parçaya dönüştürür. Sonraki adım için çiftler yeniden sayılır.",
    corpusLabel: "Okuduğu eğitim metni",
    mergeNext: "Sıradaki çifti birleştir",
    trainAll: "Tümünü eğit",
    training: "Eğitiliyor…",
    untouched: (base: number, tokens: number) =>
      `Şu anda her parça tek bir karakter: toplam ${base} parça ve eğitim metninin maliyeti ${tokens} token. En sık geçen çifti birleştir; parça sayısı da maliyet de değişir.`,
    merged: (
      index: number,
      left: string,
      right: string,
      frequency: number,
      token: string,
      vocabulary: number,
      tokens: number,
    ) =>
      `${index}. birleştirme: en sık geçen komşu çift ${left} + ${right} idi, ${frequency} kez görüldü. Artık tek bir token: ${token}. Sözlük: ${vocabulary} parça. Eğitim metninin maliyeti ${tokens} token.`,
    exhausted: (merges: number, vocabulary: number) =>
      `Birleştirilecek bir şey kalmadı. Artık hiçbir çift birden fazla geçmiyor, dolayısıyla birini kaynaştırmak öğrenmek değil ezberlemek olurdu. ${merges} birleştirmede durdu; sözlük ${vocabulary} parçadan oluşuyor.`,
    explain:
      "İşte byte-pair encoding (BPE) budur. Bütün komşu çiftleri say, en sık olanı kaynaştırın, yeniden say. Sonunda elde ettiği parçalar onun sözlüğüdür ve her kaynaşma bir birleştirmedir. Kimse ona “·read” bir kelimedir demedi; bu, ilk dört sayım turunun sırayla ürettiği bir sonuçtan ibaret. Boşluğun daha ilk birleştirmeden itibaren parçaya dâhil olduğuna dikkat edin: öğrendiği parça “read” değil, “·read”. “·every” ise sonuna kadar parçalı kalıyor, çünkü metinde yalnızca bir kez geçiyor.",
    announceFinished:
      "Eğitim tamamlandı. Birden fazla geçen hiçbir çift kalmadı, dolayısıyla birleştirmeye değer bir şey yok.",
    announceFinishedAfter: (merges: number) => `Eğitim ${merges} birleştirmeden sonra tamamlandı.`,
    announceReset: "Eğitim metni sıfırlandı. Henüz hiçbir şey öğrenilmedi.",
    mergesLabel: "Birleştirme",
    vocabularyLabel: "Sözlük",
    corpusTokensLabel: "Eğitim metni parçası",
  },

  merge: {
    kicker: "How much has it learned?",
    title: "“One token” is a moving target.",
    lede: "Kaydırıcıyla kullanılan BPE birleşim sayısını değiştir. Aynı cümlenin parçalara ayrılışını karşılaştır; istersen kendi cümleni yaz.",
    sentenceLabel: "Cümleniz",
    sentenceHint:
      "Cümleyi değiştir ya da kendin yaz. Türkçe veya İngilizce, tokenizer ikisine de yanıt verir.",
    mergesLearned: "Öğrenilen birleştirme",
    mergesValueText: (merges: number, max: number) => `${max} birleştirmeden ${merges} tanesi`,
    untrained: "Eğitimsiz",
    full: "Tamamı",
    stripLabel: (merges: number) => `Cümleniz, ${merges} birleştirme sonrasında`,
    trainingProgress: (done: number, total: number) =>
      `Tokenizer eğitiliyor… ${total} birleştirmeden ${done} tanesi.`,
    ready: "Tokenizer'ın eğitimi tamamlandı. Birleştirme kaydırıcısını sürükle.",
    explain:
      "Sıfır birleştirmede her karakter kendi başına bir tokendir, çünkü tokenizer harflerden başka bir şey bilmiyordur. Sağa doğru sürükle ve “·ev · ler · imiz · den” dizisinin önce “·ev · lerimiz · den”e, sonra “·evlerimiz · den”e dönüşmesini izle. Bu parçalar Türkçe ekler ama algoritmanın hiçbir yerinde ekin ne olduğu yazmıyor; bunlar yalnızca sürekli yan yana çıkan komşular.",
    jumpTo: "Atla",
  },

  compare: {
    kicker: "Trained on what?",
    title: "It cheapens whatever it has read.",
    lede: "Aynı algoritmayla, farklı metinlerde eğitilmiş iki tokenizer’ı karşılaştır. Aynı girdinin token sayıları neden farklı?",
    textLabel: "İki tokenizer'ın da aldığı metin",
    textHint:
      "Metni değiştir ve token sayılarını karşılaştır. Sonuç, her tokenizer’ın eğitim metninde gördüğü karakterlere ve öğrendiği birleşimlere bağlıdır.",
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
    solvedNote: "Çözüldü. Şimdi bir nöron eksiltip yeniden dene.",
    noBest: "Henüz yok. Bol nöronla başlayın, sonra bozulana kadar azalt.",
    bestLine: (neurons: number, accuracy: string, epoch: number) =>
      `En iyi: ${neurons} gizli nöron, ${epoch.toLocaleString("en-US")} epok sonra ${accuracy}.`,
    canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
      `Spiral görevi: ${neurons} gizli nöron, ${epoch} epok sonra ${accuracy} test doğruluğu.`,
    announceSolved: (neurons: number, accuracy: string) =>
      `${neurons} gizli nöronla, ${accuracy} test doğruluğunda çözüldü.`,
    kicker: "The challenge",
    title: "One budget. Two ways to miss it.",
    lede: "İlk görevde tokenizer’ı değiştirmeden metnin token sayısını azalt. İkinci görevde metin sabitken eğitim ayarını değiştir.",
    budgetBadge: (budget: number) => `bütçe ${budget} token`,
    rewriteLabel: "Yeniden yaz",
    rewriteHint:
      "Büyük harfler, boşluklar, noktalama ve gereksiz sözcükler tamamen elinde. Listelenen kelimelerin metinde kalması gerekiyor.",
    rewriteStrip: "Yeniden yazdığın metin, tokenleştirilmiş hâli",
    fixedLabel: "Cümle (değiştirilemez)",
    fixedStrip: "Cümlenin tokenleştirilmiş hâli",
    trainedOn: "Eğitildiği eğitim metni",
    english: "İngilizce",
    turkish: "Türkçe",
    mergesLearned: "Öğrenilen birleştirme",
    unknownNote: (unknown: number) =>
      `${unknown} parça kesik çizgiyle çevrelenmiş ve ? ile işaretlenmiş: bunlar tokenizer'ın daha önce hiç görmediği karakterler. Sıradan düzyazı okudu ve düzyazı neredeyse tamamen küçük harflerden oluşur.`,
    englishCeiling:
      "İngilizce tokenizer'ın tam olarak eğitilmiş hâli bu, bu cümlede varabileceği en iyi nokta burası. Eksik olan şey daha fazla eğitim değil.",
    puzzles: {
      "say-it-cheaper": {
        title: "Say it cheaper",
        brief:
          "Zorunlu kelimelerin hepsini koruyun ve aynı cümleyi bütçenin altına indir. Nasıl yazıldığına dair geri kalan her şeyi değiştirebilirsin.",
        lesson:
          "Anlamda hiçbir şey değişmedi. Büyük harfler tokenizer'ın hiç öğrenmediği parçalar ve çift boşluk başlı başına bir token.",
      },
      "feed-it-the-right-words": {
        title: "Feed it the right words",
        brief:
          "Bu cümle değiştirilemez. Cümle bütçeye sığana kadar tokenizer'ın ne okuduğunu ve ne kadar eğitildiğini seç.",
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
      "BPE tabanlı üretim tokenizer’ları çok daha büyük metinlerle ve sıklıkla bayt düzeyinde eğitilir. Token sayısı yalnız cümlenin uzunluğuna değil, öğrenilen sözlüğe ve birleşimlere de bağlıdır.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Cümledeki parça sınırlarını tahmin et. Ardından BPE sonucuyla karşılaştır ve birleşimlerin nasıl öğrenildiğini incele.",
    stages: {
      guess: {
        strip: "Modelin okuduğu cümle bu. Nereden bölündüğünü düşünüyorsanız işaretle.",
        cut: "Bir harfe dokunduğunda önüne bir kesim konur. Tur bir tane koydu.",
        reveal: "Diğer tahminlerini de işaretle; “Sonucu aç” gerçek kesimleri gösterir.",
      },
      train: {
        corpus: "Okunabilecek kadar küçük bir eğitim metni. Şu anda her parça tek bir karakter.",
        merge: "Birleştir: en sık yan yana gelen çift, geçtiği her yerde tek bir parçaya dönüşür.",
        figures:
          "Şimdiye kadarki birleştirmeler, sözlüğün büyüklüğü ve eğitim metninin token cinsinden maliyeti.",
        all: "Ya da eğitimi tek seferde sonuna kadar götürün.",
      },
      merge: {
        sentence: "Cümleyi istediğin gibi değiştir. Tur bir kelime ekledi.",
        rewind:
          "Bu kaydırıcı eğitimi geri sarar. Az birleştirme öğrenilmişken aynı cümle çok daha fazla token tutar.",
        cost: "Eğitimin bu noktasında parça sayısı ve maliyet.",
      },
      compare: {
        text: "Biri İngilizce, biri Türkçe üzerinde eğitilmiş iki tokenizer. İkisine aynı metni verin; tur bir kelime ekledi.",
        samples: "Ya da buradan bir örnek seç.",
        bill: "Aynı metnin ikisine maliyeti. Her biri okuduğu dilde ucuz.",
      },
      challenge: {
        puzzle: "İki bulmaca, tek bütçe. Bulmacayı yukarıdan seç.",
        verdict: "çalıştıkça sonuç güncellenir: kullanılan token ve bütçe.",
        figures:
          "Token sayısı ve bütçe. İki bulmacadan yalnızca biri daha çok uğraşarak çözülebilir.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      bpe: "Pieces learned by counting",
      quirks: "What a token is, and what it costs",
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
