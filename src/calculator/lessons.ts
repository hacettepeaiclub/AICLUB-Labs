import { isMatrix } from "./engine/matrix";
import type { CalcState } from "./engine/machine";
import type { KeyId, ModelId } from "./engine/types";

/**
 * The lessons: each one a short task, done on the simulated calculator one key
 * at a time.
 *
 * ## Why these
 *
 * They are the places students actually get stuck, not a tour of the manual:
 * an order of operations they did not expect, a minus sign that is not the
 * minus key, an answer in the wrong angle unit, a variance with no key of its
 * own (and two of them), a regression line, a normal probability on a model
 * with no normal distribution key, equation solvers and matrix work hidden
 * behind menus nobody opens until the exam.
 *
 * ## One task, four keyboards
 *
 * A lesson has a list of keys for each model that can do it. The same task is
 * often done very differently: the EX has a Distribution mode where the ES
 * PLUS and MS only have P(, so on those the lesson standardises first; the MS
 * enters data with DT rather than in a table. A model with no steps for a
 * lesson cannot do it at all, and the page says so (the fx-82ES PLUS has no
 * equation solver and no matrices).
 *
 * ## Why every lesson is replayed in a test
 *
 * `lessons.test.ts` presses every lesson's keys on a fresh calculator of each
 * model and checks `done`. A lesson whose keys do not give the answer its text
 * promises cannot ship. That catches a mistake in this file; it cannot catch
 * a simulation that differs from the real device, which is why the key
 * sequences are taken from Casio's documentation (see `engine/models.ts`).
 */

export interface Text {
  en: string;
  tr: string;
}

export interface LessonStep {
  keys: KeyId[];
  say: Text;
}

export type LessonTopic =
  "basics" | "statistics" | "probability" | "equations" | "calculus" | "matrices";

export interface Lesson {
  id: string;
  topic: LessonTopic;
  title: Text;
  /** One sentence: why this matters. */
  why: Text;
  /** Keys for each model that can do it; a model missing here cannot. */
  steps: Partial<Record<ModelId, LessonStep[]>>;
  /** What the student should be looking at when it is done. */
  outcome: Text;
  done: (s: CalcState) => boolean;
}

const t = (en: string, tr: string): Text => ({ en, tr });

/** The keys that type a number: digits, the point, and (−) for a minus. */
const typed = (value: number): KeyId[] =>
  String(value)
    .split("")
    .map((c) => (c === "-" ? "neg" : c === "." ? "dot" : c) as KeyId);

/** Numbers each followed by =, as the tables and editors expect. */
const entries = (...values: number[]): KeyId[] =>
  values.flatMap((v) => [...typed(v), "eq" as KeyId]);

/** Numbers each followed by DT (the M+ key), as the MS takes data. */
const dt = (...values: number[]): KeyId[] => values.flatMap((v) => [...typed(v), "mplus" as KeyId]);

/** Pairs x , y DT, as the MS takes paired data. */
const pairsDt = (...pairs: [number, number][]): KeyId[] =>
  pairs.flatMap(([x, y]) => [...typed(x), "comma" as KeyId, ...typed(y), "mplus" as KeyId]);

const near = (a: unknown, b: number) => typeof a === "number" && Math.abs(a - b) < 1e-9;

const sameMatrix = (a: unknown, b: number[][]) =>
  isMatrix(a) &&
  a.length === b.length &&
  a.every(
    (row, i) => row.length === b[i]!.length && row.every((x, j) => Math.abs(x - b[i]![j]!) < 1e-9),
  );

const ALL: ModelId[] = ["fx991ex", "fx991esplus", "fx570ms", "fx82ms", "fx82esplus"];
const everywhere = (steps: LessonStep[]): Partial<Record<ModelId, LessonStep[]>> =>
  Object.fromEntries(ALL.map((id) => [id, steps]));

// Shared steps and data.
const A_VALUES = entries(2, 1, 1, 3);
const B_VALUES = entries(1, 2, 0, 1);
const UP_FIVE: KeyId[] = ["up", "up", "up", "up", "up"];
const REG_X = [1, 2, 3, 4, 5];
const REG_Y = [2, 4, 5, 4, 5];
const ac: LessonStep = {
  keys: ["ac"],
  say: t("AC to the calculation screen.", "AC ile hesap ekranına geç."),
};
const dataFirstHalf = t(
  "Type each value and press =: 2, 4, 4, 4.",
  "Her değeri yaz ve = bas: 2, 4, 4, 4.",
);
const dataSecondHalf = t(
  "Then 5, 5, 7, 9. That is eight values.",
  "Sonra 5, 5, 7, 9. Toplam sekiz değer.",
);

/** The ES PLUS family's mean lesson; the 82 differs only in the STAT number. */
const esMean = (stat: KeyId): LessonStep[] => [
  {
    keys: ["mode", stat, "1"],
    say: t(
      `MODE, ${stat} (STAT), 1 (1-VAR). The data table opens.`,
      `MODE, ${stat} (STAT), 1 (1-VAR). Veri tablosu açılır.`,
    ),
  },
  { keys: entries(2, 4, 4, 4), say: dataFirstHalf },
  { keys: entries(5, 5, 7, 9), say: dataSecondHalf },
  {
    keys: ["ac"],
    say: t(
      "AC goes to the calculation screen. The data stays.",
      "AC ile hesap ekranına geç. Veriler silinmez.",
    ),
  },
  {
    keys: ["shift", "1", "4", "2", "eq"],
    say: t(
      "SHIFT 1 (STAT), 4 (Var), 2 (x̄), =: the mean is 5.",
      "SHIFT 1 (STAT), 4 (Var), 2 (x̄), =: ortalama 5.",
    ),
  },
  {
    keys: ["shift", "1", "4", "3", "eq"],
    say: t(
      "SHIFT 1, 4, 3 (σx), =: 2. The population standard deviation: square root of the sum of squared deviations divided by n.",
      "SHIFT 1, 4, 3 (σx), =: 2. Kitle standart sapması: kareli sapmalar toplamını n'e bölüp karekökünü alır.",
    ),
  },
  {
    keys: ["shift", "1", "4", "4", "eq"],
    say: t(
      "SHIFT 1, 4, 4 (sx), =: 2.138089935. The sample standard deviation: square root of the sum of squared deviations divided by n − 1.",
      "SHIFT 1, 4, 4 (sx), =: 2.138089935. Örneklem standart sapması: kareli sapmalar toplamını n − 1'e bölüp karekökünü alır.",
    ),
  },
];

const esVariance = (stat: KeyId): LessonStep[] => [
  { keys: ["mode", stat, "1"], say: t("STAT mode, 1-VAR.", "STAT modu, 1-VAR.") },
  { keys: entries(3, 5, 7, 9), say: t("Enter 3, 5, 7, 9.", "3, 5, 7, 9 değerlerini gir.") },
  ac,
  {
    keys: ["shift", "1", "4", "4", "sq", "eq"],
    say: t(
      "Variance is the standard deviation squared. sx then x²: the sample variance, 20⁄3.",
      "Varyans, standart sapmanın karesidir. sx'i çağır ve x² bas: örneklem varyansı 20⁄3.",
    ),
  },
  { keys: ["sd"], say: t("S⇔D: 6.666666667.", "S⇔D ile ondalık: 6.666666667.") },
  {
    keys: ["shift", "1", "4", "3", "sq", "eq"],
    say: t(
      'σx then x²: the population variance, 5. When a question says "sample", use s².',
      'σx\'i çağır ve x² bas: kitle varyansı 5. Soruda "örneklem" geçiyorsa s² kullanılır.',
    ),
  },
];

const esRegression = (stat: KeyId): LessonStep[] => [
  {
    keys: ["mode", stat, "2"],
    say: t(
      "STAT, 2 (A+BX): a table with an X and a Y column.",
      "STAT, 2 (A+BX): X ve Y sütunlu bir tablo açılır.",
    ),
  },
  {
    keys: entries(...REG_X),
    say: t("The X column first: 1, 2, 3, 4, 5.", "Önce X sütunu: 1, 2, 3, 4, 5."),
  },
  {
    keys: [...UP_FIVE, "right"],
    say: t("▲ to the top, ▶ to the Y column.", "▲ ile en üste çık, ▶ ile Y sütununa geç."),
  },
  { keys: entries(...REG_Y), say: t("Then Y: 2, 4, 5, 4, 5.", "Sonra Y: 2, 4, 5, 4, 5.") },
  ac,
  {
    keys: ["shift", "1", "5", "1", "eq"],
    say: t(
      "SHIFT 1, 5 (Reg), 1 (A), =: the intercept, 2.2.",
      "SHIFT 1, 5 (Reg), 1 (A), =: kesişim noktası 2.2.",
    ),
  },
  {
    keys: ["shift", "1", "5", "2", "eq"],
    say: t(
      "SHIFT 1, 5, 2 (B), =: the slope, 0.6. The line is y = 2.2 + 0.6x.",
      "SHIFT 1, 5, 2 (B), =: eğim 0.6. Doğru: y = 2.2 + 0.6x.",
    ),
  },
  {
    keys: ["shift", "1", "5", "3", "eq"],
    say: t(
      "SHIFT 1, 5, 3 (r), =: the correlation, 0.7745966692. Closer to 1 is a straighter line.",
      "SHIFT 1, 5, 3 (r), =: korelasyon 0.7745966692. 1'e ne kadar yakınsa ilişki o kadar doğrusal.",
    ),
  },
  {
    keys: ["6", "shift", "1", "5", "5", "eq"],
    say: t(
      "A prediction: type 6, then SHIFT 1, 5, 5 (ŷ), =: at x = 6 the line gives 5.8.",
      "Tahmin: 6 yaz, sonra SHIFT 1, 5, 5 (ŷ), =: x = 6 için doğru 5.8 verir.",
    ),
  },
];

