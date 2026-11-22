import type en from "../en/pca";

/**
 * Türkçe metin: pca. Şekli `en/pca.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## pca), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır.
 */

const copy: typeof en = {
  percent: (n: number) => `%${n}`,
  decimal: (x: number, digits: number) => x.toFixed(digits).replace(".", ","),
  degrees: (x: number) => `${x.toFixed(1).replace(".", ",")}°`,
  turn: {
    title: "Matris uzayı dönüştürür",
    question:
      "Bir matris, uzaydaki her oku başka bir oka dönüştürür. Kaydırıcılarla v'nin yönünü değiştir ve v ile Av'nin doğrultuları arasındaki açıya bak: çoğu yönde Av, v'nin doğrultusundan sapar. Açıyı 0°'ye yaklaştırarak doğrultusu değişmeyen yönleri bul.",
    planeLabel: (turn: string) =>
      `Matrisin dönüştürdüğü uzay: kutu önce bir küptü, yumurta bir küreydi. Mavi ok v; turuncu ok, matrisin v'yi dönüştürdüğü ok Av. Doğrultuları arasındaki açı ${turn}.`,
    legendV: "v, senin seçtiğin yön",
    legendAv: "Av, matrisin v'yi dönüştürdüğü ok",
    legendFound: "doğrultusu değişmeyen bir yön",
    matrix: "Matris",
    matrices: {
      stretch: "Simetrik",
      shear: "Kayma",
      skew: "Simetrik olmayan",
      rotate: "Döndürme",
    },
    direction: "v: yatay düzlemdeki yönü",
    tilt: "v: yukarı ya da aşağı eğimi",
    dragHint: "Başka bir açıdan bakmak için görüntüyü sürükle.",
    turned: "v ile Av doğrultuları arası açı",
    stretch: "Uzama oranı",
    found: "Bulunan yönler",
    foundCount: (found: number, total: number) => `${total} yönün ${found} tanesi`,
    announceFound: (stretch: string) =>
      `Bir tane buldun: bu yönde Av, v ile aynı doğru üzerinde; matris v'yi yalnızca ${stretch} ile çarpmış. Bu yön bir özvektördür, ${stretch} de onun özdeğeridir.`,
    allFound: "Bu matrisin doğrultusunu değiştirmediği bütün yönleri buldun.",
    rotateNote:
      "Döndürme matrisi, ekseni dışındaki her yönü çevirir. Ekseni yerinde bırakır ve 1 ile çarpar, yani uzunluğunu da değiştirmez. Diğer iki özdeğeri karmaşık sayıdır; uzayda bunları gösteren bir yön yoktur.",
    caption:
      "Sıfırdan farklı bir u için Au = λu ise u bir özvektördür: matris u'yu yalnızca λ sayısıyla çarpar. λ özdeğerdir; 1'den büyükse u uzar, 0 ile 1 arasındaysa kısalır, negatifse yönü ters döner ama doğrultusu aynı kalır. Buradaki dört matristen simetrik olan ile simetrik olmayan, doğrultusunu korudukları üç ayrı doğru verir; kayma matrisi iki, döndürme matrisi yalnızca eksenini verir.",
    matrixEntries: (r1: string, r2: string, r3: string) =>
      `Matris, satır satır: ${r1}; ${r2}; ${r3}.`,
  },
  shadow: {
    kicker: "Matristen veriye",
    title: "En geniş gölge",
    lede: "Her nokta bir kişi: yatay eksende boy, dikey eksende kilo. Bulutun ortasından bir doğru geçiyor ve her nokta bu doğruya dik olarak izdüşürülüyor; izdüşüm, noktanın doğru üzerindeki gölgesidir. “Doğrunun açısı” kaydırıcısıyla doğruyu, izdüşümler olabildiğince geniş yayılana kadar döndür.",
    cloudLabel: (angle: string) =>
      `Her nokta bir kişi. Ortadan geçen doğrunun açısı ${angle}; her noktanın doğru üzerindeki izdüşümü işaretli.`,
    angle: "Doğrunun açısı",
    reveal: "Özvektörleri göster",
    hide: "Özvektörleri gizle",
    variance: "İzdüşümlerin varyansı",
    best: "Bulduğun en büyük varyans",
    first: "λ₁: en büyük varyans",
    second: "λ₂: ona dik yöndeki varyans",
    covariance: "Bulutun kovaryans matrisi",
    covarianceRows: (a: string, b: string, c: string, d: string) =>
      `Var(x) ${a}, Kov(x, y) ${b}; Kov(y, x) ${c}, Var(y) ${d}`,
    revealed:
      "İzdüşümler, kovaryans matrisinin birinci özvektörü boyunca en geniş yayılır ve bu yöndeki varyans birinci özdeğere eşittir. En dar yayılım ikinci özvektör boyuncadır; ikinci özvektör birinciye diktir.",
    data: "Veri",
    clouds: { people: "İnsanlar", round: "Yuvarlak bulut" },
    newSample: "Yeni örneklem çek",
    dataLabel: "Hangi bulut",
    axisPeople: { x: "boy (cm)", y: "kilo (kg)" },
    axisRound: { x: "birinci değişken", y: "ikinci değişken" },
    caption:
      "Bulutun kovaryans matrisi, yukarıdaki ilk matris gibi simetriktir; bu yüzden birbirine dik iki özvektör her zaman seçilebilir. İnsanlar yapay bir örneklemdir: yetişkinlerin boy ve kilolarındaki olağan yayılıma ve korelasyona uyacak biçimde üretildi, hiçbiri ölçülmedi.",
  },
  reduce: {
    kicker: "Daha az sayı",
    title: "İki sayı bire iner",
    lede: "Her noktanın yalnızca izdüşümlerin varyansını en büyük yapan doğru üzerindeki izdüşümünü tut: her kişi iki sayı yerine tek sayıyla anlatılır. İnsanlar bulutunda varyansın çoğu korunur; kaybolan kısım, noktaların doğruya olan dik uzaklıklarından gelir.",
    cloudLabel: (kept: string) =>
      `Bulut ve birinci temel bileşen. Bu doğrunun koruduğu varyans: ${kept}.`,
    flatten: "Tek sayıya indir",
    restore: "İki sayıya dön",
    kept: "Korunan varyans",
    lost: "Kaybolan varyans",
    data: "Veri",
    caption:
      "PCA budur: kovaryans matrisinin özvektörleri, en büyük özdeğerden başlayarak sıralanır ve veri bu yönler boyunca yeniden yazılır. İnsanlarda tek bir doğru varyansın çoğunu korur. Yuvarlak bulutta hiçbir yön öne çıkmaz; tek doğru varyansın yarısından ancak biraz fazlasını korur.",
  },
  bridge: {
    title: "Bu yönler başka nerede karşına çıkar",
    intro: "Aynı özvektörler koleksiyondaki başka lab'larda da kullanılır.",
    items: {
      "word-embeddings":
        "Oradaki harita, her kelimenin 300 sayısını varyansın en büyük olduğu iki yöne indirir ve bu indirgemenin neyi gizlediğini gösterir.",
      "gradient-descent":
        "Oradaki eğrilik oranı, yüzeyin eğrilik matrisinin iki özdeğerinin oranıdır.",
      jepa: "Oradaki anlam haritası da aynı yolla iki boyuta indirilir.",
    },
  },
  recap: {
    lessons: [
      "Bir matris çoğu yönün doğrultusunu değiştirir. Özvektör, matrisin yalnızca bir sayıyla çarptığı sıfırdan farklı vektördür (Au = λu); bu sayı özdeğerdir.",
      "Bir veri bulutunun kovaryans matrisi simetriktir; bu yüzden birbirine dik özvektörler seçilebilir ve bunlar en geniş ile en dar yayılımın yönlerini verir.",
      "PCA veriyi bu yönler boyunca, en büyük varyanstan başlayarak anlatır; varyansı küçük yönler az bilgi kaybıyla atılabilir.",
    ],
    footer:
      "Her şey çizilebilsin diye burada iki boyut kullanıldı. Gerçek uygulamalarda PCA aynı matematiği yüzlerce boyutta, sayısal yöntemlerle çalıştırır.",
  },
  sources: {
    title: "Kaynaklar",
    pearson:
      "Pearson'ın makalesi, noktalara olan uzaklıkların kareleri toplamını en aza indiren doğruyu ya da düzlemi bulur; birinci temel bileşenin geometrik fikri budur.",
    hotelling:
      "Hotelling'in makalesi temel bileşenleri adlandırır ve onları değişkenlerin korelasyon ya da kovaryans matrisinin özvektörleri olarak bulur.",
  },
  tour: {
    intro:
      "Önce bir matrisin doğrultusunu değiştirmediği yönleri, sonra bir veri bulutunun en geniş yayıldığı doğruyu bul.",
    stages: {
      turn: {
        plane:
          "Mavi ok v, turuncu ok Av: matrisin v'yi dönüştürdüğü ok. Görüntüyü döndürmek için sürükle.",
        direction: "v'nin yönünü değiştir. Çoğu yönde Av, v'den sapar.",
        turned: "Doğrultular arasındaki açıyı 0°'ye yaklaştır: o yön bir özvektördür.",
      },
      shadow: {
        cloud: "Her nokta bir kişi; her noktanın doğru üzerinde bir izdüşümü var.",
        angle: "Doğruyu döndür ve izdüşümlerin ne kadar geniş yayıldığına bak.",
        reveal: "En geniş yayılım, kovaryans matrisinin birinci özvektörü boyuncadır.",
      },
      reduce: {
        line: "İzdüşümlerin varyansını en büyük yapan doğru; özvektör olarak bulundu.",
        flatten: "Yalnızca izdüşümleri tut: kişi başına bir sayı.",
        kept: "İnsanlar bulutunda varyansın çoğu korunur; yuvarlak bulutta yarıya yakını.",
      },
    },
  },
  study: {
    topics: {
      eigen: "Özvektörler ve özdeğerler",
      pca: "Temel bileşenler analizi",
    },
    notes: {
      "3b1b-eigen":
        "Özvektörleri, bir dönüşümün doğrultusunu değiştirmediği vektörler olarak anlatır; ızgaranın nasıl dönüştüğünü canlandırarak gösterir.",
      "sq-pca":
        "Aynı fikri veri tarafından anlatır: varyansın en büyük olduğu doğru, beş dakikada.",
    },
  },
};

export default copy;
