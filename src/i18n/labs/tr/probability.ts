import type en from "../en/probability";

/** Türkçe metin: probability. Şekli `en/probability.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    statisticalInference:
      "\u0130ki \u00e7ocuk deneyinin arkas\u0131ndaki ko\u015fullu olas\u0131l\u0131k kurallar\u0131n\u0131 (ko\u015fullu olas\u0131l\u0131k, s. 20; problemin kendisi Al\u0131\u015ft\u0131rma 1.25, s. 40), Pascal sat\u0131r\u0131n\u0131n arkas\u0131ndaki binom katsay\u0131lar\u0131n\u0131 (s. 15) ve b\u00fcy\u00fck say\u0131lar kanununu (zay\u0131f, s. 232; g\u00fc\u00e7l\u00fc, s. 235) destekler. Buradaki benzetimler bu sonu\u00e7lar\u0131 g\u00f6sterir; onlar\u0131 temellendirmez.",
    simpson:
      "D\u00f6rd\u00fcnc\u00fc deneyin g\u00f6sterdi\u011fi tersine d\u00f6nmeyi destekler: her alt grupta ge\u00e7erli olan bir ili\u015fkinin, alt gruplar birle\u015ftirildi\u011finde y\u00f6n de\u011fi\u015ftirmesi.",
  },

  scope:
    "D\u00f6rt \u00e7\u00f6z\u00fcml\u00fc problem; olas\u0131l\u0131\u011f\u0131n geneline bir bak\u0131\u015f de\u011fil. Her biri belirtilmi\u015f bir model kullan\u0131r (iki kurala ba\u011fl\u0131 bir sunucu, e\u015fit olas\u0131l\u0131kl\u0131 365 do\u011fum g\u00fcn\u00fc, her biri ba\u011f\u0131ms\u0131z olarak erkek ya da k\u0131z olan iki \u00e7ocuk, yay\u0131mlanm\u0131\u015f tek bir klinik tablo) ve cevaplar bu modellere aittir. Bir say\u0131 sim\u00fclasyondan geliyorsa sim\u00fclasyon olarak etiketlenir: bir deneyi \u00e7ok kez \u00e7al\u0131\u015ft\u0131rmak bir sonucu g\u00f6sterir, kan\u0131tlamaz.",

  prediction: {
    yours: "Siz dediniz",
    actual: "Ger\u00e7ekte",
    agreed: "Sezginiz modelle ayn\u0131 fikirde.",
    disagreed:
      "Sezginizle model ayn\u0131 fikirde de\u011fil. \u0130lgin\u00e7 olan k\u0131s\u0131m da bu.",
  },

  // Her sonucun alt\u0131ndaki iki ad\u0131m: \u00f6nce nedeni, sonra hesab\u0131.
  explain: {
    why: "Bu neden b\u00f6yle oluyor?",
    maths: "Say\u0131lar\u0131 g\u00f6ster",
  },

  monty: {
    title: "\u00dc\u00e7 kap\u0131",
    question: "Sunucuyu yenebilir misin?",
    setup: [
      "\u00dc\u00e7 kap\u0131. Birinin arkas\u0131nda bir araba, di\u011fer ikisinin arkas\u0131nda birer ke\u00e7i.",
      "Bir kap\u0131 se\u00e7ersin. Kap\u0131 kapal\u0131 kal\u0131r.",
      "Sunucu araban\u0131n yerini bilir ve di\u011fer ikisinden birini a\u00e7ar: her zaman arkas\u0131nda ke\u00e7i olan\u0131.",
      "Sonra se\u00e7ersin: kendi kap\u0131nda kal ya da sunucunun dokunmad\u0131\u011f\u0131 kap\u0131y\u0131 al.",
    ],
    coachLabel: "Herkesin sordu\u011fu sorular",
    coach: {
      notHalf: {
        q: "\u0130ki kap\u0131 kald\u0131. Neden 50/50 de\u011fil?",
        a: "\u00c7\u00fcnk\u00fc iki kap\u0131 buraya ayn\u0131 yoldan gelmedi. Seninkini hi\u00e7bir \u015fey bilmezken se\u00e7tin. Di\u011feri ise araban\u0131n yerini tam olarak bilen ve onu asla a\u00e7mayacak olan birinin se\u00e7iminden sa\u011f \u00e7\u0131kt\u0131.",
      },
      whySwitch: {
        q: "De\u011fi\u015ftirmek neden daha iyi?",
        a: (stay: string, swap: string) =>
          `\u0130lk se\u00e7imin zaman\u0131n ${stay} kadar\u0131nda arabad\u0131r ve kalmak yaln\u0131zca o zaman kazan\u0131r. Kalan ${swap} kadar\u0131nda araba se\u00e7medi\u011fin iki kap\u0131dan birinin arkas\u0131ndad\u0131r: sunucu da az \u00f6nce bu ikisinden hangisinde olmad\u0131\u011f\u0131n\u0131 g\u00f6sterdi.`,
      },
      hostKnows: {
        q: "Sunucunun biliyor olmas\u0131 \u00f6nemli mi?",
        a: "Her \u015fey o. Rastgele kap\u0131 a\u00e7an (bazen kazara arabay\u0131 g\u00f6steren) bir sunucu, kalmakla de\u011fi\u015ftirmeyi e\u015fit k\u0131lard\u0131. A\u00e7\u0131lan kap\u0131y\u0131 bilgilendirici yapan \u015fey, sunucunun bilmesi.",
      },
    },
    caption:
      "Sunucu iki kurala ba\u011fl\u0131d\u0131r: sizin kap\u0131n\u0131z\u0131 asla a\u00e7maz, arabay\u0131 asla a\u00e7maz. A\u00e7may\u0131 bilgilendirici k\u0131lan da bu kurallard\u0131r: rastgele kap\u0131 a\u00e7an bir sunucu iki se\u00e7ene\u011fi e\u015fit b\u0131rak\u0131rd\u0131.",
    predictQuestion: "Bir el oynad\u0131n. \u00c7ok say\u0131da elde hangisi daha iyi gider?",
    predict: { stay: "Kal", switch: "De\u011fi\u015ftir", same: "Fark etmez" },
    predictAnswer: (value: string) =>
      `De\u011fi\u015ftirmek zaman\u0131n ${value} kadar\u0131nda kazan\u0131r`,
    strategy: { stay: "Kal", switch: "De\u011fi\u015ftir" },
    doorsIdle:
      "\u00dc\u00e7 kapal\u0131 kap\u0131. Birinin arkas\u0131nda araba, ikisinde ke\u00e7i var.",
    doorsLabel: (picked: number, opened: number) =>
      `\u00dc\u00e7 kap\u0131. ${picked}. kap\u0131y\u0131 se\u00e7tiniz. Sunucu ke\u00e7iyi g\u00f6stermek i\u00e7in ${opened}. kap\u0131y\u0131 a\u00e7t\u0131.`,
    doorLabel: (n: number, state: string) => `${n}. kap\u0131, ${state}`,
    doorState: {
      closed: "kapal\u0131",
      picked: "sizin se\u00e7iminiz",
      opened: "sunucu a\u00e7t\u0131, ke\u00e7i",
      revealed: "araba",
    },
    won: "arabay\u0131 kazand\u0131n\u0131z",
    lost: "arabay\u0131 kazanamad\u0131n\u0131z",
    promptPick: "Bir kap\u0131 se\u00e7in.",
    promptDecide: (opened: number, other: number) =>
      `Sunucu ${opened}. kap\u0131y\u0131 a\u00e7t\u0131 ve arkas\u0131ndan ke\u00e7i \u00e7\u0131kt\u0131. Kap\u0131n\u0131zda kal\u0131n m\u0131, ${other}. kap\u0131ya m\u0131 ge\u00e7in?`,
    resultLine: (strategy: string, result: string) => `${strategy} dediniz, ${result}.`,
    again: "Yeniden oyna",
    announceOpened: (n: number) =>
      `Sunucu ${n}. kap\u0131y\u0131 a\u00e7t\u0131. Arkas\u0131ndan ke\u00e7i \u00e7\u0131kt\u0131.`,
    announceResult: (result: string) => `Tur bitti: ${result}.`,
    runBatch: (n: number) => `${n.toLocaleString("tr-TR")} tur \u00e7al\u0131\u015ft\u0131r`,
    batchTitle: "Sim\u00fcle edilen turlar",
    batchIdle: (n: number) =>
      `Elle birka\u00e7 tur oynamak bunu \u00e7\u00f6zmez. ${n.toLocaleString("tr-TR")} tur \u00e7al\u0131\u015ft\u0131r\u0131n.`,
    batchCaption: (n: number) =>
      `${n} sim\u00fcle edilmi\u015f turda kalman\u0131n ve de\u011fi\u015ftirmenin kazanma oranlar\u0131, tam olas\u0131l\u0131klar\u0131n yan\u0131nda.`,
    strategyHeader: "Strateji",
    simulatedHeader: (n: number) => `Sim\u00fclasyon (${n.toLocaleString("tr-TR")})`,
    exactHeader: "Tam de\u011fer",
    wins: (wins: number, rounds: number) => `${wins}/${rounds}`,
    playedLabel: "Oynad\u0131\u011f\u0131n\u0131z tur",
    yourStayLabel: "Kalmak kazand\u0131r\u0131rd\u0131",
    yourSwitchLabel: "De\u011fi\u015ftirmek kazand\u0131r\u0131rd\u0131",
    handHint: "sizin turlar\u0131n\u0131zda",

    hostPick: "Bir kap\u0131 se\u00e7. Hangisi olursa.",
    hostReveal: (opened: number) =>
      `\u00dc\u00e7\u00fcn\u00fcn de arkas\u0131n\u0131 biliyorum. Bak, ${opened}. kap\u0131da ke\u00e7i var.`,
    hostDecide: (other: number) =>
      `\u015eimdi: se\u00e7ti\u011fin kap\u0131da kal ya da ${other}. kap\u0131y\u0131 al. Karar senin.`,
    hostWon: "Arabay\u0131 kazand\u0131n.",
    hostLost: "Ke\u00e7i. Yeniden oynayal\u0131m m\u0131?",
    explainWhat:
      "De\u011fi\u015ftirmek, kalmaktan yakla\u015f\u0131k iki kat daha s\u0131k kazan\u0131r.",
    explainWhy:
      "\u0130lk se\u00e7imin \u00fc\u00e7 kap\u0131dan biriydi, yani \u00fc\u00e7 seferde bir arabayd\u0131. Geriye kalan iki kap\u0131ya birlikte \u00fc\u00e7 seferde iki d\u00fc\u015f\u00fcyor, ve sunucu az \u00f6nce o ikisinden zaten araba olmayan\u0131 a\u00e7t\u0131.",
    explainMaths: (stay: string, swap: string) =>
      `Kalmak yaln\u0131zca ilk se\u00e7imin ba\u015ftan araba oldu\u011funda kazan\u0131r: ${stay}. De\u011fi\u015ftirmek di\u011fer b\u00fct\u00fcn durumlarda kazan\u0131r: ${swap}.`,
    batchInvite:
      "\u0130ki kap\u0131 kald\u0131 ve bu bir yaz\u0131 tura de\u011fil. 1.000 oyunda g\u00f6relim mi?",
  },

  birthday: {
    kicker: "Sand\u0131\u011f\u0131n\u0131zdan k\u00fc\u00e7\u00fck bir oda",
    title:
      "\u0130ki ki\u015finin do\u011fum g\u00fcn\u00fc tutmas\u0131 i\u00e7in ka\u00e7 ki\u015fi gerekir?",
    setup: [
      "\u0130nsanlar odaya teker teker giriyor.",
      "Herkesin do\u011fum g\u00fcn\u00fc 365 g\u00fcnden biri ve her g\u00fcn e\u015fit olas\u0131l\u0131kta.",
      "Soru, birinin seninle ayn\u0131 do\u011fum g\u00fcn\u00fcne sahip olup olmad\u0131\u011f\u0131 de\u011fil. Odadaki herhangi iki ki\u015finin tutup tutmad\u0131\u011f\u0131.",
    ],
    addPerson: "Bir ki\u015fi ekle",
    addPersonHint: "\u00c7ift say\u0131s\u0131na ne oldu\u011funa bak.",
    roomFull: "Oda doldu.",
    coachLabel: "Herkesin sordu\u011fu sorular",
    coach: {
      soonWhy: {
        q: (n: number) => `${n} ki\u015fi nas\u0131l yaz\u0131 tura oluyor?`,
        a: (n: number, pairs: string) =>
          `Ki\u015fileri de\u011fil \u00e7iftleri say. ${n} ki\u015fi ${pairs} farkl\u0131 \u00e7ift yapar ve her \u00e7ift kendi ba\u015f\u0131na bir tutma \u015fans\u0131d\u0131r. Bir ki\u015fi daha ekledi\u011finde odadaki herkesle yeni birer \u00e7ift getirir; yani \u015fanslar kalabal\u0131ktan \u00e7ok daha h\u0131zl\u0131 birikir.`,
      },
      notMine: {
        q: "Bu benim do\u011fum g\u00fcn\u00fcmle ilgili de\u011fil mi?",
        a: "Sezginin yapt\u0131\u011f\u0131 takas bu ve o \u00e7ok daha zor bir soru. Birinin tam olarak seninle tutmas\u0131 i\u00e7in yakla\u015f\u0131k 253 ki\u015fi gerekir. Herhangi iki ki\u015finin birbiriyle tutmas\u0131 i\u00e7in 23.",
      },
      realBirthdays: {
        q: "Do\u011fum g\u00fcnleri ger\u00e7ekten e\u015fit mi da\u011f\u0131l\u0131r?",
        a: "Hay\u0131r: ger\u00e7ek do\u011fum g\u00fcnleri mevsime g\u00f6re k\u00fcmelenir ve k\u00fcmelenme tutmay\u0131 daha olas\u0131 k\u0131lar, daha az de\u011fil. Yani buradaki e\u015fit da\u011f\u0131l\u0131m modeli temkinli cevab\u0131 verir; ger\u00e7ekte %50 biraz daha erken ge\u00e7ilir.",
      },
    },
    caption:
      "Model: e\u015fit olas\u0131l\u0131kl\u0131 365 do\u011fum g\u00fcn\u00fc, art\u0131k y\u0131l yok, herkes ba\u011f\u0131ms\u0131z. Ger\u00e7ek do\u011fum g\u00fcnleri mevsime g\u00f6re k\u00fcmelenir ve bu, ger\u00e7ek olas\u0131l\u0131\u011f\u0131 biraz y\u00fckseltir, yani buradaki, temkinli olan\u0131.",
    predictQuestion: "Sizce olas\u0131l\u0131k ilk ne zaman %50'yi ge\u00e7er?",
    predict: { count: (n: number) => `${n} kiÅi` },
    predictAnswer: (n: number, value: string) => `${n} ki\u015fi, ${value} ile`,
    peopleLabel: "Odadaki ki\u015fi",
    peopleValue: (n: number, value: string) =>
      `${n} ki\u015fi, ayn\u0131 do\u011fum g\u00fcn\u00fc olas\u0131l\u0131\u011f\u0131 ${value}`,
    peopleHint: "Yirmili say\u0131lardan yava\u015f\u00e7a ge\u00e7irin.",
    roomLabel: (n: number) =>
      `${n} ki\u015filik bir oda. Hi\u00e7 kimsenin do\u011fum g\u00fcn\u00fc tutmuyor.`,
    roomLabelMatch: (n: number, a: number, b: number, day: string) =>
      `${n} ki\u015filik bir oda. ${a}. ve ${b}. ki\u015finin do\u011fum g\u00fcn\u00fc ayn\u0131: ${day}.`,
    foundPair: (a: number, b: number, day: string) =>
      `${a}. ve ${b}. ki\u015finin do\u011fum g\u00fcn\u00fc ayn\u0131: ${day}.`,
    noPair: (n: number) =>
      `${n} ki\u015filik bu odada herkesin do\u011fum g\u00fcn\u00fc farkl\u0131.`,
    tableCaption: (n: number) =>
      `${n} ki\u015fi aras\u0131nda ayn\u0131 do\u011fum g\u00fcn\u00fc olas\u0131l\u0131\u011f\u0131: tam de\u011fer ve sim\u00fclasyon.`,
    exactRow: "Tam olas\u0131l\u0131k",
    simulatedRow: (rooms: number) => `Sim\u00fclasyon (${rooms.toLocaleString("tr-TR")} oda)`,
    stale: (n: number) =>
      `yeniden \u00e7al\u0131\u015ft\u0131r\u0131n, son \u00e7al\u0131\u015fma ${n} ki\u015fiydi`,
    reading: (n: number, pairs: number) =>
      `${n} ki\u015fi ${pairs.toLocaleString("tr-TR")} farkl\u0131 \u00e7ift olu\u015fturur ve her biri tutma \u015fans\u0131d\u0131r.`,
    peopleFigure: "Ki\u015fi",
    pairsFigure: "\u00c7ift",
    pairsHint: "tutma \u015fans\u0131",
    chanceFigure: "Ayn\u0131 do\u011fum g\u00fcn\u00fc",
    exactHint: "tam de\u011fer",
    thresholdFigure: "%50'yi ge\u00e7ti\u011fi yer",
    thresholdHint: "ki\u015fi",

    personName: (n: number) => `${n}. ki\u015fi`,
    personLabel: (n: number, day: string) => `${n}. ki\u015fi, do\u011fum g\u00fcn\u00fc ${day}`,
    personMatchLabel: (n: number, day: string, other: number) =>
      `${n}. ki\u015fi, do\u011fum g\u00fcn\u00fc ${day}, ${other}. ki\u015fiyle ayn\u0131 g\u00fcn`,
    justArrived: "yeni geldi",
    sameDay: "ayn\u0131 g\u00fcn",
    roomEmpty: "Odada hen\u00fcz kimse yok.",
    explainWhat:
      "\u00c7o\u011fu ki\u015finin tahmin etti\u011finden \u00e7ok daha az insan yetiyor.",
    explainWhy:
      "Soru, birinin seninle tutup tutmad\u0131\u011f\u0131 de\u011fil. Herhangi iki ki\u015finin birbiriyle tutup tutmad\u0131\u011f\u0131, ve odaya giren her yeni ki\u015fi, i\u00e7erideki herkesle yeni bir \u00e7ift kuruyor. \u00c7iftler, insanlardan \u00e7ok daha h\u0131zl\u0131 birikiyor.",
    explainMaths: (n: number, pairs: string, value: string) =>
      `${n} ki\u015fiyle ${pairs} \u00e7ift olur. Hi\u00e7bir \u00e7iftin tutmama olas\u0131l\u0131\u011f\u0131 365/365 \u00d7 364/365 \u00d7 \u2026 \u00e7arp\u0131m\u0131d\u0131r; bunun bire t\u00fcmleyeni ${value}.`,
    simulateLabel: "Bunun yerine \u00e7al\u0131\u015ft\u0131r\u0131n",
    runRooms: (n: number) => `${n.toLocaleString("tr-TR")} oda doldur`,
    simulateNote: (days: number) =>
      `Her oda, ki\u015fi ba\u015f\u0131na e\u015fit olas\u0131l\u0131kl\u0131 ${days} g\u00fcnden bir do\u011fum g\u00fcn\u00fc \u00e7eker, sonra tekrar arar.`,
    announce: (n: number, value: string) =>
      `${n} ki\u015fi. Ayn\u0131 do\u011fum g\u00fcn\u00fc olas\u0131l\u0131\u011f\u0131: ${value}.`,
    months: [
      "Oca",
      "\u015eub",
      "Mar",
      "Nis",
      "May",
      "Haz",
      "Tem",
      "A\u011fu",
      "Eyl",
      "Eki",
      "Kas",
      "Ara",
    ],
  },

  conditional: {
    kicker: "\u0130\u015fi yapan \u015fey ipucu",
    title: "Bir ailenin iki \u00e7ocu\u011fu var. \u0130kisi de erkek mi?",
    setup: [
      "Bir ailenin iki \u00e7ocu\u011fu var: biri b\u00fcy\u00fck, biri k\u00fc\u00e7\u00fck.",
      "Her \u00e7ocuk erkek ya da k\u0131z ve ikisi de e\u015fit olas\u0131l\u0131kta, yani e\u015fit olas\u0131l\u0131kl\u0131 d\u00f6rt aile var.",
      "Biri sana bu aile hakk\u0131nda do\u011fru tek bir c\u00fcmle s\u00f6yl\u00fcyor.",
      "Senin sorun: ikisinin de erkek olma olas\u0131l\u0131\u011f\u0131 nedir?",
    ],
    coachLabel: "Herkesin sordu\u011fu sorular",
    coach: {
      notHalf: {
        q: "\u00c7ocuklardan biri erkek, o zaman di\u011feri 50/50 de\u011fil mi?",
        a: (value: string) =>
          `Bu, ba\u015fka bir c\u00fcmlenin cevab\u0131 olurdu: \u201cb\u00fcy\u00fck olan erkek\u201d. Sana s\u00f6ylenen, ikisinden en az birinin erkek oldu\u011fu: hangisi oldu\u011fu de\u011fil. D\u00f6rt aileden \u00fc\u00e7\u00fc bu c\u00fcmleye uyar ve bunlardan yaln\u0131zca biri iki erkektir; yani olas\u0131l\u0131k ${value}.`,
      },
      twoWays: {
        q: "Erkek-sonra-k\u0131z ile k\u0131z-sonra-erkek neden ayr\u0131 say\u0131l\u0131yor?",
        a: "\u00c7\u00fcnk\u00fc bunlar farkl\u0131 aileler ve her biri iki erkek kadar olas\u0131. Bir erkek bir k\u0131zl\u0131 aileye d\u00fc\u015fmek, iki erkekli bir aileye d\u00fc\u015fmekten iki kat kolayd\u0131r: birine iki yol \u00e7\u0131kar, di\u011ferine bir.",
      },
      wording: {
        q: "C\u00fcmlenin kurulu\u015fu cevab\u0131 nas\u0131l de\u011fi\u015ftiriyor?",
        a: "C\u00fcmle, kan\u0131t\u0131n kendisi. \u201cEn az biri erkek\u201d bir aileyi eler; \u201cb\u00fcy\u00fck olan erkek\u201d iki aileyi eler. Geriye daha az aile kal\u0131r ve iki erkek, kalan\u0131n i\u00e7inde daha b\u00fcy\u00fck bir pay tutar. Hi\u00e7bir ailede bir \u015fey de\u011fi\u015fmedi, yaln\u0131zca sana s\u00f6ylenen de\u011fi\u015fti.",
      },
    },
    caption:
      "Burada her \u00e7ocu\u011fun ba\u011f\u0131ms\u0131z olarak 1/2 olas\u0131l\u0131kla erkek ya da k\u0131z oldu\u011fu ve ipucunun tam olarak yaz\u0131ld\u0131\u011f\u0131 gibi ge\u00e7erli oldu\u011fu varsay\u0131l\u0131r. \u00dc\u00e7\u00fcnc\u00fc bir okuma (\u00e7ocuklardan biriyle rastgele kar\u015f\u0131la\u015f\u0131p erkek oldu\u011funu g\u00f6rmek) yine 1/2 verir ve burada modellenmemi\u015ftir.",
    predictQuestion:
      "\u0130ki \u00e7ocuk, en az biri erkek. \u0130kisinin de erkek olma olas\u0131l\u0131\u011f\u0131?",
    predict: { half: "1/2", third: "1/3", quarter: "1/4" },
    predictAnswer: (value: string) => `1/3, yani ${value}`,
    clueLabel: "\u0130pucu",
    clueShort: { atLeastOneBoy: "En az biri erkek", firstIsBoy: "\u0130lki erkek" },
    clue: {
      atLeastOneBoy: "En az biri erkek",
      firstIsBoy: "\u0130lk \u00e7ocuk erkek",
    },
    clueHint:
      "Ayn\u0131 aile, farkl\u0131 c\u00fcmle. Hangi kutular\u0131n kald\u0131\u011f\u0131na bak\u0131n.",
    outcome: { GG: "KK", GB: "KE", BG: "EK", BB: "EE" },
    possible: "h\u00e2l\u00e2 m\u00fcmk\u00fcn",
    counts: "ikisi de erkek",
    ruledOut: "elendi",
    matrixLabel: (clue: string, kept: string, value: string) =>
      `E\u015fit olas\u0131l\u0131kl\u0131 d\u00f6rt sonu\u00e7. “${clue}” bilgisiyle h\u00e2l\u00e2 m\u00fcmk\u00fcn olanlar: ${kept}. Yani ikisinin de erkek olma olas\u0131l\u0131\u011f\u0131 ${value}.`,
    fraction: (counts: string, value: string) =>
      `kalan sonu\u00e7lar\u0131n ${counts} kadar\u0131 = ${value}`,
    compareCaption:
      "\u0130ki ipucu, her birinin b\u0131rakt\u0131\u011f\u0131 sonu\u00e7lar ve \u00e7\u0131kan olas\u0131l\u0131k.",
    clueHeader: "\u0130pucu",
    leftHeader: "M\u00fcmk\u00fcn olanlar",
    answerHeader: "\u0130kisi de erkek",
    explain: {
      atLeastOneBoy:
        "KK elenince \u00fc\u00e7 sonu\u00e7 kal\u0131r ve bunlardan yaln\u0131zca biri EE'dir. \u0130pucu erke\u011fin hangi \u00e7ocuk oldu\u011funu s\u00f6ylemedi\u011fi i\u00e7in KE ve EK ikisi de ayakta kal\u0131r, ve birlikte EE'yi ikiye bir ge\u00e7erler.",
      firstIsBoy:
        "\u0130lk \u00e7ocu\u011fu adland\u0131rmak KK ile KE'yi birlikte eler ve geriye iki sonu\u00e7 kal\u0131r. Art\u0131k EE, \u00fc\u00e7te bir de\u011fil ikide birdir. Ailede hi\u00e7bir \u015fey de\u011fi\u015fmedi; c\u00fcmle de\u011fi\u015fti.",
    },
    keptFigure: "Kalan sonu\u00e7",
    keptHint: "d\u00f6rtte",
    bothFigure: "\u0130kisi de erkek",
    bothHint: "kalanlar i\u00e7inde",
    answerFigure: "Olas\u0131l\u0131k",

    older: "B\u00fcy\u00fck",
    younger: "K\u00fc\u00e7\u00fck",
    boy: "Erkek",
    girl: "K\u0131z",
    familyLabel: (older: string, younger: string) =>
      `B\u00fcy\u00fck \u00e7ocu\u011fu ${older}, k\u00fc\u00e7\u00fck \u00e7ocu\u011fu ${younger} olan aile`,
    familiesTitle: "E\u015fit olas\u0131l\u0131kl\u0131 d\u00f6rt aile",
    explainWhat:
      "Bir \u00e7ocuk hakk\u0131nda bilgi almak, di\u011ferinin ne olma ihtimalini de\u011fi\u015ftirir.",
    explainWhy:
      "\u201cEn az biri erkek\u201d hangisi oldu\u011funu s\u00f6ylemez. Yaln\u0131zca iki k\u0131zl\u0131 aileyi eler ve kalan \u00fc\u00e7 aileden ikisinde bir k\u0131z vard\u0131r. Bunun yerine \u201cb\u00fcy\u00fck olan erkek\u201d dersen bir de\u011fil iki aile elenir: ayn\u0131 aile, farkl\u0131 c\u00fcmle, farkl\u0131 cevap.",
    explainMaths: (kept: number, value: string) =>
      `D\u00f6rt aileden ${kept} tanesi ipucuna uyuyor ve bu ${kept} aileden biri iki erkek: ${value}.`,
    announce: (clue: string, kept: number, value: string) =>
      `\u0130pucu: ${clue}. ${kept} sonu\u00e7 kald\u0131. \u0130kisinin de erkek olma olas\u0131l\u0131\u011f\u0131: ${value}.`,
  },

  simpson: {
    kicker: "\u0130ki tedavi, tek bir karar",
    title: "Hangi tedaviyi se\u00e7erdin?",
    setup: [
      "B\u00f6brek ta\u015f\u0131 i\u00e7in iki tedavi, A ve B: 1986 tarihli ger\u00e7ek bir \u00e7al\u0131\u015fmadan.",
      "Hastalar ya k\u00fc\u00e7\u00fck ta\u015fla ya da b\u00fcy\u00fck ta\u015fla geliyor; b\u00fcy\u00fck olanlar zor vakalar.",
      "Tablo her tedavinin her grupta ve iki grubun toplam\u0131nda ne yapt\u0131\u011f\u0131n\u0131 g\u00f6steriyor.",
      "Tabloyu oku ve isteyece\u011fin tedaviyi se\u00e7.",
    ],
    named:
      "Bakt\u0131\u011f\u0131n \u015feyin bir ad\u0131 var: Simpson paradoksu: gruplar topland\u0131\u011f\u0131nda tersine d\u00f6nen bir kar\u015f\u0131la\u015ft\u0131rma.",
    coachLabel: "Herkesin sordu\u011fu sorular",
    coach: {
      howBoth: {
        q: "A her iki grupta kazan\u0131p toplamda nas\u0131l kaybedebilir?",
        a: "\u00c7\u00fcnk\u00fc iki tedavi ayn\u0131 t\u00fcr hastaya verilmedi. A \u00e7o\u011funlukla zor vakalarda, B \u00e7o\u011funlukla kolay vakalarda kullan\u0131ld\u0131. Gruplar\u0131 toplamak \u201changi tedavi\u201d ile \u201changi hastalar\u201d sorusunu birbirine kar\u0131\u015ft\u0131r\u0131r ve hasta kar\u0131\u015f\u0131m\u0131 daha g\u00fc\u00e7l\u00fc etkidir.",
      },
      whichWrong: {
        q: "Say\u0131lardan biri yanl\u0131\u015f m\u0131?",
        a: "\u0130kisi de de\u011fil. \u0130kisi de ayn\u0131 say\u0131mlar \u00fczerinde aritmetik ve her y\u00fczdeyi yan\u0131ndaki iki say\u0131yla kar\u015f\u0131la\u015ft\u0131r\u0131p do\u011frulayabilirsin. Bunlar iki farkl\u0131 sorunun do\u011fru cevaplar\u0131.",
      },
      whichBelieve: {
        q: "Peki hangi say\u0131ya inanmal\u0131y\u0131m?",
        a: "Tek bir hasta i\u00e7in tedavi se\u00e7erken grup sat\u0131rlar\u0131na, \u00e7\u00fcnk\u00fc o hastan\u0131n ya k\u00fc\u00e7\u00fck ta\u015f\u0131 vard\u0131r ya b\u00fcy\u00fck, ikisinin ortalamas\u0131 asla olmaz. Toplam sat\u0131r\u0131 ba\u015fka bir soruyu yan\u0131tlar: bu belirli hasta kar\u0131\u015f\u0131m\u0131na ne oldu.",
      },
    },
    caption:
      "Grup ba\u015f\u0131na ba\u015far\u0131 oranlar\u0131 Charig ve ark. (1986) \u00e7al\u0131\u015fmas\u0131ndan, iki b\u00f6brek ta\u015f\u0131 tedavisinin kar\u015f\u0131la\u015ft\u0131r\u0131lmas\u0131ndan geliyor. Kayd\u0131r\u0131c\u0131lar hastalar\u0131 gruplar aras\u0131nda ta\u015f\u0131r; oranlar yerinde kal\u0131r. Her y\u00fczde, yan\u0131nda yazan say\u0131lar\u0131n b\u00f6l\u00fcm\u00fcd\u00fcr.",
    predictQuestion: "Bir tedavi her grupta kazan\u0131p toplamda kaybedebilir mi?",
    predict: { impossible: "Hay\u0131r, bu imk\u00e2ns\u0131z", possible: "Evet, olabilir" },
    predictAnswer: "Evet; a\u015fa\u011f\u0131daki tablo ger\u00e7ek bir \u00f6rnek",
    tableCaption:
      "Grup ve tedavi baz\u0131nda ba\u015far\u0131 oranlar\u0131 ve say\u0131lar, toplamla birlikte.",
    groupHeader: "Grup",
    group: { small: "K\u00fc\u00e7\u00fck ta\u015flar", large: "B\u00fcy\u00fck ta\u015flar" },
    treatment: { a: "Tedavi A", b: "Tedavi B" },
    treatmentShort: { a: "A", b: "B" },
    overall: "\u0130ki grup birlikte",
    ahead: "\u00f6nde",
    barsLabel: (
      smallA: string,
      smallB: string,
      largeA: string,
      largeB: string,
      overallA: string,
      overallB: string,
    ) =>
      `K\u00fc\u00e7\u00fck ta\u015flar: A ${smallA}, B ${smallB}. B\u00fcy\u00fck ta\u015flar: A ${largeA}, B ${largeB}. \u0130ki grup birlikte: A ${overallA}, B ${overallB}.`,
    reversedBody:
      "A her iki grupta \u00f6nde, toplamda geride. A \u00e7o\u011funlukla zor vakalara, B \u00e7o\u011funlukla kolay vakalara verilmi\u015f; yani toplam, iki tedaviyi de\u011fil iki farkl\u0131 hasta kar\u0131\u015f\u0131m\u0131n\u0131 kar\u015f\u0131la\u015ft\u0131r\u0131yor.",
    notReversedBody:
      "Gruplar b\u00f6yle da\u011f\u0131t\u0131ld\u0131\u011f\u0131nda toplam, gruplarla ayn\u0131 \u015feyi s\u00f6yl\u00fcyor. Ters d\u00f6nme i\u00e7in iki tedavinin farkl\u0131 hasta kar\u0131\u015f\u0131mlar\u0131na verilmesi gerekir.",
    shareLabel: (treatment: string) => `${treatment}: k\u00fc\u00e7\u00fck ta\u015fl\u0131 hasta`,
    shareValue: (treatment: string, small: number, large: number) =>
      `${treatment}: ${small} k\u00fc\u00e7\u00fck ta\u015fl\u0131, ${large} b\u00fcy\u00fck ta\u015fl\u0131 hasta`,
    shareHint:
      "Her tedavi 350 hastas\u0131n\u0131 ve grup ba\u015f\u0131na ba\u015far\u0131 oranlar\u0131n\u0131 korur. Yaln\u0131zca kar\u0131\u015f\u0131m de\u011fi\u015fir.",
    restore: "Yay\u0131mlanm\u0131\u015f tabloya d\u00f6n",
    overallA: "A toplam",
    overallB: "B toplam",
    reversedFigure: "Ters d\u00f6nd\u00fc m\u00fc?",
    reversedYes: "Evet",
    reversedNo: "Hay\u0131r",

    treatmentName: { a: "A\u00e7\u0131k ameliyat", b: "Kapal\u0131 y\u00f6ntem" },
    treatmentNote: {
      a: "b\u00fcy\u00fck olan ameliyat",
      b: "k\u00fc\u00e7\u00fck bir kesi, a\u00e7\u0131k ameliyat yok",
    },
    stepSmallTitle: "Kolay vakalarla ba\u015flayal\u0131m",
    stepLargeButton: "\u015eimdi b\u00fcy\u00fck ta\u015flar\u0131 g\u00f6ster",
    stepOverallButton: "\u0130ki grubu topla",
    seenBoth: "Her iki grupta da kazanan ayn\u0131.",
    chooseQuestion:
      "\u0130ki grup da ayn\u0131 \u015feyi s\u00f6yl\u00fcyor. Sen hangi tedaviyi se\u00e7erdin?",
    choose: { a: "A\u00e7\u0131k ameliyat", b: "Kapal\u0131 y\u00f6ntem" },
    chooseAnswer: (leader: string) =>
      `\u0130ki grup da ${leader} diyor. \u015eimdi iki grubu topla.`,
    explainWhat: "Her grupta kazanan taraf, gruplar toplan\u0131nca kaybedebilir.",
    explainWhy:
      "\u0130ki tedavi ayn\u0131 t\u00fcr hastaya verilmedi. A\u00e7\u0131k ameliyat b\u00fcy\u00fck ta\u015flar\u0131n \u00e7o\u011funu (zor vakalar\u0131) \u00fcstlendi, kapal\u0131 y\u00f6ntem ise k\u00fc\u00e7\u00fck ta\u015flar\u0131n \u00e7o\u011funu. Gruplar\u0131 toplamak \u201changi tedavi\u201d ile \u201changi hastalar\u201d sorusunu birbirine kar\u0131\u015ft\u0131r\u0131r ve hasta kar\u0131\u015f\u0131m\u0131 daha g\u00fc\u00e7l\u00fc etkidir.",
    explainMaths:
      "Her toplam oran, o tedavinin iki grup oran\u0131n\u0131n a\u011f\u0131rl\u0131kl\u0131 ortalamas\u0131d\u0131r; a\u011f\u0131rl\u0131klar da her gruptaki hasta say\u0131s\u0131d\u0131r. A\u011f\u0131rl\u0131klar de\u011fi\u015fince ortalama da de\u011fi\u015fir: grup oranlar\u0131 sabit kalsa bile.",
    illustrative:
      "Say\u0131lar 1986 tarihli yay\u0131mlanm\u0131\u015f bir kar\u015f\u0131la\u015ft\u0131rmadan; burada veride bir etkiyi g\u00f6stermek i\u00e7in kullan\u0131l\u0131yor. T\u0131bbi tavsiye de\u011fildir.",
    announce: (a: string, b: string, reversed: string) =>
      `Toplam: A ${a}, B ${b}. Ters d\u00f6nd\u00fc: ${reversed}.`,
  },

  bridge:
    "Tek bir d\u00fczene\u011fin iki modeli, ayn\u0131 g\u00f6zler konusunda anla\u015fam\u0131yor. S\u0131radaki deney \u00f6nce modeli sabitler; b\u00f6ylece de\u011fi\u015fen tek \u015fey, denemenin ka\u00e7 kez yinelendi\u011fi olur.",

  pascal: {
    kicker: "Pascal'\u0131n bilyeleri",
    title: "Ayn\u0131 d\u00fczene\u011fin iki modeli.",
    setup: [
      "Bilye, \u00e7ivilerden olu\u015fan \u00fc\u00e7genin \u00fcst\u00fcnden b\u0131rak\u0131l\u0131r ve yer\u00e7ekimiyle d\u00fc\u015fer.",
      "Y\u00f6n de\u011fi\u015fimlerinin her biri bir \u00e7arp\u0131\u015fmadan do\u011far, bir yaz\u0131 turadan de\u011fil.",
      "Sonunda durdu\u011fu g\u00f6z hangisiyse orada say\u0131l\u0131r.",
    ],
    caption:
      "\u0130deal matematiksel model her s\u0131ray\u0131 ba\u011f\u0131ms\u0131z bir sol ya da sa\u011f ad\u0131m\u0131 olarak ele al\u0131r; bu da binom da\u011f\u0131l\u0131m\u0131n\u0131 verir. Ekrandaki fiziksel d\u00fczenekte ise ad\u0131m diye bir \u015fey yoktur: bilyenin nereye gidece\u011fine yer\u00e7ekimi, temas geometrisi, esneklik ve s\u00fcrt\u00fcnme karar verir. \u0130kisi farkl\u0131 mekanizmalard\u0131r ve tablo onlar\u0131 ayr\u0131 s\u00fctunlarda tutar.",
    predictQuestion: "Birka\u00e7 bilye b\u0131rak\u0131n. Nerede durur bunlar?",
    predict: {
      edges: "\u0130ki u\u00e7ta",
      centre: "Ortada",
      even: "G\u00f6zlere e\u015fit da\u011f\u0131larak",
    },
    predictAnswer: (bin: number, share: string) =>
      `ideal modele g\u00f6re ${bin} numaral\u0131 g\u00f6z; model bu g\u00f6ze ${share} pay verir`,
    dropLabel: "Bilye b\u0131rak",
    dropBatch: (n: number) => (n === 1 ? "1 bilye" : `${n} bilye`),
    dropHint:
      "Buradaki her bilye fizik motorunda benzetilir. Hi\u00e7bir say\u0131 hesapla eklenmez.",
    falling: (n: number) => `${n} bilye h\u00e2l\u00e2 d\u00fc\u015f\u00fcyor`,
    boardLabel: (dropped: number, rows: number) =>
      `${rows} s\u0131ra \u00e7ividen olu\u015fan bir d\u00fczenek. ${dropped} bilye fiziksel olarak a\u015fa\u011f\u0131 d\u00fc\u015ft\u00fc ve alttaki g\u00f6zlerde durdu.`,
    boardEmptyLabel: (rows: number) =>
      `${rows} s\u0131ra \u00e7ividen olu\u015fan bir d\u00fczenek; alt\u0131ndaki g\u00f6zler bo\u015f.`,
    tableCaption: (rows: number, dropped: number) =>
      `${rows} s\u0131ral\u0131 d\u00fczene\u011fin her g\u00f6z\u00fc: ideal modelin sayd\u0131\u011f\u0131 yol say\u0131s\u0131, \u00f6ng\u00f6rd\u00fc\u011f\u00fc pay ve fiziksel olarak benzetilen ${dropped} bilyenin ula\u015ft\u0131\u011f\u0131 ger\u00e7ek pay.`,
    binColumn: "G\u00f6z",
    pathsColumn: "Yol",
    idealColumn: "\u0130deal model",
    physicalColumn: "Fiziksel d\u00fczenek",
    shapeColumn: "Bi\u00e7im",
    legend:
      "\u00dcstteki \u00e7ubuk ideal binom modelini, alttaki fiziksel sonu\u00e7lar\u0131 g\u00f6sterir. Ayr\u0131\u015ft\u0131klar\u0131 yerde d\u00fczenek, hesab\u0131n modellemedi\u011fi bir \u015feyi s\u00f6yl\u00fcyordur.",
    reading: (dropped: number, rows: number) =>
      `${dropped} bilye, her biri ${rows} s\u0131ra \u00e7ivinin aras\u0131ndan; hepsi tek tek benzetildi.`,
    readingEmpty:
      "G\u00f6zler bo\u015f. Bir bilye b\u0131rak\u0131n ve karar\u0131 yer\u00e7ekimiyle \u00e7ivilerin vermesini izleyin.",
    explainWhat:
      "\u0130ki model de bilyelerin \u00e7o\u011funu ortaya yak\u0131n yerle\u015ftirir; ka\u00e7 tanesini konusunda ise anla\u015famazlar.",
    explainWhy:
      "\u0130deal model bir sayma sorusu sorar: bu b\u00fcy\u00fckl\u00fckteki bir d\u00fczene\u011fin izin verdi\u011fi b\u00fct\u00fcn sol-sa\u011f dizileri i\u00e7inde ka\u00e7 tanesi hangi g\u00f6zde biter? Fiziksel d\u00fczenekte ise hi\u00e7bir \u015fey ad\u0131m atmaz. Bilye bir \u00e7iviye belirli bir h\u0131z ve a\u00e7\u0131yla gelir, temas\u0131n verdi\u011fiyle ayr\u0131l\u0131r ve bir sonrakine giderken yanal hareketinin bir k\u0131sm\u0131n\u0131 s\u00fcrt\u00fcnmeye kapt\u0131r\u0131r. Bu kay\u0131p onu ortaya do\u011fru \u00e7eker; dolay\u0131s\u0131yla bu d\u00fczenek, sayma arg\u00fcman\u0131n\u0131n \u00f6ng\u00f6rd\u00fc\u011f\u00fcnden daha dar toplan\u0131r. \u0130ki yan\u0131t da yanl\u0131\u015f de\u011fildir; farkl\u0131 sorular\u0131n yan\u0131tlar\u0131d\u0131r.",
    explainMaths: (rows: number, paths: string, total: string) =>
      `\u0130deal modelde ${rows} s\u0131ral\u0131 bir d\u00fczenek, her karar dizisine bir tane d\u00fc\u015fmek \u00fczere ${total} yola izin verir; belirli bir g\u00f6zde biten yollar\u0131n say\u0131s\u0131 da Pascal \u00fc\u00e7geninin o sat\u0131r\u0131ndaki de\u011ferdir. En kalabal\u0131k g\u00f6ze ${paths} yol ula\u015f\u0131r, yani pay\u0131 bu say\u0131n\u0131n ${total} de\u011ferine b\u00f6l\u00fcm\u00fcd\u00fcr. Bu de\u011ferler binom katsay\u0131lar\u0131d\u0131r, verdikleri paylar da binom da\u011f\u0131l\u0131m\u0131d\u0131r. Fiziksel s\u00fctun ise bunlar\u0131n hi\u00e7birinden hesaplanmaz: benzetilen bilyelerin nerede durdu\u011funun say\u0131m\u0131d\u0131r.`,
    ballsFigure: "Benzetilen bilye",
    ballsHint: "Her biri bir fiziksel deneme",
    rowsFigure: "S\u0131ra",
    pathsFigure: "\u0130deal modeldeki yol",
    pathsHint: "2'nin s\u0131ra say\u0131s\u0131 kuvveti",
    peakFigure: "En kalabal\u0131k g\u00f6z",
    peakHint: (ideal: number) => `\u0130deal modelin en kalabal\u0131\u011f\u0131 ${ideal}`,
    boardSettings: "D\u00fczenek",
    rowsLabel: "\u00c7ivi s\u0131ras\u0131",
    rowsValue: (rows: number, paths: string) => `${rows} s\u0131ra, ideal modelde ${paths} yol`,
    rowsHint:
      "D\u00fczene\u011fi yeniden kurmak g\u00f6zleri bo\u015falt\u0131r: farkl\u0131 bir d\u00fczenek, farkl\u0131 bir deneydir.",
    emptyBoard: "G\u00f6zleri bo\u015falt",
    announce: (dropped: number, bin: number) =>
      `${dropped} bilye benzetildi. En \u00e7ok bilye ${bin} numaral\u0131 g\u00f6zde.`,
    coachLabel: "S\u0131k sorulanlar",
    coach: {
      twoModels: {
        q: "Neden iki da\u011f\u0131l\u0131m var?",
        a: "\u00c7\u00fcnk\u00fc iki model var. Biri, her s\u0131ran\u0131n ba\u011f\u0131ms\u0131z ve adil bir ad\u0131m oldu\u011fu idealle\u015ftirilmi\u015f bir d\u00fczenekteki yollar\u0131 sayar. Di\u011feri ise i\u00e7inde yer\u00e7ekimi, temas ve s\u00fcrt\u00fcnme bulunan bir kat\u0131 cisim benzetimidir. Ayn\u0131 resmi anlat\u0131rlar ama ayn\u0131 \u015fey de\u011fildirler; bu y\u00fczden tek bir e\u011fride ortalanmak yerine ayr\u0131 s\u00fctunlarda g\u00f6sterilirler.",
      },
      whyDiffer: {
        q: "Hangisi do\u011fru?",
        a: "Her biri kendi konusunda do\u011frudur. Binom da\u011f\u0131l\u0131m\u0131, sayma modeli hakk\u0131nda tam olarak do\u011frudur. Fiziksel s\u00fctun da bu benzetilmi\u015f d\u00fczene\u011fin tam olarak yapt\u0131\u011f\u0131 \u015feydir. Model, bir mekanizman\u0131n idealle\u015ftirilmesidir; mekanizmada idealle\u015ftirmede bulunmayan \u015feyler varsa ikisi ayr\u0131\u015f\u0131r. \u0130\u015fe yarar k\u0131s\u0131m da tam olarak nerede ayr\u0131\u015ft\u0131klar\u0131n\u0131 fark etmektir.",
      },
      whyMiddle: {
        q: "\u0130ki modelde de orta neden doluyor?",
        a: (paths: string, total: string) =>
          `\u0130deal modelde bu bir sayma meselesidir: d\u00fczene\u011fin izin verdi\u011fi ${total} yoldan ${paths} tanesi en kalabal\u0131k g\u00f6zde, u\u00e7taki g\u00f6zlerin her birinde ise tam olarak bir tanesi biter. Fiziksel d\u00fczenekte ise bir bilyenin uca ula\u015fmas\u0131 i\u00e7in her s\u0131rada ayn\u0131 y\u00f6ne sapmas\u0131 gerekir; \u00fcstelik her temas yanal h\u0131z\u0131n\u0131n bir k\u0131sm\u0131n\u0131 al\u0131p g\u00f6t\u00fcrd\u00fc\u011f\u00fc i\u00e7in b\u00f6yle bir \u015fans dizisi daha da seyrekle\u015fir.`,
      },
    },
  },

  largeNumbers: {
    kicker: "B\u00fcy\u00fck Say\u0131lar Kanunu",
    title: "Karar\u0131 tekrarlay\u0131n; oran yerine oturur.",
    setup: [
      "Tek bir \u00e7ivi, tek bir adil karar: sol ya da sa\u011f.",
      "Karar, ba\u011f\u0131ms\u0131z bi\u00e7imde \u00e7ok kez tekrarlan\u0131r.",
      "Sa\u011fa gidenlerin oran\u0131 teorik olas\u0131l\u0131kla kar\u015f\u0131la\u015ft\u0131r\u0131l\u0131r.",
    ],
    caption:
      "Kanun, ba\u011f\u0131ms\u0131z denemeler biriktik\u00e7e g\u00f6zlenen oran\u0131n teorik olas\u0131l\u0131\u011fa yakla\u015fma e\u011filiminde oldu\u011funu s\u00f6yler. Aradaki fark\u0131n her ad\u0131mda k\u00fc\u00e7\u00fclece\u011fini s\u00f6ylemez; bu ko\u015fuda da k\u00fc\u00e7\u00fclmez: \u00e7izgi yerine oturmadan \u00f6nce uzakla\u015ft\u0131\u011f\u0131 yerleri izleyin.",
    predictQuestion: "Deneme say\u0131s\u0131 artt\u0131k\u00e7a g\u00f6zlenen oran ne yapar?",
    predict: {
      settles: "Teorik de\u011ferin yak\u0131n\u0131nda durulur",
      swings: "Ayn\u0131 genlikte sal\u0131nmay\u0131 s\u00fcrd\u00fcr\u00fcr",
      exact: "Tam olarak teorik de\u011fere e\u015fitlenir",
    },
    predictAnswer: "\u00fczerine tam oturmadan teorik de\u011ferin yak\u0131n\u0131nda durur",
    thousands: ".",
    scaleLabel: "Deneme say\u0131s\u0131",
    watchHint: "Her karar\u0131n geli\u015fini izleyecek kadar k\u00fc\u00e7\u00fck.",
    acceleratedHint:
      "Tek tek \u00e7izilemeyecek kadar \u00e7ok. Yine de her deneme say\u0131l\u0131yor.",
    chartLabel: (trials: string, observed: string, theoretical: string) =>
      `${trials} deneme boyunca g\u00f6zlenen oran, logaritmik \u00f6l\u00e7ekte. ${observed} de\u011ferinde bitiyor; d\u00fcz referans \u00e7izgisi olarak \u00e7izilen teorik olas\u0131l\u0131k ise ${theoretical}.`,
    axisStart: "1 deneme",
    axisEnd: (trials: string) => `${trials} deneme`,
    outcomesLabel: (n: number) => `\u0130lk ${n} karar, s\u0131ras\u0131yla`,
    outcomeLabel: (index: number, side: string) => `${index}. deneme: ${side}`,
    right: "sa\u011f",
    left: "sol",
    rightMark: "S",
    leftMark: "L",
    tableCaption:
      "Ayn\u0131 ko\u015funun ge\u00e7ti\u011fi her \u00f6l\u00e7ekte okunu\u015fu: teorik olas\u0131l\u0131k, g\u00f6zlenen oran ve aralar\u0131ndaki uzakl\u0131k.",
    trialsColumn: "Deneme",
    theoreticalColumn: "Teorik",
    observedColumn: "G\u00f6zlenen",
    deviationColumn: "Sapma",
    tableNote:
      "Sapma s\u00fctununu yukar\u0131dan a\u015fa\u011f\u0131ya okuyun. K\u00fc\u00e7\u00fclme e\u011filimindedir; her sat\u0131rda k\u00fc\u00e7\u00fclmesi gerekmez.",
    reading: (trials: string) =>
      `Tek bir tohumdan \u00fcretilmi\u015f ${trials} ba\u011f\u0131ms\u0131z karar. Ayn\u0131 tohum her seferinde ayn\u0131 ko\u015fuyu verir.`,
    explainWhat:
      "Oran ba\u015flarda gezinir, sonra teorik olas\u0131l\u0131\u011f\u0131n yak\u0131n\u0131nda durulur.",
    explainWhy:
      "Her yeni deneme, y\u00fcr\u00fcyen oran\u0131 bir \u00f6ncekinden daha az oynat\u0131r; \u00e7\u00fcnk\u00fc giderek artan say\u0131da sonucun yaln\u0131zca biridir. Ba\u015flang\u0131\u00e7ta tek bir sonu\u00e7 pay\u0131 onda bir oynatabilir; on bin denemeden sonra on binde birden fazla oynatamaz. Gezinme durmaz, yaln\u0131zca bu \u00f6l\u00e7ekte g\u00f6r\u00fcnmez olur.",
    explainMaths:
      "G\u00f6zlenen oran, sa\u011fa giden karar say\u0131s\u0131n\u0131n deneme say\u0131s\u0131na b\u00f6l\u00fcm\u00fcd\u00fcr; sapma ise bu oran\u0131n teorik olas\u0131l\u0131\u011fa uzakl\u0131\u011f\u0131d\u0131r. \u0130kisi de bir form\u00fclden de\u011fil, ko\u015funun kendisinden okunur; sapma s\u00fctununun arada bir yeniden y\u00fckselmesinin nedeni de budur.",
    theoreticalFigure: "Teorik olas\u0131l\u0131k",
    theoreticalHint:
      "Adil bir karar; \u00f6l\u00e7\u00fclm\u00fc\u015f de\u011fil, tan\u0131mlanm\u0131\u015f",
    observedFigure: "G\u00f6zlenen oran",
    deviationFigure: "Sapma",
    deviationHint: "Teorik de\u011fere uzakl\u0131k",
    trialsFigure: "Deneme",
    announce: (trials: string, observed: string) =>
      `${trials} deneme. G\u00f6zlenen oran ${observed}.`,
    coachLabel: "S\u0131k sorulanlar",
    coach: {
      notEvenly: {
        q: "\u0130ki taraf\u0131n tam olarak e\u015fitlenmesi gerekmez mi?",
        a: "Gerekmez. Sa\u011fa gidenlerin pay\u0131 yar\u0131ya yakla\u015f\u0131r, ama iki say\u0131 aras\u0131ndaki fark b\u00fcy\u00fcmekte serbesttir. Bir ko\u015fu bir tarafta on bin fazla bitirip yine de oran olarak yar\u0131ya \u00e7ok yak\u0131n durabilir; \u00e7\u00fcnk\u00fc oran \u00e7ok daha b\u00fcy\u00fck bir say\u0131ya b\u00f6l\u00fcn\u00fcr.",
      },
      dueForOne: {
        q: "\u00dcst \u00fcste sola gittikten sonra sa\u011f gelmesi gerekmez mi?",
        a: "Gerekmez. Her karar ba\u011f\u0131ms\u0131zd\u0131r; s\u0131radaki karar da ilki kadar her iki y\u00f6ne gidebilir. Dengesiz bir ba\u015flang\u0131c\u0131 d\u00fczelten \u015fey, ters y\u00f6nde telafi eden bir seri de\u011fil, sonraki denemelerin \u00e7oklu\u011funun onu seyreltmesidir.",
      },
      howMany: {
        q: "Ka\u00e7 deneme yeterlidir?",
        a: "Ne kadar yak\u0131n olman\u0131z gerekti\u011fine ve bundan ne kadar emin olmak istedi\u011finize ba\u011fl\u0131d\u0131r. Kanun bir takvim de\u011fil bir e\u011filim tarif eder ve g\u00f6zlenen oran\u0131n teorik olas\u0131l\u0131\u011f\u0131n yak\u0131n\u0131nda kalaca\u011f\u0131n\u0131 garanti eden bir say\u0131 vermez.",
      },
    },
  },

  recap: {
    lessons: [
      "Sezgi bir olas\u0131l\u0131k hesaplay\u0131c\u0131s\u0131 de\u011fildir. D\u00f6rt deneyin d\u00f6rd\u00fcnde de akla ilk gelen cevap yanl\u0131\u015f olan\u0131d\u0131r.",
      'Bir ipucu hangi sonu\u00e7lar\u0131n m\u00fcmk\u00fcn kald\u0131\u011f\u0131n\u0131 de\u011fi\u015ftirir ve hangilerinin kalaca\u011f\u0131na c\u00fcmlenin kurulu\u015fu karar verir. "En az biri erkek" ile "ilki erkek" farkl\u0131 k\u00fcmeler b\u0131rak\u0131r.',
      "Tutma meselesi ki\u015filerle de\u011fil \u00e7iftlerle ilgilidir. Yirmi \u00fc\u00e7 ki\u015fi 253 \u00e7ift olu\u015fturur; ayn\u0131 do\u011fum g\u00fcn\u00fcn\u00fcn hissedildi\u011finden \u00e7ok daha erken gelmesinin nedeni budur.",
      "Gruplar\u0131 toplamak, gruplar ayn\u0131 bi\u00e7imde doldurulmam\u0131\u015fsa i\u00e7lerindeki kar\u015f\u0131la\u015ft\u0131rmay\u0131 tersine \u00e7evirebilir.",
    ],
    footer:
      "Bunlar\u0131n her biri, belirtilmi\u015f bir modeli olan \u00e7\u00f6z\u00fcml\u00fc birer problemdir; \u015fansa dair genel bir kural de\u011fil. Tam olas\u0131l\u0131klar kapal\u0131 formda hesaplan\u0131r; sim\u00fcle edilenler ise deneyin tohumlanm\u0131\u015f bir \u00fcrete\u00e7le ger\u00e7ekten \u00e7al\u0131\u015ft\u0131r\u0131lmas\u0131ndan gelir ve her zaman b\u00f6yle etiketlenir. Bir soru ger\u00e7ekten belirsizse (en a\u00e7\u0131k \u00f6rnek iki \u00e7ocuk problemidir), varsay\u0131m sessizce se\u00e7ilmez, yaz\u0131l\u0131r.",
  },
};

export default copy;
