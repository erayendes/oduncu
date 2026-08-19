# oduncu

Age of Empires II'nin Türkçe dublajındaki köylüden alıntı. Görev verilir, "yaparım" der, işi
yapar, "tamam" der. Arada tek kelime etmez.

## Ne yapar

| Girdi | Çıktı |
|---|---|
| Görev | `yaparım...` → *(minimum sayıda tool kartı)* → `tamam.` |
| Görev başarısız | `yaparım...` → `yapamadım.` |
| Güvensiz istek | `yapamam.` + gerekçe |
| Görev + soru | `yaparım... bu arada şudur budur.` → `tamam.` |
| Soru | Normal, tam cevap |

Açıklama yok, özet yok, kod bloğu yok, ilerleme notu yok, task listesi yok.

## Ortadaki alan

Tool çağrı kartlarını (`Bash(...)`, `Read(...)`) hiçbir skill, output style veya hook
bastıramıyor — onları harness çiziyor. Bastırılamadığına göre azaltılıyor: bağımsız okumalar
tek çağrıda, düzenleme ve doğrulaması tek çağrıda, çok adımlı kabuk işi tek heredoc'ta.

Subagent'a delege etmek kart sayısını bire indiriyor ama ölçüldü: tek satırlık değişiklikte
bile ~35k token, inline maliyetin ~25 katı. Tek kart için ödenmez. Sadece ana konuşmayı
boğacak kadar geniş taramalarda delege ediyor.

Claude Code'da `/focus` kartları tek satıra indiriyor, `-p` print modu hiç basmıyor.

## Kurulum

Aynı `SKILL.md`, dört araç. Sadece klasör değişiyor:

| Araç | Global | Proje |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex | `~/.codex/skills/` | `./.codex/skills/` |
| Antigravity | `~/.gemini/config/skills/` | `.agents/skills/` |
| Gemini CLI | `~/.gemini/skills/` | — |
| Cursor | `~/.cursor/skills/` | — |
| Standart | `~/.agents/skills/` | — |

Tek kurulum:

```bash
mkdir -p ~/.claude/skills/oduncu
unzip -o oduncu.skill -d ~/.claude/skills/oduncu
```

Dört kopya yerine tek kaynak + symlink — bir yerde düzeltirsin, hepsi alır:

```bash
mkdir -p ~/.agents/skills/oduncu
unzip -o oduncu.skill -d ~/.agents/skills/oduncu
for d in ~/.claude/skills ~/.codex/skills ~/.gemini/config/skills ~/.cursor/skills; do
  mkdir -p "$d" && ln -sfn ~/.agents/skills/oduncu "$d/oduncu"
done
```

**Cowork / Claude uygulaması:** sohbete düşen `.skill` kartında kaydetme seçeneği çıkabilir
(organizasyon ayarına bağlı). Hesabına eklenenler oturum başında `~/.claude/skills/synced/`
altına iner.

**Doğrulama:** Claude Code'da `/context` veya `/doctor`; Antigravity'de Settings →
Customizations → Skills.

**İzinler:** skill ilk açılışta kullandığın aracın izin ayarını öneriyor — Claude Code'da
`dontAsk`, Codex'te `--ask-for-approval never`, Antigravity'de auto-approve. Her yerde kuralı
aynı: izin listesinde olmayanı *reddeden* ayarı seç, *onaylayanı* değil.

## Her zaman açık

`~/.claude/CLAUDE.md` dosyasına tek satır:

```
Oduncu modu her oturumda açık başlar. /oduncu yat denene kadar aktif.
```

Proje bazında istersen aynı satır `.claude/CLAUDE.md` içine. Skill, izin ayarı zaten
yapılmışsa ilk çalıştırma bloğunu atlar — yani her yeni oturumda tekrar sormaz.

## Sessizliğin bozulduğu yerler

Bunlar stil değil, güvenlik:

- İstenmemiş geri alınamaz işlem (silme, force-push, deploy, ödeme)
- Yanlış şeyi geri alınamaz biçimde yapma riski taşıyan belirsizlik
- Ortaya çıkan kimlik bilgisi / güvenlik açığı
- Kullanıcının aynı isteği tekrar etmesi

Hepsi tek satır. Sonra tekrar susar.

## Kullanım

```
/oduncu kalk         # aç
/oduncu yat          # kapat
/oduncu talk         # iz aç: tamam. satırına dosya yollarını ekler
/oduncu hush         # iz kapat: çıplak tamam.
/oduncu lang en      # hangi dilde yanıt döneceği (varsayılan: dört string tr, nesir senin dilin)
/oduncu help         # komut listesi ve mevcut durum, senin dilinde
```

İlk açılışta izin sorularını kapatman için `dontAsk` + izin listesi öneriyor. Kabul etmezsen
yine çalışır, sadece onay kutuları sessizliği böler.

## Sınırlar

Sohbet dışına yazılan her şey normal: kod, commit mesajı, PR metni, dokümantasyon.
