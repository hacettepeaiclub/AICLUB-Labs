import type en from "../en/word-embeddings-3d";

/** Türkçe metin: word-embeddings-3d. Şekli `en/word-embeddings-3d.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    gloveVectors:
      "Bu laboratuvar\u0131n okudu\u011fu vekt\u00f6rleri destekler. \u00dc\u00e7 boyutlu g\u00f6r\u00fcn\u00fcm izd\u00fc\u015f\u00fcm\u00fc de\u011fi\u015ftirir, alt\u0131ndaki g\u00f6mmeleri de\u011fil.",
  },
  lede: "Aynı kelimeler, aynı vektörler, bir eksen daha. Bulutu döndürmek için sürükle.",
  honesty:
    "Bu, gömmenin gerçek görüntüsü değildir. Uzayın 300 boyutu var; döndürdüğün şey, onun üç PCA eksenine indirgenmiş bir görünümü: düz haritadan bir eksen fazla, yine de neredeyse hiçbiri.",
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
      "Üç boyutta kelime bulutu. Döndürmek için sürükle. Ok tuşları en yakın kelimeler arasında gezinir, Shift ve ok tuşları görüşü çevirir, Enter seçer.",
    hint: "Döndürmek için sürükle · Shift + ok tuşları",
    pointLabel: (word: string, gloss: string) => `${word}, ${gloss}`,
    neighbourLabel: (word: string, gloss: string, rank: number, score: string) =>
      `${word}, ${gloss}. ${rank}. en yakın, benzerlik ${score}`,
    selectedLabel: (word: string, gloss: string) => `${word}, ${gloss}. Seçili`,
    pending: "Üç eksen hesaplanıyor…",
  },
};

export default copy;