const formulaBinomial = (cube: KeyId[], ownKey = false): LessonStep[] => [
  ownKey
    ? {
        keys: ["5", "ncr", "2"],
        say: t(
          "There is no binomial key, so use the formula C(5, 2) · 0.5² · 0.5³. First 5 nCr 2: nCr has a key of its own here.",
          "Binom dağılımı tuşu yok; formülle hesaplanır: C(5, 2) · 0.5² · 0.5³. Önce 5 nCr 2: bu modelde nCr'nin kendi tuşu var.",
        ),
      }
    : {
        keys: ["5", "shift", "divide", "2"],
        say: t(
          "There is no binomial key, so use the formula C(5, 2) · 0.5² · 0.5³. First 5 SHIFT ÷ (nCr) 2.",
          "Binom dağılımı tuşu yok; formülle hesaplanır: C(5, 2) · 0.5² · 0.5³. Önce 5 SHIFT ÷ (nCr) 2.",
        ),
      },
  { keys: ["times", "0", "dot", "5", "sq"], say: t("× 0.5².", "× 0.5².") },
  {
    keys: ["times", "0", "dot", "5", ...cube, "eq"],
    say: t(
      "× 0.5³, then =: 0.3125. The chance of exactly two heads in five tosses.",
      "× 0.5³, sonra =: 0.3125. Beş atışta tam iki tura gelme olasılığı.",
    ),
  },
];

