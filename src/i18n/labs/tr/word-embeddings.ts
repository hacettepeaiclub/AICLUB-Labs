import type en from "../en/word-embeddings";

/** Türkçe metin: word-embeddings. Şekli `en/word-embeddings.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Sources",
    gloveVectors:
      "Bu laboratuvarın gerçekten kullandığı vektörleri destekler: kendi gömme yöntemini uygulamaz, önceden eğitilmiş GloVe vektörlerini okur.",
  },

  predict: {
    question: (word: string) => `${word} kelimesine en yakın hangisi?`,
    hint: "Üçü de ilgili. hangisini beklerdin?",
    loading: "Kelime vektörleri yükleniyor…",
    chose: (word: string, rank: number, total: number, score: string) =>
      `${word} dedin: ${total} kelime içinde ${rank}. sırada, ${score} benzerlikle.`,
    nearest: (word: string, score: string) => `En yakını ${word}, ${score} benzerlikle.`,
    because:
      "Bu vektörler kelimelerin ne anlama geldiğinden değil, nasıl kullanıldığından öğrenildi. Haber ve ansiklopedi metinlerinde apple, meyvelerden çok software ile yan yana geçiyor.",
  },

  explore: {
    title: "Explore the universe",
    neighboursTitle: "Nearest words",
    announce: (word: string, gloss: string) => `${word} seçildi, ${gloss}.`,
    selectedLabel: "Seçili",
    nearestLabel: "En yakın, kosinüs",
  },

  map: {
    mapLabel: "Kelime haritası. Ok tuşları en yakın kelimeler arasında gezinir, Enter seçer.",
    pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
    neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
      `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}`,
    selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Seçili`,
    pending: "Kelimelerin nereye düştüğü hesaplanıyor…",
    linksNote:
      "Çizgiler seçili kelimeyi listelenen sekiz komşusuna bağlar. Bu çizgiler yalnız görünümü açıklar; vektör verisinin parçası değildir.",
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
    title: (word: string) => `Nearest to ${word}`,
    rankHeader: "Sıra",
    wordHeader: "Kelime",
    scoreHeader: "Benzerlik",
    rowLabel: (word: string, gloss: string, rank: number, score: string) =>
      `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}. Haritayı buraya taşımak için seç.`,
  },

  projection: {
    kicker: "What the map is not showing",
    title: "You are not looking at the space",
    lede: "Harita 300 boyutlu kelime vektörlerini iki boyutta gösterir. Bu dönüşüm bazı ilişkileri kaybeder. Ekrandaki uzaklıkları, asıl vektörlerin benzerlikleriyle karşılaştır.",
    modeLabel: "Bana göster",
    modeNone: "Kendi seçimim",
    modeHidden: "Yakın, uzağa çizilmiş",
    modeFalse: "Uzak, yakına çizilmiş",
    idle: "Yukarıdaki ikisinden birini seç; o kelimelerin haritadaki yeri belirsin.",
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
      `${a} ile ${b}, ${total} çift içinde ${rank} en yakın çift, ${score} benzerlikle. Projeksiyon onları haritanın ${percent} kadarı uzağına koydu: resme bakarak ilişkili olduklarını asla tahmin edemezdin.`,
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
      `Bu iki eksen, bu veri kümesindeki varyansın ${percent} kadarını açıklıyor. Geri kalan değişim hiçbir yere gitmedi: düz bir ekranda yeri olmayan diğer ${remaining} yönde duruyor.`,
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
      "Vektörler, Wikipedia 2014 ve Gigaword 5 üzerinde eğitilen Stanford NLP GloVe 6B 300d verisinden alınır. Her vektör birim uzunluğa normalize edilir. Bu labda model eğitilmez veya ince ayar yapılmaz.",
    turkish:
      "Vektörler İngilizce kelimelere aittir. Türkçe etiketler okumayı kolaylaştırmak için eklenmiştir; Bu bir Türkçe gömme uzayı değildir.",
  },
  compare: {
    title: "Compare two words",
    hold: "Bu kelimeyi tut",
    holding: (word: string) => `Tutulan: ${word}`,
    release: "Bırak",
    idle: "Bir kelimeyi tut, sonra haritadan bir başkasını seç. Aralarındaki kosinüs bir yerden bakılmıyor, ölçülüyor.",
    samePoint: "Tuttuğun kelime bu. Başka birini seç.",
    scoreLabel: "Benzerlik",
    rankLabel: "Sıra",
    rankValue: (rank: number, total: number) => `${total} içinde ${rank}.`,
    sentence: (a: string, b: string, score: string, rank: number, total: number) =>
      `${a} ile ${b} arasındaki kosinüs ${score}. Diğer ${total} kelime arasında ${b}, ${a} kelimesine en yakın ${rank}. kelime.`,
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "En yakın kelimeyi tahmin et. Haritadaki konumlarla 300 boyuttaki kosinüs benzerliklerini karşılaştır.",
    stages: {
      intro: {
        guess: "Bir kelime ve üç aday. Haritada hangisi ona en yakın?",
        choose: "Birini seç. Harita açılır ve kelimelerin gerçekte nerede durduğunu gösterir.",
      },
      map: {
        map: "Her kelimenin bir yeri var. Haritanın yanındaki liste, seçili kelimenin en yakın komşuları.",
        search: "Seçmek için bir kelime arayın. Tur dog yazdı.",
        enter: "Enter onu seçer ve harita oraya gider.",
        compare: "Buradan iki kelimeyi karşılaştırıp gerçekte ne kadar uzak olduklarına bak.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      vectors: "Words as vectors",
      usage: "Meaning from usage",
      shadow: "A 2-D map is a shadow",
    },
    notes: {
      "sq-word2vec": "word2vec'in kelimeleri nasıl sayılara çevirdiği.",
      "cp-vectoring": "Kelime vektörleri ve ünlü kral − erkek + kadın.",
      "alammar-word2vec": "Çizimlerle word2vec.",
      "cs224n-l1":
        "Stanford'un ilk dersi: anlam, kelimenin birlikte kullanıldığı kelimelerden gelir.",
      "sq-pca": "Lab'daki haritanın kullandığı izdüşüm: PCA.",
      "distill-tsne": "Başka bir izdüşüm, aynı uyarı: haritadaki uzaklıklar yanıltabilir.",
    },
  },
};

export default copy;
