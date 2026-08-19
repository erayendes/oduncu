# Support / Destek

🇬🇧 [English](#english) · 🇹🇷 [Türkçe](#türkçe)

## English

### Getting help

- **Bug or unexpected behaviour?** Open an [issue](https://github.com/erayendes/oduncu/issues) with the agent you use (Claude Code, Codex, …), the command you ran, and what happened.
- **Security concern?** Don't open a public issue — see [SECURITY.md](SECURITY.md).
- **Question about the mode itself?** The [README](../README.md) and [`SKILL.md`](../skills/oduncu/SKILL.md) are the full specification — there is nothing else.

### Troubleshooting

| Symptom | What's going on | Fix |
|:--|:--|:--|
| `/oduncu kalk` does nothing | The skill isn't installed for that agent, or the agent hasn't reloaded its skill list. | `npx oduncu where` shows what is installed where. Install with `npx oduncu install --only claude`, then restart the session. |
| "No agent found. Nothing installed." | The installer only targets directories that already exist. | Force it: `npx oduncu install --only claude` or `npx oduncu install --all`. |
| Agent still narrates while working | Mode drift — the model slid back to explaining. | Say `/oduncu kalk` again, or complain once; the skill tells it to stay on. |
| Answers switched language unexpectedly | `/oduncu lang` was set earlier in the session. | `/oduncu lang tr` restores the default pair. |
| Permission prompts interrupt the silence | Host asks before each tool call. | Optional: see the "first run" note in `SKILL.md` — set your host's narrow allow-list mode, e.g. `permissions.defaultMode: "dontAsk"` in `.claude/settings.json`. |

### Supporting the project

Oduncu is free and open. If it makes your sessions quieter, a [coffee](https://buymeacoffee.com/erayendes) ☕ is appreciated but never expected.

## Türkçe

### Yardım almak

- **Hata veya beklenmedik davranış?** Kullandığın ajan (Claude Code, Codex, …), çalıştırdığın komut ve ne olduğuyla birlikte bir [issue](https://github.com/erayendes/oduncu/issues) aç.
- **Güvenlik endişesi?** Herkese açık issue açma — [SECURITY.md](SECURITY.md)'ye bak.
- **Modun kendisi hakkında soru?** [README](../README.md) ve [`SKILL.md`](../skills/oduncu/SKILL.md) tam spesifikasyon — başka bir şey yok.

### Sorun giderme

| Belirti | Sebep | Çözüm |
|:--|:--|:--|
| `/oduncu kalk` hiçbir şey yapmıyor | Skill o ajana kurulu değil veya ajan skill listesini yeniden yüklemedi. | `npx oduncu where` neyin nerede kurulu olduğunu gösterir. `npx oduncu install --only claude` ile kur, oturumu yeniden başlat. |
| "No agent found. Nothing installed." | Kurulum betiği yalnızca var olan dizinleri hedefler. | Zorla: `npx oduncu install --only claude` veya `npx oduncu install --all`. |
| Ajan çalışırken hâlâ anlatıyor | Mod kayması — model açıklamaya geri kaydı. | `/oduncu kalk` de veya bir kez şikâyet et; skill ona açık kalmasını söylüyor. |
| Yanıt dili beklenmedik şekilde değişti | Oturumda daha önce `/oduncu lang` verilmiş. | `/oduncu lang tr` varsayılan ikiliyi geri getirir. |
| İzin istemleri sessizliği bölüyor | Host her tool çağrısından önce soruyor. | İsteğe bağlı: `SKILL.md`'deki "first run" notuna bak — hostun dar kapsamlı allow-list modunu ayarla, ör. `.claude/settings.json` içinde `permissions.defaultMode: "dontAsk"`. |

### Projeyi desteklemek

Oduncu ücretsiz ve açık. Oturumlarını sessizleştiriyorsa bir [kahve](https://buymeacoffee.com/erayendes) ☕ makbule geçer.
