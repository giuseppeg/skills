// The policy of the page forbids eval. zod probes for it when the first
// schema is made, and the browser would log a blocked eval on every page. The
// libraries make schemas as they load, so this runs before boot.js.
import { z } from "zod";

z.config({ jitless: true });
