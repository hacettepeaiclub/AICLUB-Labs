import type en from "../en/attention";

/** Türkçe metin: attention. Şekli `en/attention.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    transformer:
      "Bu laboratuvarın hesapladığı ölçeklenmiş nokta çarpımı dikkatini destekler. Laboratuvar tek bir başlığı elle kurar; makalenin tanıttığı mimarinin tamamını uygulamaz.",
  },

  hero: {
    title: "Bu kelime nereye bakıyor?",
    question:
      "Her kelime diğerlerine bakıyor. Birini seçin: dikkatini hangi kelimelere verdiği hemen belirir.",
  },

  sentenceLabel: "Cümle. Nereye baktığını görmek için bir kelime seçin.",
  sentenceHint:
    "Kelimeler arasında gezinmek için sol ve sağ ok tuşlarını, iki uca atlamak için Home ve End tuşlarını kullanın.",
  tokenLabel: (word: string, share: number, position: number, total: number) =>
    `${word}, yüzde ${share}, ${total} kelimeden ${position}.`,
  percent: (share: number) => `%${share}`,
  pair: (word: string, share: number) => `${word} yüzde ${share}`,
  announce: (word: string, targets: string) => `${word} en çok şuraya bakıyor: ${targets}.`,
  mostlyLookingAt: (word: string) => `“${word}” en çok şuraya bakıyor`,
  nearTie:
    "Bu ikisi neredeyse başa baş. Bu küçük modelin dil bilgisi yok; seçtiğiniz kelimenin hangisiyle ilişkili olduğunu ayırt edemiyor.",

  swapLabel: "Bir kelimeyi değiştirin",
  swapHint:
    "Beşinci kelimeyi değiştirin ve seçili kelimeye ne olduğuna bakın, ona hiç dokunmadığınız hâlde.",
  dogNote:
    "Artık iki canlı var ve model dikkatini ikisi arasında neredeyse eşit paylaştırdı. Dağılım değişti ama hangisinin yorgun olduğunu hâlâ ayırt edemiyor.",

  reveal: {
    kicker: "Nasıl karar verdi?",
    title: "Tek bir sayı, baştan sona.",
    lede: "Bu bölüm yukarıda seçili olan kelimeyi izler. Seçimi ya da değiştirilen kelimeyi değiştirin; buradaki her adım onunla birlikte değişir, çünkü bu, aynı hesabın kendisidir, ikinci bir kopyası değil.",
  },

  trace: {
    step1: "Seçtiğiniz kelime",
    step1Title: (word: string) => `“${word}” ile başlayın`,
    step1Note:
      "Aşağıdaki her şey, bu tek kelimenin diğerlerinin her biriyle sırayla karşılaştırılmasıdır.",

    step2: "Ne aradığı",
    step2Title: (word: string) => `“${word}” bunu istiyor, query'si`,
    step2Note:
      "Sağa uzanan bir çubuk kelimenin istediği bir özelliktir; sola uzanan ise özellikle aramadığı bir özelliktir. Bunlar modelin ne istediğine dair kendi ifadeleridir, okunabilir hâle getirilmiştir: gerçek bir modelinkiler hiç okunabilir değildir.",

    step3: "Diğer kelimenin sunduğu",
    step3Title: (word: string) => `“${word}” bunu sunuyor, key'i`,
    step3Note:
      "Query ve key bilerek iki farklı projeksiyondan gelir: bir kelimenin sunduğu şey, istediği şeyle aynı değildir. Attention'ın benzerlik ölçmekten fazlası olmasının nedeni budur.",

    step4: "Eşleşme",
    step4Title: (score: string) => `Örtüşme değeri ${score}`,
    step4Note: (from: string, to: string) =>
      `“${from}” kelimesinin istediğiyle “${to}” kelimesinin sunduğunu çarpın, toplayın ve eksen sayısının kareköküne bölün. Bu son adım, model genişledikçe sayıları çalışılabilir bir aralıkta tutar.`,

    step5: "%100'ün payı",
    step5Title: (share: number) => `Bu da dikkatin %${share} kadarı oluyor`,
    step5Note:
      "Paylar her zaman %100'e tamamlanır; yani bunlar puan değil, pay. Yeni bir rakip eklendiğinde izlediğiniz pay da dahil olmak üzere diğer bütün payların küçülmesinin nedeni tam olarak budur.",
    tableCaption: "En güçlü birkaç kelime için eşleşme ve dikkat payı.",
    colToken: "Kelime",
    colScore: "Eşleşme",
    colShare: "Pay",

    step6: "Neye dönüştüğü",
    step6Title: (word: string) => `“${word}” artık bir karışım taşıyor`,
    step6Note:
      "Attention yalnızca nereye bakılacağıyla ilgili değildir. Baktığı her kelime, payı oranında kendi value'sunu katar; böylece kelime, baktığı şeylerin bir karışımını taşımaya başlar. Gerçek bir modelde bir sonraki katmana ulaşan şey bu karışımdır.",

    axes: {
      nounness: "ad gibi",
      animacy: "canlı",
      verbness: "eylem gibi",
    },
  },

  honesty:
    "Bu, küçük ve eğitim amaçlı bir self-attention modelidir. Yedi özelliği ve üç projeksiyon matrisi bu deney için elle yazıldı; metinden öğrenilmedi. Gerçek bir model, kimsenin adlandırmadığı temsilleri yüzlerce boyutta öğrenir. Burada gerçek olan aritmetiktir: bir Transformer'ın yaptığı karşılaştırmanın, ölçeklemenin, softmax'in ve ağırlıklı toplamın aynısı.",

  recap: {
    lessons: [
      "Attention, bağlam üzerine sabit bir %100'lük odağı dağıtır; yani her kelime evet ya da hayır değil, bir pay alır.",
      "Bir kelimeyi değiştirmek diğerlerinin paylarını da değiştirir: dokunmadığınız kelimeler dahil, çünkü hepsi aynı %100'ü paylaşıyor.",
      "Attention, çok daha büyük bir modelin içindeki tek bir mekanizmadır. Nereye bakılacağına ve neyin karıştırılacağına karar verir; tek başına cümleyi anlamaz.",
    ],
    footer:
      "Buradaki kelimelere elle yazılmış yedi özellik verildi; bu yüzden model bir kediyi bir toptan ayırabiliyor ama bir topu bir aynadan ayıramıyor. Gerçek Transformer'lar çok daha zengin temsiller kurmak için çok sayıda head ve katmanı üst üste yığar: bu, bu sayfanın anlattığından farklı ve çok daha uzun bir hikâye.",
  },
  pickLabel: "Kelime",
  wholeRowLabel: "Bütün paylar, cümle sırasıyla",
  mixLabel: "Her birinin kattığı",

  figures: {
    selected: "Seçili",
    biggestShare: "En büyük pay",
    sharesTotal: "Payların toplamı",
    matchedWith: "Yaslandığı",
    rawMatch: "Eşleşme",
    score: "Bölme sonrası",
    divisor: "Bölen",
    peakWith: "En büyük pay",
  },

  scale: {
    kicker: "Bölme neden var?",
    title: "Böleni kaldırın, paylar çöküyor.",
    lede: "Eksen sayısının kareköküne bölmek, etkisini sonuca bakarak göremeyeceğiniz tek adımdır: onu değiştirene kadar sonuç her iki hâlde de makul görünür. Bu yüzden bölen sizde: onu hiç bölmemeye kadar indirin ya da modelin kullandığının ötesine götürün ve aynı eşleşmelerin bütçeyi nasıl farklı paylaştırdığını izleyin.",
    collapse:
      "Bölme atlanınca puanlar daha büyük kalıyor ve daha büyük sayılar üzerindeki softmax daha keskin oluyor: bütçenin neredeyse tamamı tek bir kelimeye gidiyor, geri kalanı yuvarlanıp yok oluyor. Okunacak bir dağılımı ortada bırakan şey, bu bölme.",
    note: "Her çubuk burada, aynı eşleşmeler üzerinde aynı softmax ile yeniden hesaplanıyor; her çubuktaki çentik modelin gerçekte kullandığı pay. Sayfanın başka her yerinde yalnızca o kullanılıyor.",
    legend: "Çubuk: sizin böleninizdeki pay. Çentik: modelin ÷√d ile verdiği pay.",
    divisorLabel: "Eşleşmeleri şuna böl",
    divisorValue: (value: string) => `÷${value}`,
    noneMark: "÷1, bölme yok",
    modelMark: (root: string) => `÷${root}, model`,
    atModel: "Bu, modelin kendi böleni √d: diğer bütün bölümlerin çizdiği satır.",
    sharper:
      "Daha az bölme eşleşmeleri birbirinden uzak bırakır ve softmax keskinleşir: önde olan bütçeden daha çok, diğerleri daha az alır.",
    flatter:
      "Daha çok bölme eşleşmeleri birbirine yaklaştırır ve paylar eşit dağılıma doğru düzleşir: önde olan öne çıkmaz olur.",
    peakNowHint: "sizin böleninizde",
    peakModelLabel: "Modelinki",
    peakModelHint: "÷√d iken en büyük pay",
    announce: (divisor: string, peak: string) => `${divisor} ile bölününce en büyük pay ${peak}.`,
    tableCaption:
      "En güçlü birkaç kelime için: eşleşme, modelin verdiği pay ve seçtiğiniz bölendeki payı.",
    colRaw: "Eşleşme",
    colWith: "Modelin payı",
    colNow: "Sizin bölendeki pay",
  },

  softmax: {
    kicker: "Eşleşmelerden paylara",
    title: "On puan, tek bir bütçe.",
    lede: "Softmax, eşleşme satırını toplamı %100 olan bir pay satırına çevirir. Hiçbir şey atılmaz ve hiçbir şey seçilmez: her kelime bir pay alır ve paylar ancak birbirinden çıkabilir. Eşleşmeler artık sizde: herhangi birini sürükleyin.",
    caption:
      "Her pay, her harekette bütün satırdan, modelin kullandığı softmax ile yeniden hesaplanıyor. Sürüklediğiniz puanlar 'ya şöyle olsaydı'; modelinkiler işaretli duruyor.",
    dragHint:
      "Herhangi bir kelimenin eşleşmesini sürükleyin. Birini yükseltin: dokunmadıklarınız dahil diğer bütün paylar düşer, çünkü toplam hep 1.",
    reset: "Modelin eşleşmelerine dön",
    legend: "Çentikler modelin kendi eşleşmesini ve payını gösterir.",
    pickAnother: "Başka bir kelimeyi sorun",
    scoreHandle: (word: string) => `“${word}” için eşleşme`,
    scoreValue: (value: string) => `eşleşme ${value}`,
    touchedLabel: "Değişen eşleşme",
    touchedHint: "sizin elinizle",
    announce: (word: string, share: string) => `En büyük pay artık “${word}”, ${share}.`,
  },

  mix: {
    kicker: "Payların harcandığı yer",
    title: "Paylar bir hüküm değil, birer katsayı.",
    lede: "Bakılan her kelime, payı oranında kendi value vektörünü verir. Bunları toplayınca seçili kelimenin dönüştüğü şey ortaya çıkar: gerçek bir modelde bir sonraki katmana ulaşan da budur.",
    tableCaption: "En çok katkı veren üç kelime için pay ve value vektörü.",
    outputLabel: "Karışmış çıktı, eksen eksen",
  },
};

export default copy;
