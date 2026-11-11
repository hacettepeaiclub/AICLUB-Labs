import type en from "../en/cryptographic-hashing";

/** Türkçe metin: cryptographic-hashing. Şekli `en/cryptographic-hashing.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    sha2: "Bu laboratuvarın tarayıcının Web Crypto uygulamasından istediği SHA-256 özetini tanımlar. Laboratuvar özet işlevini kendisi uygulamaz.",
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
      "Bu laboratuvarın tarayıcında özet hesaplayabilmesi için güvenli bir bağlantı (HTTPS) gerekiyor. Sayfayı https:// ile açmak sorunu çözecektir.",
    unsupported:
      "Tarayıcın yerleşik özetleme özelliğini (Web Crypto) kullanıma sunmadı, bu yüzden gösterilecek bir özet yok. Bir ayar ya da bir eklenti bunu kapatmış olabilir.",
    note: "Bu deney tarayıcının SHA-256 desteğini gerektirir. Destek yoksa özet hesaplanamaz.",
  },

  figures: {
    messageLength: "Mesaj",
    characters: "karakter girdi",
    digestLength: "Özet",
    hexChars: "hex karakter çıktı",
    digestBits: "Bit",
    alwaysBits: "mesaj ne kadar uzun olursa olsun",
    bitsChanged: "Değişen bit",
    percentChanged: "Özetin",
    expectedHalf: "yaklaşık yarısı beklenir",
    charsChanged: "Değişen hex karakter",
    ofSixtyFour: "64 karakterden",
  },

  hero: {
    title: "Mesajın özeti",
    question: "İki farklı mesaj aynı uzunlukta çıktı üretebilir mi?",
    digestLabel: "SHA-256 özeti",
    caption:
      "Bir mesaj yaz. SHA-256, mesajın uzunluğundan bağımsız olarak 64 onaltılık karakter üretir. Bu çıktı, mesajın geri okunabilir bir kopyası değildir.",
    help: "Bir mesaj yaz. SHA-256 özeti alanın altında görünür ve yazdıkça güncellenir.",
    announce: (start: string) => `Özet güncellendi, artık ${start} ile başlıyor.`,
  },

  determinism: {
    kicker: "Aynı mesaj, aynı özet",
    title: "Aynı mesaj her seferinde aynı özeti mi verir?",
    lede: "Aynı mesajın özetini yeniden hesapla. Her tıklama yeni bir SHA-256 çağrısı yapar; önceki sonuç kullanılmaz.",
    hashAgain: "Yeniden hash'le",
    enough: "Bu kadar çalıştırma yeter",
    empty: "Henüz çalıştırma yok. Bu mesajı hash'lemek için düğmeye bas.",
    run: (n: number) => `${n}. çalıştırma`,
    runsLabel: "Çalıştırma",
    distinctLabel: "Farklı özet",
    distinctHint: "kaç kez çalıştırılırsa çalıştırılsın",
    caption:
      "Mesajı değiştirince liste temizlenir: eski mesajın sonuçları yenisi hakkında bir şey söylemez.",
    announce: (runs: number, distinct: number) => `${runs} çalıştırma, ${distinct} farklı özet.`,
  },

  avalanche: {
    kicker: "Tek küçük değişiklik",
    title: "Bir karakter değişince kaç bit değişir?",
    lede: "Mesajın tek karakterini değiştir. İki özette farklı olan karakterler işaretlenir.",
    before: "Önce",
    after: "Sonra",
    fieldLabel: "Bir karakteri değiştir",
    help: "Mesajı düzenleyin. Düzenlemeden önceki ve sonraki özetler yukarıda karakter karakter karşılaştırılır.",
    editPrompt: "İki özeti karşılaştırmak için mesajdaki bir karakteri değiştir.",
    caption: "Değişen bit sayısı, iki SHA-256 özeti bit bit karşılaştırılarak hesaplanır.",
    announce: (changed: number, total: number, percent: number) =>
      `${total} bitten ${changed} tanesi değişti, özetin %${percent} kadarı.`,
  },

  bits: {
    gridLabel: (total: number, ones: number, zeros: number, flipped: number) =>
      `Mevcut özetin ${total} biti, 16'ya 16 ızgara olarak. ${ones} tanesi 1, ${zeros} tanesi 0. Son düzenlemede ${flipped} tanesi değişti.`,
    legendOne: "bit 1",
    legendZero: "bit 0",
    legendChanged: "değişti",
  },

  challenge: {
    kicker: "Meydan okuma",
    title: "İki farklı mesaj aynı kısa özeti verebilir mi?",
    lede: "Önce özetin ilk karakterini eşleştirmeyi dene. Her turda bir karakter daha istenir. Rastgele bir denemenin başarı olasılığı her ek karakterde 16 kat azalır.",
    inputA: "Mesaj A",
    inputB: "Mesaj B",
    identical:
      "İki mesaj da aynı, dolayısıyla özetler tanım gereği eşleşiyor. Çakışma için iki farklı mesaj gerekir.",
    target: (round: number, odds: string) =>
      `${round}. tur: ilk ${round} hex karakter aynı olsun. Deneme başına olasılık: 1/${odds}.`,
    nextRound: (round: number) => `${round}. tur, on altı kat zor`,
    keepTrying: "Denemeye devam",
    maxRound: "Elle deneyenlerin durduğu yer burası",
    matchedLabel: "Ortak ön ek",
    roundLabelFull: "Tur",
    oddsHint: (odds: string) => `deneme başına 1/${odds}`,
    bestLabel: "En iyi",
    attemptsLabel: "Deneme",
    ladderLabel: (matched: number, total: number, round: number) =>
      `Ortak ön ek: ${total} hex karakterden ${matched} tanesi eşleşiyor. Bu tur ${round} tane istiyor.`,
    caption:
      "64 karakterin tamamının rastlantıyla eşleşmesi 2^256'da 1. Doğum günü kısayolu bile yaklaşık 2^128 hash gerektirir: saniyede bir trilyon hash'lense, kabaca 10^19 yıl.",
    announce: (matched: number, total: number, best: number, round: number) =>
      `${total} baştaki karakterden ${matched} tanesi eşleşiyor. En iyi ${best}. ${round}. tur ${round} tane istiyor.`,
  },

  usage: {
    kicker: "Gerçek hayatta",
    title: "Özetler nerede kullanılır?",
    lede: "Aynı sabit boyutlu parmak izi, beş farklı biçimde kullanılıyor.",
    items: {
      git: {
        label: "Git",
        body: "Git her commit'i, içeriğini ve ebeveyninin hash'ini hash'leyerek tanımlar. Geçmişteki bir satırı değiştir, sonraki bütün hash'ler değişir, kurcalama görünür olur.",
      },
      passwords: {
        label: "Parolalar",
        body: "Sunucular parolanın kendisini değil, tuzlanmış parola hash'ini saklar; böylece sızan bir veritabanı parolaları değil hash'leri barındırır. Ama kullanılan fonksiyon SHA-256 değildir: parola saklamada Argon2id, scrypt, bcrypt ya da PBKDF2 gibi kasıtlı olarak yavaş bir hash kullanılır, böylece deneme yapmak pahalı kalır.",
      },
      https: {
        label: "HTTPS",
        body: "TLS, sertifikaları parmak izlemek ve verinin yolda değiştirilmediğini doğrulamak için hash kullanır. Tek bir bitin değişmesi hash'i bozar.",
      },
      blockchain: {
        label: "Blok zinciri",
        body: "Her blok bir öncekinin hash'ini içerir ve böylece birbirlerine zincirlenir. Eski bir bloğu değiştir, sonraki bütün hash'ler bozulur; defteri kurcalamaya karşı görünür kılan da budur.",
      },
      signatures: {
        label: "İmzalar",
        body: "Dijital imza, belgenin kendisi üzerinde değil hash'i üzerinde atılır. Herkes belgeyi yeniden hash'leyip imzayı doğrulayabilir.",
      },
    },
  },

  recap: {
    lessons: [
      "Aynı mesaj her zaman aynı özeti üretir ve özet, girene bakılmaksızın aynı uzunluktadır",
      "Tek bir karakteri değiştirmek 256 bitin yaklaşık yarısını değiştirir; çığ etkisi denen bu davranış burada varsayılmıyor, ölçülüyor",
      "İki özetin baştan paylaştığı her yeni hex karakter on altı kat daha olasılıksızdır; 64 karakterin birden tutmasının ulaşılmaz olmasının nedeni bu",
    ],
    footer:
      'Özetler tarayıcında crypto.subtle.digest("SHA-256", …) ile hesaplanır. Mesaj ve özetler bu sayfa tarafından kaydedilmez.',
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Bir mesaj yaz, ardından tek karakterini değiştir. Özette değişen karakterleri ve bit sayısını karşılaştır.",
    stages: {
      digest: {
        type: "Bu kutuya istediğini yaz. Tur, metnin sonuna bir ünlem ekledi.",
        digest: "Tek bir karakter fazlası, özetin bitlerinin yaklaşık yarısını değiştirdi.",
        length: "Mesaj istediğin uzunlukta olabilir; özet her zaman 64 hex karakter, yani 256 bit.",
      },
      determinism: {
        again: "Aynı mesajı yeniden hash'leyin. Her basış yeni bir SHA-256 hesabı.",
        runs: "Her çalıştırma bu listeye eklenir ve hepsi aynı özet.",
        distinct: "Şimdiye kadarki çalıştırmalar ve kaç farklı özet verdikleri: her zaman bir.",
      },
      avalanche: {
        edit: "Mesajı buradan değiştir. Tur tek bir harf ekledi.",
        compare: "Önceki ve sonraki özet. Farklı olan her karakter ikisinde de işaretli.",
        count:
          "Değişen bitler, iki gerçek özet bit bit karşılaştırılarak sayıldı: yaklaşık yarısı.",
      },
      collision: {
        fields: "İki mesaj, iki özet. Amaç, ilk karakterlerinin aynı olması.",
        type: "İkinci mesajı değiştirip yeniden dene. Tur bir harf ekledi.",
        rounds:
          "Her tur bir karakter daha eşleşmesini ister ve bir öncekinden on altı kat daha zordur.",
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
    },
  },
};

export default copy;
