/**
 * The two texts the lab trains its tokenizers on.
 *
 * These are written for this lab rather than scraped, for three reasons. They
 * have to be small enough to ship (a few kilobytes, not a few gigabytes), they
 * have to be licence-clean, and — most importantly — their *behaviour under
 * BPE* has to be predictable enough to teach with. A random sample of web text
 * would learn a random assortment of fragments; these were written so that a
 * few hundred merges land somewhere a visitor can read.
 *
 * They are still ordinary prose. Neither one is a drill: no word list, no
 * repeated template, nothing that would make the corpus win by cheating. The
 * repetition in them is the repetition natural writing already has.
 *
 * ## Why two, and why these two
 *
 * The lab's claim is that *what a tokenizer was trained on decides what is
 * cheap to say*. A claim like that needs a contrast, and English against
 * Turkish is the sharpest honest one available:
 *
 * - English marks grammar mostly with separate words, so its frequent shapes
 *   are short function words and endings — ` the`, ` and`, `ing`, `tion`.
 * - Turkish is agglutinative: one written word can carry four suffixes, as in
 *   `ev-ler-imiz-den`. A tokenizer that has read Turkish learns those suffixes
 *   as units; one that has only read English has never seen them and shatters
 *   the word into letters.
 *
 * So the Turkish corpus leans, naturally but deliberately, on nouns that take
 * front-vowel suffixes — `ev`, `deniz`, `pencere`, `tepe` — because Turkish
 * vowel harmony splits every suffix into two spellings (`-ler`/`-lar`,
 * `-den`/`-dan`) and a small corpus cannot afford to halve the evidence for
 * both. That choice is a limitation of scale, not a thumb on the scale: the
 * suffixes still have to earn their place by frequency, against every other
 * pair in the text.
 */

export type CorpusId = "english" | "turkish";

export interface Corpus {
  readonly id: CorpusId;
  readonly label: string;
  /** Named in the visitor's language, not the author's. */
  readonly language: string;
  readonly text: string;
}

const ENGLISH = `The town sits where the river turns, and the river has been turning there for longer than the town has been standing. The oldest of the buildings are the ones nearest the water, because building near the water was easier than carrying the stone up the hill. The newer streets climb away from the river in long curves, and the walking between them is slower than the walking along the bank.

There is a library at the centre of the town. The building was a granary before it was a library, and the conversion left it with windows that are too high and floors that are too strong. The reading room is the largest of the rooms, and the reading there is quieter than the reading anywhere else in the building. The shelves are wooden, and the wood has been darkening for a hundred years.

The librarian arrives before the opening and leaves after the closing. She is the third librarian the town has had, and she is the first who was born in the town. She spends the mornings sorting the returns and the afternoons answering the questions of the readers. The questions are mostly about the river, the flooding, and the families that lived along the water before the flooding changed the streets.

The printing workshop is on the other side of the square. The printer is older than the librarian and has been printing for longer than she has been reading. He prints the notices for the meetings, the programmes for the concerts, and the little books that the walking club produces after the longer walks. The printing is slow, and the slowness is the point: he says that setting the letters by hand teaches the reader to notice the spacing.

In the spring the river rises and the meadows below the bridge are flooded. The flooding is expected and the town is prepared for it. The children are taken to the higher streets and the animals are moved to the higher fields. When the water falls again the meadows are richer than they were, and the growing is faster in the summer that follows.

In the summer the town fills with walkers. They come for the walking, the swimming, and the eating, and they leave with the feeling that the town is smaller than it looked in the pictures. The eating is good because the growing is good. The bakers start their baking before the light and the bread is finished before the walkers have finished their sleeping.

In the autumn the leaves fall into the river and the river carries them under the bridge and out of the valley. The bridge is the oldest of the crossings and the stones of the bridge were cut from the hill behind the workshop. The cutting took three summers and the building took two more. The builders are remembered by a carving on the northern side, and the carving is worn almost smooth by the weather.

In the winter the streets are quiet and the reading room is full. The heating is old and the librarian complains about the heating, but the readers stay anyway, because the reading is warmer than the walking. The evenings are long and the lamps are lit early, and the lighting of the lamps is one of the things the town has never wanted to change.

The school stands above the library, and the schoolteachers walk down to the reading room after the teaching is finished. The teaching is not easy in a town that is emptying, because the classes are smaller every year and the smaller classes are harder to fill with the arguing and the questioning that make the learning stick. But the teachers keep teaching, and the children keep asking, and the asking is the part that matters.

The gardens behind the houses are narrow and long. The growing there is careful, because the soil is thin and the watering has to be measured. The gardeners talk about the watering the way the printers talk about the spacing: as something that looks like a detail until you get it wrong. The apples are the best of the fruit, and the apple trees are the oldest of the plantings.

The walking club meets on the first morning of every month. The walkers take the northern path in the warmer months and the river path in the colder ones, because the northern path is dangerous in the ice and the river path is only muddy. The club keeps a book of the walks, and the book is printed at the workshop, and a copy of the book is kept at the library. The keeping of the book has outlasted three of the members who started it.

The station closed before the library opened, and the closing was the thing the town argued about for the longest. The rails were lifted and the line is a path now, and the walking on it is the flattest walking in the valley. The old station building was sold, and the selling paid for the rebuilding of the bridge, and the rebuilding is the reason the bridge is still standing.

Nothing in the town is famous. The river is not the longest river, the bridge is not the oldest bridge, and the library is not the largest library in the county. But the reading room is warm in the winter, the bread is finished before the morning, and the walkers keep coming back, and that is the whole of the argument the town has ever needed to make for itself.`;

