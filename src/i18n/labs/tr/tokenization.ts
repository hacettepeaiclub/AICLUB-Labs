import type en from "../en/tokenization";

/**
 * Türkçe metin: tokenization. Şekli `en/tokenization.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## tokenization), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır. "token" Türkçe yazımına göre ek alır
 * (tokenler, tokene); "tokenizer" kesme işaretiyle (tokenizer'ın).
 */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    subwordBpe:
      "Bayt çifti kodlamasını (BPE) bir alt sözcük bölütleme yöntemi olarak savunur. Buradaki sözlük bu lab'ın kendi küçük derlemi üzerinde eğitildi; herhangi bir üretim modelinin tokenizer'ı değildir.",
  },
  honesty:
    "Bu lab için birkaç kilobaytlık metinle eğitilmiş küçük bir BPE tokenizer; herhangi bir GPT modelinin kullandığı tokenizer değildir.",
  nothingToTokenize: "Henüz tokenlere ayrılacak bir metin yok.",
  stripSummary: (label: string, count: number, list: string) => `${label}. ${count} token: ${list}`,

  guess: {
    sectionLabel: "Kesimleri tahmin et",
    heading: "Bu cümle sence nerelerden kesiliyor?",
    lede: "Bir dil modeli bu cümleyi hiçbir zaman harf harf görmez; tam olarak kelime kelime de görmez. Ne gördüğünü söylemeden önce, cümlenin nerelerden kesildiğini düşünüyorsan oraları işaretle. Sonra “Sonucu göster” düğmesine bas.",
    stripLabel: (sentence: string) =>
      `“${sentence}” cümlesi. Nerelerden kesildiğini düşünüyorsan işaretle. Hareket etmek için sol ve sağ ok tuşlarını, kesim koymak ya da kaldırmak için boşluk tuşunu kullan.`,
    cellLabel: (character: string, position: number) =>
      `${character} karakterinden önce kes, konum ${position}`,
    theSpace: "boşluk",
    hint: "Bir harfin önünden kesmek için ona dokun. Şerit seçiliyken",
    hintMove: "hareket ettirir,",
    hintPlace: "kesim koyar.",
    hintSpace: "boşluğu gösterir.",
    reveal: "Sonucu göster",
    preparing: "Hazırlanıyor…",
    cutEveryWord: "Her kelimeden kes",
    legendReal: "tokenizer'ın gerçekten kestiği yer",
    legendImagined: "işaretlediğin ama orada olmayan kesim",
    legendMatched: "bunu buldun",
    resultOne: (matched: boolean) =>
      matched
        ? "1 kesim işaretledin ve bu gerçek kesimlerden biri."
        : "1 kesim işaretledin ve bu gerçek kesimlerden biri değil.",
    resultMany: (guessed: number, matched: number) =>
      `${guessed} kesim işaretledin; bunlardan ${matched} tanesi gerçek.`,
    resultTail: (actual: number, tokens: number) =>
      `Tokenizer toplam ${actual} kesim yaptı ve geriye ${tokens} parça kaldı.`,
    explain:
      "Kelimeler değil. “gardeners”, “garden” ve “ers” diye ikiye ayrıldı; nokta tek başına duruyor ve her boşluk iki kelimenin arasında durmak yerine kendisinden sonraki kelimeye ait.",
    actualLabel: "Cümlenin gerçekte kesildiği parçalar",
    announceCleared: "Temizlendi. Kesimleri yeniden işaretle.",
    announceEveryWord: "Her kelimenin önüne bir kesim konuldu.",
    describe: (
      guessed: number,
      matched: number,
      imagined: number,
      missed: number,
      actual: number,
      tokens: number,
    ) =>
      guessed === 0
        ? `Hiç kesim işaretlemedin. Tokenizer ${actual} kesim yaptı ve cümleyi ${tokens} tokene ayırdı.`
        : `${guessed} kesim işaretledin. Bunlardan ${matched} tanesi gerçek, ${imagined} tanesi orada değil. ${missed} kesimi kaçırdın. Tokenizer toplam ${actual} kesim yaptı ve cümleyi ${tokens} tokene ayırdı.`,
    figures: {
      yourCuts: "Senin kesimlerin",
      matched: "Tutan",
      actualCuts: "Gerçek kesimler",
      tokens: "Parça",
    },
  },

  train: {
    kicker: "Parçalar nereden geliyor",
    title: "Bu parçaları kimse seçmedi.",
    lede: "Sayılarak bulundular. İşte izlenebilecek kadar küçük bir derlem: “Sıradaki çifti birleştir” düğmesine bastığında, derlemde en sık yan yana gelen çift tek parçaya dönüşür. Birleştirme her kelime parçasının (ön-token) içinde, örtüşmeyen geçişlerde, soldan sağa yapılır. Sonra sayım baştan yapılır.",
    corpusLabel: "Okuduğu derlem",
    mergeNext: "Sıradaki çifti birleştir",
    trainAll: "Sonuna kadar eğit",
    training: "Eğitiliyor…",
    untouched: (base: number, tokens: number) =>
      `Şu anda her parça tek bir karakter: toplam ${base} farklı parça var ve derlem ${tokens} token tutuyor. En sık geçen çifti birleştir ve ne değiştiğine bak.`,
    merged: (
      index: number,
      left: string,
      right: string,
      frequency: number,
      token: string,
      vocabulary: number,
      tokens: number,
    ) =>
      `${index}. birleştirme: en sık yan yana gelen çift ${left} + ${right} idi, ${frequency} kez görüldü. Artık tek bir token: ${token}. Sözlük: ${vocabulary} parça. Derlem ${tokens} token tutuyor.`,
    exhausted: (merges: number, vocabulary: number) =>
      `Birleştirilecek bir şey kalmadı: hiçbir çift birden fazla geçmiyor, bu yüzden bir çifti birleştirmek öğrenmek değil ezberlemek olurdu. ${merges} birleştirmede durdu; sözlükte ${vocabulary} parça var.`,
    explain:
      "Bayt çifti kodlaması (BPE) budur: yan yana gelen bütün çiftleri say, en sık olanı birleştir, yeniden say. Sonunda elde edilen parçalar sözlüktür ve her birleştirme bir “merge” kuralıdır. Kimse ona “·read” diye bir kelime olduğunu söylemedi; bu, ilk dört sayım turunun çift çift ürettiği sonuçtur. Boşluğun daha ilk birleştirmeden itibaren parçaya katıldığına dikkat et: öğrenilen parça “read” değil, “·read”. “·every” ise sonuna kadar parçalı kalır, çünkü derlemde yalnızca bir kez geçer.",
    announceFinished:
      "Eğitim tamamlandı. Birden fazla geçen hiçbir çift kalmadı, yani birleştirmeye değer bir şey yok.",
    announceFinishedAfter: (merges: number) => `Eğitim ${merges} birleştirmeden sonra tamamlandı.`,
    announceReset: "Derlem sıfırlandı. Henüz hiçbir şey öğrenilmedi.",
    mergesLabel: "Birleştirme",
    vocabularyLabel: "Sözlük",
    corpusTokensLabel: "Derlemdeki parça",
  },

  merge: {
    kicker: "Ne kadar öğrendi?",
    title: "“Bir token”ın ne olduğu eğitimle değişir.",
    lede: "Bu tokenizer birkaç kilobaytlık Türkçe metin okudu. Eğitimini geri sarmak için kaydırıcıyı sürükle ve cümleyi istediğin gibi değiştir. Parçalar her konumda gerçekten yeniden hesaplanır.",
    sentenceLabel: "Cümlen",
    sentenceHint:
      "Cümleyi değiştir ya da kendin yaz. Türkçe ya da İngilizce olabilir; tokenizer ikisini de parçalara ayırır.",
    mergesLearned: "Öğrenilen birleştirme",
    mergesValueText: (merges: number, max: number) => `${max} birleştirmenin ${merges} tanesi`,
    untrained: "Eğitilmemiş",
    full: "Tam",
    stripLabel: (merges: number) => `Cümlen, ${merges} birleştirmeyle`,
    trainingProgress: (done: number, total: number) =>
      `Tokenizer eğitiliyor… ${total} birleştirmenin ${done} tanesi tamam.`,
    ready: "Tokenizer'ın eğitimi bitti. Birleştirme kaydırıcısını sürükle.",
    explain:
      "Sıfır birleştirmede her karakter ayrı bir tokendir, çünkü tokenizer harflerden başka bir şey bilmez. Kaydırıcıyı sağa sürükle ve “·ev · ler · imiz · den” dizisinin önce “·ev · lerimiz · den”, sonra “·evlerimiz · den” hâline gelişine bak. “ev” köktür. Sonraki parçalar Türkçe eklerle örtüşür, ama algoritmada ekin ne olduğunu bilen hiçbir şey yoktur: bunlar yalnızca bu derlemde sürekli yan yana çıkan komşulardır.",
    jumpTo: "Şuraya atla",
  },

  compare: {
    kicker: "Ne okuyarak eğitildi?",
    title: "Okuduğu dilde daha az token tutar.",
    lede: "Aynı algoritma, aynı miktarda eğitim, farklı okuma. İki tokenizer'a aynı metni ver ve token sayılarının nasıl ayrıldığına bak; sonra aradaki farkı kapatan bir metin yazmayı dene.",
    textLabel: "İki tokenizer'ın da aldığı metin",
    textHint:
      "Metni istediğin gibi değiştir ve iki token sayısını karşılaştır. Bu iki küçük tokenizer'da, okunmamış dildeki metin genellikle daha çok token tutar.",
    trainedOnEnglish: "İngilizce metinle eğitildi",
    trainedOnTurkish: "Türkçe metinle eğitildi",
    englishCorpus: "birkaç kilobaytlık İngilizce düzyazı",
    turkishCorpus: "birkaç kilobaytlık Türkçe düzyazı",
    tokens: "token",
    cheaper: "Bu metin burada daha az token tutuyor.",
    ratio: (ratio: string) =>
      `Aynı karakterler, aynı algoritma, aynı sayıda birleştirme; yine de biri diğerinin ${String(ratio).replace(".", ",")} katı token tutuyor. Aradaki tek fark, iki tokenizer'ın okuduğu derlem.`,
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
      `Spiralde ${accuracy} test doğruluğuna ulaş, hem de olabildiğince az gizli nöronla.`,
    solvedNote: "Çözüldü. Şimdi bir nöron eksilt ve yeniden dene.",
    noBest: "Henüz yok. Çok nöronla başla, sonra ağ şekli tutamayana kadar azalt.",
    bestLine: (neurons: number, accuracy: string, epoch: number) =>
      `En iyi: ${neurons} gizli nöron, ${epoch.toLocaleString("tr-TR")} epok sonra ${accuracy}.`,
    canvasLabel: (neurons: number, accuracy: string, epoch: number) =>
      `Spiral görevi: ${neurons} gizli nöron, ${epoch} epok sonra ${accuracy} test doğruluğu.`,
    announceSolved: (neurons: number, accuracy: string) =>
      `${neurons} gizli nöronla, ${accuracy} test doğruluğuyla çözüldü.`,
    kicker: "Görev",
    title: "Tek bütçe, aşmanın iki yolu.",
    lede: "İlk bulmacada tokenizer sabit, cümle senin elinde. İkincisinde cümle sabit, tokenizer senin elinde. Yalnızca biri daha çok uğraşarak çözülebilir.",
    budgetBadge: (budget: number) => `bütçe: ${budget} token`,
    rewriteLabel: "Yeniden yaz",
    rewriteHint:
      "Büyük harfleri, boşlukları, noktalamayı ve dolgu sözcüklerini değiştirebilirsin. Değerlendirme yalnızca iki şeye bakar: listelenen kelimelerin metinde geçmesi (büyük-küçük harf fark etmez) ve token sayısının bütçe içinde olması.",
    rewriteStrip: "Yeniden yazdığın metin, tokenlere ayrılmış hâliyle",
    fixedLabel: "Cümle (değiştirilemez)",
    fixedStrip: "Cümle, tokenlere ayrılmış hâliyle",
    trainedOn: "Okuduğu metin",
    english: "İngilizce",
    turkish: "Türkçe",
    mergesLearned: "Öğrenilen birleştirme",
    unknownNote: (unknown: number) =>
      `${unknown} parça kesikli çerçeveli ve ? ile işaretli: bu tokenizer'ın hiç görmediği karakterler. Sıradan düzyazı okudu ve düzyazı neredeyse tamamen küçük harftir.`,
    englishCeiling:
      "Bu, İngilizce tokenizer'ın tam eğitilmiş hâli: bu cümlede ulaşabileceği en iyi sonuç. Eksik olan daha fazla eğitim değil.",
    puzzles: {
      "say-it-cheaper": {
        title: "Daha ucuza söyle",
        brief:
          "Zorunlu kelimelerin hepsini koru ve cümleyi bütçenin altına indir. Cümlenin anlamını korumaya çalış; değerlendirme sıra, dil bilgisi ya da anlam denetlemez, yalnızca zorunlu kelimelere ve token sayısına bakar.",
        lesson:
          "Bu cümlede büyük harfler, tokenizer'ın öğrenmediği parçalara düşer ve çift boşluk ayrı bir token tutar; anlamı değiştirmeden token sayısı düşebilir.",
      },
      "feed-it-the-right-words": {
        title: "Doğru metni okut",
        brief:
          "Bu cümle değiştirilemez. Cümle bütçeye sığana kadar tokenizer'ın hangi metni okuduğunu ve ne kadar eğitildiğini seç.",
        lesson:
          "Bu cümlede İngilizce tokenizer'ı tam eğitmek bile bütçeye yetmedi; Türkçe metinle eğitilen tokenizer yetti. Bu örnekte farkı eğitim süresi değil, okunan derlem yarattı.",
      },
    },
    verdict: {
      untouched: (tokens: number, budget: number) =>
        `Şu hâliyle ${tokens} token tutuyor. Bütçe: ${budget} token.`,
      missingWords: (words: readonly string[]) =>
        `Şunlar hâlâ eksik: ${words.map((w) => `“${w}”`).join(", ")}. Listelenen kelimelerin hepsi metinde geçmeli.`,
      overBudget: (tokens: number, budget: number) =>
        `${tokens} token: ${budget} tokenlik bütçeyi ${tokens - budget} token aşıyor.`,
      passed: (tokens: number, budget: number) =>
        `${tokens} token: ${budget} tokenlik bütçenin içinde.`,
      solvedAnnounce: (message: string) => `Çözüldü. ${message}`,
    },
    puzzleLabel: "Bulmaca",
    tokensLabel: "Token",
    budgetLabel: "Bütçe",
  },

  recap: {
    lessons: [
      "Bir tokenizer metni kelimelere değil, sık rastlanmış parçalara ayırır",
      "Bu parçalar sayılarak öğrenilir: en sık yan yana gelen çifti birleştir, sonra yeniden say",
      "Kaç birleştirme öğrenildiği neyin tek token sayılacağını belirler; kazancın çoğu ilk birleştirmelerde gelir",
      "Baştaki boşluk kendisinden sonraki kelimeye aittir; bu yüzden boşlukların ve büyük harflerin bir bedeli vardır",
      "Aynı cümle, tokenizer'ın hangi metinle eğitildiğine göre çok farklı sayıda token tutar",
      "Bu lab'daki tokenizer'larda Türkçe ekler, Türkçe metinle eğitilen tokenizer'da tek token hâline geldi; İngilizce metinle eğitilende gelmedi",
    ],
    footer:
      "Bayt düzeyinde BPE kullanan gerçek modellerin tokenizer'ları da böyle eğitilir, ama çok daha fazla metinle ve karakterler yerine ham baytlar üzerinde. Eğitim verisinde az bulunan bir dilin, model o dili kullanmayı öğrendikten sonra bile çok token tutmaya devam edebilmesinin nedeni budur.",
  },

  tour: {
    intro:
      "Bir dil modeli metni parça parça okur. Bir cümlenin nereden kesildiğini tahmin et, sonra gerçekte nereden kesildiğini gör.",
    stages: {
      guess: {
        strip: "Modelin okuduğu cümle bu. Nerelerden kesildiğini düşünüyorsan işaretle.",
        cut: "Bir harfe dokunursan önüne bir kesim konur. Tur bir tane koydu.",
        reveal: "Diğer tahminlerini de işaretle; “Sonucu göster” gerçek kesimleri gösterir.",
      },
      train: {
        corpus: "Okunabilecek kadar küçük bir derlem. Şu anda her parça tek bir karakter.",
        merge:
          "Birleştir: en sık yan yana gelen çift tek bir parçaya dönüşür; her kelime parçasının içinde, örtüşmeyen geçişlerde.",
        figures:
          "Şimdiye kadarki birleştirmeler, sözlüğün büyüklüğü ve derlemin kaç token tuttuğu.",
        all: "Ya da eğitimi tek seferde sonuna kadar götür.",
      },
      merge: {
        sentence: "Cümleyi istediğin gibi değiştir. Tur bir kelime ekledi.",
        rewind:
          "Bu kaydırıcı eğitimi geri sarar. Az birleştirme öğrenilmişken aynı cümle çok daha fazla token tutar.",
        cost: "Eğitimin bu noktasında parçalar ve token sayısı.",
      },
      compare: {
        text: "Biri İngilizce, biri Türkçe metinle eğitilmiş iki tokenizer. İkisine aynı metni ver; tur bir kelime ekledi.",
        samples: "Ya da buradan bir örnek seç.",
        bill: "Aynı metnin her birinde kaç token tuttuğu. Bu örneklerde her biri okuduğu dilde daha az token tutuyor.",
      },
      challenge: {
        puzzle: "İki bulmaca, tek bütçe. Bulmacayı yukarıdan seç.",
        verdict: "Sonuç sen çalıştıkça güncellenir: kullanılan token ve bütçe.",
        figures:
          "Token sayısı ve bütçe. İki bulmacadan yalnızca biri daha çok uğraşarak çözülebilir.",
      },
    },
  },

  study: {
    topics: {
      bpe: "Sayılarak öğrenilen parçalar",
      quirks: "Token nedir, neye mal olur",
    },
    notes: {
      "karpathy-tokenizer": "Birleştirmeleriyle birlikte sıfırdan kurulan bir BPE tokenizer.",
      "hf-bpe": "Çözümlü bir örnekle BPE eğitim döngüsü.",
      "cp-glitch": "Bir tokenizer'ın öğrendiği tuhaf tokenler ve bunların modele etkisi.",
      "petrov-unfair": "Aynı metin dillere göre çok farklı sayıda token tutar.",
      "slp-tokens":
        "Ücretsiz taslak bölüm Unicode'u, alt sözcükleri ve BPE'yi anlatır. Türkçe örneklerinden yararlanarak token ile kelimenin neden farklı olduğunu incele. PDF, İngilizce.",
    },
  },
};

export default copy;
