import type en from "../en/word-embeddings-3d";

/**
 * Türkçe metin: word-embeddings-3d. Şekli `en/word-embeddings-3d.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## word-embeddings, ## pca), anlatım
 * kuralları docs/language/tr-style.md dosyasındadır.
 */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    gloveVectors:
      "Bu lab'ın okuduğu vektörlerin kaynağıdır. Üç boyutlu görünüm izdüşümü değiştirir, altındaki embedding vektörlerini değil.",
  },
  lede: "Aynı kelimeler, aynı vektörler, bir eksen daha. Bulutu döndürmek için sürükle.",
  honesty:
    "Embedding uzayı böyle görünmez. Uzay 300 boyutludur; döndürdüğün şey, onun üç PCA eksenine indirilmiş bir görünümüdür. Bu, düz haritadan bir eksen fazladır ve yine de 300 eksenin neredeyse hiçbiri değildir.",
  compare:
    "Bu bir prototip ve dersten bilerek ayrı tutuldu. Derinlik bulutu bir yer gibi hissettirir, ama izdüşümü daha doğru yapmaz. Bu ödünleşimin öğretmeye değip değmediğini değerlendirmek, prototipi yapmanın amacıdır.",
  error: "Kelime vektörleri yüklenemedi.",
  varianceLabel: "Açıklanan varyans",
  varianceHint: (dimensions: number) => `${dimensions} eksenin üçü`,
  selectedLabel: "Seçili",
  neighbours: {
    title: (word: string) => `${word} kelimesine en yakınlar, 300 boyutun tamamında`,
    rankHeader: "Sıra",
    wordHeader: "Kelime",
    scoreHeader: "Benzerlik",
    rowLabel: (word: string, gloss: string, rank: number, score: string) =>
      `${word}, ${gloss}. En yakın ${rank}. kelime, benzerlik ${score}. Bulutu bu kelimeye ortalamak için seç.`,
  },
  neighboursNote:
    "Bu kosinüs benzerlikleri tam vektörlerden hesaplanır; kelimeler ne kadar yakın ya da uzak görünürse görünsün, bulutu döndürmek onları değiştirmez.",
  recapTitle: "Bu prototip ne gösteriyor",
  recap: {
    lessons: [
      "Üç eksen, uzaydaki varyansın iki eksenden biraz fazlasını taşır; yine de neredeyse hiçbirini.",
      "Derinlik bulutu bir yer gibi hissettirir; bu his, bilgi verse de vermese de ikna edicidir.",
      "Kelimeler, vektörler ve en yakın kelimeler düz haritadakiyle aynıdır; değişen yalnızca görünüm.",
    ],
  },
  map: {
    mapLabel:
      "Üç boyutlu kelime bulutu. Döndürmek için sürükle. Ok tuşları en yakın kelimeler arasında gezinir, Shift ile ok tuşları görünümü döndürür, Enter seçer.",
    hint: "Seçmek için bir kelimeye dokun · döndürmek için sürükle · çevresinde dönmek için Shift + ok tuşları",
    pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
    neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
      `${word}, ${gloss}. En yakın ${rank}. kelime, benzerlik ${score}`,
    selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Seçili`,
    pending: "Üç eksen hesaplanıyor…",
  },
};

export default copy;
