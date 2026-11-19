**Hayatını değiştiren o iki sözcük**

> — *yaparım...*
> 
> — *tamam.*

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/oduncu/main/assets/oduncu.png" alt="oduncu" width="520">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Yerli üretim](https://img.shields.io/badge/YERL%C4%B0%20%C3%9CRET%C4%B0M-red?style=flat&label=%F0%9F%A4%9D&color=red&link=https%3A%2F%2Fmilowda.com)](https://milowda.com)

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

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/oduncu/main/assets/demo-tr.gif" alt="Aynı görev, iki ajan" width="720">

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

**Köylü de bazen baş kaldırır.** Ama bir sorun, niye.

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/oduncu/main/assets/guvenlik.png" alt="güvenlik" width="440">

Bunlar stil değil, güvenlik.

- Geri alınamaz işlem (silme, force-push, deploy, ödeme)
- Yanlış şeyi geri alınamaz biçimde yapma riski taşıyan belirsizlik
- Ortaya çıkan kimlik bilgisi / güvenlik açığı
- Kullanıcının aynı isteği tekrar etmesi

Hepsi tek satır. Sonra tekrar susar. Gerisini siz bilirsiniz.

## Kurulum

```bash
npx oduncu install
```

Makinenizde bulduğu her ajana kurar. `npm i` sırasında hiçbir şey yazılmaz — ev dizinine
dokunan bir `postinstall` hook'u yok, sadece bu komut.

```bash
npx oduncu install --only claude,codex   # seçerek
npx oduncu install --all                 # bilinen tüm konumlara
npx oduncu install --dry-run             # ne olacağını göster
npx oduncu where                         # yollar ve mevcut durum
npx oduncu uninstall                     # her yerden kaldır
```

Claude Code kullanıyorsanız plugin olarak da kurulabilir:

```
/plugin marketplace add erayendes/oduncu
/plugin install oduncu@oduncu
```

Plugin olarak kurulunca oduncu açık gelir ve açık kalır: `/oduncu kalk` yazmayı hatırlamanız
gerekmez, `/oduncu yat` diyene kadar her yeni oturumda kendiliğinden açılır. `talk`, `hush` ve
`lang` da oturumdan oturuma taşınır. Durum `~/.config/oduncu/state.json` dosyasında durur.

Tek `SKILL.md`, altı konum:

| Ajan | Global skill klasörü |
|---|---|
| Claude Code | `~/.claude/skills/` |
| Codex | `~/.codex/skills/` |
| Antigravity | `~/.gemini/config/skills/` |
| Gemini CLI | `~/.gemini/skills/` |
| Cursor | `~/.cursor/skills/` |
| Agent Skills standardı | `~/.agents/skills/` |

Sadece bir proje için isterseniz `skills/oduncu/` klasörünü `.claude/skills/`,
`./.codex/skills/` veya `.agents/skills/` içine kopyalayıp commit edin.

## Kullanım

```
/oduncu kalk        # aç
/oduncu yat         # kapat
/oduncu talk        # iz aç: tamam. satırına dosya yollarını ekler
/oduncu hush        # iz kapat
/oduncu lang [dil]  # yanıt dili
/oduncu help        # komut listesi ve mevcut durum, sizin dilinizde
```

`talk` açıkken `tamam.` yerine `tamam. src/app.ts, README.md` görürsünüz; `hush` çıplak
`tamam.`'a döndürür. Ne dokunduğunu görmek isteyip paragraf okumak istemeyenler için.

`lang` yanıt dilini değiştirir — `/oduncu lang en` derseniz `yaparım...` yerine `will do...`,
`tamam.` yerine `done.` alırsınız, nesir cevaplar da İngilizceye geçer. Varsayılan ikili:
dört ifade her oturumda Türkçe, nesir sizin yazdığınız dilde. Kod ve commit mesajı hiçbirinden
etkilenmez.

## Geçmişten öğren

```bash
npx oduncu learn            # bu projenin Claude Code oturumları
npx oduncu learn --all      # tüm projeler
npx oduncu savings [--all]  # oduncu açıkken ve kapalıyken tur başına çıktı token'ı
```

`learn` geçmiş oturumlarınıza bakar: uzun yanıtları kestiğiniz, “kısa”, “çok uzun yazıyorsun”
dediğiniz yerler varsa `/oduncu kalk`, oduncu açıkken “ne yaptın?” diye sorduysanız
`/oduncu talk` önerir. Alıntılarıyla gösterir, ayarı kendisi değiştirmez; komutu siz yazarsınız.

`savings` oduncu açık ve kapalı turların çıktı token'ını karşılaştırır. İki grup farklı işler
yaptığı için sonuç **tahmini**dir; her grupta beş oturum yoksa sayı vermez.

Plugin kuruluysa ikisini de hatırlamanız gerekmez. Yeni bir oturum açılırken, haftada en fazla
bir kez, yeterli sinyal birikmişse önerisini, her grupta beş oturum varsa tahmini tasarrufu ilk
yanıtta tek satırla söyler. Veri yetmezse hiçbir şey demez.

İkisi de sadece `~/.claude/projects/` altındaki kayıtları okur. Hiçbir yere bir şey gönderilmez.

## Token tasarrufu: yaparım...

Oduncu elinden geleni yapar. Ama token tasarrufunu garanti etmez, o sadece yapar.

Kendi oturumlarınızdaki tahmini fark için: `npx oduncu savings`.

Token tasarrufu için bkz: [caveman](https://github.com/JuliusBrussee/caveman)

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

<!-- Absolute URL on purpose: npm does not rewrite relative image paths. -->
<img src="https://raw.githubusercontent.com/erayendes/oduncu/main/assets/demo-en.gif" alt="Same task, two agents" width="720">

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

On Claude Code it also installs as a plugin:

```
/plugin marketplace add erayendes/oduncu
/plugin install oduncu@oduncu
```

Installed as a plugin, oduncu starts on and stays on: no need to remember `/oduncu kalk`, it
comes up in every new session until you say `/oduncu yat`. `talk`, `hush` and `lang` carry
over between sessions too. The state lives in `~/.config/oduncu/state.json`.

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

## Learn from your history

```bash
npx oduncu learn            # this project's Claude Code sessions
npx oduncu learn --all      # every project
npx oduncu savings [--all]  # output tokens per turn, oduncu on vs off
```

`learn` reads your past sessions: if you cut long replies short or said “shorter”, “too
long”, it suggests `/oduncu kalk`; if you asked “what did you do?” while oduncu was on, it
suggests `/oduncu talk`. It shows the quotes and changes nothing; you type the command.

`savings` compares output tokens on turns with oduncu on and off. The two groups did
different work, so the number is an **estimate**, and it gives none until each group has five
sessions.

With the plugin installed you don't have to remember either. When a new session starts, at
most once a week, it brings up the suggestion if enough signals have piled up, and the
estimated savings if each group has five sessions — one line in the first reply. Without
enough data it says nothing.

Both only read the transcripts under `~/.claude/projects/`. Nothing is sent anywhere.

## Token savings: yaparım...

Oduncu does what it can. But it guarantees no token savings — it just does the work.

For an estimate from your own sessions: `npx oduncu savings`.

For token savings, see [caveman](https://github.com/JuliusBrussee/caveman).

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
