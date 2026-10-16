# Öğrenme rehberi

Her lab'ın en altında bir "Öğrenmeye devam edin" kartı ve "Öğrenme rehberini aç" düğmesi var.
Düğme ayrı bir pencere açar: lab'ın ana fikirleri başlık başlık sıralanır, her başlığın altında
o konuyu öğreten videolar, üniversite dersleri ve birkaç okuma yer alır. Liste bilerek video
ağırlıklıdır.

Araştırma tarihi: 16 Ekim 2026.

---

## 1. Kaynak kuralları

1. **Uydurma yok.** Her videonun başlığı, kanalı ve süresi YouTube'un kendisinden okundu;
   adresi YouTube'un oEmbed servisiyle ayrıca doğrulandı (`node tools/check-learning.mjs`).
   Her kitap, ders sayfası ve makale verilen adreste açıldı. Bir kitabın bölüm numarası
   ancak içindekiler sayfasında görüldüyse yazıldı.
2. **Kabul görmüş olsun.** Ya bir üniversitenin kendi ders kaydı (MIT OpenCourseWare,
   Harvard Stat 110, Stanford), ya alanın standart kitabı, ya da alanın kendisinin ders
   kaynağı olarak kullandığı eğitimciler (3Blue1Brown, StatQuest, Andrew Ng'nin
   DeepLearning.AI dersleri, Computerphile, Numberphile, minutephysics, Karpathy, Distill).
3. **Çelişmesin.** Her kaynak lab'ın söyledikleriyle karşılaştırıldı. Lab'la aynı işlemi farklı
   tanımlayan ya da lab'ın sonucuyla karışabilecek kaynaklar elendi (bkz. §5).
4. **Ana fikri kapsasın.** Başlıklar lab'ın kendi özet derslerinden çıkarıldı; her başlığın en
   az bir kaynağı var, çoğunda en az bir video.

---

## 2. Arayüz

- **Kart ve düğme:** Lab'ın en altında, Kaynaklar'ın ardından ve "sıradaki lab" kartından
  önce. Her lab'da LabShell tarafından eklenir; lab'ların kendi kodunda değişiklik yoktur.
- **Pencere:** Sitenin diğer pencereleriyle aynı yapı (native `<dialog>`, Esc ile kapanır).
  Masaüstünde ortada, telefonda ekranı dolduran kaydırılabilir bir panel.
- **Her kaynak:** tür etiketi (Video, Ders, Kitap, Ders notu, Makale, Etkileşimli), yeni
  sekmede açılan başlık, kanal ya da yazar, video süresi ya da yıl, ve kaynağın neden orada
  olduğunu söyleyen tek cümle (TR/EN).
- **Performans:** Liste ve pencere ayrı bir parça; yalnızca düğmeye basılınca yüklenir.

## 3. Veri

- `src/labs/learning.ts`: dilden bağımsız kayıt (`RESOURCES`) ve her lab'ın konu sırası
  (`GUIDES`).
- `src/i18n/labs/{en,tr}/<lab>.ts` içinde `study`: konu başlıkları ve her kaynağın cümlesi.
- `src/labs/learning.test.ts`: her lab'ın rehberi var; her konunun en az bir kaynağı var; iki
  dilde aynı konular ve aynı kaynaklar; bir lab'da aynı kaynak iki kez yok; her YouTube
  kaydının süresi var.
- `tools/check-learning.mjs`: elle çalıştırılır. YouTube kayıtlarını oEmbed ile, diğerlerini
  doğrudan isteyerek dener ve başlığı değişen ya da açılmayan kaynakları listeler. CI'da
  değil: dış sitelerdeki anlık bir kesinti build'i kırmamalı.

---

## 4. Lab lab kaynaklar

Toplam 94 kaynak: 57 video, 12 üniversite dersi kaydı, 10 kitap bölümü, 9 makale, 4 ders notu/belge, 2 etkileşimli sayfa. Bu liste `src/labs/learning.ts` ile aynıdır; uygulamadaki tek kaynak odur.

### Attention

