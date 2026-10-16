import type en from "../en/graph-search";

/** Türkçe metin: graph-search. Şekli `en/graph-search.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    astar:
      "Laboratuvarda çalışan A* kurgusunu destekler: şimdiye kadarki maliyet ile sezgisel tahminin toplamına göre sıralanan en-iyi-önce arama ve bu sezgiselin sağlaması gereken kabul edilebilirlik koşulu.",
    dijkstra:
      "Sezgisel kapatıldığında laboratuvarın çalıştırdığı en kısa yol yöntemini ve bu yöntemin varsaydığı negatif olmayan kenar maliyetlerini destekler.",
  },
  findTheWay: "Yolu bulun",
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
    "Çizmek için ızgaranın üzerinde sürükleyin. Izgara odaktayken yön tuşları hareket ettirir, Boşluk boyar.",
  gridHelpFull: {
    drag: "Çizmek veya silmek için ızgarada sürükleyin.",
    or: "veya",
    toMove:
      "işaretlerini sürükleyerek taşıyın. Izgara odaktayken yön tuşları imleci hareket ettirir,",
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
      "Birkaç engel çizin, sonra Çalıştır'a basın. Arama, hedefin olmadığı yerler dahil gerçekte nerelere yayıldıysa orada iz bırakır.",
  },
  bfs: {
    kicker: "Arama sürerken",
    title: "Çizgiler hâlinde değil, katmanlar hâlinde yayılır.",
    lede: "Adım adım ilerleyin. Halkalı hücreler bilinen ama henüz ziyaret edilmemiş hücrelerdir, yani sınır. Dolu hücreler ise kesinleşmiştir: arama, her birine kaç hamlede ulaşıldığını bilir ve bir daha oraya bakmaz.",
    caption:
      "Hücreleri ilk giren ilk çıkar sırasıyla ele almak işin tamamı: bu, onların uzaklık sırasına göre kesinleşmesini sağlar, dolayısıyla hedefe ulaşan ilk rota en kısasıdır. Buna genişlik öncelikli arama denir.",
  },
  cost: {
    kicker: "Uzaklık maliyet değildir",
    title: "Bazı zeminlerde ilerlemek daha yavaştır.",
    lede: "Çamura girmenin maliyeti 5, açık zeminin 1. Önce BFS'i, sonra Dijkstra'yı çalıştırın ve ızgaranın altındaki iki sayıyı karşılaştırın.",
    caption:
      "BFS yine en az hamleyle gidiyor, doğruca bataklığın içinden. Dijkstra daha çok adım atıyor ama daha az ödüyor; çünkü her seferinde en yakın hücreyi değil, bildiği en ucuz hücreyi kesinleştiriyor.",
  },
  astar: {
    kicker: "Aramaya bir ipucu verin",
    title: "Aynı doğru cevap, çok daha az arama.",
    lede: "Dijkstra hedefin nerede olduğunu bilmez, bu yüzden her yöne eşit yayılır. A* ise kalan uzaklık için bir tahmin ekler ve onu izler: f = g + h; burada g şu ana kadarki maliyet, h ise sezgisel, yani kalan mesafenin tahminidir.",
    caption:
      "Aynı yol, aynı maliyet. İncelenen sayısına bakın. Buradaki sezgisel fonksiyon Manhattan uzaklığı. Dört yönlü bir ızgarada kalan mesafeyi asla olduğundan fazla gösteremez, yani kabul edilebilir; A*'ın ona güvenerek hiçbir şeyden ödün vermemesinin nedeni de tam olarak budur.",
  },
  challenge: {
    kicker: "Görev",
    title: "Aynı cevap, daha az iş.",
    lede: "Üç sabit harita. Her biri hem en ucuz yolu hem de bütçeden fazla hücre kesinleştirmeyen bir arama istiyor. Bunlardan biri tek başına kolay; asıl mesele ikisini birden sağlamak.",
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
        `Yol en uygun olanı ama ${explored} hücre incelediniz. Bütçe: ${budget}.`,
      suboptimal: (explored: number, cost: number, optimal: number) =>
        `Yalnızca ${explored} hücre incelediniz, ancak yolunuzun maliyeti ${cost}. En uygun maliyet: ${optimal}.`,
      both: (cost: number, optimal: number, explored: number, budget: number) =>
        `Yolunuzun maliyeti ${cost}; en uygunu ${optimal}. Ayrıca ${explored} hücre incelediniz; bütçe ise ${budget}.`,
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
      "Telefonunuzun bugüne kadar önerdiği her güzergâh buna benzer bir döngüden çıktı: bir sınır, kesinleşmiş bir küme ve sıradaki hücreyi seçen bir kural.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Bir arama, ızgarada başlangıçtan hedefe bir yol arar. Duvarları siz çizersiniz; hangi karelere baktığı ızgarada belirir.",
    stages: {
      find: {
        grid: "S başlangıç, G hedef. Arama G'nin nerede olduğunu bilmiyor.",
        run: "Çalıştırın: halkalı hücreler aramanın sınırı, dolu hücreler kesinleşmiş olanlar.",
        explored: "Kaç hücreye baktığı ve bulduğu yolun uzunluğu.",
        walls:
          "Şimdi ızgarada sürükleyerek duvar çizin ya da S ile G'yi taşıyın, sonra yeniden çalıştırın.",
      },
      bfs: {
        grid: "Bu kez bir dolambaç var. Adım adım ilerleyin.",
        step: "Adımla: sınırdan bir hücre alınır, komşuları sınıra eklenir.",
        layers:
          "Adımlamaya devam edin: arama katman katman, en yakın hücrelerden başlayarak yayılır.",
      },
      cost: {
        swamp: "Çamura girmek 5, açık zemine girmek 1'e mal olur.",
        run: "Önce BFS ile çalıştırın.",
        algorithm:
          "Sonra buradan Dijkstra'ya geçip yeniden çalıştırın; isterseniz daha fazla çamur çizin.",
        compare: "BFS en az hamleyi yapar; Dijkstra en az bedeli öder.",
      },
      astar: {
        grid: "Açık bir alan. Dijkstra her yöne eşit yayılır.",
        run: "Çalıştırın, sonra aşağıdan A*'a geçip yeniden çalıştırın.",
        algorithm: "A* kalan mesafe için bir tahmin ekler ve hedefe yönelir.",
        explored: "Aynı yol, aynı maliyet. Her birinin kaç hücreye baktığını karşılaştırın.",
      },
      challenge: {
        maze: "Sabit bir harita: en ucuz yol ve bütçeyi aşmayan sayıda incelenen hücre. Haritayı yukarıdan seçin.",
        algorithm: "Algoritmayı seçin.",
        run: "Çalıştırın ve iki koşulun da sağlanıp sağlanmadığına bakın.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      bfs: "BFS: katman katman yayılma",
      dijkstra: "Dijkstra: en ucuz yol",
      astar: "A*: hedefe nişan almak",
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
