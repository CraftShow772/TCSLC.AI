const latin1Decoder = new TextDecoder("latin1", { fatal: false });
const utf8Decoder = new TextDecoder("utf-8", { fatal: false });

type PdfSource = Blob | ArrayBuffer | Uint8Array;

export async function extractPdf(source: PdfSource): Promise<string> {
  const bytes = await toUint8Array(source);
  const operatorText = extractFromOperators(bytes);

  if (operatorText) {
    return normalizeWhitespace(operatorText);
  }

  return normalizeWhitespace(fallbackDecode(bytes));
}

async function toUint8Array(source: PdfSource): Promise<Uint8Array> {
  if (source instanceof Uint8Array) {
    return source;
  }

  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source);
  }

  if (source instanceof Blob) {
    return new Uint8Array(await source.arrayBuffer());
  }

  throw new Error("Unsupported PDF source provided for extraction.");
}

function extractFromOperators(bytes: Uint8Array): string {
  const raw = latin1Decoder.decode(bytes);
  const blocks = raw.match(/BT[\s\S]*?ET/g);

  if (!blocks) {
    return "";
  }

  const segments: string[] = [];

  for (const block of blocks) {
    const matches = block.match(/\((?:\\\)|\\\(|\\\\|[^()])*?\)|<([0-9A-Fa-f\s]+)>/g);

    if (!matches) {
      continue;
    }

    for (const match of matches) {
      if (match.startsWith("<")) {
        const hex = match.slice(1, -1).replace(/\s+/g, "");
        segments.push(decodeHexString(hex));
      } else {
        const content = match.slice(1, -1);
        segments.push(unescapePdfString(content));
      }
    }
  }

  return segments.join(" ").trim();
}

function decodeHexString(hex: string): string {
  if (!hex || hex.length % 2 !== 0) {
    return "";
  }

  const values = new Uint8Array(hex.length / 2);

  for (let index = 0; index < hex.length; index += 2) {
    values[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
  }

  return utf8Decoder.decode(values);
}

function unescapePdfString(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, "\\")
    .replace(/\\([0-7]{1,3})/g, (_, octal: string) =>
      String.fromCharCode(Number.parseInt(octal, 8))
    );
}

function fallbackDecode(bytes: Uint8Array): string {
  const decoded = utf8Decoder.decode(bytes);
  return decoded
    .replace(/stream[\s\S]*?endstream/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, " ")
    .replace(/\s+/g, " ");
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s{2,}/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}
