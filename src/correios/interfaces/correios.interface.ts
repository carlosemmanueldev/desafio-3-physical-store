export interface CorreiosDetails {
  sedex: {
    price: string;
    deliveryTime: string;
  },
  pac: {
    price: string;
    deliveryTime: string;
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