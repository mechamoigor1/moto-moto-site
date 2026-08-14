export function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatKm(km: number) {
  return `${km.toLocaleString("pt-BR")} km`;
}

const COMBINING_MARKS_START = 0x0300;
const COMBINING_MARKS_END = 0x036f;

function removeDiacritics(value: string) {
  let result = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code < COMBINING_MARKS_START || code > COMBINING_MARKS_END) {
      result += char;
    }
  }
  return result;
}

export function slugify(input: string) {
  return removeDiacritics(input.normalize("NFD"))
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildWhatsappLink(numero: string, mensagem: string) {
  const params = new URLSearchParams({ text: mensagem });
  return `https://wa.me/${numero}?${params.toString()}`;
}

export function mensagemInteresseMoto(nomeCompleto: string, preco: number) {
  return `Olá! Tenho interesse na ${nomeCompleto} por ${formatPreco(preco)}. Pode me passar mais detalhes?`;
}
