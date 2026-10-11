import type en from "../en/cryptographic-hashing";

/** Türkçe metin: cryptographic-hashing. Şekli `en/cryptographic-hashing.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    sha2: "Bu laboratuvar\u0131n taray\u0131c\u0131n\u0131n Web Crypto uygulamas\u0131ndan istedi\u011fi SHA-256 \u00f6zetini tan\u0131mlar. Laboratuvar \u00f6zet i\u015flevini kendisi uygulamaz.",
  },
  inputLabel: "Mesajınız",
  inputPlaceholder: "merhaba dünya",
  copy: "Kopyala",
  copied: "Kopyalandı",
  copyHash: "Özeti kopyala",
  hashCopied: "Özet kopyalandı",

  unavailable: {
    title: "Bu laboratuvar burada çalışamıyor.",
    insecureContext:
      "Bu laboratuvarın tarayıcınızda özet hesaplayabilmesi için güvenli bir bağlantı (HTTPS) gerekiyor. Sayfayı https:// ile açmak sorunu çözecektir.",
    unsupported:
      "Tarayıcınız yerleşik özetleme özelliğini (Web Crypto) kullanıma sunmadı, bu yüzden gösterilecek bir özet yok. Bir ayar ya da bir eklenti bunu kapatmış olabilir.",
    note: "Burada hiçbir şey taklit edilmiyor: tarayıcının gerçek SHA-256'sı olmadan dürüstçe gösterilebilecek bir şey yok.",
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
    title: "Ne çıkıyor",
    question: "İki farklı mesaj aynı uzunlukta çıktı üretebilir mi?",
    digestLabel: "SHA-256 özeti",
    caption:
      "Ne isterseniz yazın. Mesaj ne kadar uzun olursa olsun tam 64 hex karakter geri döner, ve mesajın kendisi bunların içinde yoktur.",
    help: "Bir mesaj yazın. SHA-256 özeti alanın altında görünür ve siz yazdıkça güncellenir.",
    announce: (start: string) => `Özet güncellendi, artık ${start} ile başlıyor.`,
  },

  determinism: {
    kicker: "Aynı mesaj, aynı özet",
    title: "Her seferinde aynı yanıtı veriyor.",
    lede: "Mesajı yeniden hash'leyin. Hiçbir şey önbelleğe alınmıyor ve önceki çalıştırmadan kopyalanmıyor: her basış, aynı metin üzerinde yeni bir SHA-256 çağrısı.",
    hashAgain: "Yeniden hash'le",
    enough: "Bu kadar çalıştırma yeter",
    empty: "Henüz çalıştırma yok. Bu mesajı hash'lemek için düğmeye basın.",
    run: (n: number) => `${n}. çalıştırma`,
    runsLabel: "Çalıştırma",
    distinctLabel: "Farklı özet",
    distinctHint: "kaç kez çalıştırılırsa çalıştırılsın",
    caption:
      "Mesajı değiştirmek listeyi temizler, çünkü eski mesajın çalıştırması yenisi hakkında bir şey söylemez.",
    announce: (runs: number, distinct: number) => `${runs} çalıştırma, ${distinct} farklı özet.`,
  },

  avalanche: {
    kicker: "Tek küçük değişiklik",
    title: "Tek bir tuş her şeyi yeniden yazıyor.",
    lede: "Tek bir karakteri değiştirin ve iki özeti karşılaştırın. Farklı olan her karakter ikisinde de işaretlenir: gidende üstü çizili, yerine gelende altı çizili.",
    before: "Önce",
    after: "Sonra",
    fieldLabel: "Bir karakteri değiştirin",
    help: "Mesajı düzenleyin. Düzenlemeden önceki ve sonraki özetler yukarıda karakter karakter karşılaştırılır.",
    editPrompt: "İki özeti karşılaştırmak için mesajdaki bir karakteri değiştirin.",
    caption:
      "Sayım, iki gerçek özet üzerinde bit bit ölçülüyor: tahmin edilmiyor ve bir sayıya doğru canlandırılmıyor.",
    announce: (changed: number, total: number, percent: number) =>
      `${total} bitten ${changed} tanesi değişti, özetin yüzde ${percent}'i.`,
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
    title: "İki farklı mesajın aynı özeti üretmesini sağlayabilir misiniz?",
    lede: "Özetin tamamı değil: ilk karakterinden başlayın. Her tur bir karakter daha istiyor ve her tur bir öncekinden on altı kat daha düşük olasılıklı. Bu eğri, çakışma direncinin kalbi; ve bunu dürüstçe hissetmenin tek yolu bu: burada bir çakışma bulunmuyor, uydurulmuyor da.",
    inputA: "Mesaj A",
    inputB: "Mesaj B",
    identical:
      "İki mesaj da aynı, dolayısıyla özetler tanım gereği eşleşiyor. Çakışma için iki farklı mesaj gerekir.",
    target: (round: number, odds: string) =>
      `${round}. tur: ilk ${round} hex karakteri paylaşsınlar. Deneme başına olasılık: ${odds}'de 1.`,
    nextRound: (round: number) => `${round}. tur, on altı kat zor`,
    keepTrying: "Denemeye devam",
    maxRound: "İnsanların durduğu yer burası",
    matchedLabel: "Ortak ön ek",
    roundLabelFull: "Tur",
    oddsHint: (odds: string) => `deneme başına ${odds}'de 1`,
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
    title: "Özetlerin karşınıza çıktığı yerler.",
    lede: "Aynı sabit boyutlu parmak izi, beş farklı biçimde kullanılıyor.",
    items: {
      git: {
        label: "Git",
        body: "Git her commit'i, içeriğini ve ebeveyninin hash'ini hash'leyerek tanımlar. Geçmişteki bir satırı değiştirin, sonraki bütün hash'ler değişir, kurcalama görünür olur.",
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
        body: "Her blok bir öncekinin hash'ini içerir ve böylece birbirlerine zincirlenir. Eski bir bloğu değiştirin, sonraki bütün hash'ler bozulur; defteri kurcalamaya karşı görünür kılan da budur.",
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
      "Tek bir karakteri değiştirmek 256 bitin yaklaşık yarısını değiştirir: çığ etkisi, burada iddia edilmiyor ölçülüyor",
      "İki özetin paylaştığı her ek hex karakter on altı kat daha düşük olasılıklıdır; 64'ünün birden eşleşmesinin erişilemez olmasının nedeni budur",
    ],
    footer:
      'Bu sayfadaki hiçbir şey saklanmıyor ya da taklit edilmiyor: her özet, yazdığınız metin üzerinde tarayıcınızda çalışan crypto.subtle.digest("SHA-256", …) çağrısının sonucu.',
  },
};

export default copy;
