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
    "Embedding uzayı böyle görünmez. Uzay 300 boyutludur; döndürdüğün şey, vektörlerin ilk üç temel bileşen (PCA) koordinatlarının perspektifle çizilmiş bir görünümüdür. İlk iki eksen düz haritadakilerle aynıdır; üçüncü eksen açıklanan varyansı artırır (göstergeye bak), ama döndürme ve perspektif ekranda gördüğün uzaklıkları yine değiştirir.",
  compare:
    "Bu bir prototip ve dersten bilerek ayrı tutuldu. Derinlik bulutu bir yer gibi hissettirir; üçüncü eksen daha çok varyans açıklasa da ekrandaki uzaklıklar hâlâ bakış açısına bağlıdır. Bu ödünleşimin öğretmeye değip değmediğini değerlendirmek, prototipi yapmanın amacıdır.",
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
      `${word}, ${gloss}. En yakın ${rank}. kelime, benzerlik ${score}. Bulutu bu kelimenin etrafında ortalamak için seç.`,
  },
  neighboursNote:
    "Bu kosinüs benzerlikleri tam vektörlerden hesaplanır; kelimeler ne kadar yakın ya da uzak görünürse görünsün, bulutu döndürmek onları değiştirmez.",
  recapTitle: "Bu prototip ne gösteriyor",
  recap: {
    lessons: [
      "Üçüncü eksen açıklanan varyansı artırır; ne kadar arttığını “Açıklanan varyans” göstergesinde gör. Yine de bu, 300 boyutun yalnızca üçüdür.",
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
