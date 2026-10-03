/**
 * The frozen vocabulary of the Embedding Universe.
 *
 * FROZEN at v1 on 2026-09-06. `VOCABULARY_CHECKSUM` pins the exact id list and
 * `engine.test.ts` recomputes it, so a later change to this file fails the
 * suite rather than silently altering the geometry the lab teaches. Anything
 * that would change the map — adding a word, removing one, reordering — is a
 * deliberate re-freeze with a new checksum, never a drive-by edit.
 *
 * HOW THESE WORDS WERE CHOSEN
 *
 * The trap this lab is most exposed to is curating a vocabulary that *looks*
 * like it proves something. Pick thirty words from each of eight tidy
 * categories and any projection will show eight tidy blobs, and the student
 * will learn "embeddings are categories" — which is a fact about the word list,
 * not about embeddings. Five rules push against that:
 *
 *   1. Bridge words that genuinely belong to two areas (10% of the list), in
 *      both directions of polysemy: `mouse` and `bat` are animals and objects,
 *      and Turkish `dil` is both "tongue" and "language".
 *   2. Near-synonyms and fine structure inside clusters — dog/puppy/hound,
 *      mouse/rat — so a cluster is not a featureless blob.
 *   3. Abstract words that should not cluster cleanly at all.
 *   4. Deliberately unbalanced category sizes (8 to 35). Seeking symmetry is
 *      itself a way of authoring the picture.
 *   5. The list was written and frozen BEFORE any projection was computed or
 *      looked at. No word has ever been added or removed to improve how the
 *      map looks.
 *
 * `category` exists only so gate G7 can check that the projection does *not*
 * separate these labels cleanly. It never reaches the geometry: no vector, no
 * coordinate and no similarity is computed from it.
 *
 * LANGUAGE
 *
 * The embedding space is English-only. `tr` is a translation for the interface,
 * not a second vector — Turkish glosses are never embedded, and three of them
 * legitimately repeat (`saat` = clock and hour, `ay` = moon and month, `dil` =
 * tongue and language) because Turkish is polysemous where English is not.
 */

export type WordCategory =
  | "abstract"
  | "animal"
  | "body"
  | "clothing"
  | "color"
  | "emotion"
  | "food"
  | "household"
  | "music"
  | "nature"
  | "place"
  | "profession"
  | "science"
  | "sport"
  | "technology"
  | "time"
  | "transport";

export interface VocabularyItem {
  /** Stable id, equal to the English label — this is what GloVe was looked up by. */
  readonly id: string;
  readonly en: string;
  /** Turkish gloss for the interface. NOT embedded. */
  readonly tr: string;
  readonly category: WordCategory;
  /** Why this word straddles two areas, when it does. Documentation only. */
  readonly bridge: string | null;
}

const w = (
  en: string,
  tr: string,
  category: WordCategory,
  bridge: string | null,
): VocabularyItem => ({ id: en, en, tr, category, bridge });

