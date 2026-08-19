# Contributing / Katkıda Bulunma

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

### Getting set up

```bash
git clone https://github.com/erayendes/oduncu.git
cd oduncu
node bin/oduncu.js install --dry-run --all
```

No dependencies, no build. Node 18+.

### Project layout

| Path | Contains |
|:--|:--|
| `skills/oduncu/SKILL.md` | The entire behaviour — the four strings, the commands, the bans. The product. |
| `bin/oduncu.js` | The installer CLI: `install`, `uninstall`, `where`, `help`. |
| `assets/` | Original pixel art for the README. |

### What a good contribution looks like

- **Wording in `SKILL.md`.** The skill is a prompt; precision is the feature. If an instruction is ambiguous enough that a model drifts, tightening it is the most valuable change possible. Describe the drift you saw — which agent, what it did instead.
- **A new install target.** Another agent with a global skill directory? Add one entry to `TARGETS` in `bin/oduncu.js` and a row to the README table.
- **A new language row** for the four-strings table, following the derivation rule already in `SKILL.md`.

Keep the spirit: one skill file, one installer, no dependencies. PRs that add packages, build steps, or configuration will be asked to justify their weight.

### Before you open a PR

- `node bin/oduncu.js install --dry-run --all` still lists every target correctly.
- One concern per PR.
- `SKILL.md` changes: state which agent(s) you tested the wording against.

## Türkçe

### Kurulum

```bash
git clone https://github.com/erayendes/oduncu.git
cd oduncu
node bin/oduncu.js install --dry-run --all
```

Bağımlılık yok, build yok. Node 18+.

### Proje düzeni

| Yol | İçerik |
|:--|:--|
| `skills/oduncu/SKILL.md` | Davranışın tamamı — dört ifade, komutlar, yasaklar. Ürünün kendisi. |
| `bin/oduncu.js` | Kurulum CLI'ı: `install`, `uninstall`, `where`, `help`. |
| `assets/` | README için özgün piksel işleri. |

### İyi bir katkı neye benzer

- **`SKILL.md`'de ifade düzeltmesi.** Skill bir prompt; hassasiyet özelliğin ta kendisi. Bir talimat modelin kaymasına yetecek kadar belirsizse, onu sıkılaştırmak yapılabilecek en değerli değişiklik. Gördüğün kaymayı anlat — hangi ajan, onun yerine ne yaptı.
- **Yeni kurulum hedefi.** Global skill dizini olan başka bir ajan mı var? `bin/oduncu.js` içindeki `TARGETS`'a bir satır, README tablosuna bir satır.
- **Dört ifade tablosuna yeni dil satırı** — `SKILL.md`'deki türetme kuralına uyarak.

Ruhu koru: tek skill dosyası, tek installer, sıfır bağımlılık. Paket, build adımı veya konfigürasyon ekleyen PR'lardan ağırlığını gerekçelendirmesi istenir.

### PR açmadan önce

- `node bin/oduncu.js install --dry-run --all` tüm hedefleri hâlâ doğru listeliyor.
- PR başına tek konu.
- `SKILL.md` değişikliklerinde hangi ajan(lar)da denediğini belirt.
