# Turkish product copy

Use English for page names, lab cards, section titles, learning topics and lesson titles. Use Turkish for explanations, instructions, feedback, controls and accessibility descriptions. Mark English heading elements with `lang="en"`; the Turkish page keeps `lang="tr"`.

`src/i18n/headingPolicy.ts` lists heading fields. `node tools/content-policy.mjs --sync` copies their canonical English values into the Turkish dictionaries without loading extra English lab chunks at runtime. Heading parity is tested. New heading roles that do not follow the `title`/`heading`/`kicker` naming convention must be added explicitly. Calculator lesson titles use their existing English values directly.

Write Turkish from the interaction and the calculation, not by copying the English sentence structure. Explain what to change, what changed and why. Use direct singular instructions: “seç”, “değiştir”, “karşılaştır”. Use complete sentences with a clear subject and verb. Keep genuine mathematical conditions and source attribution.

Avoid decorative claims, repeated invitations to “discover”, literal English metaphors and unexplained jargon. Do not describe a model as understanding, wanting or blaming when a calculated value explains the behaviour. Shorten an explanation without changing its assumptions. Avoid the excluded word specified in the locale policy test, including inflections.

Terminology: gradyan, kayıp, ağırlık, eğitim/doğrulama/test verisi, doğruluk, kesinlik; token, tokenizer, BPE, hash, optimizer; cache and cache bloğu. Explain unfamiliar terms at first use. Keep `step size` and `learning rate` distinct where the calculation distinguishes them. Do not call every error metric “doğruluk”. In Diffusion, describe the allowed shapes and their probabilities before introducing “prior”.

Preserve interpolation parameters and spaces around inserted values, numeric formatting, units, formulas, citations and keyboard bindings. Do not apply blind grammatical substitutions: Turkish imperative forms can also be possessives. Check text inside the actual component, including closed optional sections, tours, source notes and canvas/SVG labels.

Review: editorial fluency first, then technical meaning; run typecheck, lint, formatting, unit and browser tests. Check EN/TR heading parity, Turkish number formats, interpolated strings and excluded vocabulary. Compare mobile and desktop views in both themes. Automated checks cannot establish natural language quality by themselves.

Research: [Microsoft Turkish Style Guide](https://aka.ms/turkish-styleguide), [Google global-audience guidance](https://developers.google.com/style/translation), [W3C language of parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html). Product-specific decisions above take precedence over a vendor's preferred tone.