export const LESSONS: Lesson[] = [
  // ------------------------------------------------------------ basics --
  {
    id: "order",
    topic: "basics",
    title: t("Multiplication first", "Önce çarpma"),
    why: t(
      "The calculator follows the order of operations, not the order you typed.",
      "Hesap makinesi senin yazdığın sırayla değil, işlem önceliğiyle hesaplar.",
    ),
    steps: everywhere([
      { keys: ["2", "plus", "3", "times", "4"], say: t("Type 2 + 3 × 4.", "2 + 3 × 4 yaz.") },
      {
        keys: ["eq"],
        say: t(
          "Press =. It says 14, not 20: 3 × 4 is worked out before the addition.",
          "= tuşuna bas. Sonuç 20 değil 14: önce 3 × 4 hesaplanır, toplama sonra yapılır.",
        ),
      },
      {
        keys: ["divide", "2", "eq"],
        say: t(
          "With an answer on screen, start with ÷. The calculator puts Ans, the last answer, in front for you: Ans ÷ 2 = 7.",
          "Sonuç ekrandayken doğrudan ÷ ile başla. Hesap makinesi başa kendisi Ans (son cevap) koyar: Ans ÷ 2 = 7.",
        ),
      },
    ]),
    outcome: t("The screen shows 7.", "Ekranda 7 yazıyor."),
    done: (s) => s.evaluated && near(s.result, 7),
  },
  {
    id: "negative",
    topic: "basics",
    title: t("The minus sign and x²", "Eksi işareti ve kare"),
    why: t(
      "(−) is not the subtraction key, and −3² is not 9.",
      "(−) çıkarma tuşu değildir, ve −3² sonucu 9 değildir.",
    ),
    steps: everywhere([
      {
        keys: ["neg", "3", "sq"],
        say: t(
          "(−) makes a number negative. Type (−) 3 x².",
          "(−) tuşu sayıyı negatif yapar. (−) 3 x² yaz.",
        ),
      },
      {
        keys: ["eq"],
        say: t(
          "−9: the calculator squares 3 first and puts the minus on afterwards.",
          "Sonuç −9: hesap makinesi önce 3'ün karesini alır, eksiyi sonra ekler.",
        ),
      },
      {
        keys: ["lp", "neg", "3", "rp", "sq", "eq"],
        say: t(
          "To square a negative number, bracket it: ((−)3)² = 9.",
          "Negatif bir sayının karesi için onu paranteze al: ((−)3)² = 9.",
        ),
      },
    ]),
    outcome: t("The screen shows 9.", "Ekranda 9 yazıyor."),
    done: (s) => s.evaluated && near(s.result, 9),
  },
  {
    id: "fraction",
    topic: "basics",
    title: t("Fraction or decimal", "Kesir mi, ondalık mı"),
    why: t(
      "A result can be a fraction or a decimal, and one key turns one into the other.",
      "Bir sonuç kesir ya da ondalık olabilir; tek bir tuş birini ötekine çevirir.",
    ),
    steps: {
      ...everywhere([
        {
          keys: ["1", "divide", "3", "eq"],
          say: t(
            "1 ÷ 3 =. The answer is shown as the fraction 1⁄3.",
            "1 ÷ 3 =. Sonuç 1⁄3 kesri olarak görünür.",
          ),
        },
        {
          keys: ["sd"],
          say: t(
            "S⇔D swaps it for the decimal, 0.3333333333. Press it again to get the fraction back.",
            "S⇔D onu ondalığa çevirir: 0.3333333333. Tekrar basarsan kesre döner.",
          ),
        },
      ]),
      fx570ms: [
        {
          keys: ["1", "frac", "2", "plus", "1", "frac", "3"],
          say: t("a b/c types a fraction: 1⁄2 + 1⁄3.", "a b/c tuşu kesir yazar: 1⁄2 + 1⁄3."),
        },
        {
          keys: ["eq"],
          say: t(
            "5┘6: the MS writes a fraction with ┘. A decimal in the sum would give a decimal answer instead.",
            "5┘6: MS kesri ┘ işaretiyle yazar. İşlemde ondalık bir sayı olsaydı sonuç ondalık çıkardı.",
          ),
        },
        {
          keys: ["frac"],
          say: t(
            "a b/c on an answer turns it into a decimal, 0.833333333, and back again.",
            "Sonuç ekrandayken a b/c onu ondalığa çevirir (0.833333333), tekrar basınca kesre döner.",
          ),
        },
      ],
    },
    outcome: t("The decimal is on the screen.", "Ekranda ondalık hâli var."),
    done: (s) => s.evaluated && s.decimal && (near(s.result, 1 / 3) || near(s.result, 5 / 6)),
  },
  {
    id: "angle",
    topic: "basics",
    title: t("Degrees or radians", "Derece mi, radyan mı"),
    why: t(
      "The same sin(30) gives two different answers. The small D or R at the top says which one you get.",
      "Aynı sin(30) iki farklı sonuç verir. Ekranın üstündeki küçük D ya da R hangisini alacağını söyler.",
    ),
    steps: (() => {
      const sinThirty = (paren: boolean): LessonStep => ({
        keys: paren ? ["sin", "3", "0", "rp", "eq"] : ["sin", "3", "0", "eq"],
        say: t(
          "sin(30) = 0.5, in degrees (D at the top).",
          "sin(30) = 0.5: derece modundasın (üstte D).",
        ),
      });
      const sinRadians = (paren: boolean): LessonStep => ({
        keys: paren ? ["sin", "3", "0", "rp", "eq"] : ["sin", "3", "0", "eq"],
        say: t(
          "The same keys now give −0.9880316241: 30 is read as 30 radians. This is the most common exam mistake.",
          "Aynı tuşlar şimdi −0.9880316241 veriyor, çünkü 30 artık radyan olarak okunuyor. Sınavda en sık yapılan hata bu.",
        ),
      });
      const es: LessonStep[] = [
        sinThirty(true),
        {
          keys: ["shift", "mode", "4"],
          say: t(
            "SHIFT MODE opens SETUP, and 4 is Rad. The D at the top turns into R.",
            "SHIFT MODE ile SETUP açılır, 4 Rad'dır. Üstteki D, R olur.",
          ),
        },
        sinRadians(true),
        {
          keys: ["shift", "mode", "3"],
          say: t("Back to degrees: SHIFT MODE 3 (Deg).", "Dereceye dön: SHIFT MODE 3 (Deg)."),
        },
      ];
      return {
        fx991ex: [
          sinThirty(true),
          {
            keys: ["shift", "menu", "2", "2"],
            say: t(
              "SHIFT MENU opens SETUP. 2 is Angle Unit, 2 is Radian. The D at the top turns into R.",
              "SHIFT MENU ile SETUP açılır. 2 Angle Unit, ardından 2 Radian. Üstteki D, R olur.",
            ),
          },
          sinRadians(true),
          {
            keys: ["shift", "menu", "2", "1"],
            say: t("Back to degrees: SETUP, 2, 1 (Degree).", "Dereceye dön: SETUP, 2, 1 (Degree)."),
          },
        ],
        fx991esplus: es,
        fx82esplus: es,
        fx570ms: [
          sinThirty(false),
          {
            keys: ["mode", "mode", "mode", "mode", "2"],
            say: t(
              "Press MODE four times to reach Deg, Rad, Gra, then 2 (Rad). The D at the top turns into R.",
              "MODE'a dört kez bas: Deg, Rad, Gra ekranı gelir. 2 (Rad). Üstteki D, R olur.",
            ),
          },
          sinRadians(false),
          {
            keys: ["mode", "mode", "mode", "mode", "1"],
            say: t(
              "Back to degrees: MODE four times, 1 (Deg).",
              "Dereceye dön: MODE dört kez, 1 (Deg).",
            ),
          },
        ],
      };
    })(),
    outcome: t("The D is back at the top of the screen.", "Ekranın üstünde yeniden D var."),
    done: (s) => s.angle === "deg" && s.screen.s === "calc" && s.input.length === 0,
  },
  {
    id: "memory",
    topic: "basics",
    title: t("Keep a number in a variable", "Bir sayıyı değişkende sakla"),
    why: t(
      "Store an intermediate result instead of copying ten digits by hand.",
      "Ara sonucu elle on hane yazmak yerine bir değişkende sakla.",
    ),
    steps: (() => {
      const first: LessonStep = {
        keys: ["3", "plus", "5", "eq"],
        say: t("3 + 5 = 8.", "3 + 5 = 8."),
      };
      const use: LessonStep = {
        keys: ["alpha", "neg", "times", "1", "0", "eq"],
        say: t(
          "ALPHA (−) types A wherever you need it: A × 10 = 80.",
          "ALPHA (−) ile A'yı istediğin yere yazarsın: A × 10 = 80.",
        ),
      };
      const storeRcl: LessonStep = {
        keys: ["shift", "rcl", "neg"],
        say: t(
          "SHIFT RCL (STO), then the (−) key, which has A printed above it: Ans→A.",
          "SHIFT RCL (STO), sonra üstünde A yazan (−) tuşu: Ans→A.",
        ),
      };
      return {
        fx991ex: [
          first,
          {
            keys: ["sto", "neg"],
            say: t(
              "STO, then the (−) key, which has A printed above it: Ans→A.",
              "STO, sonra üstünde A yazan (−) tuşu: Ans→A.",
            ),
          },
          use,
        ],
        fx991esplus: [first, storeRcl, use],
        fx82esplus: [first, storeRcl, use],
        fx570ms: [first, storeRcl, use],
      };
    })(),
    outcome: t("A holds 8, and A × 10 = 80.", "A'da 8 var, A × 10 = 80."),
    done: (s) => s.evaluated && near(s.result, 80) && s.vars.A === 8,
  },

  // -------------------------------------------------------- statistics --
  {
    id: "mean",
    topic: "statistics",
    title: t("Mean and standard deviation", "Ortalama ve standart sapma"),
    why: t(
      "Type the data once, and the calculator works out every summary from it.",
      "Veriyi bir kez gir, bütün özet değerleri hesap makinesi çıkarsın.",
    ),
    steps: {
      fx991ex: [
        {
          keys: ["menu", "6"],
          say: t("MENU, then 6 for Statistics.", "MENU, ardından 6 (Statistics)."),
        },
        {
          keys: ["1"],
          say: t(
            "1 for 1-Variable: one list of numbers. The data table opens.",
            "1 (1-Variable): tek bir sayı listesi. Veri tablosu açılır.",
          ),
        },
        { keys: entries(2, 4, 4, 4), say: dataFirstHalf },
        { keys: entries(5, 5, 7, 9), say: dataSecondHalf },
        {
          keys: ["optn", "3"],
          say: t(
            "OPTN, 3 (1-Variable Calc) lists everything: x̄ = 5 is the mean, σx = 2 and sx = 2.138089935 are the two standard deviations.",
            "OPTN, 3 (1-Variable Calc) hepsini listeler: x̄ = 5 ortalama, σx = 2 ve sx = 2.138089935 iki farklı standart sapma.",
          ),
        },
      ],
      fx991esplus: esMean("3"),
      fx82esplus: esMean("2"),
      fx570ms: [
        {
          keys: ["mode", "mode", "1"],
          say: t(
            "MODE twice, then 1 (SD): one list of numbers. SD appears at the top. If old data is left, clear it first with SHIFT MODE (CLR) 1 =.",
            "MODE'a iki kez bas, 1 (SD): tek değişkenli veri. Üstte SD yazar. Eski veri kaldıysa önce SHIFT MODE (CLR) 1 = ile temizle.",
          ),
        },
        {
          keys: dt(2, 4, 4, 4),
          say: t(
            "Type each value and press DT, which is the M+ key: 2, 4, 4, 4. The count n goes up each time.",
            "Her değeri yaz ve DT'ye bas; DT, M+ tuşudur: 2, 4, 4, 4. Her seferinde n sayacı artar.",
          ),
        },
        {
          keys: dt(5, 5, 7, 9),
          say: t("Then 5, 5, 7, 9: eight values.", "Sonra 5, 5, 7, 9: toplam sekiz değer."),
        },
        {
          keys: ["shift", "2", "1", "eq"],
          say: t(
            "SHIFT 2 (S-VAR), 1 (x̄), =: the mean is 5.",
            "SHIFT 2 (S-VAR), 1 (x̄), =: ortalama 5.",
          ),
        },
        {
          keys: ["shift", "2", "2", "eq"],
          say: t(
            "SHIFT 2, 2 (σx), =: 2. The population standard deviation: square root of the sum of squared deviations divided by n.",
            "SHIFT 2, 2 (σx), =: 2. Kitle standart sapması: kareli sapmalar toplamını n'e bölüp karekökünü alır.",
          ),
        },
        {
          keys: ["shift", "2", "3", "eq"],
          say: t(
            "SHIFT 2, 3 (sx), =: 2.138089935. The sample standard deviation: square root of the sum of squared deviations divided by n − 1.",
            "SHIFT 2, 3 (sx), =: 2.138089935. Örneklem standart sapması: kareli sapmalar toplamını n − 1'e bölüp karekökünü alır.",
          ),
        },
      ],
    },
    outcome: t("sx = 2.138089935 is on the screen.", "Ekranda sx = 2.138089935 var."),
    done: (s) =>
      s.stat.rows.length === 8 &&
      (s.screen.s === "statList" || (s.evaluated && near(s.result, Math.sqrt(32 / 7)))),
  },
  {
    id: "variance",
    topic: "statistics",
    title: t("Variance: sample or population", "Varyans: örneklem mi, kitle mi"),
    why: t(
      "There is no variance key. You need to know where it is, and which of the two your course means.",
      "Varyans tuşu yok. Nerede olduğunu ve dersinin ikisinden hangisini istediğini bilmen gerek.",
    ),
    steps: {
      fx991ex: [
        {
          keys: ["menu", "6", "1"],
          say: t("Statistics, 1-Variable.", "İstatistik modu, 1-Variable."),
        },
        { keys: entries(3, 5, 7, 9), say: t("Enter 3, 5, 7, 9.", "3, 5, 7, 9 değerlerini gir.") },
        {
          keys: ["optn", "3"],
          say: t(
            'OPTN 3. σ²x = 5 is the population variance; s²x = 6.666666667 is the sample variance. When a question says "sample", use s².',
            'OPTN 3. σ²x = 5 kitle varyansı, s²x = 6.666666667 örneklem varyansı. Soruda "örneklem" geçiyorsa s² kullanılır.',
          ),
        },
      ],
      fx991esplus: esVariance("3"),
      fx82esplus: esVariance("2"),
      fx570ms: [
        {
          keys: ["mode", "mode", "1"],
          say: t("SD mode: MODE twice, 1.", "SD modu: MODE iki kez, 1."),
        },
        {
          keys: dt(3, 5, 7, 9),
          say: t("Enter 3, 5, 7, 9, each with DT.", "3, 5, 7, 9 değerlerini DT ile gir."),
        },
        {
          keys: ["shift", "2", "3", "sq", "eq"],
          say: t(
            "Variance is the standard deviation squared. sx then x²: the sample variance, 6.666666667.",
            "Varyans, standart sapmanın karesidir. sx'i çağır ve x² bas: örneklem varyansı 6.666666667.",
          ),
        },
        {
          keys: ["shift", "2", "2", "sq", "eq"],
          say: t(
            'σx then x²: the population variance, 5. When a question says "sample", use s².',
            'σx\'i çağır ve x² bas: kitle varyansı 5. Soruda "örneklem" geçiyorsa s² kullanılır.',
          ),
        },
      ],
    },
    outcome: t("Both variances: 5 and 6.666666667.", "İki varyans da hazır: 5 ve 6.666666667."),
    done: (s) =>
      s.stat.rows.length === 4 && (s.screen.s === "statList" || (s.evaluated && near(s.result, 5))),
  },
  {
    id: "regression",
    topic: "statistics",
    title: t("A regression line", "Regresyon doğrusu"),
    why: t(
      "Paired data in, the line y = a + bx, its correlation and a prediction out.",
      "İkili veriyi gir; y = a + bx doğrusunu, korelasyonu ve bir tahmini al.",
    ),
    steps: {
      fx991ex: [
        {
          keys: ["menu", "6", "2"],
          say: t(
            "Statistics, 2 (y=a+bx): a table with an x and a y column.",
            "Statistics, 2 (y=a+bx): x ve y sütunlu bir tablo açılır.",
          ),
        },
        {
          keys: entries(...REG_X),
          say: t("The x column first: 1, 2, 3, 4, 5.", "Önce x sütunu: 1, 2, 3, 4, 5."),
        },
        {
          keys: [...UP_FIVE, "right"],
          say: t("▲ to the top, ▶ to the y column.", "▲ ile en üste çık, ▶ ile y sütununa geç."),
        },
        { keys: entries(...REG_Y), say: t("Then y: 2, 4, 5, 4, 5.", "Sonra y: 2, 4, 5, 4, 5.") },
        {
          keys: ["optn", "4"],
          say: t(
            "OPTN, 4 (Regression Calc): a = 2.2, b = 0.6, so y = 2.2 + 0.6x; r = 0.7745966692.",
            "OPTN, 4 (Regression Calc): a = 2.2, b = 0.6, yani y = 2.2 + 0.6x; r = 0.7745966692.",
          ),
        },
      ],
      fx991esplus: esRegression("3"),
      fx82esplus: esRegression("2"),
      fx570ms: [
        {
          keys: ["mode", "mode", "2", "1"],
          say: t(
            "MODE twice, 2 (REG), 1 (Lin): the straight line.",
            "MODE iki kez, 2 (REG), 1 (Lin): doğrusal regresyon.",
          ),
        },
        {
          keys: pairsDt([1, 2], [2, 4], [3, 5]),
          say: t(
            "Each pair as x , y DT, with the , key: 1,2 DT 2,4 DT 3,5 DT.",
            "Her çifti x , y DT olarak gir (, tuşuyla): 1,2 DT 2,4 DT 3,5 DT.",
          ),
        },
        {
          keys: pairsDt([4, 4], [5, 5]),
          say: t("Then 4,4 DT and 5,5 DT.", "Sonra 4,4 DT ve 5,5 DT."),
        },
        {
          keys: ["shift", "2", "right", "right", "1", "eq"],
          say: t(
            "SHIFT 2 (S-VAR), ▶ ▶ to the third page, 1 (A), =: 2.2.",
            "SHIFT 2 (S-VAR), ▶ ▶ ile üçüncü sayfa, 1 (A), =: 2.2.",
          ),
        },
        {
          keys: ["shift", "2", "right", "right", "2", "eq"],
          say: t(
            "The same page, 2 (B): 0.6. The line is y = 2.2 + 0.6x.",
            "Aynı sayfa, 2 (B): 0.6. Doğru: y = 2.2 + 0.6x.",
          ),
        },
        {
          keys: ["shift", "2", "right", "right", "3", "eq"],
          say: t(
            "3 (r): the correlation, 0.774596669. The MS shows one digit fewer below 1: the 0 takes a place.",
            "3 (r): korelasyon 0.774596669. MS, 1'in altındaki sayılarda bir hane az gösterir: baştaki 0 bir yer kaplar.",
          ),
        },
        {
          keys: ["6", "shift", "2", "right", "right", "right", "2", "eq"],
          say: t(
            "A prediction: 6, then S-VAR ▶ ▶ ▶ 2 (ŷ), =: at x = 6 the line gives 5.8.",
            "Tahmin: 6 yaz, S-VAR ▶ ▶ ▶ 2 (ŷ), =: x = 6 için doğru 5.8 verir.",
          ),
        },
      ],
    },
    outcome: t("The line is y = 2.2 + 0.6x.", "Doğru: y = 2.2 + 0.6x."),
    done: (s) =>
      s.stat.rows.length === 5 &&
      ((s.screen.s === "statList" && s.screen.list === "reg") ||
        (s.evaluated && near(s.result, 5.8))),
  },

  // ------------------------------------------------------- probability --
  {
    id: "normal",
    topic: "probability",
    title: t("Normal distribution", "Normal dağılım"),
    why: t(
      "Heights are about N(170, 10²). How many are between 160 and 180, or below 180?",
      "Boylar yaklaşık N(170, 10²). Kaçı 160 ile 180 arasında, kaçı 180'in altında?",
    ),
    steps: (() => {
      const standardise = (close: boolean): LessonStep => ({
        keys: [
          "lp",
          "1",
          "8",
          "0",
          "minus",
          "1",
          "7",
          "0",
          "rp",
          "divide",
          "1",
          "0",
          ...(close ? (["rp"] as KeyId[]) : []),
          "eq",
        ],
        say: t(
          "Standardise first: t = (180 − 170) ÷ 10 = 1. =: 0.84134, so 84% of heights are under 180.",
          "Önce standartlaştır: t = (180 − 170) ÷ 10 = 1. =: 0.84134, yani boyların %84'ü 180'in altında.",
        ),
      });
      return {
        fx991ex: [
          { keys: ["menu", "7"], say: t("MENU, 7 (Distribution).", "MENU, 7 (Distribution).") },
          {
            keys: ["2"],
            say: t(
              "2 (Normal CD): the probability of a range.",
              "2 (Normal CD): bir aralığın olasılığı.",
            ),
          },
          {
            keys: entries(160, 180),
            say: t(
              "Lower = 160, Upper = 180.",
              "Alt sınır (Lower) = 160, üst sınır (Upper) = 180.",
            ),
          },
          {
            keys: entries(10, 170),
            say: t(
              "σ = 10, then μ = 170. The EX asks for σ before μ.",
              "σ = 10, sonra μ = 170. EX önce σ'yı, sonra μ'yü sorar.",
            ),
          },
          {
            keys: ["eq"],
            say: t(
              "= to work it out: p = 0.6826894921. About 68% are within one standard deviation of the mean.",
              "= ile hesapla: p = 0.6826894921. Yaklaşık %68'i ortalamadan bir standart sapma uzaklıkta.",
            ),
          },
        ],
        fx991esplus: [
          {
            keys: ["mode", "3", "1"],
            say: t(
              "There is no normal distribution mode; P( lives in STAT. MODE 3 (STAT), 1 (1-VAR).",
              "Normal dağılım modu yok; P( fonksiyonu STAT modunda. MODE 3 (STAT), 1 (1-VAR).",
            ),
          },
          {
            keys: ["ac"],
            say: t(
              "No data needed: AC to the calculation screen.",
              "Veri girmeye gerek yok: AC ile hesap ekranına geç.",
            ),
          },
          {
            keys: ["shift", "1", "5", "1"],
            say: t(
              "SHIFT 1, 5 (Distr), 1: P(, the area left of t under the standard normal curve.",
              "SHIFT 1, 5 (Distr), 1: P(, standart normal eğride t'nin solundaki alan.",
            ),
          },
          standardise(false),
        ],
        fx570ms: [
          {
            keys: ["mode", "mode", "1"],
            say: t(
              "There is no normal distribution mode; P( lives in SD. MODE twice, 1 (SD).",
              "Normal dağılım modu yok; P( fonksiyonu SD modunda. MODE iki kez, 1 (SD).",
            ),
          },
          {
            keys: ["shift", "3", "1"],
            say: t(
              "SHIFT 3 (DISTR), 1: P(, the area left of t.",
              "SHIFT 3 (DISTR), 1: P(, t'nin solundaki alan.",
            ),
          },
          standardise(true),
        ],
      };
    })(),
    outcome: t("The probability is on the screen.", "Olasılık ekranda."),
    done: (s) =>
      (s.screen.s === "distResult" && near(s.screen.value, 0.6826894921)) ||
      (s.evaluated && near(s.result, 0.84134)),
  },
  {
    id: "binomial",
    topic: "probability",
    title: t("Binomial probability", "Binom olasılığı"),
    why: t(
      "Five fair coin tosses: what is the chance of exactly two heads?",
      "Hilesiz bir parayı beş kez atıyorsun: tam iki tura gelme olasılığı nedir?",
    ),
    steps: {
      fx991ex: [
        { keys: ["menu", "7"], say: t("MENU, 7 (Distribution).", "MENU, 7 (Distribution).") },
        {
          keys: ["4"],
          say: t("4 (Binomial PD): exactly x successes.", "4 (Binomial PD): tam olarak x başarı."),
        },
        { keys: ["2"], say: t("2 (Variable): one value of x.", "2 (Variable): tek bir x değeri.") },
        {
          keys: entries(2, 5),
          say: t("x = 2 successes, N = 5 trials.", "x = 2 başarı, N = 5 deneme."),
        },
        {
          keys: entries(0.5),
          say: t("p = 0.5, the chance of heads.", "p = 0.5, tura gelme olasılığı."),
        },
        { keys: ["eq"], say: t("= to work it out: p = 0.3125.", "= ile hesapla: p = 0.3125.") },
      ],
      fx991esplus: formulaBinomial(["shift", "sq"]),
      fx82esplus: formulaBinomial(["cube"]),
      fx570ms: formulaBinomial(["shift", "sq"]),
      fx82ms: formulaBinomial(["cube"], true),
    },
    outcome: t("0.3125, or 5⁄16.", "0.3125, yani 5⁄16."),
    done: (s) =>
      (s.screen.s === "distResult" && near(s.screen.value, 0.3125)) ||
      (s.evaluated && near(s.result, 0.3125)),
  },

  // --------------------------------------------------------- equations --
  {
    id: "system",
    topic: "equations",
    title: t("Two equations, two unknowns", "İki bilinmeyenli denklem sistemi"),
    why: t(
      "Solve 2x + y = 5 and x − y = 1 by typing only the coefficients.",
      "2x + y = 5 ve x − y = 1 sistemini yalnızca katsayıları yazarak çöz.",
    ),
    steps: (() => {
      const row1: LessonStep = {
        keys: entries(2, 1, 5),
        say: t("The first equation, 2x + y = 5: 2, 1, 5.", "İlk denklem 2x + y = 5: 2, 1, 5."),
      };
      const row2: LessonStep = {
        keys: entries(1, -1, 1),
        say: t("The second, x − y = 1: 1, (−)1, 1.", "İkinci denklem x − y = 1: 1, (−)1, 1."),
      };
      return {
        fx991ex: [
          {
            keys: ["menu", "neg"],
            say: t(
              "MENU, then the (−) key: on this menu it is A, Equation/Func.",
              "MENU, sonra (−) tuşu: bu menüde A harfi Equation/Func'tur.",
            ),
          },
          {
            keys: ["1", "2"],
            say: t("1 (Simul Equation), 2 unknowns.", "1 (Simul Equation), 2 bilinmeyen."),
          },
          row1,
          row2,
          { keys: ["eq"], say: t("= to solve: x = 2.", "= ile çöz: x = 2.") },
          { keys: ["down"], say: t("▼ for the next one: y = 1.", "▼ ile sıradaki: y = 1.") },
        ],
        fx991esplus: [
          {
            keys: ["mode", "5", "1"],
            say: t("MODE 5 (EQN), 1: anX + bnY = cn.", "MODE 5 (EQN), ardından 1: anX + bnY = cn."),
          },
          row1,
          row2,
          { keys: ["eq"], say: t("= to solve: X = 2.", "= ile çöz: X = 2.") },
          {
            keys: ["eq"],
            say: t("= again for the next one: Y = 1.", "Tekrar = ile sıradaki: Y = 1."),
          },
        ],
        fx570ms: [
          {
            keys: ["mode", "mode", "mode", "1"],
            say: t("MODE three times, 1 (EQN).", "MODE üç kez, 1 (EQN)."),
          },
          { keys: ["2"], say: t("Unknowns? 2.", "Unknowns? sorusuna 2.") },
          {
            ...row1,
            say: t("It asks a1?, b1?, c1?: 2, 1, 5.", "a1?, b1?, c1? sorularına: 2, 1, 5."),
          },
          {
            ...row2,
            say: t(
              "Then a2, b2, c2: 1, (−)1, 1. With the last one, x = 2 appears at once.",
              "Sonra a2, b2, c2: 1, (−)1, 1. Son katsayıyla birlikte x = 2 hemen görünür.",
            ),
          },
          { keys: ["down"], say: t("▼ for the next one: y = 1.", "▼ ile sıradaki: y = 1.") },
        ],
      };
    })(),
    outcome: t("x = 2 and y = 1.", "x = 2 ve y = 1."),
    done: (s) =>
      s.screen.s === "eqnResult" &&
      s.screen.index === 1 &&
      Array.isArray(s.screen.roots) &&
      near(s.screen.roots[0]?.re, 2) &&
      near(s.screen.roots[1]?.re, 1),
  },
  {
    id: "quadratic",
    topic: "equations",
    title: t("A quadratic equation", "İkinci dereceden denklem"),
    why: t("Find both roots of x² − 5x + 6 = 0.", "x² − 5x + 6 = 0 denkleminin iki kökünü bul."),
    steps: (() => {
      const coefs: LessonStep = {
        keys: entries(1, -5, 6),
        say: t("a, b, c: 1, (−)5, 6.", "a, b, c: 1, (−)5, 6."),
      };
      return {
        fx991ex: [
          {
            keys: ["menu", "neg"],
            say: t("MENU, (−) (A, Equation/Func).", "MENU, sonra (−) tuşu (A, Equation/Func)."),
          },
          { keys: ["2", "2"], say: t("2 (Polynomial), degree 2.", "2 (Polynomial), 2. derece.") },
          coefs,
          { keys: ["eq"], say: t("= to solve: x1 = 3.", "= ile çöz: x1 = 3.") },
          { keys: ["down"], say: t("▼: x2 = 2.", "▼: x2 = 2.") },
        ],
        fx991esplus: [
          {
            keys: ["mode", "5", "3"],
            say: t(
              "MODE 5 (EQN), 3: aX² + bX + c = 0.",
              "MODE 5 (EQN), ardından 3: aX² + bX + c = 0.",
            ),
          },
          coefs,
          { keys: ["eq"], say: t("= to solve: X1 = 3.", "= ile çöz: X1 = 3.") },
          { keys: ["eq"], say: t("= again: X2 = 2.", "Tekrar =: X2 = 2.") },
        ],
        fx570ms: [
          {
            keys: ["mode", "mode", "mode", "1"],
            say: t("MODE three times, 1 (EQN).", "MODE üç kez, 1 (EQN)."),
          },
          {
            keys: ["right", "2"],
            say: t(
              "▶ turns Unknowns? into Degree?; 2 for a quadratic.",
              "▶ ile Unknowns? ekranı Degree? olur; ikinci derece için 2.",
            ),
          },
          {
            ...coefs,
            say: t(
              "a?, b?, c?: 1, (−)5, 6. The first root appears: x1 = 3.",
              "a?, b?, c? sorularına: 1, (−)5, 6. İlk kök görünür: x1 = 3.",
            ),
          },
          { keys: ["down"], say: t("▼: x2 = 2.", "▼: x2 = 2.") },
        ],
      };
    })(),
    outcome: t("The roots are 3 and 2.", "Kökler 3 ve 2."),
    done: (s) =>
      s.screen.s === "eqnResult" &&
      s.screen.index === 1 &&
      Array.isArray(s.screen.roots) &&
      near(s.screen.roots[0]?.re, 3) &&
      near(s.screen.roots[1]?.re, 2),
  },
  {
    id: "solve",
    topic: "equations",
    title: t("SOLVE any equation", "SOLVE ile herhangi bir denklem"),
    why: t(
      "SOLVE finds an x for an equation you just type, from a starting guess.",
      "SOLVE, yazdığın denklemin x değerini bir başlangıç tahmininden bulur.",
    ),
    steps: (() => {
      const typeX: KeyId[] = ["alpha", "rp", "sq", "minus", "2"];
      const typeSay = t(
        "Type X² − 2 (X is ALPHA )). With no = in it, the calculator solves X² − 2 = 0.",
        "X² − 2 yaz (X, ALPHA ) ile yazılır). İçinde = yoksa hesap makinesi X² − 2 = 0'ı çözer.",
      );
      const solveSay = t(
        "SHIFT CALC (SOLVE) asks for a starting value.",
        "SHIFT CALC (SOLVE) bir başlangıç değeri sorar.",
      );
      const result = t(
        "x = 1.414213562, which is √2. L−R = 0 says both sides agree.",
        "x = 1.414213562, yani √2. L−R = 0 iki tarafın eşit olduğunu söyler.",
      );
      return {
        fx991ex: [
          {
            keys: ["x", "sq", "minus", "2"],
            say: t(
              "Type x² − 2 with the x key. With no = in it, the calculator solves x² − 2 = 0.",
              "x tuşuyla x² − 2 yaz. İçinde = yoksa hesap makinesi x² − 2 = 0'ı çözer.",
            ),
          },
          { keys: ["shift", "calc"], say: solveSay },
          { keys: ["1", "eq"], say: t(`1, then =. ${result.en}`, `1 yaz, sonra =. ${result.tr}`) },
        ],
        fx991esplus: [
          { keys: typeX, say: typeSay },
          { keys: ["shift", "calc"], say: solveSay },
          { keys: ["1", "eq"], say: t(`1, then =. ${result.en}`, `1 yaz, sonra =. ${result.tr}`) },
        ],
        fx570ms: [
          { keys: typeX, say: typeSay },
          {
            keys: ["shift", "calc"],
            say: t("SHIFT CALC (SOLVE): it asks X?.", "SHIFT CALC (SOLVE): X? diye sorar."),
          },
          {
            keys: ["1", "eq"],
            say: t("1, then =: the starting value.", "1 yaz, sonra =: başlangıç değeri."),
          },
          {
            keys: ["shift", "calc"],
            say: t(
              `SHIFT CALC once more to solve. ${result.en}`,
              `Çözmek için SHIFT CALC'a bir kez daha bas. ${result.tr}`,
            ),
          },
        ],
      };
    })(),
    outcome: t("x = 1.414213562.", "x = 1.414213562."),
    done: (s) => s.screen.s === "solveResult" && near(s.screen.x, Math.SQRT2),
  },

  // ---------------------------------------------------------- calculus --
  {
    id: "integral",
    topic: "calculus",
    title: t("A definite integral", "Belirli integral"),
    why: t("Work out ∫ from 0 to 2 of x² dx.", "0'dan 2'ye x² dx integralini hesapla."),
    steps: {
      fx991ex: [
        {
          keys: ["integral", "x", "sq", "right", "0", "right", "2"],
          say: t(
            "∫ opens a template. Type x², then ▶ to the lower limit (0) and ▶ to the upper (2).",
            "∫ bir şablon açar. x² yaz, ▶ ile alt sınıra (0), ▶ ile üst sınıra (2) geç.",
          ),
        },
        { keys: ["eq"], say: t("=: 8⁄3, which is 2.666666667.", "=: 8⁄3, yani 2.666666667.") },
      ],
      fx991esplus: [
        {
          keys: ["integral", "alpha", "rp", "sq", "right", "0", "right", "2"],
          say: t(
            "∫ opens a template. Type X² (ALPHA ) for X), then ▶ to the lower limit (0) and ▶ to the upper (2).",
            "∫ bir şablon açar. X² yaz (X için ALPHA )), ▶ ile alt sınıra (0), ▶ ile üst sınıra (2) geç.",
          ),
        },
        { keys: ["eq"], say: t("=: 8⁄3, which is 2.666666667.", "=: 8⁄3, yani 2.666666667.") },
      ],
      fx570ms: [
        {
          keys: ["integral", "alpha", "rp", "sq", "comma", "0", "comma", "2", "rp"],
          say: t(
            "∫dx, then X², the lower limit and the upper limit separated by the , key: ∫(X², 0, 2).",
            "∫dx, sonra X², alt ve üst sınır , tuşuyla ayrılır: ∫(X², 0, 2).",
          ),
        },
        { keys: ["eq"], say: t("=: 2.666666667.", "=: 2.666666667.") },
      ],
    },
    outcome: t("8⁄3 ≈ 2.666666667.", "8⁄3 ≈ 2.666666667."),
    done: (s) => s.evaluated && near(s.result, 8 / 3),
  },
  {
    id: "derivative",
    topic: "calculus",
    title: t("A derivative at a point", "Bir noktadaki türev"),
    why: t("The slope of x³ at x = 2.", "x³ fonksiyonunun x = 2'deki eğimi."),
    steps: {
      fx991ex: [
        {
          keys: ["shift", "integral", "x", "shift", "sq", "right", "2"],
          say: t(
            "SHIFT ∫ (d/dx). Type x³ (SHIFT x²), then ▶ to the point: 2.",
            "SHIFT ∫ (d/dx). x³ yaz (SHIFT x²), sonra ▶ ile noktaya geç: 2.",
          ),
        },
        {
          keys: ["eq"],
          say: t("=: 12, since 3x² at 2 is 12.", "=: 12, çünkü 3x²'nin 2'deki değeri 12."),
        },
      ],
      fx991esplus: [
        {
          keys: ["shift", "integral", "alpha", "rp", "shift", "sq", "right", "2"],
          say: t(
            "SHIFT ∫ (d/dx). Type X³ (ALPHA ), SHIFT x²), then ▶ to the point: 2.",
            "SHIFT ∫ (d/dx). X³ yaz (ALPHA ), SHIFT x²), sonra ▶ ile noktaya geç: 2.",
          ),
        },
        {
          keys: ["eq"],
          say: t("=: 12, since 3x² at 2 is 12.", "=: 12, çünkü 3x²'nin 2'deki değeri 12."),
        },
      ],
      fx570ms: [
        {
          keys: ["shift", "integral", "alpha", "rp", "shift", "sq", "comma", "2", "rp"],
          say: t(
            "SHIFT ∫dx (d/dx), X³, the , key, 2: d/dx(X³, 2).",
            "SHIFT ∫dx (d/dx), X³, , tuşu, 2: d/dx(X³, 2).",
          ),
        },
        { keys: ["eq"], say: t("=: 12.", "=: 12.") },
      ],
    },
    outcome: t("The slope is 12.", "Eğim 12."),
    done: (s) => s.evaluated && near(s.result, 12),
  },

  // ---------------------------------------------------------- matrices --
  {
    id: "determinant",
    topic: "matrices",
    title: t("Define a matrix, find its determinant", "Matris tanımla, determinantını bul"),
    why: t(
      "Every matrix calculation starts the same way: say its size, then fill it in.",
      "Her matris işlemi aynı şekilde başlar: önce boyutunu söyle, sonra içini doldur.",
    ),
    steps: {
      fx991ex: [
        {
          keys: ["menu", "4"],
          say: t(
            "MENU, 4 (Matrix). It asks which matrix to define.",
            "MENU, 4 (Matrix). Hangi matrisi tanımlayacağını sorar.",
          ),
        },
        {
          keys: ["1", "2", "2"],
          say: t("1 (MatA), then 2 rows and 2 columns.", "1 (MatA), sonra 2 satır ve 2 sütun."),
        },
        {
          keys: A_VALUES,
          say: t(
            "Fill it in row by row, = after each: 2, 1, then 1, 3.",
            "Satır satır doldur, her değerden sonra =: önce 2, 1, sonra 1, 3.",
          ),
        },
        ac,
        {
          keys: ["optn", "down", "2"],
          say: t(
            "OPTN, ▼ for the second page, 2 (Determinant).",
            "OPTN, ▼ ile ikinci sayfa, 2 (Determinant).",
          ),
        },
        {
          keys: ["optn", "3", "rp", "eq"],
          say: t(
            "OPTN 3 (MatA), close the bracket, =: 2·3 − 1·1 = 5.",
            "OPTN 3 (MatA), parantezi kapat, =: 2·3 − 1·1 = 5.",
          ),
        },
      ],
      fx991esplus: [
        { keys: ["mode", "6"], say: t("MODE, 6 (MATRIX).", "MODE, ardından 6 (MATRIX).") },
        {
          keys: ["1", "5"],
          say: t("1 (MatA), then its size: 5 is 2×2.", "1 (MatA), sonra boyutu: 5, yani 2×2."),
        },
        {
          keys: A_VALUES,
          say: t(
            "Fill it in row by row, = after each: 2, 1, then 1, 3.",
            "Satır satır doldur, her değerden sonra =: önce 2, 1, sonra 1, 3.",
          ),
        },
        ac,
        {
          keys: ["shift", "4", "7"],
          say: t("SHIFT 4 (MATRIX), 7 (det).", "SHIFT 4 (MATRIX), ardından 7 (det)."),
        },
        {
          keys: ["shift", "4", "3", "rp", "eq"],
          say: t(
            "SHIFT 4, 3 (MatA), close the bracket, =: 2·3 − 1·1 = 5.",
            "SHIFT 4, 3 (MatA), parantezi kapat, =: 2·3 − 1·1 = 5.",
          ),
        },
      ],
      fx570ms: [
        {
          keys: ["mode", "mode", "mode", "2"],
          say: t("MODE three times, 2 (MAT).", "MODE üç kez, 2 (MAT)."),
        },
        {
          keys: ["shift", "4", "1", "1"],
          say: t("SHIFT 4 (MAT), 1 (Dim), 1 (A).", "SHIFT 4 (MAT), 1 (Dim), ardından 1 (A)."),
        },
        { keys: entries(2, 2), say: t("Its size: m? 2 =, n? 2 =.", "Boyutu: m? 2 =, n? 2 =.") },
        {
          keys: A_VALUES,
          say: t(
            "It asks MatA11, MatA12, … in turn: 2, 1, 1, 3.",
            "Sırayla MatA11, MatA12, … diye sorar: 2, 1, 1, 3.",
          ),
        },
        ac,
        {
          keys: ["shift", "4", "right", "1"],
          say: t(
            "SHIFT 4, ▶ for the second page, 1 (Det).",
            "SHIFT 4, ▶ ile ikinci sayfa, 1 (Det).",
          ),
        },
        {
          keys: ["shift", "4", "3", "1", "eq"],
          say: t("SHIFT 4, 3 (Mat), 1 (A), =: 5.", "SHIFT 4, 3 (Mat), 1 (A), = ile sonuç: 5."),
        },
      ],
    },
    outcome: t("det(A) = 5.", "det(A) = 5."),
    done: (s) => s.evaluated && near(s.result, 5),
  },
  {
    id: "inverse",
    topic: "matrices",
    title: t("The inverse of a matrix", "Ters matris"),
    why: t(
      "The inverse is the x⁻¹ key, the same one as for 1⁄x. Not ^(−1), and not the minus key.",
      "Ters matris için x⁻¹ tuşu kullanılır, 1⁄x için kullandığın tuşun aynısı. ^(−1) yazılmaz, eksi tuşu da kullanılmaz.",
    ),
    steps: {
      fx991ex: [
        {
          keys: ["menu", "4", "1", "2", "2"],
          say: t("Matrix mode: MatA, 2 rows, 2 columns.", "Matris modu: MatA, 2 satır, 2 sütun."),
        },
        { keys: A_VALUES, say: t("2, 1, then 1, 3.", "2, 1, sonra 1, 3.") },
        ac,
        {
          keys: ["optn", "3", "inv", "eq"],
          say: t(
            "OPTN 3 (MatA), x⁻¹, =. The inverse is shown in fractions: 3⁄5, −1⁄5 over −1⁄5, 2⁄5.",
            "OPTN 3 (MatA), x⁻¹, =. Ters matris kesirlerle görünür: üstte 3⁄5, −1⁄5; altta −1⁄5, 2⁄5.",
          ),
        },
      ],
      fx991esplus: [
        {
          keys: ["mode", "6", "1", "5"],
          say: t("MATRIX mode: MatA, 2×2.", "MATRIX modu: MatA, 2×2."),
        },
        { keys: A_VALUES, say: t("2, 1, then 1, 3.", "2, 1, sonra 1, 3.") },
        ac,
        {
          keys: ["shift", "4", "3", "inv", "eq"],
          say: t(
            "SHIFT 4, 3 (MatA), x⁻¹, =. The inverse is shown in fractions: 3⁄5, −1⁄5 over −1⁄5, 2⁄5.",
            "SHIFT 4, 3 (MatA), x⁻¹, =. Ters matris kesirlerle görünür: üstte 3⁄5, −1⁄5; altta −1⁄5, 2⁄5.",
          ),
        },
      ],
      fx570ms: [
        {
          keys: ["mode", "mode", "mode", "2"],
          say: t("MAT mode: MODE three times, 2.", "MAT modu: MODE üç kez, 2."),
        },
        {
          keys: ["shift", "4", "1", "1", ...entries(2, 2)],
          say: t("SHIFT 4, 1 (Dim), 1 (A), 2 =, 2 =.", "SHIFT 4, 1 (Dim), 1 (A), boyut 2 =, 2 =."),
        },
        { keys: A_VALUES, say: t("2, 1, 1, 3.", "2, 1, 1, 3.") },
        ac,
        {
          keys: ["shift", "4", "3", "1", "inv", "eq"],
          say: t(
            "SHIFT 4, 3 (Mat), 1 (A), x⁻¹, =: the inverse, 0.6, −0.2 over −0.2, 0.4.",
            "SHIFT 4, 3 (Mat), 1 (A), x⁻¹, =: ters matris; üstte 0.6, −0.2; altta −0.2, 0.4.",
          ),
        },
      ],
    },
    outcome: t("A⁻¹ is on the screen.", "Ekranda A⁻¹ var."),
    done: (s) =>
      s.evaluated &&
      sameMatrix(s.result, [
        [0.6, -0.2],
        [-0.2, 0.4],
      ]),
  },
  {
    id: "product",
    topic: "matrices",
    title: t("Multiplying two matrices", "İki matrisi çarpmak"),
    why: t(
      "Define both matrices first, then multiply. Order matters: A×B is not B×A.",
      "Önce iki matrisi de tanımla, sonra çarp. Sıra önemli: A×B ile B×A aynı değildir.",
    ),
    steps: {
      fx991ex: [
        {
          keys: ["menu", "4", "1", "2", "2"],
          say: t("Matrix mode: MatA, 2 × 2.", "Matris modu: MatA, 2 × 2."),
        },
        { keys: A_VALUES, say: t("A: 2, 1, then 1, 3.", "A: 2, 1, sonra 1, 3.") },
        {
          keys: ["optn", "1", "2", "2", "2"],
          say: t(
            "OPTN, 1 (Define Matrix), 2 (MatB), 2 rows, 2 columns.",
            "OPTN, 1 (Define Matrix), 2 (MatB), 2 satır, 2 sütun.",
          ),
        },
        { keys: B_VALUES, say: t("B: 1, 2, then 0, 1.", "B: 1, 2, sonra 0, 1.") },
        ac,
        {
          keys: ["optn", "3", "times", "optn", "4", "eq"],
          say: t("MatA × MatB =: the rows 2, 5 and 1, 5.", "MatA × MatB =: satırlar 2, 5 ve 1, 5."),
        },
      ],
      fx991esplus: [
        {
          keys: ["mode", "6", "1", "5"],
          say: t("MATRIX mode: MatA, 2×2.", "MATRIX modu: MatA, 2×2."),
        },
        { keys: A_VALUES, say: t("A: 2, 1, then 1, 3.", "A: 2, 1, sonra 1, 3.") },
        {
          keys: ["shift", "4", "1", "2", "5"],
          say: t(
            "SHIFT 4, 1 (Dim), 2 (MatB), 5 (2×2).",
            "SHIFT 4, 1 (Dim), 2 (MatB), boyut olarak 5 (2×2).",
          ),
        },
        { keys: B_VALUES, say: t("B: 1, 2, then 0, 1.", "B: 1, 2, sonra 0, 1.") },
        ac,
        {
          keys: ["shift", "4", "3", "times", "shift", "4", "4", "eq"],
          say: t("MatA × MatB =: the rows 2, 5 and 1, 5.", "MatA × MatB =: satırlar 2, 5 ve 1, 5."),
        },
      ],
      fx570ms: [
        {
          keys: ["mode", "mode", "mode", "2"],
          say: t("MAT mode: MODE three times, 2.", "MAT modu: MODE üç kez, 2."),
        },
        {
          keys: ["shift", "4", "1", "1", ...entries(2, 2)],
          say: t(
            "A: SHIFT 4, 1 (Dim), 1 (A), 2 =, 2 =.",
            "A matrisi: SHIFT 4, 1 (Dim), 1 (A), 2 =, 2 =.",
          ),
        },
        { keys: A_VALUES, say: t("2, 1, 1, 3.", "2, 1, 1, 3.") },
        {
          keys: ["shift", "4", "1", "2", ...entries(2, 2)],
          say: t(
            "B: SHIFT 4, 1 (Dim), 2 (B), 2 =, 2 =.",
            "B matrisi: SHIFT 4, 1 (Dim), 2 (B), 2 =, 2 =.",
          ),
        },
        { keys: B_VALUES, say: t("1, 2, 0, 1.", "1, 2, 0, 1.") },
        ac,
        {
          keys: ["shift", "4", "3", "1", "times", "shift", "4", "3", "2", "eq"],
          say: t("MatA × MatB =: the rows 2, 5 and 1, 5.", "MatA × MatB =: satırlar 2, 5 ve 1, 5."),
        },
      ],
    },
    outcome: t("A × B is on the screen.", "Ekranda A × B var."),
    done: (s) =>
      s.evaluated &&
      sameMatrix(s.result, [
        [2, 5],
        [1, 5],
      ]),
  },
];

