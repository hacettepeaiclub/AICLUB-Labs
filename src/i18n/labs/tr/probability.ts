import type en from "../en/probability";

/** Türkçe metin: probability. Şekli `en/probability.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    statisticalInference:
      "İki çocuk deneyinin arkasındaki koşullu olasılık kurallarını (koşullu olasılık, s. 20; problemin kendisi Alıştırma 1.25, s. 40), Pascal satırının arkasındaki binom katsayılarını (s. 15) ve büyük sayılar kanununu (zayıf, s. 232; güçlü, s. 235) destekler. Buradaki benzetimler bu sonuçları gösterir; onları temellendirmez.",
    simpson:
      "Dördüncü deneyin gösterdiği tersine dönmeyi destekler: her alt grupta geçerli olan bir ilişkinin, alt gruplar birleştirildiğinde yön değiştirmesi.",
  },

  scope:
    "Dört çözümlü problem; olasılığın geneline bir bakış değil. Her biri belirtilmiş bir model kullanır (iki kurala bağlı bir sunucu, eşit olasılıklı 365 doğum günü, her biri bağımsız olarak erkek ya da kız olan iki çocuk, yayımlanmış tek bir klinik tablo) ve cevaplar bu modellere aittir. Bir sayı simülasyondan geliyorsa simülasyon olarak etiketlenir: bir deneyi çok kez çalıştırmak bir sonucu gösterir, kanıtlamaz.",

  prediction: {
    yours: "Siz dediniz",
    actual: "Gerçekte",
    agreed: "Sezginiz modelle aynı fikirde.",
    disagreed: "Sezginizle model aynı fikirde değil. İlginç olan kısım da bu.",
  },

  // Her sonucun altındaki iki adım: önce nedeni, sonra hesabı.
  explain: {
    why: "Bu neden böyle oluyor?",
    maths: "Sayıları göster",
  },

  monty: {
    title: "Üç kapı",
    question: "Sunucuyu yenebilir misin?",
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
        a: "Çünkü iki kapı buraya aynı yoldan gelmedi. Seninkini hiçbir şey bilmezken seçtin. Diğeri ise arabanın yerini tam olarak bilen ve onu asla açmayacak olan birinin seçiminden sağ çıktı.",
      },
      whySwitch: {
        q: "Değiştirmek neden daha iyi?",
        a: (stay: string, swap: string) =>
          `İlk seçimin zamanın ${stay} kadarında arabadır ve kalmak yalnızca o zaman kazanır. Kalan ${swap} kadarında araba seçmediğin iki kapıdan birinin arkasındadır: sunucu da az önce bu ikisinden hangisinde olmadığını gösterdi.`,
      },
      hostKnows: {
        q: "Sunucunun biliyor olması önemli mi?",
        a: "Her şey o. Rastgele kapı açan (bazen kazara arabayı gösteren) bir sunucu, kalmakla değiştirmeyi eşit kılardı. Açılan kapıyı bilgilendirici yapan şey, sunucunun bilmesi.",
      },
    },
    caption:
      "Sunucu iki kurala bağlıdır: sizin kapınızı asla açmaz, arabayı asla açmaz. Açmayı bilgilendirici kılan da bu kurallardır: rastgele kapı açan bir sunucu iki seçeneği eşit bırakırdı.",
    predictQuestion: "Bir el oynadın. Çok sayıda elde hangisi daha iyi gider?",
    predict: { stay: "Kal", switch: "Değiştir", same: "Fark etmez" },
    predictAnswer: (value: string) => `Değiştirmek zamanın ${value} kadarında kazanır`,
    strategy: { stay: "Kal", switch: "Değiştir" },
    doorsIdle: "Üç kapalı kapı. Birinin arkasında araba, ikisinde keçi var.",
    doorsLabel: (picked: number, opened: number) =>
      `Üç kapı. ${picked}. kapıyı seçtiniz. Sunucu keçiyi göstermek için ${opened}. kapıyı açtı.`,
    doorLabel: (n: number, state: string) => `${n}. kapı, ${state}`,
    doorState: {
      closed: "kapalı",
      picked: "sizin seçiminiz",
      opened: "sunucu açtı, keçi",
      revealed: "araba",
    },
    won: "arabayı kazandınız",
    lost: "arabayı kazanamadınız",
    promptPick: "Bir kapı seçin.",
    promptDecide: (opened: number, other: number) =>
      `Sunucu ${opened}. kapıyı açtı ve arkasından keçi çıktı. Kapınızda kalın mı, ${other}. kapıya mı geçin?`,
    resultLine: (strategy: string, result: string) => `${strategy} dediniz, ${result}.`,
    again: "Yeniden oyna",
    announceOpened: (n: number) => `Sunucu ${n}. kapıyı açtı. Arkasından keçi çıktı.`,
    announceResult: (result: string) => `Tur bitti: ${result}.`,
    runBatch: (n: number) => `${n.toLocaleString("tr-TR")} tur çalıştır`,
    batchTitle: "Simüle edilen turlar",
    batchIdle: (n: number) =>
      `Elle birkaç tur oynamak bunu çözmez. ${n.toLocaleString("tr-TR")} tur çalıştırın.`,
    batchCaption: (n: number) =>
      `${n} simüle edilmiş turda kalmanın ve değiştirmenin kazanma oranları, tam olasılıkların yanında.`,
    strategyHeader: "Strateji",
    simulatedHeader: (n: number) => `Simülasyon (${n.toLocaleString("tr-TR")})`,
    exactHeader: "Tam değer",
    wins: (wins: number, rounds: number) => `${wins}/${rounds}`,
    playedLabel: "Oynadığınız tur",
    yourStayLabel: "Kalmak kazandırırdı",
    yourSwitchLabel: "Değiştirmek kazandırırdı",
    handHint: "sizin turlarınızda",

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
    batchInvite: "İki kapı kaldı ve bu bir yazı tura değil. 1.000 oyunda görelim mi?",
  },

  birthday: {
    kicker: "Sandığınızdan küçük bir oda",
    title: "İki kişinin doğum günü tutması için kaç kişi gerekir?",
    setup: [
      "İnsanlar odaya teker teker giriyor.",
      "Herkesin doğum günü 365 günden biri ve her gün eşit olasılıkta.",
      "Soru, birinin seninle aynı doğum gününe sahip olup olmadığı değil. Odadaki herhangi iki kişinin tutup tutmadığı.",
    ],
    addPerson: "Bir kişi ekle",
    addPersonHint: "Çift sayısına ne olduğuna bak.",
    roomFull: "Oda doldu.",
    coachLabel: "Herkesin sorduğu sorular",
    coach: {
      soonWhy: {
        q: (n: number) => `${n} kişi nasıl yazı tura oluyor?`,
        a: (n: number, pairs: string) =>
          `Kişileri değil çiftleri say. ${n} kişi ${pairs} farklı çift yapar ve her çift kendi başına bir tutma şansıdır. Bir kişi daha eklediğinde odadaki herkesle yeni birer çift getirir; yani şanslar kalabalıktan çok daha hızlı birikir.`,
      },
      notMine: {
        q: "Bu benim doğum günümle ilgili değil mi?",
        a: "Sezginin yaptığı takas bu ve o çok daha zor bir soru. Birinin tam olarak seninle tutması için yaklaşık 253 kişi gerekir. Herhangi iki kişinin birbiriyle tutması için 23.",
      },
      realBirthdays: {
        q: "Doğum günleri gerçekten eşit mi dağılır?",
        a: "Hayır: gerçek doğum günleri mevsime göre kümelenir ve kümelenme tutmayı daha olası kılar, daha az değil. Yani buradaki eşit dağılım modeli temkinli cevabı verir; gerçekte %50 biraz daha erken geçilir.",
      },
    },
    caption:
      "Model: eşit olasılıklı 365 doğum günü, artık yıl yok, herkes bağımsız. Gerçek doğum günleri mevsime göre kümelenir ve bu, gerçek olasılığı biraz yükseltir, yani buradaki, temkinli olanı.",
    predictQuestion: "Sizce olasılık ilk ne zaman %50'yi geçer?",
    predict: { count: (n: number) => `${n} kiÅi` },
    predictAnswer: (n: number, value: string) => `${n} kişi, ${value} ile`,
    peopleLabel: "Odadaki kişi",
    peopleValue: (n: number, value: string) => `${n} kişi, aynı doğum günü olasılığı ${value}`,
    peopleHint: "Yirmili sayılardan yavaşça geçirin.",
    roomLabel: (n: number) => `${n} kişilik bir oda. Hiç kimsenin doğum günü tutmuyor.`,
    roomLabelMatch: (n: number, a: number, b: number, day: string) =>
      `${n} kişilik bir oda. ${a}. ve ${b}. kişinin doğum günü aynı: ${day}.`,
    foundPair: (a: number, b: number, day: string) =>
      `${a}. ve ${b}. kişinin doğum günü aynı: ${day}.`,
    noPair: (n: number) => `${n} kişilik bu odada herkesin doğum günü farklı.`,
    tableCaption: (n: number) =>
      `${n} kişi arasında aynı doğum günü olasılığı: tam değer ve simülasyon.`,
    exactRow: "Tam olasılık",
    simulatedRow: (rooms: number) => `Simülasyon (${rooms.toLocaleString("tr-TR")} oda)`,
    stale: (n: number) => `yeniden çalıştırın, son çalışma ${n} kişiydi`,
    reading: (n: number, pairs: number) =>
      `${n} kişi ${pairs.toLocaleString("tr-TR")} farklı çift oluşturur ve her biri tutma şansıdır.`,
    peopleFigure: "Kişi",
    pairsFigure: "Çift",
    pairsHint: "tutma şansı",
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
      "Soru, birinin seninle tutup tutmadığı değil. Herhangi iki kişinin birbiriyle tutup tutmadığı, ve odaya giren her yeni kişi, içerideki herkesle yeni bir çift kuruyor. Çiftler, insanlardan çok daha hızlı birikiyor.",
    explainMaths: (n: number, pairs: string, value: string) =>
      `${n} kişiyle ${pairs} çift olur. Hiçbir çiftin tutmama olasılığı 365/365 × 364/365 × … çarpımıdır; bunun bire tümleyeni ${value}.`,
    simulateLabel: "Bunun yerine çalıştırın",
    runRooms: (n: number) => `${n.toLocaleString("tr-TR")} oda doldur`,
    simulateNote: (days: number) =>
      `Her oda, kişi başına eşit olasılıklı ${days} günden bir doğum günü çeker, sonra tekrar arar.`,
    announce: (n: number, value: string) => `${n} kişi. Aynı doğum günü olasılığı: ${value}.`,
    months: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
  },

  conditional: {
    kicker: "İşi yapan şey ipucu",
    title: "Bir ailenin iki çocuğu var. İkisi de erkek mi?",
    setup: [
      "Bir ailenin iki çocuğu var: biri büyük, biri küçük.",
      "Her çocuk erkek ya da kız ve ikisi de eşit olasılıkta, yani eşit olasılıklı dört aile var.",
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
    clueHint: "Aynı aile, farklı cümle. Hangi kutuların kaldığına bakın.",
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
    explainWhat: "Bir çocuk hakkında bilgi almak, diğerinin ne olma ihtimalini değiştirir.",
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
      "Baktığın şeyin bir adı var: Simpson paradoksu: gruplar toplandığında tersine dönen bir karşılaştırma.",
    coachLabel: "Herkesin sorduğu sorular",
    coach: {
      howBoth: {
        q: "A her iki grupta kazanıp toplamda nasıl kaybedebilir?",
        a: "Çünkü iki tedavi aynı tür hastaya verilmedi. A çoğunlukla zor vakalarda, B çoğunlukla kolay vakalarda kullanıldı. Grupları toplamak “hangi tedavi” ile “hangi hastalar” sorusunu birbirine karıştırır ve hasta karışımı daha güçlü etkidir.",
      },
      whichWrong: {
        q: "Sayılardan biri yanlış mı?",
        a: "İkisi de değil. İkisi de aynı sayımlar üzerinde aritmetik ve her yüzdeyi yanındaki iki sayıyla karşılaştırıp doğrulayabilirsin. Bunlar iki farklı sorunun doğru cevapları.",
      },
      whichBelieve: {
        q: "Peki hangi sayıya inanmalıyım?",
        a: "Tek bir hasta için tedavi seçerken grup satırlarına, çünkü o hastanın ya küçük taşı vardır ya büyük, ikisinin ortalaması asla olmaz. Toplam satırı başka bir soruyu yanıtlar: bu belirli hasta karışımına ne oldu.",
      },
    },
    caption:
      "Grup başına başarı oranları Charig ve ark. (1986) çalışmasından, iki böbrek taşı tedavisinin karşılaştırılmasından geliyor. Kaydırıcılar hastaları gruplar arasında taşır; oranlar yerinde kalır. Her yüzde, yanında yazan sayıların bölümüdür.",
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
      "Her tedavi 350 hastasını ve grup başına başarı oranlarını korur. Yalnızca karışım değişir.",
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
    seenBoth: "Her iki grupta da kazanan aynı.",
    chooseQuestion: "İki grup da aynı şeyi söylüyor. Sen hangi tedaviyi seçerdin?",
    choose: { a: "Açık ameliyat", b: "Kapalı yöntem" },
    chooseAnswer: (leader: string) => `İki grup da ${leader} diyor. Şimdi iki grubu topla.`,
    explainWhat: "Her grupta kazanan taraf, gruplar toplanınca kaybedebilir.",
    explainWhy:
      "İki tedavi aynı tür hastaya verilmedi. Açık ameliyat büyük taşların çoğunu (zor vakaları) üstlendi, kapalı yöntem ise küçük taşların çoğunu. Grupları toplamak “hangi tedavi” ile “hangi hastalar” sorusunu birbirine karıştırır ve hasta karışımı daha güçlü etkidir.",
    explainMaths:
      "Her toplam oran, o tedavinin iki grup oranının ağırlıklı ortalamasıdır; ağırlıklar da her gruptaki hasta sayısıdır. Ağırlıklar değişince ortalama da değişir: grup oranları sabit kalsa bile.",
    illustrative:
      "Sayılar 1986 tarihli yayımlanmış bir karşılaştırmadan; burada veride bir etkiyi göstermek için kullanılıyor. Tıbbi tavsiye değildir.",
    announce: (a: string, b: string, reversed: string) =>
      `Toplam: A ${a}, B ${b}. Ters döndü: ${reversed}.`,
  },

  bridge:
    "Tek bir düzeneğin iki modeli, aynı gözler konusunda anlaşamıyor. Sıradaki deney önce modeli sabitler; böylece değişen tek şey, denemenin kaç kez yinelendiği olur.",

  pascal: {
    kicker: "Pascal'ın bilyeleri",
    title: "Aynı düzeneğin iki modeli.",
    setup: [
      "Bilye, çivilerden oluşan üçgenin üstünden bırakılır ve yerçekimiyle düşer.",
      "Yön değişimlerinin her biri bir çarpışmadan doğar, bir yazı turadan değil.",
      "Sonunda durduğu göz hangisiyse orada sayılır.",
    ],
    caption:
      "İdeal matematiksel model her sırayı bağımsız bir sol ya da sağ adımı olarak ele alır; bu da binom dağılımını verir. Ekrandaki fiziksel düzenekte ise adım diye bir şey yoktur: bilyenin nereye gideceğine yerçekimi, temas geometrisi, esneklik ve sürtünme karar verir. İkisi farklı mekanizmalardır ve tablo onları ayrı sütunlarda tutar.",
    predictQuestion: "Birkaç bilye bırakın. Nerede durur bunlar?",
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
      `${rows} sıra çividen oluşan bir düzenek. ${dropped} bilye fiziksel olarak aşağı düştü ve alttaki gözlerde durdu.`,
    boardEmptyLabel: (rows: number) =>
      `${rows} sıra çividen oluşan bir düzenek; altındaki gözler boş.`,
    tableCaption: (rows: number, dropped: number) =>
      `${rows} sıralı düzeneğin her gözü: ideal modelin saydığı yol sayısı, öngördüğü pay ve fiziksel olarak benzetilen ${dropped} bilyenin ulaştığı gerçek pay.`,
    binColumn: "Göz",
    pathsColumn: "Yol",
    idealColumn: "İdeal model",
    physicalColumn: "Fiziksel düzenek",
    shapeColumn: "Biçim",
    legend:
      "Üstteki çubuk ideal binom modelini, alttaki fiziksel sonuçları gösterir. Ayrıştıkları yerde düzenek, hesabın modellemediği bir şeyi söylüyordur.",
    reading: (dropped: number, rows: number) =>
      `${dropped} bilye, her biri ${rows} sıra çivinin arasından; hepsi tek tek benzetildi.`,
    readingEmpty:
      "Gözler boş. Bir bilye bırakın; nereye düşeceğine yerçekimi ve çiviler karar verir.",
    explainWhat:
      "İki model de bilyelerin çoğunu ortaya yakın yerleştirir; kaç tanesini konusunda ise anlaşamazlar.",
    explainWhy:
      "İdeal model bir sayma sorusu sorar: bu büyüklükteki bir düzeneğin izin verdiği bütün sol-sağ dizileri içinde kaç tanesi hangi gözde biter? Fiziksel düzenekte ise hiçbir şey adım atmaz. Bilye bir çiviye belirli bir hız ve açıyla gelir, temasın verdiğiyle ayrılır ve bir sonrakine giderken yanal hareketinin bir kısmını sürtünmeye kaptırır. Bu kayıp onu ortaya doğru çeker; dolayısıyla bu düzenek, sayma argümanının öngördüğünden daha dar toplanır. İki yanıt da yanlış değildir; farklı soruların yanıtlarıdır.",
    explainMaths: (rows: number, paths: string, total: string) =>
      `İdeal modelde ${rows} sıralı bir düzenek, her karar dizisine bir tane düşmek üzere ${total} yola izin verir; belirli bir gözde biten yolların sayısı da Pascal üçgeninin o satırındaki değerdir. En kalabalık göze ${paths} yol ulaşır, yani payı bu sayının ${total} değerine bölümüdür. Bu değerler binom katsayılarıdır, verdikleri paylar da binom dağılımıdır. Fiziksel sütun ise bunların hiçbirinden hesaplanmaz: benzetilen bilyelerin nerede durduğunun sayımıdır.`,
    ballsFigure: "Benzetilen bilye",
    ballsHint: "Her biri bir fiziksel deneme",
    rowsFigure: "Sıra",
    pathsFigure: "İdeal modeldeki yol",
    pathsHint: "2'nin sıra sayısı kuvveti",
    peakFigure: "En kalabalık göz",
    peakHint: (ideal: number) => `İdeal modelin en kalabalığı ${ideal}`,
    boardSettings: "Düzenek",
    rowsLabel: "Çivi sırası",
    rowsValue: (rows: number, paths: string) => `${rows} sıra, ideal modelde ${paths} yol`,
    rowsHint: "Düzeneği yeniden kurmak gözleri boşaltır: farklı bir düzenek, farklı bir deneydir.",
    emptyBoard: "Gözleri boşalt",
    announce: (dropped: number, bin: number) =>
      `${dropped} bilye benzetildi. En çok bilye ${bin} numaralı gözde.`,
    coachLabel: "Sık sorulanlar",
    coach: {
      twoModels: {
        q: "Neden iki dağılım var?",
        a: "Çünkü iki model var. Biri, her sıranın bağımsız ve adil bir adım olduğu idealleştirilmiş bir düzenekteki yolları sayar. Diğeri ise içinde yerçekimi, temas ve sürtünme bulunan bir katı cisim benzetimidir. Aynı resmi anlatırlar ama aynı şey değildirler; bu yüzden tek bir eğride ortalanmak yerine ayrı sütunlarda gösterilirler.",
      },
      whyDiffer: {
        q: "Hangisi doğru?",
        a: "Her biri kendi konusunda doğrudur. Binom dağılımı, sayma modeli hakkında tam olarak doğrudur. Fiziksel sütun da bu benzetilmiş düzeneğin tam olarak yaptığı şeydir. Model, bir mekanizmanın idealleştirilmesidir; mekanizmada idealleştirmede bulunmayan şeyler varsa ikisi ayrışır. İşe yarar kısım da tam olarak nerede ayrıştıklarını fark etmektir.",
      },
      whyMiddle: {
        q: "İki modelde de orta neden doluyor?",
        a: (paths: string, total: string) =>
          `İdeal modelde bu bir sayma meselesidir: düzeneğin izin verdiği ${total} yoldan ${paths} tanesi en kalabalık gözde, uçtaki gözlerin her birinde ise tam olarak bir tanesi biter. Fiziksel düzenekte ise bir bilyenin uca ulaşması için her sırada aynı yöne sapması gerekir; üstelik her temas yanal hızının bir kısmını alıp götürdüğü için böyle bir şans dizisi daha da seyrekleşir.`,
      },
    },
  },

  largeNumbers: {
    kicker: "Büyük Sayılar Kanunu",
    title: "Kararı tekrarlayın; oran yerine oturur.",
    setup: [
      "Tek bir çivi, tek bir adil karar: sol ya da sağ.",
      "Karar, bağımsız biçimde çok kez tekrarlanır.",
      "Sağa gidenlerin oranı teorik olasılıkla karşılaştırılır.",
    ],
    caption:
      "Kanun, bağımsız denemeler biriktikçe gözlenen oranın teorik olasılığa yaklaşma eğiliminde olduğunu söyler. Aradaki farkın her adımda küçüleceğini söylemez; bu koşuda da küçülmez: çizgi yerine oturmadan önce uzaklaştığı yerleri izleyin.",
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
      "Sapma sütununu yukarıdan aşağıya okuyun. Küçülme eğilimindedir; her satırda küçülmesi gerekmez.",
    reading: (trials: string) =>
      `Tek bir tohumdan üretilmiş ${trials} bağımsız karar. Aynı tohum her seferinde aynı koşuyu verir.`,
    explainWhat: "Oran başlarda gezinir, sonra teorik olasılığın yakınında durulur.",
    explainWhy:
      "Her yeni deneme, yürüyen oranı bir öncekinden daha az oynatır; çünkü giderek artan sayıda sonucun yalnızca biridir. Başlangıçta tek bir sonuç payı onda bir oynatabilir; on bin denemeden sonra on binde birden fazla oynatamaz. Gezinme durmaz, yalnızca bu ölçekte görünmez olur.",
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
        a: "Ne kadar yakın olmanız gerektiğine ve bundan ne kadar emin olmak istediğinize bağlıdır. Kanun bir takvim değil bir eğilim tarif eder ve gözlenen oranın teorik olasılığın yakınında kalacağını garanti eden bir sayı vermez.",
      },
    },
  },

  recap: {
    lessons: [
      "Sezgi bir olasılık hesaplayıcısı değildir. Dört deneyin dördünde de akla ilk gelen cevap yanlış olanıdır.",
      'Bir ipucu hangi sonuçların mümkün kaldığını değiştirir ve hangilerinin kalacağına cümlenin kuruluşu karar verir. "En az biri erkek" ile "ilki erkek" farklı kümeler bırakır.',
      "Tutma meselesi kişilerle değil çiftlerle ilgilidir. Yirmi üç kişi 253 çift oluşturur; aynı doğum gününün hissedildiğinden çok daha erken gelmesinin nedeni budur.",
      "Grupları toplamak, gruplar aynı biçimde doldurulmamışsa içlerindeki karşılaştırmayı tersine çevirebilir.",
    ],
    footer:
      "Bunların her biri, belirtilmiş bir modeli olan çözümlü birer problemdir; şansa dair genel bir kural değil. Tam olasılıklar kapalı formda hesaplanır; simüle edilenler ise deneyin tohumlanmış bir üreteçle gerçekten çalıştırılmasından gelir ve her zaman böyle etiketlenir. Bir soru gerçekten belirsizse (en açık örnek iki çocuk problemidir), varsayım sessizce seçilmez, yazılır.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Üç kapı, bir araba. Sunucuya karşı bir tur oynayın ve kapınızda kalmanın mı, değiştirmenin mi kazandırdığını bulun.",
    stages: {
      monty: {
        pick: "Bir kapı seçin. Tur ilk kapıyı seçti.",
        choose:
          "Sunucu arkasında keçi olan bir kapıyı açtı. Karar sizin: kapınızda kalın ya da kapalı olan öbür kapıya geçin.",
        score:
          "Oynadığınız turlar burada toplanır. Birkaç turdan sonra bin turu tek seferde oynatabilirsiniz.",
      },
      birthday: {
        guess:
          "Önce tahmin edin: kaç kişide ortak bir doğum günü olması olmamasından daha olası hale gelir?",
        people: "Kişileri düğmeyle teker teker ekleyin ya da bu kaydırıcıyla atlayın.",
        room: "Odaya giren her yeni kişi, içerideki herkesle yeni bir çift oluşturur.",
        chance: "Kişi, çift ve kesin olasılık. Çift sayısı kişi sayısını hızla geçer.",
      },
      conditional: {
        families:
          "Eşit olasılıklı bütün iki çocuklu aileler. İpucu, dışarıda bıraktıklarının üstünü çizer.",
        clue: "İpucunun ifadesini değiştirin. Tur değiştirdi; geriye farklı aileler kaldı.",
        answer: "Kalan aileler, kaçında iki erkek çocuk olduğu ve cevap.",
      },
      simpson: {
        table: "İki böbrek taşı tedavisi; önce küçük taşlar.",
        large: "Büyük taşları ekleyin. İki grupta da aynı tedavi kazanıyor.",
        choose: "Bir tedavi seçin, sonra iki grubun toplamına bakın.",
        rates: "Her grupta daha iyi, toplamda daha kötü: grupların büyüklüğü aynı değil.",
      },
      pascal: {
        board: "Çivili bir tahta ve yanında binom modelinin tahmini.",
        drop: "Bir bilye bırakın; nereye düşeceğine yerçekimi ve çiviler karar verir. Tur bir tane bıraktı.",
        many: "Bir seferde çok sayıda bırakın; çan eğrisi ortaya çıkar.",
        rows: "Sıra sayısını buradan değiştirin.",
      },
      largeNumbers: {
        chart: "Turlar biriktikçe kazanma oranı ve teorik değer.",
        trials: "Kaç tur oynanacağını seçin. Tur en çoğunu seçti.",
        figures: "Gözlenen ve teorik değer. Fark her adımda küçülmez ama sonunda oturur.",
      },
    },
  },
};

export default copy;
