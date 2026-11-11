import type { Language } from "@/app/preferences";

/**
 * The calculator page's own words, in both languages.
 *
 * Kept with the page rather than in the shell dictionary: the shell ships in
 * the entry chunk every visitor downloads, and this text is only needed by
 * someone who opens the calculator. The two words the header and the home
 * page need are in the shell dictionary.
 */

const en = {
  overline: "Scientific calculator",
  badge: "Tool",
  minutes: "15 min",
  title: "How to use my calculator",
  description:
    "Pick your model and learn it key by key: order of operations, degrees and radians, variance and regression, probability, equations, integrals and matrices. The simulated calculator only takes the right key, so you cannot get lost.",
  pickKicker: "Step 1",
  pickTitle: "Which calculator do you have?",
  pickLede:
    "The model name is printed just above the screen. Pick the same one here; the keys and menus will match.",
  modelLabel: "Calculator model",
  sameKeys: (siblings: string) => `Same keys and menus as the ${siblings}.`,
  notListed:
    "The fx-991CW is not here yet: Casio does not publish the order of its menus, and a lesson that guesses would send you to the wrong key.",
  notOnModel: (name: string) => `The ${name} cannot do this: it has no key or mode for it.`,
  practiseKicker: "Step 2",
  practiseTitle: "Learn it key by key",
  practiseLede:
    "Choose a lesson. The key to press next is lit; press it on the screen or type it on your keyboard. Then try the same keys on your own calculator.",
  practiceLabel: "How to practise",
  lessonMode: "Lesson",
  freeMode: "Free use",
  freeHint:
    "Free use: every key works and nothing is checked. Use it to try a sum from your homework.",
  lessonsLabel: "Lessons",
  step: (n: number, of: number) => `Step ${n} of ${of}`,
  nextKey: "Next key",
  wrongKey: "This step wants",
  showMe: "Show me",
  restart: "Start again",
  nextLesson: "Next lesson",
  done: "Done.",
  allDone: "That was the last lesson. Free use is open for anything else.",
  device: (name: string) => `${name} simulator`,
  keyboardHint:
    "On a computer you can type too: digits, + − * / ^ ( ), Enter for =, Backspace for DEL, Esc for AC, arrow keys.",
  unsupported: "That key or menu item is on the real calculator but not in this simulator.",
  full: "The data table is full.",
  disclaimer:
    "A simulation. The key sequences come from Casio's own guides for these models, but the screen is simplified: one line of input, no textbook layout, and only the menus the lessons use. When your calculator shows something different, trust your calculator.",
  shiftLabel: "SHIFT is on: the next key does what is printed above it, in amber.",
  dailyOverline: (n: number) => `Daily puzzle #${n}`,
  dailyTitle: "Five questions, three tries each",
  dailyLede: (model: string) =>
    `Today's questions for the ${model}. No keys shown: you find the way, as in an exam. Everyone with the same calculator gets the same five.`,
  dailyPlay: "Solve today's puzzle",
  dailyContinue: "Carry on",
  dailySeeResult: "See your result",
  dailyNext: (time: string) => `Next puzzle in ${time}`,
  dailyStreak: (days: number) => (days === 1 ? "1-day streak" : `${days}-day streak`),
  dailyHow:
    "Work the answer out on the calculator, then press “This is my answer”: it reads the screen. A wrong answer tells you whether the right one is higher or lower. 3 points for a first try, 2 for a second, 1 for a third.",
  dailyQuestion: (n: number, of: number) => `Question ${n} of ${of}`,
  dailyTriesLeft: (left: number) => (left === 1 ? "1 try left" : `${left} tries left`),
  dailyAnswer: "This is my answer",
  dailyGiveUp: "Give up",
  dailyRight: (answer: string) => `Correct: ${answer}. On to the next one.`,
  dailyMissed: (answer: string) => `Question closed. The answer was ${answer}.`,
  dailyHigher: (left: string) => `Not quite: the answer is higher. ${left}.`,
  dailyLower: (left: string) => `Not quite: the answer is lower. ${left}.`,
  dailyEmpty: "Nothing on the screen answers this question yet. Work it out first.",
  dailyBoard: "Today's board",
  dailyCell: {
    higher: "wrong, the answer is higher",
    lower: "wrong, the answer is lower",
    solved: "right",
    missed: "missed",
    open: "not tried",
  },
  dailyPoints: (points: number, max: number) => `${points} / ${max} points`,
  dailyVerdict: (points: number): string =>
    points === 15
      ? "Flawless. Your calculator does exactly what you tell it."
      : points >= 12
        ? "Sharp. Nearly all of it on the first try."
        : points >= 8
          ? "Solid. The points you lost show what to practise."
          : "A start. Every question here has a lesson above.",
  dailyShareText: (n: number, model: string) => `Calculator puzzle #${n} · ${model}`,
  dailyShare: "Copy my result",
  dailyCopied: "Copied. Paste it anywhere.",
  dailyCopyHere: "Copy it from here:",
  statsPlayed: "Played",
  statsStreak: "Streak",
  statsBest: "Best streak",
  dailyNewDay: "A new puzzle is ready.",
  dailyOpenNew: "Open it",
  dailyLocal: "Your progress and streak are kept in this browser only.",
};

