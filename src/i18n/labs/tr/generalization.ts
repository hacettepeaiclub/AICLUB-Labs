import type en from "../en/generalization";

/**
 * Türkçe metin: generalization. Şekli `en/generalization.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## generalization), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır.
 */

const copy: typeof en = {
  percent: (n: number) => `%${n}`,
  question: "k = 1 iken eğitim noktalarının hepsi doğru sınıflanır. Yeni noktalarda ne olur?",
  training: "Eğitim doğruluğu",
  validation: "Doğrulama doğruluğu",
  test: "Son test doğruluğu",
  map: "Sınıflandırıcının karar bölgeleri ve etiketli örnekler. Daire ya da üçgen, noktanın verideki etiketini gösterir; bu etiket ters çevrilmiş olabilir. Turuncu halkalar, tahminin bu etiketle uyuşmadığı noktalardır.",
  legend:
    "Daire / üçgen: verideki etiket. Zemin rengi: tahmin edilen sınıf. Turuncu halka: tahmin etiketle uyuşmuyor.",
  settings: "Model ayarları",
  neighbours: "Oy veren komşu sayısı (k)",
  kHint:
    "k = 1 iken her eğitim noktasının en yakın komşusu kendisidir ve kendi etiketine oy verir. Oylamaya daha çok komşu katmak için k'yı artır.",
  hide: "Eğitim noktalarını göster",
  show: "Görülmemiş örnekleri göster",
  lock: "Modeli kilitle ve bir kez test et",
  finalNote:
    "Bu doğruluk ayrı bir test kümesiyle hesaplandı. Ayarlar kilitlendi: bu sonuca bakarak ayar değiştirmek test kümesini bir doğrulama kümesine çevirir. Yeniden denemek için yeni veri kümesi oluştur.",
  revealed:
    "Yeni örnekler görünüyor. Bu örneklerdeki hataları eğitim kümesindeki sonuçla karşılaştır.",
  newData: "Yeni veri kümesi oluştur",
  dataSettings: "Örnek sayısı ve etiket gürültüsü",
  samples: "Eğitim örneği sayısı",
  noise: "Etiketin ters çevrilme olasılığı",
  dataHint:
    "Bu iki ayarı doğrulama noktalarını göstermeden önce seç. Gördüğün noktaları gizlemek onları görülmemiş yapmaz. Bu ayarları değiştirmek için yeni veri kümesi oluştur.",
  scope:
    "Bu lab, sentetik daire verisi üzerinde gerçek bir k-en yakın komşu (k-NN) sınıflandırıcısı çalıştırır. Eğitim, doğrulama ve test örneklemleri birbirinden bağımsız üretilir. Her etiket, seçilen olasılıkla ters çevrilebilir. Burada yapay sinir ağı eğitilmez. k büyüdüğünde karar bölgeleri genellikle daha az parçalı görünür; farkı görmek için haritayı farklı k değerlerinde karşılaştır. Sonuçlar örnekleme göre değişir ve daha çok yumuşatma her zaman daha iyi sonuç vermez.",
  bridgeTitle: "Aynı soru yapay sinir ağları için de sorulur.",
  bridge:
    "Esnek bir karar sınırı gürültüye de uyabilir. Buradaki model komşuları ezberler; yapay sinir ağı ise ağırlıklarını ayarlar. İkisi de, parametrelerinin seçiminde kullanılmamış örneklerde değerlendirilmelidir.",
  link: "Yapay sinir ağında kapasiteyi incele",
  recap: {
    lessons: [
      "Eğitim kümesindeki doğruluk, yeni verideki doğruluğun bir tahmini değildir.",
      "Modeli doğrulama örnekleriyle seç; son değerlendirme için ayrı bir test kümesi ayır.",
      "Kapasiteyi ya da yumuşatmayı artırmak bir şey kazandırırken başka bir şey kaybettirir; iyileşmeyi garanti etmez.",
    ],
  },
  tour: {
    intro: "Sınıflandırıcının hiç görmediği noktaları göster.",
    stages: {
      experiment: {
        map: "Zemin rengi komşuların oylamasıyla hesaplanır. k = 1 iken eğitim noktalarının hepsi doğru sınıflandırılır.",
        reveal:
          "Ayrı bir örneklemi göster. Turuncu halkalar, tahminin etiketle uyuşmadığı noktaları gösterir.",
        smooth:
          "k'yı artırarak daha çok komşunun oy vermesini sağla. Doğrulama doğruluğunu eğitim doğruluğuyla karşılaştır; ikisinin de yükselmesi garanti değildir.",
      },
    },
  },
  study: {
    topics: { generalisation: "Genelleme ve model seçimi" },
    notes: {
      "sklearn-generalization":
        "Test verisini model seçimine sızdırmadan eğitim ve değerlendirme verisinin nasıl ayrılacağını anlatır.",
      "isl-courses":
        "İstatistiksel öğrenme ve yeniden örnekleme video dersleriyle başla. R ve Python seçenekleri var; edX'e erişim için hesap gerekebilir.",
      "isl-book":
        "Ücretsiz kitabın sınıflandırma ve yeniden örnekleme bölümlerini oku. k seçimini ve doğrulama verisini, son testin neden ayrı tutulması gerektiğiyle birlikte düşün.",
      "d2l-generalization":
        "Eğitim hatası ile yeni verideki hata arasındaki farkın matematiksel anlatımı. Lab'dan sonra oku; örnekler k-en yakın komşu yerine regresyon kullanır.",
    },
  },
};
export default copy;
