import type en from "../en/probability";

/** Türkçe metin: probability. Şekli `en/probability.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  routes: {
    label: "Bir deney seç",
    hint: "Altı deneyden birini seç ve sonucu görmeden önce tahmin yap.",
    clues: "01 · İpucu olasılığı değiştirince",
    groups: "02 · Grupları birleştirmek yanıltınca",
    repeats: "03 · Tekrar bir örüntü gösterince",
  },
  sources: {
    title: "Kaynaklar",
    statisticalInference:
      "Koşullu olasılık için s. 20’ye, iki çocuk problemi için s. 40’taki 1.25 numaralı alıştırmaya bak. Kitap binom katsayılarını s. 15’te ve büyük sayılar yasasının zayıf ve kuvvetli biçimlerini sırasıyla s. 232 ve s. 235’te ele alır.",
    simpson:
      "Simpson paradoksunda alt grupların her birinde görülen ilişki, gruplar birleştirildiğinde yön değiştirebilir.",
  },

  scope:
    "Bu lab altı ayrı deney içerir. Her deneyin sonucu belirtilen varsayımlara bağlıdır. Tam olasılıklar, rastgele denemeler ve fizik simülasyonu ayrı etiketlenir. Simülasyon, sonucun davranışını gösterir; matematiksel kanıtın yerini tutmaz.",

  prediction: {
    yours: "dedin",
    actual: "Gerçekte",
    agreed: "Tahminin modelin sonucuyla örtüşüyor.",
    disagreed: "Tahminin modelin sonucundan farklı.",
  },

  // Her sonucun altındaki iki adım: önce nedeni, sonra hesabı.
  explain: {
    why: "Bu neden böyle oluyor?",
    maths: "Sayıları göster",
  },

  monty: {
    title: "Üç kapıdan hangisini seçersin?",
    question: "İlk seçtiğin kapıda kalmak mı, kapıyı değiştirmek mi daha sık kazandırır?",
    setup: [
      "Üç kapı. Birinin arkasında bir araba, diğer ikisinin arkasında birer keçi.",
      "Bir kapı seçersin. Kapı kapalı kalır.",
      "Sunucu arabanın yerini bilir ve diğer ikisinden birini açar: her zaman arkasında keçi olanı.",
      "Sonra seçersin: kendi kapında kal ya da sunucunun dokunmadığı kapıyı al.",
    ],
    coachLabel: "Herkesin sorduğu sorular",
    coach: {
      notHalf: {
        q: "İki kapı kaldı. Neden 50/50 değil?",
        a: "İlk seçtiğin kapının arkasında araba olma olasılığı 1/3’tür. Kalan iki kapıda araba olma olasılığı toplam 2/3’tür. Sunucu bu iki kapıdan keçi olanı açınca o 2/3, diğer kapalı kapıya kalır.",
      },
      whySwitch: {
        q: "Değiştirmek neden daha iyi?",
        a: (stay: string, swap: string) =>
          `İlk seçiminde arabayı bulma olasılığın ${stay}. Arabayı ilk seçiminde bulamadığın turlarda sunucu diğer keçili kapıyı açar. Böylece kapı değiştirerek kazanma olasılığın ${swap} olur.`,
      },
      hostKnows: {
        q: "Sunucunun biliyor olması önemli mi?",
        a: "Evet. Sunucu seçmediğin iki kapıdan birini eşit olasılıkla ve arabanın yerini bilmeden açsaydı, keçi gösterdiği turlarda iki kapının da kazanma olasılığı 1/2 olurdu.",
      },
    },
    caption:
      "Sunucu yalnızca seçmediğin ve arkasında keçi olan bir kapıyı açar. Böyle iki kapı varsa ikisi arasından eşit olasılıkla seçim yapar.",
    predictQuestion: "Çok sayıda tur oynadığında hangi seçim daha sık kazandırır?",
    predict: { stay: "Kal", switch: "Değiştir", same: "Fark etmez" },
    predictAnswer: (value: string) => `Kapı değiştirerek kazanma olasılığı ${value}`,
    strategy: { stay: "Kal", switch: "Değiştir" },
    doorsIdle: "Üç kapalı kapı. Birinin arkasında araba, ikisinde keçi var.",
    doorsLabel: (picked: number, opened: number) =>
      `Üç kapı. ${picked}. kapıyı seçtin. Sunucu keçiyi göstermek için ${opened}. kapıyı açtı.`,
    doorLabel: (n: number, state: string) => `${n}. kapı, ${state}`,
    doorState: {
      closed: "kapalı",
      picked: "seçimin",
      opened: "sunucu açtı, keçi",
      revealed: "araba",
    },
    won: "arabayı kazandın",
    lost: "arabayı kazanamadın",
    promptPick: "Bir kapı seç.",
    promptDecide: (opened: number, other: number) =>
      `Sunucu ${opened}. kapıyı açtı ve arkasından keçi çıktı. İlk seçtiğin kapıda kalmak mı istersin, ${other}. kapıya geçmek mi?`,
    resultLine: (strategy: string, result: string) => `${strategy} dedin, ${result}.`,
    again: "Yeniden oyna",
    announceOpened: (n: number) => `Sunucu ${n}. kapıyı açtı. Arkasından keçi çıktı.`,
    announceResult: (result: string) => `Tur bitti: ${result}.`,
    runBatch: (n: number) => `${n.toLocaleString("tr-TR")} tur çalıştır`,
    batchTitle: "Simüle edilen turlar",
    batchIdle: (n: number) =>
      `${n.toLocaleString("tr-TR")} tur çalıştır ve iki seçeneğin kazanma oranına bak.`,
    batchCaption: (n: number) =>
      `${n} simüle edilmiş turda kalmanın ve değiştirmenin kazanma oranları, tam olasılıkların yanında.`,
    strategyHeader: "Strateji",
    simulatedHeader: (n: number) => `Simülasyon (${n.toLocaleString("tr-TR")})`,
    exactHeader: "Tam değer",
    wins: (wins: number, rounds: number) => `${wins}/${rounds}`,
    playedLabel: "Oynadığın tur",
    yourStayLabel: "Kalmak kazandırırdı",
    yourSwitchLabel: "Değiştirmek kazandırırdı",
    handHint: "turlarında",

    hostPick: "Bir kapı seç. Hangisi olursa.",
    hostReveal: (opened: number) =>
      `Üçünün de arkasını biliyorum. Bak, ${opened}. kapıda keçi var.`,
    hostDecide: (other: number) =>
      `Şimdi: seçtiğin kapıda kal ya da ${other}. kapıyı al. Karar senin.`,
    hostWon: "Arabayı kazandın.",
    hostLost: "Keçi. Yeniden oynayalım mı?",
    explainWhat: "Değiştirmek, kalmaktan yaklaşık iki kat daha sık kazanır.",
    explainWhy:
      "İlk seçimin üç kapıdan biriydi, yani üç seferde bir arabaydı. Geriye kalan iki kapıya birlikte üç seferde iki düşüyor, ve sunucu az önce o ikisinden zaten araba olmayanı açtı.",
    explainMaths: (stay: string, swap: string) =>
      `Kalmak yalnızca ilk seçimin baştan araba olduğunda kazanır: ${stay}. Değiştirmek diğer bütün durumlarda kazanır: ${swap}.`,
    batchInvite:
      "1.000 tur çalıştır. Her iki stratejinin simülasyondaki kazanma oranını hesaplanan olasılıkla karşılaştır.",
  },

  birthday: {
    kicker: "Doğum günü problemi",
    title: "Odada en az iki kişinin doğum gününün aynı olma olasılığı nedir?",
    setup: [
      "İnsanlar odaya teker teker giriyor.",
      "Herkesin doğum günü 365 günden biri ve her gün eşit olasılıkta.",
      "Odadaki bütün çiftleri düşün. En az bir çiftin aynı gün doğmuş olması yeter.",
    ],
    addPerson: "Bir kişi ekle",
    addPersonHint: "Çift sayısına ne olduğuna bak.",
    roomFull: "Oda doldu.",
    coachLabel: "Herkesin sorduğu sorular",
    coach: {
      soonWhy: {
        q: (n: number) => `${n} kişi nasıl yazı tura oluyor?`,
        a: (n: number, pairs: string) =>
          `${n} kişi ${pairs} farklı çift oluşturur. Odaya giren her yeni kişi, içerideki herkesle bir çift daha oluşturur. Yalnızca bir kişi eklediğinde çift sayısının ne kadar arttığına bak.`,
      },
      notMine: {
        q: "Bu benim doğum günümle ilgili değil mi?",
        a: "Odadaki diğer 253 kişiden en az birinin seninle aynı gün doğmuş olma olasılığı %50’yi aşar. Herhangi bir çiftin aynı gün doğmuş olma olasılığının bu eşiği aşması için odada toplam 23 kişi yeter.",
      },
      realBirthdays: {
        q: "Doğum günleri gerçekten eşit mi dağılır?",
        a: "Doğum günleri yılın bazı dönemlerinde daha sık görülebilir. Bağımsızlık varsayımı altında, günler eşit olasılıklı olmadığında en az bir çiftin doğum gününün aynı olma olasılığı artar. Eşiği geçmek için gereken kişi sayısı azalabilir.",
      },
    },
    caption:
      "Model, doğum günlerinin 365 güne eşit olasılıkla ve kişiler arasında bağımsız dağıldığını varsayar. Artık yılları ve gerçek doğum tarihlerinin mevsimsel farklılıklarını içermez.",
    predictQuestion: "Sence olasılık ilk ne zaman %50'yi geçer?",
    predict: { count: (n: number) => `${n} kişi` },
    predictAnswer: (n: number, value: string) => `${n} kişi, ${value} ile`,
    peopleLabel: "Odadaki kişi",
    peopleValue: (n: number, value: string) => `${n} kişi, aynı doğum günü olasılığı ${value}`,
    peopleHint: "Kişi sayısını 20’den 25’e çıkar ve olasılığın %50’yi nerede geçtiğine bak.",
    roomLabel: (n: number) => `${n} kişilik bir oda. Herkesin doğum günü farklı.`,
    roomLabelMatch: (n: number, a: number, b: number, day: string) =>
      `${n} kişilik bir oda. ${a}. ve ${b}. kişinin doğum günü aynı: ${day}.`,
    foundPair: (a: number, b: number, day: string) =>
      `${a}. ve ${b}. kişinin doğum günü aynı: ${day}.`,
    noPair: (n: number) => `${n} kişilik bu odada herkesin doğum günü farklı.`,
    tableCaption: (n: number) =>
      `${n} kişi arasında aynı doğum günü olasılığı: tam değer ve simülasyon.`,
    exactRow: "Tam olasılık",
    simulatedRow: (rooms: number) => `Simülasyon (${rooms.toLocaleString("tr-TR")} oda)`,
    stale: (n: number) => `yeniden çalıştır, son çalışma ${n} kişiydi`,
    reading: (n: number, pairs: number) =>
      `${n} kişi ${pairs.toLocaleString("tr-TR")} farklı çift oluşturur. Her çift aynı doğum gününü paylaşabilir.`,
    peopleFigure: "Kişi",
    pairsFigure: "Çift",
    pairsHint: "aynı gün doğabilecek iki kişi",
    chanceFigure: "Aynı doğum günü",
    exactHint: "tam değer",
    thresholdFigure: "%50'yi geçtiği yer",
    thresholdHint: "kişi",

    personName: (n: number) => `${n}. kişi`,
    personLabel: (n: number, day: string) => `${n}. kişi, doğum günü ${day}`,
    personMatchLabel: (n: number, day: string, other: number) =>
      `${n}. kişi, doğum günü ${day}, ${other}. kişiyle aynı gün`,
    justArrived: "yeni geldi",
    sameDay: "aynı gün",
    roomEmpty: "Odada henüz kimse yok.",
    explainWhat: "Çoğu kişinin tahmin ettiğinden çok daha az insan yetiyor.",
    explainWhy:
      "Odaya bir kişi eklediğinde içerideki herkesle birer yeni çift oluşur. Çift sayısı arttıkça en az bir çiftin aynı gün doğmuş olma olasılığı da artar.",
    explainMaths: (n: number, pairs: string, value: string) =>
      `${n} kişiyle ${pairs} çift olur. Herkesin doğum gününün farklı olma olasılığı 365/365 × 364/365 × … çarpımıdır. Bu olasılığı 1’den çıkarınca ${value} kalır.`,
    simulateLabel: "Bunun yerine çalıştır",
    runRooms: (n: number) => `${n.toLocaleString("tr-TR")} oda doldur`,
    simulateNote: (days: number) =>
      `Her oda, kişi başına eşit olasılıklı ${days} günden bir doğum günü çeker, sonra tekrar arar.`,
    announce: (n: number, value: string) => `${n} kişi. Aynı doğum günü olasılığı: ${value}.`,
    months: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
  },

  conditional: {
    kicker: "Koşullu olasılık",
    title: "İki çocuk hakkında verilen bilgi olasılığı nasıl değiştirir?",
    setup: [
      "Bir ailenin iki çocuğu var: biri büyük, biri küçük.",
      "Modelde her çocuk bağımsız olarak 1/2 olasılıkla erkek ya da kızdır. Doğum sırasını da sayınca eşit olasılıklı dört sonuç çıkar.",
      "Biri sana bu aile hakkında doğru tek bir cümle söylüyor.",
      "Senin sorun: ikisinin de erkek olma olasılığı nedir?",
    ],
    coachLabel: "Herkesin sorduğu sorular",
    coach: {
      notHalf: {
        q: "Çocuklardan biri erkek, o zaman diğeri 50/50 değil mi?",
        a: (value: string) =>
          `Bu, başka bir cümlenin cevabı olurdu: “büyük olan erkek”. Sana söylenen, ikisinden en az birinin erkek olduğu: hangisi olduğu değil. Dört aileden üçü bu cümleye uyar ve bunlardan yalnızca biri iki erkektir; yani olasılık ${value}.`,
      },
      twoWays: {
        q: "Erkek-sonra-kız ile kız-sonra-erkek neden ayrı sayılıyor?",
        a: "Çünkü bunlar farklı aileler ve her biri iki erkek kadar olası. Bir erkek bir kızlı aileye düşmek, iki erkekli bir aileye düşmekten iki kat kolaydır: birine iki yol çıkar, diğerine bir.",
      },
      wording: {
        q: "Cümlenin kuruluşu cevabı nasıl değiştiriyor?",
        a: "Cümle, kanıtın kendisi. “En az biri erkek” bir aileyi eler; “büyük olan erkek” iki aileyi eler. Geriye daha az aile kalır ve iki erkek, kalanın içinde daha büyük bir pay tutar. Hiçbir ailede bir şey değişmedi, yalnızca sana söylenen değişti.",
      },
    },
    caption:
      "Burada her çocuğun bağımsız olarak 1/2 olasılıkla erkek ya da kız olduğu ve ipucunun tam olarak yazıldığı gibi geçerli olduğu varsayılır. Üçüncü bir okuma (çocuklardan biriyle rastgele karşılaşıp erkek olduğunu görmek) yine 1/2 verir ve burada modellenmemiştir.",
    predictQuestion: "İki çocuk, en az biri erkek. İkisinin de erkek olma olasılığı?",
    predict: { half: "1/2", third: "1/3", quarter: "1/4" },
    predictAnswer: (value: string) => `1/3, yani ${value}`,
    clueLabel: "İpucu",
    clueShort: { atLeastOneBoy: "En az biri erkek", firstIsBoy: "İlki erkek" },
    clue: {
      atLeastOneBoy: "En az biri erkek",
      firstIsBoy: "İlk çocuk erkek",
    },
    clueHint: "Aynı aile, farklı cümle. Hangi kutuların kaldığına bak.",
    outcome: { GG: "KK", GB: "KE", BG: "EK", BB: "EE" },
    possible: "hâlâ mümkün",
    counts: "ikisi de erkek",
    ruledOut: "elendi",
    matrixLabel: (clue: string, kept: string, value: string) =>
      `Eşit olasılıklı dört sonuç. “${clue}” bilgisiyle hâlâ mümkün olanlar: ${kept}. Yani ikisinin de erkek olma olasılığı ${value}.`,
    fraction: (counts: string, value: string) => `kalan sonuçların ${counts} kadarı = ${value}`,
    compareCaption: "İki ipucu, her birinin bıraktığı sonuçlar ve çıkan olasılık.",
    clueHeader: "İpucu",
    leftHeader: "Mümkün olanlar",
    answerHeader: "İkisi de erkek",
    explain: {
      atLeastOneBoy:
        "KK elenince üç sonuç kalır ve bunlardan yalnızca biri EE'dir. İpucu erkeğin hangi çocuk olduğunu söylemediği için KE ve EK ikisi de ayakta kalır, ve birlikte EE'yi ikiye bir geçerler.",
      firstIsBoy:
        "İlk çocuğu adlandırmak KK ile KE'yi birlikte eler ve geriye iki sonuç kalır. Artık EE, üçte bir değil ikide birdir. Ailede hiçbir şey değişmedi; cümle değişti.",
    },
    keptFigure: "Kalan sonuç",
    keptHint: "dörtte",
    bothFigure: "İkisi de erkek",
    bothHint: "kalanlar içinde",
    answerFigure: "Olasılık",

    older: "Büyük",
    younger: "Küçük",
    boy: "Erkek",
    girl: "Kız",
    familyLabel: (older: string, younger: string) =>
      `Büyük çocuğu ${older}, küçük çocuğu ${younger} olan aile`,
    familiesTitle: "Eşit olasılıklı dört aile",
    explainWhat: "İki çocuğun da erkek olma olasılığı, hangi bilginin verildiğine bağlıdır.",
    explainWhy:
      "“En az biri erkek” hangisi olduğunu söylemez. Yalnızca iki kızlı aileyi eler ve kalan üç aileden ikisinde bir kız vardır. Bunun yerine “büyük olan erkek” dersen bir değil iki aile elenir: aynı aile, farklı cümle, farklı cevap.",
    explainMaths: (kept: number, value: string) =>
      `Dört aileden ${kept} tanesi ipucuna uyuyor ve bu ${kept} aileden biri iki erkek: ${value}.`,
    announce: (clue: string, kept: number, value: string) =>
      `İpucu: ${clue}. ${kept} sonuç kaldı. İkisinin de erkek olma olasılığı: ${value}.`,
  },

  simpson: {
    kicker: "İki tedavi, tek bir karar",
    title: "Hangi tedaviyi seçerdin?",
    setup: [
      "Böbrek taşı için iki tedavi, A ve B: 1986 tarihli gerçek bir çalışmadan.",
      "Hastalar ya küçük taşla ya da büyük taşla geliyor; büyük olanlar zor vakalar.",
      "Tablo her tedavinin her grupta ve iki grubun toplamında ne yaptığını gösteriyor.",
      "Tabloyu oku ve isteyeceğin tedaviyi seç.",
    ],
    named:
      "Simpson paradoksu, her alt grupta aynı yönde olan karşılaştırmanın gruplar birleştirilince tersine dönmesidir.",
    coachLabel: "Herkesin sorduğu sorular",
    coach: {
      howBoth: {
        q: "A her iki grupta kazanıp toplamda nasıl kaybedebilir?",
        a: "A çoğunlukla büyük taşı, B ise çoğunlukla küçük taşı olan hastalara uygulandı. Küçük taşlarda başarı oranı iki tedavide de daha yüksek. Toplam oran hesaplanırken her grubun etkisi, o tedaviyi alan hasta sayısına bağlıdır.",
      },
      whichWrong: {
        q: "Sayılardan biri yanlış mı?",
        a: "İkisi de değil. İkisi de aynı sayımlar üzerinde aritmetik ve her yüzdeyi yanındaki iki sayıyla karşılaştırıp doğrulayabilirsin. Bunlar iki farklı sorunun doğru cevapları.",
      },
      whichBelieve: {
        q: "Peki hangi sayıya inanmalıyım?",
        a: "Aynı taş büyüklüğündeki hastaların sonuçlarını karşılaştırmak için ilgili grup satırına bak. Toplam satırı her tedavinin kendi hasta grubundaki genel başarı oranını gösterir.",
      },
    },
    caption:
      "Başlangıçtaki tablo Charig ve ark. (1986) çalışmasındaki iki böbrek taşı tedavisini karşılaştırır. Kaydırıcıları değiştirince model, yayımlanan grup oranlarından başarı sayılarını hesaplayıp en yakın tam sayıya yuvarlar. Tablodaki yüzdeler bu sayılardan hesaplanır.",
    predictQuestion: "Bir tedavi her grupta kazanıp toplamda kaybedebilir mi?",
    predict: { impossible: "Hayır, bu imkânsız", possible: "Evet, olabilir" },
    predictAnswer: "Evet; aşağıdaki tablo gerçek bir örnek",
    tableCaption: "Grup ve tedavi bazında başarı oranları ve sayılar, toplamla birlikte.",
    groupHeader: "Grup",
    group: { small: "Küçük taşlar", large: "Büyük taşlar" },
    treatment: { a: "Tedavi A", b: "Tedavi B" },
    treatmentShort: { a: "A", b: "B" },
    overall: "İki grup birlikte",
    ahead: "önde",
    barsLabel: (
      smallA: string,
      smallB: string,
      largeA: string,
      largeB: string,
      overallA: string,
      overallB: string,
    ) =>
      `Küçük taşlar: A ${smallA}, B ${smallB}. Büyük taşlar: A ${largeA}, B ${largeB}. İki grup birlikte: A ${overallA}, B ${overallB}.`,
    reversedBody:
      "A her iki grupta önde, toplamda geride. A çoğunlukla zor vakalara, B çoğunlukla kolay vakalara verilmiş; yani toplam, iki tedaviyi değil iki farklı hasta karışımını karşılaştırıyor.",
    notReversedBody:
      "Gruplar böyle dağıtıldığında toplam, gruplarla aynı şeyi söylüyor. Ters dönme için iki tedavinin farklı hasta karışımlarına verilmesi gerekir.",
    shareLabel: (treatment: string) => `${treatment}: küçük taşlı hasta`,
    shareValue: (treatment: string, small: number, large: number) =>
      `${treatment}: ${small} küçük taşlı, ${large} büyük taşlı hasta`,
    shareHint:
      "Her tedavide toplam 350 hasta var. Küçük taşlı hasta sayısını değiştir ve toplam başarı oranına bak. Yuvarlama nedeniyle grupta gösterilen oran da biraz değişebilir.",
    restore: "Yayımlanmış tabloya dön",
    overallA: "A toplam",
    overallB: "B toplam",
    reversedFigure: "Ters döndü mü?",
    reversedYes: "Evet",
    reversedNo: "Hayır",

    treatmentName: { a: "Açık ameliyat", b: "Kapalı yöntem" },
    treatmentNote: {
      a: "büyük olan ameliyat",
      b: "küçük bir kesi, açık ameliyat yok",
    },
    stepSmallTitle: "Kolay vakalarla başlayalım",
    stepLargeButton: "Şimdi büyük taşları göster",
    stepOverallButton: "İki grubu topla",
    seenBoth: "İki grupta da aynı tedavinin başarı oranı daha yüksek.",
    chooseQuestion: "İki grup da aynı şeyi söylüyor. Sen hangi tedaviyi seçerdin?",
    choose: { a: "Açık ameliyat", b: "Kapalı yöntem" },
    chooseAnswer: (leader: string) => `İki grup da ${leader} diyor. Şimdi iki grubu topla.`,
    explainWhat:
      "Her grupta daha yüksek olan başarı oranı, gruplar birleştirilince daha düşük kalabilir.",
    explainWhy:
      "Açık ameliyat daha çok büyük taşlı hastalarda, kapalı yöntem ise daha çok küçük taşlı hastalarda kullanıldı. Her tedavinin toplam başarı oranında daha çok hastası olan grup daha fazla ağırlık alır.",
    explainMaths:
      "Her toplam oran, o tedavinin iki grup oranının ağırlıklı ortalamasıdır; ağırlıklar da her gruptaki hasta sayısıdır. Ağırlıklar değişince ortalama da değişir: grup oranları sabit kalsa bile.",
    illustrative:
      "Sayılar 1986 tarihli yayımlanmış bir karşılaştırmadan; burada veride bir etkiyi göstermek için kullanılıyor. Tıbbi tavsiye değildir.",
    announce: (a: string, b: string, reversed: string) =>
      `Toplam: A ${a}, B ${b}. Ters döndü: ${reversed}.`,
  },

  bridge:
    "Önceki deneyde iki farklı modelin sonuçlarını karşılaştırdık. Şimdi modeli sabit tutup deneme sayısını artıracağız.",

  pascal: {
    kicker: "Pascal'ın bilyeleri",
    title: "Aynı deneyi iki farklı modelle incele",
    setup: [
      "Bilye, çivilerden oluşan üçgenin üstünden bırakılır ve yerçekimiyle düşer.",
      "Fizik simülasyonunda bilyenin yönünü çivilerle teması ve hızı belirler.",
      "Sonunda durduğu göz hangisiyse orada sayılır.",
    ],
    caption:
      "İdeal modelde bilye her sırada, önceki adımlardan bağımsız olarak, 1/2 olasılıkla sağa veya sola gider. Gözlere ulaşma olasılıkları binom dağılımını izler. Fizik simülasyonunda ise bilyelerin hareketini yerçekimi, temas ve sürtünme belirler. İki sonuç ayrı sütunlarda gösterilir.",
    predictQuestion: "Birkaç bilye bırak. Nerede durur bunlar?",
    predict: {
      edges: "İki uçta",
      centre: "Ortada",
      even: "Gözlere eşit dağılarak",
    },
    predictAnswer: (bin: number, share: string) =>
      `ideal modele göre ${bin} numaralı göz; model bu göze ${share} pay verir`,
    dropLabel: "Bilye bırak",
    dropBatch: (n: number) => (n === 1 ? "1 bilye" : `${n} bilye`),
    dropHint: "Buradaki her bilye fizik motorunda benzetilir. Hiçbir sayı hesapla eklenmez.",
    falling: (n: number) => `${n} bilye hâlâ düşüyor`,
    boardLabel: (dropped: number, rows: number) =>
      `${rows} sıra çivili bilye tahtası. ${dropped} bilye aşağı bırakıldı ve gözlerde toplandı.`,
    boardEmptyLabel: (rows: number) =>
      `${rows} sıra çividen oluşan bir simülasyon; altındaki gözler boş.`,
    tableCaption: (rows: number, dropped: number) =>
      `${rows} sıralı simülasyonun her gözü: ideal modelin saydığı yol sayısı, öngördüğü pay ve fizik simülasyonunda gözlere yerleşen ${dropped} bilyeden bu göze düşenlerin oranı.`,
    binColumn: "Göz",
    pathsColumn: "Yol",
    idealColumn: "İdeal model",
    physicalColumn: "Fizik simülasyonu",
    shapeColumn: "Biçim",
    legend:
      "Üst çubuk ideal binom olasılığını, alt çubuk simülasyonda gözlenen oranı gösterir. İki modelin varsayımları farklı olduğu için sonuçlar ayrılabilir.",
    reading: (dropped: number, rows: number) =>
      `${dropped} bilye, her biri ${rows} sıra çivinin arasından; hepsi tek tek benzetildi.`,
    readingEmpty:
      "Gözler boş. Bir bilye bırak; nereye düşeceğine yerçekimi ve çiviler karar verir.",
    explainWhat:
      "İki modelde de merkezdeki gözlerde daha fazla bilye beklenir. Ancak bu gözlerin oranları aynı değildir.",
    explainWhy:
      "İdeal model her sırada bağımsız ve eşit olasılıklı sağ-sol seçimi varsayar. Fizik simülasyonunda bilyenin hızı, çarpışmaları ve sürtünmesi hesaplanır. Bu simülasyonda yatay hareketin azalması sonuçları merkeze daha fazla toplayabilir. Bu nedenle iki sütun farklı oranlar gösterebilir.",
    explainMaths: (rows: number, paths: string, total: string) =>
      `İdeal modelde ${rows} sıra için ${total} sağ-sol dizisi vardır. Merkezdeki göze ${paths} dizi ulaşır; oranı ${paths} / ${total} olur. Yol sayıları Pascal üçgenindeki binom katsayılarıdır. Bu sayılardan elde edilen oranlar binom dağılımını verir. Fizik sütunu bu formülden hesaplanmaz; simülasyonda her göze düşen bilyeler sayılır.`,
    ballsFigure: "Benzetilen bilye",
    ballsHint: "Her biri bir fiziksel deneme",
    rowsFigure: "Sıra",
    pathsFigure: "İdeal modeldeki yol",
    pathsHint: "2'nin sıra sayısı kuvveti",
    peakFigure: "En kalabalık göz",
    peakHint: (ideal: number) => `İdeal modelin en kalabalığı ${ideal}`,
    boardSettings: "Tahta ayarları",
    rowsLabel: "Çivi sırası",
    rowsValue: (rows: number, paths: string) => `${rows} sıra, ideal modelde ${paths} yol`,
    rowsHint: "Sıra sayısını değiştirmek mevcut bilyeleri temizler ve deneyi yeniden başlatır.",
    emptyBoard: "Gözleri boşalt",
    announce: (dropped: number, bin: number) =>
      `${dropped} bilye benzetildi. En çok bilye ${bin} numaralı gözde.`,
    coachLabel: "Sık sorulanlar",
    coach: {
      twoModels: {
        q: "Neden iki dağılım var?",
        a: "Bir sütunda binom modelinin olasılıkları, diğerinde fizik simülasyonunda sayılan bilyeler var. Birincisi bağımsız ve eşit olasılıklı sağ-sol seçimlerini, ikincisi yerçekimi, temas ve sürtünmeyi kullanır. Sonuçlar bu yüzden ayrı gösterilir.",
      },
      whyDiffer: {
        q: "Hangisi doğru?",
        a: "İdeal sütun, bağımsız sağ-sol seçimleri için hesaplanan olasılıktır. Fizik sütunu, bu simülasyonda bilyelerin düştüğü gözleri sayar. Farklı varsayımlara dayandıkları için aynı sonucu vermeleri gerekmez.",
      },
      whyMiddle: {
        q: "İki modelde de orta neden doluyor?",
        a: (paths: string, total: string) =>
          `İdeal modelde bu bir sayma meselesidir: simülasyonun izin verdiği ${total} yoldan ${paths} tanesi en kalabalık gözde, uçtaki gözlerin her birinde ise tam olarak bir tanesi biter. Fiziksel simülasyonda ise bir bilyenin uca ulaşması için her sırada aynı yöne sapması gerekir; üstelik her temas yanal hızının bir kısmını alıp götürdüğü için böyle bir şans dizisi daha da seyrekleşir.`,
      },
    },
  },

  largeNumbers: {
    kicker: "Büyük sayılar yasası",
    title: "Deneme sayısı arttıkça sonuç nasıl değişir?",
    setup: [
      "Tek bir çivi, tek bir adil karar: sol ya da sağ.",
      "Karar, bağımsız biçimde çok kez tekrarlanır.",
      "Sağa gidenlerin oranı teorik olasılıkla karşılaştırılır.",
    ],
    caption:
      "Bağımsız deneme sayısı arttıkça gözlenen oran teorik olasılığa yaklaşır. Ancak aradaki farkın her adımda azalması gerekmez. Grafikte farkın yeniden büyüdüğü aralıkları da incele.",
    predictQuestion: "Deneme sayısı arttıkça gözlenen oran ne yapar?",
    predict: {
      settles: "Teorik değerin yakınında durulur",
      swings: "Aynı genlikte salınmayı sürdürür",
      exact: "Tam olarak teorik değere eşitlenir",
    },
    predictAnswer: "üzerine tam oturmadan teorik değerin yakınında durur",
    thousands: ".",
    scaleLabel: "Deneme sayısı",
    watchHint: "Her kararın gelişini izleyecek kadar küçük.",
    acceleratedHint: "Tek tek çizilemeyecek kadar çok. Yine de her deneme sayılıyor.",
    chartLabel: (trials: string, observed: string, theoretical: string) =>
      `${trials} deneme boyunca gözlenen oran, logaritmik ölçekte. ${observed} değerinde bitiyor; düz referans çizgisi olarak çizilen teorik olasılık ise ${theoretical}.`,
    axisStart: "1 deneme",
    axisEnd: (trials: string) => `${trials} deneme`,
    outcomesLabel: (n: number) => `İlk ${n} karar, sırasıyla`,
    outcomeLabel: (index: number, side: string) => `${index}. deneme: ${side}`,
    right: "sağ",
    left: "sol",
    rightMark: "S",
    leftMark: "L",
    tableCaption:
      "Aynı koşunun geçtiği her ölçekte okunuşu: teorik olasılık, gözlenen oran ve aralarındaki uzaklık.",
    trialsColumn: "Deneme",
    theoreticalColumn: "Teorik",
    observedColumn: "Gözlenen",
    deviationColumn: "Sapma",
    tableNote:
      "Sapma sütununu yukarıdan aşağıya oku. Farkın azaldığı ve yeniden büyüdüğü satırlara bak.",
    reading: (trials: string) =>
      `Tek bir tohumdan üretilmiş ${trials} bağımsız karar. Aynı tohum her seferinde aynı koşuyu verir.`,
    explainWhat: "Oran başlarda gezinir, sonra teorik olasılığın yakınında durulur.",
    explainWhy:
      "n. deneme gözlenen oranı en fazla 1/n kadar değiştirebilir. Örneğin 10.000. denemenin etkisi en fazla 1/10.000’dir.",
    explainMaths:
      "Gözlenen oran, sağa giden karar sayısının deneme sayısına bölümüdür; sapma ise bu oranın teorik olasılığa uzaklığıdır. İkisi de bir formülden değil, koşunun kendisinden okunur; sapma sütununun arada bir yeniden yükselmesinin nedeni de budur.",
    theoreticalFigure: "Teorik olasılık",
    theoreticalHint: "Adil bir karar; ölçülmüş değil, tanımlanmış",
    observedFigure: "Gözlenen oran",
    deviationFigure: "Sapma",
    deviationHint: "Teorik değere uzaklık",
    trialsFigure: "Deneme",
    announce: (trials: string, observed: string) => `${trials} deneme. Gözlenen oran ${observed}.`,
    coachLabel: "Sık sorulanlar",
    coach: {
      notEvenly: {
        q: "İki tarafın tam olarak eşitlenmesi gerekmez mi?",
        a: "Gerekmez. Sağa gidenlerin payı yarıya yaklaşır, ama iki sayı arasındaki fark büyümekte serbesttir. Bir koşu bir tarafta on bin fazla bitirip yine de oran olarak yarıya çok yakın durabilir; çünkü oran çok daha büyük bir sayıya bölünür.",
      },
      dueForOne: {
        q: "Üst üste sola gittikten sonra sağ gelmesi gerekmez mi?",
        a: "Gerekmez. Her karar bağımsızdır; sıradaki karar da ilki kadar her iki yöne gidebilir. Dengesiz bir başlangıcı düzelten şey, ters yönde telafi eden bir seri değil, sonraki denemelerin çokluğunun onu seyreltmesidir.",
      },
      howMany: {
        q: "Kaç deneme yeterlidir?",
        a: "Ne kadar yakın olman gerektiğine ve bundan ne kadar emin olmak istediğine bağlıdır. Kanun bir takvim değil bir eğilim tarif eder ve gözlenen oranın teorik olasılığın yakınında kalacağını garanti eden bir sayı vermez.",
      },
    },
  },

  recap: {
    lessons: [
      "Monty Hall oyununda kapı değiştirerek kazanma olasılığı 2/3’tür. Bu sonuç, sunucunun her turda keçi göstermesine bağlıdır.",
      'Bir ipucu hangi sonuçların mümkün kaldığını değiştirir ve hangilerinin kalacağına cümlenin kuruluşu karar verir. "En az biri erkek" ile "ilki erkek" farklı kümeler bırakır.',
      "Tutma meselesi kişilerle değil çiftlerle ilgilidir. Yirmi üç kişi 253 çift oluşturur; aynı doğum gününün hissedildiğinden çok daha erken gelmesinin nedeni budur.",
      "Grupları toplamak, gruplar aynı biçimde doldurulmamışsa içlerindeki karşılaştırmayı tersine çevirebilir.",
    ],
    footer:
      "Her sonucu kendi varsayımlarıyla değerlendir. Hesaplanan olasılıklar, rastgele denemeler ve fizik simülasyonunun sonuçları birbirinin yerine kullanılmaz. İpucunun veriliş biçimi sonucu değiştiriyorsa bu koşul deneyde ayrıca belirtilir.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Bir kapı seç. Sunucu boş bir kapıyı açtıktan sonra seçimini değiştirip değiştirmeyeceğine karar ver. Sonucu çok sayıda turla karşılaştır.",
    stages: {
      monty: {
        pick: "Bir kapı seç. Tur ilk kapıyı seçti.",
        choose:
          "Sunucu arkasında keçi olan bir kapıyı açtı. Seçtiğin kapıda kal ya da kapalı olan öbür kapıya geç.",
        score:
          "Oynadığın turlar burada toplanır. Birkaç turdan sonra bin turu tek seferde oynatabilirsin.",
      },
      birthday: {
        guess:
          "Önce tahmin et. Odadaki kişi sayısı kaç olduğunda en az iki kişinin aynı gün doğmuş olma olasılığı %50’yi geçer?",
        people: "Düğmeyle birer kişi ekle ya da kaydırıcıyla kişi sayısını değiştir.",
        room: "Odaya giren her yeni kişi, içerideki herkesle yeni bir çift oluşturur.",
        chance: "Kişi, çift ve kesin olasılık. Çift sayısı kişi sayısını hızla geçer.",
      },
      conditional: {
        families:
          "Eşit olasılıklı bütün iki çocuklu aileler. İpucu, dışarıda bıraktıklarının üstünü çizer.",
        clue: "İpucunun ifadesini değiştir. Tur değiştirdi; geriye farklı aileler kaldı.",
        answer: "Kalan aileler, kaçında iki erkek çocuk olduğu ve cevap.",
      },
      simpson: {
        table: "İki böbrek taşı tedavisi; önce küçük taşlar.",
        large: "Büyük taşları ekle. İki grupta da aynı tedavi kazanıyor.",
        choose: "Bir tedavi seç, sonra iki grubun toplamına bak.",
        rates: "Her grupta daha iyi, toplamda daha kötü: grupların büyüklüğü aynı değil.",
      },
      pascal: {
        board: "Çivili bir tahta ve yanında binom modelinin tahmini.",
        drop: "Bir bilye bırak; nereye düşeceğine yerçekimi ve çiviler karar verir. Tur bir tane bıraktı.",
        many: "Bir seferde çok sayıda bırak; çan eğrisi ortaya çıkar.",
        rows: "Sıra sayısını buradan değiştir.",
      },
      largeNumbers: {
        chart: "Grafikte sağa gidenlerin oranını yatay teorik olasılık çizgisiyle karşılaştır.",
        trials: "Deneme sayısını değiştir ve grafiğin yatay eksenine bak.",
        figures:
          "Sapma sütununa bak. Deneme sayısı arttıkça fark genellikle küçülür. Bazı satırlarda tekrar büyüyebilir.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      monty: "Monty Hall ve koşullu olasılık",
      birthday: "Doğum günleri: kişiler değil, çiftler",
      simpson: "Simpson paradoksu",
      galton: "Galton tahtası ve çan eğrisi",
    },
    notes: {
      "np-monty": "Oyun beş dakikada.",
      "stat110-l6": "Harvard'ın Monty Hall ve Simpson paradoksu dersi.",
      "stat110-l3": "Doğum günü probleminin derste çözümü.",
      "mp-simpson": "Her grupta daha iyi, toplamda daha kötü; dört dakikada.",
      "3b1b-clt": "Bir Galton tahtasından başlayıp merkezi limit teoremine varır.",
      "stat110-l29": "Büyük sayılar yasası ve merkezi limit teoremi, derste.",
      "probability-videos":
        "Temel olasılık ve koşullu olasılık video dersleriyle başla, ardından Monty Hall deneyine dön. Videolar kısa konulara ayrılmış; tamamını sırayla izlemek gerekmiyor.",
    },
  },
};

export default copy;
