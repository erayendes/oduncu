**Hayatını değiştiren o iki sözcük**

> — *yaparım...*
> 
> — *tamam.*

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/oduncu/main/assets/oduncu.png" alt="oduncu" width="520">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Yerli üretim](https://img.shields.io/badge/%F0%9F%A4%9D-YERL%C4%B0%20%C3%9CRET%C4%B0M-red)](https://github.com/erayendes)

🇹🇷 [Türkçe](#oduncu) · 🇬🇧 [English](#english)

---

# oduncu

Görev verilir, “yaparım...” der, yapar. Ne yaptığını anlatmaz, **çünkü zaten yapıyordur.**
Bitirince “tamam.” der, başka tek kelime etmez. Çünkü o Age of Empires II'deki **köylüdür.**

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

## Bir örnek

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/oduncu/main/assets/demo-tr.gif" alt="Aynı görev, iki ajan" width="720">

**Oduncu'dan Önce**

> **Kullanıcı:** "MIL-241 maddesini yap."
>
> **Ajan:** "Elbette, MIL-241 maddesini ele alalım! Öncelikle bu maddenin bağlamını netleştirmek isterim — widget'taki 'çalışmıyor' hatasının kök nedenini anlamak için birkaç farklı açıdan yaklaşmamız gerekiyor.
>
> İlk olarak widget'ın veri kaynağı katmanını inceleyelim. WidgetKit mimarisinde timeline provider'ın `getTimeline` fonksiyonu belirli aralıklarla çağrılıyor ve her çağrıda bir sonraki refresh zamanını Apple'a bildiriyor. Eğer bu fonksiyon içinde network çağrısı senkron değil de asenkron yapılıyorsa ve timeout süresi WidgetKit'in izin verdiği bütçeyi aşıyorsa, sistem widget'ı sessizce eski state'te donduruyor — kullanıcıya hiçbir hata göstermeden. Bu da "çalışmıyor" şikayetinin en olası adaylarından biri.
>
> İkinci olasılık olarak render döngüsündeki state senkronizasyon sorunlarına bakalım. SwiftUI tabanlı widget'larda `@AppStorage` veya `UserDefaults(suiteName:)` üzerinden App Group'la ana uygulamayla veri paylaşılıyor. Eğer ana uygulama widget'ı yeniden yüklemesi gerektiğinde `WidgetCenter.shared.reloadTimelines` çağrısını unutmuşsa, widget eski veriyi göstermeye devam eder — bu da kullanıcı gözünde "çalışmıyor" olarak algılanır ama aslında bir reload tetikleme eksikliğidir.
>
> Üçüncü olarak, iOS'un WidgetKit timeline mekanizmasının burada nasıl bir rol oynayabileceğini değerlendirelim. Sistem, pil optimizasyonu amacıyla widget refresh bütçesini günlük olarak kısıtlıyor; bir uygulama çok sık reload isterse iOS bunu "throttle" edip bazı refresh isteklerini sessizce yok sayabiliyor. Bu senaryoda hata kullanıcı cihazına, kullanım alışkanlığına ve sistem kaynak durumuna göre değişkenlik gösterebilir, ki bu da support taraflı raporlarda tutarsız tekrar oranı görülmesini açıklar.
>
> Ayrıca bu tür hataların genelde memory pressure altında tetiklendiğini de göz önünde bulundurmalıyız. Widget extension'lar çok kısıtlı bir memory limitine sahip (yaklaşık 30MB civarı); eğer timeline entry içine gömülen görsel varlıklar (icon, arka plan resmi vb.) sıkıştırılmadan yükleniyorsa, sistem extension'ı OOM (out of memory) sebebiyle sonlandırabiliyor ve bu durumda widget en son başarılı state'te donuk kalıyor.
>
> Bir diğer ihtimal de cache invalidation tarafında. Eğer widget local bir cache katmanından (örneğin CoreData ya da basit bir JSON dosyası) besleniyorsa ve bu cache'in geçerlilik süresi (staleness threshold) yanlış hesaplanmışsa, sistem 'yeni veri var' sinyalini asla üretmeyip hep eski timeline'ı sunmaya devam edebilir. Bu, kullanıcı tarafında 'widget güncellenmiyor / çalışmıyor' şikayeti olarak raporlanan en sinsi senaryolardan biridir çünkü hata mesajı üretmez, sadece sessizce donar.
>
> Tüm bu olası nedenleri değerlendirdikten sonra, MIL-241 kapsamında önerilen düzeltme adımları şu şekilde sıralanabilir: (1) timeline provider'daki cache staleness kontrolünü gözden geçirmek, (2) reload tetikleme noktalarını App Group senkronizasyonuna bağlamak, (3) memory footprint'i azaltmak için görsel varlıkları optimize etmek, (4) throttle senaryolarını loglayarak gelecekte teşhisi kolaylaştırmak.
>
> Şimdi bu analiz ışığında düzeltmeye geçelim..."

**Oduncu'dan Sonra**

> **Kullanıcı:** "MIL-241 maddesini yap."
>
> **Ajan:** yaparım...
>
> **Ajan:** tamam.

## Ortadaki alan

Oduncu, tool çağrı kartlarını (`Bash(...)`, `Read(...)`) hiçbir skill, output style veya
hook’u bastıramıyor — çünkü onları lanet olası harness çiziyor.

Yine de mücadelesini veriyor, bastıramıyor ama azaltıyor.

- bağımsız okumalar → tek çağrı
- düzenleme + doğrulama → tek çağrı
- çok adımlı kabuk işi → tek heredoc

## Kesilmeyen tek şey doğrulama

Test çalışır, build çalışır. Her şey **o tek kelime**nin doğru olması için.

## Sessizliğin bozulduğu bazı yerler

**Köylü de bazen baş kaldırır.** Ama sor bir niye.

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/oduncu/main/assets/guvenlik.png" alt="güvenlik" width="440">

Bunlar stil değil, güvenlik.

- Geri alınamaz işlem (silme, force-push, deploy, ödeme)
- Yanlış şeyi geri alınamaz biçimde yapma riski taşıyan belirsizlik
- Ortaya çıkan kimlik bilgisi / güvenlik açığı
- Kullanıcının aynı isteği tekrar etmesi

Hepsi tek satır. Sonra tekrar susar. Gerisini sen bilirsin.

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

## Token tasarrufu: yaparım...

Oduncu ~17% tasarruf sağlar evet, ama sandığın sebepten değil.
Ayrıca token tasarrufunu da garanti etmez, o sadece yapar. :)

