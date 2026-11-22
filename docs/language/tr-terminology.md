# Türkçe terim sözlüğü

Bu sözlük bir kelime listesi değildir. Her madde bir **kavramı** kaydeder: ne
olduğunu, bu projede hangi adla anıldığını, hangi bağlamda başka bir adın
doğru olduğunu ve neyle karıştırılmaması gerektiğini. Yazmadan önce kavramı
belirle (metnin bağlı olduğu kontrol, grafik ve hesaplama kodu birlikte
okunur), sonra buradan terimini al. Anlatım kuralları
[tr-style.md](tr-style.md) dosyasındadır.

## Bir terim nasıl eklenir

1. Kavramı koddan ve grafikten belirle. Kelime eşleştirmesiyle toplu
   değiştirme yapma: aynı İngilizce kelime iki ayrı kavramı anlatabilir.
2. Türkçe kaynaklara bak. Öncelik sırası: üniversitelerin Türkçe ders notları
   ve açık dersleri; Türkçe ders kitapları ve alan uzmanlarının anlatımları;
   kaynak gösteren terim sözlükleri.
3. Bulduğun karşılığı tanımı, kullanım bağlamı ve cümle içindeki doğallığıyla
   birlikte değerlendir. Bir sözlükte geçmesi onu proje standardı yapmaz.
4. Kaynaklar farklı terim kullanıyorsa seçenekleri ve tercih nedenini yaz.
5. Yalnızca gerçekten incelediğin kaynağı bağla. İnceleyemediğini
   "incelenemedi" diye belirt.
6. Yeni tercih proje sahibinin onayıyla bu dosyaya girer.

## Kaynak kısaltmaları

