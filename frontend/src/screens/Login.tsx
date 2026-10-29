import { useEffect, useState } from "react"

import { login } from "../lib/api"
import { asset } from "../lib/asset"
import { Button } from "../components/ui/button"
import { getSiteInfo, versionLabel } from "../lib/siteInfo"
import { LANGS, getLang, setLang, type Lang } from "../lib/dir"
import { useT, t as translate } from "../lib/i18n"


const inputCls =
  "w-full rounded border border-[#1e293b] bg-[#0d1522] px-3 py-2 text-sm " +
  "text-[#f8fafc] placeholder:text-[#64748b] " +
  "focus:outline-2 focus:outline-offset-1 focus:outline-[#1ea6da]"

const DEMO_ACCOUNTS = [
  { label: "System Admin", usr: "admin@kamra.local", pwd: "KamraAdmin1!" },
  { label: "Hotel Admin (GM)", usr: "gm@kamra.local", pwd: "KamraGM1!" },
  { label: "Front Desk", usr: "frontdesk@kamra.local", pwd: "KamraDesk1!" },
  { label: "Revenue", usr: "revenue@kamra.local", pwd: "KamraRev1!" },
  { label: "Finance", usr: "finance@kamra.local", pwd: "KamraFin1!" },
  { label: "Housekeeping", usr: "hk@kamra.local", pwd: "KamraHK1!" },
]

export default function Login(props: { onSuccess: () => void }) {
  const { t, lang } = useT()
  const [usr, setUsr] = useState("")
  const [pwd, setPwd] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  // Demo accounts only exist on the seeded demo site; hide them elsewhere.
  const [demoMode, setDemoMode] = useState(false)
  const [version, setVersion] = useState<string | null>(null)
  const [langState, setLangState] = useState<Lang>(lang || getLang())

  useEffect(() => {
    setLangState(lang)
  }, [lang])

  useEffect(() => {
    getSiteInfo().then((info) => {
      setDemoMode(Boolean(info.demo_mode))
      setVersion(versionLabel(info))
    })
  }, [])

  async function submit(u = usr, p = pwd) {
    setBusy(true)
    setError(null)
    try {
      await login(u, p)
      // Navigation + the production CSRF re-boot are handled by the /login
      // route (LoginPage.onSuccess).
      sessionStorage.removeItem("kamra_session_ended")
      props.onSuccess()
    } catch {
      setError(t("Wrong email, username, or password."))
    } finally {
      setBusy(false)
    }
  }

  const sessionEnded = sessionStorage.getItem("kamra_session_ended") === "1"

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#06080c] px-4"
    >
      <div className="fixed inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#1ea6da] to-[#736cf0]" aria-hidden />
      <div className="w-full max-w-sm">
        {sessionEnded && (
          <p className="mb-4 rounded border border-amber-500/30 bg-amber-950/40 px-4 py-2.5 text-center text-sm text-amber-200">
            {t("Your session ended. Sign in to pick up where you left off.")}
          </p>
        )}
        <div className="mb-6 flex flex-col items-center gap-3">
          <img src={asset("unithos-pms-full.png")} alt="UnitHOS PMS" className="h-20 w-auto object-contain" />
          <label className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
            <span>{t("Language")}</span>
            <select
              className="rounded border border-[#1e293b] bg-[#0d1522] px-2 py-1 text-xs text-zinc-300"
              value={langState}
              onChange={(e) => {
                const next = e.target.value as Lang
                setLang(next)
                setLangState(next)
              }}
              aria-label={t("Language")}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeLabel}
                </option>
              ))}
            </select>
          </label>
        </div>

        <form
          className="space-y-3 rounded-xl border border-[#1e293b] bg-[#0d1522] p-6 shadow-xl"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-300">
              {t("Email or username")}
            </span>
            <input
              className={inputCls}
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={usr}
              onChange={(e) => setUsr(e.target.value)}
              placeholder={t("Administrator or you@hotel.com")}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-300">
              {t("Password")}
            </span>
            <input
              className={inputCls}
              type="password"
              autoComplete="current-password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </label>

          {error && (
            <div className="rounded border border-[#ffdad6] bg-[#fff8f7] px-3 py-2 text-sm text-[#93000a]">
              {translate(error)}
            </div>
          )}

          <Button
            className="w-full justify-center rounded bg-[#1E7B4F] py-2 text-white hover:bg-[#00613a] focus-visible:outline-[#1E7B4F]"
            disabled={busy || !usr || !pwd}
            type="submit"
          >
            {busy ? t("Signing in...") : t("Sign in")}
          </Button>
        </form>

        {demoMode && (
        <div className="mt-4 rounded border border-dashed border-[#bec9bf] p-4">
          <p className="mb-3 rounded bg-[#fffbeb] px-3 py-2 text-center text-xs leading-relaxed text-[#92400e]">
            {t("Shared playground, not a live hotel. Play data is wiped every night and the sample hotel is seeded again. Don't put real guests, payments or API keys here.")}
          </p>
          <p className="mb-2 text-center text-xs text-[#6f7a71]">
            {t("Demo accounts - one tap to try each role")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.usr}
                disabled={busy}
                onClick={() => submit(a.usr, a.pwd)}
                className="rounded border border-[#E2E8F0] bg-[#ffffff] px-2 py-1.5 text-xs font-medium text-[#3f4941] hover:border-[#1E7B4F] hover:text-[#00613a]"
              >
                {t(a.label)}
              </button>
            ))}
          </div>
        </div>
        )}
        {version && (
          <p className="mt-6 text-center text-[11px] text-[#64748b]">
            UnitHOS PMS v{version}
          </p>
        )}
      </div>
    </div>
  )
}
