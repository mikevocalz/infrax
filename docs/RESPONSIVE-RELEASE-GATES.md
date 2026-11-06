# Shared screen responsive and foldable acceptance

The public website and private/native app share product contracts, not a claim of completed platform parity. Scope here: all 12 mounted public routes, the website drawer, and form state through resize. No deployment or database writes.

## Public web policy
Use actual viewport-segment media features and CSS environment geometry. On a segmented device the public reading/form surface uses the first usable region; its header and the same right-side drawer stay inside that region. This is deliberately **single-region public reading**, not the eventual two-pane private application. On ordinary viewports keep existing responsive layouts. Unknown browser support never invents a hinge from width/device name.

The new browser audit exercises a vertical masked hinge, horizontal masked hinge, short landscape and enlarged root text on every public route. Assert the geometry is actually emulated; unsupported APIs fail rather than silently skip. Exercise drawer focus and preserve entered form values across fold/resize. CI results, not this specification, determine whether tests passed.

## All shared feature families must pass before native release
| Family | Compact | Wide or segmented | Required verification |
|---|---|---|---|
| Header, tabs, rail | Labels fit; stable destinations | Same IDs; native right/web left rail within usable region | Back, keyboard, RTL, safe areas |
| Account/site drawer | Same content/order; independent scroll | Same drawer within trigger region, not across hinge | Focus return, Escape/Back, content retained on rotation |
| Forms and scenario composer | Single column, labels/errors, keyboard reach | Pane-aware layout, stable draft, no duplicate submit | Rotation/fold preserves identity, step, input and focus |
| Explore map/list | Accessible list and selected detail | Separate usable regions; map controls inside pane | Selected facility preserved; no content under hinge |
| Tables and comparisons | Accessible card/reflow or internal scroll | Column virtualization and frozen identifier within pane | No page-level horizontal overflow; screen-reader labels |
| Intelligence/charts | Dated sources and readable legend/list alternative | No chart labels/tooltip over hinge | Loading/empty/stale/restricted/error, large text |
| Projects/documents/reports | Focused subsections and safe download controls | List/detail plus authorized inspector | Tenant isolation, rotation, document focus |
| Operator/admin | Bounded evidence upload, real receipts | Dense review when space allows | No lost unsaved changes, explicit publication permissions |
| Dialogs/popovers | Safe keyboard and close action | Anchored within the owning usable region | Touch/keyboard, focus, reduced motion |

The native Expo/NYC-Tron shell and 60 logical route contracts in Starter Pro #28 are not 60 completed screens. Require actual host integration, measured ReservedRegions/WindowManager input, multi-pane feature composition, and physical Surface Duo/Android foldable testing. Test 320px reflow, 390px phone, 540px panel, tablet widths, split-window resizing, book/tabletop, flat, rotation, RTL, 200% text and reduced motion. Do not claim all components complete until each row has device/build evidence.

References: https://developer.android.com/develop/adaptive-apps/guides/get-started-with-adaptive-apps ; https://www.w3.org/WAI/WCAG22/Understanding/reflow.html ; https://chromedevtools.github.io/devtools-protocol/tot/Emulation/ .
