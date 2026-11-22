import type en from "../en/attention";

/**
 * Türkçe metin: attention. Şekli `en/attention.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## attention), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır. Cümle İngilizcedir; kelimeler tırnak
 * içinde özgün hâliyle anılır.
 */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    transformer:
      "Bu lab'ın hesapladığı ölçeklenmiş nokta çarpımı attention'ını savunur. Lab tek bir attention kafasını elle kurar; makalenin tanıttığı mimarinin tamamını uygulamaz.",
  },

  hero: {
    title: "Bu kelime nereye bakıyor?",
    question:
      "Her kelime diğerlerine bakıyor. Bir kelime seç ve attention'ının cümledeki kelimelere nasıl dağıldığına bak.",
  },

  sentenceLabel: "Cümle. Nereye baktığını görmek için bir kelime seç.",
  sentenceHint:
    "Kelimeler arasında gezinmek için sol ve sağ ok tuşlarını, iki uca atlamak için Home ve End tuşlarını kullan.",
  tokenLabel: (word: string, share: number, position: number, total: number) =>
    `${word}, yüzde ${share}, ${total} kelimenin ${position}. kelimesi`,
  percent: (share: number) => `%${share}`,
  pair: (word: string, share: number) => `${word} yüzde ${share}`,
  announce: (word: string, targets: string) => `“${word}” en çok şunlara bakıyor: ${targets}.`,
  mostlyLookingAt: (word: string) => `“${word}” en çok şunlara bakıyor:`,
  nearTie:
    "Bu ikisi neredeyse başa baş. Bu küçük modelin dil bilgisi yok; seçtiğin kelimeyle hangisinin ilişkili olduğunu ayırt edemez.",

  swapLabel: "Bir kelimeyi değiştir",
  swapHint:
    "Beşinci kelimeyi değiştir ve seçili kelimenin paylarına bak; o kelimeye dokunmadığın hâlde payları değişir.",
  dogNote:
    "Cümlede artık iki hayvan var ve model attention'ını ikisi arasında neredeyse eşit böldü. Paylar değişti, ama model hâlâ hangisinin yorgun olduğunu ayırt edemiyor.",

  reveal: {
    kicker: "Nasıl karar verdi?",
    title: "Tek bir sayı, baştan sona.",
    lede: "Bu bölüm yukarıda seçili kelimeyi izler. Seçili kelimeyi ya da değiştirdiğin kelimeyi değiştirdiğinde buradaki her adım da değişir, çünkü aynı hesaptır, ikinci bir kopyası değil.",
  },

  trace: {
    step1: "Seçtiğin kelime",
    step1Title: (word: string) => `“${word}” ile başla`,
    step1Note:
      "Aşağıdaki her adım, bu kelimenin kendisini sırayla diğer kelimelerle karşılaştırmasıdır.",

    step2: "Ne aradığı",
    step2Title: (word: string) => `“${word}” bunu arıyor: sorgusu (query)`,
    step2Note:
      "Sağa uzanan çubuk, kelimenin aradığı bir özelliktir; sola uzanan, özellikle aramadığı bir özellik. Bu modelde özellikler okunabilsin diye elle adlandırıldı; gerçek bir modelin sorgu bileşenleri böyle okunamaz.",

    step3: "Diğer kelimenin sunduğu",
    step3Title: (word: string) => `“${word}” bunu sunuyor: anahtarı (key)`,
    step3Note:
      "Sorgu ve anahtar bilerek iki ayrı izdüşümle hesaplanır: bir kelimenin sunduğu, aradığıyla aynı değildir. Attention'ın iki kelimenin benzerliğini ölçmekten fazlası olmasının nedeni budur.",

    step4: "Eşleşme",
    step4Title: (score: string) => `Puan: ${score}`,
    step4Note: (from: string, to: string) =>
      `“${from}” kelimesinin sorgusunu “${to}” kelimesinin anahtarıyla bileşen bileşen çarp, topla ve eksen sayısının kareköküne böl. Bu son adım, model genişledikçe sayıların yönetilebilir bir aralıkta kalmasını sağlar.`,

    step5: "%100'den payı",
    step5Title: (share: number) => `Bu da attention'ın %${share} kadarı demek`,
    step5Note:
      "Payların toplamı her zaman %100'dür; bu yüzden paylar puan değil, bölüşümdür. Yeni bir rakibin, izlediğin kelimeler dahil diğer bütün payları küçültmesinin nedeni budur.",
    tableCaption: "En büyük paylı birkaç kelime için eşleşme ve attention payı.",
    colToken: "Kelime",
    colScore: "Eşleşme",
    colShare: "Pay",

    step6: "Neye dönüştüğü",
    step6Title: (word: string) => `“${word}” artık bir karışım taşıyor`,
    step6Note:
      "Attention yalnızca nereye bakılacağıyla ilgili değildir. Bakılan her kelime, kendi değer (value) vektörünü payı oranında katar; seçili kelime sonunda baktıklarının bir karışımını taşır. Gerçek bir modelde sonraki katmana giden bu karışımdır.",

    axes: {
      nounness: "ad gibi",
      animacy: "canlı",
      verbness: "eylem gibi",
    },
  },

  honesty:
    "Bu, öğretim amaçlı küçük bir self-attention modelidir. Yedi özelliği ve üç izdüşüm matrisi bu deney için elle yazıldı; metinden öğrenilmedi. Gerçek bir model, kimsenin adlandırmadığı temsilleri yüzlerce boyutta öğrenir. Buradaki gerçek olan aritmetiktir: bir Transformer'ın yaptığı karşılaştırma, ölçekleme, softmax ve ağırlıklı toplamın aynısı.",

  recap: {
    lessons: [
      "Attention, bağlamdaki kelimelere toplamı sabit %100 olan bir pay dağıtır; her kelime evet ya da hayır yerine bir pay alır.",
      "Bir kelimeyi değiştirmek, dokunmadığın kelimeler dahil diğerlerinin paylarını da değiştirir, çünkü hepsi aynı %100'ü bölüşür.",
      "Attention, çok daha büyük bir modelin içindeki tek bir mekanizmadır. Nereye bakılacağını ve neyin karıştırılacağını belirler; tek başına cümleyi anlamaz.",
    ],
    footer:
      "Buradaki kelimelere elle yazılmış yedi özellik verildi; model bu yüzden kediyi toptan ayırabilir ama topu aynadan ayıramaz. Gerçek Transformer'lar çok sayıda kafayı ve katmanı üst üste koyarak çok daha zengin temsiller kurar; bu, bu sayfanın anlattığından farklı ve çok daha uzun bir konudur.",
  },
  pickLabel: "Kelime",
  wholeRowLabel: "Bütün paylar, cümle sırasıyla",
  mixLabel: "Her kelimenin kattığı",

  figures: {
    selected: "Seçili",
    biggestShare: "En büyük pay",
    sharesTotal: "Payların toplamı",
    matchedWith: "En çok baktığı",
    rawMatch: "Eşleşme",
    score: "Bölündükten sonra",
    divisor: "Bölen",
    peakWith: "En büyük pay",
  },

  scale: {
    kicker: "Neden bölüyoruz?",
    title: "Böleni kaldır, paylar tek kelimede toplansın.",
    lede: "Eksen sayısının kareköküne bölmek, etkisini sonuçta göremediğin tek adımdır: sen değiştirene kadar sonuç her iki durumda da makul görünür. Bu yüzden bölen senin elinde: kaydırıcıyla bölmeyi tamamen kaldır ya da modelin kullandığı değerin ötesine çıkar ve aynı eşleşmelerin payları nasıl farklı bölüştüğüne bak.",
    collapse:
      "Bölmeyi atlamak puanları büyük bırakır ve büyük sayılar üzerindeki softmax daha keskindir: payın neredeyse tamamı tek bir kelimeye gider, geri kalanlar yuvarlanınca sıfıra iner. Okunabilir bir dağılım bırakan bu bölmedir.",
    note: "Buradaki her çubuk, aynı eşleşmeler üzerinde aynı softmax ile yeniden hesaplanır; her çubuktaki çentik, modelin gerçekte kullandığı paydır. Sayfanın geri kalanında yalnızca o kullanılır.",
    legend: "Çubuk: seçtiğin bölendeki pay. Çentik: modelin ÷√d ile verdiği pay.",
    divisorLabel: "Eşleşmeleri şuna böl",
    divisorValue: (value: string) => `÷${value}`,
    noneMark: "÷1, bölme yok",
    modelMark: (root: string) => `÷${root}, modelinki`,
    atModel: "Bu, modelin kendi böleni √d: diğer bütün bölümlerin çizdiği satır.",
    sharper:
      "Daha az bölmek eşleşmeleri birbirinden uzak bırakır ve softmax keskinleşir: önde olan daha büyük pay alır, diğerleri daha küçük.",
    flatter:
      "Daha çok bölmek eşleşmeleri birbirine yaklaştırır ve paylar eşit bölüşüme doğru düzleşir: önde olan öne çıkmaz olur.",
    peakNowHint: "seçtiğin bölende",
    peakModelLabel: "Modelin en büyük payı",
    peakModelHint: "÷√d iken",
    announce: (divisor: string, peak: string) => `${divisor} ile bölününce en büyük pay ${peak}.`,
    tableCaption:
      "En büyük paylı birkaç kelime için: eşleşme, modelin verdiği pay ve seçtiğin bölendeki pay.",
    colRaw: "Eşleşme",
    colWith: "Modelin payı",
    colNow: "Seçtiğin bölende",
  },

  softmax: {
    kicker: "Eşleşmelerden paylara",
    title: "On puan, tek bir %100.",
    lede: "Softmax, eşleşmelerden oluşan satırı toplamı %100 olan bir pay satırına çevirir. Hiçbir şey atılmaz, hiçbir kelime seçilmez: her kelime bir pay alır ve paylar ancak birbirinden alınarak büyüyebilir. Eşleşmeler artık senin elinde: herhangi birini sürükle.",
    caption:
      "Her hareketinde bütün paylar, satırın tamamından, modelin kullandığı softmax ile yeniden hesaplanır. Sürüklediğin puanlar varsayımsaldır; modelin kendi değerleri işaretli kalır.",
    dragHint:
      "Herhangi bir kelimenin eşleşmesini sürükle. Birini yükselt ve dokunmadıkların dahil diğer bütün payların düştüğüne bak.",
    reset: "Modelin eşleşmelerine dön",
    legend: "Çentikler modelin kendi eşleşmesini ve payını gösterir.",
    pickAnother: "Başka bir kelime için sor",
    scoreHandle: (word: string) => `“${word}” için eşleşme`,
    scoreValue: (value: string) => `eşleşme ${value}`,
    touchedLabel: "Değiştirdiğin eşleşme",
    touchedHint: "senin elinle",
    announce: (word: string, share: string) =>
      `En büyük pay artık “${word}” kelimesinde: ${share}.`,
  },

  mix: {
    kicker: "Paylar neye harcanır",
    title: "Paylar bir hüküm değil, katsayıdır.",
    lede: "Bakılan her kelime, kendi değer (value) vektörünü payı oranında katar. Bunları topladığında seçili kelimenin neye dönüştüğünü bulursun; gerçek bir modelde sonraki katmana giden budur.",
    tableCaption: "En çok katkı veren üç kelime için pay ve değer vektörü.",
    outputLabel: "Karışımın sonucu, eksen eksen",
  },

  tour: {
    intro:
      "Bir cümledeki her kelime diğer bütün kelimeleri tartar. Önce bir kelime seç: sayfa onun attention'ının nereye gittiğini gösterir ve cümleyi değiştirebilirsin.",
    stages: {
      sentence: {
        sentence:
          "Cümle bu. Bir kelime seçili; diğer her kelimenin altında, seçili kelimenin attention'ından aldığı pay yazıyor.",
        pick: "Başka bir kelime seç; paylar bu kez o kelime için yeniden hesaplanır.",
        swap: "Şimdi cümlenin bir kelimesini değiştir. Seçtiğin kelimeye dokunmadığın hâlde onun payları da değişir.",
      },
      compare: {
        bars: "Solda seçili kelimenin aradığı, yani sorgusu. Sağda en iyi eşleştiği kelimenin sunduğu, yani anahtarı.",
        pick: "Buradan başka bir kelime seç; iki taraf da onun için yeniden hesaplanır.",
        match: "İkisini çubuk çubuk çarpıp topla: ham eşleşme budur. Bölündüğünde puan olur.",
      },
      scale: {
        shares: "Aynı eşleşmeler, aşağıdaki bölenle paylara çevrilmiş hâlde.",
        divisor: "Tur böleni kaldırdı. Bölen olmayınca en büyük eşleşme neredeyse bütün payı alır.",
        model: "Bu, modelin kullandığı böleni geri koyar: eksen sayısının karekökü.",
      },
      softmax: {
        rows: "Her satır bir kelimenin eşleşme puanı ve payı. Payların toplamı her zaman %100.",
        drag: "Bir puanı sürükle ya da seçip ok tuşlarını kullan. Tur ilkini yükseltti; diğer bütün paylar düştü.",
        reset: "Bu düğme modelin kendi puanlarını geri getirir.",
      },
      mix: {
        table:
          "Her kelime değer vektörünü payı oranında katar; alttaki çubuklar bunların toplamıdır.",
        pick: "Başka bir kelime seç; karışım onun paylarıyla yeniden hesaplanır.",
        out: "Seçili kelimenin eksen eksen neye dönüştüğü: sonraki katmana giden budur.",
      },
    },
  },

  study: {
    topics: {
      qkv: "Sorgu, anahtar ve eşleşme puanı",
      softmax: "Softmax: tek bir %100",
      transformer: "Attention'ın modeldeki yeri",
    },
    notes: {
      "3b1b-attention":
        "Mekanizmanın tamamı adım adım: bir kelimenin ne aradığı, diğerlerinin ne sunduğu ve nasıl karşılaştırıldıkları.",
      "sq-attention": "Aynı fikir, elle izlenebilecek küçük sayılarla.",
      "d2l-attention": "Ölçeklenmiş nokta çarpımı ve böleni, açıkça yazılmış hâliyle.",
      "sq-softmax": "Softmax'ın herhangi bir puan dizisini toplamı 1 olan paylara neden çevirdiği.",
      "3b1b-transformers":
        "Attention'ı çevreleyen Transformer: attention'dan önce ve sonra ne olduğu.",
      "karpathy-gpt": "Attention kafası dahil, sıfırdan yazılmış küçük bir GPT.",
      "alammar-transformer": "Mimarinin açıklamalı çizimlerle anlatımı.",
    },
  },
};

export default copy;
