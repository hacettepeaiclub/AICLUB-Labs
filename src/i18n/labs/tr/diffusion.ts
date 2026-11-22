import type en from "../en/diffusion";

/**
 * Türkçe metin: diffusion. Şekli `en/diffusion.ts` ile birebir aynı olmak zorundadır.
 * Deneyin geri kalan Türkçe metni src/labs/diffusion/index.tsx içindedir.
 *
 * Terimler docs/language/tr-terminology.md (## diffusion), anlatım kuralları
 * docs/language/tr-style.md dosyasındadır.
 */

const copy: typeof en = {
  draft: true,
  recap: {
    lessons: [
      "Ters süreç şu anki örneği ve önsel dağılımı kullanır; gizlenen özgün görüntüyü kullanmaz.",
      "Önsel dağılımı değiştirmek, aynı gürültülü girdi için yeniden kurulan görüntüyü değiştirebilir.",
      "Bu sonlu analitik model gürültü gidermeyi gösterir; yapay sinir ağı eğitmez.",
    ],
  },
  tour: {
    intro: "Gürültü ekle, sonra önsel dağılımın ters adımları nasıl yönlendirdiğine bak.",
    stages: {
      experiment: {
        compare:
          "Soldaki panel şu anki gürültülü örnek. Sağdaki panel, izin verilen şekillerden hesaplanan temiz örnek tahmini.",
        noise: "Gürültüyü artır. Bu, ileri deneyi seçilen adımda baştan başlatır.",
        step: "Gerçek bir ters adım at. Özgün görüntü ve özgün gürültü bu hesaba verilmez.",
        prior:
          "Kaynak şekli önsel dağılımdan çıkar ve tekrarla. Daha çok adım, önsel dağılımda olmayan bilgiyi geri getirmez.",
        finish: "Kalan ters adımları hesapla ve izin verilen şekillerden hangisinin kaldığına bak.",
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
