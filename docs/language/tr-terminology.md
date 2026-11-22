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

---

## pca

Kaynaklar (bu bölümde kısaltmalarıyla anılır):

| Kısaltma | Kaynak | Not |
| --- | --- | --- |
| MAT114 | Prof. Dr. F. Nejat Ekmekci, Prof. Dr. Yusuf Yaylı, Doç. Dr. İsmail Gök, *MAT114 Lineer Cebir, Hafta 13: Özdeğerler ve Özvektörler*, Ankara Üniversitesi, 2017-2018. [Açık ders](https://acikders.ankara.edu.tr/mod/resource/view.php?id=62128) | "özdeğer (karakteristik değer)", "özvektör"; "karakteristik vektör bir lineer dönüşüm altında doğrultusu değişmeyen vektör demektir" |
| SIRMATEL | Dr. Öğr. Üyesi Işık İlber Sırmatel, *Özdeğerler ve Özvektörler* ders notu, Trakya Üniversitesi Elektrik-Elektronik Müh. [PDF](https://sirmatel.github.io/assets/files/linear_algebra/ozdegerler-ve-ozvektorler.pdf) | "A gerçel olsa da özdeğerleri ve özvektörleri karmaşık olabilir", köşegenleştirme |
| VİKİ-KOV | Vikipedi, *Kovaryans matrisi*. [Sayfa](https://tr.wikipedia.org/wiki/Kovaryans_matrisi) | "kovaryans matrisi (veya varyans-kovaryans matrisi)", "temel bileşenler analizi" |
| DLT | Yukarıdaki tabloda. | projection: izdüşüm; eigenvector: özyöney; variance: değişinti; covariance: eşdeğişinti |

İncelenemeyenler: Ankara Üniversitesi açık ders "Temel Bileşenler Analizi"
notu (resource id=51326; PDF açıldı ama metni okunamadı, yazı tipi
gömülü), OMÜ AVYS çok değişkenli istatistik notları (alan adı çözülemedi),
Vikipedi "Temel bileşenler analizi" ve "Özdeğer ve özvektör" sayfaları (404).

### Temel bileşenler analizi (PCA)

- **Tanım:** Verinin kovaryans matrisinin özvektörlerini özdeğere göre büyükten
  küçüğe sıralayıp veriyi bu yönler boyunca yeniden yazan yöntem.
- **Tercih:** temel bileşenler analizi; metinde kısaltma olarak **PCA**.
  İlk geçtiği yerde "temel bileşenler analizi (PCA)".
- **Bağlama bağlı alternatifler:** "temel bileşen analizi" de yaygındır;
  istatistik kaynakları çoğul biçimi kullanır (VİKİ-KOV). "TBA" kısaltmasını
  kullanma: ML okurunun aradığı ad PCA'dır.
- **Karıştırılmaması gereken:** temel bileşen (tek bir yön/eksen) ile analizin kendisi.
- **Örnek:** "Bulut ve birinci temel bileşen."
- **Kaynak:** VİKİ-KOV. Ankara Üniversitesi notunun metni okunamadığı için
  kaynak gösterilmiyor.

### Özvektör, özdeğer

- **Tanım:** Au = λu eşitliğini sağlayan sıfırdan farklı u bir özvektördür:
  matris u'yu yalnızca λ sayısıyla çarpar. λ > 1 ise uzatır, 0 < λ < 1 ise
  kısaltır, λ < 0 ise yönünü ters çevirir; λ = 0 ise u'yu sıfır vektörüne
  götürür. λ özdeğerdir. Sezgisel tanımda "uzatır" yazma; "bir sayıyla
  çarpar" ya da "doğrultusunu değiştirmez" de.
- **Tercih:** özvektör; özdeğer. Sezgisel tanımda "doğrultusu değişmeyen vektör".
- **Bağlama bağlı alternatifler:** karakteristik vektör/değer (MAT114, eşdeğer
  ad); özyöney (DLT). Projede kullanma.
- **Karıştırılmaması gereken:** yön ile doğrultu: λ negatifse u'nun yönü
  döner ama doğrultusu aynı kalır; bu yüzden tanımda "doğrultu" kullan.
  Lab'daki açı göstergesi de iki doğrultu arasındaki dar açıyı (0° ile 90°)
  ölçer (engine.ts `between3`). Simetrik bir matrisin birbirine dik
  özvektörleri her zaman seçilebilir; tekrarlı özdeğerde her özvektör çifti
  dik olmak zorunda değildir.
- **Örnek:** "Bu yön bir özvektördür, 1,62 de onun özdeğeridir."
- **Kaynak:** MAT114, SIRMATEL

### İzdüşüm

- **Tanım:** Bir noktanın bir doğruya dik olarak düşürülmesiyle doğru üzerinde
  elde edilen nokta. Lab'daki "gölge".
- **Tercih:** izdüşüm (dik izdüşüm). Lab "gölge" benzetmesini başlıkta
  kullanır; metinde ilk geçtiği yerde "izdüşüm, noktanın doğru üzerindeki
  gölgesidir" diye bağlanır, sonra "izdüşüm" kullanılır.
- **Karıştırılmaması gereken:** "çizgi" (gündelik); geometrik nesne **doğru**dur.
- **Kaynak:** DLT ("projection: izdüşüm")

### Kovaryans matrisi, varyans

- **Tanım:** Değişkenlerin varyanslarını köşegende, kovaryanslarını köşegen
  dışında tutan simetrik matris.
- **Tercih:** kovaryans matrisi; varyans; kısaltmalar Var(·), Kov.
- **Bağlama bağlı alternatifler:** varyans-kovaryans matrisi (VİKİ-KOV, istatistik
  derslerinde yaygın). değişinti / eşdeğişinti (DLT, D2L-TR): projede kullanma,
  istatistik derslerinde yerleşik değil.
- **Örnek:** "İzdüşümlerin varyansı", "Korunan varyans"
- **Kaynak:** VİKİ-KOV

### Kayma matrisi (shear)

- **Tanım:** Bir ekseni sabit tutup diğer koordinatları ona orantılı kaydıran
  dönüşümün matrisi. Lab'daki "Kayma" hazır ayarı x yönündeki kaymayı z
  boyunca 1,5 kat ölçeklemeyle birleştirir (engine.ts `shear`).
- **Tercih:** kayma (düğmede "Kayma"; metinde "kayma matrisi")
- **Bağlama bağlı alternatifler:** kesme dönüşümü. İkisi için de okunabilen
  bir Türkçe ders kaynağı bulunamadı; açık karar.
- **Kaynak:** İncelenen kaynak yok. Proje önerisi.

---

## generalization

Bu bölümdeki terimler için okunabilen Türkçe ders notu bulunamadı: İTÜ
"Veri Madenciliği" slaytları (web.itu.edu.tr/~sgunduz, d4.pdf) ve Ankara
Üniversitesi açık ders Python ile makine öğrenmesi sunumu (resource
id=174038) indirildi ama metinleri çıkarılamadı. Aşağıdaki seçimler DLT ve
D2L-TR sözlüklerine (bkz. ilk tablo) ve sitenin önceki kullanımına dayanır.

### Genelleme

- **Tanım:** Modelin eğitimde görmediği örneklerde de doğru tahmin yapması.
- **Tercih:** genelleme
- **Karıştırılmaması gereken:** ezberleme (eğitim örneklerine tam uyum).
- **Örnek:** "Tanıdık örnekleri ezberlemeyi yeni örneklere genellemeden ayırt et."
- **Kaynak:** DLT ("generalization: genelleme")

### Eğitim, doğrulama ve test kümesi

- **Tanım:** Eğitim kümesi modelin parametrelerini belirler (k-NN'de
  ezberlenen noktalar). Doğrulama kümesi model seçiminde (k) kullanılır.
  Test kümesi yalnızca son değerlendirmede, bir kez kullanılır.
- **Tercih:** eğitim kümesi; doğrulama kümesi; test kümesi. Gösterge
  etiketlerinde "Eğitim doğruluğu", "Doğrulama doğruluğu", "Son test doğruluğu".
- **Bağlama bağlı alternatifler:** geçerleme kümesi (D2L-TR), doğrulama seti
  (DLT), sınama kümesi (DLT "test: sınama"). Projede "doğrulama" ve "test"
  kullanılır; "set" yerine "küme".
- **Karıştırılmaması gereken:** doğrulama (validation) ile doğruluk (accuracy).
- **Kaynak:** DLT, D2L-TR

### Doğruluk (accuracy)

- **Tanım:** Doğru sınıflandırılan örneklerin oranı (engine.ts `accuracy`).
- **Tercih:** doğruluk. "Skor" kullanma; ölçülen nicelik doğruluktur.
- **Kaynak:** Proje kararı.

### k-en yakın komşu (k-NN)

- **Tanım:** Bir noktayı, ona en yakın k eğitim noktasının çoğunluk oyuyla
  sınıflandıran yöntem.
- **Tercih:** k-en yakın komşu (k-NN); "oy veren komşu sayısı (k)".
- **Kaynak:** İstanbul Üniversitesi doktora tezi
  ([PDF](https://nek.istanbul.edu.tr/ekos/TEZ/61102.pdf), §2.6.2, s. 24–25):
  "k-en yakın komşu" ve çoğunluk oylaması. Tezi Codex-TR okudu; Claude-TR'nin
  indirdiği kopyadan metin çıkarılamadı.

### Karar sınırı, karar bölgesi

- **Tanım:** Sınıflandırıcının tahmininin bir sınıftan diğerine geçtiği
  sınır; bölgeler bu sınırın ayırdığı alanlardır.
- **Tercih:** karar sınırı; karar bölgesi
- **Kaynak:** Proje kararı.

### Etiket gürültüsü

- **Tanım:** Etiketlerin seçilen olasılıkla ters çevrilmesi (engine.ts
  `dataset`, `noise`).
- **Tercih:** etiket gürültüsü; kontrol etiketi "Etiketin ters çevrilme olasılığı".
- **Karıştırılmaması gereken:** standart sapma (bkz. "Standart sapma, gürültü").
- **Kaynak:** DLT ("noise: gürültü")

### Kapasite

- **Tanım:** Modelin uyabileceği fonksiyonların esnekliği.
- **Tercih:** kapasite
- **Bağlama bağlı alternatifler:** sığım (DLT). Projede kullanma; ML
  derslerinde "kapasite" daha anlaşılırdır. Açık karar.
- **Kaynak:** DLT ("capacity: sığım")

---

## backpropagation

Kaynak: D2L-TR bölüm metinleri (okundu): *İleri Yayma, Geri Yayma ve
Hesaplamalı Çizge* ([backprop.md](https://github.com/d2l-ai/d2l-tr/blob/master/chapter_multilayer-perceptrons/backprop.md)),
*Sayısal Kararlılık ve İlkleme* ([numerical-stability-and-init.md](https://github.com/d2l-ai/d2l-tr/blob/master/chapter_multilayer-perceptrons/numerical-stability-and-init.md)),
*Çok Katmanlı Algılayıcılar* ([mlp.md](https://github.com/d2l-ai/d2l-tr/blob/master/chapter_multilayer-perceptrons/mlp.md)).
Aşağıda "D2L-TR-BÖLÜM" diye anılır.

### Geri yayılım, ileri ve geri geçiş

- **Tanım:** Geri yayılım, kaybın her parametreye göre gradyanını zincir
  kuralıyla, kayıptan girdiye doğru hesaplayan yöntem. İleri geçiş ağın bir
  kez çalıştırılıp ara değerlerin hesaplanması; geri geçiş, gradyanların bir
  kez geriye doğru hesaplanması.
- **Tercih:** geri yayılım; ileri geçiş; geri geçiş. Sayılırken "1 ileri ve 1
  geri geçiş", "${n} ileri geçiş".
- **Bağlama bağlı alternatifler:** geri yayma, ileri yayma (D2L-TR-BÖLÜM);
  geri yayılım (DLT). "Geçiş", tek bir çalıştırmayı (pass) yöntemin adından
  (propagation) ayırmak için kullanılır; açık karar.
- **Kaynak:** DLT, D2L-TR-BÖLÜM

### Hesaplama çizgesi, düğüm

- **Tanım:** Bir ifadenin işlemlerini düğüm, veri akışını kenar olarak
  gösteren çizge.
- **Tercih:** hesaplama çizgesi; düğüm. Graph Search lab'ıyla ortak karar:
  çizge, düğüm, kenar.
- **Kullanma:** "grafik" (bir veri grafiği, chart demektir); "graf" yerine "çizge".
- **Kaynak:** D2L-TR-BÖLÜM ("hesaplamalı çizge"); Codex-TR'nin okuduğu
  Ankara Üniversitesi ders metni (Bölüm 10, çizge/düğüm/kenar).

### Zincir kuralı, yerel türev

- **Tercih:** zincir kuralı; yerel türev (bir düğümün çıktısının girdisine göre türevi).
- **Kaynak:** D2L-TR-BÖLÜM ("zincir kuralına göre")

### Kaybolan ve patlayan gradyan

- **Tercih:** kaybolan gradyan; patlayan gradyan. Fiil olarak "gradyan
  kaybolur / söner", "gradyan patlar".
- **Kaynak:** D2L-TR-BÖLÜM ("Kaybolan Gradyanlar", "patlayan gradyan problemi")

### Aktivasyon fonksiyonu

- **Tercih:** aktivasyon fonksiyonu. Fonksiyon adları özgün kalır: sigmoid,
  tanh, ReLU.
- **Bağlama bağlı alternatifler:** etkinleştirme fonksiyonu (D2L-TR-BÖLÜM,
  "etkinleştirme (aktivasyon) fonksiyonu"); etkilenim fonksiyonu (DLT).
  Projede kullanma: ders anlatımlarında yerleşik olan "aktivasyon"dur ve
  D2L-TR de onu parantez içinde verir. Açık karar.
- **Kaynak:** D2L-TR-BÖLÜM, DLT

### Gradyan kontrolü, sayısal türev, merkezi fark

- **Tanım:** Gradyan kontrolü, geri yayılımın bulduğu gradyanı parametreyi
  biraz değiştirip kaybı ölçerek bulunan sayısal türevle karşılaştırmaktır.
  Lab merkezi fark kullanır: (L(w + h) − L(w − h)) / 2h.
- **Tercih:** gradyan kontrolü; sayısal türev; merkezi fark. "Dürtmek"
  (nudge) kullanma; "biraz değiştirmek" de.
- **Kaynak:** Proje kararı.

### Ceza terimi

- **Tanım:** Kayba eklenen ve ağırlığı küçük tutan 0,1·w² terimi.
- **Tercih:** ceza terimi. Kavram adı gerekirse düzenlileştirme terimi.
- **Kaynak:** D2L-TR-BÖLÜM ("düzenlileştirme terimi"); DLT ("regularization: düzenlileştirme")

---

## multilayer-perceptrons

Kaynaklar: D2L-TR-BÖLÜM (bkz. ## backpropagation; özellikle *Çok Katmanlı
Algılayıcılar*), DLT.

### Çok katmanlı algılayıcı (MLP), gizli katman, nöron

- **Tercih:** çok katmanlı algılayıcı (kart terimi); gizli katman; nöron;
  gizli nöron. Metinde genel ad olarak "yapay sinir ağı".
- **Bağlama bağlı alternatifler:** saklı katman (DLT); gizli birim
  (D2L-TR-BÖLÜM, "nöron" ile birlikte kullanılır). Projede kullanma.
- **Kaynak:** D2L-TR-BÖLÜM ("çok katmanlı algılayıcı", "gizli katman",
  "nöron"), DLT ("çok katmanlı algılayıcı")

### Bias

- **Tanım:** Nöronun ağırlıklı toplamına eklenen sabit terim; karar
  sınırını döndürmeden kaydırır.
- **Tercih:** bias (özgün adıyla).
- **Bağlama bağlı alternatifler:** ek girdi (DLT, D2L-TR). İki sözlükte de
  geçer, ama sabit terimi bir girdi gibi anlattığı için lab'ın "doğruyu
  kaydırır" anlatımıyla uyuşmaz. Açık karar.
- **Karıştırılmaması gereken:** yanlılık (istatistikte bias; DLT
  "yanlılık"), önyargı.
- **Kaynak:** DLT, D2L-TR-BÖLÜM

### Öğrenme oranı

- **Tanım:** Gradyanı ölçekleyen η katsayısı (engine.ts `applyGradients`;
  bu lab ayrıca bir L2 terimi uygular).
- **Tercih:** öğrenme oranı (kontrol etiketi ve metin). "Öğrenme oranı
  gradyanı ölçekleyerek adımın büyüklüğünü etkiler"; "adımın büyüklüğüdür"
  deme. Gradient Descent lab'ı aynı η için algoritma bağlamında "adım boyu"
  kullanır (Codex-TR ile ortak karar).
- **Kaynak:** Proje kararı.

### Gradient descent

- **Tercih:** gradient descent (sözlük tablosundaki gibi özgün adıyla).
- **Bağlama bağlı alternatifler:** gradyan inişi (eski site metni).
- **Kaynak:** Sözlük tablosu.

### Öznitelik, sıkıştırma

- **Tercih:** öznitelik (feature); aktivasyon fonksiyonunun etkisi için
  "sıkıştırma" (squash).
- **Kaynak:** D2L-TR ("feature: öznitelik"; "sıkıştırma işlevi")

### Epok

- **Tercih:** epok (sözlük tablosu). D2L-TR "dönem" der; projede kullanma.

---

## convolution

Kaynaklar: DLT ve D2L-TR sözlükleri (bkz. ilk tablo); D2L-TR-BÖLÜM (bkz.
## backpropagation). D2L-TR'nin evrişim bölümü bu çalışmada okunmadı.

### Evrişim, çekirdek

- **Tanım:** Küçük bir ağırlık penceresinin (çekirdek) girdi üzerinde
  kaydırılması; her çıktı, pencerenin altındaki piksellerin ağırlıklı toplamıdır.
- **Tercih:** evrişim; çekirdek. "Filtre" ve "kernel" kullanma: aynı kavrama
  üç ad olur. Hazır çekirdekler "Bulanıklaştır", "Keskinleştir", "Dikey
  kenarlar", "Dış hat" gibi işlevleriyle adlandırılır.
- **Bağlama bağlı alternatifler:** süzgeç (DLT "filter"). Projede kullanma.
- **Kaynak:** DLT ("convolution: evrişim", "kernel: çekirdek"), D2L-TR ("kernel: çekirdek"); sözlük tablosu.

### Çapraz korelasyon

- **Tanım:** Çekirdeği ters çevirmeden uygulanan kayan toplam; evrişim
  katmanlarının gerçekte yaptığı işlem. Matematikteki evrişim çekirdeği çevirir.
- **Tercih:** çapraz korelasyon
- **Kaynak:** D2L-TR §6.2.5 ([conv-layer](https://tr.d2l.ai/chapter_convolutional-neural-networks/conv-layer.html)),
  Codex-TR'nin okuduğu: çapraz korelasyon ile çekirdeği çevrilmiş evrişim
  ayrımı.

### Dolgu, adım kaydırma (stride)

- **Tanım:** Dolgu, girdinin çevresine eklenen sıfır hücreler (p). Adım
  kaydırma, pencerenin her seferinde kaç hücre sıçradığı (s).
- **Tercih:** dolgu; adım kaydırma, ilk geçtiği yerde "adım kaydırma (stride)".
  Kaydırıcı etiketi "Adım kaydırma s".
- **Bağlama bağlı alternatifler:** dolgulama (DLT); uzun adım (D2L-TR).
  Yalın "adım" kullanma: aynı lab'daki öğrenme bölümünde "adım" bir gradient
  descent adımıdır.
- **Kaynak:** DLT ("stride: adım kaydırma", "padding: dolgulama"), D2L-TR ("padding: dolgu", "stride: uzun adım")

### Alıcı alan

- **Tanım:** Üstteki bir hücrenin değerini etkileyen girdi hücrelerinin bölgesi.
- **Tercih:** alıcı alan
- **Bağlama bağlı alternatifler:** alım alanı (D2L-TR). Fizyolojideki
  (Hubel ve Wiesel) "receptive field" karşılığı olarak "alıcı alan"
  tercih edildi; açık karar.
- **Kaynak:** D2L-TR ("receptive field: alım alanı")

### Kenar dedektörü

- **Tercih:** kenar dedektörü ("kenar bulucu", "kenar filtresi" kullanma).
- **Kaynak:** Proje kararı.

---

## attention

Kaynak: D2L-TR dikkat bölümleri (okundu): *Dikkat İşaretleri*, *Dikkat
Puanlama Fonksiyonları*, *Özdikkat ve Konumsal Kodlama*, *Çoklu-Kafalı
Dikkat* ([chapter_attention-mechanisms](https://github.com/d2l-ai/d2l-tr/tree/master/chapter_attention-mechanisms)).
Aşağıda D2L-TR-DİKKAT diye anılır.

### Attention

- **Tercih:** attention (tr-style.md "Zorla Türkçeleştirme" kuralındaki örnek).
  "attention payı" bir kelimenin softmax sonrası ağırlığıdır.
- **Bağlama bağlı alternatifler:** dikkat, dikkat mekanizması, dikkat
  ağırlıkları (D2L-TR-DİKKAT). Kaynakta yerleşik olduğu için açık karar.
- **Kaynak:** tr-style.md; D2L-TR-DİKKAT

### Sorgu, anahtar, değer (query, key, value)

- **Tercih:** sorgu (query), anahtar (key), değer (value); ilk geçtiği yerde
  İngilizcesi parantezde. Vektörler: sorgu vektörü, anahtar vektörü, değer vektörü.
- **Karıştırılmaması gereken:** "değer" sözcüğünün sayısal değer anlamı;
  karışabilecek yerde "değer vektörü" yaz.
- **Kaynak:** D2L-TR-DİKKAT ("Sorgular, Anahtarlar ve Değerler"); DLT ("query: sorgu")

### Eşleşme, puan, pay

- **Tanım:** Eşleşme, sorgu ile anahtarın nokta çarpımı (ham). Puan, √d'ye
  bölünmüş eşleşme. Pay, softmax sonrası ağırlık (toplamı %100).
- **Tercih:** eşleşme; puan ("skor" kullanma); pay.
- **Kaynak:** D2L-TR-DİKKAT ("dikkat puanlama fonksiyonu"). Ayrım proje kararıdır.

### Ölçeklenmiş nokta çarpımı, softmax, kafa, self-attention

- **Tercih:** ölçeklenmiş nokta çarpımı attention'ı; softmax (özgün adıyla);
  attention kafası (head); self-attention; Transformer.
- **Bağlama bağlı alternatifler:** ölçeklendirilmiş nokta çarpımı dikkati,
  softmaks, özdikkat, kafa (D2L-TR-DİKKAT). "attention" İngilizce kaldığı için
  "self-attention" da İngilizce kalır; açık karar.
- **Kaynak:** D2L-TR-DİKKAT

### İzdüşüm matrisi

- **Tercih:** izdüşüm (projection); bkz. ## pca.

---

## tokenization

### Token, tokenizer, BPE

- **Tercih:** token, tokenizer, BPE (sözlük tablosu). "token" Türkçe yazımına
  göre ek alır: tokenler, tokene, tokendir. "tokenizer" kesme işaretiyle ek
  alır: tokenizer'ın. Sayıdan sonra çoğul yok: "5 token".
- **Bağlama bağlı alternatifler:** jeton (DLT), andıç/belirteç (D2L-TR).
  Projede kullanma; "jeton" i18n.test.ts ile yasak.
- **Kaynak:** sözlük tablosu; DLT, D2L-TR

### Bayt çifti kodlaması (BPE), birleştirme, alt sözcük

- **Tanım:** En sık yan yana gelen çifti tek parçaya birleştirip sayımı
  yineleyen yöntem. Her adım bir birleştirmedir (merge); sonunda elde edilen
  parçalar sözlüktür.
- **Tercih:** bayt çifti kodlaması (BPE); birleştirme; alt sözcük
  bölütleme (subword segmentation).
- **Kullanma:** "birleşim", "kaynaştırma" (aynı işleme ikinci ad).
- **Kaynak:** Proje kararı; incelenmiş Türkçe kaynak yok. Açık karar.

### Derlem, sözlük

- **Tercih:** derlem (corpus; "eğitim metni" ve "külliyat" kullanma);
  sözlük (vocabulary; i18n.test.ts ile korunur).
- **Kaynak:** sözlük tablosu.

### Kesim

- **Tanım:** Tokenizer'ın metni ayırdığı yer (lab'daki "cut").
- **Tercih:** kesim ("kesik", "sınır" kullanma).
- **Kaynak:** Proje kararı.

---

## word-embeddings

### Embedding, word embedding

- **Tercih:** embedding / word embedding (sözlük tablosu; özgün adıyla).
  "embedding uzayı". Kelime vektörü de kullanılabilir.
- **Bağlama bağlı alternatifler:** gömme, kelime gömme (DLT). Projede kullanma; açık karar.
- **Kaynak:** sözlük tablosu; DLT ("embedding: gömme")

### Kosinüs benzerliği

- **Tanım:** İki vektör arasındaki açının kosinüsü; lab'da vektörler birim
  uzunlukta olduğu için nokta çarpımına eşittir.
- **Tercih:** kosinüs benzerliği; tablo ve göstergelerde kısaca "benzerlik".
- **Kaynak:** Proje kararı.

### İzdüşüm, açıklanan varyans, uzaklık uyumu

- **Tercih:** izdüşüm (bkz. ## pca; "projeksiyon" kullanma); açıklanan varyans;
  uzaklık uyumu (Spearman sıra korelasyonu; "mesafe" yerine "uzaklık").
- **Kaynak:** bkz. ## pca.

---

## word-embeddings-3d

Yeni kavram yok; terimler ## word-embeddings ve ## pca bölümlerindedir.
"Ödünleşim" (trade-off) proje önerisidir; incelenmiş bir kaynak yok.
