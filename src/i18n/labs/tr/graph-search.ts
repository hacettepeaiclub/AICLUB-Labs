import type en from "../en/graph-search";

/** Türkçe metin: graph-search. Şekli `en/graph-search.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Sources",
    astar:
      "Laboratuvarda çalışan A* kurgusunu destekler: şimdiye kadarki maliyet ile sezgisel tahminin toplamına göre sıralanan en-iyi-önce arama ve bu sezgiselin sağlaması gereken kabul edilebilirlik koşulu.",
    dijkstra:
      "Sezgisel kapatıldığında laboratuvarın çalıştırdığı en kısa yol yöntemini ve bu yöntemin varsaydığı negatif olmayan kenar maliyetlerini destekler.",
  },
  findTheWay: "Yolu bul",
  algorithm: "Algoritma",
  draw: "Çiz",
  gridAndKeys: "Harita araçları ve klavye",
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
    "Çizmek için ızgaranın üzerinde sürükle. Izgara odaktayken yön tuşları hareket ettirir, Boşluk boyar.",
  gridHelpFull: {
    drag: "Çizmek veya silmek için ızgarada sürükle.",
    or: "veya",
    toMove: "işaretlerini sürükleyerek taşı. Izgara odaktayken yön tuşları imleci hareket ettirir,",
    toggles: "bir hücreyi değiştirir,",
    drops: "ise işaret bırakır.",
  },
  gridSummary: (
    cols: number,
    rows: number,
    start: string,
    goal: string,
    walls: number,
    mud: number,
    algorithm: string,
    result: string,
  ) =>
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
    question: "İlk olarak hangi kareye bakıyor?",
    caption:
      "Izgaraya engeller çiz ve aramayı çalıştır. Hedefe giden yolun yanında incelenen hücreleri de izle.",
  },
  bfs: {
    kicker: "Watch it think",
    title: "It spreads in layers, not lines.",
    lede: "Birer adım ilerle. Halkalı hücreler sırada bekler, dolu hücrelerin uzaklığı belirlenmiştir. Hücrelerin hangi sırayla işlendiğini incele.",
    caption:
      "Hücreleri ilk giren ilk çıkar sırasıyla ele almak işin tamamı: bu, onların uzaklık sırasına göre kesinleşmesini sağlar, dolayısıyla hedefe ulaşan ilk rota en kısasıdır. Buna genişlik öncelikli arama denir.",
  },
  cost: {
    kicker: "Distance isn't cost",
    title: "Some ground is slower.",
    lede: "Açık zemine giriş 1, çamura giriş 5 maliyetlidir. Aynı haritada BFS ve Dijkstra’yı çalıştır. Adım sayısıyla toplam maliyeti ayrı ayrı karşılaştır.",
    caption:
      "BFS hamle sayısını azaltır. Dijkstra ise birikmiş maliyeti en düşük hücreyi seçer. Bu haritada daha uzun bir rota daha ucuz olabilir.",
  },
  astar: {
    kicker: "Give the search a hint",
    title: "Right answer, far less looking.",
    lede: "A*, şimdiye kadarki maliyete hedefe kalan maliyetin tahminini ekler: f = g + h. Aynı haritada Dijkstra ile karşılaştırıp hangi hücreleri incelediğine bak.",
    caption:
      "En düşük maliyet aynı olsa da seçilen rotalar farklı olabilir. Bu dört yönlü ızgarada Manhattan uzaklığı kalan maliyeti olduğundan büyük tahmin etmez. İncelenen hücre sayısını karşılaştır.",
  },
  challenge: {
    kicker: "The challenge",
    title: "Same answer, less work.",
    lede: "Her haritada hem en ucuz rotayı bul hem de incelenen hücre sınırını aşma. Arama yöntemini ve izin verilen ayarları buna göre seç.",
    mazeLabel: (
      title: string,
      cols: number,
      rows: number,
      cost: number,
      budget: number,
      algorithm: string,
    ) =>
      `${title}: sabit ${cols} × ${rows} labirent. Hedefe ${cost} olan en uygun maliyetle ulaşın ve en çok ${budget} hücre kesinleştirin. Geçerli algoritma: ${algorithm}.`,
    bothAtOnce: "İkisi birden",
    beaten: (done: number, total: number) => `${total} haritadan ${done} tanesi geçildi`,
    costMustBe: "maliyet şu olmalı",
    exploredAtMost: "en çok incelenecek",
    maps: {
      swamp: {
        title: "The swamp",
        hint: "En hızlı geçiş, en ucuz geçiş değildir.",
      },
      "open-ground": {
        title: "Open ground",
        hint: "Burada hiçbir şey pahalı değil. Tasarruf edilecek tek şey emek.",
      },
      "wrong-door": {
        title: "The wrong door",
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
        `Yol en uygun olanı ama ${explored} hücre inceledin. Bütçe: ${budget}.`,
      suboptimal: (explored: number, cost: number, optimal: number) =>
        `Yalnızca ${explored} hücre inceledin, ancak yolunun maliyeti ${cost}. En uygun maliyet: ${optimal}.`,
      both: (cost: number, optimal: number, explored: number, budget: number) =>
        `Yolunun maliyeti ${cost}; en uygunu ${optimal}. Ayrıca ${explored} hücre inceledin; bütçe ise ${budget}.`,
    },
  },
  recap: {
    lessons: [
      "Bir arama doğrudan hedefe yönelmez; hedef, ulaştığı noktalardan biri olana kadar her yöne yayılır",
      "BFS hücreleri ilk giren ilk çıkar sırasıyla alır; böylece onları en az hamle sırasına göre kesinleştirir",
      "Zemin tekdüze olmaktan çıktığı anda en az hamle ile en ucuz rota farklı sorulardır",
      "Dijkstra her zaman bildiği en ucuz hücreyi kesinleştirir; cevabının en ucuz olmasının nedeni budur",
      "A* kalan mesafe için bir tahmin ekler ve çabasını hedefin bulunduğu yöne harcar",
      "Tahmin mesafeyi asla olduğundan fazla göstermez; bu yüzden A* daha hızlı ulaşırken hiçbir şeyden ödün vermez",
    ],
    footer:
      "Bu modeller, başlangıçtan hedefe ulaşırken sıradaki konumun nasıl seçildiğini gösterir. Gerçek rota sistemleri daha büyük haritaları ve ek maliyetleri işler.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Engelleri çiz ve aramayı çalıştır. Hangi hücrelerin incelendiğini ve bulunan rotayı karşılaştır.",
    stages: {
      find: {
        grid: "S başlangıç, G hedef. Arama G'nin nerede olduğunu bilmiyor.",
        run: "Çalıştır: halkalı hücreler aramanın sınırı, dolu hücreler kesinleşmiş olanlar.",
        explored: "Kaç hücreye baktığı ve bulduğu yolun uzunluğu.",
        walls:
          "Şimdi ızgarada sürükleyerek duvar çiz ya da S ile G'yi taşı, sonra yeniden çalıştır.",
      },
      bfs: {
        grid: "Bu kez bir dolambaç var. Adım adım ilerleyin.",
        step: "Adımla: sınırdan bir hücre alınır, komşuları sınıra eklenir.",
        layers:
          "Adımlamaya devam edin: arama katman katman, en yakın hücrelerden başlayarak yayılır.",
      },
      cost: {
        swamp: "Çamura girmek 5, açık zemine girmek 1'e mal olur.",
        run: "Önce BFS ile çalıştır.",
        algorithm:
          "Sonra buradan Dijkstra'ya geçip yeniden çalıştır; isterseniz daha fazla çamur çiz.",
        compare: "BFS en az hamleyi yapar; Dijkstra en az bedeli öder.",
      },
      astar: {
        grid: "Açık bir alan. Dijkstra her yöne eşit yayılır.",
        run: "Çalıştır, sonra aşağıdan A*'a geçip yeniden çalıştır.",
        algorithm: "A* kalan mesafe için bir tahmin ekler ve hedefe yönelir.",
        explored:
          "Aynı en düşük maliyet; yollar farklı olabilir. Her birinin kaç hücreye baktığını karşılaştır.",
      },
      challenge: {
        maze: "Sabit bir harita: en ucuz yol ve bütçeyi aşmayan sayıda incelenen hücre. Haritayı yukarıdan seç.",
        algorithm: "Algoritmayı seç.",
        run: "Çalıştır ve iki koşulun da sağlanıp sağlanmadığına bak.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      bfs: "BFS: spreading in layers",
      dijkstra: "Dijkstra: the cheapest route",
      astar: "A*: aiming for the goal",
    },
    notes: {
      "reducible-bfs": "Sınırıyla birlikte, animasyonlu genişlik öncelikli arama.",
      "mit-6006-bfs": "MIT dersi: ilk giren ilk çıkar düzeninin neden en az hamleyi bulduğu.",
      "cp-dijkstra": "Dijkstra algoritması küçük bir harita üzerinde, elle.",
      "mit-6006-dijkstra": "Ders: doğruluğu ve maliyetlerin neden negatif olmaması gerektiği.",
      "cp-astar": "A*'ın Dijkstra'yla karşılaştırmalı anlatımı.",
      "reducible-astar": "Harita uygulamalarının kullandığı haliyle A* ve sezgisel tahmin.",
      "redblob-astar": "Etkileşimli ızgaralar: BFS, Dijkstra, greedy ve A* yan yana.",
    },
  },
};

export default copy;
