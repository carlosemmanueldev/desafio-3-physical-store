export interface CorreiosDetails {
  sedex: {
    codProductAgencia: string;
    price: string;
    deliveryTime: string;
    description: string;
  },
  pac: {
    codProductAgencia: string;
    price: string;
    deliveryTime: string;
    description: string;
  }
}

export type CorreiosResponse = [CorreiosInfo, CorreiosInfo];

export interface CorreiosInfo {
  status: number;
  mensagemPrecoAgencia: string;
  prazo: string;
  url: string;
  mensagemPrecoPPN: string;
  codProdutoAgencia: string;
  precoPPN: string;
  codProdutoPPN: string;
  mensagemPrazo: string;
  msg: string;
  precoAgencia: string;
  urlTitulo: string;
}