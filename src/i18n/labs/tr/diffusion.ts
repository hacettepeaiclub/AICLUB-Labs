const copy = {
  draft: true,
  recap: {
    lessons: [
      "Ters süreç, mevcut görüntüyü ve modele tanımlanan olasılıkları kullanır. Başlangıç görüntüsünü doğrudan okumaz.",
      "Kullanılabilen şekilleri değiştirmek, aynı gürültülü girdiden farklı bir sonuç üretebilir.",
      "Bu sonlu analitik model denoising fikrini gösterir; sinir ağı eğitmez.",
    ],
  },
  tour: {
    intro:
      "Gürültü düzeyini artır, ardından bir ters adım çalıştır. Sonucun kullanılabilen şekillere nasıl bağlı olduğunu karşılaştır.",
    stages: {
      experiment: {
        compare:
          "Solda mevcut gürültülü görüntü var. Sağda, modelin kullanabildiği şekillere göre hesaplanan temiz görüntü tahmini gösteriliyor.",
        noise: "Gürültüyü artır. Bu kontrol ileri deneyi seçtiğin adımda yeniden başlatır.",
        step: "Bir ters adım çalıştır. Bu hesap başlangıç görüntüsünü veya gürültüyü üreten seed’i kullanmaz.",
        prior:
          "Başlangıçtaki şekli seçeneklerden çıkar ve deneyi tekrarla. Ters süreç, modelde olmayan şekli geri getirmek zorunda değildir.",
        finish: "Kalan ters adımları hesapla ve izin verilen hangi şeklin kaldığına bak.",
      },
    },
  },
  study: {
    topics: {
      visual: "Start visually",
      foundations: "Mathematical foundations",
      practice: "Build and sample",
    },
    notes: {
      "hf-ddim":
        "DDIM’in ters adımları nasıl hesapladığını açıklar. Bu lab, eğitilmiş ağ yerine dört şekle dayanan analitik bir tahmin kullanır.",
      "welch-diffusion":
        "Görüntü üretimini görsel bir anlatımla keşfet. Videodaki metin/video modelleri bu labın dört şekilli önbilgisinden daha kapsamlıdır.",
      "hf-diffusion-video":
        "Hugging Face kursunun önerdiği notebook anlatımını izle. Labdaki gürültü ve ters adım kontrollerini eğitilmiş denoiser ile ilişkilendir.",
      "diffusion-tutorial":
        "İleri ve ters sürecin denklemlerini adım adım açıklar. Matematiksel ayrıntılar için bu kaynakla devam edebilirsin.",
      "ddpm-paper":
        "Sabit ileri süreç ile öğrenilen ters süreci ayırmak için özgün DDPM formülasyonunu oku.",
      "ddim-paper":
        "Labın ters güncellemesinin dayandığı deterministik örnekleme yaklaşımını oku; buradaki denoiser eğitilmiş ağ değil analitik modeldir.",
      "hf-diffusion-course":
        "Python notebooklarıyla bir diffusion modeli eğitmeyi gösterir. Uygulamak için ayrı bir Python ortamı gerekir.",
      "annotated-diffusion":
        "Gürültü planından U-Net eğitimine ve örneklemeye kadar PyTorch kodunu izle. Giriş kaynaklarından sonra okunması önerilir.",
    },
  },
};
export default copy;