/** Sorted by id so the on-disk vector order is reproducible from this file alone. */
export const VOCABULARY: readonly VocabularyItem[] = [
  w("algorithm", "algoritma", "technology", null),
  w("anger", "öfke", "emotion", null),
  w("answer", "cevap", "abstract", null),
  w("ant", "karınca", "animal", null),
  w("apple", "elma", "food", null),
  w("architect", "mimar", "profession", null),
  w("arm", "kol", "body", null),
  w("atom", "atom", "science", null),
  w("baker", "fırıncı", "profession", null),
  w("ball", "top", "sport", null),
  w("banana", "muz", "food", null),
  w("bank", "banka", "place", "money / river bank (EN only)"),
  w("basketball", "basketbol", "sport", null),
  w("bat", "yarasa", "animal", "flying mammal / cricket bat (EN only)"),
  w("bathroom", "banyo", "household", null),
  w("battery", "pil", "technology", null),
  w("beach", "plaj", "nature", null),
  w("bear", "ayı", "animal", null),
  w("bed", "yatak", "household", null),
  w("bee", "arı", "animal", null),
  w("belt", "kemer", "clothing", null),
  w("bicycle", "bisiklet", "transport", null),
  w("biology", "biyoloji", "science", null),
  w("bird", "kuş", "animal", null),
  w("black", "siyah", "color", null),
  w("blood", "kan", "body", null),
  w("blue", "mavi", "color", null),
  w("boat", "tekne", "transport", null),
  w("bone", "kemik", "body", null),
  w("box", "kutu", "household", null),
  w("boxing", "boks", "sport", null),
  w("brain", "beyin", "body", null),
  w("bread", "ekmek", "food", null),
  w("bridge", "köprü", "transport", "structure / card game (EN)"),
  w("brown", "kahverengi", "color", null),
  w("bus", "otobüs", "transport", null),
  w("butter", "tereyağı", "food", null),
  w("butterfly", "kelebek", "animal", null),
  w("button", "düğme", "clothing", "clothing / interface (EN+TR düğme)"),
  w("cable", "kablo", "technology", null),
  w("cake", "pasta", "food", null),
  w("calm", "huzur", "emotion", null),
  w("camera", "kamera", "technology", null),
  w("car", "araba", "transport", null),
  w("carrot", "havuç", "food", null),
  w("cat", "kedi", "animal", null),
  w("cell", "hücre", "science", "biology / prison / spreadsheet (EN)"),
  w("chair", "sandalye", "household", null),
  w("chance", "şans", "abstract", null),
  w("change", "değişim", "abstract", null),
  w("cheese", "peynir", "food", null),
  w("chemistry", "kimya", "science", null),
  w("chess", "satranç", "sport", null),
  w("chicken", "tavuk", "animal", null),
  w("chip", "çip", "technology", "silicon / fried potato (EN)"),
  w("chocolate", "çikolata", "food", null),
  w("choice", "seçim", "abstract", null),
  w("city", "şehir", "place", null),
  w("clock", "saat", "household", "object / TR saat is also 'hour'"),
  w("cloud", "bulut", "nature", null),
  w("coat", "palto", "clothing", null),
  w("code", "kod", "technology", "program / cipher (EN+TR kod)"),
  w("coffee", "kahve", "food", null),
  w("computer", "bilgisayar", "technology", null),
  w("concert", "konser", "music", null),
  w("cook", "aşçı", "profession", null),
  w("country", "ülke", "place", null),
  w("courage", "cesaret", "emotion", null),
  w("cow", "inek", "animal", null),
  w("data", "veri", "technology", null),
  w("database", "veritabanı", "technology", null),
  w("day", "gün", "time", null),
  w("deer", "geyik", "animal", null),
  w("desert", "çöl", "nature", null),
  w("doctor", "doktor", "profession", null),
  w("dog", "köpek", "animal", null),
  w("dolphin", "yunus", "animal", null),
  w("door", "kapı", "household", null),
  w("dress", "elbise", "clothing", null),
  w("driver", "şoför", "profession", null),
  w("drum", "davul", "music", null),
  w("duck", "ördek", "animal", null),
  w("duty", "görev", "abstract", null),
  w("eagle", "kartal", "animal", null),
  w("ear", "kulak", "body", null),
  w("egg", "yumurta", "food", null),
  w("elephant", "fil", "animal", null),
  w("energy", "enerji", "science", null),
  w("engine", "motor", "transport", "vehicle / search engine (EN+TR motor)"),
  w("engineer", "mühendis", "profession", null),
  w("envy", "kıskançlık", "emotion", null),
  w("evening", "akşam", "time", null),
  w("experiment", "deney", "science", null),
  w("eye", "göz", "body", null),
  w("factory", "fabrika", "place", null),
  w("farm", "çiftlik", "place", null),
  w("farmer", "çiftçi", "profession", null),
  w("fear", "korku", "emotion", null),
  w("field", "alan", "place", "farmland / physics field / area of study (EN+TR)"),
  w("file", "dosya", "technology", null),
  w("finger", "parmak", "body", null),
  w("fish", "balık", "animal", null),
  w("flower", "çiçek", "nature", null),
  w("flute", "flüt", "music", null),
  w("fog", "sis", "nature", null),
  w("folder", "klasör", "technology", null),
  w("foot", "ayak", "body", null),
  w("football", "futbol", "sport", null),
  w("forest", "orman", "nature", null),
  w("fork", "çatal", "household", null),
  w("fox", "tilki", "animal", null),
  w("freedom", "özgürlük", "abstract", null),
  w("frog", "kurbağa", "animal", null),
  w("future", "gelecek", "time", null),
  w("garden", "bahçe", "place", null),
  w("garlic", "sarımsak", "food", null),
  w("gene", "gen", "science", null),
  w("glove", "eldiven", "clothing", null),
  w("goal", "gol", "sport", "sport / aim (EN+TR gol-hedef)"),
  w("grape", "üzüm", "food", null),
  w("grass", "çimen", "nature", null),
  w("green", "yeşil", "color", null),
  w("guilt", "suçluluk", "emotion", null),
  w("guitar", "gitar", "music", null),
  w("hair", "saç", "body", null),
  w("hand", "el", "body", null),
  w("hardware", "donanım", "technology", null),
  w("hat", "şapka", "clothing", null),
  w("hate", "nefret", "emotion", null),
  w("head", "baş", "body", null),
  w("heart", "kalp", "body", null),
  w("heat", "ısı", "science", null),
  w("honey", "bal", "food", null),
  w("hope", "umut", "emotion", null),
  w("horse", "at", "animal", null),
  w("hospital", "hastane", "place", null),
  w("hotel", "otel", "place", null),
  w("hound", "tazı", "animal", null),
  w("hour", "saat", "time", null),
  w("idea", "fikir", "abstract", null),
  w("internet", "internet", "technology", null),
  w("island", "ada", "nature", null),
  w("jacket", "ceket", "clothing", null),
  w("joy", "sevinç", "emotion", null),
  w("judge", "hakim", "profession", null),
  w("justice", "adalet", "abstract", null),
  w("key", "anahtar", "household", "lock / cryptography (EN+TR anahtar)"),
  w("keyboard", "klavye", "technology", null),
  w("kitchen", "mutfak", "household", null),
  w("kitten", "yavru kedi", "animal", null),
  w("knife", "bıçak", "household", null),
  w("knowledge", "bilgi", "abstract", null),
  w("lake", "göl", "nature", null),
  w("lamp", "lamba", "household", null),
  w("language", "dil", "abstract", "TR 'dil' is also 'tongue'"),
  w("law", "yasa", "abstract", null),
  w("lawyer", "avukat", "profession", null),
  w("leaf", "yaprak", "nature", null),
  w("leg", "bacak", "body", null),
  w("lemon", "limon", "food", null),
  w("library", "kütüphane", "place", null),
  w("lie", "yalan", "abstract", null),
  w("light", "ışık", "science", "physics / not heavy (EN)"),
  w("lion", "aslan", "animal", null),
  w("love", "sevgi", "emotion", null),
  w("market", "pazar", "place", "place / economy (EN+TR pazar)"),
  w("match", "maç", "sport", "sport fixture / firestick (EN)"),
  w("mathematics", "matematik", "science", null),
  w("meaning", "anlam", "abstract", null),
  w("meat", "et", "food", null),
  w("melody", "melodi", "music", null),
  w("memory", "bellek", "technology", "computer storage / human recall (EN+TR)"),
  w("milk", "süt", "food", null),
  w("minute", "dakika", "time", null),
  w("mirror", "ayna", "household", null),
  w("mistake", "hata", "abstract", null),
  w("molecule", "molekül", "science", null),
  w("money", "para", "abstract", null),
  w("monkey", "maymun", "animal", null),
  w("month", "ay", "time", null),
  w("moon", "ay", "nature", "sky / TR ay is also 'month'"),
  w("morning", "sabah", "time", null),
  w("mosque", "cami", "place", null),
  w("motorcycle", "motosiklet", "transport", null),
  w("mountain", "dağ", "nature", null),
  w("mouse", "fare", "animal", "animal / pointing device (EN)"),
  w("mouth", "ağız", "body", null),
  w("museum", "müze", "place", null),
  w("music", "müzik", "music", null),
  w("neck", "boyun", "body", null),
  w("network", "ağ", "technology", "computers / social ties (EN+TR)"),
  w("night", "gece", "time", null),
  w("nose", "burun", "body", null),
  w("note", "nota", "music", "music / written reminder (EN+TR nota-not)"),
  w("nurse", "hemşire", "profession", null),
  w("ocean", "okyanus", "nature", null),
  w("onion", "soğan", "food", null),
  w("orange", "portakal", "food", "fruit / colour (EN only, TR portakal is fruit)"),
  w("order", "düzen", "abstract", null),
  w("owl", "baykuş", "animal", null),
  w("painter", "ressam", "profession", null),
  w("password", "parola", "technology", null),
  w("past", "geçmiş", "time", null),
  w("pasta", "makarna", "food", "EN noodles / TR pasta = cake"),
  w("peace", "barış", "abstract", null),
  w("pepper", "biber", "food", null),
  w("phone", "telefon", "technology", null),
  w("physics", "fizik", "science", null),
  w("piano", "piyano", "music", null),
  w("pilot", "pilot", "profession", null),
  w("plane", "uçak", "transport", null),
  w("plant", "bitki", "nature", "vegetation / factory (EN only)"),
  w("plate", "tabak", "household", null),
  w("pocket", "cep", "clothing", null),
  w("police", "polis", "profession", null),
  w("potato", "patates", "food", null),
  w("power", "güç", "abstract", "electricity / authority (EN+TR güç)"),
  w("pride", "gurur", "emotion", null),
  w("printer", "yazıcı", "technology", null),
  w("prison", "hapishane", "place", null),
  w("problem", "sorun", "abstract", null),
  w("proof", "kanıt", "science", null),
  w("puppy", "yavru köpek", "animal", null),
  w("purple", "mor", "color", null),
  w("question", "soru", "abstract", null),
  w("rabbit", "tavşan", "animal", null),
  w("rain", "yağmur", "nature", null),
  w("rat", "sıçan", "animal", null),
  w("red", "kırmızı", "color", null),
  w("restaurant", "restoran", "place", null),
  w("rhythm", "ritim", "music", null),
  w("rice", "pirinç", "food", null),
  w("risk", "risk", "abstract", null),
  w("river", "nehir", "nature", null),
  w("road", "yol", "transport", null),
  w("robot", "robot", "technology", null),
  w("roof", "çatı", "household", null),
  w("root", "kök", "nature", "plant / mathematics / filesystem (EN+TR kök)"),
  w("sadness", "üzüntü", "emotion", null),
  w("salad", "salata", "food", null),
  w("salt", "tuz", "food", null),
  w("scarf", "atkı", "clothing", null),
  w("school", "okul", "place", null),
  w("scientist", "bilim insanı", "profession", null),
  w("screen", "ekran", "technology", null),
  w("sea", "deniz", "nature", null),
  w("second", "saniye", "time", null),
  w("seed", "tohum", "nature", null),
  w("server", "sunucu", "technology", null),
  w("shame", "utanç", "emotion", null),
  w("shark", "köpekbalığı", "animal", null),
  w("sheep", "koyun", "animal", null),
  w("ship", "gemi", "transport", null),
  w("shirt", "gömlek", "clothing", null),
  w("shoe", "ayakkabı", "clothing", null),
  w("shop", "dükkan", "place", null),
  w("shoulder", "omuz", "body", null),
  w("singer", "şarkıcı", "profession", null),
  w("skin", "deri", "body", null),
  w("skirt", "etek", "clothing", null),
  w("sky", "gökyüzü", "nature", null),
  w("snake", "yılan", "animal", null),
  w("snow", "kar", "nature", null),
  w("sock", "çorap", "clothing", null),
  w("software", "yazılım", "technology", null),
  w("soldier", "asker", "profession", null),
  w("song", "şarkı", "music", null),
  w("sound", "ses", "science", null),
  w("soup", "çorba", "food", null),
  w("spider", "örümcek", "animal", null),
  w("spoon", "kaşık", "household", null),
  w("spring", "ilkbahar", "nature", "season / coil / water source (EN only)"),
  w("star", "yıldız", "nature", "astronomy / celebrity (EN+TR yıldız)"),
  w("storm", "fırtına", "nature", null),
  w("strawberry", "çilek", "food", null),
  w("street", "sokak", "place", null),
  w("student", "öğrenci", "profession", null),
  w("subway", "metro", "transport", null),
  w("sugar", "şeker", "food", null),
  w("sun", "güneş", "nature", null),
  w("table", "masa", "household", null),
  w("taxi", "taksi", "transport", null),
  w("tea", "çay", "food", null),
  w("teacher", "öğretmen", "profession", null),
  w("team", "takım", "sport", null),
  w("tennis", "tenis", "sport", null),
  w("theory", "teori", "science", null),
  w("thunder", "gök gürültüsü", "nature", null),
  w("tiger", "kaplan", "animal", null),
  w("tomato", "domates", "food", null),
  w("tongue", "dil", "body", "body part / language (TR dil is both)"),
  w("tooth", "diş", "body", null),
  w("train", "tren", "transport", null),
  w("tree", "ağaç", "nature", null),
  w("trousers", "pantolon", "clothing", null),
  w("truck", "kamyon", "transport", null),
  w("trumpet", "trompet", "music", null),
  w("truth", "gerçek", "abstract", null),
  w("tunnel", "tünel", "transport", null),
  w("university", "üniversite", "place", null),
  w("village", "köy", "place", null),
  w("violin", "keman", "music", null),
  w("virus", "virüs", "technology", "biology / malware (EN+TR)"),
  w("wall", "duvar", "household", null),
  w("war", "savaş", "abstract", null),
  w("water", "su", "nature", null),
  w("wave", "dalga", "nature", "sea / physics (EN+TR)"),
  w("week", "hafta", "time", null),
  w("whale", "balina", "animal", null),
  w("wheel", "tekerlek", "transport", null),
  w("white", "beyaz", "color", null),
  w("wind", "rüzgar", "nature", null),
  w("window", "pencere", "household", null),
  w("wine", "şarap", "food", null),
  w("wolf", "kurt", "animal", null),
  w("writer", "yazar", "profession", null),
  w("year", "yıl", "time", null),
  w("yellow", "sarı", "color", null),
];

/** Version of the frozen list. Bumping it is a deliberate act. */
export const VOCABULARY_VERSION = 1;

/**
 * sha256 of the ids joined by NUL, in array order.
 *
 * This is the freeze. `engine.test.ts` recomputes it from `VOCABULARY`; editing
 * the list without consciously re-freezing turns into a failing test rather
 * than a quietly different lab.
 */
export const VOCABULARY_CHECKSUM =
  "981b53c8d9b302af08eae000f0cbb58d81c824f8b6c038ea56a83171e08f68d3";

export const WORD_COUNT = VOCABULARY.length;