1. **Query, key ve eşleşme skoru**
   - **[Video]** [Attention in transformers, step-by-step | Deep Learning Chapter 6](https://www.youtube.com/watch?v=eMlx5fFNoYc), 3Blue1Brown (26:10). Mekanizmanın tamamı adım adım: bir kelimenin ne aradığı, diğerlerinin ne sunduğu ve nasıl karşılaştırıldıkları.
   - **[Video]** [Attention for Neural Networks, Clearly Explained!!!](https://www.youtube.com/watch?v=PSs6nxngL6k), StatQuest with Josh Starmer (15:51). Aynı fikir, elle takip edilebilecek küçük sayılarla.
   - **[Kitap]** [Dive into Deep Learning: 11.3 Attention Scoring Functions](https://d2l.ai/chapter_attention-mechanisms-and-transformers/attention-scoring-functions.html), Zhang, Lipton, Li, Smola. Ölçekli nokta çarpımı ve böleni, açık açık yazılmış hali.

2. **Softmax: %100'lük tek bütçe**
   - **[Video]** [Neural Networks Part 5: ArgMax and SoftMax](https://www.youtube.com/watch?v=KpKog-L9veg), StatQuest with Josh Starmer (14:03). Softmax'ın her skoru toplamı 1 olan paylara neden çevirdiği.

3. **Attention'ın modeldeki yeri**
   - **[Video]** [Transformers, the tech behind LLMs | Deep Learning Chapter 5](https://www.youtube.com/watch?v=wjZofJX0v4M), 3Blue1Brown (27:14). Etrafındaki transformer: attention'dan önce ve sonra ne olduğu.
   - **[Video]** [Let's build GPT: from scratch, in code, spelled out.](https://www.youtube.com/watch?v=kCc8FmEb1nY), Andrej Karpathy (1:56:20). Attention katmanı dahil, sıfırdan yazılan küçük bir GPT.
   - **[Makale]** [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/), Jay Alammar (2018). Mimarinin açıklamalı çizimlerle anlatımı.

### Geri yayılım

1. **Gradyan bir eğimdir; zincir kuralı**
   - **[Video]** [Backpropagation, intuitively | Deep Learning Chapter 3](https://www.youtube.com/watch?v=Ilg3gGewQ5U), 3Blue1Brown (12:47). Geri yayılımın ne yaptığı, önce formülsüz.
   - **[Video]** [Backpropagation calculus | Deep Learning Chapter 4](https://www.youtube.com/watch?v=tIeHLnjs5U8), 3Blue1Brown (10:18). Aynısı, zincir kuralı yazılarak.
   - **[Video]** [Backpropagation Details Pt. 2: Going bonkers with The Chain Rule](https://www.youtube.com/watch?v=GKZoOHXGcLo), StatQuest with Josh Starmer (13:09). Zincir kuralının gerçek sayılarla adım adım uygulanışı.

2. **Hesap grafiği ve geri geçişin sırası**
   - **[Video]** [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0), Andrej Karpathy (2:25:52). Geri yayılımı düğüm düğüm, yüz satır kadar kodla kendiniz kurun.
   - **[Video]** [Neural Networks Pt. 2: Backpropagation Main Ideas](https://www.youtube.com/watch?v=IN2XmBhILt4), StatQuest with Josh Starmer (17:34). Her seferinde tek ağırlık: hangi yöne ve ne kadar oynatılacağı.
   - **[Ders notu]** [Backpropagation, Intuitions](https://cs231n.github.io/optimization-2/), Stanford CS231n. Kapılar, yerel gradyanlar ve iki yerde kullanılan değerde toplama.

3. **Kaybolan ve patlayan gradyanlar**
   - **[Video]** [Vanishing/Exploding Gradients (C2W1L10)](https://www.youtube.com/watch?v=qhXZsFVxGKo), DeepLearningAI (Andrew Ng) (6:08). 1'in altındaki ya da üstündeki uzun bir çarpan zincirinin neden söndüğü ya da patladığı.

4. **Gradyan kontrolü**
   - **[Video]** [Gradient Checking (C2W1L13)](https://www.youtube.com/watch?v=QrzApibhohY), DeepLearningAI (Andrew Ng) (6:35). Lab'ın son bölümündeki gibi, geri yayılımı dürterek ölçmeyle karşılaştırmak.

### Önbellek yerelliği

1. **Bellek satır satır gelir**
   - **[Video]** [Why do CPUs Need Caches? - Computerphile](https://www.youtube.com/watch?v=6JpLD3PUAZk), Computerphile (6:06). İşlemcinin neden bir önbelleğe ihtiyaç duyduğu.
   - **[Video]** [How CPU Memory & Caches Work - Computerphile](https://www.youtube.com/watch?v=SAk-6gVkio0), Computerphile (34:54). Önbellek, satırlar ve isabetler, ayrıntılı olarak.

2. **Adım aralığı ve döngü sırası**
   - **[Ders]** [14. Caching and Cache-Efficient Algorithms (6.172, Fall 2018)](https://www.youtube.com/watch?v=xDKnMXtZKq8), MIT OpenCourseWare · Julian Shun (1:18:23). Önbellek dostu kod üzerine tam bir ders; döşemeli matris çarpımı dahil.
   - **[Makale]** [What Every Programmer Should Know About Memory](https://lwn.net/Articles/250967/), Ulrich Drepper (2007). Bellek ve önbelleğin gerçekte nasıl davrandığına dair uzun başvuru metni.

### Evrişim

1. **Kayan bir ağırlık penceresi**
   - **[Video]** [C4W1L02 Edge Detection Examples](https://www.youtube.com/watch?v=XuD4C8vJzEQ), DeepLearningAI (Andrew Ng) (11:31). 3×3'lük bir kenar çekirdeğinin resim üzerinde toplam toplam kaydırılması.
   - **[Video]** [Neural Networks Part 8: Image Classification with Convolutional Neural Networks (CNNs)](https://www.youtube.com/watch?v=HGwBXDKFk9I), StatQuest with Josh Starmer (15:24). Resim sınıflandıran bir ağda çekirdeklerin yeri.

2. **Her yerde aynı ağırlıklar**
   - **[Video]** [C4W1L11 Why Convolutions](https://www.youtube.com/watch?v=ay3zYUeuyhU), DeepLearningAI (Andrew Ng) (9:41). Parametre paylaşımı ve neden bu kadar az ağırlık gerektirdiği.
   - **[Ders notu]** [Convolutional Neural Networks: Architectures, Convolution / Pooling Layers](https://cs231n.github.io/convolutional-networks/), Stanford CS231n. Katmanın tamamı: paylaşım, alıcı alan, derinlik.

3. **Dolgu, adım ve çıktı boyutu**
   - **[Video]** [C4W1L04 Padding](https://www.youtube.com/watch?v=smHa2442Ah4), DeepLearningAI (Andrew Ng) (9:50). Dolgu ve lab'ın kullandığı çıktı boyutu formülü.
   - **[Video]** [C4W1L05 Strided Convolutions](https://www.youtube.com/watch?v=tQYZaDn_kSg), DeepLearningAI (Andrew Ng) (9:02). Adım ve aşağı yuvarlama.
   - **[Kitap]** [Dive into Deep Learning: 7.3 Padding and Stride](https://d2l.ai/chapter_convolutional-neural-networks/padding-and-strides.html), Zhang, Lipton, Li, Smola. Aynı formül, çözümlü örneklerle.

### Kriptografik hash

1. **Sabit uzunluk, her seferinde aynı cevap**
   - **[Ders]** [Lecture 20: Hash Functions](https://www.youtube.com/watch?v=tLkHk__-M6Q), Christof Paar (Introduction to Cryptography) (1:05:04). Bir hash fonksiyonunun neyi garanti etmesi gerektiğine dair üniversite dersi.
   - **[Ders]** [21. Cryptography: Hash Functions](https://www.youtube.com/watch?v=KqqOXndnvic), MIT OpenCourseWare (1:22:01). MIT'nin kriptografik hash fonksiyonları ve özellikleri üzerine dersi.

2. **Çakışma direnci**
   - **[Video]** [Hash Collisions & The Birthday Paradox - Computerphile](https://www.youtube.com/watch?v=jsraR-el8_o), Computerphile (14:21). Çakışmaların neden beklenenden erken geldiği ve bunun bir özet için anlamı.
   - **[Video]** [How secure is 256 bit security?](https://www.youtube.com/watch?v=S9JGmA5_unY), 3Blue1Brown (5:06). 2²⁵⁶'nın gerçekte ne kadar büyük olduğu ve aramanın neden imkânsız olduğu.

### Kayan nokta

1. **Bir float neyi saklayabilir, neyi saklayamaz**
   - **[Video]** [Floating Point Numbers - Computerphile](https://www.youtube.com/watch?v=PZRI1IfStY0), Computerphile (9:16). 0,1 + 0,2'nin neden 0,3 olmadığı, en baştan.
   - **[Video]** [Floating Point Numbers (Part1: Fp vs Fixed) - Computerphile](https://www.youtube.com/watch?v=f4ekifyijIg), Computerphile (15:41). İşaret, üs ve kesir, bit bit.

2. **Tekrar tekrar yuvarlama**
   - **[Video]** [Floating Point Numbers (Part2: Fp Addition) - Computerphile](https://www.youtube.com/watch?v=782QWNOD_Z0), Computerphile (8:09). İki float'ın nasıl toplandığı ve yuvarlamanın nerede olduğu.
   - **[Makale]** [What Every Computer Scientist Should Know About Floating-Point Arithmetic](https://doi.org/10.1145/103162.103163), David Goldberg · ACM Computing Surveys 23(1) (1991). Yuvarlama hatası ve IEEE aritmetiği üzerine klasik makale.

3. **Aralık mı, hassasiyet mi**
   - **[Makale]** [BFloat16: The secret to high performance on Cloud TPUs](https://cloud.google.com/blog/products/ai-machine-learning/bfloat16-the-secret-to-high-performance-on-cloud-tpus), Shibo Wang, Pankaj Kanwar · Google Cloud Blog (2019). bfloat16'nın neden float32'nin üssünü koruyup kesir bitlerinden vazgeçtiği.

### Gradient descent

1. **Adım adım yokuş aşağı**
   - **[Video]** [Gradient descent, how neural networks learn | Deep Learning Chapter 2](https://www.youtube.com/watch?v=IHZwWFHWa-w), 3Blue1Brown (20:33). Negatif gradyanın yokuş aşağı yön olması.
   - **[Video]** [Gradient Descent, Step-by-Step](https://www.youtube.com/watch?v=sDv4f4s2SB8), StatQuest with Josh Starmer (23:54). Adım boyu dahil, elle çözülmüş gradient descent.

2. **Adım boyu tavanı ve koşul sayısı**
   - **[Makale]** [Why Momentum Really Works](https://distill.pub/2017/momentum/), Gabriel Goh · Distill (2017). Etkileşimli: en büyük kararlı adımın neden eğriliğe bağlı olduğu ve κ'nın etkisi.

3. **Momentum ve Adam**
   - **[Video]** [Gradient Descent With Momentum (C2W2L06)](https://www.youtube.com/watch?v=k8fTYJPd3_I), DeepLearningAI (Andrew Ng) (9:21). Gradyanların hareketli ortalaması ve zikzakın neden söndüğü.
   - **[Video]** [Adam Optimization Algorithm (C2W2L08)](https://www.youtube.com/watch?v=JXQT_vxqwIs), DeepLearningAI (Andrew Ng) (7:08). Her parametreye kendi geçmişine göre ölçeklenmiş bir adım boyu.

### Graf araması

1. **BFS: katman katman yayılma**
   - **[Video]** [Breadth First Search (BFS): Visualized and Explained](https://www.youtube.com/watch?v=xlVX7dXLS64), Reducible (10:41). Sınırıyla birlikte, animasyonlu genişlik öncelikli arama.
   - **[Ders]** [9. Breadth-First Search (6.006, Spring 2020)](https://www.youtube.com/watch?v=oFVYVzlvk9c), MIT OpenCourseWare (52:53). MIT dersi: ilk giren ilk çıkar düzeninin neden en az hamleyi bulduğu.

2. **Dijkstra: en ucuz yol**
   - **[Video]** [Dijkstra's Algorithm - Computerphile](https://www.youtube.com/watch?v=GazC3A4OQTE), Computerphile (10:43). Dijkstra algoritması küçük bir harita üzerinde, elle.
   - **[Ders]** [13. Dijkstra (6.006, Spring 2020)](https://www.youtube.com/watch?v=NSHizBK9JD8), MIT OpenCourseWare (57:22). Ders: doğruluğu ve maliyetlerin neden negatif olmaması gerektiği.

3. _*A*: hedefe nişan almak_*
   - **[Video]** [A* (A Star) Search Algorithm - Computerphile](https://www.youtube.com/watch?v=ySN5Wnu88nE), Computerphile (14:04). A*'ın Dijkstra'yla karşılaştırmalı anlatımı.
   - **[Video]** [A* Search: How Your Map Applications Find Shortest Routes](https://www.youtube.com/watch?v=88I6IidylGc), Reducible (16:17). Harita uygulamalarının kullandığı haliyle A* ve sezgisel tahmin.
   - **[Etkileşimli]** [Introduction to the A* Algorithm](https://www.redblobgames.com/pathfinding/a-star/introduction.html), Amit Patel · Red Blob Games. Etkileşimli ızgaralar: BFS, Dijkstra, greedy ve A* yan yana.

### Hash tabloları

1. **Adresi hesaplamak**
   - **[Ders]** [4. Hashing (6.006, Spring 2020)](https://www.youtube.com/watch?v=Nu8YGneFCWE), MIT OpenCourseWare (52:55). MIT'nin en baştan hash tabloları dersi.
   - **[Video]** [Hash Collisions & The Birthday Paradox - Computerphile](https://www.youtube.com/watch?v=jsraR-el8_o), Computerphile (14:21). İki anahtarın neden sandığınızdan erken aynı kovaya düştüğü.

2. **Zincirleme ve doğrusal yoklama**
   - **[Ders]** [Lecture 10: Open Addressing, Cryptographic Hashing](https://www.youtube.com/watch?v=rvdJDijO2Ro), MIT OpenCourseWare (50:55). Açık adresleme ve doğrusal yoklama, maliyetleriyle.
   - **[Kitap]** [Algorithms, 4th ed.: 3.4 Hash Tables](https://algs4.cs.princeton.edu/34hash/), Robert Sedgewick, Kevin Wayne. Lab'ın kullandığı yoklama formülleri (Önerme M).

3. **Dolunca iki katına çıkmak**
   - **[Ders notu]** [java.util.HashMap (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html), Oracle. Java'nın kendi kuralı: 0,75 doluluk, sonra yaklaşık iki kat kova.

### Hipotez testi

1. **İki hipotez, α ve ret bölgesi**
   - **[Video]** [Hypothesis Testing and The Null Hypothesis, Clearly Explained!!!](https://www.youtube.com/watch?v=0oc49DyA3hU), StatQuest with Josh Starmer (14:41). Sıfır hipotezinin ne olduğu ve onu reddetmenin anlamı.
   - **[Video]** [Alternative Hypotheses: Main Ideas!!!](https://www.youtube.com/watch?v=5koKb5B_YWo), StatQuest with Josh Starmer (9:50). Alternatif hipotez: lab'daki öbür eğri.

2. **β, güç ve örneklem büyüklüğü**
   - **[Video]** [Statistical Power, Clearly Explained!!!](https://www.youtube.com/watch?v=Rsc5znwR5FA), StatQuest with Josh Starmer (8:19). Gücün, gerçek bir farkı yakalama olasılığı olması.
   - **[Video]** [Power Analysis, Clearly Explained!!!](https://www.youtube.com/watch?v=VX_M3tIyiYk), StatQuest with Josh Starmer (16:45). Belirli bir güç için kaç ölçüm gerektiği.
   - **[Video]** [Introduction to power in significance tests | AP Statistics | Khan Academy](https://www.youtube.com/watch?v=6_Cuz0QqRWc), Khan Academy (9:45). Güç, α ve β birlikte.
   - **[Kitap]** [OpenIntro Statistics, 4th ed.: 5.3 Hypothesis testing, 7.4 Power calculations](https://www.openintro.org/book/os/), Diez, Çetinkaya-Rundel, Barr (2019). Test ve güç üzerine ücretsiz bir ders kitabı bölümü.

### Çok katmanlı algılayıcılar

1. **Bir nöron bir doğrudur**
   - **[Video]** [But what is a neural network? | Deep learning chapter 1](https://www.youtube.com/watch?v=aircAruvnKk), 3Blue1Brown (18:40). Nöronlar, ağırlıklar ve bias'lar, en baştan.
   - **[Video]** [The Essential Main Ideas of Neural Networks](https://www.youtube.com/watch?v=CqOfi41LfDw), StatQuest with Josh Starmer (18:54). Birkaç nöronun bir doğruyu nasıl eğriye çevirdiği.

2. **XOR ve gizli katman**
   - **[Video]** [Neural Networks 6: solving XOR with a hidden layer](https://www.youtube.com/watch?v=kNPGXgzxoHw), Victor Lavrenko (University of Edinburgh) (5:53). Üniversite dersi: tek gizli katman XOR'u çözer.
   - **[Etkileşimli]** [TensorFlow Playground](https://playground.tensorflow.org/), Daniel Smilkov, Shan Carter. Tarayıcıda küçük bir ağ eğitin, katmanları kendiniz ekleyin.
   - **[Kitap]** [Neural Networks and Deep Learning, ch. 4: A visual proof that neural nets can compute any function](https://neuralnetworksanddeeplearning.com/chap4.html), Michael Nielsen. Yeterli gizli nöronun neden her şekli çizebildiği.

3. **Kayıp ve öğrenme**
   - **[Video]** [Gradient descent, how neural networks learn | Deep Learning Chapter 2](https://www.youtube.com/watch?v=IHZwWFHWa-w), 3Blue1Brown (20:33). Ağın kaybında yokuş aşağı yürüyerek nasıl öğrendiği.

### Olasılık

1. **Monty Hall ve koşullu olasılık**
   - **[Video]** [Monty Hall Problem - Numberphile](https://www.youtube.com/watch?v=4Lb-6rxZxx0), Numberphile (5:30). Oyun beş dakikada.
   - **[Ders]** [Lecture 6: Monty Hall, Simpson's Paradox](https://www.youtube.com/watch?v=fDcjhAKuhqQ), Harvard University · Statistics 110 (49:01). Harvard'ın Monty Hall ve Simpson paradoksu dersi.

2. **Doğum günleri: kişiler değil, çiftler**
   - **[Ders]** [Lecture 3: Birthday Problem, Properties of Probability](https://www.youtube.com/watch?v=LZ5Wergp_PA), Harvard University · Statistics 110 (48:55). Doğum günü probleminin derste çözümü.

3. **Simpson paradoksu**
   - **[Video]** [Simpson's Paradox](https://www.youtube.com/watch?v=ebEkn-BiW5k), minutephysics (4:40). Her grupta daha iyi, toplamda daha kötü; dört dakikada.

4. **Galton tahtası ve çan eğrisi**
   - **[Video]** [But what is the Central Limit Theorem?](https://www.youtube.com/watch?v=zeJD6dqJ5lo), 3Blue1Brown (31:15). Bir Galton tahtasından başlayıp merkezi limit teoremine varır.
   - **[Ders]** [Lecture 29: Law of Large Numbers and Central Limit Theorem](https://www.youtube.com/watch?v=OprNqnHsVIA), Harvard University · Statistics 110 (49:48). Büyük sayılar yasası ve merkezi limit teoremi, derste.

### Yarış durumu

1. **counter++ üç adımdır**
   - **[Video]** [Race Conditions on a Human Scale - Computerphile](https://www.youtube.com/watch?v=W0jPTqIo5oE), Computerphile (20:14). Yarış durumları insan ölçeğinde canlandırılmış.
   - **[Kitap]** [Operating Systems: Three Easy Pieces, ch. 26: Concurrency and Threads](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf), Remzi & Andrea Arpaci-Dusseau. Lab'daki sayacın aynısı ve neden güncelleme kaybettiği.

2. **Kilitler ve atomik komutlar**
   - **[Video]** [Race Conditions and How to Prevent Them - A Look at Dekker's Algorithm](https://www.youtube.com/watch?v=MqnpIwN7dz0), Spanning Tree (6:54). Kritik bölgeyi korumak: Dekker algoritması.
   - **[Kitap]** [Operating Systems: Three Easy Pieces, ch. 28: Locks](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf), Remzi & Andrea Arpaci-Dusseau. Kilitlerin atomik donanım komutlarından nasıl kurulduğu.

3. **Önce kontrol, sonra eylem**
   - **[Kitap]** [Operating Systems: Three Easy Pieces, ch. 32: Common Concurrency Problems](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf), Remzi & Andrea Arpaci-Dusseau. Gerçek yazılımlarda atomiklik ihlalleri (32.2 Non-Deadlock Bugs).

### Pekiştirmeli öğrenme

1. **Ödüller, durumlar ve eylemler**
   - **[Video]** [Reinforcement Learning: Essential Concepts](https://www.youtube.com/watch?v=Z-T0iJEXiwM), StatQuest with Josh Starmer (18:13). Pekiştirmeli öğrenmenin ana fikirleri.
   - **[Video]** [Markov Decision Processes - Computerphile](https://www.youtube.com/watch?v=2iF9PRriA7w), Computerphile (17:42). Odanın bir Markov karar süreci olarak ele alınması.

2. **Deneyerek öğrenmek: Q-learning**
   - **[Video]** [Q-Learning Explained - A Reinforcement Learning Technique](https://www.youtube.com/watch?v=qhRNvCVVJaA), deeplizard (8:38). Q değerleri, güncelleme kuralı ve keşif.
   - **[Kitap]** [Reinforcement Learning: An Introduction, 2nd ed.](http://incompleteideas.net/book/the-book-2nd.html), Richard S. Sutton, Andrew G. Barto (2018). Alanın ders kitabı, yazarlarından ücretsiz (Q-learning için 6. bölüm).

3. **Yazdığınızı optimize eder**
   - **[Video]** [9 Examples of Specification Gaming](https://www.youtube.com/watch?v=nKJlF-olKmg), Robert Miles AI Safety (9:40). Puanı tutturup asıl amacı ıskalayan ajanların dokuz gerçek örneği.
   - **[Makale]** [Specification gaming: the flip side of AI ingenuity](https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/), Krakovna et al. · Google DeepMind (2020). DeepMind'ın şartname oyunları (specification gaming) yazısı.

### Sıralama

1. **Seçmeli ve eklemeli sıralama**
   - **[Video]** [Selection sort in 3 minutes](https://www.youtube.com/watch?v=g-PGLbMth_g), Michael Sambol (2:43). Üç dakikadan kısa sürede seçmeli sıralama.
   - **[Video]** [Insertion sort in 2 minutes](https://www.youtube.com/watch?v=JU767SDMDvA), Michael Sambol (2:19). Üç dakikadan kısa sürede eklemeli sıralama.
   - **[Ders]** [3. Sets and Sorting (6.006, Spring 2020)](https://www.youtube.com/watch?v=oS9aPzUNG-s), MIT OpenCourseWare (52:56). MIT'nin sıralama dersi, iki algoritma da dahil.

2. **İş verinin içinde**
   - **[Video]** [Why My Teenage Code Was Terrible: Sorting Algorithms and Big O Notation](https://www.youtube.com/watch?v=RGuJga2Gl_k), Tom Scott (9:46). İşi saymanın neden koddan daha önemli olduğu.
   - **[Kitap]** [Algorithms, 4th ed.: 2.1 Elementary Sorts](https://algs4.cs.princeton.edu/21elementary/), Robert Sedgewick, Kevin Wayne. Eklemeli sıralamanın yer değiştirme sayısı ters çift sayısına eşittir.

### Tokenizasyon

1. **Sayılarak öğrenilen parçalar**
   - **[Video]** [Let's build the GPT Tokenizer](https://www.youtube.com/watch?v=zduSFxRajkE), Andrej Karpathy (2:13:35). Birleştirmeleriyle birlikte, sıfırdan kurulan bir BPE tokenizer.
   - **[Ders notu]** [LLM Course, 6.5: Byte-Pair Encoding tokenization](https://huggingface.co/learn/llm-course/chapter6/5), Hugging Face. Çözümlü örnekle BPE eğitim döngüsü.

2. **Token nedir, neye mal olur**
   - **[Video]** [Glitch Tokens - Computerphile](https://www.youtube.com/watch?v=WO2X3oZEJOA), Computerphile (19:29). Bir tokenizer'ın öğrendiği tuhaf token'lar ve modele etkileri.
   - **[Makale]** [Language Model Tokenizers Introduce Unfairness Between Languages](https://arxiv.org/abs/2305.15425), Petrov, La Malfa, Torr, Bibi · NeurIPS 2023 (2023). Aynı metin dillere göre çok farklı maliyet çıkarır.

### Word embedding

1. **Vektör olarak kelimeler**
   - **[Video]** [Word Embedding and Word2Vec, Clearly Explained!!!](https://www.youtube.com/watch?v=viZrOnJclY0), StatQuest with Josh Starmer (16:12). word2vec'in kelimeleri nasıl sayılara çevirdiği.
   - **[Video]** [Vectoring Words (Word Embeddings) - Computerphile](https://www.youtube.com/watch?v=gQddtTdmG_8), Computerphile (16:56). Kelime vektörleri ve ünlü kral − erkek + kadın.
   - **[Makale]** [The Illustrated Word2vec](https://jalammar.github.io/illustrated-word2vec/), Jay Alammar (2019). Çizimlerle word2vec.

2. **Anlam kullanımdan gelir**
   - **[Ders]** [CS224N Winter 2021, Lecture 1: Intro & Word Vectors](https://www.youtube.com/watch?v=rmVRLeJRkl4), Stanford Online · Christopher Manning (1:24:27). Stanford'un ilk dersi: anlam, kelimenin birlikte kullanıldığı kelimelerden gelir.

3. **İki boyutlu harita bir gölgedir**
   - **[Video]** [StatQuest: PCA main ideas in only 5 minutes!!!](https://www.youtube.com/watch?v=HMOI_lkzW08), StatQuest with Josh Starmer (6:05). Lab'daki haritanın kullandığı izdüşüm: PCA.
   - **[Makale]** [How to Use t-SNE Effectively](https://distill.pub/2016/misread-tsne/), Wattenberg, Viégas, Johnson · Distill (2016). Başka bir izdüşüm, aynı uyarı: haritadaki uzaklıklar yanıltabilir.

---

## 5. Elenenler ve nedenleri

| Kaynak                                         | Neden elendi                                                                                                                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3Blue1Brown, "But what is a convolution?"      | Matematiksel evrişimi çekirdeği ters çevirerek anlatıyor; lab ve derin öğrenme çerçeveleri çevirmeden kaydırıyor. Yeni başlayan için çelişki gibi görünür. |
| Computerphile, "SHA: Secure Hashing Algorithm" | SHA-1 üzerinden anlatıyor; SHA-1'de çakışma bulundu, bu da lab'ın "eşleşme ulaşılmaz" sonucuyla karışabilir.                                               |
| CMU 15-213 "Cache Memories" ders kaydı         | Resmi bir yükleme bulunamadı; yalnızca üçüncü taraf kopyalar var.                                                                                          |
| Stanford CS224N 2023 kaydı                     | 2023 kaydı resmi kanalda bulunamadı; 2021 kaydı kullanıldı.                                                                                                |
| David Silver, UCL RL dersi                     | Dersin resmi sayfası doğrulanamadı.                                                                                                                        |
| bfloat16 üzerine bir video                     | Kabul görmüş bir kanalda bulunamadı; konu Google'ın yazısıyla kaldı.                                                                                       |
| CLRS, CS:APP, AIMA, Goodfellow ve ark.         | Video ağırlığı için çıkarıldı. Doğrulanmış kitap bölümleri ilk planda (git geçmişinde bu belgenin önceki hali) duruyor.                                    |

## 6. Açık konular

1. **Türkçe kaynak:** Bu ölçütlerle Türkçe kaynak aranmadı; bütün kaynaklar İngilizce ve
   pencere bunu söylüyor. Ayrı bir araştırma turuyla eklenebilir; bulunamazsa uydurulmaz.
2. **Bakım:** YouTube videoları kaldırılabilir ya da adı değişebilir. `node
tools/check-learning.mjs` birkaç ayda bir çalıştırılmalı.
