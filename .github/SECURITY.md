# Security / Güvenlik

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

Oduncu is a single `SKILL.md` plus a ~100-line installer. There is not much attack surface, but here is exactly what it does and does not do.

### What the installer does

- `npx oduncu install` copies `skills/oduncu/` into the skill directories of the agents it finds on your machine (`~/.claude/skills/`, `~/.codex/skills/`, and so on). Nothing else is written.
- **No `postinstall` hook.** `npm i oduncu` writes nothing to your home directory; only the explicit `install` command does.
- **No network access, no telemetry.** The code makes zero HTTP requests. It never reads, stores, or transmits credentials, keys, or file contents.
- `npx oduncu install --dry-run` shows every path it would touch before you commit to anything, and `npx oduncu uninstall` removes it everywhere.

### What the skill does

`SKILL.md` is plain instructions your agent reads. It changes how the agent talks, not what it may do — it explicitly must not edit permission settings itself, and its "first run" note only *suggests* a permission mode, scoped narrowly, for you to apply or ignore.

### Audit it yourself

The whole thing is small enough to read in one sitting: [`bin/oduncu.js`](../bin/oduncu.js) and [`skills/oduncu/SKILL.md`](../skills/oduncu/SKILL.md). Ask your own LLM: *"Does this write anywhere outside the listed skill directories? Any network calls?"*

### Reporting a vulnerability

Use [private vulnerability reporting](https://github.com/erayendes/oduncu/security/advisories/new), or mail **erayendes@gmail.com**. You will get a response within a few days.

## Türkçe

Oduncu tek bir `SKILL.md` ile ~100 satırlık bir kurulum betiğinden ibaret. Saldırı yüzeyi küçük, ama ne yapıp ne yapmadığı burada.

### Kurulum betiği ne yapar

- `npx oduncu install`, `skills/oduncu/` klasörünü makinende bulduğu ajanların skill dizinlerine (`~/.claude/skills/`, `~/.codex/skills/` vb.) kopyalar. Başka hiçbir şey yazılmaz.
- **`postinstall` hook'u yok.** `npm i oduncu` ev dizinine hiçbir şey yazmaz; yalnızca açıkça verilen `install` komutu yazar.
- **Ağ erişimi ve telemetri yok.** Kod sıfır HTTP isteği yapar. Kimlik bilgisi, anahtar veya dosya içeriği okumaz, saklamaz, iletmez.
- `npx oduncu install --dry-run` dokunacağı her yolu önceden gösterir; `npx oduncu uninstall` her yerden kaldırır.

### Skill ne yapar

`SKILL.md`, ajanının okuduğu düz talimattır. Ajanın *nasıl konuştuğunu* değiştirir, *ne yapabileceğini* değil — izin ayarlarını kendisi düzenlemesi açıkça yasaktır; "ilk çalıştırma" notu yalnızca dar kapsamlı bir izin modu *önerir*, uygulamak sana kalmış.

### Kendin denetle

Tamamı tek oturuşta okunacak kadar küçük: [`bin/oduncu.js`](../bin/oduncu.js) ve [`skills/oduncu/SKILL.md`](../skills/oduncu/SKILL.md). Kendi LLM'ine sor: *"Bu, listelenen skill dizinleri dışında bir yere yazıyor mu? Ağ çağrısı var mı?"*

### Güvenlik açığı bildirimi

[Özel güvenlik bildirimi](https://github.com/erayendes/oduncu/security/advisories/new) kullan ya da **erayendes@gmail.com** adresine yaz. Birkaç gün içinde yanıt alırsın.
