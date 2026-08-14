export type StatusMoto = "disponivel" | "reservada" | "vendida" | "oculta";

export type Marca = {
  id: string;
  nome: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
};

export type Categoria = {
  id: string;
  nome: string;
  slug: string;
  created_at: string;
};

export type MotoSpecs = {
  cor?: string;
  cilindrada?: string;
  [key: string]: string | undefined;
};

export type Imagem = {
  id: string;
  moto_id: string;
  url: string;
  ordem: number;
  alt_text: string | null;
  created_at: string;
};

export type Moto = {
  id: string;
  slug: string;
  marca_id: string;
  categoria_id: string | null;
  modelo: string;
  ano: number;
  km: number;
  preco: number;
  descricao: string | null;
  specs: MotoSpecs;
  status: StatusMoto;
  destaque: boolean;
  visualizacoes: number;
  created_at: string;
  updated_at: string;
};

export type MotoComRelacoes = Moto & {
  marca: Marca;
  categoria: Categoria | null;
  imagens: Imagem[];
};

export type Contato = {
  id: string;
  moto_id: string | null;
  nome: string;
  telefone: string;
  mensagem: string | null;
  origem: "whatsapp" | "formulario";
  created_at: string;
};

export type ProfileRole = "admin" | "editor";

export type Profile = {
  id: string;
  user_id: string;
  nome: string | null;
  role: ProfileRole;
  created_at: string;
};

export type Configuracoes = {
  id: number;
  nome_loja: string;
  whatsapp: string;
  telefone_display: string;
  endereco: string;
  cidade_estado: string;
  instagram: string;
  horario_semana: string;
  horario_sabado: string;
  maps_url: string;
  updated_at: string;
};

export type LogAuditoria = {
  id: string;
  user_id: string | null;
  acao: string;
  entidade: string;
  entidade_id: string | null;
  detalhes: Record<string, unknown> | null;
  created_at: string;
};

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      marcas: Table<Marca>;
      categorias: Table<Categoria>;
      motos: Table<Moto>;
      imagens: Table<Imagem>;
      contatos: Table<Contato>;
      profiles: Table<Profile>;
      configuracoes: Table<Configuracoes>;
      logs_auditoria: Table<LogAuditoria>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