## Sınırlar

Sohbet dışına yazılan her şey normal: kod, commit mesajı, PR metni, dokümantasyon.
Sessizlik sohbet için, çıktı için değil.

---

# English

Give it a task, it says “yaparım...” — *I'll do it* — and does it. It never tells you what it
is doing, **because it is already doing it.** When it's finished it says “tamam.” — *done* —
and not one word more. Because it is the **villager** from Age of Empires II.

## What it does

| Input | Output |
|---|---|
| Task | `yaparım...` → *(fewest possible tool cards)* → `tamam.` |
| Task failed | `yaparım...` → `yapamadım.` |
| Unsafe request | `yapamam.` + the reason |
| Task + question | `yaparım... answer.` → `tamam.` |
| Question | A normal, complete answer — in oduncu style |

No explanation. No summary. No code block. No progress note. No task list.
No “great question!” — ever.
Just “yaparım...”

> If you want real silence, you already know.

## An example

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/oduncu/main/assets/demo-en.gif" alt="Same task, two agents" width="720">

**Before oduncu**

> **User:** "Do MIL-241."
>
> **Agent:** "Certainly, let's tackle MIL-241! First I'd like to clarify the context of this ticket — to understand the root cause of the widget's 'not working' bug we need to approach it from several different angles.
>
> Let's start by examining the widget's data source layer. In the WidgetKit architecture the timeline provider's `getTimeline` function is called at intervals, and on each call it reports the next refresh time back to Apple. If the network call inside that function is made asynchronously rather than synchronously, and the timeout exceeds the budget WidgetKit allows, the system silently freezes the widget in its old state — without showing the user any error at all. That makes it one of the likeliest candidates behind the "not working" complaint.
>
> As a second possibility, let's look at state synchronisation issues in the render loop. In SwiftUI-based widgets, data is shared with the host app through an App Group via `@AppStorage` or `UserDefaults(suiteName:)`. If the host app forgot to call `WidgetCenter.shared.reloadTimelines` when the widget needed reloading, the widget keeps showing stale data — which the user perceives as "not working" when in reality it is a missing reload trigger.
>
> Third, let's evaluate what role the iOS WidgetKit timeline mechanism might be playing here. For battery optimisation the system caps the daily widget refresh budget; if an app requests reloads too frequently, iOS throttles it and can silently discard some refresh requests. In that scenario the bug varies by device, by usage habits and by system resource pressure, which would explain the inconsistent reproduction rate seen in support reports.
>
> We should also bear in mind that bugs of this kind are typically triggered under memory pressure. Widget extensions have a very tight memory limit (roughly 30MB); if the visual assets embedded in a timeline entry (icons, background images and so on) are loaded uncompressed, the system may terminate the extension for OOM (out of memory), leaving the widget frozen at its last successful state.
>
> Another possibility lies on the cache invalidation side. If the widget is fed from a local cache layer (CoreData, say, or a simple JSON file) and that cache's staleness threshold is miscalculated, the system may never produce a 'new data available' signal and keep serving the old timeline forever. This is one of the most insidious scenarios reported as 'the widget doesn't update / doesn't work', because it produces no error message — it simply freezes in silence.
>
> Having weighed all of these possible causes, the remediation steps proposed under MIL-241 can be listed as follows: (1) review the cache staleness check in the timeline provider, (2) tie the reload trigger points to App Group synchronisation, (3) optimise the visual assets to reduce the memory footprint, (4) log the throttle scenarios to make future diagnosis easier.
>
> Now, in light of this analysis, let's move on to the fix..."

