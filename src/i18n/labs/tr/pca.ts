import type en from "../en/pca";

const copy: typeof en = {
  percent: (n: number) => `%${n}`,
  decimal: (x: number, digits: number) => x.toFixed(digits).replace(".", ","),
  degrees: (x: number) => `${x.toFixed(1).replace(".", ",")}°`,
  turn: {
    title: "Matris uzayı büker",
    question:
      "Bir matris uzaydaki her oku başka bir yere taşır. Oku yönlendir ve izle: çoğu yön dönmüş olarak çıkar. Dönmeyenleri bul.",
    planeLabel: (turn: string) =>
      `Matrisin büktüğü uzay: kutu bir küptü, yumurta bir küreydi. Mavi ok v; turuncu ok, matrisin onu gönderdiği yer, Av. Aralarında ${turn} var.`,
    legendV: "v, senin seçtiğin yön",
    legendAv: "Av, matrisin onu gönderdiği yer",
    legendFound: "dönmeden kalan bir yön",
    matrix: "Matris",
    matrices: {
      stretch: "Simetrik",
      shear: "Kayma",
      skew: "Yamuk",
      rotate: "Döndürme",
    },
    direction: "v, yatayda",
    tilt: "v, yukarı ya da aşağı",
    dragHint: "Başka bir yandan bakmak için görüntüyü sürükle.",
    turned: "Dönme açısı",
    stretch: "Uzama oranı",
    found: "Bulunan yönler",
    foundCount: (found: number, total: number) => `${total} yönden ${found}`,
    announceFound: (stretch: string) =>
      `Bir tane buldun: burada Av, v ile aynı doğru üzerinde, yalnızca ${stretch} kat uzamış. Bu bir özvektördür, ${stretch} de onun özdeğeri.`,
    allFound: "Bu matrisin döndürmediği bütün yönler bulundu.",
    rotateNote:
      "Döndürme biri dışında her yönü çevirir: ekseni. Ekseni olduğu yerde, 1 kat uzatarak bırakır. Diğer iki özdeğeri karmaşık sayılardır ve uzayda onları gösterecek bir yön yoktur.",
    caption:
      "Özvektör, matrisin yalnızca uzattığı bir yöndür: Au = λu; özdeğer olan λ ne kadar uzadığını söyler. Üç boyutta simetrik ve yamuk matrisler üç yönü korur; kayma ikisini; döndürme yalnızca eksenini.",
    matrixEntries: (r1: string, r2: string, r3: string) =>
      `Matris, satır satır: ${r1}; ${r2}; ${r3}.`,
  },
  shadow: {
    kicker: "Matristen veriye",
    title: "En geniş gölge",
    lede: "İşte bir insan bulutu: yatayda boy, dikeyde kilo. Ortasından bir çizgi geçir ve her noktayı dik olarak üzerine düşür. Çizgiyi, gölgeler olabildiğince geniş yayılana kadar çevir.",
    cloudLabel: (angle: string) =>
      `Her nokta bir kişi. Ortadan geçen çizgi ${angle} açıda; her noktanın çizgi üzerindeki gölgesi işaretli.`,
    angle: "Çizginin açısı",
    reveal: "Özvektörleri göster",
    hide: "Gizle",
    variance: "Gölgenin yayılımı (varyans)",
    best: "Bulduğun en geniş",
    first: "λ₁, en geniş",
    second: "λ₂, ona dik",
    covariance: "Bulutun kovaryans matrisi",
    covarianceRows: (a: string, b: string, c: string, d: string) =>
      `Var(boy) ${a}, Kov ${b}; Kov ${c}, Var(kilo) ${d}`,
    revealed:
      "En geniş gölge, kovaryans matrisinin ilk özvektörü boyunca düşer ve varyansı o özdeğere eşittir. En dar gölge ikinci özvektör boyuncadır ve ilkine diktir.",
    data: "Veri",
    clouds: { people: "İnsanlar", round: "Yuvarlak bulut" },
    newSample: "Başka bir örneklem",
    dataLabel: "Hangi bulut",
    axisPeople: { x: "boy (cm)", y: "kilo (kg)" },
    axisRound: { x: "birinci nicelik", y: "ikinci nicelik" },
    caption:
      "Bulutun kovaryans matrisi, yukarıdaki ilk matris gibi simetriktir; bu yüzden dönmeden kalan yönleri birbirine diktir: iki boyutta bunlardan iki tane vardır. İnsanlar uydurulmuş bir örneklemdir; yetişkinlerin olağan yayılımına ve ilişkisine uyacak biçimde üretildi, hiçbiri ölçülmedi.",
  },
  reduce: {
    kicker: "Daha az sayı",
    title: "İki sayı bire iner",
    lede: "Her noktanın yalnızca en geniş çizgi üzerindeki gölgesini tut; her kişi iki sayı yerine bir sayı olur. Yayılımın çoğu kalır; geriye kalan, her noktanın çizgiye uzaklığıdır.",
    cloudLabel: (kept: string) =>
      `Bulut ve birinci temel bileşeni; çizgi varyansın ${kept} kadarını koruyor.`,
    flatten: "Tek sayı tut",
    restore: "İkiye dön",
    kept: "Korunan varyans",
    lost: "Kaybolan varyans",
    data: "Veri",
    caption:
      "PCA budur: kovaryans matrisinin özvektörleri, en genişten başlayarak, ve verinin bu yönler boyunca anlatılması. İnsanlarda tek bir çizgi yayılımın çoğunu korur. Yuvarlak bulutta hiçbir yön özel değildir ve tek çizgi yarıdan ancak biraz fazlasını korur.",
  },
  bridge: {
    title: "Bu yönler başka nerede çıkıyor",
    intro: "Aynı özvektörler koleksiyonun başka yerlerinde de var.",
    items: {
      "word-embeddings":
        "Haritası, her kelimenin 300 sayısını en geniş iki yöne indirir ve bunun neyi sakladığını gösterir.",
      "gradient-descent": "Eğrilik oranı, yüzeyin eğrilik matrisinin iki özdeğerinin oranıdır.",
      jepa: "Anlamlar haritası da aynı yolla düzleme indirilir.",
    },
  },
  recap: {
    lessons: [
      "Bir matris çoğu yönü döndürür; özvektör, matrisin yalnızca uzattığı yöndür ve ne kadar uzattığı özdeğeridir.",
      "Bir bulutun kovaryans matrisi simetriktir, bu yüzden özvektörleri birbirine diktir: en geniş ve en dar yayılım.",
      "PCA veriyi bu yönler boyunca, en genişten başlayarak anlatır ve dar olanları az kayıpla atabilir.",
    ],
    footer:
      "Her şey çizilebilsin diye iki boyut; gerçek PCA aynı matematiği sayısal yöntemlerle yüzlerce boyutta çalıştırır.",
  },
  sources: {
    title: "Kaynaklar",
    pearson:
      "Pearson'ın makalesi, noktalara olan kare uzaklıkları en aza indirerek bir doğru ya da düzlem uydurur; birinci temel bileşenin arkasındaki geometrik fikir budur.",
    hotelling:
      "Hotelling'in makalesi temel bileşenleri adlandırır ve onları değişkenlerin korelasyon ya da kovaryans matrisinin özvektörleri olarak bulur.",
  },
  tour: {
    intro:
      "Bir matrisin yalnızca uzattığı yönleri, sonra bir bulutun en geniş yayıldığı çizgiyi bul.",
    stages: {
      turn: {
        plane:
          "Mavi ok v, turuncu ok Av: matrisin onu gönderdiği yer. Döndürmek için görüntüyü sürükle.",
        direction: "v'yi yönlendir. Çoğu yön dönmüş olarak çıkar.",
        turned: "Dönmenin sıfır olduğu yeri bul: o yön bir özvektördür.",
      },
      shadow: {
        cloud: "Her nokta bir kişi ve her birinin çizgi üzerinde bir gölgesi var.",
        angle: "Çizgiyi çevir ve gölgelerin ne kadar geniş yayıldığını izle.",
        reveal: "En genişi, kovaryans matrisinin ilk özvektörüdür.",
      },
      reduce: {
        line: "Özvektör olarak bulunan en geniş çizgi.",
        flatten: "Yalnızca her gölgeyi tut: kişi başına bir sayı.",
        kept: "Varyansın çoğu korunur.",
      },
    },
  },
  study: {
    topics: {
      eigen: "Özvektörler ve özdeğerler",
      pca: "Temel bileşen analizi",
    },
    notes: {
      "3b1b-eigen":
        "Özvektörler, bir dönüşümün yalnızca uzattığı yönler olarak, ızgara hareket ederken çiziliyor.",
      "sq-pca": "Aynı fikir verinin tarafından: en geniş yayılımın çizgisi, beş dakikada.",
    },
  },
};

export default copy;
