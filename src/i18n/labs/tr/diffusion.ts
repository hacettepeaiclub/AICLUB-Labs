const copy = {
  draft: true,
  recap: {
    lessons: [
      "Ters süreç gizli kaynağı değil, mevcut örneği ve önbilgisini kullanır.",
      "Aynı gürültülü girdide önbilgiyi değiştirmek farklı bir sonuç verebilir.",
      "Bu sonlu analitik model denoising fikrini gösterir; sinir ağı eğitmez.",
    ],
  },
  tour: {
    intro: "Gürültü ekle; ardından önbilginin ters adımları nasıl yönlendirdiğini keşfet.",
    stages: {
      experiment: {
        compare:
          "Solda şu anki gürültülü örnek var. Sağda izin verilen şekillerden hesaplanan temiz örnek tahmini gösteriliyor.",
        noise: "Gürültüyü artır. Bu kontrol ileri deneyi seçtiğin adımda yeniden başlatır.",
        step: "Gerçek bir ters adım at. Hesaplamaya özgün resim veya özgün gürültü verilmez.",
        prior:
          "Asıl şekli önbilgiden çıkar ve yeniden dene. Daha çok adım, bu önbilgide bulunmayan bilgiyi geri getirmez.",
        finish: "Kalan ters adımları hesapla ve izin verilen hangi şeklin kaldığına bak.",
      },
    },
  },
  study: {
    topics: {
      visual: "Görsel başlangıç",
      foundations: "Matematiksel temeller",
      practice: "Kodla kur ve örnekle",
    },
    notes: {
      "hf-ddim":
        "DDIM’in denoising tahminlerinden örnekleri nasıl güncellediği; bu lab eğitilmiş ağ yerine dört şekilli analitik posterior kullanır.",
      "welch-diffusion":
        "Görüntü üretimini görsel bir anlatımla keşfet. Videodaki metin/video modelleri bu labın dört şekilli önbilgisinden daha kapsamlıdır.",
      "hf-diffusion-video":
        "Hugging Face kursunun önerdiği notebook anlatımını izle. Labdaki gürültü ve ters adım kontrollerini eğitilmiş denoiser ile ilişkilendir.",
      "diffusion-tutorial":
        "İleri bozulmadan ters örneklemeye uzanan denklemleri takip et; labdan sonra matematikte derinleşmek için.",
      "ddpm-paper":
        "Sabit ileri süreç ile öğrenilen ters süreci ayırmak için özgün DDPM formülasyonunu oku.",
      "ddim-paper":
        "Labın ters güncellemesinin dayandığı deterministik örnekleme yaklaşımını oku; buradaki denoiser eğitilmiş ağ değil analitik modeldir.",
      "hf-diffusion-course":
        "Gerçek bir diffusion modeli eğitmek için kurs notebooklarını uygula; bu labdan farklı olarak Python ortamı gerekir.",
      "annotated-diffusion":
        "Gürültü planından U-Net eğitimine ve örneklemeye kadar PyTorch kodunu izle. Giriş kaynaklarından sonra okunması önerilir.",
    },
  },
};
export default copy;