**After oduncu**

> **User:** "Do MIL-241."
>
> **Agent:** yaparım...
>
> **Agent:** tamam.

## The middle ground

Oduncu cannot suppress the tool call cards (`Bash(...)`, `Read(...)`) — no skill, output
style or hook can, because the damned harness draws them.

It fights anyway. It can't silence them, but it thins them out.

- independent reads → one call
- edit + verification → one call
- multi-step shell work → one heredoc

## The one thing never cut: verification

Tests run, builds run. All of it so that **that single word** is true.

## Where the silence breaks

**Even the villager talks back sometimes.** But ask him why first.

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/oduncu/main/assets/guvenlik.png" alt="güvenlik" width="440">

<sub>*The sign reads: **WARNING!** Do not start work without taking safety precautions — Safety first.*</sub>

These aren't style, they're safety.

- Irreversible operations (delete, force-push, deploy, payment)
- Ambiguity that risks doing the wrong thing irreversibly
- A credential or security hole discovered mid-task
- You repeating the same request

One line each. Then it goes quiet again. The rest is up to you.

## Install

```bash
npx oduncu install
```

Installs into every agent it finds on your machine. `npm i` writes nothing — there is no
`postinstall` hook touching your home directory, only this command.

```bash
npx oduncu install --only claude,codex   # pick them
npx oduncu install --all                 # every known location
npx oduncu install --dry-run             # show what would happen
npx oduncu where                         # paths and current state
npx oduncu uninstall                     # remove it everywhere
```

One `SKILL.md`, six locations:

| Agent | Global skill directory |
|---|---|
| Claude Code | `~/.claude/skills/` |
| Codex | `~/.codex/skills/` |
| Antigravity | `~/.gemini/config/skills/` |
| Gemini CLI | `~/.gemini/skills/` |
| Cursor | `~/.cursor/skills/` |
| Agent Skills standard | `~/.agents/skills/` |

For a single project instead, copy the `skills/oduncu/` directory into `.claude/skills/`,
`./.codex/skills/` or `.agents/skills/` and commit it.

## Usage

```
/oduncu kalk        # on
/oduncu yat         # off
/oduncu talk        # trace on: appends file paths to the tamam. line
/oduncu hush        # trace off
/oduncu lang [code] # answer language
/oduncu help        # command list and current state, in your language
```

With `talk` on you get `tamam. src/app.ts, README.md` instead of a bare `tamam.`; `hush`
brings the bare line back. For people who want to see what was touched without reading a
paragraph about it.

`lang` changes the answer language — `/oduncu lang en` gives you `will do...` instead of
`yaparım...`, `done.` instead of `tamam.`, and prose answers in English. The default pair:
the four strings are Turkish in every session, prose follows whatever language you write in.
Code and commit messages are untouched by either.

## Token savings: yaparım...

Oduncu saves around 17%, yes — but not for the reason you think.
It also doesn't guarantee any savings. It just does the work. :)

## Boundaries

Everything written outside the chat stays normal: code, commit messages, PR text,
documentation. The silence is for the conversation, not for the output.

## License and rights

Code and documentation are MIT licensed — details in [`LICENSE`](./LICENSE).

**Age of Empires** is a registered trademark of Microsoft Corporation. This project is
independent and unofficial; it has no connection to Microsoft and is not endorsed, approved
or sponsored by Microsoft.

No assets from the game are used in this repository — no images, no audio, no code, no text.
The drawings under `assets/` are original pixel work in the spirit of the era. The name
“Oduncu” and the words `yaparım` and `tamam` are a nostalgic reference to the game's Turkish
dub, used descriptively only.