// ------------------------------------------------------------ fx-82MS --

/**
 * The fx-82MS takes the fx-570MS's keys wherever the two are the same, which
 * is everywhere these lessons go but the MODE menu: on the 82MS its first page
 * is COMP, SD, REG (MODE 2, MODE 3), and Deg/Rad/Gra is the second (MODE
 * MODE), not the fourth. Each entry rewrites only the steps that differ.
 * Lessons the 82MS cannot do (no EQN, no matrices, no ∫, d/dx, SOLVE or
 * DISTR) are not here, so they are offered as not on this model.
 */
const SD_82: LessonStep = {
  keys: ["mode", "2"],
  say: t(
    "MODE, 2 (SD): one list of numbers. SD appears at the top. If old data is left, clear it first with SHIFT MODE (CLR) 1 =.",
    "MODE, 2 (SD): tek değişkenli veri. Üstte SD yazar. Eski veri kaldıysa önce SHIFT MODE (CLR) 1 = ile temizle.",
  ),
};
const MS_82: Record<string, (ms: LessonStep[]) => LessonStep[]> = {
  fraction: (ms) => ms,
  memory: (ms) => ms,
  angle: ([sinDeg, , sinRad]) => [
    sinDeg!,
    {
      keys: ["mode", "mode", "2"],
      say: t(
        "Press MODE twice to reach Deg, Rad, Gra, then 2 (Rad). The D at the top turns into R.",
        "MODE'a iki kez bas: Deg, Rad, Gra ekranı gelir. 2 (Rad). Üstteki D, R olur.",
      ),
    },
    sinRad!,
    {
      keys: ["mode", "mode", "1"],
      say: t("Back to degrees: MODE twice, 1 (Deg).", "Dereceye dön: MODE iki kez, 1 (Deg)."),
    },
  ],
  mean: ([, ...rest]) => [SD_82, ...rest],
  variance: ([, ...rest]) => [
    { keys: ["mode", "2"], say: t("SD mode: MODE, 2.", "SD modu: MODE, 2.") },
    ...rest,
  ],
  regression: ([, ...rest]) => [
    {
      keys: ["mode", "3", "1"],
      say: t(
        "MODE, 3 (REG), 1 (Lin): the straight line.",
        "MODE, 3 (REG), 1 (Lin): doğrusal regresyon.",
      ),
    },
    ...rest,
  ],
};
for (const lesson of LESSONS) {
  const ms = lesson.steps.fx570ms;
  const make = MS_82[lesson.id];
  if (ms && make) lesson.steps.fx82ms = make(ms);
}

