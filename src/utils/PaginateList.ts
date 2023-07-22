export class PaginateList<T> {

  public items: T[] = [];
  public page = -1;
  public pageSize = 0;
  public total = 0;

  constructor({
    data, page, total, pageSize
  }: { data: T[]; page: number; total: number; pageSize: number; }) {
    this.items = data;
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
  }

}