| Kısaltma | Kaynak | Not |
| --- | --- | --- |
| ÖZSOY-11 | Prof. Dr. Onur Özsoy, *İstatistik 1 Ders Notları, Bölüm 11: Hipotez Testleri*, Ankara Üniversitesi SBF. [Açık ders](https://acikders.ankara.edu.tr/mod/resource/view.php?id=59940) | Boş hipotez, red bölgesi, I./II. tip hata, testin gücü, kritik değer |
| ÖZSOY-8 | Prof. Dr. Onur Özsoy, *İstatistik 1, Bölüm 8: Örnekleme ve Örnekleme Dağılımı*, Ankara Üniversitesi SBF. [Açık ders](https://acikders.ankara.edu.tr/mod/resource/view.php?id=59937) | Örnekleme dağılımı, popülasyon |
| AÇIKGÖZ | Dr. İnci Açıkgöz, *AHE 306 Biyoistatistik Ders Notları, 10. Hafta*, Ankara Üniversitesi. [Açık ders](https://acikders.ankara.edu.tr/mod/resource/view.php?id=43463) | Sıfır hipotezi, alternatif (seçenek) hipotez, tek/iki yönlü hipotez, anlamlılık düzeyi |
| BİYOMETRİ | *ZZT201 Biyometri Dersi, 8. Hafta Ders Notları* (kaynak kitap: Kocabaş, Özkan, Başpınar, *Temel Biyometri*, 2013), Ankara Üniversitesi Ziraat Fakültesi. [Açık ders](https://acikders.ankara.edu.tr/mod/resource/view.php?id=103020) | "ret bölgesi (veya kritik bölge)", testin gücü, örnekleme dağılımı |
| AKT102 | *AKT102 İstatistik, Bölüm 6: Örneklem Dağılımları ve Merkezi Limit Teoremi*, Ankara Üniversitesi. [Açık ders](https://acikders.ankara.edu.tr/mod/resource/view.php?id=106061) | Kitle, örneklem ortalaması, ortalamanın standart hatası |
| ÖD-2.5 | *2.5. Örnekleme Dağılımları*, Ankara Üniversitesi. [Açık ders](https://acikders.ankara.edu.tr/mod/resource/view.php?id=73032) | Örnekleme dağılımı, örneklem büyüklüğü, kitle |
| ÜNİTE-7 | *İstatistiksel Analiz, Ünite 7: Dağılım Ölçüleri*, Ankara Üniversitesi. [Açık ders](https://acikders.ankara.edu.tr/mod/resource/view.php?id=86320) | Standart hata, evren ortalaması |
| D2L-TR | d2l-tr çeviri terimleri. [TERMINOLOGY.md](https://github.com/d2l-ai/d2l-tr/blob/master/TERMINOLOGY.md) | Örneklem, anakütle; istatistik terimi az |
| DLT | Deep Learning Türkiye, *Türkçe yapay zekâ terimleri* (Alpaydın'ın *Yapay Öğrenme* sözlüğü temel alınmış). [Depo](https://github.com/deeplearningturkiye/turkce-yapay-zeka-terimleri) | denence, sıfır denencesi, güç işlevi, anlamlılık, gürültü |

İncelenemeyenler: OMÜ "Hipotez Testleri 2018" notu (bağlantı 404 verdi), TÜBA
terim sözlüğü (sertifika hatası), TÜİK istatistik terimleri sözlüğü
(bulunamadı). "Tek/çift kuyruklu test" kullanımı yalnızca arama sonucu
özetlerinde görüldü; belge açılmadığı için kaynak olarak gösterilmiyor.

---

## İstatistik ve hipotez testi

Bu bölümün maddeleri Hypothesis Testing lab'ında pilot olarak uygulandı ve
proje sahibi tarafından onaylandı.

### Evren

- **Tanım:** Hakkında sonuç çıkarılmak istenen bütün birimlerin kümesi.
  Lab'da σ onun standart sapması, μ onun ortalamasıdır.
- **Tercih:** evren
- **Bağlama bağlı alternatifler:** Yok. Kaynaklarda kitle (AKT102, ÖD-2.5),
  popülasyon (ÖZSOY-8, BİYOMETRİ), anakütle (D2L-TR) de geçer; proje
  tutarlılık için "evren"i seçti.
- **Karıştırılmaması gereken:** örneklem (evrenden çekilen gözlemler); nüfus
  (demografik anlam).
- **Örnek:** "σ: evren standart sapması"
- **Kaynak:** ÜNİTE-7 ("evren ortalaması"). Seçim proje kararıdır.

### Örneklem, gözlem, örneklem büyüklüğü

- **Tanım:** Örneklem, evrenden çekilen n gözlemin kümesidir. Gözlem,
  örneklemdeki tek bir ölçümdür. Örneklem büyüklüğü n, gözlem sayısıdır.
- **Tercih:** örneklem; gözlem; örneklem büyüklüğü (n)
- **Bağlama bağlı alternatifler:** Yok. "Örnek sayısı" kullanma: n'nin kaç
  örneklem olduğu sanılabilir. "Örnek genişliği" (BİYOMETRİ) eski kullanım.
- **Karıştırılmaması gereken:** örneklem büyüklüğü (n) ile örneklem sayısı.
- **Örnek:** "n: örneklem büyüklüğü", "Daha çok gözlem standart hatayı küçültür."
- **Kaynak:** ÖD-2.5, AKT102 ("örneklem büyüklüğü"). "Gözlem" için incelenmiş
  bir kaynak yok; proje kararıdır.

### Örneklem ortalaması (X̄)

- **Tanım:** Örneklemdeki n gözlemin ortalaması. Lab'da test istatistiğidir.
- **Tercih:** örneklem ortalaması
- **Karıştırılmaması gereken:** evren ortalaması μ.
- **Örnek:** "Test istatistiği X̄'tir."
- **Kaynak:** AKT102, ÖD-2.5

### Örnekleme dağılımı

- **Tanım:** Bir istatistiğin (burada X̄'in), aynı büyüklükte örneklemler
  tekrar tekrar çekilseydi alacağı değerlerin dağılımı. Lab'daki iki eğri budur.
- **Tercih:** örnekleme dağılımı
- **Bağlama bağlı alternatifler:** AKT102 "örneklem dağılımı" der; projede
  kullanma, çünkü örneklemdeki verinin dağılımıyla karışır.
- **Karıştırılmaması gereken:** verinin dağılımı; evrenin dağılımı.
- **Örnek:** "Her eğri X̄'in örnekleme dağılımıdır."
- **Kaynak:** ÖZSOY-8, ÖD-2.5, BİYOMETRİ

### Standart hata (SE)

- **Tanım:** Örneklem ortalamasının örnekleme dağılımının standart sapması;
  σ biliniyorsa σ/√n.
- **Tercih:** standart hata. Kısaltma olarak değer kutularında **SE** kalır;
  açıklamada "standart hata, σ/√n" yazılır.
- **Karıştırılmaması gereken:** evren standart sapması σ.
- **Örnek:** "n arttıkça standart hata SE = σ/√n küçülür."
- **Kaynak:** AKT102 ("ortalamanın standart hatası"), ÜNİTE-7. "SH"
  kısaltması için incelenmiş kaynak yok.

### Standart sapma, gürültü

- **Tanım:** Bir dağılımın ortalamaya göre yayılma ölçüsü.
- **Tercih:** Kontrol σ'yı değiştiriyorsa **standart sapma**. Bir görüntüye
  ya da sinyale rastgele bozulma ekleniyorsa **görüntü gürültüsü** /
  **gürültü**.
- **Karıştırılmaması gereken:** Gürültü sözcüğü yasak değildir; yalnızca σ'yı
  anlatmak için kullanılmaz.
- **Örnek:** "Büyük standart sapma" (σ = 3 görevinin başlığı)
- **Kaynak:** Proje kararı. DLT "noise: gürültü".

### Sıfır hipotezi (H₀), alternatif hipotez (H₁)

- **Tanım:** H₀, test edilen iddia (lab'da μ = μ₀). H₁, H₀ reddedilirse
  benimsenen iddia; yönü testin yönünü belirler.
- **Tercih:** sıfır hipotezi (H₀); alternatif hipotez (H₁)
- **Bağlama bağlı alternatifler:** boş hipotez (ÖZSOY-11), kontrol hipotezi
  (BİYOMETRİ), seçenek hipotez (AÇIKGÖZ), sıfır denencesi (DLT). Projede
  kullanma.
- **Örnek:** "Hangi sonuçlarda sıfır hipotezini reddederiz?"
- **Kaynak:** AÇIKGÖZ

### Test kararı: reddedilir / reddedilemez

- **Tanım:** X̄ ret bölgesindeyse H₀ reddedilir; değilse H₀ reddedilemez.
- **Tercih:** "H₀ reddedilir", "H₀ reddedilemez"
- **Yasak:** "H₀ kabul edilir" ve "H₀ doğrudur". Reddedilememek H₀'ın doğru
  olduğunu göstermez. Sadeleştirirken bu anlamı bozma.
- **Örnek:** "X̄ buraya düşerse H₀ reddedilemez."
- **Kaynak:** ÖZSOY-11 ("boş hipotez reddedilmez"). AÇIKGÖZ "kabul edilir"
  der; proje bilimsel anlamı korumak için onu kullanmaz.

### Ret bölgesi, kritik değer

- **Tanım:** Ret bölgesi, H₀'ın reddedilmesine yol açan test istatistiği
  değerleri. Kritik değer bu bölgenin başladığı nokta.
- **Tercih:** ret bölgesi; kritik değer. İlk geçtiği yerde "kritik bölge de
  denir" eklenebilir.
- **Bağlama bağlı alternatifler:** kritik bölge (BİYOMETRİ, Casella & Berger).
  "Red bölgesi" (ÖZSOY-11, AÇIKGÖZ) yazımı kullanma; "reddetme bölgesi"
  kullanma.
- **Karıştırılmaması gereken:** I. tip hata (bir olay) ve α (bir olasılık).
  Ret bölgesi bir değer aralığıdır, hata değildir.
- **Örnek:** "Taralı kuyruk ret bölgesidir: X̄ buraya düşerse H₀ reddedilir."
- **Kaynak:** BİYOMETRİ ("ret bölgesi (veya kritik bölge)"), ÖZSOY-11 ("kritik değer")

### I. tip hata ve anlamlılık düzeyi (α)

- **Tanım:** I. tip hata, H₀ doğruyken onu reddetmektir (bir olay). α, bu
  olayın olasılığıdır; lab'da μ = μ₀ iken X̄'in ret bölgesine düşme
  olasılığı. Veriden önce seçilir.
- **Tercih:** I. tip hata; anlamlılık düzeyi α; "I. tip hata olasılığı"
- **Bağlama bağlı alternatifler:** önemlilik düzeyi, yanılma olasılığı
  (AÇIKGÖZ). Projede kullanma.
- **Yasak:** "yanlış alarm" (İngilizce "false alarm" benzetmesi); "I. tip hata
  oranı" (α'yı olayla karıştırır).
- **Örnek:** "α: anlamlılık düzeyi", "H₀ doğruyken onu reddetmek I. tip
  hatadır; α bu hatanın olasılığıdır."
- **Kaynak:** ÖZSOY-11, AÇIKGÖZ

### II. tip hata ve β

- **Tanım:** II. tip hata, H₀ yanlışken onu reddedememektir. β, gerçek
  ortalama μ₁ iken X̄'in ret bölgesi dışına düşme olasılığıdır.
- **Tercih:** II. tip hata; II. tip hata olasılığı (β)
- **Bağlama bağlı:** μ₁ alternatif yönde değilse (ters yön ya da μ₁ = μ₀) bu
  sayı II. tip hata olasılığı değildir; "H₀'ı reddetmeme olasılığı" de.
  Grafik etiketi bu yüzden "Ret bölgesi dışı".
- **Yasak:** "kaçırılan etki", "kimsenin saymadığı hata" gibi benzetmeler
  kavramın adının yerine geçmez.
- **Örnek:** "Eğriler örtüştükçe II. tip hata olasılığının (β) nasıl
  değiştiğine bak."
- **Kaynak:** ÖZSOY-11, AÇIKGÖZ

### Testin gücü (1 − β)

- **Tanım:** H₀ yanlışken onu reddetme olasılığı; μ₁ alternatif yöndeyse
  1 − β.
- **Tercih:** testin gücü; kısa etiketlerde "Güç"
- **Bağlama bağlı:** μ₁ alternatif yönde değilse "H₀'ı reddetme olasılığı".
- **Karıştırılmaması gereken:** güç fonksiyonu (μ'ye göre değişen eğri;
  Casella & Berger β(θ) ile gösterir).
- **Örnek:** "α sabitken, μ₁ alternatif yöndeyse testin gücü artar."
- **Kaynak:** ÖZSOY-11, BİYOMETRİ

### Tek yönlü / iki yönlü test, kuyruk

- **Tanım:** H₁ μ > μ₀ ya da μ < μ₀ ise test tek yönlüdür ve ret bölgesi tek
  kuyruktadır; H₁ μ ≠ μ₀ ise iki yönlüdür ve α iki kuyruğa bölünür.
- **Tercih:** Metinde "tek yönlü test", "iki yönlü test". Yön düğmelerinde
  H₁'in kendisi ve kuyruğu: "μ > μ₀ (sağ kuyruk)", "μ < μ₀ (sol kuyruk)",
  "μ ≠ μ₀ (iki kuyruk)".
- **Kullanma:** "çift kuyruk", "çift yönlü".
- **Örnek:** "İki yönlü test α'yı iki kuyruğa böler."
- **Kaynak:** AÇIKGÖZ ("tek yönlü / iki yönlü hipotez")

### Gerçek ortalama (μ₁)

- **Tanım:** Lab'da β ve gücün hesaplandığı, varsayılan gerçek evren
  ortalaması. Alternatif hipotezin içinde olmak zorunda değildir.
- **Tercih:** "μ₁ (gerçek ortalama)"; kontrol etiketi "μ₁: gerçek ortalama"
- **Kullanma:** "seçili gerçek ortalama", "alternatif ortalama",
  "alternatifteki ortalama" (aynı kavrama üç ad).
- **Karıştırılmaması gereken:** H₁ (bir iddia), μ₀ (H₀'daki ortalama).
- **Kaynak:** Proje kararı (engine.ts: β, μ₁ ile hesaplanır).

### İki ortalama arasındaki uzaklık

- **Tanım:** |μ₁ − μ₀| / SE, yani iki ortalamanın standart hata cinsinden
  uzaklığı.
- **Tercih:** uzaklık (standart hata cinsinden)
- **Kullanma:** "aralık": güven aralığıyla karışır.
- **Kaynak:** Proje kararı.

---

## Sitenin diğer terimleri

Aşağıdakiler önceki editoryal geçişten (`docs/EDITORIAL.md`) gelir. Kaynak
incelemesi bu yöntemle henüz yapılmadı; ilgili lab ele alındığında her madde
yukarıdaki biçimde yeniden yazılacak.

| Kavram | Terim | Not |
| --- | --- | --- |
| hash, digest, collision | hash, özet, çakışma | "çarpışma" kullanma (testle korunur) |
| token, tokenizer, BPE | token, tokenizer, BPE | Sayıdan sonra çoğul yok: "5 token" |
| gradient descent, gradient | gradient descent, gradyan | |
| learning rate / step size | adım boyu | Hesaplamanın ayırdığı yerde ikisini ayrı tut |
| loss, weight | kayıp, ağırlık | |
| backpropagation | geri yayılım | |
| neural network, neuron | yapay sinir ağı, nöron | "nöral ağ" kullanma (testle korunur) |
| convolution, kernel | evrişim, çekirdek | |
| hash table, bucket, slot | hash tablosu, kova, yuva | |
| race condition, thread | yarış durumu, iş parçacığı | |
| cache locality | önbellek yerelliği | |
| floating point | kayan nokta | |
| reinforcement learning | pekiştirmeli öğrenme | |
| attention, word embedding | attention, word embedding | |
| corpus, epoch | derlem, epok | "korpus" kullanma (testle korunur) |
