import type en from "../en/word-embeddings-3d";

/** Türkçe metin: word-embeddings-3d. Şekli `en/word-embeddings-3d.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    gloveVectors:
      "Bu laboratuvarın okuduğu vektörleri destekler. Üç boyutlu görünüm izdüşümü değiştirir, altındaki gömmeleri değil.",
  },
  lede: "Aynı kelimeler, aynı vektörler, bir eksen daha. Bulutu döndürmek için sürükleyin.",
  honesty:
    "Bu, gömmenin gerçek görüntüsü değildir. Uzayın 300 boyutu var; döndürdüğünüz şey, onun üç PCA eksenine indirgenmiş bir görünümü: düz haritadan bir eksen fazla, yine de neredeyse hiçbiri.",
  compare:
    "Bu bir prototip ve dersten bilerek ayrı tutuldu. Derinlik, bulutu bir mekân gibi hissettiriyor; ama projeksiyonu daha doğru yapmıyor. Bu takasın öğretmeye değip değmediğine karar vermek, prototipi yapmanın asıl sebebi.",
  error: "Kelime vektörleri yüklenemedi.",
  varianceLabel: "Açıklanan varyans",
  varianceHint: (dimensions: number) => `${dimensions} eksenin üçü`,
  selectedLabel: "Seçili",
  recapTitle: "Bu prototip ne gösteriyor",
  recap: {
    lessons: [
      "Üç eksen, uzayın ikiden biraz fazlasını taşıyor, yine de neredeyse hiçbirini.",
      "Derinlik bulutu bir mekân gibi hissettiriyor; bu, bilgilendirici olsun ya da olmasın ikna edici.",
      "Kelimeler, vektörler ve en yakın komşular düz haritayla birebir aynı; değişen yalnızca görüş.",
    ],
  },
  map: {
    mapLabel:
      "Üç boyutta kelime bulutu. Döndürmek için sürükleyin. Ok tuşları en yakın kelimeler arasında gezinir, Shift ve ok tuşları görüşü çevirir, Enter seçer.",
    hint: "Döndürmek için sürükle · Shift + ok tuşları",
    pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
    neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
      `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}`,
    selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Seçili`,
    pending: "Üç eksen hesaplanıyor…",
  },
};

export default copy;
