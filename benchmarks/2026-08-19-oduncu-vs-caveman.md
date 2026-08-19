# Oduncu vs Caveman — 2026-08-19

3 kodlama görevi × kol başına taze subagent, aynı model, izole kum havuzları.
Token = ajan toplamı (düşünme dahil). n=1 per hücre — süreler gürültü taşır.

Boş ajan (0 tool çağrısı) = **33.267 token**. Bu ortamın sabit sistem-prompt tabanı.
Üç görev için 99.801; "iş tokenı" sütunu bunu düşer.

## Görevler

- **A** — `isTokenValid` negatif yaş açığını kapat (gelecekteki `issuedAt` sonsuza kadar
  geçerli sayılıyordu), testlerini yaz
- **B** — `requireAuth`'a token başına 60s/10 istek rate limit, 429, harici bağımlılık yok
- **C** — README'yi sıfırdan yaz, 6 public API'yi ve sınır davranışlarını belgele

## Sonuçlar

| Kol | A | B | C | Toplam | İş tokenı | Δ | Çağrı | Süre |
|---|---|---|---|---|---|---|---|---|
| Baseline | 45.689 | 52.186 | 43.851 | 141.726 | 41.925 | — | 22 | 322s |
| Caveman (full) | 42.346 | 47.336 | 44.032 | 133.714 | 33.913 | **−%19,1** | 17 | 172s |
| Oduncu v1 (202 satır) | 47.683 | 51.066 | 44.202 | 142.951 | 43.150 | +%2,9 | 13 | 149s |
| Oduncu v2 (155 satır) | 46.900 | 52.190 | 43.095 | 142.185 | 42.384 | +%1,1 | 14 | 154s |
| **Oduncu v3 (+caveman katmanı)** | 43.849 | 46.631 | 43.938 | **134.418** | **34.617** | **−%17,4** | **13** | **122s** |

Üç kolda da iş kalitesi eşit: testler geçiyor, A'da açık kapalı (gelecek + NaN reddediliyor,
TTL sınırı bozulmamış), B'de 429 ve sabitler yerinde, C'de 6/6 API belgelenmiş.

## Bulgular

1. **Çıktıyı kesmek token kazandırmıyor.** v1 ekrana ~6 token yazıyor (baseline ~1.300) ve
   yine de baseline'dan pahalı. Nesir toplamın %2-3'ü; sıfırlasan bile kaybolur.

2. **Talimat uzunluğu da sebep değil.** v1 → v2, 47 satır kısaltma = 766 token = %0,5.
   Gürültü. Uzunluk teorisi ölçümle çürüdü.

3. **Kazanç muhakemeyi sıkıştırmaktan geliyor.** v3 dosyayı 155'ten 182 satıra *uzattı* ve
   7.767 token kazandırdı. Eklenen tek şey caveman kurallarının iç muhakemeye,
   tool argümanlarına ve kabuk scriptlerine uygulanması.

4. **Caveman'in %19'u da aynı yerden geliyor.** 22 yerine 17 çağrı yapıyor. "Kısa konuş"
   talimatı düşünmeye sızıyor, ajan daha az deliberasyon yapıyor. Kısalan cümleler değil,
   kısalan kafa.

5. **Oduncu v3 caveman'i token'da yakalıyor (%2 fark), çağrıda ve sürede geçiyor**
   — 13 vs 17 çağrı, 122s vs 172s.

## Uyarı

Her hücrede n=1. %2'lik farklar gürültü; %17-19'luk farklar muhtemelen değil. 33k'lık taban
bu ortamın kabarık skill/tool listesinden geliyor — daha sade bir kurulumda taban küçülür ve
yüzdeler büyür.
