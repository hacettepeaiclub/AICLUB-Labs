import type en from "../en/attention";

/** Türkçe metin: attention. Şekli `en/attention.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    transformer:
      "Bu laboratuvarın hesapladığı ölçeklenmiş nokta çarpımı dikkatini destekler. Laboratuvar tek bir attention head hesabını gösterir; makalenin tanıttığı mimarinin tamamını uygulamaz.",
  },

  hero: {
    title: "Seçtiğin kelime en çok hangi kelimeyle ilişkili?",
    question:
      "Bir kelime seç. Dikkat ağırlıklarının cümledeki diğer kelimelere nasıl dağıldığını incele.",
  },

  sentenceLabel: "Cümle. Nereye baktığını görmek için bir kelime seç.",
  sentenceHint:
    "Kelimeler arasında gezinmek için sol ve sağ ok tuşlarını, iki uca atlamak için Home ve End tuşlarını kullan.",
  tokenLabel: (word: string, share: number, position: number, total: number) =>
    `${word}, yüzde ${share}, ${total} kelimeden ${position}.`,
  percent: (share: number) => `%${share}`,
  pair: (word: string, share: number) => `${word} yüzde ${share}`,
  announce: (word: string, targets: string) => `${word} en çok şuraya bakıyor: ${targets}.`,
  mostlyLookingAt: (word: string) => `“${word}” en çok şuraya bakıyor`,
  nearTie:
    "Bu ikisi neredeyse başa baş. Bu küçük modelin dil bilgisi yok; seçtiğin kelimenin hangisiyle ilişkili olduğunu ayırt edemiyor.",

  swapLabel: "Bir kelimeyi değiştir",
  swapHint:
    "Beşinci kelimeyi değiştir. Seçili kelime aynı kalırken dikkat ağırlıkları nasıl değişiyor?",
  dogNote:
    "Cümlede artık iki canlı var. Model ağırlıkları ikisine yakın oranlarda dağıtıyor, ancak hangisinin yorgun olduğunu ayıramıyor.",

  reveal: {
    kicker: "Nasıl karar verdi?",
    title: "İki kelimenin eşleşme skoru nasıl hesaplanır?",
    lede: "Bu bölüm seçili kelime için yapılan hesabı gösterir. Kelimeyi veya cümleyi değiştirdiğinde bütün değerler aynı attention hesabından yeniden alınır.",
  },

  trace: {
    step1: "Seçtiğin kelime",
    step1Title: (word: string) => `“${word}” ile başla`,
    step1Note:
      "Seçili kelimenin query vektörü, diğer kelimelerin key vektörleriyle karşılaştırılır.",

    step2: "Ne aradığı",
    step2Title: (word: string) => `“${word}” için query vektörü`,
    step2Note:
      "Sağa uzanan çubuklar pozitif, sola uzananlar negatif query bileşenlerini gösterir. Özellikler bu küçük modelde elle tanımlanmıştır; eğitilmiş bir modelin bileşenlerine aynı anlamlar verilemez.",

    step3: "Diğer kelimenin sunduğu",
    step3Title: (word: string) => `“${word}” için key vektörü`,
    step3Note:
      "Query ve key farklı projeksiyonlarla hesaplanır. Bu nedenle attention skoru, iki kelimenin başlangıç vektörleri arasındaki benzerlikle aynı ölçü değildir.",

    step4: "Eşleşme",
    step4Title: (score: string) => `Eşleşme skoru: ${score}`,
    step4Note: (from: string, to: string) =>
      `“${from}” kelimesinin istediğiyle “${to}” kelimesinin sunduğunu çarpın, toplayın ve eksen sayısının kareköküne bölün. Bu son adım, model genişledikçe sayıları çalışılabilir bir aralıkta tutar.`,

    step5: "%100'ün payı",
    step5Title: (share: number) => `Bu kelimenin aldığı pay: %${share}`,
    step5Note:
      "Softmax ağırlıklarının toplamı %100 olur. Diğer skorlar sabitken bir skoru artırmak, kalan kelimelerin ağırlıklarını azaltır.",
    tableCaption: "En güçlü birkaç kelime için eşleşme ve dikkat payı.",
    colToken: "Kelime",
    colScore: "Eşleşme",
    colShare: "Pay",

    step6: "Neye dönüştüğü",
    step6Title: (word: string) => `“${word}” için çıktı vektörü`,
    step6Note:
      "Her value vektörü kendi attention ağırlığıyla çarpılır. Bu vektörlerin toplamı seçili kelimenin çıktısını oluşturur ve sonraki katmana aktarılır.",

    axes: {
      nounness: "ad gibi",
      animacy: "canlı",
      verbness: "eylem gibi",
    },
  },

  honesty:
    "Bu eğitim modelinin yedi özelliği ve üç projeksiyon matrisi elle tanımlandı; metinden öğrenilmedi. Model, ölçeklenmiş noktasal çarpım, softmax ve ağırlıklı toplam işlemlerini hesaplar. Eğitilmiş Transformer modellerinin temsilleri çok daha kapsamlıdır.",

  recap: {
    lessons: [
      "Attention, bağlam üzerine sabit bir %100'lük odağı dağıtır; yani her kelime evet ya da hayır değil, bir pay alır.",
      "Bir kelimeyi değiştirmek diğerlerinin paylarını da değiştirir: dokunmadığın kelimeler dahil, çünkü hepsi aynı %100'ü paylaşıyor.",
      "Attention, çok daha büyük bir modelin içindeki tek bir mekanizmadır. Nereye bakılacağına ve neyin karıştırılacağına karar verir; tek başına cümleyi anlamaz.",
    ],
    footer:
      "Bu modelin elle tanımlanmış özellikleri bazı kelimeleri ayırt etmeye yeter, bazılarını ayırmaya yetmez. Büyük Transformer modelleri, veriden öğrenilen temsilleri birden fazla attention head ve katmanda işler.",
  },
  pickLabel: "Kelime",
  wholeRowLabel: "Bütün paylar, cümle sırasıyla",
  mixLabel: "Her birinin kattığı",

  figures: {
    selected: "Seçili",
    biggestShare: "En büyük pay",
    sharesTotal: "Payların toplamı",
    matchedWith: "Eşleşen kelime",
    rawMatch: "Eşleşme",
    score: "Bölme sonrası",
    divisor: "Bölen",
    peakWith: "En büyük pay",
  },

  scale: {
    kicker: "Bölme neden var?",
    title: "Skorları ölçeklemezsek ne değişir?",
    lede: "Skorların bölündüğü değeri değiştir. Aynı skorlardan hesaplanan attention ağırlıklarını, modelin √d böleniyle elde ettiği ağırlıklarla karşılaştır.",
    collapse:
      "Bölme atlanınca puanlar daha büyük kalıyor ve daha büyük sayılar üzerindeki softmax daha keskin oluyor: bütçenin neredeyse tamamı tek bir kelimeye gidiyor, geri kalanı yuvarlanıp yok oluyor. Okunacak bir dağılımı ortada bırakan şey, bu bölme.",
    note: "Çubuklar seçtiğin bölenle, çentikler modelin √d böleniyle hesaplanan ağırlıkları gösterir. Diğer bölümler modelin bölenini kullanır.",
    legend: "Çubuk: bölenindeki pay. Çentik: modelin ÷√d ile verdiği pay.",
    divisorLabel: "Eşleşmeleri şuna böl",
    divisorValue: (value: string) => `÷${value}`,
    noneMark: "÷1, bölme yok",
    modelMark: (root: string) => `÷${root}, model`,
    atModel: "Bu, modelin kendi böleni √d: diğer bütün bölümlerin çizdiği satır.",
    sharper:
      "Daha az bölme eşleşmeleri birbirinden uzak bırakır ve softmax keskinleşir: önde olan bütçeden daha çok, diğerleri daha az alır.",
    flatter:
      "Daha çok bölme eşleşmeleri birbirine yaklaştırır ve paylar eşit dağılıma doğru düzleşir: önde olan öne çıkmaz olur.",
    peakNowHint: "böleninde",
    peakModelLabel: "Modelinki",
    peakModelHint: "÷√d iken en büyük pay",
    announce: (divisor: string, peak: string) => `${divisor} ile bölününce en büyük pay ${peak}.`,
    tableCaption:
      "En güçlü birkaç kelime için: eşleşme, modelin verdiği pay ve seçtiğin bölendeki payı.",
    colRaw: "Eşleşme",
    colWith: "Modelin payı",
    colNow: "bölendeki pay",
  },

  softmax: {
    kicker: "Eşleşmelerden paylara",
    title: "Softmax ağırlıkları nasıl dağıtır?",
    lede: "Softmax, skorları toplamı %100 olan ağırlıklara dönüştürür. Bir skoru sürükleyerek değiştir ve diğer kelimelerin ağırlıklarını izle.",
    caption:
      "Her değişiklikte bütün satır için softmax yeniden hesaplanır. Modelin başlangıç değerleri karşılaştırma için işaretlenir.",
    dragHint:
      "Herhangi bir kelimenin eşleşmesini sürükle. Birini yükselt: dokunmadıkların dahil diğer bütün paylar düşer, çünkü toplam hep 1.",
    reset: "Modelin eşleşmelerine dön",
    legend: "Çentikler modelin kendi eşleşmesini ve payını gösterir.",
    pickAnother: "Başka bir kelime seç",
    scoreHandle: (word: string) => `“${word}” için eşleşme`,
    scoreValue: (value: string) => `eşleşme ${value}`,
    touchedLabel: "Değişen eşleşme",
    touchedHint: "elinle",
    announce: (word: string, share: string) => `En büyük pay artık “${word}”, ${share}.`,
  },

  mix: {
    kicker: "Çıktı hesabı",
    title: "Ağırlıklardan çıktı vektörüne",
    lede: "Her kelimenin value vektörünü attention ağırlığıyla çarpıp topla. Elde edilen çıktı vektörünün bileşenleri aşağıda gösteriliyor.",
    tableCaption: "En çok katkı veren üç kelime için pay ve value vektörü.",
    outputLabel: "Çıktı vektörünün bileşenleri",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Bir kelime seç, cümlede başka bir kelimeyi değiştir ve attention ağırlıklarını karşılaştır.",
    stages: {
      sentence: {
        sentence:
          "Cümle bu. Bir kelime seçili; diğer her kelimenin altında, o kelimenin dikkatinden aldığı pay yazıyor.",
        pick: "Başka bir kelime seç; paylar bu kez o kelime için yeniden hesaplanır.",
        swap: "Şimdi cümledeki bir kelimeyi değiştir. Seçtiğin kelimeye dokunmadığın halde onun dikkati de kayar.",
      },
      compare: {
        bars: "Solda seçili kelimenin aradığı şey, yani query'si. Sağda en iyi eşleştiği kelimenin sunduğu şey, yani key'i.",
        pick: "Buradan başka bir kelime seç; iki taraf da onun için yeniden hesaplanır.",
        match: "İkisini çubuk çubuk çarpıp toplayınca ham eşleşme çıkar. Bölündüğünde skor olur.",
      },
      scale: {
        shares: "Aynı eşleşmeler, aşağıdaki bölenle paylara dönüştürülmüş hali.",
        divisor: "Tur böleni kaldırdı. Bölen olmayınca en büyük eşleşme neredeyse her şeyi alır.",
        model: "Bu, modelin kullandığı böleni geri koyar: eksen sayısının karekökü.",
      },
      softmax: {
        rows: "Her satır bir kelimenin eşleşme skoru ve payı. Payların toplamı her zaman %100.",
        drag: "Bir skoru sürükle ya da seçip ok tuşlarını kullan. Tur ilkini yükseltti; diğer bütün paylar düştü.",
        reset: "Bu düğme modelin kendi skorlarını geri getirir.",
      },
      mix: {
        table:
          "Her kelime value vektörünü payı oranında aktarır; alttaki çubuklar bunların toplamı.",
        pick: "Başka bir kelime seç; karışım onun paylarıyla yeniden yapılır.",
        out: "Seçili kelimenin eksen eksen dönüştüğü şey; bir sonraki katmana giden bu.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      qkv: "Query, key ve eşleşme skoru",
      softmax: "Softmax: %100'lük tek bütçe",
      transformer: "Attention'ın modeldeki yeri",
    },
    notes: {
      "3b1b-attention":
        "Mekanizmanın tamamı adım adım: bir kelimenin ne aradığı, diğerlerinin ne sunduğu ve nasıl karşılaştırıldıkları.",
      "sq-attention": "Aynı fikir, elle takip edilebilecek küçük sayılarla.",
      "d2l-attention": "Ölçekli nokta çarpımı ve böleni, açık açık yazılmış hali.",
      "sq-softmax": "Softmax'ın her skoru toplamı 1 olan paylara neden çevirdiği.",
      "3b1b-transformers": "Etrafındaki transformer: attention'dan önce ve sonra ne olduğu.",
      "karpathy-gpt": "Attention katmanı dahil, sıfırdan yazılan küçük bir GPT.",
      "alammar-transformer": "Mimarinin açıklamalı çizimlerle anlatımı.",
    },
  },
};

export default copy;
