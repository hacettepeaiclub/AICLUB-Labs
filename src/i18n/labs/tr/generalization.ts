import type en from "../en/generalization";
const copy: typeof en = {
  question:
    "Eğitim noktalarının hepsi doğru sınıflandırılıyor. Yeni noktalarda sonuç nasıl değişir?",
  training: "Eğitim doğruluğu",
  validation: "Doğrulama doğruluğu",
  test: "Son test doğruluğu",
  map: "Sınıflandırıcının bölgeleri ve etiketli örnekler. Daire ve üçgen farklı sınıfları, turuncu halkalar yanlışları gösterir.",
  legend: "Daire / üçgen: gerçek sınıf. Zemin: tahmin. Turuncu halka: hata.",
  settings: "Model ayarları",
  neighbours: "Oy veren komşular (k)",
  kHint:
    "k = 1 iken en yakın komşu, eğitim noktasının kendisidir. k’yı artırarak sınıflandırmaya daha fazla komşu kat.",
  hide: "Eğitim noktalarını göster",
  show: "Görülmemiş örnekleri aç",
  lock: "Modeli kilitle ve bir kez test et",
  finalNote:
    "Skor ayrı test verisiyle hesaplandı ve model ayarları kilitlendi. Bu skora bakarak ayar değiştirmek test verisini model seçimine dahil eder. Yeni bir karşılaştırma için yeni veri oluştur.",
  revealed: "Yeni örnekler açıldı. Hatalarını eğitim sonucuyla karşılaştır.",
  newData: "Yeni veri oluştur",
  dataSettings: "Örneklem ve etiket gürültüsü",
  samples: "Eğitim örnekleri",
  noise: "Etiketin ters çevrilme olasılığı",
  dataHint:
    "Örnek sayısını ve gürültüyü doğrulama verisini açmadan önce seç. Veriyi gizlemek daha önce gördüğün bilgiyi silmez. Bu ayarları değiştirmek için yeni veri oluştur.",
  scope:
    "Bu deney, daire biçimindeki sentetik verilerde k-en yakın komşu yöntemiyle sınıflandırma yapar. Eğitim, doğrulama ve test verileri ayrı üretilir. Etiketler seçilen olasılıkla ters çevrilir. Daha büyük k, sınırı yumuşatır; ancak doğruluğu her zaman artırmaz. Sinir ağı eğitilmez.",
  bridgeTitle: "The same question applies to a neural network.",
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
          "Ayrı bir örneklem aç. Turuncu halkalar tahmin ile etiketin uyuşmadığı noktaları gösterir.",
        smooth:
          "Daha çok komşuya oy verdir. Doğrulama doğruluğunu eğitim sonucuyla karşılaştır; ikisinin de yükselmesi garanti değil.",
      },
    },
  },
  study: {
    topics: { generalisation: "Generalisation and model selection" },
    notes: {
      "sklearn-generalization":
        "Test verisini model seçimine sızdırmadan eğitim ve değerlendirme verilerini ayırmak.",
    },
  },
};
export default copy;