const TURKISH = `Köyün evleri tepenin yamacına sıralanmıştı. Evler küçüktü ama pencereleri genişti. Her evin önünde bir bahçe, her bahçenin içinde birkaç ağaç vardı. Bizim evimiz sokağın sonundaydı. Evimizin bahçesinde iki erik ağacı büyürdü. Sabahları evlerin bacalarından ince bir duman yükselirdi ve bu duman denizin üzerine doğru dağılırdı.

Evlerden birinde bir öğretmen otururdu. Öğretmenin evinde çok kitap vardı ve kitapların çoğu eskiydi. Öğretmen bize kitaplarından söz ederdi, biz de onun anlattıklarını dinlerdik. Bizim evlerimiz birbirine yakındı, bu yüzden sesler kolayca duyulurdu. Evlerimizden denizin sesi bile duyulurdu. Evlerimizin damlarından tepenin arkası görünürdü.

Köyde iki sokak vardı. Sokakların biri denize, diğeri tepeye çıkardı. Sokakların taşları eskiydi ve yağmurdan sonra kayardı. Çocuklar sokaklarda koşardı, büyükler sokakların kenarında otururdu. Sokaklardan geçen herkes birbirini tanırdı. Sokaklarımızın adı yoktu; herkes evlerin sahiplerinin adıyla söylerdi.

Denizden gelen gemiler tepenin önünden geçerdi. Gemilerin ışıkları gece uzaktan görünürdü. Gemilerden birinin adı Deniz Yıldızıydı ve o gemi her hafta gelirdi. Balıkçılar denize sabah erkenden açılırdı. Denizin rengi sabahları gri, akşamları kızıl olurdu. Denizlerin hepsi aynı değildir derdi babam, ama bizim denizimiz en güzeliydi.

Okul köyün girişindeydi. Okulun bahçesi taşlıktı ve bahçenin ortasında bir çınar vardı. Öğrenciler sabahları okulun bahçesinde toplanırdı. Öğretmenler öğrencilerin defterlerini pencerenin önünde okurdu. Defterlerin kâğıdı inceydi ve kalemlerin izi arkadan görünürdü. Öğrencilerin çoğu köyün evlerinden gelirdi, birkaçı ise tepenin arkasındaki evlerden.

Kışın evlerin pencereleri buz tutardı. Pencerelerden dışarısı bulanık görünürdü. Evlerin içi sıcaktı çünkü sobalar hiç sönmezdi. Kış geceleri uzundu ve gecelerin sessizliği denizin sesini büyütürdü. Gecelerden birinde kar yağdı ve köyün bütün evleri beyaz oldu. Sabah çocuklar evlerinden çıkıp tepeye koştular.

İlkbaharda bahçeler yeşerirdi. Bahçelerin toprağı ince olduğu için sulama dikkatli yapılırdı. Bahçelerden birinde gül vardı, diğerinde sadece sebze. Çiçeklerin kokusu sokaklara kadar gelirdi. Çiçeklerin açtığı hafta köyün en güzel haftasıydı. Bahçelerimizin duvarları alçaktı, bu yüzden komşuların bahçelerini görebilirdik.

Yazın köye misafirler gelirdi. Misafirler şehirlerden gelirdi ve şehirlerin gürültüsünden bahsederlerdi. Şehirlerde evlerin üst üste olduğunu, pencerelerden denizin görünmediğini anlatırlardı. Biz onları dinlerken kendi evlerimizi düşünürdük. Şehirlerden gelenler birkaç hafta kalır, sonra geri dönerlerdi.

Sonbaharda yapraklar dereye dökülürdü. Derenin suyu yaprakları tepenin altından geçirip denize taşırdı. Derelerin çoğu yazın kururdu ama bizimki kurumazdı. Derenin kenarındaki taşların üzerinde otururduk. Dereden eve dönerken ellerimiz üşürdü.

Köyün kahvesi meydandaydı. Meydanın bir yanında kahve, diğer yanında bakkal vardı. Kahvede oturanlar denizden, evlerden ve fiyatlardan konuşurdu. Bakkalın rafları düzenliydi ve rafların üstündeki kavanozlar hep parlardı. Meydandan evlerimize giden yol kısaydı.

Yıllar geçtikçe evlerin bazıları boşaldı. Boşalan evlerin pencereleri kapandı, bahçeleri kurudu. Köyden gidenler şehirlere yerleşti. Gidenlerin çoğu yazın geri gelirdi ama artık misafir gibiydiler. Evlerinin anahtarı hâlâ ceplerindeydi. Evlerimizden ayrılmak kolay değildi.

Şimdi tepeye çıkınca köyün evlerini sayabiliyorum. Evlerin sayısı azaldı ama sokaklar aynı. Deniz aynı, dere aynı, çınar aynı. Evlerimizden geriye kalan duvarlar hâlâ ayakta. Evlerimizin bahçelerinde ağaçlar hâlâ meyve veriyor. Kimse toplamasa da veriyor.

Babam derdi ki, bir köyün hikâyesi evlerinde değil, evlerden çıkanların hatırladıklarındadır. Ben de o yüzden yazıyorum. Yazdıklarım kitap olmayacak, defterlerde kalacak. Ama defterler de bir şeydir. Bir gün birisi bu defterleri açar ve köyün evlerini, sokaklarını, denizini okur.`;

