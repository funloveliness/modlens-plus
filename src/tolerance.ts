// Structural tolerance for vision results: repair the common minor omissions
// weaker models leave behind, and degrade a result that still fails the
// strict schema into usable loose evidence instead of failing the read. The
// analyzer applies this after every provider, so any model behind any
// openai-compatible endpoint stays usable; the uncertainty list tells the
// caller which evidence fields were not reliably structured.

export const REGION_TYPES = [
    'title',
    'subtitle',
    'paragraph',
    'list',
    'table',
    'chart',
    'form',
    'code',
    'image',
    'icon',
    'other',
];

/**
 * Repair the minor omissions weaker models (qwen-family included) leave in an
 * otherwise usable result: missing region type/order, line language, empty
 * text fields, non-array containers. The repaired value still has to pass
 * the strict schema check; anything this cannot fix falls through to
 * {@link degradeVisionResult}.
 */
export function repairVisionResult(result: Record<string, unknown>): Record<string, unknown> {
    const repaired: Record<string, unknown> = { ...result };

    const ocr = repaired.ocr as Record<string, unknown> | undefined;
    if (typeof ocr === 'object' && ocr !== null) {
        const lines = Array.isArray(ocr.lines)
            ? ocr.lines
                  .filter(
                      (line): line is Record<string, unknown> =>
                          typeof line === 'object' &&
                          line !== null &&
                          typeof line.text === 'string',
                  )
                  .map((line) => ({
                      text: line.text as string,
                      language: typeof line.language === 'string' ? line.language : 'unknown',
                  }))
            : [];
        repaired.ocr = {
            full_text:
                typeof ocr.full_text === 'string'
                    ? ocr.full_text
                    : lines.map((line) => line.text).join('\n'),
            lines,
        };
    }

    const layout = repaired.layout as Record<string, unknown> | undefined;
    if (typeof layout === 'object' && layout !== null) {
        const regions = Array.isArray(layout.regions)
            ? layout.regions
                  .filter(
                      (region): region is Record<string, unknown> =>
                          typeof region === 'object' && region !== null,
                  )
                  .map((region, index) => ({
                      type:
                          typeof region.type === 'string' && REGION_TYPES.includes(region.type)
                              ? region.type
                              : 'other',
                      reading_order:
                          typeof region.reading_order === 'number' &&
                          Number.isFinite(region.reading_order)
                              ? region.reading_order
                              : index + 1,
                      text: typeof region.text === 'string' ? region.text : '',
                  }))
            : [];
        repaired.layout = { regions };
    }

    const semantics = repaired.semantics as Record<string, unknown> | undefined;
    if (typeof semantics === 'object' && semantics !== null) {
        const entities = Array.isArray(semantics.entities)
            ? semantics.entities
                  .filter(
                      (entity): entity is Record<string, unknown> =>
                          typeof entity === 'object' &&
                          entity !== null &&
                          typeof entity.name === 'string',
                  )
                  .map((entity) => ({
                      name: entity.name as string,
                      type: typeof entity.type === 'string' ? entity.type : 'entity',
                  }))
            : [];
        const relations = Array.isArray(semantics.relations)
            ? semantics.relations.filter(
                  (relation): relation is Record<string, unknown> =>
                      typeof relation === 'object' &&
                      relation !== null &&
                      typeof relation.subject === 'string' &&
                      typeof relation.predicate === 'string' &&
                      typeof relation.object === 'string',
              )
            : [];
        repaired.semantics = {
            scene: typeof semantics.scene === 'string' ? semantics.scene : '',
            intent: typeof semantics.intent === 'string' ? semantics.intent : '',
            entities,
            relations,
        };
    }

    const visual = repaired.visual as Record<string, unknown> | undefined;
    if (typeof visual === 'object' && visual !== null) {
        repaired.visual = {
            dominant_colors: Array.isArray(visual.dominant_colors) ? visual.dominant_colors : [],
            style: typeof visual.style === 'string' ? visual.style : '',
            notes: Array.isArray(visual.notes) ? visual.notes : [],
        };
    }

    if (!Array.isArray(repaired.uncertainty)) {
        repaired.uncertainty = [];
    }
    return repaired;
}

/**
 * Degrade a structurally incomplete result into usable loose evidence instead
 * of failing the whole read: every model should be able to produce *something*,
 * and recovering what it did produce beats an error. The uncertainty list
 * tells the caller which evidence fields were not reliably structured.
 */
export function degradeVisionResult(
    result: Record<string, unknown>,
    missing: readonly string[],
): Record<string, unknown> {
    const ocr = result.ocr as Record<string, unknown> | undefined;
    const lines = Array.isArray(ocr?.lines) ? ocr.lines : [];
    const fullText =
        typeof ocr?.full_text === 'string'
            ? ocr.full_text
            : lines
                  .filter(
                      (line): line is Record<string, unknown> =>
                          typeof line === 'object' &&
                          line !== null &&
                          typeof line.text === 'string',
                  )
                  .map((line) => line.text as string)
                  .join('\n');
    const layout = result.layout as Record<string, unknown> | undefined;
    const semantics = result.semantics as Record<string, unknown> | undefined;
    const visual = result.visual as Record<string, unknown> | undefined;
    return {
        summary:
            typeof result.summary === 'string'
                ? result.summary
                : fullText.length > 0
                  ? fullText.slice(0, 300)
                  : 'Vision result (partially structured).',
        ocr: { full_text: fullText, lines },
        layout: { regions: Array.isArray(layout?.regions) ? layout.regions : [] },
        semantics: {
            scene: typeof semantics?.scene === 'string' ? semantics.scene : '',
            intent: typeof semantics?.intent === 'string' ? semantics.intent : '',
            entities: Array.isArray(semantics?.entities) ? semantics.entities : [],
            relations: Array.isArray(semantics?.relations) ? semantics.relations : [],
        },
        visual: {
            dominant_colors: Array.isArray(visual?.dominant_colors) ? visual.dominant_colors : [],
            style: typeof visual?.style === 'string' ? visual.style : '',
            notes: Array.isArray(visual?.notes) ? visual.notes : [],
        },
        uncertainty: [
            ...(Array.isArray(result.uncertainty) ? result.uncertainty : []),
            `The vision model returned partially structured output (missing: ${missing.join(', ')}); evidence was recovered as-is.`,
        ],
    };
}