export type CalculatorCopy = typeof en;

const tr: CalculatorCopy = {
  overline: "Bilimsel hesap makinesi",
  badge: "Araç",
  minutes: "15 dk",
  title: "Hesap makineni kullanmayı öğren",
  description:
    "Hesap makinenin modelini seç ve bir ders aç. İşlem önceliği, açı birimleri, istatistik, denklemler ve matrisler için tuş sıralarını dene. Ders modunda sıradaki tuş gösterilir.",
  pickKicker: "İlk adım",
  pickTitle: "Hangi modeli kullanıyorsun?",
  pickLede:
    "Model adı ekranın hemen üstünde yazar. Burada aynısını seç; tuşlar ve menüler birebir eşleşir.",
  modelLabel: "Hesap makinesi modeli",
  sameKeys: (siblings: string) => `${siblings} ile aynı tuşlar ve menüler.`,
  notListed:
    "fx-991CW henüz yok: Casio menülerinin sırasını yayımlamıyor, tahminle yazılmış bir ders seni yanlış tuşa götürür.",
  notOnModel: (name: string) => `${name} bunu yapamaz: bunun için bir tuşu ya da modu yok.`,
  practiseKicker: "Uygulama",
  practiseTitle: "Bir ders seç ve tuşları dene",
  practiseLede:
    "Bir ders seç. Sıradaki tuş ışıkla gösterilir; ona ekranda bas ya da klavyeden yaz. Sonra aynı tuşları kendi hesap makinende dene.",
  practiceLabel: "Çalışma biçimi",
  lessonMode: "Ders",
  freeMode: "Serbest kullanım",
  freeHint:
    "Serbest kullanım: her tuş çalışır, hiçbir şey denetlenmez. Ödevindeki bir işlemi denemek için kullan.",
  lessonsLabel: "Dersler",
  step: (n: number, of: number) => `Adım ${n} / ${of}`,
  nextKey: "Sıradaki tuş",
  wrongKey: "Bu adımda beklenen tuş",
  showMe: "Göster",
  restart: "Baştan başla",
  nextLesson: "Sonraki ders",
  done: "Tamamlandı.",
  allDone: "Bu model için dersler tamamlandı. Serbest kullanımda kendi işlemlerini deneyebilirsin.",
  device: (name: string) => `${name} simülatörü`,
  keyboardHint:
    "Bilgisayarda klavyeden de yazabilirsin: rakamlar, + − * / ^ ( ), = için Enter, DEL için Backspace, AC için Esc, ok tuşları.",
  unsupported: "Bu tuş ya da menü gerçek hesap makinesinde var ama bu simülatörde yok.",
  full: "Veri tablosu dolu.",
  disclaimer:
    "Bu bir simülasyon. Tuş sıraları Casio'nun bu modeller için yayımladığı kılavuzlardan alındı, ama ekran sadeleştirildi: tek satır giriş, ders kitabı görünümü yok ve yalnızca derslerin kullandığı menüler var. Hesap makinen farklı bir şey gösterirse kendi hesap makinene güven.",
  shiftLabel: "SHIFT açık: sıradaki tuş, üstünde turuncu yazan işi yapar.",
  dailyOverline: (n: number) => `Günün soruları #${n}`,
  dailyTitle: "Beş soru, her soruda üç hak",
  dailyLede: (model: string) =>
    `${model} için bugünün soruları. Tuş gösterilmez, yolu sınavdaki gibi sen bulursun. Aynı hesap makinesine sahip herkes aynı beş soruyu alır.`,
  dailyPlay: "Bugünün bulmacasını çöz",
  dailyContinue: "Devam et",
  dailySeeResult: "Sonucunu gör",
  dailyNext: (time: string) => `Sonraki bulmacaya ${time} kaldı`,
  dailyStreak: (days: number) => `${days} günlük seri`,
  dailyHow:
    "Cevabı hesap makinesinde bul, sonra “Cevabım bu” düğmesine bas: ekranı okur. Yanlış cevapta doğru cevabın daha büyük mü küçük mü olduğu söylenir. İlk denemede 3, ikincide 2, üçüncüde 1 puan.",
  dailyQuestion: (n: number, of: number) => `Soru ${n} / ${of}`,
  dailyTriesLeft: (left: number) => `${left} hakkın kaldı`,
  dailyAnswer: "Cevabım bu",
  dailyGiveUp: "Pes et",
  dailyRight: (answer: string) => `Doğru: ${answer}. Sıradaki soruya geç.`,
  dailyMissed: (answer: string) => `Soru tamamlandı. Doğru cevap: ${answer}.`,
  dailyHigher: (left: string) => `Olmadı: cevap daha büyük. ${left}.`,
  dailyLower: (left: string) => `Olmadı: cevap daha küçük. ${left}.`,
  dailyEmpty: "Ekranda henüz bu sorunun cevabı olabilecek bir sonuç yok. Önce hesapla.",
  dailyBoard: "Bugünkü sonuçların",
  dailyCell: {
    higher: "yanlış, cevap daha büyük",
    lower: "yanlış, cevap daha küçük",
    solved: "doğru",
    missed: "kaçtı",
    open: "denenmedi",
  },
  dailyPoints: (points: number, max: number) => `${points} / ${max} puan`,
  dailyVerdict: (points: number): string =>
    points === 15
      ? "Kusursuz. Hesap makinen tam söylediğini yapıyor."
      : points >= 12
        ? "Neredeyse bütün soruları ilk denemede çözdün."
        : points >= 8
          ? "Yanlış yaptığın konuların derslerini tekrar deneyebilirsin."
          : "Bir başlangıç. Buradaki her sorunun yukarıda bir dersi var.",
  dailyShareText: (n: number, model: string) => `Hesap makinesi bulmacası #${n} · ${model}`,
  dailyShare: "Sonucumu kopyala",
  dailyCopied: "Kopyalandı. İstediğin yere yapıştır.",
  dailyCopyHere: "Buradan kopyala:",
  statsPlayed: "Oynanan",
  statsStreak: "Seri",
  statsBest: "En iyi seri",
  dailyNewDay: "Yeni bulmaca hazır.",
  dailyOpenNew: "Aç",
  dailyLocal: "İlerlemen ve serin yalnızca bu tarayıcıda tutulur.",
};

export const CALCULATOR_COPY: Record<Language, CalculatorCopy> = { en, tr };