export const CORPORA: readonly Corpus[] = [
  { id: "english", label: "English", language: "English", text: ENGLISH },
  { id: "turkish", label: "Turkish", language: "Türkçe", text: TURKISH },
];

export const corpusById = (id: CorpusId): Corpus =>
  CORPORA.find((c) => c.id === id) ?? CORPORA[0]!;

/**
 * How far the lab trains, and the top of the merge slider.
 *
 * Measured, not guessed. Left to run freely these corpora exhaust themselves —
 * English stops after 375 merges and Turkish after 392, because past that no
 * pair occurs twice and fusing a one-off would be memorising rather than
 * learning. 360 is the largest round number *both* reach, which matters: the
 * lab compares two tokenizers, and that comparison is only fair if they were
 * given the same training budget.
 *
 * `engine.test.ts` pins this — if a corpus is edited until it can no longer
 * reach 360, the suite fails rather than quietly training one side less.
 */
export const MAX_MERGES = 360;

/**
 * A corpus small enough to watch.
 *
 * The two corpora above are the right size to *learn* from and far too big to
 * *look* at: four thousand characters of fusing is not a thing anyone can
 * follow. Section 2 trains this instead — ten distinct pieces, which fit on
 * screen at once, so every merge is visible in the corpus rather than merely
 * reported.
 *
 * Measured behaviour, and the reason for this wording: the first merges are
 * ` r`, `re`, `rea`, `read`, `er`, `th`, `the`, ` reader`, ` the`, `reads`,
 * then `readi`, `readin`, `reading`. A visitor watches `read` get assembled a
 * pair at a time and then grow endings — which is the whole idea, happening
 * slowly enough to narrate. `every` stays in pieces to the end, because it
 * only occurs once: rare words are not worth a place in the vocabulary.
 */
export const DEMO_CORPUS =
  "the reader reads. the reader is reading. the readers read. every reader reads the reading.";

/**
 * The sentence section 1 asks the visitor to guess the cuts in.
 *
 * Chosen by measuring ten candidates against the English vocabulary. This one
 * splits as `The · garden · ers · ta · lk · about · the · water · ing · .`
 *
 * Three properties earned it the slot. It is short enough to guess (38
 * characters, ten tokens). It mixes whole words with splits, so the answer is
 * neither "every word" nor "every letter" — the two guesses everyone makes.
 * And two of its splits, `garden|ers` and `water|ing`, are endings, which is
 * the same thing the Turkish section turns out to be about.
 */
export const GUESS_SENTENCE = "The gardeners talk about the watering.";

/**
 * Section 3's starting sentence, and the best merge curve of the three
 * candidates measured: 46 tokens at zero merges down to 9 at full training.
 *
 * It carries the lab's centrepiece word with a leading space and no capital,
 * so dragging the slider walks it through ` ev · ler · imiz · den` at 50
 * merges, ` ev · lerimiz · den` at 100, and ` evlerimiz · den` at 200.
 */
export const SEED_SENTENCE = "Sabahları denizin sesi evlerimizden duyulurdu.";

/** The four comparison texts. A union so translations can be keyed by it. */
export type SampleId = "tr-sea" | "tr-visit" | "en-room" | "en-bread";

export interface Sample {
  readonly id: SampleId;
  readonly text: string;
}

/**
 * Section 4's comparison texts. Two Turkish, two English, so the point lands
 * as "each tokenizer is cheap in its own language" rather than the much
 * smaller and wronger "Turkish is cheaper".
 */
export const SAMPLES: readonly Sample[] = [
  { id: "tr-sea", text: "Denizin sesi evlerimizden bile duyulurdu." },
  { id: "tr-visit", text: "Arkadaşlarımızın evlerinden birine gitmek istiyorum.",
  },
  { id: "en-room", text: "The reading room is warmer than the walking." },
  { id: "en-bread", text: "My grandmother is teaching me how to bake bread." },
];

/**
 * The one sentence that must appear next to every token count in this lab.
 * Not a footnote: a visitor who leaves thinking these are a real model's
 * numbers has been taught something false.
 */
export const HONESTY =
  "A small BPE tokenizer trained for this lab on a few kilobytes of text — not the tokenizer any GPT model uses.";
