import type en from "../en/word-embeddings";

/** Türkçe metin: word-embeddings. Şekli `en/word-embeddings.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    gloveVectors:
      "Bu laboratuvar\u0131n ger\u00e7ekten kulland\u0131\u011f\u0131 vekt\u00f6rleri destekler: kendi g\u00f6mme y\u00f6ntemini uygulamaz, \u00f6nceden e\u011fitilmi\u015f GloVe vekt\u00f6rlerini okur.",
  },

  predict: {
    question: (word: string) => `${word} kelimesine en yakın hangisi?`,
    hint: "Üçü de ilgili, sen hangisini beklersin?",
    loading: "Kelime vektörleri yükleniyor…",
    chose: (word: string, rank: number, total: number, score: string) =>
      `${word} dedin: ${total} kelime içinde ${rank}. sırada, ${score} benzerlikle.`,
    nearest: (word: string, score: string) => `En yakını ${word}, ${score} benzerlikle.`,
    because:
      "Bu vektörler kelimelerin ne anlama geldiğinden değil, nasıl kullanıldığından öğrenildi. Haber ve ansiklopedi metinlerinde apple, meyvelerden çok software ile yan yana geçiyor.",
  },

  explore: {
    title: "Evreni keşfet",
    neighboursTitle: "En yakın kelimeler",
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
      "Çizgiler, seçili kelimeyi yanında listelenen sekiz kelimeye bağlar. Bunlar okumayı kolaylaştırmak içindir, modelin parçası değildir: gömmede bağlantı yoktur, yalnızca mesafeler vardır.",
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
      "Vektörler GloVe 6B 300d; Stanford NLP tarafından Wikipedia 2014 ve Gigaword 5 üzerinde önceden eğitildi. Bu lab her kelimeyi o yayımlanmış tablodan arayıp birim uzunluğa normalize ediyor; burada hiçbir şey eğitilmiyor, ince ayar yapılmıyor ya da üretilmiyor.",
    turkish:
      "Gömme uzayı İngilizcedir. Buradaki Türkçe kelimeler okumayı kolaylaştırmak için bizim eklediğimiz etiketlerdir: gömülmediler ve bu bir Türkçe gömme uzayı değildir.",
  },
  compare: {
    title: "İki kelimeyi karşılaştırın",
    hold: "Bu kelimeyi tut",
    holding: (word: string) => `Tutulan: ${word}`,
    release: "Bırak",
    idle: "Bir kelimeyi tutun, sonra haritadan bir başkasını seçin. Aralarındaki kosinüs bir yerden bakılmıyor, ölçülüyor.",
    samePoint: "Tuttuğunuz kelime bu. Başka birini seçin.",
    scoreLabel: "Benzerlik",
    rankLabel: "Sıra",
    rankValue: (rank: number, total: number) => `${total} içinde ${rank}.`,
    sentence: (a: string, b: string, score: string, rank: number, total: number) =>
      `${a} ile ${b} arasındaki kosinüs ${score}. Diğer ${total} kelime arasında ${b}, ${a} kelimesine en yakın ${rank}. kelime.`,
  },
};

export default copy;
