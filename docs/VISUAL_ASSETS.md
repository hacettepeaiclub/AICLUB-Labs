# Visual assets and libraries

An internal record of every external visual resource the site uses, and of
the ones that were looked at and turned down. Nothing here is shown in the
interface. Licences were read from each repository on 2026-10-06.

## In use

| Resource | Repository | Licence | What is used | Where |
| --- | --- | --- | --- | --- |
| Phosphor Icons (React) | https://github.com/phosphor-icons/react | MIT | `BookOpenText` (DOI), `LinkSimple` (other links) | Sources list |
| ScienceIcons (React) | https://github.com/continuous-foundation/scienceicons | MIT | `ArxivIcon` (24 px solid) | Sources list, beside arXiv links |

Both are used only to mark what kind of source a citation is. Every drawing
of a lab's own structure (`LabSignature.tsx`, `LabPlate.tsx`) is the site's
own SVG.

## Considered and not used

| Resource | Licence | Why not |
| --- | --- | --- |
| SciSVG (https://github.com/SaveenaSolanki/SciSVG) | MIT code, CC BY 4.0 artwork | Biology, chemistry, medicine and lab equipment. Its one machine-learning drawing is a generic layered network with fixed colours; every lab here already draws its own network from its own model. |
| Scicons (https://github.com/Science-icons/Scicons) | None stated | No licence, so it cannot be redistributed. Unmaintained since 2020. |
| React Bits (https://github.com/DavidHDev/react-bits) | MIT + Commons Clause | Animated showcase components (glows, particles, text effects): the aesthetic this pass removes. |
| Lucide (https://github.com/lucide-icons/lucide) | ISC (with MIT parts) | Does the same job as Phosphor; one icon family is enough. |
| Three.js / React Three Fiber | MIT | No figure on the site needs 3D; the one 3D view is a draft lab that already has its own renderer. |
| Observable Plot, d3-contour | ISC | Tried for a computed home-page figure; that figure was dropped. |
| Rough.js | MIT | A hand-drawn look reads as playful, not as a laboratory. |
| p5.js | LGPL-2.1 | Heavy, and copyleft; nothing here needs a sketching runtime. |
