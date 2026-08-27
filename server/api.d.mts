import type { IncomingMessage, ServerResponse } from 'node:http'

/** Handles /api/* requests. Resolves false if the URL is not ours. */
export declare function handleApi(req: IncomingMessage, res: ServerResponse): Promise<boolean>
