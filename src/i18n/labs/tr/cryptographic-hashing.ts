import type en from "../en/cryptographic-hashing";

/** Türkçe metin: cryptographic-hashing. Şekli `en/cryptographic-hashing.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    sha2: "SHA-256 algoritmasını tanımlar. Lab bu hesabı tarayıcının Web Crypto uygulamasından ister.",
  },
  inputLabel: "Mesajın",
  inputPlaceholder: "merhaba dünya",
  copy: "Kopyala",
  copied: "Kopyalandı",
  copyHash: "Özeti kopyala",
  hashCopied: "Özet kopyalandı",

  unavailable: {
    title: "Bu tarayıcıda SHA-256 kullanılamıyor",
    insecureContext:
      "Özet hesaplamak için tarayıcının güvenli bağlantı kullanması gerekir. Sayfayı HTTPS üzerinden aç.",
    unsupported:
      "Tarayıcında Web Crypto kullanılamıyor. Bir ayarın veya eklentinin bu özelliği kapatıp kapatmadığını kontrol et.",
    note: "Bu deney tarayıcının SHA-256 desteğini gerektirir. Destek yoksa özet hesaplanamaz.",
  },

  figures: {
    messageLength: "Mesaj",
    characters: "UTF-16 kod birimi",
    digestLength: "Özet",
    hexChars: "on altılık basamak",
    digestBits: "Bit",
    alwaysBits: "mesaj ne kadar uzun olursa olsun",
    bitsChanged: "Değişen bit",
    percentChanged: "Değişen bit oranı",
    expectedHalf: "çok sayıda karşılaştırmada ortalama %50 beklenir",
    charsChanged: "Değişen on altılık basamak",
    ofSixtyFour: "64 basamaktan",
  },

  hero: {
    title: "Mesajın özeti",
    question: "Mesajın uzunluğunu değiştir. Özet uzunluğu değişiyor mu?",
    digestLabel: "SHA-256 özeti",
    caption:
      "Bir mesaj yaz. SHA-256, mesajın uzunluğundan bağımsız olarak 256 bitlik bir özet üretir. Tarayıcı bu özeti 64 on altılık basamakla gösterir.",
    help: "Bir mesaj yaz. SHA-256 özeti alanın altında görünür ve yazdıkça güncellenir.",
    announce: (start: string) => `Özet güncellendi, artık ${start} ile başlıyor.`,
  },

  determinism: {
    kicker: "Aynı mesaj, aynı özet",
    title: "Aynı mesaj her seferinde aynı özeti mi verir?",
    lede: "Hesapla düğmesine art arda bas. Her basışta aynı mesaj için yeni bir SHA-256 hesabı yapılır. Listedeki sonuçları karşılaştır.",
    hashAgain: "Hesapla",
    enough: "Hesaplama sınırına ulaşıldı",
    empty: "İlk özeti listeye eklemek için Hesapla düğmesine bas.",
    run: (n: number) => `${n}. hesaplama`,
    runsLabel: "Hesaplama",
    distinctLabel: "Farklı özet",
    distinctHint: "aynı mesaj için",
    caption: "Liste seçili mesaja ait özetleri gösterir. Mesajı değiştirdiğinde liste temizlenir.",
    announce: (runs: number, distinct: number) => `${runs} hesaplama, ${distinct} farklı özet.`,
  },

  avalanche: {
    kicker: "Çığ etkisi",
    title: "Bir karakter değişince kaç bit değişir?",
    lede: "Mesajda bir karakteri değiştir. Önce ve sonra gösterilen özetlerde hangi on altılık basamakların değiştiğine bak.",
    before: "Önce",
    after: "Sonra",
    fieldLabel: "Bir karakteri değiştir",
    help: "Mesajı düzenle. Önceki ve yeni özetin farklı on altılık basamakları yukarıda işaretlenir.",
    editPrompt: "İki özeti karşılaştırmak için mesajdaki bir karakteri değiştir.",
    caption: "Değişen bit sayısı, iki SHA-256 özeti bit bit karşılaştırılarak hesaplanır.",
    announce: (changed: number, total: number, percent: number) =>
      `${total} bitten ${changed} tanesi değişti, bitlerin %${percent} kadarı.`,
  },

  bits: {
    gridLabel: (total: number, ones: number, zeros: number, flipped: number) =>
      `Özetin ${total} biti, 16 satır ve 16 sütun. ${ones} bit 1, ${zeros} bit 0. Son düzenlemede ${flipped} bit değişti.`,
    legendOne: "bit 1",
    legendZero: "bit 0",
    legendChanged: "değişti",
  },

  challenge: {
    kicker: "Ön ek eşleştirme",
    title: "İki farklı mesajın özetleri aynı basamaklarla başlayabilir mi?",
    lede: "Mesaj B'yi değiştir ve iki özetin ilk basamağını eşleştir. Her turda ön eke bir basamak eklenir. Bağımsız ve eşit olasılıklı özetler varsayılırsa her ek basamakla deneme başına olasılık önceki değerin 16'da biri olur.",
    inputA: "Mesaj A",
    inputB: "Mesaj B",
    identical:
      "İki mesaj aynı olduğu için özetleri de aynı. Ön ek eşleştirme görevinde iki farklı mesaj kullan.",
    target: (round: number, odds: string) =>
      `${round}. tur: ilk ${round} on altılık basamağı eşleştir. Deneme başına olasılık: 1/${odds}.`,
    nextRound: (round: number) => `${round}. tura geç`,
    keepTrying: "Denemeye devam",
    maxRound: "Son tur",
    matchedLabel: "Ortak ön ek",
    roundLabelFull: "Tur",
    oddsHint: (odds: string) => `deneme başına 1/${odds}`,
    bestLabel: "En uzun ortak ön ek",
    attemptsLabel: "Deneme",
    ladderLabel: (matched: number, total: number, round: number) =>
      `${total} on altılık basamağın ilk ${matched} tanesi eşleşiyor. Tur hedefi ${round} basamak.`,
    caption:
      "Tek bir rastgele özetin belirli bir 256 bitlik özetle tam eşleşme olasılığı 1/2²⁵⁶. İki serbest girdi arasında tam çakışma için doğum günü hesabı yaklaşık 2¹²⁸ özet ölçeğindedir.",
    announce: (matched: number, total: number, best: number, round: number) =>
      `Toplam ${total} on altılık basamak. Baştan ${matched} basamak eşleşti. En uzun ortak ön ek ${best} basamak. Bu turun hedefi ${round} basamak.`,
  },

  usage: {
    kicker: "Kullanım alanları",
    title: "Özetler nerede kullanılır?",
    lede: "Sabit uzunluklu özetler, veri bütünlüğü denetimi ve dijital imza gibi işlemlerde kullanılır.",
    items: {
      git: {
        label: "Git",
        body: "Git, commit nesnesinin içeriğinden bir kimlik hesaplar. Bu içerikte ebeveyn commit kimlikleri de bulunur. Geçmişte bir commit değişirse ona bağlı sonraki commit kimlikleri de değişir.",
      },
      passwords: {
        label: "Parolalar",
        body: "Parolalar, rastgele bir tuzla birlikte parola saklamaya uygun bir algoritmadan geçirilir. Argon2id, scrypt, bcrypt ve PBKDF2 gibi yöntemler her parola denemesine hesaplama maliyeti ekler.",
      },
      https: {
        label: "HTTPS",
        body: "Sertifika parmak izi, sertifikanın özetidir. TLS ayrıca bağlantının bütünlüğünü doğrulamak için kimlik doğrulama mekanizmaları kullanır.",
      },
      blockchain: {
        label: "Blok zinciri",
        body: "Her blok, önceki bloğun özetini içerir. Eski bir bloğun içeriği değişirse ardındaki blokta kayıtlı özet artık onunla eşleşmez.",
      },
      signatures: {
        label: "İmzalar",
        body: "Birçok dijital imza şeması, belgenin özetini imza hesabında kullanır. Doğrulamada belge, imza ve açık anahtar birlikte kullanılır.",
      },
    },
  },

  recap: {
    lessons: [
      "Aynı bayt dizisi aynı SHA-256 özetini üretir. Özet uzunluğu her zaman 256 bittir.",
      "Girdideki küçük değişiklik çoğu zaman özetin bitlerinin yaklaşık yarısını değiştirir. Çığ etkisini görmek için değişen bit sayısını birkaç farklı düzenlemede karşılaştır.",
      "Rastgele özetlerde ortak ön eke eklenen her on altılık basamak, önceki eşleşme olasılığını 16'ya böler.",
    ],
    footer:
      'Özetler tarayıcında crypto.subtle.digest("SHA-256", …) ile hesaplanır. Mesaj ve özetler bu sayfa tarafından kaydedilmez.',
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Bir mesaj yazıp bir karakterini değiştir. Değişen on altılık basamak sayısını değişen bit sayısıyla karşılaştır.",
    stages: {
      digest: {
        type: "Bu kutuya istediğin mesajı yaz. Tur mesajın sonuna bir ünlem ekledi.",
        digest: "Mesajın sonuna tek karakter eklenince özetin nasıl değiştiğine bak.",
        length:
          "Mesajı uzat ve Özet kutusundaki uzunluğa bak. Sonuç yine 64 on altılık basamakla gösterilir ve 256 bittir.",
      },
      determinism: {
        again: "Hesapla düğmesine bas. Listeye aynı mesajın yeni hesaplanan özeti eklenir.",
        runs: "Her hesaplamadan sonra listeye aynı özet eklenir.",
        distinct: "Hesaplama ve Farklı özet sayaçlarını karşılaştır.",
      },
      avalanche: {
        edit: "Tur mesaja bir harf ekledi. Önceki ve yeni özetlerde işaretlenen basamaklara bak.",
        compare: "Önceki ve sonraki özet. Değişen basamaklar iki özette de işaretlenir.",
        count: "Değişen bit sayısına bak. Mesajı yeniden düzenle ve iki sayımı karşılaştır.",
      },
      collision: {
        fields: "İki farklı mesaj kullan. İlk turda iki özetin yalnızca ilk basamağını eşleştir.",
        type: "Rehberli tur ikinci mesaja bir harf ekledi. Ortak ön ek sayacına bak.",
        rounds:
          "Her turda hedef ön ek bir basamak uzar. Ortak ön ek sayacını tur hedefiyle karşılaştır.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      digest: "Sabit uzunluk, her seferinde aynı cevap",
      collision: "Çakışma direnci",
    },
    notes: {
      "paar-hash": "Bir hash fonksiyonunun neyi garanti etmesi gerektiğine dair üniversite dersi.",
      "mit-6046-hash": "MIT'nin kriptografik hash fonksiyonları ve özellikleri üzerine dersi.",
      "cp-birthday": "Çakışmaların neden beklenenden erken geldiği ve bunun bir özet için anlamı.",
      "3b1b-256bit": "2²⁵⁶'nın gerçekte ne kadar büyük olduğu ve aramanın neden imkânsız olduğu.",
      cryptobook:
        "İleri düzey, ücretsiz kitap. Çakışmaya dayanıklı hash fonksiyonları kısmına bak; hash tablosu için hızlı adres üretmek ile kriptografik güvenliğin neden farklı hedefler olduğunu açıklar.",
    },
  },
};

export default copy;
