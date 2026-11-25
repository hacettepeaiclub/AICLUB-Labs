# Türkçe anlatım kuralları

Türkçe metinleri, bu konuları Türkçe kaynaklardan öğrenmiş bir eğitmen
anlatıyormuş gibi yaz. İngilizce metin kavram ve kapsam kontrolü içindir:
cümle yapısını ve benzetmelerini Türkçeye taşıma. Terimler
[tr-terminology.md](tr-terminology.md) dosyasındadır.

## Neyin dili ne

- **İngilizce kalır (iki dilde de):** lab adları ve ana sayfadaki ana slogan.
- **Türkçe olur:** diğer bütün başlıklar, açıklamalar, düğmeler, grafik
  etiketleri, ekran okuyucu metinleri (`aria-label`, duyurular), tur ve
  öğrenme rehberi metinleri.
- **Zorla Türkçeleştirme:** Yerleşik Türkçe karşılığı olmayan teknik terimler
  özgün adıyla kalır (token, attention, gradient descent). Sözlükte hangisinin
  kalacağı yazılıdır.

## Hitap

- Kullanıcıya **"sen"** diye hitap et: "değiştir", "bak", "seç".
- Bir metinde "sen" ile "siz"i karıştırma. "Değiştir" ile "değiştiriniz" /
  "değiştirin" aynı lab'da yan yana gelmez.
- Ders anlatımında birinci çoğul kişi kullanılabilir: "Hangi sonuçlarda sıfır
  hipotezini reddederiz?"

| Yapma | Yap |
| --- | --- |
| μ₁: alternatifi hareket ettirin | μ₁: gerçek ortalamayı değiştir |
| Hangi karışımıyla geldiysen gelin | n ve α'yı hangi birleşimle ayarlamış olursan ol |
| Hedefe ulaşın | Hedefe ulaş |

## Talimatlar somut olsun

Kullanıcının neyi değiştireceğini ve grafikte neye bakacağını söyle.

| Yapma | Yap |
| --- | --- |
| Örtüşmeyi keşfet. | Eğriler örtüştükçe II. tip hata olasılığının (β) nasıl değiştiğine bak. |
| Önerilen iki ortalamayı birbirinden uzaklaştır. | μ₁ kaydırıcısıyla iki ortalamayı birbirinden uzaklaştır. |

## Sadeleştir, anlamı bozma

- Bilimsel koşulları, varsayımları ve kaynak gösterimlerini koru.
- "H₀ reddedilemedi" ifadesini "H₀ doğrudur" ya da "H₀ kabul edildi" diye
  değiştirme.
- Bir olayla onun olasılığını ayır: "I. tip hata" bir olaydır, α onun
  olasılığıdır; ret bölgesi ise bir değer aralığıdır.
- Hesaplanan bir değerin açıkladığı davranışı modele niyet yükleyerek anlatma
  ("model anlıyor", "model istiyor").

## Kullanma

- **Dolgu ve övgü sözcükleri:** keşfet, yolculuk, derinlemesine, güçlü,
  benzersiz. "Güç" istatistik terimi olarak elbette kullanılır.
- **"Düzenek"** ve çekimleri (otomatik testle korunur).
- **İngilizceden geçen benzetmeler:** yanlış alarm, kol (lever), "kimsenin
  saymadığı hata". Kavramın Türkçe adını kullan.
- **Uzun çizgi (—).** Virgül, iki nokta, noktalı virgül ya da nokta kullan.

## Sayılar

- Ondalık ayırıcı virgüldür: 0,80. Lab'ın ekrana yazdığı sayılar da virgülle
  biçimlenir (hipotez testi: `components/useNumberFormat.ts`).
- Yüzde işareti başa gelir: %50.
- Ekrana yerleştirilen bir sayıdan sonra ek getirme; ses uyumu önceden
  bilinemez. `${n}'den` yerine "n = ${from} ile n = ${to} arasında";
  `${p}'i` yerine "${p} değerine".
- Sabit bir sayıdan sonra ek getirilebilir: "0,80'e ulaş".

## Gözden geçirme

1. Metni dosyada değil, grafik ve kontrollerin yanında, Türkçe sayfada oku;
   kapalı bölümleri, turu, kaynak notlarını ve grafik etiketlerini aç.
2. Önce Türkçenin doğallığına, sonra teknik anlamına bak.
3. Telefon ve masaüstü genişliğinde, iki temada kontrol et.
4. typecheck, lint, biçim, birim ve tarayıcı testlerini çalıştır.

Otomatik kontroller yalnızca kesin yasakları ve onaylanmış tutarlılık
kurallarını denetler (`src/i18n/headingPolicy.test.ts`,
`src/i18n/i18n.test.ts`, `src/i18n/trTerminology.test.ts`). Doğal Türkçenin
doğruluğu bir kelime listesiyle ölçülemez; onu okuyarak değerlendir.
