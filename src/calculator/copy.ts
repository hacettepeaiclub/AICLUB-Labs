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
};

export type CalculatorCopy = typeof en;

const tr: CalculatorCopy = {
  overline: "Bilimsel hesap makinesi",
  badge: "Araç",
  minutes: "15 dk",
  title: "Hesap makinemi nasıl kullanırım?",
  description:
    "Modelini seç ve tuş tuş öğren: işlem önceliği, derece ve radyan, varyans ve regresyon, olasılık, denklemler, integral ve matrisler. Simülatör yalnızca doğru tuşu kabul eder, yani kaybolmazsın.",
  pickKicker: "1. adım",
  pickTitle: "Hangi hesap makinesine sahipsin?",
  pickLede:
    "Model adı ekranın hemen üstünde yazar. Burada aynısını seç; tuşlar ve menüler birebir eşleşir.",
  modelLabel: "Hesap makinesi modeli",
  sameKeys: (siblings: string) => `${siblings} ile aynı tuşlar ve menüler.`,
  notListed:
    "fx-991CW henüz yok: Casio menülerinin sırasını yayımlamıyor, tahminle yazılmış bir ders seni yanlış tuşa götürür.",
  notOnModel: (name: string) => `${name} bunu yapamaz: bunun için bir tuşu ya da modu yok.`,
  practiseKicker: "2. adım",
  practiseTitle: "Tuş tuş öğren",
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
  allDone: "Son dersi de bitirdin. Başka her şey için serbest kullanım açık.",
  device: (name: string) => `${name} simülatörü`,
  keyboardHint:
    "Bilgisayarda klavyeden de yazabilirsin: rakamlar, + − * / ^ ( ), = için Enter, DEL için Backspace, AC için Esc, ok tuşları.",
  unsupported: "Bu tuş ya da menü gerçek hesap makinesinde var ama bu simülatörde yok.",
  full: "Veri tablosu dolu.",
  disclaimer:
    "Bu bir simülasyon. Tuş sıraları Casio'nun bu modeller için yayımladığı kılavuzlardan alındı, ama ekran sadeleştirildi: tek satır giriş, ders kitabı görünümü yok ve yalnızca derslerin kullandığı menüler var. Hesap makinen farklı bir şey gösterirse kendi hesap makinene güven.",
  shiftLabel: "SHIFT açık: sıradaki tuş, üstünde turuncu yazan işi yapar.",
};

export const CALCULATOR_COPY: Record<Language, CalculatorCopy> = { en, tr };