// ----------------------------------------------------------- fx-991CW --

/**
 * The fx-991CW, from Casio's User's Guide and its UK Interactive Manual. It
 * has no numbered menus: HOME is a grid of apps, three to a row, and every
 * menu is walked with ▲ ▼ and OK, so the arrow counts below are the
 * positions those manuals show. EXE is its =.
 */
const homeTo = (app: string, keys: KeyId[]): LessonStep => ({
  keys: ["home", ...keys, "ok"],
  say: t(
    `HOME shows the apps, three to a row. Move to ${app} with the arrows and press OK.`,
    `HOME uygulamaları gösterir, her satırda üç tane. Oklarla ${app} simgesine git ve OK'a bas.`,
  ),
});
/** Numbers each followed by EXE; a minus is SHIFT − on the CW. */
const exe = (...values: number[]): KeyId[] =>
  values.flatMap((v) => [
    ...String(v)
      .split("")
      .flatMap((c): KeyId[] =>
        c === "-" ? ["shift", "minus"] : c === "." ? ["dot"] : [c as KeyId],
      ),
    "eq" as KeyId,
  ]);
const CW: Record<string, LessonStep[]> = {
  order: [
    { keys: ["2", "plus", "3", "times", "4"], say: t("Type 2 + 3 × 4.", "2 + 3 × 4 yaz.") },
    {
      keys: ["eq"],
      say: t(
        "EXE, the CW's =. It says 14, not 20: 3 × 4 is worked out before the addition.",
        "EXE, CW'nin = tuşu. Sonuç 20 değil 14: önce 3 × 4 hesaplanır.",
      ),
    },
    {
      keys: ["divide", "2", "eq"],
      say: t(
        "With an answer on screen, start with ÷: the calculator puts Ans in front. Ans ÷ 2 = 7.",
        "Sonuç ekrandayken doğrudan ÷ ile başla; başa Ans kendiliğinden gelir. Ans ÷ 2 = 7.",
      ),
    },
  ],
  negative: [
    {
      keys: ["shift", "minus", "3", "sq"],
      say: t(
        "The CW's (−) is SHIFT −, printed above the minus key. Type (−) 3 ■².",
        "CW'de (−), eksi tuşunun üstünde yazan SHIFT −'dir. (−) 3 ■² yaz.",
      ),
    },
    {
      keys: ["eq"],
      say: t(
        "EXE: −9. The calculator squares 3 first and puts the minus on afterwards.",
        "EXE: −9. Hesap makinesi önce 3'ün karesini alır, eksiyi sonra ekler.",
      ),
    },
    {
      keys: ["lp", "shift", "minus", "3", "rp", "sq", "eq"],
      say: t(
        "To square a negative number, bracket it: ((−)3)² = 9.",
        "Negatif bir sayının karesi için onu paranteze al: ((−)3)² = 9.",
      ),
    },
  ],
  fraction: [
    {
      keys: ["1", "divide", "3", "eq"],
      say: t(
        "1 ÷ 3 EXE. The answer is the fraction 1⁄3.",
        "1 ÷ 3 EXE. Sonuç 1⁄3 kesri olarak görünür.",
      ),
    },
    {
      keys: ["format", "down", "ok"],
      say: t(
        "FORMAT, ▼ to Decimal, OK: 0.3333333333. FORMAT, Standard brings the fraction back.",
        "FORMAT, ▼ ile Decimal, OK: 0.3333333333. FORMAT, Standard kesre geri döndürür.",
      ),
    },
  ],
  angle: [
    {
      keys: ["sin", "3", "0", "rp", "eq"],
      say: t(
        "sin(30) = 0.5, in degrees (D at the top).",
        "sin(30) = 0.5: derece modundasın (üstte D).",
      ),
    },
    {
      keys: ["settings", "ok", "down", "ok", "down", "ok", "ac"],
      say: t(
        "SETTINGS, OK (Calc Settings), ▼ to Angle Unit, OK, ▼ to Radian, OK. AC to leave. The D at the top turns into R.",
        "SETTINGS, OK (Calc Settings), ▼ ile Angle Unit, OK, ▼ ile Radian, OK. AC ile çık. Üstteki D, R olur.",
      ),
    },
    {
      keys: ["sin", "3", "0", "rp", "eq"],
      say: t(
        "The same keys now give −0.9880316241: 30 is read as 30 radians. This is the most common exam mistake.",
        "Aynı tuşlar şimdi −0.9880316241 veriyor, çünkü 30 artık radyan. Sınavda en sık yapılan hata bu.",
      ),
    },
    {
      keys: ["settings", "ok", "down", "ok", "up", "ok", "ac"],
      say: t(
        "Back to degrees: SETTINGS, OK, ▼ Angle Unit, OK. The list opens on Radian, so ▲ to Degree, OK, AC.",
        "Dereceye dön: SETTINGS, OK, ▼ Angle Unit, OK. Liste Radian'da açılır; ▲ ile Degree, OK, AC.",
      ),
    },
  ],
  mean: [
    homeTo("Statistics", ["right"]),
    {
      keys: ["ok"],
      say: t(
        "1-Variable is highlighted: OK. The data table opens.",
        "1-Variable seçili: OK. Veri tablosu açılır.",
      ),
    },
    {
      keys: exe(2, 4, 4, 4),
      say: t(
        "Type each value and press EXE: 2, 4, 4, 4.",
        "Her değeri yaz ve EXE'ye bas: 2, 4, 4, 4.",
      ),
    },
    { keys: exe(5, 5, 7, 9), say: t("Then 5, 5, 7, 9.", "Sonra 5, 5, 7, 9.") },
    {
      keys: ["ok", "ok"],
      say: t(
        "OK opens a menu; 1-Var Results is first, so OK again. x̄ = 5 is the mean, σx = 2 and sx = 2.138089935 are the two standard deviations.",
        "OK bir menü açar; ilk satır 1-Var Results, tekrar OK. x̄ = 5 ortalama, σx = 2 ve sx = 2.138089935 iki standart sapma.",
      ),
    },
  ],
  variance: [
    homeTo("Statistics", ["right"]),
    { keys: ["ok"], say: t("OK for 1-Variable.", "1-Variable için OK.") },
    {
      keys: exe(3, 5, 7, 9),
      say: t("Enter 3, 5, 7, 9, each with EXE.", "3, 5, 7, 9 değerlerini EXE ile gir."),
    },
    {
      keys: ["ok", "ok"],
      say: t(
        'OK, OK (1-Var Results). σ²x = 5 is the population variance; s²x = 6.666666667 is the sample variance. When a question says "sample", use s².',
        'OK, OK (1-Var Results). σ²x = 5 kitle varyansı, s²x = 6.666666667 örneklem varyansı. Soruda "örneklem" geçiyorsa s² kullanılır.',
      ),
    },
  ],
  regression: [
    homeTo("Statistics", ["right"]),
    {
      keys: ["down", "ok"],
      say: t(
        "▼ to 2-Variable, OK: an x and a y column.",
        "▼ ile 2-Variable, OK: x ve y sütunları.",
      ),
    },
    {
      keys: exe(...REG_X),
      say: t("The x column first: 1, 2, 3, 4, 5.", "Önce x sütunu: 1, 2, 3, 4, 5."),
    },
    {
      keys: [...UP_FIVE, "right"],
      say: t(
        "Press ▲ five times to return to the first row, then ▶ to the y column.",
        "▲ tuşuna beş kez basarak ilk satıra dön, sonra ▶ ile y sütununa geç.",
      ),
    },
    { keys: exe(...REG_Y), say: t("Then y: 2, 4, 5, 4, 5.", "Sonra y: 2, 4, 5, 4, 5.") },
    {
      keys: ["ok", "down", "ok"],
      say: t("OK, ▼ to Reg Results, OK.", "OK, ▼ ile Reg Results, OK."),
    },
    {
      keys: ["ok"],
      say: t(
        "y=a+bx is first: OK. a = 2.2, b = 0.6, so y = 2.2 + 0.6x; r = 0.7745966692.",
        "İlk satır y=a+bx: OK. a = 2.2, b = 0.6, yani y = 2.2 + 0.6x; r = 0.7745966692.",
      ),
    },
  ],
  normal: [
    homeTo("Distribution", ["right", "right"]),
    {
      keys: ["down", "down", "down", "ok"],
      say: t(
        "▼ three times to Normal CD, the probability of a range. OK.",
        "▼ ile üç kez aşağı, Normal CD: bir aralığın olasılığı. OK.",
      ),
    },
    {
      keys: exe(160, 180),
      say: t(
        "Lower = 160, Upper = 180, each with EXE.",
        "Alt sınır 160, üst sınır 180; her biri EXE ile.",
      ),
    },
    {
      keys: exe(170, 10),
      say: t(
        "μ = 170, then σ = 10. The CW asks for μ first, unlike the EX.",
        "μ = 170, sonra σ = 10. CW, EX'in tersine önce μ'yü sorar.",
      ),
    },
    {
      keys: ["ok"],
      say: t(
        "Execute is highlighted: OK. p = 0.6826894921, about 68% within one standard deviation.",
        "Execute seçili: OK. p = 0.6826894921; yaklaşık %68'i bir standart sapma içinde.",
      ),
    },
  ],
  binomial: [
    homeTo("Distribution", ["right", "right"]),
    {
      keys: ["ok"],
      say: t(
        "Binomial PD is first: OK. Exactly x successes.",
        "İlk satır Binomial PD: OK. Tam olarak x başarı.",
      ),
    },
    {
      keys: ["down", "ok"],
      say: t("▼ to Variable (one value of x), OK.", "▼ ile Variable (tek bir x değeri), OK."),
    },
    { keys: exe(2, 5), say: t("x = 2 successes, N = 5 trials.", "x = 2 başarı, N = 5 deneme.") },
    { keys: exe(0.5), say: t("p = 0.5, the chance of heads.", "p = 0.5, tura gelme olasılığı.") },
    { keys: ["ok"], say: t("Execute: OK. p = 0.3125.", "Execute: OK. p = 0.3125.") },
  ],
  system: [
    homeTo("Equation", ["down", "right", "right"]),
    {
      keys: ["ok", "ok"],
      say: t(
        "Simul Equation is first: OK; then 2 Unknowns, OK.",
        "İlk satır Simul Equation: OK; ardından 2 Unknowns, OK.",
      ),
    },
    {
      keys: exe(2, 1, 5),
      say: t("The first equation, 2x + y = 5: 2, 1, 5.", "İlk denklem 2x + y = 5: 2, 1, 5."),
    },
    {
      keys: exe(1, -1, 1),
      say: t(
        "The second, x − y = 1: 1, (−)1, 1. (−) is SHIFT −.",
        "İkinci denklem x − y = 1: 1, (−)1, 1. (−) SHIFT −'dir.",
      ),
    },
    { keys: ["eq"], say: t("EXE to solve: x = 2.", "EXE ile çöz: x = 2.") },
    { keys: ["down"], say: t("▼ for the next one: y = 1.", "▼ ile sıradaki: y = 1.") },
  ],
  quadratic: [
    homeTo("Equation", ["down", "right", "right"]),
    {
      keys: ["down", "ok", "ok"],
      say: t("▼ to Polynomial, OK; ax²+bx+c, OK.", "▼ ile Polynomial, OK; ax²+bx+c, OK."),
    },
    { keys: exe(1, -5, 6), say: t("a, b, c: 1, (−)5, 6.", "a, b, c: 1, (−)5, 6.") },
    { keys: ["eq"], say: t("EXE to solve: x₁ = 3.", "EXE ile çöz: x₁ = 3.") },
    { keys: ["down"], say: t("▼: x₂ = 2.", "▼: x₂ = 2.") },
  ],
  integral: [
    {
      keys: ["catalog", "ok", "down", "ok"],
      say: t(
        "There is no ∫ key: CATALOG, OK (Func Analysis), ▼ to Integration(∫), OK.",
        "∫ tuşu yok: CATALOG, OK (Func Analysis), ▼ ile Integration(∫), OK.",
      ),
    },
    {
      keys: ["x", "sq", "down", "0", "up", "2"],
      say: t(
        "Type x², ▼ to the lower limit, 0, ▲ to the upper limit, 2.",
        "x² yaz, ▼ ile alt sınıra in, 0; ▲ ile üst sınıra çık, 2.",
      ),
    },
    { keys: ["eq"], say: t("EXE: 8⁄3, which is 2.666666667.", "EXE: 8⁄3, yani 2.666666667.") },
  ],
  derivative: [
    {
      keys: ["catalog", "ok", "ok"],
      say: t(
        "CATALOG, OK (Func Analysis), OK (Derivative(d/dx)): the first item.",
        "CATALOG, OK (Func Analysis), OK (Derivative(d/dx)): ilk satır.",
      ),
    },
    {
      keys: ["x", "pow", "3", "right", "right", "2"],
      say: t(
        "x ^ 3, then ▶ out of the exponent and ▶ to the x= box, 2.",
        "x ^ 3, sonra ▶ ile üsten çık ve ▶ ile x= kutusuna geç, 2.",
      ),
    },
    { keys: ["eq"], say: t("EXE: 12.", "EXE: 12.") },
  ],
};
for (const lesson of LESSONS) {
  const steps = CW[lesson.id];
  if (steps) lesson.steps.fx991cw = steps;
}

/**
 * Lessons a model can do on the real device but that this simulator does not
 * run yet: the CW's matrices and Solver, whose menus Casio's guides do not
 * show in full, and its variables. These say "not here yet", not "cannot".
 */
const LATER: Partial<Record<ModelId, string[]>> = {
  fx991cw: ["memory", "solve", "determinant", "inverse", "product"],
};
export const later = (lesson: Lesson, model: ModelId): boolean =>
  !!LATER[model]?.includes(lesson.id);

export const TOPIC_TITLE: Record<LessonTopic, Text> = {
  basics: t("Basics", "Temeller"),
  statistics: t("Statistics", "İstatistik"),
  probability: t("Probability", "Olasılık"),
  equations: t("Equations", "Denklemler"),
  calculus: t("Calculus", "Analiz"),
  matrices: t("Matrices", "Matrisler"),
};

export const TOPICS: LessonTopic[] = [
  "basics",
  "statistics",
  "probability",
  "equations",
  "calculus",
  "matrices",
];

/** Whether this model can do the lesson at all. */
export const offered = (lesson: Lesson, model: ModelId): boolean => !!lesson.steps[model]?.length;
