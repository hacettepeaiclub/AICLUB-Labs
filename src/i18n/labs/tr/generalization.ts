import type en from "../en/generalization";
const copy: typeof en = {
  question: "Tanıdık noktalarda kusursuz. Peki yenilerinde?",
  training: "Eğitim doğruluğu",
  validation: "Doğrulama doğruluğu",
  test: "Son test doğruluğu",
  map: "Sınıflandırıcının bölgeleri ve etiketli örnekler. Daire ve üçgen farklı sınıfları, amber halkalar yanlışları gösterir.",
  legend: "Daire / üçgen: gerçek sınıf. Zemin: tahmin. Amber halka: hata.",
  settings: "Model ayarları",
  neighbours: "Oy veren komşular (k)",
  kHint:
    "k = 1 iken her eğitim noktası kendine oy verir. Daha çok komşunun oy vermesi için k'yı artır.",
  hide: "Eğitim noktalarını göster",
  show: "Görülmemiş örnekleri aç",
  lock: "Modeli kilitle ve bir kez test et",
  finalNote:
    "Bu skor ayrı test kümesinden hesaplandı. Ayarlar kilitlendi: bu skora göre ayar yapmak testi yeni bir doğrulama kümesine dönüştürür. Yeniden keşfetmek için yeni veri oluştur.",
  revealed: "Yeni örnekler açıldı. Hatalarını eğitim sonucuyla karşılaştır.",
  newData: "Yeni veri oluştur",
  dataSettings: "Örneklem ve etiket gürültüsü",
  samples: "Eğitim örnekleri",
  noise: "Etiketin ters çevrilme olasılığı",
  dataHint:
    "Bunları doğrulama noktalarını açmadan seç. Görülmüş noktaları gizlemek onları yeniden görülmemiş yapmaz. Bu ayarları değiştirmek için yeni veri oluştur.",
  scope:
    "Bağımsız eğitim, doğrulama ve test örnekleriyle sentetik daire verisinde gerçek bir k-en yakın komşu sınıflandırıcısı. Etiketler seçilen olasılıkla ters çevrilebilir. Burada sinir ağı eğitilmiyor; daha büyük k sınırı yumuşatır. Skor örnekleme göre değişir ve daha fazla yumuşatma her zaman daha iyi değildir.",
  bridgeTitle: "Aynı soru bir sinir ağı için de geçerli.",
  bridge:
    "Esnek bir sınır gürültüye de uyabilir. Buradaki model komşuları saklar; sinir ağı ağırlıklarını ayarlar. İkisi de parametrelerinin seçiminde kullanılmamış örneklerde değerlendirilmelidir.",
  link: "Sinir ağının kapasitesini keşfet",
  recap: {
    lessons: [
      "Eğitim başarısı, yeni verideki başarının tahmini değildir.",
      "Modeli doğrulama örnekleriyle seç; son değerlendirme için ayrı test kümesi sakla.",
      "Daha fazla kapasite ve daha fazla yumuşatma birer tercihtir; iyileşme garantisi değildir.",
    ],
  },
  tour: {
    intro: "Sınıflandırıcının hiç görmediği noktaları aç.",
    stages: {
      experiment: {
        map: "Zemin komşuların oylarıyla hesaplanıyor. k = 1 iken eğitim noktaları kendilerini kusursuz sınıflar.",
        reveal:
          "Ayrı bir örneklem aç. Amber halkalar tahmin ile etiketin uyuşmadığı noktaları gösterir.",
        smooth:
          "Daha çok komşuya oy verdir. Doğrulama doğruluğunu eğitim sonucuyla karşılaştır; ikisinin de yükselmesi garanti değil.",
      },
    },
  },
  study: {
    topics: { generalisation: "Genelleme ve model seçimi" },
    notes: {
      "sklearn-generalization":
        "Test verisini model seçimine sızdırmadan eğitim ve değerlendirme verilerini ayırmak.",
    },
  },
};
export default copy;
