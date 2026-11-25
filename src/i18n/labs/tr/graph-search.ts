import type en from "../en/graph-search";

/** Türkçe metin: graph-search. Şekli `en/graph-search.ts` ile birebir aynı olmak zorundadır. */

const copy: typeof en = {
  sources: {
    title: "Kaynaklar",
    astar:
      "A*'ın sıradaki düğümü, birikmiş maliyet ve kalan maliyet tahmininin toplamına göre seçmesini açıklar. Kabul edilebilir bir tahmin, gerçek kalan maliyeti aşmaz.",
    dijkstra:
      "Dijkstra algoritmasını ve kenar maliyetlerinin negatif olmaması koşulunu açıklar. Bu deneyde A*'ın tahmini sıfırlanınca seçim kuralı Dijkstra ile aynı olur.",
  },
  findTheWay: "Yolu bul",
  algorithm: "Algoritma",
  draw: "Çiz",
  gridAndKeys: "Harita araçları ve klavye",
  map: "Harita",
  tools: { wall: "Engel", mud: "Çamur", erase: "Sil", start: "Başlangıç", goal: "Hedef" },
  legend: {
    wall: "engel",
    frontier: "sırada bekleyen",
    settled: "işlenen",
    path: "yol",
    mud: "çamur",
  },
  metrics: {
    explored: "İşlenen hücre",
    path: "Yol uzunluğu",
    cost: "Yol maliyeti",
    noPath: "Yol yok",
  },
  comparisonCaption: "Aynı haritada arama sonuçları",
  comparisonSteps: "Adım sayısı",
  gridRole: "Yol arama ızgarası",
  spaceKey: "Boşluk",
  steps: (n: number) => `${n} adım`,
  gridLabel: (walls: number, mud: number, state: string) =>
    `Düzenlenebilir ızgara. Engel: ${walls}. Çamurlu hücre: ${mud}. ${state}`,
  gridHelp:
    "Çizmek için ızgaranın üzerinde sürükle. Izgara odaktayken yön tuşları imleci hareket ettirir, Boşluk boyar.",
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
      `Hedefe ulaşıldı. İşlenen hücre sayısı ${explored}, yol uzunluğu ${steps} adım, yol maliyeti ${cost}.`,
    unreachable: (explored: number) => `Yol yok. ${explored} hücre işlendi.`,
    running: (explored: number) => `Arama sürüyor. ${explored} hücre işlendi.`,
    notStarted: "Başlatılmadı.",
    gridReset: "Izgara sıfırlandı.",
    gridCleared: "Izgara temizlendi.",
    selected: (algorithm: string) => `${algorithm} seçildi.`,
    loaded: (map: string) => `${map} yüklendi.`,
  },
  row: (row: number, col: number) => `satır ${row}, sütun ${col}`,
  intro: {
    question: "Arama hangi hücreleri işler?",
    caption:
      "Izgaraya engeller çiz ve aramayı çalıştır. Hedefe giden yolu ve işlenen hücreleri karşılaştır.",
  },
  bfs: {
    kicker: "Arama sürerken",
    title: "Arama başlangıçtan katman katman ilerler",
    lede: "Adımla düğmesine bas. Halkalı hücreler kuyrukta bekler. Dolu renkle gösterilen hücreler kuyruktan alınmıştır. Aramanın başlangıçtan kaç adım uzaktaki hücrelere ulaştığına bak.",
    caption:
      "Genişlik öncelikli arama (BFS), kuyruğa ilk eklenen hücreyi önce işler. Hücrelere artan adım sayısıyla ulaşır ve hedefe giden en az adımlı bir yol bulur.",
  },
  cost: {
    kicker: "Adım sayısı ve yol maliyeti",
    title: "Her hücreden geçmenin maliyeti aynı mı?",
    lede: "Açık zemine girmek 1, çamura girmek 5 birim tutar. Aynı haritada BFS ve Dijkstra'yı çalıştır. Yol uzunluğu ve Yol maliyeti sayaçlarını karşılaştır.",
    caption:
      "BFS en az adımlı yolu bulur. Dijkstra, sırada bekleyen hücrelerden birikmiş maliyeti en düşük olanı işler. Çamurun etrafından dolaşan bir yol daha çok adımda daha az maliyetle hedefe ulaşabilir.",
  },
  astar: {
    kicker: "Kalan maliyet tahmini",
    title: "Hedefe yönelmek aramayı nasıl değiştirir?",
    lede: "A*, birikmiş maliyet g ile kalan maliyet tahmini h değerini toplayarak sıradaki hücreyi seçer. Dijkstra ve A*'ı aynı haritada çalıştır. İki aramanın işlediği hücrelerin dağılımına bak.",
    caption:
      "Bu dört yönlü ızgarada Manhattan uzaklığı, yatay ve düşey adım farklarının toplamıdır. En düşük maliyetli geçiş 1 birim olduğu için bu tahmin kalan yol maliyetini aşmaz. İki arama farklı yollar bulabilir. Her iki yol da aynı en düşük maliyete sahiptir.",
  },
  challenge: {
    kicker: "Görev",
    title: "En düşük maliyetli yolu kaç hücre işleyerek bulabilirsin?",
    lede: "Her haritada en düşük maliyetli bir yol bul. İşlenen hücre sınırını aşmayacak algoritmayı seç.",
    mazeLabel: (
      title: string,
      cols: number,
      rows: number,
      cost: number,
      budget: number,
      algorithm: string,
    ) =>
      `${title}. ${cols} sütun ve ${rows} satır. Hedef yol maliyeti ${cost}. En fazla ${budget} hücre işle. Seçili algoritma ${algorithm}.`,
    bothAtOnce: "İkisi birden",
    beaten: (done: number, total: number) => `${total} görevden ${done} tanesi tamamlandı`,
    costMustBe: "Hedef yol maliyeti",
    exploredAtMost: "İşlenen hücre sınırı",
    maps: {
      swamp: {
        title: "Bataklık",
        hint: "En az adımlı yolu bul. Ardından çamurdan dolaşan yolun maliyetiyle karşılaştır.",
      },
      "open-ground": {
        title: "Açık arazi",
        hint: "Bu haritada her geçiş 1 birim. Yol maliyeti aynıyken işlenen hücre sayısını azalt.",
      },
      "wrong-door": {
        title: "Yanlış kapı",
        hint: "Hedefe olan Manhattan uzaklığını engellerin izin verdiği yolla karşılaştır.",
      },
    },
    budget: (cost: number, budget: number) =>
      `En düşük yol maliyeti ${cost}. En fazla ${budget} hücre işle.`,
    verdict: {
      unreachable: "Bu arama hedefe hiç ulaşamadı.",
      solved: (cost: number, explored: number) =>
        `Görev tamamlandı. Yol maliyeti ${cost}, işlenen hücre sayısı ${explored}.`,
      overBudget: (explored: number, budget: number) =>
        `Bulunan yol en düşük maliyette. ${explored} hücre işlendi. Sınır ${budget}.`,
      suboptimal: (explored: number, cost: number, optimal: number) =>
        `${explored} hücre işlendi. Yol maliyeti ${cost}, en düşük maliyet ${optimal}.`,
      both: (cost: number, optimal: number, explored: number, budget: number) =>
        `Yol maliyeti ${cost}, en düşük maliyet ${optimal}. İşlenen hücre sayısı ${explored}, sınır ${budget}.`,
    },
  },
  recap: {
    lessons: [
      "Genişlik öncelikli arama başlangıca en yakın hücrelerden başlayarak yayılır.",
      "BFS hücreleri kuyruğa eklenme sırasıyla işler. Böylece en az adımlı yolu bulur.",
      "Geçiş maliyetleri farklıysa en az adımlı yol ile en düşük maliyetli yol farklı olabilir.",
      "Dijkstra birikmiş maliyeti en düşük hücreyi işler. Bu seçim, negatif olmayan kenar maliyetlerinde en düşük maliyetli yolu verir.",
      "A*, birikmiş maliyeti kalan maliyet tahminiyle birlikte kullanır.",
      "Bu ızgarada Manhattan uzaklığı kalan maliyeti aşmaz. A* en düşük maliyetli bir yol bulur ve Dijkstra'dan daha az hücre işleyebilir.",
    ],
    footer:
      "Bu modeller, başlangıçtan hedefe ulaşırken sıradaki konumun nasıl seçildiğini gösterir. Gerçek rota sistemleri daha büyük haritaları ve ek maliyetleri işler.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro: "Izgaraya engel çiz ve aramayı çalıştır. İşlenen hücreleri ve bulunan yolu incele.",
    stages: {
      find: {
        grid: "S başlangıcı, G hedefi gösterir. BFS, hücreleri seçerken hedefe olan uzaklığı kullanmaz.",
        run: "Çalıştır düğmesine bas. Halkalı hücreler sırada bekler. Dolu renkle gösterilen hücreler işlenmiştir.",
        explored: "İşlenen hücre ve Yol uzunluğu kutularına bak.",
        walls:
          "Şimdi ızgarada sürükleyerek engel çiz ya da S ile G'yi taşı, sonra yeniden çalıştır.",
      },
      bfs: {
        grid: "Adımla düğmesiyle aramanın engelin çevresinden nasıl ilerlediğine bak.",
        step: "Adımla düğmesiyle kuyruğun başındaki hücrenin alınmasını ve komşularının sırayla eklenmesini izle.",
        layers:
          "Adımlamayı sürdür. Başlangıçtan aynı adım sayısıyla ulaşılan hücrelerin hangi sırayla işlendiğine bak.",
      },
      cost: {
        swamp: "Çamura girmek 5, açık zemine girmek 1'e mal olur.",
        run: "Önce BFS ile çalıştır.",
        algorithm:
          "Dijkstra'yı seçip aynı haritada çalıştır. Ardından çamurlu hücreler ekleyip iki aramayı yeniden karşılaştır.",
        compare: "BFS en az adımlı yolu, Dijkstra en düşük maliyetli yolu bulur.",
      },
      astar: {
        grid: "Açık zeminde Dijkstra'nın başlangıç çevresinde işlediği hücrelere bak.",
        run: "Çalıştır, sonra aşağıdan A*'a geçip yeniden çalıştır.",
        algorithm: "A*, birikmiş maliyete kalan maliyet tahminini ekler.",
        explored: "Yol maliyeti ve İşlenen hücre kutularını karşılaştır.",
      },
      challenge: {
        maze: "Yukarıdan bir harita seç. Yol maliyetini ve işlenen hücre sınırını kontrol et.",
        algorithm: "Algoritmayı seç.",
        run: "Çalıştır ve iki koşulun da sağlanıp sağlanmadığına bak.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      bfs: "BFS: katman katman yayılma",
      dijkstra: "Dijkstra: en düşük maliyetli yol",
      astar: "A* ve kalan maliyet tahmini",
    },
    notes: {
      "reducible-bfs": "Bekleyen hücreleri kuyrukta gösteren genişlik öncelikli arama animasyonu.",
      "mit-6006-bfs": "MIT dersi: ilk giren ilk çıkar düzeninin neden en az adımlı yolu bulduğu.",
      "cp-dijkstra": "Dijkstra algoritması küçük bir harita üzerinde, elle.",
      "mit-6006-dijkstra": "Ders: doğruluğu ve maliyetlerin neden negatif olmaması gerektiği.",
      "cp-astar": "A*'ın Dijkstra'yla karşılaştırmalı anlatımı.",
      "reducible-astar": "A* ve kalan maliyet tahmininin harita üzerinde gösterimi.",
      "redblob-astar": "Etkileşimli ızgaralar: BFS, Dijkstra, açgözlü arama ve A* yan yana.",
      "ods-book":
        "Graphs bölümünde komşuluk listeleri, kuyruk ve BFS bağlantısını kur. Kod benzeri anlatım, lab'daki ziyaret sırasını kendi algoritmana dönüştürmek için uygun.",
    },
  },
};

export default copy;
