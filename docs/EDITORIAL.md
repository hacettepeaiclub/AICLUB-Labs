# Turkish editorial notes

How the Turkish copy is written, the terms it uses, and the changes made in the
2026-10-15 editorial pass. The copy itself lives in `src/i18n/tr.ts` and
`src/i18n/labs/tr/`; this file is for whoever writes the next lab.

## Register

- **"Siz", everywhere the site speaks to the visitor.** Button labels are the
  exception and stay in the short imperative Turkish interfaces use
  ("Baştan başla", "Çalıştır"). A character inside an experiment may speak in
  its own voice: the Monty Hall host says "sen", on purpose.
- **Say what happens, not that the visitor should look.** A sentence ending
  in "…izleyin" or "…görün" usually has its real content in the clause before
  it. "Anahtar ekleyin ve yürüyüşlerin uzamasını izleyin" says more as
  "Anahtar ekledikçe boş yuva arayan yürüyüşler uzar". Two-beat titles that
  are an instruction and its consequence ("İlk kadranı çevirin. Sonuncuyu
  izleyin.") keep it.
- **No claim larger than the experiment.** "Her şey değişir" becomes "bitlerin
  yaklaşık yarısı değişir", because that is what the lab measures.
- **No em dash.** Comma, colon, semicolon or a full stop.
- **Numbers.** The percent sign goes first (%50). No suffix after an
  interpolated number, where vowel harmony cannot be known in advance: write
  `1/${odds}`, not `${odds}'de 1`; `%${p} kadarı`, not `yüzde ${p}'i`.

## Terms

| Concept | Turkish | Show the English? | Notes |
| --- | --- | --- | --- |
| hash, to hash | hash, hash'lemek | It is the term | The output is **özet** (digest). |
| digest | özet | No | |
| collision | çakışma | No | |
| avalanche effect | çığ etkisi | No | |
| token, tokenizer, BPE | token, tokenizer, BPE | They are the terms | No plural after a number: "5 token". |
| gradient descent | gradient descent | It is the term | Kept in English across the site. |
| gradient | gradyan | No | |
| learning rate, step size | adım boyu | No | The gradient-descent lab's own word. |
| loss | kayıp | No | |
| weight | ağırlık | No | |
| backpropagation | geri yayılım | No | |
| neural network | yapay sinir ağı | No | |
| neuron | nöron | No | |
| convolution, kernel | evrişim, çekirdek | No | |
| hash table, bucket, slot | hash tablosu, kova, yuva | No | |
| race condition, thread | yarış durumu, iş parçacığı | No | |
| cache locality | önbellek yerelliği | No | |
| floating point | kayan nokta | No | |
| hypothesis test, power | hipotez testi, güç | No | Type I / II: **I. tip hata**, **II. tip hata**. |
| reinforcement learning | pekiştirmeli öğrenme | No | |
| attention | attention | It is the term | |
| word embedding | word embedding | It is the term | The space is **anlam haritası** in prose. |
| corpus | derlem | No | |
| epoch | epok | No | |

## Changes in this pass

| Where | Before | After | Why |
| --- | --- | --- | --- |
| Hashing, card | Tek bir karakteri değiştirin. Her şeyin değiştiğini görün. | Tek bir karakteri değiştirin: SHA-256 özetinin bitlerinin yaklaşık yarısı değişir. | "Her şey" is not what happens or what the lab measures. |
| Hashing, section 3 | Tek bir tuş her şeyi yeniden yazıyor. | Tek bir tuş, özetin yarısını değiştiriyor. | Same. |
| Hashing, challenge | …olasılık: ${odds}'de 1. | …olasılık: 1/${odds}. | A suffix after an interpolated number cannot follow vowel harmony. |
| Hashing, challenge | İnsanların durduğu yer burası | Elle deneyenlerin durduğu yer burası | Literal translation. |
| Hashing, announcement | …özetin yüzde ${percent}'i. | …özetin %${percent} kadarı. | Suffix after a number; percent sign first. |
| Home | Kaldığın yerden devam et | Kaldığınız yerden devam edin | Register. |
| Home | Uzun anlatım yok, çevirip kaydıracağınız düğmeler var. | Uzun anlatım yerine elinizle değiştirip sonucunu hemen göreceğiniz düzenekler var. | "Çevirip kaydıracağınız düğmeler" is a literal "knobs and sliders". |
| Probability, card | Şans hakkındaki sezgine meydan okuyan… Önce tahmin edin… | Şans hakkındaki sezgilerinizi sınayan… Önce tahmininizi yapın… | Register mixed within one sentence. |
| Gradient descent, card | …adımın boyutunu nasıl belirlediğini görün. | Adım boyunu siz seçin. Yüzeyin biçimi o adımı kaldıramıyorsa yol hedefe inmek yerine dağılır. | Says what the visitor will find; uses the lab's own term. |
| Race condition, card | …zamanlayıcısı siz olun ve sayacı kendi elinizle 1'de bitirin. | …sırasını siz belirleyin. Sayaç 2 yerine 1'de kalacak sırayı bulabilir misiniz? | Puts the surprise (2 expected) in the sentence. |
| Word embeddings | Üçü de ilgili, sen hangisini beklersin? | Üçü de ilgili. Siz hangisini beklerdiniz? | Register. |
| Word embeddings 3D | Bulutu döndürmek için sürükle. | Bulutu döndürmek için sürükleyin. | Register. |
| Attention | Birini seçin ve nereye baktığını görün. | Birini seçin: dikkatini hangi kelimelere verdiği hemen belirir. | Filler ending. |
| Attention | …diğer bütün payların düştüğünü izleyin. | …diğer bütün paylar düşer, çünkü toplam hep 1. | Gives the reason, which is the lesson. |
| Backpropagation | Ağı uzatın ve sinyalin sönmesini izleyin. | Ağ uzadıkça sinyal söner. | Filler ending. |
| Hash tables | Anahtar ekleyin ve yürüyüşlerin uzamasını izleyin. | Anahtar ekledikçe boş yuva arayan yürüyüşler uzar. | Filler ending. |
| Sorting, kicker | Çalışırken izleyin | Adım adım | Filler. |
| Graph search, kicker | Düşünürken izleyin | Arama sürerken | An algorithm does not think. |

Seventeen of the eighteen lab descriptions were rewritten with the same rules
(the 3D draft's was already plain); `i18n.test.ts` keeps each under 140
characters.
