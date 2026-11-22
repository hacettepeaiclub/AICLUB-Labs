import type en from "../en/word-embeddings";

/**
 * Türkçe metin: word-embeddings. Şekli `en/word-embeddings.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## word-embeddings), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır. Vektörler İngilizce kelimelere aittir;
 * kelimeler özgün hâliyle anılır.
 */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    gloveVectors:
      "Bu lab'ın gerçekten kullandığı vektörlerin kaynağıdır: lab kendi embedding yöntemini uygulamaz, önceden eğitilmiş GloVe vektörlerini okur.",
  },

  predict: {
    question: (word: string) => `${word} kelimesine en yakın hangisi?`,
    hint: "Üçü de ilgili. Hangisini beklediğini seç.",
    loading: "Kelime vektörleri yükleniyor…",
    chose: (word: string, rank: number, total: number, score: string) =>
      `${word} seçtin: ${total} kelime içinde en yakın ${rank}. kelime, kosinüs benzerliği ${score}.`,
    nearest: (word: string, score: string) => `En yakını ${word}, kosinüs benzerliği ${score}.`,
    because:
      "Bu vektörler kelimelerin ne anlama geldiğinden değil, nasıl kullanıldığından öğrenildi. Haber ve ansiklopedi metinlerinde apple, meyvelerle olduğundan çok daha sık software ile birlikte geçer.",
  },

  explore: {
    title: "Kelime haritası",
    neighboursTitle: "En yakın kelimeler",
    announce: (word: string, gloss: string) => `${word} seçildi, ${gloss}.`,
    selectedLabel: "Seçili",
    nearestLabel: "En yakın (kosinüs benzerliği)",
  },

  map: {
    mapLabel: "Kelime haritası. Ok tuşları en yakın kelimeler arasında gezinir, Enter seçer.",
    pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
    neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
      `${word}, ${gloss}. En yakın ${rank}. kelime, benzerlik ${score}`,
    selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Seçili`,
    pending: "Kelimelerin nereye düştüğü hesaplanıyor…",
    linksNote:
      "Çizgiler seçili kelimeyi yanda listelenen sekiz kelimeye bağlar. Yalnızca okumayı kolaylaştırır, modelin parçası değildir: embedding uzayında bağlantı yoktur, yalnızca uzaklıklar vardır.",
    pinnedLabel: (word: string, gloss: string) =>
      `${word} (${gloss}), karşılaştırma için tutuluyor`,
    compareLabel: (a: string, b: string, score: string) =>
      `${a} ile ${b} arasındaki benzerlik ${score}.`,
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
      `${word}, ${gloss}. En yakın ${rank}. kelime, benzerlik ${score}. Haritayı bu kelimeye ortalamak için seç.`,
  },

  projection: {
    kicker: "Haritanın göstermedikleri",
    title: "Uzayın kendisine bakmıyorsun",
    lede: "Yukarıdaki kelimeler gerçek. Konumları ise 300 sayının 2 sayıya indirilmesiyle bulundu ve böyle bir indirgeme bir şey kaybetmek zorunda. Neyin kaybolduğunu tam olarak burada görürsün.",
    modeLabel: "Göster",
    modeNone: "Kendi seçimim",
    modeHidden: "Yakın ama uzak çizilmiş",
    modeFalse: "Uzak ama yakın çizilmiş",
    idle: "Yukarıdaki iki seçenekten birini seç ve o kelimelerin haritada nerede durduğuna bak.",
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
      `${a} ile ${b}, ${total} çift içinde en yakın ${rank} çift; kosinüs benzerliği ${score}. İzdüşüm onları birbirinden haritanın genişliğinin ${percent} kadarı uzağa koydu: resme bakarak ilişkili olduklarını tahmin edemezdin.`,
    falseBody: (
      a: string,
      b: string,
      screenRank: string,
      trueRank: string,
      total: number,
      score: string,
    ) =>
      `${a} ile ${b} ekranda en yakın ${screenRank} çift, neredeyse bitişik. Gerçek uzayda ise ${total} çift içinde ${trueRank} sıradalar; kosinüs benzerliği ${score}. Bu yakınlık yalnızca resimde var.`,
    varianceLabel: "Açıklanan varyans",
    varianceHint: (first: string, second: string) => `PC1 ${first} + PC2 ${second}`,
    varianceBody: (percent: string, remaining: number) =>
      `Bu iki eksen (iki temel bileşen), bu veri kümesindeki varyansın ${percent} kadarını açıklıyor. Geri kalan varyans kaybolmadı: düz bir ekranda yeri olmayan diğer ${remaining} yön boyunca duruyor.`,
    correlationLabel: "Uzaklık uyumu (Spearman)",
    correlationHint: "−1,00: ekran uzaklıklarının sırası benzerlik sırasıyla tam uyuşurdu",
    pending: "İzdüşüm hesaplanıyor…",
  },

  data: {
    error: "Kelime vektörleri yüklenemedi.",
  },

  recap: {
    lessons: [
      "Bir embedding, bir öğeyi vektöre çevirir; böylece öğeler arasındaki ilişkiler uzaklığa dönüşür.",
      "Bu ilişkiler kelimelerin anlamından değil, birlikte nasıl kullanıldıklarından gelir.",
      "300 boyutlu bir uzayın 2 boyutlu haritası bir gölgedir: gösterdiğinin bir kısmı orada yoktur, orada olanın bir kısmı da gösterilmez.",
    ],
  },

  honesty: {
    source:
      "Vektörler GloVe 6B 300d: Stanford NLP tarafından Wikipedia 2014 ve Gigaword 5 üzerinde önceden eğitildi. Bu lab her kelimeyi yayımlanmış tabloda bulur ve birim uzunluğa normalleştirir; burada hiçbir şey eğitilmez, ince ayar yapılmaz ya da üretilmez.",
    turkish:
      "Embedding uzayı İngilizcedir. Burada görünen Türkçe kelimeler okumayı kolaylaştırmak için eklediğimiz etiketlerdir: vektörleri yoktur ve bu bir Türkçe embedding uzayı değildir.",
  },
  compare: {
    title: "İki kelimeyi karşılaştır",
    hold: "Bu kelimeyi tut",
    holding: (word: string) => `Tutulan kelime: ${word}`,
    release: "Bırak",
    idle: "Bir kelimeyi tut, sonra haritadan bir başkasını seç. Aralarındaki kosinüs benzerliği bir tablodan alınmaz, o anda hesaplanır.",
    samePoint: "Tuttuğun kelime bu. Başka birini seç.",
    scoreLabel: "Benzerlik",
    rankLabel: "Sıra",
    rankValue: (rank: number, total: number) => `${total} kelimede ${rank}.`,
    sentence: (a: string, b: string, score: string, rank: number, total: number) =>
      `${a} ile ${b} arasındaki kosinüs benzerliği ${score}. Diğer ${total} kelime içinde ${b}, ${a} kelimesine en yakın ${rank}. kelime.`,
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Her kelimenin bir anlam haritasında bir yeri var. Hangi kelimelerin birbirine yakın durduğunu tahmin et, sonra haritada dolaş.",
    stages: {
      intro: {
        guess: "Bir kelime ve üç aday. Haritada hangisi ona en yakın?",
        choose: "Birini seç. Harita açılır ve kelimelerin gerçekte nerede durduğunu gösterir.",
      },
      map: {
        map: "Her kelimenin bir yeri var. Haritanın yanındaki liste, seçili kelimenin en yakın komşuları.",
        search: "Seçmek için bir kelime ara. Tur dog yazdı.",
        enter: "Enter onu seçer ve harita oraya gider.",
        compare: "Buradan iki kelimeyi karşılaştırıp gerçekte ne kadar uzak olduklarına bak.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      vectors: "Vektör olarak kelimeler",
      usage: "Anlam kullanımdan gelir",
      shadow: "İki boyutlu harita bir gölgedir",
    },
    notes: {
      "sq-word2vec": "word2vec'in kelimeleri nasıl sayılara çevirdiği.",
      "cp-vectoring": "Kelime vektörleri ve ünlü king − man + woman örneği.",
      "alammar-word2vec": "Çizimlerle word2vec.",
      "cs224n-l1":
        "Stanford'un ilk dersi: anlam, kelimenin birlikte kullanıldığı kelimelerden gelir.",
      "sq-pca": "Lab'daki haritanın kullandığı izdüşüm: PCA.",
      "distill-tsne": "Başka bir izdüşüm, aynı uyarı: haritadaki uzaklıklar yanıltabilir.",
      "slp-embeddings":
        "Birlikte görülme sayımlarından word2vec eğitimine geçer. Kosinüs benzerliğini asıl vektörlerde değerlendir; iki boyutlu haritadaki yakınlık aynı sonucu vermeyebilir. PDF, İngilizce.",
    },
  },
};

export default copy;
