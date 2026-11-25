import type en from "../en/diffusion";

/**
 * Türkçe metin: diffusion. Şekli `en/diffusion.ts` ile birebir aynı olmak zorundadır.
 *
 * Terimler docs/language/tr-terminology.md (## diffusion), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır.
 */

const copy: typeof en = {
  draft: true,
  experiment: {
    shapes: ["Halka", "Artı", "Elmas", "Çubuklar"],
    sampleLabel: "Şu anki örnek xₜ",
    estimateLabel: "Temiz örnek tahmini E[x₀|xₜ]",
    posteriorHint:
      "Yüzdeler, bu modelde izin verilen üç ya da dört şeklin sonsal (posterior) olasılıklarını gösterir. Piksel değerleri ekranda gösterim aralığına kırpılır. Hesaplarda piksel değerleri kırpılmadan kullanılır.",
    noiseStep: "Gürültü adımı t (değiştirirsen deney yeniden başlar)",
    reverseStep: "Bir ters adım at",
    finish: "Kalan ters adımları hesapla",
    newSeed: "Yeni tohum (seed)",
    startFromNoise: "Yalnızca gürültüyle başla",
    excludeSource: "Kaynak şekli önsel dağılımdan çıkar",
    stepsLeft: "Kalan ters adım sayısı",
    signalFraction: "Sinyal payı ᾱ",
    sourceShape: "Kaynak şekli seç",
    sourceLabel: "İleri süreçte gürültü eklenen şekil",
    caption:
      "İleri süreçte xₜ = √ᾱ x₀ + √(1−ᾱ) ε bağıntısıyla gürültü eklenir. Ters süreç, şu anki örnekten temiz örneği tahmin eder ve aynı girdilerle aynı sonucu veren bir DDIM adımı uygular. Ters adım, şu anki örneği ve izin verilen şekilleri kullanır. Örneğin hangi şekilden üretildiği ve ilk eklenen gürültü bu adıma verilmez. Kutuyu işaretlediğinde kaynak şekil, izin verilen şekiller listesinden çıkar.",
    modelTitle: "Ters süreç hangi bilgileri kullanır?",
    modelBody:
      "Bu deneyde bir yapay sinir ağı eğitilmez. Model, Gauss gürültüsü ve izin verilen şekillere eşit olasılık veren bir önsel dağılım varsayımıyla sonsal ortalamayı tam olarak hesaplar. Başlangıçta dört şekle izin verilir. Kaynak şekli çıkarırsan üç şekil kalır. Eğitilen diffusion modelleri gürültü gidericiyi veriden öğrenir. Bu model yalnızca önsel dağılımdaki şekillerden görüntü hesaplar. Yeni nesneler üretemez, metinden görüntü üretemez ve fotoğraf oluşturamaz. Yalnızca gürültüyle başlamak, ileri sürecin sonundaki (t = 60) dağılımı yaklaşık olarak temsil eder. Son ters adımdaki örnek, şekillerin sonsal olasılıklarla ağırlıklandırılmış ortalamasıdır.",
  },
  recap: {
    lessons: [
      "Ters süreç şu anki örneği ve önsel dağılımı kullanır; gizlenen özgün görüntüyü kullanmaz.",
      "Önsel dağılımı değiştirmek, aynı başlangıç noktasından (aynı şekil ve tohumla t = 35) yeniden kurulan görüntüyü değiştirebilir.",
      "Bu sonlu analitik model gürültü gidermeyi gösterir; yapay sinir ağı eğitmez.",
    ],
  },
  tour: {
    intro: "Gürültü ekle, sonra önsel dağılımın ters adımları nasıl yönlendirdiğine bak.",
    stages: {
      experiment: {
        compare:
          "Soldaki panel şu anki örnek. Sağdaki panel, izin verilen şekillerden hesaplanan temiz örnek tahmini.",
        noise: "Gürültüyü artır. Bu, ileri deneyi seçilen adımda baştan başlatır.",
        step: "Gerçek bir ters adım at. Özgün görüntü ve özgün gürültü bu hesaba verilmez.",
        prior:
          "Kaynak şekli önsel dağılımdan çıkar; deney aynı şekil ve tohumla t = 35'ten yeniden başlar. Sonra tekrarla. Daha çok adım, önsel dağılımda olmayan bilgiyi geri getirmez.",
        finish:
          "Kalan ters adımları hesapla; tahmin edilen görüntüyü ve sonsal olasılık çubuklarını karşılaştır.",
      },
    },
  },
  study: {
    topics: {
      visual: "Görsel başlangıç",
      foundations: "Matematiksel temeller",
      practice: "Kur ve örnek üret",
    },
    notes: {
      "hf-ddim":
        "DDIM'in örnekleri gürültü giderme tahminlerinden nasıl güncellediğini anlatır; bu lab eğitilmiş bir ağ yerine dört şekilli analitik bir sonsal dağılım kullanır.",
      "welch-diffusion":
        "Görüntü üretiminin görsel bir anlatımıyla başla. Videodaki metin ve video modelleri bu lab'ın dört şekilli önsel dağılımının çok ötesine geçer.",
      "hf-diffusion-video":
        "Hugging Face kursunun bağlantı verdiği notebook anlatımını izle. Lab'daki gürültü ve ters adım kontrollerini eğitilmiş bir gürültü gidericiyle ilişkilendir.",
      "diffusion-tutorial":
        "İleri bozulmadan ters örneklemeye kadar denklemleri izle; lab'dan sonra daha derin bir matematiksel adım.",
      "ddpm-paper":
        "Sabit ileri süreci öğrenilen ters süreçten ayırmak için özgün DDPM formülasyonunu oku.",
      "ddim-paper":
        "Bu lab'ın ters güncellemesinin dayandığı deterministik örnekleme yapısını oku; buradaki gürültü giderici eğitilmiş bir ağ değil, analitiktir.",
      "hf-diffusion-course":
        "Gerçek bir diffusion modeli eğitmek için kurs notebook'larını izle; bu lab'dan farklı olarak bir Python ortamı gerektirir.",
      "annotated-diffusion":
        "PyTorch uygulamasını gürültü planından U-Net eğitimine ve örneklemeye kadar izle. Giriş kaynaklarından sonra okunması önerilir.",
      "udl-book":
        "Yazarın sitesindeki ücretsiz kitabı aç ve diffusion modelleri bölümünü bul. Matematik gerektirir; lab'ın analitik gürültü gidermesini eğitilmiş bir modelin gürültü tahminiyle karşılaştır.",
    },
  },
};
export default copy;
