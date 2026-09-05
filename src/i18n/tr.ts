import type { Translation } from "./types";

/**
 * Türkçe.
 *
 * Bu dosya `en.ts` ile aynı şekle sahip olmak zorundadır; eksik ya da fazla bir
 * anahtar derleme hatasıdır.
 *
 * ## Çeviri ilkeleri
 *
 * Metinler İngilizceden kelime kelime çevrilmedi. Hedef, akademik ve teknik
 * açıdan doğru, aynı zamanda okunabilir Türkçe. Cümleler "siz" kipinde ve
 * gereksiz uzatılmadan kuruldu: akademik terminoloji, uzun cümle demek değil.
 *
 * Yerleşik Türkçe karşılığı olan terimler çevrildi (ağırlık, kayıp, gradyan,
 * geri yayılım, çakışma, terslik, derlem). Karşılığı yapay kalan ya da anlam
 * kaymasına yol açan terimler İngilizce bırakıldı: token, tokenizer, BPE, hash,
 * epok. Aynı kavram uygulamanın her yerinde aynı sözcükle karşılanıyor.
 *
 * Sayı biçimlerine dikkat edildi: Türkçede yüzde işareti sayıdan önce gelir
 * (%50) ve sayıdan sonra gelen ad çoğul eki almaz ("5 token", "5 tokenlar"
 * değil).
 */
