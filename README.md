# oduncu

**Hayatını değiştiren o iki sözcük**

> — *yaparım...*
> — *tamam.*

Görev verilir, “yaparım...” der, yapar. Ne yaptığını anlatmaz, **çünkü zaten yapıyordur.**
Bitirince “tamam.” der, başka tek kelime etmez. Çünkü o Age of Empires II'deki **köylüdür.**

![oduncu.png](assets/oduncu.png)

---

## Ne yapar

| Girdi | Çıktı |
|---|---|
| Görev | `yaparım...` → *(minimum sayıda tool kartı)* → `tamam.` |
| Görev başarısız | `yaparım...` → `yapamadım.` |
| Güvensiz istek | `yapamam.` + gerekçe |
| Görev + soru | `yaparım... yanıt.` → `tamam.` |
| Soru | Normal, tam cevap ama oduncu style |

Açıklama yok. Özet yok. Kod bloğu yok. İlerleme notu yok. Task listesi yok. 
“Gereksiz övgü” hiç yok.
Sadece “yaparım...”

> Tam sessizlik isteyen bilir.

---

## Ortadaki alan

Oduncu, tool çağrı kartlarını (`Bash(...)`, `Read(...)`) hiçbir skill, output style veya hook’u bastıramıyor — çünkü onları lanet olası harness çiziyor. 

Yine de mücadelesini veriyor, bastıramıyor ama azaltıyor.

- bağımsız okumalar → tek çağrı
- düzenleme + doğrulama → tek çağrı
- çok adımlı kabuk işi → tek heredoc

## Kesilmeyen tek şey doğrulama 

Test çalışır, build çalışır. Her şey **o tek kelime**nin doğru olması için.

---

## Sessizliğin bozulduğu bazı yerler

**Köylü de bazen baş kaldırır.** Ama sor bir niye. 

![guvenlik.png](assets/guvenlik.png)

Bunlar stil değil, güvenlik. 

- Geri alınamaz işlem (silme, force-push, deploy, ödeme)
- Yanlış şeyi geri alınamaz biçimde yapma riski taşıyan belirsizlik
- Ortaya çıkan kimlik bilgisi / güvenlik açığı
- Kullanıcının aynı isteği tekrar etmesi

Hepsi tek satır. Sonra tekrar susar. Gerisini sen bilirsin.

---

## Kurulum

```bash
npx oduncu install
```

Makinende bulduğu her ajana kurar. `npm i` sırasında hiçbir şey yazılmaz — ev dizinine
dokunan bir `postinstall` hook'u yok, sadece bu komut.

```bash
npx oduncu install --only claude,codex   # seçerek
npx oduncu install --all                 # bilinen tüm konumlara
npx oduncu install --dry-run             # ne olacağını göster
npx oduncu where                         # yollar ve mevcut durum
npx oduncu uninstall                     # her yerden kaldır
```

Tek `SKILL.md`, altı konum:

| Ajan | Global skill klasörü |
|---|---|
| Claude Code | `~/.claude/skills/` |
| Codex | `~/.codex/skills/` |
| Antigravity | `~/.gemini/config/skills/` |
| Gemini CLI | `~/.gemini/skills/` |
| Cursor | `~/.cursor/skills/` |
| Agent Skills standardı | `~/.agents/skills/` |

Sadece bir proje için istersen `skills/oduncu/` klasörünü `.claude/skills/`,
`./.codex/skills/` veya `.agents/skills/` içine kopyalayıp commit et.

---

## Kullanım

```
/oduncu kalk        # aç
/oduncu yat         # kapat
/oduncu talk        # iz aç: tamam. satırına dosya yollarını ekler
/oduncu hush        # iz kapat
/oduncu lang [dil]  # yanıt dili
/oduncu help        # komut listesi ve mevcut durum, senin dilinde
```

`talk` açıkken `tamam.` yerine `tamam. src/app.ts, README.md` görürsün; `hush` çıplak
`tamam.`'a döndürür. Ne dokunduğunu görmek isteyip paragraf okumak istemeyenler için.

`lang` yanıt dilini değiştirir — `/oduncu lang en` dersen `yaparım...` yerine `will do...`,
`tamam.` yerine `done.` alırsın, nesir cevaplar da İngilizceye geçer. Varsayılan ikili:
dört ifade her oturumda Türkçe, nesir senin yazdığın dilde. Kod ve commit mesajı hiçbirinden
etkilenmez.

---

## Token tasarrufu: yaparım...

Oduncu ~17% tasarruf sağlar evet, ama sandığın sebepten değil. 
Ayrıca token tasarrufunu da garanti etmez, o sadece yapar. :)

---

## Sınırlar

Sohbet dışına yazılan her şey normal: kod, commit mesajı, PR metni, dokümantasyon.
Sessizlik sohbet için, çıktı için değil.

---

## Lisans ve haklar

Kod ve dokümantasyon MIT lisansı ile — ayrıntısı [`LICENSE`](./LICENSE) dosyasında.

**Age of Empires**, Microsoft Corporation'ın tescilli markasıdır. Bu proje bağımsız ve
gayriresmî bir çalışmadır; Microsoft ile hiçbir bağlantısı yoktur, Microsoft tarafından
desteklenmemekte, onaylanmamakta veya sponsor edilmemektedir.

Depoda oyuna ait hiçbir varlık kullanılmıyor — ne görsel, ne ses, ne kod, ne metin.
`assets/` altındaki çizimler döneme öykünen özgün piksel işleridir. "Oduncu" adı ile
`yaparım` ve `tamam` sözcükleri, oyunun Türkçe dublajına yapılmış bir nostalji göndermesidir
ve yalnızca tanımlayıcı amaçla kullanılır.