export const tr: Translation = {
  shell: {
    skipToContent: "İçeriğe geç",
    brand: "AI Club",
    brandSuffix: "Labs",
    primaryNav: "Ana gezinme",
    allLabs: "Tüm laboratuvarlar",
    breadcrumb: "Sayfa yolu",
    backToLabs: "← Tüm laboratuvarlar",
    footerTagline:
      "AI Club Labs — bilgisayar bilimini üzerinde oynayarak öğrenin.",
    footerRights: (year: number) => `© ${year} AI Club`,
    minutes: (n: number) => `${n} dk`,
    loadingLab: "Laboratuvar yükleniyor",
    openLab: "Laboratuvarı aç →",
  },

  preferences: {
    languageLabel: "Dil",
    english: "EN",
    englishFull: "English",
    turkish: "TR",
    turkishFull: "Türkçe",
    themeLabel: "Tema",
    light: "Açık",
    dark: "Koyu",
  },

  home: {
    kicker: "AI Club Labs",
    title: "Bilgisayar biliminin ardındaki fikirlerle oynayın.",
    lede: "Algoritmalara, yapay sinir ağlarına ve hesaplamanın işleyişine doğrudan dokunabileceğiniz etkileşimli deneyler. Ders anlatımı yok; yalnızca çevirebileceğiniz kollar var.",
    experiments: "Deneyler",
    emptyTitle: "İlk deneyler hazırlanıyor.",
    emptyBody:
      "Altyapı hazır — laboratuvarlar kendilerini kaydeder ve burada otomatik olarak görünür.",
  },

  notFound: {
    title: "Böyle bir laboratuvar henüz yok.",
    body: "Belki hâlâ bir tahtanın üzerinde duran bir fikirdir.",
    back: "Tüm laboratuvarlara dön",
  },

  category: {
    algorithms: "Algoritmalar",
    "data-structures": "Veri Yapıları",
    "machine-learning": "Makine Öğrenmesi",
    "neural-networks": "Yapay Sinir Ağları",
    systems: "Sistemler",
    theory: "Kuram",
  },

  difficulty: {
    intro: "giriş",
    intermediate: "orta",
    advanced: "ileri",
  },

  common: {
    run: "Çalıştır",
    pause: "Duraklat",
    step: "Adımla",
    reset: "Sıfırla",
    clear: "Temizle",
    startOver: "Baştan başla",
    tryAgain: "Yeniden deneyin",
    solved: (done: number, total: number) => `${total} görevden ${done} tanesi çözüldü`,
    recapTitle: "Bugün öğrendikleriniz",
    controlsLabel: "Benzetim denetimleri",
    keyboardHint: "Grafik odaktayken",
  },

  labs: {
    // ---------------------------------------------------------- hash ----
    "hash-playground": {
      title: "Hash Laboratuvarı",
      description: "Tek bir karakteri değiştirin. Her şeyin değiştiğini görün.",
      inputLabel: "Bir şeyler yazın",
      soundOn: "Ses açık",
      soundOff: "Ses kapalı",
      turnSoundOn: "Sesi aç",
      turnSoundOff: "Sesi kapat",
      inputPlaceholder: "merhaba dünya",
      emptyNote: "Boş bir metnin bile bir hash değeri vardır.",
      lengthNote: (chars: number) => `Girdi ${chars} karakter — çıktı 256 bit. Her zaman.`,
      liveHashing: "Canlı özetleme",
      digestBits: "64 onaltılık · 256 bit",
      hoverPair: "İçini görmek için bir çiftin üzerine gelin",
      copy: "Kopyala",
      copied: "Kopyalandı ✓",
      hashCopied: "Hash kopyalandı",
      bitsChangedLabel: "bit değişti",
      copyHash: "Hash değerini panoya kopyala",

      avalanche: {
        kicker: "Çığ etkisi",
        title: "Tek bir tuş her şeyi baştan yazar.",
        lede: "Son düzenlemenizden önceki ve sonraki hash değerlerini karşılaştırın. Girdi neredeyse hiç kımıldamadı; çıktı tanınmaz hâle geldi.",
        before: "Önce",
        after: "Sonra",
        changed: (n: number) => `256 bitin ${n} tanesi değişti`,
        expected: "Beklenen: %50",
        editPrompt: "Yukarıdaki metinde bir karakter değiştirin.",
      },

      bits: {
        kicker: "Bit düzeyinde",
        title: "Hash değeriniz, bit bit.",
        lede: "256 bitin tamamı, 16×16'lık bir ızgara olarak. Yukarıda yazmayı sürdürün ve dalgayı izleyin. Tek bir biti görmek için herhangi bir kareye gelin.",
        bitLabel: (index: number, value: number) => `Bit ${index}: ${value}`,
      },

      properties: {
        kicker: "Neden işe yarıyor",
        title: "Dört özellik, tek bir güç.",
        lede: "Az önce gördüğünüz her şey bu dört güvenceden doğuyor.",
        items: {
          deterministic: {
            title: "Deterministik",
            top: "Aynı girdi",
            bottom: "Aynı çıktı",
            detail:
              "“hello” metnini bugün, yarın ya da dünyadaki herhangi bir makinede özetleyin — tam olarak aynı 64 karakteri elde edersiniz.",
          },
          fixedLength: {
            title: "Sabit uzunluk",
            top: "Bir harf ya da bir kütüphane",
            bottom: "Her zaman 256 bit",
            detail: "Girdi istediği kadar büyük olabilir. Çıktı ne büyür ne küçülür.",
          },
          oneWay: {
            title: "Tek yönlü",
            top: "Hesaplaması kolay",
            bottom: "Tersine çevirmesi olanaksız",
            detail:
              "Bir hash hesaplamak mikrosaniyeler sürer. Peki hash değerinden girdiyi geri elde etmek? Denemekten başka bilinen bir yol yok.",
          },
          avalanche: {
            title: "Çığ etkisi",
            top: "Küçücük bir değişiklik",
            bottom: "Baştan aşağı farklı bir sonuç",
            detail:
              "Tek bir karakteri değiştirin; 256 bitin yaklaşık yarısı onunla birlikte değişir ve yeni hash tanınmaz olur.",
          },
        },
      },

      usage: {
        kicker: "Gerçek hayatta",
        title: "Bugün hash kullandınız. Muhtemelen binlerce kez.",
        tablist: "Özetleme fonksiyonlarının gerçek kullanımları",
        replay: "Tekrar oynat",
        replayAnimation: "Animasyonu tekrar oynat",
        items: {
          git: {
            label: "Git",
            headline: "Her commit bir hash değeridir",
            body: "Git, her commit'i içeriğinin ve bir önceki commit'in hash değerinin özetiyle tanımlar. Geçmişteki herhangi bir satırı değiştirin; ondan sonraki bütün hash değerleri değişir — müdahale anında görünür olur.",
            steps: ["file.txt", "SHA-256", "commit a3f9c21", "✓ geçmiş doğrulandı"],
          },
          passwords: {
            label: "Parolalar",
            headline: "Sunucular parolanızı saklamaz",
            body: "Sakladıkları şey, parolanın (tuzlanmış) hash değeridir. Girişte parolanız yeniden özetlenir ve iki hash karşılaştırılır. Veritabanı sızsa bile tek yönlülük sayesinde saldırganın elinde parolalar değil, hash değerleri olur.",
            steps: [
              "hunter2",
              "SHA-256 + tuz",
              "veritabanı",
              "saldırgan veritabanını çalar",
              "✗ geri çeviremez",
            ],
          },
          https: {
            label: "HTTPS",
            headline: "Hash, bağlantıyı dürüst tutar",
            body: "TLS, sertifikaları parmak iziyle tanımlamak ve verinin yolda değiştirilmediğini doğrulamak için hash kullanır. Tek bir baytın değişmesi hash'i bozar — yani müdahale gizlenemez.",
            steps: ["mesaj", "SHA-256", "imza", "✓ varışta doğrulandı"],
          },
          blockchain: {
            label: "Blok zinciri",
            headline: "Her blok bir öncekini özetler",
            body: "Bir blok, kendinden önceki bloğun hash değerini içerir ve bloklar böylece birbirine zincirlenir. Eski bir bloğu değiştirin; sonraki bütün hash değerleri bozulur — defteri müdahaleye karşı görünür kılan şey budur. Madencilik ise belirli bir eşiğin altında bir hash aramaktır.",
            steps: ["blok 41", "SHA-256", "blok 42", "✓ birini değiştir, hepsi bozulur"],
          },
          signatures: {
            label: "İmzalar",
            headline: "Belgeyi değil, hash değerini imzalarsınız",
            body: "Dijital imzalar, belgenin hash değerini özel bir anahtarla şifreler. Herkes belgeyi yeniden özetleyip imzayı denetleyebilir — böylece kimin imzaladığı ve o günden beri tek bir baytın bile değişmediği kanıtlanır.",
            steps: ["sozlesme.pdf", "SHA-256", "anahtarla imzalandı", "✓ herkes doğrulayabilir"],
          },
        },
      },

      challenge: {
        kicker: "Görev",
        title: "Aynı hash değerini veren iki girdi bulun.",
        lede: "Buyurun deneyin — internetin bütün güvenliği bunu başaramayacağınıza güveniyor.",
        inputA: "Girdi A",
        inputB: "Girdi B",
        rounds: "Turlar",
        identical:
          "İki girdi de birebir aynı; dolayısıyla hash değerleri tanım gereği eşleşiyor. Çakışma için iki farklı girdi gerekir.",
        matching: (n: number) =>
          n === 0 ? "Baştan hiçbir karakter eşleşmiyor." : `Baştan ${n} karakter eşleşiyor.`,
        odds: (r: number) => `${r} olasılıkta 1`,
        roundLabel: (r: number) => `T${r}`,
      },

      recap: {
        lessons: [
          "Deterministik — aynı girdi, her seferinde aynı hash",
          "Tek yönlü — hesaplaması kolay, geri dönüşü yok",
          "Sabit uzunluk — girdi ne olursa olsun her zaman 256 bit",
          "Çığ etkisi — tek bir karakter bitlerin yarısını değiştirir",
          "Gerçek kullanımlar — Git, parolalar, HTTPS, blok zincirleri, imzalar",
        ],
        footer:
          "Yukarı kaydırıp yazmayı sürdürün — çığ etkisi hiç eskimiyor.",
      },
    },

    // -------------------------------------------------------- neural ----
    "neural-playground": {
      title: "Yapay Sinir Ağı Laboratuvarı",
      description: "İki tür nokta çizin. Bir ağın onları ayırt etmeyi öğrenişini izleyin.",
      liveTraining: "Canlı eğitim",

      canvasLabel: (points: number, accuracy: number) =>
        `İki sınıfta ${points} nokta. Ağ şu anda eğitim noktalarının %${accuracy} kadarını doğru biliyor; gölgeli arka plan ise diğer her yerde tahmin ettiği sınıf.`,
      datasets: {
        gauss: { label: "İki küme", hint: "Tek bir doğru yeterli." },
        circle: { label: "Çember", hint: "Eğri gerekiyor — hiçbir doğru bunu yapamaz." },
        xor: { label: "XOR", hint: "Klasik: gizli katman olmadan çözülemez." },
        spiral: { label: "Spiral", hint: "Zorlu. Nöron ve sabır gerekir." },
      },
      classA: "A sınıfı",
      classB: "B sınıfı",
      keyboardHint: { trainPause: "eğitir veya duraklatır ·", restart: "ağırlıkları sıfırlayıp yeniden başlatır" },
      layersCaption: {
        solved:
          "Düz ağ yazı tura düzeyinde takılı kaldı: hiçbir doğru bu dört köşeyi ayıramaz. Gizli katman sınırı büker ve problem ortadan kalkar.",
        idle: "İkisini yan yana çalıştırın ve soldakinin nerede pes ettiğini izleyin.",
      },
      layersPanels: {
        flat: { title: "Gizli katman yok", subtitle: "İki girdi doğrudan çıktıya bağlı — tek bir nöron." },
        deep: { title: "Tek gizli katman", subtitle: "Aynı yapı, aralarında dört nöronla." },
      },
      descentNote: {
        overshoot:
          "Hedefi aştı. Her adım dibin ötesine sıçrayıp karşı duvarda daha yukarıya iniyor — kayıp patlıyor.",
        deep: "En derin vadiye yerleşti. Sağlıklı bir eğitim böyle görünür.",
        shallow:
          "Yerleşti — ama sağdaki sığ çukura. Gradyan inişi yalnızca ayağının altındaki eğimi görür, manzaranın tamamını asla.",
        rolling: "Teğet doğrusunu izleyin: adımın elindeki tek bilgi onun dikliği.",
      },
      neuronLabel: (w1: string, w2: string, bias: string) =>
        `Tek bir nöronun girdi düzlemi üzerindeki çıktısı; ağırlıklar ${w1} ve ${w2}, bias ${bias}.`,
      solvedBadge: "Çözüldü",
      notYet: "Henüz değil",
      loopCards: {
        forward: { headline: "Bir tahmin" },
        loss: { headline: "Ne kadar yanıldı?" },
        backprop: { headline: "Suç kimde?" },
        descent: { headline: "Her şeyi yokuş aşağı it" },
      },
      playground: {
        draw: "Çiz",
        data: "Veri",
        noise: "Gürültü",
        hiddenLayers: "Gizli katman",
        neuronsPerLayer: "Katman başına nöron",
        activation: "Aktivasyon",
        learningRate: "Öğrenme oranı",
        regularization: "Düzenlileştirme (L2)",
        speed: "Hız",
        train: "Eğit",
        pause: "Duraklat",
        clearPoints: "Temizle",
        newSample: "Yeni örneklem",
        insideTitle: "Ağın içeriden görünüşü",
        insideBody:
          "Aynı ağ, ikinci bir bakış. Her kare, tek bir nöronun bütün girdi düzlemi üzerindeki kendi yanıtıdır — bir önceki katmanın kurduğu öznitelikler ve bir sonraki katmanın elinde bulunan malzeme.",
        canvasLabel: "Karar yüzeyi ve üzerine çizilmiş eğitim verisi.",
        playPause: "Boşluk",
      },

      stats: {
        epoch: "Epok",
        loss: "Kayıp",
        trainAcc: "Eğitim doğr.",
        testAcc: "Test doğr.",
        curveLabel: "Son birkaç saniyedeki eğitim kaybı, logaritmik ölçekte.",
        announce: (percent: number) => `Eğitim doğruluğu yüzde ${percent}.`,
      },

      neuron: {
        kicker: "Sonuna kadar yakınlaşın",
        title: "Bir nöron sandığınızdan küçüktür.",
        lede: "Belleği yok, mantığı yok, hiçbir marifeti yok. Üç sayı ve bir ezme işlemi — bütün alanın üzerine kurulduğu birim bundan ibaret.",
        weight1: "x₁ ağırlığı",
        weight2: "x₂ ağırlığı",
        bias: "Bias",
        activation: "Aktivasyon",
        note: "Yapamadığınız şeye dikkat edin: bu üç kaydırıcıyı nasıl çekerseniz çekin, sınır düz bir çizgi olarak kalır. Tek bir nöronun sınırı budur — ve bir sonraki bölümün var olma nedeni.",
        canvasLabel: "Tek bir nöronun girdi düzlemi üzerindeki çıktısı.",
        activations: {
          tanh: "−1…1 aralığına ezer. Düzgün, simetrik, güvenli bir başlangıç.",
          relu: "Pozitifleri geçirir, negatifleri düzler. Hızlı ve günümüzün varsayılanı.",
          sigmoid: "0…1 aralığına ezer. Tarihsel bir seçim; öğrenmeyi tıkamaya eğilimli.",
        },
      },

      layers: {
        kicker: "Katmanlar neden gerekli",
        title: "Yapay zekâyı on yıl durduran dört nokta.",
        lede: "XOR: karşılıklı köşelere yerleşmiş iki sınıf. Tek bir nöron bunları ayıramaz ve 1969'da yapılan bu saptama alanı neredeyse bitiriyordu. Çözümün tamamı tek bir gizli katman.",
        noHidden: "Gizli katman yok",
        oneHidden: "Tek gizli katman",
        accuracy: "Doğruluk",
        trainBoth: "İki ağı da eğit",
        trainBothShort: "İkisini eğit",
        pauseBoth: "İkisini de duraklat",
        startOver: "Baştan başla",
        caption: "İkisini yan yana çalıştırın ve soldakinin nerede pes ettiğini izleyin.",
      },

      descent: {
        kicker: "Nasıl öğreniyor",
        title: "Yokuş aşağı, her seferinde küçük bir adım.",
        lede: "Öğrenme bir sezgi anı değildir. Gradyanın tersi yönde ilerleyen, bir yamaç üzerindeki bir toptur — ve her şeyi belirleyen, adımlarının büyüklüğüdür.",
        learningRate: "Öğrenme oranı",
        roll: "Yuvarla",
        oneStep: "Tek adım",
        weight: "ağırlık",
        loss: "kayıp",
        slope: "eğim",
        nextStep: "sonraki adım",
        steps: "adım",
        curveLabel: (w: string, l: string, s: string) =>
          `Kayıp eğrisi; top ${w} ağırlığında, kayıp ${l}, eğim ${s}.`,
      },

      loop: {
        kicker: "Döngü",
        title: "Dört adım, işe yarayana kadar tekrarlanır.",
        lede: "Şimdiye kadar izlediğiniz her şey, saniyede binlerce kez çalışan şu dört aşamadan ibaret.",
        cards: {
          forward: {
            title: "İleri geçiş",
            body: "Her nöron girdilerini ağırlıklarıyla çarpar, bir bias ekler ve sonucu ezer. Bunu katman katman tekrarlayın; içeri giren bir nokta, dışarı çıkan bir tahmine dönüşür.",
          },
          loss: {
            title: "Kayıp",
            body: "Tahmini gerçek etiketle karşılaştırın ve farkın karesini alın. Bütün ağ için tek bir sayı — ve ağın küçültmeye çalıştığı yegâne şey.",
          },
          backprop: {
            title: "Geri yayılım",
            body: "Hatayı zincir kuralıyla katmanlar boyunca geriye taşıyın. Her bir ağırlık, hataya ne kadar katkıda bulunduğunu öğrenir: kendi gradyanını.",
          },
          descent: {
            title: "Gradyan inişi",
            body: "Her ağırlığı kendi gradyanının tersi yönde küçük bir adım kaydırın. Öğrenme oranı, o adımın büyüklüğüdür. Sonra bunu binlerce kez yineleyin.",
          },
        },
      },

      challenge: {
        kicker: "Görev",
        title: "Spirali olabildiğince az nöronla çözün.",
        lede: "On altı nöronla herkes çözer. Asıl soru, ağ şekli tutamaz hâle gelmeden önce kaça kadar inebildiğiniz.",
        objective: "Hedef",
        objectiveBody: (accuracy: number) =>
          `Spiralde %${accuracy} test doğruluğuna ulaşın. Sonra aynısını daha az nöronla yapın.`,
        hiddenLayers: "Gizli katman",
        neuronsPerLayer: "Katman başına nöron",
        learningRate: "Öğrenme oranı",
        train: "Eğit",
        pause: "Duraklat",
        newAttempt: "Yeni deneme",
        yourBest: "En iyiniz",
        none: "Henüz yok.",
        best: (neurons: number, epoch: number) =>
          `${neurons} nöron, ${epoch.toLocaleString("tr-TR")}. epokta çözüldü.`,
        totalNeurons: (n: number) => `${n} nöron`,
        solvedAnnounce: (neurons: number) => `${neurons} nöronla çözüldü.`,
      },

      recap: {
        lessons: [
          "Bir nöron, ağırlıklı bir toplam ve bir ezme işlemidir — tek başına yalnızca düz bir çizgi çizebilir",
          "Gizli katmanlar o çizgiyi büker; XOR bir gizli katman olmadan çözülemez",
          "Her nöron kendi özniteliğini öğrenir, sonraki katman da bunları birleştirir",
          "Kayıp ağın ne kadar yanıldığını söyler; geri yayılım ise hangi ağırlığın sorumlu olduğunu",
          "Gradyan inişi her ağırlığı yokuş aşağı iter — öğrenme oranı da adımın büyüklüğüdür",
          "Adım çok küçükse sürünür, çok büyükse hedefi aşar; hiçbiri manzaranın tamamını görmez",
        ],
        footer:
          "Az önce izlediğiniz her şey 300 satırlık sıradan aritmetikti. Bugünün yapay zekâsının ardındaki modeller de aynı dört adımdan oluşuyor — yalnızca çok daha fazla ağırlıkla.",
      },
    },

    // --------------------------------------------------- pathfinding ----
    pathfinding: {
      title: "Yol Bulma",
      description: "Engeller çizin; BFS, Dijkstra ve A* algoritmalarının yol arayışını izleyin.",
      findTheWay: "Yolu bulun",
      algorithm: "Algoritma",
      draw: "Çiz",
      map: "Harita",
      tools: { wall: "Engel", mud: "Çamur", erase: "Sil", start: "Başlangıç", goal: "Hedef" },
      legend: {
        wall: "engel",
        frontier: "sınır",
        settled: "kesinleşen",
        path: "yol",
        mud: "çamur",
      },
      metrics: {
        explored: "İncelenen",
        path: "Yol",
        cost: "Maliyet",
        noPath: "Yol yok",
      },
      steps: (n: number) => `${n} adım`,
      gridLabel: (walls: number, mud: number, state: string) =>
        `Düzenlenebilir ızgara. Engel: ${walls}. Çamurlu hücre: ${mud}. ${state}`,
      gridHelp:
        "Çizmek için ızgaranın üzerinde sürükleyin. Izgara odaktayken yön tuşları hareket ettirir, Boşluk boyar.",
      gridHelpFull: {
        drag: "Çizmek veya silmek için ızgarada sürükleyin.",
        or: "veya",
        toMove: "işaretlerini sürükleyerek taşıyın. Izgara odaktayken yön tuşları imleci hareket ettirir,",
        toggles: "bir hücreyi değiştirir,",
        drops: "ise işaret bırakır.",
      },
      gridSummary: (cols: number, rows: number, start: string, goal: string, walls: number, mud: number, algorithm: string, result: string) =>
        `Yol bulma ızgarası, ${cols} sütun × ${rows} satır. Başlangıç: ${start}. Hedef: ${goal}. Engel: ${walls}. Çamurlu hücre: ${mud}. Algoritma: ${algorithm}. ${result}`,
      status: {
        solved: (explored: number, steps: number, cost: number) =>
          `Çözüldü: ${explored} hücre incelendi, yol ${steps} adım, maliyet ${cost}.`,
        unreachable: (explored: number) => `Yol yok. ${explored} hücre incelendi.`,
        running: (explored: number) => `Aranıyor. Şu ana kadar ${explored} hücre incelendi.`,
        notStarted: "Başlatılmadı.",
        gridReset: "Izgara sıfırlandı.",
        gridCleared: "Izgara temizlendi.",
        selected: (algorithm: string) => `${algorithm} seçildi.`,
        loaded: (map: string) => `${map} yüklendi.`,
      },
      row: (row: number, col: number) => `satır ${row}, sütun ${col}`,
      intro: {
        caption:
          "Birkaç engel çizin, sonra Çalıştır'a basın. Aramanın gerçekte nereye gittiğini izleyin — hedefin olmadığı her yer dâhil.",
      },
      bfs: {
        kicker: "Düşünürken izleyin",
        title: "Çizgiler hâlinde değil, katmanlar hâlinde yayılır.",
        lede: "Adım adım ilerleyin. Halkalı hücreler bilinen ama henüz ziyaret edilmemiş hücrelerdir — sınır. Dolu hücreler ise kesinleşmiştir: arama, her birine kaç hamlede ulaşıldığını bilir ve bir daha oraya bakmaz.",
        caption:
          "Hücreleri ilk giren ilk çıkar sırasıyla ele almak işin tamamı: bu, onların uzaklık sırasına göre kesinleşmesini sağlar, dolayısıyla hedefe ulaşan ilk rota en kısasıdır. Buna genişlik öncelikli arama denir.",
      },
      cost: {
        kicker: "Uzaklık maliyet değildir",
        title: "Bazı zeminlerde ilerlemek daha yavaştır.",
        lede: "Çamura girmenin maliyeti 5, açık zeminin 1. Önce BFS'i, sonra Dijkstra'yı çalıştırın ve ızgaranın altındaki iki sayıyı karşılaştırın.",
        caption:
          "BFS yine en az hamleyi yapıyor — doğruca bataklığın içinden. Dijkstra daha çok adım atıyor ama daha az ödüyor; çünkü her seferinde en yakın hücreyi değil, bildiği en ucuz hücreyi kesinleştiriyor.",
      },
      astar: {
        kicker: "Aramaya bir ipucu verin",
        title: "Aynı doğru cevap, çok daha az arama.",
        lede: "Dijkstra hedefin nerede olduğunu bilmez, bu yüzden her yöne eşit yayılır. A* ise kalan uzaklık için bir tahmin ekler ve onu izler: f = g + h; burada g şu ana kadarki maliyet, h ise tahmindir.",
        caption:
          "Aynı yol, aynı maliyet — İncelenen sayısına bakın. Buradaki tahmin Manhattan uzaklığı; dört yönlü bir ızgarada kalan mesafeyi asla olduğundan fazla gösteremez ve A*'ın ona güvenerek hiçbir şeyden ödün vermemesinin nedeni tam olarak budur.",
      },
      challenge: {
        kicker: "Görev",
        title: "Aynı cevap, daha az iş.",
        lede: "Üç sabit harita. Her biri hem en ucuz yolu hem de bütçeden fazla hücre kesinleştirmeyen bir arama istiyor. Bunlardan biri tek başına kolay; asıl mesele ikisini birden sağlamak.",
        mazeLabel: (title: string, cols: number, rows: number, cost: number, budget: number, algorithm: string) =>
          `${title}: sabit ${cols} × ${rows} labirent. Hedefe ${cost} olan en uygun maliyetle ulaşın ve en çok ${budget} hücre kesinleştirin. Geçerli algoritma: ${algorithm}.`,
        bothAtOnce: "İkisi birden",
        beaten: (done: number, total: number) => `${total} haritadan ${done} tanesi geçildi`,
        costMustBe: "maliyet şu olmalı",
        exploredAtMost: "en çok incelenecek",
        maps: {
          swamp: {
            title: "Bataklık",
            hint: "En hızlı geçiş, en ucuz geçiş değildir.",
          },
          "open-ground": {
            title: "Açık arazi",
            hint: "Burada hiçbir şey pahalı değil. Tasarruf edilecek tek şey emek.",
          },
          "wrong-door": {
            title: "Yanlış kapı",
            hint: "Hedef yakın. İçeri giden yol değil.",
          },
        },
        budget: (cost: number, budget: number) =>
          `En ucuz yolun maliyeti ${cost}. En çok ${budget} hücre kesinleştirin.`,
        verdict: {
          unreachable: "Bu arama hedefe hiç ulaşamadı.",
          solved: (cost: number, explored: number) =>
            `Çözüldü. Maliyet ${cost} ve yalnızca ${explored} hücre kesinleşti.`,
          overBudget: (explored: number, budget: number) =>
            `Yol en uygun olanı — ama ${explored} hücre incelediniz. Bütçe: ${budget}.`,
          suboptimal: (explored: number, cost: number, optimal: number) =>
            `Yalnızca ${explored} hücre incelediniz, ancak yolunuzun maliyeti ${cost}. En uygun maliyet: ${optimal}.`,
          both: (cost: number, optimal: number, explored: number, budget: number) =>
            `Yolunuzun maliyeti ${cost}; en uygunu ${optimal}. Ayrıca ${explored} hücre incelediniz; bütçe ise ${budget}.`,
        },
      },
      recap: {
        lessons: [
          "Bir arama hedefe doğru yönelmez — hedef, ulaştığı şeylerden biri olana kadar yayılır",
          "BFS hücreleri ilk giren ilk çıkar sırasıyla alır; böylece onları en az hamle sırasına göre kesinleştirir",
          "Zemin tekdüze olmaktan çıktığı anda en az hamle ile en ucuz rota farklı sorulardır",
          "Dijkstra her zaman bildiği en ucuz hücreyi kesinleştirir; cevabının en ucuz olmasının nedeni budur",
          "A* kalan mesafe için bir tahmin ekler ve çabasını hedefin bulunduğu yöne harcar",
          "Tahmin mesafeyi asla olduğundan fazla göstermez; bu yüzden A* daha hızlı ulaşırken hiçbir şeyden ödün vermez",
        ],
        footer:
          "Telefonunuzun bugüne kadar önerdiği her güzergâh buna benzer bir döngüden çıktı — bir sınır, kesinleşmiş bir küme ve sıradaki hücreyi seçen bir kural.",
      },
    },

    // ------------------------------------------------------- sorting ----
    "sorting-race": {
      title: "Sıralama Yarışı",
      description:
        "Veriyi siz çizin; her algoritmanın onu sıralamak için ne kadar iş yaptığını görün.",
      theRace: "Yarış",
      algorithm: "Algoritma",
      shape: "Biçim",
      puzzle: "Görev",
      sorterA: "Sıralayıcı A",
      sorterB: "Sıralayıcı B",
      sort: "Sırala",
      algorithms: { selection: "Seçmeli Sıralama", insertion: "Eklemeli Sıralama" },
      shapes: {
        almost: "Neredeyse sıralı",
        sorted: "Sıralı",
        random: "Karışık",
        reversed: "Ters",
      },
      metrics: {
        comparisons: "Karşılaştırma",
        moves: "Taşıma",
        disorder: "Düzensizlik",
        questionsAsked: "sorulan soru",
        valuesRelocated: "yeri değişen değer",
        inversions: (n: number) => `${n} terslik`,
      },
      drawHint: "Veriyi yeniden biçimlendirmek için grafiğin üzerinde sürükleyin.",
      keyboardHint: "bir çubuk seçer,",
      keyboardHint2: "yüksekliğini değiştirir.",
      chartLabel: (size: number, algorithm: string, disorder: number, state: string) =>
        `${size} değerden oluşan çubuk grafik. ${algorithm}. Düzensizlik: ${disorder} terslik. ${state}`,
      state: {
        done: (comparisons: number, moves: number) =>
          `${comparisons} karşılaştırma ve ${moves} taşıma ile sıralandı.`,
        running: (comparisons: number, moves: number) =>
          `Sıralanıyor: şu ana kadar ${comparisons} karşılaştırma, ${moves} taşıma.`,
        alreadySorted: "Zaten sıralı. Başlatılmadı.",
        notStarted: "Başlatılmadı.",
        cursor: (index: number, value: number) =>
          `İmleç ${index}. çubukta, değer ${value}.`,
        sorting: "Sıralanıyor.",
        arrayReset: "Dizi sıfırlandı.",
        loaded: (shape: string) => `${shape} yüklendi.`,
        selected: (algorithm: string) => `${algorithm} seçildi.`,
      },
      race: {
        oneButton: "Tek düğme. İkisi de aynı veriden başlıyor.",
        bothDone:
          "Aynı dizi, aynı sonuç — ve biri diğerinin sorduğu soruların çok azını sordu.",
        caption:
          "Aynı dizi, aynı sonuç. Sayaçlar aynı değil ve bu laboratuvarın tamamı işte o farkla ilgili.",
      },
      watch: {
        kicker: "Çalışırken izleyin",
        title: "Biri süpürür. Diğeri parmak ucuyla yürür.",
        lede: "Adım adım ilerleyin. Sıralayıcı A, hiçbir şeyi kımıldatmadan önce her turda dizinin kalanının tamamını tarar. Sıralayıcı B ise tek bir değeri alıp yalnızca gerektiği kadar geriye yürütür.",
        caption:
          "Bunlar Seçmeli Sıralama ve Eklemeli Sıralama. Uzun ve kesintisiz karşılaştırma dizileri birincisine; kısa karşılaştır-kaydır-karşılaştır ritmi ikincisine ait.",
      },
      data: {
        kicker: "Veriyi çizin",
        title: "İş, verinin kendisinde.",
        lede: "Grafiği yeniden biçimlendirmek için üzerinde sürükleyin ya da hazır bir biçim seçin, sonra yeniden sıralayın. Her sayıya ne olduğunu izleyin.",
        caption:
          "Seçmeli Sıralama burada her seferinde tam 496 soru soruyor — sıralı, karışık ya da ters, fark etmiyor; çünkü kalan bütün çiftleri koşulsuz denetliyor. Eklemeli Sıralama'nın sayısı ise çizdiğiniz biçimle birlikte değişiyor.",
      },
      distance: {
        kicker: "Yerinden ne kadar uzakta",
        title: "Mesele kaç tanesinin yanlış olduğu değil.",
        lede: "Sıralı biçimden başlayın. Önce tek bir çubuğu ait olduğu yerden çok uzağa taşıyın; sonra bunun yerine üç çubuğu azıcık oynatın. İkisinin maliyetini karşılaştırın.",
        caption:
          "Terslik, sırası bozuk olan bir çifttir. Bu eklemeli sıralama, kendisine verilen dizideki her terslik için tam olarak bir kaydırma yapar — yani yerinden çok uzaktaki tek bir değer, birkaç küçük hatadan daha pahalıya gelebilir.",
      },
      challenge: {
        kicker: "Görev",
        title: "Neyin ucuz olduğu, neyi saydığınıza bağlı.",
        lede: "Üç sabit dizi. Her birinin bir bütçesi var ve bütçe her zaman aynı sayıyla ilgili değil.",
        budget: "Bütçe",
        beaten: (done: number, total: number) => `${total} görevden ${done} tanesi geçildi`,
        fixedTo: (algorithm: string) =>
          `${algorithm} sabit. Bunun yerine veriyi yeniden biçimlendirin.`,
        goal: (budget: number, unit: string) => `Hedef: en çok ${budget} ${unit}.`,
        chartLabel: (title: string, size: number, disorder: number, goal: string, state: string) =>
          `${title}: ${size} değerden oluşan çubuk grafik. Düzensizlik: ${disorder} terslik. ${goal} ${state}`,
        editsUsed: (used: number, max: number) => `${max} düzenlemeden ${used} tanesi kullanıldı.`,
        finished: (comparisons: number, moves: number) =>
          `${comparisons} karşılaştırma ve ${moves} taşıma ile tamamlandı.`,
        budgetValue: (budget: number, unit: string) => `${budget} ${unit}`,
        editsLeft: (used: number, max: number) => `${max} düzenlemeden ${used} tanesi kullanıldı`,
        units: { comparisons: "karşılaştırma", moves: "taşıma" },
        puzzles: {
          "which-one-cares": {
            title: "Hangisi umursuyor?",
            brief: "Bütçenin izin verdiğinden daha az soru sorarak diziyi sıralayın.",
          },
          "fewest-writes": {
            title: "En az yazma",
            brief: "İstediğiniz kadar soru sorun — yeter ki fazla veri taşımayın.",
          },
          "three-edits": {
            title: "Üç düzenleme",
            brief: "En çok üç çubuğu yeniden biçimlendirin, sonra bütçenin altına inin.",
          },
        },
        verdict: {
          tooManyEdits: (edits: number, max: number) =>
            `${edits} çubuk değiştirdiniz. Değiştirebileceğiniz sayı: ${max}.`,
          overBudget: (used: number, unit: string, budget: number) =>
            `${used} ${unit}. Bütçe: ${budget}.`,
          passed: (used: number, unit: string, budget: number) =>
            `${used} ${unit} ile, ${budget} bütçesinin altında çözüldü.`,
        },
      },
      recap: {
        lessons: [
          "İki algoritma aynı sonuca, birbirinden çok farklı miktarda iş yaparak ulaşabilir",
          "Seçmeli sıralama her turda kalanın tamamını tarar; bu yüzden ne verirseniz verin aynı sayıda soru sorar",
          "Eklemeli sıralama yalnızca gerektiği kadar geriye yürür; bu yüzden maliyeti verinin bir özelliğidir",
          "Ne kadar iş olduğunu belirleyen şey yalnızca girdinin boyutu değil, biçimidir",
          "Terslik, sırası bozuk bir çifttir — bu eklemeli sıralama her terslik için bir kez kaydırma yapar",
          "Tek bir “daha iyi algoritma” yoktur: daha az soru ile daha az yazma farklı hedeflerdir",
        ],
        footer:
          "Gerçek sıralama kütüphaneleri tam olarak buna yaslanır: neredeyse sıralı parçaları eklemeli sıralamaya devrederler, çünkü o biçimde işin neredeyse tamamı zaten yapılmıştır.",
      },
    },

    // ----------------------------------------------------- tokenizer ----
    tokenizer: {
      title: "Tokenizer Laboratuvarı",
      description:
        "Bir tokenizer'ı elinizle eğitin ve ne okuduğunun, neyi söylemenin ucuz olduğunu nasıl belirlediğini görün.",
      honesty:
        "Bu laboratuvar için birkaç kilobaytlık metin üzerinde eğitilmiş küçük bir BPE tokenizer'ı — herhangi bir GPT modelinin kullandığı tokenizer değil.",
      nothingToTokenize: "Henüz tokenleştirilecek bir şey yok.",
      stripSummary: (label: string, count: number, list: string) =>
        `${label}. ${count} token: ${list}`,

      guess: {
        sectionLabel: "Kesikleri tahmin edin",
        heading: "Sizce bu metin nerelerden ayrılıyor?",
        lede: "Bir dil modeli bu cümleyi hiçbir zaman harfler olarak görmez; tam olarak kelimeler olarak da görmez. Onun ne gördüğünü söylemeden önce — cümleyi nerelerden parçaladığını düşünüyorsanız oraları işaretleyin. Sonra sonucu açın.",
        stripLabel: (sentence: string) =>
          `“${sentence}” cümlesi. Nerelerden ayrıldığını düşünüyorsanız işaretleyin. Sol ve sağ yön tuşlarıyla hareket edin, Boşluk ile kesik koyun veya kaldırın.`,
        cellLabel: (character: string, position: number) =>
          `${character} karakterinden önce kes, konum ${position}`,
        theSpace: "boşluk",
        hint: "Bir harfin önünden kesmek için ona dokunun. Şerit odaktayken",
        hintMove: "hareket eder,",
        hintPlace: "kesik koyar.",
        hintSpace: "bir boşluğu gösterir.",
        reveal: "Sonucu aç",
        preparing: "Hazırlanıyor…",
        cutEveryWord: "Her kelimeden kes",
        legendReal: "gerçekte kestiği yer",
        legendImagined: "işaretlediğiniz ama orada olmayan kesik",
        legendMatched: "bunu bildiniz",
        resultOne: (matched: boolean) =>
          `1 kesik işaretlediniz ve bu, gerçek kesiklerden biri ${matched ? "" : "değil"}.`,
        resultMany: (guessed: number, matched: number) =>
          `${guessed} kesik işaretlediniz ve bunlardan ${matched} tanesi gerçek.`,
        resultTail: (actual: number, tokens: number) =>
          `Tokenizer toplam ${actual} kesik yaptı ve geriye ${tokens} parça kaldı.`,
        explain:
          "Kelime değiller. “gardeners” ikiye ayrıldı: “garden” ve “ers”. Nokta tek başına duruyor ve her boşluk, kendisinden sonraki kelimeye ait — aralarında durmuyor.",
        actualLabel: "Cümlenin gerçekte ayrıldığı parçalar",
        announceCleared: "Temizlendi. Kesikleri yeniden işaretleyin.",
        announceEveryWord: "Her kelimenin önüne bir kesik konuldu.",
        describe: (
          guessed: number,
          matched: number,
          imagined: number,
          missed: number,
          actual: number,
          tokens: number,
        ) =>
          guessed === 0
            ? `Hiç kesik işaretlemediniz. Tokenizer ${actual} kesik yaptı ve cümleyi ${tokens} tokene ayırdı.`
            : `${guessed} kesik işaretlediniz. Bunlardan ${matched} tanesi gerçek. ` +
              `${imagined} tanesi orada değil. ${missed} tanesini kaçırdınız. ` +
              `Tokenizer toplam ${actual} kesik yaptı ve cümleyi ${tokens} tokene ayırdı.`,
      },

      train: {
        kicker: "Parçalar nereden geliyor",
        title: "O parçaları kimse seçmedi.",
        lede: "Onlar sayıldı. İşte izlenebilecek kadar küçük bir derlem: Birleştir'e basın, derlemdeki en sık komşu çift geçtiği her yerde tek bir parçaya kaynasın. Sonra sayım yeniden başlar.",
        corpusLabel: "Okuduğu derlem",
        mergeNext: "Sıradaki çifti birleştir",
        trainAll: "Tümünü eğit",
        training: "Eğitiliyor…",
        untouched: (base: number, tokens: number) =>
          `Şu anda her parça tek bir karakter: toplam ${base} parça ve derlemin maliyeti ${tokens} token. En sık geçen çifti birleştirin ve ne olduğunu görün.`,
        merged: (
          index: number,
          left: string,
          right: string,
          frequency: number,
          token: string,
          vocabulary: number,
          tokens: number,
        ) =>
          `${index}. birleştirme: en sık geçen komşu çift ${left} + ${right} idi, ${frequency} kez görüldü. Artık tek bir token: ${token}. Sözlük: ${vocabulary} parça. Derlemin maliyeti ${tokens} token.`,
        exhausted: (merges: number, vocabulary: number) =>
          `Birleştirilecek bir şey kalmadı — artık hiçbir çift birden fazla geçmiyor, dolayısıyla birini kaynaştırmak öğrenmek değil ezberlemek olurdu. ${merges} birleştirmede durdu; sözlük ${vocabulary} parçadan oluşuyor.`,
        explain:
          "İşte byte-pair encoding (BPE) budur. Bütün komşu çiftleri sayın, en sık olanı kaynaştırın, yeniden sayın. Sonunda elde ettiği parçalar onun sözlüğüdür ve her kaynaşma bir birleştirmedir. Kimse ona “·read” bir kelimedir demedi — bu yalnızca ilk dört sayım turunun, her seferinde bir çift olacak şekilde ürettiği şey. Boşluğun daha ilk birleştirmeden itibaren parçaya dâhil olduğuna dikkat edin: öğrendiği parça “read” değil, “·read”. “·every” ise sonuna kadar parçalı kalıyor, çünkü metinde yalnızca bir kez geçiyor.",
        announceFinished:
          "Eğitim tamamlandı. Birden fazla geçen hiçbir çift kalmadı, dolayısıyla birleştirmeye değer bir şey yok.",
        announceFinishedAfter: (merges: number) =>
          `Eğitim ${merges} birleştirmeden sonra tamamlandı.`,
        announceReset: "Derlem sıfırlandı. Henüz hiçbir şey öğrenilmedi.",
      },

      merge: {
        kicker: "Ne kadar öğrendi?",
        title: "“Tek token” değişken bir hedeftir.",
        lede: "Bu tokenizer birkaç kilobaytlık Türkçe okudu. Eğitimini geri sarmak için kaydırıcıyı sürükleyin ve cümleyi dilediğiniz gibi değiştirin. Parçalar her konumda gerçekten yeniden hesaplanır.",
        sentenceLabel: "Cümleniz",
        sentenceHint:
          "Cümleyi değiştirin ya da kendiniz yazın. Türkçe veya İngilizce — tokenizer ikisine de yanıt verir.",
        mergesLearned: "Öğrenilen birleştirme",
        mergesValueText: (merges: number, max: number) => `${max} birleştirmeden ${merges} tanesi`,
        untrained: "Eğitimsiz",
        full: "Tamamı",
        stripLabel: (merges: number) => `Cümleniz, ${merges} birleştirme sonrasında`,
        trainingProgress: (done: number, total: number) =>
          `Tokenizer eğitiliyor… ${total} birleştirmeden ${done} tanesi.`,
        ready: "Tokenizer'ın eğitimi tamamlandı. Birleştirme kaydırıcısını sürükleyin.",
        explain:
          "Sıfır birleştirmede her karakter kendi başına bir tokendir, çünkü tokenizer harflerden başka bir şey bilmiyordur. Sağa doğru sürükleyin ve “·ev · ler · imiz · den” dizisinin önce “·ev · lerimiz · den”e, sonra “·evlerimiz · den”e dönüşmesini izleyin. Bu parçalar Türkçe ekler ve algoritmanın hiçbir yerinde ekin ne olduğu yazmaz — bunlar yalnızca sürekli yan yana çıkan komşular.",
      },

      compare: {
        kicker: "Ne üzerinde eğitildi?",
        title: "Ne okuduysa onu ucuzlatır.",
        lede: "İki tokenizer; aynı algoritma, aynı miktarda eğitim, farklı okuma. İkisine de aynı metni verin ve faturanın nasıl ayrıştığını görün — sonra aradaki farkı kapatan bir cümle yazmayı deneyin.",
        textLabel: "İki tokenizer'ın da aldığı metin",
        textHint:
          "Metni istediğiniz gibi değiştirin. Hiçbir tokenizer'ı, hiç okumadığı bir dilde akıcı kılan bir cümle bulamayacaksınız.",
        trainedOnEnglish: "İngilizce üzerinde eğitildi",
        trainedOnTurkish: "Türkçe üzerinde eğitildi",
        englishCorpus: "birkaç kilobaytlık İngilizce düzyazı",
        turkishCorpus: "birkaç kilobaytlık Türkçe düzyazı",
        tokens: "token",
        cheaper: "Burada daha ucuz — bu, okuduğu bir dil.",
        ratio: (ratio: string) =>
          `Aynı karakterler, aynı algoritma, aynı sayıda birleştirme — ve biri diğerinin ${ratio} katına mal oluyor. Fark, tamamen her birinin okuması için ne verildiğinde.`,
        sampleLoaded: (label: string, words: number, characters: number) =>
          `${label} örneği yüklendi: ${words} kelime, ${characters} karakter.`,
        samples: {
          "tr-sea": "Türkçe",
          "tr-visit": "Türkçe 2",
          "en-room": "İngilizce",
          "en-bread": "İngilizce 2",
        },
      },

      metrics: {
        tokens: "Token",
        characters: "Karakter",
        words: "Kelime",
        merges: "Birleştirme",
      },

      challenge: {
        kicker: "Görev",
        title: "Tek bütçe. Onu kaçırmanın iki yolu.",
        lede: "İlk görevde tokenizer sabit, cümle sizin. İkincisinde cümle sabit, tokenizer sizin. Bunlardan yalnızca biri daha çok uğraşarak çözülebilir.",
        budgetBadge: (budget: number) => `bütçe ${budget} token`,
        rewriteLabel: "Yeniden yazın",
        rewriteHint:
          "Büyük harfler, boşluklar, noktalama ve gereksiz sözcükler tamamen sizin elinizde. Listelenen kelimelerin metinde kalması gerekiyor.",
        rewriteStrip: "Yeniden yazdığınız metin, tokenleştirilmiş hâli",
        fixedLabel: "Cümle (değiştirilemez)",
        fixedStrip: "Cümlenin tokenleştirilmiş hâli",
        trainedOn: "Eğitildiği derlem",
        english: "İngilizce",
        turkish: "Türkçe",
        mergesLearned: "Öğrenilen birleştirme",
        unknownNote: (unknown: number) =>
          `${unknown} parça kesik çizgiyle çevrelenmiş ve ? ile işaretlenmiş — bunlar tokenizer'ın daha önce hiç görmediği karakterler. Sıradan düzyazı okudu ve düzyazı neredeyse tamamen küçük harflerden oluşur.`,
        englishCeiling:
          "İngilizce tokenizer'ın tam olarak eğitilmiş hâli bu — bu cümlede varabileceği en iyi nokta. Eksik olan şey daha fazla eğitim değil.",
        puzzles: {
          "say-it-cheaper": {
            title: "Daha ucuza söyleyin",
            brief:
              "Zorunlu kelimelerin hepsini koruyun ve aynı cümleyi bütçenin altına indirin. Nasıl yazıldığına dair geri kalan her şeyi değiştirebilirsiniz.",
            lesson:
              "Anlamda hiçbir şey değişmedi. Büyük harfler tokenizer'ın hiç öğrenmediği parçalar ve çift boşluk başlı başına bir token.",
          },
          "feed-it-the-right-words": {
            title: "Doğru kelimeleri okutun",
            brief:
              "Bu cümle değiştirilemez. Cümle bütçeye sığana kadar tokenizer'ın ne okuduğunu ve ne kadar eğitildiğini seçin.",
            lesson:
              "İngilizce tokenizer'ı ne kadar eğitirseniz eğitin oraya ulaşamadı. Mesele çaba değil: bir tokenizer yalnızca gerçekten okuduğu bir dilde ucuz olabilir.",
          },
        },
        verdict: {
          untouched: (tokens: number, budget: number) =>
            `Şu hâliyle bu metnin maliyeti ${tokens} token. Bütçe ${budget}.`,
          missingWords: (words: readonly string[]) =>
            `Şunlar hâlâ eksik: ${words.map((w) => `“${w}”`).join(", ")}. Cümlenin tamamının korunması gerekiyor.`,
          overBudget: (tokens: number, budget: number) =>
            `${tokens} token — ${budget} bütçesini ${tokens - budget} aşıyor.`,
          passed: (tokens: number, budget: number) =>
            `${tokens} token, ${budget} bütçesinin içinde.`,
          solvedAnnounce: (message: string) => `Çözüldü. ${message}`,
        },
      },

      recap: {
        lessons: [
          "Bir tokenizer metni kelimelere ayırmaz — sık rastlanan parçalara ayırır",
          "Bu parçalar sayarak öğrenilir: en sık komşu çifti kaynaştır, sonra yeniden say",
          "Kaç birleştirme öğrendiği neyin tek token sayılacağını belirler ve kazancın büyük kısmı başlarda gelir",
          "Baştaki boşluk kendisinden sonraki kelimeye aittir; bu yüzden boşlukların ve büyük harflerin bir bedeli vardır",
          "Aynı cümlenin maliyeti, tokenizer'ın ne üzerinde eğitildiğine göre büyük ölçüde değişir",
          "Türkçe ekler yalnızca gerçekten Türkçe okumuş bir tokenizer için tek token hâline gelir",
        ],
        footer:
          "Gerçek modeller de bu yolla eğitiliyor; çok daha fazla metinle ve karakterler yerine ham baytlar üzerinde — eğitim verisinde az bulunan bir dilde yazmanın, model o dili konuşmayı öğrendikten çok sonra bile pahalı kalmasının nedeni bu.",
      },
    },
  },
};
